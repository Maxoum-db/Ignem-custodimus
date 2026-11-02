# Audit visuel du vrai jeu

`python qa/finition/audit.py --sortie qa/finition/etape-N/390`

Tablette : ajouter `--largeur 768 --hauteur 1024` et changer le dossier en `768`.
Servir le dépôt sur `127.0.0.1:8000` après `node scripts/construire-jeu.mjs`. Python Playwright + Chromium `/usr/bin/chromium`. Captures JPEG au viewport demandé ; aucune application parallèle.

La clock Playwright accélère les vraies boucles des gestes. Les fixtures dérivent d'une sauvegarde historique de `qa/sauvegardes` ; le navigateur isole son stockage. Plusieurs fixtures sont nécessaires pour les modes expert/novice, les saisons, le dry hop et la commande hebdomadaire. L'assemblage utilise un second lot QA explicitement dupliqué ; il ne prétend pas attester de deux fabrications distinctes. Les prix, objectifs, recettes et notes restent calculés par les moteurs réels. Le compte de captures peut varier avec les clients de la fixture.

`--reprise` reprend le checkpoint de distillation pour déboguer les derniers menus ; un manifeste repris peut contenir des vues répétées. Pour une livraison, préférer un passage complet. `planches.py DOSSIER` regroupe chaque série de vingt états. Voir `docs/audit-design.md` pour la couverture et les limites.

Les rapports signalent les erreurs et les dimensions du document et du conteneur de scène. Ils ne constituent pas une certification WCAG ni une mesure réseau Android réelle. Aucune action de défrichage n'existe dans cette version du jeu.
