# Illustrations — brasserie A–E

Le vrai jeu utilise désormais ces illustrations dans `jeu/src/ateliers.js`,
chargé avant `jeu.js`. Le dessin historique reste un repli fonctionnel.

## Assets livrés

Illustrations originales produites avec `image_gen`, puis redimensionnées et
encodées en WebP qualité **82** avec ImageMagick. Les PNG de génération restent
dans le workspace ; les WebP sont les sources de production du dépôt.
Aucun texte, liquide, vapeur, feu ou jauge n'est peint dans les équipements.
Les dimensions et les empreintes des fichiers sont dans `manifest.json`.

| Asset | Dimensions | Usage | Transparence |
| --- | --- | --- | --- |
| `brasserie-fond.webp` | 1024 × 683 | Décor commun de brasserie en pierre du Quercy | Fond opaque prévu |
| `a-cuve-vide.webp` | 512 × 427 | Cuve vide, préparation, empâtage et ébullition | Alpha réel |
| `b-filtre-vide.webp` | 512 × 468 | Cuve-filtre vide et faux fond | Alpha réel |
| `d-fermenteur-vide.webp` | 341 × 512 | Fermenteur cylindro-conique inox | Alpha réel |
| `e-capsuleuse.webp` | 485 × 512 | Capsuleuse indépendante | Alpha réel |

**Total : 230 356 octets, soit environ 225 Kio sur le budget de 6 Mio.**
Le navigateur décode les quatre objets et vérifie leurs pixels transparents
dans `qa/brasserie-illustree.py`. Une simple signature d'en-tête ne suffit pas.

## Couches indépendantes

Le fond et les équipements sont mis en cache dans un Canvas de décor. Les
liquides, grains, faux regard de coupe, eau de rinçage, écoulement, flammes,
vapeur, reflets, vannes, thermomètre, sacs, mélangeur, barboteur, éprouvette et
densimètre rangé sont dessinés indépendamment par le code de présentation.
Les huit bouteilles ont chacune leur tracé, niveau, capsule, reflets et état
brisé. Les commandes HTML et la zone de dépôt de la cuve restent celles du jeu.
Les instruments rangés ne présentent aucune mesure scientifique fictive.

Les placements utilisent les repères historiques : 120 × 96 pour la cuve de
préparation, 192 × 128 pour A/B/D, 192 × 112 pour C/E. Le backing store utilise
la taille CSS et le DPR (plafonné à 2,5), avec lissage des images. Le décor est
recalculé seulement à son premier rendu ou lors d'un changement de taille.

Les états d'un équipement conservent leur image, angle, ancrage et échelle au
sein d'une scène. Une cuve de préparation sans ingrédient reste vide. Les
remplissages et effets sont pilotés par les états fournis par le vrai jeu.

## Contrat pour les livraisons suivantes

- Objets isolés : 512 px maximum ; grands décors : 1024 px maximum.
- WebP qualité cible 82 ; transparence réelle ; aucune grille ou texte peint.
- Noms minuscules, chiffres, tirets ou underscores ; extension `.webp`.
- Les décors nommés `*-fond`, `*-batiment` ou `*-decor` bénéficient de 1024 px.
- Budget cumulé des sources WebP : 6 Mio ; liens symboliques et WebP animés refusés.
- Même angle 3/4, échelle et ancrage pour les états d'un objet.
- Contours #3b2a1e, pierre #e2cfa4, tuiles #d9714a, bois #a87444, cuivre #e09a4e,
  végétation #9cc94a ; lumière en haut à gauche et ombres douces à deux tons.

## À produire ensuite

F / Ulysse conserve son dessin historique : `f-fond`, `f-alambic-vide`,
`f-condenseur` et ses récipients, accessoires et placements propres aux
Canvas aperçu/brouillis/repasse restent à livrer. Aucun asset F n'est annoncé
comme terminé dans cette phase.

Les illustrations G–Q (chai, boutique, dégustation, ingrédients, veillée,
portraits, carte du domaine et saisons) et les sprites R à six images restent
à produire. Les effets A–E sont procéduraux ; ce ne sont pas des sprites R.
Les portraits et icônes hérités sont conservés jusqu'à leur lot graphique.
