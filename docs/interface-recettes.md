# Préparation des recettes et interface — 9 novembre 2026

La préparation utilisait encore sa cuve 120 × 96 et des polices pixelisées, même après la refonte des cinq gestes. Cette étape remplace le dessin de préparation par une scène Canvas vectorielle originale et adapte l’interface commune : polices système hors ligne, boutons arrondis, icônes SVG de navigation, flamme et ingrédients.

Le regard de cuve représente la charge relative de grain (260 kg pour 1 000 L, mise à l’échelle du volume existant), et non un volume de liquide simulé. Cuve vide, couleur, présence du houblon et de la levure suivent la recette. Aucun effet de chauffe ne précède le lancement du brassin. Les valeurs scientifiques et les règles de gestion ne sont pas modifiées. Le dessin réagit aussi immédiatement lorsque les animations sont réduites.

Une cuve de dépôt flottante apparaît pendant le glisser-déposer, y compris après défilement des ingrédients. Les sept onglets, les contrôles de quantité, les fiches, le plan de Lise et les boutons de lancement/conformation restent ceux du jeu.

## Vérifications

Build, suites Node, smoke mobile, contrat de six rendus et parcours de recette jusqu’à la vente et au chai exécutés localement. Le test recette-mobile vérifie : ajout par bouton puis par glisser-déposer, sauvegarde des 50 kg, retour visuel à vide après confirmation, actualisation sans animation, DPR 2, sept onglets et absence de débordement à 320 px. Les captures utilisent des fixtures de test, aucune donnée personnelle. La CI répète ces contrôles ainsi que les gestes chronométrés.

## Limites

Cette étape n’achève pas le lot Interface ni toute la direction artistique. La carte, les portraits des mentors, la représentation d’Ulysse, les bouteilles du carnet et plusieurs scènes secondaires gardent encore leurs dessins d’origine. La reprise exacte des gestes après fermeture reste ouverte. Les HTML de dist sont reconstruits et leur concordance avec les sources est contrôlée en CI.
