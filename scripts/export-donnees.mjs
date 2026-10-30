#!/usr/bin/env node
// Ignem custodimus — export des données techniques du Hub Prométhée
// Lit UNIQUEMENT le schéma jeu_export (vues filtrées), avec un rôle en lecture seule.
// Convertit les unités en métrique, écrit data/*.json, et bloque tout si une
// donnée personnelle est détectée.
//
// Usage : JEU_EXPORT_DB_URL="postgresql://..." node scripts/export-donnees.mjs
//         node scripts/export-donnees.mjs --test   (conversions seules, sans base)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION_CONTRAT = 1;
const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOSSIER_SORTIE = path.join(RACINE, 'data');

// ---------------------------------------------------------------------------
// Conversions d'unités
// ---------------------------------------------------------------------------
export const num = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const m = String(v).replace(',', '.').match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : null;
};
const arrondi = (v, d = 1) => (v === null ? null : Math.round(v * 10 ** d) / 10 ** d);

// Couleur : Lovibond -> SRM (Morey/ASBC) -> EBC
export const lovibondVersEbc = (l) => (l === null ? null : Math.max(0, arrondi((1.3546 * l - 0.76) * 1.97, 1)));
// Rendement : PPG (points/livre/gallon) -> % d'extrait (saccharose = 46,214 PPG)
export const ppgVersPct = (p) => (p === null ? null : arrondi((p / 46.214) * 100, 1));
// Pouvoir diastasique : Windisch-Kolbach -> Lintner
export const wkVersLintner = (wk) => (wk === null ? null : arrondi((wk + 16) / 3.5, 0));
export const fVersC = (f) => (f === null ? null : arrondi(((f - 32) * 5) / 9, 1));
// Température ambiguë : au-dessus de 45, c'est forcément des °F pour une levure
export const tempLevureC = (v) => { const n = num(v); return n === null ? null : n > 45 ? fVersC(n) : n; };
const OZ_5GAL_VERS_G_L = 28.349523 / 18.927059; // oz / 5 gal US -> g / L
const LB_VERS_KG = 0.45359237;
const QT_VERS_L = 0.946353;

// Plage texte « 73-77% » -> [73, 77]
export const plage = (v) => {
  if (v === null || v === undefined) return [null, null];
  if (typeof v === 'number') return [v, v];
  const n = String(v).replace(',', '.').match(/\d+(\.\d+)?/g);
  if (!n) return [null, null];
  return [Number(n[0]), Number(n[n.length - 1])];
};

// Renomme récursivement les clés impériales et convertit leurs valeurs
export function normaliserUnites(obj) {
  if (Array.isArray(obj)) return obj.map(normaliserUnites);
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('_')) continue; // champs internes du Hub
    let cle = k, val = normaliserUnites(v);
    const n = num(v);
    if (/oz_per_5gal/.test(k) && n !== null) { cle = k.replace('oz_per_5gal', 'g_par_L'); val = arrondi(n * OZ_5GAL_VERS_G_L, 2); }
    else if (/_oz$/.test(k) && n !== null) { cle = k.replace(/_oz$/, '_g'); val = arrondi(n * 28.349523, 1); }
    else if (/lbs/.test(k) && n !== null) { cle = k.replace('lbs', 'kg'); val = arrondi(n * LB_VERS_KG, 2); }
    else if (/_qt_/.test(k) && n !== null) { cle = k.replace('_qt_', '_L_'); val = arrondi(n * QT_VERS_L, 2); }
    else if (/fahrenheit/.test(k) && n !== null) { cle = k.replace('fahrenheit', 'celsius'); val = fVersC(n); }
    else if (/lovibond/.test(k)) continue; // remplacé par l'EBC
    out[cle] = val;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Mise en forme par famille
