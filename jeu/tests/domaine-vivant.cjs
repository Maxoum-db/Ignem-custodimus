const {chromium}=require('playwright'),fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
const out=process.env.CAPTURE_DIR||'docs/captures/domaine-vivant';
const seed={mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,points:500,brassins:2,ecus:5000,possede:[],carnet:[],grimoire:[],ecole:{},succes:{},bat:{brasserie:3,chai:2,distillerie:2,pigeonnier:3},travaux:[],equip:{grille:true},cal:{s:15},vus:{domaine:true,brasserie:true}};
(async()=>{
 const server=http.createServer((q,r)=>{r.setHeader('Content-Type','text/html; charset=utf-8');r.end(fs.readFileSync('dist/index.html'))});await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});fs.mkdirSync(out,{recursive:true});const metrics=[];
  for(const width of [320,390])for(const reduce of [false,true])for(const night of [false,true]){
   const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:reduce?'reduce':'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(({s,night})=>{Date.prototype.getHours=()=>night?23:12;localStorage.setItem('ignem.v1',JSON.stringify(s))},{s:seed,night});
   await page.goto(`http://127.0.0.1:${server.address().port}`);await page.evaluate(()=>DomaineIllustre.ready);await page.locator('#carte').scrollIntoViewIfNeeded();
   const before=await page.evaluate(()=>localStorage.getItem('ignem.v1'));
   const first=await page.locator('#carte').evaluate(c=>c.toDataURL());await page.waitForTimeout(250);const second=await page.locator('#carte').evaluate(c=>c.toDataURL());assert.equal(first===second,reduce,'Mouvement réduit stable, animation normale visible');
   if(!reduce){
    const regions=await page.evaluate(s=>{
     const c=document.querySelector('#carte').getContext('2d'),state={saison:'été',nuit:s.night,bat:s.bat,equip:s.equip,travaux:[]};
     const areas={poules:[76,168,33,29],chat:[66,115,25,20],cheval:[102,184,74,34],pigeons:[25,125,38,18],potager:[19,202,33,25],ciel:[45,0,125,12],fenetre:[77,91,6,9]};
     const take=t=>{DomaineIllustre.render(c,t,state);const scale=c.canvas.width/192;return Object.fromEntries(Object.entries(areas).map(([name,r])=>{const data=c.getImageData(...r.map(v=>Math.round(v*scale))).data;let h=2166136261;for(const n of data)h=Math.imul(h^n,16777619);return[name,h>>>0]}))};
     const a=take(0),b=take(2.3),initial=JSON.stringify(state),samples=[];
     for(const saison of ['printemps','été','automne','hiver'])for(const nuit of [false,true]){DomaineIllustre.render(c,3,{...state,saison,nuit});samples.push(c.canvas.toDataURL())}
     return {changed:Object.fromEntries(Object.keys(areas).map(k=>[k,a[k]!==b[k]])),states:new Set(samples).size,unchanged:initial===JSON.stringify(state)};
    },{...seed,night});for(const [name,changed]of Object.entries(regions.changed))if((name!=='pigeons'||!night)&&(name!=='fenetre'||night))assert.ok(changed,'Animation locale : '+name);assert.equal(regions.states,8);assert.equal(regions.unchanged,true);
    const contraste=await page.evaluate(s=>{
     const c=document.querySelector('#carte').getContext('2d'),state={saison:'été',bat:s.bat,equip:s.equip,travaux:[]};
     const luminosite=nuit=>{DomaineIllustre.render(c,0,{...state,nuit});const scale=c.canvas.width/192,d=c.getImageData(Math.round(103*scale),Math.round(65*scale),Math.round(15*scale),Math.round(15*scale)).data;let n=0;for(let i=0;i<d.length;i+=4)n+=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];return n/(d.length/4)};
     const jour=luminosite(false),nuit=luminosite(true);return {jour,nuit,rapport:nuit/jour};
    },seed);assert.ok(contraste.rapport<.35,'Nuit nettement plus sombre que le jour');assert.ok(contraste.nuit>8,'Détails du décor nocturne encore visibles');
    const positions=await page.evaluate(s=>{
     const c=document.querySelector('#carte').getContext('2d'),native=c.drawImage,found={},ordre=[];
     c.drawImage=function(im,...args){if(im.src===IMAGES_JEU['domaine-terrain'])ordre.push('fond');if(im.src===IMAGES_JEU['domaine-cheval'])ordre.push('cheval');for(const name of ['cheval','animal-chat-noir','animal-poule-brune'])if(im.src===IMAGES_JEU[name==='cheval'?'domaine-cheval':name]){const m=c.getTransform(),scale=c.canvas.width/192;(found[name]??=[]).push({x:m.e/scale,y:m.f/scale})}return native.call(this,im,...args)};
     const state={saison:'été',nuit:false,bat:s.bat,equip:s.equip,travaux:[]},before=JSON.stringify(state);
     try{for(let t=0;t<=96;t+=.5)DomaineIllustre.render(c,t,state)}finally{c.drawImage=native}
     return {premierPlan:ordre.slice(-3).join(',')==='fond,cheval,fond',unchanged:before===JSON.stringify(state),actors:Object.fromEntries(Object.entries(found).map(([k,ps])=>[k,{min:Math.min(...ps.map(p=>p.x)),max:Math.max(...ps.map(p=>p.x)),inside:ps.every(p=>p.x>10&&p.x<168&&p.y<244),piedsMax:Math.max(...ps.map(p=>p.y))}]))};
    },seed);assert.ok(positions.premierPlan,'Le premier plan est redessiné devant le cheval');assert.ok(positions.unchanged);for(const [name,a]of Object.entries(positions.actors)){assert.ok(a.inside,name+' reste dans la scène');assert.ok(a.max-a.min>(name==='animal-poule-brune'?5:20),name+' vraie promenade, pas seulement respiration')}assert.equal(Object.keys(positions.actors).length,3);assert.ok(positions.actors.cheval.piedsMax<217,'Le cheval garde ses pieds dans le pré, au-dessus du muret');
    await page.evaluate(()=>{const native=DomaineIllustre;window.__draws=0;window.DomaineIllustre={...native,render(...args){window.__draws++;return native.render(...args)}}});await page.waitForTimeout(1000);const draws=await page.evaluate(()=>__draws);assert.ok(draws>0&&draws<=35,'Cadence plafonnée : '+draws);metrics.push({width,night,draws_in_one_second:draws,regions:regions.changed,promenades:positions.actors,contraste});
    await page.screenshot({path:`${out}/domaine-${width}${night?'-nuit':''}.png`});
    if(width===390&&!night){
     const recording=await page.evaluate(async()=>{
      const canvas=document.querySelector('#carte');if(!window.MediaRecorder||!MediaRecorder.isTypeSupported('video/webm;codecs=vp8'))return null;
      const stream=canvas.captureStream(30),recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp8'}),chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const stopped=new Promise(r=>recorder.onstop=r);recorder.start();await new Promise(r=>setTimeout(r,5000));recorder.stop();await stopped;stream.getTracks().forEach(t=>t.stop());return new Promise(r=>{const reader=new FileReader();reader.onload=()=>r(reader.result.split(',')[1]);reader.readAsDataURL(new Blob(chunks,{type:recorder.mimeType}))});
     });if(recording){fs.writeFileSync(`${out}/domaine-reel.webm`,Buffer.from(recording,'base64'));assert.ok(fs.statSync(`${out}/domaine-reel.webm`).size>1000)}
    }
    assert.equal(await page.evaluate(()=>localStorage.getItem('ignem.v1')),before,'Aucun gain ou calendrier modifié par les animations');
    await page.locator('#lieux').getByRole('button',{name:'Brasserie',exact:true}).tap();await page.locator('#ecran-brasserie').waitFor({state:'visible'});await page.waitForTimeout(100);const stopped=await page.evaluate(()=>__draws);await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>__draws),stopped,'Arrêt du domaine en quittant l’écran');
   }else await page.screenshot({path:`${out}/mouvement-reduit-${width}${night?'-nuit':''}.png`});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log(`✓ Domaine vivant ${width}px ${night?'nuit':'jour'} ${reduce?'réduit':'animé'} : rendu, états, accès et erreurs vérifiés`);await page.close();
  }
  fs.writeFileSync(`${out}/mesures.json`,JSON.stringify(metrics,null,2)+'\n');
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
