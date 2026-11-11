const run = require('./support.cjs');
const fs = require('node:fs');

async function scenario(mode, retard) {
 await run(`houblon-${mode}${retard ? '-retard' : ''}`, async ({page, to, reset, save, assert, width}) => {
  const total = mode === 'debutant' ? 90 : 60;
  const recette = {volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons:[{id:'hops_aroma_saaz',g:250,min:total},{id:'hops_aroma_saaz',g:250,min:total/2},{id:'hops_aroma_saaz',g:100,min:-1}],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:total,fermentation:{temp:18,reposDiacetyle:false}};
  await reset({mode,gestesExpert:true,recette,vus:{domaine:true,veillee:true,empatage:true,filtration:true,ebullition:true}});
  await to('brasserie');
  await page.locator('#btn-lancer').click();
  await page.locator('#emp-passer').click();
  await page.locator('#fil-passer').click();
  await page.locator('#ecran-ebullition').waitFor({state:'visible'});
  const before = await save();
  const jeter = page.locator('#ebu-jeter');
  const position = () => page.locator('#ebu-frise .curseur').evaluate(el=>parseFloat(el.style.left));
  const repere = await page.locator('#ebu-frise .repere-h').first().evaluate(el=>parseFloat(el.style.left));
  assert.equal(await position(),0);
  assert.ok(repere > 0,'Le premier ajout doit avoir une approche visible');
  assert.equal(await jeter.isDisabled(),true);
  const start = new Date('2026-11-11T12:00:00Z');
  await page.clock.install({time:start});
  await page.clock.pauseAt(new Date(start.getTime()+1000));
  await page.locator('#ebu-go').click();
  await page.clock.runFor(4000);
  assert.equal(await jeter.isDisabled(),true);
  assert.ok(await position() > 0 && await position() < repere);
  assert.match(await page.locator('#ebu-preparation').textContent(),/départ dans/);
  assert.match(await page.locator('#ebu-infos').textContent(),new RegExp(total+"'"));
  if (!retard) {
   fs.mkdirSync('docs/captures/houblon-preparation',{recursive:true});
   await page.locator('#ebu-frise').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await page.screenshot({path:`docs/captures/houblon-preparation/${mode}-${width}-approche.png`});
  }
  await page.clock.runFor(999);
  assert.equal(await jeter.isDisabled(),true,'Aucun ajout avant les cinq secondes');
  await page.clock.runFor(34);
  assert.equal(await jeter.isDisabled(),false);
  assert.match(await page.locator('#ebu-preparation').textContent(),/À toi/);
  if (retard) await page.clock.runFor(1000);
  await jeter.tap();
  assert.equal(await page.locator('#ebu-frise .repere-h.fait').count(),1);
  await page.clock.runFor(retard ? 8000 : 9000);
  await jeter.tap();
  assert.equal(await page.locator('#ebu-frise .repere-h.fait').count(),2);
  await page.clock.runFor(9000);
  const bilan = page.locator('#ebu-bilan');
  await bilan.waitFor({state:'visible'});
  assert.match(await page.locator('#ebu-preparation').textContent(),/terminé/);
  const score = Number((await bilan.locator('.gros').textContent()).match(/\d+/)[0]);
  if (retard) assert.ok(score<100,'Un retard doit toujours être pénalisé');
  else assert.equal(score,100,'Deux ajouts aux repères doivent donner 100 %');
  await page.clock.resume();
  if (!retard) {
   await bilan.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
   await page.screenshot({path:`docs/captures/houblon-preparation/${mode}-${width}-100.png`});
  }
  assert.deepEqual((await save()).recette.houblons,before.recette.houblons,'La recette prévue et le dry hop restent intacts');
  await page.locator('#ebu-suite').click();
  await page.locator('#ecran-fermentation').waitFor({state:'visible'});
 });
}
(async()=>{
 for(const mode of ['expert','debutant']) {
  await scenario(mode,false);
  await scenario(mode,true);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
