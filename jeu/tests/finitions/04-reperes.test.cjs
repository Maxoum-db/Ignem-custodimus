require('./support.cjs')('04-reperes',async({page,nav,snap,assert})=>{
 await nav('chai');const plan=page.locator('.chai-plan');assert.equal(await plan.getAttribute('tabindex'),'0');assert.equal(await plan.getAttribute('aria-describedby'),'chai-defilement');
 const before=await page.locator('.chai-plan .zone-lib').first().boundingBox();await plan.evaluate(el=>el.scrollLeft=el.scrollWidth);const after=await page.locator('.chai-plan .zone-lib').first().boundingBox();assert.ok(Math.abs(before.x-after.x)<2,'repère déplacé hors écran');assert.ok(after.width<=await page.evaluate(()=>innerWidth));
 await plan.focus();assert.equal(await plan.evaluate(el=>document.activeElement===el),true);await snap('.chai-plan');
}).catch(e=>{console.error(e);process.exitCode=1});
