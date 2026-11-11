# Progression Codex

## Mission demandée — cinq secondes d’approche avant le premier houblon

Branche : `work/houblon-preparation-5s`, créée depuis le main distant
`39778b2398b5fe211ca4129a92bdd6efa84afd11`. Dépôt initial propre ; PR #78
confirmée fusionnée. Les 19 missions précédentes sont donc déjà intégrées.
Autorisation explicite pour cette mission et sa fusion : demande utilisateur
« Lance la barre de progression 5s avant ... Push en main la totale ».

Constat : l’ancienne montée à ébullition durait trois secondes, curseur immobile.
Le bouton s’activait au moment où le curseur démarrait déjà sur le repère d’un
ajout prévu au début de l’ébullition. La nouvelle frise possède une zone
préparatoire de cinq secondes réellement parcourue avant les repères. Un compte
à rebours persistant annonce le départ ; le premier ajout est désactivé pendant
ces cinq secondes. Le temps scientifique de recette ne commence qu’ensuite.
La durée de jeu de l’ébullition reste de 18 secondes, après cette approche.
Le calcul des écarts, la notation et les minutes de recette restent inchangés.
La préparation est un état local du geste ; aucun format de sauvegarde modifié.

Fichiers : `jeu/src/jeu.js`, `jeu/src/page.html`, `jeu/src/style.css`,
`jeu/tests/lot50/houblon-preparation.test.cjs`, `jeu/tests/parcours.cjs`,
`.github/workflows/validation-jeu.yml` (archivage des captures), les deux HTML
dans `dist`, ce journal et huit captures réelles dans
`docs/captures/houblon-preparation/`.

Validation locale réussie :
- Build et six suites Node, dont validation des ressources ; syntaxe JS et
  `git diff --check`.
- Huit scénarios navigateur : expert/débutant, 320/390 px DPR 2, ajouts à l’heure
  et premier ajout en retard d’une seconde. L’horloge du navigateur est pilotée
  pour vérifier la frontière de cinq secondes et les instants exacts, sans
  simuler le moteur ni appeler les fonctions privées du jeu.
- Curseur en mouvement avant le premier repère, ajout interdit avant 5 s,
  compte à rebours, deux ajouts aux repères donnant **100 %** de précision.
  Les retards restent pénalisés. Recettes de 60 min (expert) et 90 min (débutant),
  dry hop et recette prévue conservés, accès à la fermentation vérifié.
- Deux parcours complets avec `GESTES_REELS=1`, en temps naturel : expert et
  débutant, de la recette à la boutique, réussis sans exception JS.
  Captures supplémentaires dans `/tmp/ignem-hop-real-expert` et
  `/tmp/ignem-hop-real-debutant`. Le parcours attend désormais l’activation
  réelle du bouton plutôt qu’un délai fixe de quatre secondes.
- Captures réelles du compte à rebours et du 100 % inspectées ; aucune erreur JS
  ni débordement horizontal. Pas d’Android physique ni de Safari disponibles.

Commandes de reprise : `npm run build:jeu && npm run test:jeu`, puis
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/lot50/houblon-preparation.test.cjs`.
Parcours naturel : `GESTES_REELS=1 node jeu/tests/parcours.cjs` ; ajouter
`MODE_JEU=debutant` pour l’autre mode. Ici Chromium système et serveur local
requièrent l’exécution hors bac à sable.

CI complète confirmée réussie sur le code `e2b3616104500b52c9934f08d77c06733f274845` :
[run 43083739020](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43083739020).
Build reproductible, six suites Node, mobile, huit rendus, toutes les suites de
fonctionnalités (dont les huit nouveaux scénarios), parcours standard et gestes
réels, Ulysse expert et débutant : tous réussis. Le commit suivant ne complète
que ce journal, sans modification du code validé.
PR de livraison autorisée : [#79](https://github.com/Maxoum-db/Ignem-custodimus/pull/79) ;
son état GitHub porte la confirmation effective de fusion dans main.
Les moteurs `moteur.js`, `distillerie.js`, `chai.js`, `ecole.js`,
`vente.js` et les données scientifiques restent identiques à main.
Le site reste sur sa dernière publication consignée (version 12) tant qu’une
nouvelle publication distincte n’est pas effectuée.

Prochaine mission unique proposée, non commencée : publier le main actualisé
pour une revue commune de la version jouable. Les autres priorités déjà
auditées restent les libellés des doses de houblon, les contrôles Ulysse/mentors
et les finitions de dégustation, puis les essais sur appareils physiques.


## Intégration demandée dans main — lot jusqu’à la mission 19

Autorisation explicite : « Push en main, puis dis moi ce qu’il reste a faire ? ».
Branche dédiée : `work/integration-lot50-19`, issue de
`2913e17a98941d13c2cd9aa32d78a323039e0da5`. Les 19 branches distantes
`work/lot50-*` sont toutes ancêtres de cette tête. Le main audité est
`43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`. Aucun travail sur main local.
PR d’intégration : [#78](https://github.com/Maxoum-db/Ignem-custodimus/pull/78).
L’état effectif de fusion est porté par cette PR GitHub ; aucune
suppression de branche ni fermeture manuelle des PR empilées n’est prévue.

Périmètre : intégrer les travaux récents des PR #59–#77 et leur journal.
Les prototypes historiques hors de cette chaîne restent hors périmètre.
Cette intégration ne réalise pas de nouvelle mission graphique et ne publie
pas une nouvelle version du site.

Validation locale : build reconstruit sans différence sur les deux HTML livrés,
six suites Node réussies, ressources validées, `git diff --check` réussi.
Les cinq moteurs et le dossier data sont inchangés par rapport à main.
CI complète antérieure : 43076308757 réussie. Contrôle final du code 2913e17 :
[run 43080317643](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43080317643).
Réussite effective confirmée : build reproductible, six suites Node, mobile,
huit rendus, suites de fonctionnalités, recette, parcours standard, gestes
réels, Ulysse expert et débutant. Les seuls ajouts de cette branche sont
les mises à jour de ce compte rendu : aucun changement du code validé.

Reste à faire, d’après le code réel (liste de priorités, pas 31 missions inventées) :

1. Publier le nouveau main sur le site existant. La dernière publication
   consignée est la version 12, depuis l’ancien main 43ab1df ; fusion GitHub
   et publication du site sont deux opérations distinctes.
2. Prochaine mission de développement : faire correspondre le texte et le nom
   accessible des boutons de houblon à `doseHop()` ; `jeu/src/jeu.js` affiche
   encore +250 g pour toutes les tailles de brasserie alors que le calcul
   adapte déjà la quantité au volume.
3. Agrandir les contrôles restants : les bascules de `#dist-reglages` utilisent
   encore les styles génériques, les curseurs génériques mesurent 28 px de haut,
   et `.mentor-actions .btn` conserve une hauteur minimale de 36 px. Traiter
   chaque composant dans sa propre mission, en conservant ses interactions.
4. Auditer puis harmoniser les panneaux encore anciens de dégustation : fiche
   du jury, médailles et défauts. Les verres illustrés existent déjà : ne pas
   les refaire. Les petits animaux du domaine restent dessinés par procédures ;
   des assets cartoon historiques existent et peuvent être évalués pour une
   mission artistique ultérieure, sans recréation automatique.
5. Vérifier sur Android physique et Safari/iPhone : non disponibles ici.

