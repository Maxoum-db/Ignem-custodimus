# Refonte illustrée — première base technique, 8 novembre 2026

## Provenance

Véritable jeu du dépôt Maxoum-db/Ignem-custodimus, main a1ecd70bb4df8a12a1f25902f266ce3f6c925bec.
PR #2 : 9ec0574feeee1eaedfe819f35bd54f4e24a783dc ; PR #3 : 7e761bb190a34b0a0a53e2b6a83d3e9960bdfaca.
Sources récupérées par la connexion GitHub ; le clonage direct n'était pas authentifié.
Le fichier recettes.json de plus de 3 Mo a été récupéré par son blob Git après que l'API de contenu a retourné un contenu vide.

## Résultat de l'audit des préparations

La PR #2 intègre un registre base64 WebP avec budget de 6 Mio. Elle ne contrôle pas le conteneur des fichiers.
La PR #3 ajoute un chargeur d'images et un registre de six scènes, sans appel depuis les fonctions de rendu du jeu.
Aucun asset final n'est présent. Ces PR ne réalisent donc pas la refonte graphique.
Cette branche reprend leur préparation sans les fusionner, refuse désormais les faux conteneurs WebP et les fichiers tronqués, et ajoute des tests de régression du pipeline.
La validation du conteneur n'est pas un décodage complet : dimensions, alpha et cohérence artistique restent à vérifier lors de l'arrivée des assets.

## Vérifications réellement exécutées localement

- Build main : succès, 706 Ko, 205 recettes.
- Cinq suites métier main : succès.
- Build avec préparation et contrôles : succès, environ 709 Ko.
- Cinq suites métier et suite images : succès.
- Lancement Playwright : échec, Chromium absent.
- Installation Chromium : échec, réponse HTML à la place de l'archive ZIP.

Un workflow GitHub et un test mobile sont ajoutés pour exécuter démarrage, navigation, absence de débordement, une fixture ancienne et captures en 390 × 844. Leur présence n'est pas une preuve de réussite : consulter le résultat Actions.

## Sauvegardes et limites constatées

La clé ignem.v1 et les cinq moteurs restent inchangés.
Le code existant contient des migrations V0.3, V0.6 et V0.8. La fixture navigateur couvre seulement un ancien état minimal, pas toutes les parties historiques.
Les sessions de gestes et de distillation sont des variables en mémoire (session/sessionD). Leur reprise exacte après rechargement n'est pas actuellement persistée. Ce point doit être traité et testé avant de déclarer le lot 0 terminé.
Aucun test complet des parcours brassage, distillation, vieillissement et vente dans le navigateur n'a encore été validé.

## Suite du chantier

Le lot 0 reste ouvert jusqu'à validation mobile et des sauvegardes. Les lots graphiques 1 à 6 ne sont pas terminés.
Conserver les visuels actuels tant que leurs remplaçants ne sont pas intégrés et contrôlés. Brancher les scènes sur leurs états réels, avec rendu haute densité, puis tester chaque geste et fournir des captures avant/après.
Aucune fusion main, publication ou modification des règles métier.

## Vérification GitHub Actions effectuée

Run 42516008684, commit 97fcf868f1cf9b11d19598cc9d4948fd9d2612f5 : build, six suites et test mobile Playwright réussis sur Ubuntu 24.04. Captures domaine/options à 390 × 844 produites et inspectées. Le rendu est encore celui du jeu original, sans refonte artistique.

Le contrôle mobile valide le démarrage sans les polices réseau, la largeur de page, le chargement d'une fixture ancienne minimale, les points/brassins conservés et la navigation vers les options sans exception JavaScript. Il ne valide pas les parcours complets ni la reprise des gestes.

Artefact HTML et captures : https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42516008684/artifacts/13631251902
