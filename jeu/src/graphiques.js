/* Instruments de lecture : données existantes uniquement, aucun modèle scientifique. */
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg', cache=new WeakMap(),sources=new Map();
  const horsVue=v=>{const r=v.svg.getBoundingClientRect();return document.hidden||v.svg.closest('[hidden]')||r.bottom<0||r.top>innerHeight;};
  const C={encre:'#3b2a1e',papier:'#f6ead0',grille:'#bca982',chaleur:'#a55224',froid:'#244f72',cible:'#416c28'};
  const n=(v,d=1)=>Number(v).toLocaleString('fr-FR',{maximumFractionDigits:d});
  function node(tag,attrs={},text){const e=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);if(text!=null)e.textContent=text;return e;}
  function graphe(canvas,id,titre,legende,hauteur=210){
    let v=cache.get(canvas);if(v)return v;
    const cadre=document.createElement('figure');cadre.className='graphique';cadre.id='graphique-'+id;
    const cap=document.createElement('figcaption');cap.textContent=titre;
    const svg=node('svg',{viewBox:`0 0 320 ${hauteur}`,role:'img','aria-label':titre});
    const desc=document.createElement('p');desc.className='legende-graphique';desc.textContent=legende;
    cadre.append(cap,svg,desc);const controles=canvas.closest('.geste')?.querySelector('.geste-controles');(controles || canvas.closest('.geste-scene')).after(cadre);v={svg,cap,desc,cle:''};cache.set(canvas,v);return v;
  }
  function txt(svg,x,y,label,anchor='start',color=C.encre){svg.append(node('text',{x,y,'text-anchor':anchor,fill:color},label));}
  function line(svg,points,color,width=1.5,dash=''){svg.append(node('polyline',{points:points.map(p=>p.join(',')).join(' '),fill:'none',stroke:color,'stroke-width':width,'stroke-linejoin':'round','stroke-linecap':'round','stroke-dasharray':dash}));}
  function badge(svg,x,y,label,color=C.chaleur){const w=label.length*6.5+16;x=Math.max(1,Math.min(x,319-w));y=Math.max(18,Math.min(160,y));svg.append(node('rect',{x,y:y-15,width:w,height:23,rx:8,fill:C.papier,stroke:color,'stroke-width':1.5}));txt(svg,x+8,y+1,label,'start',C.encre);}
  function fermentation(canvas,s){
    const v=graphe(canvas,'fermentation','Température · fermentation','Cuivre : température observée · vert : cible ± 1,5 °C. Repères DH : ajouts réels de houblon.');
    if(horsVue(v))return;
    // Une clé de lecture évite de reconstruire le SVG quand le dernier échantillon n'a pas changé.
    const dernier=s.histo.at(-1),cle=[s.histo.length,dernier?.T,s.dhJours?.[1],s.dhJours?.[2],s.consigne].join('|');if(cle===v.cle)return;v.cle=cle;
    const svg=v.svg;svg.replaceChildren();const x=42,y=30,w=245,h=125,min=Math.min(s.consigne-6,4),max=s.consigne+10;
    const X=j=>x+j/7*w,Y=t=>y+h-(t-min)/(max-min)*h;
    txt(svg,6,18,'°C');txt(svg,287,192,'jours','end');
    for(let j=0;j<=7;j++){line(svg,[[X(j),y],[X(j),y+h]],C.grille,.5);txt(svg,X(j),177,'J'+j,'middle');}
    for(let k=0;k<=4;k++){let t=min+(max-min)*k/4;line(svg,[[x,Y(t)],[x+w,Y(t)]],C.grille,.5);txt(svg,x-7,Y(t)+4,n(t,0),'end');}
    // Marches exactes : le repos à J5 conserve sa discontinuité, aucune spline sur la cible.
    const hauts=[],bas=[];for(let k=0;k<=140;k++){const j=k/20,act=s.cible(j),avant=s.cible(Math.max(0,j-.00001));if(act!==avant){hauts.push([X(j),Y(avant+1.5)]);bas.unshift([X(j),Y(avant-1.5)]);}hauts.push([X(j),Y(act+1.5)]);bas.unshift([X(j),Y(act-1.5)]);}
    svg.append(node('polygon',{points:[...hauts,...bas].map(p=>p.join(',')).join(' '),fill:'#5aa83a',opacity:'.18'}));
    line(svg,hauts,C.cible,1,'4 3');line(svg,bas,C.cible,1,'4 3');
    for(const [numero,minute] of [[1,-2],[2,-1]])if(s.houblons.some(h=>h.min===minute)&&s.dhJours?.[numero]!=null){const px=X(s.dhJours[numero]);line(svg,[[px,y],[px,y+h]],C.froid,1.5,'2 4');txt(svg,Math.min(px+3,264),24,'DH'+numero,'start',C.froid);}
    if(s.histo.length){const pts=s.histo.map(p=>[X(p.j),Y(p.T)]);line(svg,pts,C.chaleur,2.5);const p=pts.at(-1);svg.append(node('circle',{cx:p[0],cy:p[1],r:3.5,fill:C.chaleur}));badge(svg,p[0]-26,p[1]-12,n(dernier.T)+' °C');svg.setAttribute('aria-label',`Température au jour ${n(dernier.j)} : ${n(dernier.T)} °C ; cible ${n(s.cible(dernier.j))} °C.`);}
  }
  const series={tetes:['Têtes','#9b392c'],esters:['Esters','#8b4f83'],terpenes:['Terpènes','#416c28'],cereale:['Céréale','#79511b'],queues:['Queues','#244f72'],furfural:['Furfural','#7b481f']};
  function tracerRepasse(canvas,s){
    if(!s.expert)return;
    const v=graphe(canvas,'repasse','Repasse · composition du distillat','Congénères : × seuil de perception, échelle logarithmique. Degré : % vol. Les traits verticaux marquent les coupes réelles.',240);
    if(horsVue(v))return;
    const dernier=s.courbe.at(-1),cle=[s.courbe.length,dernier?.recup,s.coupes.length].join('|');if(cle===v.cle)return;v.cle=cle;
    const svg=v.svg;svg.replaceChildren();const x=40,y=34,w=238,h=135,X=f=>x+f*w,Y=q=>y+h-(Math.log10(Math.max(.01,Math.min(100,q)))+2)/4*h,Yd=d=>y+h-d/100*h;
    txt(svg,4,16,'× seuil (log)');txt(svg,314,16,'% vol','end');
    for(const q of [.01,.1,1,10,100]){line(svg,[[x,Y(q)],[x+w,Y(q)]],C.grille,.5);txt(svg,x-5,Y(q)+4,n(q,2),'end');}
    for(const f of [0,.25,.5,.75,1]){line(svg,[[X(f),y],[X(f),y+h]],C.grille,.5);txt(svg,X(f),190,n(f*100,0),'middle');txt(svg,285,Yd(f*100)+4,n(f*100,0));}
    for(const [key,[label,color]] of Object.entries(series)){line(svg,s.courbe.map(p=>[X(p.recup),Y(p[key])]),color,1.7);}
    line(svg,s.courbe.map(p=>[X(p.recup),Yd(p.degre)]),C.encre,2.5,'5 2');
    for(const q of s.coupes)line(svg,[[X(q.recup),y],[X(q.recup),y+h]],C.encre,1,'2 3');
    if(dernier){svg.append(node('circle',{cx:X(dernier.recup),cy:Yd(dernier.degre),r:3,fill:C.encre}));badge(svg,X(dernier.recup)-40,Yd(dernier.degre)-10,n(dernier.degre)+' % vol',C.encre);}
    txt(svg,160,213,'Alcool initial recueilli (%)','middle');
    if(!v.legende){v.legende=document.createElement('div');v.legende.className='legende-series';for(const [label,color] of [...Object.values(series),['Degré (tirets)',C.encre]]){const span=document.createElement('span');span.style.setProperty('--serie',color);span.textContent=label;v.legende.append(span);}v.svg.after(v.legende);}
    svg.setAttribute('aria-label',dernier?`Repasse : ${n(dernier.recup*100)} % d'alcool recueilli, degré ${n(dernier.degre)} % vol. Congénères en multiples du seuil de perception, logarithmique.`:'Repasse : historique encore vide.');
  }
  function co2(s){
    const parent=document.querySelector('#bou-infos');if(!parent)return;let e=document.querySelector('#graphique-co2');
    if(!e){e=document.createElement('figure');e.id='graphique-co2';e.className='graphique';parent.after(e);}
    // Normalisation visuelle seulement : les nombres proviennent du calcul existant de maj().
    const max=Math.max(5,s.co2,s.cible),pct=q=>Math.max(0,Math.min(100,q/max*100));
    e.innerHTML=`<figcaption>Carbonatation · vol. CO₂</figcaption><div class="comparateur-co2" role="meter" aria-label="CO₂ calculé" aria-valuemin="0" aria-valuemax="${max}" aria-valuenow="${s.co2}" aria-valuetext="${n(s.co2)} volumes de CO₂, cible ${n(s.cible)}"><i style="width:${pct(s.co2)}%"></i><b style="left:${pct(s.cible)}%" title="Cible"></b></div><p>${n(s.co2)} vol. calculés · cible ${n(s.cible)} vol.<br>${n(s.resid,2)} vol. déjà dissous · ${n(s.sucre)} g/L de sucre</p>`;
  }
  function lecture(nom,canvas,s){if(canvas.closest('[hidden]'))return;sources.set(canvas,{nom,s});if(nom==='fer')fermentation(canvas,s);else if(nom==='rep')tracerRepasse(canvas,s);}
  let attendu=false;const repeindre=()=>{if(attendu)return;attendu=true;requestAnimationFrame(()=>{attendu=false;for(const [canvas,{nom,s}] of sources)if(!canvas.closest('[hidden]'))lecture(nom,canvas,s);});};
  document.addEventListener('scroll',repeindre,{capture:true,passive:true});addEventListener('resize',repeindre,{passive:true});document.addEventListener('visibilitychange',repeindre);
  window.GraphiquesJeu=Object.freeze({atelier(nom,canvas,s){if(nom==='fer')lecture(nom,canvas,s);},repasse(canvas,s){if(s.expert)lecture('rep',canvas,s);},co2});
})();
