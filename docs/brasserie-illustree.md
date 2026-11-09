# Brasserie illustrée — 9 novembre 2026

Cette branche part de la PR #14 et du jeu original. Elle ajoute cinq scènes vectorielles dessinées en Canvas : empâtage, filtration, ébullition, fermentation et embouteillage. Les dessins originaux restent disponibles dans les contrôleurs comme repli si le module de présentation est absent. Aucun moteur scientifique n'est remplacé.

## Architecture

`ateliers.js` reçoit un état de présentation. Décor en cache, objets, matières, effets et courbe de température sont des couches de dessin séparées. Aucun texte n'est intégré à une image. Cuivre et inox, pierre calcaire, bois, vannes et équipements partagent les mêmes formes, couleurs et éclairage. Le module n'utilise ni bibliothèque de rendu ni requête réseau. Le HTML autonome contient toutes les illustrations.

Le niveau du bac de filtration est calculé à partir du volume recueilli ; eau au-dessus des drêches, tassement, rinçage et râteau suivent le geste. Température, pression, ouverture de vanne, inertie de l'enveloppe, montée à ébullition, ajouts de houblon, courbe de fermentation et bris des bouteilles utilisent les états existants. Empâtage et ébullition représentent la charge entière de l'atelier ; le regard n'est pas une mesure supplémentaire de volume simulé.

Le rendu tient compte de la largeur affichée et du DPR (plafonné à 3). `prefers-reduced-motion` fige les mouvements décoratifs ; les valeurs et l'avancement du geste continuent d'être mis à jour. Les commandes DOM, les jauges et les tutoriels restent en place. Les libellés des mesures peuvent revenir à la ligne sur mobile.

Les changements de recette/options en attente sont écrits immédiatement lors de `pagehide` ou quand le document devient masqué. La clé `ignem.v1` ne change pas. Il ne s'agit pas encore d'une persistance des sessions de gestes : leur reprise exacte reste à développer.

## Vérification

- Build et six suites Node : exécutés.
- Mobile 390 × 844, DPR 2, polices réseau bloquées, ancienne fixture, navigation et sauvegarde immédiate : testés.
- Contrat de rendu : cinq états visuels distincts, aucun état de contrôleur muté, DPR 2, aucune exception JavaScript.
- Parcours par les commandes existantes : recette, cinq écrans de brassage, embouteillage, vente, distillation avec raccourcis officiels, remplissage de fût, vieillissement, embouteillage du spiritueux, rechargement.
- Un second parcours exécute réellement les quatre gestes chronométrés de la brasserie et maintient les commandes vapeur/rinçage/glycol. Ce parcours a réussi localement le 9 novembre 2026, jusqu’à la vente et au rechargement final. Les exécutions CI sont vérifiées séparément.

Les fixtures appartiennent aux tests ; aucune sauvegarde personnelle n'est lue ni remplacée. Les tests de distillation utilisent « Passer ce geste » et « Coupes automatiques » ; ils ne valident pas encore toutes les coupes manuelles.

## Reste à faire

Carte, personnages, portraits, interface globale, Ulysse et activités complémentaires gardent leurs graphismes antérieurs. La brasserie a une première illustration fonctionnelle ; l'enrichissement artistique et la cohérence avec la future carte restent à poursuivre. La reprise complète d'une activité en cours après rechargement reste une condition ouverte du lot 0. Aucune fusion ni publication de production.

## Intégration contrôlée du 9 novembre 2026

Main vérifié avant fusion : `a1ecd70bb4df8a12a1f25902f266ce3f6c925bec`, inchangé depuis la base auditée. Les deux derniers commits correspondent à V0.8 (bâtiments, matériel et difficulté) et V0.8.1 (apparence évolutive du domaine). Aucun retour arbitraire à une version plus ancienne : cela retirerait des fonctionnalités. Aucun commit identifié avec certitude comme essai défectueux dans cette comparaison ciblée ; ce contrôle ne constitue pas un audit exhaustif de tout l’historique.

Les cinq moteurs scientifiques ne présentent aucune modification entre main et cette branche. Le run GitHub 42566417685 a réussi, y compris les gestes chronométrés. Les deux HTML suivis dans dist sont maintenant régénérés depuis les sources de la branche. La CI refuse désormais un décalage entre ces livrables et le build. Fusion autorisée par le propriétaire le 9 novembre ; aucun déploiement de production demandé.
