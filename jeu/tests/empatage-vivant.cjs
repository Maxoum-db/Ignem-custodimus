// Renderer réel et commandes du jeu ; aucune physique remplacée.
const {chromium}=require('playwright'),fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const out='docs/captures/empatage-vivant';
const recette={volume:1000,rendement:.75,malts:[{id:'malts_base_pilsner_soufflet_bio',kg:200}],houblons:[{id:'hops_aroma_saaz',g:250,min:60}],levure:'yeasts_ale_safale_us_05',eau:'causse',palier:66,ebullition:60,fermentation:{temp:18,reposDiacetyle:false}};
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(fs.readFileSync('dist/index.html'))});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});fs.mkdirSync(out,{recursive:true});const mesures=[];
  for(const width of [320,390])for(const reduce of [false,true]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:reduce?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(r=>{if(sessionStorage.getItem('fixture'))return;localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',gestesExpert:true,aide:false,son:false,tuto:-1,tutoD:-1,points:150,brassins:2,carnet:[],grimoire:[],ecole:{},succes:{},ecus:500,recette:r,vus:{domaine:true,brasserie:true,empatage:true,filtration:true}}));sessionStorage.setItem('fixture','1')},recette);
   await page.goto(`http://127.0.0.1:${server.address().port}`);await page.evaluate(()=>DomaineIllustre.ready);await page.locator('#lieux').getByRole('button',{name:'Brasserie',exact:true}).tap();await page.locator('#btn-lancer').tap();await page.locator('#emp-canvas').scrollIntoViewIfNeeded();
   const variants=await page.evaluate(()=>{
    const c=document.querySelector('#emp-canvas').getContext('2d'),s={t:1,T:65,target:66,H:2,v:.7,p:2,volume:1000,capacity:1250},original=JSON.stringify(s);
    const hash=(state,area)=>{AteliersJeu.render(c,'emp',state);const scale=c.canvas.width/768,data=c.getImageData(...area.map(v=>Math.round(v*scale))).data;let h=2166136261;for(const x of data)h=Math.imul(h^x,16777619);return h>>>0};
    const surface=[215,181,185,27],flux=[440,311,76,27];
    const moving=hash(s,surface)!==hash({...s,t:1.7},surface),flow=hash(s,flux)!==hash({...s,t:1.7},flux);
    const closed={...s,v:0},cold={...s,H:0};
    const closedStable=hash(closed,flux)===hash({...closed,t:1.7},flux),coldStable=hash(cold,surface)===hash({...cold,t:1.7},surface);
    const stir={...cold,evt:{id:'fourquet',t0:1}};
    const stirVisible=hash(stir,surface)!==hash(cold,surface),stirExpired=hash({...cold,t:4,evt:{id:'fourquet',t0:1}},surface)===hash({...cold,t:4},surface);
    return {moving,flow,closedStable,coldStable,stirVisible,stirExpired,unchanged:original===JSON.stringify(s)};
   });
   assert.equal(variants.moving,!reduce);assert.equal(variants.flow,!reduce);for(const key of ['closedStable','coldStable','stirVisible','stirExpired','unchanged'])assert.ok(variants[key],key);
   // Le lancement suivant redessine depuis le contrôleur réel, resté inchangé.
   await page.evaluate(()=>{const native=AteliersJeu;window.__emp=null;window.AteliersJeu={...native,render(c,name,s){if(name==='emp')window.__emp=JSON.parse(JSON.stringify(s));return native.render(c,name,s)}}});
   await page.locator('#emp-go').tap();await page.waitForTimeout(100);const button=page.locator('#emp-vapeur');await button.scrollIntoViewIfNeeded();const rect=await button.boundingBox();assert.ok(rect.height>=44);
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();await page.waitForFunction(()=>__emp?.v>.3&&__emp.H>.1);const open=await page.evaluate(()=>({v:__emp.v,H:__emp.H,t:__emp.t}));
   await page.screenshot({path:`${out}/vanne-ouverte-${width}${reduce?'-reduit':''}.png`});await page.mouse.up();await page.waitForFunction(()=>__emp?.v<.02);const closed=await page.evaluate(()=>({v:__emp.v,H:__emp.H,t:__emp.t}));assert.ok(closed.H>0,'Inertie après fermeture conservée');
   if(width===390&&!reduce){
    const video=await page.evaluate(async()=>{if(!window.MediaRecorder||!MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))return null;const stream=document.querySelector('#emp-canvas').captureStream(30),rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'}),chunks=[];rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const done=new Promise(r=>rec.onstop=r);rec.start();await new Promise(r=>setTimeout(r,3000));rec.stop();await done;stream.getTracks().forEach(t=>t.stop());return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:rec.mimeType}))})});if(video)fs.writeFileSync(`${out}/empatage-reel.webm`,Buffer.from(video,'base64'));
   }
   await page.locator('#emp-suite').waitFor({state:'visible',timeout:35000});const bilan=await page.locator('#emp-bilan').textContent();assert.match(bilan,/%/);await page.locator('#emp-suite').tap();await page.locator('#ecran-filtration').waitFor({state:'visible'});const last=await page.evaluate(()=>JSON.stringify(__emp));await page.waitForTimeout(120);assert.equal(await page.evaluate(()=>JSON.stringify(__emp)),last,'Aucun dessin empâtage après sortie');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);mesures.push({width,reduced:reduce,variants,open,closed,bilan});console.log(`✓ Empâtage ${width}px ${reduce?'réduit':'animé'} : rendu, vanne, inertie, bilan et sortie`);await page.close();
  }
  fs.writeFileSync(`${out}/mesures.json`,JSON.stringify(mesures,null,2)+'\n');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
