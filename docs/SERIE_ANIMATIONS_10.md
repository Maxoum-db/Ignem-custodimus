# Dix animations complémentaires — 17 novembre 2026

Exception de série explicitement autorisée par « Etape suivant, enchaine 10 étapes ».
Audit réel : main f1cdf0f, PR #107 ouverte, état local propre. Flammes, vapeur,
niveaux, bulles, chutes de houblon et premières illustrations existent déjà.
Ne pas les refaire. Dix petites missions successives, une branche/commit/PR chacune,
empilées sur #107 ; aucune fusion ou publication supplémentaire autorisée.

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
