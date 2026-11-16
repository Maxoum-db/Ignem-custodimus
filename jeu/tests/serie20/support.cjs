const run=require('../lot50/support.cjs'),fs=require('node:fs');
module.exports=(id,check)=>run('serie20-'+id,async ctx=>{
 ctx.capture=async selector=>{fs.mkdirSync('docs/captures/serie20',{recursive:true});await ctx.page.locator(selector).first().evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await ctx.page.screenshot({path:`docs/captures/serie20/${id}-${ctx.width}.png`})};
 await check(ctx);
});
