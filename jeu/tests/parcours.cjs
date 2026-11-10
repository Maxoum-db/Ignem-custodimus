// Tests du vrai jeu : fixtures locales, interactions DOM, aucun moteur simulé.
const {chromium}=require('playwright');const fs=require('node:fs');const http=require('node:http');const assert=require('node:assert/strict');
(async()=>{
const root=process.env.CAPTURE_DIR||'qa/captures/parcours';fs.mkdirSync(root,{recursive:true});
const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html');r.end(fs.readFileSync(process.env.GAME_FILE||'dist/index.html'))});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.setDefaultTimeout(5000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',r=>r.abort());
const dismiss=async()=>{if(await page.locator('#tuto-voile').isVisible()) await page.locator('#tuto-passer').click()};
const snap=async(n)=>{await dismiss();assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Débordement '+n);await page.screenshot({path:`${root}/${n}.png`});console.log(n)};
const verifierVerre = async (forme, anime) => {
 const verre = page.locator('#verre svg');
 await verre.waitFor({state:'visible'});
 assert.equal(await verre.getAttribute('data-forme'), forme);
 const liquide = verre.locator('.verre-liquide');
 assert.equal(await liquide.evaluate(el => getComputedStyle(el).animationName), 'none');
 if (anime) {
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.equal(await liquide.evaluate(el => getComputedStyle(el).animationName), 'remplir-verre');
  await page.emulateMedia({reducedMotion:'reduce'});
 }
};
const verifierAveugle = async () => {
 const verres = page.locator('#aveugle-verres svg');
 assert.equal(await verres.count(), 3);
 const dessins = await verres.evaluateAll(nodes => nodes.map(el => el.outerHTML.replace(/verre-fraction-\d/g, 'verre-fraction')));
 assert.equal(new Set(dessins).size, 1, 'Les fractions ne doivent pas se distinguer visuellement');
 await page.setViewportSize({width:320,height:844});
 const choix = page.locator('#aveugle-verres [data-av]');
 assert.equal(await choix.count(), 9);
 assert.ok(await choix.evaluateAll(nodes => nodes.every(el => el.getBoundingClientRect().height >= 44)));
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 await page.setViewportSize({width:390,height:844});
};
const save=async()=>{await page.waitForTimeout(350);return page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')))};
const nav=async(n)=>{await page.locator('.marque').click();await page.evaluate(()=>window.DomaineIllustre?.ready);await page.locator('#lieux').getByRole('button',{name:({brasserie:'Brasserie',distillerie:'Alambic Ulysse',chai:'Chai',catalogue:'Pigeonnier'})[n],exact:true}).click();await page.locator('#ecran-'+n).waitFor({state:'visible'});await dismiss()};
try{
await page.goto(`http://127.0.0.1:${server.address().port}`);
await page.evaluate(()=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',gestesExpert:true,aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet:[],grimoire:[],ecole:{},succes:{},ecus:500})));
await page.evaluate(mode=>{const s=JSON.parse(localStorage.getItem('ignem.v1'));s.mode=mode;localStorage.setItem('ignem.v1',JSON.stringify(s));},process.env.MODE_JEU||'expert');
await page.reload();await nav('brasserie');await snap('recette-vide');await page.locator('#tab-malts').click();await page.locator('#recherche').fill('Pilsner Soufflet Bio');for(let i=0;i<8;i++)await page.locator('[data-ajouter="malt"]').click();
await page.locator('#tab-houblons').click();await page.locator('#recherche').fill('Saaz');await page.locator('[data-ajouter="houblon"]').first().click();
await page.locator('#tab-levure').click();await page.locator('#recherche').fill('Safale US-05');await page.locator('[data-ajouter="levure"]').click();
let s=await save();assert.ok(s.recette.malts.length);assert.ok(s.recette.levure);await page.reload();await nav('brasserie');await snap('recette');await page.locator('#btn-lancer').click();await snap('empatage');if(process.env.GESTES_REELS==='1') {
 await page.locator('#emp-go').click();
 await page.waitForTimeout(600);
 const b=page.locator('#emp-vapeur');
 if(!await b.isDisabled()) {
  const bb=await b.boundingBox();await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.waitForTimeout(800);await page.mouse.up();
 }
 await snap('empatage-actif');
 await page.locator('#emp-suite').waitFor({state:'visible',timeout:35000});
 await page.locator('#emp-suite').click();
} else { await page.locator('#emp-passer').click(); }await snap('filtration');if(process.env.GESTES_REELS==='1') {
 await page.locator('#fil-go').click();
 await page.waitForTimeout(600);
 const b=page.locator('#fil-arroser');
 if(!await b.isDisabled()) {
  const bb=await b.boundingBox();await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.waitForTimeout(800);await page.mouse.up();
 }
 await snap('filtration-actif');
 await page.locator('#fil-suite').waitFor({state:'visible',timeout:35000});
 await page.locator('#fil-suite').click();
} else { await page.locator('#fil-passer').click(); }await snap('ebullition');if(process.env.GESTES_REELS==='1') {
 await page.locator('#ebu-go').click();
 await page.waitForTimeout(4000);
 const b=page.locator('#ebu-jeter');
 if(!await b.isDisabled()) {
  await b.click();
 }
 await snap('ebullition-actif');
 await page.locator('#ebu-suite').waitFor({state:'visible',timeout:35000});
 await page.locator('#ebu-suite').click();
} else { await page.locator('#ebu-passer').click(); }await snap('fermentation');if(process.env.GESTES_REELS==='1') {
 await page.locator('#fer-go').click();
 await page.waitForTimeout(600);
 const b=page.locator('#fer-glycol');
 if(!await b.isDisabled()) {
  const bb=await b.boundingBox();await page.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await page.mouse.down();await page.waitForTimeout(800);await page.mouse.up();
 }
 await snap('fermentation-actif');
 await page.locator('#fer-suite').waitFor({state:'visible',timeout:35000});
 await page.locator('#fer-suite').click();
} else { await page.locator('#fer-passer').click(); }await snap('embouteillage');await page.locator('#bou-go').click();await page.locator('#bou-suite').waitFor({state:'visible'});await page.locator('#bou-suite').click();await verifierVerre('biere', true);await snap('degustation');
s=await save();assert.equal(s.carnet[0].type,'biere');assert.ok(s.carnet[0].stockL>0);fs.writeFileSync(`${root}/sauvegarde-biere.json`,JSON.stringify(s));
await nav('catalogue');await page.locator('[data-conseiller]').first().click();await page.locator('[data-proposer]').first().click();s=await save();assert.equal(s.vente.vendus,1);assert.ok(s.carnet[0].stockL<1000);const sale=s.vente.ca;assert.ok(sale>0);await snap('vente');
await page.locator('[data-pigonglet="achats"]').click();const buy=page.locator('[data-acheter^="cereales:"]:enabled').first();if(await buy.count()){const id=(await buy.getAttribute('data-acheter')).slice('cereales:'.length);await buy.click();s=await save();assert.ok(s.possede.includes(id));await page.reload();assert.ok((await save()).possede.includes(id));}
await nav('distillerie');await snap('ulysse');await page.locator('[data-biere]').first().click();await page.locator('#btn-distiller').click();await snap('brouillis');if(process.env.ULYSSE_REEL==='1'){
 await page.locator('#bro-go').click();await page.locator('#bro-buche').click();await page.waitForTimeout(1200);await snap('brouillis-actif');await page.locator('#bro-suite').waitFor({state:'visible',timeout:35000});await page.locator('#bro-suite').click();await snap('repasse');
 await page.locator('#rep-go').click();await page.locator('#rep-buche').click();await page.waitForTimeout(2500);await snap('repasse-active');await page.locator('#rep-couper').click();await page.waitForTimeout(8000);await page.locator('#rep-couper').click();await page.waitForTimeout(1500);await page.locator('#rep-couper').click();await page.locator('#rep-suite').click();
}else{await page.locator('#bro-passer').click();await snap('repasse');await page.locator('#rep-passer').click();}if(await page.locator('#aveugle-passer').isVisible()){await verifierAveugle();await snap('aveugle');
 for (let k = 0; k < 3; k++) await page.locator(`[data-av="${k}:${k}"]`).click();
 await page.locator('#aveugle-valider').click();
 await page.locator('#aveugle-bilan').waitFor({state:'visible'});
 await page.locator('#aveugle-valider').click();
}await verifierVerre('spiritueux', true);await snap('degustation-edv');s=await save();assert.equal(s.carnet[0].type,'edv');assert.ok(s.carnet[0].lapRestant>0);assert.equal(s.carnet[1].stockL,0);
await nav('chai');await page.locator('[data-fut]').first().click();await page.locator('[data-remplir]').first().click();await snap('chai-rempli');s=await save();assert.ok(s.chai.futs[0].contenu);await page.locator('[data-attendre]').last().click();await snap('chai-vieilli');await page.locator('#fut-sortir').click();await page.locator('[data-embouteiller]').first().click();await verifierVerre('spiritueux', true);await snap('degustation-vieilli');s=await save();assert.equal(s.carnet[0].type,'vieilli');assert.ok(s.carnet[0].stockB>0);
await page.reload();await nav('catalogue');await snap('boutique');fs.writeFileSync(`${root}/sauvegarde-complete.json`,JSON.stringify(await save()));
if (process.env.GESTES_REELS !== '1' && process.env.ULYSSE_REEL !== '1') {
 await page.evaluate(() => {
  const partie = JSON.parse(localStorage.getItem('ignem.v1'));
  const biere = partie.carnet.find(lot => lot.type === 'biere');
  partie.recette = {...biere.recette, destination:'wash', houblons:[]};
  localStorage.setItem('ignem.v1', JSON.stringify(partie));
 });
 await page.reload();await nav('brasserie');
 for (const selecteur of ['#btn-lancer', '#emp-passer', '#fil-passer', '#fer-passer']) {
  await page.locator(selecteur).click();await dismiss();
 }
 await verifierVerre('wash', false);await snap('degustation-wash');
 assert.equal((await save()).carnet[0].type, 'wash');
}
assert.deepEqual(errors,[]);console.log('PASS parcours');
}catch(e){console.error(e);console.error(errors);await page.screenshot({path:`${root}/erreur.png`});process.exitCode=1}finally{await browser.close();await new Promise(r=>server.close(r))}
})();
