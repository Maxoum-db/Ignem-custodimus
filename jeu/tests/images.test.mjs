import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { imagesJeu, dimensionsWebP } from '../../scripts/images-jeu.mjs';

// Vrais fichiers générés avec libwebp : 2 × 3 pixels, alpha, qualité 82 / sans perte.
const webp = Buffer.from('UklGRmAAAABXRUJQVlA4WAoAAAAQAAAAAQAAAgAAQUxQSAcAAAAAZGRkZGRkAFZQOCAyAAAA0AEAnQEqAgADAAFAIiWgAnS6AfgAA7AA/uqff/4M78Gd+DO/8OU/94z/bJ/tk/+MAAA=', 'base64');
const sansPerte = Buffer.from('UklGRhwAAABXRUJQVlA4TBAAAAAvAYAAEAdQwP5HyQIR0f8A', 'base64');
const large = Buffer.from('UklGRhoAAABXRUJQVlA4TA4AAAAvAAIAAAcQEf0PRET/Aw==', 'base64');
const tropLarge = Buffer.from('UklGRhoAAABXRUJQVlA4TA4AAAAvAAQAAAcQEf0PRET/Aw==', 'base64');
const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'ignem-images-'));
try {
  assert.deepEqual(await imagesJeu(path.join(tmp, 'absent')), {});
  assert.equal(Object.keys(await imagesJeu(tmp)).length, 0);
  assert.deepEqual(dimensionsWebP(webp), { largeur: 2, hauteur: 3 });
  assert.deepEqual(dimensionsWebP(sansPerte), { largeur: 2, hauteur: 3 });
  await fs.writeFile(path.join(tmp, 'a-cuve-vide.webp'), webp);
  const registre = await imagesJeu(tmp);
  assert.equal(registre['a-cuve-vide'], 'data:image/webp;base64,' + webp.toString('base64'));
  await assert.rejects(imagesJeu(tmp, { budget: webp.length - 1 }), /Budget images/);
  await fs.writeFile(path.join(tmp, 'A.webp'), webp);
  await assert.rejects(imagesJeu(tmp), /Nom de visuel/);
  await fs.rename(path.join(tmp, 'A.webp'), path.join(tmp, 'a.WEBP'));
  await assert.rejects(imagesJeu(tmp), /Nom de visuel/);
  await fs.rm(path.join(tmp, 'a.WEBP'));
  await fs.writeFile(path.join(tmp, 'b.webp'), Buffer.from('faux fichier renommé'));
  await assert.rejects(imagesJeu(tmp), /WebP invalide/);
  await fs.writeFile(path.join(tmp, 'b.webp'), webp.subarray(0, webp.length - 1));
  await assert.rejects(imagesJeu(tmp), /tronqué/);
  await fs.writeFile(path.join(tmp, 'b.webp'), large);
  await assert.rejects(imagesJeu(tmp), /512 px/);
  await fs.rename(path.join(tmp, 'b.webp'), path.join(tmp, 'b-fond.webp'));
  assert.ok((await imagesJeu(tmp))['b-fond']);
  await fs.writeFile(path.join(tmp, 'b-fond.webp'), tropLarge);
  await assert.rejects(imagesJeu(tmp), /1024 px/);
  await fs.rm(path.join(tmp, 'b-fond.webp'));
  await fs.symlink(path.join(tmp, 'a-cuve-vide.webp'), path.join(tmp, 'lien.webp'));
  await assert.rejects(imagesJeu(tmp), /Nom de visuel/);
  console.log('✓ pipeline : dossier absent, encodage exact, budget, noms, en-têtes, tailles et liens');
} finally { await fs.rm(tmp, { recursive: true, force: true }); }

const code = await fs.readFile(new URL('../src/illustrations.js', import.meta.url), 'utf8');
let crees = 0;
const temporisations = new Set();
class ImageTest {
  constructor() { crees++; }
  set src(source) {
    if (source.endsWith('attente')) return;
    queueMicrotask(() => source.endsWith('erreur') ? this.onerror?.() : this.onload?.());
  }
}
const window = { IMAGES_JEU: { bon: 'data:image/webp;base64,bon', erreur: 'data:image/webp;base64,erreur', attente: 'data:image/webp;base64,attente', externe: 'https://example.org/x.webp' } };
vm.runInNewContext(code, { window, Image: ImageTest, setTimeout: (fn) => { temporisations.add(fn); return fn; }, clearTimeout: (fn) => temporisations.delete(fn) });
const I = window.IllustrationsJeu;
assert.equal(await I.charger('absent'), null);
assert.equal(await I.charger('externe'), null);
const un = I.charger('bon'), deux = I.charger('bon');
assert.equal(un, deux);
assert.ok(await un);
assert.equal(crees, 1);
assert.equal(await I.charger('erreur'), null);
const attente = I.charger('attente');
for (const terminer of temporisations) terminer();
assert.equal(await attente, null);
assert.equal(temporisations.size, 0);
window.IMAGES_JEU.bon += 'nouvelle';
assert.notEqual(I.charger('bon'), un);
await I.charger('bon');
assert.equal(await I.preparer('inconnu'), null);
const html = await fs.readFile(new URL('../src/page.html', import.meta.url), 'utf8');
for (const scene of Object.values(I.scenes)) {
  assert.ok(html.includes('id="' + scene.canvas + '"'), scene.canvas);
  assert.ok(Object.isFrozen(scene));
  assert.ok(Object.isFrozen(scene.objets));
}
const scene = await I.preparer('emp');
assert.equal(scene.fond, null);
assert.ok(scene.objets.every((img) => img === null));
let sauvegardes = 0, restaurations = 0;
const ctx = { save() { sauvegardes++; }, restore() { restaurations++; }, drawImage() { throw new Error('image invalide'); } };
assert.equal(I.peindre(ctx, {}, 0, 0, 10, 10), false);
assert.equal(sauvegardes, restaurations);
ctx.drawImage = () => {};
assert.equal(I.peindre(ctx, {}, 0, 0, 10, 10), true);
assert.equal(I.peindre(ctx, {}, 0, 0, 0, 10), false);
console.log('✓ chargeur : cache, erreurs, expiration, absence d’images, registres immuables, Canvas restauré');
