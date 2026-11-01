/* Ignem custodimus — l'école du domaine : leçons (théorie + défi + quiz) qui débloquent des recettes
 * Chaque défi est vérifié par le moteur à la fin d'un brassin, d'une distillation ou d'une mise en bouteille.
 * ctx biere : { res, note, recette, scores } · ctx edv : { entree, note } · ctx vieilli : { entree, note, etat }
 */
(function (racine) {
  'use strict';
  const fr = (v, d = 1) => Number(v).toFixed(d).replace('.', ',');
  const LECONS = [
    {
      id: 'empatage', titre: 'Le malt et l\'empâtage', mentor: 'Lise', fiche: 'empatage',
      theorie: [
        "L'amidon du malt est un polymère de glucose. À l'empâtage, deux enzymes du malt le découpent : la β-amylase (60–65 °C) détache du maltose par les extrémités des chaînes, entièrement fermentescible ; l'α-amylase (68–72 °C) coupe au hasard et laisse des dextrines que la levure ne mange pas.",
        "Un palier bas donne une bière sèche et plus alcoolisée, un palier haut une bière ronde avec du corps. Le pouvoir diastasique (°Lintner) dit si le malt a assez d'enzymes pour tout convertir.",
      ],
      defi: { type: 'biere', txt: 'Brasse une bière d\'au moins 1,040 avec un palier entre 63 et 67 °C, notée 25/50 ou plus.',
        test: (c) => c.res.og >= 1.040 && c.res.palier >= 63 && c.res.palier <= 67 && c.note.total >= 25 },
      quiz: [
        ['Vers quelle température la β-amylase travaille-t-elle au mieux ?', '60–65 °C', ['68–72 °C', '75–78 °C', '50–55 °C']],
        ['Un palier à 69 °C donne plutôt…', 'une bière ronde, riche en dextrines', ['une bière plus sèche', 'plus d\'amertume', 'plus d\'alcool']],
        ['Que mesure le pouvoir diastasique, en °Lintner ?', 'la réserve d\'enzymes du malt', ['la couleur du malt', 'l\'extrait du malt', 'son humidité']],
      ],
      recompense: { recettes: /blond|golden|pale ale|american wheat/i, ecus: 15 },
    },
    {
      id: 'amertume', titre: 'L\'amertume du houblon', mentor: 'Lise', fiche: 'amertume', requiert: ['empatage'],
      theorie: [
        "Les acides alpha du houblon (humulones) ne sont presque pas solubles ni amers. À l'ébullition, ils s'isomérisent en iso-alpha-acides, solubles et amers. Plus le houblon bout longtemps, plus l'isomérisation avance : c'est l'utilisation, calculée par la formule de Tinseth.",
        "Un moût dense isomérise moins bien. Les huiles essentielles (myrcène, humulène, linalol), elles, s'évaporent à l'ébullition : un ajout tardif garde l'arôme mais amérise peu.",
      ],
      defi: { type: 'biere', txt: 'Une bière médaillée d\'au moins 30 IBU, avec un houblon à 45 min ou plus et un autre à 15 min ou moins.',
        test: (c) => c.res.ibu >= 30 && c.recette.houblons.some((h) => h.min >= 45) && c.recette.houblons.some((h) => h.min >= 0 && h.min <= 15) && !!c.note.medaille },
      quiz: [
        ['Pourquoi un houblon bouilli 60 min amérise-t-il plus qu\'à 10 min ?', 'ses acides alpha ont eu le temps de s\'isomériser', ['ses huiles se concentrent', 'il colore la bière', 'il libère des sucres amers']],
        ['Dans la formule de Tinseth, un moût plus dense…', 'réduit l\'utilisation des acides alpha', ['augmente l\'amertume', 'ne change rien', 'double les IBU']],
        ['Un ajout de houblon à 5 min sert surtout à…', 'garder les huiles aromatiques', ['amériser fortement', 'clarifier', 'acidifier le moût']],
      ],
      recompense: { recettes: /pale ale|amber|bitter|esb/i, ecus: 15 },
    },
    {
      id: 'levure', titre: 'La levure et la température', mentor: 'Lise', fiche: 'fermentation', requiert: ['empatage'],
      theorie: [
        "La fermentation dégage de la chaleur, surtout pendant la phase tumultueuse (jours 2 et 3). Au-dessus de sa plage, la levure produit davantage d'esters (fruité) et d'alcools supérieurs par la voie d'Ehrlich : goût chaud, solvant.",
        "L'α-acétolactate qu'elle rejette s'oxyde en diacétyle (beurre). En fin de fermentation, une levure encore active le réabsorbe.",
      ],
      defi: { type: 'biere', txt: 'Tiens la fermentation dans la bande au moins 75 % du temps, et obtiens 30/50 ou plus.',
        test: (c) => (c.scores && c.scores.ferm != null ? c.scores.ferm : 0) >= 0.75 && c.note.total >= 30 },
      quiz: [
        ['Au-dessus de sa plage, la levure produit davantage…', 'd\'esters et d\'alcools supérieurs', ['de diacétyle uniquement', 'de sucres', 'd\'iso-alpha-acides']],
        ['Quand la fermentation chauffe-t-elle le plus ?', 'pendant la phase tumultueuse, jours 2 et 3', ['au jour 7', 'pendant la latence', 'à la mise en bouteille']],
        ['Le diacétyle sent…', 'le beurre', ['la banane', 'le clou de girofle', 'le maïs cuit']],
      ],
      recompense: { recettes: /saison|belg|wit|weizen|tripel|dubbel/i, ecus: 15 },
    },
    {
      id: 'lager', titre: 'Les lagers et le froid', mentor: 'Lise', fiche: 'levure', requiert: ['levure'],
      theorie: [
        "Saccharomyces pastorianus fermente au frais (9–13 °C) : peu d'esters, un profil net. Mais au froid, la levure réabsorbe mal le diacétyle : on remonte de 4 °C les deux derniers jours, c'est le repos diacétyle.",
        "Le malt Pils très pâle contient de la S-méthylméthionine qui donne du DMS (maïs cuit) à chaud : 90 minutes d'ébullition vigoureuse le chassent.",
      ],
      defi: { type: 'biere', txt: 'Une lager médaillée : levure lager, fermentation à 13 °C ou moins, repos diacétyle activé.',
        test: (c) => c.res.levure && c.res.levure.fam === 'lager' && c.recette.fermentation.temp <= 13 && c.recette.fermentation.reposDiacetyle && !!c.note.medaille },
      quiz: [
        ['Pourquoi un repos diacétyle en fin de lager ?', 'la levure réabsorbe le diacétyle à plus haute température', ['pour tuer la levure', 'pour gazéifier la bière', 'pour la clarifier au froid']],
        ['Avec plus de 50 % de malt Pils, 90 min d\'ébullition chassent…', 'le DMS', ['le diacétyle', 'l\'acétaldéhyde', 'les tanins']],
        ['Une levure lager travaille typiquement vers…', '9–13 °C', ['18–22 °C', '25–30 °C', '35 °C']],
      ],
      recompense: { recettes: /pils|lager|helles|bock|m[äa]rzen|vienna|oktoberfest/i, ecus: 20 },
    },
    {
      id: 'eau', titre: 'L\'eau du causse', mentor: 'Lise', fiche: 'eau', requiert: ['empatage'],
      theorie: [
        "L'eau calcaire du Quercy est riche en bicarbonates : son alcalinité résiduelle remonte le pH d'empâtage. Pour une bière pâle, on vise 5,2 à 5,6 : les enzymes travaillent mieux et les tanins des enveloppes restent dans la drêche.",
        "Le calcium et le magnésium abaissent l'alcalinité ; les malts acides, caramel et torréfiés baissent le pH. Le rapport sulfates/chlorures oriente le goût : sec et amer au-dessus de 2, rond et malté en dessous de 1.",
      ],
      defi: { type: 'biere', txt: 'Une bière pâle (15 EBC au plus) avec un pH d\'empâtage entre 5,2 et 5,6.',
        test: (c) => c.res.ebc <= 15 && c.res.ph >= 5.2 && c.res.ph <= 5.6 },
      quiz: [
        ['L\'alcalinité résiduelle élevée de l\'eau du causse…', 'remonte le pH d\'empâtage', ['baisse le pH', 'n\'a aucun effet', 'colore la bière']],
        ['Un rapport sulfates/chlorures élevé met en avant…', 'une amertume sèche', ['une rondeur maltée', 'la couleur', 'la mousse']],
        ['Les malts torréfiés font…', 'baisser le pH d\'empâtage', ['monter le pH', 'monter l\'alcalinité', 'rien du tout']],
      ],
      recompense: { recettes: /bitter|esb|brown|california/i, ingredients: [/^Gypse/i, /chlorure de calcium|CaCl/i], ecus: 10 },
    },
    {
      id: 'torrefie', titre: 'Les malts torréfiés', mentor: 'Lise', fiche: 'couleur', requiert: ['eau'],
      theorie: [
        "En torréfiant le malt vers 200 °C, les réactions de Maillard puis la pyrolyse forment des mélanoïdines brunes, des notes de café et de chocolat, et des composés acides qui font baisser le pH. Les enzymes, elles, sont détruites : ces malts n'ont aucun pouvoir diastasique.",
        "Les malts « Special » ou désamérisés sont décortiqués avant torréfaction : la couleur sans l'âpreté des enveloppes brûlées.",
      ],
      defi: { type: 'biere', txt: 'Un stout ou un porter médaillé.',
        test: (c) => c.res.style && ['stout', 'porter'].includes(c.res.style.style.sujet) && !!c.note.medaille },
      quiz: [
        ['Pourquoi un CARAFA « Special » est-il dit désamérisé ?', 'son enveloppe est retirée avant torréfaction', ['il est lavé', 'il est moins torréfié', 'il est enrobé de sucre']],
        ['Les malts torréfiés n\'ont pas de pouvoir diastasique parce que…', 'la chaleur a détruit leurs enzymes', ['ils sont crus', 'ils sont trop sucrés', 'ils n\'ont pas d\'amidon']],
        ['Ce qui brunit le malt à la torréfaction :', 'les réactions de Maillard et la pyrolyse', ['la fermentation', 'l\'isomérisation', 'l\'oxydation des lipides seule']],
      ],
      recompense: { recettes: /stout|porter/i, ecus: 15 },
    },
    {
      id: 'dryhop', titre: 'Houblonnage à cru et DDH', mentor: 'Lise', fiche: 'dryhop', requiert: ['amertume'],
      theorie: [
        "Le dry hop met le houblon au contact de la bière froide : les huiles passent sans s'évaporer et sans amertume. En double dry hop (DDH), on le fait deux fois.",
        "Le DH1, au jour 2, tombe en pleine fermentation : la levure biotransforme le géraniol en citronellol et libère des thiols fixés sur des acides aminés (fruit de la passion, pamplemousse). Le CO₂ emporte un peu d'huiles. Le DH2, au jour 5, garde les arômes frais intacts.",
        "Revers : les amylases du houblon redécoupent des dextrines que la levure fermente (hop creep) : plus sec, un peu plus d'alcool, et du diacétyle sans repos. Au-delà de 18 g/L au total, la bière devient végétale et pique (hop burn).",
      ],
      defi: { type: 'biere', txt: 'Une bière médaillée en DDH : au moins 3 g/L au DH J2 et 3 g/L au DH J5, 18 g/L au plus au total.',
        test: (c) => c.res.dh && c.res.dh.ddh && c.res.dh.total <= 18 && !!c.note.medaille },
      quiz: [
        ['Pourquoi un premier dry hop pendant la fermentation active ?', 'la levure biotransforme les terpènes et libère des thiols', ['pour plus d\'amertume', 'pour stériliser la bière', 'pour la clarifier']],
        ['Le hop creep, c\'est…', 'des enzymes du houblon qui relancent la fermentation', ['la mousse qui déborde', 'une oxydation', 'une contamination']],
        ['Au-delà d\'environ 18 g/L de houblon à cru, on risque…', 'un goût végétal et le hop burn', ['plus d\'IBU', 'une bière plus claire', 'moins d\'alcool']],
      ],
      recompense: { recettes: /ipa|hazy|neipa|new england/i, ingredients: [/^Citra$/i], ecus: 15 },
    },
    {
      id: 'brouillis', titre: 'Première chauffe', mentor: 'Firmin', fiche: 'distillation', requiert: ['empatage'],
      theorie: [
        "L'éthanol bout à 78,4 °C, l'eau à 100 °C : la vapeur d'un moût à 10 % titre environ 50 %. C'est l'équilibre liquide-vapeur. Au brouillis, on épuise la bière jusqu'à n'avoir plus d'alcool dans la chaudière : on recueille 20 à 30 %.",
        "Le cuivre de l'alambic réagit avec les composés soufrés et les retient. La bière mousse au début (protéines, CO₂) : on chauffe doucement, puis on nourrit le feu.",
      ],
      defi: { type: 'edv', txt: 'Distille une eau-de-vie présentable au jury (au moins 2 litres de cœur).',
        test: (c) => c.note && c.note.presentable },
      quiz: [
        ['Pourquoi la vapeur d\'un moût à 10 % titre-t-elle environ 50 % ?', 'l\'éthanol est plus volatil que l\'eau', ['l\'eau s\'évapore d\'abord', 'le cuivre concentre l\'alcool', 'la levure travaille encore']],
        ['Le brouillis sert à…', 'épuiser la bière en un alcool à 20–30 %', ['séparer les têtes', 'vieillir l\'alcool', 'refroidir la bière']],
        ['Le cuivre de l\'alambic retient surtout…', 'les composés soufrés', ['le méthanol', 'les esters', 'l\'eau']],
      ],
      recompense: { ingredients: [/^Distilamax XP/i], ecus: 15 },
    },
    {
      id: 'coupes', titre: 'Les coupes', mentor: 'Firmin', fiche: 'coupes', requiert: ['brouillis'],
      theorie: [
        "À la bonne chauffe sortent d'abord les têtes : acétaldéhyde et acétate d'éthyle, très volatils (colle, pomme verte). Puis le cœur, fruité et propre. Enfin les queues : alcools supérieurs lourds, acides gras, furfural (carton mouillé, gras), quand le degré au bec tombe.",
        "Têtes et queues forment les épaisses : on les repasse à la chauffe suivante pour récupérer leur alcool.",
      ],
      defi: { type: 'edv', txt: 'Une eau-de-vie médaillée, sans défaut de têtes ni de queues.',
        test: (c) => c.note && !!c.note.medaille && !c.note.defauts.some((d) => d.id === 'tetes' || d.id === 'queues') },
      quiz: [
        ['Les têtes contiennent surtout…', 'de l\'acétaldéhyde et de l\'acétate d\'éthyle', ['du furfural', 'des acides gras', 'des tanins']],
        ['Quand coupe-t-on les queues ?', 'quand le degré tombe et que le carton mouillé arrive', ['dès les premières gouttes', 'à 80 % au bec', 'quand ça sent la pomme verte']],
        ['Repasser les épaisses permet…', 'de récupérer leur alcool à la chauffe suivante', ['de faire du whisky', 'd\'éliminer le méthanol', 'de colorer le cœur']],
      ],
      recompense: { futs: [['bourbon', 'quartaut']], ecus: 20 },
    },
    {
      id: 'chai', titre: 'Le chai et le temps', mentor: 'Firmin', fiche: 'elevage', requiert: ['coupes'],
      theorie: [
        "En fût, trois familles de réactions : l'éthanol extrait vanilline, lactones et tanins du bois ; le charbon des fûts charrés adsorbe le soufre ; l'oxygène oxyde lentement les alcools supérieurs, que l'éthanol estérifie en esters fruités.",
        "Le règlement (UE) 2019/787 exige au moins trois ans en fût de 700 L au plus et 40 % vol à la mise en bouteille pour dire whisky. La part des anges emporte environ 2 à 3 % du volume par an.",
      ],
      defi: { type: 'vieilli', txt: 'Mets en bouteille un vrai whisky (wash de malt, trois ans de fût au moins).',
        test: (c) => /^Whisky/.test(c.entree.style) },
      quiz: [
        ['Combien d\'années de fût au minimum pour dire whisky dans l\'UE ?', '3 ans', ['1 an', '2 ans', '5 ans']],
        ['Dans un chai chaud et sec, le degré du spiritueux…', 'monte', ['baisse', 'ne bouge pas', 'double']],
        ['La whisky-lactone donne une note de…', 'noix de coco', ['banane', 'fumée', 'cuir']],
      ],
      recompense: { futs: [['sherry', 'barrique']], ecus: 25 },
    },
  ];
  racine.Ecole = { LECONS, fr };
})(typeof globalThis !== 'undefined' ? globalThis : window);
