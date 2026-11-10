# Progression Codex

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