Les fiches, la recherche, les options, les fournisseurs, les ingrédients, les
quantités, le procédé, les sels, les styles, le plan de Lise, les tutoriels,
les bulles d’aide, le menu, le matériel et la composition sont déjà traités
dans ce lot. Les bâtiments ont déjà été traités dans 0607f21. Ne pas recommencer.
Le compteur historique est de 19 missions de lot réalisées, et non de 50 ; les
missions restantes doivent être définies par audit, sans découpage artificiel.


## ÉTAPE — mission 19 : composition des malts lisible au pouce

Statut : terminée sur `work/lot50-19-composition`, sans fusion. Une seule mission
pour cette exécution ; le lot historique de 50 reste incomplet.

Audit réel : dépôt propre, `origin/main` à `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`,
PR #76 ouverte, tête distante `b51c7349caa621addb4d508ff638d4d2d1ac0071`.
La composition repliable existe déjà (32851ee) ; seuls son confort tactile et sa
lecture restaient à améliorer : noms tronqués et commande sans hauteur minimale.

Critères vérifiés : cible au moins 48 px ; noms longs complets à 320 et 390 px ;
proportions réelles 75/25 puis 50/50 ; ouverture au toucher, fermeture Entrée et
réouverture Espace ; focus conservé ; aucune mutation de sauvegarde par le
repli/dépli ; recette conservée après rechargement.

Fichiers modifiés : `jeu/src/jeu.js` (liaison ARIA, légende, focus),
`jeu/src/style.css` (cible, retours à la ligne, repères arrondis),
`jeu/tests/lot50/19-composition.test.cjs`, `dist/index.html`, `dist/artefact.html`,
les deux captures `docs/captures/lot50/19-composition-{320,390}.png` et ce journal.
Aucun moteur, donnée scientifique ni format de sauvegarde modifié.

Validation locale : `npm run build:jeu`, `npm run test:jeu` (six suites, dont
validation des ressources), test Chromium `19-composition.test.cjs` aux deux
largeurs en DPR 2, et `recette-mobile.cjs` existant réussis. Ce dernier contrôle
le dessin réactif, le glisser-déposer après défilement, les sept onglets et la
remise à zéro. Zéro erreur JS et aucun débordement horizontal dans le nouveau
scénario. `node --check` du jeu et du nouveau test, `git diff --check` réussis.
Captures réelles 320/390 inspectées. Captures supplémentaires du contrôle recette
conservées hors dépôt dans `/tmp/ignem-qa-lot50-19-recette`.
Pas d’Android physique ni de Safari disponibles ; validation GitHub à suivre dans
la PR. Le site publié reste la version 12 ; cette mission n’est pas déployée.

