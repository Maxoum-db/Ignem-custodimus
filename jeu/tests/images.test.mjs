import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { imagesJeu } from '../../scripts/construire-jeu.mjs';

const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'ignem-images-'));
// WebP lossless 1 × 1, conteneur réel ; les tests n'inventent aucun asset du jeu.
const webp = Buffer.from('UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==', 'base64');
try {
  assert.deepEqual(await imagesJeu(path.join(temp, 'absent')), {});
  assert.deepEqual(await imagesJeu(temp), {});
  await fs.writeFile(path.join(temp, 'a-cuve.webp'), webp);
  const images = await imagesJeu(temp);
  assert.equal(images['a-cuve'], 'data:image/webp;base64,' + webp.toString('base64'));
  await assert.rejects(imagesJeu(temp, 1), /Budget images/);
  await fs.writeFile(path.join(temp, 'Nom invalide.webp'), webp);
  await assert.rejects(imagesJeu(temp), /Nom de visuel/);
  await fs.unlink(path.join(temp, 'Nom invalide.webp'));
  await fs.writeFile(path.join(temp, 'a-cuve.webp'), '<html>Erreur réseau</html>');
  await assert.rejects(imagesJeu(temp), /WebP invalide/);
  await fs.writeFile(path.join(temp, 'a-cuve.webp'), webp.subarray(0, -1));
  await assert.rejects(imagesJeu(temp), /WebP invalide/);

  // Le module de présentation doit pouvoir démarrer sans images ni stockage.
  const window = {};
  vm.runInNewContext(await fs.readFile(new URL('../src/illustrations.js', import.meta.url), 'utf8'), {window, Image: class {}});
  const scene = await window.IllustrationsJeu.preparer('emp');
  assert.equal(scene.canvas, 'emp-canvas');
  assert.equal(scene.fond, null);
  assert.ok(scene.objets.every(x => x === null));
  assert.equal(await window.IllustrationsJeu.preparer('inconnue'), null);
  assert.equal(window.IllustrationsJeu.peindre(null, null), false);
  console.log('✓ Images : dossier absent, base64, budget, noms, conteneur invalide/tronqué, repli sans assets');
} finally {
  await fs.rm(temp, {recursive:true, force:true});
}
