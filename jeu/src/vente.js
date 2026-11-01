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
  };
  const NOMS = ['Mme Delpech', 'M. Lafon', 'Mme Bousquet', 'M. Couderc', 'Mme Vidal', 'M. Lacombe', 'Mme Roques', 'M. Fabre', 'Mme Calmels', 'M. Bonnet', 'Mme Garrigues', 'M. Pélissier', 'Mme Lagarde', 'M. Rouquette', 'Mme Andrieu', 'M. Malbec'];
  const LIEUX = ['de Caylus', 'de Septfonds', 'de Caussade', 'de Saint-Antonin', 'de Montpezat', 'de Cayriech', 'de Lalbenque', 'de Puylaroque', 'de Montauban', 'de Cahors'];
  const METIERS = { restaurateur: ['l\'auberge', 'le bistrot', 'la table d\'hôtes', 'le restaurant'], caviste: ['la cave', 'l\'épicerie fine', 'la boutique du terroir'] };

  // Demandes : critères mesurables sur les produits, poids selon la saison
  const DEMANDES = [
    { id: 'apero', cat: 'biere', txt: 'Une bière légère pour l\'apéro, pas trop forte, pas trop amère.', c: [['abv', null, 5], ['amer', null, 5]], s: { 'été': 2, printemps: 1.5 } },
    { id: 'amere', cat: 'biere', txt: 'Quelque chose de bien amer et houblonné, qui réveille.', c: [['amer', 6, null], ['houblon', 5, null]], s: {} },
    { id: 'brune', cat: 'biere', txt: 'Une brune : café, chocolat, du torréfié.', c: [['torrefie', 4, null], ['ebc', 45, null]], s: { hiver: 2, automne: 1.5 } },
    { id: 'blonde', cat: 'biere', txt: 'Une blonde désaltérante pour les chaleurs.', c: [['ebc', null, 14], ['abv', null, 5.8]], s: { 'été': 2.5 } },
    { id: 'forte', cat: 'biere', txt: 'Une bière forte pour les soirées d\'hiver, au coin du feu.', c: [['abv', 7, null], ['malte', 5, null]], s: { hiver: 2.5, automne: 1.5 } },
    { id: 'fruitee', cat: 'biere', txt: 'Fruitée, pas amère : ma femme n\'aime pas l\'amertume.', c: [['fruite', 4, null], ['amer', null, 4]], s: { printemps: 1.5, 'été': 1.5 } },
    { id: 'pils', cat: 'biere', txt: 'Une pils bien nette, comme en Bohême.', c: [['sujet', 'pilsener'], ['fruite', null, 3]], s: { 'été': 1.5 } },
    { id: 'blanche', cat: 'biere', txt: 'Une blanche ou une weizen, pour la terrasse.', c: [['sujet', 'wheat']], s: { 'été': 2, printemps: 1.5 } },
    { id: 'ambree', cat: 'biere', txt: 'Une ambrée, ronde et maltée, pour accompagner un cassoulet.', c: [['malte', 5, null], ['ebc', 18, 45]], s: { automne: 2, hiver: 1.5 } },
    { id: 'meilleure', cat: 'biere', txt: 'Votre meilleure bière, peu importe le style.', c: [['total', 38, null]], s: {}, types: ['restaurateur', 'caviste', 'amateur'] },
    { id: 'digestif', cat: 'edv', txt: 'Une eau-de-vie pour finir le repas.', c: [['total', 28, null]], s: { hiver: 1.5, automne: 1.3 } },
    { id: 'edvfruit', cat: 'edv', txt: 'Une eau-de-vie fruitée, pas brûlante.', c: [['fruite', 3, null], ['chaleur', null, 5]], s: {} },
    { id: 'whisky', cat: 'vieilli', txt: 'Un whisky du pays, pour changer de l\'écossais.', c: [['whisky', 1]], s: { hiver: 1.5 } },
    { id: 'tourbe', cat: 'vieilli', txt: 'Quelque chose de tourbé, qui sent le feu de bois.', c: [['fume', 3, null]], s: { hiver: 1.5 } },
    { id: 'vieux', cat: 'vieilli', txt: 'Un vieux, bien boisé, vanillé.', c: [['age', 5, null], ['vanille', 4, null]], s: {} },
    { id: 'cadeau', cat: 'vieilli', txt: 'Une belle bouteille à offrir, médaillée si possible.', c: [['total', 38, null]], s: { hiver: 2.5 } },
  ];
  const QTE = {
    biere: { particulier: [2, 5], restaurateur: [20, 40], caviste: [8, 16], amateur: [2, 4] },
    edv: { particulier: [1, 2], restaurateur: [2, 3], caviste: [3, 6], amateur: [1, 2] },
    vieilli: { particulier: [1, 1], restaurateur: [1, 2], caviste: [3, 6], amateur: [1, 3] },
  };

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
      const type = r() < 0.5 ? 'particulier' : choisir(r, types);
      const d = tirerDemande(r, sais, type, cats.length ? cats : ['biere']);
      if (!d) continue;
      const [a, b] = QTE[d.cat][type];
      const lieu = type === 'particulier' || type === 'amateur' ? choisir(r, LIEUX) : `${choisir(r, METIERS[type])} ${choisir(r, LIEUX)}`;
      out.push({ id: `${s}-${i}`, nom: choisir(r, NOMS), type, lieu, demande: d.id, qte: Math.round(a + r() * (b - a)), semaine: s });
    }
    return out;
  }
  // Commande spéciale : grosse quantité, note minimale, échéance de 4 semaines
  function commandeSemaine(s, rep) {
    if (rep < 35) return null;
    const r = aleatoire(s * 104729 + 7);
    if (r() > 0.25) return null;
    const d = choisir(r, DEMANDES.filter((x) => x.cat === 'biere' && x.id !== 'meilleure'));
    const qte = 80 + Math.round(r() * 8) * 20;
    return { id: 'c' + s, nom: choisir(r, ['La fête de la bière de Caussade', 'Le marché de nuit de Saint-Antonin', 'Le comité des fêtes de Cayriech', 'L\'auberge du Lot', 'Le festival de Montauban']), demande: d.id, qte, note: 34, echeance: s + 4, prime: Math.round(qte * 1.6), rep: 6 };
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
