const run = require('./support.cjs');
const fs = require('node:fs');

async function verifier(mode, cas) {
 await run(`oubli-${mode}-${cas}`, async ({page,to,reset,save,assert,width}) => {
  const total = mode === 'debutant' ? 90 : 60;
  const hop = min => ({id:'hops_aroma_saaz',g:250,min});
  const houblons = (cas === 'partiel' ? [hop(total),hop(0)] : cas === 'dryhop' ? [] : [hop(0)]).concat(hop(-1));
  const recette = {volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons,levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:total,fermentation:{temp:18,reposDiacetyle:false}};
  await reset({mode,gestesExpert:true,recette,objectifs:{},succes:{},vus:{domaine:true,veillee:true,empatage:true,filtration:true,ebullition:true}});
  await to('brasserie');await page.locator('#btn-lancer').click();await page.locator('#emp-passer').click();await page.locator('#fil-passer').click();
  await page.locator('#ecran-ebullition').waitFor({state:'visible'});
  const before = await save(), button = page.locator('#ebu-jeter');
  const ecusAffiches = async () => Number((await page.locator('#entete-niveau .ecus-entete').textContent()).match(/\d+/)[0]);
  const ecusAvant = await ecusAffiches();
  const start = new Date('2026-11-16T12:00:00Z');
  await page.clock.install({time:start});await page.clock.pauseAt(new Date(start.getTime()+1000));
  await page.locator('#ebu-go').click();await page.clock.runFor(34);
  if(cas === 'valide') {
   await page.clock.fastForward(22950);await button.tap();
   assert.match(await page.locator('#ebu-infos').textContent(),/0,0/,'L’ajout manuel est réellement enregistré à 0 minute');
   await page.clock.fastForward(1000);
  } else if(cas === 'partiel') {
   await page.clock.runFor(4999);await button.tap();await page.clock.fastForward(18000);
  } else await page.clock.fastForward(24000);
  const bilan = page.locator('#ebu-bilan');await bilan.waitFor({state:'visible'});
  const score = Number((await bilan.locator('.gros').textContent()).match(/\d+/)[0]);
  const oubli = cas === 'absent' || cas === 'partiel';
  assert.equal(score,cas === 'absent' ? 0 : cas === 'partiel' ? 50 : 100);
  assert.equal(await page.locator('#ebu-frise .repere-h.oublie').count(),oubli ? 1 : 0);
  assert.equal(await page.locator('#ebu-frise .repere-h.fait').count(),cas === 'valide' || cas === 'partiel' ? 1 : 0);
  assert.equal(await button.isDisabled(),true);
  if(oubli) {
   assert.match(await bilan.textContent(),/Ajout oublié : Saaz \(0 min\)/);
   assert.match(await button.textContent(),/1 ajout oublié/);
   assert.match(await page.locator('#ebu-frise .oublie').getAttribute('aria-label'),/ajout oublié/);
   assert.equal(await bilan.locator('.objectif.ok').filter({hasText:'Chaque houblon à 1 minute près'}).count(),0);
  } else if(cas === 'dryhop') assert.match(await bilan.textContent(),/Aucun houblon pendant/);
  else assert.equal(await button.textContent(),'Tout est dans la cuve');
  await page.clock.resume();
  const after = await save();
  const gain = await ecusAffiches()-ecusAvant;
  assert.equal(gain,cas === 'valide' ? 13 : 0,'Aucune récompense de précision pour un oubli');
  if(oubli) assert.equal(after.ecus,before.ecus);
  assert.deepEqual(after.recette.houblons,before.recette.houblons,'Recette et dry hop conservés');
  if(mode === 'expert' && cas !== 'dryhop') {
   fs.mkdirSync('docs/captures/houblon-oubli',{recursive:true});
   await bilan.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await page.screenshot({path:`docs/captures/houblon-oubli/${cas}-${width}.png`});
  }
  console.log(JSON.stringify({mode,cas,width,score,gain}));
  await page.locator('#ebu-suite').click();await page.locator('#ecran-fermentation').waitFor({state:'visible'});
 });
}
(async()=>{for(const mode of ['expert','debutant'])for(const cas of ['absent','valide','partiel','dryhop'])await verifier(mode,cas)})().catch(e=>{console.error(e);process.exitCode=1});
