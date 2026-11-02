#!/usr/bin/env python3
"""Mesure les peintures réelles, trajectoires, pauses et réglages de mouvement."""
import argparse,base64,json,subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--sortie',type=Path,default=ROOT/'animations');parser.add_argument('--reference',default='c3ab02a');opt=parser.parse_args()
OUT=opt.sortie;(OUT/'captures').mkdir(parents=True,exist_ok=True)
fixture=json.loads((ROOT/'sauvegardes/legacy-avant-v0.8.json').read_text())
reference=subprocess.check_output(['git','show',opt.reference+':dist/index.html'])
report={'errors':[],'checks':[],'mesures':{},'reference':opt.reference}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 def ouvrir(avant=False):
  c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion='no-preference')
  c.add_init_script('localStorage.setItem("ignem.v1",'+json.dumps(json.dumps(fixture))+')')
  pg=c.new_page();pg.on('pageerror',lambda e:report['errors'].append(str(e)))
  if avant:c.route('**/index.html',lambda r:r.fulfill(body=reference,content_type='text/html'))
  pg.goto('http://127.0.0.1:8000/dist/index.html');pg.locator('#carte[data-univers="domaine"]').wait_for()
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').tap()
  pg.evaluate('''()=>{window.peintures={};window.lise=[];const ancien=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(...a){const id=this.canvas.id;if(a.length===3)(peintures[id]??=[]).push(performance.now());if(id==='carte'&&(a[0]?.src===IMAGES_JEU['personnage-lise']||a[0]?.src===IMAGES_JEU['marche-lise'])){const m=this.getTransform();lise.push({t:performance.now(),x:m.e/(this.canvas.width/192),y:m.f/(this.canvas.height/256)});}return ancien.apply(this,a);};}''')
  return c,pg
 for avant in [True,False]:
  c,pg=ouvrir(avant);pg.wait_for_timeout(250);pg.evaluate('peintures={};lise=[]');pg.wait_for_timeout(1200)
  valeurs=pg.evaluate('({frames:peintures.carte||[],lise})');nom='avant' if avant else 'apres'
  frames=valeurs['frames'];report['mesures'][nom]={'peintures_carte':len(frames),'fenetre_ms':1200,'ecart_max_ms':round(max([b-a for a,b in zip(frames,frames[1:])]or[0]),1)}
  pg.screenshot(path=str(OUT/'captures'/('domaine-'+nom+'.png')))
  if avant:c.close();continue
  assert len(frames)>=20,'Cadence de rendu insuffisante'
  coords=valeurs['lise'];assert len(coords)>15
  assert max(v['y'] for v in coords)-min(v['y'] for v in coords)>.02,'Le personnage doit se déplacer'
  assert max(((v['x']-u['x'])**2+(v['y']-u['y'])**2)**.5 for u,v in zip(coords,coords[1:]))<1,'Saut de position'
  cdp=c.new_cdp_session(pg);cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});pg.evaluate('peintures={}');pg.wait_for_timeout(1200);report['mesures']['cpu_x4_peintures_1200ms']=pg.evaluate('(peintures.carte||[]).length');cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
  save=pg.evaluate('localStorage.getItem("ignem.v1")')
  # Capture le vrai Canvas animé ; aucun rendu indépendant du jeu.
  video=pg.evaluate('''async()=>{const cv=document.querySelector('#carte'),stream=cv.captureStream(30),rec=new MediaRecorder(stream,{mimeType:'video/webm'}),chunks=[];return await new Promise(resolve=>{rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());const a=new Uint8Array(await new Blob(chunks).arrayBuffer());let s='';for(let i=0;i<a.length;i+=8192)s+=String.fromCharCode(...a.subarray(i,i+8192));resolve(btoa(s));};rec.start();setTimeout(()=>rec.stop(),3500);});}''')
  (OUT/'domaine.webm').write_bytes(base64.b64decode(video))
  result=pg.evaluate('''()=>{const p=Object.freeze([[0,0],[4,0],[8,10],[12,10]].map(Object.freeze)),avant=JSON.stringify(p);let max=0;for(let t=0;t<80;t+=1/60){const a=UniversJeu.art.trajet(t,p,12,3),b=UniversJeu.art.trajet(t+1/60,p,12,3);max=Math.max(max,Math.hypot(a.x-b.x,a.y-b.y));}if(max>.1||JSON.stringify(p)!==avant)throw Error('Trajectoire discontinue');const cv=document.createElement('canvas');cv.width=cv.height=60;const c=cv.getContext('2d');let ecart=0;for(let k=0;k<6;k++){const pixels=[];for(const f of [k-.001,k+.001]){c.clearRect(0,0,60,60);UniversJeu.art.feu(c,0,0,60,60,f,1);pixels.push(c.getImageData(0,0,60,60).data);}let somme=0;for(let i=0;i<pixels[0].length;i++)somme+=Math.abs(pixels[0][i]-pixels[1][i]);ecart=Math.max(ecart,somme/(60*60*4*255));}if(ecart>.015)throw Error('Saut entre sprites de feu');return{pas_max_trajet:max,ecart_relatif_frontiere_feu:ecart};}''')
  report['mesures']['continuite']=result
  # Une page masquée doit se figer puis reprendre sans rattraper le temps perdu.
  pg.evaluate('''()=>{window.qaCache=false;Object.defineProperty(document,'hidden',{configurable:true,get:()=>qaCache});qaCache=true;document.dispatchEvent(new Event('visibilitychange'));window.dernierLise=lise.at(-1);peintures={};}''');pg.wait_for_timeout(500)
  assert pg.evaluate('(peintures.carte||[]).length')==0
  pg.evaluate('qaCache=false;document.dispatchEvent(new Event("visibilitychange"));lise=[]');pg.wait_for_timeout(80)
  assert pg.evaluate('Math.hypot(lise[0].x-dernierLise.x,lise[0].y-dernierLise.y)')<.5
  pg.emulate_media(reduced_motion='reduce');pg.wait_for_timeout(100);a=pg.locator('#carte').evaluate('(c)=>c.toDataURL()');pg.wait_for_timeout(250);assert pg.locator('#carte').evaluate('(c)=>c.toDataURL()')==a
  pg.emulate_media(reduced_motion='no-preference');pg.wait_for_timeout(100)
  # Le même état, gelé, distingue abeilles estivales et absence en hiver/nuit.
  report['mesures']['abeilles']=pg.evaluate('''async()=>{const cv=document.createElement('canvas');cv.style.cssText='position:fixed;left:0;top:70px;width:192px;height:256px';document.body.prepend(cv);const c=cv.getContext('2d'),r={};let n=0;const remplir=c.fill.bind(c);c.fill=(...a)=>{if(c.fillStyle==='#efc85a')n++;return remplir(...a);};for(const [nom,saison,nuit]of [['jour','été',false],['nuit','été',true],['hiver','hiver',false]]){const s=Object.freeze({t:0,saison,nuit,bat:Object.freeze({brasserie:1,chai:0,distillerie:0,pigeonnier:1}),travaux:Object.freeze([])});n=0;UniversJeu.rendre('domaine',c,s,()=>{});r[nom]=n;}cv.remove();if(r.jour!==6||r.nuit!==0||r.hiver!==0)throw Error('Activité des abeilles');return r;}''')
  assert pg.evaluate('localStorage.getItem("ignem.v1")')==save
  # Quitter le domaine annule ses peintures. La navigation peut marquer le tutoriel.
  pg.locator('#btn-menu').tap();pg.locator('#menu-entete [data-aller="veillee"]').tap()
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').tap()
  pg.locator('#panorama-veillee[data-univers]').wait_for();pg.wait_for_timeout(400);save_veillee=pg.evaluate('localStorage.getItem("ignem.v1")');pg.evaluate('peintures={}');pg.wait_for_timeout(650)
  assert pg.evaluate('(peintures.carte||[]).length')==0
  veillee=pg.evaluate('(peintures["panorama-veillee"]||[]).length');assert veillee>=15
  report['mesures']['veillee_peintures_650ms']=veillee
  pg.emulate_media(reduced_motion='reduce');pg.wait_for_timeout(100);a=pg.locator('#panorama-veillee').evaluate('(c)=>c.toDataURL()');pg.wait_for_timeout(250);assert pg.locator('#panorama-veillee').evaluate('(c)=>c.toDataURL()')==a
  assert pg.evaluate('localStorage.getItem("ignem.v1")')==save_veillee
  pg.screenshot(path=str(OUT/'captures'/'veillee.png'))
  pg.locator('[data-aller="domaine"].marque').tap();pg.locator('#lieux [aria-label="Chai"]').tap()
  if pg.locator('#tuto-voile').is_visible():pg.locator('#tuto-passer').tap()
  pg.locator('#panorama-chai[data-univers]').wait_for();pg.wait_for_timeout(350);pg.evaluate('peintures={}');pg.wait_for_timeout(250);assert pg.evaluate('(peintures["panorama-chai"]||[]).length')==0
  report['mesures']['chai_statique_sans_animation']=True
  assert pg.locator('[data-illustration-erreur]').count()==0
  assert pg.evaluate('document.documentElement.scrollWidth<=innerWidth')
  c.close()
 if opt.reference=='c3ab02a':assert report['mesures']['apres']['peintures_carte']>report['mesures']['avant']['peintures_carte']*2
 else:assert report['mesures']['apres']['peintures_carte']>=report['mesures']['avant']['peintures_carte']*.8,'Régression de cadence supérieure à 20 %'
 b.close()
assert not report['errors'],report['errors']
report['checks']=['Peintures réelles avant/après à 390×844 DPR2','Déplacements, freinage et pauses sans saut de position','Fondu continu aux six frontières de sprites de feu','Abeilles décoratives de jour hors hiver','Pause/reprise sans rattrapage, arrêt hors écran','Mouvement réduit stable, sauvegarde inchangée','Vidéo WebM du vrai Canvas du domaine']
(OUT/'resultats-animations.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False,indent=2))
