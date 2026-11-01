/* Ignem custodimus — moteur de brassage
 * Fonctions pures : aucune dépendance au DOM. Testable dans Node.
 * Unités : kg, g, L, °C, EBC. Densités en SG (1.050) et en points (50).
 */
(function (racine) {
  'use strict';

  // Extrait : 1 kg de saccharose dissous dans 1 L donne 385,7 points de densité
  // (46,214 points·gallon/livre converti en points·L/kg).
  const PTS_SACCHAROSE = 385.67;
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const milieu = (p) => (p[0] + p[1]) / 2;
  const fr = (v, d) => v.toFixed(d).replace('.', ',');

  let D = null, idx = null;
  function init(donnees) {
    D = donnees;
    idx = { malt: new Map(), houblon: new Map(), levure: new Map(), eau: new Map(), style: new Map(), aromate: new Map(), aux: new Map(), sel: new Map(), recette: new Map() };
    (D.aromates || []).forEach((a) => idx.aromate.set(a.id, a));
    (D.auxiliaires || []).forEach((a) => idx.aux.set(a.id, a));
    (D.sels || []).forEach((a) => idx.sel.set(a.id, a));
    (D.recettes || []).forEach((a) => idx.recette.set(a.id, a));
    D.malts.forEach((m) => idx.malt.set(m.id, m));
    D.houblons.forEach((h) => idx.houblon.set(h.id, h));
    D.levures.forEach((y) => idx.levure.set(y.id, y));
    D.eaux.forEach((e) => idx.eau.set(e.id, e));
    D.styles.forEach((s) => idx.style.set(s.id, s));
    return idx;
  }

  // --- Classement des grains selon leur rôle chimique ----------------------
  const estSucre = (m) => m.fam === 'sugars';
  const estLactose = (m) => /lactose/i.test(m.nom);
  const estMiel = (m) => /miel|honey/i.test(m.nom) && m.fam === 'sugars';
  const estAcide = (m) => /acidul|sauer/i.test(m.nom);
  const estBle = (m) => /bl[ée]|wheat|froment/i.test(m.nom);
  const estBleCru = (m) => estBle(m) && (m.fam === 'adjuncts' || /flocon|non-malt/i.test(m.nom));
  const estAvoine = (m) => /avoine|oat/i.test(m.nom);
  const estPils = (m) => /pils|lager/i.test(m.nom) && m.fam === 'base';
  const estDesamerise = (m) => /d[ée]sam|debitter|special\)/i.test(m.nom);
  const estSeigle = (m) => /seigle|rye/i.test(m.nom);

  // --- Couleur : Morey (MCU → SRM), puis SRM → EBC ---------------------------
  const ebcVersLovibond = (ebc) => (ebc / 1.97 + 0.76) / 1.3546;
  function couleurEBC(malts, V) {
    let mcu = 0;
    for (const { m, kg } of malts) mcu += (kg * 2.20462 * ebcVersLovibond(m.ebc)) / (V * 0.264172);
    return mcu <= 0 ? 0 : 1.97 * 1.4922 * Math.pow(mcu, 0.6859);
  }

  // --- Amertume : Tinseth -----------------------------------------------------
  function utilisationTinseth(sg, minutes) {
    if (minutes <= 0) return 0;
    const grandeur = 1.65 * Math.pow(0.000125, sg - 1);
    const temps = (1 - Math.exp(-0.04 * minutes)) / 4.15;
    return grandeur * temps;
  }
  // Poids aromatique d'un ajout : les huiles volatiles s'évaporent à l'ébullition
  const poidsArome = (min) => (min < 0 ? 1 : 0.03 + 0.82 * Math.exp(-min / 12));

  // --- pH d'empâtage : acidité du grist + alcalinité résiduelle (Kolbach) -----
  function alcaliniteResiduelle(e) {
    return e.hco3 * (50 / 61) - e.ca / 1.4 - e.mg / 1.7;
  }
  // Profil d'eau corrigé par les sels (doses en g/hL, acide lactique en mL/hL)
  function eauCorrigee(base, sels) {
    const e = { ...base, na: base.na || 0 };
    for (const [id, dose] of Object.entries(sels || {})) {
      const sel = idx.sel.get(id); if (!sel || !(dose > 0)) continue;
      for (const [ion, mg] of Object.entries(sel.ions)) e[ion] = Math.max(0, (e[ion] || 0) + mg * dose);
    }
    return e;
  }

  // --- Calcul complet d'une recette ------------------------------------------
  // recette : { volume, rendement, malts:[{id,kg}], houblons:[{id,g,min}] (min −1 = à cru),
  //             levure, eau, palier, ebullition, fermentation:{temp, reposDiacetyle} }
  // gestes (facultatif, mode expert joué) : { palierMoyen, houblonsMin:[...], fermMax, fermMin, fermMoy }
  function calculer(recette, gestes) {
    const V = recette.volume || 1000;
    const eff = recette.rendement || 0.75;
    const palier = gestes && gestes.palierMoyen != null ? gestes.palierMoyen : recette.palier;
    const tFerm = recette.fermentation.temp;
    const fermMax = gestes && gestes.fermMax != null ? gestes.fermMax : tFerm;
    const fermMin = gestes && gestes.fermMin != null ? gestes.fermMin : tFerm;
    const fermEff = gestes && gestes.fermMoy != null ? 0.6 * gestes.fermMoy + 0.4 * gestes.fermMax : tFerm;

    const malts = recette.malts.map((r) => ({ m: idx.malt.get(r.id), kg: r.kg })).filter((x) => x.m && x.kg > 0);
    const houblons = recette.houblons
      .map((r, i) => ({ h: idx.houblon.get(r.id), g: r.g, min: gestes && gestes.houblonsMin && gestes.houblonsMin[i] != null ? gestes.houblonsMin[i] : r.min }))
      .filter((x) => x.h && x.g > 0);
    const levure = idx.levure.get(recette.levure) || null;
    const eauBase = idx.eau.get(recette.eau) || idx.eau.get('causse');
    const eau = eauCorrigee(eauBase, recette.sels);
    const aux = new Set((recette.auxiliaires || []).map((id) => idx.aux.get(id)).filter(Boolean).map((a) => a.effet));
    const wash = recette.destination === 'wash';
    const aromates = (recette.aromates || []).map((r) => ({ a: idx.aromate.get(r.id), g: r.g })).filter((x) => x.a && x.g > 0);

    // Grains empâtés et pouvoir diastasique
    const empates = malts.filter((x) => !estSucre(x.m));
    const kgEmpate = empates.reduce((s, x) => s + x.kg, 0);
    const kgTotal = malts.reduce((s, x) => s + x.kg, 0);
    const dpMoyen = kgEmpate > 0 ? empates.reduce((s, x) => s + x.kg * (x.m.dp || 0), 0) / kgEmpate : 0;
    let conversion = kgEmpate === 0 ? 1 : borne(Math.pow(dpMoyen / 35, 0.6), 0.45, 1);
    if (aux.has('alpha')) conversion = Math.max(conversion, 0.97);
    // Grains crus : l'amidon doit être gélatinisé (cuisson) avant que les enzymes l'attaquent
    const crusNonCuits = malts.filter((x) => x.m.gel != null && !recette.cuisson && palier < x.m.gel + 8);
    // Bêta-glucanes du seigle, de l'avoine et du blé cru : maische collante sans bêta-glucanase
    const kgGlucanes = malts.filter((x) => estAvoine(x.m) || estSeigle(x.m) || estBleCru(x.m)).reduce((s, x) => s + x.kg, 0);
    const collant = kgEmpate > 0 && kgGlucanes / kgEmpate > 0.3 && !aux.has('glucanase');
    const effMaische = eff * (collant ? 0.9 : 1);

    // Extrait (points de densité)
    let pts = 0, ptsCara = 0, ptsTorr = 0, ptsSucre = 0, ptsLactose = 0, ptsMiel = 0;
    for (const { m, kg } of malts) {
      const cru = crusNonCuits.some((x) => x.m === m);
      const e = estSucre(m) ? 1 : effMaische * conversion * (cru ? 0.55 : 1);
      const p = (kg * (m.rend / 100) * PTS_SACCHAROSE * e) / V;
      pts += p;
      if (m.fam === 'caramel') ptsCara += p;
      if (m.fam === 'roasted') ptsTorr += p;
      if (estSucre(m)) { if (estLactose(m)) ptsLactose += p; else ptsSucre += p; }
      if (estMiel(m)) ptsMiel += p;
    }
    // Purées de fruits : environ 12 % de sucres entièrement fermentescibles
    for (const { a, g } of aromates) if (a.sucre) { const p = ((g / 1000) * a.sucre * PTS_SACCHAROSE) / V; pts += p; ptsSucre += p; }
    if (aux.has('lactase')) { ptsSucre += ptsLactose; ptsLactose = 0; }
    const og = 1 + pts / 1000;
    const part = (x) => (pts > 0 ? x / pts : 0);

    // Fractions massiques (pour pH, styles et arômes)
    const fracKg = (pred) => (kgTotal > 0 ? malts.filter((x) => pred(x.m)).reduce((s, x) => s + x.kg, 0) / kgTotal : 0);
    const fMasse = {
      touraille: fracKg((m) => m.fam === 'kilned'),
      caramel: fracKg((m) => m.fam === 'caramel'),
      torrefie: fracKg((m) => m.fam === 'roasted'),
      torrefieAmer: fracKg((m) => m.fam === 'roasted' && !estDesamerise(m)),
      acide: fracKg(estAcide),
      ble: fracKg(estBle),
      bleCru: fracKg(estBleCru),
      avoine: fracKg(estAvoine),
      pils: fracKg(estPils),
      seigle: fracKg(estSeigle),
    };

    // Atténuation apparente : levure, palier d'empâtage, dextrines des malts caramel
    const attLevure = levure ? milieu(levure.att) / 100 : 0;
    const effetPalier = borne(-0.015 * (palier - 65.5), -0.1, 0.04);
    // Sans ébullition (wash), les enzymes du malt continuent de travailler pendant la fermentation
    let attMalt = (attLevure + effetPalier + (wash ? 0.04 : 0)) * (1 - 0.35 * part(ptsCara) - 0.15 * part(ptsTorr));
    if (aux.has('gluco')) attMalt = Math.min(0.98, attMalt + 0.08 + 0.2 * part(ptsCara));
    let att = attMalt * (1 - part(ptsSucre) - part(ptsLactose)) + 0.98 * part(ptsSucre);
    let fermentationLente = false;
    if (levure && fermMin < levure.t[0] - 2) { att *= aux.has('nutriment') ? 0.94 : 0.88; fermentationLente = true; }
    att = levure ? borne(att, 0.35, 0.99) : 0;
    let fgPts = pts * (1 - att);
    let abv = ((pts - fgPts) / 1000) * 131.25;
    let bloquee = false;
    const tolerance = levure ? levure.tol + (aux.has('nutriment') ? 1 : 0) : 0;
    if (levure && abv > tolerance) {
      bloquee = true;
      abv = tolerance;
      fgPts = pts - (abv / 131.25) * 1000;
      att = pts > 0 ? 1 - fgPts / pts : 0;
    }
    const fg = 1 + fgPts / 1000;

    // Amertume et arôme houblon
    let ibu = 0, aromeHoublon = 0, epiceHoublon = 0;
    const notesHoublon = [];
    const detailHoublons = houblons.map(({ h, g, min }) => {
      const u = wash ? 0 : utilisationTinseth(og, min);
      const mgL = ((h.alpha / 100) * g * 1000) / V;
      const i = u * mgL;
      ibu += i;
      const w = (g / V) * poidsArome(wash ? -1 : min) * (h.huile || 1);
      aromeHoublon += w;
      // Humulène et caryophyllène : notes boisées et poivrées
      if (h.oils && h.oils.hum != null) epiceHoublon += w * ((h.oils.hum || 0) + (h.oils.car || 0)) / 100;
      const n = notesHoublon.find((x) => x.nom === h.nom);
      if (n) n.w += w; else notesHoublon.push({ nom: h.nom, notes: h.aromes, w });
      return { nom: h.nom, g, min, ibu: i };
    });

    const ebc = couleurEBC(malts, V);

    // pH d'empâtage
    const ra = alcaliniteResiduelle(eau);
    const ph = kgEmpate > 0
      ? 5.70 - 0.45 * fMasse.touraille - 1.3 * fMasse.caramel - 3.4 * fMasse.torrefie - 10 * fMasse.acide + 0.0012 * ra
      : 5.7;
    const so4cl = eau.cl > 0 ? eau.so4 / eau.cl : 1;

    // Profil aromatique (0–10)
    let fruite = 0, epice = 0;
    if (levure) {
      const tf = borne((fermEff - levure.t[0]) / Math.max(1, levure.t[1] - levure.t[0]), 0, 1.4);
      fruite = [1.2, 3, 5.5][levure.ester] * (0.55 + 0.8 * tf);
      if (fermMax > levure.t[1]) fruite += (fermMax - levure.t[1]) * 0.6;
      if (levure.fam === 'lager' && fermEff > 15) fruite += (fermEff - 15) * 0.35;
      epice = levure.phenol ? 4.5 + 3 * Math.min(1, tf) : 0;
    }
    epice += fMasse.seigle * 6 + Math.min(1.5, epiceHoublon * 1.5);
    // Aromates : intensité selon la dose (g/L) rapportée à leur dose d'usage
    const notesAromates = [], surdoses = [];
    const ajoutAxes = { malte: 0, caramel: 0, torrefie: 0, amer: 0, houblon: 0, fruite: 0, epice: 0, corps: 0 };
    for (const { a, g } of aromates) {
      const k = g / V, dm = (a.dose[0] + a.dose[1]) / 2;
      const intensite = 10 * (1 - Math.exp(-k / dm));
      for (const [axe, coef] of Object.entries(a.axes)) ajoutAxes[axe] += intensite * coef * 0.6;
      notesAromates.push({ nom: a.nom, notes: a.notes, intensite });
      if (k > a.dose[1] * 1.5) surdoses.push({ a, k });
    }
    const profil = {
      malte: borne(2.5 + 5 * fMasse.touraille + (pts - 40) / 12 + fMasse.ble * 1.5 + ajoutAxes.malte, 0, 10),
      caramel: borne(28 * fMasse.caramel + ajoutAxes.caramel, 0, 10),
      torrefie: borne(55 * fMasse.torrefie + ajoutAxes.torrefie, 0, 10),
      amer: borne(ibu / 8 + (so4cl > 2 ? 0.8 : so4cl < 0.8 ? -0.5 : 0) + ajoutAxes.amer, 0, 10),
      houblon: borne(10 * (1 - Math.exp(-aromeHoublon / 2)), 0, 10),
      fruite: borne(fruite + ajoutAxes.fruite, 0, 10),
      epice: borne(epice + ajoutAxes.epice, 0, 10),
      corps: borne((fgPts - 4) / 2 + fMasse.avoine * 8 + ajoutAxes.corps, 0, 10),
    };
    // Notes de dégustation : houblons tardifs dominants et aromates
    const notes = notesHoublon.filter((x) => x.w > 0.15).sort((a, b) => b.w - a.w).slice(0, 3).map((x) => ({ source: x.nom, notes: x.notes, type: 'houblon' }))
      .concat(notesAromates.filter((x) => x.intensite > 1).sort((a, b) => b.intensite - a.intensite).map((x) => ({ source: x.nom, notes: x.notes, type: 'aromate' })));

    const res = {
      volume: V, og, fg, pts, fgPts, abv, ibu, ebc, ph, ra, so4cl, attenuation: att,
      dpMoyen, conversion, kgTotal, fMasse, ptsMiel: part(ptsMiel), detailHoublons, profil,
      levure, eau, palier, fermEff, fermMax, fermMin, bloquee, fermentationLente,
      aDesMalts: kgTotal > 0, wash, aux, notes, surdoses, crusNonCuits: crusNonCuits.map((x) => x.m.nom), collant,
      aromates: aromates.map((x) => ({ id: x.a.id, g: x.g, terp: x.a.terp, type: x.a.type })),
    };
    res.styles = wash ? [] : classerStyles(res, recette);
    res.style = res.styles[0] || null;
    res.defauts = detecterDefauts(res, recette);
    return res;
  }

  // --- Reconnaissance du style -------------------------------------------------
  const STYLES_LAGER = ['pilsener', 'bock', 'marzen', 'vienna', 'common'];
  const STYLES_PHENOLES = ['wheat_ph', 'farmhouse'];
  function contraintesStyle(s, r) {
    let p = 0;
    const y = r.levure;
    const lager = y && y.fam === 'lager';
    if (STYLES_LAGER.includes(s.sujet)) { if (!lager) p += 2.5; }
    else if (lager) p += 1.5;
    const titre = s.nom.toLowerCase();
    const weizen = /weizen/.test(titre), wit = /witbier/.test(titre), amWheat = s.sujet === 'wheat' && !weizen && !wit;
    if (weizen) { if (r.fMasse.ble < 0.45) p += 2 * (0.45 - r.fMasse.ble) / 0.45 + 0.5; if (!y || !y.phenol) p += 2; }
    // Witbier : blé cru (non malté) ; weizen : blé malté
    if (wit) { if (r.fMasse.ble < 0.3) p += 1.5; if (r.fMasse.bleCru < 0.12) p += 1.2; if (!y || !y.phenol) p += 2; }
    if (weizen && r.fMasse.bleCru > 0.15) p += 0.6;
    if (amWheat && r.fMasse.ble < 0.25) p += 1.5;
    if (s.sujet === 'farmhouse' && (!y || !y.phenol)) p += 2.5;
    const phenoleOk = weizen || wit || s.sujet === 'farmhouse';
    if (y && y.phenol && !phenoleOk) p += 1.5;
    if (s.sujet === 'stout' && r.fMasse.torrefie < 0.06) p += 2;
    if (s.sujet === 'porter' && r.fMasse.torrefie < 0.04) p += 1.5;
    if (/oatmeal/i.test(titre) && r.fMasse.avoine < 0.05) p += 1.2;
    if (s.sujet === 'specialty') { if (r.ptsMiel < 0.3) p += 3; }
    else if (r.ptsMiel > 0.35) p += 1.5;
    return p;
  }
  function ecart(x, plage) {
    const larg = Math.max(plage[1] - plage[0], plage[0] * 0.04, 1e-6);
    if (x < plage[0]) return (plage[0] - x) / larg;
    if (x > plage[1]) return (x - plage[1]) / larg;
    return 0;
  }
  // Dans la plage, être au centre vaut mieux qu'être au bord (0 au centre, 1 au bord)
  function excentrage(x, plage) {
    const demi = Math.max((plage[1] - plage[0]) / 2, 1e-6);
    return borne(Math.abs(x - (plage[0] + plage[1]) / 2) / demi, 0, 1);
  }
  function classerStyles(r) {
    if (!r.aDesMalts || !r.levure) return [];
    return D.styles.map((s) => {
      const d = {
        og: ecart(r.og, s.og), fg: ecart(r.fg, s.fg), ibu: ecart(r.ibu, s.ibu), ebc: ecart(r.ebc, s.ebc),
      };
      const centre = 0.07 * (excentrage(r.og, s.og) ** 2 + excentrage(r.fg, s.fg) ** 2 + excentrage(r.ibu, s.ibu) ** 2 + excentrage(r.ebc, s.ebc) ** 2);
      const dist = d.og ** 2 + 0.7 * d.fg ** 2 + d.ibu ** 2 + d.ebc ** 2 + contraintesStyle(s, r) + centre;
      return { style: s, ecarts: d, distance: dist, conformite: Math.exp(-dist) };
    }).sort((a, b) => a.distance - b.distance);
  }

  // --- Défauts : chimie et conséquences -----------------------------------------
  const DEFAUTS = {
    fusels: { nom: 'Alcools supérieurs', en: 'fusel alcohols', sens: ['arome', 'saveur', 'bouche'],
      chimie: "Au-dessus de sa plage, la levure produit plus d'alcools supérieurs par la voie d'Ehrlich (désamination des acides aminés). Goût chaud, solvant.",
      conseil: 'Fermente plus frais ou garde la température sous contrôle au pic de fermentation.' },
    diacetyle: { nom: 'Diacétyle', en: 'diacetyl', sens: ['arome', 'saveur'],
      chimie: "L'α-acétolactate sort de la levure puis s'oxyde en 2,3-butanedione (beurre, caramel au beurre). La levure le réabsorbe si on lui en laisse le temps à température plus haute.",
      conseil: 'Pour une lager, active le repos diacétyle : +4 °C en fin de fermentation pendant 2 jours.' },
    dms: { nom: 'DMS', en: 'dimethyl sulfide', sens: ['arome', 'saveur'],
      chimie: "La S-méthylméthionine des malts très pâles se convertit en diméthylsulfure (maïs cuit) à chaud. Une ébullition vigoureuse et longue le chasse.",
      conseil: 'Avec plus de 50 % de malt Pils, fais bouillir 90 minutes.' },
    astringence: { nom: 'Astringence', en: 'astringency', sens: ['bouche', 'saveur'],
      chimie: "Au-dessus de pH 5,8, les polyphénols et tanins de l'enveloppe du grain passent dans le moût. Sensation sèche, râpeuse.",
      conseil: "Ajoute 1 à 3 % de malt acide ou choisis une eau moins alcaline pour les bières pâles." },
    acidite: { nom: 'pH trop bas', en: 'low mash pH', sens: ['saveur', 'bouche'],
      chimie: "Sous pH 5,2, les enzymes travaillent mal et la bière paraît mince et aigrelette.",
      conseil: "Réduis le malt acide ou les malts torréfiés, ou prends une eau plus alcaline (Dublin, causse)." },
    amidon: { nom: 'Conversion incomplète', en: 'starch haze', sens: ['aspect', 'saveur'],
      chimie: "Pas assez d'enzymes (pouvoir diastasique) pour couper tout l'amidon : trouble amidonné et rendement perdu.",
      conseil: 'Garde au moins 60 % de malt de base, ou un pouvoir diastasique moyen au-dessus de 35 °Lintner.' },
    bloquee: { nom: 'Fermentation bloquée', en: 'stuck fermentation', sens: ['saveur', 'bouche'],
      chimie: "La levure a atteint sa tolérance à l'alcool ou a été saisie par le froid : il reste des sucres, la bière est lourde et sucrée.",
      conseil: 'Choisis une levure plus tolérante ou baisse la densité initiale.' },
    torrefie: { nom: 'Âpreté torréfiée', en: 'acrid roast', sens: ['saveur'],
      chimie: "Au-delà de 15 % de malts torréfiés non désamérisés, les composés de pyrolyse donnent une amertume brûlée.",
      conseil: 'Plafonne les malts noirs à 10–12 % ou passe sur un Carafa Special désamérisé.' },
    amertume: { nom: 'Amertume écrasante', en: 'harsh bitterness', sens: ['saveur'],
      chimie: "Les iso-acides alpha dépassent largement ce que le corps de la bière peut équilibrer.",
      conseil: "Réduis l'ajout à 60 min ou déplace une partie du houblon en fin d'ébullition." },
    phenols: { nom: 'Phénols hors style', en: 'phenolic', sens: ['arome', 'saveur'],
      chimie: "La levure est POF+ : elle décarboxyle l'acide férulique en 4-vinylgaïacol (clou de girofle). Très bien dans une weizen, déplacé ailleurs.",
      conseil: 'Pour ce style, prends une levure neutre (US-05, W-34/70).' },
    infection: { nom: 'Infection lactique', en: 'lactic infection', sens: ['arome', 'saveur', 'aspect'],
      chimie: "Des lactobacilles ont transformé une partie des sucres en acide lactique : acidité et voile.",
      conseil: 'Hygiène stricte et fermentation tenue dans la plage de la levure.' },
    aromate: { nom: 'Aromate envahissant', en: 'overspiced', sens: ['arome', 'saveur'],
      chimie: "Un aromate dosé bien au-delà de son usage écrase la bière : on ne goûte plus que lui.",
      conseil: "Reste dans la plage de dose indiquée sur la fiche de l'aromate." },
    lactique: { nom: 'Acidité lactique', en: 'lactic sourness', sens: ['saveur'],
      chimie: "Au-delà d'environ 25 mL/hL, l'acide lactique ajouté à l'eau devient perceptible : bière aigrelette.",
      conseil: "Corrige plutôt le pH avec du malt acide, ou une eau moins alcaline." },
    crus: { nom: 'Amidon cru', en: 'ungelatinized starch', sens: ['aspect', 'saveur'],
      chimie: "Le maïs, le seigle ou le blé crus gélatinisent à plus haute température que le malt d'orge. Sans cuisson, leur amidon reste inaccessible aux enzymes : trouble et extrait perdu.",
      conseil: 'Active la cuisson des grains crus dans le Procédé, ou prends des flocons (déjà gélatinisés).' },
    horsStyle: { nom: 'Style trop étrange', en: 'off-style', sens: ['arome', 'saveur'],
      chimie: "La bière ne ressemble à aucun style connu : le jury ne sait pas à quoi la comparer.",
      conseil: 'Rapproche densité, amertume et couleur des plages du style visé.' },
  };

  function defaut(id, gravite, detail) { return { id, gravite, detail: detail || null, ...DEFAUTS[id] }; }

  function detecterDefauts(r, recette) {
    const out = [];
    if (!r.aDesMalts || !r.levure) return out;
    const y = r.levure;
    if (r.fermMax > y.t[1] + 1) out.push(defaut('fusels', r.fermMax > y.t[1] + 4 ? 3 : r.fermMax > y.t[1] + 2.5 ? 2 : 1, `Pic à ${fr(r.fermMax, 1)} °C pour une levure donnée jusqu'à ${y.t[1]} °C.`));
    if (y.fam === 'lager' && !recette.fermentation.reposDiacetyle) out.push(defaut('diacetyle', 2, 'Lager sans repos diacétyle.'));
    else if (r.fermentationLente) out.push(defaut('diacetyle', 1, 'Fermentation trop froide, la levure a décroché.'));
    if (r.fMasse.pils > 0.5 && recette.ebullition < 90) out.push(defaut('dms', r.fMasse.pils > 0.8 ? 2 : 1, `${Math.round(r.fMasse.pils * 100)} % de malt Pils et ${recette.ebullition} min d'ébullition.`));
    if (r.ph > 5.78) out.push(defaut('astringence', r.ph > 5.92 ? 2 : 1, `pH d'empâtage estimé ${fr(r.ph, 2)}.`));
    if (r.ph < 5.15) out.push(defaut('acidite', r.ph < 5.0 ? 2 : 1, `pH d'empâtage estimé ${fr(r.ph, 2)}.`));
    if (r.conversion < 0.9) out.push(defaut('amidon', r.conversion < 0.7 ? 2 : 1, `Pouvoir diastasique moyen ${Math.round(r.dpMoyen)} °Lintner.`));
    if (r.bloquee || r.fermentationLente && r.fermMin < y.t[0] - 4) out.push(defaut('bloquee', 2, r.bloquee ? `Tolérance de la levure : ${y.tol} % vol.` : 'Fermentation saisie par le froid.'));
    if (r.fMasse.torrefieAmer > 0.15) out.push(defaut('torrefie', r.fMasse.torrefieAmer > 0.22 ? 2 : 1, `${Math.round(r.fMasse.torrefieAmer * 100)} % de malts torréfiés.`));
    const s = r.style && r.style.style;
    if (s && r.ibu > s.ibu[1] * 1.4 + 10) out.push(defaut('amertume', r.ibu > s.ibu[1] * 2 ? 2 : 1, `${Math.round(r.ibu)} IBU pour un maximum de ${Math.round(s.ibu[1])}.`));
    if (s && y.phenol && !/weizen|witbier/i.test(s.nom) && s.sujet !== 'farmhouse') out.push(defaut('phenols', 1, `Levure ${y.nom} dans une ${s.nom}.`));
    for (const { a, k } of r.surdoses) out.push(defaut('aromate', k > a.dose[1] * 3 ? 2 : 1, `${a.nom} à ${fr(k, 1)} g/L, usage ${fr(a.dose[0], 1)}–${fr(a.dose[1], 1)} g/L.`));
    if (recette.sels && recette.sels.lactique > 25) out.push(defaut('lactique', recette.sels.lactique > 45 ? 2 : 1, `${Math.round(recette.sels.lactique)} mL/hL d'acide lactique.`));
    if (r.crusNonCuits.length) out.push(defaut('crus', 1, `${r.crusNonCuits.join(', ')} sans cuisson, palier à ${fr(r.palier, 1)} °C.`));
    if (!r.wash && (!r.style || r.style.conformite < 0.18)) out.push(defaut('horsStyle', 2, r.style ? `Le style le plus proche, ${r.style.style.nom}, ne colle qu'à ${Math.round(r.style.conformite * 100)} %.` : null));
    return out;
  }

  // --- Attentes aromatiques par style --------------------------------------------
  function attentes(s) {
    const t = s.nom.toLowerCase(), a = {};
    if (s.sujet === 'ipa') a.houblon = [6, 10];
    if (s.sujet === 'pale_ale' || s.sujet === 'amber') a.houblon = [3.5, 10];
    if (s.sujet === 'pilsener') { a.houblon = [1.5, 6]; a.fruite = [0, 2.5]; }
    if (['bock', 'marzen', 'vienna'].includes(s.sujet)) { a.malte = [4.5, 10]; a.fruite = [0, 2.5]; }
    if (s.sujet === 'common') a.fruite = [0, 4];
    if (/weizen/.test(t)) { a.fruite = [4, 10]; a.epice = [3, 10]; }
    if (/witbier/.test(t) || s.sujet === 'farmhouse') a.epice = [3, 10];
    if (s.sujet === 'stout' || s.sujet === 'porter') a.torrefie = [3.5, 10];
    if (s.sujet === 'bitter') a.fruite = [1.5, 6];
    if (s.sujet === 'brown') a.caramel = [1, 7];
    return a;
  }
  function satisfaction(profil, att) {
    const cles = Object.keys(att);
    if (!cles.length) return 1;
    let s = 0;
    for (const k of cles) {
      const [lo, hi] = att[k], v = profil[k];
      s += v < lo ? borne(1 - (lo - v) / 4, 0, 1) : v > hi ? borne(1 - (v - hi) / 4, 0, 1) : 1;
    }
    return s / cles.length;
  }

  // --- Fiche de jury /50 (barème BJCP) ----------------------------------------------
  // jeu : { mode:'debutant'|'expert', scores:{palier,houblon,ferm} (0–1), infection:bool }
  function noter(r, jeu) {
    if (!r.style) return null;
    const defauts = r.defauts.slice();
    if (jeu && jeu.infection) defauts.push(defaut('infection', 2, 'Contamination pendant la fermentation.'));
    const s = r.style.style, c = r.style.conformite;
    const e = satisfaction(r.profil, attentes(s));
    const grav = (sens) => defauts.filter((d) => d.sens.includes(sens)).reduce((t, d) => t + d.gravite, 0);
    const gravTotale = defauts.reduce((t, d) => t + d.gravite, 0);

    const ratioBUGU = r.pts > 0 ? r.ibu / r.pts : 0;
    const ratioStyle = milieu(s.ibu) / ((milieu(s.og) - 1) * 1000);
    const equilibre = Math.exp(-2 * ((ratioBUGU - ratioStyle) / ratioStyle) ** 2);

    let malus = 0;
    if (jeu && jeu.mode === 'debutant' && jeu.scores) {
      const v = Object.values(jeu.scores).filter((x) => x != null);
      if (v.length) malus = 1 - v.reduce((a, b) => a + b, 0) / v.length;
    }

    // Limpidité : les clarifiants comptent, sauf pour les styles troubles par nature
    const trouble = /weizen|witbier/i.test(s.nom);
    let limpidite = grav('aspect') ? 0 : trouble ? 1 : 0.5 + (r.aux.has('clarif_chaud') ? 0.25 : 0) + (r.aux.has('clarif_froid') ? 0.25 : 0);
    if (trouble && r.aux.has('clarif_froid')) limpidite -= 0.5;
    const aspect = borne((r.style.ecarts.ebc < 0.25 ? 1 : r.style.ecarts.ebc < 1 ? 0.5 : 0) + limpidite + (r.fermMax > r.levure.t[1] + 3 ? 0.5 : 1), 0, 3);
    const arome = borne(12 * (0.25 + 0.4 * c + 0.35 * e) - 1.5 * grav('arome'), 0, 12);
    const bouche = borne(5 * (0.4 + 0.6 * Math.exp(-(r.style.ecarts.fg ** 2))) - 1 * grav('bouche'), 0, 5);
    const saveur = borne(20 * (0.25 + 0.45 * c + 0.3 * equilibre) - 2 * grav('saveur') - 4 * malus, 0, 20);
    const impression = borne(10 * (0.3 + 0.35 * c + 0.35 * e) - 0.8 * gravTotale - 4 * malus, 0, 10);
    const arr = (v) => Math.round(v * 2) / 2;
    const lignes = { aspect: arr(aspect), arome: arr(arome), bouche: arr(bouche), saveur: arr(saveur), impression: arr(impression) };
    const total = Object.values(lignes).reduce((a, b) => a + b, 0);
    const medaille = total >= 45 ? 'or' : total >= 38 ? 'argent' : total >= 30 ? 'bronze' : null;
    return { lignes, total, medaille, defauts, conformite: c, attente: e, equilibre, malus };
  }

  // --- Fiche technique d'un wash de distillation (/20) --------------------------------
  // Le bouilleur juge un wash sur ce qu'il donnera à l'alambic : alcool, propreté, potentiel aromatique.
  function noterWash(r, jeu) {
    if (!r.aDesMalts || !r.levure) return null;
    const defauts = r.defauts.filter((d) => ['fusels', 'bloquee', 'crus', 'amidon', 'astringence', 'acidite', 'lactique'].includes(d.id));
    if (jeu && jeu.infection) defauts.push(defaut('infection', 1, 'Un peu de lactique : en distillerie écossaise, ce n\'est pas toujours un drame.'));
    const lap = r.abv * r.volume / 100;
    const alcool = borne((r.abv - 4) / 4.5, 0, 1) * 8;
    const attenuation = borne((r.attenuation - 0.72) / 0.18, 0, 1) * 4;
    const proprete = borne(5 - 1.5 * defauts.reduce((t, d) => t + d.gravite, 0), 0, 5);
    const potentiel = borne((r.profil.fruite + r.profil.malte) / 12, 0, 1) * 3;
    const lignes = { alcool: Math.round(alcool * 2) / 2, attenuation: Math.round(attenuation * 2) / 2, proprete: Math.round(proprete * 2) / 2, potentiel: Math.round(potentiel * 2) / 2 };
    const total = Object.values(lignes).reduce((a, b) => a + b, 0);
    return { lignes, total, lap, defauts };
  }

  // --- Conseils chiffrés du mentor ------------------------------------------------
  function conseils(r, recette) {
    const out = [];
    if (!r.aDesMalts) return [{ txt: 'La cuve est vide. Commence par un malt de base, environ 200 kg pour 1000 L.', fiche: 'densite' }];
    if (!r.levure) out.push({ txt: 'Il manque une levure : sans elle, pas de fermentation.', fiche: 'levure' });
    if (r.ph > 5.78) {
      const kg = Math.ceil(((r.ph - 5.5) / 10) * r.kgTotal);
      out.push({ txt: `pH d'empâtage estimé ${fr(r.ph, 2)}, trop haut : environ ${kg} kg de malt acide le ramènerait vers 5,5.`, fiche: 'eau' });
    }
    if (r.ph < 5.15) out.push({ txt: `pH d'empâtage estimé ${fr(r.ph, 2)}, trop bas : réduis le malt acide ou les malts torréfiés, ou prends une eau plus alcaline.`, fiche: 'eau' });
    if (r.conversion < 0.9) out.push({ txt: `Pouvoir diastasique faible (${Math.round(r.dpMoyen)} °Lintner) : ajoute du malt de base pour convertir l'amidon.`, fiche: 'empatage' });
    if (r.fMasse.torrefieAmer > 0.15) out.push({ txt: 'Plus de 15 % de malts torréfiés : attention à l\'âpreté.', fiche: 'couleur' });
    if (r.levure && r.levure.fam === 'lager' && !recette.fermentation.reposDiacetyle) out.push({ txt: 'Levure lager : pense au repos diacétyle dans l\'onglet Procédé.', fiche: 'defauts' });
    if (r.levure && (recette.fermentation.temp > r.levure.t[1] || recette.fermentation.temp < r.levure.t[0])) out.push({ txt: `${r.levure.nom} travaille entre ${r.levure.t[0]} et ${r.levure.t[1]} °C. Ta consigne est à ${recette.fermentation.temp} °C.`, fiche: 'levure' });
    if (r.fMasse.pils > 0.5 && recette.ebullition < 90 && !r.wash) out.push({ txt: 'Beaucoup de malt Pils : 90 min d\'ébullition chasseront le DMS.', fiche: 'defauts' });
    if (r.crusNonCuits.length) out.push({ txt: `${r.crusNonCuits.join(', ')} : grain cru non gélatinisé à ${fr(r.palier, 1)} °C. Active la cuisson des grains crus.`, fiche: 'empatage' });
    if (r.collant) out.push({ txt: 'Plus de 30 % de seigle, d\'avoine ou de blé cru : la maische colle et le rendement baisse. Une bêta-glucanase aiderait.', fiche: 'empatage' });
    for (const { a } of r.surdoses) out.push({ txt: `${a.nom} : dose trop forte, l'usage est de ${fr(a.dose[0], 1)} à ${fr(a.dose[1], 1)} g/L.`, fiche: 'aromates' });
    if (r.wash && recette.houblons.length) out.push({ txt: 'Un wash de distillation se fait d\'ordinaire sans houblon : sans ébullition, pas d\'amertume, mais les huiles passeront dans l\'eau-de-vie.', fiche: 'distillation' });
    const st = r.style;
    if (r.wash && r.levure && r.levure.fam !== 'distilling') out.push({ txt: 'Pour un wash, une levure de distillerie atténue plus loin et tolère plus d\'alcool.', fiche: 'levure' });
    if (st) {
      const s = st.style, V = r.volume, eff = recette.rendement || 0.75;
      if (st.ecarts.og > 0.2) {
        const delta = (milieu(s.og) - r.og) * 1000;
        const kg = Math.abs(Math.round((delta * V) / (0.8 * PTS_SACCHAROSE * eff) / 5) * 5);
        out.push({ txt: `Pour une ${s.nom}, vise une densité de ${fr(s.og[0], 3)} à ${fr(s.og[1], 3)} : ${delta > 0 ? 'ajoute' : 'retire'} environ ${kg} kg de malt de base.`, fiche: 'densite' });
      }
      if (st.ecarts.ibu > 0.2 && r.ibu < s.ibu[0]) {
        const manque = milieu(s.ibu) - r.ibu;
        const u = utilisationTinseth(r.og, 60), g = Math.round((manque * V) / (u * 0.12 * 1000) / 50) * 50;
        out.push({ txt: `Il manque environ ${Math.round(manque)} IBU : ${g} g d'un houblon à 12 % d'acides alpha à 60 min.`, fiche: 'amertume' });
      } else if (st.ecarts.ibu > 0.2) out.push({ txt: `Trop amer pour une ${s.nom} (${Math.round(s.ibu[0])}–${Math.round(s.ibu[1])} IBU).`, fiche: 'amertume' });
      if (st.ecarts.ebc > 0.3) out.push({ txt: `Couleur ${Math.round(r.ebc)} EBC, la ${s.nom} se situe entre ${Math.round(s.ebc[0])} et ${Math.round(s.ebc[1])} EBC.`, fiche: 'couleur' });
    }
    return out;
  }

  // --- Couleur d'affichage d'une bière (EBC → RVB) -----------------------------
  const TEINTES = [[0, [250, 240, 160]], [4, [248, 222, 104]], [8, [236, 184, 52]], [12, [218, 150, 36]], [20, [186, 104, 26]],
    [30, [150, 70, 22]], [45, [110, 42, 18]], [70, [72, 24, 12]], [110, [40, 14, 8]], [200, [16, 6, 4]]];
  function couleurRVB(ebc) {
    for (let i = 1; i < TEINTES.length; i++) {
      const [e1, c1] = TEINTES[i - 1], [e2, c2] = TEINTES[i];
      if (ebc <= e2) {
        const t = (ebc - e1) / (e2 - e1);
        return c1.map((v, k) => Math.round(v + (c2[k] - v) * t));
      }
    }
    return TEINTES[TEINTES.length - 1][1];
  }

  const api = { init, calculer, noter, noterWash, eauCorrigee, conseils, couleurRVB, utilisationTinseth, couleurEBC, poidsArome, DEFAUTS, PTS_SACCHAROSE, attentes };
  racine.Moteur = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
