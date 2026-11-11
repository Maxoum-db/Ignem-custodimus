require('./support.cjs')('06-fournisseurs',async({page,to,save,capture,assert})=>{
 await to('catalogue');await page.locator('[data-pigonglet="achats"]').click();await page.locator('[data-cat="cereales"]').click();await page.locator('[data-catfiltre="achat"]').click();
 const b=page.locator('#cat-contenu [data-acheter]:enabled').first();await b.waitFor();const key=await b.getAttribute('data-acheter'),id=key.split(':')[1],price=Number((await b.textContent()).match(/\d+/)[0]);
 assert.match(await b.getAttribute('aria-label'),/Acheter/);assert.ok((await b.boundingBox()).height>=48);const before=await save();await b.click();const after=await save();assert.equal(after.ecus,before.ecus-price);assert.ok(after.possede.includes(id));assert.equal(await page.locator(`[data-acheter="${key}"]`).count(),0);
 await page.locator('[data-catfiltre="possede"]').click();assert.equal(await page.locator('[data-catfiltre="possede"]').getAttribute('aria-pressed'),'true');await capture('#cat-contenu');
 await page.locator('#cat-recherche').fill('zzzzintrouvable');assert.match(await page.locator('#cat-contenu').textContent(),/Rien ici/);assert.deepEqual((await save()).possede,after.possede);
 await page.reload({waitUntil:'domcontentloaded'});const persisted=await save();assert.equal(persisted.ecus,after.ecus);assert.ok(persisted.possede.includes(id));assert.deepEqual(persisted.recette,after.recette);
}).catch(e=>{console.error(e);process.exitCode=1});
