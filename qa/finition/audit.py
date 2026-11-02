#!/usr/bin/env python3
"""Captures du vrai jeu ; horloge Playwright et fixtures QA, aucun moteur modifié."""
import argparse,copy,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[2]
a=argparse.ArgumentParser();a.add_argument('--sortie',type=Path,required=True);a.add_argument('--largeur',type=int,default=390);a.add_argument('--hauteur',type=int,default=844);a.add_argument('--reprise',action='store_true');o=a.parse_args();o.sortie.mkdir(parents=True,exist_ok=True)
rapport={'viewport':[o.largeur,o.hauteur],'captures':[],'errors':[],'limites':['Défrichage : aucune action existante ; terrains libres et travaux capturés.'],'fixtures':'États QA dérivés des sauvegardes main ; aucun compte ou fichier data/ modifié.'}
if o.reprise:rapport=json.loads((o.sortie/'rapport.json').read_text())
base=json.loads((ROOT/'qa/sauvegardes/legacy-avant-v0.8.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':o.largeur,'height':o.hauteur},device_scale_factor=1,is_mobile=o.largeur<500,has_touch=True,reduced_motion='reduce');pg=c.new_page();pg.set_default_timeout(5000);pg.on('pageerror',lambda e:rapport['errors'].append(str(e)));pg.clock.install(time='2026-06-15T12:00:00Z');pg.clock.pause_at('2026-06-15T12:00:01Z');c.add_init_script('let qaSeed=2026;Math.random=()=>((qaSeed=qaSeed*16807%2147483647)-1)/2147483646;');pg.goto('http://127.0.0.1:8000/dist/index.html')
 def tick(ms=32):pg.clock.run_for(ms)
 def photo(nom,scroll=True):
  tick();pg.evaluate('document.fonts.ready')
  if scroll:pg.locator('#scene').evaluate('(e)=>e.scrollTo({top:0,behavior:"instant"})')
  pg.screenshot(path=str(o.sortie/(nom+'.jpg')),type='jpeg',quality=85)
  r=pg.evaluate('({largeur:document.documentElement.scrollWidth,scene:document.querySelector("#scene").scrollWidth,visible:Array.from(document.querySelectorAll("section.ecran")).filter(e=>!e.hidden).map(e=>e.id)})');rapport['captures'].append({'etat':nom,**r});(o.sortie/'rapport.json').write_text(json.dumps(rapport,ensure_ascii=False,indent=2)+'\n');print(nom,flush=True)
 def click(s):pg.locator(s).first.click();tick()
 def tuto():
  if pg.locator('#tuto-voile').is_visible():click('#tuto-passer')
 def load(s):
  if s is None:pg.evaluate('localStorage.removeItem("ignem.v1")')
  else:pg.evaluate('(s)=>localStorage.setItem("ignem.v1",JSON.stringify(s))',s)
  pg.reload();tick(80)
 def save():tick(300);return pg.evaluate('JSON.parse(localStorage.getItem("ignem.v1"))')
 def nav(nom):
  click('.marque[data-aller="domaine"]');tuto()
  lieux={'brasserie':'Brasserie','distillerie':'Alambic Ulysse','chai':'Chai','catalogue':'Pigeonnier'}
  if nom in lieux:click('#lieux [aria-label="'+lieux[nom]+'"]')
  elif nom=='recherche':click('.btn-loupe[data-aller="recherche"]')
  elif nom!='domaine':click('#btn-menu');click('#menu-entete [data-aller="'+nom+'"]')
  tuto()
 def capture_info(nom):
  els=pg.locator('section.ecran:not([hidden]) [data-info]')
  if els.count():els.first.click();photo(nom,False);pg.locator('section.ecran:not([hidden]) h1').first.click();tick()
 if not o.reprise:
  # État neuf et voile/mentor réels.
  load(None);photo('tutoriel-demarrage',False);tuto();photo('domaine-nouvelle-partie');click('#lieux [aria-label="Brasserie"]');photo('tutoriel-lise',False);tuto();load(base);tuto()
  complet=save();complet.update(ecus=3000,points=600,son=False,bat={'brasserie':3,'distillerie':2,'chai':2,'pigeonnier':3});complet['vente']['rep']=80
  for i,saison in enumerate(['printemps','ete','automne','hiver']):
   for nuit in [False,True]:
    s=copy.deepcopy(complet);s['cal']['s']=i*13;load(s);tuto();pg.clock.set_system_time('2026-06-15T'+('23' if nuit else '12')+':00:00Z');nav('domaine');photo('domaine-'+saison+('-nuit' if nuit else '-jour'))
  pg.clock.set_system_time('2026-06-15T12:00:00Z');load(complet);tuto();click('#btn-menu');photo('menu-entete',False);click('#btn-menu')
  # Vrais travaux depuis un terrain libre, aucune règle ajoutée.
  travaux=copy.deepcopy(complet);travaux['bat']['distillerie']=0;load(travaux);tuto();nav('batiments');photo('batiments-construction');click('[data-construire="distillerie"]');photo('batiments-travaux');nav('domaine');photo('domaine-travaux');load(complet);tuto()
  nav('brasserie');photo('brasserie-composition');capture_info('bulle-information')
  for ong in ['malts','houblons','levure','eau','aromates','procede','cuve']:
   click('[data-onglet="'+ong+'"]');photo('brasserie-onglet-'+ong)
  click('#style-ligne');photo('style-detail');click('#style-ligne')
  if pg.locator('#btn-viser').is_visible():
   click('#btn-viser');photo('fenetre-style-vise',False);click('[data-viser]');tick(200);photo('plan-lise');
  nav('recherche');pg.locator('#rech-champ').fill('agrumes');tick(200);photo('recherche-ingredients')
  nav('brasserie');photo('bandeau-mesures');click('#btn-lancer');tuto()
  # Chaque geste : début, cours et bilan, par les commandes et l'horloge réelles.
  for prefix,nom,duree in [('emp','empatage',19500),('fil','filtration',25000),('ebu','ebullition',22500),('fer','fermentation',19500)]:
   photo(nom+'-debut');click('#'+prefix+'-go')
   if prefix=='emp':pg.locator('#emp-vapeur').dispatch_event('pointerdown',{'pointerType':'touch','pointerId':1})
   tick(5000);photo(nom+'-cours')
   if prefix=='emp':pg.locator('#emp-vapeur').dispatch_event('pointerup',{'pointerType':'touch','pointerId':1})
   if prefix=='fil':pg.locator('#fil-debit').fill('65')
   if prefix=='ebu' and pg.locator('#ebu-jeter').is_enabled():click('#ebu-jeter')
   tick(duree)
   if pg.locator('#'+prefix+'-suite').is_visible():photo(nom+'-bilan');click('#'+prefix+'-suite')
   else:rapport['limites'].append(nom+': bilan non atteint');click('#'+prefix+'-passer')
   tuto()
  photo('bouteille-debut');click('#bou-go');tick(600);photo('bouteille-cours');tick(1800);photo('bouteille-bilan');click('#bou-suite');tuto();photo('jury-biere');photo('jury-fiche',False);biere=save();(o.sortie/'apres-brassin.json').write_text(json.dumps(biere,ensure_ascii=False,indent=2)+'\n')
  # Dry hop : variante de recette QA (même export scientifique).
  dh=copy.deepcopy(complet);h=dh['recette']['houblons'][0]['id'];dh['recette']['houblons'] += [{'id':h,'g':100,'min':-2},{'id':h,'g':100,'min':-1}];load(dh);tuto();nav('brasserie');click('#btn-lancer');tuto()
  for pre in ['emp','fil','ebu']:click('#'+pre+'-passer');tuto()
  click('#fer-go');tick(6000);photo('fermentation-dryhop-attente')
  if pg.locator('#fer-houblon').is_visible() and pg.locator('#fer-houblon').is_enabled():click('#fer-houblon');photo('fermentation-dryhop-ajout')
  tick(6500)
  if pg.locator('#fer-houblon').is_enabled():click('#fer-houblon')
  tick(6500);photo('fermentation-dryhop-bilan')
  # Distillation réelle, mode gestuel expert et fractions automatiques pour l'aveugle.
  dist=copy.deepcopy(complet);dist['mode']='expert';dist['gestesExpert']=True;dist['carnet'][0]['stockL']=1000;reserve=copy.deepcopy(dist['carnet'][0]);reserve.update(id=reserve['id']+'-reserve',stockL=500);dist['carnet'].append(reserve);load(dist);tuto();nav('distillerie');photo('ulysse-choix');click('[data-biere]');click('#btn-distiller');tuto();photo('brouillis-debut');click('#bro-go');click('#bro-buche');tick(6000);photo('brouillis-cours');tick(22000)
  if pg.locator('#bro-suite').is_visible():photo('brouillis-bilan');click('#bro-suite')
  else:click('#bro-passer')
  tuto();photo('repasse-expert-debut');click('#rep-go');tick(4500);photo('repasse-expert-cours');click('#rep-couper');tick(12000);click('#rep-couper');tick(4000);click('#rep-couper');photo('repasse-expert-bilan')
  # La fonction Passer conserve les vraies fractions automatiques.
  if pg.locator('#rep-suite').is_visible():click('#rep-suite')
  else:click('#rep-passer')
  tuto()
  if pg.locator('#ecran-aveugle').is_visible():
   photo('aveugle-choix')
   for k in range(3):click('[data-av="'+str(k)+':'+str(k)+'"]')
   click('#aveugle-valider');photo('aveugle-bilan');click('#aveugle-valider');tuto()
  photo('jury-edv');edv=save()
  # Assurer un état aveugle sur les coupes automatiques si la chauffe manuelle l'a sauté.
  if not any(x['etat']=='aveugle-choix' for x in rapport['captures']):
   load(dist);tuto();nav('distillerie');click('[data-biere]');click('#btn-distiller');tuto();click('#bro-passer');tuto();click('#rep-passer');tuto()
   if pg.locator('#ecran-aveugle').is_visible():
    photo('aveugle-choix')
    for k in range(3):click('[data-av="'+str(k)+':'+str(k)+'"]')
    click('#aveugle-valider');photo('aveugle-bilan');click('#aveugle-valider');tuto();edv=save()
   else:rapport['limites'].append('Aveugle : fractions insuffisantes avec la fixture réelle.')
  # Mode novice, mêmes scènes et gestes.
  novice=copy.deepcopy(dist);novice['mode']='debutant';load(novice);tuto();nav('distillerie');click('[data-biere]');click('#btn-distiller');tuto();click('#bro-passer');tuto();photo('repasse-novice-debut');click('#rep-go');tick(1500);photo('repasse-novice-cours');click('#rep-couper');tick(6000);click('#rep-couper');tick(1000);click('#rep-couper');photo('repasse-novice-bilan');click('#rep-suite');tuto()
  if pg.locator('#ecran-aveugle').is_visible():click('#aveugle-passer');tuto()
  (o.sortie/'seed-edv.json').write_text(json.dumps(edv,ensure_ascii=False,indent=2)+'\n')
 else:
  edv=json.loads((o.sortie/'seed-edv.json').read_text());load(edv);tuto()
 # Chai : contenu issu de la distillation, achats et assemblage par les commandes.
 load(edv);tuto();nav('chai');photo('chai-vue');photo('mentor-firmin',False);click('[data-fut]');photo('chai-fut-vide')
 if pg.locator('[data-remplir]').count():
  click('[data-remplir]');photo('chai-fut-rempli');pg.locator('#fut-ans').fill('4');photo('chai-prevision');click('[data-attendre="52"]');photo('chai-vieilli');click('#fut-sortir');photo('chai-lot');lotseed=save()
  # Dupliquer un lot QA uniquement pour l'état visuel d'assemblage, pas une règle du jeu.
  if lotseed.get('chai',{}).get('lots'):
   autre=copy.deepcopy(lotseed['chai']['lots'][0]);autre['id']+='-audit';autre['nom']+=' · second lot QA';lotseed['chai']['lots'].append(autre);load(lotseed);tuto();nav('chai')
   for checkbox in pg.locator('[data-lotcoche]').all():checkbox.check();tick()
   photo('chai-assemblage-choix');click('#chai-assembler');photo('chai-assemblage-resultat');click('[data-embouteiller]');tuto();photo('jury-vieilli');edv=save()
 else:rapport['limites'].append('Chai : eau-de-vie insuffisante dans la fixture.')
 # Tous les menus, listes et bulles.
 load(edv);tuto();nav('catalogue');photo('pigeonnier-clients')
 for bouton in pg.locator('[data-conseiller]').all():
  bouton.click();tick();photo('pigeonnier-conseil')
  if pg.locator('[data-proposer]:not([disabled])').count():click('[data-proposer]:not([disabled])');photo('pigeonnier-satisfaction');break
 s=save();commande=pg.evaluate('''s=>{for(let i=0;i<52;i++){const c=Vente.commandeSemaine(s+i,80,['biere']);if(c)return c;}return null;}''',s['cal']['s'])
 if commande:s['vente']['commandes']=[commande];load(s);tuto();nav('catalogue');photo('pigeonnier-commande');click('[data-ouvrircommande]');photo('pigeonnier-commande-produits')
 click('[data-pigonglet="achats"]')
 for cat in ['cereales','houblons','levures','eau','aromates','auxiliaires','futs','grimoire']:click('[data-cat="'+cat+'"]');photo('fournisseurs-'+cat)
 nav('batiments');photo('batiments-materiel')
 if pg.locator('[data-equiper]:not([disabled])').count():click('[data-equiper]:not([disabled])');photo('toast-achat',False)
 for ecran in ['carnet','fiches','reglages','veillee']:
  nav(ecran);photo(ecran)
  if ecran=='carnet':
   for i,bt in enumerate(pg.locator('[data-bouteille]').all()[:4]):bt.click();photo('carnet-detail-'+str(i))
  if ecran=='fiches':click('#fiches-liste .fiche summary');photo('fiche-ouverte')
  if ecran=='veillee':
   click('[data-lecon]');photo('lecon-detail')
   if pg.locator('[data-commencer]').count():click('[data-commencer]')
   if pg.locator('[data-quizlecon]').count():
    click('[data-quizlecon]');photo('lecon-quiz');click('[data-replecon]');photo('lecon-quiz-reponse')
   click('[data-ongletveillee="questions"]');photo('veillee-questions');click('[data-rep]');photo('veillee-reponse')
 rapport['final']=save();rapport['termine']=True;b.close()
(o.sortie/'rapport.json').write_text(json.dumps(rapport,ensure_ascii=False,indent=2)+'\n');print('CAPTURES',len(rapport['captures']),'ERREURS',rapport['errors'],'LIMITES',rapport['limites'])
