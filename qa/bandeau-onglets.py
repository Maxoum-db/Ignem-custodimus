#!/usr/bin/env python3
"""Vérification du bandeau visible dès l'entrée et épinglé pendant le défilement."""
import json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent;OUT=ROOT/'bandeau-onglets';(OUT/'captures').mkdir(parents=True,exist_ok=True)
fixture=json.loads((ROOT/'sauvegardes/main-v0.8.1.json').read_text());legacy=json.loads((ROOT/'sauvegardes/legacy-avant-v0.8.json').read_text());reference=subprocess.check_output(['git','show','579606a:dist/index.html']);report={'errors':[],'checks':[],'positions':[]}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for avant in [True,False]:
  c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion='reduce');c.add_init_script('localStorage.setItem("ignem.v1",'+json.dumps(json.dumps(legacy))+')')
  if avant:c.route('**/index.html',lambda r:r.fulfill(body=reference,content_type='text/html'))
  pg=c.new_page();pg.on('pageerror',lambda e:report['errors'].append(str(e)));pg.goto('http://127.0.0.1:8000/dist/index.html');pg.locator('#lieux [aria-label="Brasserie"]').tap()
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').tap()
  pg.wait_for_timeout(80)
  if avant:
   pg.screenshot(path=str(OUT/'captures/avant-entree.png'));pg.locator('#scene').evaluate('(e)=>e.scrollTo({top:400,behavior:"instant"})');pg.screenshot(path=str(OUT/'captures/avant-defile.png'));c.close();continue
  def controle():
   r=pg.evaluate('''()=>{const scene=document.querySelector('#scene').getBoundingClientRect(),b=document.querySelector('.bandeau-mesures').getBoundingClientRect();return{largeur:innerWidth,scroll:document.querySelector('#scene').scrollTop,scene_top:scene.top,bandeau_top:b.top,bandeau_bottom:b.bottom};}''')
   assert abs(r['bandeau_top']-r['scene_top'])<1,r
   assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert pg.locator('#scene').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
   report['positions'].append(r)
  for largeur in [320,390,720]:
   pg.set_viewport_size({'width':largeur,'height':844})
   for top in [0,160,550,100000]:
    pg.locator('#scene').evaluate('(e,t)=>e.scrollTo({top:t,behavior:"instant"})',top);pg.wait_for_timeout(40);controle()
   pg.locator('#scene').evaluate('(e)=>e.scrollTo({top:0,behavior:"instant"})');pg.screenshot(path=str(OUT/'captures'/('apres-'+str(largeur)+'.png')))
  pg.set_viewport_size({'width':390,'height':844})
  for onglet in ['malts','houblons','levure','eau','aromates','procede','cuve']:
   pg.locator('[data-onglet="'+onglet+'"]').tap();pg.wait_for_timeout(30)
   assert pg.locator('[data-onglet="'+onglet+'"]').get_attribute('aria-selected')=='true'
   assert pg.locator('#onglets [style*="background-image"],#onglets .icone-famille,#onglets img').count()==0
  pg.locator('#tab-malts').tap();avant_kg=pg.locator('.charge-v').inner_text();pg.locator('[data-ajouter="malt"]').first.tap();assert pg.locator('.charge-v').inner_text()!=avant_kg
  pg.locator('#scene').evaluate('(e)=>e.scrollTo({top:450,behavior:"instant"})');controle();pg.screenshot(path=str(OUT/'captures/apres-defile.png'))
  # Le pH reste un vrai bouton qui ouvre sa fiche d'eau.
  ph=pg.locator('#mesures .mesure').filter(has_text='pH');ph.tap();assert pg.locator('#ecran-fiches').is_visible()
  pg.locator('[data-aller="domaine"].marque').tap();pg.locator('#lieux [aria-label="Pigeonnier"]').tap()
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').tap()
  pg.locator('[data-pigonglet="achats"]').tap()
  for cat in ['cereales','houblons','levures','eau','aromates','auxiliaires','futs','grimoire']:
   pg.locator('[data-cat="'+cat+'"]').tap();pg.wait_for_timeout(20)
   assert pg.locator('[data-cat="'+cat+'"]').get_attribute('aria-selected')=='true'
   assert pg.locator('#cat-onglets .icone-famille,#cat-onglets [style*="background-image"],#cat-onglets img').count()==0
  # Les grandes illustrations restent présentes, conformément à la précision utilisateur.
  assert pg.locator('#panorama-boutique').is_visible()
  pg.locator('[data-aller="domaine"].marque').tap();pg.locator('#lieux [aria-label="Alambic Ulysse"]').tap();assert pg.locator('#ulysse').is_visible()
  report['checks']=['Bandeau aligné au haut de la scène dès l’entrée et aux quatre positions de scroll, en 320/390/720','Sept onglets de recette et huit onglets fournisseurs : texte seul, sélections fonctionnelles après rerendu','Ajout tactile de malt, mesures actualisées et pH ouvrant la vraie fiche','Grandes illustrations et scènes de travail conservées']
  c.close()
 b.close()
assert not report['errors'],report['errors'];(OUT/'resultats.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
