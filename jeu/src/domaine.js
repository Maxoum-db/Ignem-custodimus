/* Carte illustrée : les images sont des couches ; niveaux et travaux viennent du jeu. */
(() => {
  'use strict';
  const names=['terrain','ferme','chai','pigeonnier','ulysse','cheval','ruche','printemps','automne','hiver','animal-poule-brune','animal-chat-noir'];
  const images={}; let ready=false;
  const loaded=Promise.all(names.map(async name=>{
    const src=window.IMAGES_JEU?.[name.startsWith('animal-')?name:'domaine-'+name]; if(!src)throw new Error('Asset absent : '+name);
    const im=new Image();im.src=src;await im.decode();images[name]=im;
  })).then(()=>{ready=true;return true;}).catch(()=>false);
  const ink='#3b2a1e';
  function render(c,t,s){
    if(!ready)return false;
    const cv=c.canvas,dpr=Math.min(devicePixelRatio||1,3),w=Math.round(cv.getBoundingClientRect().width*dpr),h=Math.round(w*4/3);
    if(!w)return false;
    if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}
    cv.classList.add('domaine-illustre');
    c.setTransform(w/192,0,0,h/256,0,0);c.clearRect(0,0,192,256);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
    const ellipse=(x,y,rx,ry,col)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();};
    const line=(pts,col=ink,width=.7)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.strokeStyle=col;c.lineWidth=width;c.lineCap='round';c.stroke();};
    const box=(x,y,w,h,col,r=.7)=>{c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=col;c.fill();c.strokeStyle=ink;c.lineWidth=.55;c.stroke();};
    const sprite=(name,x,y,w,h,pose)=>{const im=images[name],scale=Math.min(w/im.width,h/im.height),iw=im.width*scale,ih=im.height*scale;ellipse(x+w/2,y+h-1,w*.35,h*.065,'#3b2a1e26');c.save();c.translate(x+w/2,y+h);if(pose){c.rotate(pose.angle||0);c.scale(pose.flip?-1:1,pose.souffle||1);}c.drawImage(im,-iw/2,-ih,iw,ih);c.restore();};
    // Animations décoratives déterministes : aucune écriture dans l'état du jeu.
    const oiseau=(x,y,phase)=>{const aile=1.2+Math.sin(phase)*1.6;ellipse(x,y,1.5,.65,'#aab0a1');c.beginPath();c.moveTo(x-3,y-aile);c.quadraticCurveTo(x-1,y-2,x,y);c.quadraticCurveTo(x+1,y-2,x+3,y-aile);c.strokeStyle=ink;c.lineWidth=.55;c.stroke();};
    const metal=(x,w)=>{const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,'#687e77');g.addColorStop(.32,'#ebeee0');g.addColorStop(.6,'#afc2b1');g.addColorStop(1,'#708a7e');return g;};
    const barrel=(x,y)=>{const g=c.createLinearGradient(x,0,x+5,0);g.addColorStop(0,'#704226');g.addColorStop(.35,'#ddb070');g.addColorStop(1,'#925e31');box(x,y,5,7,g,1.8);for(let i=1;i<5;i++)line([[x+i,y+1],[x+i,y+6]],'#80512c',.2);line([[x+.4,y+2],[x+4.6,y+2]],'#514438');line([[x+.4,y+5],[x+4.6,y+5]],'#514438');ellipse(x+2.5,y,2,.7,'#d3a568');};
    const plot=(x,y,w,h)=>{ellipse(x+w/2,y+h-4,w*.44,h*.18,'#af925f77');const p=[[x+3,y+h-10],[x+w-3,y+h-10],[x+w-3,y+h],[x+3,y+h]];line([...p,p[0]],'#f5e8bd',.8);for(const [px,py]of p){line([[px,py-6],[px,py+1]],'#845733',1.4);}for(let k=0;k<3;k++)box(x+w/2-7+k*4,y+h-8-k,6,2,'#d3c1a0');};
    const scaffold=(x,y,w,h)=>{for(let i=0;i<=w;i+=w/4)line([[x+i,y],[x+i,y+h]],'#976435',1.1);for(let j=5;j<h;j+=10)line([[x,y+j],[x+w,y+j]],'#e6ba7b',1.2);line([[x,y+h],[x+w,y]],'#b17b46',.9);};
    c.drawImage(images[s.saison] || images.terrain,0,0,192,256);
    // Ruches indépendantes ; le rucher reste l'extension annoncée par le jeu.
    for(let i=0;i<4;i++)sprite('ruche',118+(i%2)*22,49+Math.floor(i/2)*13,15,18);
    if(!s.nuit&&s.saison!=='hiver')for(let i=0;i<5;i++){const x=133+Math.sin(t*1.5+i*2)*19,y=54+Math.cos(t*2+i)*7;ellipse(x-.4,y-.7,.7,.4,'#fffbe8b0');ellipse(x,y,.6,.4,'#503421');}
    sprite('ferme',7,43,92,74);
    // Cuves extérieures et équipements visibles aux niveaux réellement possédés.
    for(let i=0;i<Math.max(0,s.bat.brasserie-1);i++){const x=12+i*9;box(x,100,7,14,metal(x,7),2);for(let j=102;j<113;j+=3)line([[x+.6,j],[x+6.4,j]],'#748e83',.2);ellipse(x+3.5,100,3.5,1.5,'#e0ece1');line([[x+.5,104],[x+6.5,104]],'#637878');line([[x+1,114],[x+1,117]],ink);}
    if(s.bat.chai){sprite('chai',109,94,73,48);if(s.bat.chai>=2){barrel(168,132);barrel(174,134);barrel(171,126);}}else plot(112,107,65,29);
    if(s.bat.pigeonnier)sprite('pigeonnier',13,139,61,64);else plot(15,163,55,32);
    if(s.bat.pigeonnier>=2){
      box(57,187,20,12,'#9b673d');for(let j=189;j<198;j+=2){line([[58,j],[76,j]],'#d9a365',.4);line([[62,j+.5],[71,j+.5]],'#70442c',.25);}line([[58,187],[58,200]],ink,.7);line([[76,187],[76,200]],ink,.7);for(let i=0;i<5;i++)box(55+i*5,184,5,4,i%2?'#ca6946':'#f1deac',.2);
      for(let i=0;i<4;i++){box(60+i*4,188,2,5,['#758d47','#9f6039','#b9a16b','#7c8b4e'][i]);box(60.5+i*4,187,1,2,'#45342a');}
    }
    if(s.bat.pigeonnier>=3){ellipse(78,174,6,3,'#c5914d');line([[78,174],[78,183]],ink,1);ellipse(78,174,7,1,'#f3d99d');box(72,181,3,2,'#a97945');box(81,181,3,2,'#a97945');}
    if(s.bat.distillerie){
      if(s.bat.distillerie>=2){line([[109,155],[109,195]],'#855936',1.5);line([[180,155],[180,195]],'#855936',1.5);c.beginPath();c.moveTo(105,156);c.lineTo(145,146);c.lineTo(183,155);c.lineTo(145,151);c.closePath();c.fillStyle='#ad6138';c.fill();c.strokeStyle=ink;c.lineWidth=.5;c.stroke();for(let i=0;i<9;i++)line([[108+i*4,155-i],[112+i*4,155-i]],'#e5a56a',.5);}
      sprite('ulysse',103,150,80,51);
      if(s.equip.grille||s.bat.distillerie>=2)for(let i=0;i<4;i++)ellipse(177+(i%2)*3,195-Math.floor(i/2)*2,1.6,1.1,'#ad7849');
    }else plot(108,166,70,29);
    for(const [key,x,y,w,h]of [['brasserie',9,61,84,52],['chai',111,108,68,30],['pigeonnier',14,157,60,42],['distillerie',106,160,76,38]])if(s.travaux.some(v=>v.bat===key))scaffold(x,y,w,h);
    // Pigeons autour du colombier construit, sans livraison ni gain fictifs.
    if(s.bat.pigeonnier&&!s.nuit)for(let i=0;i<3;i++){const a=t*.7+i*2.1;oiseau(43+Math.cos(a)*14,134+Math.sin(a)*5,t*9+i);}
    // Respiration et balancement d'attente ; le cheval reste près des leçons.
    sprite('cheval',112,208+Math.sin(t*1.2)*.3,49,29,{angle:Math.sin(t*.6)*.006,souffle:1+Math.sin(t*1.8)*.006});
    // Petit potager et animaux de basse-cour au premier plan.
    for(let j=0;j<3;j++){line([[22,215+j*3],[47,219+j*3]],'#89633d',1.4);for(let i=0;i<5;i++){const vent=Math.sin(t*1.6+i*.6+j)*.55;ellipse(24+i*5+vent,214+j*3+i*.16,1.4,.7,'#53863f');line([[24+i*5,215+j*3+i*.16],[24+i*5+vent,213+j*3+i*.16]],'#305e30',.5);}}
    [[84,173],[94,178],[79,182]].forEach(([x,y],i)=>{const a=t*.65+i*2.1,marche=s.nuit?0:Math.sin(a)*2.4,pas=s.nuit?0:Math.abs(Math.sin(t*5+i))*.25;const picore=s.nuit?0:Math.max(0,Math.sin(t*1.8+i))*.08;sprite('animal-poule-brune',x+marche,y-pas,10,10,{flip:!s.nuit&&Math.cos(a)<0,angle:picore,souffle:1+Math.sin(t*2+i)*.012});});
    const promenade=s.nuit?0:Math.sin(t*.22)*4;
    sprite('animal-chat-noir',72+promenade,119-Math.abs(Math.sin(t*3))*(s.nuit?0:.18),13,13,{flip:!s.nuit&&Math.cos(t*.22)<0,souffle:1+Math.sin(t*1.7)*.014});
    if(!s.nuit&&['printemps','été'].includes(s.saison))for(let i=0;i<2;i++){const x=34+Math.sin(t*.8+i*3)*12,y=209+Math.cos(t*1.1+i)*5,a=.3+Math.abs(Math.sin(t*9+i))*.9;ellipse(x-a,y,a,1.1,i?'#e6b04d':'#de8b76');ellipse(x+a,y,a,1.1,i?'#e6b04d':'#de8b76');line([[x,y-1],[x,y+1]],ink,.35);}
    // Nuit : éclairage distinct de l'état des foyers, jamais de chauffe fictive.
    if(s.nuit){c.fillStyle='#10213b88';c.fillRect(0,0,192,256);for(const[x,y]of[[93,111],[76,200],[164,231]]){const glow=c.createRadialGradient(x,y,0,x,y,6);glow.addColorStop(0,`rgba(255,214,120,${.48+Math.sin(t*2+x)*.05})`);glow.addColorStop(1,'#ffd67800');c.fillStyle=glow;c.fillRect(x-6,y-6,12,12);box(x-.7,y-1,1.4,2,'#f9d889');}}
    if(s.nuit&&['printemps','été'].includes(s.saison))for(let i=0;i<5;i++){const x=36+i*8+Math.sin(t*.6+i)*3,y=211+Math.cos(t*.8+i)*6;c.globalAlpha=.35+Math.sin(t*1.4+i)*.2;ellipse(x,y,.55,.55,'#f6e99e');c.globalAlpha=1;}
    // Météo et particules bornées ; aucun lien avec le calendrier simulé.
    if(s.saison==='hiver')for(let i=0;i<12;i++){const y=24+((t*4+i*19)%220),x=8+i*15+Math.sin(t*.6+i)*2;ellipse(x,y,.45+(i%3)*.13,.45+(i%3)*.13,'#fff8e9b0');}
    if(s.saison==='printemps'&&!s.nuit)for(let i=0;i<8;i++){const y=30+((t*3+i*27)%210),x=12+i*23+Math.sin(t*.7+i)*3;ellipse(x,y,.65,.35,'#f5d9d7b0');}
    if(s.saison==='automne'&&!s.nuit)for(let i=0;i<7;i++){const u=(t*.06+i/7)%1;c.save();c.translate(13+i*27+Math.sin(t+i)*3,38+u*202);c.rotate(t*.8+i);ellipse(0,0,1.1,.45,['#af5732','#e2ad46','#bc7532'][i%3]);c.restore();}
    cv.dataset.saison=s.saison;cv.dataset.nuit=String(s.nuit);return true;
  }
  window.DomaineIllustre=Object.freeze({ready:loaded,render});
})();
