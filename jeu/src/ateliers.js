/* Ateliers illustrés : dessin vectoriel original, strictement de présentation.
 * Les objets et effets utilisent exclusivement l'état fourni par jeu.js.
 * Aucun accès au moteur, aux commandes ou au stockage du joueur.
 */
(function () {
  'use strict';
  const W = 768, H = 512, ink = '#3b2a1e';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, Number(v) || 0));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const backgrounds = new Map();
  function path(c, d, fill, stroke = ink, width = 4) {
    const p = new Path2D(d); if (fill) { c.fillStyle = fill; c.fill(p); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(p); }
  }
  function ellipse(c, x, y, rx, ry, fill, stroke = ink, width = 4) {
    c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    if (fill) { c.fillStyle = fill; c.fill(); }
    if (stroke) { c.strokeStyle = stroke; c.lineWidth = width; c.stroke(); }
  }
  function box(c,x,y,w,h,fill,r=8,stroke=ink,width=4) {
    c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();
    if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}
  }
  function text(c,txt,x,y,size=20,color=ink,align='left') {c.font=`600 ${size}px system-ui, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(txt,x,y)}
  function metal(c,x,w,steel=false) {const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,steel?'#718b91':'#9b4e2a');g.addColorStop(.17,steel?'#d8e4df':'#f9c27b');g.addColorStop(.38,steel?'#f2f6e9':'#eaa258');g.addColorStop(.74,steel?'#a2b6b4':'#c77a3c');g.addColorStop(1,steel?'#59777e':'#8d4728');return g}
  function pipe(c,d,steel=false,width=12) {path(c,d,null,ink,width+5);path(c,d,null,steel?'#a8bfbd':'#d5904b',width);path(c,d,null,steel?'#e3e9d9':'#f3bd72',3)}
  function valve(c,x,y,open,color='#ad4331') {
    c.save();c.translate(x,y);c.rotate(clamp(open)*Math.PI/2);
    ellipse(c,0,0,15,15,color);path(c,'M-12 0H12M0 -12V12',null,'#efcf94',3);ellipse(c,0,0,4,4,ink,null);c.restore();
    ellipse(c,x+24,y,4,4,open>.05?'#83b94b':'#713e34',null);
  }
  function gauge(c,x,y,value,max=3){
    ellipse(c,x,y,23,23,'#faf1d5');for(let i=0;i<7;i++){const a=(.8+i/6*1.4)*Math.PI;path(c,`M${x+Math.cos(a)*16} ${y+Math.sin(a)*16}L${x+Math.cos(a)*19} ${y+Math.sin(a)*19}`,null,ink,2)}
    const a=(.8+clamp(value/max)*1.4)*Math.PI;path(c,`M${x} ${y}l${Math.cos(a)*17} ${Math.sin(a)*17}`,null,'#a94631',3);ellipse(c,x,y,3,3,ink,null);
  }
  function steam(c,x,y,t,heat,width=120) {
    if(heat<=.02)return;
    for(let i=0;i<5;i++){const p=reduced()?.35:(t*.25+i*.2)%1;c.save();c.globalAlpha=(1-p)*clamp(heat)*.55;
      const dx=x+(i-2)*width/5+Math.sin(p*5+i)*10,dy=y-p*85;
      path(c,`M${dx} ${dy}q-18 -12 0 -26q16 -12 0 -28`,null,'#fff6dc',9+9*p);c.restore();}
  }
  function flame(c,x,y,t,heat,w=100){
    box(c,x-w/2,y-22,w,36,'#30271e',12);
    for(let i=0;i<7;i++){const xx=x-w*.38+i*w*.12,h=clamp(heat)*((reduced()?1:Math.sin(t*7+i)*.16+1)*30+8*(i%3));
      if(h>1){path(c,`M${xx-8} ${y}Q${xx-14} ${y-h*.6} ${xx} ${y-h}Q${xx+18} ${y-h*.4} ${xx+8} ${y}Z`,'#dd6740',null);path(c,`M${xx-4} ${y}Q${xx-8} ${y-h*.3} ${xx} ${y-h*.6}Q${xx+8} ${y-h*.2} ${xx+5} ${y}Z`,'#ffd16c',null);}}
    path(c,`M${x-w*.4} ${y+6}h${w*.8}`,null,'#8f603d',8);
  }
  function sack(c,x,y){path(c,`M${x+10} ${y}q20 8 44 0l-6 20q25 60 4 74q-28 12 -60 0q-15 -17 11 -75Z`,'#e3c687');path(c,`M${x+10} ${y+19}q20 9 39 0`,null,'#84633d',5);path(c,`M${x+10} ${y+75}q15 -10 28 0M${x+24} ${y+80}v-36m0 20l-8 -7m8 -3l8 -7`,null,'#ad7d48',3)}
  function hops(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);path(c,'M0 18Q-21 4 -12 -10Q0 -24 12 -10Q21 4 0 18Z','#9cc94a');path(c,'M0 -14V12M0 -3L-9 -8M0 6L9 0',null,'#547337',2);c.restore()}
  function room(c,kind){
    let bg=backgrounds.get(kind);if(bg){c.drawImage(bg,0,0,W,H);return}
    bg=document.createElement('canvas');bg.width=W;bg.height=H;const b=bg.getContext('2d');
    b.fillStyle='#d4bd8c';b.fillRect(0,0,W,H);
    for(let row=0;row<7;row++)for(let col=-1;col<8;col++){const x=col*121+(row%2)*60,y=row*53;box(b,x+3,y+2,115,47,['#e7d6ad','#decca1','#d8c394'][(row+col+9)%3],5,'#c3ac80',2);path(b,`M${x+12} ${y+9}h70`,null,'#eee0bd',2)}
    path(b,'M0 357L768 335V512H0Z','#a98056');for(let i=0;i<9;i++)path(b,`M${i*110-100} 512L${i*80} 350`,null,'#8c6749',2);for(const y of [389,440,498])path(b,`M0 ${y}L768 ${y-16}`,null,'#8c6749',2);
    box(b,0,4,W,20,'#755039',2);path(b,'M0 9H768',null,'#ae7b4f',3);box(b,7,0,19,370,'#7e573b',2);box(b,736,0,23,352,'#7e573b',2);
    path(b,'M38 202V92Q38 35 94 35Q150 35 150 92V202Z','#82714f');path(b,'M49 191V93Q49 47 94 47Q139 47 139 93V191Z','#9fc9ce');path(b,'M49 161Q88 118 139 142V191H49Z','#819659',null);path(b,'M94 49V191M49 119H139',null,'#74583a',7);
    b.save();b.globalAlpha=.1;path(b,'M50 192L400 356L190 391L137 192Z','#fff1ba',null);b.restore();
    box(b,566,78,146,12,'#a87444',3);for(let i=0;i<5;i++){box(b,578+i*25,47,15,30,i%2?'#778543':'#b4a26a',4);box(b,580+i*25,42,11,6,'#735437',2)}
    pipe(b,'M720 25V290H677',true,9);
    for(let i=0;i<3;i++){path(b,`M${180+i*22} 25v40`,null,'#725a38',2);hops(b,180+i*22,68, .7)}
    backgrounds.set(kind,bg);c.drawImage(bg,0,0,W,H);
  }
  function shadow(c,x,y,rx=130){ellipse(c,x,y,rx,23,'#55402a33',null)}
  function kettle(c,x,y,w,h,{steel=false,level=.7,color='#bd772c',open=true}={}){
    shadow(c,x+w/2,y+h+25,w*.65);pipe(c,`M${x+25} ${y+h-4}v32M${x+w-25} ${y+h-4}v32`,true,12);
    const m=metal(c,x,w,steel);path(c,`M${x} ${y}V${y+h-25}Q${x} ${y+h+22} ${x+w/2} ${y+h+22}Q${x+w} ${y+h+22} ${x+w} ${y+h-25}V${y}Z`,m);
    ellipse(c,x+w/2,y,w/2,25,m);if(open){ellipse(c,x+w/2,y,w/2-10,17,'#4b3929',null);if(level>0)ellipse(c,x+w/2,y+4,w/2-16,13,color,null)}
    path(c,`M${x+10} ${y+24}v${h-42}`,null,steel?'#ecf1df':'#f8c98b',5);
    for(const yy of [y+32,y+h-18]){path(c,`M${x+2} ${yy}q${w/2} 25 ${w-4} 0`,null,steel?'#5e7c7d':'#96542e',4);for(let i=0;i<7;i++)ellipse(c,x+12+i*(w-24)/6,yy+6+Math.sin(i/6*Math.PI)*7,2.5,2.5,'#ffe0a3',ink,1)}
    // Le regard indique un niveau réel normalisé par le contrôleur.
    const gx=x+w-35,gy=y+39,gh=h-67;box(c,gx,gy,15,gh,'#e9e5cb',5,ink,3);box(c,gx+3,gy+3+(gh-6)*(1-clamp(level)),9,(gh-6)*clamp(level),color,2,null);
    for(let i=1;i<5;i++)path(c,`M${gx+2} ${gy+i*gh/5}h5`,null,ink,1);
  }
  function thermometer(c,x,y,temp,target,min=target-4,max=target+4,prediction){
    // Loupe visuelle centrée sur la consigne : la tolérance métier reste ±1 °C.
    box(c,x,y,126,300,'#fbefd3',18);const top=y+45,bottom=y+251,h=bottom-top;
    const Y=t=>bottom-clamp((t-min)/(max-min))*h;
    box(c,x+12,Y(target+1),102,Y(target-1)-Y(target+1),'#9cc94a99',4,null);
    path(c,`M${x+12} ${Y(target+1)}h102M${x+12} ${Y(target-1)}h102`,null,'#648532',2);
    box(c,x+26,top,18,h,'#d7c6a3',8);
    box(c,x+30,Y(temp),10,bottom-Y(temp),Math.abs(temp-target)<=1?'#78a647':'#c75e3e',4,null);ellipse(c,x+35,bottom+7,13,13,Math.abs(temp-target)<=1?'#78a647':'#c75e3e',ink,2);
    for(let t=min;t<=max+.01;t+=2){path(c,`M${x+49} ${Y(t)}h9`,null,ink,2);text(c,String(Math.round(t*10)/10),x+68,Y(t)+6,19)}
    if(Number.isFinite(prediction))path(c,`M${x+12} ${Y(prediction)}h102`,null,'#438ca6',3);
    text(c,`${temp.toFixed(1)} °C`,x+63,y+28,25,ink,'center');
    text(c,`Cible ${target.toFixed(0)} ±1`,x+63,y+285,17,ink,'center');
    if(temp<min||temp>max)text(c,temp<min?'▼':'▲',x+15,temp<min?bottom:top+12,18,'#b34832');
  }
  function mash(c,s){
    sack(c,66,310);kettle(c,178,192,260,195,{level:clamp(s.volume/s.capacity),color:'#c7a262'});
    const still=reduced(),t=still?0:s.t;
    const stir=s.evt?.id==='fourquet'&&s.t>=s.evt.t0&&s.t-s.evt.t0<2.2;
    // Courants de maische, pas des bulles d'ébullition : chaleur et fourquet réels.
    if(s.volume>0){
      const motion=stir?1:clamp(s.H/4)*.25,phase=t*motion*2;
      for(let i=0;i<18;i++){const a=i*2.4+phase,r=28+(i%4)*18;ellipse(c,308+Math.cos(a)*r,196+Math.sin(a)*r*.09,2.8,1.1,i%3?'#ead09a':'#a8753e',null)}
      if(stir){c.save();c.strokeStyle='#f5dca0';c.lineWidth=2;c.beginPath();c.ellipse(308,196,78,8,0,phase,phase+Math.PI*1.3);c.stroke();c.restore()}
    }
    pipe(c,'M439 318H520V342');valve(c,475,318,s.v);
    // Le flux cesse à la fermeture ; la chaleur stockée reste visible sur la cuve.
    if(s.t>0&&s.v>.02){c.save();c.setLineDash([7,12]);c.lineDashOffset=t*42;c.globalAlpha=clamp(s.v)*.8;path(c,'M514 337V324H488M457 318H442',null,'#fff0c2',4);c.restore()}
    box(c,510,336,105,88,'#6d6047',12);flame(c,560,409,s.t,.35+s.p/5,78);pipe(c,'M598 336V241',true,10);steam(c,598,245,s.t,.35,25);
    pipe(c,'M525 316V222');gauge(c,525,204,s.p,2.6);text(c,`${s.p.toFixed(1)} bar`,525,170,18,ink,'center');
    steam(c,305,180,s.t,s.H/3.5,170);
    if(s.H>.05){c.save();c.globalAlpha=clamp(s.H/4)*.22;path(c,'M178 300Q307 325 438 300V365Q300 423 178 365Z','#d34b2d',null);c.restore()}
    const dx=stir&&!still?Math.sin(t*9)*30:0;
    pipe(c,`M${293+dx} 122L${318+dx} 230`,false,8);path(c,`M${309+dx} 208l-10 23 18 19 15 -25Z`,'#a87444');
    if(s.evt?.id==='air'&&s.t-s.evt.t0<2.2)for(let i=0;i<3;i++)path(c,`M130 ${155+i*16}q70 -20 145 10`,null,'#b6dfeb',4);
    thermometer(c,608,137,s.T,s.target,s.target-4,s.target+4,s.prediction);
  }
  function filter(c,s){
    const t=reduced()?0:s.t,flow=s.t>0&&!s.fini&&!s.colmate&&s.u>.02,rinse=s.t>0&&!s.fini&&s.rince;
    shadow(c,277,440,195);kettle(c,134,172,290,238,{steel:true,level:0,open:false});
    // Coupe : surface des drêches, faux fond perforé et eau au-dessus.
    box(c,157,192,243,191,'#4e3926',12);
    const grainY=292;box(c,165,grainY,227,74,s.colmate?'#80603d':'#b38c52',4,null);
    for(let i=0;i<74;i++)ellipse(c,170+(i*41)%217,grainY+6+(i*19)%60,3,1.8,i%3?'#d9b477':'#85613b',null);
    const water=clamp(s.niveau,0,10)*8,wave=flow||rinse?Math.sin(t*4)*1.8:0;c.save();c.globalAlpha=.68;box(c,165,grainY-water,227,water,'#81bacc',2,null);c.restore();path(c,`M166 ${grainY-water}q55 ${-5+wave} 110 0t114 0`,null,'#d8e9d4',3);
    // Impacts à la surface réelle : aucune eau ajoutée par le renderer.
    if(rinse&&water>0){c.save();for(let i=0;i<3;i++){const p=(t*2+i/3)%1;c.globalAlpha=(1-p)*.8;ellipse(c,191+i*84,grainY-water+1,3+p*5,.6+p*.7,null,'#eff8e8',1.4)}c.restore()}
    box(c,161,368,235,10,'#b9c9bd',2);for(let i=0;i<23;i++)ellipse(c,166+i*10,372,2,2,ink,null);
    pipe(c,'M178 160H380M278 160V119',true,10);
    if(rinse)for(let i=0;i<14;i++){const y=177+(reduced()?.5:(t*1.7+i*.13)%1)*(grainY-water-177);path(c,`M${186+i*14} ${y}v7`,null,'#e5f3eb',3)}
    pipe(c,'M416 390H468V333H520');valve(c,463,389,s.u);
    kettle(c,525,281,152,129,{level:clamp(s.V/s.capacity),color:s.color});
    if(flow){path(c,'M520 333Q535 330 544 292',null,s.color,6);c.save();c.setLineDash([5,9]);c.lineDashOffset=-t*48;c.globalAlpha=.75;path(c,'M520 333Q535 330 544 292',null,'#f8e3ad',2.5);c.restore()}
    text(c,`${Math.round(s.V)} L`,600,453,21,ink,'center');
    if(s.colmate)text(c,'Lit colmaté',280,263,23,'#822e21','center');
    if(s.ratisse>0&&s.t>=s.ratisse&&s.t-s.ratisse<1){const dx=reduced()?0:Math.sin(s.t*10)*20;pipe(c,`M${230+dx} 137L${264+dx} 306`,false,7);path(c,`M${238+dx} 308h52`,null,'#805735',8)}
  }
  function boil(c,s){
    kettle(c,210,210,330,209,{level:clamp(s.volume/s.capacity),color:s.color});
    box(c,257,424,235,45,'#6b5540',8);flame(c,375,445,s.t,s.heat,190);
    steam(c,375,195,s.t,s.heat,210);
    if(s.heat>.05)for(let i=0;i<17;i++){const xx=238+(i*43)%270,yy=209+Math.sin(i*2)*8,p=reduced()?.5:(s.t*1.5+i*.27)%1;ellipse(c,xx,yy-p*8,3+p*4,2+p*2,'#efce8c',null)}
    pipe(c,'M535 371H593V401');valve(c,571,371,s.heat);
    shadow(c,118,414,60);box(c,64,340,104,70,'#91633a',9);ellipse(c,116,339,52,16,'#c09662');
    for(let i=0;i<9;i++)hops(c,78+(i*23)%80,328+(i%3)*9,.6);
    for(const h of s.chutes||[])hops(c,230+(h.x-60)*3.2,145+h.y*2.1,.65);
    pipe(c,'M552 201V145H433',true,8);gauge(c,552,173,clamp(s.heat)*100,120);
  }
  function ferment(c,s){
    shadow(c,224,447,146);
    pipe(c,'M138 364V440M304 364V440',true,12);
    const m=metal(c,110,225,true);path(c,'M110 160Q110 135 222 135Q335 135 335 160V332L239 415H206L110 332Z',m);
    ellipse(c,222,160,112,24,m);path(c,'M112 160Q222 135 333 160',null,'#e8eee0',5);
    pipe(c,'M223 137V103H263V75H283V101',true,9);box(c,262,59,28,29,'#b9d5cd',8,ink,3);
    for(let i=0;i<3;i++){const y=84-(reduced()?i*5:(s.t*15+i*7)%20);ellipse(c,275,y,2.5,2.5,'#f7f6df',null)}
    const jacket=s.e<-.05?'#72a9c0':s.e>.05?'#d78b69':'#a7bab1';for(const yy of [210,245,280]){path(c,`M108 ${yy}Q220 ${yy+29} 337 ${yy}`,null,ink,10);path(c,`M108 ${yy}Q220 ${yy+29} 337 ${yy}`,null,jacket,6)}
    pipe(c,'M110 242H64V330',true);valve(c,64,299,Math.max(0,-s.u),'#477f9a');pipe(c,'M334 263H366V333');valve(c,366,304,Math.max(0,s.u));
    box(c,185,182,31,144,'#3d5550',12,ink,3);box(c,190,194,21,126,s.color,7,null);
    const activity=s.G*(s.t/18*7/1.8)*Math.exp(1-s.t/18*7/1.8);
    for(let i=0;i<Math.round(activity*10);i++){const y=314-(reduced()?i*10:(s.t*24+i*23)%111);ellipse(c,196+(i%3)*5,y,2,2,'#f5e1ac',null)}
    pipe(c,'M223 414V438H260',true,9);valve(c,245,438,0);
    // Éprouvette et robinet d'échantillonnage, sans niveau inventé.
    pipe(c,'M310 333H345V353',true,8);box(c,335,369,28,64,'#c6d4c5',6,ink,2);path(c,'M340 425V376',null,'#f3f2df',2);
    if(s.chuteDH!=null&&s.t-s.chuteDH<1.6)for(let i=0;i<6;i++)hops(c,185+i*13,116+(s.t-s.chuteDH)*52+(i%3)*5,.55);
    // Courbe mesurée, bande cible et fenêtres DH : tous les repères restent en code.
    const gx=432,gy=157,gw=267,gh=258,min=Math.floor(Math.min(s.target-4,s.T-1,...s.histo.map(p=>p.T-1))),max=Math.ceil(Math.max(s.target+(s.rest?8:4),s.T+1,...s.histo.map(p=>p.T+1)));
    const Y=t=>gy+gh-(t-min)/(max-min)*gh;
    box(c,gx-42,gy-38,gw+66,gh+85,'#fbefd7',12);
    for(let j=0;j<=7;j++){path(c,`M${gx+j/7*gw} ${gy}v${gh}`,null,'#d1c0a1',1);text(c,String(j),gx+j/7*gw,gy+gh+20,13,ink,'center')}
    for(let t=Math.ceil(min/2)*2;t<=max;t+=Math.max(2,Math.ceil((max-min)/12)*2)){path(c,`M${gx} ${Y(t)}h${gw}`,null,'#d1c0a1',1);text(c,String(t),gx-8,Y(t)+5,17,ink,'right')}
    for(let x=0;x<gw;x++){const target=s.target+(s.rest&&x/gw*7>=5?4:0);c.fillStyle='#9cc94a88';c.fillRect(gx+x,Y(target+1.5),1,Y(target-1.5)-Y(target+1.5))}
    for(const [a,b,n] of s.dhWindows){c.fillStyle='#7ba45122';c.fillRect(gx+a/7*gw,gy,(b-a)/7*gw,gh);if(s.dhDays?.[n]!=null)path(c,`M${gx+s.dhDays[n]/7*gw} ${gy}v${gh}`,null,'#5c852e',3)}
    if(s.histo.length)path(c,s.histo.map((p,i)=>`${i?'L':'M'}${gx+p.j/7*gw} ${Y(p.T)}`).join(' '),null,'#ac5738',3);
    path(c,`M${gx+s.t/18*gw} ${gy}v${gh}`,null,'#af7134',2);text(c,'Cible ±1,5 °C · 7 jours',gx-24,gy-14,19);text(c,`${s.T.toFixed(1)} °C`,222,482,22,ink,'center');
  }
  function bottling(c,s){
    shadow(c,383,446,310);path(c,'M39 344L654 323L718 367L93 391Z','#bd915e');path(c,'M93 391L718 367V395L93 420Z','#8c5e38');pipe(c,'M110 418V480M677 397V461',false,17);
    box(c,62,180,100,155,metal(c,62,100,true),18);ellipse(c,112,181,50,16,metal(c,62,100,true));pipe(c,'M160 284H184V235H592V263',true,8);valve(c,182,282, s.fill<1?1:0);
    // Capsuleuse à levier.
    box(c,634,212,16,134,'#496b66',5);box(c,607,211,69,16,'#a74e37',5);path(c,'M643 213L690 155',null,ink,10);path(c,'M643 213L690 155',null,'#b95e40',6);box(c,600,340,83,12,'#496b66',6);
    for(let i=0;i<8;i++){
      const x=207+i*48,y=360-i*2;
      if(s.broken?.includes(i)){for(let k=0;k<7;k++)path(c,`M${x+(k*7)%32} ${y-5-(k*11)%20}l9 3 -6 7Z`,'#50663d',ink,1);ellipse(c,x+16,y,20,5,s.color,null);continue}
      const outline=`M${x+11} ${y-113}h12v23q0 8 10 15v73q-15 9 -30 0v-73q10 -7 8 -15Z`;
      path(c,outline,'#4e6946');c.save();c.clip(new Path2D(outline));const fill=clamp(s.fill);box(c,x+4,y-4-92*fill,28,92*fill,s.color,4,null);path(c,`M${x+8} ${y-72}v59`,null,'#d9e6bd66',3);c.restore();
      box(c,x+8,y-58,20,28,'#f3dfaa',3,ink,1);path(c,`M${x+13} ${y-38}q-6 -8 4 -13q11 7 4 13Z`,'#b06a36',null);
      if(fill>0)for(let k=0;k<Math.min(6,s.co2*1.4);k++)ellipse(c,x+10+(k*3)%14,y-8-(k*13)%Math.max(1,88*fill),1.5,1.5,'#f4ead3',null);
      if(fill>=1)box(c,x+9,y-116,16,6,'#cba36a',2,ink,2);
    }
    text(c,`${Math.round(clamp(s.fill)*100)} %`,112,373,19,ink,'center');
  }
  function recipe(c,s){
    // Charge de grain indicative, calculée par le contrôleur ; aucune chauffe avant le geste.
    sack(c,105,318);sack(c,175,341);
    kettle(c,288,186,260,210,{level:s.level,color:s.color});
    ellipse(c,417,188,112,16,s.level>0?'#d5b578':'#49392c',null);
    if(s.level>0)for(let i=0;i<48;i++){const x=317+(i*47)%196,y=184+Math.sin(i*2.4)*10;ellipse(c,x,y,3,1.5,i%3?'#ead09a':'#ac793f',null,1)}
    pipe(c,'M549 349H592V384');valve(c,574,349,0);
    path(c,'M329 154L383 285',null,'#765132',10);path(c,'M375 263l-10 21 19 20 15 -25Z','#bb8950');
    box(c,602,338,106,18,'#997044',5);pipe(c,'M615 356V415M695 356V415',false,8);
    for(let i=0;i<Math.min(4,s.hops);i++)hops(c,620+i*23,322,.8);
    if(s.yeast){box(c,640,267,43,58,'#eee0b9',5);path(c,'M647 280h29M647 286h29',null,'#739251',4);ellipse(c,661,308,7,7,'#b68742',null)}
  }
  function still(c,s){
    const active=s.active,level=clamp(s.level),heat=clamp(s.heat,0,1.5);
    box(c,93,400,550,24,'#6a6658',6);pipe(c,'M644 412H718',true,14);
    for(const x of [177,546]){ellipse(c,x,439,33,33,'#34342e');ellipse(c,x,439,18,18,'#929889');ellipse(c,x,439,6,6,ink,null)}
    box(c,129,330,222,69,'#655b49',12);flame(c,240,383,s.t,heat,145);
    for(let i=0;i<Math.min(7,s.logs||0);i++){path(c,`M${158+i*22} 388l16 -9`,null,'#68452b',10);ellipse(c,158+i*22,388,5,5,'#ba8b56',ink,1)}
    kettle(c,138,181,208,125,{level,color:s.color||'#d5b679',open:false});
    path(c,'M138 181Q143 133 217 125L219 107H265L267 125Q340 133 346 181Z',metal(c,138,208));
    pipe(c,'M242 108V75Q242 61 258 61H386Q409 61 409 83V117',false,20);
    // Colonne et condenseur : enveloppe d'eau en coupe, serpentin séparé.
    box(c,386,112,46,123,metal(c,386,46,true),12);for(let i=0;i<5;i++)box(c,389,127+i*19,40,6,'#bb814e',2,ink,2);
    pipe(c,'M432 131H508V169');box(c,475,169,129,173,metal(c,475,129,true),18);
    box(c,487,183,105,145,'#93bfbd',10);for(let i=0;i<5;i++)path(c,`M500 ${199+i*25}q74 -13 78 4q1 10 -77 16`,null,'#bc7842',7);
    pipe(c,'M579 322V352H647V371');pipe(c,'M475 303H453V365',true,8);valve(c,453,336,active?1:0,'#438b9f');pipe(c,'M604 194H624V166',true,8);
    const gx=311,gy=220;
    if(s.foam>0)box(c,gx+3,gy+3+52*(1-level),9,Math.min(20,s.foam*20),'#f5e9ce',2,null);
    if(s.hot){path(c,'M145 309q96 28 194 0',null,'#e66c3d',9);steam(c,250,130,s.t,.65,70)}
    if(s.overflow)path(c,'M249 108q44 -16 75 0',null,'#f8e9c8',10);
    if(active&&s.flow)for(let i=0;i<3;i++)ellipse(c,647,376+(reduced()?i*8:((s.t*28+i*8)%24)),2.5,4,'#e8f1dc',null);
    if(s.fractions){
      for(let i=0;i<3;i++){const x=610+i*45,h=clamp(s.fractions[i].V/Math.max(1,s.capacity))*72;box(c,x,402,36,82,'#e1e6d455',5);if(h>0)box(c,x+4,480-h,28,h,'#dce7cb',3,null);if(i===s.phase)path(c,`M${x} 396h36`,null,['#b94e32','#7eaa43','#8166a3'][i],5);text(c,['T','C','Q'][i],x+18,500,16,ink,'center')}
    }else{box(c,623,402,55,76,'#e1e6d466',8);box(c,628,472-clamp(s.collected)*60,45,clamp(s.collected)*60,'#dce7cb',3,null)}
    if(Number.isFinite(s.degree))text(c,`${s.degree.toFixed(0)} % vol`,644,151,20,ink,'center');
  }
  function distillationChart(c,s){
    box(c,38,34,690,435,'#fcf1d8',15);const x=103,y=76,w=563,h=310;
    for(let i=0;i<=4;i++){const yy=y+h-i*h/4;path(c,`M${x} ${yy}h${w}`,null,'#cbb990',1);text(c,String(10**(i-2)),x-12,yy+5,15,ink,'right');text(c,String(i*25),x+w+12,yy+5,15)}
    for(let i=0;i<=4;i++){const xx=x+i*w/4;path(c,`M${xx} ${y}v${h}`,null,'#cbb990',1);text(c,`${i*25}%`,xx,y+h+27,16,ink,'center')}
    const colors={tetes:'#b94132',esters:'#b47a0f',terpenes:'#5f8b34',cereale:'#936a32',queues:'#8060a5',furfural:'#97533b',degre:'#243f49'};
    for(const [k,color] of Object.entries(colors)){let d='';for(const p of s.curve){const yy=y+h-h*(k==='degre'?clamp(p.degre/100):clamp((Math.log10(Math.max(p[k]||.01,.01))+2)/4));d+=`${d?'L':'M'}${x+clamp(p.recup)*w} ${yy} `}if(d)path(c,d,null,color,3)}
    for(const cut of s.cuts)path(c,`M${x+clamp(cut.recup)*w} ${y}v${h}`,null,'#443628',2);
    text(c,'Seuils × · logarithme',64,58,17);text(c,'Degré %',673,58,17,ink,'right');text(c,'Alcool recueilli',384,446,19,ink,'center');
  }
  const painters={ulysse:still,courbes:distillationChart,recette:recipe,emp:mash,fil:filter,ebu:boil,fer:ferment,bou:bottling};
  function render(ctx,name,state){
    if(!ctx||!painters[name])return false;
    const cv=ctx.canvas,dpr=Math.min(devicePixelRatio||1,3);
    // La classe modifie parfois la grille parente (Ulysse passe de 96 px à pleine largeur).
    // Appliquer le style avant de mesurer évite d’agrandir une petite image basse résolution.
    cv.classList.add('atelier-illustre');cv.style.aspectRatio=`${W} / ${H}`;
    const width=cv.getBoundingClientRect().width||360,height=width*H/W;
    const rw=Math.round(width*dpr),rh=Math.round(height*dpr);
    if(cv.width!==rw||cv.height!==rh){cv.width=rw;cv.height=rh}
    ctx.setTransform(rw/W,0,0,rh/H,0,0);ctx.clearRect(0,0,W,H);ctx.imageSmoothingEnabled=true;
    room(ctx,name);painters[name](ctx,state);ctx.setTransform(1,0,0,1,0,0);
    return true;
  }
  window.AteliersJeu=Object.freeze({render});
})();
