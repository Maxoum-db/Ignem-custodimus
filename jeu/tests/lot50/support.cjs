const run=require('../veillee/support.cjs');const fs=require('node:fs');
module.exports=(id,check)=>run('lot50-'+id,async ctx=>{
 const {page}=ctx;
 ctx.to=async screen=>{
  await ctx.dismiss();
  if(screen==='domaine')await page.locator('.marque').click();
  else if(['brasserie','chai','catalogue','distillerie'].includes(screen)){await page.locator('.marque').click();await page.evaluate(()=>window.DomaineIllustre?.ready);await page.locator('#lieux').getByRole('button',{name:{brasserie:'Brasserie',chai:'Chai',catalogue:'Pigeonnier',distillerie:'Alambic Ulysse'}[screen],exact:true}).click()}
  else if(screen==='recherche')await page.locator('[data-aller="recherche"]').click();
  else {await page.locator('#btn-menu').click();await page.locator(`#menu-entete [data-aller="${screen}"]`).click()}
  await page.locator('#ecran-'+screen).waitFor({state:'visible'});await ctx.dismiss();
 };
 ctx.capture=async selector=>{fs.mkdirSync('docs/captures/lot50',{recursive:true});await page.locator(selector).first().evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await page.screenshot({path:`docs/captures/lot50/${id}-${await page.evaluate(()=>innerWidth)}.png`})};
 await check(ctx);
});
