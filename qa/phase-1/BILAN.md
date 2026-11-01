# Phase 1 — brasserie illustrée dans le vrai jeu

Lot construit à partir de `b892b92` (phase 0, PR #4), sans fusion dans main.
La nouvelle PR cible `codex/phase-0-validation` et conserve la dépendance
#2 → #3 → #4. Les fichiers `dist/` restent générés par le constructeur du dépôt.

## Ce qui change

La cuve de préparation et les écrans A à E utilisent un intérieur de brasserie
en pierre du Quercy et des équipements illustrés séparés. Les images proviennent
de `image_gen` ; leurs sources de production WebP ont été encodées en qualité 82.
Les quatre équipements ont une vraie couche alpha, vérifiée sur les pixels par
Chromium. Poids source cumulé : **230 356 octets**. Dimensions et empreintes :
[`manifest.json`](../../jeu/src/images/manifest.json).

| Atelier | Équipement et effets |
| --- | --- |
| Préparation | Cuve vide ou chargée, grains, éclaboussures, vraie zone de dépôt |
| A Empâtage | Cuve cuivre, sac de malt, mélangeur, chaudière, vapeur, vanne, pression, température et prévision ; manifestations des aléas conservées |
| B Filtration | Cuve-filtre et faux fond, regard de coupe du lit et de l'eau, tassement/colmatage, rinçage, râteau, robinet et récupération proportionnelle au volume réel |
| C Ébullition | Cuve cuivre, feu et vapeur selon la chauffe, bouillonnement, cônes de houblon lors des ajouts ; frise et précision inchangées |
| D Fermentation | Fermenteur inox, barboteur, glycol bleu, vapeur rouge, sac à houblon, éprouvette vide et densimètre rangé ; courbe, consigne, fenêtres et jours des dry hops conservés |
| E Embouteillage | Capsuleuse, tuyauterie, bouteilles séparées, remplissage progressif, reflets, bulles, capsules, verre brisé et pertes existantes |

Les tubes, vannes, instruments, sacs, bouteilles et effets sont des dessins
Canvas indépendants ; ce ne sont pas des objets inséparables d'une scène peinte.
Les accessoires rangés n'affichent aucune fausse mesure.

Le socle d'interface passe au papier crème, cuivre, brun et vert houblon :
panneaux arrondis, commandes plus confortables, chiffres lisibles, titres Lilita
One et police système pour le texte. La police et sa licence OFL sont dans
`jeu/src/fonts/` et intégrées par le constructeur. Aucun appel Google Fonts
n'est nécessaire à l'exécution.

## Intégration et conservation du gameplay

`ateliers.js` ne lit ni les sauvegardes ni les moteurs. Il reçoit un état de
présentation et renvoie si le dessin illustré a pu être réalisé. Il conserve
les coordonnées logiques des Canvas, prépare un décor en cache, puis dessine
les éléments dynamiques. Le backing store suit la taille CSS et le DPR,
plafonné à 2,5 ; les illustrations utilisent le lissage haute qualité.

Dans `jeu.js`, les seules différences sont **sept lignes de présentation** :
six appels de rendu et une couleur précalculée. Le reste du fichier est identique
octet pour octet à la phase 0 après retrait de ces lignes, ce que vérifie
`npm run test:presentation`. Les cinq moteurs sont également vérifiés par leurs
empreintes. Données, recettes, SQL, export et clé/format de sauvegarde restent
inchangés. Les effets ne pilotent aucun temps, événement ou résultat du jeu.

Les boutons, curseurs, gestes de maintien, tutoriels et zones tactiles HTML
restent les commandes originales. La zone de dépôt est mesurée par le mécanisme
existant ; son glisser-déposer a été retesté après défilement.

Image absente ou corrompue : dessin historique conservé. Une erreur de dessin
déclenche aussi le repli en rétablissant la taille logique du Canvas ; ce cas
a été testé avec une exception injectée. Le délai de chargement et le cache
du chargeur de la phase 0 sont conservés. Les scènes hors écran ne sont pas
repeintes. En mouvement réduit, vapeur, bulles et mouvements décoratifs sont
gelés ; la progression fonctionnelle des gestes et du remplissage reste visible.

## Tests exécutés

- `node scripts/construire-jeu.mjs` : vrai HTML autonome construit avec succès,
  environ **1,03 Mio**. `dist/index.html` et `dist/artefact.html` sont livrés.
- `npm run test:jeu` : cinq suites métier passent.
- `npm run test:images` : validation, cache, erreurs et repli du chargeur passent.
- `npm run test:presentation` : moteurs et contrôleur hors raccords inchangés.
- `python qa/parcours-mobile.py --sortie qa/phase-1` : recette préparée dans main
  retrouvée, cinq gestes en temps réel, embouteillage, dégustation, sauvegarde
  et reprise ; puis migration historique existante avec fixture synthétique,
  Ulysse, feu, coupes manuelles, entonnage, un an d'élevage, embouteillage du
  spiritueux et vente. Menus secondaires ouverts. Aucun débordement aux points
  de capture et aucune erreur JavaScript.
- `python qa/brasserie-illustree.py` : décodage des quatre objets, alpha réel,
  police embarquée, glisser-déposer, vrais événements Touch Chromium avec
  annulation, arrêt du dessin hors écran, repli sans images/avec corruption/
  avec exception Canvas, captures A–E en mouvement réduit et adaptation à
  320, 360, 390 et 720 px. Backing store DPR 2 vérifié.

Résultats : [`resultats-mobile.json`](resultats-mobile.json) et
[`resultats-graphiques.json`](resultats-graphiques.json). Les fixtures sont des
parties de test créées lors de la phase 0 ; aucune sauvegarde personnelle n'a
été accessible. Le workflow GitHub exécute les tests Node et produit un artefact
HTML ; les tests navigateur ci-dessus ont été exécutés dans le workspace.

## Captures comparatives

| Écran | Avant | Après |
| --- | --- | --- |
| Préparation | [capture](captures/avant-recette.png) | [capture](captures/apres-recette.png) |
| A Empâtage | [capture](captures/avant-emp.png) | [capture](captures/apres-emp.png) |
| B Filtration | [capture](captures/avant-fil.png) | [capture](captures/apres-fil.png) |
| C Ébullition | [capture](captures/avant-ebu.png) | [capture](captures/apres-ebu.png) |
| D Fermentation | [capture](captures/avant-fer.png) | [capture](captures/apres-fer.png) |
| E Embouteillage | [capture](captures/avant-bou.png) | [capture](captures/apres-bou.png) |

Les autres captures conservent les étapes du parcours, les replis et les tailles
de viewport. Les comparaisons utilisent le vrai HTML de la phase 0 et les mêmes
recettes, avec mouvement réduit, sans remplacement des données scientifiques.

## Performance et limites

La simulation Chromium utilise une vraie réponse HTTP gzip du HTML, un cache
navigateur vide, 1,6 Mbit/s, 150 ms de latence et un CPU ralenti ×4. Le dernier
relevé est enregistré dans `resultats-graphiques.json` : environ 457 Ko transférés,
2,68 s jusqu'à DOMContentLoaded et 3,47 s jusqu'au premier atelier illustré,
après fermeture du tutoriel et navigation par l'interface. L'objectif de trois
secondes est approché pour le premier document ; l'accès à l'atelier reste à
optimiser et à mesurer sur Android physique et sur l'hébergement final.

Les mesures sont une simulation Linux/Chromium, pas une validation Android ou
Safari/iOS. Le parcours expert intégral et tous les dry hops/recettes ne sont
pas parcourus graphiquement dans ce lot ; leurs calculs restent couverts par
les suites métier. Le navigateur fourni interdit toujours `file://` ; l'essai
se fait par HTTP ou l'aperçu hébergé. Les sprites de six images ne sont pas
livrés : les animations A–E sont procédurales.

## Suite et assets manquants

Ce lot transforme la brasserie A–E et les fondations de l'interface. Ulysse
conserve son dessin historique : décor, alambic et condenseur illustrés restent
à produire pour F et à placer dans les trois vues concernées. Les nouveaux
portraits de Lise/Firmin, les icônes d'ingrédients, la carte illustrée et ses
quatre saisons, animaux, chai, boutique, dégustation, veillée et sprites R
attendent les phases suivantes. Aucun de ces éléments n'est annoncé comme
terminé ici. La liste technique est dans `jeu/src/images/README.md`.

L'aperçu privé conserve l'adresse et le stockage de la phase 0. Une partie déjà
commencée sur cet aperçu utilise donc toujours `ignem.v1`. La sauvegarde de
l'hébergement habituel du joueur reste liée à son autre origine web.