// ---------------------------------------------------------------------------
const CAT_MALTS = ['malts_base', 'malts_caramel', 'malts_kilned', 'malts_roasted', 'adjuncts', 'sugars'];
const CAT_HOUBLONS = ['hops_aroma', 'hops_bittering', 'hops_dual'];
const CAT_LEVURES = ['yeasts_ale', 'yeasts_lager', 'yeasts_specialty', 'yeasts_distilling'];
const CAT_STYLES = ['styles_ale', 'styles_lager', 'styles_whisky'];

export function versMalt(r) {
  const d = r.data || {};
  const ebc = num(d.color_ebc) ?? lovibondVersEbc(num(d.color_lovibond ?? d.lovibond));
  const dpBrut = num(d.diastatic_power_lintner) ?? num(d.diastatic_power);
  const dp = num(d.diastatic_power_lintner) !== null ? dpBrut
    : /wk/i.test(d.dp_unit || '') ? wkVersLintner(dpBrut) : dpBrut;
  return {
    id: r.id, nom: r.label, famille: r.category.replace('malts_', ''),
    ebc, rendement_pct: num(d.yield_pct) ?? ppgVersPct(num(d.ppg)),
    pouvoir_diastasique_lintner: dp,
    pct_max: num(d.max_pct_batch) ?? num(d.usage_percent_max),
    proteines_pct: num(d.protein_pct), humidite_pct: num(d.moisture_pct),
    empatable: d.mashable ?? null,
    fermentescible_pct: num(d.fermentescible_pct),
    temp_gelatinisation_c: num(d.gelatinization_temp_c),
    saveurs: d.flavor ?? d.characteristics ?? d.characteristic ?? null,
    description: d.description ?? null, pays: d.country ?? null, marque: d.brand ?? d.vendor ?? null,
  };
}

export function versHoublon(r) {
  const d = r.data || {};
  return {
    id: r.id, nom: r.label, usage: r.category.replace('hops_', ''),
    alpha_min: num(d.alpha_low), alpha_max: num(d.alpha_high),
    beta_min: num(d.beta_low), beta_max: num(d.beta_high),
    cohumulone_pct: num(d.cohumulone_pct), hsi: num(d.hsi),
    huiles_mL_100g: num(d.total_oil_ml_100g), huiles: d.oils ?? null,
    aromes: d.aromas ?? null, styles: d.styles ?? null, substituts: d.substitutes ?? null,
    pays: d.country ?? null, description: d.description ?? null,
  };
}

export function versLevure(r) {
  const d = r.data || {};
  let [aMin, aMax] = [num(d.attenuation_low ?? d.att_low), num(d.attenuation_high ?? d.att_high)];
  if (aMin === null || aMax === null) [aMin, aMax] = plage(d.attenuation_range ?? d.attenuation);
  return {
    id: r.id, nom: r.label, famille: r.category.replace('yeasts_', ''),
    marque: d.brand ?? d.vendor ?? null, forme: d.form ?? null,
    attenuation_min: aMin, attenuation_max: aMax,
    temp_min_c: num(d.temp_low_C) ?? num(d.temperature_celsius_min) ?? tempLevureC(d.temp_low),
    temp_max_c: num(d.temp_high_C) ?? num(d.temperature_celsius_max) ?? tempLevureC(d.temp_high),
    temp_optimale_c: num(d.temp_optimal_C),
    tolerance_alcool_pct: num(d.alcohol_tolerance_pct),
    floculation: d.flocculation ?? null,
    profil: d.characteristics ?? d.flavor_profile ?? null,
    dose_g_par_L: num(d.dosage_g_per_L),
    note_cincinnatus: d.cincinnatus_note ?? null,
    description: d.description ?? null,
  };
}

const versFiche = (r) => ({ id: r.id, theme: r.category, sujet: r.subcategory, titre: r.label, contenu: normaliserUnites(r.data), source: r.source ?? null });

