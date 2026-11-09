const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
const html=fs.readFileSync('dist/index.html','utf8');
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(q.url==='/fallback'?html.replace('/* Carte illustrée :',"delete window.IMAGES_JEU['domaine-ferme'];\n/* Carte illustrée :"):html)});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
 await page.addInitScript(()=>{Date.prototype.getHours=()=>12;});
 const url=`http://127.0.0.1:${server.address().port}`;await page.goto(url);assert.equal(await page.evaluate(()=>DomaineIllustre.ready),true);await page.waitForFunction(()=>document.querySelector('#carte').classList.contains('domaine-illustre'));
 fs.mkdirSync('qa/captures/domaine',{recursive:true});await page.screenshot({path:'qa/captures/domaine/nouvelle-partie.png'});
 const seed={mode:'expert',gestesExpert:true,aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet:[],grimoire:[],ecole:{},succes:{},ecus:500,bat:{brasserie:3,chai:2,distillerie:2,pigeonnier:3},travaux:[],equip:{grille:true},cal:{s:15}};
 await page.evaluate(s=>localStorage.setItem('ignem.v1',JSON.stringify(s)),seed);await page.reload();await page.evaluate(()=>DomaineIllustre.ready);await page.waitForFunction(()=>document.querySelector('#lieux').dataset.rendu==='illustre');
 await page.screenshot({path:'qa/captures/domaine/domaine-developpe.png'});
 for(const [saison,week]of [['automne',28],['hiver',42]]){
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  await page.evaluate(s=>localStorage.setItem('ignem.v1',JSON.stringify(s)),{...seed,cal:{s:week}});await page.reload();await page.evaluate(()=>DomaineIllustre.ready);await page.waitForFunction(()=>document.querySelector('#lieux').dataset.rendu==='illustre');
  assert.equal(await page.locator('#carte').getAttribute('data-saison'),saison);await page.screenshot({path:'qa/captures/domaine/'+saison+'.png'});
 }
 const original=await page.locator('#carte').evaluate(c=>c.toDataURL());await page.waitForTimeout(150);assert.equal(await page.locator('#carte').evaluate(c=>c.toDataURL()),original,'Reduced motion instable');
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.waitForTimeout(100);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const sizes=await page.locator('#lieux button').evaluateAll(bs=>bs.map(b=>{const r=b.getBoundingClientRect();return {w:r.width,h:r.height}}));assert.equal(sizes.length,6);for(const b of sizes){assert.ok(b.w>=44&&b.h>=44,'Cible trop petite');}
 }
 await page.setViewportSize({width:390,height:844});
 const states=await page.evaluate(()=>{
  const c=document.querySelector('#carte').getContext('2d');const base={saison:'été',nuit:false,bat:{brasserie:3,chai:2,distillerie:2,pigeonnier:3},travaux:[],equip:{grille:true}};
  const samples=[base,{...base,bat:{brasserie:1,chai:0,distillerie:0,pigeonnier:1}},{...base,travaux:[{bat:'chai'}]},{...base,nuit:true},...['printemps','automne','hiver'].map(saison=>({...base,saison}))];
  const before=JSON.stringify(samples);const outputs=samples.map(s=>{DomaineIllustre.render(c,0,s);return c.canvas.toDataURL()});return {distinct:new Set(outputs).size,unchanged:before===JSON.stringify(samples),count:samples.length,dpr:c.canvas.width/cssWidth(c.canvas)};
  function cssWidth(cv){return cv.getBoundingClientRect().width}
 });assert.equal(states.distinct,states.count);assert.ok(states.unchanged);assert.ok(Math.abs(states.dpr-2)<.01);
 await page.reload();await page.evaluate(()=>DomaineIllustre.ready);
 for(const [name,screen]of [['Brasserie','brasserie'],['Chai','chai'],['Alambic Ulysse','distillerie'],['Pigeonnier','catalogue'],['Leçons','veillee']]){
  await page.locator('#lieux').getByRole('button',{name,exact:true}).click();await page.locator('#ecran-'+screen).waitFor({state:'visible'});if(await page.locator('#tuto-voile').isVisible())await page.locator('#tuto-passer').click();await page.locator('#retour-entete').click();
  await page.locator('#ecran-domaine').waitFor({state:'visible'});
 }
 await page.locator('#lieux').getByRole('button',{name:'Rucher, bientôt',exact:true}).click();assert.ok((await page.locator('#mentor-texte').textContent()).includes('extension'));
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));await page.evaluate(s=>localStorage.setItem('ignem.v1',JSON.stringify({...s,bat:{brasserie:1,chai:0,distillerie:0,pigeonnier:1},travaux:[{bat:'chai',niv:1,fin:20}]})),seed);await page.reload();await page.evaluate(()=>DomaineIllustre.ready);await page.screenshot({path:'qa/captures/domaine/travaux.png'});await page.locator('#lieux').getByRole('button',{name:'Chai',exact:true}).click();await page.locator('#ecran-batiments').waitFor({state:'visible'});
 await page.goto(url+'/fallback');assert.equal(await page.evaluate(()=>DomaineIllustre.ready),false);assert.equal(await page.locator('#lieux').getAttribute('data-rendu'),'pixel');assert.equal(await page.locator('#carte').evaluate(c=>c.width),192);
 assert.deepEqual(errors,[]);console.log('✓ Domaine : six accès, niveaux/travaux, quatre saisons/nuit, DPR 2, 320/390 px, cibles 44 px, mouvement réduit, image manquante, aucune mutation ni erreur JS');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
