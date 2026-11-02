/* Inspection de texte réellement visible. Les fonds illustrés/gradients sont signalés séparément. */
() => {
  const rgba=v=>{const m=v.match(/^rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(/[, /]+/).filter(Boolean).map(Number);return [p[0],p[1],p[2],p[3]??1];};
  const dessus=(a,b)=>{const alpha=a[3]+b[3]*(1-a[3]);return [0,1,2].map(i=>(a[i]*a[3]+b[i]*b[3]*(1-a[3]))/Math.max(.0001,alpha)).concat(alpha);};
  const lum=c=>c.slice(0,3).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const resultat={verifies:0,defauts:[],fondsIllustres:[],petitesCibles:[]};
  const visibles=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth||e.closest('[hidden],[inert]'))return false;const scene=e.closest('#scene');if(scene){const s=scene.getBoundingClientRect();if(r.bottom<s.top||r.top>s.bottom)return false;}return getComputedStyle(e).visibility!=='hidden';};
  for(const e of document.querySelectorAll('body *')){
    if(['SCRIPT','STYLE','OPTION','svg','path','polygon','rect','polyline'].includes(e.tagName)||!visibles(e))continue;
    const txt=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();if(!txt)continue;
    const st=getComputedStyle(e),fg=rgba(e.tagName.toLowerCase()==='text'?st.fill:st.color);if(!fg)continue;
    let bg=[0,0,0,0],illustre=false,opacity=1;
    for(let p=e;p;p=p.parentElement){const style=getComputedStyle(p);opacity*=Number(style.opacity);if(style.backgroundImage!=='none'&&bg[3]<.999)illustre=true;const col=rgba(style.backgroundColor);if(col)bg=dessus(bg,col);if(bg[3]>=.999)break;}
    bg=dessus(bg,[31,26,20,1]);const couleur=dessus([fg[0],fg[1],fg[2],fg[3]*opacity],bg);const ratio=contrast(couleur,bg);const item={texte:txt.slice(0,110),selecteur:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+e.className?.toString().replace(/ /g,'.'),ratio:Math.round(ratio*100)/100,couleur:st.color,fond:bg.slice(0,3).map(Math.round),taille:st.fontSize};
    if(illustre){resultat.fondsIllustres.push(item);continue;}resultat.verifies++;if(ratio<4.49)resultat.defauts.push(item);
  }
  for(const e of document.querySelectorAll('button,input,select,summary,[data-glisser]')){if(!visibles(e))continue;const r=e.getBoundingClientRect();if(r.width<43.9||r.height<43.9)resultat.petitesCibles.push({texte:(e.textContent||e.getAttribute('aria-label')||e.id).trim().slice(0,80),id:e.id,classe:e.className,largeur:r.width,hauteur:r.height});}
  return resultat;
}
