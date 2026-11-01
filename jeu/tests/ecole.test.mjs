// Tests du double dry hop et de l'école des leçons
import fs from 'node:fs';
import vm from 'node:vm';
import { donneesJeu } from '../../scripts/construire-jeu.mjs';

const ctx = { globalThis: {} };
for (const f of ['moteur.js', 'ecole.js']) vm.runInNewContext(fs.readFileSync(new URL('../src/' + f, import.meta.url), 'utf8'), ctx);
const { Moteur: M, Ecole: E } = ctx.globalThis;
const D = await donneesJeu();
M.init(D);
const id = (l, n) => D[l].find((e) => e.nom === n).id;
let echecs = 0;
const verifier = (cond, msg) => { console.log((cond ? '✓ ' : '✗ ') + msg); if (!cond) echecs++; };

const base = (houblons) => ({ volume: 1000, rendement: 0.75, malts: [{ id: id('malts', 'Pale Ale Soufflet'), kg: 250 }, { id: id('malts', "Flocons d'Avoine"), kg: 30 }],
  houblons: [{ id: id('houblons', 'Magnum'), g: 600, min: 60 }, ...houblons], levure: id('levures', 'Safale US-05'), eau: 'causse', palier: 67, ebullition: 60,
  fermentation: { temp: 19, reposDiacetyle: false }, cuisson: false });
const citra = id('houblons', 'Citra');
const sansDH = M.calculer(base([]));
const dh2 = M.calculer(base([{ id: citra, g: 8000, min: -1 }]));
const ddh = M.calculer(base([{ id: citra, g: 4000, min: -2 }, { id: citra, g: 4000, min: -1 }]));
const trop = M.calculer(base([{ id: citra, g: 12000, min: -2 }, { id: citra, g: 12000, min: -1 }]));
console.log(`  fruité : sans DH ${sansDH.profil.fruite.toFixed(1)}, DH J5 ${dh2.profil.fruite.toFixed(1)}, DDH ${ddh.profil.fruite.toFixed(1)} · atténuation ${Math.round(sansDH.attenuation * 100)} → ${Math.round(ddh.attenuation * 100)} %`);
verifier(ddh.dh.ddh && !dh2.dh.ddh, 'DDH reconnu avec 4 g/L au jour 2 et au jour 5');
verifier(ddh.profil.fruite > dh2.profil.fruite + 0.8, 'la biotransformation du DH J2 ajoute du fruité');
verifier(ddh.ibu === dh2.ibu, 'le houblon à cru n\'ajoute aucune amertume');
verifier(ddh.attenuation > sansDH.attenuation + 0.008, 'hop creep : la bière sèche un peu');
const defs = (r, rec) => M.noter(r, { mode: 'expert' }).defauts.map((d) => d.id);
verifier(defs(trop).includes('vegetal'), '24 g/L à cru : défaut végétal');
verifier(defs(ddh).includes('diacetyle') && !M.noter(M.calculer({ ...base([{ id: citra, g: 4000, min: -2 }, { id: citra, g: 4000, min: -1 }]), fermentation: { temp: 19, reposDiacetyle: true } }), { mode: 'expert' }).defauts.some((d) => d.id === 'diacetyle'), 'hop creep sans repos : diacétyle ; avec repos : rien');

// École
verifier(E.LECONS.length >= 10, `${E.LECONS.length} leçons`);
const ids = new Set(E.LECONS.map((l) => l.id));
for (const l of E.LECONS) {
  const okReq = (l.requiert || []).every((r) => ids.has(r));
  const okQuiz = l.quiz.length === 3 && l.quiz.every((q) => q[2].length === 3 && !q[2].includes(q[1]));
  const rec = l.recompense.recettes ? D.recettes.filter((x) => l.recompense.recettes.test(`${x.style} ${x.nom}`)).length : 1;
  const ing = (l.recompense.ingredients || []).every((re) => [D.malts, D.houblons, D.levures, D.sels, D.aromates, D.auxiliaires].some((L) => L.some((e) => re.test(e.nom))));
  if (!(okReq && okQuiz && rec > 0 && ing)) verifier(false, `leçon ${l.id} incohérente (prérequis ${okReq}, quiz ${okQuiz}, recettes ${rec}, ingrédients ${ing})`);
}
verifier(true, 'prérequis, quiz, recettes et ingrédients de chaque leçon existent');
const note = (r) => M.noter(r, { mode: 'expert' });
const L = (i) => E.LECONS.find((l) => l.id === i);
verifier(L('dryhop').defi.test({ res: ddh, note: { ...note(ddh), medaille: 'argent' } }) && !L('dryhop').defi.test({ res: dh2, note: { medaille: 'or' } }), 'le défi DDH exige les deux ajouts');
verifier(L('empatage').defi.test({ res: sansDH, note: { total: 30 } }), 'défi de l\'empâtage réussi par une pale ale à 67 °C');

console.log(echecs ? `\n${echecs} échec(s)` : '\nTous les tests passent.');
process.exit(echecs ? 1 : 0);
