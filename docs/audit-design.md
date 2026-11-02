# Audit design — Prométhée

Base : PR #10, `61085e6`. Branche `carte-illustree` conservée dans la chaîne de dépendances ; aucune fusion de `main`.

## Couverture exécutée avant modification

100 états à **390 × 844** et les mêmes 100 états à **768 × 1024**, Chromium, tactile sur téléphone, horloge contrôlée. [Planche avant](../qa/finition/avant/planche.jpg), [manifeste téléphone](../qa/finition/avant/390/rapport.json), [manifeste tablette](../qa/finition/avant/768/rapport.json). Captures individuelles dans ces deux dossiers.

Nouvelle partie, tutoriels, huit saisons/éclairages, travaux, sept onglets et recherche, plan/style, cinq gestes début/cours/bilan et dry hop, brouillis, repasse novice/expert et aveugle, chai/fût/prévision/vieillissement/assemblage/bouteille, clients/conseil/vente/commande, huit fournisseurs, équipement, carnet, chimie, options et quiz. Les états avancés sont des fixtures QA dérivées d'une sauvegarde historique ; leurs actions passent par les vrais contrôles. La duplication explicite d'un lot ne sert qu'à présenter l'assemblage. Aucun compte personnel ni donnée de `data/` modifiés.

**Limites** : le jeu n'a pas d'action de défrichage ; terrains libres et vrais travaux documentés à sa place. Pas d'appareil Android physique ni Safari. Les captures sont celles du viewport, pas la preuve de chaque texte sous la ligne de flottaison. Certaines captures de panneaux sont complétées dans les étapes concernées. Aucune courbe scientifique inexistante ne sera inventée.

## Registre des défauts

Une ligne par défaut. Cases cochées uniquement après vérification de l'étape correspondante. Les constats de code des deux audits sont reliés aux captures, sans être présentés comme des tests interactifs supplémentaires.

