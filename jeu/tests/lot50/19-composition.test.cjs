require('./support.cjs')('19-composition', async ({page, to, reset, save, capture, assert}) => {
 await reset({bac:true});
 await to('brasserie');
 const malts = await page.evaluate(() => DONNEES_JEU.malts.slice().sort((a,b)=>b.nom.length-a.nom.length).slice(0,2).map(m=>({id:m.id,nom:m.nom})));
 for (const malt of malts) {
  await page.locator('#tab-malts').click();
  await page.locator('#recherche').fill(malt.nom);
  await page.locator(`[data-ajouter="malt"][data-id="${malt.id}"]`).click();
 }
 await page.locator('#tab-cuve').click();
 for (const [i,kg] of [[0,'75'],[1,'25']]) {
  const input = page.locator(`[data-malt-kg="${i}"]`);
  await input.fill(kg); await input.press('Tab');
 }
 const before = await save();
 assert.equal(before.recette.malts.length,2);
 assert.equal(await page.locator('#charge-composition').isVisible(),false);
 const button = page.locator('#compo-bouton');
 assert.ok((await button.boundingBox()).height >= 48);
 await button.tap();
 assert.equal(await button.getAttribute('aria-expanded'),'true');
 assert.equal(await button.getAttribute('aria-controls'),'charge-composition');
 assert.deepEqual(await page.locator('#charge-composition .grist-nom').allTextContents(),malts.map(m=>m.nom));
 assert.deepEqual(await page.locator('#charge-composition b').allTextContents(),['75 %','25 %']);
 assert.ok(await page.locator('#charge-composition .grist-nom').evaluateAll(nodes=>nodes.every(n=>n.scrollWidth<=n.clientWidth+1 && n.scrollHeight<=n.clientHeight+1)), 'Noms complets sans texte tronqué');
 await capture('#charge');
 await button.press('Enter');
 assert.equal(await button.getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'compo-bouton');
 await button.press('Space');
 assert.equal(await button.getAttribute('aria-expanded'),'true');
 assert.deepEqual(await save(),before,'Ouvrir ou fermer ne modifie pas la sauvegarde');
 await page.locator('[data-malt-kg="0"]').fill('25');
 await page.locator('[data-malt-kg="0"]').press('Tab');
 assert.deepEqual(await page.locator('#charge-composition b').allTextContents(),['50 %','50 %']);
 const changed = await save();
 await page.reload({waitUntil:'domcontentloaded'});
 assert.deepEqual((await save()).recette,changed.recette);
}).catch(e=>{console.error(e);process.exitCode=1});