// ---------------------------------------------------------------------------
// Contrôle vie privée : bloque l'export au moindre doute
// ---------------------------------------------------------------------------
const MOTIFS_INTERDITS = [
  // Clés de paramètres personnels (le texte libre « fermentation conjointe » reste permis)
  /"[a-z0-9_]*(salaire|conjointe|soulte|rachat_np|maison_|glob_are|rupture|foyer|donation|perso_|_perso|dividende|remuneration|equite)[a-z0-9_]*"\s*:/i,
  // Notions patrimoniales et familiales dans le texte
  /donation-partage|pacte dutreil|soulte|rupture conventionnelle/i,
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i,           // adresses e-mail
  // Téléphones français, mais pas les décimales (« 0.0920000000 » n'est pas un numéro)
  /(?<![\d.,])(?:\+33 ?|0)[1-9](?:[ .-]?\d{2}){4}(?!\d)/,
];
export function controlerVieprivee(nomFichier, contenu) {
  const texte = JSON.stringify(contenu);
  for (const m of MOTIFS_INTERDITS) {
    const t = texte.match(m);
    if (t) throw new Error(`Export bloqué : motif sensible « ${t[0]} » trouvé dans ${nomFichier}`);
  }
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
async function lire(client, vue) {
  const { rows } = await client.query(`select * from jeu_export.${vue}`);
  return rows;
}

async function exporter() {
  const url = process.env.JEU_EXPORT_DB_URL;
  if (!url) throw new Error('Variable JEU_EXPORT_DB_URL absente.');
  const { default: pg } = await import('pg');
  const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query('set transaction read only');
    const ref = await lire(client, 'reference');
    const parCat = (cats) => ref.filter((r) => cats.includes(r.category));
    const estIngredient = (r) => [...CAT_MALTS, ...CAT_HOUBLONS, ...CAT_LEVURES].includes(r.category);

    const fichiers = {
      'malts.json': parCat(CAT_MALTS).filter((r) => r.subcategory === 'variete').map(versMalt),
      'houblons.json': parCat(CAT_HOUBLONS).map(versHoublon),
      'levures.json': parCat(CAT_LEVURES).filter((r) => r.subcategory === 'variete').map(versLevure),
      'eau.json': parCat(['water_chemistry']).map(versFiche),
      'styles.json': parCat(CAT_STYLES).map(versFiche),
      'fiches.json': ref.filter((r) => !estIngredient(r) && !CAT_STYLES.includes(r.category) && r.category !== 'water_chemistry').map(versFiche)
        .concat(ref.filter((r) => estIngredient(r) && r.subcategory !== 'variete').map(versFiche)),
      'recettes.json': (await lire(client, 'recettes')).map((r) => ({ id: r.id, type: r.type, nom: r.name, ...normaliserUnites(r.data) })),
      'quiz.json': { decks: await lire(client, 'quiz_decks'), cartes: await lire(client, 'quiz_cartes') },
      'formation.json': { phases: await lire(client, 'formation_phases'), modules: await lire(client, 'formation_modules') },
      'reperes.json': await lire(client, 'reperes'),
      'economie.json': await lire(client, 'economie_lots'),
      'parametres.json': await lire(client, 'parametres'),
    };

    // 1. Contrôle complet AVANT d'écrire quoi que ce soit
    for (const [nom, contenu] of Object.entries(fichiers)) controlerVieprivee(nom, contenu);

    // 2. Écriture atomique : dossier temporaire puis remplacement
    const tmp = `${DOSSIER_SORTIE}.tmp`;
    await fs.rm(tmp, { recursive: true, force: true });
    await fs.mkdir(tmp, { recursive: true });
    const date = new Date().toISOString();
    const resume = {};
    for (const [nom, contenu] of Object.entries(fichiers)) {
      const n = Array.isArray(contenu) ? contenu.length : Object.values(contenu).reduce((s, v) => s + v.length, 0);
      resume[nom] = n;
      await fs.writeFile(path.join(tmp, nom), JSON.stringify({ version_contrat: VERSION_CONTRAT, exporte_le: date, nb: n, donnees: contenu }, null, 1));
    }
    await fs.writeFile(path.join(tmp, '_index.json'), JSON.stringify({ version_contrat: VERSION_CONTRAT, exporte_le: date, fichiers: resume }, null, 1));
    await fs.rm(DOSSIER_SORTIE, { recursive: true, force: true });
    await fs.rename(tmp, DOSSIER_SORTIE);
    console.table(resume);
    console.log(`Export terminé dans ${DOSSIER_SORTIE}`);
  } finally {
    await client.end();
  }
}

