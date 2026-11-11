const run=require('../finitions/support.cjs');
module.exports=(name,check)=>run('v'+name,async ctx=>{
 const {page}=ctx;
 const fixture=await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('ignem.v1'));return {...s,possede:[],ecus:5000,points:500,son:false,aide:false,tuto:-1,tutoD:-1,vus:{domaine:true,veillee:true,brasserie:true,fiches:true},ecole:{},quiz:{jour:new Date().toISOString().slice(0,10),faits:0,bonnes:0,serie:0}}});
 await page.addInitScript(seed=>{if(sessionStorage.getItem('veillee-fixture'))return;localStorage.setItem('ignem.v1',JSON.stringify(seed));sessionStorage.setItem('veillee-fixture','1')},fixture);await page.reload({waitUntil:'domcontentloaded'});
 const enter=async()=>{await ctx.dismiss();await page.locator('#btn-menu').click();await page.locator('#menu-entete [data-aller="veillee"]').click();await page.locator('#ecran-veillee').waitFor({state:'visible'});await ctx.dismiss()};
 await enter();ctx.enter=enter;
 ctx.reset=async patch=>{await page.evaluate(p=>{window.dispatchEvent(new Event('pagehide'));const s=JSON.parse(localStorage.getItem('ignem.v1'));Object.assign(s,p);localStorage.setItem('ignem.v1',JSON.stringify(s))},patch);await page.reload({waitUntil:'domcontentloaded'});await enter()};
 ctx.start=async()=>{await page.locator('[data-lecon="empatage"]').click();await page.locator('[data-commencer="empatage"]').click()};
 ctx.answers=async()=>{for(let i=0;i<3;i++){const answer=await page.evaluate(i=>Ecole.LECONS[0].quiz[i][1],i);await page.locator('[data-replecon]').getByText(answer,{exact:true}).click();await page.locator('[data-quizsuite]').click()}};
 ctx.daily=async()=>{await page.locator('[data-ongletveillee="questions"]').click()};
 ctx.dailySolution=async()=>{
  const current=await page.locator('#veillee-question').evaluate(el=>({q:el.querySelector('.enonce').textContent,module:el.querySelector('.module').textContent}));
  const matches=await page.evaluate(({q,module})=>DONNEES_JEU.quiz.cartes.filter(c=>c.q===q&&DONNEES_JEU.quiz.modules[c.d]===module).map(c=>c.r),current);
  ctx.assert.equal(matches.length,1,'Une réponse unique pour la question et son module');return matches[0];
 };
 ctx.dailyAnswer=async()=>{const answer=await ctx.dailySolution();await page.locator('#veillee-question [data-rep]').getByText(answer,{exact:true}).click()};
 await check(ctx);
});
