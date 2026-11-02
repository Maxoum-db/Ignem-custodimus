/* Habillage DOM exclusivement. Aucune écriture dans l'état ou la sauvegarde. */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const svg = (path) => `<svg class="menu-icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  const icones = {
    domaine:'<path d="m3 11 9-8 9 8v10H3Z"/><path d="M9 21v-8h6v8"/>',
    carnet:'<path d="M4 4h7l1 2 1-2h7v16h-7l-1 1-1-1H4Z M12 6v15"/>',
    batiments:'<path d="m4 7 3-3 13 13-3 3Z M17 4l3 3-7 7 M4 20l6-6"/>',
    veillee:'<path d="M12 3c3 5-1 5 3 8 2-2 2-3 2-3 6 8 1 13-5 13S1 16 7 8c0 5 5 3 5-5Z"/>',
    fiches:'<path d="M9 3h6 M10 3v6L4 19q-1 2 2 2h12q3 0 2-2L14 9V3 M7 15h10"/>',
    reglages:'<path d="M4 5h16 M4 12h16 M4 19h16"/><circle cx="8" cy="5" r="2"/><circle cx="16" cy="12" r="2"/><circle cx="10" cy="19" r="2"/>'
  };
  $('#menu-entete').querySelectorAll('button[data-aller]').forEach(b => b.insertAdjacentHTML('afterbegin', svg(icones[b.dataset.aller] || '')));
  // Petit composant SVG frontal du plan de rangement ; panorama peint conservé.
  const faceFut='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 152"><g stroke="#3b2a1e" stroke-width="3" stroke-linejoin="round"><ellipse cx="64" cy="143" rx="54" ry="7" fill="#3b2a1e" opacity=".18" stroke="none"/><path d="M17 128H111L118 141H10Z" fill="#a87444"/><path d="M19 124L27 112H101L109 124L101 136H27Z" fill="#d2ab6e"/><ellipse cx="64" cy="68" rx="49" ry="61" fill="#6b4426"/><ellipse cx="64" cy="65" rx="46" ry="57" fill="#a9a38b"/><ellipse cx="64" cy="65" rx="40" ry="51" fill="#d3a66a"/><path d="M64 15Q105 23 104 65Q104 107 64 116Q86 94 85 65Q85 36 64 15" fill="#b5834b" stroke="none"/><g fill="none" stroke="#8b6038" stroke-width="2"><path d="M41 24Q34 65 41 107 M58 15Q54 65 58 115 M76 18Q79 65 76 112 M91 31Q98 65 91 99"/><path d="M26 57L29 52M36 88L39 83M62 32L63 40M77 86L78 93"/></g><ellipse cx="64" cy="65" rx="40" ry="51" fill="none"/><path d="M27 54Q29 27 50 20" fill="none" stroke="#f0d29c" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="75" r="6" fill="#a87444"/><path d="M60 73H68" stroke="#e2cfa4" stroke-width="2"/></g></svg>';
  document.documentElement.style.setProperty('--face-fut',`url("data:image/svg+xml,${encodeURIComponent(faceFut)}")`);
  const menuStocks = document.createElement('div'); menuStocks.className='menu-ressources'; $('#menu-entete').append(menuStocks);
  const nombre = n => new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1}).format(n);
  window.Finitions = {
    satisfaction(valeur) {
      const resultat=$('.vente-resultat');if(!resultat || !Number.isFinite(valeur))return;
      const e=document.createElement('div');e.className='satisfaction';const label=document.createElement('label');label.htmlFor='satisfaction-vente';label.textContent='Satisfaction · '+Math.round(valeur*100)+' %';const m=document.createElement('meter');m.id='satisfaction-vente';m.min=0;m.max=1;m.value=valeur;m.setAttribute('aria-label','Satisfaction après la vente');e.append(label,m);resultat.append(e);
    },
    ressources(s) {
      const h=$('#entete-niveau');
      h.replaceChildren();
      const ecus=document.createElement('span'); ecus.className='capsule'; ecus.innerHTML='<b class="ecus-entete"></b><small>écus</small>'; ecus.firstChild.textContent=nombre(s.ecus);
      const rep=document.createElement('span'); rep.className='capsule'; rep.textContent=nombre(s.reputation || 0); const label=document.createElement('small'); label.textContent='réputation'; rep.append(label); h.append(ecus,rep);
      // Stocks indépendants : pas de conversion entre L de bière et LAP d'eau-de-vie.
      const litres=s.produits.filter(x=>x.type==='biere').reduce((a,x)=>a+(x.stockL||0),0);
      const lap=s.produits.filter(x=>x.type==='edv').reduce((a,x)=>a+(x.lap||0),0);
      menuStocks.textContent=`${s.bac?'Bac à sable':nombre(s.points)+' points'} · ${nombre(litres)} L de bière · ${nombre(lap)} LAP disponibles`;
    }
  };
  const toasts=$('#toasts'); toasts.setAttribute('role','status'); toasts.setAttribute('aria-live','polite');
  new MutationObserver(()=>{while(toasts.children.length>2)toasts.firstElementChild.remove();}).observe(toasts,{childList:true});
  const actions=$('#mentor-actions');
  new MutationObserver(()=>{
    const boutons=Array.from(actions.children).filter(e=>e.tagName==='BUTTON');
    if(boutons.length>3){ const suite=document.createElement('details'); suite.className='mentor-plus'; const titre=document.createElement('summary'); titre.textContent='Autres choix'; suite.append(titre,...boutons.slice(2)); actions.append(suite); }
  }).observe(actions,{childList:true});
  new ResizeObserver(()=>document.documentElement.style.setProperty('--pied-mentor',$('#mentor').hidden?'0px':$('#mentor').offsetHeight+'px')).observe($('#mentor'));
  let jaugesPrevues=false;
  const jauges=()=>{jaugesPrevues=false;document.querySelectorAll('.jauge-feu').forEach(e=>{const niv=e.querySelector('.niv'),val=e.querySelector('.val'),barre=e.querySelector('.barre');if(!niv||!val||!barre)return;const q=parseFloat(niv.style.width);if(!Number.isFinite(q))return;barre.setAttribute('role','meter');barre.setAttribute('aria-label',e.firstElementChild?.textContent||'Jauge');barre.setAttribute('aria-valuemin','0');barre.setAttribute('aria-valuemax','100');barre.setAttribute('aria-valuenow',String(Math.min(100,Math.max(0,q))));barre.setAttribute('aria-valuetext',val.textContent);});const champ=$('#fut-ans');if(champ&&!$('#prevision-badge')){const b=document.createElement('span');b.id='prevision-badge';b.className='prevision-badge';b.textContent='PRÉVISION · ne fait pas vieillir le lot';champ.closest('.dose')?.prepend(b);}};
  new MutationObserver(()=>{if(!jaugesPrevues){jaugesPrevues=true;requestAnimationFrame(jauges);}}).observe($('#scene'),{childList:true,subtree:true});
  const nomsFuts={BOU:'Ex-bourbon',FR:'Chêne français',DOM:'Chêne du domaine',CAH:'Cahors',SHY:'Sherry',ARM:'Armagnac',TRB:'Tourbé'};
  let cartesPrevues=false;
  function cartes(){
    cartesPrevues=false;
    document.querySelectorAll('.cases').forEach(e=>{const cols=e.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1];if(cols)e.style.setProperty('--travees',cols);});
    document.querySelectorAll('.chai-plan').forEach(e=>{if(e.previousElementSibling?.classList.contains('chai-aide'))return;const aide=document.createElement('p');aide.className='chai-aide';aide.textContent='Plan du chai · fais glisser pour voir toutes les travées.';e.before(aide);const legend=document.createElement('div');legend.className='legende-futs';for(const ab of new Set(Array.from(e.querySelectorAll('.fut-abr'),n=>n.textContent.trim()))){const n=document.createElement('span');n.textContent=ab+' : '+(nomsFuts[ab]||ab);legend.append(n);}e.after(legend);});
    document.querySelectorAll('.zone-lib').forEach(e=>{if(e.dataset.finition)return;e.dataset.finition='1';const r=e.closest('[data-zone]')?.dataset.zone,nom={haut:'Haut',milieu:'Milieu',bas:'Bas',0:'Haut',1:'Milieu',2:'Bas'}[r];if(nom)e.prepend(nom+' · ');});
    document.querySelectorAll('.niveaux').forEach(e=>{if(e.dataset.finition)return;e.dataset.finition='1';const lib=document.createElement('span');lib.className='niveau-lib';lib.textContent='Niveau '+e.querySelectorAll('.plein').length+'/'+e.querySelectorAll('i').length;e.setAttribute('aria-label',lib.textContent);e.after(lib);});
    document.querySelectorAll('.gravite').forEach(e=>{if(e.dataset.finition)return;const q=(e.textContent.match(/■/g)||[]).length;e.dataset.finition='1';e.setAttribute('role','img');e.setAttribute('aria-label','Gravité '+q+' sur 3');e.replaceChildren();for(let k=0;k<3;k++){const g=document.createElement('i');g.classList.toggle('plein',k<q);g.setAttribute('aria-hidden','true');e.append(g);}});
    // Composition chimique exacte : ne réécrit ni nombres, ni formules scientifiques.
    document.querySelectorAll('.fiche code').forEach(e=>{if(e.dataset.finition)return;e.dataset.finition='1';const t=e.textContent;if(!/[₂₃₄]/.test(t))return;const frag=document.createDocumentFragment();for(const part of t.split(/([₂₃₄])/)){if(/[₂₃₄]/.test(part)){const sub=document.createElement('sub');sub.textContent=part;frag.append(sub);}else frag.append(document.createTextNode(part));}e.replaceChildren(frag);});
  }
  new MutationObserver(()=>{if(!cartesPrevues){cartesPrevues=true;requestAnimationFrame(cartes);}}).observe($('#scene'),{childList:true,subtree:true});
})();
