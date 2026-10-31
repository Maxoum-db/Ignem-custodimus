/* Ignem custodimus — moteur de distillation (Ulysse, alambic ambulant à bois)
 * Fonctions pures, sans DOM. Unités : L, % vol, LAP (litres d'alcool pur), °C.
 *
 * Modèle :
 *  - équilibre liquide-vapeur eau-éthanol à pression atmosphérique (table),
 *    enrichi par le reflux du chapiteau et du col de cygne (plateaux effectifs n) ;
 *  - distillation discontinue de Rayleigh, pas à pas ;
 *  - chaque congénère k quitte la chaudière à la vitesse
 *      dQk = Qk × (αk × dA/A + βk × e^((Téb − 85)/3) × dV/V)
 *    α : volatilité relative à l'éthanol (têtes très volatiles),
 *    β : entraînement avec l'eau, qui croît quand la chaudière s'appauvrit et chauffe (queues).
 */
(function (racine) {
  'use strict';
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const interp = (table, x) => {
    if (x <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i++) if (x <= table[i][0]) {
      const [x1, y1] = table[i - 1], [x2, y2] = table[i];
      return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
    }
    return table[table.length - 1][1];
  };

  // Degré du liquide (% vol) → degré de la vapeur en équilibre (% vol), eau-éthanol à 1 atm
  const VLE = [[0, 0], [1, 10.3], [2, 19.7], [3, 27], [4, 32.5], [5, 36.5], [6, 40], [8, 45.5], [10, 49.5], [12, 52.5], [15, 56], [20, 61], [25, 64], [30, 66.5], [35, 68.5], [40, 70.5], [50, 73.5], [60, 77], [70, 81], [80, 86], [90, 92], [96, 96]];
  // Température d'ébullition du mélange (°C) selon son degré
  const TEB = [[0, 100], [2, 97], [5, 94], [10, 91.5], [20, 87], [30, 84.5], [40, 83], [60, 81], [80, 79.5], [96, 78.2]];
  const vapeur1 = (p) => interp(VLE, p);
  // n = plateaux effectifs : 1 = simple équilibre ; le reflux ajoute une fraction de plateau
  function vapeur(p, n) {
    const y1 = vapeur1(p);
    if (n <= 1) return y1;
    return y1 + (vapeur1(y1) - y1) * (n - 1);
  }
  const ebullition = (p) => interp(TEB, p);
  // Chapiteau et col de cygne d'Ulysse : environ 1,2 plateau ; une chauffe douce ajoute du reflux
  const plateaux = (feu) => 1.2 + 0.7 * (1 - borne(feu, 0, 1));

  // --- Congénères ---------------------------------------------------------------
  const CONGENERES = {
    tetes: { nom: 'Têtes', chimie: 'acétaldéhyde, acétate d\'éthyle', nez: 'colle, vernis, pomme verte', a: 60, b: 0, poids: 1.0 },
    soufre: { nom: 'Soufre', chimie: 'H₂S, thiols, DMS', nez: 'œuf, chou cuit', a: 15, b: 0, poids: 1.4 },
    methanol: { nom: 'Méthanol', chimie: 'méthanol', nez: 'aucune odeur', a: 1.8, b: 0, poids: 0 },
    esters: { nom: 'Fruité', chimie: 'acétate d\'isoamyle, hexanoate d\'éthyle', nez: 'poire, banane, fruits blancs', a: 3, b: 0, poids: 0.55 },
    terpenes: { nom: 'Houblon', chimie: 'myrcène, linalol, géraniol', nez: 'houblon, agrumes, résine', a: 0.8, b: 0.03, poids: 0.6 },
    fusels: { nom: 'Chaleur', chimie: 'alcools isoamylique et propylique', nez: 'chaud, dissolvant', a: 0.85, b: 0.02, poids: 0.45 },
    cereale: { nom: 'Céréale', chimie: 'pyrazines, aldéhydes de Strecker', nez: 'pain, céréale, malt', a: 0.45, b: 0.05, poids: 0.5 },
    queues: { nom: 'Queues', chimie: 'acides gras, esters éthyliques lourds', nez: 'carton mouillé, savon, gras', a: 0.1, b: 0.12, poids: 1.1 },
    furfural: { nom: 'Brûlé', chimie: 'furfural, composés de pyrolyse', nez: 'amande grillée, brûlé', a: 0.05, b: 0.16, poids: 1.0 },
  };
  const CLES = Object.keys(CONGENERES);

  // Teneurs initiales (unités par LAP) déduites de la bière : profil et défauts du brassin
  function congeneresBiere(res, defauts) {
    const d = (nom) => (defauts || []).some((x) => x.toLowerCase().includes(nom));
    const p = res.profil, y = res.levure || {};
    return {
      tetes: 1 + 0.12 * p.fruite + (d('infection') ? 1.5 : 0),
      soufre: 0.4 + (y.fam === 'lager' ? 0.5 : 0) + (d('dms') ? 0.4 : 0),
      methanol: 0.15,
      esters: 0.4 + 0.12 * p.fruite + (d('infection') ? 0.3 : 0),
      terpenes: 0.09 * p.houblon,
      fusels: 0.7 + (d('alcools sup') ? 0.5 : 0) + 0.04 * Math.max(0, (res.fermEff || 18) - 20),
      cereale: 0.3 + 0.05 * p.malte + 0.06 * p.caramel + 0.08 * p.torrefie,
      queues: 1 + 0.03 * p.corps,
      furfural: 0.25 + 0.05 * p.torrefie,
    };
  }

  // --- Chaudière : état et pas de distillation ------------------------------------
  function nouvelleChaudiere(volume, degre, q, cuivre = 0.8) {
    const A = (volume * degre) / 100;
    const Q = {};
    for (const k of CLES) Q[k] = (q[k] || 0) * A * (k === 'soufre' ? 1 - cuivre : 1);
    return { V: volume, A, A0: A, V0: volume, Q, Q0: { ...Q } };
  }
  // Distille dV litres. Renvoie ce qui sort au bec : volume, alcool, congénères, degré.
  function distiller(ch, dV, n) {
    dV = Math.min(dV, ch.V * 0.98);
    if (dV <= 0 || ch.A <= 1e-6) return { V: 0, A: 0, Q: {}, degre: 0 };
    const p = (ch.A / ch.V) * 100;
    const y = Math.min(vapeur(p, n), 96);
    const dA = Math.min(ch.A, (dV * y) / 100);
    const fT = Math.exp((ebullition(p) - 85) / 3);
    const sortie = { V: dV, A: dA, Q: {}, degre: y, potDegre: p };
    for (const k of CLES) {
      const c = CONGENERES[k];
      const alpha = k === 'tetes' || k === 'soufre' ? c.a * n : c.a;
      const beta = c.b / n;
      const part = borne(alpha * (dA / ch.A) + beta * fT * (dV / ch.V), 0, 1);
      const dq = ch.Q[k] * part;
      ch.Q[k] -= dq; sortie.Q[k] = dq;
    }
    ch.V -= dV; ch.A -= dA;
    return sortie;
  }
  // Intensités olfactives au bec : multiples du seuil de perception, pondérés par la puissance odorante
  function nez(sortie) {
    if (!sortie.A) return [];
    return CLES.filter((k) => CONGENERES[k].poids > 0)
      .map((k) => ({ k, v: ((sortie.Q[k] || 0) / sortie.A / SEUILS[k]) * CONGENERES[k].poids }))
      .sort((a, b) => b.v - a.v);
  }

  // --- Première chauffe (brouillis) -------------------------------------------------
  // La bière est épuisée jusqu'à 0,3 % ; progression ∈ [0,1] = part du volume de brouillis recueilli.
  function preparerBrouillis(volumeBiere, degreBiere, q) {
    const ch = nouvelleChaudiere(volumeBiere, degreBiere, q, 0);
    const pas = [], dV = volumeBiere / 600;
    let V = 0, A = 0;
    const Q = Object.fromEntries(CLES.map((k) => [k, 0]));
    while ((ch.A / ch.V) * 100 > 0.3 && ch.V > volumeBiere * 0.2) {
      const s = distiller(ch, dV, 1.05);
      V += s.V; A += s.A; for (const k of CLES) Q[k] += s.Q[k];
      pas.push({ V, A, Q: { ...Q }, degre: s.degre });
    }
    return { pas, Vtotal: V, A0: (volumeBiere * degreBiere) / 100 };
  }
  // Résultat du brouillis selon la progression atteinte et les incidents
  function brouillis(prep, progression, incidents = {}) {
    const i = borne(Math.round(progression * (prep.pas.length - 1)), 0, prep.pas.length - 1);
    const s = prep.pas[i];
    const Q = { ...s.Q };
    if (incidents.coupDeFeu) Q.furfural += 0.35 * incidents.coupDeFeu * s.A;
    return { V: s.V, A: s.A, degre: (s.A / s.V) * 100, Q, recuperation: s.A / prep.A0, entrainement: !!incidents.moussage };
  }

  // --- Bonne chauffe (repasse) : session pas à pas avec coupes ----------------------------
  function nouvelleRepasse(charge, cuivre = 0.8) {
    const ch = { V: charge.V, A: charge.A, A0: charge.A, V0: charge.V, Q: { ...charge.Q }, Q0: { ...charge.Q } };
    for (const k of ['soufre']) ch.Q[k] *= 1 - cuivre;
    const q0 = Object.fromEntries(CLES.map((k) => [k, charge.Q[k] / Math.max(1e-6, charge.A)]));
    const vide = () => ({ V: 0, A: 0, Q: Object.fromEntries(CLES.map((k) => [k, 0])) });
    return { ch, q0, phase: 0, fractions: [vide(), vide(), vide()], courbe: [], dernier: null, coupes: [] };
  }
  function pasRepasse(r, feu, dt) {
    if (r.fini) return null;
    if (!(dt > 0)) return r.dernier;
    const n = plateaux(feu);
    // Comme les bouilleurs, on tire les têtes au goutte-à-goutte : débit réduit au début
    const debut = 1 - r.ch.A / r.ch.A0 < 0.12 ? 0.4 : 1;
    const debit = r.ch.V0 * 0.042 * Math.max(0.05, feu) * debut;
    const s = distiller(r.ch, debit * dt, n);
    const f = r.fractions[r.phase];
    f.V += s.V; f.A += s.A; for (const k of CLES) f.Q[k] += s.Q[k] || 0;
    const recup = 1 - r.ch.A / r.ch.A0;
    const sens = nez(s);
    r.dernier = { degre: s.degre, recup, nez: sens, n, s };
    if (!r.courbe.length || recup - r.courbe[r.courbe.length - 1].recup > 0.006) {
      const pt = { recup, degre: s.degre, phase: r.phase };
      for (const k of CLES) pt[k] = s.A ? (s.Q[k] || 0) / s.A / SEUILS[k] : 0;
      r.courbe.push(pt);
    }
    if (s.degre < 8 || r.ch.A < r.ch.A0 * 0.002) r.fini = true;
    return r.dernier;
  }
  function couper(r) {
    if (r.phase < 2) { r.coupes.push({ recup: 1 - r.ch.A / r.ch.A0, degre: r.dernier ? r.dernier.degre : null }); r.phase++; }
  }

  // Simulation complète sans gestes (mode expert calculé) : coupe têtes à x % de l'alcool,
  // coupe queues quand le degré au bec passe sous le seuil
  function repasseAuto(charge, reglages, cuivre = 0.8) {
    const r = nouvelleRepasse(charge, cuivre);
    let garde = 0;
    while (!r.fini && garde++ < 20000) {
      pasRepasse(r, reglages.feu, 0.05);
      const recup = 1 - r.ch.A / r.ch.A0;
      if (r.phase === 0 && recup >= reglages.tetesPct / 100) couper(r);
      else if (r.phase === 1 && r.dernier.degre < reglages.queuesDegre) couper(r);
    }
    return r;
  }

  // --- Composition et notation de l'eau-de-vie -------------------------------------
  // Seuils de perception (unités par LAP) : la composition s'exprime en multiples de ces seuils
  const SEUILS = { tetes: 0.08, soufre: 0.12, methanol: 1, esters: 0.5, terpenes: 0.3, fusels: 0.7, cereale: 0.25, queues: 0.28, furfural: 0.3 };
  function composition(fr) {
    const c = {};
    for (const k of CLES) c[k] = fr.A > 0 ? fr.Q[k] / fr.A / SEUILS[k] : 0;
    c.degre = fr.V > 0 ? (fr.A / fr.V) * 100 : 0;
    return c;
  }
  const DEFAUTS_EDV = {
    tetes: { nom: 'Têtes mal coupées', en: 'heads', chimie: "L'acétaldéhyde (éb. 20 °C) et l'acétate d'éthyle (éb. 77 °C) sortent en premier. Laissés dans le cœur, ils donnent la colle, le vernis et le mal de tête.", conseil: 'Coupe les têtes plus tard, quand le nez passe au fruit propre.' },
    soufre: { nom: 'Notes soufrées', en: 'sulfur', chimie: "Les composés soufrés de la levure sortent tôt. Le cuivre de l'alambic en piège une partie sous forme de sulfures de cuivre.", conseil: 'Coupe un peu plus tard ou chauffe plus doucement pour laisser le cuivre travailler.' },
    queues: { nom: 'Queues dans le cœur', en: 'feints', chimie: "Les acides gras et les esters lourds sortent avec l'eau quand la chaudière s'appauvrit : carton mouillé, savon, gras. Ils troublent l'eau-de-vie à la réduction.", conseil: 'Coupe les queues plus tôt, vers 60–65 % au bec.' },
    brule: { nom: 'Goût de brûlé', en: 'scorched', chimie: "Un feu trop vif sur une bière chargée de levure et de protéines caramélise le fond de la chaudière : furfural et pyrolyse.", conseil: 'Chauffe plus doucement pendant la première chauffe.' },
    chaleur: { nom: 'Eau-de-vie brûlante', en: 'hot', chimie: "Trop d'alcools supérieurs : ils viennent de la bière (fermentation chaude) et de la fin du cœur.", conseil: 'Fermente plus frais au brassage, ou ferme le cœur plus tôt.' },
    entrainement: { nom: 'Bière entraînée', en: 'puking', chimie: "La bière a moussé jusque dans le col de cygne : de la bière liquide est passée dans le brouillis. Goût de bière cuite, amertume, trouble.", conseil: 'Chauffe doucement au début de la première chauffe : la bière mousse (protéines et CO₂).' },
    plate: { nom: 'Eau-de-vie plate', en: 'neutral', chimie: "Un cœur très serré élimine presque tous les congénères : propre mais sans caractère.", conseil: "Élargis un peu le cœur : le caractère se trouve entre les têtes et les queues." },
    trouble: { nom: 'Trouble à la réduction', en: 'louching', chimie: "Les esters gras, solubles dans l'alcool fort, précipitent quand on réduit à 40 % : l'eau-de-vie louche.", conseil: 'Ferme le cœur avant que le degré au bec ne descende sous 55 %.' },
  };
  function defaut(id, gravite, detail) { return { id, gravite, detail, ...DEFAUTS_EDV[id] }; }

  // jeu : { mode, scoreFeu (0–1, débutant), entrainement, aveugle }
  function noterEDV(r, jeu = {}) {
    const coeur = r.fractions[1];
    if (!coeur.A) return null;
    const c = composition(coeur);
    const fr = (v) => v.toFixed(1).replace('.', ',');
    const def = [];
    const grav = (v, a, b, d) => (v > d ? 3 : v > b ? 2 : v > a ? 1 : 0);
    const ajoute = (id, g, detail) => { if (g) def.push(defaut(id, g, detail)); };
    ajoute('tetes', grav(c.tetes, 1, 2.5, 6), `Têtes à ${fr(c.tetes)} fois leur seuil de perception.`);
    ajoute('soufre', grav(c.soufre, 1, 2.5, 6), `Soufre à ${fr(c.soufre)} fois son seuil.`);
    ajoute('queues', grav(c.queues, 1.2, 2, 3.5), `Queues à ${fr(c.queues)} fois leur seuil.`);
    ajoute('brule', grav(c.furfural, 1.2, 2.2, 4), null);
    ajoute('chaleur', grav(c.fusels, 1.25, 1.6, 2.2), null);
    if (jeu.entrainement) def.push(defaut('entrainement', 2, null));
    ajoute('trouble', c.degre < 56 ? 2 : c.degre < 60 ? 1 : 0, `Cœur à ${fr(c.degre)} % en moyenne.`);
    // Caractère : esters, terpènes du houblon, notes de céréale
    const caractere = 0.4 * Math.min(c.esters, 3) + 0.4 * Math.min(c.terpenes, 3) + 0.3 * Math.min(c.cereale, 3);
    ajoute('plate', caractere < 0.6 ? 2 : caractere < 0.9 ? 1 : 0, null);
    const g = (ids) => def.filter((d) => ids.includes(d.id)).reduce((s, d) => s + d.gravite, 0);
    const car = borne(caractere / 2, 0, 1);
    const rondeur = borne((c.cereale + c.fusels) / 1.8, 0, 1);
    const longueur = borne(c.queues / 0.8, 0, 1);
    let malus = 0;
    if (jeu.mode === 'debutant' && jeu.scoreFeu != null) malus = 1 - jeu.scoreFeu;
    const L = {
      aspect: borne(5 - 2 * g(['trouble', 'entrainement']), 0, 5),
      nez: borne(15 * (0.4 + 0.6 * car) - 2 * g(['tetes', 'soufre', 'queues', 'entrainement', 'plate']), 0, 15),
      bouche: borne(15 * (0.45 + 0.35 * car + 0.2 * rondeur) - 1.8 * g(['chaleur', 'queues', 'tetes', 'entrainement']) - 3 * malus, 0, 15),
      finale: borne(10 * (0.5 + 0.25 * car + 0.25 * longueur) - 1.5 * g(['brule', 'queues', 'chaleur']), 0, 10),
      harmonie: borne(5 * (0.4 + 0.6 * car) - 0.6 * def.reduce((s, d) => s + d.gravite, 0) - 2 * malus, 0, 5),
    };
    for (const k in L) L[k] = Math.round(L[k] * 2) / 2;
    const total = Object.values(L).reduce((a, b) => a + b, 0);
    // Il faut au moins 2 litres de cœur pour présenter l'eau-de-vie au jury
    const presentable = coeur.V >= 2;
    const medaille = !presentable ? null : total >= 45 ? 'or' : total >= 38 ? 'argent' : total >= 30 ? 'bronze' : null;
    const profil = {
      fruite: borne(c.esters * 2.5, 0, 10), houblon: borne(c.terpenes * 3, 0, 10), cereale: borne(c.cereale * 3, 0, 10),
      chaleur: borne(c.fusels * 4, 0, 10), solvant: borne(c.tetes * 2, 0, 10), soufre: borne(c.soufre * 2, 0, 10),
      gras: borne(c.queues * 3, 0, 10), brule: borne(c.furfural * 3, 0, 10),
    };
    return { lignes: L, total, medaille, defauts: def, composition: c, caractere: car, profil, malus, presentable };
  }

  // Bilan des volumes et de l'alcool
  function bilan(r) {
    const [t, c, q] = r.fractions;
    const lap = (f) => f.A;
    return {
      tetes: { V: t.V, lap: lap(t), degre: t.V ? (t.A / t.V) * 100 : 0 },
      coeur: { V: c.V, lap: lap(c), degre: c.V ? (c.A / c.V) * 100 : 0 },
      queues: { V: q.V, lap: lap(q), degre: q.V ? (q.A / q.V) * 100 : 0 },
      restant: r.ch.A, charge: r.ch.A0,
    };
  }

  // Une fraction présentée à l'aveugle : ses deux odeurs dominantes
  function descripteurs(fr) {
    const c = composition(fr);
    return CLES.filter((k) => CONGENERES[k].poids > 0)
      .map((k) => ({ k, v: c[k] * CONGENERES[k].poids }))
      .filter((x) => x.v >= 0.5).sort((a, b) => b.v - a.v).slice(0, 3)
      .map((x) => ({ odeur: CONGENERES[x.k].nez.split(', ')[0], force: x.v > 4 ? 'fort' : x.v > 1.5 ? 'net' : 'léger' }));
  }

  const api = {
    VLE, SEUILS, vapeur, ebullition, plateaux, CONGENERES, CLES, congeneresBiere, nouvelleChaudiere, distiller, nez,
    preparerBrouillis, brouillis, nouvelleRepasse, pasRepasse, couper, repasseAuto, composition, noterEDV, bilan, descripteurs, DEFAUTS_EDV,
  };
  racine.Distillerie = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
