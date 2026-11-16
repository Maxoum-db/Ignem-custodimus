# Audit du reste à faire — 11 novembre 2026

Référence auditée : `41ab2b952c685be73fbae664160d89eccfd93440` sur GitHub main.
Audit ciblé du jeu mobile et de sa livraison, sans correction du jeu ni déploiement.

## Suivi après la série de vingt — 16 novembre 2026

Les constats et propositions plus anciens ci-dessous sont historiques.
Les corrections suivantes sont réalisées et testées dans la pile de branches,
**sans fusion dans main ni publication** :

- H01 : PR #81, oubli à zéro minute ; CI 43942026294 réussie.
- H02 : [PR #82](https://github.com/Maxoum-db/Ignem-custodimus/pull/82),
  dose affichée égale à l’ajout aux trois niveaux de brasserie.
- H03 : [PR #83](https://github.com/Maxoum-db/Ignem-custodimus/pull/83),
  décompte jusqu’à zéro après le dernier ajout.
- U01 : [PR #84](https://github.com/Maxoum-db/Ignem-custodimus/pull/84),
  commandes des réglages Ulysse de 48/44 px.
- U02 : [PR #85](https://github.com/Maxoum-db/Ignem-custodimus/pull/85),
  mentor défilant, actions de 48 px et menu accessible sur écran court.

Ne pas recommencer ces corrections : consulter leurs branches et le
[dossier de revue des vingt étapes](SERIE_20_REVUE.md). La publication reste
à faire après intégration autorisée. La prochaine mission proposée est la
revue et l’intégration de la pile, pas une nouvelle correction H02.

## Suivi H01 — 16 novembre 2026

Correction réalisée sur la branche `work/houblon-oubli-zero`, proposée en PR,
**pas encore fusionnée dans main** au moment de cette livraison. Un ajout
oublié contribue désormais pour zéro à la précision ; un ajout réellement
lancé à 0 minute peut conserver 100 %. Le bilan, le bouton désactivé et les
repères distinguent les oublis des ajouts faits. Les récompenses de précision
ne sont plus attribuées à un oubli. Aucun moteur ni format de sauvegarde changé.

Validation : 16 scénarios dédiés en 320/390 px, expert/débutant, avec oubli,
ajout manuel, cas mixte et dry hop seul ; huit scénarios existants de préparation
cinq secondes, six suites Node et un parcours avec gestes réels réussis.
Les preuves historiques et le tableau ci-dessous concernent toujours la
référence auditée 41ab2b9 et sont conservés pour comparaison. Les autres lignes
restent à traiter. Prochaine correction proposée : H02, libellés des doses.

## État réellement vérifié

- Dépôt initial propre ; PR #78 et #79 fusionnées. Les 19 missions du lot et
  l’approche de cinq secondes avant le premier houblon sont dans main.
- Les 65 branches distantes `origin/work/*` présentes lors du contrôle sont
  ancêtres de main : aucun de ces travaux ne reste à pousser.
- 56 PR sont encore ouvertes. Les 13 PR historiques #1–#13 sont des prototypes
  ou anciennes chaînes ; les autres PR empilées ne constituent pas 43 tâches
  nouvelles à refaire. Les branches historiques non intégrées sont conservées.
- Build local reproductible et six suites Node réussis. Le code du jeu est
  identique au code validé par la [CI 43083739020](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43083739020).
  Cette CI est réussie, avec parcours standard, gestes réels et Ulysse dans les
  deux modes. Cela ne couvre pas tous les cas limites découverts ci-dessous.

## Priorités confirmées

P1 = à traiter en premier ; P2 = correction ou ergonomie suivante.
Chaque ligne peut devenir une mission autonome ; aucune n’est commencée ici.

| ID | Priorité | Reste à faire | Preuve réelle | Critère de réussite |
| --- | --- | --- | --- | --- |
| H01 | P1 | Clarifier/corriger un ajout oublié à 0 minute | Un brassin avec un seul ajout prévu à 0 min reçoit **100 % sans aucun toucher sur Jeter** et +13 écus dans la fixture ; le repère reste non fait et le bouton reste « Jeter Saaz » désactivé. Reproduit en 320/390 px. | L’ajout de fin, son absence éventuelle, le score, les récompenses et l’état visuel suivent une règle explicite et cohérente, testée avec et sans action. |
| L01 | P1 livraison | Publier le main actuel sur le site existant | Sites confirme la version 12, déploiement réussi du 11/11 à 17:40 UTC. Ses sources correspondent à l’ancien main 43ab1df, pas au main audité. | Version jouable issue du main choisi, même URL et mêmes accès, déploiement effectivement réussi. |
| H02 | P2 | Afficher la dose de houblon réellement ajoutée | Le texte et le nom accessible annoncent +250 g ; l’action ajoute **30 g pour 100 L** et **130 g pour 500 L**. | Texte, nom accessible et quantité ajoutée correspondent au même calcul pour 100/500/1000 L. |
| H03 | P2 | Continuer le compteur après le dernier ajout | Avec un unique ajout à 60 min lancé au début, le curseur finit à 100 % et le bilan s’affiche, mais le compteur indique encore **60 minutes restantes**. | Compteur actualisé jusqu’à zéro, même quand tous les houblons sont déjà jetés ; précision inchangée. |
| U01 | P2 | Agrandir les contrôles de réglage d’Ulysse | Les cinq bascules mesurent **35,1875 px** de haut ; les deux curseurs de coupe **28 px**. Mesures DOM aux deux largeurs. | Cibles d’au moins 44 px, valeurs et persistance conservées, aucun débordement mobile. |
| U02 | P2 | Agrandir les actions du mentor | « Passer le tutoriel » mesure **36 px** de haut dans le dialogue de Lise. | Cible d’au moins 44 px, dialogue lisible sur écran court, visite et fermeture fonctionnelles. |
| Q01 | Validation restante | Essais sur appareils et navigateurs réels | Cette session dispose de Chromium et de vues mobiles simulées ; aucun Android physique ni Safari/iPhone n’a été testé. | Rejouer sauvegarde/rechargement, gestes maintenus, houblonnage, navigation et achat sur les plateformes visées. |

### Détails de reproduction et causes

**H01 — ajout à 0 minute.** Créer une recette avec un seul houblon à 0 min,
lancer le brassin, passer empâtage/filtration, allumer le feu et attendre la fin
sans jeter. La boucle de fin de `preparerEbullition()` affecte 0 aux ajouts
oubliés et pousse leur minute prévue comme écart. Pour un ajout prévu à 0,
l’écart devient donc 0. Voir [jeu.js](../jeu/src/jeu.js#L1751).
Ce comportement et celui de H03 existaient déjà dans le main précédent
`39778b2` ; l’approche de cinq secondes ne les a pas introduits.

**H02 — doses.** `doseHop()` adapte déjà la quantité au volume, mais le bouton
conserve une chaîne fixe dans [jeu.js](../jeu/src/jeu.js#L913).
Le calcul ne doit pas être changé pour faire correspondre l’affichage.

**H03 — compteur.** La mise à jour de `#ebu-infos` est conditionnée au nombre
d’ajouts restant à faire, dans [jeu.js](../jeu/src/jeu.js#L1747).
Le temps d’ébullition continue pourtant après le dernier ajout.

**U01/U02 — cibles.** Les mesures viennent du rendu réel, pas seulement des
valeurs CSS déclarées : [mesures JSON](audit/mesures-runtime.json).
Les portraits illustrés des mentors et l’entrée haute densité d’Ulysse sont
par ailleurs déjà intégrés ; ne pas les recréer pour traiter ces cibles.

## Publication vérifiée séparément de GitHub

- Projet Sites : `appgprj_6ae768c368fc819193e73dfa24c45f27`.
- URL : https://promethee-ignem-custodimus.maximilien92.chatgpt.site
- Version sauvegardée et déployée : **12** ; source Sites
  `9dc6b243987ae16e53cbc3062af9561aa7549925`.
- Déploiement : `appgdep_6af4a86d84a881919fd170c092d54288`, statut
  `succeeded`, confirmé par lecture native pendant cet audit.
- SHA-256 HTML de la source version 12 :
  `6cd7ed5b361c6dd9f1048ff0323ae2b4d440a3720b2a5a9d308ae046cb06665a`.
  Il correspond au HTML de 43ab1df.
- SHA-256 HTML du main audité :
  `08b7f499be176e600191764b1f5fdfa40c0d58b497f9b53ecde5bd9cd0545932`.

Publier est donc une tâche réelle restante ; un push GitHub ne l’a pas effectuée.
Aucun accès ni déploiement n’est modifié par cet audit.

## Harmonisation à examiner, sans défaut fonctionnel affirmé

Ces sujets sont des revues futures, pas des corrections déjà démontrées :

- Panneaux de dégustation, médailles, défauts et succès : vérifier la cohérence
  avec les cartes récentes. Les verres du jury et les bouteilles du carnet sont
  déjà illustrés et ne doivent pas être refaits.
- Petits animaux du domaine : dessins procéduraux lisses présents, assets
  cartoon historiques disponibles. Évaluer le bénéfice avant remplacement.
- PR historiques : distinguer ce qui est obsolète, réutilisable ou déjà présent
  autrement. Aucune fusion globale, fermeture ou suppression effectuée ici.

## Ce qui est déjà fait

Les fiches, la recherche, les options, les fournisseurs, les cartes d’ingrédients,
les quantités, le procédé, les sels, le choix de style, le plan de Lise, les
repères de conformité, les tutoriels, les bulles d’aide, le menu, le matériel et
la composition des malts sont intégrés. Les bâtiments et leurs niveaux avaient
déjà été traités dans 0607f21. Le chai et le pigeonnier ont leurs missions
illustrées et tactiles intégrées. La préparation du premier houblon avance
maintenant pendant cinq secondes et son 100 % a été testé.

Le nombre historique « 50 » n’est pas un backlog défini : ne pas déduire un
nombre fixe de chantiers manquants des compteurs de missions ou de PR ouvertes.

## Preuves et reprise

- [Ajout à 0 minute oublié, bilan 100 %](captures/audit-restant/houblon-0-390.png).
- [Compteur figé en fin d’ébullition](captures/audit-restant/houblon-60-390.png).
- [Réglages d’Ulysse](captures/audit-restant/ulysse-390.png).
- Captures correspondantes en 320 px dans le même dossier.
- [Sonde reproductible](audit/verifier-restant.cjs) : fixtures isolées dans le
  navigateur, véritables interactions du jeu, horloge pilotée pour les deux cas
  de houblonnage ; aucun appel aux fonctions privées de simulation.

```sh
npm run build:jeu
npm run test:jeu
CHROMIUM_PATH=/usr/bin/chromium node docs/audit/verifier-restant.cjs
```

La sonde rapporte des observations ; elle n’exige pas que les bugs restent
présents. Son exécution sans exception ne signifie pas que le jeu est exempt
de ces défauts. Les captures sont réelles ; aucun écran de jeu n’a été modifié
pour créer les preuves. Aucune correction du produit n’est comprise ici.

Prochaine mission de développement proposée : **H01, notation et état d’un
ajout oublié à 0 minute**, avant une nouvelle publication pour revue commune.
