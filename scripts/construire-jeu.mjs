#!/usr/bin/env node
// Construit le jeu : extrait un jeu de données compact depuis data/*.json,
// puis assemble jeu/src/* en une page autonome.
//   dist/index.html     page complète (hébergement web, Vercel)
//   dist/artefact.html  même contenu sans <html>/<head>/<body> (aperçu Claude)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = async (f) => JSON.parse(await fs.readFile(path.join(RACINE, 'data', f), 'utf8')).donnees;
const src = (f) => fs.readFile(path.join(RACINE, 'jeu', 'src', f), 'utf8');
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const court = (t, n = 140) => (t ? String(t).replace(/\s+/g, ' ').trim().slice(0, n) : null);

// --- Paliers de déblocage (0 = disponible dès le départ) -------------------
const DEPART_MALTS = [/^Pilsner Soufflet Bio$/, /^Pale Ale Soufflet$/, /^Maris Otter Crisp$/, /^Munich Light Château 15 EBC$/,
  /^Vienna Weyermann$/, /^Malt de Blé$/, /^CARAHELL Weyermann$/, /^Caramunich Soufflet 100 EBC$/, /^Malt Chocolat$/,
  /^Orge Torréfié 1150 EBC$/, /^Flocons d'Avoine$/, /^Flocons de Blé$/, /^Acidulated \(Sauermalz\) Weyermann$/, /^Miel brut local$/];
const DEPART_HOUBLONS = ['Saaz', 'Strisselspalt', 'Hallertau Mittelfrüh', 'East Kent Goldings', 'Cascade', 'Magnum', 'Barbe Rouge'];
const DEPART_LEVURES = ['Safale US-05', 'Safale S-04', 'SafLager W-34/70', 'Safale WB-06', 'LalBrew Belle Saison'];

function palierMalt(m) {
  if (DEPART_MALTS.some((r) => r.test(m.nom))) return 0;
  return { base: 1, kilned: 1, caramel: 1, roasted: 2, adjuncts: 2, sugars: 4 }[m.famille] ?? 3;
}
function palierHoublon(h) {
  if (DEPART_HOUBLONS.includes(h.nom)) return 0;
  if (['FR', 'UK'].includes(h.pays)) return 1;
  if (['DE', 'CZ', 'PL', 'SI'].includes(h.pays)) return 2;
  if (h.pays === 'US') return 3;
  return 4;
}
function palierLevure(y) {
  if (DEPART_LEVURES.includes(y.nom)) return 0;
  if (/brett|lacto|pedio|sour|lambic/i.test(y.nom + ' ' + (y.description || ''))) return 5;
  return { ale: 1, lager: 2, specialty: 4 }[y.famille] ?? 4;
}

// --- Traits aromatiques des levures, lus dans leurs descriptions -----------
function traitsLevure(y) {
  const t = `${y.nom} ${y.profil || ''} ${y.description || ''}`.toLowerCase();
  const phenol = /phénol|phenol|clove|girofle|poivr|épic|spice|saison|farmhouse|weizen|weiss|wit\b|hefe/.test(t)
    && !/minimis|pof-|non phénol/.test(t) ? 1 : 0;
  let ester = 1;
  if (/neutre|propre|clean|low ester|basse formation|faible/.test(t)) ester = 0;
  if (/banane|banana|tropical|fruits? (secs|confits)|fruity esters|esters? fruit|fruité|kveik/.test(t)) ester = 2;
  if (/kveik propre|basse formation/.test(t)) ester = 0;
  const sauvage = /brett|lacto|pedio|sour|lambic/.test(t) ? 1 : 0;
  return { phenol, ester, sauvage };
}

// --- Plages des styles ------------------------------------------------------
function plage(txt, facteur = 1) {
  if (!txt) return null;
  const n = String(txt).replace(/,/g, '.').match(/\d+(\.\d+)?/g);
  if (!n || n.length < 2) return null;
  let [a, b] = [Number(n[0]), Number(n[1])];
  if (/\+\s*$/.test(String(txt))) b = b + (b - a) * 0.25;
  return [a * facteur, b * facteur];
}
const COMPLEMENTS = {
  farmhouse: { og: [1.048, 1.065], fg: [1.002, 1.008], ibu: [20, 35], ebc: [10, 28] },
  specialty: { og: [1.060, 1.095], fg: [1.010, 1.020], ibu: [15, 20], ebc: [12, 30] },
};

async function donneesJeu() {
  const [malts, houblons, levures, styles, eau, params] = await Promise.all(
    ['malts.json', 'houblons.json', 'levures.json', 'styles.json', 'eau.json', 'parametres.json'].map(lire));

  const M = malts
    .filter((m) => m.ebc != null && m.rendement_pct != null && !/purée|cosse|balle de riz|cube|bâton|gousse|amorce|priming/i.test(m.nom))
    .map((m) => ({
      id: m.id, nom: m.nom, fam: m.famille, ebc: Math.max(0, m.ebc), rend: m.rendement_pct,
      dp: m.pouvoir_diastasique_lintner ?? 0, max: m.pct_max ?? null, pays: m.pays ?? null,
      palier: palierMalt(m),
    }));

  const H = houblons.map((h) => ({
    id: h.id, nom: h.nom, usage: h.usage, amin: h.alpha_min, amax: h.alpha_max,
    alpha: r1((h.alpha_min + h.alpha_max) / 2), huile: h.huiles_mL_100g ?? 1, aromes: court(h.aromes, 80),
    pays: h.pays, palier: palierHoublon(h),
  }));

  // Levures de brasserie avec données complètes, sans doublons de nom
  const vus = new Set();
  const Y = levures
    .filter((y) => y.famille !== 'distilling' && y.attenuation_min && y.attenuation_max && y.temp_min_c != null && y.temp_max_c != null)
    .filter((y) => { const k = y.nom.toLowerCase(); if (vus.has(k)) return false; vus.add(k); return true; })
    .map((y) => ({
      id: y.id, nom: y.nom, fam: y.famille, att: [y.attenuation_min, y.attenuation_max],
      t: [y.temp_min_c, y.temp_max_c], tol: y.tolerance_alcool_pct ?? 10, floc: y.floculation ?? null,
      desc: court(y.description || y.profil, 120), ...traitsLevure(y), palier: palierLevure(y),
    }));

  const S = styles
    .filter((s) => s.theme !== 'styles_whisky' && s.sujet !== 'barrel_aged')
    .map((s) => {
      const c = s.contenu, comp = COMPLEMENTS[s.sujet] || {};
      return {
        id: s.id, nom: s.titre.split(' — ')[0].replace(/\s*\(.*\)$/, ''), sujet: s.sujet,
        og: comp.og || plage(c.og), fg: comp.fg || plage(c.fg), ibu: comp.ibu || plage(c.ibu),
        ebc: comp.ebc || plage(c.srm, 1.97), desc: court(c.description || c.caractere, 170),
      };
    })
    .filter((s) => s.og && s.fg && s.ibu && s.ebc);

  const profils = eau.find((e) => e.sujet === 'profiles').contenu;
  const nomsEau = { burton: 'Burton-on-Trent', dublin: 'Dublin', munich: 'Munich', pilsen: 'Plzeň', edinburgh: 'Édimbourg' };
  const E = Object.entries(nomsEau).map(([k, nom]) => {
    const p = profils[k];
    return { id: k, nom, ca: p.calcium_ppm, mg: p.magnesium_ppm, so4: p.sulfate_ppm, cl: p.chloride_ppm, hco3: p.bicarbonate_ppm, note: p.style };
  });
  E.unshift({ id: 'causse', nom: 'Eau du causse', ca: 110, mg: 8, so4: 25, cl: 20, hco3: 320,
    note: 'Eau karstique calcaire du Quercy. Valeurs estimées en attendant une analyse du forage.', estimation: true });
  E.push({ id: 'osmose', nom: 'Eau osmosée', ca: 2, mg: 0, so4: 1, cl: 1, hco3: 5, note: 'Eau déminéralisée, page blanche pour corriger soi-même.' });

  return {
    version: 1, source: 'Hub Prométhée (export jeu_export)',
    params: { plafondBrasserieL: params[0].params.glob_plafond_brasserie_L_an, prixLitre: params[0].params.brass_prix_moyen_litre },
    malts: M, houblons: H, levures: Y, styles: S, eaux: E,
  };
}

async function construire() {
  const D = await donneesJeu();
  const [page, css, moteur, jeu] = await Promise.all(['page.html', 'style.css', 'moteur.js', 'jeu.js'].map(src));
  const corps = page
    .replace('/*CSS*/', () => css)
    .replace('/*DONNEES*/', () => 'window.DONNEES_JEU = ' + JSON.stringify(D) + ';')
    .replace('/*MOTEUR*/', () => moteur)
    .replace('/*JEU*/', () => jeu);
  const complet = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${corps}\n</body>\n</html>\n`;
  await fs.mkdir(path.join(RACINE, 'dist'), { recursive: true });
  await fs.writeFile(path.join(RACINE, 'dist', 'artefact.html'), corps);
  await fs.writeFile(path.join(RACINE, 'dist', 'index.html'), complet);
  const n = (k) => `${D[k].length} ${k}`;
  console.log(`Jeu construit : ${['malts', 'houblons', 'levures', 'styles', 'eaux'].map(n).join(', ')} — ${(Buffer.byteLength(complet) / 1024).toFixed(0)} Ko`);
  return D;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--donnees')) donneesJeu().then((d) => console.log(JSON.stringify(d, null, 1)));
  else construire().catch((e) => { console.error(e); process.exit(1); });
}
export { donneesJeu };
