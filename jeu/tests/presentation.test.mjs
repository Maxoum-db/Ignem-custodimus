// Garde-fou du lot graphique : les sept raccords de dessin doivent être les
// seules différences dans le contrôleur historique. Aucun calcul ni événement
// ne peut être modifié discrètement pendant cette intégration.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';

const sha = (contenu) => createHash('sha256').update(contenu).digest('hex');
const reference = {
  'moteur.js': 'f05c48d3ec29831428635b7fe6970abe766da9759f1a9d11bf028aabc32d115c',
  'distillerie.js': 'e1817b72fb4d64137cab9e5963afd4d75f92ff8f81480b4a0d3b39b67543fc91',
  'chai.js': '3174dc6aae5b934cfa08f781646749057996d13b5f2855872f3d62e901ba1b32',
  'ecole.js': '3349d56f7a6868d80f90737694f7f374ed763cab4002237aea363a87b2c022dd',
  'vente.js': '11094c521410d55fd002eb54c615789c0260c5246cd3b11185cd5a45fb4900d1'
};
for (const [nom, hash] of Object.entries(reference)) assert.equal(sha(await fs.readFile(new URL('../src/' + nom, import.meta.url))), hash, nom + ' doit rester inchangé');
const controleur = await fs.readFile(new URL('../src/jeu.js', import.meta.url), 'utf8');
const lignes = controleur.split('\n');
const ponts = lignes.filter(l => l.includes('window.AteliersIllustres?.rendre') || l.includes('const teinteFiltration ='));
assert.equal(ponts.length, 7, 'Six raccords de dessin et une couleur précalculée');
assert.equal(sha(lignes.filter(l => !ponts.includes(l)).join('\n')), '08c64d760a2518d236920d03bb331c32dec8827e4ac9689c8b1913067b1f270b', 'Le contrôleur hors dessin doit rester identique à la phase 0');
console.log('✓ cinq moteurs strictement identiques ; seuls les sept raccords de dessin changent dans jeu.js');