Reprise du test ciblé : `npm run build:jeu && npm run test:jeu`, puis
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/lot50/19-composition.test.cjs`.
Le serveur de test requiert ici l’exécution hors bac à sable.

Prochaine mission unique, non commencée : corriger les libellés des doses de
houblon selon le volume de brasserie (le calcul existant est conservé).


## Lot de 50 — point de reprise après la mission 18

Dix-huit missions sauvegardées, PR #59 à #76 empilées et ouvertes. Le lot demandé
de 50 n’est pas terminé. Aucun travail nouveau fusionné dans main pendant ce lot.

Validation commune confirmée : [run 43076308757](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43076308757),
conclusion **success**, code du commit `71f45ec7f924fe172d819d9293a04274cc869cfb`.
Build reproductible, six suites Node, mobile, huit rendus, plan du chai,
suites finitions/pigeonnier/veillée/lot50, entrée Ulysse, portrait de Firmin,
domaine, carnet, recette mobile, parcours standard, gestes réels, Ulysse expert
et Ulysse débutant : tous réussis. L’échec initial du run 43074048328 est
corrigé par la mission 18 (questions homonymes, tests seulement).

Contrôles locaux supplémentaires au même code : mobile et huit rendus réussis ;
aucun changement des moteurs `moteur.js`, `distillerie.js`, `chai.js`, `ecole.js`,
`vente.js` ni du dossier data par rapport à main. Les captures de contrôle
générées hors livraison sont conservées dans `/tmp/ignem-qa-lot50-18-mobile` et
`/tmp/ignem-qa-lot50-18` ; les preuves livrées sont dans `docs/captures/lot50`.
Aucun Android physique ni Safari disponible. Le document de ce point de reprise
est ajouté après la validation : aucune modification du code testé.

`origin/main` vérifié à `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d` ; le site
publié reste la version 12 issue de ce main :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Les missions 02 à 18 sont sur les branches et PR, pas encore sur le site.

Prochaine mission unique, non commencée : composition des malts lisible au
pouce, noms complets et proportions réelles conservées. Audit préalable :
le contrôle actuel mesure une petite cible et tronque les noms par ellipsis.
Ne pas refaire les bâtiments (déjà intégrés par 0607f21).

Reprise : `git fetch origin`, vérifier main et les PR #59–#76, vérifier que le
répertoire est propre, partir de `work/lot50-18-validation-quiz` sur une nouvelle
branche dédiée. Ne pas fusionner sans nouvelle autorisation explicite.


## Lot autorisé de 50 — mission 18 : Validation : distinguer les questions homonymes par module

Statut : terminée sur `work/lot50-18-validation-quiz`, sans fusion.
CI 43074048328 en échec dans le test Veillée 09 : deux cartes Dimensionnement appartiennent aux modules Énergie et Brasserie, avec des réponses distinctes. Le helper de test cherchait seulement le titre. Correction limitée aux tests : résolution par titre et module, cas forcés des deux cartes, vérification des récompenses. Tests Veillée 08 et 09 rejoués avec succès aux deux largeurs ; nouvelle CI complète à confirmer. Aucun code du jeu ni donnée scientifique modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/18-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Confirmer la nouvelle CI complète, puis améliorer la lecture de la composition des malts.


## Lot autorisé de 50 — mission 17 : Matériel : achats tactiles et installation vérifiée

Statut : terminée sur `work/lot50-17-materiel`, sans fusion.
Audit : les bâtiments et leurs travaux sont déjà traités dans 0607f21 ; aucune reprise de ce travail. Cartes du matériel, achats nommés de 48 px et état installé lisible. Installation réelle de la vanne : 60 écus débités, matériel conservé après rechargement, bâtiments et travaux inchangés. Le test tient compte du tableau travaux initialisé lors de la première sauvegarde.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/17-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Diagnostiquer l’échec de validation GitHub de la mission 10 avant de poursuivre la refonte.


## Lot autorisé de 50 — mission 16 : Menu : navigation mobile sur écran court

Statut : terminée sur `work/lot50-16-menu`, sans fusion.
Menu défilant à hauteur contenue, actions de 48 px, ouverture clavier sur la page courante et fermeture Échap avec retour du focus. Hauteur 320 px : dernier lien Options accessible, navigation effective et progression conservée vérifiées.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/16-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser les cartes de bâtiments et vérifier un lancement de travaux.


## Lot autorisé de 50 — mission 15 : Informations : bulles tactiles et accessibles

Statut : terminée sur `work/lot50-15-informations`, sans fusion.
Boutons de 44 px, état ouvert annoncé, association du texte, fermeture Échap et bulle défilante contenue dans l’écran. Texte intégral réel du pigeonnier, dimensions 320/390 par 568 px, fermeture extérieure et absence de mutation vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/15-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre le menu utilisable sur écran court et restaurer son focus à la fermeture.


## Lot autorisé de 50 — mission 14 : Tutoriels : lecture mobile et navigation clavier

Statut : terminée sur `work/lot50-14-tutoriels`, sans fusion.
Cartes de premier passage à contenu défilant, actions de 48 px et texte lisible. Tutoriel réel du pigeonnier : page suivante, hauteur 568 px, boucle Tab, fermeture Échap et conservation du marqueur vu après rechargement vérifiés. Les premiers essais de test visaient à tort un tutoriel brasserie inexistant puis une recette non encore sérialisée ; scénario corrigé sur les données réelles.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/14-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les bulles d’information au tactile et aux petits écrans.


## Lot autorisé de 50 — mission 13 : Conformité : repères lisibles et plages chiffrées

Statut : terminée sur `work/lot50-13-reperes`, sans fusion.
Valeurs et plages du style lisibles sans interpréter les couleurs, jauges arrondies et accordéon relié à son contenu. Ouverture/fermeture sans mutation et recalcul effectif après ajout de malt vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/13-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les tutoriels lisibles sur petit écran et contrôler leur fermeture au clavier.


## Lot autorisé de 50 — mission 12 : Plan de Lise : portrait net et étapes tactiles

Statut : terminée sur `work/lot50-12-plan-lise`, sans fusion.
Capture ajustée au bandeau fixe des mesures pour garder le portrait dans le viewport, puis scénario 320/390 rejoué.
Portrait illustré en rendu lisse, étapes lisibles, liens de fiche de 44 px et actions de 48 px. Application effective du plan à une cuve vide, levure et malts obtenus, cible conservée, aller-retour fiche et abandon de cible sans vider la recette vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/12-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Clarifier les repères de conformité au style et leurs plages chiffrées.


## Lot autorisé de 50 — mission 11 : Style visé : sélecteur mobile accessible

Statut : terminée sur `work/lot50-11-styles`, sans fusion.
Contrôle visuel initial : descriptions débordantes dans la grille ; corrigé par des lignes de hauteur intrinsèque. Contrôle supplémentaire : aucun texte ne dépasse sa carte à 320/390 px.
Liste interne défilante, annulation toujours visible, choix lisibles et état sélectionné explicite. Focus initial, boucle Tab, Échap, retour du focus, choix du dernier style et sauvegarde de la cible vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/11-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser le plan de Lise et vérifier son application réelle à la recette.


## Lot autorisé de 50 — mission 10 : Eau : dosages lisibles et curseurs tactiles

Statut : terminée sur `work/lot50-10-sels`, sans fusion.
Cartes de dosage avec unités distinctes, curseurs de 44 px et bilan ionique lisible. Choix réel d’un profil, augmentation d’un sel, actualisation du bilan et conservation après rechargement vérifiés dans une partie de test en bac à sable.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/10-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre le sélecteur de style mobile et sa navigation clavier accessibles.


## Lot autorisé de 50 — mission 09 : Procédé : réglages scientifiques tactiles

Statut : terminée sur `work/lot50-09-procede`, sans fusion.
Cartes lisibles, bascules de 48 px et curseurs de 44 px. Palier, température, rendement, cuisson, repos diacétyle, ébullition 90 min, bascule wash et retour bière vérifiés avec persistance exacte de la recette. Aucun calcul scientifique modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/09-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les dosages de sels et d’acide et vérifier le bilan ionique réel.


## Lot autorisé de 50 — mission 08 : Cuve : quantités et temps d’ajout tactiles

Statut : terminée sur `work/lot50-08-quantites`, sans fusion.
Noms et quantités sur des lignes distinctes, commandes de 48 px, temps de houblonnage de 44 px et libellés de dose réels. Plus/moins, saisie décimale française, grammes, dry hop J2, suppression ciblée et persistance vérifiés sans débit d’écus.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/08-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les réglages du procédé et vérifier les recettes bière et wash.


## Lot autorisé de 50 — mission 07 : Brasserie : ingrédients lisibles et poignées tactiles

Statut : terminée sur `work/lot50-07-ingredients`, sans fusion.
Cartes sur deux colonnes, poignées et actions de 48 px, recherche et choix nommés. Choix réel de levure, ajout par toucher et dépôt par événements tactiles Chromium vérifiés. Le scénario initial alternant CDP et Playwright après dépôt échouait sur la détection du clic suivant ; le scénario final teste la sélection avant le dépôt, sans prétendre couvrir cette alternance. Le test recette-mobile existant passe aussi : sept onglets, ajout, dépôt après défilement et remise à zéro.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/07-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les quantités de la cuve et les moments d’ajout du houblon au tactile.


## Lot autorisé de 50 — mission 06 : Fournisseurs : catalogue tactile et achats nommés

Statut : terminée sur `work/lot50-06-fournisseurs`, sans fusion.
Catégories et filtres lisibles, recherche nommée, cartes et boutons de 48 px, verrouillage explicite. Achat réel contrôlé : débit exact, ingrédient possédé, retrait des achats restants, recherche vide et persistance vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/06-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les cartes d’ingrédients de la brasserie et leurs gestes tactiles.


## Lot autorisé de 50 — mission 05 : Options : préférences lisibles et tactiles

Statut : terminée sur `work/lot50-05-options`, sans fusion.
Captures corrigées : viewport réel plutôt que découpe longue débordant du conteneur défilant ; missions 04 et 05 rejouées à 320/390 px.
Cartes et bascules de 48 px, sélection explicite. Sons, gestes expert, bac à sable, aller-retour débutant/expert, persistance après rechargement et annulation sans effacement vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/05-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser le catalogue des fournisseurs et contrôler un achat réel.


## Lot autorisé de 50 — mission 04 : Recherche : cartes et ajout à la cuve adaptés au tactile

Statut : terminée sur `work/lot50-04-resultats`, sans fusion.
Cartes continues, texte lisible, boutons de 48 px. Ajout réel de malt, absence de débit et persistance exacte de la recette après rechargement vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/04-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les préférences de jeu au tactile et vérifier leur persistance.


## Lot autorisé de 50 — mission 03 : Recherche : commandes accessibles et résultats annoncés

Statut : terminée sur `work/lot50-03-recherche`, sans fusion.
Champ nommé, saisie et tri tactiles, filtre actif explicite et compteur annoncé. Recherche de pilsner, tri, catégorie réelle et état sans résultat vérifiés ; aucun état école modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/03-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les cartes de résultats et leurs actions utilisables au pouce.


## Lot autorisé de 50 — mission 02 : Fiches : accordéons lisibles et retour aux leçons

Statut : terminée sur `work/lot50-02-fiches`, sans fusion.
Accordéons cohérents avec les cartes de leçons, cibles 48 px et théorie lisible. Ouverture/fermeture conserve exactement le texte ; lien depuis une leçon et retour réel à la veillée sans mutation vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/02-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les commandes de recherche accessibles au pouce.


## Lot autorisé de 50 — mission 01 : publier le main validé

2026-11-11 — reprise après interruption. La branche `work/lot50-01-publication`
était propre et sans commit supplémentaire ; aucune version 12 ni archive locale
n’existait. État GitHub vérifié par fetch : main `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`.
Aucun ancien travail graphique recommencé et aucune PR intermédiaire clôturée.

Publication terminée via le skill Sites : version **12**, source Sites
`9dc6b243987ae16e53cbc3062af9561aa7549925`, déploiement
`appgdep_6af4a86d84a881919fd170c092d54288`, état confirmé `succeeded`.
Adresse et droits `custom` conservés :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site

Build et six suites Node réussis après reprise. Jeu publié et dist/index.html
identiques par SHA-256 :
`6cd7ed5b361c6dd9f1048ff0323ae2b4d440a3720b2a5a9d308ae046cb06665a`.
Archive de sortie avec manifeste existant et dist ; aucun code du jeu ni format
ignem.v1 changé. Les captures réelles et CI complète du code sont déjà conservées
dans main ; cette mission modifie uniquement la publication et le présent journal.
Identifiant temporaire renouvelé après reprise, transmis uniquement sur stdin au
script de synchronisation Git, puis sauvegarde et déploiement natifs Sites.

Prochaine mission : harmoniser les accordéons des fiches techniques, sans changer
les explications scientifiques ni leurs liens depuis les leçons.


## Intégration générale demandée — 2026-11-10

Demande : « Push en main tout tes travaux, dis moi si tout est à jours sur github
et comment y avoir acces ». État local propre avant reprise et fetch effectué.
Les séries Chai et Pigeonnier sont déjà dans main `9680401` ; les dix branches
Veillée restantes aboutissent au commit `2a0b124a113b47830f4798674a4bd1af99912452`.
La branche `work/integration-generale` rassemble ces travaux et ce relevé, pour
fusion autorisée dans main. Aucun changement de code supplémentaire.

CI finale **entièrement réussie** sur le code de la dernière série :
https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42905561181
Build reproductible, six suites Node, trente scénarios mobiles, rendus et parcours
normal/gestes chronométrés/Ulysse expert et débutant tous réussis. Le présent
complément est documentaire ; identité du code et des HTML vérifiée avant fusion.
L’état effectif de fusion et le SHA final sont consultables dans la PR
« Intégrer tous les travaux validés dans main » et dans l’historique de main.

Accès GitHub : https://github.com/Maxoum-db/Ignem-custodimus/tree/main
Jeu autonome : https://github.com/Maxoum-db/Ignem-custodimus/blob/main/dist/index.html
Télécharger ce HTML via le bouton de téléchargement GitHub, puis l’ouvrir dans
un navigateur ; pour les tests automatisés, le servir par HTTP local.
Site existant vérifié actif, version 11 :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Ce site n’a pas été republié pendant l’intégration GitHub. Ses droits sont inchangés.

Les anciennes branches des PR #1–#13 sont des travaux historiques antérieurs aux
trois séries de cette conversation et ne sont pas fusionnées sans réconciliation.
Les branches de travail sont conservées. Prochaine proposition unique : synchroniser
la publication du site avec main, si une version jouable en ligne à jour est souhaitée.


## Veillée — mission 10/10 : Leçons : portraits réutilisés de Lise et Firmin

Statut : terminée sur `work/veillee-10-mentors`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

La fiche indique son mentor avec le portrait existant du dialogue. Décodages Lise 512 px et Firmin 144 px vérifiés ; mise à jour prévue si Firmin finit son chargement après ouverture. École et écus inchangés pendant la lecture. Validation commune des trois séries consignée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Harmoniser la lecture des fiches techniques liées aux leçons, sans modifier leurs textes.


## Veillée — validation commune finale

Dix missions depuis main `9680401` : cartes, statuts/prérequis, théorie,
étapes, progression, réponses de leçons, correction textuelle, quota quotidien,
questions du soir et portraits réutilisés des mentors. Aucune nouvelle fusion
ni publication. Les neuf premières PR de veillée ont leur CI réussie au relevé.
Le run 42901927573 du correctif de parcours précédent est confirmé entièrement
réussi, y compris gestes chronométrés et Ulysse expert/débutant.

Validation locale finale : six suites Node, vingt scénarios des deux séries
précédentes et dix scénarios veillée à 320/390 px, smoke mobile, huit rendus et
parcours complet réussis. Le passage groupé a terminé les vingt anciens scénarios
puis rencontré un timeout de 30 s sur le chargement global pendant v01. Le support
QA attend désormais DOMContentLoaded puis les écrans visés et les décodages
explicites ; les dix scénarios veillée ont été rejoués avec succès, ainsi que les
deux familles de navigation précédentes. Assertions et règles du jeu inchangées.
HTML reproductibles par SHA-256, syntaxe JS et diff vérifiés. Aucun diff des moteurs.
Les parcours chronométrés ont été rejoués au préalable avant fusion du pigeonnier.

Fichiers de cette série : `jeu/src/style.css`, `jeu/src/jeu.js` (présentation),
`dist/index.html`, `dist/artefact.html`, `jeu/tests/veillee/`, support partagé
`jeu/tests/finitions/support.cjs`, workflow de validation, présent journal et
captures réelles `docs/captures/serie/v01-*` à `v10-*`, actualisées sur le code final.
Aucun nouveau format de sauvegarde ni nouvelle ressource graphique source :
les portraits sont ceux déjà intégrés au dialogue du jeu. Pas de test sur appareil
Android physique ou Safari ; nouvelle CI du dernier commit à vérifier après push.

Arrêt après la dixième mission. Prochaine proposition unique : harmoniser la
lecture des fiches techniques accessibles depuis les leçons, sans changer les textes.


## Veillée — mission 09/10 : Questions du soir : réponses tactiles et correction textuelle

Statut : terminée sur `work/veillee-09-questions`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cibles de 48 px et texte de correction indépendant de la couleur. Une réponse erronée ne rapporte rien et consomme une question ; la correcte suivante rapporte quatre écus. Verrouillage et passage à la suivante conservés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Réutiliser les portraits de Lise et Firmin dans les fiches de leçons.


## Veillée — mission 08/10 : Questions du soir : progression quotidienne visible

Statut : terminée sur `work/veillee-08-quotidien`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Jauge accessible de zéro à cinq reprenant le compteur existant. Cinquième question correcte : +4 écus et compteur à cinq ; question suivante en entraînement sans gain ni dépassement du compteur, conformément aux règles existantes.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la correction des questions du soir lisible sans couleur.


## Veillée — mission 07/10 : Quiz de leçon : correction textuelle et repère de question

Statut : terminée sur `work/veillee-07-correction`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute Bonne réponse et Ton choix en texte, un statut de correction et Question N sur 3. Erreur réelle, conservation de la validation incomplète et passage à la question suivante vérifiés. Contrôle des cibles de la mission 6 rejoué avec les nouveaux libellés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la limite quotidienne des questions visible et vérifiable.


## Veillée — mission 06/10 : Quiz de leçon : réponses au pouce et focus visible

Statut : terminée sur `work/veillee-06-reponses`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Quatre cibles au moins 48 px, texte lisible et focus clavier. Une réponse réelle verrouille les quatre choix et indique la bonne réponse ; le quiz ne se valide pas après une seule question.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Ajouter une correction textuelle et un repère de question.


## Veillée — mission 05/10 : Leçons : progression réelle du défi et du quiz

Statut : terminée sur `work/veillee-05-progression`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Jauge accessible sur deux étapes en lecture seule. Contrôle 0/2 puis défi validé 1/2, trois réponses correctes via les vrais boutons et complétion 2/2 ; récompense exacte de 15 écus vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Agrandir les cibles des réponses du quiz de leçon.


## Veillée — mission 04/10 : Leçons : deux étapes lisibles et actions préservées

Statut : terminée sur `work/veillee-04-etapes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Défi et Trois questions dans des cartes séparées et arrondies. Démarrage réel de la leçon et bouton Y aller vers la brasserie vérifiés ; école et écus conservés pendant cette navigation.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Afficher la progression réelle des deux étapes.


