const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
module.exports=async function run(name,check){
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(fs.readFileSync('dist/index.html'))});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
  for(const width of [320,390]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(30000);
   const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await page.route('https://**/*',r=>r.abort());
   await page.goto(`http://127.0.0.1:${server.address().port}`);
   await page.evaluate(()=>{
    const etat=Chai.etatInitial({V:50,degre:63.5,total:45,sources:['malt']});
    localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:500,brassins:2,ecus:5000,carnet:[],cal:{s:2000},bat:{brasserie:3,distillerie:1,chai:2,pigeonnier:3},chai:{cols:10,futs:[
     {id:'vide',type:'bourbon',taille:'quartaut',rem:0,pos:{r:1,c:0},contenu:null},
     {id:'plein',type:'cahors',taille:'quartaut',rem:0,pos:{r:1,c:2},contenu:{etat,debut:1792,noms:['Lot témoin']}},
     {id:'cour',type:'francais',taille:'barrique',rem:0,pos:null,contenu:null}
    ],lots:[{id:'lot1',nom:'Cuve témoin',noms:['Lot témoin'],etat},{id:'lot2',nom:'Deuxième cuve',noms:['Autre lot'],etat} ]}}));
   });await page.reload();
   const dismiss=async()=>{if(await page.locator('#tuto-passer').isVisible())await page.locator('#tuto-passer').click()};
   const nav=async(screen)=>{await dismiss();await page.locator('.marque').click();await page.locator('#lieux').getByRole('button',{name:{chai:'Chai',catalogue:'Pigeonnier'}[screen],exact:true}).click();await dismiss();await page.waitForTimeout(350)};
   const save=async()=>{await page.waitForTimeout(350);return page.evaluate(()=>JSON.parse(localStorage.getItem('ignem.v1')))};
   const snap=async(selector)=>{fs.mkdirSync('docs/captures/serie',{recursive:true});const el=selector?page.locator(selector):page;await el.screenshot({path:`docs/captures/serie/${name}-${width}.png`})};
   await check({page,width,nav,save,snap,assert,dismiss});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'débordement '+name);assert.deepEqual(errors,[]);
   console.log(`✓ ${name} ${width}px, aucune erreur JS ni débordement`);await page.close();
  }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
};
