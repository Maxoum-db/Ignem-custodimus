#!/usr/bin/env python3
"""Contrôle de lecture des valeurs et captures centrées sur les instruments réels."""
import argparse,json,copy
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[2];a=argparse.ArgumentParser();a.add_argument('--sortie',type=Path,required=True);o=a.parse_args();o.sortie.mkdir(parents=True,exist_ok=True)
s=json.loads((root/'qa/sauvegardes/legacy-avant-v0.8.json').read_text());s.update(ecus=3000,points=600,son=False,bat={'brasserie':3,'distillerie':2,'chai':2,'pigeonnier':3});s['recette']['fermentation']['reposDiacetyle']=True
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},has_touch=True,is_mobile=True,reduced_motion='reduce',device_scale_factor=2);pg=c.new_page();er=[];pg.on('pageerror',lambda e:er.append(str(e)));pg.on('console',lambda e:er.append(e.text) if e.type=='error' else None);pg.clock.install(time='2026-06-15T12:00:00Z');pg.clock.pause_at('2026-06-15T12:00:01Z');pg.goto('http://127.0.0.1:8000/dist/index.html');pg.evaluate('s=>localStorage.setItem("ignem.v1",JSON.stringify(s))',s);pg.reload();pg.clock.run_for(100)
 def click(sel):pg.locator(sel).first.click();pg.clock.run_for(32)
 def ferme():
  if pg.locator('#tuto-voile').is_visible():click('#tuto-passer')
  t=pg.locator('#mentor-actions button',has_text='Passer le tutoriel')
  if t.count() and t.is_visible():t.click();pg.clock.run_for(32)
 def photo(nom,sel):
  pg.locator(sel).scroll_into_view_if_needed();pg.clock.run_for(32);pg.screenshot(path=str(o.sortie/(nom+'.jpg')),type='jpeg',quality=85,scale='css')
 ferme();click('#lieux [aria-label="Brasserie"]');ferme();click('#btn-lancer');ferme()
 for pre in ['emp','fil','ebu']:
  if pre=='fil':
   photo('filtration-cible-detail','#fil-canvas');assert 'cible 1150 L' in pg.locator('#fil-canvas').get_attribute('aria-label')
  click('#'+pre+'-passer');ferme()
 click('#fer-go');pg.clock.run_for(14000);ferme();photo('fermentation-courbe-detail','#graphique-fermentation');
 points=pg.locator('#graphique-fermentation polygon').get_attribute('points').split();xy=[tuple(map(float,x.split(','))) for x in points];vertical=any(abs(a[0]-b[0])<.0001 and abs(a[1]-b[1])>1 for a,b in zip(xy,xy[1:]));assert vertical,'Le palier de repos doit rester vertical à J5'
 pg.clock.run_for(5000);click('#fer-suite');ferme();photo('co2-comparatif','#graphique-co2');assert 'g/L' in pg.locator('#graphique-co2').inner_text();click('#bou-go');pg.clock.run_for(2000);click('#bou-suite');ferme();photo('jury-fiche-detail','#fiche-jury')
 # Reprendre la vraie sortie de distillation du parcours complet, avec sa bière réserve.
 edv=json.loads((o.sortie.parent/'390/seed-edv.json').read_text());edv.update(mode='expert',gestesExpert=True);pg.evaluate('s=>localStorage.setItem("ignem.v1",JSON.stringify(s))',edv);pg.reload();pg.clock.run_for(100);ferme();click('#lieux [aria-label="Alambic Ulysse"]');ferme();click('[data-biere]');click('#btn-distiller');ferme();click('#bro-passer');ferme();click('#rep-go');pg.clock.run_for(8000);ferme();photo('repasse-courbes-detail','#graphique-repasse');labels=pg.locator('#graphique-repasse').inner_text();assert pg.locator('#graphique-repasse polyline[stroke-dasharray="5 2"]').get_attribute('points').count(' ')>2,'Historique vide';assert 'log' in labels and '% vol' in labels and 'Alcool initial recueilli (%)' in labels
 assert not er,er
 (o.sortie/'verification.json').write_text(json.dumps({'errors':er,'palierJ5Vertical':vertical,'dpr':2,'viewport':[390,844],'co2':'valeurs lues du calcul existant','repasse':'axes et unités réelles'},ensure_ascii=False,indent=2)+'\n');b.close()
