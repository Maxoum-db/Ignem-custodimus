// Tests du moteur sur des recettes de référence, à l'échelle Prométhée (1000 L)
import { donneesJeu } from '../../scripts/construire-jeu.mjs';
import fs from 'node:fs';
import vm from 'node:vm';
// Le moteur est un script navigateur : on l'exécute dans un contexte isolé
const ctx = { globalThis: {} };
vm.runInNewContext(fs.readFileSync(new URL('../src/moteur.js', import.meta.url), 'utf8'), ctx);
const M = ctx.globalThis.Moteur;

const D = await donneesJeu();
M.init(D);
const id = (liste, nom) => { const x = D[liste].find((e) => e.nom === nom); if (!x) throw new Error('Introuvable : ' + nom); return x.id; };
const malt = (n, kg) => ({ id: id('malts', n), kg });
const hop = (n, g, min) => ({ id: id('houblons', n), g, min });

const RECETTES = {
  'Pils allemande': {
    attendu: /Pilsener Allemande/, malts: [malt('Pilsner Soufflet Bio', 200), malt('Acidulated (Sauermalz) Weyermann', 5)],
    houblons: [hop('Magnum', 900, 60), hop('Saaz', 1500, 10)], levure: id('levures', 'SafLager W-34/70'),
    eau: 'pilsen', palier: 64, ebullition: 90, fermentation: { temp: 11, reposDiacetyle: true },
  },
  'IPA américaine': {
    attendu: /American IPA/, malts: [malt('Pale Ale Soufflet', 245), malt('CARAHELL Weyermann', 15)],
    houblons: [hop('Magnum', 1600, 60), hop('Cascade', 3000, 5), hop('Cascade', 6000, -1)], levure: id('levures', 'Safale US-05'),
    eau: 'burton', palier: 66, ebullition: 60, fermentation: { temp: 19, reposDiacetyle: false },
  },
  'Dry stout': {
    attendu: /Dry Stout/, malts: [malt('Maris Otter Crisp', 150), malt('Orge Torréfié 1150 EBC', 18), malt("Flocons d'Avoine", 15)],
    houblons: [hop('East Kent Goldings', 3000, 60)], levure: id('levures', 'Safale S-04'),
    eau: 'dublin', palier: 67, ebullition: 60, fermentation: { temp: 18, reposDiacetyle: false },
  },
  'Weizen': {
    attendu: /Weizen/, malts: [malt('Malt de Blé', 125), malt('Pilsner Soufflet Bio', 85), malt('Acidulated (Sauermalz) Weyermann', 4)],
    houblons: [hop('Hallertau Mittelfrüh', 1300, 60)], levure: id('levures', 'Safale WB-06'),
    eau: 'munich', palier: 67, ebullition: 90, fermentation: { temp: 19, reposDiacetyle: false },
  },
  'Ratée exprès': {
    attendu: null, malts: [malt('Pilsner Soufflet Bio', 210)], houblons: [hop('Magnum', 900, 60)], levure: id('levures', 'Safale US-05'),
    eau: 'causse', palier: 66, ebullition: 60, fermentation: { temp: 27, reposDiacetyle: false },
  },
};

let echecs = 0;
for (const [nom, rec] of Object.entries(RECETTES)) {
  const r = M.calculer({ volume: 1000, rendement: 0.75, ...rec });
  const n = M.noter(r, { mode: 'expert' });
  console.log(`\n${nom}\n  OG ${r.og.toFixed(3)}  FG ${r.fg.toFixed(3)}  ${r.abv.toFixed(1)} %  ${r.ibu.toFixed(0)} IBU  ${r.ebc.toFixed(0)} EBC  pH ${r.ph.toFixed(2)}`);
  console.log(`  Style : ${r.style.style.nom} (${Math.round(r.style.conformite * 100)} %), puis ${r.styles[1].style.nom}`);
  console.log(`  Profil : ${Object.entries(r.profil).map(([k, v]) => `${k} ${v.toFixed(1)}`).join(', ')}`);
  console.log(`  Jury : ${JSON.stringify(n.lignes)} = ${n.total}/50 ${n.medaille || 'sans médaille'}`);
  console.log(`  Défauts : ${n.defauts.map((d) => d.nom).join(', ') || 'aucun'}`);
  const c = M.conseils(r, { volume: 1000, rendement: 0.75, ...rec });
  if (c.length) console.log(`  Conseil : ${c[0].txt}`);
  if (rec.attendu && !rec.attendu.test(r.style.style.nom)) { echecs++; console.log('  ✗ style attendu', rec.attendu); }
  if (rec.attendu && n.total < 38) { echecs++; console.log('  ✗ une recette juste devrait obtenir au moins l\'argent'); }
  if (!rec.attendu && n.defauts.length < 2) { echecs++; console.log('  ✗ la recette ratée devrait cumuler des défauts'); }
}
console.log(echecs ? `\n${echecs} échec(s)` : '\nTous les tests passent.');
process.exit(echecs ? 1 : 0);
