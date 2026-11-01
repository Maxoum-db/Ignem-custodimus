/* Ignem custodimus — présentation illustrée, sans dépendance métier.
 * Le jeu pixel-art reste inchangé tant que les visuels définitifs sont absents.
 * Chaque scène utilise une couche de décor et des objets distincts ; les liquides,
 * la vapeur, les flammes et les jauges restent dessinés par les contrôleurs du jeu.
 */
(function () {
  'use strict';
  const scenes = Object.freeze({
    emp: { canvas: 'emp-canvas', fond: 'a-fond', objets: ['a-cuve-vide', 'a-tuyauterie'] },
    fil: { canvas: 'fil-canvas', fond: 'b-fond', objets: ['b-filtre-vide', 'b-bac'] },
    ebu: { canvas: 'ebu-canvas', fond: 'c-fond', objets: ['c-chaudiere-vide', 'c-houblon'] },
    fer: { canvas: 'fer-canvas', fond: 'd-fond', objets: ['d-fermenteur-vide', 'd-vanne-glycol'] },
    bou: { canvas: 'bou-canvas', fond: 'e-fond', objets: ['e-embouteilleuse', 'e-bouteilles-vides'] },
    ulysse: { canvas: 'ulysse', fond: 'f-fond', objets: ['f-alambic-vide', 'f-condenseur'] },
    bro: { canvas: 'bro-canvas', fond: 'f-fond', objets: ['f-alambic-vide', 'f-condenseur'] },
    rep: { canvas: 'rep-canvas', fond: 'f-fond', objets: ['f-alambic-vide', 'f-condenseur'] }
  });
  Object.values(scenes).forEach((scene) => { Object.freeze(scene.objets); Object.freeze(scene); });
  const cache = new Map();
  const registre = () => window.IMAGES_JEU || {};
  function charger(cle) {
    if (!Object.prototype.hasOwnProperty.call(registre(), cle)) return Promise.resolve(null);
    const source = registre()[cle];
    if (typeof source !== 'string' || !source.startsWith('data:image/webp;base64,')) return Promise.resolve(null);
    if (cache.has(cle) && cache.get(cle).source === source) return cache.get(cle).promesse;
    const promesse = new Promise((resolve) => {
      const img = new Image();
      // Une ressource qui ne répond pas ne doit jamais bloquer un atelier.
      const minuterie = setTimeout(() => terminer(null), 8000);
      function terminer(valeur) {
        clearTimeout(minuterie);
        img.onload = img.onerror = null;
        resolve(valeur);
      }
      img.decoding = 'async';
      img.onload = () => terminer(img);
      img.onerror = () => terminer(null);
      img.src = source;
    });
    cache.set(cle, { source, promesse });
    return promesse;
  }
  async function preparer(nom) {
    const scene = scenes[nom];
    if (!scene) return null;
    const cles = [scene.fond, ...scene.objets];
    const images = await Promise.all(cles.map(charger));
    return { canvas: scene.canvas, fond: images[0], objets: images.slice(1) };
  }
  function peindre(ctx, img, x, y, largeur, hauteur) {
    if (!ctx || !img || ![x, y, largeur, hauteur].every(Number.isFinite) || largeur <= 0 || hauteur <= 0) return false;
    ctx.save();
    try {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, x, y, largeur, hauteur);
      return true;
    } catch (e) { return false; }
    finally { ctx.restore(); }
  }
  // Les couches peuvent être rendues indépendamment du canvas des effets.
  // Aucune mutation du DOM ou de la sauvegarde n'a lieu au chargement.
  window.IllustrationsJeu = Object.freeze({ scenes, charger, preparer, peindre });
})();
