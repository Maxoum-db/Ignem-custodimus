const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync('dist/index.html'))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try {
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));await page.route('https://**/*',r=>r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const base={date:'2026-11-10',total:42,defauts:[],semaine:1};
  const recette={
    volume:1000, rendement:0.75, malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],
    houblons:[{id:'hops_aroma_saaz',g:250,min:10}], levure:'yeasts_ale_safale_us_05',
    eau:'causse', palier:66, ebullition:60, fermentation:{temp:18,reposDiacetyle:false},
  };
  const biere={...base,type:'biere',stockL:1000,og:1.050,fg:1.012,abv:5,ibu:18,recette};
  const carnet=[
    {...biere,id:'blonde',nom:'Blonde des Braises',style:'Blonde',ebc:6,medaille:'or'},
    {...biere,id:'brune',nom:'Brune du Quercy',style:'Brune',ebc:65,medaille:'bronze'},
    {...biere,id:'wash',type:'wash',nom:'Moût de malt',style:'Wash de malt',ebc:12,total:16,
      recette:{...recette,destination:'wash',houblons:[]}},
    {...base,id:'edv',type:'edv',nom:'Eau-de-vie Ulysse',ebc:0,abv:60,medaille:'argent',
      coeur:{V:40,degre:60,lap:24},rendement:0.8,coupes:[],biere:'Blonde des Braises'},
    {...base,id:'vieilli',type:'vieilli',nom:'Réserve du domaine',style:'Whisky de malt',
      bouteilles:90,stockB:90,abv:45,age:4,ebc:20,medaille:'or',sources:['Eau-de-vie Ulysse'],
      futs:[{type:'bourbon',taille:'quartaut',zone:1,ans:4,remplissages:0}]},
  ];
  await page.evaluate(carnet=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet,grimoire:[],ecole:{},succes:{}})),carnet);await page.reload();
  await page.locator('#btn-menu').click();await page.locator('#menu-entete [data-aller="carnet"]').click();
  const bottles=page.locator('.bouteille');assert.equal(await bottles.count(),carnet.length);
  assert.equal(await page.locator('[data-bouteille="wash"] small').textContent(),'Moût à distiller');
  const images=await bottles.locator('canvas').evaluateAll(cs=>cs.map(c=>({w:c.width,h:c.height,mode:getComputedStyle(c).imageRendering,image:c.toDataURL()})));
  assert.ok(images.every(c=>c.w===128&&c.h===240&&c.mode==='auto'));assert.equal(new Set(images.map(c=>c.image)).size,carnet.length);
  for(const {id,nom} of carnet){
   const bottle=page.locator(`[data-bouteille="${id}"]`);
   await bottle.click();
   assert.equal(await bottle.getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('.bouteille[aria-pressed="true"]').count(),1);
   assert.equal(await page.locator('#carnet-detail h3').textContent(),nom);
  }
  fs.mkdirSync('qa/captures/carnet',{recursive:true});
  for(const width of [390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`qa/captures/carnet/carnet-${width}.png`,fullPage:true});}
  await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')).carnet);
  assert.deepEqual(saved,carnet);assert.deepEqual(errors,[]);
  console.log('✓ Carnet : cinq rendus distincts, DPR 2, fiches et sélection, 320/390 px, sauvegarde intacte, aucune erreur JS.');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1});