## Veillée — mission 03/10 : Leçons : lecture confortable de la théorie

Statut : terminée sur `work/veillee-03-lecture`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Titres et paragraphes agrandis, interlignage et largeur de lecture adaptés, récompense dans un encadré. Texte de théorie comparé exactement au moteur école ; lecture sans début ni progression supplémentaire vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Habiller les deux étapes sans déplacer leurs commandes.


## Veillée — mission 02/10 : Leçons : états et prérequis lisibles

Statut : terminée sur `work/veillee-02-statuts`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Statuts distincts et noms accessibles explicites ; cartes verrouillées lisibles sans transparence. Le prérequis réel continue de désactiver la leçon et sa validation la déverrouille. Lecture seule sans mutation vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/02-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v02-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Améliorer la lecture des textes de théorie et des récompenses.


## Veillée — mission 01/10 : Veillée : cartes de leçons lisibles au pouce

Statut : terminée sur `work/veillee-01-lecons`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Reprend les tailles et arrondis utiles de la finition historique. Les dix leçons et leurs actions restent identiques ; ouverture/retour sans modification de école vérifiés. Intégration préalable du pigeonnier et rejeu des gestes consignés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/01-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v01-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Distinguer les états et prérequis des leçons.


## Troisième série — reprise vérifiée

