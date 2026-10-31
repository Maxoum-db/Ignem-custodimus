# Prométhée : Ignem custodimus

Jeu de laboratoire brasserie et distillerie, nourri par le savoir technique du Hub Prométhée.

## Le jeu (V0.1 : brasserie)

| Dossier | Contenu |
|---|---|
| `jeu/src/moteur.js` | Chimie du brassage : densité, atténuation selon le palier, Tinseth, Morey, pH (Kolbach), styles, défauts, fiche de jury BJCP |
| `jeu/src/jeu.js` | Interface : domaine, brasserie, 3 gestes, dégustation, carnet, fiches, options |
| `jeu/src/page.html`, `style.css` | Page et styles |
| `jeu/tests/moteur.test.mjs` | Recettes de référence (pils, IPA, dry stout, weizen, recette ratée) |
| `dist/index.html` | Jeu complet en une page, prêt à héberger |

```bash
npm run test:jeu    # teste le moteur
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
