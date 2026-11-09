// Exécuter après le build : node jeu/tests/mobile.cjs (Playwright + Chromium requis).
const {chromium} = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
 const html = fs.readFileSync(path.join(__dirname, '../../dist/index.html'));
 const server = http.createServer((req,res) => {res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html)});
 await new Promise(r => server.listen(0,'127.0.0.1',r));
 let browser;
 try {
  browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const page = await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  // Le jeu autonome doit fonctionner sans récupérer ses polices externes.
  await page.route('https://**/*',route=>route.abort());
  const url = `http://127.0.0.1:${server.address().port}`;
  await page.goto(url);
  await page.locator('#ecran-domaine').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),true,'Débordement horizontal');
  fs.mkdirSync('qa/captures',{recursive:true});
  await page.screenshot({path:'qa/captures/domaine-390x844.png'});
  await page.locator('#mentor-portrait').evaluate(async img => { await img.decode(); if(img.naturalWidth !== 512 || !img.src.startsWith('data:image/webp')) throw new Error('Portrait Lise non intégré'); });
  // Fixture de compatibilité V0.2 : absence de possede/bat/cal/vente.
  // Ce n'est pas une sauvegarde personnelle du joueur.
  const legacy={mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet:[],grimoire:[],ecole:{},succes:{},recette:{volume:1000,malts:[],houblons:[],levure:null,eau:'causse'}};
  await page.evaluate(s=>localStorage.setItem('ignem.v1',JSON.stringify(s)),legacy);
  await page.reload();
  await page.locator('#ecran-domaine').waitFor({state:'visible'});
  // Passer par la navigation existante et déclencher sa sauvegarde normale.
  await page.locator('#btn-menu').click();
  await page.locator('#menu-entete [data-aller="reglages"]').click();
  await page.locator('#ecran-reglages').waitFor({state:'visible'});
  await page.screenshot({path:'qa/captures/options-390x844.png'});
  // Une modification suivie immédiatement de pagehide doit être persistée,
  // sans attendre les 250 ms du debounce.
  const flushed = await page.evaluate(() => {
    document.querySelector('[data-reglage="aide"][data-val="true"]').click();
    window.dispatchEvent(new Event('pagehide'));
    return JSON.parse(localStorage.getItem('ignem.v1')).aide;
  });
  assert.equal(flushed,true);
  await page.reload();
  const preserved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')));
  assert.equal(preserved.points,150);assert.equal(preserved.brassins,2);
  assert.deepEqual(errors,[]);
  console.log('✓ Navigateur mobile : démarrage hors réseau, largeur, ancienne fixture, navigation options, aucune exception JS');
 } finally { if(browser) await browser.close(); await new Promise(r=>server.close(r)); }
})().catch(e=>{console.error(e);process.exitCode=1});