Demande : « Push en main puis etape sur 10 d’affiler ». État propre, journal/main et PR #47 relus. Après correction minimale du contrôle de navigation, les trois parcours locaux GESTES_REELS, ULYSSE_REEL expert et débutant ont réussi. PR #47 reciblée sur main et fusionnée avec SHA attendu 9c9c032 ; origin/main confirmé à `9680401271eace9de15ff62b9b301fa714f8b51a`. CI du correctif encore en cours au moment de cette intégration ; tests locaux concernés réussis. Nouvelle série de dix branches/PR empilées, sans fusion ni publication de ces nouveaux travaux. Styles historiques comparés avant reprise.

## Reprise avant intégration du pigeonnier

Autorisation : « Push en main puis etape sur 10 d’affiler ». Audit du run 42900258537 : les vingt scénarios et le parcours normal ont réussi ; le parcours GESTES_REELS a échoué en cherchant tab-malts sans écran de destination confirmé. Correction minimale de jeu/tests/parcours.cjs : attendre le domaine prêt, cliquer le vrai lieu, puis attendre son écran visible. Aucun code du jeu modifié. Rejeu local des gestes et des parcours Ulysse expert/débutant lancé avant fusion ; les résultats seront consignés dans la reprise de la série veillée. Syntaxe et diff contrôlés.

## Pigeonnier — mission 10/10 : Pigeonnier : états vides utiles et navigation de reprise

Statut : terminée sur `work/pigeonnier-10-etats-vides`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Comptoir sans client et cave vide affichés en cartes lisibles. Le bouton Préparer une bière ouvre réellement la brasserie sans modifier stock, points ou écus. Validation commune et correctif des fixtures CI documentés ; aucune autre mission commencée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Harmoniser les cartes de leçons de la veillée sans modifier les quiz.


## Pigeonnier — validation commune de la deuxième série

Dix missions depuis le main intégré `a0a536d` : portraits SVG historiques,
demandes sur parchemin, bouteilles de cave, propositions tactiles, réputation,
satisfaction, échéances, stocks partiels, négociant et états vides. Aucun nouveau
travail fusionné ; première série intégrée auparavant via #37 sur autorisation.
Branches/PR empilées pour une revue et une reprise indépendantes.

Validation finale locale : six suites Node, les vingt scénarios des deux séries
à 320/390 px, smoke mobile, huit rendus et parcours complet jusqu’au spiritueux
vieilli/vente réussis. Reconstruction des deux HTML reproductible par SHA-256,
syntaxe JS et diff contrôlés. Aucun diff dans les moteurs métier ni le format de
sauvegarde. Captures réelles du code final actualisées. Pas d’Android physique,
Safari ni rejeu des gestes chronométrés complets dans cette exécution.

Les CI initiales des missions 1–4 sont réussies. Les runs 42898154811 et
42898500140 ont révélé des cartes absentes à la lecture immédiate dans les tests
01/03. Correctif du support QA dans la dernière mission : attente du domaine prêt
et de l’écran réellement visible ; fixture injectée une seule fois avant le
lancement du jeu avec addInitScript, plutôt que sur une page active. Les dix
contrôles pigeonnier et les deux destinations de navigation ont réussi après ce
correctif. Le délai du job CI passe à 15 minutes pour les vingt scénarios et les
parcours existants. La CI du dernier commit corrigé est à vérifier après push.
Les échecs intermédiaires ne sont pas présentés comme des validations réussies.

Pour les états sans client, le test utilise les vrais boutons de congé après la
génération normale du jeu ; il ne suppose pas que le chargement laisse le comptoir
vide. Les écus des fixtures sont normalisés pour éviter la migration historique.
La pénalité de vente partielle est comparée au moteur avant tout arrondi.

Arrêt après la dixième mission. Prochaine proposition unique : harmoniser les
cartes de leçons de la veillée sans modifier les quiz. Aucun déploiement Sites
pendant cette série ; la publication existante est conservée.


## Pigeonnier — mission 09/10 : Négociant : confirmation avec quantité et prix exacts

Statut : terminée sur `work/pigeonnier-09-negociant`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

La première action précise que tout le stock est concerné ; la seconde affiche quantité et montant. Premier clic sans mutation, second clic avec 100 L retirés et 12 écus crédités vérifiés ; clients et ventes au détail inchangés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les états de cave vide utiles et cohérents avec le jeu.


## Pigeonnier — mission 08/10 : Stocks : alerte lisible et ventes partielles conservées

Statut : terminée sur `work/pigeonnier-08-stocks`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Quantité de cave mise en évidence et avertissement distinct si le stock ne couvre pas la demande. Vente partielle réelle de 4 L sur une demande de 10 L vérifiée, stock vidé et pénalité comparée au moteur non arrondi. Première attente de test corrigée pour ne pas arrondir avant la pénalité.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Clarifier la confirmation de cession au négociant.


## Pigeonnier — mission 07/10 : Commandes : échéances explicites et livraison limite vérifiée

