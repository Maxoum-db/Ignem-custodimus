const run=require('./support.cjs');
run('01',async({page,to,reset,save,assert,capture})=>{
 for(const [volume,dose] of [[100,30],[500,130],[1000,250]]){
  await reset({bat:{brasserie:{100:1,500:2,1000:3}[volume],distillerie:1,chai:2,pigeonnier:3},recette:{volume,malts:[],houblons:[],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:60,fermentation:{temp:18}}});
  await to('brasserie');await page.locator('[data-onglet="houblons"]').click();
  const b=page.locator('[data-ajouter="houblon"]').first();
  assert.equal(await b.textContent(),`+${dose} g`);assert.match(await b.getAttribute('aria-label'),new RegExp(`Ajouter ${dose} g`));
  await b.tap();await page.waitForTimeout(350);assert.equal((await save()).recette.houblons[0].g,dose);
 }
 await capture('#onglet-contenu');
}).catch(e=>{console.error(e);process.exitCode=1});
