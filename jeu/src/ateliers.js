/* Prométhée — ateliers illustrés. Présentation seule, aucun accès à R, S,
 * aux moteurs, aux événements de jeu ou à localStorage. Les états reçus sont lus.
 * Les coordonnées restent celles des Canvas historiques, même à haute densité.
 */
(function () {
  'use strict';
  const I = window.IllustrationsJeu;
  const brun = '#3b2a1e', creme = '#fff5d9', cuivre = '#e09a4e', vert = '#6c933c';
  const limite = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const configurations = Object.freeze({
    cuve: { image: 'a-cuve-vide', w: 120, h: 96 },
    emp: { image: 'a-cuve-vide', w: 192, h: 128 },
    fil: { image: 'b-filtre-vide', w: 192, h: 128 },
    ebu: { image: 'a-cuve-vide', w: 192, h: 112 },
    fer: { image: 'd-fermenteur-vide', w: 192, h: 128 },
    bou: { image: 'e-capsuleuse', w: 192, h: 112 }
  });
  const ressources = new Map(), vues = new WeakMap(), chutes = new WeakMap();
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const visible = (canvas) => !document.hidden && !canvas.closest('[hidden]') && canvas.getBoundingClientRect().bottom > 0 && canvas.getBoundingClientRect().top < innerHeight;

  function arrondi(c, x, y, w, h, r, fond, trait = brun, ep = 1.1) {
    c.beginPath(); c.roundRect(x, y, w, h, r); c.fillStyle = fond; c.fill();
    if (trait) { c.strokeStyle = trait; c.lineWidth = ep; c.stroke(); }
  }
  function ellipse(c, x, y, rx, ry, fond, trait) {
    c.beginPath(); c.ellipse(x, y, Math.max(.01, rx), Math.max(.01, ry), 0, 0, Math.PI * 2);
    c.fillStyle = fond; c.fill();
    if (trait) { c.strokeStyle = trait; c.lineWidth = .9; c.stroke(); }
  }
  function ligne(c, points, couleur, ep = 1.2) {
    c.beginPath(); points.forEach(([x, y], k) => k ? c.lineTo(x, y) : c.moveTo(x, y));
    c.lineWidth = ep; c.strokeStyle = couleur; c.lineJoin = c.lineCap = 'round'; c.stroke();
  }
  function texte(c, txt, x, y, taille = 6, couleur = brun, align = 'left') {
    c.font = `600 ${taille}px system-ui, sans-serif`; c.fillStyle = couleur; c.textAlign = align; c.fillText(txt, x, y);
  }
  function tuyau(c, points) { ligne(c, points, brun, 4.5); ligne(c, points, '#b9834b', 2.6); }
  function vanne(c, x, y, valeur, couleur = cuivre) {
    ellipse(c, x, y, 5, 5, couleur, brun);
    const a = valeur * Math.PI * .75;
    ligne(c, [[x - Math.cos(a) * 4, y - Math.sin(a) * 4], [x + Math.cos(a) * 4, y + Math.sin(a) * 4]], creme, 1.8);
    ellipse(c, x, y, 1.1, 1.1, brun);
  }
  function vapeur(c, x, y, temps, force = 1) {
    for (let i = 0; i < 4; i++) {
      const a = (temps * .6 + i / 4) % 1;
      ligne(c, [[x + i * 7, y - a * 23], [x + i * 7 + 3, y - a * 23 - 5], [x + i * 7, y - a * 23 - 9]], `rgba(255,249,224,${(1 - a) * .65 * force})`, 2.5 + a * 2);
    }
  }
  function flamme(c, x, y, temps, force) {
    if (force <= .01) return;
    for (let i = 0; i < 5; i++) {
      const h = (5 + (1 + Math.sin(temps * 10 + i * 2)) * 4) * force;
      c.beginPath(); c.moveTo(x + i * 4 - 3, y); c.quadraticCurveTo(x + i * 4 - 5, y - h * .7, x + i * 4, y - h);
      c.quadraticCurveTo(x + i * 4 + 5, y - h * .3, x + i * 4 + 3, y); c.fillStyle = '#d9714a'; c.fill();
      ellipse(c, x + i * 4, y - 2 * force, 1.5, 2.5 * force, '#ffd370');
    }
  }
  function houblon(c, x, y, taille = 1) {
    c.save(); c.translate(x, y); c.scale(taille, taille);
    for (let i = 0; i < 3; i++) for (let k = 0; k < 2; k++) ellipse(c, (k - .5) * (4 - i), i * 3, 2.8 - i * .3, 3.2, i % 2 ? '#9cc94a' : '#709b3c', '#47632c');
    ligne(c, [[0,-3],[1,-6]], '#47632c', 1.5); c.restore();
  }
  function sac(c, x, y) {
    arrondi(c, x, y + 4, 18, 25, 5, '#e8c98e');
    ligne(c, [[x+2,y+4],[x,y],[x+17,y],[x+15,y+4]], '#ae8050', 2);
    ligne(c, [[x+9,y+11],[x+9,y+23]], '#a87444', 1);
    for (let i = 0; i < 3; i++) { ellipse(c,x+6,y+12+i*3,2,1.3,'#b98649'); ellipse(c,x+12,y+13+i*3,2,1.3,'#b98649'); }
  }
  function surface(c, x, y, rx, ry, couleur, grain, temps) {
    ellipse(c, x, y, rx, ry, couleur, '#8d592e');
    c.save(); c.beginPath(); c.ellipse(x,y,rx,ry,0,0,Math.PI*2); c.clip();
    for (let i = 0; i < 24; i++) {
      const a = i * 2.4 + temps * .15, d = Math.sqrt((i + 1) / 25);
      ellipse(c,x+Math.cos(a)*rx*d,y+Math.sin(a)*ry*d,grain?1.3:.8,grain?.55:.7,grain?'#dbc089':'rgba(255,238,183,.65)');
    }
    ligne(c, [[x-rx*.6,y-ry*.3],[x-rx*.3,y-ry*.55],[x,y-ry*.52]], 'rgba(255,245,210,.5)', .7);
    c.restore();
  }

  function charger(nom, canvas, vue) {
    if (!ressources.has(nom)) {
      const cfg = configurations[nom], r = { images: null };
      r.promesse = Promise.all([I.charger('brasserie-fond'), I.charger(cfg.image)]).then(([fond, objet]) => { r.images = fond && objet ? { fond, objet } : null; return r.images; });
      ressources.set(nom, r);
    }
    const r = ressources.get(nom);
    if (!vue.attendu) {
      vue.attendu = true;
      r.promesse.then(() => { if (visible(canvas)) vue.redessiner?.(); });
    }
    return r.images;
  }
  function statique(nom, c, images, w, h) {
    const ratio = Math.max(w / images.fond.width, h / images.fond.height);
    c.drawImage(images.fond, (w - images.fond.width * ratio) / 2, (h - images.fond.height * ratio) / 2, images.fond.width * ratio, images.fond.height * ratio);
    if (nom === 'cuve') { ellipse(c,60,87,40,5,'rgba(59,42,30,.18)'); c.drawImage(images.objet,15,17,91,76); }
    if (nom === 'emp') {
      ellipse(c,74,118,53,6,'rgba(59,42,30,.18)');
      ligne(c,[[13,38],[21,91]],'#8a5a32',2.1);arrondi(c,17,83,9,17,2,'#bc8c50');sac(c,7,84);
      c.drawImage(images.objet,23,34,101,84);
      arrondi(c,126,87,22,31,3,'#78624c'); arrondi(c,130,100,14,12,2,'#392c21');
      tuyau(c,[[137,87],[137,77],[120,77],[120,88],[110,88]]);
      tuyau(c,[[144,87],[144,70]]);
      arrondi(c,153,16,23,99,9,creme); arrondi(c,162,27,5,76,2,'#dfcba4',null);
      for (const t of [55,60,65,70,75]) { const y = 105-(t-55)/23*78; ligne(c,[[156,y],[160,y]],'#88745a',.7); texte(c,String(t),178,y+2,5); }
      ellipse(c,135,43,11,11,creme,brun);
    }
    if (nom === 'fil') {
      ellipse(c,59,120,50,5,'rgba(59,42,30,.18)'); c.drawImage(images.objet,6,27,105,96);
      tuyau(c,[[59,99],[122,99],[122,108]]);
      tuyau(c,[[20,7],[20,29],[92,29]]);
      arrondi(c,136,70,48,49,8,'#a7a99f'); ellipse(c,160,72,24,6,'#e3e3d5',brun);
      arrondi(c,141,79,38,34,3,'#f6e9c9');
      texte(c,'RECUEILLI',160,65,5.5,brun,'center');
    }
    if (nom === 'ebu') {
      ellipse(c,99,107,52,4,'rgba(59,42,30,.18)'); sac(c,8,79);
      c.drawImage(images.objet,43,20,110,92);
      tuyau(c,[[164,104],[164,67],[149,67]]);
      houblon(c,22,74,1.5); houblon(c,33,83,1.2);
    }
    if (nom === 'fer') {
      ellipse(c,37,121,29,4,'rgba(59,42,30,.18)'); c.drawImage(images.objet,5,17,64,101);
      tuyau(c,[[15,59],[6,59],[6,79],[17,79]]); tuyau(c,[[58,59],[66,59],[66,79],[57,79]]);
      ligne(c,[[36,17],[36,7],[44,7],[44,14]],'#8d9a9a',2); ellipse(c,44,15,3,4,'#e8ede3',brun);
      arrondi(c,7,6,12,17,3,'#c6d59b');ligne(c,[[8,8],[18,8]],'#69823c',1);houblon(c,13,13,.6);
      // Éprouvette vide et densimètre rangé : accessoires, sans fausse mesure.
      arrondi(c,69,94,4,24,1,'rgba(229,242,227,.65)','#637d7b',.65);
      ligne(c,[[67,119],[75,119]],'#637d7b',.8);ligne(c,[[71,97],[71,114]],'#fff9e0',.7);
      ligne(c,[[18,123],[29,123]],'#627d79',1);ellipse(c,29,123,2,.9,'#c4d8cd');
      arrondi(c,76,10,109,106,5,'#fff9e9');
    }
    if (nom === 'bou') {
      arrondi(c,8,83,176,6,2,'#a87444');
      arrondi(c,14,89,7,19,1,'#785235'); arrondi(c,171,89,7,19,1,'#785235');
      c.drawImage(images.objet,70,12,64,68);
      tuyau(c,[[12,34],[12,21],[61,21],[61,43]]);
    }
  }

  function dynamique(nom, c, s, t, reduit) {
    if (nom === 'cuve') {
      if (s.niveau > 0) surface(c,60,35,36,11,s.couleur,true,t);
      if (s.splash > 0 && !reduit) for (let i=0;i<6;i++) ellipse(c,40+i*8,32-s.splash*9*(i%3+1)/3,1,.6,'#e8c98e');
      return;
    }
    if (nom === 'emp') {
      surface(c,73.5,54,40,12,'#bb914d',true,t);
      const event = s.evt && s.t-s.evt.t0 < 2.2 ? s.evt.id : '';
      const force = event === 'humide' ? .2 : event === 'bruleur' ? 1 : .35+s.p/5;
      flamme(c,128,111,t,force); vanne(c,120,77,s.v);
      const a=Math.PI*(.8+1.4*s.p/2.6); ligne(c,[[135,43],[135+Math.cos(a)*7,43+Math.sin(a)*7]],s.p<1.4?'#b44835':vert,1.5);
      texte(c,s.p.toFixed(1)+' bar',135,61,5.5,brun,'center');
      if (s.H > .1 && !reduit) vapeur(c,58,45,t,limite(s.H/3.5));
      const y=T=>limite(105-(T-55)/23*78,27,105);
      arrondi(c,158,y(s.cible+1),13,y(s.cible-1)-y(s.cible+1),1,'#c8d8a0',null);
      arrondi(c,162,y(s.T),5,Math.max(.1,105-y(s.T)),2,Math.abs(s.T-s.cible)<=1?'#71943c':'#c85d3f',null);
      ellipse(c,164.5,105,5,5,Math.abs(s.T-s.cible)<=1?'#71943c':'#c85d3f',brun);
      if (s.prevision != null) ligne(c,[[156,y(s.prevision)],[171,y(s.prevision)]],'#427da3',1.3);
      if(event==='fourquet') { const x=73+(reduit?0:Math.sin(t*9)*12); ligne(c,[[x,22],[x+3,65]],'#78502f',2.4); arrondi(c,x,62,7,13,2,'#b38249'); }
      if(event==='air') for(let i=0;i<3;i++) ligne(c,[[15,44+i*6],[34,43+i*6],[45,45+i*6]],'#6d9fae',1.4);
      if(event==='humide') vapeur(c,132,69,t,.8);
      return;
    }
    if (nom === 'fil') {
      surface(c,58.5,54,43,15,s.colmate?'#79502e':'#ba945b',true,t);
      arrondi(c,33,70,47,24,4,'#eee2ba');
      arrondi(c,35,83,43,9,1,s.colmate?'#6d4426':'#bb945a',null);
      const eau=limite(s.niveau/10)*11;
      if(eau>0) arrondi(c,35,83-eau,43,eau,1,'rgba(92,164,183,.65)',null);
      if(s.colmate) ligne(c,[[38,86],[47,88],[56,85],[67,88],[75,86]],brun,1);
      const h=limite(s.volumeFraction)*31;
      if(h>0) arrondi(c,142,112-h,36,h,2,s.couleur,null);
      ligne(c,[[140,85],[180,85]],vert,.8);
      vanne(c,109,99,s.u);
      if(s.t>0&&s.u>.02&&!s.colmate) ligne(c,[[122,108],[124,115],[139,116]],s.couleur,1.3);
      if(s.rince) for(let i=0;i<8;i++){const a=reduit?.4:(t*3+i/8)%1; ellipse(c,27+i*8,33+a*15,.6,1.7,'#91c8d4');}
      if(s.t-s.ratisse<1&&s.t>0){const x=48+(reduit?0:Math.sin(t*8)*10); ligne(c,[[x,18],[x+7,56],[x-3,58],[x+16,54]],'#78502f',2);}
      if(s.niveau<=0) texte(c,'Lit à sec',58,67,6,'#a53925','center');
      return;
    }
    if (nom === 'ebu') {
      surface(c,98,42,43,13,s.couleur,false,t);
      const chaleur=s.t>0?1:s.chauffe||0;
      if(chaleur>0){flamme(c,88,110,t,chaleur); if(!reduit){vapeur(c,79,31,t,chaleur); for(let i=0;i<9;i++){const a=(t*1.8+i*.37)%1; ellipse(c,64+(i*17)%68,42+Math.sin(i)*7-a*3,1+a,1+a*.5,'rgba(255,239,186,.7)');}}}
      for(const chute of s.chutes||[]){if(!chutes.has(chute))chutes.set(chute,performance.now());const p=(performance.now()-chutes.get(chute))/650;if(p<1)houblon(c,limite(chute.x,60,130),reduit?40:5+p*38,.8);}
      vanne(c,164,82,chaleur);
      return;
    }
    if (nom === 'fer') {
      vanne(c,7,66,Math.max(0,-s.e),'#629fb4'); vanne(c,66,66,Math.max(0,s.e),'#cf6749');
      if(Math.abs(s.e)>.05) { c.strokeStyle=s.e<0?'rgba(70,154,191,.65)':'rgba(213,103,63,.65)';c.lineWidth=3; c.beginPath();c.ellipse(37,62,20,5,0,0,Math.PI*2);c.stroke(); }
      if(s.chuteDH!=null&&s.t-s.chuteDH<1.6)for(let i=0;i<3;i++)houblon(c,28+i*5,reduit?14:4+(s.t-s.chuteDH)*16,.65);
      if(s.activite>.05&&!reduit)ellipse(c,44,16-((t*2)%1)*5,1,1,'#8eb7bd');
      const gx=86,gy=24,gw=90,gh=75,tMin=Math.min(s.consigne-6,4),tMax=s.consigne+10;
      const Y=T=>gy+gh-(T-tMin)/(tMax-tMin)*gh;
      c.save();c.beginPath();c.rect(gx,gy,gw,gh);c.clip();
      for(let j=0;j<=7;j++)ligne(c,[[gx+j/7*gw,gy],[gx+j/7*gw,gy+gh]],'#e7d8b8',.5);
      for(let x=0;x<gw;x++){const cible=s.cible(x/gw*7);c.fillStyle='#dbe4bc';c.fillRect(gx+x,Y(cible+1.5),1,Y(cible-1.5)-Y(cible+1.5));}
      for(const [a,b,m,n] of [[1.5,3.2,-2,1],[4.2,6,-1,2]]) if(s.houblons.some(h=>h.min===m)){
        c.fillStyle='rgba(105,148,54,.2)';c.fillRect(gx+a/7*gw,gy,(b-a)/7*gw,gh);
        if(s.dhJours&&s.dhJours[n]!=null)ligne(c,[[gx+s.dhJours[n]/7*gw,gy],[gx+s.dhJours[n]/7*gw,gy+gh]],vert,1.5);
      }
      for(const point of s.histo)ellipse(c,gx+point.j/7*gw,Y(point.T),.8,.8,Math.abs(point.T-s.cible(point.j))<=1.5?vert:'#bd5034');
      ligne(c,[[gx+s.t/18*gw,gy],[gx+s.t/18*gw,gy+gh]],'#b76535',1);
      c.restore();
      texte(c,'TEMPÉRATURE',130,19,5.5,brun,'center'); texte(c,tMax+'°',79,28,4.5); texte(c,tMin+'°',79,99,4.5);
      texte(c,'J0',86,109,5);texte(c,'J7',176,109,5,brun,'right');
      texte(c,'Cible '+s.consigne+' °C',37,124,5.5,brun,'center');
      return;
    }
    if (nom === 'bou') {
      if(s.rempli>0&&s.rempli<1){
        const i=Math.min(7,Math.floor(s.rempli*8)),x=i<4?17+i*13:132+(i-4)*13;
        c.beginPath();c.moveTo(61,43);c.bezierCurveTo(69,36,x+4,35,x+4,45);c.strokeStyle='#795631';c.lineWidth=1.5;c.stroke();
        ligne(c,[[x+4,45],[x+4,49]],s.couleur,1);
      }
      for(let i=0;i<8;i++) {
        const x=i<4?17+i*13:132+(i-4)*13, y=48, brise=(s.eclats||[]).includes(i);
        if(brise){ellipse(c,x+4,83,6,1.6,s.couleur);for(let k=0;k<4;k++)ligne(c,[[x+k*3,80],[x+k*3+2,76+k%2],[x+k*3+3,81]],'#527648',.9);continue;}
        const p=limite((s.rempli??1)*8-i);
        ellipse(c,x+4,y+35,6,1.4,'rgba(59,42,30,.17)');
        const bouteille=new Path2D();bouteille.moveTo(x+2,y);bouteille.lineTo(x+6,y);bouteille.lineTo(x+6,y+9);bouteille.quadraticCurveTo(x+9,y+12,x+9,y+16);bouteille.lineTo(x+9,y+32);bouteille.quadraticCurveTo(x+9,y+35,x+4,y+35);bouteille.quadraticCurveTo(x,y+35,x,y+32);bouteille.lineTo(x,y+16);bouteille.quadraticCurveTo(x,y+12,x+2,y+9);bouteille.closePath();
        c.save();c.fillStyle='rgba(74,114,61,.35)';c.fill(bouteille);c.save();c.clip(bouteille);c.fillStyle=s.couleur;c.globalAlpha=.85;c.fillRect(x,y+35-p*30,9,p*30);c.globalAlpha=1;
        if(p>0&&!reduit)for(let k=0;k<3;k++)ellipse(c,x+2+k*2,y+33-((t*8+k*6)%(Math.max(1,p*25))),.45,.7,'#ffeac0');
        c.restore();c.strokeStyle=brun;c.lineWidth=.9;c.stroke(bouteille);ligne(c,[[x+2,y+15],[x+2,y+29]],'rgba(255,255,229,.7)',.8);
        arrondi(c,x+1.2,y+20,6.5,7,1,'#f4e3bd',null);ligne(c,[[x+2.8,y+23.5],[x+6.2,y+23.5]],'#967344',.6);
        if(p>=1)arrondi(c,x+1,y-1,6,2,.5,cuivre,brun,.6);c.restore();
      }
    }
  }

  // Retourne false pendant le chargement ou si l'asset requis manque : le
  // contrôleur peut alors exécuter exactement son dessin historique.
  function dessiner(nom, ctx, etat, redessiner) {
    const cfg=configurations[nom]; if(!cfg||!ctx||!I)return false;
    const canvas=ctx.canvas;
    let vue=vues.get(canvas);
    if(!vue){vue={};vues.set(canvas,vue);}
    vue.redessiner=redessiner;
    const images=charger(nom,canvas,vue);
    if(!images)return false;
    if(!visible(canvas))return true;
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2.5);
    const w=Math.max(1,Math.round(rect.width*dpr)),h=Math.max(1,Math.round(w*cfg.h/cfg.w));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;vue.fond=null;}
    canvas.classList.add('canvas-illustre');
    if(!vue.fond){
      const fond=document.createElement('canvas');fond.width=w;fond.height=h;
      const c=fond.getContext('2d');c.setTransform(w/cfg.w,0,0,h/cfg.h,0,0);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
      statique(nom,c,images,cfg.w,cfg.h);vue.fond=fond;
    }
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,w,h);ctx.drawImage(vue.fond,0,0);
    ctx.setTransform(w/cfg.w,0,0,h/cfg.h,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    dynamique(nom,ctx,etat,media.matches?0:(etat.t||0),media.matches);
    return true;
  }
  function rendre(nom, ctx, etat, redessiner) {
    const cfg=configurations[nom];if(!cfg||!ctx)return false;
    if(vues.get(ctx.canvas)?.erreur)return false;
    try { return dessiner(nom,ctx,etat,redessiner); }
    catch(e) {
      const canvas=ctx.canvas,vue=vues.get(canvas);
      if(vue){vue.erreur=true;vue.fond=null;}
      canvas.width=cfg.w;canvas.height=cfg.h;canvas.classList.remove('canvas-illustre');
      canvas.dataset.illustrationErreur='dessin';
      return false;
    }
  }
  // Un retour à l'onglet ou le défilement doit peindre l'état actuel même si
  // l'animation décorative est désactivée. Aucun temps de jeu n'est piloté ici.
  const repeindre=()=>document.querySelectorAll('.canvas-illustre').forEach(canvas=>{const vue=vues.get(canvas);if(visible(canvas))vue?.redessiner?.();});
  addEventListener('resize',repeindre,{passive:true});
  document.addEventListener('visibilitychange',repeindre);
  document.addEventListener('scroll',repeindre,{capture:true,passive:true});
  media.addEventListener?.('change',repeindre);
  window.AteliersIllustres=Object.freeze({rendre});
})();
