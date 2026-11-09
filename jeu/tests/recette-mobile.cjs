const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(fs.readFileSync('dist/index.html'))});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());await page.goto(`http://127.0.0.1:${server.address().port}`);
 await page.evaluate(()=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',gestesExpert:true,aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet:[],grimoire:[],ecole:{},succes:{},ecus:500})));
 await page.reload();await page.locator('#lieux').getByRole('button',{name:'Brasserie',exact:true}).click();if(await page.locator('#tuto-voile').isVisible())await page.locator('#tuto-passer').click();
 fs.mkdirSync('qa/captures/interface',{recursive:true});await page.screenshot({path:'qa/captures/interface/preparation-vide.png'});
 const canvas=page.locator('#cuve');const before=await canvas.evaluate(c=>c.toDataURL());assert.equal(await canvas.evaluate(c=>c.width),await canvas.evaluate(c=>Math.round(c.getBoundingClientRect().width*2)));
 await page.locator('#tab-malts').click();await page.locator('#recherche').fill('Pilsner Soufflet Bio');await page.locator('[data-ajouter="malt"]').click();assert.notEqual(await canvas.evaluate(c=>c.toDataURL()),before,'Cuve non actualisée avec mouvement réduit');
 const handle=page.locator('[data-glisser="malt"]').first();await handle.scrollIntoViewIfNeeded();const box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(100);
 const target=await page.locator('#cuve-zone').boundingBox();assert.ok(target.y>=0 && target.y+target.height<844,'La cuve de dépôt doit rester visible');await page.mouse.move(target.x+target.width/2,target.y+target.height/2,{steps:5});await page.mouse.up();await page.waitForTimeout(350);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')));assert.equal(saved.recette.malts[0].kg,50,'Ajout bouton + dépôt du sac');
 await page.screenshot({path:'qa/captures/interface/ingredients.png'});
 for(const tab of ['cuve','malts','houblons','levure','eau','aromates','procede']){await page.locator('#tab-'+tab).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),tab+' déborde');}
 await page.setViewportSize({width:320,height:740});await page.locator('#scene').evaluate(el=>el.scrollTop=0);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:390,height:844});
 await page.locator('#btn-vider').click();await page.locator('#btn-vider').click();assert.equal(await canvas.evaluate(c=>c.toDataURL()),before,'Vider doit restituer la cuve vide');assert.ok(await page.locator('#btn-lancer').isDisabled());assert.deepEqual(errors,[]);console.log('✓ Recette mobile : dessin réactif, DPR 2, glisser-déposer après défilement, sept onglets, 320 px et remise à zéro');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
