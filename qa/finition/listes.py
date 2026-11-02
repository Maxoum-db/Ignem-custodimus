#!/usr/bin/env python3
"""Vrais déplacements de fût, prévision, pages et vente ; captures des panneaux déroulés."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2];a=argparse.ArgumentParser();a.add_argument('--sortie',type=Path,required=True);o=a.parse_args();o.sortie.mkdir(parents=True,exist_ok=True)
s=json.loads((o.sortie.parent/'390/seed-edv.json').read_text())
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce');pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.on('console',lambda e:er.append(e.text) if e.type=='error' else None);pg.clock.install(time='2026-06-15T12:00:00Z');pg.clock.pause_at('2026-06-15T12:00:01Z');pg.goto('http://127.0.0.1:8000/dist/index.html');pg.evaluate('s=>localStorage.setItem("ignem.v1",JSON.stringify(s))',s);pg.reload();pg.clock.run_for(100)
 def click(sel):pg.locator(sel).first.click();pg.clock.run_for(32)
 def ferme():
  if pg.locator('#tuto-voile').is_visible():click('#tuto-passer')
  btn=pg.locator('#mentor-actions button',has_text='Compris')
  if btn.count() and btn.is_visible():btn.click();pg.clock.run_for(32)
 def nav(n):
  click('.marque');ferme()
  if n=='chai':click('#lieux [aria-label="Chai"]')
  elif n=='catalogue':click('#lieux [aria-label="Pigeonnier"]')
  else:click('#btn-menu');click('#menu-entete [data-aller="'+n+'"]')
  ferme()
 def photo(n,sel):
  pg.locator(sel).scroll_into_view_if_needed();pg.clock.run_for(64);pg.screenshot(path=str(o.sortie/(n+'.jpg')),type='jpeg',quality=85);(o.sortie/(n+'-contrastes.json')).write_text(json.dumps(pg.evaluate((root/'qa/finition/contrastes.js').read_text()),ensure_ascii=False,indent=2))
 def save():pg.clock.run_for(300);return pg.evaluate('JSON.parse(localStorage.getItem("ignem.v1"))')
 ferme();nav('chai')
 for k in range(4):click('#chai-etendre')
 ferme();photo('chai-dix-travees','.chai-plan');dimensions=pg.locator('.chai-plan .case,.chai-plan .fut').evaluate_all('(es)=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height}))');assert all(x['w']>=44 and x['h']>=44 for x in dimensions)
 click('[data-fut]');click('#fut-deplacer');click('[data-case="0:8"]');etat=save();assert etat['chai']['futs'][0]['pos']=={'r':0,'c':8};photo('chai-deplacement','.chai-plan');click('[data-fut]');click('[data-remplir]');ferme();avant=save();pg.locator('#fut-ans').fill('4');pg.clock.run_for(64);photo('chai-prevision-detail','#apercu-chai');apres=save();assert avant['cal']==apres['cal'] and avant['chai']['futs'][0]['contenu']==apres['chai']['futs'][0]['contenu'],'La prévision ne doit ni vieillir ni modifier le contenu'
 nav('carnet');click('[data-bouteille]');photo('carnet-page-detail','#carnet-detail');nav('fiches');click('.fiche summary');photo('chimie-page-detail','.fiche[open]')
 nav('catalogue');vendu=False
 for bt in pg.locator('[data-conseiller]').all():
  bt.click();pg.clock.run_for(32)
  pro=pg.locator('[data-proposer]:not([disabled])')
  if pro.count():pro.first.click();pg.clock.run_for(64);vendu=True;break
 assert vendu;ferme();photo('satisfaction-detail','.satisfaction');v=pg.locator('.satisfaction meter').evaluate('(e)=>({valeur:e.value,min:e.min,max:e.max})');assert v['min']==0 and v['max']==1 and 0<=v['valeur']<=1
 assert pg.evaluate('document.documentElement.scrollWidth')==390;assert pg.locator('#scene').evaluate('(e)=>e.scrollWidth')<=390;assert not er,er
 (o.sortie/'verification-listes.json').write_text(json.dumps({'errors':er,'ciblesPlan44px':True,'deplacementReel':etat['chai']['futs'][0]['pos'],'previsionSansVieillissement':True,'satisfaction':v,'colonnes':etat['chai']['cols']},ensure_ascii=False,indent=2)+'\n');b.close()
