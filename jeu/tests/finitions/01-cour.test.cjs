require('./support.cjs')('01-cour',async({page,nav,save,snap,assert})=>{
 await nav('chai');const barrel=page.locator('#chai-cour [data-fut="cour"]');
 const style=await barrel.evaluate(el=>({bg:getComputedStyle(el).backgroundImage,w:el.offsetWidth,h:el.offsetHeight}));assert.match(style.bg,/data:image\/svg/);assert.ok(style.w>=44&&style.h>=44);
 await snap('#chai-cour');await barrel.click();await page.locator('#fut-deplacer').click();await page.locator('[data-case="2:5"]').click();const s=await save();assert.deepEqual(s.chai.futs.find(f=>f.id==='cour').pos,{r:2,c:5});
 await page.locator('[data-fut="cour"]').click();await page.locator('#fut-cour').click();assert.equal((await save()).chai.futs.find(f=>f.id==='cour').pos,null);
}).catch(e=>{console.error(e);process.exitCode=1});
