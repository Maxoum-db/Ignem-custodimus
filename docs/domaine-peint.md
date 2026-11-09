# Accueil du domaine illustré

La carte basse résolution est remplacée par dix assets WebP originaux : quatre terrains saisonniers, ferme-brasserie, chai, pigeonnier, Ulysse, cheval et ruche. Les bâtiments sont des couches indépendantes. Textes et boutons restent en HTML ; Canvas adapté au devicePixelRatio (plafond 3), animations plafonnées à 30 images/s, prefers-reduced-motion respecté. Aucun chargement réseau.

## État réel et accès

Six accès conservés. Un bâtiment non acquis affiche son terrain et ouvre les constructions. Les travaux affichent un échafaudage. Cuves extérieures, fûts, étal, terrasse et abri apparaissent selon les niveaux. Aucun bâtiment offert pour embellir la capture. Le rucher reste une extension annoncée. Saison selon S.cal.s, nuit selon heure locale. Aucun moteur scientifique ni format ignem.v1 modifié.

Décodage avant activation. Si une image manque, ancien dessin et anciennes zones de clic conservés. ResizeObserver pour rester net après rotation, même en mouvement réduit.

## Production des assets

Outil imagegen intégré, recadrage aux limites alpha, réduction et WebP qualité 82. Terrains et bâtiments maximum 1024 px ; cheval, ruche et alambic 512 px. Total WebP avec Lise inférieur à 2 Mio pour budget 6 Mio. Sources dans jeu/src/images/domaine-*.webp.

Style commun :
Polished original 2D hand-painted cartoon game art, rural Quercy southwest France, soft 35-degree isometric view seen from above looking at front and right faces, warm slightly saturated palette, thick clean dark brown #3b2a1e outlines, pale limestone #e2cfa4, canal terracotta roof tiles #d9714a, oak #a87444, copper #e09a4e, generous green foliage #9cc94a, soft two-tone shadows, main light upper left. Clear readable silhouettes, charming detailed indie management game art, no pixel art, no text or UI, no watermark.

Prompts individuels :
- ferme : One isolated Quercy farmhouse barn used as a small craft brewery, broad simple limestone and oak half-timbered rural barn, terracotta canal-tile pitched roof, open large oak double door revealing one modest copper brewing kettle, small side window, few grain sacks and oak barrel immediately against wall. No grass base or ground platform. No smoke, no flames. Entire building fully visible, centered, tight crop with small margin, front and right facade visible.
- chai : One isolated low rectangular limestone barrel cellar building, terracotta canal-tile pitched roof, wide arched double oak door open with dark vaulted interior and three oak barrels visible, ivy on one corner, two stacked barrels leaning immediately beside entrance. Entire building fully visible, centered, tight crop with small margin. No ground platform or grass base. Front and right facade visible.
- pigeonnier : One isolated traditional Quercy square limestone dovecote tower, distinctive terracotta canal-tile pyramidal roof and little roof lantern, pigeon openings, broad projecting stone rat ledge midway up the tower, arched oak ground floor door, TWO small pigeons perched on ledge. No shop stalls or awning yet. Entire building fully visible, centered, tight crop with small margin. No ground platform or grass base. Front and right facade visible.
- ulysse : One isolated mobile artisanal copper distillation still on a compact oak and iron two-wheel trailer, copper round pot on closed black wood-fired stove, copper swan neck connecting to condenser tub with visible copper coil, tall copper column, small collection jug, stacked logs attached to trailer, towbar. Warm copper highlights, recognizable workshop craft apparatus, NOT a locomotive, NOT a vehicle cab. Fire unlit, NO steam or smoke. Entire trailer fully visible, centered, tight crop with small margin. No grass base or ground platform.
- cheval : One isolated friendly adult bay horse standing in a natural three-quarter side pose facing left, black mane and tail, dark legs, green canvas saddlebags holding two cream-colored books, simple brown leather tack, no rider. Anatomically coherent four legs and hooves. Entire horse fully visible, centered, tight crop, small margin. No grass base, no background, no text.
- Terrain : portrait 3:4, Quercy, collines, verger, vignes, murets, portail, chemins courbes et grands espaces libres. Aucun bâtiment.
- Saisons : mêmes chemins, portail, murs et caméra ; printemps fleuri, automne doré, hiver arbres dénudés et givre. Été : fond initial.
- Ruche : une ruche ocre à trois corps, assemblages détaillés, poignées, zinc patiné, planche d’envol, deux pieds, sans décor.
- Seconde passe alpha ferme/chai/Ulysse : préserver l’objet, supprimer tout halo et fond extérieur, transparence réelle.

## Validation

Build, six suites Node, test jeu/tests/domaine.cjs : six accès, niveaux/travaux, quatre saisons/nuit, DPR 2, 320/390 px, cibles 44 px minimum, mouvement réduit, repli image manquante, absence de mutation et d’erreur JS. Tests mobiles et parcours existants conservés dans la CI.

Captures domaine-developpe, automne, hiver : sauvegarde de test avec bâtiments acquis. Nouvelle-partie : emplacements non acquis à bâtir. Les captures ne modifient pas les sauvegardes personnelles.

## Limites

Cheval en attente, pas encore de marche articulée. Poules et chat en petit dessin Canvas ; Lise et Firmin ne se promènent pas encore. Canard et coq distinct à illustrer. Améliorations par équipements ajoutés, pas encore des variantes peintes intégrales de chaque niveau. Lierre des bâtiments identique selon saison. Rucher toujours non jouable. Scènes complémentaires et reprise exacte d’un geste interrompu restent hors de ce lot.

