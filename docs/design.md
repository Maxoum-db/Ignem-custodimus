# Système de design Prométhée

Les tokens se trouvent **en tête de `jeu/src/style.css`**. Les anciens noms sont des alias de ce système, pas une seconde palette. Les illustrations existantes sont conservées. L'interface reste sombre : nuit `#1f1a14`, surface `#2e2016`, texte parchemin `#f6ead0`.

## Palette et contrastes

Encre `#3b2a1e`, bois clair `#a87444`, bois foncé `#6b4426`, pierre `#e2cfa4`, tuile `#d9714a`, cuivre `#e09a4e`, prairie `#9cc94a`, action `#5aa83a`, danger `#b3402f`, glycol `#3f8fd2`, bière `#e8a832`, parchemin `#f6ead0`.

Le bois clair et le bleu glycol servent d'accents ; ils ne sont pas des surfaces de texte clair. Le bouton froid porte du parchemin sur `#244f72`. Ratios calculés en sRGB : encre/cuivre **5,80**, encre/vert action **4,62**, parchemin/bois foncé **7,10**, parchemin/danger **4,77**. Objectif : texte AA 4,5:1, y compris les petits libellés. Ne pas rendre une carte entière transparente lorsqu'elle est verrouillée.

## Typographie et géométrie

Lilita One : titres, boutons, valeurs. Comic Neue 400/700 : texte. Polices OFL incorporées au HTML autonome, sans dépendance réseau. Chiffres tabulaires pour les mesures. Corps 16px ; échelle 12/14/16/18/22/28/36. 12px réservé aux axes et aux petits libellés, 14px aux métadonnées.

Grille 4px ; espacements 4/8/12/16/24/32. Rayons 8/12/18. Contour 3px encre. Ombre unique : `0 4px 0 #3b2a1e`. Les grands décors gardent leur lumière peinte. Aucun flou de fond nécessaire.

## Composants

- `.btn` principal bois ; `.btn-feu` cuivre ; `.btn-houblon` vert ; `.btn-froid` bleu sombre ; `.btn-sobre` secondaire ; `.btn-danger` danger. Appui à 4px et ombre aplatie. Désactivé explicite, contraste conservé. Minimum tactile 44px.
- `.mesure`, `.capsule`, `.onglet`, `.filtre`, `.info-i` : mêmes tokens, même hiérarchie. Les onglets de production restent **textuels**. Le bandeau pH/mesures reste **sticky en haut** de la brasserie.
- `.mentor` : portrait rond, nom Lilita, texte Comic Neue, trois actions visibles au maximum. Au-delà : deux actions et « Autres choix », sans perdre aucun bouton métier.
- `.toast` : parchemin/encre, icône décorative, maximum deux, entrée/sortie continue. En mouvement réduit : visible pendant la durée normale, sans animation.
- En-tête bois, retour rond, vrais écus et réputation. Le menu contient les stocks séparés en L et LAP, ainsi que les points. Aucun stock ni conversion scientifique ne sont recalculés par le moteur graphique.

## Architecture de présentation

`finitions.js` décore le DOM ; `jeu.js` n'envoie que des instantanés de lecture. Aucun nouvel appel au générateur aléatoire du jeu. Les moteurs, règles, export, SQL, données et clé de sauvegarde ne changent pas. Le test de présentation compare le contrôleur historique hors raccords graphiques et vérifie les SHA des cinq moteurs.

## Livraison et preuve

Voir `docs/audit-design.md` et `qa/finition/`. `dist/index.html` est toujours le vrai jeu reconstruit. Les fixtures de QA sont isolées des sauvegardes personnelles. L'absence de défrichage est documentée ; aucun mécanisme fictif n'est ajouté.
