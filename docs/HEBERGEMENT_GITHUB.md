# Hébergement du jeu sur GitHub Pages

Objectif : publier le jeu depuis ce dépôt, sans dépendre de ChatGPT Sites.
Le joueur a demandé un lien public ; le dépôt conserve sa visibilité privée.
Aucun compte de joueur, backend ou secret supplémentaire n’est ajouté.

## Activer Pages une seule fois

Dans le dépôt GitHub : **Settings → Pages → Build and deployment → Source :
GitHub Actions**. L’intégration utilisée ici n’a pas accès à ce réglage :
l’API Pages retourne HTTP 403 « Resource not accessible by integration ».
Le dépôt indique initialement `has_pages: false`.

GitHub peut exiger un abonnement compatible pour Pages depuis un dépôt privé.
Si c’est le cas, ne pas rendre le dépôt public par défaut : le joueur a demandé
que seul le jeu soit public. Aucun achat ni changement de visibilité automatique.

## Déployer

Le workflow `.github/workflows/pages.yml` :

1. Reconstruit `dist` avec Node 22 et `npm run build:jeu`.
2. Vérifie que les HTML livrés correspondent aux sources.
3. Exécute les six suites Node et le test mobile du chemin de projet.
4. Envoie uniquement `dist` comme artefact GitHub Pages.
5. Publie depuis main avec les droits temporaires `pages: write` et
   `id-token: write` du job GitHub Actions. Aucun jeton personnel à copier.

Une PR vérifie le build et le navigateur mais ne déploie pas. Un push sur main
qui touche le jeu, ses données, le constructeur ou ce workflow déclenche la
publication. Le workflow peut aussi être lancé manuellement depuis Actions,
**Publier le jeu sur GitHub Pages → Run workflow**, branche main.
Une seule publication principale peut s’exécuter à la fois.

L’adresse attendue est `https://maxoum-db.github.io/Ignem-custodimus/` ; elle
ne doit être annoncée comme opérationnelle qu’après le succès du job deploy.
L’URL réellement retournée par ce job est la référence.

L’ancien site Sites reste accessible ; son accès n’est pas modifié ni supprimé.
Son manifeste `.openai/hosting.json` est conservé pour l’historique et un retour
arrière, mais le workflow Pages ne l’utilise pas et ne le publie pas.
Les anciennes branches et PR sont conservées.

## Conserver une partie de l’ancien site

Les parties sont enregistrées dans le navigateur sous `ignem.v1`. Le changement
d’adresse sépare les stockages : la partie n’apparaît pas automatiquement sur
GitHub Pages. Elle reste sur l’ancien site dans le même navigateur et profil.
Le jeu n’est pas modifié par cette migration.

Pour un transfert manuel depuis un navigateur de bureau, sans envoyer la partie
à un tiers :

1. Ouvrir l’ancien jeu dans le navigateur qui contient la partie, puis sa console
   de développement. Terminer d’abord le geste en cours.
2. Exécuter ces lignes pour terminer l’écriture en attente et copier la sauvegarde
   dans le presse-papiers (la fonction `copy` est disponible dans la console Chrome) :

   ```js
   window.dispatchEvent(new Event('pagehide'));
   copy(localStorage.getItem('ignem.v1'));
   ```

3. Coller le résultat dans un fichier texte conservé localement. Ne pas envoyer
   ce fichier dans une discussion publique. Si le résultat est `null`, arrêter :
   ce navigateur/profil ne contient pas la partie.
4. Ouvrir le jeu sur GitHub Pages. S’il y existe déjà une partie à conserver,
   effectuer la même copie pour la sauvegarder dans un second fichier.
5. Dans la console du nouveau jeu, exécuter :

   ```js
   const texte = prompt('Colle le contenu de ta sauvegarde locale');
   if (texte !== null) {
     const partie = JSON.parse(texte);
     if (!partie || typeof partie !== 'object' || Array.isArray(partie) || !partie.recette) {
       throw new Error('Sauvegarde invalide : aucune écriture effectuée');
     }
     window.dispatchEvent(new Event('pagehide'));
     localStorage.setItem('ignem.v1', JSON.stringify(partie));
     location.reload();
   }
   ```

6. Vérifier points, carnet, bâtiments et recette avant de continuer. Garder le
   fichier et l’ancien site disponibles jusqu’à cette vérification.

Le flush pagehide avant import évite qu’une sauvegarde différée de la nouvelle
partie remplace celle importée pendant le rechargement. Le transfert entre deux
origines est testé avec des fixtures à 320/390 px ; aucune partie personnelle
n’a été lue ou déplacée. Le parcours manuel de la console et le presse-papiers
ne sont pas automatisés. Sur téléphone sans console, conserver l’ancien site
et demander une assistance au transfert ; ne pas effacer les données du navigateur.

## Vérification et reprise

```sh
npm run build:jeu
npm run test:jeu
CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/github-pages.cjs
```

Dans GitHub Actions, Playwright installe son Chromium ; CHROMIUM_PATH n’est alors
pas nécessaire. Le test sert le HTML réel sous `/Ignem-custodimus/`, vérifie
les ressources et erreurs JavaScript, les six accès et la brasserie, puis la
recette, les points, les écus et les sauvegardes distinctes après import.
Les captures réelles sont dans `docs/captures/github-pages/`.

## Livraison de la préparation

La PR #103 contient la configuration et les tests. Son job de build Pages
(run 44096398104) a réussi ; deploy est ignoré sur une PR. La fusion n’a pas
été effectuée : le contrôle automatique requiert une autorisation explicite
pour fusionner cette PR précise dans main, suivant le protocole du projet.
Pages est également désactivé au dernier contrôle (`has_pages: false`).
Après autorisation de fusion et activation du réglage, suivre le vrai job
de déploiement ; l’adresse attendue n’est pas encore un site publié vérifié.

## Fusion confirmée et première tentative

PR #103 fusionnée, main `942e31b`, après l’accord explicite de l’utilisateur
et deux CI réussies sur `5d08c73`. Le premier run de publication main
[44112750065](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/44112750065)
a construit le jeu avec succès, puis échoué à la lecture de la configuration
Pages : HTTP 404, Pages non activé. Dépôt toujours privé, has_pages=false.
Après sélection de Source GitHub Actions par le propriétaire, relancer les
jobs échoués de ce run ; inutile de refaire le code ou de refusionner la PR.
Aucun site en ligne n’a encore été confirmé.
