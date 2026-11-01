/* Ignem custodimus — interface du jeu (V0.1 : brasserie) */
(function () {
  'use strict';
  const D = window.DONNEES_JEU;
  const IDX = Moteur.init(D);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const esc = (t) => String(t ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const nf = (v, d = 1) => Number(v).toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const sg = (v) => v.toFixed(3).replace('.', ',');
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const reduit = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // Sauvegarde (sur le téléphone)
  // =====================================================================
  const CLE = 'ignem.v1';
  const recetteVide = () => ({ volume: 1000, rendement: 0.75, malts: [], houblons: [], levure: null, eau: 'causse', palier: 66, ebullition: 60, fermentation: { temp: 19, reposDiacetyle: false },
    aromates: [], sels: {}, auxiliaires: [], cuisson: false, destination: 'biere' });
  const etatDefaut = () => ({ mode: 'debutant', aide: true, son: true, gestesExpert: false, bac: false, tuto: 0, tutoD: 0, points: 0, succes: {}, carnet: [], brassins: 0, recette: recetteVide(), epaisses: null, reglagesD: null,
    possede: null, ecus: 30, decouvertes: {}, quiz: null, grimoire: [] });
  let S = (() => { try { const j = JSON.parse(localStorage.getItem(CLE) || 'null'); return j ? { ...etatDefaut(), ...j } : etatDefaut(); } catch (e) { return etatDefaut(); } })();
  // Sauvegardes d'avant la V0.3 : tout ce qui était débloqué par palier devient possédé, et les points donnent des écus
  if (!Array.isArray(S.possede)) {
    const ancien = [0, 60, 140, 240, 360, 500].filter((p) => S.points >= p).length - 1;
    S.possede = [...D.malts, ...D.houblons, ...D.levures.filter((y) => y.fam !== 'distilling')].filter((x) => x.palier > 0 && x.palier <= ancien).map((x) => x.id);
    if (S.points > 0) S.ecus = 30 + Math.round(S.points / 2);
  }
  const POSSEDE = new Set(S.possede);
  const posseder = (id) => { if (!POSSEDE.has(id)) { POSSEDE.add(id); S.possede.push(id); } };
  const normaliser = (r) => Object.assign(recetteVide(), r, { fermentation: { ...recetteVide().fermentation, ...(r && r.fermentation) } });
  let R = S.recette = normaliser(S.recette);
  let minuterieSauve = null;
  function sauver() { clearTimeout(minuterieSauve); minuterieSauve = setTimeout(() => { try { S.recette = R; localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) { /* stockage indisponible */ } }, 250); }

  // =====================================================================
  // Progression
  // =====================================================================
  // Niveaux de maîtrise : chacun ouvre une rareté de plus au catalogue du pigeonnier
  const PALIERS = [
    { pts: 0, txt: 'les ingrédients courants (★) au catalogue' },
    { pts: 60, txt: 'les ingrédients ★★ : malts torréfiés, grains crus, levures lager, houblons allemands, fruits, nutriments' },
    { pts: 140, txt: 'les ingrédients ★★★ : houblons américains, levures belges, enzymes, botaniques et bois' },
    { pts: 240, txt: 'les ingrédients ★★★★ : houblons du Pacifique' },
    { pts: 360, txt: 'les ingrédients ★★★★★ : levures sauvages, Brettanomyces et lactobacilles' },
    { pts: 500, txt: 'le titre de maître du domaine' },
  ];
  const palierAtteint = () => (S.bac ? 5 : PALIERS.filter((p) => S.points >= p.pts).length - 1);
  const niveau = () => (S.points >= 360 ? 'Maître brasseur' : S.points >= 140 ? 'Compagnon brasseur' : 'Apprenti brasseur');
  const dispo = (x) => S.bac || !x.palier || POSSEDE.has(x.id);
  const achetable = (x) => (x.palier || 0) <= palierAtteint() + 1;
  const prixDe = (x, cat) => (cat === 'grimoire' ? 10 : D.prix[x.palier || 0]);

  const SUCCES = [
    { id: 'premier', nom: 'Premier brassin', desc: "Mener un brassin jusqu'à la dégustation." },
    { id: 'podium', nom: 'Sur le podium', desc: 'Décrocher une première médaille.' },
    { id: 'or', nom: "Médaille d'or", desc: '45 points ou plus au jury.' },
    { id: 'palier', nom: 'Maître du palier', desc: "95 % du temps dans la zone à l'empâtage." },
    { id: 'houblon', nom: 'Houblonnage chirurgical', desc: "Tous les houblons jetés à une minute près." },
    { id: 'ferm', nom: 'Cuve tenue', desc: '95 % du temps dans la bande de fermentation.' },
    { id: 'net', nom: 'Zéro défaut', desc: 'Une médaille sans aucun défaut.' },
    { id: 'noir', nom: 'Plus noir que la nuit', desc: 'Un stout ou un porter médaillé.' },
    { id: 'pils', nom: 'Pils de concours', desc: 'Une pils à 40 points ou plus.' },
    { id: 'cinq', nom: 'Cinq styles', desc: 'Cinq styles différents médaillés.' },
    { id: 'abeilles', nom: "Les abeilles s'en mêlent", desc: 'Un braggot médaillé, au miel du domaine.' },
    { id: 'sansfilet', nom: 'Sans filet', desc: "Une médaille avec l'aide de Lise coupée." },
    { id: 'expert', nom: "Tête de l'art", desc: 'Une médaille en mode expert.' },
    { id: 'goutte', nom: 'Première goutte', desc: 'Distiller une première eau-de-vie avec Ulysse.' },
    { id: 'nez', nom: 'Nez de bouilleur', desc: "Reconnaître les trois fractions à l'aveugle." },
    { id: 'chauffe', nom: 'Feu tenu', desc: 'Un brouillis sans moussage ni coup de feu.' },
    { id: 'coeurnet', nom: 'Cœur net', desc: 'Une eau-de-vie médaillée sans aucun défaut.' },
    { id: 'econome', nom: 'Rien ne se perd', desc: "70 % de l'alcool de la bière en cœur, et une médaille." },
    { id: 'bouilleur', nom: "L'or d'Ulysse", desc: "Une eau-de-vie médaillée d'or." },
  ];

  // =====================================================================
  // Sons 8 bits (WebAudio, après un premier geste)
  // =====================================================================
  let AC = null;
  function son(type) {
    if (!S.son) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = AC.currentTime;
      const note = (f, d, debut = 0, forme = 'square', vol = 0.06, f2) => {
        const o = AC.createOscillator(), g = AC.createGain();
        o.type = forme; o.frequency.setValueAtTime(f, t0 + debut);
        if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + debut + d);
        g.gain.setValueAtTime(vol, t0 + debut); g.gain.exponentialRampToValueAtTime(0.0001, t0 + debut + d);
        o.connect(g).connect(AC.destination); o.start(t0 + debut); o.stop(t0 + debut + d + 0.02);
      };
      ({
        sac: () => note(110, 0.12, 0, 'square', 0.08, 50),
        clic: () => note(660, 0.04, 0, 'square', 0.03),
        bulle: () => note(320, 0.08, 0, 'sine', 0.08, 760),
        ok: () => { note(523, 0.08); note(784, 0.12, 0.08); },
        rate: () => note(220, 0.25, 0, 'square', 0.05, 110),
        medaille: () => [523, 659, 784, 1046].forEach((f, i) => note(f, 0.14, i * 0.1, 'square', 0.05)),
      }[type] || (() => {}))();
    } catch (e) { /* audio indisponible */ }
  }

  // =====================================================================
  // Sprites pixel
  // =====================================================================
  function sprite(lignes, palette, echelle = 1) {
    const h = lignes.length, w = Math.max(...lignes.map((l) => l.length));
    const c = document.createElement('canvas'); c.width = w * echelle; c.height = h * echelle;
    const x = c.getContext('2d');
    lignes.forEach((l, j) => [...l].forEach((ch, i) => { if (palette[ch]) { x.fillStyle = palette[ch]; x.fillRect(i * echelle, j * echelle, echelle, echelle); } }));
    return c.toDataURL();
  }
  const SPR = {
    sac: sprite([
      '....kkkk....', '...kttttk...', '....kttk....', '...kssssk...', '..kssssssk..', '.kssssssssk.', '.ksSsssssSk.',
      '.ksllllllsk.', '.ksllllllsk.', '.ksllllllsk.', '.ksssssssSk.', '.kSsssssSSk.', '..kkkkkkkk..', '............'],
      { k: '#2a1d14', t: '#8a5a2b', s: '#c9a26b', S: '#a8824f', l: '#efe2c4' }),
    cone: sprite([
      '.....gg.....', '....gGG.....', '...GGgGG....', '..GgGGgGG...', '..GGgGGgG...', '.GgGGgGGgG..', '.GGgGGgGGg..',
      '..GgGGgGG...', '..GGgGGgG...', '...GgGGg....', '....GGg.....', '.....g......', '............', '............'],
      { G: '#9cc95e', g: '#5c8a33' }),
    sachet: sprite([
      '............', '.kkkkkkkkkk.', '.kffffffffk.', '.kfwwwwwwfk.', '.kfwyyyywfk.', '.kfwyyyywfk.', '.kfwwwwwwfk.',
      '.kffffffffk.', '.kfFfFfFffk.', '.kffffffffk.', '.kkkkkkkkkk.', '............', '............', '............'],
      { k: '#2a1d14', f: '#b9b2a6', F: '#8f887c', w: '#efe2c4', y: '#f3b04a' }),
    goutte: sprite([
      '.....bb.....', '....bbbb....', '....bbbb....', '...bbBbbb...', '..bbBbbbbb..', '..bbBbbbbb..', '..bbbbbbbb..',
      '..bbbbbbbd..', '...bbbbdd...', '....dddd....', '............', '............', '............', '............'],
      { b: '#7fb6d6', B: '#d6ecf5', d: '#4b7fa0' }),
    feu: sprite([
      '...r....', '..ry....', '..ryr...', '.rryyr..', '.ryyyr.r', 'rryYyyrr', 'ryYYYyyr', 'ryYwYYyr', 'ryYwwYyr', '.ryYYyr.'],
      { r: '#d2502e', y: '#f3b04a', Y: '#f8d66a', w: '#fff3c4' }),
    lise: sprite([
      '....hhhhhh......', '...hhhhhhhh.....', '..hhhhhhhhhhH...', '..hhssssssshHH..', '.hhsssssssssh...', '.hssEssssEsshh..',
      '.hsssssssssh....', '..ssssnssss.....', '..sssmmmsss.....', '...sssssss......', '....ccccc.......', '..ccwwwwwcc.....',
      '.cwwaaaaawwc....', '.wwaaaaaaaww....', '.wwaaaaaaaww....', '.wwaaaaaaaww....'],
      { h: '#6b3b22', H: '#8a5030', s: '#e8b48a', E: '#2a1a10', n: '#c98a66', m: '#a04a3a', c: '#d27b3e', w: '#ecdfc4', a: '#4f6b3a' }, 3),
  };
  SPR.bocal = sprite([
    '............', '...kkkkkk...', '...cccccc...', '..kkkkkkkk..', '..kggggggk..', '..kgwwwwgk..', '..kgwrrwgk..',
    '..kgwrrwgk..', '..kgwwwwgk..', '..kggggggk..', '..kkkkkkkk..', '............', '............', '............'],
    { k: '#2a1d14', c: '#d27b3e', g: '#8fb4a8', w: '#efe2c4', r: '#c0642a' });
  SPR.firmin = sprite([
    '...bbbbbbbb.....', '..bbbbbbbbbbb...', '.bbbbbbbbbbbbb..', '..gsssssssssg...', '..sssssssssss...', '..ssEsssssEss...',
    '..sssssssssss...', '..sssssnsssss...', '..smmmmmmmmms...', '...sssssssss....', '....ssssss......', '..vvvvccvvvv....',
    '.vvvvvccvvvvv...', '.vvvvvvvvvvvv...', '.vvvvvvvvvvvv...', '.vvvvvvvvvvvv...'],
    { b: '#2a2a3a', g: '#c9c2b4', s: '#d9a07a', E: '#2a1a10', n: '#b9785a', m: '#ecdfc4', c: '#d27b3e', v: '#5a4632' }, 3);
  $('#marque-feu').src = SPR.feu;
  $('#mentor-portrait').src = SPR.lise;
  const couleur = (ebc) => `rgb(${Moteur.couleurRVB(ebc).join(',')})`;

  // =====================================================================
  // Navigation
  // =====================================================================
  let ecran = 'domaine';
  const quitteurs = {};
  function aller(nom) {
    if (quitteurs[ecran]) quitteurs[ecran]();
    ecran = nom;
    $$('.ecran').forEach((s) => { s.hidden = s.id !== 'ecran-' + nom; });
    $$('.entete-nav button').forEach((b) => b.setAttribute('aria-current', b.dataset.aller === nom ? 'page' : 'false'));
    $('#scene').scrollTop = 0;
    ({ domaine: entrerDomaine, brasserie: entrerBrasserie, distillerie: entrerDistillerie, catalogue: rendreCatalogue, veillee: rendreVeillee, carnet: rendreCarnet, fiches: rendreFiches, reglages: rendreReglages }[nom] || (() => {}))();
    tuto('ecran:' + nom);
    majMentor();
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-aller]');
    if (b) { son('clic'); aller(b.dataset.aller); }
    const f = e.target.closest('[data-fiche]');
    if (f) { e.preventDefault(); ouvrirFiche(f.dataset.fiche); }
  });
  function majEntete() {
    $('#entete-niveau').innerHTML = `<b>${niveau()}</b>${S.points} pts · <span style="color:var(--or)">${S.ecus} écus</span>${S.bac ? ' · bac à sable' : ''}`;
  }
  function toast(txt) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = txt;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3300);
  }

  // =====================================================================
  // Mentor et tutoriel
  // =====================================================================
  const TUTO = [
    { ecran: 'domaine', txt: "Bienvenue au Domaine des Braises. Je suis Lise : formée en Belgique, revenue au pays garder le feu. Touche la brasserie pour commencer.", attendre: 'ecran:brasserie' },
    { ecran: 'brasserie', txt: "Voici la cuve : 1000 litres, l'échelle du domaine. Fais glisser un sac de Pilsner Soufflet Bio dans la cuve, ou touche son bouton +25 kg.", attendre: 'malt' },
    { ecran: 'brasserie', txt: "Le malt apporte l'amidon que l'empâtage changera en sucres. Regarde la densité monter : vise environ 1,045, soit à peu près 200 kg de malt.", attendre: 'og' },
    { ecran: 'brasserie', txt: "Place à l'amertume. Onglet Houblons : ajoute du Magnum. Je le mets à 60 minutes d'ébullition, le temps que ses acides alpha s'isomérisent.", attendre: 'houblon' },
    { ecran: 'brasserie', txt: "Il faut une levure. Onglet Levure : la Safale US-05 est neutre et pardonne beaucoup, parfaite pour débuter.", attendre: 'levure' },
    { ecran: 'brasserie', txt: "Au-dessus des onglets, je t'indique le style le plus proche. Touche-le pour comparer tes chiffres aux plages du style. Quand tu es prêt, lance le brassin.", attendre: 'lancer' },
    { ecran: 'empatage', txt: "Maintiens la vapeur par petites pressions pour rester dans la zone verte. Vers 62–65 °C, la β-amylase libère du maltose fermentescible. Vers 68–72 °C, l'α-amylase laisse des dextrines qui donnent du corps.", attendre: 'fin:empatage' },
    { ecran: 'ebullition', txt: "Jette chaque houblon quand le curseur passe sur son repère. Plus il bout longtemps, plus il amérise. Plus il arrive tard, plus il garde ses huiles aromatiques.", attendre: 'fin:ebullition' },
    { ecran: 'fermentation', txt: "La fermentation chauffe, surtout les jours 2 et 3. Règle la vanne pour rester dans la bande de ta levure : vers la gauche, le glycol refroidit.", attendre: 'fin:fermentation' },
    { ecran: 'degustation', txt: "Le jury a goûté. La fiche suit le barème des concours : aspect, arôme, bouche, saveur, impression. Les Fiches expliquent la chimie derrière chaque note. À toi de jouer.", attendre: null },
  ];
  const TUTO_D = [
    { ecran: 'distillerie', txt: "Firmin. Quarante ans à tirer Ulysse de ferme en ferme dans le Quercy. Lise fait la bière, moi je la fais monter en degré. Choisis une de tes bières.", attendre: 'choix-biere' },
    { ecran: 'distillerie', txt: "Les têtes et les queues qu'on écarte s'appellent les épaisses. On peut les repasser à la chauffe suivante : on gagne de l'alcool. Lance quand tu veux.", attendre: 'lancer-d' },
    { ecran: 'brouillis', txt: "Première chauffe, le brouillis : on épuise la bière pour en tirer un alcool à 20–30 %. La bière mousse, protéines et CO₂ : chauffe doucement au début, puis nourris le feu.", attendre: 'fin:brouillis' },
    { ecran: 'repasse', txt: "La bonne chauffe. Les têtes sortent d'abord : colle, pomme verte. Coupe quand ça sent le fruit propre. Plus tard, quand ça sent le carton mouillé et que le degré tombe, coupe les queues.", attendre: 'fin:repasse' },
    { ecran: 'aveugle', txt: "Trois verres, trois fractions. Un bouilleur se fie à son nez avant son alcoomètre.", attendre: 'fin:aveugle' },
    { ecran: 'degustation', txt: "Voilà ton eau-de-vie de bière. Elle est blanche : le chai et ses fûts viendront plus tard. Les fiches Distillation et Coupes t'expliquent la chimie.", attendre: null },
  ];
  function tuto(evt) {
    if (S.tuto >= 0 && S.tuto < TUTO.length && TUTO[S.tuto].attendre === evt) { S.tuto++; if (S.tuto >= TUTO.length) S.tuto = -1; sauver(); majMentor(); }
    if (S.tutoD >= 0 && S.tutoD < TUTO_D.length && TUTO_D[S.tutoD].attendre === evt) { S.tutoD++; if (S.tutoD >= TUTO_D.length) S.tutoD = -1; sauver(); majMentor(); }
  }
  const ECRANS_FIRMIN = ['distillerie', 'brouillis', 'repasse', 'aveugle'];
  const avecFirmin = () => ECRANS_FIRMIN.includes(ecran) || (ecran === 'degustation' && dernier && (dernier.type === 'edv' || dernier.type === 'wash'));
  let messageMentor = null;
  function direLise(txt, actions) { messageMentor = { txt, actions: actions || [] }; majMentor(); }
  function majMentor() {
    const m = $('#mentor');
    let txt = null, actions = [];
    const firmin = avecFirmin();
    $('#mentor-nom').textContent = firmin ? 'Firmin' : 'Lise';
    $('#mentor-role').textContent = firmin ? 'bouilleur ambulant' : 'maître brasseuse';
    $('#mentor-portrait').src = firmin ? SPR.firmin : SPR.lise;
    if (firmin && S.tutoD >= 0 && S.tutoD < TUTO_D.length && TUTO_D[S.tutoD].ecran === ecran) {
      const etape = TUTO_D[S.tutoD];
      txt = etape.txt;
      actions = etape.attendre ? [{ lib: 'Passer le tutoriel', sobre: true, f: () => { S.tutoD = -1; sauver(); majMentor(); } }]
        : [{ lib: 'Merci Firmin', f: () => { S.tutoD = -1; sauver(); majMentor(); } }];
    } else if (!firmin && S.tuto >= 0 && S.tuto < TUTO.length && TUTO[S.tuto].ecran === ecran) {
      const etape = TUTO[S.tuto];
      txt = etape.txt;
      actions = etape.attendre ? [{ lib: 'Passer le tutoriel', sobre: true, f: () => { S.tuto = -1; sauver(); majMentor(); } }]
        : [{ lib: 'Merci Lise', f: () => { S.tuto = -1; sauver(); majMentor(); } }];
    } else if (messageMentor) {
      txt = messageMentor.txt;
      actions = messageMentor.actions.concat([{ lib: 'Fermer', sobre: true, f: () => { messageMentor = null; majMentor(); } }]);
    }
    if (!txt) { m.hidden = true; document.documentElement.style.setProperty('--pied-mentor', '0px'); return; }
    $('#mentor-texte').textContent = txt;
    const zone = $('#mentor-actions'); zone.innerHTML = '';
    actions.forEach((a) => { const b = document.createElement('button'); b.className = 'btn ' + (a.sobre ? 'btn-sobre' : 'btn-feu'); b.textContent = a.lib; b.onclick = a.f; zone.appendChild(b); });
    m.hidden = false;
    requestAnimationFrame(() => document.documentElement.style.setProperty('--pied-mentor', m.offsetHeight + 'px'));
  }

  // =====================================================================
  // Domaine : carte pixel animée
  // =====================================================================
  const LIEUX = [
    { id: 'brasserie', nom: 'Brasserie', r: [14, 108, 80, 76], ouvert: true },
    { id: 'chai', nom: 'Chai', r: [108, 120, 70, 54], msg: "Le chai ouvrira avec la distillerie : chêne neuf, ex-bourbon, ex-sherry, ex-tourbé, Cahors, armagnac. On y rangera les fûts façon casse-tête." },
    { id: 'distillerie', nom: 'Alambic Ulysse', r: [118, 178, 60, 32], ouvert: true },
    { id: 'catalogue', nom: 'Pigeonnier', r: [92, 96, 22, 44], ouvert: true },
    { id: 'comptoir', nom: 'Comptoir', r: [22, 200, 58, 38], msg: "Le comptoir de vente à la ferme ouvrira plus tard : les visiteurs viendront avec leurs goûts, à toi de conseiller la bonne bouteille." },
    { id: 'rucher', nom: 'Rucher', r: [130, 94, 58, 22], msg: "Le rucher viendra en extension. Le miel du domaine est déjà dans la brasserie : essaie un braggot." },
  ];
  function saisonCourante() {
    const m = new Date().getMonth();
    return m >= 2 && m <= 4 ? 'printemps' : m >= 5 && m <= 7 ? 'été' : m >= 8 && m <= 10 ? 'automne' : 'hiver';
  }
  const SAISONS = {
    printemps: { herbe: '#7aa84a', herbe2: '#5f8c3a', feuille: ['#5f9a3a', '#7cb850', '#3f7029'], fleur: '#f2d0de', colline: '#6d8a4a' },
    été: { herbe: '#b4a04a', herbe2: '#97843a', feuille: ['#4f7a2e', '#6a9440', '#355a20'], fleur: '#f3e07a', colline: '#8f8a4a' },
    automne: { herbe: '#8a8a42', herbe2: '#6f6f34', feuille: ['#c0642a', '#d98a32', '#8a4a22'], fleur: null, colline: '#7a6a3a' },
    hiver: { herbe: '#8a8f72', herbe2: '#70755c', feuille: null, fleur: null, colline: '#6f7468' },
  };
  function alea(n) { let s = n; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  let animCarte = null;
  function entrerDomaine() {
    const saison = saisonCourante();
    $('#saison').textContent = saison[0].toUpperCase() + saison.slice(1);
    const z = $('#lieux'); z.innerHTML = '';
    for (const l of LIEUX) {
      const b = document.createElement('button');
      b.className = 'lieu ' + (l.ouvert ? 'ouvert' : 'ferme');
      Object.assign(b.style, { left: (l.r[0] / 192) * 100 + '%', top: (l.r[1] / 256) * 100 + '%', width: (l.r[2] / 192) * 100 + '%', height: (l.r[3] / 256) * 100 + '%' });
      b.innerHTML = `<span>${esc(l.nom)}</span>`;
      b.setAttribute('aria-label', l.nom + (l.ouvert ? '' : ', bientôt'));
      b.onclick = () => { son('clic'); if (l.ouvert) aller(l.id); else direLise(l.msg); };
      z.appendChild(b);
    }
    const ctx = $('#carte').getContext('2d');
    const t0 = performance.now();
    cancelAnimationFrame(animCarte);
    const boucle = (ts) => { dessinerDomaine(ctx, (ts - t0) / 1000, saison); if (!reduit && ecran === 'domaine') animCarte = requestAnimationFrame(boucle); };
    animCarte = requestAnimationFrame(boucle);
  }
  quitteurs.domaine = () => cancelAnimationFrame(animCarte);

  function dessinerDomaine(c, t, saison) {
    const P = SAISONS[saison], W = 192, H = 256;
    const heure = new Date().getHours(), nuit = heure >= 21 || heure < 7;
    const px = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
    const disque = (cx, cy, r, col) => { c.fillStyle = col; for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1); } };
    // Ciel en bandes tramées
    const ciel = nuit ? ['#0f1630', '#141c3a', '#1a2446', '#222c52', '#2a335a', '#343a5e'] : ['#6aa6d4', '#7db3db', '#92c0e1', '#a8cde6', '#bfd9ea', '#d6e4ea'];
    ciel.forEach((col, i) => { px(0, i * 16, W, 16, col); if (i < ciel.length - 1) for (let x = (i % 2); x < W; x += 2) px(x, i * 16 + 15, 1, 1, ciel[i + 1]); });
    const r = alea(7);
    if (nuit) { for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * 80; if (Math.sin(t * 2 + i) > -0.6) px(x, y, 1, 1, '#f3ecd0'); } disque(152, 24, 7, '#efe6c4'); disque(155, 22, 6, ciel[1]); }
    else { disque(150, 26, 9, '#fff2b0'); disque(150, 26, 7, '#fff8d6'); }
    for (let i = 0; i < 3; i++) { const x = ((i * 70 + t * 3) % (W + 40)) - 30, y = 14 + i * 14; px(x, y, 22, 4, nuit ? '#2c3558' : '#f4f6f6'); px(x + 4, y - 3, 12, 3, nuit ? '#2c3558' : '#f4f6f6'); }
    // Collines du causse
    for (let x = 0; x < W; x++) {
      const y1 = 80 + 6 * Math.sin(x / 23) + 4 * Math.sin(x / 9 + 1);
      px(x, y1, 1, 40, nuit ? '#2a3448' : '#8ea3a6');
      const y2 = 94 + 5 * Math.sin(x / 17 + 2) + 3 * Math.sin(x / 6);
      px(x, y2, 1, 30, nuit ? '#27301f' : P.colline);
    }
    px(0, 108, W, H - 108, nuit ? '#1f2a18' : P.herbe);
    const r2 = alea(11);
    for (let i = 0; i < 260; i++) px(r2() * W, 108 + r2() * (H - 108), 2, 1, nuit ? '#18210f' : P.herbe2);
    // Chênaie
    const arbre = (x, y, s) => {
      px(x - 1, y, 3, 6 + s, nuit ? '#2a1d14' : '#5a3a22');
      if (!P.feuille) { px(x - 4, y - 3, 1, 4, '#5a3a22'); px(x + 3, y - 4, 1, 5, '#5a3a22'); px(x - 3, y - 4, 7, 1, '#5a3a22'); return; }
      const [a, b, d] = nuit ? ['#26381e', '#2e4424', '#1c2a16'] : P.feuille;
      disque(x, y - 3, 5 + s, d); disque(x - 1, y - 4, 4 + s, a); disque(x - 2, y - 6, 2 + Math.floor(s / 2), b);
      if (P.fleur && !nuit) { px(x - 2, y - 6, 1, 1, P.fleur); px(x + 2, y - 3, 1, 1, P.fleur); }
    };
    [[6, 98, 2], [18, 96, 3], [30, 100, 2], [44, 97, 1], [60, 101, 1], [86, 99, 1], [178, 99, 2], [188, 96, 3], [8, 196, 2], [12, 226, 3], [184, 230, 2], [96, 240, 1]].forEach(([x, y, s]) => arbre(x, y, s));
    // Chemin
    for (let i = 0; i <= 60; i++) {
      const u = i / 60, x = (1 - u) ** 2 * 100 + 2 * (1 - u) * u * 70 + u * u * 54, y = (1 - u) ** 2 * 256 + 2 * (1 - u) * u * 210 + u * u * 184;
      px(x - 3, y, 7, 3, nuit ? '#3b3528' : '#cdb48a');
    }
    for (let i = 0; i <= 30; i++) { const u = i / 30; px(80 + u * 60, 196 - u * 32, 5, 3, nuit ? '#3b3528' : '#cdb48a'); }
    // Bâtiments en pierre du Quercy
    const pierre = nuit ? '#6b604c' : '#d9c7a0', joint = nuit ? '#544a3a' : '#b8a27a', tuile = nuit ? '#5a3424' : '#a95c36', tuile2 = nuit ? '#47281c' : '#8a4628';
    const fenetre = (x, y) => { px(x - 1, y - 1, 10, 10, joint); px(x, y, 8, 8, nuit ? '#f3c45a' : '#3a2c22'); px(x + 3, y, 2, 8, joint); };
    const mur = (x, y, w, h) => { px(x, y, w, h, pierre); for (let j = 3; j < h; j += 5) for (let i = (j % 10 === 3 ? 0 : 4); i < w; i += 8) px(x + i, y + j, 5, 1, joint); };
    const toit = (x1, x2, y, haut, retrait) => { for (let j = 0; j < haut; j++) { const k = (j / haut) * retrait; px(x1 + k, y - j, x2 - x1 - 2 * k, 1, j % 3 === 0 ? tuile2 : tuile); } };
    // Brasserie
    mur(18, 140, 70, 42); toit(14, 92, 140, 20, 16);
    px(74, 110, 7, 18, pierre); px(73, 108, 9, 3, joint);
    px(42, 160, 16, 22, '#5a3a22'); px(44, 158, 12, 2, '#5a3a22'); px(49, 162, 2, 20, '#3a2618');
    fenetre(25, 150); fenetre(66, 150);
    if (!nuit) { px(68, 154, 4, 4, '#d27b3e'); }
    for (let i = 0; i < 7; i++) { const a = (t * 0.6 + i / 7) % 1; disque(77 + Math.sin(a * 6 + i) * 3 + a * 10, 106 - a * 40, 1 + Math.floor(a * 3), nuit ? '#4a4a58' : `rgba(240,240,240,${0.8 - a * 0.7})`); }
    // Pigeonnier
    mur(96, 112, 13, 28); for (let j = 0; j < 14; j++) px(102.5 - j * 0.5 - 1, 112 - j, j + 2, 1, j % 3 ? tuile : tuile2);
    px(100, 120, 5, 2, '#3a2c22'); px(100, 128, 5, 2, '#3a2c22');
    // Chai et fûts
    mur(112, 134, 58, 26); toit(108, 174, 134, 12, 8);
    px(132, 144, 18, 16, '#4a3020'); px(134, 142, 14, 2, '#4a3020');
    const fut = (x, y) => { px(x, y, 9, 8, '#7a4a28'); px(x, y + 2, 9, 1, '#3a2618'); px(x, y + 5, 9, 1, '#3a2618'); px(x + 1, y - 1, 7, 1, '#7a4a28'); px(x + 1, y + 8, 7, 1, '#7a4a28'); };
    fut(152, 162); fut(162, 162); fut(157, 154);
    // Rucher
    ['#e3c35a', '#8fb4c8', '#d99a6a', '#a8c37a'].forEach((col, i) => { const x = 138 + i * 12; px(x, 104, 8, 8, col); px(x - 1, 102, 10, 2, '#7a5a3a'); px(x + 2, 110, 4, 1, '#2a1d14'); });
    if (!nuit) for (let i = 0; i < 4; i++) px(150 + Math.sin(t * 3 + i * 2) * 14, 98 + Math.cos(t * 4 + i) * 5, 1, 1, '#2a1d14');
    // Ulysse, l'alambic ambulant
    px(122, 200, 50, 3, '#3a2c22'); disque(132, 205, 3, '#2a1d14'); disque(162, 205, 3, '#2a1d14');
    disque(136, 192, 7, '#c8743a'); px(130, 186, 4, 3, '#f0a060'); px(135, 182, 3, 4, '#c8743a');
    for (let i = 0; i < 12; i++) px(137 + i, 182 - Math.min(i, 5) * 0.4, 1, 2, '#c8743a');
    px(150, 186, 9, 14, '#8a8f96'); px(151, 188, 7, 1, '#b9c0c8'); px(151, 193, 7, 1, '#b9c0c8');
    // Comptoir
    px(28, 210, 44, 24, nuit ? '#4a3020' : '#8a5a32');
    for (let i = 0; i < 52; i += 8) px(24 + i, 205, 4, 6, '#ecdfc4'), px(28 + i, 205, 4, 6, '#d27b3e');
    px(34, 216, 32, 10, nuit ? '#f3c45a' : '#3a2c22');
    ['#f3b04a', '#6a3a1a', '#d9a03a', '#2a1408'].forEach((col, i) => px(38 + i * 7, 219, 3, 6, col));
    // Feuilles qui tombent
    if (saison === 'automne' && !nuit) for (let i = 0; i < 6; i++) { const a = (t * 0.12 + i / 6) % 1; px(20 + i * 30 + Math.sin(t + i) * 6, 90 + a * 160, 2, 1, P.feuille[i % 3]); }
  }

  // =====================================================================
  // Brasserie
  // =====================================================================
  let onglet = 'malts', filtreMalt = 'tous', recherche = '', dernierCalc = null, detailStyleOuvert = false;
  const FAMILLES = { base: 'Base', kilned: 'Touraillés', caramel: 'Caramel', roasted: 'Torréfiés', adjuncts: 'Grains crus', sugars: 'Sucres et miel' };

  function entrerBrasserie() { maj(); rendreOnglets(); rendreOnglet(); }

  // Malts de base par sacs de 25 kg, malts de spécialité par 10 kg, malt acide par 5 kg
  const doseMalt = (m) => (/acidul|sauer/i.test(m.nom) ? 5 : ['caramel', 'roasted'].includes(m.fam) ? 10 : 25);
  function ajouterMalt(id) {
    const dose = doseMalt(IDX.malt.get(id));
    const l = R.malts.find((x) => x.id === id);
    if (l) l.kg += dose; else R.malts.push({ id, kg: dose });
    son('sac'); tuto('malt'); maj(); if (onglet === 'cuve') rendreOnglet();
  }
  function ajouterHoublon(id) {
    const h = IDX.houblon.get(id);
    const min = h.usage === 'bittering' ? 60 : h.usage === 'aroma' ? 10 : 15;
    const l = R.houblons.find((x) => x.id === id && x.min === min);
    if (l) l.g += 250; else R.houblons.push({ id, g: 250, min });
    son('bulle'); tuto('houblon'); maj(); if (onglet === 'cuve') rendreOnglet();
  }
  // Aromates : dose de départ au bas de la plage d'usage (g pour le volume de la cuve)
  const doseAromate = (a) => Math.max(50, Math.round((a.dose[0] * R.volume) / 50) * 50);
  const pasAromate = (l) => { const a = IDX.aromate.get(l.id); return Math.max(50, Math.round(((a.dose[1] - a.dose[0]) * R.volume) / 8 / 50) * 50); };
  function ajouterAromate(id) {
    const a = IDX.aromate.get(id);
    const l = R.aromates.find((x) => x.id === id);
    if (l) l.g += doseAromate(a); else R.aromates.push({ id, g: doseAromate(a) });
    son('bulle'); maj(); if (onglet === 'cuve') rendreOnglet();
  }
  function rendreSels() {
    const sels = D.sels;
    const h = sels.filter(dispo).map((x) => `<div class="dose"><label for="sel-${x.id}">${esc(x.nom)}</label><span class="val" id="v-sel-${x.id}">${R.sels[x.id] || 0} ${x.id === 'lactique' ? 'mL/hL' : 'g/hL'}</span>
      <input type="range" id="sel-${x.id}" data-sel="${x.id}" min="0" max="${x.max}" step="1" value="${R.sels[x.id] || 0}"><p>${esc(x.note)}</p></div>`).join('');
    return `<p class="groupe-titre">SELS ET ACIDE</p><p class="page-intro" id="ions-eau"></p>${h || ''}${verrouLigne(sels, 'sels', 'eau')}`;
  }
  function majIons() {
    const p = $('#ions-eau'); if (!p) return;
    const e = Moteur.eauCorrigee(IDX.eau.get(R.eau), R.sels);
    const ra = e.hco3 * (50 / 61) - e.ca / 1.4 - e.mg / 1.7;
    p.innerHTML = `Eau corrigée : Ca <b>${Math.round(e.ca)}</b> · Mg ${Math.round(e.mg)} · Na ${Math.round(e.na || 0)} · SO₄ <b>${Math.round(e.so4)}</b> · Cl <b>${Math.round(e.cl)}</b> · HCO₃ ${Math.round(e.hco3)} mg/L · alcalinité résiduelle <b>${Math.round(ra)}</b> · SO₄/Cl ${e.cl ? nf(e.so4 / e.cl) : '—'}`;
  }
  function choisirLevure(id) {
    const change = R.levure !== id;
    R.levure = id;
    const y = IDX.levure.get(id);
    // Nouvelle levure : consigne à sa température conseillée (lager au frais, ale dans le bas de sa plage)
    if (change) {
      R.fermentation.temp = Math.round((y.fam === 'lager' ? Math.min(y.t[0] + 3, y.t[1]) : y.t[0] + (y.t[1] - y.t[0]) * 0.35) * 2) / 2;
      R.fermentation.reposDiacetyle = y.fam === 'lager';
      toast(`Fermentation réglée à ${nf(R.fermentation.temp)} °C${y.fam === 'lager' ? ', repos diacétyle activé' : ''}.`);
    }
    son('ok'); tuto('levure'); maj(); rendreOnglet();
  }

  function rendreOnglets() {
    const nb = R.malts.length + R.houblons.length + R.aromates.length + (R.levure ? 1 : 0);
    const defs = [['cuve', `Cuve<span class="badge">${nb}</span>`], ['malts', 'Céréales'], ['houblons', 'Houblons'], ['levure', 'Levure'], ['eau', 'Eau'], ['aromates', 'Aromates'], ['procede', 'Procédé']];
    $('#onglets').innerHTML = defs.map(([id, lib]) => `<button class="onglet" role="tab" id="tab-${id}" aria-selected="${onglet === id}" data-onglet="${id}">${lib}</button>`).join('');
  }
  $('#onglets').addEventListener('click', (e) => { const b = e.target.closest('[data-onglet]'); if (!b) return; onglet = b.dataset.onglet; recherche = ''; son('clic'); rendreOnglets(); rendreOnglet(); });

  function poignee(img, teinte, type, id) {
    return `<span class="poignee" data-glisser="${type}" data-id="${esc(id)}" aria-hidden="true"><img class="sprite" src="${img}" alt="">${teinte ? `<i class="teinte" style="background:${teinte}"></i>` : ''}</span>`;
  }
  function verrouLigne(liste, quoi, cat) {
    const bloques = liste.filter((x) => !dispo(x));
    if (!bloques.length) return '';
    const dispoAchat = bloques.filter(achetable).length;
    return `<p class="verrou">${bloques.length} ${quoi} à débloquer, dont ${dispoAchat} déjà en vente au pigeonnier. Tu as ${S.ecus} écus. <button class="btn btn-mini" data-catalogue="${cat}">Ouvrir le catalogue</button></p>`;
  }
  const filtreTexte = (n) => !recherche || n.toLowerCase().includes(recherche.toLowerCase());
  const champRecherche = (ph) => `<input class="recherche" id="recherche" type="search" placeholder="${ph}" value="${esc(recherche)}" autocomplete="off">`;

  function rendreOnglet() {
    const z = $('#onglet-contenu');
    if (onglet === 'malts') {
      const liste = D.malts.filter((m) => filtreMalt === 'tous' || m.fam === filtreMalt);
      z.innerHTML = `<div class="filtres">${[['tous', 'Tous'], ...Object.entries(FAMILLES)].map(([k, v]) => `<button class="filtre" data-filtre="${k}" aria-pressed="${filtreMalt === k}">${v}</button>`).join('')}</div>
        ${champRecherche('Chercher un malt')}
        <div class="liste">${liste.filter(dispo).filter((m) => filtreTexte(m.nom)).map((m) => `
          <div class="carte-ing">${poignee(SPR.sac, couleur(m.ebc), 'malt', m.id)}
            <div class="corps"><div class="nom">${esc(m.nom)}</div>
              <div class="det"><b>${nf(m.ebc, 0)} EBC</b> · extrait ${m.rend} % · ${m.dp ? `${m.dp} °Lintner` : 'sans enzymes'}${m.max ? ` · max ${m.max} %` : ''}</div>
              <div class="etiquettes"><span class="etq">${FAMILLES[m.fam]}</span>${m.pays ? `<span class="etq">${esc(m.pays)}</span>` : ''}</div></div>
            <button class="btn btn-mini" data-ajouter="malt" data-id="${esc(m.id)}" aria-label="Ajouter ${doseMalt(m)} kg de ${esc(m.nom)}">+${doseMalt(m)} kg</button></div>`).join('')}</div>
        ${verrouLigne(liste, 'céréales', 'cereales')}`;
    } else if (onglet === 'houblons') {
      z.innerHTML = `${champRecherche('Chercher un houblon')}
        <div class="liste">${D.houblons.filter(dispo).filter((h) => filtreTexte(h.nom + ' ' + (h.aromes || ''))).map((h) => `
          <div class="carte-ing">${poignee(SPR.cone, null, 'houblon', h.id)}
            <div class="corps"><div class="nom">${esc(h.nom)} <span class="det">${esc(h.pays)}</span></div>
              <div class="det"><b>α ${nf(h.amin)}–${nf(h.amax)} %</b> · huiles ${nf(h.huile)} mL/100 g</div>
              <div class="det">${esc(h.aromes || '')}</div>
              <div class="etiquettes"><span class="etq">${{ bittering: 'Amérisant', aroma: 'Aromatique', dual: 'Double usage' }[h.usage]}</span></div></div>
            <button class="btn btn-mini" data-ajouter="houblon" data-id="${esc(h.id)}" aria-label="Ajouter 250 g de ${esc(h.nom)}">+250 g</button></div>`).join('')}</div>
        ${verrouLigne(D.houblons, 'houblons', 'houblons')}`;
    } else if (onglet === 'levure') {
      const wash = R.destination === 'wash';
      const visibles = D.levures.filter((y) => (y.fam === 'distilling') === wash || (wash && y.fam === 'ale'));
      z.innerHTML = `<p class="page-intro">${wash ? 'Wash de distillation : levures de distillerie et levures ale.' : 'Les levures de distillerie apparaissent quand la destination est un wash (onglet Procédé).'}</p>${champRecherche('Chercher une levure')}
        <div class="liste">${visibles.filter(dispo).filter((y) => filtreTexte(y.nom + ' ' + (y.desc || ''))).sort((a, b) => (b.fam === 'distilling') - (a.fam === 'distilling')).map((y) => `
          <div class="carte-ing ${R.levure === y.id ? 'choisie' : ''}">${poignee(SPR.sachet, null, 'levure', y.id)}
            <div class="corps"><div class="nom">${esc(y.nom)}</div>
              <div class="det"><b>${y.att[0]}–${y.att[1]} %</b> d'atténuation · <b>${y.t[0]}–${y.t[1]} °C</b> · tolère ${y.tol} %</div>
              <div class="det">${esc(y.desc || '')}</div>
              <div class="etiquettes"><span class="etq">${{ ale: 'Ale', lager: 'Lager', specialty: 'Spéciale', distilling: 'Distillerie' }[y.fam]}</span>${y.phenol ? '<span class="etq phen">Phénols</span>' : ''}${y.ester === 2 ? '<span class="etq est">Esters marqués</span>' : y.ester === 0 ? '<span class="etq">Neutre</span>' : ''}${y.sauvage ? '<span class="etq sauv">Sauvage</span>' : ''}</div></div>
            <button class="btn btn-mini" data-ajouter="levure" data-id="${esc(y.id)}" aria-pressed="${R.levure === y.id}">${R.levure === y.id ? 'Choisie' : 'Choisir'}</button></div>`).join('')}</div>
        ${verrouLigne(visibles, 'levures', 'levures')}`;
    } else if (onglet === 'eau') {
      z.innerHTML = D.eaux.map((e) => {
        const ra = e.hco3 * (50 / 61) - e.ca / 1.4 - e.mg / 1.7;
        return `<div class="carte-ing ${R.eau === e.id ? 'choisie' : ''}">${poignee(SPR.goutte, null, 'eau', e.id)}
          <div class="corps"><div class="nom">${esc(e.nom)}${e.estimation ? ' <span class="det">estimation</span>' : ''}</div>
            <div class="det">Ca ${e.ca} · Mg ${e.mg} · SO₄ ${e.so4} · Cl ${e.cl} · HCO₃ ${e.hco3} mg/L</div>
            <div class="det">Alcalinité résiduelle <b>${Math.round(ra)} ppm CaCO₃</b> · SO₄/Cl ${e.cl ? nf(e.so4 / e.cl) : '—'}</div>
            <div class="det">${esc(e.note)}</div></div>
          <button class="btn btn-mini" data-ajouter="eau" data-id="${e.id}" aria-pressed="${R.eau === e.id}">${R.eau === e.id ? 'Choisie' : 'Choisir'}</button></div>`;
      }).join('') + rendreSels() + `<p class="page-intro">Le calcaire du causse remonte le pH : parfait pour les bières foncées, à corriger au malt acide, aux sels ou à l'acide lactique pour les pâles. <button class="btn btn-mini btn-sobre" data-fiche="eau">Fiche eau</button></p>`;
    } else if (onglet === 'aromates') {
      const TYPES = { fruit: 'Fruits', epice: 'Épices et zestes', botanique: 'Botaniques', bois: 'Bois' };
      z.innerHTML = `<p class="page-intro">Fruits, épices, botaniques et bois, ajoutés en fin d'ébullition ou en garde. Doses en g/L : sur 1000 L, 1 g/L fait 1 kg.</p>${champRecherche('Chercher un aromate')}
        <div class="liste">${D.aromates.filter(dispo).filter((a) => filtreTexte(a.nom + ' ' + a.notes)).map((a) => `
          <div class="carte-ing">${poignee(SPR.bocal, null, 'aromate', a.id)}
            <div class="corps"><div class="nom">${esc(a.nom)}</div>
              <div class="det"><b>${esc(a.notes)}</b> · usage ${nf(a.dose[0], 1)}–${nf(a.dose[1], 0)} g/L${a.sucre ? ` · ${Math.round(a.sucre * 100)} % de sucres` : ''}</div>
              <div class="etiquettes"><span class="etq">${TYPES[a.type]}</span></div></div>
            <button class="btn btn-mini" data-ajouter="aromate" data-id="${esc(a.id)}">+${nf(doseAromate(a) / 1000, doseAromate(a) < 1000 ? 1 : 0)} kg</button></div>`).join('') || '<p class="vide">Aucun aromate. Le pigeonnier en vend dès le premier niveau.</p>'}</div>
        ${verrouLigne(D.aromates, 'aromates', 'aromates')}`;
    } else if (onglet === 'procede') {
      const y = R.levure ? IDX.levure.get(R.levure) : null;
      const auxDispo = D.auxiliaires.filter(dispo);
      z.innerHTML = `
        <div class="reglage"><span class="lib">Destination</span>
          <div class="bascule"><button data-dest="biere" aria-pressed="${R.destination !== 'wash'}">Bière pour le jury</button><button data-dest="wash" aria-pressed="${R.destination === 'wash'}">Wash pour Ulysse</button></div>
          <p>${R.destination === 'wash' ? 'Un wash de distillation n\'est pas bouilli : les enzymes du malt continuent de travailler, l\'atténuation monte, mais rien ne stérilise le moût.' : 'Une bière passe devant le jury, puis peut aller à l\'alambic.'}</p></div>
        <div class="reglage"><label for="r-palier">Palier d'empâtage <span class="val" id="v-palier">${nf(R.palier)} °C</span></label>
          <input type="range" id="r-palier" min="62" max="72" step="0.5" value="${R.palier}">
          <p id="p-palier"></p></div>
        <div class="reglage"><span class="lib">Cuisson des grains crus</span>
          <div class="bascule"><button data-cuisson="1" aria-pressed="${!!R.cuisson}">Oui</button><button data-cuisson="0" aria-pressed="${!R.cuisson}">Non</button></div>
          <p>Le maïs, le seigle et le blé crus gélatinisent plus chaud que le malt d'orge. On les fait bouillir à part avant de les ajouter à la maische.</p></div>
        ${R.destination === 'wash' ? '' : `<div class="reglage"><span class="lib">Durée d'ébullition</span>
          <div class="bascule">${[60, 90].map((m) => `<button data-ebu="${m}" aria-pressed="${R.ebullition === m}">${m} min</button>`).join('')}</div>
          <p>90 minutes chassent le DMS des malts très pâles et concentrent un peu le moût.</p></div>`}
        <div class="reglage"><label for="r-ferm">Température de fermentation <span class="val" id="v-ferm">${nf(R.fermentation.temp)} °C</span></label>
          <input type="range" id="r-ferm" min="8" max="35" step="0.5" value="${R.fermentation.temp}">
          <p>${y ? `${esc(y.nom)} : plage ${y.t[0]}–${y.t[1]} °C. Plus chaud, plus d'esters ; au-delà, des alcools supérieurs.` : 'Choisis d\'abord une levure.'}</p></div>
        <div class="reglage"><span class="lib">Repos diacétyle</span>
          <div class="bascule"><button data-repos="1" aria-pressed="${R.fermentation.reposDiacetyle}">Oui</button><button data-repos="0" aria-pressed="${!R.fermentation.reposDiacetyle}">Non</button></div>
          <p>+4 °C les deux derniers jours : la levure réabsorbe le diacétyle. Indispensable pour une lager.</p></div>
        ${S.mode === 'expert' ? `<div class="reglage"><label for="r-rend">Rendement de la salle de brassage <span class="val" id="v-rend">${Math.round(R.rendement * 100)} %</span></label>
          <input type="range" id="r-rend" min="65" max="85" step="1" value="${Math.round(R.rendement * 100)}">
          <p>Part de l'extrait théorique récupérée dans le moût (brewhouse efficiency).</p></div>` : ''}
        <div class="reglage"><span class="lib">Auxiliaires</span>
          ${auxDispo.length ? auxDispo.map((a) => `<label class="coche"><input type="checkbox" id="aux-${a.id}" data-aux="${a.id}" ${R.auxiliaires.includes(a.id) ? 'checked' : ''}><span>${esc(a.nom)}<small>${esc(a.note)}</small></span></label>`).join('') : '<p>Nutriments, clarifiants, enzymes et produits d\'hygiène s\'achètent au pigeonnier.</p>'}
          ${verrouLigne(D.auxiliaires, 'auxiliaires', 'auxiliaires')}</div>`;
      majTextePalier();
    } else if (onglet === 'cuve') {
      rendreCuveListe(z);
    }
    if (onglet === 'eau') majIons();
  }
  function majTextePalier() {
    const p = $('#p-palier'); if (!p) return;
    const t = R.palier;
    p.textContent = t < 64.5 ? "β-amylase à son optimum : beaucoup de maltose, bière sèche et très atténuée."
      : t < 67.5 ? 'Les deux amylases travaillent : équilibre entre sécheresse et corps.'
        : "α-amylase favorisée : plus de dextrines non fermentescibles, bière ronde et moelleuse.";
  }

  function rendreCuveListe(z) {
    const r = dernierCalc;
    if (!R.malts.length && !R.houblons.length && !R.levure) { z.innerHTML = '<p class="vide">La cuve est vide. Ajoute des céréales depuis l\'onglet Céréales, ou charge une recette du grimoire au pigeonnier.</p><button class="btn btn-sobre" data-catalogue="grimoire">Ouvrir le grimoire</button>'; return; }
    const kgTot = R.malts.reduce((s, x) => s + x.kg, 0) || 1;
    let h = '<p class="groupe-titre">MALTS ET SUCRES</p>';
    h += R.malts.map((l, i) => { const m = IDX.malt.get(l.id); return `<div class="ligne-recette"><div class="nom">${esc(m.nom)}<small>${Math.round((l.kg / kgTot) * 100)} % du grain · ${nf(m.ebc, 0)} EBC</small></div>
      <div class="qte"><button class="btn btn-carre" data-malt-moins="${i}" aria-label="Retirer 5 kg">−</button><input id="kg-${i}" inputmode="decimal" data-malt-kg="${i}" value="${l.kg}" aria-label="Kilogrammes de ${esc(m.nom)}"><span class="u">kg</span><button class="btn btn-carre" data-malt-plus="${i}" aria-label="Ajouter 5 kg">+</button><button class="btn btn-carre btn-sobre" data-malt-suppr="${i}" aria-label="Enlever ${esc(m.nom)}">×</button></div></div>`; }).join('') || '<p class="vide">Aucun malt.</p>';
    h += '<p class="groupe-titre">HOUBLONS</p>';
    h += R.houblons.map((l, i) => {
      const hb = IDX.houblon.get(l.id), ibu = r && r.detailHoublons[i] ? r.detailHoublons[i].ibu : 0;
      return `<div class="ligne-recette"><div class="nom">${esc(hb.nom)}<small>α ${nf(hb.alpha)} % · ${l.min < 0 ? 'à cru, sans amertume' : `${nf(ibu, 0)} IBU`}</small></div>
      <div class="qte"><button class="btn btn-carre" data-hop-moins="${i}" aria-label="Retirer 100 g">−</button><input id="g-${i}" inputmode="numeric" data-hop-g="${i}" value="${l.g}" aria-label="Grammes de ${esc(hb.nom)}"><span class="u">g</span><button class="btn btn-carre" data-hop-plus="${i}" aria-label="Ajouter 100 g">+</button><button class="btn btn-carre btn-sobre" data-hop-suppr="${i}" aria-label="Enlever ${esc(hb.nom)}">×</button></div>
      <div class="temps">${[60, 30, 15, 10, 5, 0, -1].map((m) => `<button data-hop-min="${i}:${m}" aria-pressed="${l.min === m}">${m < 0 ? 'À cru' : m + ' min'}</button>`).join('')}</div></div>`;
    }).join('') || '<p class="vide">Aucun houblon.</p>';
    if (R.aromates.length) {
      h += '<p class="groupe-titre">AROMATES</p>';
      h += R.aromates.map((l, i) => { const a = IDX.aromate.get(l.id); return `<div class="ligne-recette"><div class="nom">${esc(a.nom)}<small>${nf(l.g / R.volume, 1)} g/L · usage ${nf(a.dose[0], 1)}–${nf(a.dose[1], 0)} g/L</small></div>
        <div class="qte"><button class="btn btn-carre" data-aro-moins="${i}" aria-label="Moins">−</button><input id="aro-${i}" inputmode="numeric" data-aro-g="${i}" value="${l.g}" aria-label="Grammes de ${esc(a.nom)}"><span class="u">g</span><button class="btn btn-carre" data-aro-plus="${i}" aria-label="Plus">+</button><button class="btn btn-carre btn-sobre" data-aro-suppr="${i}" aria-label="Enlever ${esc(a.nom)}">×</button></div></div>`; }).join('');
    }
    const y = R.levure && IDX.levure.get(R.levure), e = IDX.eau.get(R.eau);
    h += `<p class="groupe-titre">LEVURE ET EAU</p><div class="ligne-recette"><div class="nom">${y ? esc(y.nom) : 'Aucune levure'}<small>${y ? `${y.t[0]}–${y.t[1]} °C · consigne ${nf(R.fermentation.temp)} °C` : 'Choisis-en une dans l\'onglet Levure'}</small></div></div>
      <div class="ligne-recette"><div class="nom">${esc(e.nom)}<small>${Object.entries(R.sels).filter(([, v]) => v > 0).map(([k, v]) => `${IDX.sel.get(k)?.nom.split(' (')[0] || k} ${v}`).join(' · ') || 'sans sels'} · palier ${nf(R.palier)} °C · ${R.destination === 'wash' ? 'wash, sans ébullition' : `ébullition ${R.ebullition} min`}</small></div></div>
      ${R.auxiliaires.length ? `<div class="ligne-recette"><div class="nom">Auxiliaires<small>${R.auxiliaires.map((a) => esc(IDX.aux.get(a)?.nom || '')).join(' · ')}</small></div></div>` : ''}
      <button class="btn btn-sobre" data-catalogue="grimoire">Charger une recette du grimoire</button>`;
    z.innerHTML = h;
  }

  // Délégation des contrôles de l'onglet
  $('#onglet-contenu').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.filtre) { filtreMalt = d.filtre; rendreOnglet(); return; }
    if (d.ajouter === 'malt') return ajouterMalt(d.id);
    if (d.ajouter === 'houblon') return ajouterHoublon(d.id);
    if (d.ajouter === 'levure') return choisirLevure(d.id);
    if (d.ajouter === 'eau') { R.eau = d.id; son('bulle'); maj(); rendreOnglet(); return; }
    if (d.ajouter === 'aromate') return ajouterAromate(d.id);
    if (d.catalogue) { catOnglet = d.catalogue; aller('catalogue'); return; }
    if (d.dest) { R.destination = d.dest; if (d.dest === 'biere' && R.levure && IDX.levure.get(R.levure).fam === 'distilling') R.levure = null; son('clic'); maj(); rendreOnglet(); return; }
    if (d.cuisson) { R.cuisson = d.cuisson === '1'; maj(); rendreOnglet(); return; }
    if (d.ebu) { R.ebullition = +d.ebu; maj(); rendreOnglet(); return; }
    if (d.repos) { R.fermentation.reposDiacetyle = d.repos === '1'; maj(); rendreOnglet(); return; }
    const k = (v) => +v;
    if (d.maltMoins) { const l = R.malts[k(d.maltMoins)]; l.kg = Math.max(0, l.kg - 5); if (!l.kg) R.malts.splice(k(d.maltMoins), 1); }
    else if (d.maltPlus) R.malts[k(d.maltPlus)].kg += 5;
    else if (d.maltSuppr) R.malts.splice(k(d.maltSuppr), 1);
    else if (d.hopMoins) { const l = R.houblons[k(d.hopMoins)]; l.g = Math.max(0, l.g - 100); if (!l.g) R.houblons.splice(k(d.hopMoins), 1); }
    else if (d.hopPlus) R.houblons[k(d.hopPlus)].g += 100;
    else if (d.hopSuppr) R.houblons.splice(k(d.hopSuppr), 1);
    else if (d.hopMin) { const [i, m] = d.hopMin.split(':').map(Number); R.houblons[i].min = m; }
    else if (d.aroMoins) { const l = R.aromates[k(d.aroMoins)]; l.g = Math.max(0, l.g - pasAromate(l)); if (!l.g) R.aromates.splice(k(d.aroMoins), 1); }
    else if (d.aroPlus) { const l = R.aromates[k(d.aroPlus)]; l.g += pasAromate(l); }
    else if (d.aroSuppr) R.aromates.splice(k(d.aroSuppr), 1);
    else return;
    son('clic'); maj(); rendreOnglet();
  });
  $('#onglet-contenu').addEventListener('input', (e) => {
    const t = e.target;
    if (t.id === 'recherche') { recherche = t.value; const pos = t.selectionStart; rendreOnglet(); const n = $('#recherche'); n.focus(); n.setSelectionRange(pos, pos); return; }
    if (t.id === 'r-palier') { R.palier = +t.value; $('#v-palier').textContent = nf(R.palier) + ' °C'; majTextePalier(); maj(); }
    if (t.id === 'r-ferm') { R.fermentation.temp = +t.value; $('#v-ferm').textContent = nf(R.fermentation.temp) + ' °C'; maj(); }
    if (t.id === 'r-rend') { R.rendement = +t.value / 100; $('#v-rend').textContent = t.value + ' %'; maj(); }
    if (t.dataset.sel) { R.sels[t.dataset.sel] = +t.value; $('#v-sel-' + t.dataset.sel).textContent = t.value + (t.dataset.sel === 'lactique' ? ' mL/hL' : ' g/hL'); maj(); majIons(); }
  });
  $('#onglet-contenu').addEventListener('change', (e) => {
    const t = e.target, d = t.dataset;
    const v = parseFloat(String(t.value).replace(',', '.'));
    if (d.maltKg != null) { if (v > 0) R.malts[+d.maltKg].kg = Math.min(2000, v); else R.malts.splice(+d.maltKg, 1); maj(); rendreOnglet(); }
    if (d.hopG != null) { if (v > 0) R.houblons[+d.hopG].g = Math.min(50000, Math.round(v)); else R.houblons.splice(+d.hopG, 1); maj(); rendreOnglet(); }
    if (d.aroG != null) { if (v > 0) R.aromates[+d.aroG].g = Math.min(300000, Math.round(v)); else R.aromates.splice(+d.aroG, 1); maj(); rendreOnglet(); }
    if (d.aux) { const id = d.aux; if (t.checked) { if (!R.auxiliaires.includes(id)) R.auxiliaires.push(id); } else R.auxiliaires = R.auxiliaires.filter((x) => x !== id); son('clic'); maj(); }
  });

  // Glisser-déposer : on attrape le sac par son icône, on le lâche dans la cuve
  let glisse = null;
  $('#onglet-contenu').addEventListener('pointerdown', (e) => {
    const p = e.target.closest('[data-glisser]'); if (!p) return;
    e.preventDefault();
    glisse = { type: p.dataset.glisser, id: p.dataset.id, el: p };
    const g = $('#glisse'); g.innerHTML = `<img class="sprite" src="${p.querySelector('img').src}" alt="">`; g.hidden = false;
    deplacerGlisse(e);
    p.setPointerCapture(e.pointerId);
  });
  function dansCuve(x, y) { const r = $('#cuve-zone').getBoundingClientRect(); return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10; }
  function deplacerGlisse(e) { const g = $('#glisse'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; $('#cuve-zone').classList.toggle('survol', dansCuve(e.clientX, e.clientY)); }
  $('#onglet-contenu').addEventListener('pointermove', (e) => { if (glisse) deplacerGlisse(e); });
  const finGlisse = (e) => {
    if (!glisse) return;
    const dedans = e.type === 'pointerup' && dansCuve(e.clientX, e.clientY);
    $('#glisse').hidden = true; $('#cuve-zone').classList.remove('survol');
    const { type, id } = glisse; glisse = null;
    if (!dedans) return;
    if (type === 'malt') ajouterMalt(id); else if (type === 'houblon') ajouterHoublon(id); else if (type === 'levure') choisirLevure(id); else if (type === 'aromate') ajouterAromate(id);
    else if (type === 'eau') { R.eau = id; son('bulle'); maj(); rendreOnglet(); }
    splash = 1;
  };
  $('#onglet-contenu').addEventListener('pointerup', finGlisse);
  $('#onglet-contenu').addEventListener('pointercancel', finGlisse);

  // Recalcul et affichage des mesures
  function maj() {
    const r = Moteur.calculer(R);
    dernierCalc = r;
    if (r.og >= 1.040) tuto('og');
    const etat = (ok, alerte) => (alerte ? 'alerte' : ok ? 'ok' : '');
    const st = r.style;
    const dans = (k) => st && st.ecarts[k] === 0;
    const m = [
      { v: r.aDesMalts ? sg(r.og) : '—', l: 'OG initiale', f: 'densite', c: etat(dans('og')) },
      { v: r.levure && r.aDesMalts ? sg(r.fg) : '—', l: 'FG finale', f: 'attenuation', c: etat(dans('fg')) },
      { v: r.levure && r.aDesMalts ? nf(r.abv) + '%' : '—', l: 'Alcool', f: 'attenuation', c: r.bloquee ? 'alerte' : '' },
      { v: nf(r.ibu, 0), l: 'IBU', f: 'amertume', c: etat(dans('ibu')) },
      { v: `${nf(r.ebc, 0)}<i class="pastille" style="background:${couleur(r.ebc)}"></i>`, l: 'EBC', f: 'couleur', c: etat(dans('ebc')) },
      { v: r.aDesMalts ? nf(r.ph, 2) : '—', l: 'pH', f: 'eau', c: r.aDesMalts ? etat(r.ph >= 5.2 && r.ph <= 5.6, r.ph > 5.78 || r.ph < 5.15) : '' },
    ];
    $('#mesures').innerHTML = m.map((x) => `<button class="mesure ${x.c}" data-fiche="${x.f}"><span class="v">${x.v}</span><span class="l">${x.l}</span></button>`).join('');
    const ligne = $('#style-ligne');
    if (r.wash && r.aDesMalts && r.levure) {
      const pc = Math.round(r.attenuation * 100);
      ligne.innerHTML = `<span class="nom">Wash de distillation</span><span class="pc">${nf(r.abv * r.volume / 100, 0)} LAP</span><span class="jauge"><i style="width:${Math.min(100, pc)}%;background:var(--braise)"></i></span><span class="indice">Atténuation ${pc} % · pas d'ébullition · ${r.levure.fam === 'distilling' ? 'levure de distillerie' : 'levure de brasserie'}</span>`;
    } else if (st) {
      const pc = Math.round(st.conformite * 100);
      ligne.innerHTML = `<span class="nom">≈ ${esc(st.style.nom)}</span><span class="pc">${pc} %</span><span class="jauge"><i style="width:${pc}%;background:${pc >= 70 ? 'var(--houblon)' : pc >= 35 ? 'var(--braise)' : 'var(--alerte)'}"></i></span><span class="indice">Style le plus proche · touche pour comparer aux plages</span>`;
    } else ligne.innerHTML = `<span class="nom">Aucun style pour l'instant</span><span class="pc">—</span><span class="indice">${r.aDesMalts ? 'Il manque une levure.' : 'Ajoute du malt et une levure.'}</span>`;
    ligne.setAttribute('aria-expanded', detailStyleOuvert);
    rendreDetailStyle(r);
    const c = $('#conseil');
    const cs = S.aide ? Moteur.conseils(r, R) : [];
    if (cs.length) { c.hidden = false; c.innerHTML = `<b>Lise :</b> ${esc(cs[0].txt)}<button data-fiche="${cs[0].fiche}">Fiche</button>`; } else c.hidden = true;
    $('#btn-lancer').disabled = !(r.aDesMalts && r.levure);
    rendreOnglets();
    sauver();
  }
  function rendreDetailStyle(r) {
    const z = $('#style-detail');
    z.hidden = !detailStyleOuvert || !r.style;
    if (z.hidden) return;
    const s = r.style.style;
    const ligne = (lib, val, plage, txt, min, max) => {
      const pos = (v) => borne(((v - min) / (max - min)) * 100, 0, 100);
      return `<div class="repere"><span>${lib}</span><span class="barre"><i class="plage" style="left:${pos(plage[0])}%;width:${pos(plage[1]) - pos(plage[0])}%"></i><i class="moi" style="left:${pos(val)}%"></i></span><span class="val">${txt}</span></div>`;
    };
    const span = (p, f) => [p[0] - (p[1] - p[0]) * f, p[1] + (p[1] - p[0]) * f];
    const [o1, o2] = span(s.og, 1.2), [f1, f2] = span(s.fg, 1.2), [i1, i2] = span(s.ibu, 1), [e1, e2] = span(s.ebc, 1);
    z.innerHTML = `${ligne('Densité', r.og, s.og, sg(r.og), o1, o2)}${ligne('Finale', r.fg, s.fg, sg(r.fg), f1, f2)}${ligne('IBU', r.ibu, s.ibu, nf(r.ibu, 0), Math.max(0, i1), i2)}${ligne('EBC', r.ebc, s.ebc, nf(r.ebc, 0), Math.max(0, e1), e2)}
      <p>${esc(s.desc || '')}</p>
      <p class="autres-styles">Ensuite : ${r.styles.slice(1, 4).map((x) => `${esc(x.style.nom)} ${Math.round(x.conformite * 100)} %`).join(' · ')}</p>`;
  }
  $('#style-ligne').addEventListener('click', () => { detailStyleOuvert = !detailStyleOuvert; son('clic'); rendreDetailStyle(dernierCalc); $('#style-ligne').setAttribute('aria-expanded', detailStyleOuvert); });
  $('#btn-vider').addEventListener('click', () => {
    const b = $('#btn-vider');
    if (b.dataset.confirme) { R.malts = []; R.houblons = []; R.levure = null; delete b.dataset.confirme; b.textContent = 'Vider la cuve'; son('rate'); maj(); rendreOnglet(); }
    else { b.dataset.confirme = '1'; b.textContent = 'Confirmer ?'; setTimeout(() => { delete b.dataset.confirme; b.textContent = 'Vider la cuve'; }, 2500); }
  });

  // Dessin de la cuve
  let splash = 0, animCuve = null;
  function dessinerCuve(t) {
    const c = $('#cuve').getContext('2d'), W = 120, H = 96, r = dernierCalc;
    const px = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), w, h); };
    px(0, 0, W, H, '#221912');
    for (let y = 6; y < H; y += 10) for (let x = (y % 20 === 6 ? 0 : 10); x < W; x += 20) px(x, y, 16, 1, '#2c2118');
    px(0, 84, W, 12, '#3b2d22');
    // Cuve en cuivre
    const cx = 60;
    for (let y = 16; y < 82; y++) {
      const larg = y < 26 ? 30 + (y - 16) * 1.2 : y > 72 ? 42 - (y - 72) * 2 : 42;
      px(cx - larg, y, larg * 2, 1, y % 7 === 0 ? '#b9652f' : '#d27b3e');
      px(cx - larg, y, 4, 1, '#f0a060'); px(cx + larg - 5, y, 5, 1, '#8a4a22');
    }
    px(cx - 30, 14, 60, 3, '#8a4a22'); px(52, 6, 16, 9, '#b9652f'); px(54, 4, 12, 2, '#8a4a22');
    // Hublot : niveau et couleur du moût
    const kg = r ? r.kgTotal : 0, niveau = borne(kg / 260, 0, 1);
    px(cx - 14, 30, 28, 40, '#2a1d14');
    if (niveau > 0) {
      const h = Math.round(38 * niveau), col = couleur(r.ebc);
      px(cx - 13, 69 - h, 26, h, col);
      for (let i = 0; i < 5; i++) { const a = ((t * 0.7 + i / 5) % 1); px(cx - 10 + i * 5, 69 - a * h, 1, 1, 'rgba(255,255,255,.55)'); }
      if (R.houblons.length) for (let i = 0; i < Math.min(6, R.houblons.length * 2); i++) px(cx - 11 + i * 4, 69 - h + 2 + (i % 2), 2, 2, '#9cc95e');
    }
    px(cx - 13, 31, 2, 38, 'rgba(255,255,255,.12)');
    // Vapeur et éclaboussure
    if (niveau > 0) for (let i = 0; i < 3; i++) { const a = (t * 0.5 + i / 3) % 1; px(56 + Math.sin(a * 5 + i) * 4, 2 - a * 8 + 4, 3, 2, `rgba(236,223,196,${0.5 - a * 0.5})`); }
    if (splash > 0) { for (let i = 0; i < 8; i++) px(cx - 20 + i * 5, 14 - splash * 10 * ((i % 3) + 1) / 3, 2, 2, '#f3b04a'); splash = Math.max(0, splash - 0.05); }
    // Thermomètre et vanne
    px(98, 34, 14, 14, '#ecdfc4'); px(100, 36, 10, 10, '#3b2d22'); px(104, 40, 5, 1, '#e3593d');
  }
  function bouclerCuve() { const t0 = performance.now(); const f = (ts) => { if (ecran !== 'brasserie') return; dessinerCuve((ts - t0) / 1000); animCuve = requestAnimationFrame(f); }; cancelAnimationFrame(animCuve); animCuve = requestAnimationFrame(f); }
  const entrerBrasserieBase = entrerBrasserie;
  entrerBrasserie = function () { entrerBrasserieBase(); if (reduit) dessinerCuve(0); else bouclerCuve(); };
  quitteurs.brasserie = () => cancelAnimationFrame(animCuve);

  // =====================================================================
  // Session de brassage et gestes
  // =====================================================================
  let session = null;
  $('#btn-lancer').addEventListener('click', () => {
    const r = Moteur.calculer(R);
    if (!r.aDesMalts || !r.levure) return;
    session = { recette: clone(R), scores: { palier: null, houblon: null, ferm: null }, gestes: { houblonsMin: R.houblons.map((h) => h.min) }, joue: S.mode === 'debutant' || S.gestesExpert };
    son('ok'); tuto('lancer');
    // Sans gestes, le tutoriel saute directement à la dégustation
    if (!session.joue && S.tuto >= 0 && S.tuto < TUTO.length - 1) S.tuto = TUTO.length - 1;
    if (session.joue) { aller('empatage'); preparerEmpatage(); } else finirBrassin();
  });

  function bouclePendant(duree, maj, fin) {
    let t0 = null, prec = null, id;
    const f = (ts) => {
      if (t0 == null) { t0 = ts; prec = ts; }
      const dt = Math.min(0.05, (ts - prec) / 1000); prec = ts;
      const t = (ts - t0) / 1000;
      maj(dt, Math.min(t, duree));
      if (t < duree) id = requestAnimationFrame(f); else fin();
    };
    id = requestAnimationFrame(f);
    return () => cancelAnimationFrame(id);
  }
  const infoBloc = (v, l) => `<div class="mesure"><span class="v">${v}</span><span class="l">${l}</span></div>`;
  function bilanGeste(id, lignes, suite) {
    const b = $(`#${id}-bilan`); b.hidden = false;
    b.innerHTML = lignes.map((l) => `<p>${l}</p>`).join('') + `<button class="btn btn-feu" id="${id}-suite">${suite}</button>`;
    $(`#${id}-pied`).hidden = true;
    b.scrollIntoView({ block: 'nearest', behavior: reduit ? 'auto' : 'smooth' });
  }
  const effetMalus = (s) => (s >= 0.85 ? 'aucun malus' : s >= 0.6 ? 'léger malus de dégustation' : s >= 0.35 ? 'malus modéré' : 'malus fort');

  // ---- Empâtage ----
  let arretGeste = null;
  function preparerEmpatage() {
    const cible = session.recette.palier;
    const st = { T: cible - 2.5, h: 0, vapeur: false, dans: 0, somme: 0, duree: 0, t: 0, fini: false };
    $('#emp-consigne').innerHTML = `Garde la cuve-matière à <b>${nf(cible)} °C ± 1</b> pendant 60 minutes. Les pertes de chaleur la refroidissent en continu.`;
    $('#emp-bilan').hidden = true; $('#emp-pied').hidden = false;
    const vap = $('#emp-vapeur'); vap.disabled = true;
    const enzyme = (T) => T < 60 ? ['β', 'au ralenti'] : T < 65 ? ['β', 'maltose'] : T < 68 ? ['α + β', 'équilibre'] : T < 72.5 ? ['α', 'dextrines'] : ['—', 'dénaturées'];
    const ctx = $('#emp-canvas').getContext('2d');
    const dessin = () => {
      const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      px(0, 0, 192, 128, '#221912');
      // Cuve-matière
      px(20, 30, 90, 80, '#8a8f96'); px(22, 32, 86, 76, '#b9c0c8'); px(26, 46, 78, 58, '#e2c48a');
      for (let i = 0; i < 18; i++) px(28 + ((i * 37) % 74), 50 + ((i * 23) % 50), 2, 2, '#c9a26b');
      if (st.h > 0.05) for (let i = 0; i < 4; i++) { const a = (st.t * 1.5 + i / 4) % 1; px(40 + i * 14, 40 - a * 30, 4, 3, `rgba(236,223,196,${(0.6 - a * 0.6) * st.h})`); }
      px(108, 60, 14, 6, '#3b2d22'); px(118, 54, 6, 18, st.vapeur ? '#f3b04a' : '#574332');
      // Thermomètre 55–78 °C
      const y = (T) => 116 - ((T - 55) / 23) * 104;
      px(146, 8, 26, 112, '#ecdfc4'); px(150, 12, 18, 104, '#3b2d22');
      px(150, y(cible + 1), 18, y(cible - 1) - y(cible + 1), 'rgba(156,201,94,.45)');
      px(156, y(st.T), 6, 116 - y(st.T), Math.abs(st.T - cible) <= 1 ? '#9cc95e' : '#e3593d');
      [55, 60, 65, 70, 75].forEach((T) => px(146, y(T), 4, 1, '#3b2d22'));
    };
    const infos = () => { const [v, l] = enzyme(st.T); $('#emp-infos').innerHTML = infoBloc(nf(st.T) + '°', 'Température') + infoBloc(Math.round(st.t / 16 * 60) + "'", 'sur 60 min') + infoBloc(v, 'amylase : ' + l); };
    dessin(); infos();
    $('#emp-go').onclick = () => {
      $('#emp-go').disabled = true; vap.disabled = false;
      arretGeste = bouclePendant(16, (dt, t) => {
        st.t = t;
        st.h += ((st.vapeur ? 1 : 0) - st.h) * Math.min(1, dt * 4);
        st.T += (st.h * 2.1 - 0.022 * (st.T - 20) + 0.25 * Math.sin(t * 1.3)) * dt;
        st.duree += dt; st.somme += st.T * dt; if (Math.abs(st.T - cible) <= 1) st.dans += dt;
        dessin(); infos();
      }, () => {
        st.vapeur = false; vap.disabled = true; vap.classList.remove('actif');
        const score = st.dans / st.duree, moy = st.somme / st.duree;
        session.scores.palier = score; session.gestes.palierMoyen = moy;
        let effet = S.mode === 'debutant' ? `Effet : ${effetMalus(score)}.` : '';
        if (S.mode === 'expert') {
          const prevu = Moteur.calculer(session.recette), obtenu = Moteur.calculer(session.recette, { palierMoyen: moy });
          effet = `Atténuation prévue ${Math.round(prevu.attenuation * 100)} %, obtenue ${Math.round(obtenu.attenuation * 100)} %.`;
        }
        son(score > 0.6 ? 'ok' : 'rate');
        bilanGeste('emp', [`<span class="gros">${Math.round(score * 100)} %</span> du temps dans la zone`, `Température moyenne ${nf(moy)} °C pour une consigne de ${nf(cible)} °C.`, effet], 'Passer à l\'ébullition');
        $('#emp-suite').onclick = () => { tuto('fin:empatage'); if (session.recette.destination === 'wash') { aller('fermentation'); preparerFermentation(); } else { aller('ebullition'); preparerEbullition(); } };
      });
    };
    const on = (e) => { e.preventDefault(); if (vap.disabled) return; st.vapeur = true; vap.classList.add('actif'); };
    const off = () => { st.vapeur = false; vap.classList.remove('actif'); };
    vap.onpointerdown = on; vap.onpointerup = off; vap.onpointerleave = off; vap.onpointercancel = off;
    vap.oncontextmenu = (e) => e.preventDefault();
    $('#emp-passer').onclick = () => { arretGeste && arretGeste(); session.scores.palier = 0.5; tuto('fin:empatage'); if (session.recette.destination === 'wash') { aller('fermentation'); preparerFermentation(); } else { aller('ebullition'); preparerEbullition(); } };
  }
  document.addEventListener('keydown', (e) => { if (ecran === 'empatage' && e.code === 'Space' && !$('#emp-vapeur').disabled) { e.preventDefault(); $('#emp-vapeur').onpointerdown(e); } });
  document.addEventListener('keyup', (e) => { if (ecran === 'empatage' && e.code === 'Space') $('#emp-vapeur').onpointerup(); });

  // ---- Ébullition ----
  function preparerEbullition() {
    const rec = session.recette, total = rec.ebullition, DUREE = 18;
    const file = rec.houblons.map((h, i) => ({ i, nom: IDX.houblon.get(h.id).nom, g: h.g, prevu: Math.min(h.min, total) }))
      .filter((x) => x.prevu >= 0).sort((a, b) => b.prevu - a.prevu);
    const aCru = rec.houblons.filter((h) => h.min < 0);
    const st = { t: 0, k: 0, ecarts: [], chutes: [] };
    $('#ebu-consigne').innerHTML = file.length ? `Ébullition de <b>${total} min</b>. Jette chaque houblon quand le curseur passe sur son repère.${aCru.length ? ` ${aCru.length} ajout${aCru.length > 1 ? 's' : ''} à cru attendront la fermentation.` : ''}` : 'Pas de houblon à jeter pendant l\'ébullition : regarde bouillir, puis continue.';
    $('#ebu-bilan').hidden = true; $('#ebu-pied').hidden = false;
    const btn = $('#ebu-jeter'); btn.disabled = true;
    const frise = $('#ebu-frise');
    const pos = (min) => ((total - min) / total) * 100;
    const rendreFrise = () => {
      frise.innerHTML = [0, 15, 30, 45, 60, 75, 90].filter((m) => m <= total).map((m) => `<span class="graduation" style="left:${pos(m)}%">${m}</span>`).join('')
        + file.map((h, k) => `<i class="repere-h ${k < st.k ? 'fait' : ''}" style="left:${pos(h.prevu)}%"><b>${k + 1}</b></i>`).join('')
        + `<i class="curseur" style="left:${(st.t / DUREE) * 100}%"></i>`;
    };
    const etiquette = () => { const h = file[st.k]; btn.innerHTML = h ? `Jeter ${esc(h.nom)}<small>${nf(h.g / 1000, 2)} kg · prévu à ${h.prevu} min</small>` : 'Tout est dans la cuve'; };
    const ctx = $('#ebu-canvas').getContext('2d');
    const teinteMout = couleur(Moteur.calculer(rec).ebc);
    const dessin = () => {
      const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      px(0, 0, 192, 112, '#221912');
      px(40, 34, 112, 70, '#d27b3e'); px(40, 34, 6, 70, '#f0a060'); px(146, 34, 6, 70, '#8a4a22');
      px(48, 30, 96, 10, teinteMout);
      if (st.t > 0) for (let i = 0; i < 14; i++) { const a = (st.t * 2 + i * 0.37) % 1; px(52 + ((i * 41) % 88), 38 - a * 6, 3, 2, 'rgba(255,240,200,.7)'); }
      for (let i = 0; i < 5; i++) { const a = (st.t * 0.6 + i / 5) % 1; px(70 + i * 12 + Math.sin(a * 6) * 3, 26 - a * 26, 5, 3, `rgba(236,223,196,${0.5 - a * 0.5})`); }
      st.chutes = st.chutes.filter((c) => c.y < 34); st.chutes.forEach((c) => { c.y += 1.6; px(c.x, c.y, 4, 5, '#9cc95e'); px(c.x + 1, c.y + 1, 2, 2, '#5c8a33'); });
      px(60, 104, 72, 6, '#e3593d'); for (let i = 0; i < 9; i++) px(62 + i * 8, 100 - (Math.sin(st.t * 12 + i) + 1) * 2, 4, 4, '#f3b04a');
    };
    const minutes = () => total * (1 - st.t / DUREE);
    const jeter = () => {
      const h = file[st.k]; if (!h) return;
      const reel = Math.max(0, Math.round(minutes() * 2) / 2);
      session.gestes.houblonsMin[h.i] = reel;
      st.ecarts.push(Math.abs(reel - h.prevu));
      st.k++; st.chutes.push({ x: 60 + Math.random() * 70, y: 0 }); son('bulle'); etiquette(); rendreFrise();
      $('#ebu-infos').innerHTML = infoBloc(Math.round(minutes()) + "'", 'restantes') + infoBloc(nf(reel, 1) + "'", `${esc(h.nom)} jeté`) + infoBloc((reel - h.prevu >= 0 ? '+' : '') + nf(reel - h.prevu, 1), 'écart (min)');
      if (st.k >= file.length) btn.disabled = true;
    };
    rendreFrise(); etiquette(); dessin();
    $('#ebu-infos').innerHTML = infoBloc(total + "'", 'restantes') + infoBloc(file.length, 'ajouts prévus') + infoBloc(aCru.length, 'à cru');
    btn.onclick = jeter;
    $('#ebu-go').onclick = () => {
      $('#ebu-go').disabled = true; btn.disabled = !file.length;
      arretGeste = bouclePendant(DUREE, (dt, t) => {
        st.t = t; dessin(); rendreFrise();
        if (st.k === 0 || st.k < file.length) $('#ebu-infos').firstElementChild.innerHTML = `<span class="v">${Math.max(0, Math.round(minutes()))}'</span><span class="l">restantes</span>`;
      }, () => {
        btn.disabled = true;
        while (st.k < file.length) { const h = file[st.k]; session.gestes.houblonsMin[h.i] = 0; st.ecarts.push(h.prevu); st.k++; }
        const score = st.ecarts.length ? st.ecarts.reduce((s, e) => s + Math.max(0, 1 - e / 6), 0) / st.ecarts.length : 1;
        session.scores.houblon = score;
        let effet = S.mode === 'debutant' ? `Effet : ${effetMalus(score)}.` : '';
        if (S.mode === 'expert') { const a = Moteur.calculer(rec), b = Moteur.calculer(rec, { houblonsMin: session.gestes.houblonsMin }); effet = `Amertume prévue ${nf(a.ibu, 0)} IBU, obtenue ${nf(b.ibu, 0)} IBU.`; }
        session.precisionHoublon = st.ecarts.length ? Math.max(...st.ecarts) : 0;
        son(score > 0.6 ? 'ok' : 'rate');
        bilanGeste('ebu', [`<span class="gros">${Math.round(score * 100)} %</span> de précision`, st.ecarts.length ? `Écart moyen ${nf(st.ecarts.reduce((a, b) => a + b, 0) / st.ecarts.length)} min.` : 'Aucun houblon pendant l\'ébullition.', effet], 'Refroidir et ensemencer');
        $('#ebu-suite').onclick = () => { tuto('fin:ebullition'); aller('fermentation'); preparerFermentation(); };
      });
    };
    $('#ebu-passer').onclick = () => { arretGeste && arretGeste(); session.scores.houblon = 0.5; tuto('fin:ebullition'); aller('fermentation'); preparerFermentation(); };
  }

  // ---- Fermentation ----
  function preparerFermentation() {
    const rec = session.recette, y = IDX.levure.get(rec.levure), consigne = rec.fermentation.temp;
    const repos = rec.fermentation.reposDiacetyle;
    const DUREE = 18, AMB = 18, FROID = 2.2;
    const r0 = Moteur.calculer(rec), G = 0.75 * (r0.pts / 48);
    const cible = (j) => consigne + (repos && j >= 5 ? 4 : 0);
    const st = { T: consigne, u: 0, t: 0, dans: 0, duree: 0, somme: 0, max: consigne, min: consigne, histo: [] };
    const base = Math.round(borne(-((AMB - consigne) * 0.12) / FROID, -1, 1) * 100);
    const vanne = $('#fer-vanne'); vanne.value = base; vanne.disabled = true; st.u = base / 100;
    $('#fer-consigne').innerHTML = `${esc(y.nom)} à <b>${nf(consigne)} °C ± 1,5</b>, cave à ${AMB} °C. ${repos ? 'Repos diacétyle : la bande monte de 4 °C les deux derniers jours.' : ''}`;
    $('#fer-bilan').hidden = true; $('#fer-pied').hidden = false;
    const phase = (j) => j < 1 ? 'Latence' : j < 3.2 ? 'Tumultueuse' : j < 5 ? 'Atténuation' : 'Maturation';
    const ctx = $('#fer-canvas').getContext('2d');
    const dessin = () => {
      const px = (x, yy, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(yy), w, h); };
      px(0, 0, 192, 128, '#221912');
      // Cuve cylindro-conique
      const enveloppe = st.u < -0.05 ? `rgba(110,170,220,${-st.u})` : st.u > 0.05 ? `rgba(227,89,61,${st.u})` : '#8a8f96';
      px(12, 14, 44, 70, '#b9c0c8'); px(10, 30, 48, 30, enveloppe); px(12, 30, 44, 30, '#b9c0c8'); px(12, 34, 44, 2, enveloppe); px(12, 46, 44, 2, enveloppe); px(12, 56, 44, 2, enveloppe);
      for (let j = 0; j < 18; j++) px(14 + j, 84 + j, 40 - j * 2, 1, '#9aa1a8');
      px(32, 102, 4, 10, '#8a8f96'); px(20, 110, 28, 3, '#574332');
      const act = G * (st.t / DUREE * 7 / 1.8) * Math.exp(1 - st.t / DUREE * 7 / 1.8);
      for (let i = 0; i < Math.round(act * 8); i++) px(16 + ((i * 13 + Math.floor(st.t * 20)) % 36), 20 + ((i * 7 + Math.floor(st.t * 30)) % 60), 1, 1, '#ecdfc4');
      // Courbe de température sur 7 jours
      const gx = 68, gw = 118, gy = 8, gh = 108, tMin = Math.min(consigne - 6, 4), tMax = consigne + 10;
      const Y = (T) => gy + gh - ((T - tMin) / (tMax - tMin)) * gh;
      px(gx, gy, gw, gh, '#17110d');
      for (let j = 0; j <= 7; j++) px(gx + (j / 7) * gw, gy, 1, gh, '#2c2118');
      for (let x = 0; x < gw; x++) { const j = (x / gw) * 7, c = cible(j); px(gx + x, Y(c + 1.5), 1, Y(c - 1.5) - Y(c + 1.5), 'rgba(156,201,94,.3)'); }
      st.histo.forEach((p, k) => px(gx + (p.j / 7) * gw, Y(p.T), 2, 2, Math.abs(p.T - cible(p.j)) <= 1.5 ? '#9cc95e' : '#e3593d'));
      px(gx + (st.t / DUREE) * gw, gy, 1, gh, '#f3b04a');
    };
    const infos = (j) => { $('#fer-infos').innerHTML = infoBloc(nf(st.T) + '°', 'Température') + infoBloc('J' + Math.min(7, Math.floor(j) + 1), 'sur 7 jours') + infoBloc(phase(j), 'Phase'); };
    dessin(); infos(0);
    vanne.oninput = () => { st.u = vanne.value / 100; };
    $('#fer-go').onclick = () => {
      $('#fer-go').disabled = true; vanne.disabled = false; vanne.focus();
      arretGeste = bouclePendant(DUREE, (dt, t) => {
        st.t = t;
        const j = (t / DUREE) * 7;
        const chaleur = G * (j / 1.8) * Math.exp(1 - j / 1.8);
        st.T += (chaleur + (AMB - st.T) * 0.12 + st.u * FROID) * dt;
        st.duree += dt; st.somme += st.T * dt; st.max = Math.max(st.max, st.T); st.min = Math.min(st.min, st.T);
        if (Math.abs(st.T - cible(j)) <= 1.5) st.dans += dt;
        if (!st.histo.length || j - st.histo[st.histo.length - 1].j > 0.06) st.histo.push({ j, T: st.T });
        dessin(); infos(j);
      }, () => {
        vanne.disabled = true;
        const score = st.dans / st.duree, moy = st.somme / st.duree;
        session.scores.ferm = score;
        Object.assign(session.gestes, { fermMax: st.max, fermMin: st.min, fermMoy: moy });
        let effet = S.mode === 'debutant' ? `Effet : ${effetMalus(score)}.` : `Esters et alcools supérieurs calculés sur un pic à ${nf(st.max)} °C.`;
        if (st.max > y.t[1] + 1) effet += ` Au-dessus de ${y.t[1]} °C, la levure produit des alcools supérieurs.`;
        const aCru = rec.houblons.filter((h) => h.min < 0);
        son(score > 0.6 ? 'ok' : 'rate');
        bilanGeste('fer', [`<span class="gros">${Math.round(score * 100)} %</span> du temps dans la bande`, `Pic à ${nf(st.max)} °C, creux à ${nf(st.min)} °C.`, effet, aCru.length ? `Houblonnage à cru au jour 4 : ${aCru.map((h) => `${nf(h.g / 1000, 2)} kg de ${esc(IDX.houblon.get(h.id).nom)}`).join(', ')}.` : ''], 'Déguster');
        $('#fer-suite').onclick = () => { tuto('fin:fermentation'); finirBrassin(); };
      });
    };
    $('#fer-passer').onclick = () => { arretGeste && arretGeste(); session.scores.ferm = 0.5; tuto('fin:fermentation'); finirBrassin(); };
  }
  quitteurs.empatage = quitteurs.ebullition = quitteurs.fermentation = quitteurs.brouillis = quitteurs.repasse = () => { arretGeste && arretGeste(); arretGeste = null; $('#emp-go').disabled = false; $('#ebu-go').disabled = false; $('#fer-go').disabled = false; };

  // =====================================================================
  // Fin du brassin : calcul, jury, carnet, succès
  // =====================================================================
  let dernier = null;
  // Risque d'infection (mode débutant) : fermentation mal tenue, pas d'ébullition, hygiène
  function risqueInfection(rec) {
    let p = 0.03 + (session.scores.ferm != null && session.scores.ferm < 0.5 ? 0.05 : 0);
    if (rec.destination === 'wash') p *= 1.8;
    if ((rec.auxiliaires || []).some((a) => IDX.aux.get(a)?.effet === 'hygiene')) p *= 0.5;
    return p;
  }
  const BONUS_MEDAILLE = { bronze: 5, argent: 10, or: 20 };
  function gagnerEcus(n) { if (!S.bac && n > 0) S.ecus += n; return S.bac ? 0 : n; }
  function finirBrassin() {
    if (session.recette.destination === 'wash') return finirWash();
    const expertJoue = S.mode === 'expert' && session.joue;
    const res = Moteur.calculer(session.recette, expertJoue ? session.gestes : null);
    const infection = S.mode === 'debutant' && session.joue && Math.random() < risqueInfection(session.recette);
    const note = Moteur.noter(res, { mode: S.mode, scores: S.mode === 'debutant' ? session.scores : null, infection });
    const etoiles = { sansAide: !S.aide, expert: S.mode === 'expert', gestes: expertJoue };
    const nbEtoiles = Object.values(etoiles).filter(Boolean).length;
    const gain = S.bac ? 0 : Math.round(note.total) + (note.medaille ? 5 * nbEtoiles : 0);
    const palierAvant = palierAtteint();
    S.brassins++; S.points += gain;
    const entree = {
      id: Date.now().toString(36), type: 'biere', date: new Date().toISOString(), nom: `${res.style.style.nom} n° ${S.brassins}`,
      style: res.style.style.nom, sujet: res.style.style.sujet, conformite: res.style.conformite,
      og: res.og, fg: res.fg, abv: res.abv, ibu: res.ibu, ebc: res.ebc, total: note.total, lignes: note.lignes, medaille: note.medaille,
      etoiles, defauts: note.defauts.map((d) => d.nom), recette: session.recette, mode: S.mode, bac: S.bac, gain,
    };
    S.carnet.unshift(entree);
    const nouveaux = verifierSucces(entree, res, note);
    const ecus = gagnerEcus(Math.round(note.total / 2) + (BONUS_MEDAILLE[note.medaille] || 0) + (note.medaille ? 3 * nbEtoiles : 0));
    const cadeaux = verifierDecouvertes('biere', { entree, res, note, infection });
    sauver(); majEntete();
    dernier = { type: 'biere', entree, res, note, gain, ecus, cadeaux, palierMonte: palierAtteint() > palierAvant, nouveaux };
    aller('degustation');
    rendreDegustation();
  }
  function finirWash() {
    const expertJoue = S.mode === 'expert' && session.joue;
    const res = Moteur.calculer(session.recette, expertJoue ? session.gestes : null);
    const infection = S.mode === 'debutant' && session.joue && Math.random() < risqueInfection(session.recette);
    const fiche = Moteur.noterWash(res, { infection });
    const palierAvant = palierAtteint();
    const gain = S.bac ? 0 : Math.round(fiche.total);
    S.brassins++; S.points += gain;
    const entree = {
      id: Date.now().toString(36), type: 'wash', date: new Date().toISOString(), nom: `Wash n° ${S.brassins}`, style: 'Wash de distillation',
      og: res.og, fg: res.fg, abv: res.abv, ibu: res.ibu, ebc: res.ebc, total: fiche.total, lignes: fiche.lignes, medaille: null,
      etoiles: { sansAide: false, expert: false, gestes: false }, defauts: fiche.defauts.map((d) => d.nom), recette: session.recette, mode: S.mode, bac: S.bac, gain, lap: fiche.lap,
    };
    S.carnet.unshift(entree);
    const ecus = gagnerEcus(Math.round(fiche.total) + 5);
    const cadeaux = verifierDecouvertes('wash', { entree, res, infection });
    sauver(); majEntete();
    dernier = { type: 'wash', entree, res, fiche, gain, ecus, cadeaux, palierMonte: palierAtteint() > palierAvant, nouveaux: [] };
    aller('degustation');
    rendreDegustationWash();
  }
  function verifierSucces(e, res, note) {
    const s = session.scores, gagne = [];
    const ok = (id, cond) => { if (cond && !S.succes[id]) { S.succes[id] = e.date; gagne.push(SUCCES.find((x) => x.id === id).nom); } };
    if (S.bac) return gagne;
    ok('premier', true);
    ok('podium', !!note.medaille);
    ok('or', note.total >= 45);
    ok('palier', s.palier != null && s.palier >= 0.95);
    ok('houblon', session.precisionHoublon != null && s.houblon != null && session.precisionHoublon <= 1 && session.recette.houblons.some((h) => h.min >= 0));
    ok('ferm', s.ferm != null && s.ferm >= 0.95);
    ok('net', !!note.medaille && note.defauts.length === 0);
    ok('noir', !!note.medaille && ['stout', 'porter'].includes(res.style.style.sujet));
    ok('pils', res.style.style.sujet === 'pilsener' && note.total >= 40);
    ok('cinq', new Set(S.carnet.filter((x) => x.medaille && !x.bac && x.type !== 'edv').map((x) => x.style)).size >= 5);
    ok('abeilles', !!note.medaille && res.style.style.sujet === 'specialty');
    ok('sansfilet', !!note.medaille && !S.aide);
    ok('expert', !!note.medaille && S.mode === 'expert');
    return gagne;
  }

  // =====================================================================
  // Dégustation
  // =====================================================================
  function rendreDegustation() {
    const { entree: e, res, note, gain, palierMonte, nouveaux } = dernier;
    // Verre qui se remplit
    const ctx = $('#verre').getContext('2d');
    const rgb = Moteur.couleurRVB(res.ebc), mousse = res.ebc > 60 ? '#d8b98a' : '#f4ecd8';
    const dessinVerre = (p) => {
      const px = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      ctx.clearRect(0, 0, 64, 96); px(0, 0, 64, 96, '#221912');
      const larg = (y) => (y < 20 ? 18 + (y - 6) * 0.25 : y < 60 ? 21 - (y - 20) * 0.14 : 15.4 - (y - 60) * 0.1);
      const bas = 84, haut = 10, niv = bas - (bas - haut - 6) * p;
      for (let y = haut; y < bas; y++) {
        const w = larg(y);
        px(32 - w - 1, y, 1, 1, '#9aa1a8'); px(32 + w, y, 1, 1, '#9aa1a8');
        if (y >= niv) px(32 - w, y, w * 2, 1, `rgb(${rgb.join(',')})`);
        else if (y >= niv - 6 * p) px(32 - w, y, w * 2, 1, mousse);
      }
      px(18, bas, 28, 3, '#9aa1a8'); px(24, bas + 3, 16, 5, '#7a8088');
      for (let i = 0; i < 6 * p; i++) px(26 + (i * 5) % 14, niv + 8 + ((i * 17 + Math.floor(p * 40)) % Math.max(1, bas - niv - 10)), 1, 1, 'rgba(255,255,255,.6)');
      px(32 - larg(30) + 2, 24, 2, 40, 'rgba(255,255,255,.14)');
    };
    if (reduit) dessinVerre(1); else { const t0 = performance.now(); const f = (ts) => { const p = Math.min(1, (ts - t0) / 1600); dessinVerre(p); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }

    const med = note.medaille;
    const etoiles = Object.entries(e.etoiles).filter(([, v]) => v).map(([k]) => ({ sansAide: 'sans aide', expert: 'mode expert', gestes: 'gestes joués' }[k]));
    $('#verdict').innerHTML = `<span class="style">Jugée comme ${esc(res.style.style.nom)} · conformité ${Math.round(res.style.conformite * 100)} %</span>
      <span class="total">${nf(note.total, note.total % 1 ? 1 : 0)}<small>/50</small></span>
      <span class="medaille ${med || 'aucune'}">${med ? `Médaille ${med === 'or' ? "d'or" : med === 'argent' ? "d'argent" : 'de bronze'}` : 'Pas de médaille'}</span>
      ${etoiles.length ? `<span class="etoiles">${'★'.repeat(etoiles.length)} ${etoiles.join(' · ')}</span>` : ''}
      <span class="style">${sg(res.og)} → ${sg(res.fg)} · ${nf(res.abv)} % vol · ${nf(res.ibu, 0)} IBU · ${nf(res.ebc, 0)} EBC</span>`;

    // Radar aromatique
    const axes = [['malte', 'Malté'], ['caramel', 'Caramel'], ['torrefie', 'Torréfié'], ['amer', 'Amer'], ['houblon', 'Houblonné'], ['fruite', 'Fruité'], ['epice', 'Épicé'], ['corps', 'Corps']];
    const C = 110, Rr = 72;
    const pt = (k, v) => { const a = -Math.PI / 2 + (k / axes.length) * Math.PI * 2; return [C + Math.cos(a) * Rr * v, C + Math.sin(a) * Rr * v]; };
    const anneaux = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${axes.map((_, k) => pt(k, f).join(',')).join(' ')}" fill="none" stroke="var(--pierre)" stroke-width="1"/>`).join('');
    const rayons = axes.map((_, k) => `<line x1="${C}" y1="${C}" x2="${pt(k, 1)[0]}" y2="${pt(k, 1)[1]}" stroke="var(--pierre)" stroke-width="1"/>`).join('');
    const poly = axes.map(([cle], k) => pt(k, res.profil[cle] / 10).join(',')).join(' ');
    const libs = axes.map(([cle, lib], k) => { const [x, y] = pt(k, 1.22); return `<text x="${x}" y="${y}" fill="var(--calcaire)" font-size="11" font-family="Pixelify Sans, sans-serif" text-anchor="middle" dominant-baseline="middle">${lib} ${nf(res.profil[cle], 0)}</text>`; }).join('');
    $('#radar').innerHTML = `<svg viewBox="0 0 220 220" role="img" aria-label="Profil aromatique">${anneaux}${rayons}<polygon class="poly" points="${poly}" fill="rgba(243,176,74,.35)" stroke="var(--braise)" stroke-width="2"/>${libs}</svg>`;

    // Fiche de jury
    const L = note.lignes;
    const rang = [['aspect', 'Aspect', 3], ['arome', 'Arôme', 12], ['bouche', 'Bouche', 5], ['saveur', 'Saveur', 20], ['impression', 'Impression générale', 10]];
    $('#fiche-jury').innerHTML = `<h3>FICHE DE DÉGUSTATION</h3><table>${rang.map(([k, lib, max], i) => `<tr class="lent" style="animation-delay:${0.4 + i * 0.35}s"><td>${lib}</td><td>${nf(L[k], L[k] % 1 ? 1 : 0)} / ${max}</td></tr>`).join('')}
      <tr class="total lent" style="animation-delay:${0.4 + 5 * 0.35}s"><td>Total</td><td>${nf(note.total, note.total % 1 ? 1 : 0)} / 50</td></tr></table>`;

    // Défauts
    $('#degust-defauts').innerHTML = note.defauts.length ? `<h2 class="sous-titre">Défauts relevés</h2>` + note.defauts.map((d) => `<div class="defaut"><h3><span>${esc(d.nom)} <span class="en">${esc(d.en)}</span></span><span class="gravite" aria-label="Gravité ${d.gravite} sur 3">${'■'.repeat(d.gravite)}${'□'.repeat(3 - d.gravite)}</span></h3>
      ${d.detail ? `<p>${esc(d.detail)}</p>` : ''}<p>${esc(d.chimie)}</p><p class="conseil-d">${esc(d.conseil)}</p></div>`).join('') : '';

    // Gains et bilan de Lise
    const g = [];
    g.push(S.bac ? 'Bac à sable : ce brassin ne rapporte ni points ni écus.' : `<b>+${gain} points</b> de maîtrise et <b style="color:var(--or)">+${dernier.ecus} écus</b> · ${S.ecus} écus en bourse.`);
    if (palierMonte) g.push(`Nouveau niveau : le pigeonnier propose désormais ${PALIERS[palierAtteint()].txt}.`);
    (dernier.cadeaux || []).forEach((c) => g.push(`Découverte : ${esc(c)}`));
    if (res.notes && res.notes.length) $('#degust-defauts').insertAdjacentHTML('afterbegin', `<p class="notes-degust">Notes : ${res.notes.map((n) => `<b>${esc(n.source)}</b> ${esc(n.notes || '')}`).join(' · ')}</p>`);
    nouveaux.forEach((n) => g.push(`★ Succès : ${esc(n)}`));
    if (S.mode === 'debutant' && note.malus > 0.15) g.push(`Les gestes ont coûté environ ${nf(note.malus * 8, 0)} points sur la saveur et l'impression.`);
    $('#degust-gains').innerHTML = `<div class="gains">${g.map((x) => `<p>${x}</p>`).join('')}</div>`;
    $('#nom-cuvee').value = e.nom;
    $('#btn-rebrasser').textContent = 'Rebrasser en ajustant';

    const bilan = [];
    if (med === 'or') bilan.push('Une très belle bière, fidèle à son style.');
    else if (med) bilan.push(`Une bonne ${res.style.style.nom}.`);
    else bilan.push('Le jury reste sur sa faim, mais chaque brassin apprend quelque chose.');
    if (note.defauts.length) bilan.push(`Le défaut à corriger d'abord : ${note.defauts.slice().sort((a, b) => b.gravite - a.gravite)[0].nom.toLowerCase()}.`);
    const c = Moteur.conseils(res, e.recette).filter((x) => !/levure|Il manque/.test(x.txt));
    if (c.length) bilan.push(c[0].txt);
    if (note.attente < 0.7) bilan.push('Le profil aromatique ne correspond pas à ce qu\'on attend du style : regarde le radar.');
    setTimeout(() => { if (ecran === 'degustation' && !(S.tuto >= 0 && TUTO[S.tuto] && TUTO[S.tuto].ecran === 'degustation')) direLise(bilan.join(' ')); }, reduit ? 0 : 2400);
    setTimeout(() => son(med ? 'medaille' : 'rate'), reduit ? 0 : 2200);
    nouveaux.forEach((n, i) => setTimeout(() => toast('★ ' + n), 2600 + i * 900));
  }
  $('#nom-cuvee').addEventListener('change', (e) => { if (!dernier) return; dernier.entree.nom = e.target.value.trim() || dernier.entree.nom; sauver(); });
  $('#btn-rebrasser').addEventListener('click', () => { messageMentor = null; if (dernier && (dernier.type === 'edv' || dernier.type === 'wash')) { aller('distillerie'); return; } if (dernier) R = clone(dernier.entree.recette); onglet = 'cuve'; aller('brasserie'); });
  $('#btn-retour').addEventListener('click', () => { messageMentor = null; aller('domaine'); });

  // =====================================================================
  // Distillerie : Ulysse et Firmin
  // =====================================================================
  const DI = window.Distillerie;
  const FEUX = { douce: 0.35, moyenne: 0.55, vive: 0.85 };
  let choixBiere = null, sessionD = null;
  const reglagesD = () => (S.reglagesD = S.reglagesD || { recycler: true, feu: 'moyenne', tetesPct: 4, queuesDegre: 60 });
  const biereDistillable = (x) => x.type !== 'edv' && !x.distillee;

  function entrerDistillerie() {
    dessinerUlysse($('#ulysse').getContext('2d'));
    const bieres = S.carnet.filter(biereDistillable);
    if (choixBiere && !bieres.some((b) => b.id === choixBiere)) choixBiere = null;
    $('#dist-bieres').innerHTML = bieres.length ? bieres.map((b) => {
      const res = Moteur.calculer(b.recette);
      const notes = [];
      if (res.profil.houblon > 3) notes.push('arômes de houblon : les terpènes passent, l\'amertume reste dans la chaudière');
      if (res.profil.fruite > 4) notes.push('beaucoup d\'esters : eau-de-vie fruitée');
      if (b.defauts.some((d) => /alcools sup/i.test(d))) notes.push('alcools supérieurs : attention à la chaleur');
      if (res.levure && res.levure.fam === 'lager') notes.push('levure lager : composés soufrés, le cuivre en piégera une partie');
      if (b.defauts.some((d) => /infection/i.test(d))) notes.push('infection : beaucoup d\'acétate d\'éthyle dans les têtes');
      return `<button class="biere-carte" data-biere="${b.id}" aria-pressed="${choixBiere === b.id}">
        <span class="nom">${esc(b.nom)}</span><span class="lap">${nf(b.abv * 10, 0)} LAP</span>
        <span class="det">${esc(b.style)} · 1000 L à ${nf(b.abv)} % · ${b.type === 'wash' ? `${nf(b.total, b.total % 1 ? 1 : 0)}/20` : `${nf(b.total, b.total % 1 ? 1 : 0)}/50`} · donnera une ${nomEauDeVie(b).toLowerCase()}</span>
        ${notes.length ? `<span class="det">${esc(notes.join(' · '))}</span>` : ''}</button>`;
    }).join('') : '<p class="vide">Aucune bière à distiller. Brasse d\'abord à la brasserie : chaque bière du carnet peut passer une fois dans Ulysse.</p>';
    rendreReglagesD();
    $('#btn-distiller').disabled = !choixBiere;
  }
  $('#dist-bieres').addEventListener('click', (e) => {
    const b = e.target.closest('[data-biere]'); if (!b) return;
    choixBiere = b.dataset.biere; son('clic'); tuto('choix-biere'); entrerDistillerie();
  });
  function rendreReglagesD() {
    const rg = reglagesD(), ep = S.epaisses;
    const bascule = (cle, val, lib) => `<button data-rd="${cle}" data-val="${val}" aria-pressed="${String(rg[cle]) === String(val)}">${lib}</button>`;
    $('#dist-reglages').innerHTML = `
      <div class="reglage"><span class="lib">Recycler les épaisses</span><div class="bascule">${bascule('recycler', true, 'Oui')}${bascule('recycler', false, 'Non')}</div>
        <p>Têtes et queues repassent avec la prochaine bonne chauffe : plus d'alcool récupéré, un peu plus de congénères. En réserve : <b>${ep ? nf(ep.A, 1) + ' LAP' : 'rien'}</b>.</p></div>
      ${S.mode === 'expert' ? `
      <div class="reglage"><span class="lib">Chauffe</span><div class="bascule">${bascule('feu', 'douce', 'Douce')}${bascule('feu', 'moyenne', 'Moyenne')}${bascule('feu', 'vive', 'Vive')}</div>
        <p>Plus douce, plus de reflux dans le chapiteau : vapeur plus riche, séparation plus nette, mais une chauffe plus longue.</p></div>
      <div class="reglage"><label for="rd-tetes">Coupe des têtes <span class="val" id="v-tetes">${nf(rg.tetesPct)} %</span></label>
        <input type="range" id="rd-tetes" min="0.5" max="12" step="0.5" value="${rg.tetesPct}"><p>Part de l'alcool écartée au début de la bonne chauffe. Utilisée quand les gestes ne sont pas joués.</p></div>
      <div class="reglage"><label for="rd-queues">Coupe des queues <span class="val" id="v-queues">${rg.queuesDegre} %</span></label>
        <input type="range" id="rd-queues" min="40" max="72" step="1" value="${rg.queuesDegre}"><p>Degré au bec où le cœur s'arrête.</p></div>` : ''}`;
  }
  $('#dist-reglages').addEventListener('click', (e) => {
    const b = e.target.closest('[data-rd]'); if (!b) return;
    const v = b.dataset.val; reglagesD()[b.dataset.rd] = v === 'true' ? true : v === 'false' ? false : v;
    son('clic'); sauver(); rendreReglagesD();
  });
  $('#dist-reglages').addEventListener('input', (e) => {
    const rg = reglagesD();
    if (e.target.id === 'rd-tetes') { rg.tetesPct = +e.target.value; $('#v-tetes').textContent = nf(rg.tetesPct) + ' %'; }
    if (e.target.id === 'rd-queues') { rg.queuesDegre = +e.target.value; $('#v-queues').textContent = rg.queuesDegre + ' %'; }
    sauver();
  });

  function dessinerUlysse(c, t = 0, feu = 0.5) {
    const px = (x, y, w, h, k) => { c.fillStyle = k; c.fillRect(Math.round(x), Math.round(y), w, h); };
    const disque = (cx, cy, r, k) => { c.fillStyle = k; for (let y = -r; y <= r; y++) { const w = Math.round(Math.sqrt(r * r - y * y)); c.fillRect(Math.round(cx - w), Math.round(cy + y), w * 2 + 1, 1); } };
    px(0, 0, 96, 72, '#221912'); px(0, 60, 96, 12, '#3b2d22');
    px(6, 56, 84, 3, '#2a1d14'); disque(20, 62, 5, '#17110d'); disque(72, 62, 5, '#17110d'); disque(20, 62, 2, '#574332'); disque(72, 62, 2, '#574332');
    px(14, 40, 30, 16, '#574332');
    for (let i = 0; i < 6; i++) { const h = 3 + Math.abs(Math.sin(t * 9 + i * 1.7)) * 6 * feu; px(17 + i * 4, 52 - h, 3, h, i % 2 ? '#f3b04a' : '#e3593d'); }
    disque(29, 32, 12, '#c8743a'); px(20, 24, 6, 3, '#f0a060'); px(26, 18, 6, 4, '#c8743a'); disque(29, 16, 4, '#d27b3e');
    for (let i = 0; i < 26; i++) px(31 + i, 14 + i * 0.35, 2, 2, '#c8743a');
    px(56, 22, 16, 30, '#8a8f96'); px(58, 24, 12, 26, '#b9c0c8'); for (let j = 0; j < 4; j++) px(58, 27 + j * 6, 12, 1, '#8a8f96');
    px(70, 46, 8, 2, '#c8743a'); px(77, 47, 2, 5, '#c8743a');
    if (feu > 0.05) for (let i = 0; i < 3; i++) { const a = (t * 0.7 + i / 3) % 1; px(40 + Math.sin(a * 6 + i) * 3, 36 - a * 34, 3, 2, `rgba(200,200,200,${0.5 - a * 0.5})`); }
  }

  // Feu de bois : la flamme suit le combustible, la chaudière suit la flamme avec retard
  function nouveauFeu() { return { bois: 1.3, flamme: 0.5, P: 0.35 }; }
  function brulerFeu(f, dt) {
    f.bois = Math.max(0, f.bois - 0.1 * dt);
    f.flamme = borne(f.bois * 0.42, 0, 1);
    f.P += (f.flamme - f.P) * Math.min(1, dt * 0.7);
  }
  const ajouterBuche = (f) => { f.bois = Math.min(3, f.bois + 1); son('sac'); };
  function jaugesFeu(id, items) {
    $(id).innerHTML = items.map((j) => `<div class="jauge-feu"><span>${j.lib}</span><span class="barre">${j.zone ? `<i class="zone" style="left:${j.zone[0] * 100}%;width:${(j.zone[1] - j.zone[0]) * 100}%"></i>` : ''}<i class="niv" style="width:${borne(j.v, 0, 1) * 100}%;background:${j.coul}"></i></span><span class="val">${Math.round(j.v * 100)} %</span></div>`).join('');
  }

  $('#btn-distiller').addEventListener('click', () => {
    const b = S.carnet.find((x) => x.id === choixBiere); if (!b) return;
    const res = Moteur.calculer(b.recette);
    const q = DI.congeneresBiere(res, b.defauts);
    sessionD = { biere: b, res, q, prep: DI.preparerBrouillis(1000, b.abv, q), joue: S.mode === 'debutant' || S.gestesExpert, scoresFeu: [], incidents: { moussage: 0, coupDeFeu: 0 } };
    son('ok'); tuto('lancer-d');
    if (!sessionD.joue && S.tutoD >= 0 && S.tutoD < TUTO_D.length - 1) S.tutoD = TUTO_D.length - 1;
    if (sessionD.joue) { aller('brouillis'); preparerBrouillisGeste(); }
    else {
      const rg = reglagesD();
      sessionD.brouillis = DI.brouillis(sessionD.prep, 1, {});
      sessionD.repasse = DI.repasseAuto(chargeRepasse(), { feu: FEUX[rg.feu], tetesPct: rg.tetesPct, queuesDegre: rg.queuesDegre });
      finirDistillation();
    }
  });

  // ---- Brouillis ----
  function preparerBrouillisGeste() {
    const st = { t: 0, prog: 0, mousse: 0, chaud: 0, dans: 0, duree: 0, feu: nouveauFeu() };
    const DUREE = 24;
    $('#bro-consigne').innerHTML = `${esc(sessionD.biere.nom)} : 1000 L à ${nf(sessionD.biere.abv)} %, en deux chauffes de 500 L. Nourris le feu pour épuiser la bière en moins de 24 secondes, sans la faire mousser.`;
    $('#bro-bilan').hidden = true; $('#bro-pied').hidden = false; $('#bro-go').disabled = false;
    const btn = $('#bro-buche'); btn.disabled = true;
    const ctx = $('#bro-canvas').getContext('2d');
    const dessin = () => {
      const px = (x, y, w, h, k) => { ctx.fillStyle = k; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      px(0, 0, 192, 120, '#221912');
      px(24, 90, 70, 22, '#574332');
      for (let i = 0; i < 10; i++) { const h = 4 + Math.abs(Math.sin(st.t * 9 + i * 1.3)) * 14 * st.feu.flamme; px(28 + i * 6, 104 - h, 4, h, i % 2 ? '#f3b04a' : '#e3593d'); }
      for (let i = 0; i < Math.round(st.feu.bois * 2); i++) px(30 + i * 9, 104, 8, 4, '#7a4a28');
      for (let y = 28; y < 90; y++) { const w = 32 - Math.abs(y - 58) * 0.18; px(59 - w, y, w * 2, 1, y % 6 ? '#d27b3e' : '#b9652f'); }
      // Hublot : bière et mousse
      px(48, 40, 22, 40, '#2a1d14');
      const niv = 76 - (1 - st.prog) * 26;
      px(49, niv, 20, 79 - niv, couleur(sessionD.biere.ebc));
      const hm = st.mousse * 34; px(49, Math.max(41, niv - hm), 20, Math.min(hm, niv - 41), '#f4ecd8');
      px(49, 41, 20, 1, st.mousse > 0.8 ? '#e3593d' : '#2a1d14');
      // Col de cygne, serpentin et éprouvette
      for (let i = 0; i < 70; i++) px(60 + i, 26 - Math.min(i, 14) * 0.6 + Math.max(0, i - 50) * 0.5, 3, 2, '#c8743a');
      px(128, 30, 30, 56, '#8a8f96'); px(131, 33, 24, 50, '#7fb6d6'); for (let j = 0; j < 5; j++) px(131, 38 + j * 9, 24, 1, '#5a8aa8');
      px(150, 86, 3, 8, '#c8743a');
      if (st.t > 0 && st.prog < 1) for (let i = 0; i < 3; i++) px(151, 95 + ((st.t * 30 + i * 4) % 8), 1, 2, '#ecdfc4');
      px(140, 96, 24, 18, 'rgba(236,223,196,.25)'); px(141, 114 - st.prog * 17, 22, st.prog * 17, 'rgba(236,223,196,.75)');
    };
    const infos = () => {
      const i = Math.round(st.prog * (sessionD.prep.pas.length - 1)), pas = sessionD.prep.pas[i];
      $('#bro-infos').innerHTML = infoBloc(nf(pas.degre, 0) + '%', 'au bec') + infoBloc(nf(pas.A, 0), 'LAP recueillis') + infoBloc(Math.max(0, Math.ceil(DUREE - st.t)) + 's', 'restantes');
      jaugesFeu('#bro-jauges', [
        { lib: 'Feu', v: st.feu.P, zone: [0.4, 0.8], coul: st.feu.P > 0.88 ? 'var(--alerte)' : 'var(--braise)' },
        { lib: 'Mousse', v: st.mousse, coul: st.mousse > 0.7 ? 'var(--alerte)' : 'var(--calcaire)' },
        { lib: 'Bière', v: 1 - st.prog, coul: couleur(sessionD.biere.ebc) },
      ]);
    };
    dessin(); infos();
    btn.onclick = () => ajouterBuche(st.feu);
    $('#bro-go').onclick = () => {
      $('#bro-go').disabled = true; btn.disabled = false;
      let fini = false;
      arretGeste = bouclePendant(DUREE, (dt, t) => {
        if (fini) return;
        st.t = t; brulerFeu(st.feu, dt);
        const P = st.feu.P;
        st.prog = Math.min(1, st.prog + 0.072 * Math.pow(P, 0.9) * dt);
        if (st.prog < 0.4 && P > 0.66) st.mousse += (P - 0.66) * 1.5 * dt; else st.mousse = Math.max(0, st.mousse - 0.35 * dt);
        if (st.mousse >= 1) { st.mousse = 0.35; sessionD.incidents.moussage++; son('rate'); toast('Moussage : la bière est montée dans le col de cygne.'); }
        if (P > 0.88) { st.chaud += dt; if (st.chaud > 1.5) { st.chaud = 0; sessionD.incidents.coupDeFeu++; son('rate'); toast('Coup de feu : le fond de la chaudière accroche.'); } } else st.chaud = Math.max(0, st.chaud - dt);
        st.duree += dt; if (P >= 0.4 && P <= 0.8) st.dans += dt;
        dessin(); infos();
        if (st.prog >= 1) { fini = true; arretGeste && arretGeste(); terminer(); }
      }, () => { if (!fini) { fini = true; terminer(); } });
    };
    const terminer = () => {
      btn.disabled = true;
      const inc = sessionD.incidents;
      const score = borne(st.dans / Math.max(1, st.duree) - 0.25 * (inc.moussage + inc.coupDeFeu), 0, 1);
      sessionD.scoresFeu.push(score);
      const chimie = S.mode === 'expert';
      sessionD.brouillis = DI.brouillis(sessionD.prep, st.prog, chimie ? { moussage: inc.moussage > 0, coupDeFeu: inc.coupDeFeu } : {});
      const b = sessionD.brouillis;
      const lignes = [`<span class="gros">${nf(b.V, 0)} L</span> de brouillis à ${nf(b.degre)} %`,
        `${Math.round(b.recuperation * 100)} % de l'alcool de la bière récupéré${st.prog < 1 ? ' : le feu était trop faible pour tout épuiser' : ''}.`];
      if (inc.moussage) lignes.push(`Moussage : ${inc.moussage} fois. ${chimie ? 'De la bière est passée dans le brouillis.' : 'Malus de dégustation.'}`);
      if (inc.coupDeFeu) lignes.push(`Coups de feu : ${inc.coupDeFeu}. ${chimie ? 'Le furfural monte.' : 'Malus de dégustation.'}`);
      if (!inc.moussage && !inc.coupDeFeu) lignes.push('Chauffe propre, sans incident.');
      son(score > 0.6 ? 'ok' : 'rate');
      bilanGeste('bro', lignes, 'Passer à la bonne chauffe');
      $('#bro-suite').onclick = () => { tuto('fin:brouillis'); aller('repasse'); preparerRepasse(); };
    };
    $('#bro-passer').onclick = () => {
      arretGeste && arretGeste(); sessionD.scoresFeu.push(0.5);
      sessionD.brouillis = DI.brouillis(sessionD.prep, 1, {});
      tuto('fin:brouillis'); aller('repasse'); preparerRepasse();
    };
  }

  // Charge de la bonne chauffe : brouillis + épaisses recyclées (dans la limite de 500 L)
  function chargeRepasse() {
    const b = sessionD.brouillis, ch = { V: b.V, A: b.A, Q: { ...b.Q } };
    sessionD.recyclees = 0;
    if (reglagesD().recycler && S.epaisses && S.epaisses.A > 0) {
      const part = Math.min(1, Math.max(0, (500 - ch.V) / S.epaisses.V));
      ch.V += S.epaisses.V * part; ch.A += S.epaisses.A * part;
      for (const k of DI.CLES) ch.Q[k] += (S.epaisses.Q[k] || 0) * part;
      sessionD.recyclees = S.epaisses.A * part;
      sessionD.resteEpaisses = part < 1 ? { V: S.epaisses.V * (1 - part), A: S.epaisses.A * (1 - part), Q: Object.fromEntries(DI.CLES.map((k) => [k, (S.epaisses.Q[k] || 0) * (1 - part)])) } : null;
    }
    return ch;
  }

  // ---- Bonne chauffe et coupes ----
  function preparerRepasse() {
    const charge = chargeRepasse();
    const r = DI.nouvelleRepasse(charge);
    sessionD.repasse = r;
    const st = { t: 0, dans: 0, duree: 0, feu: nouveauFeu() };
    const DUREE = 55, expertVue = S.mode === 'expert';
    $('#rep-consigne').innerHTML = `Charge : ${nf(charge.V, 0)} L à ${nf((charge.A / charge.V) * 100)} %${sessionD.recyclees ? `, dont ${nf(sessionD.recyclees, 1)} LAP d'épaisses recyclées` : ''}. Coupe deux fois : des têtes au cœur, puis du cœur aux queues.`
      + (expertVue ? `<br><small>Courbes au bec, en multiples du seuil de perception (échelle log) : <b style="color:#e3593d">têtes</b> · <b style="color:#f3b04a">esters</b> · <b style="color:#9cc95e">houblon</b> · <b style="color:#d9c7a0">céréale</b> · <b style="color:#8f7ad0">queues</b> · <b style="color:#b9865a">furfural</b> · trait clair : degré. En abscisse, l'alcool recueilli.</small>` : '');
    $('#rep-bilan').hidden = true; $('#rep-pied').hidden = false; $('#rep-go').disabled = false;
    const btnB = $('#rep-buche'), btnC = $('#rep-couper');
    btnB.disabled = btnC.disabled = true;
    const libCoupe = () => { btnC.innerHTML = r.phase === 0 ? 'Couper<small>têtes → cœur</small>' : r.phase === 1 ? 'Couper<small>cœur → queues</small>' : 'Arrêter la chauffe<small>queues aux épaisses</small>'; };
    libCoupe();
    const ctx = $('#rep-canvas').getContext('2d');
    const COUL = { tetes: '#e3593d', esters: '#f3b04a', terpenes: '#9cc95e', cereale: '#d9c7a0', queues: '#8f7ad0', furfural: '#b9865a' };
    const dessin = () => {
      const px = (x, y, w, h, k) => { ctx.fillStyle = k; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      px(0, 0, 192, 120, '#221912');
      if (expertVue) {
        // Courbes des congénères au bec (échelle logarithmique) et degré
        const gx = 22, gw = 164, gy = 6, gh = 100;
        px(gx, gy, gw, gh, '#17110d');
        [0.25, 0.5, 0.75].forEach((f) => px(gx + f * gw, gy, 1, gh, '#2c2118'));
        const Y = (v) => gy + gh - borne((Math.log10(Math.max(v, 0.01)) + 2) / 4, 0, 1) * gh;
        const Yd = (d) => gy + gh - (d / 100) * gh;
        r.coupes.forEach((c) => px(gx + c.recup * gw, gy, 2, gh, '#ecdfc4'));
        r.courbe.forEach((p) => {
          const x = gx + p.recup * gw;
          for (const k in COUL) px(x, Y(p[k]), 2, 2, COUL[k]);
          px(x, Yd(p.degre), 2, 1, '#ecdfc4');
        });

      } else {
        dessinerUlysse(ctx, st.t, st.feu.flamme);
        // Éprouvette et alcoomètre
        const d = r.dernier ? r.dernier.degre : 0;
        px(118, 20, 26, 90, '#3b2d22'); px(121, 23, 20, 84, 'rgba(236,223,196,.35)');
        px(130, 104 - d * 0.8, 3, d * 0.8, '#ecdfc4'); px(127, 104 - d * 0.8 - 6, 9, 6, '#ecdfc4');
        for (let g = 40; g <= 80; g += 10) px(146, 104 - g * 0.8, g === 60 ? 8 : 5, 1, g === 60 ? '#f3b04a' : '#ab9a7f');
        // Trois récipients : têtes, cœur, queues ; celui qui se remplit est éclairé
        const teintes = ['#e3593d', '#9cc95e', '#8f7ad0'];
        r.fractions.forEach((f, i) => {
          const x = 158 + i * 11, h = Math.min(40, f.V * 1.2);
          px(x, 62, 9, 44, '#3b2d22'); px(x + 1, 105 - h, 7, h, i === r.phase ? teintes[i] : 'rgba(236,232,220,.4)');
          if (i === r.phase) px(x, 58, 9, 2, teintes[i]);
        });
      }
    };
    const PHASES = ['Têtes', 'Cœur', 'Queues'];
    const infos = () => {
      const d = r.dernier;
      $('#rep-infos').innerHTML = infoBloc(d ? nf(d.degre, 0) + '%' : '—', 'au bec') + infoBloc(PHASES[r.phase], 'fraction') + infoBloc(Math.round((d ? d.recup : 0) * 100) + '%', 'alcool recueilli');
      jaugesFeu('#rep-jauges', [{ lib: 'Feu', v: st.feu.P, zone: [0.3, 0.7], coul: 'var(--braise)' }]);
      if (d && d.nez.length) {
        const forts = d.nez.filter((x) => x.v > 1).slice(0, 2);
        $('#rep-nez').innerHTML = forts.length ? 'Au nez : ' + forts.map((x) => `<b>${esc(DI.CONGENERES[x.k].nez)}</b>${x.v > 8 ? ' (fort)' : ''}`).join(', puis ') : 'Au nez : propre, discret.';
      }
      const c = $('#rep-conseil');
      if (S.aide && d) {
        const top = d.nez[0] ? d.nez[0].k : null, tet = (d.nez.find((x) => x.k === 'tetes') || { v: 0 }).v, que = (d.nez.find((x) => x.k === 'queues') || { v: 0 }).v;
        let txt = null;
        if (r.phase === 0) txt = tet > 15 ? 'Ça sent encore la colle. Patience.' : tet > 2 ? 'Les têtes faiblissent…' : 'Les têtes sont passées, ça sent le fruit propre : coupe pour le cœur !';
        else if (r.phase === 1) txt = que > 1.8 || d.degre < 60 ? 'Le carton mouillé arrive et le degré tombe : coupe les queues.' : d.degre < 63 ? 'Le degré baisse. Garde le nez sur les queues.' : top === 'soufre' ? 'Encore un peu de soufre : le cuivre travaille.' : 'Beau cœur. Laisse couler.';
        else txt = 'Les queues partent aux épaisses. Arrête quand tu veux, ou laisse finir sous 8 %.';
        c.hidden = false; c.innerHTML = `<b>Firmin :</b> ${esc(txt)}`;
      } else c.hidden = true;
    };
    dessin(); infos();
    btnB.onclick = () => ajouterBuche(st.feu);
    let fini = false;
    const terminer = () => {
      if (fini) return; fini = true;
      arretGeste && arretGeste();
      btnB.disabled = btnC.disabled = true;
      if (r.phase === 0) DI.couper(r);
      sessionD.scoresFeu.push(borne(st.dans / Math.max(1, st.duree), 0, 1));
      const bl = DI.bilan(r);
      const ligne = (lib, f) => `<tr><td>${lib}</td><td>${nf(f.V, 1)} L</td><td>${nf(f.degre, 0)} %</td><td>${nf(f.lap, 1)}</td></tr>`;
      const lapBiere = sessionD.biere.abv * 10;
      son('ok');
      bilanGeste('rep', [
        `<span class="gros">${nf(bl.coeur.V, 1)} L</span> de cœur à ${nf(bl.coeur.degre, 1)} %`,
        `<div class="tableau-wrap"><table class="tableau-fractions"><tr><th>Fraction</th><th>Volume</th><th>Degré</th><th>LAP</th></tr>${ligne('Têtes', bl.tetes)}${ligne('Cœur', bl.coeur)}${ligne('Queues', bl.queues)}</table></div>`,
        `Rendement : ${Math.round((bl.coeur.lap / lapBiere) * 100)} % de l'alcool de la bière en cœur. ${nf(bl.restant, 1)} LAP restés dans la chaudière.`,
      ], 'Goûter les fractions');
      $('#rep-suite').onclick = () => { tuto('fin:repasse'); preparerAveugle(); };
    };
    btnC.onclick = () => {
      if (r.phase < 2) { DI.couper(r); son('bulle'); libCoupe(); infos(); }
      else terminer();
    };
    $('#rep-go').onclick = () => {
      $('#rep-go').disabled = true; btnB.disabled = btnC.disabled = false;
      $('#rep-pied').hidden = true;
      arretGeste = bouclePendant(DUREE, (dt, t) => {
        if (fini) return;
        st.t = t; brulerFeu(st.feu, dt);
        DI.pasRepasse(r, st.feu.P, dt);
        st.duree += dt; if (st.feu.P >= 0.3 && st.feu.P <= 0.7) st.dans += dt;
        dessin(); infos();
        if (r.fini) terminer();
      }, terminer);
    };
    $('#rep-passer').onclick = () => {
      arretGeste && arretGeste(); sessionD.scoresFeu.push(0.5);
      const rg = reglagesD();
      sessionD.repasse = DI.repasseAuto(charge, { feu: 0.55, tetesPct: rg.tetesPct, queuesDegre: rg.queuesDegre });
      tuto('fin:repasse'); preparerAveugle();
    };
  }

  // ---- Dégustation à l'aveugle des fractions ----
  function preparerAveugle() {
    const r = sessionD.repasse;
    const fr = r.fractions.map((f, i) => ({ i, f })).filter((x) => x.f.A > 0.05);
    if (fr.length < 3) { finirDistillation(); return; }
    const ordre = [0, 1, 2].sort(() => Math.random() - 0.5);
    sessionD.aveugle = { ordre, reponses: [null, null, null], bons: 0 };
    aller('aveugle');
    const NOMS = ['Têtes', 'Cœur', 'Queues'];
    $('#aveugle-verres').innerHTML = ordre.map((iFr, k) => {
      const odeurs = DI.descripteurs(r.fractions[iFr]);
      return `<div class="verre-a" id="verre-a-${k}"><canvas width="10" height="15" data-iverre="${k}"></canvas><span class="lettre">${'ABC'[k]}</span>
        <span class="odeurs">${odeurs.map((o) => `${esc(o.odeur)} <small>(${o.force})</small>`).join('<br>') || 'presque rien'}</span>
        <div class="choix">${NOMS.map((n, j) => `<button data-av="${k}:${j}" aria-pressed="false">${n}</button>`).join('')}</div><span class="reponse"></span></div>`;
    }).join('');
    $$('#aveugle-verres canvas').forEach((cv) => {
      const c = cv.getContext('2d'); const px = (x, y, w, h, k) => { c.fillStyle = k; c.fillRect(x, y, w, h); };
      px(1, 0, 1, 9, '#9aa1a8'); px(8, 0, 1, 9, '#9aa1a8'); px(2, 4, 6, 5, 'rgba(236,232,220,.85)'); px(2, 9, 6, 1, '#9aa1a8'); px(4, 10, 2, 3, '#9aa1a8'); px(2, 13, 6, 1, '#9aa1a8');
    });
    $('#aveugle-bilan').hidden = true;
    $('#aveugle-valider').disabled = true; $('#aveugle-valider').textContent = 'Valider';
    $('#aveugle-valider').onclick = () => {
      const a = sessionD.aveugle;
      if (a.valide) { finirDistillation(); return; }
      a.valide = true;
      ordre.forEach((iFr, k) => {
        const ok = a.reponses[k] === iFr; if (ok) a.bons++;
        const el = $('#verre-a-' + k); el.classList.add(ok ? 'juste' : 'faux');
        el.querySelector('.reponse').textContent = NOMS[iFr];
        $$('button', el).forEach((b) => { b.disabled = true; });
      });
      son(a.bons === 3 ? 'medaille' : a.bons ? 'ok' : 'rate');
      $('#aveugle-bilan').hidden = false;
      $('#aveugle-bilan').innerHTML = `<p><span class="gros">${a.bons} / 3</span> ${a.bons === 3 ? 'Un nez de bouilleur.' : a.bons ? 'Pas mal.' : 'Le nez se travaille.'}</p><p>Têtes : solvant et colle. Cœur : fruit, céréale, houblon. Queues : carton mouillé, savon, amande grillée.</p>`;
      $('#aveugle-valider').textContent = 'Présenter au jury';
      tuto('fin:aveugle');
    };
    $('#aveugle-passer').onclick = () => { sessionD.aveugle = null; tuto('fin:aveugle'); finirDistillation(); };
  }
  $('#aveugle-verres').addEventListener('click', (e) => {
    const b = e.target.closest('[data-av]'); if (!b || b.disabled) return;
    const [k, j] = b.dataset.av.split(':').map(Number);
    sessionD.aveugle.reponses[k] = j; son('clic');
    $$(`#verre-a-${k} [data-av]`).forEach((x) => x.setAttribute('aria-pressed', x === b));
    $('#aveugle-valider').disabled = sessionD.aveugle.reponses.some((x) => x == null);
  });

  // ---- Fin de la distillation : jury, carnet, épaisses ----
  function finirDistillation() {
    const r = sessionD.repasse, b = sessionD.biere;
    const scoreFeu = sessionD.scoresFeu.length ? sessionD.scoresFeu.reduce((a, x) => a + x, 0) / sessionD.scoresFeu.length : null;
    const note = DI.noterEDV(r, { mode: S.mode, scoreFeu: S.mode === 'debutant' ? scoreFeu : null, entrainement: S.mode === 'expert' && sessionD.brouillis.entrainement });
    const bl = DI.bilan(r);
    const lapBiere = b.abv * 10, rendement = bl.coeur.lap / lapBiere;
    // Épaisses : têtes et queues mises de côté pour la prochaine chauffe
    const ep = { V: 0, A: 0, Q: Object.fromEntries(DI.CLES.map((k) => [k, 0])) };
    for (const f of [r.fractions[0], r.fractions[2], ...(sessionD.resteEpaisses ? [sessionD.resteEpaisses] : [])]) { ep.V += f.V; ep.A += f.A; for (const k of DI.CLES) ep.Q[k] += f.Q[k] || 0; }
    if (!reglagesD().recycler && S.epaisses) { ep.V += S.epaisses.V; ep.A += S.epaisses.A; for (const k of DI.CLES) ep.Q[k] += S.epaisses.Q[k] || 0; }
    S.epaisses = ep.A > 0.05 ? ep : null;
    b.distillee = true;
    const expertJoue = S.mode === 'expert' && sessionD.joue;
    const etoiles = { sansAide: !S.aide, expert: S.mode === 'expert', gestes: expertJoue };
    const nbEtoiles = Object.values(etoiles).filter(Boolean).length;
    const aveugle = sessionD.aveugle && sessionD.aveugle.valide ? sessionD.aveugle.bons : null;
    const gain = S.bac || !note ? 0 : Math.round(note.total) + (note.medaille ? 5 * nbEtoiles : 0) + Math.round(10 * rendement) + 2 * (aveugle || 0);
    const palierAvant = palierAtteint();
    S.points += gain; S.brassins++;
    const entree = {
      id: Date.now().toString(36), type: 'edv', date: new Date().toISOString(), nom: `${nomEauDeVie(b)} · ${b.nom}`,
      style: nomEauDeVie(b), biere: b.nom, total: note ? note.total : 0, lignes: note ? note.lignes : null, medaille: note ? note.medaille : null,
      etoiles, defauts: note ? note.defauts.map((d) => d.nom) : [], coeur: bl.coeur, rendement, aveugle, mode: S.mode, bac: S.bac, gain,
      ebc: 0, abv: bl.coeur.degre, coupes: r.coupes, incidents: { ...sessionD.incidents }, recyclees: sessionD.recyclees || 0,
    };
    S.carnet.unshift(entree);
    const nouveaux = verifierSuccesD(entree, note);
    dernier = { ecus: gagnerEcus(note ? Math.round(note.total / 2) + (BONUS_MEDAILLE[note.medaille] || 0) + Math.round(10 * rendement) + 2 * (aveugle || 0) : 0) };
    dernier.cadeaux = verifierDecouvertes('edv', { entree, note });
    sauver(); majEntete();
    dernier = { ...dernier, type: 'edv', entree, note, bl, gain, rendement, palierMonte: palierAtteint() > palierAvant, nouveaux, r };
    aller('degustation');
    rendreDegustationEDV();
  }
  function verifierSuccesD(e, note) {
    const gagne = [];
    const ok = (id, cond) => { if (cond && !S.succes[id]) { S.succes[id] = e.date; gagne.push(SUCCES.find((x) => x.id === id).nom); } };
    if (S.bac) return gagne;
    ok('goutte', true);
    ok('nez', e.aveugle === 3);
    ok('chauffe', sessionD.joue && !e.incidents.moussage && !e.incidents.coupDeFeu);
    ok('coeurnet', !!(note && note.medaille && note.defauts.length === 0));
    ok('econome', e.rendement >= 0.7 && !!(note && note.medaille));
    ok('bouilleur', !!(note && note.medaille === 'or'));
    return gagne;
  }

  function rendreDegustationEDV() {
    const { entree: e, note, bl, gain, rendement, palierMonte, nouveaux } = dernier;
    // Verre tulipe d'eau-de-vie, avec ses larmes
    const ctx = $('#verre').getContext('2d');
    const dessin = (p) => {
      const px = (x, y, w, h, k) => { ctx.fillStyle = k; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
      ctx.clearRect(0, 0, 64, 96); px(0, 0, 64, 96, '#221912');
      const larg = (y) => (y < 30 ? 9 + (y - 10) * 0.25 : 14 - Math.abs(y - 44) * 0.0 - Math.max(0, y - 44) * 0.5);
      for (let y = 10; y < 62; y++) {
        const w = Math.max(1, larg(y));
        px(32 - w - 1, y, 1, 1, '#9aa1a8'); px(32 + w, y, 1, 1, '#9aa1a8');
        if (y > 62 - 14 * p) px(32 - w, y, w * 2, 1, e.medaille || note ? 'rgba(236,232,220,.8)' : 'rgba(236,232,220,.5)');
      }
      for (let i = 0; i < 3; i++) px(24 + i * 6, 26 + ((i * 7 + Math.floor(p * 20)) % 14), 1, 4, 'rgba(236,232,220,.5)');
      px(31, 62, 2, 20, '#9aa1a8'); px(22, 82, 20, 3, '#9aa1a8');
    };
    if (reduit) dessin(1); else { const t0 = performance.now(); const f = (ts) => { const p = Math.min(1, (ts - t0) / 1400); dessin(p); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }
    const med = note && note.medaille;
    const etoiles = Object.entries(e.etoiles).filter(([, v]) => v).map(([k]) => ({ sansAide: 'sans aide', expert: 'mode expert', gestes: 'gestes joués' }[k]));
    $('#verdict').innerHTML = `<span class="style">Eau-de-vie de bière · ${esc(e.biere)}</span>
      <span class="total">${note ? nf(note.total, note.total % 1 ? 1 : 0) : '—'}<small>/50</small></span>
      <span class="medaille ${med || 'aucune'}">${!note || !note.presentable ? 'Trop peu pour le jury' : med ? `Médaille ${med === 'or' ? "d'or" : med === 'argent' ? "d'argent" : 'de bronze'}` : 'Pas de médaille'}</span>
      ${etoiles.length && med ? `<span class="etoiles">${'★'.repeat(etoiles.length)} ${etoiles.join(' · ')}</span>` : ''}
      <span class="style">${nf(bl.coeur.V, 1)} L de cœur à ${nf(bl.coeur.degre, 1)} % · ${nf(bl.coeur.lap, 1)} LAP · rendement ${Math.round(rendement * 100)} %</span>`;
    if (!note) { $('#radar').innerHTML = ''; $('#fiche-jury').innerHTML = '<p>Le cœur est vide : rien à présenter.</p>'; }
    else {
      const axes = [['fruite', 'Fruité'], ['houblon', 'Houblon'], ['cereale', 'Céréale'], ['chaleur', 'Chaleur'], ['solvant', 'Solvant'], ['soufre', 'Soufre'], ['gras', 'Gras'], ['brule', 'Brûlé']];
      $('#radar').innerHTML = radarSVG(axes, note.profil);
      const L = note.lignes;
      const rang = [['aspect', 'Aspect et limpidité', 5], ['nez', 'Nez', 15], ['bouche', 'Bouche', 15], ['finale', 'Finale', 10], ['harmonie', 'Harmonie', 5]];
      $('#fiche-jury').innerHTML = `<h3>FICHE DE DÉGUSTATION · EAU-DE-VIE</h3><table>${rang.map(([k, lib, max], i) => `<tr class="lent" style="animation-delay:${0.4 + i * 0.35}s"><td>${lib}</td><td>${nf(L[k], L[k] % 1 ? 1 : 0)} / ${max}</td></tr>`).join('')}
        <tr class="total lent" style="animation-delay:${0.4 + 5 * 0.35}s"><td>Total</td><td>${nf(note.total, note.total % 1 ? 1 : 0)} / 50</td></tr></table>`;
    }
    $('#degust-defauts').innerHTML = note && note.defauts.length ? `<h2 class="sous-titre">Défauts relevés</h2>` + note.defauts.map((d) => `<div class="defaut"><h3><span>${esc(d.nom)} <span class="en">${esc(d.en)}</span></span><span class="gravite">${'■'.repeat(d.gravite)}${'□'.repeat(3 - d.gravite)}</span></h3>${d.detail ? `<p>${esc(d.detail)}</p>` : ''}<p>${esc(d.chimie)}</p><p class="conseil-d">${esc(d.conseil)}</p></div>`).join('') : '';
    const g = [];
    g.push(S.bac ? 'Bac à sable : cette chauffe ne rapporte ni points ni écus.' : `<b>+${gain} points</b> de maîtrise, dont ${Math.round(10 * rendement)} pour le rendement${e.aveugle != null ? ` et ${2 * e.aveugle} pour l'aveugle` : ''}, et <b style="color:var(--or)">+${dernier.ecus} écus</b> · ${S.ecus} en bourse.`);
    (dernier.cadeaux || []).forEach((c) => g.push(`Découverte : ${esc(c)}`));
    if (/malt|grain/.test(e.style)) g.push('C\'est un « new make » : il faudra au moins trois ans en fût de chêne de 700 L au plus pour qu\'il ait droit au nom de whisky (règlement UE 2019/787).');
    g.push(S.epaisses ? `Épaisses en réserve : ${nf(S.epaisses.A, 1)} LAP pour la prochaine bonne chauffe.` : 'Aucune épaisse en réserve.');
    if (palierMonte) g.push(`Nouveaux ingrédients débloqués : ${PALIERS[palierAtteint()].txt}.`);
    nouveaux.forEach((n) => g.push(`★ Succès : ${esc(n)}`));
    if (note && note.malus > 0.15) g.push(`La conduite du feu a coûté environ ${nf(note.malus * 5, 0)} points.`);
    $('#degust-gains').innerHTML = `<div class="gains">${g.map((x) => `<p>${x}</p>`).join('')}</div>`;
    $('#nom-cuvee').value = e.nom;
    $('#btn-rebrasser').textContent = 'Retour à l\'alambic';
    const bilan = [];
    if (!note || !note.presentable) bilan.push('Le cœur est trop maigre. Coupe les queues plus tard la prochaine fois.');
    else if (med === 'or') bilan.push('Ça, c\'est une eau-de-vie. Lise sera jalouse.');
    else if (med) bilan.push('Une eau-de-vie honnête.');
    else bilan.push('On ne gagne pas à tous les coups. Le cuivre pardonne beaucoup, pas tout.');
    if (note && note.defauts.length) bilan.push(`À corriger d'abord : ${note.defauts.slice().sort((a, b) => b.gravite - a.gravite)[0].conseil}`);
    if (rendement < 0.5 && note && note.presentable) bilan.push('Ton cœur est serré : propre, mais tu laisses beaucoup d\'alcool aux épaisses.');
    if (sessionD.res.profil.houblon > 3) bilan.push('Les arômes du houblon sont passés ; l\'amertume, elle, est restée dans la chaudière : les iso-acides alpha ne distillent pas.');
    setTimeout(() => { if (ecran === 'degustation' && !(S.tutoD >= 0 && TUTO_D[S.tutoD] && TUTO_D[S.tutoD].ecran === 'degustation')) direLise(bilan.join(' ')); }, reduit ? 0 : 2400);
    setTimeout(() => son(med ? 'medaille' : 'rate'), reduit ? 0 : 2200);
    nouveaux.forEach((n, i) => setTimeout(() => toast('★ ' + n), 2600 + i * 900));
  }

  function radarSVG(axes, profil) {
    const C = 110, Rr = 72;
    const pt = (k, v) => { const a = -Math.PI / 2 + (k / axes.length) * Math.PI * 2; return [C + Math.cos(a) * Rr * v, C + Math.sin(a) * Rr * v]; };
    const anneaux = [0.25, 0.5, 0.75, 1].map((f) => `<polygon points="${axes.map((_, k) => pt(k, f).join(',')).join(' ')}" fill="none" stroke="var(--pierre)" stroke-width="1"/>`).join('');
    const rayons = axes.map((_, k) => `<line x1="${C}" y1="${C}" x2="${pt(k, 1)[0]}" y2="${pt(k, 1)[1]}" stroke="var(--pierre)" stroke-width="1"/>`).join('');
    const poly = axes.map(([cle], k) => pt(k, Math.max(0.04, profil[cle] / 10)).join(',')).join(' ');
    const libs = axes.map(([cle, lib], k) => { const [x, y] = pt(k, 1.22); return `<text x="${x}" y="${y}" fill="var(--calcaire)" font-size="11" font-family="Pixelify Sans, sans-serif" text-anchor="middle" dominant-baseline="middle">${lib} ${nf(profil[cle], 0)}</text>`; }).join('');
    return `<svg viewBox="0 0 220 220" role="img" aria-label="Profil aromatique">${anneaux}${rayons}<polygon class="poly" points="${poly}" fill="rgba(243,176,74,.35)" stroke="var(--braise)" stroke-width="2"/>${libs}</svg>`;
  }

  // =====================================================================
  // Pigeonnier : catalogue, découvertes, grimoire
  // =====================================================================
  let catOnglet = 'cereales', catFiltre = 'achat', catRecherche = '';
  const CATEGORIES = {
    cereales: { lib: 'Céréales', liste: () => D.malts, det: (m) => `<b>${nf(m.ebc, 0)} EBC</b> · ${FAMILLES[m.fam]} · extrait ${m.rend} %${m.dp ? ` · ${m.dp} °Lintner` : ''}${m.gel ? ` · gélatinise vers ${m.gel} °C` : ''}${m.saveurs ? ` · ${esc(m.saveurs)}` : ''}` },
    houblons: { lib: 'Houblons', liste: () => D.houblons, det: (h) => `<b>α ${nf(h.amin)}–${nf(h.amax)} %</b> · ${esc(h.pays)} · ${esc(h.aromes || '')}${h.oils && h.oils.myr != null ? ` · myrcène ${h.oils.myr} %, humulène ${h.oils.hum} %` : ''}` },
    levures: { lib: 'Levures', liste: () => D.levures, det: (y) => `<b>${{ ale: 'Ale', lager: 'Lager', specialty: 'Spéciale', distilling: 'Distillerie' }[y.fam]}</b> · ${y.att[0]}–${y.att[1]} % · ${y.t[0]}–${y.t[1]} °C · tolère ${y.tol} % · ${esc(y.desc || '')}` },
    eau: { lib: 'Sels', liste: () => D.sels, det: (x) => esc(x.note) },
    aromates: { lib: 'Aromates', liste: () => D.aromates, det: (a) => `<b>${esc(a.notes)}</b> · usage ${nf(a.dose[0], 1)}–${nf(a.dose[1], 0)} g/L` },
    auxiliaires: { lib: 'Auxiliaires', liste: () => D.auxiliaires, det: (a) => `<b>${esc(a.groupe)}</b> · ${esc(a.note)}` },
    grimoire: { lib: 'Grimoire', liste: () => D.recettes, det: (r) => `<b>${esc(r.style || '')}</b>${r.og ? ` · OG ${sg(r.og)}` : ''}${r.ibu ? ` · ${Math.round(r.ibu)} IBU` : ''}` },
  };
  const possedeRecette = (r) => S.bac || S.grimoire.includes(r.id);
  const etoilesRarete = (r) => '★'.repeat(Math.max(1, r)) + '☆'.repeat(Math.max(0, 5 - Math.max(1, r)));

  function rendreCatalogue() {
    const p = palierAtteint();
    $('#cat-bourse').innerHTML = `<span class="ecus">${S.ecus} écus</span><p>${niveau()} : tu peux acheter jusqu'à la rareté ${'★'.repeat(Math.min(5, p + 1))}. ${PALIERS[p + 1] ? `Au prochain niveau (${PALIERS[p + 1].pts} points) : ${PALIERS[p + 1].txt}.` : ''}</p>
      <button class="btn btn-mini btn-houblon" data-aller="veillee">Veillée : gagner des écus</button>`;
    $('#cat-onglets').innerHTML = Object.entries(CATEGORIES).map(([id, c]) => {
      const l = c.liste(), n = id === 'grimoire' ? l.filter(possedeRecette).length : l.filter(dispo).length;
      return `<button class="onglet" role="tab" aria-selected="${catOnglet === id}" data-cat="${id}">${c.lib}<span class="badge">${n}/${l.length}</span></button>`;
    }).join('');
    const c = CATEGORIES[catOnglet];
    const filtres = [['achat', 'À acheter'], ['possede', 'Possédés'], ['tous', 'Tous']];
    let liste = c.liste().filter((x) => !catRecherche || `${x.nom} ${x.style || ''} ${x.aromes || ''} ${x.notes || ''}`.toLowerCase().includes(catRecherche.toLowerCase()));
    const estPossede = (x) => (catOnglet === 'grimoire' ? possedeRecette(x) : dispo(x));
    if (catFiltre === 'achat') liste = liste.filter((x) => !estPossede(x));
    if (catFiltre === 'possede') liste = liste.filter(estPossede);
    liste.sort((a, b) => (a.palier || 0) - (b.palier || 0) || a.nom.localeCompare(b.nom, 'fr'));
    const total = liste.length;
    liste = liste.slice(0, 60);
    $('#cat-contenu').innerHTML = `<div class="filtres">${filtres.map(([k, v]) => `<button class="filtre" data-catfiltre="${k}" aria-pressed="${catFiltre === k}">${v}</button>`).join('')}</div>
      <input class="recherche" id="cat-recherche" type="search" placeholder="Chercher" value="${esc(catRecherche)}" autocomplete="off">
      ${liste.map((x) => carteArticle(x, catOnglet)).join('') || `<p class="vide">${catFiltre === 'achat' ? 'Tout est déjà à toi dans cette catégorie.' : 'Rien ici pour l\'instant.'}</p>`}
      ${total > 60 ? `<p class="page-intro">${total - 60} autres : affine la recherche.</p>` : ''}`;
    rendreDecouvertes();
  }
  function carteArticle(x, cat) {
    const recette = cat === 'grimoire';
    const possede = recette ? possedeRecette(x) : dispo(x);
    const prix = prixDe(x, cat), ok = recette || achetable(x);
    let action;
    if (possede) action = recette ? `<button class="btn btn-feu" data-brasser="${esc(x.id)}">Brasser</button>` : '<span class="etq ok">Possédé</span>';
    else if (!ok) action = `<span class="etq ko">${PALIERS[Math.max(0, (x.palier || 1) - 1)].pts} pts requis</span>`;
    else action = `<button class="btn" data-acheter="${cat}:${esc(x.id)}" ${S.ecus < prix ? 'disabled' : ''}>${prix} écus</button>`;
    let extra = '';
    if (recette) {
      const manque = manquantsRecette(x);
      const ing = [...x.malts.map((l) => `${l.kg} kg ${IDX.malt.get(l.id).nom}`), ...x.houblons.map((l) => `${nf(l.g / 1000, 1)} kg ${IDX.houblon.get(l.id).nom} ${l.min < 0 ? 'à cru' : l.min + ' min'}`), IDX.levure.get(x.levure).nom];
      extra = `<span class="det">${esc(ing.join(' · '))}</span>${possede && manque.length ? `<div class="manquants"><span class="det">Il te manque :</span>${manque.map((m) => `<button class="btn btn-sobre" data-acheter="${m.cat}:${esc(m.x.id)}" ${S.ecus < prixDe(m.x, m.cat) || !achetable(m.x) ? 'disabled' : ''}>${esc(m.x.nom)} · ${achetable(m.x) ? prixDe(m.x, m.cat) + ' écus' : 'niveau requis'}</button>`).join('')}</div>` : ''}`;
    }
    return `<div class="article ${possede ? 'possede' : ''} ${!possede && !ok ? 'hors' : ''}"><span class="nom">${esc(x.nom)} ${recette ? '' : `<span class="rarete">${etoilesRarete(x.palier || 0)}</span>`}</span>${action}
      <span class="det">${CATEGORIES[cat].det(x)}</span>${extra}</div>`;
  }
  function manquantsRecette(r) {
    const m = [];
    r.malts.forEach((l) => { const x = IDX.malt.get(l.id); if (!dispo(x)) m.push({ x, cat: 'cereales' }); });
    r.houblons.forEach((l) => { const x = IDX.houblon.get(l.id); if (!dispo(x) && !m.some((y) => y.x === x)) m.push({ x, cat: 'houblons' }); });
    const y = IDX.levure.get(r.levure); if (!dispo(y)) m.push({ x: y, cat: 'levures' });
    return m;
  }
  function acheter(cat, id) {
    const x = cat === 'grimoire' ? IDX.recette.get(id) : CATEGORIES[cat].liste().find((e) => e.id === id);
    if (!x) return;
    const prix = prixDe(x, cat);
    if (S.ecus < prix || (cat !== 'grimoire' && !achetable(x))) { son('rate'); return; }
    S.ecus -= prix;
    if (cat === 'grimoire') S.grimoire.push(id); else posseder(id);
    son('ok'); toast(`${x.nom} ${cat === 'grimoire' ? 'ajoutée au grimoire' : 'arrive par pigeon'}.`);
    sauver(); majEntete(); rendreCatalogue();
  }
  function brasserRecette(id) {
    const r = IDX.recette.get(id); if (!r) return;
    const manque = manquantsRecette(r);
    if (manque.length) { direLise(`Il te manque ${manque.map((m) => m.x.nom).join(', ')}. Achète-les au pigeonnier, ou adapte la recette à la brasserie.`); return; }
    const y = IDX.levure.get(r.levure);
    R = S.recette = normaliser({
      malts: r.malts.map((l) => ({ ...l })), houblons: r.houblons.map((l) => ({ ...l })), levure: r.levure,
      ebullition: r.malts.some((l) => /pils/i.test(IDX.malt.get(l.id).nom)) ? 90 : 60,
      fermentation: { temp: Math.round((y.fam === 'lager' ? Math.min(y.t[0] + 3, y.t[1]) : y.t[0] + (y.t[1] - y.t[0]) * 0.35) * 2) / 2, reposDiacetyle: y.fam === 'lager' },
    });
    son('ok'); toast(`${r.nom} chargée dans la cuve, ramenée à 1000 L.`);
    onglet = 'cuve'; aller('brasserie');
  }
  $('#cat-onglets').addEventListener('click', (e) => { const b = e.target.closest('[data-cat]'); if (!b) return; catOnglet = b.dataset.cat; catRecherche = ''; son('clic'); rendreCatalogue(); });
  $('#cat-contenu').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.catfiltre) { catFiltre = b.dataset.catfiltre; rendreCatalogue(); }
    if (b.dataset.acheter) { const [cat, ...id] = b.dataset.acheter.split(':'); acheter(cat, id.join(':')); }
    if (b.dataset.brasser) brasserRecette(b.dataset.brasser);
  });
  $('#cat-contenu').addEventListener('input', (e) => {
    if (e.target.id !== 'cat-recherche') return;
    catRecherche = e.target.value; const pos = e.target.selectionStart; rendreCatalogue();
    const n = $('#cat-recherche'); n.focus(); n.setSelectionRange(pos, pos);
  });

  // Découvertes : des exploits qui font arriver des ingrédients en cadeau
  const parNom = (liste, re) => liste.find((x) => re.test(x.nom));
  const DECOUVERTES = [
    { id: 'clarif', titre: 'Premier brassin', desc: 'Brasser une première bière', cadeaux: () => [parNom(D.auxiliaires, /^Whirlfloc/)], test: (e) => e === 'biere' },
    { id: 'hygiene', titre: 'Leçon d\'hygiène', desc: 'Subir une infection', cadeaux: () => [parNom(D.auxiliaires, /^Star San/)], test: (e, c) => c.infection },
    { id: 'noir', titre: 'Nuit noire', desc: 'Un stout ou un porter médaillé', cadeaux: () => [parNom(D.malts, /^CARAFA II Special/), parNom(D.malts, /^Special B Dingemans/)], test: (e, c) => e === 'biere' && c.note.medaille && ['stout', 'porter'].includes(c.res.style.style.sujet) },
    { id: 'ble', titre: 'Blanche et blonde', desc: 'Une weizen ou une witbier médaillée', cadeaux: () => [parNom(D.aromates, /^Coriandre/), parNom(D.aromates, /^Écorce orange amère/)], test: (e, c) => e === 'biere' && c.note.medaille && /weizen|witbier/i.test(c.res.style.style.nom) },
    { id: 'ipa', titre: 'Houblonnière', desc: 'Une IPA à 40 points ou plus', cadeaux: () => [parNom(D.houblons, /^Citra$/)], test: (e, c) => e === 'biere' && c.res.style.style.sujet === 'ipa' && c.note.total >= 40 },
    { id: 'pils', titre: 'Pils de garde', desc: 'Une pils à 40 points ou plus', cadeaux: () => [parNom(D.levures, /^WLP800/)], test: (e, c) => e === 'biere' && c.res.style.style.sujet === 'pilsener' && c.note.total >= 40 },
    { id: 'braggot', titre: 'Le miel du domaine', desc: 'Un braggot médaillé', cadeaux: () => [parNom(D.auxiliaires, /^Go-Ferm/), parNom(D.malts, /^Miel brut \(production/)], test: (e, c) => e === 'biere' && c.note.medaille && c.res.style.style.sujet === 'specialty' },
    { id: 'zero', titre: 'Sans faute', desc: 'Une bière médaillée sans défaut', cadeaux: () => [parNom(D.auxiliaires, /^Servomyces/)], test: (e, c) => e === 'biere' && c.note.medaille && !c.note.defauts.length },
    { id: 'orbiere', titre: 'Premier or', desc: 'Une médaille d\'or au jury de la bière', cadeaux: () => [parNom(D.houblons, /^Galaxy$/)], test: (e, c) => e === 'biere' && c.note.medaille === 'or' },
    { id: 'wash', titre: 'Pour l\'alambic', desc: 'Brasser un premier wash', cadeaux: () => [parNom(D.auxiliaires, /^Glucoamylase/)], test: (e) => e === 'wash' },
    { id: 'distil', titre: 'Première goutte', desc: 'Distiller une première eau-de-vie', cadeaux: () => [parNom(D.levures, /^Distilamax XP$/), parNom(D.auxiliaires, /^DAP/)], test: (e) => e === 'edv' },
    { id: 'nez', titre: 'Nez de bouilleur', desc: 'Trois fractions sur trois à l\'aveugle', cadeaux: () => [parNom(D.levures, /^SafSpirit M-1$/)], test: (e, c) => e === 'edv' && c.entree.aveugle === 3 },
    { id: 'gin', titre: 'Panier de botaniques', desc: 'Distiller une bière aux aromates', cadeaux: () => [parNom(D.aromates, /^Baies de genièvre/)], test: (e, c) => e === 'edv' && (S.carnet.find((x) => x.nom === c.entree.biere)?.recette?.aromates || []).some((a) => IDX.aromate.get(a.id)?.type !== 'fruit') },
    { id: 'veillee', titre: 'Veillée studieuse', desc: 'Cinq bonnes réponses d\'affilée à la veillée', cadeaux: () => [parNom(D.houblons, /^Nelson Sauvin$/)], test: (e) => e === 'quiz' && S.quiz && S.quiz.serie >= 5 },
  ];
  function verifierDecouvertes(evt, ctx = {}) {
    const recus = [];
    if (S.bac) return recus;
    for (const d of DECOUVERTES) {
      if (S.decouvertes[d.id]) continue;
      let ok = false; try { ok = !!d.test(evt, ctx); } catch (e) { ok = false; }
      if (!ok) continue;
      S.decouvertes[d.id] = new Date().toISOString();
      for (const x of d.cadeaux().filter(Boolean)) {
        if (dispo(x)) { gagnerEcus(10); recus.push(`${d.titre} : ${x.nom} déjà en réserve, +10 écus`); }
        else { posseder(x.id); recus.push(`${d.titre} : ${x.nom}`); }
      }
    }
    // Chaque bière médaillée ajoute au grimoire une recette du même style
    if (evt === 'biere' && ctx.note && ctx.note.medaille) {
      const mots = sansAccents(ctx.res.style.style.nom).split(/\W+/).filter((m) => m.length > 3);
      const libres = D.recettes.filter((r) => !S.grimoire.includes(r.id));
      const proche = libres.find((r) => mots.some((m) => sansAccents(r.style + ' ' + r.nom).includes(m))) || libres[Math.floor(Math.random() * libres.length)];
      if (proche) { S.grimoire.push(proche.id); recus.push(`Grimoire : ${proche.nom}`); }
    }
    recus.forEach((r, i) => setTimeout(() => toast('Découverte · ' + r), 3200 + i * 900));
    return recus;
  }
  const sansAccents = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function rendreDecouvertes() {
    $('#cat-decouvertes').innerHTML = DECOUVERTES.map((d) => `<div class="succes-item ${S.decouvertes[d.id] ? 'obtenu' : ''}"><b>${esc(d.titre)}</b>${esc(d.desc)} → ${esc(d.cadeaux().filter(Boolean).map((x) => x.nom).join(', '))}</div>`).join('');
  }

  // =====================================================================
  // Veillée : questions tirées des cartes de formation du Hub
  // =====================================================================
  let questionCourante = null;
  const aujourdhui = () => new Date().toISOString().slice(0, 10);
  function etatQuiz() { if (!S.quiz || S.quiz.jour !== aujourdhui()) S.quiz = { jour: aujourdhui(), faits: 0, bonnes: 0, serie: S.quiz ? S.quiz.serie : 0 }; return S.quiz; }
  function nouvelleQuestion() {
    const C = D.quiz.cartes, carte = C[Math.floor(Math.random() * C.length)];
    const memes = C.filter((c) => c.d === carte.d && c !== carte && c.r !== carte.r);
    const autres = C.filter((c) => c.d !== carte.d);
    const pioche = (src, n) => src.slice().sort(() => Math.random() - 0.5).slice(0, n);
    const leurres = pioche(memes, 2);
    if (leurres.length < 2) leurres.push(...pioche(autres, 2 - leurres.length));
    const options = [carte, ...leurres].map((c) => c.r).sort(() => Math.random() - 0.5);
    questionCourante = { carte, options, repondu: null };
  }
  function rendreVeillee() {
    const q = etatQuiz();
    const reste = Math.max(0, 5 - q.faits);
    $('#veillee-etat').innerHTML = `<span class="ecus">${S.ecus} écus</span><p>${reste ? `Encore ${reste} question${reste > 1 ? 's' : ''} récompensée${reste > 1 ? 's' : ''} aujourd'hui.` : 'Les récompenses du jour sont prises : tu peux continuer pour t\'entraîner.'} Série en cours : ${q.serie} bonne${q.serie > 1 ? 's' : ''} réponse${q.serie > 1 ? 's' : ''} d'affilée.</p>`;
    if (!questionCourante) nouvelleQuestion();
    const { carte, options, repondu } = questionCourante;
    const qui = Math.random() < 0.5 ? 'Lise' : 'Firmin';
    $('#veillee-question').innerHTML = `<div class="question"><span class="module">${esc(D.quiz.modules[carte.d] || '')}</span>
      <p class="page-intro">Quelle réponse correspond à :</p><p class="enonce">${esc(carte.q)}</p>
      <div class="reponses">${options.map((o, i) => `<button data-rep="${i}" ${repondu != null ? 'disabled' : ''} class="${repondu != null ? (o === carte.r ? 'juste' : i === repondu ? 'faux' : '') : ''}">${esc(o)}</button>`).join('')}</div>
      ${repondu != null ? `<p>${options[repondu] === carte.r ? '<b style="color:var(--houblon)">Juste.</b>' : '<b style="color:var(--alerte)">Raté.</b> La bonne réponse est encadrée en vert.'}</p><button class="btn btn-feu" id="veillee-suivante">Question suivante</button>` : `<p class="page-intro">${qui} attend ta réponse.</p>`}</div>`;
  }
  $('#veillee-question').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.id === 'veillee-suivante') { questionCourante = null; rendreVeillee(); return; }
    if (b.dataset.rep == null || !questionCourante || questionCourante.repondu != null) return;
    const i = +b.dataset.rep, q = etatQuiz();
    questionCourante.repondu = i;
    const juste = questionCourante.options[i] === questionCourante.carte.r;
    q.serie = juste ? q.serie + 1 : 0;
    if (q.faits < 5) { q.faits++; if (juste) { q.bonnes++; gagnerEcus(4); } }
    son(juste ? 'ok' : 'rate');
    const cadeaux = verifierDecouvertes('quiz');
    cadeaux.forEach(() => {});
    sauver(); majEntete(); rendreVeillee();
  });

  // =====================================================================
  // Fiche technique du wash
  // =====================================================================
  function nomEauDeVie(b) {
    if (b.type !== 'wash') return 'Eau-de-vie de bière';
    const ms = (b.recette.malts || []).map((l) => IDX.malt.get(l.id)).filter(Boolean);
    const malt = ms.every((m) => ['base', 'kilned', 'caramel', 'roasted'].includes(m.fam) && !/bl[ée]|wheat|seigle|rye|froment/i.test(m.nom));
    return malt ? 'Eau-de-vie de malt' : 'Eau-de-vie de grain';
  }
  function rendreDegustationWash() {
    const { entree: e, res, fiche, gain } = dernier;
    const ctx = $('#verre').getContext('2d');
    const px = (x, y, w, h, k) => { ctx.fillStyle = k; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
    ctx.clearRect(0, 0, 64, 96); px(0, 0, 64, 96, '#221912');
    px(16, 14, 32, 70, '#9aa1a8'); px(18, 16, 28, 66, '#3b2d22'); px(18, 30, 28, 52, `rgba(${Moteur.couleurRVB(res.ebc).join(',')},.75)`);
    for (let i = 0; i < 14; i++) px(20 + (i * 7) % 24, 32 + (i * 11) % 46, 2, 2, 'rgba(236,223,196,.5)');
    px(18, 26, 28, 4, '#e8dcc0');
    $('#verdict').innerHTML = `<span class="style">Wash de distillation · ${esc(res.levure.nom)}</span>
      <span class="total">${nf(fiche.total, fiche.total % 1 ? 1 : 0)}<small>/20</small></span>
      <span class="medaille aucune">Fiche du bouilleur</span>
      <span class="style">${sg(res.og)} → ${sg(res.fg)} · ${nf(res.abv)} % vol · atténuation ${Math.round(res.attenuation * 100)} % · ${nf(fiche.lap, 0)} LAP</span>`;
    const axes = [['malte', 'Malté'], ['caramel', 'Caramel'], ['torrefie', 'Torréfié'], ['amer', 'Amer'], ['houblon', 'Houblonné'], ['fruite', 'Fruité'], ['epice', 'Épicé'], ['corps', 'Corps']];
    $('#radar').innerHTML = radarSVG(axes, res.profil);
    const L = fiche.lignes;
    const rang = [['alcool', 'Alcool à distiller', 8], ['attenuation', 'Atténuation', 4], ['proprete', 'Propreté', 5], ['potentiel', 'Potentiel aromatique', 3]];
    $('#fiche-jury').innerHTML = `<h3>FICHE DU BOUILLEUR · WASH</h3><table>${rang.map(([k, lib, max], i) => `<tr class="lent" style="animation-delay:${0.3 + i * 0.3}s"><td>${lib}</td><td>${nf(L[k], L[k] % 1 ? 1 : 0)} / ${max}</td></tr>`).join('')}
      <tr class="total lent" style="animation-delay:1.5s"><td>Total</td><td>${nf(fiche.total, fiche.total % 1 ? 1 : 0)} / 20</td></tr></table>`;
    $('#degust-defauts').innerHTML = fiche.defauts.length ? `<h2 class="sous-titre">Points faibles</h2>` + fiche.defauts.map((d) => `<div class="defaut"><h3><span>${esc(d.nom)} <span class="en">${esc(d.en)}</span></span><span class="gravite">${'■'.repeat(d.gravite)}${'□'.repeat(3 - d.gravite)}</span></h3>${d.detail ? `<p>${esc(d.detail)}</p>` : ''}<p>${esc(d.chimie)}</p><p class="conseil-d">${esc(d.conseil)}</p></div>`).join('') : '';
    const g = [S.bac ? 'Bac à sable : ni points ni écus.' : `<b>+${gain} points</b> de maîtrise et <b style="color:var(--or)">+${dernier.ecus} écus</b>.`];
    (dernier.cadeaux || []).forEach((c) => g.push(`Découverte : ${esc(c)}`));
    g.push(`Ce wash donnera une ${nomEauDeVie(e).toLowerCase()} : il t'attend à l'alambic.`);
    $('#degust-gains').innerHTML = `<div class="gains">${g.map((x) => `<p>${x}</p>`).join('')}</div>`;
    $('#nom-cuvee').value = e.nom;
    $('#btn-rebrasser').textContent = 'Aller à l\'alambic';
    const bilan = [res.abv >= 7.5 ? 'Un wash bien chargé, ça va bien monter.' : 'Un peu léger en alcool : plus de malt, ou une levure de distillerie.'];
    if (res.attenuation < 0.85) bilan.push('L\'atténuation est courte : une glucoamylase ou un palier plus bas aideraient.');
    if (res.houblons && res.houblons.length) bilan.push('Du houblon dans un wash, Lise a déteint sur toi.');
    setTimeout(() => { if (ecran === 'degustation') direLise(bilan.join(' ')); }, reduit ? 0 : 1800);
    setTimeout(() => son('ok'), reduit ? 0 : 1500);
  }

  // =====================================================================
  // Carnet
  // =====================================================================
  let choixCarnet = null;
  function rendreCarnet() {
    const p = palierAtteint(), suivant = PALIERS[p + 1];
    const debut = PALIERS[p].pts, fin = suivant ? suivant.pts : debut;
    const pc = suivant ? Math.round(((S.points - debut) / (fin - debut)) * 100) : 100;
    $('#carnet-progression').innerHTML = `<div class="progression"><p class="niv">${niveau().toUpperCase()}</p>
      <p>${S.points} points · ${S.brassins} brassin${S.brassins > 1 ? 's' : ''} · palier ${p} sur 5</p>
      <div class="jauge" style="height:10px"><i style="width:${pc}%;background:var(--braise)"></i></div>
      <p class="page-intro">${suivant ? `Prochain palier à ${suivant.pts} points : ${suivant.txt}.` : 'Tout le catalogue est débloqué.'}</p></div>`;
    const et = $('#etagere');
    if (!S.carnet.length) { et.innerHTML = '<p class="vide" style="grid-column:1/-1">L\'étagère est vide. Brasse ta première bière à la brasserie.</p>'; $('#carnet-detail').innerHTML = ''; }
    else {
      et.innerHTML = S.carnet.map((x) => `<button class="bouteille" data-bouteille="${x.id}" aria-pressed="${choixCarnet === x.id}"><canvas width="16" height="36" data-ebc="${x.ebc}" data-med="${x.medaille || ''}" data-edv="${x.type === 'edv' ? 1 : ''}"></canvas><span>${esc(x.nom)}</span></button>`).join('');
      $$('.bouteille canvas', et).forEach(dessinerBouteille);
      rendreDetailCarnet();
    }
    $('#succes').innerHTML = SUCCES.map((s) => `<div class="succes-item ${S.succes[s.id] ? 'obtenu' : ''}"><b>${esc(s.nom)}</b>${esc(s.desc)}</div>`).join('');
  }
  function dessinerBouteille(cv) {
    const c = cv.getContext('2d'), col = couleur(+cv.dataset.ebc), med = cv.dataset.med;
    const px = (x, y, w, h, k) => { c.fillStyle = k; c.fillRect(x, y, w, h); };
    if (cv.dataset.edv) {
      // Flacon d'eau-de-vie : verre clair, bouchon de liège, étiquette cuivre
      px(6, 0, 4, 3, '#b9865a'); px(6, 3, 4, 7, '#c9ced6'); px(4, 10, 8, 2, '#c9ced6'); px(2, 12, 12, 24, '#c9ced6');
      px(3, 14, 10, 21, '#ece8dc'); px(3, 20, 10, 9, '#d27b3e'); px(4, 23, 8, 1, '#ecdfc4'); px(3, 14, 1, 21, 'rgba(255,255,255,.6)');
      if (med) { const m = { or: '#f2c94c', argent: '#c9ced6', bronze: '#c98552' }[med]; px(10, 30, 4, 4, m); px(11, 34, 2, 2, '#e3593d'); }
      return;
    }
    px(6, 0, 4, 2, '#d27b3e'); px(6, 2, 4, 8, '#2f4a2a'); px(5, 10, 6, 2, '#2f4a2a'); px(3, 12, 10, 24, '#2f4a2a');
    px(4, 13, 8, 22, col); px(4, 20, 8, 8, '#ecdfc4'); px(5, 22, 6, 1, '#d27b3e'); px(5, 25, 4, 1, '#ab9a7f');
    px(4, 13, 1, 22, 'rgba(255,255,255,.25)');
    if (med) { const m = { or: '#f2c94c', argent: '#c9ced6', bronze: '#c98552' }[med]; px(9, 29, 4, 4, m); px(10, 33, 2, 2, '#e3593d'); }
  }
  function rendreDetailCarnet() {
    const x = S.carnet.find((e) => e.id === choixCarnet);
    if (!x) { $('#carnet-detail').innerHTML = '<p class="page-intro">Touche une bouteille pour relire sa fiche.</p>'; return; }
    if (x.type === 'edv') {
      $('#carnet-detail').innerHTML = `<div class="carnet-detail"><h3>${esc(x.nom)}</h3>
        <p>Eau-de-vie de bière · ${new Date(x.date).toLocaleDateString('fr-FR')} · Ulysse · mode ${x.mode === 'expert' ? 'expert' : 'débutant'}${x.bac ? ' · bac à sable' : ''}</p>
        <div class="chiffres"><span>${nf(x.total, x.total % 1 ? 1 : 0)}/50</span><span>${nf(x.coeur.V, 1)} L</span><span>${nf(x.coeur.degre, 1)} %</span><span>${nf(x.coeur.lap, 1)} LAP</span><span>${Math.round(x.rendement * 100)} % rendement</span></div>
        <p>${x.medaille ? `Médaille ${x.medaille === 'or' ? "d'or" : x.medaille === 'argent' ? "d'argent" : 'de bronze'}` : 'Sans médaille'}${x.defauts.length ? ` · défauts : ${esc(x.defauts.join(', '))}` : ' · aucun défaut'}</p>
        <p><b>Bière de départ :</b> ${esc(x.biere)}</p>
        <p><b>Coupes :</b> ${x.coupes.map((c, i) => `${i ? 'queues' : 'têtes'} à ${Math.round(c.recup * 100)} % de l'alcool${c.degre ? ` (${nf(c.degre, 0)} % au bec)` : ''}`).join(' · ') || '—'}${x.recyclees ? ` · ${nf(x.recyclees, 1)} LAP d'épaisses recyclées` : ''}</p>
        ${x.aveugle != null ? `<p><b>À l'aveugle :</b> ${x.aveugle}/3</p>` : ''}
        <button class="btn btn-feu" data-aller="distillerie">Aller à l'alambic</button></div>`;
      return;
    }
    const rec = x.recette;
    const malts = rec.malts.map((l) => `${nf(l.kg, 0)} kg ${IDX.malt.get(l.id)?.nom || '?'}`).join(', ');
    const hops = rec.houblons.map((l) => `${nf(l.g / 1000, 2)} kg ${IDX.houblon.get(l.id)?.nom || '?'} ${l.min < 0 ? 'à cru' : l.min + ' min'}`).join(', ');
    $('#carnet-detail').innerHTML = `<div class="carnet-detail"><h3>${esc(x.nom)}</h3>
      <p>${esc(x.style)} · ${new Date(x.date).toLocaleDateString('fr-FR')} · mode ${x.mode === 'expert' ? 'expert' : 'débutant'}${x.bac ? ' · bac à sable' : ''}</p>
      <div class="chiffres"><span>${nf(x.total, x.total % 1 ? 1 : 0)}/${x.type === 'wash' ? 20 : 50}</span><span>${sg(x.og)} → ${sg(x.fg)}</span><span>${nf(x.abv)} %</span><span>${nf(x.ibu, 0)} IBU</span><span>${nf(x.ebc, 0)} EBC</span></div>
      <p>${x.medaille ? `Médaille ${x.medaille === 'or' ? "d'or" : x.medaille === 'argent' ? "d'argent" : 'de bronze'}` : 'Sans médaille'}${x.defauts.length ? ` · défauts : ${esc(x.defauts.join(', '))}` : ' · aucun défaut'}</p>
      <p><b>Malts :</b> ${esc(malts)}</p><p><b>Houblons :</b> ${esc(hops) || 'aucun'}</p>
      ${x.distillee ? '<p><b>Distillée</b> dans Ulysse.</p>' : ''}<p><b>Levure :</b> ${esc(IDX.levure.get(rec.levure)?.nom || '?')} à ${nf(rec.fermentation.temp)} °C · eau ${esc(IDX.eau.get(rec.eau)?.nom || '?')} · palier ${nf(rec.palier)} °C · ${rec.ebullition} min</p>
      <button class="btn btn-feu" id="carnet-rebrasser">Rebrasser cette recette</button></div>`;
    $('#carnet-rebrasser').onclick = () => { R = clone(x.recette); onglet = 'cuve'; aller('brasserie'); };
  }
  $('#etagere').addEventListener('click', (e) => { const b = e.target.closest('[data-bouteille]'); if (!b) return; choixCarnet = b.dataset.bouteille; son('clic'); $$('.bouteille').forEach((x) => x.setAttribute('aria-pressed', x === b)); rendreDetailCarnet(); });

  // =====================================================================
  // Fiches de chimie
  // =====================================================================
  const FICHES = {
    empatage: ['Empâtage et enzymes', 'mashing', [
      "L'amidon du malt est un polymère de glucose : de l'amylose, en chaînes droites, et de l'amylopectine, ramifiée en α-1,6. À l'empâtage, les enzymes du malt le découpent en sucres.",
      "La β-amylase (beta-amylase) travaille au mieux vers 60–65 °C. Elle grignote les chaînes par leur extrémité et libère du maltose, que la levure fermente entièrement. Elle se dénature vite au-dessus de 65 °C.",
      "L'α-amylase (alpha-amylase) préfère 68–72 °C. Elle coupe au hasard au milieu des chaînes et laisse des dextrines que la levure ne fermente pas : la bière garde du corps.",
      "Dans le jeu, chaque degré au-dessus de 65,5 °C retire environ 1,5 point d'atténuation. Un palier à 64 °C donne une bière sèche, un palier à 69 °C une bière ronde.",
      "Le pouvoir diastasique (diastatic power), en °Lintner, mesure la réserve d'enzymes. Un malt Pils en a environ 105, un malt caramel aucun. Sous 35 °Lintner en moyenne, l'amidon ne se convertit plus entièrement."]],
    densite: ['Densité initiale et extrait', 'original gravity', [
      "La densité initiale mesure les sucres dissous dans le moût. On compte en points : 1,050 vaut 50 points.",
      "Un kilo de saccharose dans un litre donne environ 386 points. Un malt de base en extrait à peu près 80 %, et la salle de brassage en récupère environ 75 % : c'est le rendement (brewhouse efficiency).",
      "Formule du jeu : <code>points = kg × extrait × 386 × rendement ÷ litres</code>. Pour 1000 L à 1,048 en malt Pils, il faut environ 207 kg.",
      "Le miel et les sucres s'ajoutent à l'ébullition : pas de perte à la filtration, leur rendement est de 100 %."]],
    attenuation: ['Atténuation, densité finale et alcool', 'apparent attenuation', [
      "L'atténuation apparente est la part des points de densité consommée par la levure. Chaque souche a sa plage : environ 80 % pour la US-05, près de 90 % pour la WB-06.",
      "Densité finale : <code>FG = points × (1 − atténuation)</code>. Les malts caramel et torréfiés apportent des sucres non fermentescibles qui remontent la densité finale.",
      "Alcool : <code>% vol = (OG − FG) × 131,25</code>. Au-delà de sa tolérance à l'alcool, la levure s'arrête et la bière reste sucrée."]],
    amertume: ['Amertume et isomérisation', 'hop isomerization', [
      "Les acides alpha du houblon (humulone, cohumulone, adhumulone) sont presque insolubles. À l'ébullition, ils s'isomérisent en iso-acides alpha, solubles et amers.",
      "Le jeu utilise la formule de Tinseth : <code>utilisation = 1,65 × 0,000125^(OG − 1) × (1 − e^(−0,04 × min)) ÷ 4,15</code>. Un moût dense isomérise moins bien.",
      "<code>IBU = utilisation × acides alpha en mg/L</code>. Un kilo de Magnum à 13,5 % pendant 60 minutes donne environ 32 IBU sur 1000 L à 1,048.",
      "Les huiles essentielles (myrcène, humulène, linalol) sont volatiles et partent avec la vapeur. D'où les ajouts tardifs et le houblonnage à cru (dry hopping) : peu ou pas d'amertume, beaucoup d'arôme."]],
    couleur: ['Couleur, Maillard et torréfaction', 'malt color', [
      "Au touraillage (kilning), la réaction de Maillard combine sucres réducteurs et acides aminés en mélanoïdines : notes de pain, de biscuit, de noisette.",
      "Les malts caramel (crystal) sont saccharifiés dans le grain humide puis séchés : sucres caramélisés, dextrines, couleur ambrée. Les malts torréfiés (roasted) dépassent 200 °C : café, cacao, puis pyrolyse.",
      "Le jeu calcule la couleur avec la formule de Morey : <code>MCU = Σ (livres × °Lovibond) ÷ gallons</code>, <code>SRM = 1,4922 × MCU^0,6859</code>, puis <code>EBC = SRM × 1,97</code>.",
      "Au-delà de 15 % de malts torréfiés non désamérisés, l'amertume brûlée devient un défaut."]],
    eau: ["Eau et pH d'empâtage", 'mash pH', [
      "Le pH de l'empâtage doit rester entre 5,2 et 5,6, mesuré à froid. Au-dessus de 5,8, les tanins de l'enveloppe du grain passent dans le moût : astringence.",
      "Le calcium et le magnésium abaissent le pH, les bicarbonates le remontent. Le bilan s'appelle l'alcalinité résiduelle de Kolbach (residual alkalinity) : <code>RA = HCO₃ × 50/61 − Ca/1,4 − Mg/1,7</code>, en ppm de CaCO₃.",
      "Les malts foncés sont acides. Une eau alcaline comme celle de Dublin convient aux stouts, une eau douce comme celle de Plzeň aux pils. L'eau calcaire du causse demande du malt acide (Sauermalz) pour les bières pâles : 1 % du grain baisse le pH d'environ 0,1.",
      "Le rapport sulfates/chlorures oriente la perception : au-dessus de 2, amertume sèche et nette (Burton) ; sous 1, rondeur maltée.",
      "Les valeurs de l'eau du causse sont une estimation. Une analyse du forage les remplacera."]],
    levure: ['Levures, esters et phénols', 'yeast flavor', [
      "Saccharomyces cerevisiae (ale, fermentation haute) travaille vers 15–24 °C. S. pastorianus (lager, fermentation basse) vers 8–14 °C.",
      "Les esters naissent de l'acétyl-CoA et des alcools : l'acétate d'isoamyle sent la banane, l'hexanoate d'éthyle la pomme. Ils augmentent avec la température et chez les souches anglaises ou belges.",
      "Les alcools supérieurs (fusel alcohols) viennent des acides aminés par la voie d'Ehrlich. Au-dessus de la plage de la levure, ils donnent un goût chaud de solvant.",
      "Les souches POF+ (phenolic off-flavor positive) décarboxylent l'acide férulique en 4-vinylgaïacol : le clou de girofle des weizen et des saisons, un défaut ailleurs."]],
    fermentation: ['Chaleur de fermentation', 'fermentation heat', [
      "La fermentation est exothermique : la levure transforme le glucose en éthanol et en CO₂ en libérant de la chaleur. Le pic arrive en phase tumultueuse, vers les jours 2 et 3.",
      "Sur 1000 L, sans refroidissement, la cuve dérive de plusieurs degrés. D'où la double enveloppe parcourue de glycol.",
      "En fin de fermentation, la levure réabsorbe le diacétyle. Pour une lager, on remonte de 3 à 4 °C pendant deux jours : c'est le repos diacétyle (diacetyl rest)."]],
    defauts: ['Les défauts du jury', 'off-flavors', [
      "Diacétyle (diacetyl) : la 2,3-butanedione sent le beurre. Elle naît de l'α-acétolactate rejeté par la levure. Un repos diacétyle la fait réabsorber.",
      "DMS (dimethyl sulfide) : odeur de maïs cuit. La S-méthylméthionine des malts très pâles se convertit en DMS à chaud ; une ébullition longue et vigoureuse le chasse.",
      "Astringence : tanins extraits à pH trop haut. Alcools supérieurs : fermentation trop chaude. Phénols hors style : levure POF+ dans un style qui n'en veut pas.",
      "Infection lactique : des lactobacilles produisent de l'acide lactique. En mode débutant, le risque augmente quand la fermentation sort de sa bande. Le mode expert ne tire pas au hasard."]],
    styles: ['Lire un style', 'style guidelines', [
      "Un style se définit par des plages : densité initiale, densité finale, amertume en IBU, couleur en EBC. Les plages du jeu viennent de How To Brew (John Palmer), via le Hub Prométhée.",
      "Le jeu mesure l'écart à chaque plage, ajoute des contraintes (levure lager pour une pils, blé malté pour une weizen, blé cru pour une witbier, malt torréfié pour un stout, miel pour un braggot) et classe les styles. Conformité : <code>e^(−écart)</code>.",
      "Le rapport BU:GU (IBU divisés par les points de densité) résume l'équilibre : environ 0,3 pour une weizen, 0,8 pour une IPA."]],
    distillation: ['Distillation : brouillis et bonne chauffe', 'pot still distillation', [
      "L'éthanol bout à 78,4 °C, l'eau à 100 °C. Un mélange des deux bout entre les deux, et sa vapeur est plus riche en alcool que le liquide : une bière à 5 % donne une vapeur vers 36 %, un liquide à 10 % une vapeur vers 50 %.",
      "Dans un alambic à repasse, la chaudière s'appauvrit au fil de la chauffe : le degré au bec baisse en continu. C'est la distillation de Rayleigh, que le jeu calcule pas à pas.",
      "Première chauffe, le brouillis (stripping run) : on épuise la bière jusqu'à 0,3 % pour obtenir un alcool à 20–30 %. Deuxième chauffe, la bonne chauffe (spirit run) : on repasse le brouillis et on fait les coupes.",
      "Le chapiteau et le col de cygne d'Ulysse renvoient une partie de la vapeur dans la chaudière : c'est le reflux, qui vaut ici environ un plateau supplémentaire. Une chauffe douce en ajoute : vapeur plus riche, séparation plus nette, mais plus de temps.",
      "Les LAP (litres d'alcool pur) se calculent ainsi : <code>LAP = volume × degré</code>. 1000 L de bière à 5 % font 50 LAP. Les accises et les rendements se comptent en LAP."]],
    coupes: ['Les coupes : têtes, cœur, queues', 'cuts: heads, hearts, tails', [
      "Chaque composé quitte la chaudière à sa vitesse. Le jeu utilise <code>dQ = Q × (α × dA/A + β × e^((T − 85)/3) × dV/V)</code> : α est la volatilité par rapport à l'éthanol, β l'entraînement avec l'eau quand la chaudière chauffe en fin de chauffe.",
      "Têtes (heads) : acétaldéhyde (éb. 20 °C) et acétate d'éthyle (éb. 77 °C), très volatils. Colle, vernis, pomme verte. On les écarte au début : quelques pourcents de l'alcool.",
      "Cœur (hearts) : éthanol, esters fruités (acétate d'isoamyle, hexanoate d'éthyle), terpènes du houblon, une part d'alcools supérieurs. C'est l'eau-de-vie.",
      "Queues (tails, feints) : acides gras, esters éthyliques lourds, furfural. Ils sortent quand la chaudière s'appauvrit : carton mouillé, savon, amande grillée. On coupe d'ordinaire vers 55–65 % au bec.",
      "Un cœur serré est propre mais pauvre en caractère et en rendement. Un cœur large est riche mais lourd. Les épaisses (têtes et queues) repassent à la chauffe suivante pour récupérer leur alcool."]],
    methanol: ['Le méthanol', 'methanol', [
      "Le méthanol vient de la pectine des fruits, coupée par des pectine-méthylestérases. La bière en contient très peu ; les eaux-de-vie de fruits beaucoup plus, surtout avec les peaux et les pépins.",
      "Il ne se sent pas : aucun nez ne le détecte. Le foie le transforme en formaldéhyde puis en acide formique, toxiques pour le nerf optique.",
      "Dans un alambic à repasse, il sort sur une bonne partie de la chauffe, un peu plus au début : couper les têtes en écarte une partie, sans tout retirer.",
      "La réglementation européenne (règlement 2019/787) plafonne le méthanol des eaux-de-vie de fruits, en général à 1 000 g par hectolitre d'alcool pur. Ce sera un vrai sujet quand les fruits arriveront au domaine."]],
    cuivre: ['Le cuivre et le feu', 'copper and heat', [
      "Les levures produisent des composés soufrés (H₂S, thiols, DMS), surtout les levures lager. Le cuivre de la chaudière et du chapiteau les fixe sous forme de sulfures de cuivre : Ulysse en retire environ 80 % dans le jeu.",
      "La bière mousse en chauffant : protéines et CO₂ dissous. Un feu trop vif au début fait monter la mousse dans le col de cygne et de la bière passe dans le brouillis (puking).",
      "Une bière chargée de levure accroche au fond d'une chaudière chauffée à feu nu : caramélisation, furfural, goût de brûlé. D'où la chauffe douce et régulière des bouilleurs."]],
    cereales: ['Céréales crues, flocons et bêta-glucanes', 'adjuncts and gelatinization', [
      "Pour que les enzymes attaquent l'amidon, il faut d'abord le gélatiniser : les granules gonflent d'eau et éclatent. L'amidon du malt d'orge gélatinise pendant l'empâtage, vers 61–65 °C.",
      "Les grains crus gélatinisent plus haut : environ 58–64 °C pour le blé, 57–70 °C pour le seigle, 62–74 °C pour le maïs. Dans le jeu, un grain cru reste à moitié inaccessible si le palier est à moins de sa température de gélatinisation plus 8 °C, sauf avec la cuisson des grains crus.",
      "La cuisson (cereal cooking) : on fait bouillir les grains crus à part, souvent avec un peu de malt, puis on verse cette bouillie dans la maische. Les flocons sont déjà gélatinisés : ils passent entre des rouleaux chauffés à la vapeur.",
      "Les bêta-glucanes sont des polysaccharides des parois cellulaires, abondants dans l'avoine, le seigle et l'orge non maltée. Ils rendent la maische visqueuse : la filtration traîne et le rendement baisse. Au-delà de 30 % de ces grains, une bêta-glucanase les découpe.",
      "Les grains crus n'apportent aucune enzyme : il faut assez de malt de base pour convertir leur amidon."]],
    aromates: ['Aromates : fruits, épices, bois', 'adjuncts and botanicals', [
      "Les épices et les zestes apportent des huiles essentielles : limonène des écorces d'agrume, linalol de la coriandre, alpha-pinène du genièvre. On les ajoute en fin d'ébullition, ou à froid, pour ne pas les évaporer.",
      "Les doses se comptent en grammes par litre. Sur 1000 L, 1 g/L fait 1 kg. Chaque aromate a sa plage d'usage : au-delà d'une fois et demie le haut de la plage, le jury le trouve envahissant.",
      "Les purées de fruits apportent environ 12 % de sucres, que la levure fermente : la densité monte un peu. Ajoutées en garde, elles gardent mieux leurs arômes, qui sinon partent avec le CO₂.",
      "Le chêne libère des lactones (la whisky lactone, noix de coco), de la vanilline et des tanins. Le bois fumé apporte des phénols de fumée.",
      "À la distillation, les huiles volatiles des botaniques passent dans l'eau-de-vie : c'est le principe du gin. Le jeu les compte avec les terpènes du houblon."]],
    auxiliaires: ['Auxiliaires de brassage', 'processing aids', [
      "Nutriments (DAP, Servomyces, Fermaid, Go-Ferm) : ils apportent de l'azote assimilable et du zinc. La levure fermente plus franchement, produit moins de composés soufrés et va un peu plus loin en alcool.",
      "Clarifiants à chaud (Whirlfloc, Irish moss, Protafloc) : le carraghénane, chargé négativement, fait floculer les protéines en fin d'ébullition. Clarifiants à froid (gélatine, isinglass, kieselsol) : ils entraînent levures et trouble au fond. Une weizen ou une witbier doivent rester troubles : les coller leur coûte des points.",
      "Enzymes : l'alpha-amylase exogène convertit l'amidon quand les malts manquent d'enzymes ; la glucoamylase coupe les liaisons α-1,4 et α-1,6 des dextrines en glucose, pour une bière très sèche ; la bêta-glucanase fluidifie la maische ; la lactase rend le lactose fermentescible.",
      "Hygiène (Star San, Chemipro Oxi, PBW, soude) : nettoyage puis désinfection. Dans le jeu, le risque d'infection est divisé par deux."]],
    wash: ['Le wash de distillation', 'distillers wash', [
      "Un wash est un moût fermenté destiné à l'alambic. On ne le fait pas bouillir : les enzymes du malt continuent de travailler pendant la fermentation, et l'atténuation dépasse souvent 90 %.",
      "Sans ébullition, rien ne stérilise le moût : le risque bactérien monte. En Écosse, une petite fermentation lactique en fin de cycle est même recherchée pour ses esters.",
      "Les levures de distillerie tolèrent plus d'alcool et de chaleur, et chacune a son profil d'esters : de très neutre (Distilamax XP) à très fruitée (Distilamax RM).",
      "Un wash 100 % malt d'orge donne une eau-de-vie de malt ; avec du blé, du seigle ou du maïs, une eau-de-vie de grain. Pour avoir droit au nom de whisky, il faut ensuite au moins trois ans en fût de chêne de 700 L au plus (règlement UE 2019/787)."]],
    jury: ['La fiche de dégustation', 'BJCP scoresheet', [
      "Le barème suit celui des concours BJCP : aspect sur 3, arôme sur 12, bouche sur 5, saveur sur 20, impression générale sur 10. Bronze à partir de 30, argent à 38, or à 45.",
      "Le jury juge la conformité au style, les arômes attendus (houblon pour une IPA, esters et phénols pour une weizen, torréfaction pour un stout) et l'équilibre BU:GU. Chaque défaut retire des points selon sa gravité.",
      "En mode débutant, des gestes ratés coûtent des points de saveur et d'impression. En mode expert, ils changent la chimie elle-même.",
      "Étoiles : sans l'aide de Lise, en mode expert, gestes joués en mode expert. Chaque étoile ajoute 5 points de maîtrise à une bière médaillée."]],
  };
  let retourFiche = null;
  const NOMS_ECRANS = { brasserie: 'la brasserie', catalogue: 'le pigeonnier', veillee: 'la veillée', distillerie: "l'alambic", degustation: 'la dégustation', carnet: 'le carnet', domaine: 'le domaine' };
  function rendreFiches() {
    const retour = retourFiche && NOMS_ECRANS[retourFiche] ? `<button class="btn btn-sobre" data-aller="${retourFiche}">← Retour à ${NOMS_ECRANS[retourFiche]}</button>` : '';
    retourFiche = null;
    $('#fiches-liste').innerHTML = retour + '<button class="btn btn-houblon" data-aller="veillee">Veillée : se tester sur les modules</button>' + Object.entries(FICHES).map(([id, [titre, en, paras]]) => `<details class="fiche" id="fiche-${id}"><summary><span>${esc(titre)} <span class="en">${esc(en)}</span></span></summary><div class="contenu">${paras.map((p) => `<p>${p}</p>`).join('')}</div></details>`).join('');
  }
  function ouvrirFiche(id) {
    son('clic'); retourFiche = ecran; aller('fiches');
    const f = $('#fiche-' + id);
    if (f) { f.open = true; setTimeout(() => f.scrollIntoView({ block: 'start', behavior: reduit ? 'auto' : 'smooth' }), 30); }
  }

  // =====================================================================
  // Options
  // =====================================================================
  function rendreReglages() {
    const bascule = (cle, val, lib) => `<button data-reglage="${cle}" data-val="${val}" aria-pressed="${S[cle] === val}">${lib}</button>`;
    $('#reglages-contenu').innerHTML = `<div class="reglages-groupe">
      <div class="reglage"><span class="lib">Mode de jeu</span><div class="bascule">${bascule('mode', 'debutant', 'Débutant')}${bascule('mode', 'expert', 'Expert')}</div>
        <p>${S.mode === 'debutant' ? 'Gestes à chaque brassin. Un geste raté coûte des points au jury, la recette reste celle que tu as calculée.' : 'Réglages fins (rendement). Les gestes sont facultatifs ; quand tu les joues, leur résultat change la chimie de la bière.'}</p></div>
      <div class="reglage"><span class="lib">Conseils de Lise</span><div class="bascule">${bascule('aide', true, 'Oui')}${bascule('aide', false, 'Non')}</div><p>Sans conseils, chaque médaille gagne une étoile.</p></div>
      ${S.mode === 'expert' ? `<div class="reglage"><span class="lib">Jouer les gestes en mode expert</span><div class="bascule">${bascule('gestesExpert', true, 'Oui')}${bascule('gestesExpert', false, 'Non')}</div><p>Une étoile de plus, et la chimie suit ce que tu fais vraiment.</p></div>` : ''}
      <div class="reglage"><span class="lib">Sons</span><div class="bascule">${bascule('son', true, 'Oui')}${bascule('son', false, 'Non')}</div></div>
      <div class="reglage"><span class="lib">Bac à sable</span><div class="bascule">${bascule('bac', true, 'Oui')}${bascule('bac', false, 'Non')}</div><p>Tout le catalogue ouvert pour expérimenter. Les brassins ne rapportent ni points ni succès.</p></div>
      <div class="reglage"><span class="lib">Tutoriel</span><p>Lise reprend la visite depuis le début.</p><button class="btn btn-sobre" id="revoir-tuto">Revoir le tutoriel</button></div>
      <div class="reglage danger"><span class="lib">Effacer la partie</span><p>Carnet, points et succès seront perdus. La partie est enregistrée sur ce téléphone uniquement.</p>
        <div class="bascule" id="zone-effacer"><button id="effacer">Tout effacer</button></div></div>
      <p class="infos-version">Version 0.3 · brasserie, alambic Ulysse, pigeonnier et veillée. Données du Hub Prométhée : ${D.malts.length} céréales et sucres, ${D.houblons.length} houblons, ${D.levures.length} levures, ${D.aromates.length} aromates, ${D.sels.length} sels, ${D.auxiliaires.length} auxiliaires, ${D.recettes.length} recettes, ${D.quiz.cartes.length} questions, ${D.styles.length} styles.</p></div>`;
  }
  $('#reglages-contenu').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.reglage) {
      const cle = b.dataset.reglage, v = b.dataset.val;
      S[cle] = v === 'true' ? true : v === 'false' ? false : v;
      if (cle === 'mode' && v === 'debutant') R.rendement = 0.75;
      son('clic'); sauver(); majEntete(); rendreReglages(); return;
    }
    if (b.id === 'revoir-tuto') { S.tuto = 0; sauver(); aller('domaine'); return; }
    if (b.id === 'effacer') { $('#zone-effacer').innerHTML = '<button id="effacer-oui">Oui, tout effacer</button><button id="effacer-non">Annuler</button>'; return; }
    if (b.id === 'effacer-non') { rendreReglages(); return; }
    if (b.id === 'effacer-oui') { S = etatDefaut(); R = S.recette; sauver(); majEntete(); toast('Partie effacée.'); aller('domaine'); }
  });

  // =====================================================================
  // Démarrage
  // =====================================================================
  majEntete();
  aller('domaine');
})();
