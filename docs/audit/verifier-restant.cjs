const run=require('../../jeu/tests/lot50/support.cjs');
const fs=require('node:fs');const result=[];
const auditedRef=require('node:child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
fs.mkdirSync('docs/captures/audit-restant',{recursive:true});
fs.mkdirSync('docs/audit',{recursive:true});
const recette=(min=60)=>({volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons:[{id:'hops_aroma_saaz',g:250,min}],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:60,fermentation:{temp:18,reposDiacetyle:false}});
run('audit-restant',async({page,to,reset,save,assert,width})=>{
 const row={width,doses:[]};
 for(const [level,volume] of [[1,100],[2,500]]){
  await reset({mode:'expert',tuto:-1,tutoD:-1,bat:{brasserie:level,distillerie:1,chai:2,pigeonnier:3},recette:{volume,malts:[],houblons:[],levure:null}});
  await to('brasserie');await page.locator('#tab-houblons').click();const button=page.locator('[data-ajouter="houblon"]').first();
  const label=await button.textContent(),aria=await button.getAttribute('aria-label');await button.click();const s=await save();row.doses.push({volume:s.recette.volume,label,aria,addedGrams:s.recette.houblons[0].g});
 }
 await to('distillerie');
 row.distButtons=await page.locator('#dist-reglages [data-rd]').evaluateAll(nodes=>nodes.map(el=>({label:el.textContent,height:el.getBoundingClientRect().height})));
 row.distRanges=await page.locator('#dist-reglages input[type="range"]').evaluateAll(nodes=>nodes.map(el=>({id:el.id,height:el.getBoundingClientRect().height})));
 await page.locator('#dist-reglages').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`docs/captures/audit-restant/ulysse-${width}.png`});
 await reset({tuto:0,mode:'debutant',aide:true,vus:{domaine:true,veillee:true}});await to('domaine');await page.locator('#mentor-actions .btn').first().waitFor();
 row.mentorButtons=await page.locator('#mentor-actions .btn').evaluateAll(nodes=>nodes.map(el=>({label:el.textContent,height:el.getBoundingClientRect().height})));
 let installed=false;
 for(const min of [0,60]){
  await reset({mode:'expert',tuto:-1,tutoD:-1,aide:false,gestesExpert:true,bat:{brasserie:3,distillerie:1,chai:2,pigeonnier:3},recette:recette(min),vus:{domaine:true,veillee:true,empatage:true,filtration:true,ebullition:true}});
  await to('brasserie');await page.locator('#btn-lancer').click();await page.locator('#emp-passer').click();await page.locator('#fil-passer').click();
  if(!installed){await page.clock.install({time:new Date('2026-11-11T12:00:00Z')});installed=true}
  const now=await page.evaluate(()=>Date.now());await page.clock.pauseAt(new Date(now+1000));await page.locator('#ebu-go').click();
  if(min===0){
   await page.clock.runFor(23050);
   row.zeroHop={score:await page.locator('#ebu-bilan .gros').textContent(),doneMarkers:await page.locator('#ebu-frise .repere-h.fait').count(),button:await page.locator('#ebu-jeter').textContent(),disabled:await page.locator('#ebu-jeter').isDisabled()};
  }else{
   await page.clock.runFor(5033);await page.locator('#ebu-jeter').tap();await page.clock.runFor(18000);
   row.timerAfterLastHop={remaining:await page.locator('#ebu-infos .v').first().textContent(),cursorPercent:await page.locator('#ebu-frise .curseur').evaluate(el=>parseFloat(el.style.left)),score:await page.locator('#ebu-bilan .gros').textContent()};
  }
  await page.clock.resume();await page.locator('#ebu-bilan').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await page.screenshot({path:`docs/captures/audit-restant/houblon-${min}-${width}.png`});
 }
 result.push(row);fs.writeFileSync('docs/audit/mesures-runtime.json',JSON.stringify({audited_ref:auditedRef,cases:result},null,2)+'\n');console.log(JSON.stringify(row));
}).catch(e=>{console.error(e);process.exitCode=1});
