// Vérifie le vrai HTML sous le chemin d'un projet GitHub Pages et le passage
// d'une sauvegarde entre deux origines. Fixtures isolées, aucune partie réelle.
const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const prefix='/Ignem-custodimus/';
const makeServer=()=>http.createServer((req,res)=>{
 if(req.url!==prefix){res.writeHead(404);res.end('Not found');return}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync('dist/index.html'));
});
(async()=>{
 const old=makeServer(),site=makeServer();let browser;
 await Promise.all([new Promise(r=>old.listen(0,'127.0.0.1',r)),new Promise(r=>site.listen(0,'127.0.0.1',r))]);
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  for(const width of [320,390]){
   const ctx=await browser.newContext({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
   const errors=[],requests=[];
   const urlA=`http://127.0.0.1:${old.address().port}${prefix}`,urlB=`http://127.0.0.1:${site.address().port}${prefix}`;
   const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>requests.push(r.url()));page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).pathname!=='/favicon.ico')requests.push(`HTTP ${r.status()} ${r.url()}`)});
   await page.goto(urlA);await page.locator('#ecran-domaine').waitFor({state:'visible'});
   await page.evaluate(()=>{
    window.dispatchEvent(new Event('pagehide'));
    localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:7,ecus:987,possede:[],carnet:[],grimoire:[],ecole:{},succes:{premier:'2026-11-17'},bat:{brasserie:3,chai:2,distillerie:1,pigeonnier:3},recette:{volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons:[{id:'hops_aroma_saaz',g:250,min:60}],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:60,fermentation:{temp:18,reposDiacetyle:false}}}));
   });await page.reload();await page.locator('#ecran-domaine').waitFor({state:'visible'});
   await page.locator('#btn-menu').click();await page.locator('#menu-entete [data-aller="reglages"]').click();await page.locator('[data-reglage="aide"][data-val="false"]').click();
   assert.match(await page.locator('#entete-niveau').textContent(),/987 écus/);
   const backup=await page.evaluate(()=>{window.dispatchEvent(new Event('pagehide'));return localStorage.getItem('ignem.v1')});
   const before=JSON.parse(backup);assert.equal(before.points,150);assert.equal(before.brassins,7);assert.equal(before.ecus,987);
   await page.goto(urlB);await page.locator('#ecran-domaine').waitFor({state:'visible'});
   assert.notEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')||'null')?.points),150,'Le changement d’origine ne transporte pas la partie automatiquement');
   await page.evaluate(raw=>{const s=JSON.parse(raw);if(!s||typeof s!=='object'||Array.isArray(s)||!s.recette)throw new Error('Sauvegarde invalide');window.dispatchEvent(new Event('pagehide'));localStorage.setItem('ignem.v1',JSON.stringify(s))},backup);
   await page.reload();await page.locator('#ecran-domaine').waitFor({state:'visible'});assert.equal(await page.evaluate(()=>DomaineIllustre.ready),true);
   const after=await page.evaluate(()=>{window.dispatchEvent(new Event('pagehide'));return JSON.parse(localStorage.getItem('ignem.v1'))});
   for(const key of ['points','brassins','ecus','recette','bat','carnet','succes'])assert.deepEqual(after[key],before[key],key+' conservé');
   assert.match(await page.locator('#entete-niveau').textContent(),/987 écus/);assert.match(await page.locator('#entete-niveau').textContent(),/150 pts/);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.equal(await page.locator('#lieux button').count(),6);
   fs.mkdirSync('docs/captures/github-pages',{recursive:true});await page.screenshot({path:`docs/captures/github-pages/domaine-${width}.png`});
   await page.locator('#lieux').getByRole('button',{name:'Brasserie',exact:true}).click();if(await page.locator('#tuto-passer').isVisible())await page.locator('#tuto-passer').click();await page.locator('#ecran-brasserie').waitFor({state:'visible'});
   assert.equal(await page.locator('#tab-malts').getAttribute('aria-selected'),'true');await page.locator('#tab-cuve').tap();assert.equal(await page.locator('#tab-cuve').getAttribute('aria-selected'),'true');
   await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')).points),150);
   await page.goto(urlA);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')).points),150,'L’ancienne origine conserve la partie');
   assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);console.log(`✓ Pages ${width}px : chemin de projet, six accès, brasserie, aucune erreur JS/ressource, transfert et deux sauvegardes conservés`);await ctx.close();
  }
 }finally{if(browser)await browser.close();await Promise.all([new Promise(r=>old.close(r)),new Promise(r=>site.close(r))])}
})().catch(e=>{console.error(e);process.exitCode=1});
