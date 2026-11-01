// Pipeline de présentation uniquement : aucun accès aux données ou aux sauvegardes.
import fs from 'node:fs/promises';
import path from 'node:path';

export const BUDGET_IMAGES = 6 * 1024 * 1024;

// Lit les trois en-têtes WebP normalisés (VP8, VP8L, VP8X). Le décodage
// des pixels reste au navigateur ; un simple fichier renommé est refusé ici.
export function dimensionsWebP(b) {
  const invalide = () => { throw new Error('En-tête WebP invalide ou tronqué'); };
  if (b.length < 20 || b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP' || b.readUInt32LE(4) + 8 !== b.length) invalide();
  let taille = null, image = false;
  for (let i = 12; i < b.length;) {
    if (i + 8 > b.length) invalide();
    const type = b.toString('ascii', i, i + 4), n = b.readUInt32LE(i + 4), p = i + 8;
    if (p + n + (n % 2) > b.length) invalide();
    if (type === 'ANIM' || type === 'ANMF') throw new Error('WebP animé interdit : utiliser des sprites pilotés par le code');
    if (type === 'VP8X') {
      if (n !== 10) invalide();
      taille = { largeur: b.readUIntLE(p + 4, 3) + 1, hauteur: b.readUIntLE(p + 7, 3) + 1 };
    } else if (type === 'VP8L') {
      if (n < 5 || b[p] !== 0x2f) invalide();
      const bits = b.readUInt32LE(p + 1);
      taille ||= { largeur: (bits & 0x3fff) + 1, hauteur: ((bits >>> 14) & 0x3fff) + 1 };
      image = true;
    } else if (type === 'VP8 ') {
      if (n < 10 || b[p + 3] !== 0x9d || b[p + 4] !== 0x01 || b[p + 5] !== 0x2a) invalide();
      taille ||= { largeur: b.readUInt16LE(p + 6) & 0x3fff, hauteur: b.readUInt16LE(p + 8) & 0x3fff };
      image = true;
    }
    i = p + n + (n % 2);
  }
  if (!image || !taille || !taille.largeur || !taille.hauteur) invalide();
  return taille;
}

export async function imagesJeu(dossier, { budget = BUDGET_IMAGES } = {}) {
  let fichiers;
  try { fichiers = await fs.readdir(dossier, { withFileTypes: true }); }
  catch (e) { if (e.code === 'ENOENT') return {}; throw e; }
  // Un objet sans prototype évite les collisions avec des noms tels que « constructor ».
  const images = Object.create(null);
  let total = 0;
  for (const fichier of fichiers.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const nom = fichier.name;
    if (!/\.webp$/i.test(nom)) continue;
    if (!fichier.isFile() || !/^[a-z0-9][a-z0-9_-]*\.webp$/.test(nom)) throw new Error('Nom de visuel non conforme : ' + nom);
    const cible = path.join(dossier, nom);
    // Vérification avant la lecture : ne pas allouer un fichier hors budget.
    total += (await fs.stat(cible)).size;
    if (total > budget) throw new Error('Budget images dépassé : 6 Mio maximum');
    const donnees = await fs.readFile(cible);
    let dimensions;
    try { dimensions = dimensionsWebP(donnees); }
    catch (e) { throw new Error(nom + ' : ' + e.message); }
    const max = /(?:^|-)(fond|batiment|decor)(?:-|\.)/.test(nom) ? 1024 : 512;
    if (Math.max(dimensions.largeur, dimensions.hauteur) > max) throw new Error(`${nom} : dimensions supérieures à ${max} px`);
    images[nom.slice(0, -5)] = 'data:image/webp;base64,' + donnees.toString('base64');
  }
  return images;
}
