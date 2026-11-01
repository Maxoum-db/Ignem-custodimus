#!/usr/bin/env python3
"""QA ciblée des vrais ateliers : assets, repli, tactile, DPR et mouvement réduit.
Utilise Playwright Python, Chromium système et le serveur du dépôt sur :8000.
"""
import gzip
import json
import subprocess
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'phase-1'
(OUT / 'captures').mkdir(parents=True, exist_ok=True)
FIXTURE = json.loads((ROOT / 'sauvegardes/main-v0.8.1.json').read_text())
HTML = (ROOT.parent / 'dist/index.html').read_bytes()
REFERENCE = subprocess.check_output(['git','show','b892b92:dist/index.html'])
report = {'errors': [], 'checks': [], 'images': {}, 'performance_simulee': {}}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])

    def contexte(reduit=False, images='normal', fixture=FIXTURE):
        c = browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion='reduce' if reduit else 'no-preference')
        c.add_init_script('localStorage.setItem("ignem.v1", ' + json.dumps(json.dumps(fixture)) + ')')
        if images == 'erreur-canvas':
            c.add_init_script('CanvasRenderingContext2D.prototype.drawImage=function(){throw new Error("Erreur de rendu injectée par la QA")};')
        elif images != 'normal':
            code = 'let imagesQA={};Object.defineProperty(window,"IMAGES_JEU",{get:()=>imagesQA,set:(r)=>{'
            code += 'imagesQA={};' if images=='absentes' else 'r["a-cuve-vide"]="data:image/webp;base64,invalide";imagesQA=r;'
            c.add_init_script(code+'}});')
        page=c.new_page()
        page.on('pageerror',lambda e:report['errors'].append(str(e)))
        page.goto('http://127.0.0.1:8000/dist/index.html',wait_until='load')
        return c,page

    def fermer_tuto(page):
        if page.locator('#tuto-voile').is_visible():page.locator('#tuto-passer').tap()

    def ouvrir(page):
        page.locator('#lieux [aria-label="Brasserie"]').tap()

    def photo(page,nom):
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        assert page.locator('#scene').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
        page.screenshot(path=str(OUT/'captures'/(nom+'.png')))

    c,page=contexte()
    ouvrir(page)
    page.locator('#cuve.canvas-illustre').wait_for()
    assert page.evaluate('document.fonts.check(\'20px "Lilita One"\')')
    report['checks'].append('Police Lilita One intégrée, sans requête externe')
    # Décodage réel, dimensions et vrais pixels transparents.
    report['images']=page.evaluate('''async()=>{
      const r={};
      for(const cle of ['a-cuve-vide','b-filtre-vide','d-fermenteur-vide','e-capsuleuse']){
        const image=await IllustrationsJeu.charger(cle);
        if(!image)throw new Error(cle+' ne se décode pas');
        const cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;
        const ctx=cv.getContext('2d');ctx.drawImage(image,0,0);
        const pixels=ctx.getImageData(0,0,cv.width,cv.height).data;
        let transparents=0,opaques=0;
        for(let i=3;i<pixels.length;i+=4){if(pixels[i]===0)transparents++;if(pixels[i]>240)opaques++;}
        if(transparents<1000||opaques<1000)throw new Error(cle+' : alpha invalide');
        if(Math.max(image.width,image.height)>512)throw new Error(cle+' trop grande');
        r[cle]={largeur:image.width,hauteur:image.height,pixels_transparents:transparents};
      }return r;
    }''')
    # Le drop réel reste accessible pendant le défilement des ingrédients.
    page.locator('#tab-malts').tap()
    poignee=page.locator('.carte-ing').filter(has_text='Pilsner Soufflet Bio').locator('.poignee')
    poignee.scroll_into_view_if_needed()
    b=poignee.bounding_box(); cible=page.locator('#cuve-zone').bounding_box()
    avant=float(page.locator('.charge-v').inner_text().split()[0].replace(',','.'))
    page.mouse.move(b['x']+b['width']/2,b['y']+b['height']/2)
    page.mouse.down();page.mouse.move(cible['x']+cible['width']/2,cible['y']+cible['height']/2,steps=12);page.mouse.up()
    apres=float(page.locator('.charge-v').inner_text().split()[0].replace(',','.'))
    assert apres>avant,'Le dépôt sur la cuve doit ajouter du malt'
    report['checks'].append('Glisser-déposer vers la vraie cuve après défilement')
    page.locator('#btn-lancer').tap();fermer_tuto(page)
    page.locator('#emp-canvas.canvas-illustre').wait_for()
    page.locator('#emp-go').tap()
    bouton=page.locator('#emp-vapeur');bouton.scroll_into_view_if_needed();b=bouton.bounding_box()
    session=c.new_cdp_session(page)
    session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':b['x']+b['width']/2,'y':b['y']+b['height']/2}]})
    expect(bouton).to_have_class('btn btn-feu btn-geste actif')
    page.wait_for_timeout(250)
    session.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]})
    expect(bouton).not_to_have_class('btn btn-feu btn-geste actif')
    report['checks'].append('Maintien et annulation par vrais événements Touch Chromium')
    # Une scène située hors du viewport ne doit plus être dessinée.
    page.set_viewport_size({'width':390,'height':260})
    page.evaluate('''()=>{const cv=document.querySelector('#emp-canvas'),ctx=cv.getContext('2d'),original=ctx.drawImage;window.peinturesQA=0;ctx.drawImage=function(...args){window.peinturesQA++;return original.apply(this,args)};document.querySelector('#scene').scrollTo({top:10000,behavior:'instant'});}''')
    page.wait_for_timeout(100)
    assert page.locator('#emp-canvas').bounding_box()['y']+page.locator('#emp-canvas').bounding_box()['height'] <= 0
    avant=page.evaluate('peinturesQA');page.wait_for_timeout(180);assert page.evaluate('peinturesQA')==avant
    report['checks'].append('Aucune peinture lorsque le Canvas actif est hors écran')
    c.close()

    # Repli réellement exercé avec le bundle du jeu, sans images, puis avec une image corrompue.
    for mode in ['absentes','corrompues','erreur-canvas']:
        c,page=contexte(images=mode);ouvrir(page);page.wait_for_timeout(150)
        assert not page.locator('#cuve').evaluate('(e)=>e.classList.contains("canvas-illustre")')
        if mode=='erreur-canvas':assert page.locator('#cuve').get_attribute('data-illustration-erreur')=='dessin'
        page.locator('#btn-lancer').tap();fermer_tuto(page)
        page.locator('#emp-go').tap();expect(page.locator('#emp-vapeur')).to_be_enabled()
        assert page.locator('#emp-canvas').get_attribute('width')=='192'
        photo(page,'repli-'+mode)
        report['checks'].append('Dessin historique et gestes accessibles, images '+mode)
        c.close()

    # Images avant/après sur les mêmes recettes ; dans le nouveau jeu les décorations au repos sont stables.
    for label,html in [('avant',REFERENCE),('apres',HTML)]:
        c=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion='reduce')
        c.add_init_script('localStorage.setItem("ignem.v1", '+json.dumps(json.dumps(FIXTURE))+')')
        c.route('https://**/*',lambda r:r.abort())
        page=c.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
        page.route('**/comparaison.html',lambda r:r.fulfill(body=html,content_type='text/html'))
        page.goto('http://127.0.0.1:8000/comparaison.html');ouvrir(page)
        if label=='apres':page.locator('#cuve.canvas-illustre').wait_for()
        page.locator('#scene').evaluate('(e)=>e.scrollTop=0');photo(page,label+'-recette')
        page.locator('#btn-lancer').tap()
        for nom in ['emp','fil','ebu','fer','bou']:
            fermer_tuto(page)
            if label=='apres':page.locator('#'+nom+'-canvas.canvas-illustre').wait_for()
            page.locator('#scene').evaluate('(e)=>e.scrollTop=0')
            photo(page,label+'-'+nom)
            if label=='apres':
                cv=page.locator('#'+nom+'-canvas')
                initial=cv.evaluate('(e)=>e.toDataURL()');page.wait_for_timeout(80)
                assert cv.evaluate('(e)=>e.toDataURL()')==initial,'Animation décorative en mouvement réduit : '+nom
            if nom!='bou':page.locator('#'+nom+'-passer').tap()
        c.close()
    report['checks'].append('Captures comparatives A–E et décors stables avec prefers-reduced-motion')

    c,page=contexte(reduit=True);ouvrir(page);page.locator('#cuve.canvas-illustre').wait_for()
    for largeur in [320,360,390,720]:
        page.set_viewport_size({'width':largeur,'height':844});page.wait_for_timeout(80)
        photo(page,'largeur-'+str(largeur))
        mesures=page.locator('#cuve').evaluate('(e)=>({pixels:e.width,css:e.getBoundingClientRect().width})')
        assert abs(mesures['pixels']-mesures['css']*2)<2
    report['checks'].append('Largeurs 320, 360, 390 et 720 px sans débordement ; backing store DPR 2')
    c.close()

    # Vraie réponse HTTP gzip, sans interception : CDP limite réellement le transfert.
    corps_gzip=gzip.compress(HTML)
    class ServeurGzip(BaseHTTPRequestHandler):
        def do_GET(self):
            if self.path.endswith('favicon.ico'):
                self.send_response(204);self.end_headers();return
            self.send_response(200)
            self.send_header('Content-Type','text/html; charset=utf-8')
            self.send_header('Content-Encoding','gzip')
            self.send_header('Content-Length',str(len(corps_gzip)))
            self.end_headers();self.wfile.write(corps_gzip)
        def log_message(self,*args):pass
    serveur=ThreadingHTTPServer(('127.0.0.1',0),ServeurGzip)
    threading.Thread(target=serveur.serve_forever,daemon=True).start()
    c=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
    page=c.new_page();page.on('pageerror',lambda e:report['errors'].append(str(e)))
    session=c.new_cdp_session(page);session.send('Network.enable');session.send('Network.emulateNetworkConditions',{'offline':False,'latency':150,'downloadThroughput':200000,'uploadThroughput':100000,'connectionType':'cellular4g'});session.send('Emulation.setCPUThrottlingRate',{'rate':4})
    page.goto('http://127.0.0.1:'+str(serveur.server_port)+'/index.html',wait_until='load')
    dcl=page.evaluate('performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd')
    page.get_by_role('button',name='Passer le tutoriel',exact=True).tap();ouvrir(page)
    page.locator('#cuve.canvas-illustre').wait_for()
    report['performance_simulee']={'gzip_octets':len(corps_gzip),'dom_content_loaded_ms':round(dcl),'atelier_pret_ms':round(page.evaluate('performance.now()')),'profil':'Vrai HTTP gzip ; 150 ms RTT, 1,6 Mbit/s, CPU ×4, cache navigateur vide. Simulation Chromium, pas un Android physique.'}
    c.close()
    serveur.shutdown();serveur.server_close()
    assert not report['errors'],report['errors']
    browser.close()

(OUT/'resultats-graphiques.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False,indent=2))
