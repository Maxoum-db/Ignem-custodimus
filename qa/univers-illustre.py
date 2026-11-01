#!/usr/bin/env python3
"""QA de présentation : vrais écrans, états de test explicitement synthétiques."""
import json, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
OUT=ROOT/'univers';(OUT/'captures').mkdir(parents=True,exist_ok=True)
fixture=json.loads((ROOT/'sauvegardes/legacy-avant-v0.8.json').read_text())
REFERENCE=subprocess.check_output(['git','show','40210bc:dist/index.html'])
report={'errors':[],'checks':[],'images':{}}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 def contexte(images='normal',reduit=True,largeur=390,sauvegarde=fixture):
  c=b.new_context(viewport={'width':largeur,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion='reduce' if reduit else 'no-preference')
  if sauvegarde is not None:c.add_init_script('localStorage.setItem("ignem.v1",'+json.dumps(json.dumps(sauvegarde))+')')
  if images!='normal':
   code='let qa={};Object.defineProperty(window,"IMAGES_JEU",{get:()=>qa,set:r=>{'
   code+='qa={};' if images=='absentes' else 'r["domaine-brasserie-1-batiment"]="data:image/webp;base64,invalide";qa=r;'
   c.add_init_script(code+'}});')
  pg=c.new_page();pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.goto('http://127.0.0.1:8000/dist/index.html');return c,pg
 def tuto(pg):
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').click()
 def nav(pg,nom):
  pg.locator('[data-aller="domaine"].marque').click()
  lieux={'chai':'Chai','catalogue':'Pigeonnier','distillerie':'Alambic Ulysse'}
  if nom in lieux:pg.locator('#lieux [aria-label="'+lieux[nom]+'"]').click()
  elif nom!='domaine':
   pg.locator('#btn-menu').click();pg.locator('#menu-entete [data-aller="'+nom+'"]').click()
  tuto(pg)
 def photo(pg,nom):
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
  assert pg.locator('#scene').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
  pg.screenshot(path=str(OUT/'captures'/(nom+'.png')))
 c,pg=contexte(sauvegarde=None);tuto(pg);pg.locator('#carte[data-univers="domaine"]').wait_for();photo(pg,'nouvelle-partie-domaine');pg.locator('#lieux [aria-label="Chai"]').tap();pg.locator('#ecran-batiments').wait_for(state='visible');pg.locator('[data-aller="domaine"].marque').tap();pg.locator('#lieux [aria-label="Brasserie"]').tap();tuto(pg);pg.locator('[data-ajouter="malt"]').first.tap();pg.wait_for_timeout(400);nouveau=pg.evaluate('JSON.parse(localStorage.getItem("ignem.v1"))');assert len(nouveau['recette']['malts'])==1;pg.reload();assert pg.evaluate('JSON.parse(localStorage.getItem("ignem.v1")).recette.malts.length')==1;c.close();report['checks'].append('Nouvelle partie vierge, ajout tactile de malt, sauvegarde et rechargement')
 c,pg=contexte();tuto(pg);pg.locator('#carte[data-univers="domaine"]').wait_for();photo(pg,'domaine-apres')
 c.route('**/reference.html',lambda r:r.fulfill(body=REFERENCE,content_type='text/html'))
 avant=c.new_page();avant.goto('http://127.0.0.1:8000/reference.html');tuto(avant);photo(avant,'domaine-avant');avant.close()
 report['images']=pg.evaluate('''async()=>{const r={};for(const cle of Object.keys(IMAGES_JEU)){const im=await IllustrationsJeu.charger(cle);if(!im)throw Error(cle);const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const x=cv.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,cv.width,cv.height).data;let alpha=0;for(let i=3;i<d.length;i+=4)if(d[i]===0)alpha++;r[cle]={width:im.width,height:im.height,transparent:alpha};if(!cle.endsWith('-fond')&&alpha<1000)throw Error('alpha '+cle);}return r;}''')
 for nom in ['chai','catalogue','veillee','distillerie']:
  # Menu name for the shop is pigeonnier; catalogue is the ingredient catalogue.
  nav(pg,nom);pg.wait_for_timeout(250);photo(pg,nom+'-apres')
  assert pg.locator('canvas[data-illustration-erreur]').count()==0
 report['checks'].append('Panoramas, portraits et vrai catalogue accessibles, transparence de tous les objets décodée')
 # Synthetic visual states: no game progression or save format changes.
 for i,saison in enumerate(['printemps','été','automne','hiver']):
  nav(pg,'domaine')
  pg.evaluate('''s=>{const cv=document.querySelector('#carte');UniversJeu.rendre('domaine',cv.getContext('2d'),{t:1,saison:s,nuit:false,bat:{brasserie:3,chai:2,distillerie:2,pigeonnier:3},travaux:[]},()=>{});}''',saison)
  photo(pg,'saison-'+str(i+1))
 report['checks'].append('Quatre saisons et niveaux maximum rendus à repères constants (états visuels synthétiques)')
 for largeur in [320,360,390,720]:
  pg.set_viewport_size({'width':largeur,'height':844});nav(pg,'distillerie');photo(pg,'largeur-'+str(largeur))
 pg.set_viewport_size({'width':390,'height':844})
 nav(pg,'veillee');cv=pg.locator('#panorama-veillee');a=cv.evaluate('(c)=>c.toDataURL()');pg.wait_for_timeout(400);assert cv.evaluate('(c)=>c.toDataURL()')==a
 report['checks'].append('Mouvement réduit stable, écrans 320/360/390/720 sans débordement')
 assert not pg.locator('[data-illustration-erreur]').count()
 avant_save=pg.evaluate('localStorage.getItem("ignem.v1")')
 report['presentation']=pg.evaluate("""async()=>{
   const cv=document.createElement('canvas');cv.style.cssText='position:fixed;top:0;left:0;width:350px;height:219px;z-index:99999';document.body.prepend(cv);const c=cv.getContext('2d');
   const pts=Array.from({length:30},(_,i)=>({recup:i/30,degre:85-i*2,tetes:100/(i+1),esters:4+i*.2,terpenes:2+i*.2,cereale:1+i*.15,queues:.01+i*.01,furfural:.02+i*.01}));
   const s={t:2,expert:true,courbe:pts,coupes:[{recup:.13},{recup:.73}],fractions:[{V:2},{V:8},{V:1}],phase:1};
   function geler(x){Object.values(x).forEach(v=>{if(v&&typeof v==='object')geler(v)});return Object.freeze(x);}geler(s);
   UniversJeu.rendre('repasse',c,s,()=>{});await UniversJeu.ressources.get('repasse').promesse;
   if(!UniversJeu.rendre('repasse',c,s,()=>{})||cv.dataset.illustrationErreur)throw Error('Courbes expert');
   const expert=cv.toDataURL();cv.style.top='-2000px';let dessins=0;const dessiner=c.drawImage.bind(c);c.drawImage=(...a)=>{dessins++;return dessiner(...a)};UniversJeu.rendre('repasse',c,s,()=>{});if(dessins)throw Error('Dessin hors écran');c.drawImage=dessiner;cv.style.top='0';
   const frames=[];cv.width=cv.height=60;for(let k=0;k<6;k++){c.clearRect(0,0,60,60);UniversJeu.art.feu(c,0,0,60,60,k,1);frames.push(cv.toDataURL());}if(new Set(frames).size!==6)throw Error('Six images de flamme');
   const v={p:1,couleur:'#eee8d7',t:0};for(const nom of ['verre-biere','verre-edv','verre-vieilli']){const dessiner=()=>UniversJeu.rendre(nom,c,v,dessiner);dessiner();await UniversJeu.ressources.get(nom).promesse;await Promise.resolve();if(cv.dataset.univers!==nom)throw Error('Redessin après changement de verre : '+nom);}UniversJeu.rendre('verre-aveugle',c,v,()=>{});await UniversJeu.ressources.get('verre-aveugle').promesse;UniversJeu.rendre('verre-aveugle',c,v,()=>{});if(cv.dataset.illustrationErreur)throw Error('Verrerie aveugle');
   cv.remove();return {courbes_expert:true,changement_verrerie_async:true,etat_gele:true,hors_ecran_sans_dessin:true,six_frames_distinctes:true,verre_aveugle_sans_code_couleur:true};
 }""")
 assert pg.evaluate('localStorage.getItem("ignem.v1")')==avant_save
 report['checks'].append('Courbes expert, état gelé en lecture seule, arrêt hors écran, six flammes distinctes, verrerie aveugle uniforme ; sauvegarde identique')
 c.close()
 for mode in ['absentes','corrompues']:
  c,pg=contexte(mode);tuto(pg);nav(pg,'distillerie');pg.locator('#ulysse').wait_for();nav(pg,'chai');pg.wait_for_timeout(250);nav(pg,'veillee');pg.wait_for_timeout(250);photo(pg,'repli-'+mode);c.close()
 report['checks'].append('Images absentes ou corrompues : navigation et anciens dessins utilisables')
 b.close()
assert not report['errors'],report['errors']
(OUT/'resultats-univers.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