| ID / état | Écran | Élément | Problème | Gravité | Correction prévue / étape |
|---|---|---|---|---|---|
| F01 [ ] | Tous | `style.css` deux `:root` + règles littérales | Ancienne palette pixel puis palette sombre, dizaines d'overrides et rayons divergents 4/6/9/10/11/13/14/17/20px | gênant | Section unique de tokens ; 8/12/18px ; supprimer déclarations devenues mortes et centraliser surfaces · étape 1 |
| F02 [x] | Tous | `--f-texte` final | Police système actuelle ; Comic Neue n'est pas intégrée dans les assets, seulement nommée dans l'ancien bloc | cosmétique | Intégrer Comic Neue sous licence ; Lilita titres/boutons/chiffres importants · étape 1 |
| F03 [x] | Tous | `.sprite, canvas` style.css:47 | `image-rendering:pixelated/crisp-edges` générique ; chargé illustré corrige via `.canvas-illustre`, mais replis et certains Canvas directs restent pixelisés | gênant | Lissage générique ; le repli historique reste fonctionnel sans imposer le rendu pixel à tous les Canvas · étape 1 |
| F04 [x] | Dégustation | `#radar svg text`, jeu.js:1890–1897 | Famille inline `Pixelify Sans` encore active et labels11px ; non couverte par les variables globales | gênant | Sélecteur SVG de typographie/tailles, sans recalculer les données du radar · étape 1 |
| F05 [x] | Tous | `.entete`, `.entete-nav`, `.tuto-carte`, `.geste-scene`, `.mentor` | Ombres floues actives de12 à60px, contours bronze très fins : styles disparates vs relief demandé | cosmétique | Un relief bas encre, contours3px et rayons tokenisés · étape 1 |
| F06 [x] | Tous | `.btn-feu` | Texte #fff9e9 sur #bf6b3e : contraste calculé **3,71:1**, sous4,5 | gênant | Encre sur cuivre ou fond plus sombre ; vérifier tous les états · étape 1 |
| F07 [x] | Brasserie | `.bandeau-mesures .mesure .l` | Labels actuels9px ; six mesures réparties en une ligne comprimée | gênant | Taille minimale lisible, éventuellement grille3×2 sur téléphone ; garder sticky top0 demandé précédemment · étape 1 |
| F08 [ ] | Brasserie | `.carte-ing .nom`, `.carte-ing .det` | Dernier override ramène le nom14px et les détails12px malgré anciennes règles17/14 | gênant | Noms18 ou16, texte courant16 ; puces techniques14/12 seulement pour micro-info · étape 1 |
| F09 [ ] | Brasserie | `.poignee` | Zone de drag36×42px, inférieure à44×44 | gênant | Réserver44×44 sans supprimer glisser/déposer · étape 1 |
| F10 [x] | Brasserie et recherche | `.filtre` | Environ28px de haut (13px×1,5 +8px), sans min-height | gênant | Boutons ≥44 ; espacements4/8 · étape 1 |
| F11 [x] | Recette | `.temps button` | Boutons de temps13px avec6px de padding vertical, environ26px | gênant | ≥44 et états pressés lisibles · étape 1 |
| F12 [ ] | Recette / plan | `.lien-fiche`, `.conseil button` | Liens-boutons sans padding : hauteur environ20–21px | gênant | Cible44, soulignement clair, focus visible · étape 1 |
| F13 [ ] | Recette | `.qte input` | Largeur70px figée, unités13px, petit padding ; quantité et nom rivalisent à320px | gênant | Champ44h, chiffres tabulaires, retour à la ligne contrôlé · étape 1 |
| F14 [ ] | Recette | `.plan-tete img` | Ancienne règle pixelated (corrigée en fin CSS), portrait32px et petits sous-textes13px | cosmétique | Portrait44–48 et hiérarchie stable, enlever reliquat CSS · étape 1 |
| F15 [x] | Tous | `.btn-mini`, `.btn-carre` | Min-height42 et min-width40 ; certaines tailles finales restent<44 | gênant | Tokens de cible44 et relief unifié · étape 1 |
| F16 [x] | Tous | `.info-i` style.css:523 | Taille **26×26px**, jamais surchargée ensuite | gênant | Bouton rond44×44, glyphe18, conserver `data-info` et positionnement existants · étape 1 |
| F17 [ ] | Bulles | `#bulle` | Corps15px ; aucune hauteur max/scroll explicite pour longue notice dans petit paysage | gênant | 16px, max-height au viewport, scroll interne, marge12 et focus/fermeture Escape · étape 1 |
| F18 [x] | Mentor | `#mentor-texte`, `.mentor-nom span` | Texte14px et rôle11px ; panneau sombre avec double ombre floue | gênant | Dialogue parchemin, nom Lilita, corps16, rôle14, ombre unique · étape 1 |
| F19 [x] | Mentor | `.mentor-actions .btn` | Min-height final40px, sous44 | gênant | 44px et1–3 boutons enveloppants, aucun bouton métier supprimé · étape 1 |
| F20 [x] | Toast | `.toast` | Panneau brun presque noir à bord bronze, corps12px, animation `steps(8)` | gênant | Bandeau parchemin, icône CSS/SVG, texte16 et entrée/sortie continue · étape 1 |
| F21 [x] | Toast | `toast()` jeu.js:224–228 | Le code autorise **3** enfants, alors que la demande exige2 | cosmétique | Observer de présentation sur `#toasts`, retirer le plus ancien au-delà de2 ; ne pas toucher aux gains ni timers métier · étape 1 |
| F22 [x] | Toast / réduction mouvement | `.toast` + règle globale reduce | `animation-duration:.01s !important` conserve `forwards` et finit en opacity0 ; message peut devenir illisible presque immédiatement | bloquant (accessibilité) | En reduce : animation:none, opacity1 et durée de présence du message conservée · étape 1 |
| F23 [ ] | Tutoriel | `#tuto-voile .tuto-carte` | Carte centrée, sans portrait ni flèche ni découpe autour d'un élément ; ombre60px | gênant | Bulle portrait et masque SVG arrondi lorsque la cible réelle est visible ; pas de cible inventée · étape 4 |
| F24 [x] | Fenêtre style | `.choix-style small` | Détails12px, panneaux à bord sombre répétitif | gênant | Cartes parchemin, dimensions16 ; conserver `data-viser` et descriptions · étape 1 |
| F25 [ ] | Fenêtres | `#style-voile`, `#tuto-voile` | Pas de piège Tab ni gestion Escape en dehors des handlers de clic visibles | gênant | Module de présentation : focus initial/restauration, Tab dans modal visible, Escape déclenche le vrai bouton de fermeture · étape 1 |
| F26 [x] | En-tête | `.entete-niveau .ligne2` | Points12px tronqués par ellipsis, pas de capsules distinctes | gênant | Capsules lisibles ; sources réellement disponibles : écus et points, pas tous stocks/réputation · étape 1 |
| F27 [x] | En-tête | `#retour-entete` | Carré arrondi12 au lieu bouton rond demandé ; confirmation texte peut agrandir la barre | cosmétique | Bouton rond pour état normal, état de confirmation préservé avec texte accessible · étape 1 |
| F28 [x] | En-tête | `#menu-entete` | Panneau presque noir, bordbronze1px et ombre28px ; pas d'icônes | cosmétique | Panneau bois, icônes SVG indépendantes, texte inchangé · étape 1 |
| F29 [ ] | Chai | `.zone-lib` | Libellés12px ; rangée fermée opacity.5 atténue encore le texte | gênant | Texte16/14 et badge climatique clair ; pas d'opacité globale sur tout le libellé · étape 3 |
| F30 [ ] | Chai | `.case`, `.case.cible` | Cases40px et clignotement permanent `steps(2)` lors du placement | gênant | ≥44 si géométrie possible sans changer puzzle ; cible stable, contour/texture et focus · étape 3 |
| F31 [ ] | Chai | `.fut-abr`, `.fut-age`, `.fut-jauge` | Badge8px, âge15, jauge4px ; forte densité au-dessus du fût peint | gênant | Badges lisibles et jauge8–12, conserver `grid-column` et positions réelles · étape 3 |
| F32 [x] | Chai / vente | `.robe`, `.pastille-prod`, `.pastille` | Carrés/rectangles EBC différents :10,14×30,16,34px ; pas de reflet commun | cosmétique | Disque « verre vu du dessus », même composant ; réutiliser la couleur déjà calculée dans `style.background` · étape 3 |
| F33 [ ] | Pigeonnier | `.client`, `.demande`, `.client .det` | Demande italique seule, détails13px, portrait36px ; pas de vraie bulle | cosmétique | Carte portrait44/48, bulle de demande16, métadonnées14 · étape 3 |
| F34 [ ] | Pigeonnier | `.vente-resultat` | Classe ok/ko, texte de résultat ; pas de jauge de satisfaction DOM | cosmétique | Jauge alimentée par `derniereVente.s` via un raccord de présentation ou élément déjà calculé ; ne pas deviner un pourcentage depuis la couleur · étape 3 |
| F35 [ ] | Fournisseurs | `.article.hors` | Opacité.55 sur carte entière fait baisser le contraste texte et bouton | gênant | Conserver texte contrasté, badge verrouillé et bouton désactivé explicite · étape 3 |
| F36 [ ] | Carnet | `.bouteille span`, `.carnet-detail p`, `.succes-item` | Noms11px dans colonnes64px, détails14, succès13px/opacité.6 | gênant | Mise en page livre, noms16, colonnes élargies ; texture discrète et pages parchemin · étape 3 |
| F37 [ ] | Fiches | `.fiche`, `.fiche summary`, `.fiche .contenu` | Sections uniformes sombres, pas de hiérarchie livre ; code VT323 historique et formules parfois simples chaînes | cosmétique | Parchemin, sous-titres, tables alternées, `<sub>/<sup>` sur copies textuelles exactes uniquement · étape 3 |
| F38 [ ] | Jury | `.fiche-jury`, `#fiche-jury table` | Feuille sombre et bord1px ; séparateurs pointillés, labels15px, pas de hiérarchie note/médaille | cosmétique | En-tête parchemin, valeur28/36 Lilita, médaille et lignes16 ; garder valeurs/plafonds exacts · étape 3 |
| F39 [ ] | Défauts | `.gravite`, `.defaut p` | Carrés ■□ et police9px, texte14 ; marqueurs rétro | cosmétique | Puces/gouttes SVG, aria-label gravitéN/3, texte16 · étape 3 |
| F40 [ ] | Veillée | `.lecon small`, `.question .module`, `.reponses button` | Métadonnées13px, réponses14px avec box-shadow cadre | gênant | Cartes16, boutons44 minimum ; résultats juste/faux avec texte/icône, pas couleur seule · étape 3 |
| F41 [ ] | Bâtiments | `.niveaux i`, `.prochain` | Petits carrés14px et cadres sombres emboîtés, pas de statut textuel de niveau accessible sur les cases | cosmétique | Badges de niveau/parcours, texte niveauN/M issu du nombre de `.plein`, panneaux bois/parchemin · étape 3 |
| F42 [ ] | Options | `.reglage p`, `.infos-version`, `.bascule` | Textes14/13px et interrupteurs génériques hétérogènes | gênant | Texte16, switch44, groupes de réglages cohérents, conserver ids/handlers · étape 3 |
| F43 [x] | Empâtage | Thermomètre | Échelle 55–78°C et graduations de 5px logiques, trop petites ; cible/prediction montrées seulement par zones/traits | gênant | Graduations °C, courte légende cible/prévision, pastille de valeur sans changer T ni cible · étape 2 |
| F44 [x] | Empâtage | Jauges vapeur | Trois styles de couleurs (braise/cuivre/vert) ; pression passe au vert plutôt qu'une convention stable chaleur/cuivre et cible/vert ; valeurs en % pour vanne/enveloppe sans explication de nature | gênant | Style unique des barres ; même palette ; garder pourcentages existants, vrai bar sur pression · étape 2 |
| F45 [x] | Filtration | Densité | La densité des derniers jus n'est qu'un bloc texte ; cuve/bac montrent visuellement volume et eau mais sans échelle numérique | gênant | Mettre SG et L en pastilles lisibles ; graduation cm sur eau et L sur bac ; ne pas inventer une série historique · étape 2 |
| F46 [x] | Filtration | Cible volume | Ligne verte fixe dans le dessin, pas de légende locale explicite | cosmétique | Ajouter « volume cible » ou repère lisible depuis valeurs transmises uniquement · étape 2 |
| F47 [x] | Ébullition | Frise houblons | Repères/frise et boutons peuvent porter plus d'information que la scène ; aucun axe numérique dans l'illustration | cosmétique | Harmoniser frise, pastille minutes et statut des ajouts ; ne pas inventer une courbe T°C non transmise · étape 2 |
| F48 [x] | Fermentation | Tracé T° | Historique dessiné par points isolés de .8px logique ; pas de ligne continue | gênant | Relier par courbe SVG/canvas, interpolation monotone ou linéaire sans dépassement artificiel des échantillons · étape 2 |
| F49 [x] | Fermentation | Axes | Zone utile seulement 90×75 logique ; libellés 4.5–5.5px logique (~8–10px CSS à 390px) ; seules bornes Tmin/Tmax et J0/J7 | gênant | Graphique HTML/SVG pleine largeur sous l'équipement, échelle jours/°C complète, police d'axes ≥12px CSS · étape 2 |
| F50 [x] | Fermentation | Valeur actuelle | Trait vertical temps mais pas de pastille T qui suit le dernier échantillon | gênant | Point courant et pastille de la vraie dernière valeur, limitée au cadre · étape 2 |
| F51 [x] | Fermentation | Cible + dry hop | Même vert utilisé pour bande de tolérance T° et fenêtres DH ; sens dépendant du texte tutoriel | gênant | Bande cible verte pâle, DH hachures/repère houblon et labels DH1/DH2 ; légende courte séparant deux sens · étape 2 |
| F52 [x] | Fermentation | Repos diacétyle | Cible augmente réellement de 4°C à J5 ; un lissage naïf des limites gommerait ce changement | bloquant si lissage erroné | Conserver le palier discontinu de la cible, lisser seulement la série observée sans inventer de dépassement · étape 2 |
| F53 [x] | Bouteilles | CO₂ | Pas de graphique CO₂ historique ; trois valeurs (calculé/cible/résiduel), curseur sucre et verdict suffisent mais sont visuellement distincts | gênant | Jauge comparative actuelle/cible et puces, g/L et vol.CO₂ explicites ; conserver seuils/valeurs du moteur · étape 2 |
| F54 [x] | Brouillis | Chauffe | Jauges HTML en % sans unités explicites de nature ; barres/styles restent différents des instruments | gênant | Composant jauge partagé ; garder % de flamme/chaudière/mousse/bière et dénomination · étape 2 |
| F55 [x] | Repasse novice | Éprouvette | Graduations 40/50/60/70/80 sans symbole local % ; petit corps de légende (4.3px logique) | gênant | Unité % vol affichée ; type lisible ; fraction active identifiée texte+couleur · étape 2 |
| F56 [x] | Repasse expert | Courbes | Cadre brun presque noir à liseré or ; courbes fines .8px logique ; axes minuscules 4.2px ; aucune graduation X numérique ; degré blanc sans axe droit | gênant | Panneau parchemin, vrais axes récupération % et degré % vol, légende compacte et repères de coupe ; ≥12px CSS · étape 2 |
| F57 [x] | Repasse expert | Unité logarithmique | Axe Y 0.01/0.1/1/10/100 non décrit dans la scène, uniquement via bulle | gênant | Libellé « × seuil de perception (log) » ; ne jamais afficher mol ou g sur cet axe · étape 2 |
| F58 [x] | Dégustations | Radars SVG | Deux implémentations proches ; font-family inline Pixelify Sans, font-size11 ; grille var(--pierre) très peu contrastée sur fonds nuit | gênant | CSS commun aux radars + police de lecture, grille plus claire, labels ≥12px CSS, valeur actuelle explicitement disponible · étape 2 |
| F59 [x] | Chai | Radar et prévision | Il n'existe pas de graphique d'extraction temporelle : curseur horizon + radar/valeurs en prévision ; distinction réel/prévision texte peu visible | gênant | Puce PRÉVISION très claire, radar partagé ; éventuelle nouvelle série uniquement échantillonnée par moteur existant et état transmis en lecture seule · étape 2 |
| F60 [x] | Partout | EBC | `.pastille`, `.robe`, `.pastille-prod`, `teinte` et verre utilisent géométries différentes ; couleur vraie déjà issue de Moteur.couleurRVB | cosmétique | Même composant rond à reflet via CSS, conserver background inline calculé et chiffre EBC adjacent · étape 2 |
| F61 [ ] | Chai | Fûts | Type abrégé BOU/FR/DOM/CAH etc., âge parfois 1 décimale et rangées emoji ☀≈❄ ; manque de légende stable | gênant | Badge type lisible, âge et niveau contrastés, labels Haut/Milieu/Bas ; ne pas toucher largeur en travées/clics · étape 2 |
| F62 [x] | Toutes jauges | Accessibilité | `jaugesFeu` renvoie des div/span/i sans role=progressbar, bornes ni valeur sémantique | gênant | Adapter en présentation via MutationObserver ou fonction de markup seule ; conserver chiffres et commandes · étape 2 |

