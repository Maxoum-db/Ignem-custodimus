# Ulysse illustré — 9 novembre 2026

Suite de la PR #16 fusionnée : remplacement des trois présentations de l’alambic (préparation, brouillis et bonne chauffe) par un dessin Canvas original en haute définition. Cuve cuivrée, colonne, serpentin visible dans le condenseur, remorque, foyer et récipients sont dessinés séparément. Aucun nouvel état métier n’est créé.

La présentation avant lancement montre un alambic vide et éteint. Pendant le brouillis, le niveau indicatif suit la progression du geste existant, avec les bûches, la flamme, la mousse et les incidents du contrôleur. Pendant la repasse en mode débutant, le niveau suit le volume restant de la charge, le degré vient du dernier pas moteur, les trois récipients suivent leurs volumes et la fraction active. Les représentations ne constituent pas un dimensionnement technique d’alambic.

En mode expert, la vue conserve ses sept courbes : six familles de congénères sur échelle logarithmique et le degré sur échelle linéaire. Les points et les coupes viennent du moteur inchangé. Axes et graduations sont maintenant lisses et lisibles. Les réglages, conseils olfactifs, commandes de coupe et résultats restent ceux du jeu original.

## Validation

Build et six suites Node, smoke mobile et contrat de huit rendus exécutés. Le parcours expert exécute le brouillis, ajoute du bois, passe manuellement des têtes au cœur puis aux queues, arrête la chauffe et poursuit jusqu’au chai. Le parcours débutant couvre la présentation des trois récipients. Le test ne juge pas la qualité optimale des coupes, et ne couvre pas tous les profils de charge. Voir les résultats Actions pour les exécutions finales.

La sauvegarde ignem.v1 et les moteurs scientifiques ne changent pas. Les niveaux normalisés et le reflet des incidents restent des illustrations de la simulation existante. La carte, les portraits, le chai et les autres scènes restent à refaire ; la reprise exacte après fermeture reste ouverte.
