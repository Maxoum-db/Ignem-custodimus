/* Ignem custodimus — moteur du chai : élevage en fût, part des anges, finitions, assemblage
 *
 * Sources (fiches d'élevage du Hub) : Russell et al. 2003 ch. 7, Buglass 2011 ch. 3.2.5,
 * The Alcohol Textbook ch. 19, règlement (UE) 2019/787.
 *
 * Le modèle avance par pas de 0,05 an. Trois familles de réactions :
 *  - additives : extraction du bois (vanilline, lactones, eugénol, tanins, couleur, vin ou tourbe imprégnés).
 *    Composante rapide qui s'épuise dans le fût (constante ~1,2 an) + hydrolyse lente et régulière.
 *  - soustractives : le charbon du charring adsorbe le soufre, l'acétaldéhyde des têtes passe en acétal.
 *  - interactives / oxydatives : l'oxygène qui traverse les douelles oxyde les fusels en acides,
 *    estérifiés en esters fruités ; au-delà de ~8 ans apparaît le rancio.
 * Le fût s'épuise : chaque remplissage extrait environ moitié moins que le précédent.
 */
(function (racine) {
  'use strict';
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------------------------------------------------------------- Fûts
  // van : vanilline, syringaldéhyde · coco : cis-oak-lactone · epi : eugénol, épices · tan : ellagitanins
  // vin : vin imprégné · fum : phénols de tourbe imprégnés · coul : couleur · char : adsorption du soufre · ran : rancio
  const TYPES = {
    bourbon: { nom: 'Ex-bourbon', bois: 'Chêne blanc américain (Q. alba), charré', rarete: 1, van: 1.15, coco: 1.1, epi: 0.45, tan: 0.45, vin: 0, fum: 0, coul: 0.7, char: 0.55, ran: 0,
      notes: { vin: '' }, desc: 'Vanille, caramel, noix de coco. Le charbon du charring retient le soufre.' },
    francais: { nom: 'Chêne français neuf', bois: 'Chêne sessile (Q. petraea), toast moyen', rarete: 2, van: 0.85, coco: 0.4, epi: 1.1, tan: 1.15, vin: 0, fum: 0, coul: 1.0, char: 0.15, ran: 0.1,
      desc: 'Grain fin : épices douces, vanille discrète, tanins élégants mais présents. Un fût neuf travaille vite.' },
    domaine: { nom: 'Chêne du domaine', bois: 'Chênes du Quercy (Q. robur et pubescens), merrains séchés 3 ans, toast moyen', rarete: 2, van: 0.75, coco: 0.5, epi: 1.25, tan: 1.45, vin: 0, fum: 0, coul: 1.1, char: 0.15, ran: 0.15,
      desc: 'Le bois de tes propres chênes. Grain plus grossier : épices et tanins marqués, à surveiller dans les fûts neufs.' },
    cahors: { nom: 'Ex-Cahors', bois: 'Barrique de vin rouge de malbec, chêne français', rarete: 2, van: 0.4, coco: 0.2, epi: 0.45, tan: 0.8, vin: 1.0, fum: 0, coul: 0.85, char: 0.1, ran: 0.1,
      vinNotes: 'cerise noire, mûre, pruneau', desc: 'Le vin noir du Lot : fruits noirs, tanins fins, robe cuivrée.' },
    sherry: { nom: 'Ex-sherry oloroso', bois: 'Bota de Jerez, chêne américain ou européen', rarete: 3, van: 0.35, coco: 0.15, epi: 0.65, tan: 0.6, vin: 1.25, fum: 0, coul: 1.15, char: 0.1, ran: 0.35,
      vinNotes: 'raisins secs, figue, noix', desc: 'Fruits secs, noix, robe acajou. Le grand classique des finitions.' },
    armagnac: { nom: 'Ex-armagnac', bois: 'Pièce gasconne de 400 L recoupée, chêne de Monlezun', rarete: 3, van: 0.55, coco: 0.2, epi: 0.55, tan: 0.5, vin: 0.55, fum: 0, coul: 0.8, char: 0.1, ran: 0.8,
      vinNotes: 'pruneau, cuir, réglisse', desc: 'Pruneau et rancio : le voisin gascon donne de la profondeur aux vieux comptes.' },
    tourbe: { nom: 'Ex-tourbé', bois: 'Ex-bourbon ayant contenu un whisky d\'Islay', rarete: 3, van: 0.6, coco: 0.55, epi: 0.3, tan: 0.3, vin: 0, fum: 1.25, coul: 0.6, char: 0.45, ran: 0,
      desc: 'Feu de tourbe, iode, braise froide. La fumée imprégnée dans le bois passe dans ton distillat.' },
  };
  // S/V ∝ V^(-1/3) : un quartaut extrait ~1,6 fois plus vite qu'une barrique, un demi-muid ~0,7 fois
  const TAILLES = {
    quartaut: { nom: 'Quartaut', L: 57, w: 1, ext: 1.58, o2: 1.6, ange: 1.4, prix: 0.6 },
    barrique: { nom: 'Barrique', L: 225, w: 2, ext: 1, o2: 1, ange: 1, prix: 1 },
    demimuid: { nom: 'Demi-muid', L: 600, w: 3, ext: 0.72, o2: 0.7, ange: 0.75, prix: 1.7 },
  };
  // Rangées du chai : en haut il fait chaud et sec (l'eau part plus vite que l'alcool, le degré monte),
  // en bas frais et humide (l'alcool part plus vite, le degré baisse, comme dans un chai écossais)
  const ZONES = [
    { id: 'haut', nom: 'Haut, chaud et sec', ext: 1.25, ange: 1.35, deg: 0.3, o2: 1.15 },
    { id: 'milieu', nom: 'Milieu, tempéré', ext: 1.0, ange: 1.0, deg: -0.15, o2: 1.0 },
    { id: 'bas', nom: 'Bas, frais et humide', ext: 0.85, ange: 0.7, deg: -0.6, o2: 0.9 },
  ];
  const AXES = ['fruite', 'cereale', 'vanille', 'coco', 'epice', 'vineux', 'fume', 'rancio'];
  const LIB_AXES = { fruite: 'Fruité', cereale: 'Céréale', vanille: 'Vanille', coco: 'Coco, bois', epice: 'Épicé', vineux: 'Vineux', fume: 'Fumé', rancio: 'Rancio' };

  let P = { angePct: 3, degreBouteille: 45, bouteilleL: 0.7, maturationMois: 36 };
  function init(params) { P = { ...P, ...(params || {}) }; return P; }

  const potentiel = (remplissages) => Math.pow(0.5, remplissages || 0);

  // ---------------------------------------------------------------- État
  // À partir de la composition du cœur (multiples des seuils de perception) et du profil de la bière
  function etatInitial(lot) {
    const c = lot.comp || {};
    const degre = lot.degre || 63.5;
    return {
      V: lot.V, degre, age: 0, ageMin: 0,
      fruite: borne((c.esters || 0.8) * 2.2 + (c.terpenes || 0) * 1.4, 0, 10), cereale: borne((c.cereale || 0.6) * 3, 0, 10),
      vanille: 0, coco: 0, epice: 0, vineux: 0, fume: borne(lot.fume || 0, 0, 10), rancio: 0,
      tanin: 0, couleur: 0, soufre: c.soufre || 0, tetes: c.tetes || 0, fusels: c.fusels || 0.8, queues: c.queues || 0.3,
      fumeFut: 0, bois: 0, ox: 0, base: lot.total != null ? lot.total : 35, sources: lot.sources || [], vinNotes: [], futs: [],
    };
  }

  // Avance un état dans un fût, sur une zone, pendant `ans` (le fût est décrit par {type, taille, remplissages, remplissage})
  function vieillir(e0, fut, zone, ans) {
    const T = TYPES[fut.type], Z = TAILLES[fut.taille], C = ZONES[zone] || ZONES[1];
    const e = { ...e0, vinNotes: e0.vinNotes.slice(), futs: e0.futs.slice(), sources: e0.sources.slice() };
    const pot = potentiel(fut.remplissages);
    const plein = borne(e.V / Z.L, 0.05, 1);
    // Plus de vide = plus d'air au contact = plus d'oxydation
    const O = Z.o2 * C.o2 * (1 + 1.2 * (1 - plein));
    const k = pot * Z.ext * C.ext;
    // Degré d'entonnage : bas, il extrait davantage les composés hydrosolubles (tanins, sucres) ; haut, les dérivés de la lignine
    const dt = 0.05, n = Math.round(Math.max(0, ans) / dt);
    for (let i = 0; i < n; i++) {
      const tf = i * dt;
      const fv = 1 + (e.degre - 63.5) / 40, ft = 1 - (e.degre - 63.5) / 40;
      const dW = k * (0.46 * Math.exp(-tf / 1.2) + 0.12) * dt;
      const dV = k * (0.67 * Math.exp(-tf / 1.5)) * dt;
      const dC = k * (0.88 * Math.exp(-tf / 0.8) + 0.1) * dt;
      e.bois += dW;
      e.vanille += 3 * T.van * dW * fv;
      e.coco += 3 * T.coco * dW;
      e.epice += 3 * T.epi * dW;
      e.tanin += 3 * T.tan * dW * ft;
      e.vineux += 4 * T.vin * dV;
      const fb = (e.fume - e.fumeFut) * Math.exp(-0.04 * dt);
      e.fumeFut += 4 * T.fum * dV;
      e.fume = fb + e.fumeFut;
      e.couleur += 30 * T.coul * dC;
      // Soustractives
      e.soufre *= Math.exp(-(0.3 + T.char * pot) * dt);
      e.tetes *= Math.exp(-0.22 * dt);
      e.cereale *= Math.exp(-0.05 * dt);
      // Oxydation : fusels → acides → esters ; les tanins s'arrondissent un peu
      const dox = O * dt;
      e.fusels *= Math.exp(-0.05 * dox);
      e.fruite = Math.min(10, e.fruite + 0.09 * dox * (1 + e.fusels * 0.3));
      e.tanin *= Math.exp(-0.015 * dox);
      e.ox += (1 - plein) * Z.o2 * dt;
      const ageTot = e.age + tf;
      if (ageTot > 7) e.rancio = Math.min(10, e.rancio + 0.32 * O * (1 + T.ran) * dt * Math.min(1, (ageTot - 7) / 3 + 0.2));
      // Part des anges et dérive du degré
      e.V *= 1 - (P.angePct / 100) * C.ange * Z.ange * dt;
      e.degre = borne(e.degre + C.deg * Z.ange * dt, 30, 78);
    }
    e.age += n * dt; e.ageMin += n * dt;
    e.couleur = Math.min(e.couleur, 85);
    if (T.vinNotes && !e.vinNotes.includes(T.vinNotes)) e.vinNotes.push(T.vinNotes);
    if (n) e.futs.push({ type: fut.type, taille: fut.taille, zone, ans: Math.round(ans * 10) / 10, remplissages: fut.remplissages || 0 });
    return e;
  }

  // Assemblage : moyenne pondérée par l'alcool (LAP) ; l'âge légal est celui du plus jeune
  function assembler(etats) {
    const lap = (e) => e.V * e.degre / 100;
    const A = etats.reduce((s, e) => s + lap(e), 0), V = etats.reduce((s, e) => s + e.V, 0);
    const m = {};
    const cles = [...AXES, 'tanin', 'couleur', 'soufre', 'tetes', 'fusels', 'queues', 'fumeFut', 'bois', 'ox', 'base', 'age'];
    for (const k of cles) m[k] = etats.reduce((s, e) => s + (e[k] || 0) * lap(e), 0) / Math.max(1e-6, A);
    return {
      ...m, V, degre: (A / V) * 100, ageMin: Math.min(...etats.map((e) => e.ageMin)),
      vinNotes: [...new Set(etats.flatMap((e) => e.vinNotes))], futs: etats.flatMap((e) => e.futs), sources: [...new Set(etats.flatMap((e) => e.sources))],
      assemblage: etats.length,
    };
  }

  function profil(e) { const p = {}; for (const k of AXES) p[k] = borne(e[k], 0, 10); return p; }

  // ---------------------------------------------------------------- Pipette : notes de dégustation
  const MOTS = {
    fruite: ['poire, pomme mûre', 'poire williams, abricot', 'fruits confits, ananas'],
    cereale: ['pain frais', 'biscuit, malt', 'porridge, céréales chaudes'],
    vanille: ['vanille légère', 'vanille, caramel', 'crème brûlée, toffee'],
    coco: ['bois frais', 'noix de coco', 'noix de coco grillée, sciure douce'],
    epice: ['poivre blanc', 'girofle, cannelle', 'girofle, muscade, bois de santal'],
    vineux: ['une touche vineuse', 'vin', 'vin confit'],
    fume: ['un fil de fumée', 'feu de tourbe', 'tourbe, iode, braise froide'],
    rancio: ['noix fraîche', 'noix, cire d\'abeille', 'rancio, sous-bois, champignon'],
  };
  function pipette(e) {
    const p = profil(e);
    const notes = AXES.map((k) => ({ k, v: p[k] })).filter((x) => x.v >= 1).sort((a, b) => b.v - a.v).slice(0, 4).map(({ k, v }) => {
      const i = v > 6 ? 2 : v > 3 ? 1 : 0;
      let mot = MOTS[k][i];
      if (k === 'vineux' && e.vinNotes.length) mot = e.vinNotes.join(', ');
      return { k, lib: LIB_AXES[k], mot, force: i === 2 ? 'fort' : i === 1 ? 'net' : 'léger' };
    });
    const bouche = [];
    if (e.tanin > 6.5) bouche.push('tanins secs, astringents');
    else if (e.tanin > 3.5) bouche.push('tanins présents, structure');
    else if (e.tanin > 1.2) bouche.push('tanins fondus');
    if (e.fusels > 1.4) bouche.push('chaleur d\'alcool');
    if (e.tetes > 1.2) bouche.push('pointe de colle, encore jeune');
    if (e.soufre > 1) bouche.push('soufre, allumette');
    if (e.ox > 2.5) bouche.push('plat, carton');
    if (e.bois < 0.35) bouche.push('distillat blanc, le bois n\'a presque pas parlé');
    return { notes, bouche };
  }

  // ---------------------------------------------------------------- Défauts et jury sur 50
  const DEFAUTS = {
    jeune: { nom: 'Trop jeune', chimie: 'Le bois n\'a pas eu le temps : peu d\'extraction, l\'acétaldéhyde des têtes n\'est pas encore passé en acétal et les fusels piquent.' },
    sureboise: { nom: 'Sur-boisé', chimie: 'Trop de bois pour le distillat : la vanilline et les lactones écrasent le fruité, l\'ensemble goûte la planche.' },
    tanins: { nom: 'Tanins secs', chimie: 'Les ellagitanins du chêne neuf, surtout en petit fût et à faible degré d\'entonnage, assèchent la bouche.' },
    oxydation: { nom: 'Oxydé', chimie: 'Un fût trop vide laisse trop d\'air : l\'oxydation dépasse l\'estérification, le spiritueux devient plat et cartonneux.' },
    soufre: { nom: 'Soufré', chimie: 'Les composés soufrés n\'ont pas été adsorbés. Le charbon d\'un fût charré et le cuivre de l\'alambic les retiennent.' },
    chaleur: { nom: 'Chaleur d\'alcool', chimie: 'Les alcools supérieurs dominent encore. L\'oxydation lente les transforme en esters, avec le temps et l\'air.' },
  };
  function noter(e) {
    const def = [];
    const ajoute = (id, g, detail) => { if (g > 0) def.push({ id, gravite: g, detail: detail || null, ...DEFAUTS[id] }); };
    const fr = (v) => (Math.round(v * 10) / 10).toString().replace('.', ',');
    const p = profil(e);
    const ff = Math.min(p.fume, e.fumeFut || 0);
    const boise = p.vanille + p.coco + p.epice + p.vineux + 0.6 * ff;
    const distillat = p.fruite + p.cereale + 0.6 * (p.fume - ff);
    const ratio = boise / Math.max(1, distillat);
    ajoute('jeune', e.bois < 0.25 ? 3 : e.bois < 0.45 || e.ageMin < 1.5 ? 2 : e.ageMin < 3 ? 1 : 0, `${fr(e.ageMin)} an(s) de fût.`);
    ajoute('sureboise', ratio > 4.2 ? 3 : ratio > 3.2 ? 2 : ratio > 2.5 ? 1 : 0, `Bois ${fr(boise)} pour distillat ${fr(distillat)}.`);
    ajoute('tanins', e.tanin > 9 ? 3 : e.tanin > 7 ? 2 : e.tanin > 5.5 ? 1 : 0, null);
    ajoute('oxydation', e.ox > 6 ? 3 : e.ox > 4 ? 2 : e.ox > 2.5 ? 1 : 0, null);
    ajoute('soufre', e.soufre > 2.5 ? 2 : e.soufre > 1 ? 1 : 0, null);
    ajoute('chaleur', e.fusels > 2 ? 2 : e.fusels > 1.45 ? 1 : 0, null);
    const g = (ids) => def.filter((d) => ids.includes(d.id)).reduce((s, d) => s + d.gravite, 0);
    const complexes = AXES.filter((k) => p[k] >= 2).length;
    // Équilibre : courbe en cloche autour d'un rapport bois / distillat de 1,5 (échelle logarithmique)
    const cloche = Math.exp(-Math.pow(Math.log(Math.max(0.05, ratio) / 1.5), 2) / (2 * 0.5 * 0.5));
    const L = {
      maturite: borne(10 * borne((e.bois - 0.2) / 0.9, 0, 1) * Math.min(1, 0.55 + 0.15 * e.ageMin) - 1.5 * g(['jeune', 'chaleur']), 0, 10),
      equilibre: borne(12 * cloche - 1.5 * g(['tanins', 'sureboise']), 0, 12),
      complexite: borne(10 * Math.min(1, complexes / 5) + Math.min(2, p.rancio / 2) - g(['oxydation']), 0, 10),
      distillat: borne((e.base / 50) * 10 - g(['soufre']), 0, 10),
      harmonie: borne(8 * (0.55 + 0.45 * cloche) - 1.1 * def.reduce((s, d) => s + d.gravite, 0), 0, 8),
    };
    for (const k in L) L[k] = Math.round(L[k] * 2) / 2;
    const total = Object.values(L).reduce((a, b) => a + b, 0);
    const presentable = e.V >= 2;
    const medaille = !presentable ? null : total >= 45 ? 'or' : total >= 38 ? 'argent' : total >= 30 ? 'bronze' : null;
    return { lignes: L, total, medaille, defauts: def, ratio, presentable };
  }
  const LIB_LIGNES = { maturite: ['Maturité', 10], equilibre: ['Équilibre du boisé', 12], complexite: ['Complexité', 10], distillat: ['Qualité du distillat', 10], harmonie: ['Harmonie', 8] };

  // ---------------------------------------------------------------- Mise en bouteille et dénomination
  function bouteilles(e) {
    const degre = e.degre > P.degreBouteille ? P.degreBouteille : Math.floor(e.degre * 10) / 10;
    const V = (e.V * e.degre) / degre;
    return { degre, V, n: Math.floor(V / P.bouteilleL), brutDeFut: degre < P.degreBouteille, eau: Math.max(0, V - e.V) };
  }
  // Règlement (UE) 2019/787 : whisky = moût de céréales, au moins 3 ans en fût de bois de 700 L au plus, au moins 40 % vol.
  // Une bière houblonnée distillée reste une eau-de-vie de bière.
  function nom(e, degre) {
    const ans = Math.floor(e.ageMin + 1e-6);
    const s = e.sources;
    const houblon = s.includes('biere');
    if (houblon) return `Eau-de-vie de bière${ans >= 1 ? `, ${ans} an${ans > 1 ? 's' : ''} de fût` : ''}`;
    const whisky = e.ageMin >= 3 - 1e-6 && degre >= 40;
    const malt = s.every((x) => x === 'malt'), grain = s.every((x) => x === 'grain');
    if (whisky) return `${malt ? 'Whisky de malt' : grain ? 'Whisky de grain' : 'Whisky assemblé'} ${ans} ans`;
    return `${malt ? 'Eau-de-vie de malt' : 'Eau-de-vie de grain'}${ans >= 1 ? `, ${ans} an${ans > 1 ? 's' : ''} de fût` : ' blanche'}`;
  }

  // ---------------------------------------------------------------- Conseil du maître de chai
  function conseil(e, fut, zone) {
    const n = noter(e), Z = ZONES[zone];
    const d = (id) => n.defauts.find((x) => x.id === id);
    if (d('jeune') && d('jeune').gravite >= 2) return `Trop tôt. À ${Math.floor(e.ageMin)} an(s), le bois n'a pas parlé et les têtes piquent encore. La loi demande 3 ans pour dire whisky.`;
    if (d('sureboise') || (d('tanins') && d('tanins').gravite >= 2)) return fut && TAILLES[fut.taille].L < 100 ? 'Le petit fût travaille vite : le bois prend le dessus. Recule le curseur, ou passe en fût de remplissage.' : 'Le bois commence à écraser ton distillat. Recule le curseur ou monte le chai d\'un cran plus frais.';
    if (d('oxydation')) return 'Trop de vide dans le fût : l\'air oxyde plus vite qu\'il n\'estérifie. Complète le fût ou prends-en un plus petit.';
    if (d('soufre')) return 'Il reste du soufre. Un ex-bourbon bien charré l\'aurait mangé : le charbon l\'adsorbe.';
    if (n.medaille === 'or') return 'Là, c\'est mûr. Bois et distillat se tiennent la main. Moi, je le sortirais.';
    if (e.rancio > 2) return 'Tu touches au rancio : noix, cire, sous-bois. C\'est le cadeau des longues années. Ne le pousse pas jusqu\'au carton.';
    if (zone === 0 && e.degre > 66) return `En haut, l'eau s'évapore plus vite que l'alcool : ton compte est monté à ${Math.round(e.degre)} %. C'est le style chaud et sec du Kentucky.`;
    if (zone === 2) return `En bas, dans le frais, les anges boivent moins (${(P.angePct * Z.ange).toFixed(1).replace('.', ',')} %/an) mais le degré baisse : c'est le chai écossais.`;
    return `Le compte avance : ${n.total}/50 au jury. Cherche le moment où le boisé soutient le distillat sans le couvrir.`;
  }

  racine.Chai = { TYPES, TAILLES, ZONES, AXES, LIB_AXES, DEFAUTS, LIB_LIGNES, init, potentiel, etatInitial, vieillir, assembler, profil, pipette, noter, bouteilles, nom, conseil, get P() { return P; } };
})(typeof globalThis !== 'undefined' ? globalThis : window);
