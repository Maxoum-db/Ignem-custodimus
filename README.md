# Prométhée : Ignem custodimus

Jeu de laboratoire brasserie et distillerie, nourri par le savoir technique du Hub Prométhée.

## Publication depuis GitHub

**Jouer : https://maxoum-db.github.io/Ignem-custodimus/**

Le déploiement GitHub Pages est défini dans `.github/workflows/pages.yml`.
Il construit et teste le jeu puis publie uniquement `dist` depuis `main`, sans
jeton personnel. Le jeu et le dépôt sont publics, conformément à l’option gratuite choisie.

[Activation Pages, publication et transfert des sauvegardes](docs/HEBERGEMENT_GITHUB.md).
Le changement d’adresse ne récupère pas automatiquement la partie de ChatGPT Sites.

## Le jeu (V0.8 : brasserie, alambic Ulysse, chai, pigeonnier, école, calendrier, recherche)

| Dossier | Contenu |
|---|---|
| `jeu/src/moteur.js` | Chimie du brassage : densité, atténuation selon le palier, Tinseth, Morey, pH (Kolbach), styles, défauts, fiche de jury BJCP |
| `jeu/src/distillerie.js` | Distillation : équilibre liquide-vapeur, Rayleigh pas à pas, reflux selon la chauffe, 9 congénères, cuivre, coupes, épaisses, notation de l'eau-de-vie |
| `jeu/src/chai.js` | Élevage : 7 fûts × 3 tailles, extraction (rapide qui s'épuise + hydrolyse lente), soufre adsorbé, oxydation et esters, rancio, part des anges et degré selon la rangée, finitions, assemblage, jury sur 50, dénomination (UE 2019/787) |
| `jeu/src/ecole.js` | 10 leçons (théorie, défi vérifié par le moteur, 3 questions) qui offrent recettes, ingrédients et fûts |
| `jeu/src/vente.js` | Calendrier (52 semaines, saisons, cave), clients et leurs demandes, satisfaction, prix, réputation, commandes, fraîcheur |
| `jeu/src/jeu.js` | Interface : domaine, brasserie, 3 gestes, Ulysse, chai en casse-tête, recherche, dégustation, carnet, fiches, options |
| `jeu/src/page.html`, `style.css` | Page et styles |
| `jeu/tests/moteur.test.mjs` | Recettes de référence (pils, IPA, dry stout, weizen, recette ratée) |
| `jeu/tests/distillerie.test.mjs` | Distillation d'une IPA avec différentes coupes |
| `jeu/tests/ecole.test.mjs` | Double dry hop (biotransformation, hop creep, végétal) et cohérence des leçons |
| `jeu/tests/vente.test.mjs` | Saisons, fraîcheur, satisfaction, prix et demande saisonnière |
| `jeu/tests/chai.test.mjs` | Vieillissement d'un cœur de wash : anges, climat, fûts, finition, assemblage, whisky ou non |
| `dist/index.html` | Jeu complet en une page, prêt à héberger |

### Ce que le jeu tire des données du Hub

| Famille | Nombre | Usage dans le jeu |
|---|---|---|
| Céréales, sucres et miel | 128 | Brassage, gélatinisation des grains crus, bêta-glucanes |
| Houblons | 45 | Tinseth, huiles (myrcène, humulène, caryophyllène) pour les notes |
| Levures | 108 | Dont 16 de distillerie pour les washs |
| Aromates | 40 | Fruits, épices, botaniques, bois ; passent aussi à l'alambic |
| Sels et acide | 7 | Ions de l'eau, pH, rapport sulfates/chlorures |
| Auxiliaires | 23 | Nutriments, clarifiants, enzymes, hygiène |
| Recettes | 205 sur 302 | Grimoire, ramenées à 1000 L (celles dont les ingrédients se rattachent) |
| Questions | 128 | Veillée quotidienne, tirées des cartes de formation techniques |

### Le chai

Les fûts se rangent sur trois rangées (haut chaud et sec, milieu, bas frais et humide) : un quartaut prend une case, une barrique deux, un demi-muid trois. Le chai s'agrandit de 6 à 10 travées contre des écus. Le temps se règle au curseur (0 à 15 ans, finitions de 0 à 3 ans) avec aperçu en direct : couleur, volume, degré, part des anges, profil, notes à la pipette, conseil de Firmin. Paramètres du Hub utilisés : part des anges 3 %/an, maturation de référence 36 mois, mise en bouteille à 45 %, bouteilles de 0,7 L.

### Domaine à bâtir

Une nouvelle partie commence avec une brasserie pilote de 100 L et un colombier. Le reste s'achète par niveaux, contre des écus et une réputation minimale, avec des semaines de travaux : brasserie 500 L puis 1000 L, alambic Ulysse puis Ulysse rénové (cuivre neuf, soufre mieux retenu), cave voûtée puis chai à trois niveaux, boutique puis salle de dégustation (plus de clients, prix +10 %, commandes spéciales). Les terrains à bâtir et les chantiers se voient sur la carte. Les parties en cours gardent tout ce qu'elles avaient.

Matériel : vanne vapeur proportionnelle (moins d'inertie), faux fond à fentes (lit qui se tasse moins), sonde de cave (enveloppe plus réactive), bouteilles épaisses (4,6 volumes), grille de foyer (bûches qui prennent plus vite). Chaque geste a des objectifs bonus (3 écus, 10 de plus la première fois) et une difficulté qui monte avec la maîtrise (aléas plus fréquents, fenêtres plus serrées, tolérance réduite).

### Cinq gestes de brassage

Empâtage (vapeur à inertie), filtration (robinet de soutirage et rinçage : niveau d'eau sur le lit, tassement, colmatage et râteau, arrêt vers 1,010 ; le rendement et les tanins en dépendent), ébullition (houblons au bon moment), fermentation (glycol et vapeur, dry hops à déclencher dans leur fenêtre : J1,5–J3,2 pour la biotransformation, J4,2–J6), mise en bouteille (sucre de refermentation selon le CO₂ déjà dissous et la carbonatation du style ; bière plate, trop gazeuse, bouteilles qui éclatent au-delà de 4 volumes).

### Calendrier et vente

Une semaine passe à chaque brassin et chaque distillation ; au chai, on peut laisser passer 1 mois, 6 mois ou 1 an. Les fûts vieillissent au rythme du calendrier (le curseur ne sert plus qu'à prévoir). Les saisons changent la cave de fermentation (12 °C l'hiver, 22 °C l'été), la demande des clients et le prix du houblon à la récolte (−30 % l'automne).

Au pigeonnier, onglet Clients : chaque semaine, des clients décrivent ce qu'ils cherchent ; on leur conseille une bouteille du stock réel (1000 L par brassin, bouteilles d'eau-de-vie et de spiritueux vieillis). Satisfaction (critères, note du jury, fraîcheur) → prix, pourboire, réputation. La réputation fait venir restaurateurs, cavistes, amateurs exigeants et commandes spéciales à livrer avant échéance. Le négociant reprend le vrac à bas prix.

### École de la veillée

Dix leçons, de l'empâtage au chai, données par Lise puis Firmin : un peu de chimie, un défi réel (brassin, distillation ou mise en bouteille, vérifié par le moteur) et trois questions. Une leçon réussie offre jusqu'à quatre recettes du style au grimoire, parfois un ingrédient ou un fût, et des écus. Le pigeonnier vend toujours les recettes. Le défi en cours s'affiche en haut de la brasserie.

### Double dry hop

Chaque houblon peut aller au DH J2 (fermentation active : biotransformation, fruité en plus, 20 % d'huiles emportées par le CO₂) ou au DH J5 (arôme frais). Le total à cru relance la fermentation (hop creep, jusqu'à +3 points d'atténuation, diacétyle sans repos) ; au-delà de 18 g/L, défaut végétal.

### Gestes de chauffe

Empâtage à la vapeur avec inertie (vanne progressive, double enveloppe qui garde la chaleur, pression de chaudière), fermentation pilotée par deux boutons (glycol à gauche, vapeur à droite), feu de bois d'Ulysse avec bûches à allumage différé et registre d'air. Les aléas (courant d'air, coup de fourquet, bûche humide, rafale, moussage, coup de feu) se voient d'abord dans le dessin, avec une courte légende. Chaque atelier a une carte de tutoriel au premier passage ; les textes d'aide sont rangés dans des bulles « i ».

### Recherche

La loupe de l'en-tête cherche partout : céréales, houblons (avec leurs styles), levures, aromates, sels, auxiliaires, fûts, recettes et fiches. Sans accents ni pluriels, tous les mots doivent correspondre, avec des mots-clés élargis (« agrumes » trouve citron, yuzu, pamplemousse…). Filtres par famille et par état, tri par pertinence, nom, rareté, EBC, alpha ou atténuation, et ajout direct à la cuve.

### Déblocages

Les écus se gagnent au jury, à l'alambic et à la veillée. Ils s'échangent au pigeonnier contre des ingrédients (8 à 60 écus selon la rareté) ou des recettes (10 écus). Le niveau de maîtrise, en points, limite la rareté accessible. Les découvertes offrent des ingrédients après certains exploits, et chaque bière médaillée ajoute une recette au grimoire.

```bash
npm run test:jeu    # teste les moteurs de brassage et de distillation
npm run build:jeu   # reconstruit dist/ depuis data/ et jeu/src/
```

La partie est enregistrée sur le téléphone (stockage du navigateur). Le jeu ne lit que `data/`, jamais la base du Hub.

## Règle d'or : le jeu ne touche jamais au Hub

| Élément | Hub Prométhée | Ignem custodimus |
|---|---|---|
| Repo | `hub-promethee` | ce repo, séparé |
| Hébergement | projet Vercel du Hub | projet Vercel distinct |
| Base de données | « Prométhée Project » | **aucun accès direct** |
| Données | source de vérité | copie JSON dans `data/`, en lecture seule |
| Sauvegardes de partie | — | sur le téléphone du joueur |

Le seul pont entre les deux est le script `scripts/export-donnees.mjs`. Il se connecte avec le rôle `jeu_export_lecteur`, qui ne voit que des vues filtrées du schéma `jeu_export`. Ce rôle n'a aucun droit sur les tables du Hub ni sur celles de l'app Couanac.

## Ce qui sort, ce qui ne sort jamais

| Exporté | Jamais exporté |
|---|---|
| Malts, houblons, levures, sels, sucres, adjuvants | Tables `perso_*`, `shared_*`, `phase1_*`, `auth.*` |
| Fiches de théorie (congénères, cuivre, élevage, formules) | Paramètres financiers, familiaux et patrimoniaux |
| Recettes (sans journaux de brassage ni notes libres) | Journaux, notes, planning, état de révision |
| Quiz et modules de formation **techniques** | Modules projet, juridique, finance, social |
| ~35 paramètres techniques en liste blanche | Toute autre clé de `hub_promethee_params` |

En plus des vues filtrées, le script bloque l'export si un fichier contient une clé de paramètre personnel, une notion patrimoniale, une adresse e-mail ou un numéro de téléphone. Il n'écrit alors rien.

## Mise en place (une seule fois)

1. **Créer ce repo** sur GitHub, en privé, avec ces fichiers.
2. **Relire puis exécuter** `sql/001_export_jeu.sql` dans l'éditeur SQL de Supabase.
3. **Définir le mot de passe** du rôle, dans une requête séparée qui n'est enregistrée nulle part :
   ```sql
   alter role jeu_export_lecteur with password 'un-mot-de-passe-long-et-unique';
   ```
4. **Vérifier les droits** : la requête de contrôle en bas du fichier SQL ne doit lister que des objets `jeu_export`.
5. **Construire l'adresse de connexion** : dans Supabase, bouton *Connect* > *Session pooler*, copier l'adresse, puis remplacer l'utilisateur `postgres.cyosmecbmjgmsdvhcmjk` par `jeu_export_lecteur.cyosmecbmjgmsdvhcmjk` et le mot de passe par celui de l'étape 3.
6. **Ajouter le secret** dans ce repo : *Settings* > *Secrets and variables* > *Actions* > `JEU_EXPORT_DB_URL`.
7. **Lancer l'export** : onglet *Actions* > *Export des données du Hub* > *Run workflow*.
8. **Relire `data/`** au premier export avant de s'en servir.

## En cas de problème

Tout annuler côté base : exécuter `sql/999_annulation.sql`. Le schéma `jeu_export` et le rôle disparaissent. Les tables du Hub ne sont pas touchées.

Couper l'accès sans rien supprimer : supprimer le secret `JEU_EXPORT_DB_URL` du repo, ou changer le mot de passe du rôle.

## Contrat de données (version 1)

Chaque fichier de `data/` a la forme `{ version_contrat, exporte_le, nb, donnees }`. Unités : grammes, kilogrammes, litres, °C, EBC, °Lintner. `_index.json` récapitule le nombre d'éléments par fichier.

| Fichier | Contenu |
|---|---|
| `malts.json` | Malts, adjuvants, sucres : EBC, rendement %, pouvoir diastasique, % max |
| `houblons.json` | Alpha, bêta, cohumulone, huiles, arômes, usage |
| `levures.json` | Atténuation, plage de °C, tolérance alcool, floculation, profil |
| `eau.json` | Sels et profils d'eau |
| `styles.json` | Fiches de styles de bière et de whisky |
| `fiches.json` | Théorie : brassage, fermentation, distillation, élevage, sensoriel |
| `recettes.json` | Recettes de bière, spiritueux, whisky |
| `quiz.json` | Decks et cartes question-réponse |
| `formation.json` | Phases et modules techniques |
| `reperes.json` | Repères chiffrés |
| `economie.json` | Coûts fixes et variables par lot |
| `parametres.json` | Paramètres techniques en liste blanche |


## Carte illustrée (chantier en cours)

La branche `carte-illustree` prépare la migration progressive des scènes pixel-art vers des illustrations WebP sans modifier la logique du jeu.

- Déposer les illustrations détourées dans `jeu/src/images/`, avec des noms en minuscules, chiffres, tirets ou underscores et l'extension `.webp`.
- Lancer `node scripts/construire-jeu.mjs` : le constructeur intègre automatiquement les fichiers dans `dist/index.html` et `dist/artefact.html` sous `window.IMAGES_JEU` (clés sans extension).
- Le budget total des WebP source est limité à **6 Mio**. Le build échoue explicitement en cas de dépassement ou de nom invalide.
- Si le dossier n'existe pas ou ne contient pas d'images, `window.IMAGES_JEU` vaut `{}` et le jeu actuel continue de fonctionner.
- Les prochaines étapes remplaceront les dessins de présentation un écran à la fois, sans modifier les moteurs métier ni la sauvegarde `ignem.v1`.

**Validation attendue avant fusion :** `node scripts/construire-jeu.mjs`, `npm run test:jeu`, puis parcours manuel mobile à 390 × 844 et vérification d'une ancienne sauvegarde. Cette préparation n'inclut pas encore les illustrations finales.

