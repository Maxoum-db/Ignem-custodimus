// Tests du moteur de distillation : une IPA distillée avec différentes coupes
import fs from 'node:fs';
import vm from 'node:vm';
import { donneesJeu } from '../../scripts/construire-jeu.mjs';

const ctx = { globalThis: {} };
for (const f of ['moteur.js', 'distillerie.js']) vm.runInNewContext(fs.readFileSync(new URL('../src/' + f, import.meta.url), 'utf8'), ctx);
const { Moteur: M, Distillerie: Di } = ctx.globalThis;
const D = await donneesJeu();
M.init(D);
const id = (l, n) => D[l].find((e) => e.nom === n).id;

let echecs = 0;
const verifier = (cond, msg) => { console.log((cond ? '✓ ' : '✗ ') + msg); if (!cond) echecs++; };

// Équilibre liquide-vapeur
verifier(Math.abs(Di.vapeur(10, 1) - 49.5) < 0.1, 'un moût à 10 % donne une vapeur à 49,5 %');
verifier(Di.vapeur(25, Di.plateaux(0.3)) > Di.vapeur(25, Di.plateaux(0.9)), 'une chauffe douce enrichit la vapeur (reflux)');

const ipa = M.calculer({ volume: 1000, rendement: 0.75, malts: [{ id: id('malts', 'Pale Ale Soufflet'), kg: 245 }],
  houblons: [{ id: id('houblons', 'Magnum'), g: 1600, min: 60 }, { id: id('houblons', 'Cascade'), g: 6000, min: -1 }],
  levure: id('levures', 'Safale US-05'), eau: 'burton', palier: 66, ebullition: 60, fermentation: { temp: 19, reposDiacetyle: false } });
const q = Di.congeneresBiere(ipa, []);
const b = Di.brouillis(Di.preparerBrouillis(1000, ipa.abv, q), 1);
verifier(b.degre > 18 && b.degre < 32, `brouillis à ${b.degre.toFixed(1)} % (attendu 18–32 %)`);
verifier(b.recuperation > 0.9, `${Math.round(b.recuperation * 100)} % de l'alcool récupéré au brouillis`);

const essai = (rg) => { const r = Di.repasseAuto(b, rg); return { r, n: Di.noterEDV(r, { mode: 'expert' }), bl: Di.bilan(r) }; };
const juste = essai({ feu: 0.55, tetesPct: 4, queuesDegre: 60 });
const large = essai({ feu: 0.55, tetesPct: 4, queuesDegre: 30 });
const sansTetes = essai({ feu: 0.55, tetesPct: 0.3, queuesDegre: 60 });
const serre = essai({ feu: 0.55, tetesPct: 10, queuesDegre: 70 });
const lap = ipa.abv * 10;
console.log(`  juste : ${juste.n.total}/50, cœur ${juste.bl.coeur.lap.toFixed(1)} LAP à ${juste.bl.coeur.degre.toFixed(0)} %`);
console.log(`  large : ${large.n.total}/50, cœur ${large.bl.coeur.lap.toFixed(1)} LAP`);
console.log(`  sans têtes : ${sansTetes.n.total}/50 · serré : ${serre.n.total}/50, ${serre.bl.coeur.V.toFixed(1)} L`);
verifier(juste.bl.coeur.degre > 62 && juste.bl.coeur.degre < 72, 'le cœur sort entre 62 et 72 %');
verifier(juste.n.medaille === 'or', 'des coupes justes sur une IPA donnent l\'or');
verifier(large.bl.coeur.lap > juste.bl.coeur.lap && large.n.total < juste.n.total - 5, 'un cœur large rapporte plus d\'alcool mais coûte des points');
verifier(sansTetes.n.defauts.some((d) => d.id === 'tetes' && d.gravite === 3), 'oublier les têtes donne un défaut grave');
verifier(!serre.n.presentable && serre.n.medaille === null, 'un cœur de quelques décilitres ne passe pas au jury');
verifier(juste.bl.coeur.lap / lap > 0.5, `rendement en cœur ${Math.round((juste.bl.coeur.lap / lap) * 100)} % du LAP de la bière`);

console.log(echecs ? `\n${echecs} échec(s)` : '\nTous les tests passent.');
process.exit(echecs ? 1 : 0);
