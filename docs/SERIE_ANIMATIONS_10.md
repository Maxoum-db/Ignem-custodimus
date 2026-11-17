# Dix animations complémentaires — 17 novembre 2026

Exception de série explicitement autorisée par « Etape suivant, enchaine 10 étapes ».
Audit réel : main f1cdf0f, PR #107 ouverte, état local propre. Flammes, vapeur,
niveaux, bulles, chutes de houblon et premières illustrations existent déjà.
Ne pas les refaire. Dix petites missions successives, une branche/commit/PR chacune,
empilées sur #107. La fusion, initialement non autorisée, a ensuite été explicitement
autorisée par « Push tout en main » et réalisée via #117 au main `790ad6a`.

| Étape | Objectif |
| --- | --- |
| 1 | Flux du circuit glycol selon commande réelle |
| 2 | Flux vapeur de fermentation selon commande réelle |
| 3 | Circulation dans l’enveloppe selon inertie thermique |
| 4 | Barboteur selon activité, sans bulles au repos |
| 5 | Dry hop : rotation et fenêtre réelle de chute |
| 6 | Jets de remplissage des bouteilles |
| 7 | Levier et capsules pendant la phase de capsulage |
| 8 | Bulles confinées au liquide pendant le remplissage |
| 9 | Circuit de refroidissement d’Ulysse pendant la collecte |
| 10 | Jet dirigé vers la fraction réellement sélectionnée |

Critères communs : renderer existant, aucune boucle ou moteur parallèle,
aucune mutation d’état par le dessin, arrêt des effets hors état actif,
mouvement réduit, commandes et mobile conservés. Chaque mission exécute build,
six suites Node et son scénario indépendant à 320/390 px DPR 2 normal/réduit.
Les comparaisons isolées utilisent un canvas détaché ; les captures proviennent
ensuite des vrais écrans et commandes, avec une sauvegarde de test isolée et
l’horloge Playwright. Elles ne sont pas des maquettes.

Contrôles finaux : parcours réels des ateliers touchés. Téléphone physique et
Safari indisponibles. CI des nouvelles PR à distinguer des résultats locaux.

Étape 1 validée : Flux glycol lié à la commande réelle — `work/anim-01-glycol` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `glycol*.png` et `glycol.json`.

Étape 2 validée : Flux vapeur lié à la commande réelle — `work/anim-02-vapeur` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `vapeur*.png` et `vapeur.json`.

Étape 3 validée : Enveloppe animée selon inertie thermique réelle — `work/anim-03-enveloppe` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `enveloppe*.png` et `enveloppe.json`.

Étape 4 validée : Barboteur et bulles liés à activité réelle — `work/anim-04-barboteur` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `barboteur*.png` et `barboteur.json`.

Étape 5 validée : Dry hop borné et cônes en rotation — `work/anim-05-dryhop` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `dryhop*.png` et `dryhop.json`.

Étape 6 validée : Jets pendant remplissage réel des bouteilles — `work/anim-06-remplissage` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `remplissage*.png` et `remplissage.json`.

Étape 7 validée : Levier et capsules synchronisés avec capsulage — `work/anim-07-capsules` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `capsules*.png` et `capsules.json`.

Étape 8 validée : Bulles mobiles confinées au liquide des bouteilles — `work/anim-08-bulles` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `bulles*.png` et `bulles.json`.

Étape 9 validée : Refroidissement Ulysse pendant collecte réelle — `work/anim-09-condenseur` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `condenseur*.png` et `condenseur.json`.

## Vérification finale de la série

Quarante scénarios sur le code final : dix animations × 320/390 px × normal/réduit,
tous réussis. Comparaisons des trois récipients : le jet mobile atteint uniquement
la fraction sélectionnée. Absence de mutation de l’état, d’erreur JS et de
débordement. Six suites métier/images réussies après chaque changement ; build
reproductible et syntaxe vérifiés. Captures réelles inspectées pour fermentation,
capsulage et queues d’Ulysse.

Parcours complets avec gestes de brassage réels et Ulysse expert/débutant avec
chauffes et coupes réelles : tous réussis, y compris vente, achats persistés, chai,
vieillissement et boutique. Le redémarrage de l’environnement a interrompu le
dernier contrôle débutant ; seul ce contrôle a été relancé, puis réussi. Les
résultats des trois vérifications précédentes ont été conservés.

Commandes de reprise depuis la racine :

```sh
npm run build:jeu
npm run test:jeu
node jeu/tests/animations-serie.cjs
GESTES_REELS=1 node jeu/tests/parcours.cjs
ULYSSE_REEL=1 node jeu/tests/parcours.cjs
MODE_JEU=debutant ULYSSE_REEL=1 node jeu/tests/parcours.cjs
```

Localement, Chromium système a été sélectionné via CHROMIUM_PATH pour le nouveau
test ; les anciens parcours ont utilisé le préchargement temporaire décrit dans
le journal. Les tests visuels utilisent l’horloge Playwright ; les parcours complets
utilisent les attentes et gestes du vrai jeu. Aucun moteur simulé.

Résultats : `docs/validation/animations-serie-final.json` et
`animations-serie-matrice.json`. L’état CI observé avant l’étape 10 figure dans
`animations-serie-ci-avant-etape10.json` : les trois premières PR étaient vertes,
les suivantes en cours. Ce fichier est une photographie datée du processus, pas
une affirmation que les dix CI sont terminées.

## Branches et commits déjà confirmés

| Étape | PR | Commit de la mission |
| --- | --- | --- |
| 1 | [#108](https://github.com/Maxoum-db/Ignem-custodimus/pull/108) | `ff2c1c1` |
| 2 | [#109](https://github.com/Maxoum-db/Ignem-custodimus/pull/109) | `6e1ba07` |
| 3 | [#110](https://github.com/Maxoum-db/Ignem-custodimus/pull/110) | `2824404` |
| 4 | [#111](https://github.com/Maxoum-db/Ignem-custodimus/pull/111) | `c06992a` |
| 5 | [#112](https://github.com/Maxoum-db/Ignem-custodimus/pull/112) | `129d3bc` |
| 6 | [#113](https://github.com/Maxoum-db/Ignem-custodimus/pull/113) | `a29a95d` |
| 7 | [#114](https://github.com/Maxoum-db/Ignem-custodimus/pull/114) | `7ed0947` |
| 8 | [#115](https://github.com/Maxoum-db/Ignem-custodimus/pull/115) | `61c2ecf` |
| 9 | [#116](https://github.com/Maxoum-db/Ignem-custodimus/pull/116) | `ac4c439` |

L’étape 10 est sauvegardée sur `work/anim-10-fractions` par le commit contenant
cette clôture, puis sa PR est ouverte sur `work/anim-09-condenseur`. Les commits des dix PR
sont intégrés dans main via #117 (`790ad6a`). Les PR intermédiaires #108–116
sont clôturées comme regroupées dans cette intégration ; leurs branches et
commits restent disponibles. Les dix animations et la filtration sont désormais
en ligne, vérifiées directement sur le site public à 320/390 px normal/réduit.
Preuves : `docs/validation/publication-animations.json` et captures associées. Téléphone physique, Safari et équilibrage exhaustif non vérifiés.

Prochaine mission unique proposée : vérifier les animations sur un téléphone réel. Aucune onzième animation commencée.

Étape 10 validée : Jet dirigé vers la fraction réellement sélectionnée — `work/anim-10-fractions` ; quatre rendus/écrans mobiles et six suites métier réussis. Preuves : `fractions*.png` et `fractions.json`.
