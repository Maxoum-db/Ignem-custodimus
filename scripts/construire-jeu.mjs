#!/usr/bin/env node
// Construit le jeu : extrait un jeu de données compact depuis data/*.json,
// puis assemble jeu/src/* en une page autonome.
//   dist/index.html     page complète (hébergement web, Vercel)
//   dist/artefact.html  même contenu sans <html>/<head>/<body> (aperçu Claude)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { imagesJeu } from './images-jeu.mjs';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = async (f) => JSON.parse(await fs.readFile(path.join(RACINE, 'data', f), 'utf8')).donnees;
const src = (f) => fs.readFile(path.join(RACINE, 'jeu', 'src', f), 'utf8');
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const court = (t, n = 140) => (t ? String(t).replace(/\s+/g, ' ').trim().slice(0, n) : null);

// --- Rareté (0 = disponible dès le départ, 5 = très rare) -----------------
// Un ingrédient de rareté r s'achète au catalogue quand le niveau de maîtrise atteint r − 1.
const DEPART_MALTS = [/^Pilsner Soufflet Bio$/, /^Pale Ale Soufflet$/, /^Maris Otter Crisp$/, /^Munich Light Château 15 EBC$/,
  /^Vienna Weyermann$/, /^Malt de Blé$/, /^CARAHELL Weyermann$/, /^Caramunich Soufflet 100 EBC$/, /^Malt Chocolat$/,
  /^Orge Torréfié 1150 EBC$/, /^Flocons d'Avoine$/, /^Flocons de Blé$/, /^Acidulated \(Sauermalz\) Weyermann$/, /^Miel brut local$/];
const DEPART_HOUBLONS = ['Saaz', 'Strisselspalt', 'Hallertau Mittelfrüh', 'East Kent Goldings', 'Cascade', 'Magnum', 'Barbe Rouge'];
const DEPART_LEVURES = ['Safale US-05', 'Safale S-04', 'SafLager W-34/70', 'Safale WB-06', 'LalBrew Belle Saison'];
const PRIX = [0, 8, 15, 25, 40, 60];

function rareteMalt(m) {
  if (DEPART_MALTS.some((r) => r.test(m.nom))) return 0;
  if (m.famille === 'base') return /pils|pale|lager|blé|wheat/i.test(m.nom) ? 1 : 2;
  if (m.famille === 'kilned') return 1;
  if (m.famille === 'caramel') return m.ebc > 150 ? 2 : 1;
  if (m.famille === 'roasted') return 2;
  if (m.famille === 'adjuncts') return /flocon/i.test(m.nom) ? 1 : /seigle|maïs|blé non|rye|corn/i.test(m.nom) ? 2 : 3;
  if (m.famille === 'sugars') return /miel|honey/i.test(m.nom) ? 1 : /candi|mélasse|érable/i.test(m.nom) ? 3 : 2;
  return 3;
}
function rareteHoublon(h) {
  if (DEPART_HOUBLONS.includes(h.nom)) return 0;
  if (['FR', 'UK'].includes(h.pays)) return 1;
  if (['DE', 'CZ', 'PL', 'SI'].includes(h.pays)) return 2;
  if (h.pays === 'US') return 3;
  return 4;
}
function rareteLevure(y) {
  if (DEPART_LEVURES.includes(y.nom)) return 0;
  if (/brett|lacto|pedio|sour|lambic/i.test(y.nom + ' ' + (y.description || ''))) return 5;
  return { ale: 1, lager: 2, specialty: 3, distilling: 2 }[y.famille] ?? 3;
}

// --- Traits aromatiques des levures, lus dans leurs descriptions -----------
function traitsLevure(y) {
  const t = `${y.nom} ${y.profil || ''} ${y.description || ''} ${y.flavor_profile || ''}`.toLowerCase();
  const phenol = /phénol|phenol|clove|girofle|poivr|épic|spice|saison|farmhouse|weizen|weiss|wit\b|hefe/.test(t)
    && !/minimis|pof-|non phénol/.test(t) ? 1 : 0;
  let ester = 1;
  if (/neutre|propre|clean|low ester|basse formation|faible|rendement pu/.test(t)) ester = 0;
  if (/banane|banana|tropical|fruits? (secs|confits)|fruity esters|esters? fruit|fruité|kveik|haut profil ester|riche en esters/.test(t)) ester = 2;
  if (/kveik propre|basse formation|très neutre/.test(t)) ester = 0;
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

// --- Aromates : fruits, épices, botaniques, bois ------------------------------
// dose : plage d'usage en g/L ; axes : contribution au profil ; terp : part volatile qui passe à la distillation
const AROMATES = [
  [/coriandre/i, { type: 'epice', axes: { epice: 0.9, fruite: 0.3 }, notes: 'agrume, épicé, poivré', dose: [0.5, 3], terp: 0.8, rarete: 1 }],
  [/orange am[eè]re|cura[cç]ao/i, { type: 'epice', axes: { fruite: 0.6, amer: 0.3 }, notes: 'orange amère, zeste', dose: [0.5, 2], terp: 1, rarete: 1 }],
  [/orange douce/i, { type: 'epice', axes: { fruite: 0.8 }, notes: 'orange douce', dose: [0.5, 3], terp: 0.8, rarete: 1 }],
  [/citron vert/i, { type: 'epice', axes: { fruite: 0.8 }, notes: 'citron vert, zeste', dose: [0.5, 3], terp: 1, rarete: 2 }],
  [/geni[eè]vre/i, { type: 'botanique', axes: { epice: 0.6, fruite: 0.2 }, notes: 'genièvre, résine, pin', dose: [0.3, 2], terp: 1.6, rarete: 3 }],
  [/maniguette|paradis/i, { type: 'botanique', axes: { epice: 1.2 }, notes: 'poivré, gingembre', dose: [0.1, 0.8], terp: 0.6, rarete: 3 }],
  [/hibiscus/i, { type: 'botanique', axes: { fruite: 0.8 }, notes: 'fruits rouges, acidulé', dose: [1, 5], terp: 0.2, rarete: 3 }],
  [/lavande/i, { type: 'botanique', axes: { epice: 0.5 }, notes: 'lavande, floral', dose: [0.05, 0.4], terp: 1.4, rarete: 3 }],
  [/sureau/i, { type: 'botanique', axes: { fruite: 0.7 }, notes: 'sureau, baies noires', dose: [1, 6], terp: 0.4, rarete: 3 }],
  [/cannelle/i, { type: 'epice', axes: { epice: 1 }, notes: 'cannelle', dose: [0.2, 1.5], terp: 0.5, rarete: 2 }],
  [/vanille/i, { type: 'epice', axes: { caramel: 0.6, corps: 0.2 }, notes: 'vanille', dose: [0.05, 0.5], terp: 0.3, rarete: 2 }],
  [/cacao/i, { type: 'epice', axes: { torrefie: 0.6, caramel: 0.3 }, notes: 'cacao, chocolat noir', dose: [2, 10], terp: 0.1, rarete: 2 }],
  [/caf[eé]/i, { type: 'epice', axes: { torrefie: 1, amer: 0.3 }, notes: 'café torréfié', dose: [2, 10], terp: 0.2, rarete: 2 }],
  [/chipotle|piment/i, { type: 'epice', axes: { epice: 1.3, torrefie: 0.3 }, notes: 'piment fumé', dose: [0.1, 0.8], terp: 0.1, rarete: 3 }],
  [/fum[eé]/i, { type: 'bois', axes: { torrefie: 0.6, corps: 0.2 }, notes: 'fumé, hêtre', dose: [1, 5], terp: 0.1, rarete: 3 }],
  [/ch[aâ]taignier/i, { type: 'bois', axes: { amer: 0.3, corps: 0.4 }, notes: 'tanins, boisé sec', dose: [0.2, 2], terp: 0, rarete: 3 }],
  [/ch[eê]ne|spirale|copeaux|cubes/i, { type: 'bois', axes: { caramel: 0.4, corps: 0.3 }, notes: 'boisé, vanille, toasté', dose: [1, 5], terp: 0.1, rarete: 3 }],
  [/pur[eé]e/i, { type: 'fruit', axes: { fruite: 1 }, dose: [20, 150], sucre: 0.12, terp: 0.3, rarete: 2 }],
];

// --- Sels et acides de l'eau : apport en mg/L pour 1 g/hL (stœchiométrie) ------
const SELS = [
  { id: 'gypse', re: /gypse/i, nom: 'Gypse (CaSO₄·2H₂O)', ions: { ca: 2.328, so4: 5.577 }, max: 60, rarete: 1, note: 'Calcium et sulfates : amertume sèche, baisse le pH.' },
  { id: 'cacl2', re: /chlorure de calcium/i, nom: 'Chlorure de calcium (CaCl₂·2H₂O)', ions: { ca: 2.726, cl: 4.823 }, max: 50, rarete: 1, note: 'Calcium et chlorures : rondeur maltée, baisse le pH.' },
  { id: 'epsom', re: /epsom/i, nom: 'Sel d\'Epsom (MgSO₄·7H₂O)', ions: { mg: 0.986, so4: 3.897 }, max: 30, rarete: 2, note: 'Magnésium pour la levure et sulfates. Amer au-delà de 30 mg/L de Mg.' },
  { id: 'nacl', re: /chlorure de sodium/i, nom: 'Sel de cuisine (NaCl)', ions: { na: 3.934, cl: 6.066 }, max: 20, rarete: 2, note: 'Sodium : rondeur à petite dose, salé au-delà de 150 mg/L.' },
  { id: 'bicar', re: /bicarbonate/i, nom: 'Bicarbonate de soude (NaHCO₃)', ions: { na: 2.737, hco3: 7.264 }, max: 30, rarete: 2, note: 'Remonte l\'alcalinité : pour les bières très foncées sur eau douce.' },
  { id: 'craie', re: /carbonate de calcium/i, nom: 'Craie (CaCO₃)', ions: { ca: 2.0, hco3: 6.1 }, max: 30, rarete: 2, note: 'Peu soluble : la moitié seulement se dissout dans le moût.' },
  { id: 'lactique', re: /lactique/i, nom: 'Acide lactique 80 % (mL/hL)', ions: { hco3: -6.5 }, max: 40, rarete: 1, note: 'Neutralise les bicarbonates : baisse le pH sans ions. Goût lactique au-delà de 25 mL/hL.' },
];

// --- Auxiliaires de brassage ----------------------------------------------------
const AUXILIAIRES = [
  [/whirlfloc|protafloc|irish moss/i, { effet: 'clarif_chaud', groupe: 'Clarifiants', rarete: 1, note: 'Carraghénane : fait floculer protéines et tanins en fin d\'ébullition. Bière plus limpide.' }],
  [/g[eé]latine|isinglass|biofine|kieselsol|chitosane/i, { effet: 'clarif_froid', groupe: 'Clarifiants', rarete: 2, note: 'Collage à froid : entraîne levures et trouble au fond. Limpidité de concours.' }],
  [/polyclar|pvpp/i, { effet: 'stabilisant', groupe: 'Clarifiants', rarete: 3, note: 'Adsorbe les polyphénols : pas de trouble au froid.' }],
  [/dap|servomyces|fermaid|go-ferm|yeastex/i, { effet: 'nutriment', groupe: 'Nutriments', rarete: 2, note: 'Azote et zinc pour la levure : fermentation franche, moins de soufre, moins de risque de blocage.' }],
  [/amylase alpha/i, { effet: 'alpha', groupe: 'Enzymes', rarete: 3, note: 'Alpha-amylase exogène : convertit l\'amidon quand les malts manquent d\'enzymes.' }],
  [/glucoamylase|amyloglucosidase/i, { effet: 'gluco', groupe: 'Enzymes', rarete: 3, note: 'Coupe les dextrines en glucose : atténuation maximale, bière très sèche.' }],
  [/b[eê]ta-glucanase/i, { effet: 'glucanase', groupe: 'Enzymes', rarete: 3, note: 'Dégrade les bêta-glucanes du seigle, de l\'avoine et du blé cru : maische fluide, filtration rapide.' }],
  [/lactase/i, { effet: 'lactase', groupe: 'Enzymes', rarete: 3, note: 'Coupe le lactose en glucose et galactose fermentescibles.' }],
  [/star san|chemipro oxi|pbw|caustic/i, { effet: 'hygiene', groupe: 'Hygiène', rarete: 1, note: 'Nettoyage et désinfection : divise par deux le risque d\'infection.' }],
];

// --- Recettes du Hub : rattachement des noms aux ingrédients du jeu --------------
const sansAccent = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function rattacherGrain(nom, ebc, M) {
  const n = sansAccent(nom), par = (x) => M.find((m) => m.nom === x);
  const regles = [
    [/balle|hull|nouveau grain/, null],
    [/tourbe|peat|rauch|fume|smoked/, 'Special Smoked Malt Weyermann'],
    [/roasted barley|orge torr/, 'Orge Torréfié 1150 EBC'],
    [/black|noir/, 'Black Malt Weyermann'],
    [/chocolat.*pale|pale chocolate/, 'Chocolate Pale Weyermann'],
    [/chocolat/, 'Malt Chocolat'],
    [/carafa ?iii/, 'CARAFA III Weyermann (debittered)'],
    [/carafa ?ii/, 'CARAFA II Special (debittered)'],
    [/carafa/, 'CARAFA I Weyermann'],
    [/special b/, 'Special B Dingemans'],
    [/cara ?aroma/, 'CARAAROMA Weyermann'],
    [/cara ?red/, 'CARARED Weyermann'],
    [/caramunich ?(iii|3)/, 'CARAMUNICH III Weyermann'],
    [/caramunich ?(ii|2)/, 'CARAMUNICH II Weyermann'],
    [/caramunich/, 'CARAMUNICH I Weyermann'],
    [/cara ?hell/, 'CARAHELL Weyermann'],
    [/cara ?vienne/, 'CARAVIENNE Weyermann'],
    [/cara ?amber/, 'CARAAMBER Weyermann'],
    [/carapils|cara clair|dextrin|carafoam/, 'Carapils Weyermann'],
    [/melano/, 'Melanoidin Weyermann'],
    [/aromatic/, 'Aromatic Dingemans'],
    [/victory|biscuit/, 'Victory Briess'],
    [/amber/, 'Amber Malt Crisp UK'],
    [/brown|brun/, 'Malt Brun'],
    [/candi.*(brun|fonce|dark|d2|d180|noir)/, 'Sucre candi D2 Dark Belgian'],
    [/candi/, 'Sucre candi blanc'],
    [/cassonade|demerara|sucre blanc|saccharose|sucre$/, 'Sucre blanc (saccharose)'],
    [/dextrose|glucose|sucre de brassage/, 'Dextrose (glucose pur)'],
    [/miel|honey/, 'Miel brut local'],
    [/dme|extrait/, 'Extrait malt sec DME Pale'],
    [/(ble|wheat|froment).*(flak|flocon|cru)|(flak|flocon).*(ble|wheat)/, 'Flocons de Blé'],
    [/oat|avoine/, "Flocons d'Avoine"],
    [/flaked barley|flocons d.orge/, "Flocons d'Orge"],
    [/mais|corn|maize/, 'Flocons de Maïs'],
    [/riz|rice/, 'Flocons de Riz'],
    [/seigle|rye/, 'Malt de Seigle'],
    [/acid/, 'Acidulated (Sauermalz) Weyermann'],
    [/munich.*(ii|dark|2)/, 'Munich II Weyermann'],
    [/munich/, 'Munich Light Château 15 EBC'],
    [/vienn/, 'Vienna Weyermann'],
    [/floor|bohemian/, 'Floor Malted Bohemian Pilsner Weyermann'],
    [/maris|golden promise|optic/, 'Maris Otter Crisp'],
    [/pils|lager|pilsen/, 'Pilsner Soufflet Bio'],
    [/ble|wheat|froment|epeautre|spelt/, 'Malt de Blé'],
    [/pale|2-row|2rp|2rs|belgomalt/, 'Pale Ale Soufflet'],
  ];
  for (const [re, cible] of regles) if (re.test(n)) return cible ? par(cible) || null : 'ignorer';
  // Crystal ou caramel : malt caramel le plus proche en couleur
  if (/crystal|caramel|cara/.test(n) && ebc) return M.filter((m) => m.fam === 'caramel').sort((a, b) => Math.abs(a.ebc - ebc) - Math.abs(b.ebc - ebc))[0];
  return null;
}
const ALIAS_HOUBLONS = { ekg: 'East Kent Goldings', 'east kent golding': 'East Kent Goldings', fuggles: 'Fuggle', tettnanger: 'Tettnang',
  hallertau: 'Hallertau Mittelfrüh', 'hallertau mittelfruh': 'Hallertau Mittelfrüh', 'styrian goldings': 'Styrian Golding', ctz: 'Columbus',
  tradition: 'Hallertau Tradition', 'tradition fr': 'Hallertau Tradition', taurus: 'Hallertau Taurus', 'lublin (polish saaz)': 'Lublin' };
function rattacherHoublon(nom, H) {
  let n = sansAccent(nom).replace(/^houblon en pellets /, '').replace(/^cryo /, '').replace(/\(.*\)/, '').split(/ \+ /)[0].replace(/ (fr|vieillis.*)$/, '').trim();
  const alias = ALIAS_HOUBLONS[n];
  return H.find((h) => sansAccent(h.nom) === sansAccent(alias || n)) || H.find((h) => sansAccent(h.nom).startsWith(n) && n.length > 4) || null;
}
const MOTS_LEVURES = [[/w-?34\/70/, 'SafLager W-34/70'], [/s-?04/, 'Safale S-04'], [/us-?05|1056|chico|american ale/, 'Safale US-05'],
  [/wb-?06/, 'Safale WB-06'], [/nottingham/, 'LalBrew Nottingham'], [/abbaye|abbey/, 'LalBrew Abbaye'], [/belle saison/, 'LalBrew Belle Saison'],
  [/new england/, 'LalBrew New England'], [/verdant/, 'LalBrew Verdant IPA'], [/novalager/, 'LalBrew NovaLager'], [/3787|wlp530|trappist/, 'Wyeast 3787 Trappist High Gravity'],
  [/wlp004|irish/, 'WLP004 Irish Ale'], [/voss/, 'LalBrew Voss Kveik'], [/k-?97/, 'SafAle K-97'], [/s-?33/, 'SafAle S-33'], [/t-?58/, 'Safale T-58'],
  [/be-?256/, 'Safale BE-256'], [/3711|french saison/, 'Wyeast 3711 French Saison'], [/kolsch|koln/, 'LalBrew Köln'], [/windsor/, 'LalBrew Windsor'],
  [/london esb|1968/, 'LalBrew London ESB'], [/diamond/, 'LalBrew Diamond Lager'], [/s-?23/, 'SafLager S-23'], [/s-?189/, 'SafLager S-189'],
  [/2124|bohemian lager/, 'Wyeast 2124 Bohemian Lager'], [/wlp800|pilsner lager/, 'WLP800 Pilsner Lager'], [/wlp300|hefeweizen/, 'WLP300 Hefeweizen IV Ale'],
  [/munich classic/, 'LalBrew Munich Classic'], [/\bwit\b/, 'LalBrew Wit'], [/farmhouse/, 'LalBrew Farmhouse'], [/lager/, 'SafLager W-34/70'], [/saison/, 'LalBrew Belle Saison']];
function rattacherLevure(txt, Y) {
  const n = sansAccent(txt);
  for (const [re, nom] of MOTS_LEVURES) if (re.test(n)) { const y = Y.find((x) => sansAccent(x.nom) === sansAccent(nom)); if (y) return y; }
  return null;
}

async function donneesJeu() {
  const [malts, houblons, levures, styles, eau, params, fiches, recettes, quiz] = await Promise.all(
    ['malts.json', 'houblons.json', 'levures.json', 'styles.json', 'eau.json', 'parametres.json', 'fiches.json', 'recettes.json', 'quiz.json'].map(lire));

  // Céréales, sucres et miel. Les grains crus gardent leur température de gélatinisation.
  // Les fiches du Hub contiennent quelques doublons (« Flocons de blé » et « Flocons de Blé ») : on garde le premier
  const vusM = new Set();
  const M = malts
    .filter((m) => m.ebc != null && m.rendement_pct != null && !/purée|cosse|balle de riz|cube|bâton|gousse|amorce|priming/i.test(m.nom))
    .filter((m) => { const k = sansAccent(m.nom).replace(/\s+/g, ' '); if (vusM.has(k)) return false; vusM.add(k); return true; })
    // Sucres, miels et extraits rangés parmi les adjuvants : on les traite en sucres (ajoutés à l'ébullition, sans empâtage)
    .map((m) => (m.famille === 'adjuncts' && /sucre|dextrose|lactose|miel|sirop|mélasse|extrait|candi/i.test(m.nom) ? { ...m, famille: 'sugars', rendement_pct: Math.max(m.rendement_pct, /extrait|miel/i.test(m.nom) ? 80 : 100) } : m))
    .map((m) => ({
      id: m.id, nom: m.nom, fam: m.famille, ebc: Math.max(0, m.ebc), rend: m.rendement_pct,
      dp: m.pouvoir_diastasique_lintner ?? 0, max: m.pct_max ?? null, pays: m.pays ?? null,
      gel: m.temp_gelatinisation_c ?? null, saveurs: court(m.saveurs, 70), palier: rareteMalt(m),
    }));

  const H = houblons.map((h) => {
    const oils = h.huiles || {};
    return {
      id: h.id, nom: h.nom, usage: h.usage, amin: h.alpha_min, amax: h.alpha_max,
      alpha: r1((h.alpha_min + h.alpha_max) / 2), huile: h.huiles_mL_100g ?? 1, aromes: court(h.aromes, 80),
      oils: { myr: oils.myrcene ?? null, hum: oils.humulene ?? null, car: oils.caryophyllene ?? null, far: oils.farnesene ?? null },
      pays: h.pays, styles: court(h.styles, 70), palier: rareteHoublon(h),
    };
  });

  // Levures de brasserie et de distillerie, sans doublons de nom
  const vus = new Set();
  const Y = levures
    .filter((y) => y.attenuation_min && y.attenuation_max && y.temp_min_c != null && y.temp_max_c != null && !/usage distillation|blend/i.test(y.nom))
    .filter((y) => { const k = y.nom.toLowerCase(); if (vus.has(k)) return false; vus.add(k); return true; })
    .map((y) => ({
      id: y.id, nom: y.nom, fam: y.famille, att: [y.attenuation_min, y.attenuation_max],
      t: [y.temp_min_c, y.temp_max_c], tol: y.tolerance_alcool_pct ?? 10, floc: y.floculation ?? null,
      desc: court(y.description || y.profil || y.flavor_profile, 120), ...traitsLevure(y), palier: rareteLevure(y),
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

  // Sels : seulement ceux présents dans les fiches du Hub
  const nomsSels = eau.filter((f) => f.sujet === 'variete').map((f) => f.titre);
  const SE = SELS.filter((x) => nomsSels.some((n) => x.re.test(n))).map(({ re, ...x }) => ({ ...x, palier: x.rarete }));

  // Aromates : adjuvants sans couleur (épices, fruits, bois)
  const A = malts.filter((m) => m.famille === 'adjuncts' && m.ebc == null).map((m) => {
    const def = AROMATES.find(([re]) => re.test(m.nom));
    if (!def) return null;
    const d = def[1];
    const fruit = (m.nom.match(/Boiron (.+?) 1L/) || [])[1];
    return { id: m.id, nom: m.nom.replace(/ 1L$/, ''), type: d.type, axes: d.axes, notes: d.type === 'fruit' ? fruit.toLowerCase() : d.notes,
      dose: d.dose, sucre: d.sucre || 0, terp: d.terp, palier: d.rarete };
  }).filter(Boolean);

  // Auxiliaires : nutriments, clarifiants, enzymes, hygiène
  const X = fiches.filter((f) => f.theme === 'fermentation' && f.sujet === 'variete').map((f) => {
    const def = AUXILIAIRES.find(([re]) => re.test(f.titre));
    if (!def) return null;
    return { id: f.id, nom: f.titre, ...def[1], usage: court(f.contenu.usage, 110), palier: def[1].rarete };
  }).filter(Boolean);

  // Grimoire : recettes de bière du Hub, ramenées à 1000 L
  const R = [];
  for (const r of recettes.filter((x) => x.type === 'beer' && Array.isArray(x.grainBill))) {
    const vol = r.batchSize_L || 20, k = 1000 / vol;
    let kgTotal = 0, kgRattache = 0;
    const malts = [];
    for (const g of r.grainBill) {
      const kg = g.weight_kg || 0; kgTotal += kg;
      const m = rattacherGrain(g.grain || g.name, g.color_EBC, M);
      if (m === 'ignorer') { kgRattache += kg; continue; }
      if (!m) continue;
      kgRattache += kg;
      const l = malts.find((x) => x.id === m.id);
      if (l) l.kg += kg * k; else malts.push({ id: m.id, kg: kg * k });
    }
    if (!kgTotal || kgRattache / kgTotal < 0.9) continue;
    const hs = Array.isArray(r.hopAdditions) ? r.hopAdditions : Array.isArray(r.hopSchedule) ? r.hopSchedule : [];
    const houblons = []; let manque = false;
    for (const h of hs) {
      const nom = h.variety || h.name || h.hop;
      if (!nom || /aucun|voir /i.test(nom)) continue;
      const hb = rattacherHoublon(nom, H);
      if (!hb) { manque = true; break; }
      const dry = /dry|cru|fermenteur|ferment/i.test(`${h.usage || ''} ${h.type || ''}`);
      const min = dry ? -1 : Math.max(0, Math.min(90, Math.round(Number(h.time_min) || 0)));
      houblons.push({ id: hb.id, g: Math.round((h.amount_g || 0) * k), min });
    }
    if (manque) continue;
    const ytxt = typeof r.yeast === 'string' ? r.yeast : r.yeastStrain || '';
    const lev = rattacherLevure(`${ytxt} ${r.yeastStrain || ''}`, Y) || rattacherLevure(`${r.style || ''} ${r.name}`, Y);
    if (!lev) continue;
    const og = Number(r.OG) || null;
    R.push({
      id: r.id, nom: r.name, style: court(r.style || r.bjcp, 60),
      malts: malts.map((x) => ({ id: x.id, kg: Math.round(x.kg) })).filter((x) => x.kg > 0),
      houblons: houblons.filter((h) => h.g > 0), levure: lev.id,
      og: og && og > 1 && og < 1.2 ? og : null, ibu: Number(r.IBU) || null, desc: court(r.description, 160),
    });
  }

  // Veillée : cartes question-réponse des modules techniques (les auto-évaluations sont écartées)
  const titres = Object.fromEntries(quiz.decks.map((d) => [d.id, d.title.replace(/^(QCM|Fiche) · /, '').replace(/ — .*$/, '')]));
  const Q = quiz.cartes
    .filter((c) => c.type !== 'can_do' && c.front && c.back && c.back.length <= 320 && c.front.length >= 12)
    .map((c) => ({ d: c.deck_id, q: c.front.trim(), r: c.back.trim() }));

  return {
    version: 3, quiz: { modules: titres, cartes: Q }, source: 'Hub Prométhée (export jeu_export)', prix: PRIX,
    params: { plafondBrasserieL: params[0].params.glob_plafond_brasserie_L_an, prixLitre: params[0].params.brass_prix_moyen_litre,
      angePct: params[0].params.dist_pct_ange_share ?? 3, maturationMois: params[0].params.dist_duree_maturation_mois ?? 36,
      degreBouteille: params[0].params.dist_ABV_embouteillage ?? 45, bouteilleL: params[0].params.glob_bouteille_70cl_volume_L ?? 0.7 },
    malts: M, houblons: H, levures: Y, styles: S, eaux: E, sels: SE, aromates: A, auxiliaires: X, recettes: R,
  };
}

async function construire() {
  const D = await donneesJeu();
  const IMAGES = await imagesJeu(path.join(RACINE, 'jeu', 'src', 'images'));
  const [page, css, moteur, distillerie, chai, ecole, vente, illustrations, ateliers, univers, activites, domaine, habillage, jeu] = await Promise.all(['page.html', 'style.css', 'moteur.js', 'distillerie.js', 'chai.js', 'ecole.js', 'vente.js', 'illustrations.js', 'ateliers.js', 'univers.js', 'activites-illustrees.js', 'domaine-illustre.js', 'habillage.js', 'jeu.js'].map(src));
  const police = await fs.readFile(path.join(RACINE, 'jeu', 'src', 'fonts', 'lilita-one.woff'));
  const corps = page
    .replace('/*POLICES*/', () => '@font-face{font-family:"Lilita One";font-style:normal;font-weight:400;font-display:swap;src:url(data:font/woff;base64,' + police.toString('base64') + ') format("woff");}')
    .replace('/*CSS*/', () => css)
    .replace('/*DONNEES*/', () => 'window.DONNEES_JEU = ' + JSON.stringify(D) + ';')
    .replace('/*IMAGES*/', () => 'window.IMAGES_JEU = ' + JSON.stringify(IMAGES) + ';')
    .replace('/*MOTEUR*/', () => moteur)
    .replace('/*DISTILLERIE*/', () => distillerie)
    .replace('/*CHAI*/', () => chai)
    .replace('/*ECOLE*/', () => ecole)
    .replace('/*VENTE*/', () => vente)
    .replace('/*ILLUSTRATIONS*/', () => illustrations)
    .replace('/*ATELIERS*/', () => ateliers)
    .replace('/*UNIVERS*/', () => univers)
    .replace('/*ACTIVITES_ILLUSTREES*/', () => activites)
    .replace('/*DOMAINE_ILLUSTRE*/', () => domaine)
    .replace('/*HABILLAGE*/', () => habillage)
    .replace('/*JEU*/', () => jeu);
  const complet = `<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n${corps}\n</body>\n</html>\n`;
  await fs.mkdir(path.join(RACINE, 'dist'), { recursive: true });
  await fs.writeFile(path.join(RACINE, 'dist', 'artefact.html'), corps);
  await fs.writeFile(path.join(RACINE, 'dist', 'index.html'), complet);
  const n = (k) => `${D[k].length} ${k}`;
  console.log(`Jeu construit : ${['malts', 'houblons', 'levures', 'styles', 'eaux', 'sels', 'aromates', 'auxiliaires', 'recettes'].map(n).join(', ')} — ${(Buffer.byteLength(complet) / 1024).toFixed(0)} Ko`);
  return D;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--donnees')) donneesJeu().then((d) => console.log(JSON.stringify(d, null, 1)));
  else construire().catch((e) => { console.error(e); process.exit(1); });
}
export { donneesJeu };
