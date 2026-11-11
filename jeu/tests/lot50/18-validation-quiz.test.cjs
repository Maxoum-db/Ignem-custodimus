require('./support.cjs')('18-validation-quiz',async({page,reset,daily,dailySolution,dailyAnswer,save,capture,assert})=>{
 const answers=[];
 for(const module of ['deck-mod-M-ENER','deck-mod-M-BRASS']){
  const jour=await page.evaluate(()=>new Date().toISOString().slice(0,10));await reset({quiz:{jour,faits:0,bonnes:0,serie:0}});
  await page.evaluate(module=>{const cards=DONNEES_JEU.quiz.cartes,index=cards.findIndex(c=>c.q==='Dimensionnement'&&c.d===module);if(index<0)throw Error('Carte témoin absente');Math.random=()=>(index+.01)/cards.length},module);
  await daily();assert.equal(await page.locator('#veillee-question .enonce').textContent(),'Dimensionnement');const expectedModule=await page.evaluate(module=>DONNEES_JEU.quiz.modules[module],module);assert.equal(await page.locator('#veillee-question .module').textContent(),expectedModule);answers.push(await dailySolution());const before=await save();await dailyAnswer();const after=await save();assert.equal(after.quiz.bonnes,1);assert.equal(after.quiz.faits,1);assert.equal(after.ecus,before.ecus+4);
 }
 assert.notEqual(answers[0],answers[1]);await capture('#veillee-question');
}).catch(e=>{console.error(e);process.exitCode=1});
