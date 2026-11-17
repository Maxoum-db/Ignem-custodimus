# Progression Codex

## Série de dix autorisée — étape 2/10 : Flux vapeur lié à la commande réelle

Branche `work/anim-02-vapeur` ; base = étape précédente (étape 1 sur la PR #107 non fusionnée).
Critères validés : effet visible dans le renderer existant, arrêt selon état réel,
mouvement réduit, état fourni non muté. Quatre scénarios 320/390 px DPR 2
avec accès au vrai écran, commandes et capture du jeu : réussis.
Commande : `CHROMIUM_PATH=/usr/bin/chromium CAS_ANIMATION=vapeur node jeu/tests/animations-serie.cjs`.
Build, six suites métier/images, syntaxe et diff propre réussis.
Fichiers : ateliers.js, éventuelles données de présentation dans jeu.js,
HTML reconstruits, test/configuration et captures `docs/captures/animations-serie/vapeur*`.
Aucune fusion, aucun calcul métier ou format de sauvegarde modifié.
Téléphone physique et Safari indisponibles. Étape suivante : celle du plan
`docs/SERIE_ANIMATIONS_10.md`, sans recommencer les effets existants.

## Série de dix autorisée — étape 1/10 : Flux glycol lié à la commande réelle

Branche `work/anim-01-glycol` ; base = étape précédente (étape 1 sur la PR #107 non fusionnée).
Critères validés : effet visible dans le renderer existant, arrêt selon état réel,
mouvement réduit, état fourni non muté. Quatre scénarios 320/390 px DPR 2
avec accès au vrai écran, commandes et capture du jeu : réussis.
Commande : `CHROMIUM_PATH=/usr/bin/chromium CAS_ANIMATION=glycol node jeu/tests/animations-serie.cjs`.
Build, six suites métier/images, syntaxe et diff propre réussis.
Fichiers : ateliers.js, éventuelles données de présentation dans jeu.js,
HTML reconstruits, test/configuration et captures `docs/captures/animations-serie/glycol*`.
Aucune fusion, aucun calcul métier ou format de sauvegarde modifié.
Téléphone physique et Safari indisponibles. Étape suivante : celle du plan
`docs/SERIE_ANIMATIONS_10.md`, sans recommencer les effets existants.

## Fusion autorisée puis filtration vivante — 17 novembre 2026

### Autorisation et reprise réelle

Demande : « Push en main tout puis passe a lasuite ». État local initial propre,
fetch effectué, commits et PR récentes vérifiés. Le CLI GitHub a connu un timeout
TLS ; les API du connecteur ont confirmé les états et permis les fusions.
Les anciennes PR historiques déjà intégrées ne sont pas refusionnées.

Fusions confirmées, dans l'ordre, après tests réussis :

- #104 : `67d7519ec7374e62388215e0a4a49c48ecd19849`, suivi documentaire Pages.
- #105 : `1f90e4660263bca181ab90ca61c92c46eedc3d8d`, domaine vivant.
- #106 : `f1cdf0f215fb3a1e88de370b47ee2b75abed9cf6`, empâtage vivant,
  redirigée vers main après intégration de sa base. Validation générale
  44141129955 et build Pages 44141130054 réussis. Attente de la fin effective
  des parcours complets et des coupes réelles, sans ignorer de contrôle.

Le site public retourne HTTP 200 et le même HTML que dist/index.html de ce
main final : SHA-256
`f79c1ef988b612e99d58605ae17e87eb5a45a394fce5ffac8582efffa46e49ca`.
Chromium réel 320/390 px DPR 2 : domaine, entrée brasserie, aucune erreur JS/HTTP,
aucun débordement. Preuves dans `docs/captures/fusion-main-2026-11-17/`.
Les six suites métier et les quatre contrôles d'empâtage ont aussi été rejoués
localement avant fusion, avec succès ; leurs sorties restent dans /tmp/ignem-fusion-empatage.

### Une seule nouvelle mission

Branche `work/filtration-vivante`, créée depuis origin/main `f1cdf0f`, après les
trois fusions. La filtration possédait déjà le rinçage en gouttes, les niveaux,
le jet statique et le râteau : seuls les effets manquants sont ajoutés.

Critères : soutirage animé pendant le débit, impacts à la surface réelle pendant
le rinçage, aucun flux vanne fermée/colmatage/fin de geste ; mouvement réduit,
commandes, volumes et rendement préservés ; preuve réelle du jeu.

- `jeu/src/ateliers.js` : reflets mobiles dans le jet, onde de surface et impacts
  du rinçage. Le râteau ne s'anime plus automatiquement à la première seconde :
  il nécessite un vrai timestamp de ratissage. Aucun nouveau scheduler ou asset.
- `jeu/src/jeu.js` : unique appel de dessin après passage à l'état fini pour
  supprimer le jet/rinçage résiduels sur l'image finale. Calculs inchangés.
- `dist/index.html`, `dist/artefact.html` reconstruits.
- `jeu/tests/filtration-vivante.cjs`, workflow existant et captures/vidéo/mesures
  dans `docs/captures/filtration-vivante/` ; ce journal et preuve de publication.

### Validation de la filtration

Build, six suites Node (dont chemins et images), syntaxe JS et diff propre.
Quatre scénarios Chromium 320/390 px DPR 2 normal/réduit : pixels réellement
animés, stabilité à l'arrêt/colmatage/fin, aucun râteau initial, râteau visible
après action, état fourni au renderer non muté. Sur les vraies commandes :
rinçage maintenu avec eau et volume croissants, fermeture sans volume produit,
colmatage sans débit, remise en eau et ratissage avec reprise du soutirage,
bilan, état fini redessiné puis entrée en ébullition. État du dernier dessin stable
après sortie, bouton >=44 px, aucune erreur JS ni débordement.

Un essai à 390 px avec vidéo et horloge réelle a atteint le bilan des 20 s avant
le clic de ratissage ; bouton déjà désactivé. Le test contrôle désormais l'horloge
Playwright pendant les actions et la reprend pendant la vidéo. Aucun allongement
du geste ou changement de physique. Les quatre scénarios finaux sont réussis ;
échec, log et capture conservés dans le dossier de preuves (`tentatives.json`).

Captures du véritable HTML construit et vidéo réelle du canvas pendant trois
secondes avec rinçage et débit actifs, pas de maquette. Partie de test isolée.
Téléphone physique et Safari iOS indisponibles. Les autres ateliers n'ont pas
été modifiés ; leurs parcours complets étaient réussis dans la CI avant fusion.

### Sauvegarde et prochaine mission

Commit, push et PR vers main pour cette seule nouvelle mission. Aucune fusion de
la nouvelle PR dans cette intervention : l'autorisation portait sur les travaux
précédents puis sur la mission suivante. La nouvelle filtration n'est pas encore
sur le site public ; domaine et empâtage y sont bien publiés.

Prochaine mission unique proposée, non commencée : animer les circuits glycol
et vapeur de fermentation selon leurs commandes réelles. STOP après livraison.


## Empâtage vivant — mission du 17 novembre 2026

### Reprise et périmètre

État local initial propre ; fetch du dépôt réel effectué. Main reste à
`942e31b350a7c78e75a9e4f97881228d7dad4ba6`. La PR #105 (domaine vivant)
est ouverte et non fusionnée ; #104 reste documentaire. PR ouvertes, branches
historiques d'animation, commits d'ateliers et code actuel examinés : flammes,
vapeur, fourquet et jauges existaient déjà, ils ne sont pas refaits.

La mission suivante est découpée : seul l'empâtage reçoit les effets manquants.
Branche `work/empatage-vivant` issue du commit `cd26fa7`, avec PR empilée sur
`work/domaine-vivant` pour isoler ce diff. Aucune fusion ni modification de main.

### Réalisation et critères

- `jeu/src/ateliers.js` : grains et courants de maische liés à la chaleur réelle ;
  remous pendant l'événement fourquet existant ; flux de vapeur visible uniquement
  lorsque la vanne est ouverte pendant le geste. Le flux cesse à sa fermeture,
  l'inertie thermique reste celle du contrôleur. Aucune bulle d'ébullition ajoutée.
- Temps décoratif figé en mouvement réduit, sans figer le procédé ou ses jauges.
  Aucun nouveau scheduler, contrôle, moteur, asset ou format de sauvegarde.
- `dist/index.html`, `dist/artefact.html` reconstruits depuis les sources.
- `jeu/tests/empatage-vivant.cjs` : renderer public testé avec états isolés, puis
  commandes et bilan réels du jeu, sans moteur simulé. CI existante actualisée.
- `docs/captures/empatage-vivant/` : quatre captures réelles, vidéo du canvas
  pendant trois secondes et mesures des états vanne/chaleur/bilan.

### Validation

`npm run build:jeu`, six suites `npm run test:jeu` (dont chemins/ressources),
syntaxe des JS modifiés et `git diff --check` réussis. Chromium système via
`CHROMIUM_PATH=/usr/bin/chromium` pour le test mobile.

Quatre scénarios 320/390 px DPR 2, animation normale et mouvement réduit :
variation réelle des pixels de surface et du flux, stabilité sans chaleur ou
vanne fermée, remous limité à l'événement fourquet, entrée du renderer non mutée.
Maintien réel du bouton vapeur puis fermeture : ouverture et chaleur observées,
vanne revenue sous 2 % avec chaleur résiduelle positive. Bilan réel puis passage
à la filtration ; aucun dessin d'empâtage après sortie. Bouton d'au moins 44 px,
absence de débordement horizontal et d'erreur JavaScript vérifiées.
Capture 320 px inspectée : nouveaux éléments intégrés au vrai atelier existant.

Limites : pas de téléphone physique ni Safari iOS. Le test de physique s'arrête
au passage en filtration ; les autres ateliers ne sont pas modifiés ni rejoués
intégralement dans cette mission. Les six suites métier restent réussies.
Les captures utilisent une partie synthétique de test, pas celle du joueur.

### Sauvegarde et reprise

Commit descriptif, push sur la branche dédiée et PR vers `work/domaine-vivant`.
La publication publique reste celle de main ; cette mission n'autorise aucune
fusion. Résultats détaillés : `docs/captures/empatage-vivant/mesures.json`.

Prochaine mission unique proposée, non commencée : animer uniquement le débit
et le rinçage de la filtration selon leurs états réels. STOP.


## Domaine vivant — animations et contrôle des dynamiques (17 novembre 2026)

Demande : laisser l'ancienne partie et rendre le jeu vivant, puis vérifier ses
mécaniques. Mission unique retenue : animer le domaine existant et contrôler les
parcours de jeu, sans démarrer la refonte d'un deuxième écran.

### Reprise vérifiée

Dépôt distant récupéré, main `942e31b350a7c78e75a9e4f97881228d7dad4ba6`,
PR #103 fusionnée, #104 documentaire encore ouverte, Pages public opérationnel.
Sources, historique et journal relus ; aucune modification locale initiale.
Branche dédiée `work/domaine-vivant` issue de `dba3de1` : elle contient aussi le
suivi documentaire déjà réalisé dans #104, sans le refaire. Aucun travail sur main.
Le transfert de sauvegarde précédemment proposé est abandonné à la demande du joueur.

### Modification et critères

`jeu/src/domaine.js` : poules, chat, cheval, pigeons, potager, papillons,
lanternes, lucioles, pétales, neige et feuilles animés dans le renderer existant.
Aucune boucle supplémentaire, aucune écriture dans l'état, aucun moteur modifié.
Critères : mouvements réels, saisons/nuit cohérentes, mouvement réduit statique,
arrêt hors domaine, accès tactile conservé et sauvegarde inchangée.

`dist/index.html` et `dist/artefact.html` reconstruits. Deux nouveaux contrôles
`domaine-vivant.cjs` et `dynamiques-depart.cjs`, branchés dans la CI existante.
`parcours.cjs` : navigation à 30 s plutôt que 5 s ; délai des actions conservé.
`docs/DYNAMIQUES_JEU.md` détaille les résultats et limites ; les captures,
mesures et vidéo réelle sont dans `docs/captures/domaine-vivant/`.

### Validation

Build et six suites `npm run test:jeu` réussis ; syntaxe JS et chemins/images
validés. Domaine existant et quatre contextes 320/390 px DPR 2 normal/réduit
réussis : mouvements régionaux, huit variantes, absence de débordement/erreur JS,
état stable et arrêt de dessin après sortie. Mesure locale 22–24 dessins/s,
plafond existant 30/s. Capture réelle inspectée et vidéo VP8 de cinq secondes.

Nouvelle partie 100 L réellement brassable : 20 kg / 30 g, stock 100 L, semaine
+1, points/écus gagnés. Construction et récompenses quotidiennes réussies.
Parcours complet avec étapes passées, vente, achats persistés, Ulysse, chai,
vieillissement, boutique et wash réussi. Brassage avec gestes réels réussi.
Ulysse expert et débutant avec chauffe/coupes réelles réussis.

Trois tentatives parallèles ont expiré au chargement initial (5 s) ; délai de
navigation ajusté. Une autre a expiré sur le clic initial du retour au domaine,
avant brassage, cause non établie ; sa relance isolée a réussi sans modifier
l'interaction. Ces échecs sont conservés dans le compte rendu, pas masqués.
Android physique et Safari iOS indisponibles. L'équilibrage exhaustif de toutes
les recettes et les longues sessions n'est pas validé par ces parcours.

### Sauvegarde et prochaine mission

Commit et push sur la branche dédiée, PR à main, sans fusion dans cette mission.
La publication actuellement en ligne reste celle de main jusqu'à fusion autorisée.
Prochaine mission unique proposée, non commencée : animer l'atelier de brassage
selon ses étapes réelles. STOP après livraison de cette mission.


## GitHub Pages en ligne — mission terminée

Après « Tout est bon », état vérifié par API : private=false, has_pages=true,
Pages public et build_type=workflow. Le propriétaire a effectué les réglages
nécessaires à l’option gratuite précédemment autorisée.

Relance native des seuls jobs échoués du run 44112750065. Tentative 3
terminée avec succès, main `942e31b350a7c78e75a9e4f97881228d7dad4ba6`. Le build déjà réussi est conservé ;
aucune reconstruction locale ni nouveau changement du jeu nécessaires.
URL réellement retournée puis vérifiée : https://maxoum-db.github.io/Ignem-custodimus/
HTTP 200 et HTML byte pour byte identique au dist/index.html de main,
SHA-256 2bcc7747b7187315c0c02d07601390607d13e782279a18f5f3134f88f54f3849.

Vérification du site public réel avec Chromium mobile 320/390 px DPR 2 :
domaine affiché, illustrations décodées, entrée tactile dans la brasserie,
aucune erreur JS/ressource ni débordement. Captures réelles inspectées dans
docs/captures/github-pages-en-ligne ; résultats dans
docs/validation/github-pages-publication.json. Téléphone physique et Safari
non disponibles ; aucune partie personnelle lue ou déplacée.

Suivi : README, docs/HEBERGEMENT_GITHUB.md, audit de publication publique,
ce journal, résultat JSON et deux captures. Sauvegarde sur la branche
work/github-pages, sans nouveau travail sur main ni fusion non autorisée.
Le déploiement de main via GitHub est désormais opérationnel et ne dépend
plus de l’authentification Sites. L’ancien site reste disponible ; sa partie
ne se transfère pas automatiquement à la nouvelle adresse.

Prochaine mission unique proposée, non commencée : accompagner le transfert
de l’ancienne sauvegarde si le joueur souhaite la reprendre. STOP.


## Option gratuite autorisée — audit avant dépôt public

Demande : « Oui option gratuit », après explication que la visibilité publique
concerne les fichiers et l’historique. Mission unique : audit puis passage
public nécessaire à Pages gratuit, sans nouvelle refonte.

Audit terminé : Gitleaks officiel 8.30.1, checksum vérifié, toutes références
Git récupérées ; 179 commits accessibles / 157 diffs scannés, 40,54 MB,
zéro secret détecté. Descriptions des 103 PR/tickets également sans alerte ;
aucun commentaire de ticket/revue présent. Noms de fichiers historiques et
champs des 13 JSON de données examinés, sans fichier de clé privée ou champ
personnel sensible identifié. Limites documentées : pas de garantie absolue,
pas de revue exhaustive des logs/artefacts Actions historiques.

Tentative autorisée du changement de visibilité par GitHub API : refus HTTP
403 Resource not accessible by integration. Aucun changement effectué ni
contournement ; le propriétaire doit faire le réglage dans General/Danger Zone,
puis activer Pages avec Source GitHub Actions. Aucun achat effectué.

Fichiers : docs/AUDIT_PUBLICATION_PUBLIQUE.md et ce journal, sur la branche
existante work/github-pages. Aucun changement du code, de dist, des données,
des sauvegardes, du site Sites ou de l’historique. Les audits ont réussi ; la
publication reste bloquée par les réglages de compte. Prochaine mission unique :
relancer le déploiement après passage public et activation Pages confirmés.


## Fusion GitHub Pages autorisée — activation du compte encore nécessaire

Demande utilisateur : « Oui » en réponse à l’autorisation précise de fusionner
la PR #103. La PR a été fusionnée au commit main
942e31b350a7c78e75a9e4f97881228d7dad4ba6 après vérification des deux CI réussies
sur 5d08c73 : migration Pages 44097553837 et validation générale 44097553740.
Aucune nouvelle modification du jeu, des sauvegardes ou de la visibilité privée.

Premier déploiement main : run 44112750065. Build réussi ; deploy échoué sur
configure-pages avec HTTP 404 Get Pages site failed / Not Found, parce que
Pages n’est pas activé. API dépôt : has_pages=false, private=true. Aucune URL
publiée annoncée. La documentation officielle de configure-pages v5 confirme
que l’activation automatique exige un token autre que GITHUB_TOKEN avec des
droits d’administration ; aucun secret supplémentaire demandé ou transmis.

Le propriétaire a reçu le lien direct Settings/Pages et les trois clics :
Build and deployment → Source → GitHub Actions. Question sur l’écran affiché
en cours ; en cas de message Upgrade, ne pas acheter ni rendre public le dépôt
sans nouvelle décision. Ancien site et sauvegardes restent disponibles.

Suivi conservé dans cette branche work/github-pages (avancée en fast-forward
sur main avant le commit de documentation) et dans le descriptif de la PR #103.
Prochaine mission unique : relancer le job de déploiement existant après
activation de Pages, puis vérifier le lien réellement publié.


## Migration demandée vers GitHub Pages — 17 novembre 2026

Mission unique : héberger le jeu depuis le dépôt GitHub, sans dépendre de Sites.
Utilisateur : « Je veux que tu bascules tout sur github », puis choix explicite
« Lien public pour jouer ». Le dépôt reste privé. Base main distante vérifiée :
ce36e0e, PR #101 fusionnée ; PR #102 ouverte, sa branche 8a47b1f propre.
Branche dédiée `work/github-pages`, créée depuis ce suivi pour conserver les
comptes rendus de publication précédents sans les refaire.

Configuration initiale constatée : GitHub API indique private=true et
has_pages=false. Lecture du réglage Pages refusée à l’intégration : HTTP 403
Resource not accessible by integration. L’utilisateur doit sélectionner
Settings → Pages → Source GitHub Actions ; question de statut envoyée pendant
la préparation. Aucun changement de visibilité, achat, nouveau secret ou
nouveau push vers Sites. Ancien site conservé pour les parties existantes.

Fichiers : `.github/workflows/pages.yml`, `jeu/tests/github-pages.cjs`,
`docs/HEBERGEMENT_GITHUB.md`, README, ce journal et deux captures réelles dans
`docs/captures/github-pages/`. Aucun changement de jeu/src, de dist ni du format
des sauvegardes. Le workflow teste les PR sans les publier et déploie seulement
main. Il publie uniquement dist, via les permissions temporaires de GitHub Actions.

Validation locale réussie : build reproductible, six suites Node dont ressources,
syntaxe du test JS, lecture YAML et contrôles des gardes main/PR/droits, diff --check.
Test navigateur à 320 et 390 px DPR 2 : HTML réel servi uniquement sous
`/Ignem-custodimus/`, six accès, brasserie et onglets au toucher,
absence d’erreur JS, ressource en échec ou débordement ; transfert d’une fixture
entre deux origines, points/écus/recette/bâtiments/carnet/succès conservés,
monnaie et points réellement affichés contrôlés, ancienne sauvegarde intacte.
Une première assertion supposait l’onglet Cuve au démarrage : corrigée pour
l’onglet Céréales réel. La fixture a aussi été complétée avec possede pour ne pas
réexécuter une migration historique d’écus ; sérialisation normale du jeu puis
contrôles du HUD ajoutés. Aucune modification du jeu pour faire réussir les tests.
Captures inspectées. Android physique et Safari/iOS non disponibles.

La sauvegarde de l’ancien site n’est pas déplacée automatiquement par un
changement d’adresse. Guide de transfert manuel fourni ; presse-papiers et
console du joueur non automatisés, aucune partie réelle accédée. Ne pas effacer
l’ancien site ni les données du navigateur.

Suivi de livraison : PR #103 créée ; branche initiale 2f551a3 poussée. Le
workflow de migration a réussi sur GitHub (run 44096398104) : build et test
navigateur verts, publication ignorée sur PR comme prévu. La validation générale
119 est encore en cours au contrôle de cette livraison, sans succès final annoncé.
GitHub indique toujours has_pages=false et private=true.

Tentative de fusion refusée par le contrôle automatique : il exige une
attribution explicite à cette PR #103 de l’autorisation de fusion dans main,
conformément au protocole utilisateur. Aucune fusion exécutée ni contournement.
La suite nécessite cette autorisation précise ainsi que l’activation Pages par
le propriétaire (Settings → Pages → Source GitHub Actions). Ne pas présenter
la migration comme déjà publiée ni le dépôt comme devenu public.

État de publication à confirmer par le résultat réel du job deploy : ne pas
présenter l’adresse attendue comme déjà en ligne. PR et CI de cette branche à
suivre. Prochaine mission unique après mise en ligne : vérifier un transfert
personnel assisté, sans nouvelle refonte.


## Nouvelle tentative de publication — contrôle toujours bloquant

Mission unique : reprendre la mise en ligne demandée, sans nouvelle refonte.
Statut : bloquée. Main ce36e0e et HTML autonome vérifiés inchangés ; site
observé en v12, audience custom inchangée. Dépôt initial propre.

Après la demande « Esssai pour faire évoluer le site en ligne », nouvelle
credential Sites et nouveau réexamen de la saisie getpass masquée. Refus
automatique répété pour exposition du jeton dans le transcript, malgré
l’autorisation de publier. Action non exécutée, processus arrêté, valeur
retirée de mémoire ; aucun contournement, aucun push Sites ni déploiement.

Suivi : docs/PUBLICATION_SERIE20.md et ce journal, sur la branche existante
work/publication-serie20 et sa PR #102. Archive de publication et ZIP autonome
conservés. La prochaine mission unique est de publier via une authentification
gérée sans passage du jeton au terminal ; une nouvelle autorisation générale
ne suffit pas à lever ce refus. Aucun travail fonctionnel commencé.


## Fusion autorisée et livraison — série de vingt

Statut : partielle. PR #101 fusionnée dans main `ce36e0e` après réussite de sa
CI complète 43955201528. La tête fusionnée est exactement `5260945` ; jeu/dist
et manifeste sont identiques au code testé. Aucune nouvelle modification du jeu.

Publication Sites bloquée par le contrôle automatique : refus de transmission
masquée du jeton au terminal (risque d’exposition dans le transcript). Action
non exécutée, aucun contournement ; accès Git intégré sans jeton indisponible.
Le site reste observé en version 12, audience custom inchangée ; aucun nouveau
déploiement annoncé. Le helper Sites n’est pas installé dans l’environnement.

Livrables préparés à partir du main fusionné : HTML et ZIP autonomes dans
`/workspace/site-publication/promethee-a-jour.{html,zip}` ; archive de déploiement
`/workspace/site-publication/serie20-deployment.tar`. Copie source Sites préparée
localement au commit `17fb5d6468529ba377be301dd0859c14a4d96343`, non poussé.
CRC ZIP, identité HTML avec main et empreintes vérifiés. Pas de nouveau test
navigateur file:// ni de vérification d’une nouvelle version hébergée non publiée.

Suivi sur `work/publication-serie20` : ce journal et `docs/PUBLICATION_SERIE20.md`,
avec les commandes et références exactes de reprise. Aucun jeton dans les fichiers.
Prochaine mission unique : terminer la publication après déblocage de
l’authentification Sites. Pas de fusion de la PR de suivi sans nouvelle demande.


## Série de 20 — 20 : validation intégrée et revue vers main

Statut : terminée sur `work/serie20-20-validation`. Les dix-neuf premières
missions de cette série ont chacune leur branche, commit, tests et PR (#82–#100).
Cette dernière branche propose une PR d’ensemble vers main, y compris la
correction H01 préalable (#81), sans fusion ni publication. Base main vérifiée :
`b17989ef33fcc5fc86e2fc8cd5fa71db61b0fef1` ; les 19 branches poussées ont été
comparées à GitHub et correspondent à leurs commits locaux.

Fichiers : test `jeu/tests/serie20/20.test.cjs`, dossier `docs/SERIE_20_REVUE.md`,
suivi de `docs/AUDIT_RESTANT.md`, résultats et empreintes dans `docs/validation/`,
ce journal et captures de cette série remises à jour. Aucun changement du code
produit ni des HTML dans cette étape : ils restent ceux de `c7a138f`.
Les cinq moteurs, données et format de sauvegarde sont inchangés par la série.
Les 78 captures historiques réécrites par les tests ont été remises à leur état
antérieur ; leurs compléments QA sont conservés dans `/tmp/serie20-qa-complements`.

Critères et validation :
- 93 commandes vérifiées : build reproductible, six suites Node dont ressources,
  syntaxe de neuf JS, tous les tests navigateur du workflow et les quatre
  parcours (automatique, gestes de bière, Ulysse expert et débutant).
- Les vingt tests ajoutés passent à 320 et 390 px DPR 2 avec toucher actif,
  sans erreur JS ni débordement horizontal. Le dernier vérifie l’expiration
  d’une confirmation d’abandon, dix écrans et la conservation recette/écus.
- CI complète du code produit `c7a138f` : run 43948905760 réussi ; elle couvre
  les tests 01 à 19 et tous les parcours. La CI de la dernière PR, qui ajoute
  le test 20 et la documentation, devra être distinguée de ce résultat.
- Un délai d’action de 7 s a échoué sur #btn-menu pendant l’entrée de fixture
  en 390 px, avant le scénario 02. Le rejeu ciblé a réussi aux deux largeurs
  sans modification ; cause exacte non établie, premier passage et trace gardés.
- Le dernier parcours a été interrompu par le redémarrage de l’environnement.
  Les 92 résultats précédents ont été récupérés ; seule cette commande a été
  relancée puis réussie. Aucun résultat d’interruption présenté comme succès.
- Quarante captures réelles sont sauvegardées dans `docs/captures/serie20/`.
  Les captures de chaque mission ont été inspectées ; les deux largeurs finales
  ont été vues. Ce sont des rendus du jeu construit, pas des maquettes.
- Android physique et Safari/iOS indisponibles. La publication du site n’a pas
  été effectuée : pousser les branches GitHub ne met pas le site public à jour.

Reprise : résultats complets, commandes, branches, commits, PR et limites dans
`docs/SERIE_20_REVUE.md`. Les constats H02/H03/U01/U02 sont marqués comme traités
sur branches dans l’audit pour éviter de les recommencer.
Prochaine mission unique proposée : fusionner la PR finale vers main après
une autorisation explicite. Aucune vingt-et-unième mission commencée.


## Série de 20 — 19 : Protéger les sorties de navigation pendant un geste

Branche : `work/serie20-19-navigation-geste`. Les destinations data-aller demandent un second toucher sur la même destination sous cinq secondes pendant un geste, comme la protection du Retour existante. Menu conservé au premier toucher. Les trois sorties menu, recherche et domaine sont testées pendant un empâtage actif : recette, monnaie et nombre de brassins conservés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/19.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/19-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 18 : Nommer et clarifier les bilans des gestes

Branche : `work/serie20-18-bilans-gestes`. Le composant existant reçoit un titre, une région nommée, le focus en fin de geste et une action de 48 px. Bilan réel du houblonnage sans ajout : score 100 %, titre, focus et passage en fermentation vérifiés. Aucun changement des scores ni récompenses.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/18.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/18-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 17 : Stabiliser le signal du dry hop prêt

Branche : `work/serie20-17-signal-dry-hop`. Remplacement du clignotement en marches par un contour et une couleur stables, avec le texte maintenant existant. Classe prête retirée après le dernier ajout. Fenêtre réelle DH1, absence d’animation, ajout manuel consommé et suite bouteille vérifiés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/17.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/17-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 16 : Illustrer les animaux de la basse-cour

Branche : `work/serie20-16-animaux-illustres`. Réutilisation inchangée de deux WebP historiques, provenance et empreintes documentées. Poules et chat procéduraux remplacés dans le canvas existant ; appels drawImage des nouveaux assets réellement vérifiés. Six accès, bâtiments et chai conservés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/16.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/16-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 15 : Expliquer les recherches d’ingrédients sans résultat

Branche : `work/serie20-15-recherche-vide`. Message échappé et action Effacer de 48 px dans les quatre recherches. La fixture possède des aromates ; le message ancien Aucun aromate est remplacé quand la recherche seule échoue. Effacement, focus retrouvé, nombre de cartes et recette conservés vérifiés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/15.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/15-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 14 : Compléter la navigation clavier des onglets recette

Branche : `work/serie20-14-onglets-clavier`. Onglets avec une seule entrée Tab, panneau associé et navigation flèches/Début/Fin avec bouclage. Toucher préservé ; recette et monnaie comparées avant/après. Aucun changement de préparation.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/14.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/14-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 13 : Clarifier les jauges des gestes

Branche : `work/serie20-13-jauges-gestes`. Jauges communes : libellé et valeur au-dessus de barres 16 px, rôle meter et valeur avec unité. Empâtage contrôlé en DOM : trois jauges, valeurs bornées cohérentes avec le remplissage et pression en bar. Calculs communs inchangés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/13.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/13-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 12 : Rendre les registres d’air tactiles et explicites

Branche : `work/serie20-12-registres-foyer`. Les deux foyers affichent le pourcentage d’ouverture, avec curseur 48 px et unité accessible. Contrôle de leur activation et de 50 à 51 % par clavier dans les deux chauffes ; modèle thermique conservé.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/12.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/12-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 11 : Agrandir le dosage du sucre en bouteille

Branche : `work/serie20-11-sucre-bouteilles`. Carte de dosage et curseur de 48 px, valeur avec unité accessible et verdict associé. Test : 6,5 g/L sélectionnés puis CO₂ du brassin sauvegardé identique au calcul résiduel plus sucre. Embouteillage et accès au jury conservés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/11.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/11-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 10 : Adapter la dégustation aveugle au téléphone

Branche : `work/serie20-10-aveugle-mobile`. Cartes de fractions empilées sous 560 px, groupes nommés et choix de 48 px. Verres illustrés existants conservés. Distillation moteur, trois sélections, correction puis passage au jury vérifiés.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/10.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/10-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 09 : Clarifier les cadeaux des découvertes

Branche : `work/serie20-09-decouvertes`. Cartes Fournisseurs : condition, cadeau et état reçu ou à découvrir séparés. Le test ouvre bien Fournisseurs (premier essai resté sur Clients), puis contrôle les états sans attribution ni dépense après rechargement.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/09.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/09-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 08 : Distinguer les succès obtenus des objectifs

Branche : `work/serie20-08-succes-carnet`. Cartes du carnet à pleine lisibilité avec état écrit Obtenu ou À accomplir. Succès existants et absence de nouvelle attribution vérifiés après rechargement.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/08.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/08-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 07 : Exposer la progression réelle du carnet

Branche : `work/serie20-07-progression-carnet`. Carte de progression et barre nommée avec pourcentage et points actuels. Vérification de 0, 30, 100 et 500 points : début, entre deux paliers, dernier palier. Règles de déblocage conservées.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/07.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/07-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 06 : Rendre la gravité des défauts lisible

Branche : `work/serie20-06-defauts-jury`. Les quatre rendus de défauts affichent Gravité N/3, avec descriptions et conseils en cartes aérées. Scénario DOM bière : défauts identiques au carnet, gravités et conseils présents. Aucun changement de notation.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/06.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/06-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 05 : Clarifier les fiches du jury

Branche : `work/serie20-05-fiche-jury`. Capture inspectée : les délais des lignes sont supprimés en mouvement réduit et leur opacité est testée. Présentation papier arrondie, lignes aérées et en-têtes de lignes pour les quatre jurys (bière, wash, eau-de-vie, vieilli). Test navigateur sur bière calculée : six en-têtes et total identique au carnet. Autres jurys couverts par les suites moteur, pas par ce nouveau scénario DOM.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/05.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/05-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 04 : Rendre le mentor utilisable sur écran court

Branche : `work/serie20-04-mentor-mobile`. U02 : actions de 48 px, panneau limité à 45 % de hauteur et défilant. ResizeObserver maintient la réserve de place ; le menu tient compte du mentor pour éviter le chevauchement reproduit au premier test. Tutoriel quittable à 430 px de haut.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/04.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/04-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 03 : Agrandir les réglages tactiles Ulysse

Branche : `work/serie20-03-reglages-ulysse`. U01 : bascules de 48 px et curseurs de 44 px dans des cartes lisibles. Recyclage, chauffe, coupes et persistance après rechargement vérifiés ; monnaie conservée.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/03.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/03-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 02 : Maintenir le décompte après le dernier houblon

Branche : `work/serie20-02-compteur-ebullition`. H03 : le compteur est rafraîchi à chaque image de la chauffe, même lorsque tous les ajouts sont faits. Test : ajout initial, compteur intermédiaire et zéro final ; informations du dernier ajout conservées.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/02.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/02-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## Série de 20 — 01 : Afficher la dose réelle de houblon

Branche : `work/serie20-01-dose-houblon`. H02 : texte et nom accessible utilisent la même dose que l’ajout. Les trois niveaux de brasserie sont contrôlés (30, 130, 250 g). Une première fixture a été corrigée pour respecter le lien entre niveau et volume.

Validation : build et six suites Node réussis ; test navigateur dédié
`jeu/tests/serie20/01.test.cjs` réussi à 320 et 390 px, sans erreur JS
ni débordement horizontal. Captures réelles : `docs/captures/serie20/01-*.png`.
Vérification mobile Chromium, pas de téléphone physique ni Safari disponibles.
Sources, HTML générés, test, captures et journal sauvegardés dans le commit.
PR empilée sur la branche précédente ; aucune fusion ni publication.


## ÉTAPE — H01 : oubli du houblon à 0 minute

Statut : terminée sur `work/houblon-oubli-zero`, sans fusion ni publication.
Une seule mission dans cette exécution. Base distante vérifiée : main
`b17989ef33fcc5fc86e2fc8cd5fa71db61b0fef1`, PR #80 fusionnée ; dépôt initial
propre. Les PR pertinentes consultées ne contiennent pas déjà cette correction.

Règle : un ajout non lancé à la fin du geste contribue pour zéro à la précision,
même s’il était prévu à 0 minute. Un ajout réellement lancé garde la notation
existante. La pénalité d’un oubli atteint au moins la tolérance du geste : il
ne compte donc plus comme un ajout réussi à une minute près ni parmi les trois
ajouts réussis. Les récompenses réellement gagnées sont conservées.

Le bilan nomme les ajouts oubliés, le bouton final indique leur nombre et reste
désactivé ; les repères oubliés ont un état distinct et un nom accessible.
La liste interne de travail est annotée, pas la recette sauvegardée. Le repli
scientifique existant à 0 minute pour les ajouts non lancés est conservé :
aucune modification des cinq moteurs, des données ni du format de sauvegarde.
Pas de modification rétroactive des parties ou récompenses anciennes.
La préparation de cinq secondes et la durée d’ébullition restent inchangées.
H02 (doses), H03 (compteur) et les autres sujets ne sont pas traités ici.

Fichiers : `jeu/src/jeu.js`, `jeu/src/style.css`, les deux HTML de `dist`,
`jeu/tests/lot50/houblon-oubli.test.cjs`, workflow (archivage des captures),
ce journal, le suivi H01 de `docs/AUDIT_RESTANT.md` et six captures réelles dans
`docs/captures/houblon-oubli/`.

Validation locale réussie :
- Build et six suites Node, dont ressources ; syntaxe JS et git diff --check.
- 16 scénarios nouveaux : 320/390 px DPR 2, expert/débutant ; oubli seul
  (0 %, aucun gain), ajout manuel à 0 (100 %, récompense existante), un ajout
  réussi puis un oubli (50 %), dry hop seul (pas de fausse omission).
- Les objectifs de précision, états des repères, bouton final, recette et dry
  hop conservés, passage à la fermentation sont vérifiés. Les gains sont
  contrôlés dans l’en-tête du jeu ; ils ne sont pas supposés déjà sérialisés
  avant la fin du brassin. Deux assertions initiales du test ont été corrigées
  pour respecter cette sauvegarde différée et la classe existante des objectifs.
- Huit scénarios existants `houblon-preparation.test.cjs` réussis : préparation
  cinq secondes, ajouts aux repères à 100 % et retards pénalisés.
- `GESTES_REELS=1` parcours complet réussi, captures dans
  `/tmp/ignem-oubli-parcours`. Captures nouvelles inspectées ; zéro erreur JS
  et aucun débordement horizontal dans les scénarios mobiles.
- Horloge navigateur pilotée dans les scénarios de frontière, véritables
  interactions DOM ; aucun moteur simulé ni appel aux fonctions privées.

Android physique et Safari non disponibles. La CI de cette PR reste à suivre.
Commandes ciblées : `npm run build:jeu && npm run test:jeu`, puis
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/lot50/houblon-oubli.test.cjs`.
Le serveur local utilise ici Chromium système hors bac à sable.

Prochaine mission unique, non commencée : H02, afficher dans les boutons de
houblon la dose réellement ajoutée selon le volume de brasserie.


## Audit demandé du reste à faire — main 41ab2b9

Mission unique : vérifier l’intégration et auditer le reste, sans correction du
jeu. Autorisation explicite : « Push sur main et lance un audit de ce que reste ».
Branche dédiée : `work/audit-restant-main`, créée depuis main distant
`41ab2b952c685be73fbae664160d89eccfd93440`. Dépôt initial propre. PR #79
confirmée fusionnée ; les 65 branches distantes work présentes au contrôle sont
déjà ancêtres de main. Aucun push de code produit supplémentaire n’était requis.

Livraison : [audit détaillé](AUDIT_RESTANT.md),
[mesures](audit/mesures-runtime.json), [sonde reproductible](audit/verifier-restant.cjs)
et six captures réelles dans `docs/captures/audit-restant/`.

Défauts reproduits à 320 et 390 px :
- Ajout de houblon prévu à 0 min oublié : 100 % sans toucher, récompense et
  repère/bouton incohérents. Comportement préexistant à l’approche de cinq secondes.
- Compteur d’ébullition figé après le dernier ajout : encore 60 min à la fin
  d’une recette dont le seul ajout était au début, curseur pourtant à 100 %.
- Bouton et nom accessible +250 g, ajout réel 30 g pour 100 L et 130 g pour 500 L.
- Bascules Ulysse 35,1875 px, curseurs 28 px ; action du mentor 36 px.

Sites consulté en lecture seule : version 12 et déploiement réussi confirmés ;
le HTML de ses sources correspond à l’ancien main 43ab1df et diffère du main
actuel. La publication reste donc à faire. Aucun accès ni déploiement modifié.
Les 56 PR encore ouvertes ne représentent pas 56 nouveaux chantiers ; les
branches récentes sont déjà intégrées, les 13 prototypes historiques conservés.

Vérifications : build reproductible (aucune différence dans dist), six suites
Node réussies, audit navigateur puis rejeu de la sonde livrée réussis aux deux
largeurs, aucun pageerror/console.error ni débordement horizontal ; syntaxe de
la sonde et `git diff --check` réussis. Le bon déroulement de la sonde ne vaut
pas validation des anomalies observées. Captures inspectées. Android physique
et Safari/iPhone non disponibles. CI du code jeu e2b3616 : run 43083739020
réussi, sources identiques au main audité. Aucune modification de jeu/src,
jeu/tests, dist, .github, data ou .openai dans cette mission.

Le rapport et ses preuves sont sauvegardés sur cette branche et livrés par sa
PR d’audit vers main ; l’état GitHub de cette PR confirme la fusion effective.
Prochaine mission unique proposée : traiter H01, la notation et l’état d’un
ajout oublié à 0 minute, puis prévoir la publication pour une revue commune.
Aucune correction de ce backlog n’est commencée ici.


## Mission demandée — cinq secondes d’approche avant le premier houblon

Branche : `work/houblon-preparation-5s`, créée depuis le main distant
`39778b2398b5fe211ca4129a92bdd6efa84afd11`. Dépôt initial propre ; PR #78
confirmée fusionnée. Les 19 missions précédentes sont donc déjà intégrées.
Autorisation explicite pour cette mission et sa fusion : demande utilisateur
« Lance la barre de progression 5s avant ... Push en main la totale ».

Constat : l’ancienne montée à ébullition durait trois secondes, curseur immobile.
Le bouton s’activait au moment où le curseur démarrait déjà sur le repère d’un
ajout prévu au début de l’ébullition. La nouvelle frise possède une zone
préparatoire de cinq secondes réellement parcourue avant les repères. Un compte
à rebours persistant annonce le départ ; le premier ajout est désactivé pendant
ces cinq secondes. Le temps scientifique de recette ne commence qu’ensuite.
La durée de jeu de l’ébullition reste de 18 secondes, après cette approche.
Le calcul des écarts, la notation et les minutes de recette restent inchangés.
La préparation est un état local du geste ; aucun format de sauvegarde modifié.

Fichiers : `jeu/src/jeu.js`, `jeu/src/page.html`, `jeu/src/style.css`,
`jeu/tests/lot50/houblon-preparation.test.cjs`, `jeu/tests/parcours.cjs`,
`.github/workflows/validation-jeu.yml` (archivage des captures), les deux HTML
dans `dist`, ce journal et huit captures réelles dans
`docs/captures/houblon-preparation/`.

Validation locale réussie :
- Build et six suites Node, dont validation des ressources ; syntaxe JS et
  `git diff --check`.
- Huit scénarios navigateur : expert/débutant, 320/390 px DPR 2, ajouts à l’heure
  et premier ajout en retard d’une seconde. L’horloge du navigateur est pilotée
  pour vérifier la frontière de cinq secondes et les instants exacts, sans
  simuler le moteur ni appeler les fonctions privées du jeu.
- Curseur en mouvement avant le premier repère, ajout interdit avant 5 s,
  compte à rebours, deux ajouts aux repères donnant **100 %** de précision.
  Les retards restent pénalisés. Recettes de 60 min (expert) et 90 min (débutant),
  dry hop et recette prévue conservés, accès à la fermentation vérifié.
- Deux parcours complets avec `GESTES_REELS=1`, en temps naturel : expert et
  débutant, de la recette à la boutique, réussis sans exception JS.
  Captures supplémentaires dans `/tmp/ignem-hop-real-expert` et
  `/tmp/ignem-hop-real-debutant`. Le parcours attend désormais l’activation
  réelle du bouton plutôt qu’un délai fixe de quatre secondes.
- Captures réelles du compte à rebours et du 100 % inspectées ; aucune erreur JS
  ni débordement horizontal. Pas d’Android physique ni de Safari disponibles.

Commandes de reprise : `npm run build:jeu && npm run test:jeu`, puis
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/lot50/houblon-preparation.test.cjs`.
Parcours naturel : `GESTES_REELS=1 node jeu/tests/parcours.cjs` ; ajouter
`MODE_JEU=debutant` pour l’autre mode. Ici Chromium système et serveur local
requièrent l’exécution hors bac à sable.

CI complète confirmée réussie sur le code `e2b3616104500b52c9934f08d77c06733f274845` :
[run 43083739020](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43083739020).
Build reproductible, six suites Node, mobile, huit rendus, toutes les suites de
fonctionnalités (dont les huit nouveaux scénarios), parcours standard et gestes
réels, Ulysse expert et débutant : tous réussis. Le commit suivant ne complète
que ce journal, sans modification du code validé.
PR de livraison autorisée : [#79](https://github.com/Maxoum-db/Ignem-custodimus/pull/79) ;
son état GitHub porte la confirmation effective de fusion dans main.
Les moteurs `moteur.js`, `distillerie.js`, `chai.js`, `ecole.js`,
`vente.js` et les données scientifiques restent identiques à main.
Le site reste sur sa dernière publication consignée (version 12) tant qu’une
nouvelle publication distincte n’est pas effectuée.

Prochaine mission unique proposée, non commencée : publier le main actualisé
pour une revue commune de la version jouable. Les autres priorités déjà
auditées restent les libellés des doses de houblon, les contrôles Ulysse/mentors
et les finitions de dégustation, puis les essais sur appareils physiques.


## Intégration demandée dans main — lot jusqu’à la mission 19

Autorisation explicite : « Push en main, puis dis moi ce qu’il reste a faire ? ».
Branche dédiée : `work/integration-lot50-19`, issue de
`2913e17a98941d13c2cd9aa32d78a323039e0da5`. Les 19 branches distantes
`work/lot50-*` sont toutes ancêtres de cette tête. Le main audité est
`43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`. Aucun travail sur main local.
PR d’intégration : [#78](https://github.com/Maxoum-db/Ignem-custodimus/pull/78).
L’état effectif de fusion est porté par cette PR GitHub ; aucune
suppression de branche ni fermeture manuelle des PR empilées n’est prévue.

Périmètre : intégrer les travaux récents des PR #59–#77 et leur journal.
Les prototypes historiques hors de cette chaîne restent hors périmètre.
Cette intégration ne réalise pas de nouvelle mission graphique et ne publie
pas une nouvelle version du site.

Validation locale : build reconstruit sans différence sur les deux HTML livrés,
six suites Node réussies, ressources validées, `git diff --check` réussi.
Les cinq moteurs et le dossier data sont inchangés par rapport à main.
CI complète antérieure : 43076308757 réussie. Contrôle final du code 2913e17 :
[run 43080317643](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43080317643).
Réussite effective confirmée : build reproductible, six suites Node, mobile,
huit rendus, suites de fonctionnalités, recette, parcours standard, gestes
réels, Ulysse expert et débutant. Les seuls ajouts de cette branche sont
les mises à jour de ce compte rendu : aucun changement du code validé.

Reste à faire, d’après le code réel (liste de priorités, pas 31 missions inventées) :

1. Publier le nouveau main sur le site existant. La dernière publication
   consignée est la version 12, depuis l’ancien main 43ab1df ; fusion GitHub
   et publication du site sont deux opérations distinctes.
2. Prochaine mission de développement : faire correspondre le texte et le nom
   accessible des boutons de houblon à `doseHop()` ; `jeu/src/jeu.js` affiche
   encore +250 g pour toutes les tailles de brasserie alors que le calcul
   adapte déjà la quantité au volume.
3. Agrandir les contrôles restants : les bascules de `#dist-reglages` utilisent
   encore les styles génériques, les curseurs génériques mesurent 28 px de haut,
   et `.mentor-actions .btn` conserve une hauteur minimale de 36 px. Traiter
   chaque composant dans sa propre mission, en conservant ses interactions.
4. Auditer puis harmoniser les panneaux encore anciens de dégustation : fiche
   du jury, médailles et défauts. Les verres illustrés existent déjà : ne pas
   les refaire. Les petits animaux du domaine restent dessinés par procédures ;
   des assets cartoon historiques existent et peuvent être évalués pour une
   mission artistique ultérieure, sans recréation automatique.
5. Vérifier sur Android physique et Safari/iPhone : non disponibles ici.

Les fiches, la recherche, les options, les fournisseurs, les ingrédients, les
quantités, le procédé, les sels, les styles, le plan de Lise, les tutoriels,
les bulles d’aide, le menu, le matériel et la composition sont déjà traités
dans ce lot. Les bâtiments ont déjà été traités dans 0607f21. Ne pas recommencer.
Le compteur historique est de 19 missions de lot réalisées, et non de 50 ; les
missions restantes doivent être définies par audit, sans découpage artificiel.


## ÉTAPE — mission 19 : composition des malts lisible au pouce

Statut : terminée sur `work/lot50-19-composition`, sans fusion. Une seule mission
pour cette exécution ; le lot historique de 50 reste incomplet.

Audit réel : dépôt propre, `origin/main` à `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`,
PR #76 ouverte, tête distante `b51c7349caa621addb4d508ff638d4d2d1ac0071`.
La composition repliable existe déjà (32851ee) ; seuls son confort tactile et sa
lecture restaient à améliorer : noms tronqués et commande sans hauteur minimale.

Critères vérifiés : cible au moins 48 px ; noms longs complets à 320 et 390 px ;
proportions réelles 75/25 puis 50/50 ; ouverture au toucher, fermeture Entrée et
réouverture Espace ; focus conservé ; aucune mutation de sauvegarde par le
repli/dépli ; recette conservée après rechargement.

Fichiers modifiés : `jeu/src/jeu.js` (liaison ARIA, légende, focus),
`jeu/src/style.css` (cible, retours à la ligne, repères arrondis),
`jeu/tests/lot50/19-composition.test.cjs`, `dist/index.html`, `dist/artefact.html`,
les deux captures `docs/captures/lot50/19-composition-{320,390}.png` et ce journal.
Aucun moteur, donnée scientifique ni format de sauvegarde modifié.

Validation locale : `npm run build:jeu`, `npm run test:jeu` (six suites, dont
validation des ressources), test Chromium `19-composition.test.cjs` aux deux
largeurs en DPR 2, et `recette-mobile.cjs` existant réussis. Ce dernier contrôle
le dessin réactif, le glisser-déposer après défilement, les sept onglets et la
remise à zéro. Zéro erreur JS et aucun débordement horizontal dans le nouveau
scénario. `node --check` du jeu et du nouveau test, `git diff --check` réussis.
Captures réelles 320/390 inspectées. Captures supplémentaires du contrôle recette
conservées hors dépôt dans `/tmp/ignem-qa-lot50-19-recette`.
Pas d’Android physique ni de Safari disponibles ; validation GitHub à suivre dans
la PR. Le site publié reste la version 12 ; cette mission n’est pas déployée.

Reprise du test ciblé : `npm run build:jeu && npm run test:jeu`, puis
`CHROMIUM_PATH=/usr/bin/chromium node jeu/tests/lot50/19-composition.test.cjs`.
Le serveur de test requiert ici l’exécution hors bac à sable.

Prochaine mission unique, non commencée : corriger les libellés des doses de
houblon selon le volume de brasserie (le calcul existant est conservé).


## Lot de 50 — point de reprise après la mission 18

Dix-huit missions sauvegardées, PR #59 à #76 empilées et ouvertes. Le lot demandé
de 50 n’est pas terminé. Aucun travail nouveau fusionné dans main pendant ce lot.

Validation commune confirmée : [run 43076308757](https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/43076308757),
conclusion **success**, code du commit `71f45ec7f924fe172d819d9293a04274cc869cfb`.
Build reproductible, six suites Node, mobile, huit rendus, plan du chai,
suites finitions/pigeonnier/veillée/lot50, entrée Ulysse, portrait de Firmin,
domaine, carnet, recette mobile, parcours standard, gestes réels, Ulysse expert
et Ulysse débutant : tous réussis. L’échec initial du run 43074048328 est
corrigé par la mission 18 (questions homonymes, tests seulement).

Contrôles locaux supplémentaires au même code : mobile et huit rendus réussis ;
aucun changement des moteurs `moteur.js`, `distillerie.js`, `chai.js`, `ecole.js`,
`vente.js` ni du dossier data par rapport à main. Les captures de contrôle
générées hors livraison sont conservées dans `/tmp/ignem-qa-lot50-18-mobile` et
`/tmp/ignem-qa-lot50-18` ; les preuves livrées sont dans `docs/captures/lot50`.
Aucun Android physique ni Safari disponible. Le document de ce point de reprise
est ajouté après la validation : aucune modification du code testé.

`origin/main` vérifié à `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d` ; le site
publié reste la version 12 issue de ce main :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Les missions 02 à 18 sont sur les branches et PR, pas encore sur le site.

Prochaine mission unique, non commencée : composition des malts lisible au
pouce, noms complets et proportions réelles conservées. Audit préalable :
le contrôle actuel mesure une petite cible et tronque les noms par ellipsis.
Ne pas refaire les bâtiments (déjà intégrés par 0607f21).

Reprise : `git fetch origin`, vérifier main et les PR #59–#76, vérifier que le
répertoire est propre, partir de `work/lot50-18-validation-quiz` sur une nouvelle
branche dédiée. Ne pas fusionner sans nouvelle autorisation explicite.


## Lot autorisé de 50 — mission 18 : Validation : distinguer les questions homonymes par module

Statut : terminée sur `work/lot50-18-validation-quiz`, sans fusion.
CI 43074048328 en échec dans le test Veillée 09 : deux cartes Dimensionnement appartiennent aux modules Énergie et Brasserie, avec des réponses distinctes. Le helper de test cherchait seulement le titre. Correction limitée aux tests : résolution par titre et module, cas forcés des deux cartes, vérification des récompenses. Tests Veillée 08 et 09 rejoués avec succès aux deux largeurs ; nouvelle CI complète à confirmer. Aucun code du jeu ni donnée scientifique modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/18-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Confirmer la nouvelle CI complète, puis améliorer la lecture de la composition des malts.


## Lot autorisé de 50 — mission 17 : Matériel : achats tactiles et installation vérifiée

Statut : terminée sur `work/lot50-17-materiel`, sans fusion.
Audit : les bâtiments et leurs travaux sont déjà traités dans 0607f21 ; aucune reprise de ce travail. Cartes du matériel, achats nommés de 48 px et état installé lisible. Installation réelle de la vanne : 60 écus débités, matériel conservé après rechargement, bâtiments et travaux inchangés. Le test tient compte du tableau travaux initialisé lors de la première sauvegarde.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/17-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Diagnostiquer l’échec de validation GitHub de la mission 10 avant de poursuivre la refonte.


## Lot autorisé de 50 — mission 16 : Menu : navigation mobile sur écran court

Statut : terminée sur `work/lot50-16-menu`, sans fusion.
Menu défilant à hauteur contenue, actions de 48 px, ouverture clavier sur la page courante et fermeture Échap avec retour du focus. Hauteur 320 px : dernier lien Options accessible, navigation effective et progression conservée vérifiées.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/16-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser les cartes de bâtiments et vérifier un lancement de travaux.


## Lot autorisé de 50 — mission 15 : Informations : bulles tactiles et accessibles

Statut : terminée sur `work/lot50-15-informations`, sans fusion.
Boutons de 44 px, état ouvert annoncé, association du texte, fermeture Échap et bulle défilante contenue dans l’écran. Texte intégral réel du pigeonnier, dimensions 320/390 par 568 px, fermeture extérieure et absence de mutation vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/15-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre le menu utilisable sur écran court et restaurer son focus à la fermeture.


## Lot autorisé de 50 — mission 14 : Tutoriels : lecture mobile et navigation clavier

Statut : terminée sur `work/lot50-14-tutoriels`, sans fusion.
Cartes de premier passage à contenu défilant, actions de 48 px et texte lisible. Tutoriel réel du pigeonnier : page suivante, hauteur 568 px, boucle Tab, fermeture Échap et conservation du marqueur vu après rechargement vérifiés. Les premiers essais de test visaient à tort un tutoriel brasserie inexistant puis une recette non encore sérialisée ; scénario corrigé sur les données réelles.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/14-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les bulles d’information au tactile et aux petits écrans.


## Lot autorisé de 50 — mission 13 : Conformité : repères lisibles et plages chiffrées

Statut : terminée sur `work/lot50-13-reperes`, sans fusion.
Valeurs et plages du style lisibles sans interpréter les couleurs, jauges arrondies et accordéon relié à son contenu. Ouverture/fermeture sans mutation et recalcul effectif après ajout de malt vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/13-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les tutoriels lisibles sur petit écran et contrôler leur fermeture au clavier.


## Lot autorisé de 50 — mission 12 : Plan de Lise : portrait net et étapes tactiles

Statut : terminée sur `work/lot50-12-plan-lise`, sans fusion.
Capture ajustée au bandeau fixe des mesures pour garder le portrait dans le viewport, puis scénario 320/390 rejoué.
Portrait illustré en rendu lisse, étapes lisibles, liens de fiche de 44 px et actions de 48 px. Application effective du plan à une cuve vide, levure et malts obtenus, cible conservée, aller-retour fiche et abandon de cible sans vider la recette vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/12-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Clarifier les repères de conformité au style et leurs plages chiffrées.


## Lot autorisé de 50 — mission 11 : Style visé : sélecteur mobile accessible

Statut : terminée sur `work/lot50-11-styles`, sans fusion.
Contrôle visuel initial : descriptions débordantes dans la grille ; corrigé par des lignes de hauteur intrinsèque. Contrôle supplémentaire : aucun texte ne dépasse sa carte à 320/390 px.
Liste interne défilante, annulation toujours visible, choix lisibles et état sélectionné explicite. Focus initial, boucle Tab, Échap, retour du focus, choix du dernier style et sauvegarde de la cible vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/11-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser le plan de Lise et vérifier son application réelle à la recette.


## Lot autorisé de 50 — mission 10 : Eau : dosages lisibles et curseurs tactiles

Statut : terminée sur `work/lot50-10-sels`, sans fusion.
Cartes de dosage avec unités distinctes, curseurs de 44 px et bilan ionique lisible. Choix réel d’un profil, augmentation d’un sel, actualisation du bilan et conservation après rechargement vérifiés dans une partie de test en bac à sable.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/10-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre le sélecteur de style mobile et sa navigation clavier accessibles.


## Lot autorisé de 50 — mission 09 : Procédé : réglages scientifiques tactiles

Statut : terminée sur `work/lot50-09-procede`, sans fusion.
Cartes lisibles, bascules de 48 px et curseurs de 44 px. Palier, température, rendement, cuisson, repos diacétyle, ébullition 90 min, bascule wash et retour bière vérifiés avec persistance exacte de la recette. Aucun calcul scientifique modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/09-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les dosages de sels et d’acide et vérifier le bilan ionique réel.


## Lot autorisé de 50 — mission 08 : Cuve : quantités et temps d’ajout tactiles

Statut : terminée sur `work/lot50-08-quantites`, sans fusion.
Noms et quantités sur des lignes distinctes, commandes de 48 px, temps de houblonnage de 44 px et libellés de dose réels. Plus/moins, saisie décimale française, grammes, dry hop J2, suppression ciblée et persistance vérifiés sans débit d’écus.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/08-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les réglages du procédé et vérifier les recettes bière et wash.


## Lot autorisé de 50 — mission 07 : Brasserie : ingrédients lisibles et poignées tactiles

Statut : terminée sur `work/lot50-07-ingredients`, sans fusion.
Cartes sur deux colonnes, poignées et actions de 48 px, recherche et choix nommés. Choix réel de levure, ajout par toucher et dépôt par événements tactiles Chromium vérifiés. Le scénario initial alternant CDP et Playwright après dépôt échouait sur la détection du clic suivant ; le scénario final teste la sélection avant le dépôt, sans prétendre couvrir cette alternance. Le test recette-mobile existant passe aussi : sept onglets, ajout, dépôt après défilement et remise à zéro.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/07-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les quantités de la cuve et les moments d’ajout du houblon au tactile.


## Lot autorisé de 50 — mission 06 : Fournisseurs : catalogue tactile et achats nommés

Statut : terminée sur `work/lot50-06-fournisseurs`, sans fusion.
Catégories et filtres lisibles, recherche nommée, cartes et boutons de 48 px, verrouillage explicite. Achat réel contrôlé : débit exact, ingrédient possédé, retrait des achats restants, recherche vide et persistance vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/06-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les cartes d’ingrédients de la brasserie et leurs gestes tactiles.


## Lot autorisé de 50 — mission 05 : Options : préférences lisibles et tactiles

Statut : terminée sur `work/lot50-05-options`, sans fusion.
Captures corrigées : viewport réel plutôt que découpe longue débordant du conteneur défilant ; missions 04 et 05 rejouées à 320/390 px.
Cartes et bascules de 48 px, sélection explicite. Sons, gestes expert, bac à sable, aller-retour débutant/expert, persistance après rechargement et annulation sans effacement vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/05-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Moderniser le catalogue des fournisseurs et contrôler un achat réel.


## Lot autorisé de 50 — mission 04 : Recherche : cartes et ajout à la cuve adaptés au tactile

Statut : terminée sur `work/lot50-04-resultats`, sans fusion.
Cartes continues, texte lisible, boutons de 48 px. Ajout réel de malt, absence de débit et persistance exacte de la recette après rechargement vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/04-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Adapter les préférences de jeu au tactile et vérifier leur persistance.


## Lot autorisé de 50 — mission 03 : Recherche : commandes accessibles et résultats annoncés

Statut : terminée sur `work/lot50-03-recherche`, sans fusion.
Champ nommé, saisie et tri tactiles, filtre actif explicite et compteur annoncé. Recherche de pilsner, tri, catégorie réelle et état sans résultat vérifiés ; aucun état école modifié.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/03-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les cartes de résultats et leurs actions utilisables au pouce.


## Lot autorisé de 50 — mission 02 : Fiches : accordéons lisibles et retour aux leçons

Statut : terminée sur `work/lot50-02-fiches`, sans fusion.
Accordéons cohérents avec les cartes de leçons, cibles 48 px et théorie lisible. Ouverture/fermeture conserve exactement le texte ; lien depuis une leçon et retour réel à la veillée sans mutation vérifiés.

Validation : build, six suites Node, contrôle Chromium 320/390 px DPR 2 réussis ;
zéro erreur JS ni débordement, interactions réelles et captures dans
`docs/captures/lot50/02-*`. Capture 390 inspectée. Pas d’Android physique/Safari.
`git diff --check` vérifié. Aucun moteur ni format de sauvegarde modifié.
Prochaine mission : Rendre les commandes de recherche accessibles au pouce.


## Lot autorisé de 50 — mission 01 : publier le main validé

2026-11-11 — reprise après interruption. La branche `work/lot50-01-publication`
était propre et sans commit supplémentaire ; aucune version 12 ni archive locale
n’existait. État GitHub vérifié par fetch : main `43ab1dfa8de628a19b3e1bf72bfe80a7c5932f6d`.
Aucun ancien travail graphique recommencé et aucune PR intermédiaire clôturée.

Publication terminée via le skill Sites : version **12**, source Sites
`9dc6b243987ae16e53cbc3062af9561aa7549925`, déploiement
`appgdep_6af4a86d84a881919fd170c092d54288`, état confirmé `succeeded`.
Adresse et droits `custom` conservés :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site

Build et six suites Node réussis après reprise. Jeu publié et dist/index.html
identiques par SHA-256 :
`6cd7ed5b361c6dd9f1048ff0323ae2b4d440a3720b2a5a9d308ae046cb06665a`.
Archive de sortie avec manifeste existant et dist ; aucun code du jeu ni format
ignem.v1 changé. Les captures réelles et CI complète du code sont déjà conservées
dans main ; cette mission modifie uniquement la publication et le présent journal.
Identifiant temporaire renouvelé après reprise, transmis uniquement sur stdin au
script de synchronisation Git, puis sauvegarde et déploiement natifs Sites.

Prochaine mission : harmoniser les accordéons des fiches techniques, sans changer
les explications scientifiques ni leurs liens depuis les leçons.


## Intégration générale demandée — 2026-11-10

Demande : « Push en main tout tes travaux, dis moi si tout est à jours sur github
et comment y avoir acces ». État local propre avant reprise et fetch effectué.
Les séries Chai et Pigeonnier sont déjà dans main `9680401` ; les dix branches
Veillée restantes aboutissent au commit `2a0b124a113b47830f4798674a4bd1af99912452`.
La branche `work/integration-generale` rassemble ces travaux et ce relevé, pour
fusion autorisée dans main. Aucun changement de code supplémentaire.

CI finale **entièrement réussie** sur le code de la dernière série :
https://github.com/Maxoum-db/Ignem-custodimus/actions/runs/42905561181
Build reproductible, six suites Node, trente scénarios mobiles, rendus et parcours
normal/gestes chronométrés/Ulysse expert et débutant tous réussis. Le présent
complément est documentaire ; identité du code et des HTML vérifiée avant fusion.
L’état effectif de fusion et le SHA final sont consultables dans la PR
« Intégrer tous les travaux validés dans main » et dans l’historique de main.

Accès GitHub : https://github.com/Maxoum-db/Ignem-custodimus/tree/main
Jeu autonome : https://github.com/Maxoum-db/Ignem-custodimus/blob/main/dist/index.html
Télécharger ce HTML via le bouton de téléchargement GitHub, puis l’ouvrir dans
un navigateur ; pour les tests automatisés, le servir par HTTP local.
Site existant vérifié actif, version 11 :
https://promethee-ignem-custodimus.maximilien92.chatgpt.site
Ce site n’a pas été republié pendant l’intégration GitHub. Ses droits sont inchangés.

Les anciennes branches des PR #1–#13 sont des travaux historiques antérieurs aux
trois séries de cette conversation et ne sont pas fusionnées sans réconciliation.
Les branches de travail sont conservées. Prochaine proposition unique : synchroniser
la publication du site avec main, si une version jouable en ligne à jour est souhaitée.


## Veillée — mission 10/10 : Leçons : portraits réutilisés de Lise et Firmin

Statut : terminée sur `work/veillee-10-mentors`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

La fiche indique son mentor avec le portrait existant du dialogue. Décodages Lise 512 px et Firmin 144 px vérifiés ; mise à jour prévue si Firmin finit son chargement après ouverture. École et écus inchangés pendant la lecture. Validation commune des trois séries consignée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Harmoniser la lecture des fiches techniques liées aux leçons, sans modifier leurs textes.


## Veillée — validation commune finale

Dix missions depuis main `9680401` : cartes, statuts/prérequis, théorie,
étapes, progression, réponses de leçons, correction textuelle, quota quotidien,
questions du soir et portraits réutilisés des mentors. Aucune nouvelle fusion
ni publication. Les neuf premières PR de veillée ont leur CI réussie au relevé.
Le run 42901927573 du correctif de parcours précédent est confirmé entièrement
réussi, y compris gestes chronométrés et Ulysse expert/débutant.

Validation locale finale : six suites Node, vingt scénarios des deux séries
précédentes et dix scénarios veillée à 320/390 px, smoke mobile, huit rendus et
parcours complet réussis. Le passage groupé a terminé les vingt anciens scénarios
puis rencontré un timeout de 30 s sur le chargement global pendant v01. Le support
QA attend désormais DOMContentLoaded puis les écrans visés et les décodages
explicites ; les dix scénarios veillée ont été rejoués avec succès, ainsi que les
deux familles de navigation précédentes. Assertions et règles du jeu inchangées.
HTML reproductibles par SHA-256, syntaxe JS et diff vérifiés. Aucun diff des moteurs.
Les parcours chronométrés ont été rejoués au préalable avant fusion du pigeonnier.

Fichiers de cette série : `jeu/src/style.css`, `jeu/src/jeu.js` (présentation),
`dist/index.html`, `dist/artefact.html`, `jeu/tests/veillee/`, support partagé
`jeu/tests/finitions/support.cjs`, workflow de validation, présent journal et
captures réelles `docs/captures/serie/v01-*` à `v10-*`, actualisées sur le code final.
Aucun nouveau format de sauvegarde ni nouvelle ressource graphique source :
les portraits sont ceux déjà intégrés au dialogue du jeu. Pas de test sur appareil
Android physique ou Safari ; nouvelle CI du dernier commit à vérifier après push.

Arrêt après la dixième mission. Prochaine proposition unique : harmoniser la
lecture des fiches techniques accessibles depuis les leçons, sans changer les textes.


## Veillée — mission 09/10 : Questions du soir : réponses tactiles et correction textuelle

Statut : terminée sur `work/veillee-09-questions`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cibles de 48 px et texte de correction indépendant de la couleur. Une réponse erronée ne rapporte rien et consomme une question ; la correcte suivante rapporte quatre écus. Verrouillage et passage à la suivante conservés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Réutiliser les portraits de Lise et Firmin dans les fiches de leçons.


## Veillée — mission 08/10 : Questions du soir : progression quotidienne visible

Statut : terminée sur `work/veillee-08-quotidien`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Jauge accessible de zéro à cinq reprenant le compteur existant. Cinquième question correcte : +4 écus et compteur à cinq ; question suivante en entraînement sans gain ni dépassement du compteur, conformément aux règles existantes.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la correction des questions du soir lisible sans couleur.


## Veillée — mission 07/10 : Quiz de leçon : correction textuelle et repère de question

Statut : terminée sur `work/veillee-07-correction`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute Bonne réponse et Ton choix en texte, un statut de correction et Question N sur 3. Erreur réelle, conservation de la validation incomplète et passage à la question suivante vérifiés. Contrôle des cibles de la mission 6 rejoué avec les nouveaux libellés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la limite quotidienne des questions visible et vérifiable.


## Veillée — mission 06/10 : Quiz de leçon : réponses au pouce et focus visible

Statut : terminée sur `work/veillee-06-reponses`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Quatre cibles au moins 48 px, texte lisible et focus clavier. Une réponse réelle verrouille les quatre choix et indique la bonne réponse ; le quiz ne se valide pas après une seule question.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Ajouter une correction textuelle et un repère de question.


## Veillée — mission 05/10 : Leçons : progression réelle du défi et du quiz

Statut : terminée sur `work/veillee-05-progression`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Jauge accessible sur deux étapes en lecture seule. Contrôle 0/2 puis défi validé 1/2, trois réponses correctes via les vrais boutons et complétion 2/2 ; récompense exacte de 15 écus vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Agrandir les cibles des réponses du quiz de leçon.


## Veillée — mission 04/10 : Leçons : deux étapes lisibles et actions préservées

Statut : terminée sur `work/veillee-04-etapes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Défi et Trois questions dans des cartes séparées et arrondies. Démarrage réel de la leçon et bouton Y aller vers la brasserie vérifiés ; école et écus conservés pendant cette navigation.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Afficher la progression réelle des deux étapes.


## Veillée — mission 03/10 : Leçons : lecture confortable de la théorie

Statut : terminée sur `work/veillee-03-lecture`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Titres et paragraphes agrandis, interlignage et largeur de lecture adaptés, récompense dans un encadré. Texte de théorie comparé exactement au moteur école ; lecture sans début ni progression supplémentaire vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Habiller les deux étapes sans déplacer leurs commandes.


## Veillée — mission 02/10 : Leçons : états et prérequis lisibles

Statut : terminée sur `work/veillee-02-statuts`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Statuts distincts et noms accessibles explicites ; cartes verrouillées lisibles sans transparence. Le prérequis réel continue de désactiver la leçon et sa validation la déverrouille. Lecture seule sans mutation vérifiée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/02-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v02-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Améliorer la lecture des textes de théorie et des récompenses.


## Veillée — mission 01/10 : Veillée : cartes de leçons lisibles au pouce

Statut : terminée sur `work/veillee-01-lecons`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Reprend les tailles et arrondis utiles de la finition historique. Les dix leçons et leurs actions restent identiques ; ouverture/retour sans modification de école vérifiés. Intégration préalable du pigeonnier et rejeu des gestes consignés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/veillee/01-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/v01-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Distinguer les états et prérequis des leçons.


## Troisième série — reprise vérifiée

Demande : « Push en main puis etape sur 10 d’affiler ». État propre, journal/main et PR #47 relus. Après correction minimale du contrôle de navigation, les trois parcours locaux GESTES_REELS, ULYSSE_REEL expert et débutant ont réussi. PR #47 reciblée sur main et fusionnée avec SHA attendu 9c9c032 ; origin/main confirmé à `9680401271eace9de15ff62b9b301fa714f8b51a`. CI du correctif encore en cours au moment de cette intégration ; tests locaux concernés réussis. Nouvelle série de dix branches/PR empilées, sans fusion ni publication de ces nouveaux travaux. Styles historiques comparés avant reprise.

## Reprise avant intégration du pigeonnier

Autorisation : « Push en main puis etape sur 10 d’affiler ». Audit du run 42900258537 : les vingt scénarios et le parcours normal ont réussi ; le parcours GESTES_REELS a échoué en cherchant tab-malts sans écran de destination confirmé. Correction minimale de jeu/tests/parcours.cjs : attendre le domaine prêt, cliquer le vrai lieu, puis attendre son écran visible. Aucun code du jeu modifié. Rejeu local des gestes et des parcours Ulysse expert/débutant lancé avant fusion ; les résultats seront consignés dans la reprise de la série veillée. Syntaxe et diff contrôlés.

## Pigeonnier — mission 10/10 : Pigeonnier : états vides utiles et navigation de reprise

Statut : terminée sur `work/pigeonnier-10-etats-vides`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Comptoir sans client et cave vide affichés en cartes lisibles. Le bouton Préparer une bière ouvre réellement la brasserie sans modifier stock, points ou écus. Validation commune et correctif des fixtures CI documentés ; aucune autre mission commencée.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Harmoniser les cartes de leçons de la veillée sans modifier les quiz.


## Pigeonnier — validation commune de la deuxième série

Dix missions depuis le main intégré `a0a536d` : portraits SVG historiques,
demandes sur parchemin, bouteilles de cave, propositions tactiles, réputation,
satisfaction, échéances, stocks partiels, négociant et états vides. Aucun nouveau
travail fusionné ; première série intégrée auparavant via #37 sur autorisation.
Branches/PR empilées pour une revue et une reprise indépendantes.

Validation finale locale : six suites Node, les vingt scénarios des deux séries
à 320/390 px, smoke mobile, huit rendus et parcours complet jusqu’au spiritueux
vieilli/vente réussis. Reconstruction des deux HTML reproductible par SHA-256,
syntaxe JS et diff contrôlés. Aucun diff dans les moteurs métier ni le format de
sauvegarde. Captures réelles du code final actualisées. Pas d’Android physique,
Safari ni rejeu des gestes chronométrés complets dans cette exécution.

Les CI initiales des missions 1–4 sont réussies. Les runs 42898154811 et
42898500140 ont révélé des cartes absentes à la lecture immédiate dans les tests
01/03. Correctif du support QA dans la dernière mission : attente du domaine prêt
et de l’écran réellement visible ; fixture injectée une seule fois avant le
lancement du jeu avec addInitScript, plutôt que sur une page active. Les dix
contrôles pigeonnier et les deux destinations de navigation ont réussi après ce
correctif. Le délai du job CI passe à 15 minutes pour les vingt scénarios et les
parcours existants. La CI du dernier commit corrigé est à vérifier après push.
Les échecs intermédiaires ne sont pas présentés comme des validations réussies.

Pour les états sans client, le test utilise les vrais boutons de congé après la
génération normale du jeu ; il ne suppose pas que le chargement laisse le comptoir
vide. Les écus des fixtures sont normalisés pour éviter la migration historique.
La pénalité de vente partielle est comparée au moteur avant tout arrondi.

Arrêt après la dixième mission. Prochaine proposition unique : harmoniser les
cartes de leçons de la veillée sans modifier les quiz. Aucun déploiement Sites
pendant cette série ; la publication existante est conservée.


## Pigeonnier — mission 09/10 : Négociant : confirmation avec quantité et prix exacts

Statut : terminée sur `work/pigeonnier-09-negociant`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

La première action précise que tout le stock est concerné ; la seconde affiche quantité et montant. Premier clic sans mutation, second clic avec 100 L retirés et 12 écus crédités vérifiés ; clients et ventes au détail inchangés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les états de cave vide utiles et cohérents avec le jeu.


## Pigeonnier — mission 08/10 : Stocks : alerte lisible et ventes partielles conservées

Statut : terminée sur `work/pigeonnier-08-stocks`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Quantité de cave mise en évidence et avertissement distinct si le stock ne couvre pas la demande. Vente partielle réelle de 4 L sur une demande de 10 L vérifiée, stock vidé et pénalité comparée au moteur non arrondi. Première attente de test corrigée pour ne pas arrondir avant la pénalité.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Clarifier la confirmation de cession au négociant.


## Pigeonnier — mission 07/10 : Commandes : échéances explicites et livraison limite vérifiée

Statut : terminée sur `work/pigeonnier-07-commandes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Badge calculé depuis échéance moins calendrier, avec texte cette semaine au dernier délai. Livraison au dernier délai vérifiée : 20 L retirés, prime 60 écus et réputation +4, commande supprimée. Le médaillon distingue la commande spéciale.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Signaler les stocks insuffisants sans bloquer les ventes partielles existantes.


## Pigeonnier — mission 06/10 : Vente : satisfaction réelle dans le bilan

Statut : terminée sur `work/pigeonnier-06-satisfaction`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Le bilan annonce poliment le résultat et affiche une jauge de satisfaction issue de derniereVente.s. Pourcentage comparé au moteur Vente.satisfaction ; recette encaissée comparée au crédit réel. Aucun nouveau calcul commercial.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les échéances des commandes spéciales explicites.


## Pigeonnier — mission 05/10 : Pigeonnier : réputation chiffrée et accessible

Statut : terminée sur `work/pigeonnier-05-reputation`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Affiche la valeur réelle sur 100 et le rôle meter sur la jauge. Vente réelle vérifiée : texte, attribut et sauvegarde suivent exactement la réputation calculée par le jeu.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre la satisfaction réelle visible dans le bilan de vente.


## Pigeonnier — mission 04/10 : Vente : propositions tactiles sans texte comprimé

Statut : terminée sur `work/pigeonnier-04-propositions`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes de produits arrondies et commandes sur une rangée dédiée jusque 440 px. Vente réelle testée : 10 L retirés, écus crédités, client retiré et compteur incrémenté. Les noms longs gardent leur largeur utile.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Afficher la réputation réelle en chiffres et jauge accessible.


## Pigeonnier — mission 03/10 : Cave : bouteilles lisses aux couleurs réelles

Statut : terminée sur `work/pigeonnier-03-bouteilles`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Transforme les pastilles rectangulaires en bouteilles à col et étiquette, sans image réseau. Les trois catégories bière, eau-de-vie et spiritueux vieilli gardent leurs couleurs calculées distinctes. Stock strictement conservé pendant le rendu.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Adapter les cartes de proposition au pouce sur petit écran.


## Pigeonnier — mission 02/10 : Clients : demandes sur parchemin et cartes lisibles

Statut : terminée sur `work/pigeonnier-02-demandes`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes arrondies, paroles sur parchemin et typographie lisible. Ouverture du conseil sans mutation et congé du seul client choisi sans transaction vérifiés. Fixture complétée avec possede pour ne pas déclencher une migration historique des écus au premier enregistrement.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/02-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p02-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Illustrer les bouteilles des produits en cave.


## Pigeonnier — mission 01/10 : Pigeonnier : portraits illustrés des clients

Statut : terminée sur `work/pigeonnier-01-portraits`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Réutilise exactement les visages SVG du habillage historique, sans observer ni système parallèle. Les portraits sont déterministes par nom, décodés hors réseau et stables en ouvrant une fiche ; état de vente inchangé. Fusion autorisée de la première série dans main consignée dans le journal.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/pigeonnier/01-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/p01-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Habiller les demandes des clients en cartes lisibles.


## Reprise de la deuxième série

Demande : « Etape une dizaine apres push en main ». État local propre, main/branches/journal et PR vérifiés. CI finale de la première série réussie (run 42895803234). PR #37 reciblée sur main puis fusionnée avec SHA attendu ; les dix commits précédents sont intégrés à `a0a536d5b0c8cd628127fdcf1f32071cb098e991`, confirmé par fetch. Nouvelle série de dix branches et PR empilées depuis ce main. Les nouveaux travaux ne seront pas fusionnés sans nouvelle autorisation. Le site reste à sa publication existante.

## Série autorisée — mission 10/10 : Bâtiments : niveaux lisibles et travaux vérifiés

Statut : terminée sur `work/serie-10-batiments`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Niveaux affichés en texte et accessibles, pastilles lisses et cartes lisibles à 320 px. Lancement réel des travaux vérifié : débit des écus et chantier sauvegardé, niveau inchangé avant la fin. Validation commune de la série consignée ci-dessous, avec captures finales actualisées.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/10-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/10-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Auditer puis réutiliser les portraits illustrés des clients du pigeonnier, sans commencer ici.


## Série de dix — validation commune avant livraison

Demande utilisateur : « Étape — Peux-tu en enchaîner une dizaine ? ».
Dix missions successives, branches/PR empilées depuis main `de0d7cc` ; aucune
fusion ni publication pendant cette série. La version Sites 11 reste inchangée.
Les anciennes PR #1–#13 ont été examinées à la reprise et restent hors périmètre.
Aucune modification locale préalable ; aucune branche main utilisée pour travailler.

Les dix scénarios mobiles indépendants ont été rejoués sur le code final, à
320/390 px, DPR 2 : rangement/sortie de la cour, achat catalogue, sélection/états,
repères du plan, prévision non destructive, robe de la pipette, assemblage de cuves,
profil aromatique, notifications/mouvement réduit et lancement de travaux.
Le premier passage groupé a rencontré un timeout de navigation à 7 secondes sous
charge ; délai de navigation du support de test porté à 30 secondes, puis les
scénarios restants ont réussi. Délai des assertions inchangé. Fixture bâtiment
complétée avec les listes normales de vente et tolérance du tableau travaux absent ;
aucun correctif du moteur nécessaire. Captures de la série actualisées sur le code
final, plutôt que des maquettes.

Validation commune : six suites Node, smoke mobile, huit rendus et parcours
complet jusqu’au spiritueux vieilli/vente réussis. Reconstruction reproductible des
deux HTML par comparaison SHA-256 avant/après build, `node --check` et
`git diff --check` réussis. Diff nul sur les moteurs métier. Pas de test sur
Android physique ni Safari ; gestes chronométrés complets non rejoués localement.
CI GitHub confirmée réussie pour les missions 1–8 ; mission 9 encore en cours
au relevé. La CI du dernier commit sera à vérifier après son push.

Après la dixième mission, arrêt de la série. Prochaine proposition unique :
réutiliser les portraits illustrés des clients du pigeonnier, après audit des
branches historiques pour éviter toute recréation.


## Série autorisée — mission 09/10 : Animations : notifications et radar lisibles en mouvement réduit

Statut : terminée sur `work/serie-09-notifications`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Supprime le rendu en pas des notifications et conserve leur retrait normal à 3,3 s. En mouvement réduit, toast visible sans translation ni disparition immédiate et radar visible sans délai. Capture radar actualisée après constat du délai de animation. Test de notification déclenché par assemblage puis vraie erreur de finition, le déplacement normal ne produisant pas de toast.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/09-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/09-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les niveaux des bâtiments lisibles et vérifier le lancement des travaux.


## Série autorisée — mission 08/10 : Chai : profil aromatique sans libellés coupés

Statut : terminée sur `work/serie-08-profil`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute une marge au radar du chai sans changer les points ni son échelle. Tous les libellés sont contrôlés à intérieur du SVG. Le nom accessible donne les valeurs calculées sur 10, mises à jour avec la prévision.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/08-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/08-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Conserver les notifications lisibles en mouvement réduit et lisser leur entrée.


## Série autorisée — mission 07/10 : Chai : cuves attente lisibles et tactiles

Statut : terminée sur `work/serie-07-cuves`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Cartes arrondies, sélection visuelle claire, libellés au moins 44 px et actions empilées à 320 px. Assemblage réel de deux cuves de 50 L testé : 100 L conservés, fûts inchangés. La simple sélection ne modifie pas les cuves.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/07-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/07-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Corriger les libellés coupés du profil aromatique du chai.


## Série autorisée — mission 06/10 : Chai : verre de pipette illustré et robe réelle

Statut : terminée sur `work/serie-06-verre-chai`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Remplace le carré de couleur de la fiche du fût par un verre lisse à reflets, avec un nom accessible en EBC. Le rendu reprend strictement la couleur calculée du lot ; son changement avec la prévision et la conservation du contenu sont vérifiés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/06-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/06-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Rendre les cuves attente et leur sélection confortables sur mobile.


## Série autorisée — mission 05/10 : Chai : distinguer la prévision du vieillissement réel

Statut : terminée sur `work/serie-05-prevision`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Bandeau de statut actuel ou projeté, relié au curseur et actualisé depuis la valeur de prévision existante. Valeurs réellement mises à jour ; lot en fût et calendrier strictement inchangés lors de la projection et du retour à zéro.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/05-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/05-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Remplacer le carré de robe par un verre de dégustation lisse.


## Série autorisée — mission 04/10 : Chai : repères lisibles pendant le défilement

Statut : terminée sur `work/serie-04-reperes-chai`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Repères de rangées fixes pendant le défilement horizontal, retour à la ligne sur petit écran, consigne de glissement et région du plan focalisable au clavier. Position des repères et focus vérifiés après défilement complet à dix travées.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/04-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/04-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Distinguer clairement prévision et vieillissement réel.


## Série autorisée — mission 03/10 : Chai : états des fûts et sélection accessibles

Statut : terminée sur `work/serie-03-etats-futs`, sans fusion. Autorisation utilisateur d’enchaîner
une dizaine de missions ; branches et PR empilées pour conserver l’ordre.

Ajoute aria-pressed sur les fûts du plan et de la cour et un nom complet dans la cour. Les badges Vide et En fût correspondent à la présence réelle du contenu. Changement de sélection et conservation intégrale du chai vérifiés.

Validation locale : build, six suites Node et test navigateur
`jeu/tests/finitions/03-*.test.cjs` réussis à 320/390 px, DPR 2 ; zéro erreur
console/pageerror ni débordement horizontal. Captures réelles dans
`docs/captures/serie/03-*`, inspection de la capture 390. `git diff --check`
contrôlé avant commit. Chromium système hors bac à sable pour le serveur local.
Pas d’Android physique ni Safari. Aucun moteur ni format de sauvegarde modifié.

Prochaine mission : Conserver les repères du plan pendant le défilement mobile.


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
