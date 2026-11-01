# Phase 0 — le véritable jeu autonome comme référence

Audit et contrôles exécutés le 1er novembre 2026, avant la refonte graphique.

## Sources examinées

| Référence | Commit | État constaté |
| --- | --- | --- |
| `main` | `a1ecd70bb4df8a12a1f25902f266ce3f6c925bec` | V0.8.1, référence jouable construite et testée |
| `carte-illustree`, PR #2 | `9ec0574feeee1eaedfe819f35bd54f4e24a783dc` | PR ouverte en brouillon, base `main`, 3 fichiers, +40 lignes |
| `illustrations-scenes-a-f`, PR #3 | `7e761bb190a34b0a0a53e2b6a83d3e9960bdfaca` | PR ouverte en brouillon, base `carte-illustree`, 3 fichiers, +52/−1 lignes |

Le README, le constructeur, la page, les styles, l'interface et ses dépendances
métier ont été inspectés. Les cinq modules métier, `jeu.js`, les styles, les
données, le SQL et l'export sont identiques entre main et ces deux branches.
La branche de ce lot part de #3 ; aucune des PR n'a été fusionnée.

## Constats et réparations

- #2 intègre les WebP en data URLs et limite le poids source à 6 Mio, mais ne
  vérifie ni les en-têtes ni les dimensions. Les extensions majuscules sont
  ignorées silencieusement. Le nouveau module `scripts/images-jeu.mjs` valide
  l'enveloppe RIFF, les chunks et dimensions WebP (VP8, VP8L, VP8X), refuse les
  noms non conformes, liens, animations et dimensions excessives, et contrôle
  le budget avant d'allouer le fichier. Le décodage des pixels reste au navigateur.
- #3 prépare un chargeur sans aucun appel depuis `jeu.js`. Aucun asset n'est
  livré : les scènes du jeu restent rendues par le code historique. Le registre
  est désormais immuable en profondeur et inclut aussi les vrais Canvas des
  gestes brouillis/repasse. Chaque Canvas référencé est vérifié par un test.
- Le cache réutilise les chargements, prend en compte un changement de source,
  refuse les sources autres que les data URLs WebP du constructeur et expire
  après 8 secondes. Absence ou erreur d'image : résultat `null`. Une erreur de
  dessin restaure le contexte Canvas et retourne `false` pour permettre le repli.
- Les tests image sont isolés dans `npm run test:images`. Un workflow de PR
  exécute les cinq suites métier, ces tests et le build, puis propose le vrai
  `dist/index.html` comme artefact téléchargeable.

Le contrôle d'en-tête ne prouve ni la qualité du dessin ni la transparence
effective des pixels. Ces contrôles seront réalisés sur les illustrations.

## Vérifications exécutées

- `npm run test:jeu` : les cinq suites passent sur main puis sur ce lot.
- `npm run test:images` : validation des fichiers, limites, cache, erreurs,
  expiration, scènes absentes et restauration du contexte Canvas passent.
- `node scripts/construire-jeu.mjs` : main et ce lot construits avec succès.
  Livrables : `dist/index.html` et `dist/artefact.html`, environ 709 Kio après
  intégration des modules de présentation. Aucun WebP source livré.
- Les données compactées du HTML sont strictement identiques à celles de main :
  SHA-256 `8e8bdc308c723b07a7a55b04cfebe555c78a41818890f9e4c475bbc4faefed01`.
- `git diff origin/main --` sur les cinq moteurs, `jeu.js`, `style.css`, `data/`,
  `sql/` et l'export : aucune différence.
