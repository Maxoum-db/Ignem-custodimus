/* Carte illustrée : les images sont des couches ; niveaux et travaux viennent du jeu. */
(() => {
  'use strict';
  const names=['terrain','ferme','chai','pigeonnier','ulysse','cheval','ruche','printemps','automne','hiver'];
  const images={}; let ready=false;
  const loaded=Promise.all(names.map(async name=>{
    const src=window.IMAGES_JEU?.['domaine-'+name]; if(!src)throw new Error('Asset absent : '+name);
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
    const sprite=(name,x,y,w,h)=>{const im=images[name],scale=Math.min(w/im.width,h/im.height),iw=im.width*scale,ih=im.height*scale;ellipse(x+w/2,y+h-1,w*.35,h*.065,'#3b2a1e26');c.drawImage(im,x+(w-iw)/2,y+h-ih,iw,ih);};
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
    // Cheval des leçons : léger mouvement d'attente, sans déplacement artificiel.
    sprite('cheval',112,208+Math.sin(t*1.2)*.25,49,29);
    // Petit potager et animaux de basse-cour au premier plan.
    for(let j=0;j<3;j++){line([[22,215+j*3],[47,219+j*3]],'#89633d',1.4);for(let i=0;i<5;i++){ellipse(24+i*5,214+j*3+i*.16,1.4,.7,'#53863f');line([[24+i*5,215+j*3+i*.16],[24+i*5,213+j*3+i*.16]],'#305e30',.5);}}
    const hen=(x,y,color)=>{ellipse(x,y,2,1.4,color);ellipse(x+1.8,y-1.2,.9,.9,color);line([[x+2.4,y-1.2],[x+3.4,y-1]],'#cb8f35');line([[x-1,y+1],[x-1,y+2.2]],ink,.35);line([[x+1,y+1],[x+1,y+2.2]],ink,.35);ellipse(x+1.8,y-2,.5,.4,'#c45037');};
    hen(88,180,'#fff4d3');hen(94,184,'#ad683c');hen(83,185,'#f3e4bf');
    ellipse(78,128,2.8,1.2,'#332a26');ellipse(80,126.8,1.2,1.2,'#332a26');line([[79.3,126],[79.4,125.1],[80,125.8],[80.8,125],[81,126]],'#332a26',.6);line([[75,128],[73.5,126],[74,125]],'#332a26',.8);
    // Nuit : éclairage distinct de l'état des foyers, jamais de chauffe fictive.
    if(s.nuit){c.fillStyle='#10213b88';c.fillRect(0,0,192,256);for(const[x,y]of[[93,111],[76,200],[164,231]]){const glow=c.createRadialGradient(x,y,0,x,y,6);glow.addColorStop(0,'#ffd67888');glow.addColorStop(1,'#ffd67800');c.fillStyle=glow;c.fillRect(x-6,y-6,12,12);box(x-.7,y-1,1.4,2,'#f9d889');}}
    if(s.saison==='automne'&&!s.nuit)for(let i=0;i<7;i++){const u=(t*.06+i/7)%1;ellipse(13+i*27+Math.sin(t+i)*2,38+u*202,.9,.4,['#af5732','#e2ad46','#bc7532'][i%3]);}
    cv.dataset.saison=s.saison;cv.dataset.nuit=String(s.nuit);return true;
  }
  window.DomaineIllustre=Object.freeze({ready:loaded,render});
})();