Statut : terminée sur `work/pigeonnier-07-commandes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Badge calculé depuis échéance moins calendrier, avec texte cette semaine au dernier délai. Livraison au dernier délai vérifiée : 20 L retirés, prime 60 écus et réputation +4, commande supprimée. Le médaillon distingue la commande spéciale.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Signaler les stocks insuffisants sans bloquer les ventes partielles existantes.


## Pigeonnier — mission 06/10 : Vente : satisfaction réelle dans le bilan

Statut : terminée sur `work/pigeonnier-06-satisfaction`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Le bilan annonce poliment le résultat et affiche une jauge de satisfaction issue de derniereVente.s. Pourcentage comparé au moteur Vente.satisfaction ; recette encaissée comparée au crédit réel. Aucun nouveau calcul commercial.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les échéances des commandes spéciales explicites.


## Pigeonnier — mission 05/10 : Pigeonnier : réputation chiffrée et accessible

Statut : terminée sur `work/pigeonnier-05-reputation`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Affiche la valeur réelle sur 100 et le rôle meter sur la jauge. Vente réelle vérifiée : texte, attribut et sauvegarde suivent exactement la réputation calculée par le jeu.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la satisfaction réelle visible dans le bilan de vente.


## Pigeonnier — mission 04/10 : Vente : propositions tactiles sans texte comprimé

Statut : terminée sur `work/pigeonnier-04-propositions`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes de produits arrondies et commandes sur une rangée dédiée jusque 440 px. Vente réelle testée : 10 L retirés, écus crédités, client retiré et compteur incrémenté. Les noms longs gardent leur largeur utile.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Afficher la réputation réelle en chiffres et jauge accessible.


## Pigeonnier — mission 03/10 : Cave : bouteilles lisses aux couleurs réelles

Statut : terminée sur `work/pigeonnier-03-bouteilles`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Transforme les pastilles rectangulaires en bouteilles à col et étiquette, sans image réseau. Les trois catégories bière, eau-de-vie et spiritueux vieilli gardent leurs couleurs calculées distinctes. Stock strictement conservé pendant le rendu.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Adapter les cartes de proposition au pouce sur petit écran.


## Pigeonnier — mission 02/10 : Clients : demandes sur parchemin et cartes lisibles

Statut : terminée sur `work/pigeonnier-02-demandes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes arrondies, paroles sur parchemin et typographie lisible. Ouverture du conseil sans mutation et congé du seul client choisi sans transaction vérifiés. Fixture complétée avec possede pour ne pas déclencher une migration historique des écus au premier enregistrement.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/02-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p02-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Illustrer les bouteilles des produits en cave.


## Pigeonnier — mission 01/10 : Pigeonnier : portraits illustrés des clients

Statut : terminée sur `work/pigeonnier-01-portraits`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Réutilise exactement les visages SVG du habillage historique, sans observer ni système parallèle. Les portraits sont déterministes par nom, décodés hors réseau et stables en ouvrant une fiche ; état de vente inchangé. Fusion autorisée de la première série dans main consignée dans le journal.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/01-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p01-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Habiller les demandes des clients en cartes lisibles.


## Reprise de la deuxième série

Demande : « Etape une dizaine apres push en main ». État local propre, main/branches/journal et PR vérifiés. CI finale de la première série réussie (run 42895803234). PR #37 reciblée sur main puis fusionnée avec SHA attendu ; les dix commits précédents sont intégrés à `a0a536d5b0c8cd628127fdcf1f32071cb098e991`, confirmé par fetch. Nouvelle série de dix branches et PR empilées depuis ce main. Les nouveaux travaux ne seront pas fusionnés sans nouvelle autorisation. Le site reste à sa publication existante.

## Série autorisée — mission 10/10 : Bâtiments : niveaux lisibles et travaux vérifiés

Statut : terminée sur `work/serie-10-batiments`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Niveaux affichés en texte et accessibles, pastilles lisses et cartes lisibles à 320 px. Lancement réel des travaux vérifié : débit des écus et chantier sauvegardé, niveau inchangé avant la fin. Validation commune de la série consignée ci-dessous, avec captures finales actualisées.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Auditer puis réutiliser les portraits illustrés des clients du pigeonnier, sans commencer ici.


## Série de dix — validation commune avant livraison

Demande utilisateur : « Étape — Peux-tu en enchaîner une dizaine ? ».
Dix missions successives, branches/PR empilées depuis main `de0d7cc` ; aucune
fusion ni publication pendant cette série. La version Sites 11 reste inchangée.
Les anciennes PR #1–#13 ont été examinées à la reprise et restent hors périmètre.
Aucune modification locale préalable ; aucune branche main utilisée pour travailler.

Les dix scénarios mobiles indépendants ont été rejoués sur le code final, à
320/390 px, DPR 2 : rangement/sortie de la cour, achat catalogue, sélection/états,
repères du plan, prévision non destructive, robe de la pipette, assemblage de cuves,
profil aromatique, notifications/mouvement réduit et lancement de travaux.
Le premier passage groupé a rencontré un timeout de navigation à 7 secondes sous
charge ; délai de navigation du support de test porté à 30 secondes, puis les
scénarios restants ont réussi. Délai des assertions inchangé. Fixture bâtiment
complétée avec les listes normales de vente et tolérance du tableau travaux absent ;
aucun correctif du moteur nécessaire. Captures de la série actualisées sur le code
final, plutôt que des maquettes.

Validation commune : six suites Node, smoke mobile, huit rendus et parcours
complet jusqu’au spiritueux vieilli/vente réussis. Reconstruction reproductible des
deux HTML par comparaison SHA-256 avant/après build, `node --check` et
`git diff --check` réussis. Diff nul sur les moteurs métier. Pas de test sur
Android physique ni Safari ; gestes chronométrés complets non rejoués localement.
CI GitHub confirmée réussie pour les missions 1–8 ; mission 9 encore en cours
au relevé. La CI du dernier commit sera à vérifier après son push.

Après la dixième mission, arrêt de la série. Prochaine proposition unique :
réutiliser les portraits illustrés des clients du pigeonnier, après audit des
branches historiques pour éviter toute recréation.


## Série autorisée — mission 09/10 : Animations : notifications et radar lisibles en mouvement réduit

Statut : terminée sur `work/serie-09-notifications`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Supprime le rendu en pas des notifications et conserve leur retrait normal à 3,3 s. En mouvement réduit, toast visible sans translation ni disparition immédiate et radar visible sans délai. Capture radar actualisée après constat du délai de animation. Test de notification déclenché par assemblage puis vraie erreur de finition, le déplacement normal ne produisant pas de toast.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les niveaux des bâtiments lisibles et vérifier le lancement des travaux.


## Série autorisée — mission 08/10 : Chai : profil aromatique sans libellés coupés

Statut : terminée sur `work/serie-08-profil`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute une marge au radar du chai sans changer les points ni son échelle. Tous les libellés sont contrôlés à intérieur du SVG. Le nom accessible donne les valeurs calculées sur 10, mises à jour avec la prévision.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Conserver les notifications lisibles en mouvement réduit et lisser leur entrée.


## Série autorisée — mission 07/10 : Chai : cuves attente lisibles et tactiles

Statut : terminée sur `work/serie-07-cuves`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes arrondies, sélection visuelle claire, libellés au moins 44 px et actions empilées à 320 px. Assemblage réel de deux cuves de 50 L testé : 100 L conservés, fûts inchangés. La simple sélection ne modifie pas les cuves.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Corriger les libellés coupés du profil aromatique du chai.


## Série autorisée — mission 06/10 : Chai : verre de pipette illustré et robe réelle

Statut : terminée sur `work/serie-06-verre-chai`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Remplace le carré de couleur de la fiche du fût par un verre lisse à reflets, avec un nom accessible en EBC. Le rendu reprend strictement la couleur calculée du lot ; son changement avec la prévision et la conservation du contenu sont vérifiés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les cuves attente et leur sélection confortables sur mobile.


## Série autorisée — mission 05/10 : Chai : distinguer la prévision du vieillissement réel

Statut : terminée sur `work/serie-05-prevision`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Bandeau de statut actuel ou projeté, relié au curseur et actualisé depuis la valeur de prévision existante. Valeurs réellement mises à jour ; lot en fût et calendrier strictement inchangés lors de la projection et du retour à zéro.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Remplacer le carré de robe par un verre de dégustation lisse.


## Série autorisée — mission 04/10 : Chai : repères lisibles pendant le défilement

