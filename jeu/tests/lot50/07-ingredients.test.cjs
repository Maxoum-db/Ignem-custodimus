require('./support.cjs')('07-ingredients',async({page,to,save,capture,assert})=>{
 await to('brasserie');
 await page.locator('#tab-levure').click();const yeast=page.locator('[data-ajouter="levure"]').first();const yeastId=await yeast.getAttribute('data-id');await yeast.tap();assert.equal((await save()).recette.levure,yeastId);assert.equal(await page.locator(`[data-ajouter="levure"][data-id="${yeastId}"]`).getAttribute('aria-pressed'),'true');
 await page.locator('#tab-malts').click();await page.locator('#recherche').fill('Pilsner Soufflet Bio');

 const b=page.locator('[data-ajouter="malt"]').first(),id=await b.getAttribute('data-id');const before=await save(),kg=before.recette.malts.find(m=>m.id===id)?.kg||0;
 assert.ok((await b.boundingBox()).height>=48);await b.tap();const added=await save(),dose=added.recette.malts.find(m=>m.id===id).kg-kg;assert.ok(dose>0);
 const h=page.locator('[data-glisser="malt"]').first();await h.scrollIntoViewIfNeeded();const box=await h.boundingBox();assert.ok(box.width>=48&&box.height>=48);
 const cdp=await page.context().newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+24,y:box.y+24}]});
 const target=await page.locator('#cuve-zone').boundingBox();assert.ok(target.y>=0&&target.y+target.height<=844);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:target.x+target.width/2,y:target.y+target.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 assert.equal((await save()).recette.malts.find(m=>m.id===id).kg,kg+2*dose);await capture('#onglet-contenu');
 assert.equal((await save()).ecus,before.ecus);

}).catch(e=>{console.error(e);process.exitCode=1});
