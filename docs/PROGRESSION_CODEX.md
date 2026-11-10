# Progression Codex

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
