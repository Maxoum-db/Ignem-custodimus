require('./support.cjs')('04',async({page,to,reset,save,assert,capture,width})=>{
 await page.setViewportSize({width,height:430});await reset({tuto:0,aide:true,mode:'debutant',vus:{domaine:true,veillee:true}});await to('domaine');
 const m=page.locator('#mentor');assert.equal(await m.isVisible(),true);const box=await m.boundingBox();assert.ok(box.height<=194);assert.ok(box.y>=0);
 const b=m.getByRole('button',{name:'Passer le tutoriel'});await b.scrollIntoViewIfNeeded();assert.ok((await b.boundingBox()).height>=48);await capture('#mentor');await b.tap();assert.equal((await save()).tuto,-1);assert.equal(await m.isVisible(),false);
}).catch(e=>{console.error(e);process.exitCode=1});
