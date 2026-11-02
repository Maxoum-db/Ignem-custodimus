#!/usr/bin/env python3
"""Mesure HTTP réelle gzip ; débit et CPU simulés via CDP, aucun temps inventé."""
import argparse,gzip,json,threading
from pathlib import Path
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--sortie',type=Path,default=root/'univers/performance-4g.json');opt=parser.parse_args()
body=gzip.compress((root.parent/'dist/index.html').read_bytes())
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Encoding','gzip');self.send_header('Content-Length',str(len(body)));self.end_headers();self.wfile.write(body)
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True);pg=c.new_page();cdp=c.new_cdp_session(pg);cdp.send('Network.enable');cdp.send('Network.emulateNetworkConditions',{'offline':False,'latency':80,'downloadThroughput':1250000,'uploadThroughput':200000,'connectionType':'cellular4g'});cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
 pg.goto('http://127.0.0.1:'+str(server.server_port)+'/index.html',wait_until='load');pg.locator('#carte[data-univers="domaine"]').wait_for()
 result={'gzip_octets':len(body),'dcl_ms':round(pg.evaluate('performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd')),'carte_prete_ms':round(pg.evaluate('performance.now()')),'profil':'Chromium 390×844 DPR2 ; HTTP gzip réel ; 10 Mbit/s, RTT80ms, CPU×4, cache vide. Un seul essai, pas une garantie Android physique.'};b.close()
server.shutdown();server.server_close();opt.sortie.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(result)