Statut : terminée sur `work/serie-04-reperes-chai`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Repères de rangées fixes pendant le défilement horizontal, retour à la ligne sur petit écran, consigne de glissement et région du plan focalisable au clavier. Position des repères et focus vérifiés après défilement complet à dix travées.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Distinguer clairement prévision et vieillissement réel.


## Série autorisée — mission 03/10 : Chai : états des fûts et sélection accessibles

Statut : terminée sur `work/serie-03-etats-futs`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute aria-pressed sur les fûts du plan et de la cour et un nom complet dans la cour. Les badges Vide et En fût correspondent à la présence réelle du contenu. Changement de sélection et conservation intégrale du chai vérifiés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Conserver les repères du plan pendant le défilement mobile.


## Série autorisée — mission 02/10 : Catalogue : miniatures de fûts illustrées

Statut : terminée sur `work/serie-02-catalogue`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

SVG mutualisé dans une variable CSS, sans duplication ni image réseau. Miniatures agrandies ; vrai achat vérifié, fût sauvegardé et écus débités. Sélecteurs du test corrigés pour utiliser Fournisseurs puis Fûts.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/02-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/02-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre sélection et remplissage des fûts explicites.


## Série autorisée — mission 01/10 : Cour : fûts illustrés et rangement mobile vérifié

Statut : terminée sur `work/serie-01-cour`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Style partagé avec le plan, silhouette liée à la taille réelle, cible au moins 44 px. Rangement dans une case libre et retour dans la cour vérifiés par les vrais boutons et sauvegardes. Le support de QA réutilise des fixtures synthétiques issues du moteur ; ces tests seront conservés par la CI.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/01-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/01-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Illustrer les miniatures de fûts du catalogue.


## 2026-11-10 — Synchronisation des missions récentes et du site

Autorisation : « Étape, mais avant je veux que tout soit bien à jour », après
la demande explicite de mise à jour de main. Une seule mission de synchronisation,
sans commencer les fûts de la cour. Branche `work/synchronisation-jeu` depuis
`b545d6e`. État local propre, fetch, PR ouvertes et version Sites contrôlés.

Branches #20 (dégustation), #21 (audit historique), #22 (Ulysse), #23 (Firmin)
et #25 (journal) réunies par merges sur cette branche. Conflits limités au workflow
et aux journaux : les trois tests ciblés et leurs captures sont tous conservés.
HTML reconstruits depuis les sources réunies. Anciennes chaînes #1–#13 non
fusionnées : elles contiennent des approches historiques et ne représentent pas
le plan courant. `.openai/hosting.json` restaure l’identité du site existant,
`appgprj_6ae768c368fc819193e73dfa24c45f27`, sortie statique `dist`.

Validation exécutée : build, six suites Node, smoke mobile, huit rendus,
`chai-plan.cjs`, `firmin-portrait.cjs`, `ulysse-entree.cjs` à 320/390 px et parcours
complet `parcours.cjs` réussis (brassage, vente, brouillis, repasse, aveugle,
dégustation, vieillissement et bouteille). Zéro exception JS observée par ces
contrôles, SVG embarqués et portrait décodés ; repli Firmin testé sans asset.
Captures réelles actualisées pour Firmin ; captures Ulysse et plan du chai conservées.
Tests Chromium système hors bac à sable pour le serveur local. Pas d’Android
physique/Safari ; les gestes chronométrés complets n’ont pas été rejoués localement.

Site observé avant synchronisation : version 10, commit source Sites
`daa36c8a3c843e143dc35870aac4b80cec46879a`, à une autre révision que main.
Publication confirmée : PR #26 fusionnée, main à
`7f648a954a38d5a0e561b2fea128639c9c2f0e92`. Version Sites **11**, commit source
Sites `e4aae3ba3164e76b309ca80d2d40f65e3df206bc`, déploiement
`appgdep_6af37976bdd08191ba4b0afa13d72d82` en état `succeeded`.
HTML testé et publié identiques par SHA-256 :
`236f3b77d4c495f2da6b9ab6b73776e0541450b4a36d9e181e96a635b2a1c2a2`.
Accès et adresse conservés :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Le helper Sites indiqué par le skill n’était pas installé ; synchronisation Git
avec credential temporaire transmis uniquement sur stdin, puis archive de sortie
`.openai/hosting.json` + `dist/`, sauvegarde et déploiement natifs Sites confirmés.
Le présent complément est documentaire ; le code publié reste identique. Aucun changement de format de sauvegarde.

Prochaine mission non commencée : illustrer les fûts de la cour et tester leur
rangement. Aucun autre développement graphique dans cette synchronisation.


## 2026-11-10 — Intégration du plan du chai dans main

Autorisation utilisateur : « Étape (push en main avant) Et redonne moi l'accès ».
Périmètre retenu : intégration de la dernière mission #24, sans fusion des autres
PR et sans commencer la cour de la tonnellerie. État local propre avant reprise.

CI du commit `0ec885e318f3b22d9ebf6a82d61a3725cd0af018` vérifiée réussie :
https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42889443045
PR #24 ouverte, fusionnable et head vérifié avant fusion. Fusion autorisée via
GitHub avec SHA attendu : commit `b545d6e761d086ef730bd1ce8f729861d2a11211`.
Fetch puis historique distant confirment `origin/main` à ce commit.

Build, six suites Node et absence de diff des deux HTML reconstruits vérifiés
sur ce main intégré, depuis la branche documentaire `work/journal-integration-chai`.
Pas de changement de code ni nouvelle capture pour cette intégration ; preuves
graphiques existantes dans `docs/captures/chai-plan-320.png` et `chai-plan-390.png`.

Accès retrouvé via le project_id historique et l’outil Sites : site actif,
version publiée 10, droits `custom` inchangés :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
La fusion GitHub ne prouve pas un déploiement Sites ; aucune publication réalisée
pendant cette mission. Le lien donne accès à la version déjà publiée.

Prochaine mission non commencée : illustrer les fûts de la cour de la tonnellerie
et vérifier leur rangement. Aucun blocage à l’intégration #24.

## 2026-11-10 — Fûts illustrés du plan du chai

Statut : terminée sur `work/chai-futs-illustres`, créée depuis `origin/main`
`929fd430eb98929cd6b7d7580fd83f9b179f758b`. Fetch effectué ; état local propre
avant reprise, historique main et PR ouvertes examinés. #20–#23 et anciennes
chaînes #1–#13 restent ouvertes. Aucun travail repris sur Ulysse ou Firmin.

Mission : réutiliser le SVG `faceFut` de `codex/finition-3-pages:jeu/src/finitions.js`
dans le seul plan du chai. Source historique inspectée avant extraction, sans
réimporter les systèmes de finition de cette branche. SVG embarqué dans le CSS,
sans chemin réseau. Abréviations, âges et jauges existants conservés en HTML.
Les cases font au moins 44 px de large ; plan défilable horizontalement, y compris
à dix travées. Aucun moteur, règle ou format de sauvegarde modifié.

Fichiers : `jeu/src/style.css`, une propriété CSS `--travees` dans `jeu/src/jeu.js`,
les deux HTML reconstruits de `dist/`, `jeu/tests/chai-plan.cjs`, workflow CI,
présent journal et `docs/captures/chai-plan-320.png`, `chai-plan-390.png`.

