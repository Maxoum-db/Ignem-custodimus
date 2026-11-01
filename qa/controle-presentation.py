#!/usr/bin/env python3
"""Compare visuellement main et la phase 0, teste le toucher réel et file://.

python qa/controle-presentation.py --reference /tmp/ignem-main.html
"""
import argparse
import json
import time
from pathlib import Path
from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright, expect, Error

parser = argparse.ArgumentParser()
parser.add_argument('--reference', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent
repo = root.parent
fixture = json.loads((root / 'sauvegardes/main-v0.8.1.json').read_text())
report = {'errors': [], 'captures_identiques': False, 'toucher_chromium': False, 'fichier_autonome': False}

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    c = b.new_context(viewport={'width':390,'height':844}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion='reduce')
    c.route('https://**/*', lambda r:r.abort())
    c.add_init_script('localStorage.setItem("ignem.v1", ' + json.dumps(json.dumps(fixture)) + ')')
    for label, url in [('avant','http://127.0.0.1:8000/reference-main.html'), ('apres','http://127.0.0.1:8000/dist/index.html')]:
        page = c.new_page()
        page.on('pageerror', lambda e:report['errors'].append(str(e)))
        page.route('**/reference-main.html', lambda r:r.fulfill(path=str(args.reference), content_type='text/html'))
        start = time.monotonic()
        page.goto(url, wait_until='domcontentloaded')
        if label == 'apres':
            report['demarrage_local_ms'] = round((time.monotonic() - start) * 1000)
        page.locator('#lieux [aria-label="Brasserie"]').tap()
        page.wait_for_timeout(150)
        page.screenshot(path=str(root / 'captures' / ('comparaison-' + label + '.png')))
    diff = ImageChops.difference(Image.open(root / 'captures/comparaison-avant.png').convert('RGB'), Image.open(root / 'captures/comparaison-apres.png').convert('RGB'))
    assert diff.getbbox() is None, 'Écart visuel entre les sources main et phase 0'
    report['captures_identiques'] = True

    # Vrais événements Touch Chromium aux coordonnées du bouton, à DPR 2.
    page.locator('#btn-lancer').tap()
    page.locator('#tuto-passer').tap()
    page.locator('#emp-go').tap()
    button = page.locator('#emp-vapeur')
    button.scroll_into_view_if_needed()
    box = button.bounding_box()
    session = c.new_cdp_session(page)
    session.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':box['x'] + box['width']/2, 'y':box['y'] + box['height']/2}]})
    expect(button).to_have_class('btn btn-feu btn-geste actif')
    session.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})
    expect(button).not_to_have_class('btn btn-feu btn-geste actif')
    report['toucher_chromium'] = True

    # Le HTML autonome s'ouvre et sauvegarde aussi sans serveur de jeu.
    filepage = c.new_page()
    filepage.on('pageerror', lambda e:report['errors'].append(str(e)))
    try:
        filepage.goto((repo / 'dist/index.html').as_uri(), wait_until='domcontentloaded')
        expect(filepage.locator('#ecran-domaine')).to_be_visible()
        filepage.locator('#lieux [aria-label="Brasserie"]').tap()
        filepage.locator('[data-ajouter="malt"]').first.tap()
        filepage.wait_for_timeout(350)
        state = json.loads(filepage.evaluate('localStorage.getItem("ignem.v1")'))
        assert len(state['recette']['malts']) > len(fixture['recette']['malts'])
        report['fichier_autonome'] = True
    except Error as e:
        if 'ERR_BLOCKED_BY_ADMINISTRATOR' not in str(e):
            raise
        report['limite_file_url'] = 'file:// interdit par la politique administrateur du Chromium fourni ; test non exécuté.'
    assert not report['errors'], report['errors']
    b.close()

(root / 'resultats-presentation.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
