const {chromium}=require('playwright');
const fs=require('node:fs'),http=require('node:http'),assert=require('node:assert/strict');
(async()=>{
 const html=fs.readFileSync('dist/index.html','utf8');
 const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(req.url==='/absent'?html.replaceAll('"personnage-firmin":','"personnage-firmin-absent":'):html)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 for(const [width,absent] of [[320,false],[390,false],[390,true]]){
 const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route('https://**/*',r=>r.abort());
 const url=`http://127.0.0.1:${server.address().port}${absent?'/absent':'/'}`;
 await page.goto(url);
 await page.evaluate(()=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:true,son:false,tuto:-1,tutoD:0,points:150,brassins:2,carnet:[]})));
 await page.reload();await page.locator('#lieux .lieu').filter({hasText:'Ulysse'}).click();
 await page.locator('#mentor').waitFor({state:'visible'});
 await page.waitForFunction(expected=>document.querySelector('#mentor-portrait').naturalWidth===expected,absent?48:144);
 assert.equal(await page.locator('#mentor-nom').textContent(),'Firmin');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.waitForTimeout(350);const saved=await page.evaluate(()=>localStorage.getItem('ignem.v1'));
 fs.mkdirSync('docs/captures',{recursive:true});
 if(!absent)await page.screenshot({path:`docs/captures/firmin-portrait-${width}.png`,fullPage:true});
 assert.equal(await page.evaluate(()=>localStorage.getItem('ignem.v1')),saved);
 await page.locator('#mentor-actions button').click();assert.ok(await page.locator('#mentor').isHidden());
 assert.deepEqual(errors,[]);console.log(`✓ Firmin ${width}px : ${absent?'repli sans asset':'portrait 144px'}, dialogue, largeur et sauvegarde`);await page.close();
 }
 }finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
