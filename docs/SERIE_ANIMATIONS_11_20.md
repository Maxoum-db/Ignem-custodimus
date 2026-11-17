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

Mission 13 validée : Courant d’air animé pendant le vrai aléa — `work/anim-13-courant-air` ; quatre scénarios et six suites réussis. Preuves : `courant-air*.png` et `courant-air.json`.

Mission 14 validée : Fumée de bûche humide et vraie chute de pression — `work/anim-14-buche-humide` ; quatre scénarios et six suites réussis. Preuves : `buche-humide*.png` et `buche-humide.json`.

Mission 15 validée : Étincelles lors de la vraie reprise du brûleur — `work/anim-15-reprise-bruleur` ; quatre scénarios et six suites réussis. Preuves : `reprise-bruleur*.png` et `reprise-bruleur.json`.

Mission 16 validée : Lit de drêches compacté selon tassement réel — `work/anim-16-tassement` ; quatre scénarios et six suites réussis. Preuves : `tassement*.png` et `tassement.json`.

Mission 17 validée : Aspect du lit réellement à sec — `work/anim-17-lit-sec` ; quatre scénarios et six suites réussis. Preuves : `lit-sec*.png` et `lit-sec.json`.

Mission 18 validée : Bûches réduites selon leur masse réellement brûlée — `work/anim-18-buches` ; quatre scénarios et six suites réussis. Preuves : `buches*.png` et `buches.json`.

Mission 19 validée : Bulles de mousse dans le regard d’Ulysse — `work/anim-19-mousse` ; quatre scénarios et six suites réussis. Preuves : `mousse*.png` et `mousse.json`.

## Clôture et validation finale

Les dix nouveaux scénarios (40 contextes) et les dix anciens scénarios (40
contextes) sont tous réussis sur le code final : 320/390 px DPR2, normal/réduit,
états actifs et arrêtés, absence de mutation, vraie navigation, aucune erreur JS
ni débordement. Les états physiques restent visibles en mouvement réduit.

La filtration complète avec fermeture, colmatage, ratissage et reprise est
réussie. Trois parcours complets avec gestes de brassage réels, chauffes/coupes
Ulysse expert puis débutant sont réussis, ainsi que vente, achats persistés,
chai et vieillissement. Les six suites métier/images ont été exécutées après
chaque mission et restent réussies. Les contrôles existants de préparation
(5 s), 100 % aux repères et pénalité de retard passent dans les deux modes.

Le redémarrage de l'environnement après la mission 19 a été traité en vérifiant
le commit et son push réels, puis en créant sa PR manquante. Aucun travail
validé n'a été recommencé. Le contrôle final est sauvegardé par scénario et
peut être repris avec /tmp/valider-animations-suite.py tant que l'environnement
le conserve ; les commandes permanentes sont ci-dessous.

```sh
npm run build:jeu
npm run test:jeu
SCENARIOS_ANIMATIONS=jeu/tests/animations-suite.json CAPTURE_DIR=docs/captures/animations-suite node jeu/tests/animations-serie.cjs
node jeu/tests/animations-serie.cjs
node jeu/tests/filtration-vivante.cjs
GESTES_REELS=1 node jeu/tests/parcours.cjs
ULYSSE_REEL=1 node jeu/tests/parcours.cjs
MODE_JEU=debutant ULYSSE_REEL=1 node jeu/tests/parcours.cjs
```

Localement, CHROMIUM_PATH=/usr/bin/chromium sélectionne le navigateur système
dans le nouveau test ; les parcours anciens utilisent le préchargement temporaire
déjà documenté. Aucun moteur simulé. Les aléas des captures sont déterminisés
dans les seuls tests, les incidents d'Ulysse proviennent des commandes du foyer.

Résultats : docs/validation/animations-suite-final.json et
animations-suite-matrice.json. Une vidéo réelle du canvas pendant un
débordement est conservée dans captures/animations-suite/debordement-reel.webm
(12 images VP8 décodées, enregistrement demandé de 1,5 s). Ce n'est pas une
maquette ni une garantie de fréquence d'affichage sur téléphone. Captures du lit
sec et du débordement inspectées. Téléphone physique, Safari et équilibrage
exhaustif non vérifiés. Aucun changement aux moteurs, sauvegardes ou règles.

## PR et commits des neuf premières missions

| Mission | PR | Commit |
| --- | --- | --- |
| 11 | [#119](https://github.com/Maxoum-db/Ignem-custodimus/pull/119) | `c07f32d` |
| 12 | [#120](https://github.com/Maxoum-db/Ignem-custodimus/pull/120) | `194085d` |
| 13 | [#121](https://github.com/Maxoum-db/Ignem-custodimus/pull/121) | `894cd8d` |
| 14 | [#122](https://github.com/Maxoum-db/Ignem-custodimus/pull/122) | `6dad998` |
| 15 | [#123](https://github.com/Maxoum-db/Ignem-custodimus/pull/123) | `bf64aba` |
| 16 | [#124](https://github.com/Maxoum-db/Ignem-custodimus/pull/124) | `3dbb22d` |
| 17 | [#125](https://github.com/Maxoum-db/Ignem-custodimus/pull/125) | `16fd903` |
| 18 | [#126](https://github.com/Maxoum-db/Ignem-custodimus/pull/126) | `01441ee` |
| 19 | [#127](https://github.com/Maxoum-db/Ignem-custodimus/pull/127) | `556b223` |

Le relevé final des neuf premières PR confirme leurs CI réussies. Le relevé
antérieur (six premières vertes, autres en cours) reste conservé comme
historique ; il ne remplace pas le contrôle final. La dernière mission est
sauvegardée par le commit de clôture sur work/anim-20-debordement, puis sa PR
est ouverte sur work/anim-19-mousse. Dix branches et commits séparés.

Aucune fusion ni publication de cette série : main reste à b3ea090, les effets
11–20 ne sont pas encore en ligne. Prochaine mission unique proposée : revue
de la pile pour intégration autorisée. Aucune mission 21 commencée. STOP.

Mission 20 validée : Coulures pendant le véritable débordement d’Ulysse — `work/anim-20-debordement` ; quatre scénarios et six suites réussis. Preuves : `debordement*.png` et `debordement.json`.
