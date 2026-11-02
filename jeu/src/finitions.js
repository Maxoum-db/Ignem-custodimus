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
  const menuStocks = document.createElement('div'); menuStocks.className='menu-ressources'; $('#menu-entete').append(menuStocks);
  const nombre = n => new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1}).format(n);
  window.Finitions = {
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
})();
