# Illustrations — ateliers et univers du domaine

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

## Univers livré dans le lot suivant

Le registre `UniversJeu` et les modules `activites-illustrees.js`,
`domaine-illustre.js`, `habillage.js` étendent désormais A–E à F–Q :

- Ulysse : fond, chaudière mobile **vide**, condenseur indépendants ; tuyaux,
  foyer, mousse, liquide du hublot, jauges, récipients et vapeur par code.
- Chai : intérieur voûté plein cadre et fût sur support indépendant. Le panorama
  ne montre que les fûts réellement placés ; le casse-tête HTML reste actif.
- Pigeonnier : tour, auvent, comptoir, bouteilles, terrasse et oiseaux séparés.
  Les ajouts dépendent du niveau réel du bâtiment.
- Dégustation : verrerie et flacons vectoriels, liquides translucides de couleur
  calculée par le jeu. Les verres de dégustation à l'aveugle restent identiques.
- Ingrédients : icônes SVG originales malt, houblon, levure, fruit, épice, eau,
  miel, bois, bouteille, outil. La poignée interactive historique est conservée.
- Veillée : mobilier, foyer et éclairage nocturne indépendants, mêmes personnages.
- Domaine : trois brasseries, deux chais, pigeonnier, Ulysse, chêne, deux mentors,
  cheval et cinq volailles/chat. Sol, chemins, murets, vigne, potager, verger,
  échafaudages, neige et variations saisonnières sont composés par code.

Les six bâtiments partagent le canevas 768 × 512 et l'ancrage normalisé
`(0.5, 0.9004)`. Les niveaux restent superposables au même point de sol.
Lise et Firmin ont chacun **un sprite source** : les portraits sont des recadrages
Canvas de ces sprites, et non des visages régénérés. Les clients emploient des
portraits SVG déterministes originaux.

Le total actuel, les dimensions et les SHA256 exacts des **25 WebP** sont dans
`manifest.json` ; le pipeline impose toujours le plafond source de 6 Mio.
Les cinq assets A–E sont inchangés. Les nouvelles illustrations sont produites
avec `image_gen`, et non simulées par des emplacements vides.

## Animation et limites

Le feu conserve six images Canvas indépendantes à ancrage constant, espacées de
120 ms, avec un fondu entre les images. La carte et les panoramas animés sont
repeints au rythme de requestAnimationFrame, plafonné à 60 peintures/s. Les
personnages et animaux suivent des trajectoires courbes avec freinage et pauses ;
les sprites existants restent les sources, sans prétendre à six nouvelles poses
anatomiques dessinées. L’horloge décorative se suspend hors écran et ne pilote
aucun temps de jeu. Les abeilles sont décoratives, actives le jour hors hiver.
Vapeur, écoulement, reflets et liquides restent procéduraux. Le mouvement réduit
fige les décorations, pas les mesures nécessaires au déroulement d'un geste.
Les vues cachées ou hors écran ne sont pas repeintes.

Aucun asset n'est nécessaire pour jouer au lot livré : le dessin historique reste
le repli. Restent des enrichissements facultatifs : vraies poses de marche/travail
à six dessins pour les mentors/animaux, portraits peints individualisés des clients,
variantes peintes de végétation hivernale (actuellement dessinées par code).
Le rucher reste l'extension « bientôt » du vrai jeu ; cette refonte ne l'ouvre pas.
