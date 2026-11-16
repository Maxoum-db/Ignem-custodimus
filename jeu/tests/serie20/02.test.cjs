require('./support.cjs')('02',async({page,to,reset,assert,capture})=>{
 await reset({recette:require('./recette.cjs'),gestesExpert:true,vus:{domaine:true,veillee:true,empatage:true,filtration:true,ebullition:true}});await to('brasserie');await page.locator('#btn-lancer').click();await page.locator('#emp-passer').click();await page.locator('#fil-passer').click();
 const time=new Date('2026-11-16T12:00:00Z');await page.clock.install({time});await page.clock.pauseAt(new Date(+time+1000));await page.locator('#ebu-go').click();await page.clock.runFor(34);await page.clock.fastForward(5000);await page.locator('#ebu-jeter').tap();assert.equal(await page.locator('#ebu-jeter').isDisabled(),true);
 await page.clock.fastForward(9000);const first=page.locator('#ebu-infos > :first-child .v');assert.ok(parseInt(await first.textContent())<=31);assert.match(await page.locator('#ebu-infos').textContent(),/Saaz jeté/);
 await page.clock.fastForward(10000);assert.equal(await first.textContent(),"0'");await page.clock.resume();await capture('#ebu-frise');
}).catch(e=>{console.error(e);process.exitCode=1});
