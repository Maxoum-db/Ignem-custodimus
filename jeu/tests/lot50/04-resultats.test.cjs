require('./support.cjs')('04-resultats',async({page,to,save,capture,assert})=>{
 await to('recherche');await page.locator('[data-rcat="cereales"]').click();await page.locator('#rech-champ').fill('pilsner');
 const action=page.locator('[data-cuve^="cereales:"]').first();await action.waitFor();
 const id=(await action.getAttribute('data-cuve')).split(':')[1];const before=await save();const initial=before.recette.malts.find(m=>m.id===id)?.kg||0;
 assert.ok((await action.boundingBox()).height>=48);await action.click();
 const after=await save();assert.ok(after.recette.malts.find(m=>m.id===id).kg>initial);assert.equal(after.ecus,before.ecus);assert.deepEqual(after.ecole,before.ecole);
 await capture('#rech-resultats');await page.reload({waitUntil:'domcontentloaded'});assert.deepEqual((await save()).recette,after.recette);
}).catch(e=>{console.error(e);process.exitCode=1});
