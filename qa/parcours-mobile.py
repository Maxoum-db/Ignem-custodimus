#!/usr/bin/env python3
"""QA du vrai HTML généré. Dépendance de test seulement : Playwright Python + Chromium.

python qa/parcours-mobile.py --reference /tmp/ignem-main.html
Le serveur du dépôt doit écouter sur http://127.0.0.1:8000.
Les fixtures sont des parties de test, jamais des sauvegardes d'un joueur.
"""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

args = argparse.ArgumentParser()
args.add_argument('--reference', type=Path)
args.add_argument('--url', default='http://127.0.0.1:8000/dist/index.html')
opt = args.parse_args()
root = Path(__file__).resolve().parent
(root / 'captures').mkdir(exist_ok=True)
(root / 'sauvegardes').mkdir(exist_ok=True)
report = {'viewport': '390 × 844', 'dpr': 2, 'checks': [], 'errors': []}

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    # Les polices externes ne sont pas nécessaires au fonctionnement autonome.
    context.route('https://**/*', lambda route: route.abort())
    page = context.new_page()
    page.on('pageerror', lambda error: report['errors'].append(str(error)))

    def click(selector):
        page.locator(selector).click()

    def close_tutorial():
        while page.locator('#tuto-voile').is_visible():
            click('#tuto-suivant')

    def capture(name):
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Débordement horizontal'
        assert page.locator('#scene').evaluate('(e) => e.scrollWidth <= e.clientWidth'), 'Débordement de scène'
        page.screenshot(path=str(root / 'captures' / (name + '.png')))
        report['checks'].append(name)
        print(name, flush=True)

    def navigate(name):
        click('[data-aller="domaine"].marque')
        if name in ['brasserie', 'distillerie', 'chai', 'catalogue']:
            click('#lieux [aria-label="' + {'brasserie':'Brasserie','distillerie':'Alambic Ulysse','chai':'Chai','catalogue':'Pigeonnier'}[name] + '"]')
        else:
            click('#btn-menu')
            click('#menu-entete [data-aller="' + name + '"]')
        close_tutorial()

    def save():
        page.wait_for_timeout(350)
        return json.loads(page.evaluate('localStorage.getItem("ignem.v1")'))

    if opt.reference:
        page.route('**/reference-main.html', lambda route: route.fulfill(path=str(opt.reference), content_type='text/html'))
        page.goto('http://127.0.0.1:8000/reference-main.html', wait_until='domcontentloaded')
        capture('00-main-domaine')
        page.get_by_role('button', name='Passer le tutoriel', exact=True).click()
        navigate('brasserie')
        malt = page.locator('.carte-ing').filter(has=page.get_by_text('Pilsner Soufflet Bio', exact=True)).locator('[data-ajouter="malt"]')
        for _ in range(8):
            malt.click()
        click('[data-onglet="houblons"]')
        page.locator('.carte-ing').filter(has_text='Magnum').locator('[data-ajouter="houblon"]').click()
        click('[data-onglet="levure"]')
        page.locator('.carte-ing').filter(has=page.get_by_text('Safale US-05', exact=True)).locator('[data-ajouter="levure"]').click()
        capture('01-main-recette')
        (root / 'sauvegardes' / 'main-v0.8.1.json').write_text(json.dumps(save(), ensure_ascii=False, indent=2) + '\n')
        # Un brassin réel permet au code de migration historique de préserver
        # les bâtiments d'une ancienne partie sans changer les règles.
        click('#btn-lancer')
        close_tutorial()
        click('#emp-passer')
        close_tutorial()
        click('#fil-passer')
        close_tutorial()
        click('#ebu-passer')
        close_tutorial()
        click('#fer-passer')
        close_tutorial()
        click('#bou-go')
        click('#bou-suite')
        expect(page.locator('#ecran-degustation')).to_be_visible()
        legacy = save()
        del legacy['bat']
        (root / 'sauvegardes' / 'legacy-avant-v0.8.json').write_text(json.dumps(legacy, ensure_ascii=False, indent=2) + '\n')

    fixture = json.loads((root / 'sauvegardes' / 'main-v0.8.1.json').read_text())
    page.goto(opt.url, wait_until='domcontentloaded')
    page.evaluate('(s) => localStorage.setItem("ignem.v1", JSON.stringify(s))', fixture)
    page.reload(wait_until='domcontentloaded')
    navigate('brasserie')
    assert save()['recette'] == fixture['recette'], 'La recette de main a changé'
    capture('02-reprise-recette')
    click('#btn-lancer')
    close_tutorial()
    capture('03-empatage')
    click('#emp-go')
    # Maintien tactile réel (pointerType touch), puis relâchement/cancel.
    button = page.locator('#emp-vapeur')
    button.dispatch_event('pointerdown', {'pointerType': 'touch', 'pointerId': 1})
    page.wait_for_timeout(900)
    assert 'actif' in button.get_attribute('class')
    button.dispatch_event('pointercancel', {'pointerType': 'touch', 'pointerId': 1})
    assert 'actif' not in button.get_attribute('class')
    expect(page.locator('#emp-suite')).to_be_visible(timeout=24000)
    click('#emp-suite')
    close_tutorial()
    capture('04-filtration')
    click('#fil-go')
    page.locator('#fil-debit').fill('60')
    page.locator('#fil-arroser').dispatch_event('pointerdown', {'pointerType':'touch','pointerId':2})
    page.wait_for_timeout(1500)
    page.locator('#fil-arroser').dispatch_event('pointerup', {'pointerType':'touch','pointerId':2})
    expect(page.locator('#fil-suite')).to_be_visible(timeout=38000)
    click('#fil-suite')
    close_tutorial()
    capture('05-ebullition')
    click('#ebu-go')
    expect(page.locator('#ebu-jeter')).to_be_enabled(timeout=6000)
    click('#ebu-jeter')
    expect(page.locator('#ebu-suite')).to_be_visible(timeout=24000)
    click('#ebu-suite')
    close_tutorial()
    capture('06-fermentation')
    click('#fer-go')
    for selector in ['#fer-glycol', '#fer-chauffe']:
        page.locator(selector).dispatch_event('pointerdown', {'pointerType':'touch','pointerId':3})
        page.wait_for_timeout(500)
        page.locator(selector).dispatch_event('pointerup', {'pointerType':'touch','pointerId':3})
    expect(page.locator('#fer-suite')).to_be_visible(timeout=24000)
    click('#fer-suite')
    close_tutorial()
    capture('07-embouteillage')
    page.locator('#bou-sucre').fill('5')
    click('#bou-go')
    click('#bou-suite')
    expect(page.locator('#ecran-degustation')).to_be_visible()
    capture('08-degustation')
    final = save()
    assert final['brassins'] == fixture['brassins'] + 1
    page.reload(wait_until='domcontentloaded')
    assert save()['carnet'] == final['carnet'], 'Carnet perdu après rechargement'

    # Fixture historique produite par main avec les boutons Passer du vrai jeu.
    legacy = json.loads((root / 'sauvegardes' / 'legacy-avant-v0.8.json').read_text())
    page.evaluate('(s) => localStorage.setItem("ignem.v1", JSON.stringify(s))', legacy)
    page.reload(wait_until='domcontentloaded')
    # Deuxième brassin via les commandes du jeu : stock destiné aux clients,
    # tandis que le premier brassin de la fixture passera dans Ulysse.
    navigate('brasserie')
    click('#btn-lancer')
    close_tutorial()
    for gesture in ['emp', 'fil', 'ebu', 'fer']:
        click('#' + gesture + '-passer')
        close_tutorial()
    click('#bou-go')
    click('#bou-suite')
    navigate('distillerie')
    capture('09-ulysse')
    page.locator('[data-biere]').last.click()
    click('#btn-distiller')
    close_tutorial()
    capture('10-brouillis')
    click('#bro-go')
    click('#bro-buche')
    page.locator('#bro-registre').fill('65')
    # Cette chauffe de la fixture ne contient que 100 L : le moteur conserve
    # sa charge réelle. Les coupes manuelles sont exercées ci-dessous.
    expect(page.locator('#bro-suite')).to_be_visible(timeout=60000)
    click('#bro-suite')
    close_tutorial()
    capture('11-repasse')
    click('#rep-go')
    page.wait_for_timeout(1500)
    click('#rep-couper')
    click('#rep-buche')
    page.wait_for_timeout(18000)
    click('#rep-couper')
    page.wait_for_timeout(1000)
    click('#rep-couper')
    click('#rep-suite')
    close_tutorial()
    if page.locator('#ecran-aveugle').is_visible():
        capture('12-aveugle')
        for k in range(3):
            click('[data-av="%s:%s"]' % (k,k))
        click('#aveugle-valider')
        click('#aveugle-valider')
    expect(page.locator('#ecran-degustation')).to_be_visible()
    capture('13-degustation-edv')
    navigate('chai')
    capture('14-chai')
    page.locator('[data-fut]').first.click()
    page.locator('[data-remplir]').first.click()
    click('[data-attendre="52"]')
    capture('15-chai-vieilli')
    click('#fut-sortir')
    page.locator('[data-embouteiller]').first.click()
    expect(page.locator('#ecran-degustation')).to_be_visible()
    capture('16-spiritueux-vieilli')
    navigate('catalogue')
    capture('17-boutique')
    page.locator('[data-conseiller]').first.click()
    page.locator('[data-proposer]').first.click()
    capture('18-vente')
    assert save()['vente']['vendus'] > legacy['vente']['vendus']
    for screen in ['carnet','veillee','fiches','batiments','reglages']:
        navigate(screen)
        capture('19-' + screen)
    assert not report['errors'], report['errors']
    browser.close()

(root / 'resultats-mobile.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(report, ensure_ascii=False, indent=2))
