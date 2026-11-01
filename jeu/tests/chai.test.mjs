// Tests du moteur du chai : un cœur de wash de malt élevé dans différents fûts
import fs from 'node:fs';
import vm from 'node:vm';
import { donneesJeu } from '../../scripts/construire-jeu.mjs';

const ctx = { globalThis: {} };
for (const f of ['moteur.js', 'distillerie.js', 'chai.js']) vm.runInNewContext(fs.readFileSync(new URL('../src/' + f, import.meta.url), 'utf8'), ctx);
const { Moteur: M, Distillerie: Di, Chai: C } = ctx.globalThis;
const D = await donneesJeu();
M.init(D); C.init(D.params);
const id = (l, n) => D[l].find((e) => e.nom === n).id;
let echecs = 0;
const verifier = (cond, msg) => { console.log((cond ? '✓ ' : '✗ ') + msg); if (!cond) echecs++; };

verifier(C.P.angePct === 3 && C.P.degreBouteille === 45 && C.P.bouteilleL === 0.7, 'paramètres du Hub : part des anges 3 %, mise à 45 %, bouteilles de 0,7 L');

const w = M.calculer({ volume: 1000, rendement: 0.75, destination: 'wash', malts: [{ id: id('malts', 'Pale Ale Soufflet'), kg: 260 }], houblons: [],
  levure: id('levures', 'Distilamax XP'), eau: 'causse', palier: 65, ebullition: 60, fermentation: { temp: 30, reposDiacetyle: false } });
const r = Di.repasseAuto(Di.brouillis(Di.preparerBrouillis(1000, w.abv, Di.congeneresBiere(w, [])), 1), { feu: 0.55, tetesPct: 4, queuesDegre: 60 });
const n = Di.noterEDV(r, { mode: 'expert' }), bl = Di.bilan(r);
const lot = (V) => ({ V, degre: 63.5, comp: n.composition, total: n.total, sources: ['malt'] });
const V = Math.min(57, bl.coeur.lap / 0.635);
const age = (type, taille, zone, ans, rem = 0, Vl = V) => C.vieillir(C.etatInitial(lot(Vl)), { type, taille, remplissages: rem }, zone, ans);

// Part des anges et climat
const m10 = age('bourbon', 'barrique', 1, 10, 0, 225), h10 = age('bourbon', 'barrique', 0, 10, 0, 225), b10 = age('bourbon', 'barrique', 2, 10, 0, 225);
verifier(Math.abs(1 - m10.V / 225 - (1 - Math.pow(0.97, 10))) < 0.01, `barrique au milieu : ${Math.round((1 - m10.V / 225) * 100)} % bus par les anges en 10 ans (3 %/an)`);
verifier(h10.V < m10.V && m10.V < b10.V, 'les anges boivent plus en haut du chai qu\'en bas');
verifier(h10.degre > 63.5 && b10.degre < 63.5, `degré : ${h10.degre.toFixed(1)} % en haut (chaud et sec), ${b10.degre.toFixed(1)} % en bas (frais et humide)`);

