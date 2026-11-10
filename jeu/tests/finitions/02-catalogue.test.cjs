require('./support.cjs')('02-catalogue',async({page,nav,save,snap,assert})=>{
 await nav('catalogue');await page.locator('[data-pigonglet="achats"]').click();await page.locator('[data-cat="futs"]').click();const card=page.locator('.article').filter({has:page.locator('[data-acheter^="futs:"]')}).first();const icon=card.locator('.fut-mini');
 const bg=await icon.evaluate(e=>getComputedStyle(e).backgroundImage);assert.match(bg,/data:image\/svg/);await icon.evaluate(async e=>{const image=new Image();image.src=getComputedStyle(e).backgroundImage.slice(5,-2);await image.decode()});
 await card.screenshot({path:`docs/captures/serie/02-catalogue-${await page.evaluate(()=>innerWidth)}.png`});const before=await save();await card.locator('[data-acheter]').click();const after=await save();assert.equal(after.chai.futs.length,before.chai.futs.length+1);assert.ok(after.ecus<before.ecus);assert.equal(after.brassins,before.brassins);
}).catch(e=>{console.error(e);process.exitCode=1});
