# Fusion et livraison de la série de vingt

## État confirmé

- Autorisation utilisateur : « Fusionne et donne moi l’app a jours ».
- PR #101 fusionnée : GitHub main `ce36e0ec8f5c1b5ae38db4024f33f85a2bd92b43`.
- CI 43955201528 réussie sur la tête exacte `5260945` avant fusion.
- Les arbres jeu/dist/.openai du merge et de la tête testée sont identiques.
- Dépôt initial propre ; suivi sur `work/publication-serie20`, pas de travail
  direct sur main. Aucun changement fonctionnel supplémentaire.

## Livraison autonome prête

- HTML : `/workspace/site-publication/promethee-a-jour.html`.
- ZIP : `/workspace/site-publication/promethee-a-jour.zip`, contient index.html
  et un fichier de lecture. CRC ZIP et identité du HTML avec main vérifiés.
- HTML SHA-256 : `2bcc7747b7187315c0c02d07601390607d13e782279a18f5f3134f88f54f3849`.
- Le HTML est celui du jeu autonome déjà validé en CI. Pas de nouveau test
  navigateur en file:// ; les tests précédents servent le même HTML en HTTP.
- La version locale utilise un stockage séparé de celui du site hébergé.

## Publication hébergée bloquée

Site existant : `appgprj_6ae768c368fc819193e73dfa24c45f27`.
Adresse conservée : https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Version observée : 12. Audience `custom` conservée, aucun accès modifié.
Aucun nouveau déploiement Sites demandé ni annoncé comme réussi.

Le helper site-workflow.mjs n’est pas installé dans cet environnement.
L’authentification retournée par Sites est http_extra_header. Le contrôle
automatique a refusé l’envoi de ce jeton via stdin masqué au terminal, estimant
qu’il pourrait être exposé dans le transcript. L’action a été arrêtée, le jeton
n’a pas été transmis et la valeur a été retirée de la mémoire de travail.
L’essai sans jeton via l’authentification Git intégrée a échoué :
« could not read Username ... terminal prompts disabled ».
Ne pas contourner ce rejet.

La préparation locale a pu être achevée sans secret : copie locale isolée de
l’historique Sites, branche work/publication-serie20, arbre exact du merge GitHub.
- Checkout : `/workspace/site-publication/serie20`.
- Commit source Sites préparé : `17fb5d6468529ba377be301dd0859c14a4d96343`.
- Ce commit n’est PAS poussé sur le dépôt Sites.
- Archive : `/workspace/site-publication/serie20-deployment.tar`.

## Reprise nécessaire

1. Obtenir une méthode d’authentification Sites acceptée par le contrôle,
   ou une autorisation explicite de l’action refusée à réexaminer. Ne pas
   afficher ni enregistrer de jeton ; ne pas tenter un contournement.
2. Vérifier l’état actuel du site et son audience, puis actualiser le dépôt
   Sites avec cette méthode. Ne jamais forcer le push d’un historique divergent.
3. Après authentification acceptée, pousser le commit préparé avec
   `git -C /workspace/site-publication/serie20 push origin HEAD:main` ; confirmer
   le SHA distant. Vérifier à nouveau le checksum de l’archive et du HTML.
4. save_site_version : même project_id, commit SHA Sites réellement poussé et
   archive locale exacte. Garder l’ID de version retourné sans le reconstruire.
5. deploy_site_version pour l’audience custom existante, puis suivre le seul
   deployment_id retourné jusqu’au succès ou à un échec explicite.
6. Confirmer l’URL et mettre à jour ce journal avec la version réellement publiée.

Prochaine mission unique : publier cette archive après déblocage de
l’authentification. Aucune nouvelle mission de refonte commencée.