// Cinétique d'extraction
const q3 = age('bourbon', 'quartaut', 1, 3), b3 = age('bourbon', 'barrique', 1, 3, 0, 225);
verifier(q3.bois > b3.bois * 1.4, 'un quartaut extrait bien plus vite qu\'une barrique (rapport surface sur volume)');
const r1 = age('bourbon', 'quartaut', 1, 5, 1);
verifier(Math.abs(r1.bois / age('bourbon', 'quartaut', 1, 5).bois - 0.5) < 0.01, 'un second remplissage extrait moitié moins');
const c05 = age('bourbon', 'barrique', 1, 0.5, 0, 225).couleur, c4 = age('bourbon', 'barrique', 1, 4, 0, 225).couleur;
verifier(c05 / c4 > 0.25, `${Math.round((c05 / c4) * 100)} % de la couleur à 4 ans est déjà là après 6 mois`);
verifier(age('bourbon', 'quartaut', 1, 4).soufre < age('francais', 'quartaut', 1, 4).soufre, 'le charbon de l\'ex-bourbon retient mieux le soufre');
verifier(age('francais', 'quartaut', 1, 5).tanin > age('bourbon', 'quartaut', 1, 5).tanin * 2, 'le chêne français neuf donne bien plus de tanins');
verifier(age('tourbe', 'barrique', 1, 6, 0, 225).fume > 3, 'un ex-tourbé fume le distillat');
verifier(age('sherry', 'quartaut', 1, 5).vineux > 4 && age('sherry', 'quartaut', 1, 5).vinNotes[0].includes('raisins secs'), 'l\'ex-sherry donne des raisins secs');
verifier(age('armagnac', 'barrique', 1, 14, 0, 225).rancio > 2 && age('armagnac', 'barrique', 1, 5, 0, 225).rancio === 0, 'le rancio n\'apparaît qu\'après de longues années');

// Notation
const jeune = C.noter(age('bourbon', 'quartaut', 1, 1)), mur = C.noter(age('bourbon', 'quartaut', 1, 4)), vieux = C.noter(age('francais', 'quartaut', 1, 14));
console.log(`  bourbon quartaut 1 an ${jeune.total}, 4 ans ${mur.total}, chêne français 14 ans ${vieux.total}`);
verifier(jeune.defauts.some((d) => d.id === 'jeune') && !jeune.medaille, 'un an de fût : trop jeune, pas de médaille');
verifier(mur.medaille === 'or', 'un quartaut ex-bourbon de 4 ans sur un bon cœur décroche l\'or');
verifier(vieux.defauts.some((d) => d.id === 'tanins') && vieux.total < mur.total - 8, '14 ans en quartaut de chêne neuf : sur-boisé et tannique');
const vide = C.noter(age('bourbon', 'barrique', 1, 10, 0, 60));
verifier(vide.defauts.some((d) => d.id === 'oxydation'), 'une barrique au quart pleine pendant 10 ans s\'oxyde');

// Finition et assemblage
const base = age('bourbon', 'barrique', 1, 6, 0, 225);
const fini = C.vieillir(base, { type: 'sherry', taille: 'barrique', remplissages: 0 }, 1, 1);
verifier(fini.vineux > 2 && fini.vanille >= base.vanille && fini.futs.length === 2, 'une finition d\'un an en ex-sherry ajoute le vin sans effacer le bourbon');
const ass = C.assembler([age('bourbon', 'quartaut', 1, 3), age('sherry', 'quartaut', 1, 8)]);
verifier(ass.ageMin === 3 && ass.vineux > 0 && ass.vanille > 0, 'un assemblage garde l\'âge du plus jeune');

// Mise en bouteille et dénomination
const bt = C.bouteilles(mur.ratio ? age('bourbon', 'quartaut', 1, 4) : null);
verifier(bt.degre === 45 && bt.n > 60, `${bt.n} bouteilles de 70 cl à 45 % pour un quartaut`);
verifier(C.nom(age('bourbon', 'quartaut', 1, 4), 45) === 'Whisky de malt 4 ans', 'wash de malt, 4 ans, 45 % : whisky de malt');
verifier(C.nom(age('bourbon', 'quartaut', 1, 2), 45).startsWith('Eau-de-vie de malt'), 'moins de 3 ans : pas encore du whisky');
const biere = C.vieillir(C.etatInitial({ ...lot(V), sources: ['biere'] }), { type: 'bourbon', taille: 'quartaut' }, 1, 5);
verifier(C.nom(biere, 45).startsWith('Eau-de-vie de bière'), 'une bière houblonnée distillée reste une eau-de-vie de bière');

console.log(echecs ? `\n${echecs} échec(s)` : '\nTous les tests passent.');
process.exit(echecs ? 1 : 0);
