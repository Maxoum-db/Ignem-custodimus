# Série de vingt étapes — dossier de revue

Base distante auditée : `main` à `b17989ef33fcc5fc86e2fc8cd5fa71db61b0fef1`.
Pré-requis : PR #81, correction de l’oubli du houblon à zéro minute, déjà testée en CI.
Les dix-neuf premières PR forment une pile : chacune vise la précédente.
La vingtième propose la validation et l’ensemble des corrections vers main,
y compris H01. Aucune fusion ni publication effectuée. Une fusion vers une
branche précédente ne met pas main à jour ; la PR finale sert à relire et
autoriser une intégration unique. Les PR et branches intermédiaires sont conservées.
Pour relire l’ensemble, [comparer main à la dernière branche](https://github.com/Maxoum-db/Ignem-custodimus/compare/main...work/serie20-20-validation).

## Missions sauvegardées

| Étape | Objectif | Branche | Commit | PR |
|---|---|---|---|---|
| 01 | Afficher la dose réelle de houblon | `work/serie20-01-dose-houblon` | `fb9046f` | [#82](https://github.com/Maxoum-db/Ignem-custodimus/pull/82) |
| 02 | Maintenir le décompte après le dernier houblon | `work/serie20-02-compteur-ebullition` | `ce48277` | [#83](https://github.com/Maxoum-db/Ignem-custodimus/pull/83) |
| 03 | Agrandir les réglages tactiles Ulysse | `work/serie20-03-reglages-ulysse` | `0ca2fa6` | [#84](https://github.com/Maxoum-db/Ignem-custodimus/pull/84) |
| 04 | Rendre le mentor utilisable sur écran court | `work/serie20-04-mentor-mobile` | `591c232` | [#85](https://github.com/Maxoum-db/Ignem-custodimus/pull/85) |
| 05 | afficher immédiatement les notes en mouvement réduit | `work/serie20-05-fiche-jury` | `35b0698` | [#86](https://github.com/Maxoum-db/Ignem-custodimus/pull/86) |
| 06 | Rendre la gravité des défauts lisible | `work/serie20-06-defauts-jury` | `bf485e9` | [#87](https://github.com/Maxoum-db/Ignem-custodimus/pull/87) |
| 07 | Exposer la progression réelle du carnet | `work/serie20-07-progression-carnet` | `ed7944a` | [#88](https://github.com/Maxoum-db/Ignem-custodimus/pull/88) |
| 08 | Distinguer les succès obtenus des objectifs | `work/serie20-08-succes-carnet` | `0de1605` | [#89](https://github.com/Maxoum-db/Ignem-custodimus/pull/89) |
| 09 | Clarifier les cadeaux des découvertes | `work/serie20-09-decouvertes` | `35921da` | [#90](https://github.com/Maxoum-db/Ignem-custodimus/pull/90) |
| 10 | Adapter la dégustation aveugle au téléphone | `work/serie20-10-aveugle-mobile` | `9cb1b02` | [#91](https://github.com/Maxoum-db/Ignem-custodimus/pull/91) |
| 11 | Agrandir le dosage du sucre en bouteille | `work/serie20-11-sucre-bouteilles` | `2a71243` | [#92](https://github.com/Maxoum-db/Ignem-custodimus/pull/92) |
| 12 | Rendre les registres d’air tactiles et explicites | `work/serie20-12-registres-foyer` | `771bc7c` | [#93](https://github.com/Maxoum-db/Ignem-custodimus/pull/93) |
| 13 | Clarifier les jauges des gestes | `work/serie20-13-jauges-gestes` | `09eb2ae` | [#94](https://github.com/Maxoum-db/Ignem-custodimus/pull/94) |
| 14 | Compléter la navigation clavier des onglets recette | `work/serie20-14-onglets-clavier` | `d018a8f` | [#95](https://github.com/Maxoum-db/Ignem-custodimus/pull/95) |
| 15 | Expliquer les recherches d’ingrédients sans résultat | `work/serie20-15-recherche-vide` | `e97b77b` | [#96](https://github.com/Maxoum-db/Ignem-custodimus/pull/96) |
| 16 | Illustrer les animaux de la basse-cour | `work/serie20-16-animaux-illustres` | `0a4c0af` | [#97](https://github.com/Maxoum-db/Ignem-custodimus/pull/97) |
| 17 | Stabiliser le signal du dry hop prêt | `work/serie20-17-signal-dry-hop` | `986e9c8` | [#98](https://github.com/Maxoum-db/Ignem-custodimus/pull/98) |
| 18 | Nommer et clarifier les bilans des gestes | `work/serie20-18-bilans-gestes` | `3abfbec` | [#99](https://github.com/Maxoum-db/Ignem-custodimus/pull/99) |
| 19 | Protéger les sorties de navigation pendant un geste | `work/serie20-19-navigation-geste` | `c7a138f` | [#100](https://github.com/Maxoum-db/Ignem-custodimus/pull/100) |
| 20 | Validation intégrée et dossier de revue | `work/serie20-20-validation` | Identifié par la tête de branche après commit | PR vers main créée après validation |

## Validation

CI complète du code produit `c7a138f` : [run 43948905760 réussi](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43948905760).
Les tests 01 à 19 et les quatre parcours y sont passés. La mission 20 ajoute
uniquement son test et le dossier de validation.

Validation locale terminée : 93 commandes vérifiées, six suites Node, syntaxe des neuf JS,
tous les scénarios navigateur et quatre parcours (automatique, gestes de bière,
Ulysse expert, Ulysse débutant). Résultats machine :
[serie20-resultats.json](validation/serie20-resultats.json).

Un dépassement de 7 secondes a eu lieu sur le bouton du menu pendant l’entrée
de fixture du test 02 en 390 px, avant son scénario. Le rejeu ciblé a réussi
aux deux largeurs sans modification du code ni du test ; sa cause exacte
n’est pas établie. Le [premier passage](validation/serie20-premier-passage.json)
et la [trace du délai](validation/serie20-delai-initial.txt) restent conservés.
Le redémarrage de l’environnement a ensuite interrompu le dernier parcours :
les 92 résultats précédents ont été récupérés et seule cette dernière commande
a été relancée, avec succès. Les résultats finaux gardent ces deux événements.

Les tests mobiles utilisent Chromium à 320 et 390 px, DPR 2, toucher actif.
Les scénarios de frontières temporelles pilotent l’horloge du navigateur ;
les fonctions de jeu ne sont pas remplacées. Le reste des parcours s’exécute
avec ses interactions et durées réelles.

Android physique et Safari/iOS ne sont pas disponibles dans cet environnement.

## Fichiers concernés

- `jeu/src/jeu.js`, `style.css`, `page.html` : interface et interactions.
- `jeu/src/domaine.js` et les deux `images/animal-*.webp` : basse-cour.
- `dist/index.html`, `dist/artefact.html` : jeu autonome reconstruit.
- `jeu/tests/serie20/` : vingt tests et leurs helpers, ajoutés au workflow
  `.github/workflows/validation-jeu.yml`.
- `docs/PROGRESSION_CODEX.md`, `AUDIT_RESTANT.md`, ce dossier et
  `ASSETS_BASSE_COUR.md` : progression, reprise et provenance.
- `docs/captures/serie20/` et `docs/validation/` : preuves et résultats.

## Preuves réelles

Quarante captures dans [captures/serie20](captures/serie20), prises dans le HTML
du jeu construit depuis les sources. Elles montrent les composants effectivement
affichés, pas une maquette. La validation finale a remis à jour les captures de
cette série pour refléter les styles communs ajoutés ensuite. Les captures
historiques des missions antérieures ont été conservées dans leur état initial.
Les captures complémentaires et sauvegardes de fixtures des anciens tests sont
conservées dans `/tmp/serie20-qa-complements` ; les parcours réels sont dans
`/tmp/serie20-parcours-{gestes,ulysse,debutant}`.

## Reprise et limites

Les cinq moteurs, les données scientifiques et le format des sauvegardes sont
conservés. Deux WebP décoratifs proviennent de l’historique : voir
[leur provenance](ASSETS_BASSE_COUR.md).

Le site public n’est pas mis à jour par ces pushes de branches. Sa publication
reste distincte de GitHub. Les PR et branches anciennes sont conservées.

Points observés hors périmètre, non corrigés ici : le texte du dernier palier
annonce tout le catalogue débloqué alors que des achats restent nécessaires ;
les longs libellés de phase de fermentation méritent encore une vérification
de lisibilité dans les petites cases. Aucune tâche supplémentaire commencée.

Prochaine mission unique proposée : fusion de la PR finale vers main après autorisation explicite. La publication pourra être une mission ultérieure.
