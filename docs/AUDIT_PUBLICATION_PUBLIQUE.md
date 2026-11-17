# Audit avant publication publique — 17 novembre 2026

## Autorisation et périmètre

Le joueur a choisi « Oui option gratuit » en réponse à la proposition de rendre
le dépôt public pour utiliser GitHub Pages, après information que les fichiers
et l’historique deviendraient visibles. La visibilité n’a pas été changée.

Audit du dépôt courant et de toutes les références Git locales/distantes
récupérées : 179 commits accessibles, dont 157 commits avec modifications
scannés par Gitleaks 8.30.1, environ 40,54 MB de contenu. Le scanner officiel a
été téléchargé depuis sa release GitHub et son archive comparée au checksum
fourni par le projet. Commande :

```sh
gitleaks git --log-opts='--all --full-history' --redact=100 --report-format=json .
```

Résultat : code de sortie 0, aucune alerte de secret détectée. Les descriptions
des 103 PR/tickets ont aussi été scannées avec Gitleaks : aucune alerte.
Les collections de commentaires de tickets et de revues étaient vides.
Les rapports bruts expurgés et les métadonnées restent dans
`/tmp/ignem-publication-audit/` ; aucune valeur de secret publiée dans ce rapport.

Contrôles complémentaires :
- Aucun fichier .env, clé privée ou identifiant d’accès repéré dans les noms
  de fichiers courants ou les 1600 chemins historiques examinés.
- Les deux JSON historiques sous qa/sauvegardes ont une structure de partie de
  jeu, sans identifiants personnels ; le nom de cuvée est généré par le jeu.
- Les 13 JSON data sont des références d’ingrédients, recettes, formation et
  paramètres techniques ; aucun champ d’email, adresse, banque, mot de passe,
  salaire ou nom de client identifié par la recherche de clés complémentaires.
- Les scripts d’export référencent les secrets par variables d’environnement ;
  les valeurs du coffre GitHub Secrets n’ont pas été lues.
- Aucun code du jeu, format de sauvegarde, donnée ou historique n’a été modifié.

Ce résultat signifie qu’aucun secret n’a été détecté par ces contrôles, pas
une garantie absolue sur tous les contenus. Les fichiers de l’historique et
les données techniques seront visibles si le dépôt devient public. Les journaux
et artefacts Actions historiques n’ont pas fait l’objet d’une revue exhaustive.

## Changement de visibilité tenté

La demande GitHub API PATCH avec visibility=public, autorisée après audit,
a reçu HTTP 403 « Resource not accessible by integration ». L’intégration ne
peut pas administrer ce réglage. Ce n’est pas un refus d’autorisation du joueur.
Aucun changement effectif de visibilité n’est annoncé.

Le propriétaire doit ouvrir les Settings du dépôt, puis, à la fin de General,
Danger Zone → Change repository visibility → Change to public. GitHub peut
demander de confirmer le nom Maxoum-db/Ignem-custodimus.
Ensuite, Settings → Pages → Build and deployment → Source GitHub Actions.
La bascule gratuite ne nécessite pas d’achat ; ne pas cliquer Upgrade.

Quand ces deux réglages sont confirmés, relancer uniquement les jobs échoués
du run 44112750065, puis contrôler le résultat de deploy et son URL réelle.
L’ancien site et les sauvegardes restent disponibles pendant ce transfert.
