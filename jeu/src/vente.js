/* Ignem custodimus — calendrier des saisons et vente au pigeonnier
 * Une semaine passe à chaque brassin et à chaque distillation ; l'année compte 52 semaines, la semaine 0 tombe le 1er mars.
 * Les clients décrivent leurs goûts ; le joueur leur conseille une bouteille de son stock réel.
 */
(function (racine) {
  'use strict';
  const borne = (v, a, b) => Math.max(a, Math.min(b, v));
  const SAISONS = ['printemps', 'été', 'automne', 'hiver'];
  const semaineAn = (s) => ((s % 52) + 52) % 52;
  const saison = (s) => SAISONS[Math.floor(semaineAn(s) / 13)];
  const annee = (s) => Math.floor(s / 52) + 1;
  // Point de départ : la semaine réelle, comptée depuis le 1er mars
  function semaineDepuisDate(d) {
    const y = d.getMonth() >= 2 ? d.getFullYear() : d.getFullYear() - 1;
    return Math.max(0, Math.floor((d - new Date(y, 2, 1)) / (7 * 864e5)));
  }
  // Température de la cave de fermentation selon la saison
  const CAVE = { printemps: 17, 'été': 22, automne: 16, hiver: 12 };
  const MOIS = ['mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre', 'janvier', 'février'];
  const mois = (s) => MOIS[Math.min(11, Math.floor(semaineAn(s) / 4.34))];

  // Fraîcheur d'une bière : une IPA perd son houblon en 6 semaines, une bière forte se garde 30 semaines
  function fraicheur(a, s) {
    if (a.cat !== 'biere') return 1;
    const age = s - a.semaine, garde = a.abv >= 8 ? 30 : a.houblon >= 5 ? 6 : 12;
    return borne(1 - Math.max(0, age - garde) / (garde * 1.5), 0, 1);
  }

  // Prix de base en écus : bière au litre, eau-de-vie par bouteille de 50 cl, spiritueux vieilli par bouteille de 70 cl
  const PRIX = { biere: 1, edv: 6, vieilli: 15 };
  const UNITE = { biere: 'L', edv: 'bouteilles de 50 cl', vieilli: 'bouteilles de 70 cl' };

  const TYPES = {
    particulier: { nom: 'particulier', rep: 0, prix: 1 },
    restaurateur: { nom: 'restaurateur', rep: 20, prix: 0.9 },
    caviste: { nom: 'caviste', rep: 35, prix: 1.1 },
    amateur: { nom: 'amateur éclairé', rep: 55, prix: 1.4, exigence: 38 },
    touriste: { nom: 'touriste de passage', rep: 0, prix: 1.25 },
    fromager: { nom: 'fromager', rep: 25, prix: 1.05 },
    chef: { nom: 'chef cuisinier', rep: 45, prix: 1.5, exigence: 40 },
  };
  const NOMS = ['Mme Delpech', 'M. Lafon', 'Mme Bousquet', 'M. Couderc', 'Mme Vidal', 'M. Lacombe', 'Mme Roques', 'M. Fabre', 'Mme Calmels', 'M. Bonnet', 'Mme Garrigues', 'M. Pélissier', 'Mme Lagarde', 'M. Rouquette', 'Mme Andrieu', 'M. Malbec'];
  const LIEUX = ['de Caylus', 'de Septfonds', 'de Caussade', 'de Saint-Antonin', 'de Montpezat', 'de Cayriech', 'de Lalbenque', 'de Puylaroque', 'de Montauban', 'de Cahors'];
  const METIERS = { restaurateur: ['l\'auberge', 'le bistrot', 'la table d\'hôtes', 'le restaurant'], caviste: ['la cave', 'l\'épicerie fine', 'la boutique du terroir'],
    fromager: ['la fromagerie', 'la crèmerie du marché'], chef: ['la table étoilée', 'le restaurant gastronomique', 'l\'auberge du château'] };
  const VENUS = ['de Belgique', 'de Toulouse', 'de Bordeaux', 'des Pays-Bas', 'de Paris', 'd\'Angleterre', 'de Lyon', 'du Québec'];

  // Demandes : critères mesurables sur les produits, poids selon la saison
  // txt peut être une liste de formulations : le client en choisit une
  const DEMANDES = [
    { id: 'apero', cat: 'biere', txt: ['Une bière légère pour l\'apéro, pas trop forte, pas trop amère.', 'Quelque chose de facile pour l\'apéritif entre voisins.'], c: [['abv', null, 5], ['amer', null, 5]], s: { 'été': 2, printemps: 1.5 } },
    { id: 'amere', cat: 'biere', txt: ['Quelque chose de bien amer et houblonné, qui réveille.', 'Je veux sentir le houblon, et que ça amérise franchement.'], c: [['amer', 6, null], ['houblon', 5, null]], s: {} },
    { id: 'brune', cat: 'biere', txt: ['Une brune : café, chocolat, du torréfié.', 'Une bière noire, qui sent le café grillé.'], c: [['torrefie', 4, null], ['ebc', 45, null]], s: { hiver: 2, automne: 1.5 } },
    { id: 'blonde', cat: 'biere', txt: ['Une blonde désaltérante pour les chaleurs.', 'Une blonde bien fraîche pour la moisson.'], c: [['ebc', null, 14], ['abv', null, 5.8]], s: { 'été': 2.5 } },
    { id: 'forte', cat: 'biere', txt: ['Une bière forte pour les soirées d\'hiver, au coin du feu.', 'Du costaud, à siroter après la chasse.'], c: [['abv', 7, null], ['malte', 5, null]], s: { hiver: 2.5, automne: 1.5 } },
    { id: 'fruitee', cat: 'biere', txt: ['Fruitée, pas amère : ma femme n\'aime pas l\'amertume.', 'Une bière douce et fruitée, pour quelqu\'un qui n\'aime pas la bière.'], c: [['fruite', 4, null], ['amer', null, 4]], s: { printemps: 1.5, 'été': 1.5 } },
    { id: 'pils', cat: 'biere', txt: ['Une pils bien nette, comme en Bohême.', 'Une vraie lager, sèche et propre.'], c: [['sujet', 'pilsener'], ['fruite', null, 3]], s: { 'été': 1.5 } },
    { id: 'blanche', cat: 'biere', txt: ['Une blanche ou une weizen, pour la terrasse.', 'Une bière de blé, trouble, avec de la mousse.'], c: [['sujet', 'wheat']], s: { 'été': 2, printemps: 1.5 } },
    { id: 'ambree', cat: 'biere', txt: ['Une ambrée, ronde et maltée, pour accompagner un cassoulet.', 'Une rousse maltée pour le confit de canard.'], c: [['malte', 5, null], ['ebc', 18, 45]], s: { automne: 2, hiver: 1.5 } },
    { id: 'session', cat: 'biere', txt: ['Quelque chose qu\'on peut boire toute la journée des vendanges, très léger.', 'Une petite bière de soif, sous les 4 degrés.'], c: [['abv', null, 4.2], ['amer', null, 4.5]], s: { automne: 2, 'été': 1.5 } },
    { id: 'noel', cat: 'biere', txt: ['Une bière de Noël, épicée et ronde.', 'Pour le réveillon : forte, avec des épices.'], c: [['epice', 3, null], ['abv', 6, null]], s: { hiver: 3.5 } },
    { id: 'miel', cat: 'biere', txt: ['Une bière au miel du pays.', 'Il paraît que vous faites une bière au miel ?'], c: [['miel', 0.1, null]], s: { printemps: 1.8, 'été': 1.3 } },
    { id: 'fumee', cat: 'biere', txt: ['Une bière fumée pour la charcuterie et le jambon de pays.', 'Quelque chose de fumé, comme à Bamberg.'], c: [['fume', 2, null]], s: { automne: 1.5, hiver: 1.5 } },
    { id: 'auxfruits', cat: 'biere', txt: ['Une bière aux fruits pour l\'apéritif.', 'Vous avez une bière avec de vrais fruits dedans ?'], c: [['fruitAro', 1, null]], s: { 'été': 2, printemps: 1.5 } },
    { id: 'oktober', cat: 'biere', txt: ['Une märzen pour notre fête d\'octobre.', 'Une bière d\'Oktoberfest, ambrée et maltée.'], c: [['sujet', 'marzen']], s: { automne: 3 } },
    { id: 'stout', cat: 'biere', txt: ['Un vrai stout, noir et sec, comme à Dublin.', 'Un stout pour accompagner des huîtres.'], c: [['sujet', 'stout']], s: { hiver: 1.8 } },
    { id: 'ipa', cat: 'biere', txt: ['Une IPA bien fruitée, tropicale.', 'Une IPA américaine, avec du houblon partout.'], c: [['sujet', 'ipa'], ['houblon', 6, null]], s: {} },
    { id: 'saison', cat: 'biere', txt: ['Une saison, sèche et poivrée, comme en Wallonie.'], c: [['sujet', 'farmhouse']], s: { 'été': 1.8, printemps: 1.5 } },
    { id: 'mariage', cat: 'biere', txt: ['Pour un mariage : une blonde qui plaise à tout le monde.', 'Pour la fête du village : facile, blonde, sans défaut.'], c: [['ebc', null, 15], ['amer', null, 5], ['total', 30, null]], s: { 'été': 2, printemps: 1.5 }, types: ['restaurateur', 'caviste'], qte: 2 },
    { id: 'fromage', cat: 'biere', txt: ['Pour un plateau de fromages du Quercy : une ambrée maltée.', 'Avec le rocamadour, il me faut une bière ronde, pas trop amère.'], c: [['malte', 5, null], ['ebc', 14, 40], ['amer', null, 6]], s: {}, types: ['fromager', 'chef', 'restaurateur', 'particulier'] },
    { id: 'meilleure', cat: 'biere', txt: ['Votre meilleure bière, peu importe le style.', 'Ce que vous avez de mieux, je vous fais confiance.'], c: [['total', 38, null]], s: {}, types: ['restaurateur', 'caviste', 'amateur', 'chef'] },
    { id: 'decouverte', cat: 'biere', txt: ['Je suis de passage : faites-moi découvrir ce qui se fait ici.', 'Quelque chose de typique du domaine, pour ramener chez moi.'], c: [['total', 30, null]], s: { 'été': 2 }, types: ['touriste'] },
    { id: 'digestif', cat: 'edv', txt: ['Une eau-de-vie pour finir le repas.', 'Un petit digestif, comme on en faisait chez mon grand-père.'], c: [['total', 28, null]], s: { hiver: 1.5, automne: 1.3 } },
    { id: 'edvfruit', cat: 'edv', txt: ['Une eau-de-vie fruitée, pas brûlante.'], c: [['fruite', 3, null], ['chaleur', null, 5]], s: {} },
    { id: 'gin', cat: 'edv', txt: ['Un alcool aux plantes pour mes cocktails, genre gin.', 'Une eau-de-vie aromatique, avec des baies et des agrumes.'], c: [['botanique', 0.5, null]], s: { 'été': 1.8 }, types: ['particulier', 'restaurateur', 'chef', 'touriste'] },
    { id: 'newmake', cat: 'edv', txt: ['Une eau-de-vie de malt, je veux la vieillir moi-même en petit fût.'], c: [['malt', 1, null], ['total', 30, null]], s: {}, types: ['amateur', 'caviste', 'particulier'] },
    { id: 'whisky', cat: 'vieilli', txt: ['Un whisky du pays, pour changer de l\'écossais.', 'Un whisky français, c\'est possible ?'], c: [['whisky', 1]], s: { hiver: 1.5 } },
    { id: 'tourbe', cat: 'vieilli', txt: ['Quelque chose de tourbé, qui sent le feu de bois.'], c: [['fume', 3, null]], s: { hiver: 1.5 } },
    { id: 'vieux', cat: 'vieilli', txt: ['Un vieux, bien boisé, vanillé.'], c: [['age', 5, null], ['vanille', 4, null]], s: {} },
    { id: 'cadeau', cat: 'vieilli', txt: ['Une belle bouteille à offrir, médaillée si possible.', 'Pour l\'anniversaire de mon père : quelque chose qui en jette.'], c: [['total', 38, null]], s: { hiver: 2.5 } },
    { id: 'finition', cat: 'vieilli', txt: ['Un whisky fini en fût de vin, sherry ou Cahors.'], c: [['vineux', 2, null]], s: {}, types: ['amateur', 'caviste', 'chef'] },
    { id: 'chene', cat: 'vieilli', txt: ['Un spiritueux élevé dans le chêne du Quercy.', 'J\'aime l\'idée d\'un fût fait avec le bois d\'ici.'], c: [['domaine', 1, null]], s: {}, types: ['touriste', 'caviste', 'amateur', 'particulier'] },
    { id: 'cocktail', cat: 'vieilli', txt: ['Un whisky jeune et vif pour les cocktails du bar.'], c: [['whisky', 1], ['age', null, 4]], s: { 'été': 1.5 }, types: ['restaurateur', 'chef'] },
  ];
  const QTE = {
    biere: { particulier: [2, 5], restaurateur: [20, 40], caviste: [8, 16], amateur: [2, 4], touriste: [2, 6], fromager: [6, 12], chef: [10, 20] },
    edv: { particulier: [1, 2], restaurateur: [2, 3], caviste: [3, 6], amateur: [1, 2], touriste: [1, 2], fromager: [1, 2], chef: [2, 4] },
    vieilli: { particulier: [1, 1], restaurateur: [1, 2], caviste: [3, 6], amateur: [1, 3], touriste: [1, 2], fromager: [1, 1], chef: [1, 3] },
  };
  const formulation = (r, d) => (Array.isArray(d.txt) ? choisir(r, d.txt) : d.txt);

  function aleatoire(graine) { let s = (graine * 2654435761) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  const choisir = (r, l) => l[Math.floor(r() * l.length)];
  function tirerDemande(r, sais, type, cats) {
    const l = DEMANDES.filter((d) => cats.includes(d.cat) && (!d.types || d.types.includes(type)));
    if (!l.length) return null;
    const poids = l.map((d) => (d.s[sais] || 1) * (d.cat === 'biere' ? 1 : 0.7));
    let x = r() * poids.reduce((a, b) => a + b, 0);
    for (let i = 0; i < l.length; i++) { x -= poids[i]; if (x <= 0) return l[i]; }
    return l[l.length - 1];
  }
  // Clients d'une semaine : plus nombreux et plus exigeants avec la réputation
  function clientsSemaine(s, rep, cats) {
    const r = aleatoire(s * 7919 + 13), sais = saison(s);
    const n = Math.min(5, 2 + Math.floor(rep / 25) + (r() < 0.4 ? 1 : 0));
    const types = Object.entries(TYPES).filter(([, t]) => rep >= t.rep).map(([k]) => k);
    const out = [];
    for (let i = 0; i < n; i++) {
      const type = r() < 0.4 ? 'particulier' : sais === 'été' && r() < 0.35 ? 'touriste' : choisir(r, types);
      const d = tirerDemande(r, sais, type, cats.length ? cats : ['biere']);
      if (!d) continue;
      const [a, b] = QTE[d.cat][type];
      const lieu = type === 'touriste' ? `venu ${choisir(r, VENUS)}` : METIERS[type] ? `${choisir(r, METIERS[type])} ${choisir(r, LIEUX)}` : choisir(r, LIEUX);
      out.push({ id: `${s}-${i}`, nom: choisir(r, NOMS), type, lieu, demande: d.id, txt: formulation(r, d), qte: Math.round((a + r() * (b - a)) * (d.qte || 1)), semaine: s });
    }
    return out;
  }
  // Commande spéciale : grosse quantité, note minimale, échéance de 4 semaines
  const COMMANDEURS = {
    biere: ['La fête de la bière de Caussade', 'Le marché de nuit de Saint-Antonin', 'Le comité des fêtes de Cayriech', 'L\'auberge du Lot', 'Le festival de Montauban', 'Le club de rugby de Caussade', 'Le mariage du château de Cas'],
    edv: ['Le bar à cocktails de Cahors', 'L\'épicerie fine de Montauban', 'La distillerie voisine, en manque de stock'],
    vieilli: ['Le caviste de Toulouse', 'La cave de Cahors', 'Le salon des spiritueux de Bordeaux', 'La table étoilée de Montauban'],
  };
  function commandeSemaine(s, rep, cats = ['biere']) {
    if (rep < 35) return null;
    const r = aleatoire(s * 104729 + 7);
    if (r() > 0.28) return null;
    const cat = choisir(r, cats.length ? cats : ['biere']);
    const d = choisir(r, DEMANDES.filter((x) => x.cat === cat && !['meilleure', 'decouverte'].includes(x.id)));
    if (!d) return null;
    const qte = cat === 'biere' ? 60 + Math.round(r() * 7) * 20 : cat === 'edv' ? 6 + Math.round(r() * 6) : 6 + Math.round(r() * 3) * 6;
    const prime = Math.round(qte * (cat === 'biere' ? 1.6 : cat === 'edv' ? 9 : 24));
    return { id: 'c' + s, nom: choisir(r, COMMANDEURS[cat]), cat, demande: d.id, txt: formulation(r, d), qte, note: cat === 'vieilli' ? 36 : 34, echeance: s + (cat === 'vieilli' ? 6 : 4), prime, rep: cat === 'biere' ? 6 : 8 };
  }

  // Satisfaction du client : critères respectés (avec crédit partiel), qualité, fraîcheur
  function verifier(c, a) {
    const [k, min, max] = c;
    if (k === 'sujet') return a.sujet === min ? 1 : 0;
    if (k === 'whisky') return a.whisky ? 1 : 0;
    const v = a[k];
    if (v == null) return 0;
    if (min != null && v < min) return borne(1 - (min - v) / Math.max(1, Math.abs(min) * 0.5), 0, 1) * 0.6;
    if (max != null && v > max) return borne(1 - (v - max) / Math.max(1, Math.abs(max) * 0.5), 0, 1) * 0.6;
    return 1;
  }
  function satisfaction(client, a, s) {
    const d = DEMANDES.find((x) => x.id === client.demande), t = TYPES[client.type];
    if (!d || a.cat !== d.cat) return { s: 0.05, detail: 'Ce n\'est pas du tout ce que je cherchais.' };
    const scores = d.c.map((c) => verifier(c, a));
    const accord = scores.reduce((x, y) => x + y, 0) / scores.length;
    let v = 0.6 * accord + 0.4 * borne(a.total / 50, 0, 1);
    const fr = fraicheur(a, s);
    v *= 0.5 + 0.5 * fr;
    if (t.exigence && a.total < t.exigence) v *= 0.75;
    v = borne(v, 0, 1);
    const detail = v > 0.85 ? 'Exactement ce qu\'il me fallait. Je reviendrai, et j\'en parlerai.' : v > 0.65 ? 'Très bien, merci du conseil.' : v > 0.45 ? 'Ça ira, même si ce n\'est pas tout à fait ce que j\'imaginais.' : 'Hum… ce n\'est pas vraiment ça.';
    return { s: v, accord, fraicheur: fr, detail: fr < 0.5 ? `${detail} Elle a perdu de sa fraîcheur.` : detail };
  }
  function prix(client, a, qte, sat, rep) {
    const t = TYPES[client.type];
    const age = a.cat === 'vieilli' ? 1 + (a.age || 0) / 8 : 1;
    const brut = PRIX[a.cat] * qte * (0.5 + sat) * (1 + rep / 200) * t.prix * age;
    const pourboire = sat > 0.85 ? Math.round(brut * 0.15) : 0;
    return { ecus: Math.round(brut), pourboire };
  }
  const variationRep = (sat) => borne(Math.round((sat - 0.55) * 8), -3, 4);

  racine.Vente = { SAISONS, saison, annee, semaineAn, mois, semaineDepuisDate, CAVE, fraicheur, PRIX, UNITE, TYPES, DEMANDES, clientsSemaine, commandeSemaine, satisfaction, prix, variationRep, verifier };
})(typeof globalThis !== 'undefined' ? globalThis : window);
