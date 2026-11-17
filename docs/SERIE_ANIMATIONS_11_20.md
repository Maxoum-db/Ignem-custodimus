# Dix animations complémentaires : étapes 11 à 20

Demande explicite « Puis 10 étapes en plus ». Audit réel : main b3ea090,
#117/#118 fusionnées, fichiers locaux propres, CI du jeu final précédent
44152992147 réussie. Les dix premières animations sont publiées ; ne pas les refaire.
Le téléphone physique n'étant pas disponible, son contrôle n'est pas annoncé.

Dix missions successives, chacune sur une branche dédiée avec tests, commit et PR.
Aucune fusion des nouvelles PR autorisée. Les nouvelles missions sont :

| N° | Objectif |
| --- | --- |
| 11 | Chute du houblon indépendante du nombre de dessins |
| 12 | Rotation et dérive des cônes en ébullition |
| 13 | Courant d'air lié à l'événement réel d'empâtage |
| 14 | Fumée de bûche humide et chute de pression |
| 15 | Étincelles de reprise du brûleur |
| 16 | Lit de drêches visuellement compacté selon tassement |
| 17 | Lit sec et fissures selon durée réellement à sec |
| 18 | Taille des bûches selon masse réellement restante |
| 19 | Bulles de mousse dans le regard d'Ulysse |
| 20 | Coulures pendant un débordement réel |

Critères : conserver renderers et boucles existants, aucune mécanique nouvelle,
aucun format de sauvegarde modifié, activité liée aux états réels, effets
décoratifs figés en mouvement réduit et mobile 320/390 DPR2 préservé. Les
changements physiques d'état restent visibles même en mouvement réduit.

Le test partagé animations-serie.cjs est étendu avec une configuration séparée
animations-suite.json ; les cas antérieurs restent inchangés. Les variantes
isolées utilisent un canvas détaché, les captures passent ensuite par le vrai
écran et les commandes avec une partie de test isolée et l'horloge Playwright.
Certains aléas sont déterminisés dans les seuls tests ; aucun moteur simulé.
Chaque mission : build, six suites Node et quatre contrôles mobiles.

Validation finale prévue : nouvelle matrice, matrice précédente et parcours
avec gestes/coupes réels. Safari et téléphone physique indisponibles.

Mission 11 validée : Chute du houblon indépendante de la cadence — `work/anim-11-chute-temps` ; quatre scénarios et six suites réussis. Preuves : `chute-temps*.png` et `chute-temps.json`.

Mission 12 validée : Rotation et dérive des cônes en ébullition — `work/anim-12-cones` ; quatre scénarios et six suites réussis. Preuves : `cones*.png` et `cones.json`.
