const run=require('../finitions/support.cjs');
module.exports=(name,check)=>run('p'+name,async ctx=>{
 const {page,nav}=ctx;
 const fixture=await page.evaluate(()=>{
  const s=JSON.parse(localStorage.getItem('ignem.v1'));Object.assign(s,{possede:[],bat:{brasserie:3,distillerie:1,chai:2,pigeonnier:3},cal:{s:2000},points:500,ecus:5000,brassins:2,aide:false,son:false,tuto:-1,tutoD:-1});
  const recette={volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons:[{id:'hops_aroma_saaz',g:250,min:10}],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:60,fermentation:{temp:18,reposDiacetyle:false}};
  const r=Moteur.calculer(recette);
  s.carnet=[{id:'biere',nom:'Blonde du Quercy',type:'biere',stockL:100,recette,og:r.og,fg:r.fg,abv:r.abv,ibu:r.ibu,ebc:r.ebc,total:42,defauts:[],style:'Blonde',sujet:'blonde',semaine:2000},
   {id:'edv',nom:'Eau-de-vie Ulysse',type:'edv',coeur:{V:40,degre:60,lap:24},total:42,ebc:0,comp:{esters:1,fusels:1},semaine:2000},
   {id:'vieux',nom:'Réserve du domaine',type:'vieilli',style:'Whisky de malt',stockB:30,bouteilles:30,total:45,age:6,ebc:28,profil:{vanille:5},futs:[],semaine:2000}];
  s.vente={rep:40,vendus:0,ca:0,clients:[{id:'c-biere',nom:'Jeanne du Quercy',type:'particulier',lieu:'Cayriech',demande:'blonde',txt:'Une blonde légère pour le repas du village.',qte:10,semaine:2000},{id:'c-edv',nom:'Paul du Causse',type:'particulier',lieu:'Cahors',demande:'digestif',txt:'Un digestif pour terminer le repas.',qte:2,semaine:2000}],commandes:[{id:'commande',nom:'Le comité des fêtes de Cayriech',cat:'biere',demande:'blonde',txt:'Une blonde pour la fête du village.',qte:20,note:34,echeance:2002,prime:60,rep:4}]};
  s.vus={domaine:true,catalogue:true,chai:true,batiments:true};return s;
 });await page.addInitScript(seed=>{if(sessionStorage.getItem('pigeonnier-fixture'))return;localStorage.setItem('ignem.v1',JSON.stringify(seed));sessionStorage.setItem('pigeonnier-fixture','1')},fixture);await page.reload();await nav('catalogue');await page.locator('.avatar-client').first().waitFor({state:'visible'});
 ctx.sell=async()=>{await page.locator('[data-conseiller="c-biere"]').click();await page.locator('[data-proposer="c-biere|biere"]').click();return ctx.save()};
 await check(ctx);
});
