# Illustrations : contrat de livraison

Aucune illustration finale n'est présente à la fin de la phase 0. Le rendu
historique reste actif ; `illustrations.js` est une préparation, pas un moteur
de scènes déjà intégré à `jeu.js`.

Chaque objet est livré séparément en WebP (qualité cible 82), sans texte peint,
avec une transparence réelle et des pixels transparents autour de sa silhouette.
Le contrôle d'alpha visuel reste nécessaire : un en-tête valide ne le prouve pas.
Objets : 512 px maximum ; décors nommés `*-fond`, `*-batiment` ou `*-decor` :
1024 px maximum. Budget cumulé : 6 Mio. Noms : minuscules, chiffres, tirets ou
underscores, premier caractère alphanumérique, extension `.webp` en minuscules.
Le constructeur refuse les liens symboliques, les en-têtes invalides, les
dimensions excessives et les WebP animés. Les sprites seront gérés séparément
avec un contrat de dimensions explicite lors de la phase R.

Les états d'un même équipement doivent garder leur angle 3/4 (~35°), leur
échelle, leur ancrage et leur position au sol. Une cuve vide ne contient aucun
liquide peint. Liquides, vapeur, flammes, jauges et contrôles restent séparés.
Contours #3b2a1e, pierre #e2cfa4, tuiles #d9714a, bois #a87444, cuivre #e09a4e,
végétation #9cc94a ; lumière en haut à gauche, ombres douces à deux tons.

## Assets du registre A–F encore manquants

| Scène | Décor | Objets indépendants du registre actuel |
| --- | --- | --- |
| A Empâtage | `a-fond` | `a-cuve-vide`, `a-tuyauterie` |
| B Filtration | `b-fond` | `b-filtre-vide`, `b-bac` |
| C Ébullition | `c-fond` | `c-chaudiere-vide`, `c-houblon` |
| D Fermentation | `d-fond` | `d-fermenteur-vide`, `d-vanne-glycol` |
| E Embouteillage | `e-fond` | `e-embouteilleuse`, `e-bouteilles-vides` |
| F Ulysse, brouillis et repasse | `f-fond` | `f-alambic-vide`, `f-condenseur` |

Ce registre doit encore être complété avec thermomètres, vannes, mélangeur,
sacs de malt, faux fond, drêches, barboteur, instruments de prélèvement,
capsuleuse et récipients. Les coordonnées logiques diffèrent selon les Canvas :
ne pas réutiliser aveuglément le placement de l'aperçu Ulysse (96 × 72) dans les
gestes (192 × 120). Définir des placements propres à chaque scène avant le rendu.

Les assets G–Q (chai, boutique, dégustation, ingrédients, veillée, interface,
mentors, domaine et quatre saisons) et R (animations à six images) restent à
produire. Aucun n'est annoncé comme terminé dans ce lot.
