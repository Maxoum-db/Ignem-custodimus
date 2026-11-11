require('./support.cjs')('11-styles',async({page,to,save,capture,assert})=>{
 await to('brasserie');const before=await save();await page.locator('#btn-viser').click();assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-viser')),true);
 const last=page.locator('[data-viser]').last(),id=await last.getAttribute('data-viser');await last.click();assert.equal((await save()).recette.cible,id);assert.equal(await page.locator('#style-voile').isVisible(),false);
 await page.locator('#plan-changer').click();assert.equal(await page.locator('[data-viser][aria-pressed="true"]').getAttribute('data-viser'),id);await page.locator('#style-fermer').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-viser')),true);await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'style-fermer');
 await capture('#style-voile');await page.keyboard.press('Escape');assert.equal(await page.locator('#style-voile').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'plan-changer');assert.equal((await save()).ecus,before.ecus);assert.equal((await save()).recette.cible,id);
 await page.reload({waitUntil:'domcontentloaded'});assert.equal((await save()).recette.cible,id);
}).catch(e=>{console.error(e);process.exitCode=1});
