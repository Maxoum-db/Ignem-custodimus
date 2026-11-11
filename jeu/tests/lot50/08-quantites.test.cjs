require('./support.cjs')('08-quantites',async({page,to,save,capture,assert})=>{
 await to('brasserie');for(const [tab,type] of [['malts','malt'],['houblons','houblon']]){await page.locator('#tab-'+tab).click();await page.locator(`[data-ajouter="${type}"]`).first().click()}
 await page.locator('#tab-cuve').click();const before=await save();
 const plus=page.locator('[data-malt-plus="0"]');assert.ok((await plus.boundingBox()).width>=48);await plus.click();assert.ok((await save()).recette.malts[0].kg>before.recette.malts[0].kg);
 await page.locator('[data-malt-moins="0"]').click();assert.equal((await save()).recette.malts[0].kg,before.recette.malts[0].kg);
 await page.locator('[data-malt-kg="0"]').fill('37,5');await page.locator('[data-malt-kg="0"]').press('Tab');assert.equal((await save()).recette.malts[0].kg,37.5);
 await page.locator('[data-hop-g="0"]').fill('350');await page.locator('[data-hop-g="0"]').press('Tab');assert.equal((await save()).recette.houblons[0].g,350);
 const dh=page.locator('[data-hop-min="0:-2"]');assert.ok((await dh.boundingBox()).height>=44);await dh.click();assert.equal((await save()).recette.houblons[0].min,-2);assert.equal(await page.locator('[data-hop-min="0:-2"]').getAttribute('aria-pressed'),'true');await capture('#onglet-contenu');
 await page.locator('[data-hop-suppr="0"]').click();const after=await save();assert.equal(after.recette.houblons.length,0);assert.equal(after.recette.malts[0].kg,37.5);assert.equal(after.ecus,before.ecus);
 await page.reload({waitUntil:'domcontentloaded'});assert.deepEqual((await save()).recette,after.recette);
}).catch(e=>{console.error(e);process.exitCode=1});
