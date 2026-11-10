// Validation de la vraie entrée de distillerie, après build.
const {chromium}=require('playwright');
const fs=require('node:fs');
const http=require('node:http');
const assert=require('node:assert/strict');
(async()=>{
  const server=http.createServer((req,res)=>{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync('dist/index.html'));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  let browser;
  try {
    browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
    const results=[];
    for(const width of [320,390]) {
      const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
      await page.route('https://**/*',r=>r.abort());
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      // Fixture ancienne : migration normale des bâtiments, sans partie personnelle.
      await page.evaluate(()=>localStorage.setItem('ignem.v1',JSON.stringify({mode:'expert',aide:false,son:false,tuto:-1,tutoD:-1,brassins:2,points:150,carnet:[]})));
      await page.reload();
      await page.locator('#lieux .lieu').filter({hasText:'Ulysse'}).click();
      await page.locator('#ecran-distillerie').waitFor({state:'visible'});
      await page.waitForTimeout(350);
      const before=await page.evaluate(()=>localStorage.getItem('ignem.v1'));
      const dimensions=await page.locator('#ulysse').evaluate(cv=>({css:cv.getBoundingClientRect().width,bitmap:cv.width,dpr:devicePixelRatio,illustrated:cv.classList.contains('atelier-illustre')}));
      assert.ok(dimensions.css>150);
      assert.ok(dimensions.illustrated,'renderer illustré absent');
      assert.ok(dimensions.bitmap>=Math.round(dimensions.css*dimensions.dpr)-1,JSON.stringify(dimensions));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'débordement horizontal');
      assert.ok(await page.locator('#btn-distiller').isDisabled(),'aucun lot sélectionné');
      fs.mkdirSync('docs/captures',{recursive:true});
      await page.screenshot({path:`docs/captures/ulysse-entree-${width}.png`,fullPage:true});
      assert.equal(await page.evaluate(()=>localStorage.getItem('ignem.v1')),before,'la capture modifie la sauvegarde');
      assert.deepEqual(errors,[]);
      results.push({width,...dimensions,errors});
      await page.close();
    }
    console.log(JSON.stringify(results,null,2));
  } finally {if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);process.exitCode=1;});
