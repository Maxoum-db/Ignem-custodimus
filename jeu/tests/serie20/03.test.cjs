require('./support.cjs')('03',async({page,to,save,assert,capture})=>{
 await to('distillerie');const before=await save();
 for(const b of await page.locator('#dist-reglages .bascule button').all())assert.ok((await b.boundingBox()).height>=48);
 await page.locator('[data-rd="recycler"][data-val="false"]').tap();await page.locator('[data-rd="feu"][data-val="douce"]').tap();
 for(const id of ['rd-tetes','rd-queues']){const r=page.locator('#'+id);assert.ok((await r.boundingBox()).height>=44);await r.focus();await r.press('ArrowRight')}
 const after=await save();assert.equal(after.reglagesD.recycler,false);assert.equal(after.reglagesD.feu,'douce');assert.equal(after.reglagesD.tetesPct,4.5);assert.equal(after.reglagesD.queuesDegre,61);assert.equal(after.ecus,before.ecus);await capture('#dist-reglages');await page.reload();assert.deepEqual((await save()).reglagesD,after.reglagesD);
}).catch(e=>{console.error(e);process.exitCode=1});
