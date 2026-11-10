const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync('dist/index.html'))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try {
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const base={id:'test',nom:'Réserve du domaine',type:'vieilli',date:'2026-11-10',total:42,bouteilles:90,abv:45,age:4,defauts:[],futs:[],sources:[],style:'Whisky de malt',ebc:20,semaine:1,stockL:1000,stockB:90};
  const carnet=[{...base,id:'blonde',type:'biere',nom:'Blonde des Braises',ebc:6,medaille:'or'},{...base,id:'brune',type:'biere',nom:'Brune du Quercy',ebc:65,medaille:'bronze'},{...base,id:'edv',type:'edv',nom:'Eau-de-vie Ulysse',medaille:'argent'},{...base,id:'vieilli',medaille:'or'}];
  await page.evaluate(carnet=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet,grimoire:[],ecole:{},succes:{}})),carnet);await page.reload();
  await page.locator('#btn-menu').click();await page.locator('#menu-entete [data-aller="carnet"]').click();
  const bottles=page.locator('.bouteille');assert.equal(await bottles.count(),4);
  const images=await bottles.locator('canvas').evaluateAll(cs=>cs.map(c=>({w:c.width,h:c.height,mode:getComputedStyle(c).imageRendering,image:c.toDataURL()})));
  assert.ok(images.every(c=>c.w===128&&c.h===240&&c.mode==='auto'));assert.equal(new Set(images.map(c=>c.image)).size,4);
  await page.locator('[data-bouteille="vieilli"]').click();assert.equal(await page.locator('[data-bouteille="vieilli"]').getAttribute('aria-pressed'),'true');assert.ok((await page.locator('#carnet-detail').textContent()).includes('Réserve du domaine'));
  fs.mkdirSync('qa/captures/carnet',{recursive:true});
  for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`qa/captures/carnet/carnet-${width}.png`,fullPage:true});}
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')).carnet);
  assert.deepEqual(saved,carnet);assert.deepEqual(errors,[]);
  console.log('✓ Carnet : quatre rendus distincts, DPR 2, fiche et sélection, 320/390 px, sauvegarde intacte, aucune erreur JS.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