// ---------------------------------------------------------------------------
// Auto-test des conversions (sans base de données)
// ---------------------------------------------------------------------------
function autoTest() {
  const ok = (cond, msg) => { if (!cond) throw new Error('Échec : ' + msg); console.log('✓', msg); };
  ok(Math.abs(lovibondVersEbc(2) - 3.8) < 0.1, '2 °L ≈ 3,8 EBC');
  ok(lovibondVersEbc(0) === 0, 'jamais d\'EBC négatif');
  ok(Math.abs(ppgVersPct(37) - 80.1) < 0.2, '37 PPG ≈ 80 % d\'extrait');
  ok(wkVersLintner(250) === 76, '250 WK = 76 °Lintner');
  ok(fVersC(68) === 20, '68 °F = 20 °C');
  ok(tempLevureC(18) === 18 && tempLevureC(64.4) === 18, 'température levure ambiguë');
  ok(plage('73-77%')[1] === 77, 'plage texte d\'atténuation');
  const n = normaliserUnites({ usage_oz_per_5gal_max: 4, per_grain_lbs_min: 10, drying_temp_fahrenheit: 176, lovibond: 3, _fixNote: 'x' });
  ok(n.usage_g_par_L_max === 5.99 && n.per_grain_kg_min === 4.54 && n.drying_temp_celsius === 80, 'normalisation récursive');
  ok(!('lovibond' in n) && !('_fixNote' in n), 'champs Lovibond et internes retirés');
  const m = versMalt({ id: 'x', label: 'Pils', category: 'malts_base', data: { color_lovibond: 1.6, ppg: 37, diastatic_power: 250, dp_unit: 'WK' } });
  ok(m.ebc === 2.8 && m.pouvoir_diastasique_lintner === 76, 'fiche malt convertie');
  let bloque = false;
  try { controlerVieprivee('test', { params: { glob_salaire_brut_mensuel: 1 } }); } catch { bloque = true; }
  ok(bloque, 'une clé de salaire bloque l\'export');
  bloque = false;
  try { controlerVieprivee('test', { note: 'contact : jean@exemple.fr' }); } catch { bloque = true; }
  ok(bloque, 'une adresse e-mail bloque l\'export');
  bloque = false;
  try { controlerVieprivee('test', { q: 'Calendrier de donation-partage des parts' }); } catch { bloque = true; }
  ok(bloque, 'une notion patrimoniale bloque l\'export');
  for (const tel of ['06 12 34 56 78', '0612345678', '+33 6 12 34 56 78', 'appeler le 05.63.12.34.56']) {
    bloque = false;
    try { controlerVieprivee('test', { t: tel }); } catch { bloque = true; }
    ok(bloque, `téléphone détecté : ${tel}`);
  }
  ok((() => { controlerVieprivee('test', { texte: 'foyer de l\'alambic, 1200 L', d: 'fermentation conjointe miel + pomme' }); return true; })(), 'texte technique accepté');
  ok((() => { controlerVieprivee('test', { contribution_pts: 0.0920000000, og: { target: 1.0950000000 }, x: [1.0120000000, 0.046] }); return true; })(), 'décimales acceptées');
  ok((() => { controlerVieprivee('test', { personnel: '1 ETP' }); return true; })(), 'clé « personnel » acceptée');
  console.log('Tous les tests passent.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const action = process.argv.includes('--test') ? Promise.resolve(autoTest()) : exporter();
  action.catch((e) => { console.error(e.message); process.exit(1); });
}