- Chromium + Playwright : 390 × 844, DPR 2, contexte mobile/tactile. Parcours du
  brassage avec temporisations réelles, maintiens de commandes, filtration au
  curseur et rinçage, jet de houblon, glycol/vapeur, sucre et embouteillage,
  dégustation, sauvegarde et rechargement ; puis distillation avec feu, registre
  d'air et coupes manuelles, mise en fût, un an d'élevage, sortie et mise en
  bouteille du spiritueux, conseil d'un client et vente effective. Carnet,
  veillée, fiches, bâtiments et options ouverts ensuite. Résultats enregistrés
  dans `resultats-mobile.json` : aucune erreur JS, aucun débordement horizontal
  du document ou de la scène aux points de capture.

Les captures originales et celles du lot se trouvent dans `captures/`.
`controle-presentation.py` complète le parcours par une comparaison avant/après
à mouvement réduit (captures identiques pixel pour pixel) et de vrais événements
Touch Chromium aux coordonnées du bouton Vapeur (maintien puis relâchement).
L'ouverture `file://` a été tentée, mais le Chromium fourni l'interdit avec
`ERR_BLOCKED_BY_ADMINISTRATOR` : ce test n'est donc pas validé. Les résultats
sont enregistrés séparément dans `resultats-presentation.json`.

## Sauvegardes utilisées

`main-v0.8.1.json` est une nouvelle partie de test préparée dans le vrai main :
100 L, 20 kg de Pilsner Soufflet Bio, Magnum et US-05. La recette est retrouvée
à l'identique après ouverture du nouveau build, puis le carnet est vérifié après
un brassin et un rechargement.

`legacy-avant-v0.8.json` est une fixture synthétique : un brassin terminé dans
main, avec ses boutons « Passer », puis suppression du champ `bat` pour exercer
la migration historique déjà présente. Le jeu rétablit les bâtiments d'une
ancienne partie et permet d'essayer Ulysse, le chai et la boutique. Un second
brassin est produit par l'interface pour conserver du stock à vendre.

Ces fixtures ne sont pas les données d'un joueur. Aucune vraie sauvegarde
personnelle n'était accessible. Aucun changement de clé, format ou migration
n'a été apporté au jeu ; `localStorage["ignem.v1"]` reste inchangé.

## Reproduire

```sh
npm run test:jeu
npm run test:images
node scripts/construire-jeu.mjs
python -m http.server 8000
```

Dans un second terminal, avec Python Playwright et Chromium installés :

```sh
python qa/parcours-mobile.py
```

Pour recréer les fixtures et comparer les images, construire main dans un
worktree séparé, conserver son HTML, puis lancer :

```sh
python qa/parcours-mobile.py --reference /chemin/vers/main-index.html
python qa/controle-presentation.py --reference /chemin/vers/main-index.html
```

Le parcours utilise les boutons existants, sans horloge accélérée ni accès aux
variables internes du jeu. Le second brassin destiné au stock utilise les
boutons « Passer » après le parcours complet des cinq gestes.

## Limites et suite

Ce lot valide le socle et conserve volontairement son apparence d'origine.
La refonte A–R reste à réaliser. Le contrat et la liste précise des assets
manquants sont dans `jeu/src/images/README.md`. Aucun dessin final n'a été généré
ou intégré dans cette phase. Le DPR des futurs dessins illustrés, leurs couches,
ancrages, animations, chargements hors écran et le respect du mouvement réduit
devront être vérifiés lors de leur intégration.

Les tests sont une émulation Chromium sur Linux, pas un essai sur un Android
physique. Safari/iOS, gestes à plusieurs doigts, interruptions de session,
parcours expert complet, tous les dry hops et toutes les recettes n'ont pas été
parcourus manuellement. Les suites métier couvrent notamment le double dry hop,
les calculs expert, les recettes de référence, les coupes et le vieillissement.
L'objectif de chargement inférieur à 3 secondes en réseau mobile réel n'a pas
été mesuré ; un temps de démarrage local n'est pas un résultat réseau mobile.

L'aperçu hébergé utilise le `dist/` de ce dépôt et le même gameplay. Son origine
web est différente de l'hébergement habituel : sa sauvegarde locale est donc
distincte. L'ancienne partie du joueur reste sur son origine habituelle.
