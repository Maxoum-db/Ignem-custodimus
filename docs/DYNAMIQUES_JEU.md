# Domaine vivant et vérification des dynamiques

Mission du 17 novembre 2026, branche `work/domaine-vivant`.
Le transfert de l'ancienne partie est abandonné à la demande du joueur.

## Animations livrées

Le domaine existant reçoit des poules qui marchent et picorent, un chat qui
se promène, un cheval qui respire et se balance, des pigeons en vol près du
colombier construit, un potager au vent et des papillons au printemps/été.
Les lanternes varient doucement la nuit ; des lucioles apparaissent aux saisons
chaudes. Pétales printaniers, feuilles tournoyantes et neige dépendent de la saison.
Les abeilles existantes restent présentes.

Aucun moteur, calcul de rendement, stock ou format de sauvegarde n'est modifié.
Ces effets utilisent le renderer et la boucle existants, plafonnés à 30 dessins/s.
Mesures locales sur une seconde : 24 dessins à 320 px et 22 à 390 px ; ce sont
des mesures du navigateur de test, pas une garantie de performances sur téléphone.
Le mode mouvement réduit fige le rendu ; quitter le domaine arrête ses dessins.
Les déplacements des poules et du chat s'arrêtent la nuit.

## Vérifications reproductibles

Exécuter depuis la racine, avec Playwright et Chromium installés :

```sh
npm run build:jeu
npm run test:jeu
node jeu/tests/domaine.cjs
node jeu/tests/domaine-vivant.cjs
node jeu/tests/dynamiques-depart.cjs
node jeu/tests/finitions/10-batiments.test.cjs
node jeu/tests/veillee/08-quotidien.test.cjs
node jeu/tests/parcours.cjs
GESTES_REELS=1 node jeu/tests/parcours.cjs
ULYSSE_REEL=1 node jeu/tests/parcours.cjs
MODE_JEU=debutant ULYSSE_REEL=1 node jeu/tests/parcours.cjs
```

Pour les deux nouveaux tests, `CHROMIUM_PATH=/usr/bin/chromium` sélectionne
le navigateur système si celui de Playwright n'est pas installé. Les anciens
tests ont été exécutés localement avec un préchargement temporaire équivalent.
Les parcours utilisent des sauvegardes synthétiques isolées, sauf
`dynamiques-depart.cjs`, qui commence une véritable nouvelle partie.

## Résultats fonctionnels

- Six suites Node réussies : brassage, distillation, chai, école, vente, images.
- Domaine : accès, niveaux/chantiers, repli si image absente, saisons/jour/nuit,
  DPR 2, cibles tactiles et absence de débordement à 320/390 px vérifiés.
- Animations : pixels réellement différents dans les régions des cinq sujets
  animés, huit variantes saison/nuit distinctes, quatre contextes normal/réduit
  réussis, état et sauvegarde inchangés pendant l'animation, aucune erreur JS.
- Nouvelle partie : recette de 100 L, 20 kg de malt et 30 g de houblon,
  brassage avec étapes passées, puis 100 L en stock, un brassin, une semaine
  écoulée et des points/écus gagnés. Le montant dépend du résultat ; les mesures
  JSON décrivent un essai et ne garantissent pas le même gain à chaque partie.
- Construction : dépense et chantier contrôlés, aucun niveau acquis avant terme.
- Quotidien : récompense du cinquième jour, aucune récompense supplémentaire
  au sixième sur le scénario testé.
- Parcours avec étapes passées : brassage, vente avec baisse du stock et recette,
  achat conservé après rechargement, Ulysse, dégustation aveugle, chai,
  vieillissement, embouteillage, boutique et wash réussis.
- Brassage avec gestes réels : parcours complet réussi.
- Ulysse expert et débutant avec deux chauffes et coupes réelles : parcours réussis.

## Preuves et limites

Les captures et `domaine-reel.webm` dans `docs/captures/domaine-vivant/`
proviennent du vrai HTML construit, avec un domaine avancé de test pour rendre
visibles tous les bâtiments. La vidéo enregistre directement le canvas du jeu
pendant cinq secondes. Ce ne sont ni des maquettes ni la partie personnelle.

Trois premiers parcours lancés en parallèle ont expiré au chargement (5 s).
Le délai de navigation du test est désormais 30 s ; les actions restent à 5 s.
Un autre essai a expiré au clic initial sur le retour au domaine, avant toute
action de brassage ; sa cause n'est pas établie. Ces échecs ne sont pas présentés
comme des réussites. Les relances isolées du brassage réel et d’Ulysse expert ont réussi.
Le JSON conserve l’échec et les réussites suivantes.

Cet audit valide des parcours fonctionnels et les calculs couverts par les tests,
pas l'équilibrage économique exhaustif ni toutes les recettes possibles.
Android physique, Safari iOS, autonomie et longues sessions indisponibles ici.
Le domaine et l’empâtage ont été fusionnés et publiés sur Pages au main
`f1cdf0f` le 17 novembre 2026, à la demande explicite du joueur. La filtration
et les dix animations complémentaires ont ensuite été intégrées via #117 au main
`790ad6a`, à la demande « Push tout en main », et leur publication réelle vérifiée.
Voir `docs/validation/publication-animations.json` et le journal actualisé.

Prochaine mission proposée, non commencée : animer uniquement l'atelier de
brassage selon ses étapes réelles, avec vérification du mode mouvement réduit.
