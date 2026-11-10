# Progression Codex

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