## Images demandées à la mission visuels

Aucune grande illustration nécessaire à ces quatre étapes. Demande non bloquante : une ruche isolée transparente, dans la palette des bâtiments existants, et son petit couvre-cadre séparé, pour remplacer plus tard le repli vectoriel. Aucun fichier de `jeu/src/images/` réécrit.

## Validations par étape

À compléter au fil des PR : build autonome, tests moteur, garde-fou de présentation, parcours navigateur, sauvegarde historique et planches avant/après.

### Étape 1 — système et composants

Build autonome réussi ; `npm run test:jeu`, `npm run test:images` et `npm run test:presentation` exécutés. Deux parcours de 100 états terminés, sans erreur JavaScript ni débordement document/scène, à 390 × 844 et 768 × 1024. Sauvegarde historique chargée et nouvelle partie essayée dans ces parcours. [Après téléphone](../qa/finition/etape-1/390/planche-01.jpg) ; autres planches 02–05 dans le même dossier. Les 62 lignes restent ouvertes tant que leur correction n’est pas complète.

### Étape 2 — instruments et jauges

Build et trois suites de tests exécutés avec succès. Dernier passage complet : 100 captures dans chaque format, **zéro pageerror et zéro console.error**, sans débordement du document/de la scène. Le favicon autonome supprime les 404 du navigateur observées pendant la vérification intermédiaire. [Planches après](../qa/finition/etape-2/390/planche-01.jpg), [courbes de repasse](../qa/finition/etape-2/details/repasse-courbes-detail.jpg), [palier de fermentation](../qa/finition/etape-2/details/fermentation-courbe-detail.jpg), [CO₂](../qa/finition/etape-2/details/co2-comparatif.jpg), [jury déroulé](../qa/finition/etape-2/details/jury-fiche-detail.jpg).

Le contrôle `instruments.py` à DPR 2 est exécuté : palier J5 vertical, historique réel non vide en repasse, unités CO₂/sucre exactes. Les graphiques continuent leur lecture lorsque l'équipement sort de l'écran ; leur dessin s'arrête quand le graphique est hors vue. Le rendu scientifique reste intact. Fûts, pages et listes sont traités à l'étape 3.
