# Fonds sombres

Les fonds de l’interface passent du crème au brun profond : page, en-tête,
panneaux, mesures, onglets, menus, tutoriels, fiche de jury et chai. Textes
crème, accents cuivre et jauges vertes/bleues/rouges conservent leur lisibilité.
Les illustrations et leurs couleurs restent inchangées. Aucun asset ajouté.

Seul `jeu/src/style.css` change dans les sources du jeu. Les deux HTML de
`dist/` sont reconstruits ; les moteurs, interactions, données et sauvegardes
ne changent pas. Branche issue de `codex/phase-1-brasserie` / PR #5.

## Vérifications exécutées

- Construction, `npm run test:jeu`, `npm run test:images` et
  `npm run test:presentation` : passent.
- Le script existant `qa/brasserie-illustree.py` a été réutilisé avec un dossier
  de sortie distinct et le HTML clair du commit `b9d06ba` comme référence.
- Chromium mobile 390 × 844, DPR 2 : glisser-déposer, maintien/annulation
  tactile, scènes A–E, repli sans images/avec corruption/avec erreur Canvas,
  mouvement réduit et redimensionnement 320/360/390/720 px passent.
- Aucun débordement aux points de capture et aucune erreur JavaScript.
- Palette effective contrôlée dans le navigateur : `color-scheme: dark`, fond
  de page RGB(16,13,11), panneaux RGB(38,30,24), texte RGB(242,228,202).

Résultats complets dans `resultats-graphiques.json`. Captures conservées :
[préparation avant](captures/avant-recette.png),
[préparation après](captures/apres-recette.png),
[empâtage avant](captures/avant-emp.png), [empâtage après](captures/apres-emp.png).

Validation en émulation Chromium ; Android physique non essayé dans ce lot.
Les autres lots graphiques restent ceux indiqués dans le bilan de phase 1.
Aucune fusion dans main.