Validation : build et six suites Node réussis. Test Chromium dédié à 320/390 px
sur le vrai HTML : SVG décodé, cibles au moins 44 px, défilement interne à dix
travées, aucun débordement du document, sélection du fût, déplacement réel de
la colonne 0 à 8, position conservée au rechargement ; points et brassins conservés.
Sauvegarde stable pendant les captures ; zéro erreur console/pageerror.
Captures réelles du plan ; capture 320 inspectée visuellement.
Commande : `CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/chai-plan.cjs`.
Tests existants `mobile.cjs` et `rendu.cjs` avec Chromium système via le
préchargement temporaire `/tmp/ignem-validation/chromium.cjs` ; serveur local
exécuté hors bac à sable. Premier essai bloqué par le tutoriel normal du chai :
test corrigé pour cliquer son bouton « Passer », puis tous contrôles réussis.
`node --check` et `git diff --check` contrôlés avant commit.
Android physique et Safari non disponibles ; vieillissement/remplissage d’un fût
non rejoués en navigateur dans cette mission graphique limitée au plan.

Prochaine mission proposée, non commencée : illustrer uniquement les fûts de la
cour de la tonnellerie en réutilisant le même dessin et en vérifiant leur rangement.

## 2026-11-10 — Portrait illustré de Firmin

Statut : terminée sur `work/firmin-portrait-illustre`, créée depuis `origin/main`
`929fd430eb98929cd6b7d7580fd83f9b179f758b`. État local propre avant reprise ;
fetch distant effectué, historique et liste des PR ouvertes consultés. #20,
#21 et #22 restent ouvertes. CI #22 encore en cours lors de cet audit (run
42887685000). Aucune fusion ni modification directe de main.

Mission : remplacer uniquement le portrait de Firmin, en réutilisant l’asset
`personnage-firmin.webp` et le cadrage de `codex/univers-illustre`, inspectés avant
intégration. Pas de génération d’image ni de système graphique parallèle.

Fichiers : `jeu/src/images/personnage-firmin.webp` (copie identique de l’asset
historique), `jeu/src/jeu.js` (portrait Canvas 144 × 144 et remplacement du portrait
déjà affiché après décodage), `dist/index.html`, `dist/artefact.html`,
`jeu/tests/firmin-portrait.cjs`, workflow de validation, deux captures réelles et
présent journal. Le portrait historique reste le repli si l’asset manque ou si le
dessin échoue. Aucun moteur ni format de sauvegarde modifié.

Critères vérifiés : vrai accès Ulysse depuis le domaine ; Firmin illustré décodé
à 144 px à 320/390 px, dialogue et bouton de tutoriel fonctionnels, aucun
débordement horizontal ni erreur console/pageerror, sauvegarde stable pendant
la capture. Sans asset : portrait historique 48 px et même dialogue opérationnel.
Captures : `docs/captures/firmin-portrait-320.png` et `firmin-portrait-390.png` ;
la capture 390 a été inspectée visuellement. Le flou Ulysse reste celui de main :
sa correction appartient à #22 et n’est pas dupliquée ici.

Validation : `npm run build:jeu` et six suites `npm run test:jeu` réussis.
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/firmin-portrait.cjs` réussi ;
tests existants `mobile.cjs` et `rendu.cjs` exécutés avec Chromium système via
préchargement temporaire. Premier contrôle de repli corrigé : le sprite historique
est déjà agrandi à 48 pixels, pas 16. `node --check jeu/src/jeu.js` et
`git diff --check` contrôlés avant commit. Tests navigateur hors bac à sable pour
permettre le serveur HTTP local. Android physique et Safari non disponibles.

Prochaine mission proposée, non commencée : remplacer uniquement les icônes de
fûts pixelisées du plan du chai par des dessins cohérents avec les illustrations,
après comparaison avec les branches historiques.

## 2026-11-10 — Finaliser la validation mobile de l’entrée Ulysse

Statut : terminée sur `work/ulysse-ecran-haute-densite`, PR #22 non fusionnée.

### Reprise vérifiée

- Clone neuf ; aucune modification locale préalable. `main` et `origin/main` :
  `929fd430eb98929cd6b7d7580fd83f9b179f758b` (PR #19 fusionnée).
- Branches distantes et PR ouvertes consultées. #20 (dégustation), #21 (audit)
  et #22 (netteté Ulysse) restent ouvertes. Historique #14–#19 intégré dans le code.
- Journal existant lu sur `origin/work/refonte-status-2026-11-10:REFONTE_STATUS.md`
  (PR #21, non fusionnée). Son prochain objectif Ulysse est déjà traité par #22 :
  aucune nouvelle implémentation graphique nécessaire.
- Diff #22 inspecté : résolution du canvas mesurée après application de la classe
  et du ratio ; HTML reconstruits ; assertion DPR. CI du commit
  `6828bfca19886ef23fe13abc0ac2908d0f737b8a` réussie :
  https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42877463091

### Mission et critères

Finaliser la preuve locale de #22, sur sa branche dédiée existante, sans refaire
la correction. Entrer par le bouton Ulysse du vrai domaine ; vérifier à 320/390 px
le renderer illustré, la résolution DPR 2, l’absence de débordement et d’erreur JS,
le bouton de lancement désactivé sans lot, et une sauvegarde stable pendant la
capture. Produire des captures du vrai `dist/index.html`.

### Modifications de cette intervention

- `jeu/tests/ulysse-entree.cjs` : contrôle indépendant et reproductible via une
  fixture ancienne synthétique, navigation réelle, contrôle console/pageerror,
  captures ; `CHROMIUM_PATH` facultatif pour Chromium système.
- `.github/workflows/validation-jeu.yml` : exécute ce contrôle et conserve ses captures.
- `docs/captures/ulysse-entree-320.png`, `ulysse-entree-390.png` : jeu réel.
- Présent journal complémentaire au journal d’audit de la PR #21.
- Aucun moteur, règle, format de sauvegarde ou asset source modifié.

### Vérifications exécutées

- `npm run build:jeu` : réussi ; aucun diff dans les deux HTML suivis.
- `npm run test:jeu` : six suites réussies, dont validation des ressources images.
- `node jeu/tests/rendu.cjs` et `node jeu/tests/mobile.cjs` : réussis avec un
  préchargement temporaire utilisant `/usr/bin/chromium` (Playwright disponible,
  son navigateur embarqué absent). Huit rendus, états non mutés, migration ancienne,
  sauvegarde immédiate à pagehide et navigation options vérifiés.
- `CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/ulysse-entree.cjs` : réussi.
  320 px : canvas 288 CSS / 576 bitmap ; 390 px : 358 CSS / 716 bitmap.
  DPR 2, renderer illustré actif, zéro erreur console/pageerror, aucun débordement,
  sauvegarde stable pendant les captures. Capture 390 inspectée visuellement.
- Les commandes navigateur nécessitent ici une exécution autorisée hors bac à
  sable : `listen EPERM` dans celui-ci. Première tentative de navigation de ce
  nouveau test corrigée : Ulysse s’ouvre depuis le domaine, pas depuis le menu.
- `git diff --check` : réussi avant sauvegarde.
- Android physique et Safari iOS non disponibles ; aucune validation annoncée.
  Les coupes manuelles et gestes chronométrés n’ont pas été rejoués localement
  pour cette mission de preuve de l’écran d’entrée.

### Prochaine mission — non commencée

Remplacer uniquement le portrait pixelisé de Firmin par un portrait illustré
cohérent avec Lise, après comparaison avec les branches historiques pour éviter
de refaire un asset déjà disponible. Ne fusionner aucune PR sans autorisation.
