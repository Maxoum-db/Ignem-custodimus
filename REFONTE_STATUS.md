# Refonte Prométhée — état vérifié

Dernière vérification : 2026-11-10
Dépôt : `Maxoum-db/Ignem-custodimus`
Branche de référence : `main`
Commit de `main` : `929fd430eb98929cd6b7d7580fd83f9b179f758b` — fusion de la PR #19.
Aucun changement de code ni fusion dans `main` pendant cette étape.

## État général

Le jeu reste le projet existant, assemblé depuis `jeu/src/` par `scripts/construire-jeu.mjs`. La clé de sauvegarde `ignem.v1` est conservée.

Le constructeur est lancé par `node scripts/construire-jeu.mjs` (alias npm : `npm run build:jeu`). `npm run test:jeu` exécute six suites Node. Les HTML autonomes suivis dans `dist/` sont contrôlés par la CI.

Le Chromium local n’est pas disponible dans cet espace. Pour la PR #20, le run GitHub Actions **42801588345** a réussi sur le commit `3efc5dcf509e2bc50226827578cb5f50f59822f9` : build, cohérence des HTML, six suites Node, tests mobile, rendu, domaine, carnet, recette et parcours de jeu. Ce run valide la branche de la PR construite au-dessus du `main` actuel ; ce n’est pas un run déclenché directement sur `main`.

## PR et branches réconciliées

| PR | État vérifié | Observation |
| --- | --- | --- |
| #1 à #13 | Ouvertes | Anciennes branches et chaînes de PR, plusieurs bases ne sont pas `main`. Les PR #2 et #3 sont encore en brouillon ; #3 dépend de #2. Leur statut ouvert prévaut, même si la réponse API de #3 contient un champ de commit de fusion incohérent. |
| #14 à #19 | Fusionnées | Validations du pipeline, des scènes de brasserie, de l’interface, d’Ulysse, de l’accueil et du carnet. |
| #20 | Ouverte, non fusionnée | Dégustation : verres du jury et des fractions. CI réussie sur son commit. |
| #21 | Ouverte, non fusionnée | Présent journal d’audit ; PR documentaire basée sur le `main` vérifié. |

Les branches historiques `carte-illustree` et `illustrations-scenes-a-f` existent encore et ne sont pas intégrées à `main` par les PR #2/#3. Les branches de travail des PR #14 à #20 sont également encore présentes. Ne pas réutiliser ou fusionner une branche ancienne sans comparer son contenu à `main`.

## Écrans et graphismes

Les statuts ci-dessous décrivent l’intégration rapportée par les PR fusionnées et les vérifications CI disponibles. Ils ne signifient pas que toute la refonte artistique est achevée.

| Écran | État |
| --- | --- |
| A. Empâtage | Intégré et testé dans la brasserie illustrée. |
| B. Filtration | Intégré et testé dans la brasserie illustrée. |
| C. Ébullition | Intégré et testé dans la brasserie illustrée. |
| D. Fermentation | Intégré et testé dans la brasserie illustrée. |
| E. Embouteillage | Intégré et testé dans la brasserie illustrée. |
| F. Ulysse | Gestes brouillis/repasse illustrés et testés ; l’écran d’entrée de distillerie montre encore Ulysse en pixel art dans la capture CI. |
| G. Chai | Fonctionnel dans le parcours ; finition graphique encore ouverte. Capture CI : icônes de fût et portrait de Firmin restent pixelisés. |
| H. Pigeonnier-boutique | Parcours de vente présent ; finition visuelle et listes en cours dans l’ancienne PR #13. |
| I. Dégustation | PR #20 ouverte ; CI réussie, intégration à `main` non faite. |
| J. Ingrédients | Fonctionnels ; finition des listes et pages encore proposée par #13. |
| K. Veillée | Présente dans le jeu ; finition visuelle non réconciliée. |
| L. Interface | Préparation et styles lissés intégrés par #16 ; finition globale non terminée. |
| M. Mentors | Portrait de Lise intégré ; le portrait de Firmin reste pixelisé sur les captures de résultats. |
| N–Q. Domaine | Accueil peint et quatre saisons intégrés par #18 ; animaux et personnages animés restent partiels. |
| R. Animations | Présentes par endroits ; harmonisation et finitions restent à poursuivre. |

### Carte d’accueil vérifiée

La PR #18 est fusionnée. Sa description documente le terrain peint, les bâtiments séparés, les quatre saisons, les six accès et les zones tactiles d’au moins 44 px. Le rucher est encore marqué « bientôt » ; le cheval n’a pas de marche articulée et Lise/Firmin ne se déplacent pas. Les captures de la PR montrent les états rapportés, mais une validation visuelle sur téléphone reste à faire.

## Vérification visuelle par captures CI

Artefact du run `42801588345`, captures mobile Chromium au viewport 390 × 844 (DPR 2), issues du vrai `dist/index.html` de la PR #20 : [artefact du jeu et des captures](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42801588345/artifacts/13755633468).

- Carte : illustration peinte affichée ; six accès visibles et libellés lisibles. Le rucher reste explicitement « bientôt ».
- Brasserie : empâtage, filtration, brouillis et embouteillage montrent les nouvelles scènes lisses dans le jeu.
- Dégustation : verres vectoriels de bière, eau-de-vie et spiritueux vieilli visibles ; les trois verres de l’exercice à l’aveugle restent distinguables et leurs commandes sont larges.
- Écart : l’écran d’entrée « Alambic Ulysse » reste pixelisé, même si ses écrans de gestes sont illustrés. Firmin est encore pixelisé dans les écrans de résultats et l’aperçu du chai.

Cette vérification porte sur les captures d’un navigateur en viewport mobile ; aucun appareil Android physique n’est connecté à cette session.

## Étape courante

- Numéro : 1 — vérification visuelle sur l’artefact mobile.
- Statut : terminée ; résultats visuels consignés sur la branche dédiée.
- Périmètre : captures du jeu généré, scènes réellement affichées, écarts visuels.
- Tests locaux : non exécutés, car ce workspace ne contient pas de clone du dépôt.
- Validation CI observée : run #20 réussi, avec build, six suites Node, rendu et parcours mobile.
- Blocages : pas de validation sur appareil Android physique dans cette session.

## Prochaine étape

Remplacer l’illustration pixelisée de l’écran d’entrée de distillerie par un visuel cohérent avec Ulysse, sans toucher au moteur ni aux scènes de gestes déjà illustrées.

## Historique

- 2026-11-10 — Audit du dépôt et des PR #1–#20 ; état de `main` relevé à `929fd430eb98929cd6b7d7580fd83f9b179f758b`.
- 2026-11-10 — CI de la PR #20 vérifiée : run `42801588345`, conclusion `success`.
- 2026-11-10 — Journal ajouté sur `work/refonte-status-2026-11-10` ; PR #21 ouverte, sans fusion.
- 2026-11-10 — Captures mobiles de l’artefact #20 inspectées ; écart pixelisé de l’écran d’entrée Ulysse documenté.
