#!/usr/bin/env python3
"""Planches consultables des vraies captures viewport (aucun mockup)."""
import argparse,json
from pathlib import Path
from PIL import Image,ImageDraw
p=argparse.ArgumentParser();p.add_argument('dossier',type=Path);a=p.parse_args();r=json.loads((a.dossier/'rapport.json').read_text());names=list(dict.fromkeys(x['etat'] for x in r['captures']))
for debut in range(0,len(names),20):
 groupe=names[debut:debut+20];im=Image.new('RGB',(975,((len(groupe)+4)//5)*455),'#1f1a14');d=ImageDraw.Draw(im)
 for i,n in enumerate(groupe):
  source=Image.open(a.dossier/(n+'.jpg'));source.thumbnail((195,422));x=(i%5)*195;y=(i//5)*455;im.paste(source,(x,y));d.text((x+3,y+424),n[:29],fill='#f6ead0')
 im.save(a.dossier/('planche-%02d.jpg'%(debut//20+1)),quality=85)
print(len(names),'états sur', (len(names)+19)//20,'planches')
