require('./support.cjs')('05-options',async({page,to,save,capture,assert})=>{
 const before=await save();await to('reglages');
 const toggle=(key,val)=>page.locator(`[data-reglage="${key}"][data-val="${val}"]`);
 for(const [key,val] of [['son',true],['gestesExpert',true],['bac',true]]){const b=toggle(key,val);assert.ok((await b.boundingBox()).height>=48);await b.click();assert.equal(await toggle(key,val).getAttribute('aria-pressed'),'true');assert.equal((await save())[key],val)}
 await toggle('mode','debutant').click();assert.equal((await save()).mode,'debutant');assert.equal(await page.locator('[data-reglage="gestesExpert"]').count(),0);
 await toggle('mode','expert').click();assert.equal(await toggle('gestesExpert',true).getAttribute('aria-pressed'),'true');
 const after=await save();assert.equal(after.ecus,before.ecus);assert.deepEqual(after.carnet,before.carnet);assert.deepEqual(after.ecole,before.ecole);
 await page.locator('#effacer').click();await page.locator('#effacer-non').click();assert.deepEqual(await save(),after);
 await capture('#reglages-contenu');await page.reload({waitUntil:'domcontentloaded'});await to('reglages');assert.equal(await toggle('son',true).getAttribute('aria-pressed'),'true');assert.equal(await toggle('bac',true).getAttribute('aria-pressed'),'true');
}).catch(e=>{console.error(e);process.exitCode=1});
