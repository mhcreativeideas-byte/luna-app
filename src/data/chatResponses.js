// Catégories de questions suggérées avec icônes
export const SUGGESTION_CATEGORIES = [
  {
    id: 'food',
    label: '🍽️ Nutrition',
    questions: [
      'Qu\'est-ce que je mange ce soir ?',
      'Une recette adaptée à ma phase ?',
      'Un petit-déj équilibré pour aujourd\'hui ?',
      'Un goûter adapté à mon cycle ?',
      'Pourquoi j\'ai des envies de sucre ?',
      'Je suis végétarienne, quoi manger ?',
      'Quels aliments pour mes hormones ?',
    ],
  },
  {
    id: 'recipes',
    label: '👩‍🍳 Recettes',
    questions: [
      'Une recette anti-inflammatoire ?',
      'Un smoothie adapté à ma phase ?',
      'Idée de déjeuner rapide ?',
      'Un snack sain pour le bureau ?',
      'Une recette riche en fer ?',
      'Un dîner léger et nourrissant ?',
      'Quelle boisson pour aujourd\'hui ?',
      'Quoi faire avec ce que j\'ai dans mon frigo ?',
    ],
  },
  {
    id: 'cycle',
    label: '🔄 Mon cycle',
    questions: [
      'Pourquoi je suis fatiguée en ce moment ?',
      'C\'est normal ce que je ressens ?',
      'Quand est ma prochaine ovulation ?',
      'Combien de jours avant mes règles ?',
      'Pourquoi mes règles sont douloureuses ?',
    ],
  },
  {
    id: 'sport',
    label: '🏋️ Sport',
    questions: [
      'Quel entraînement faire aujourd\'hui ?',
      'Je peux faire du HIIT en ce moment ?',
      'Pourquoi j\'ai moins de force ?',
      'Quel yoga est adapté à ma phase ?',
    ],
  },
  {
    id: 'mood',
    label: '💭 Bien-être',
    questions: [
      'Comment gérer mon irritabilité ?',
      'Comment mieux dormir ce soir ?',
      'Comment gérer le stress hormonal ?',
      'Comment booster ma confiance ?',
    ],
  },
];

// Questions rapides affichées au début (les plus fréquentes)
export const QUICK_SUGGESTIONS = [
  'Qu\'est-ce que je mange ce soir ?',
  'Un snack adapté à ma phase ?',
  'Quelle boisson pour aujourd\'hui ?',
  'Pourquoi je suis fatiguée ?',
  'Quels aliments privilégier ?',
  'Une recette rapide pour ma phase ?',
];

// Réponses complètes par phase — chaque réponse est une fonction qui reçoit le contexte utilisatrice
// ctx = { name, phase, currentDay, cycleLength, periodLength, daysUntilPeriod, energy, symptoms, goals }

const RESPONSES = {
  menstrual: {
    fatigue: (ctx) => adaptFoodText(`${ctx.name}, c'est complètement normal que tu sois fatiguée. Tu es à J${ctx.currentDay} — tes hormones (œstrogène et progestérone) sont au plus bas.\n\n💡 Ce que tu peux faire :\n• Magnésium : chocolat noir, amandes, bananes\n• Fer : lentilles, épinards, viande rouge\n• Dormir 8-9h (c'est pas du luxe, c'est un besoin)\n• Hydrate-toi bien (1,5-2L/jour)\n\nTa fatigue n'est pas un échec — c'est ton corps qui se régénère. Ça remonte dans 2-3 jours avec l'œstrogène. 🌱`, ctx),

    normal: (ctx) => `Oui ${ctx.name}, tout ce que tu ressens est normal pour J${ctx.currentDay}. Tes hormones sont au plancher, ce qui peut provoquer :\n\n• Fatigue, manque de motivation\n• Crampes, douleurs dans le bas-ventre\n• Envie de t'isoler, sensibilité émotionnelle\n• Ballonnements, troubles digestifs\n\nTon corps élimine la muqueuse utérine — c'est un vrai travail interne. Sois douce avec toi, c'est pas le moment de te pousser. 💜`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${ctx.cycleLength - 14} de ton cycle, soit dans environ ${ctx.cycleLength - 14 - ctx.currentDay} jours.\n\nTu le sentiras probablement : montée d'énergie, meilleure humeur, parfois une légère douleur d'un côté du ventre. En attendant, repose-toi — la phase folliculaire qui arrive va te redonner de l'élan. ✨`,

    regles: (ctx) => `${ctx.name}, encore environ ${ctx.daysUntilPeriod} jours avant tes prochaines règles (ton cycle fait ${ctx.cycleLength} jours). Mais là tu es en plein dedans ! J${ctx.currentDay}, phase menstruelle.\n\nSi tes douleurs sont fortes :\n• Bouillotte sur le ventre\n• Anti-inflammatoires naturels : curcuma, gingembre\n• Magnésium (aide les crampes)\n• Position fœtale pour dormir`,

    manger: (ctx) => adaptFoodText(`${ctx.name}, pendant tes règles ton corps perd du fer — c'est LA priorité.\n\n🥗 À privilégier :\n• Fer : lentilles, épinards, viande rouge, tofu\n• Vitamine C (pour absorber le fer) : agrumes, poivrons, kiwi\n• Anti-inflammatoires : curcuma, gingembre, saumon, sardines\n• Magnésium : chocolat noir 70%+, amandes\n\n🚫 À limiter :\n• Café (réduit l'absorption du fer)\n• Alcool (amplifie l'inflammation)\n• Trop de sel (aggrave la rétention d'eau)\n\nEnvie de chocolat ? C'est normal — ton corps réclame du magnésium. Fonce sur le chocolat noir. 🍫`, ctx),

    sport: (ctx) => `${ctx.name}, à J${ctx.currentDay} ton énergie est au plus bas. Pas de pression !\n\n✅ Aujourd'hui :\n• Yoga restauratif ou yin yoga\n• Marche douce (20-30 min)\n• Stretching léger\n• Natation douce\n\n❌ Évite :\n• HIIT, crossfit, sprint\n• Muscu lourde\n• Tout ce qui te met K.O.\n\nMême 10 minutes de marche comptent. L'objectif c'est de bouger sans te vider. Tu reprendras l'intensité en phase folliculaire. 💪`,

    dormir: (ctx) => `${ctx.name}, le sommeil en phase menstruelle peut être perturbé par les douleurs.\n\n🌙 Mes conseils :\n• Bouillotte sur le ventre au coucher\n• Tisane camomille ou gingembre\n• Magnésium si tu en as (au coucher)\n• Chambre à 18-19°C\n• Dernier repas léger, 2h avant\n• Position fœtale si douleurs abdominales\n\nVise 8-9h de sommeil — ton corps en a vraiment besoin en ce moment.`,

    sucre: (ctx) => adaptFoodText(`${ctx.name}, les envies de sucre pendant les règles c'est 100% hormonal. Ta sérotonine (hormone du bonheur) est basse → ton cerveau cherche du sucre rapide pour la remonter.\n\n🧠 Alternative maligne :\n• Chocolat noir 70%+ (magnésium + plaisir)\n• Banane + beurre de cacahuète\n• Porridge avoine-miel-cannelle\n• Dattes + amandes\n\nCes options nourrissent le besoin sans le pic glycémique. Zéro culpabilité — c'est de la biochimie, pas un manque de volonté. 💛`, ctx),

    ballonnements: (ctx) => adaptFoodText(`${ctx.name}, les ballonnements pendant les règles sont causés par les prostaglandines (qui provoquent aussi les crampes).\n\n💡 Solutions :\n• Gingembre (en tisane ou râpé dans les plats)\n• Fenouil (tisane ou cru en salade)\n• Évite les boissons gazeuses et chewing-gums\n• Mange lentement, en petites portions\n• Probiotiques : yaourt nature, kéfir\n• Marche douce après les repas\n\nÇa s'améliore après tes règles, promis. 🌿`, ctx),

    irritabilite: (ctx) => `${ctx.name}, l'irritabilité pendant les règles c'est hormonal — tes œstrogènes sont au plancher et ta sérotonine aussi.\n\n🧘‍♀️ Ce qui aide :\n• Respiration 4-7-8 (calme le système nerveux)\n• Magnésium (régule l'humeur)\n• Évite le café (amplifie l'anxiété)\n• Marche en extérieur (sérotonine naturelle)\n• Donne-toi la permission de dire non\n\nCe n'est pas toi le problème — ce sont tes hormones. Et ça passe. 💜`,

    acne: (ctx) => adaptFoodText(`${ctx.name}, l'acné hormonale autour des règles est liée à la chute d'œstrogène (qui protège ta peau).\n\n✨ Ce qui aide :\n• Zinc : graines de courge, pois chiches\n• Oméga-3 : saumon, noix, graines de lin\n• Hydratation ++ (eau + aliments riches en eau)\n• Évite les produits laitiers si tu y es sensible\n• Nettoyage doux (pas de décapage !)\n\nTa peau va s'améliorer en phase folliculaire quand l'œstrogène remonte. Patience. 🌸`, ctx),

    pleurer: (ctx) => `${ctx.name}, avoir envie de pleurer pendant les règles c'est complètement normal. Tes hormones sont au plancher — œstrogène ET progestérone.\n\nCe n'est pas de la faiblesse, c'est de la chimie.\n\n💛 Ce qui peut t'aider :\n• Pleure si tu en as besoin (ça libère du cortisol)\n• Cocooning : couverture, tisane, série réconfortante\n• Parle à quelqu'un qui te comprend\n• Écris dans ton journal ce que tu ressens\n\nDans 2-3 jours l'œstrogène remonte et tu te sentiras déjà mieux. 🌱`,

    stress: (ctx) => `${ctx.name}, le stress est amplifié pendant les règles car tes hormones régulatrices sont basses.\n\n🧘 Plan anti-stress :\n• Respiration 4-7-8 (3 cycles minimum)\n• Magnésium (amandes, chocolat noir)\n• Marche en nature (même 15 min)\n• Limite le café et les écrans\n• Couche-toi plus tôt\n\nTon seuil de tolérance est naturellement plus bas en ce moment. C'est pas de la fragilité, c'est hormonal. 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, c'est normal de se sentir moins confiante pendant les règles — la chute d'œstrogène impacte directement l'estime de soi.\n\n💪 Rappelle-toi :\n• C'est temporaire (2-3 jours)\n• Ton corps fait un travail incroyable\n• Tu n'as rien à prouver à personne cette semaine\n• Ta valeur ne dépend pas de ta productivité\n\nDans quelques jours, l'œstrogène remonte et ta confiance avec. En attendant, sois ta meilleure amie. ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau pendant les règles est liée aux fluctuations hormonales.\n\n💧 Solutions :\n• Bois plus d'eau (paradoxalement, ça aide)\n• Réduis le sel\n• Potassium : banane, avocat, patate douce\n• Marche légère (active la circulation)\n• Tisane de pissenlit (drainante naturelle)\n\nTu peux prendre 1-2 kg d'eau — c'est pas du gras, c'est hormonal. Ça part après les règles.`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, voici des snacks parfaits pour ta phase menstruelle :\n\n🍫 Idées snack :\n• Energy balls chocolat-dattes (magnésium + fer)\n• Banana bread protéiné (réconfort + énergie)\n• Tartine d'avocat + graines de courge\n• Chocolat noir 70% + amandes\n• Banane + beurre de cacahuète\n• Dattes fourrées aux noix\n\n💡 Ton corps a besoin de fer et de magnésium — ces snacks sont parfaits pour ça.\n\n👉 Va voir la section Recettes > Snacks pour les recettes complètes ! 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, voici les boissons idéales pour ta phase menstruelle :\n\n🍵 À privilégier :\n• Golden milk au curcuma (anti-inflammatoire)\n• Infusion gingembre-citron (apaise les crampes)\n• Smoothie anti-inflammatoire (épinards, banane, curcuma)\n• Tisane de camomille (relaxante)\n• Eau chaude citronnée\n\n🚫 À limiter :\n• Café (réduit l'absorption du fer)\n• Alcool (amplifie l'inflammation)\n\n💡 Le curcuma + gingembre = combo anti-douleur naturel. 🌿`, ctx),

    frigo: (ctx) => `${ctx.name}, tu veux savoir quoi faire avec ce que tu as ? Va sur "Mon Frigo" dans la section Alimentation ! 🧊\n\nTu y entres tes ingrédients et LUNA te propose les recettes adaptées à ta phase menstruelle.\n\n💡 En phase menstruelle, priorise les ingrédients riches en :\n• Fer : lentilles, épinards, tofu\n• Magnésium : amandes, chocolat noir\n• Anti-inflammatoires : gingembre, curcuma`,

    default: (ctx) => adaptFoodText(`${ctx.name}, tu es à J${ctx.currentDay} — phase menstruelle. Tes hormones sont au plus bas.\n\n📋 Les priorités :\n• Fer (lentilles, épinards) + vitamine C\n• Magnésium (chocolat noir, amandes)\n• Sport doux (yoga, marche)\n• Sommeil 8-9h\n• Hydratation\n\nTon corps se régénère — c'est le moment de ralentir sans culpabiliser. Tout va remonter en phase folliculaire. 🌱`, ctx),
  },

  follicular: {
    fatigue: (ctx) => `${ctx.name}, si tu te sens encore fatiguée à J${ctx.currentDay}, c'est normal — l'œstrogène remonte progressivement mais n'est pas encore à son pic.\n\n⚡ Boosters d'énergie :\n• Lumière naturelle le matin (15 min minimum)\n• Protéines au petit-déj (œufs, yaourt grec)\n• Mouvement : même 20 min de marche rapide\n• Hydratation dès le réveil\n\nTon énergie va monter chaque jour. D'ici 3-4 jours tu te sentiras en pleine forme ! 🚀`,

    normal: (ctx) => `${ctx.name}, en phase folliculaire (J${ctx.currentDay}) tu devrais sentir :\n\n✨ Le positif :\n• Énergie qui remonte\n• Meilleure humeur, plus d'optimisme\n• Créativité en hausse\n• Meilleure récupération musculaire\n• Peau plus lumineuse\n\nC'est ta phase de "renouveau" — ton corps se prépare à l'ovulation. Profite de cette montée d'énergie pour lancer des projets ! 💫`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${ctx.cycleLength - 14}, soit dans environ ${Math.max(0, ctx.cycleLength - 14 - ctx.currentDay)} jours.\n\n🔔 Signes à observer :\n• Glaire cervicale type "blanc d'œuf"\n• Légère douleur d'un côté du ventre\n• Pic d'énergie et de libido\n• Confiance en hausse\n\nC'est ton moment le plus fertile du cycle. ✨`,

    manger: (ctx) => adaptFoodText(`${ctx.name}, l'œstrogène remonte — ton corps est en mode construction !\n\n🥗 À privilégier :\n• Protéines : poulet, œufs, quinoa, légumineuses\n• Zinc : graines de courge, pois chiches\n• Probiotiques : yaourt, kéfir, kimchi\n• Légumes variés et colorés\n• Graines germées, alfalfa\n\nC'est le moment des repas riches et variés — ton métabolisme est efficace et ta digestion au top. 🌿`, ctx),

    sport: (ctx) => `${ctx.name}, c'est TA meilleure phase pour le sport ! L'œstrogène booste ta récupération musculaire.\n\n🏋️ Go pour :\n• HIIT, crossfit, cardio intense\n• Musculation (augmente les charges)\n• Course à pied, sprint\n• Danse, escalade, boxe\n• Essaye un nouveau sport !\n\nTon corps récupère plus vite qu'à n'importe quel autre moment du cycle. C'est maintenant que tu progresses le plus. 💪🔥`,

    dormir: (ctx) => `${ctx.name}, bonne nouvelle — ton sommeil s'améliore naturellement avec la montée d'œstrogène !\n\n🌙 Profite pour recaler ton rythme :\n• Coucher à heure fixe\n• Lever tôt, lumière naturelle dès le réveil\n• 7-8h suffisent en phase folliculaire\n• Sport le matin ou en journée (pas le soir)\n\nC'est le moment idéal pour poser de bonnes habitudes de sommeil. 😴`,

    sucre: (ctx) => adaptFoodText(`${ctx.name}, en phase folliculaire les envies de sucre devraient diminuer car ton œstrogène remonte (et ta sérotonine avec).\n\nSi tu en as encore :\n• C'est peut-être un manque de sommeil\n• Ou un petit-déj pas assez protéiné\n• Essaie : œufs + avocat + pain complet le matin\n• Snack : pomme + beurre de cacahuète\n\nTon corps gère mieux le sucre en ce moment — c'est la meilleure phase pour réduire les envies. 🍎`, ctx),

    irritabilite: (ctx) => `${ctx.name}, si tu es irritable en phase folliculaire c'est moins courant — ça peut venir d'autres facteurs :\n\n🔍 Vérifie :\n• Sommeil suffisant ? (7-8h)\n• Stress externe (boulot, relations) ?\n• Alimentation équilibrée ?\n• Hydratation ?\n\n💡 Solutions rapides :\n• 5 min de respiration profonde\n• Marche en extérieur\n• Parle à quelqu'un\n\nTon œstrogène devrait naturellement améliorer ton humeur dans les prochains jours. 🌸`,

    acne: (ctx) => adaptFoodText(`${ctx.name}, ta peau devrait s'améliorer en phase folliculaire ! L'œstrogène qui remonte protège ta peau.\n\n✨ Pour accélérer :\n• Zinc : graines de courge, fruits de mer\n• Vitamine A : patate douce, carottes\n• Hydratation +++ \n• Probiotiques (lien intestin-peau)\n• Nettoyage doux matin et soir\n\nSi l'acné persiste, c'est peut-être lié au stress ou à l'alimentation plus qu'aux hormones. 🌿`, ctx),

    confiance: (ctx) => `${ctx.name}, ta confiance remonte naturellement avec l'œstrogène ! C'est le moment d'en profiter.\n\n🚀 Profite de cette phase pour :\n• Planifier tes meetings importants\n• Prendre la parole en public\n• Lancer un projet qui te tient à cœur\n• Sortir de ta zone de confort\n\nTa communication et ta créativité sont en hausse — utilise cette fenêtre ! ✨`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, voici des snacks énergisants pour ta phase folliculaire :\n\n⚡ Idées snack :\n• Granola maison protéiné (avoine, noix, miel)\n• Crackers + houmous + crudités (protéines + zinc)\n• Œuf dur + graines de courge\n• Yaourt grec + fruits + granola\n• Pomme + beurre d'amande\n\n💡 L'œstrogène remonte — ton corps est en mode construction. Les protéines et le zinc sont tes alliés !\n\n👉 Va voir Recettes > Snacks pour les recettes complètes ! 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, voici les boissons idéales pour ta phase folliculaire :\n\n🍵 À privilégier :\n• Smoothie vert énergie (épinards, banane, spiruline)\n• Matcha latte (énergie longue durée)\n• Eau de coco citronnée (hydratation + minéraux)\n• Thé vert (antioxydants)\n• Jus de légumes frais\n\n💡 C'est la phase idéale pour le matcha — la L-théanine donne une énergie calme et concentrée. ☕`, ctx),

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! 🧊\n\nEntre tes ingrédients et LUNA te propose les meilleures recettes pour ta phase folliculaire.\n\n💡 En phase folliculaire, priorise :\n• Protéines : poulet, œufs, quinoa\n• Zinc : graines de courge, pois chiches\n• Probiotiques : yaourt, kéfir\n\nTon corps est en mode construction — nourris-le bien ! 🌿`,

    default: (ctx) => adaptFoodText(`${ctx.name}, tu es à J${ctx.currentDay} — phase folliculaire. Ton œstrogène remonte et c'est que du bon !\n\n📋 Profite pour :\n• Sport intense (meilleure récupération)\n• Nouveaux projets (créativité en hausse)\n• Alimentation variée et protéinée\n• Social (ta communication est au top)\n\nC'est ta phase de renouveau — tu montes en puissance chaque jour. 🚀`, ctx),
  },

  ovulatory: {
    fatigue: (ctx) => `${ctx.name}, fatiguée en phase ovulatoire ? C'est inhabituel — tes hormones sont à leur pic.\n\n🔍 Vérifie :\n• Sommeil suffisant ces derniers jours ?\n• Hydratation OK ?\n• Surentraînement possible ?\n• Stress important ?\n\nSi tout est normal, écoute ton corps — même en phase de pic, on peut avoir besoin de repos. Accorde-toi une journée douce. 💛`,

    normal: (ctx) => `${ctx.name}, en phase ovulatoire (J${ctx.currentDay}) c'est ton pic hormonal ! Tu devrais sentir :\n\n🔥 Au max :\n• Énergie et endurance au sommet\n• Confiance et communication boostées\n• Libido plus élevée\n• Peau éclatante\n• Capacités verbales au top\n\nC'est ta fenêtre de 2-3 jours pour briller — présentations, dates, records sportifs. Fonce ! ✨`,

    ovulation: (ctx) => `${ctx.name}, tu es en plein dedans ! J${ctx.currentDay}, c'est ta fenêtre ovulatoire.\n\n🔔 Signes typiques :\n• Glaire cervicale transparente et élastique\n• Légère douleur d'un côté (mittelschmerz)\n• Température basale qui monte légèrement\n• Pic de libido\n\nC'est ta période la plus fertile. Cette fenêtre dure environ 24-48h. 🌟`,

    manger: (ctx) => adaptFoodText(`${ctx.name}, ton œstrogène est au max — ton corps a besoin de fibres pour éliminer l'excès.\n\n🥗 À privilégier :\n• Fibres : légumes verts, céréales complètes, graines\n• Antioxydants : fruits rouges, légumes colorés\n• Crucifères : brocoli, chou-fleur (aident le foie)\n• Hydratation ++\n\n🍽️ Idée repas :\nPoke bowl saumon-avocat-edamame-quinoa. Frais, léger, riche en fibres. Parfait ! 🐟`, ctx),

    sport: (ctx) => `${ctx.name}, c'est ton PEAK ! Ton corps est à son maximum de performance.\n\n🏆 Fonce sur :\n• HIIT, sprint, boxe\n• Musculation lourde (bats tes records !)\n• Sports d'équipe (coordination au top)\n• Cours collectifs intenses\n\n⚠️ Attention : tes ligaments sont plus lâches (œstrogène). Échauffe-toi bien pour éviter les blessures. 💪🔥`,

    dormir: (ctx) => `${ctx.name}, tu as beaucoup d'énergie mais ne néglige pas le sommeil !\n\n🌙 Conseils :\n• 7-8h restent nécessaires\n• Méditation courte pour redescendre (10 min)\n• Eau détox concombre-menthe le soir\n• Pas d'écran 30 min avant de dormir\n\nLa descente d'énergie arrive bientôt (phase lutéale) — protège ton sommeil maintenant. 😴`,

    confiance: (ctx) => `${ctx.name}, ta confiance est naturellement au MAX en ce moment ! L'œstrogène + la testostérone = combo gagnant.\n\n🚀 C'est LE moment pour :\n• Négociations, présentations\n• Entretiens d'embauche\n• First dates\n• Conversations difficiles\n• Proposer tes idées\n\nTes capacités verbales et ton charisme sont à leur sommet. Profite de ces 2-3 jours ! 👑`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, voici des snacks légers et antioxydants pour ton pic ovulatoire :\n\n🍓 Idées snack :\n• Salade de fruits antioxydante (baies, kiwi, grenade)\n• Edamame épicés\n• Bâtonnets de concombre au tzatziki\n• Tartine de pain complet + avocat\n• Mix de noix et baies séchées\n\n💡 Ton œstrogène est au max — les fibres et antioxydants aident ton corps à tout gérer. 🌟`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, voici les boissons parfaites pour ta phase ovulatoire :\n\n🍵 À privilégier :\n• Eau infusée détox (concombre, citron, menthe)\n• Jus betterave-pomme-gingembre (antioxydants)\n• Thé vert glacé à la pêche\n• Kombucha (probiotiques)\n• Smoothie aux fruits rouges\n\n💡 Ton corps est au top — les antioxydants et les fibres sont tes meilleurs alliés pour éliminer l'excès d'œstrogène. ✨`, ctx),

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! 🧊\n\nEntre tes ingrédients et LUNA te propose les meilleures recettes pour ta phase ovulatoire.\n\n💡 En phase ovulatoire, priorise :\n• Fibres : légumes verts, céréales complètes\n• Antioxydants : fruits rouges, baies\n• Crucifères : brocoli, chou-fleur\n\nTon corps est à son peak — nourris-le de bonnes choses ! 🌟`,

    default: (ctx) => `${ctx.name}, J${ctx.currentDay} — tu es à ton pic ovulatoire ! Tes hormones sont au sommet.\n\n🔥 Ce que ça veut dire :\n• Performances physiques au max\n• Communication et confiance boostées\n• Énergie au top\n• Peau lumineuse, libido haute\n\nC'est ta fenêtre de 2-3 jours pour briller — profite-en à fond ! 🌟`,
  },

  luteal: {
    fatigue: (ctx) => `${ctx.name}, la fatigue en phase lutéale (J${ctx.currentDay}) est 100% normale. La progestérone a un effet sédatif naturel.\n\n💡 Plan d'action :\n• Magnésium au coucher (amandes, complément)\n• Pas de café après 14h\n• Glucides complexes (patate douce, avoine)\n• Sieste de 20 min si possible\n• Couche-toi 30 min plus tôt\n\nC'est pas un manque de volonté — c'est de la biochimie. Ton corps se prépare. 🌙`,

    normal: (ctx) => `${ctx.name}, en phase lutéale (J${ctx.currentDay}) tu peux ressentir :\n\n📋 Fréquent :\n• Fatigue, énergie en baisse\n• Envies de sucre/réconfort\n• Sensibilité émotionnelle\n• Ballonnements, seins sensibles\n• Sommeil plus difficile\n• Peau plus grasse\n\nC'est la progestérone qui fait tout ça. Ton métabolisme augmente de 10-20% — mange plus, c'est normal. Tu n'es pas "faible", tu es en phase lutéale. 💜`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est passée ! Tu es maintenant en phase lutéale (J${ctx.currentDay}).\n\nProchaines règles estimées dans environ ${ctx.daysUntilPeriod} jours.\n\n📋 À prévoir :\n• Énergie en baisse progressive\n• Adapter le sport (moins intense)\n• Plus de glucides complexes\n• Routine de sommeil stricte\n\nTon corps se prépare pour les prochaines règles. 🌸`,

    regles: (ctx) => `${ctx.name}, tes prochaines règles sont estimées dans environ ${ctx.daysUntilPeriod} jours.\n\n📋 Prépare-toi :\n• Stock de magnésium (chocolat noir, amandes)\n• Tisanes (camomille, gingembre)\n• Bouillotte prête\n• Repas anti-inflammatoires\n• Planifie des journées plus calmes\n\nSi tes règles sont irrégulières, note bien quand elles arrivent dans le calendrier — ça aide LUNA à mieux estimer. 📅`,

    manger: (ctx) => adaptFoodText(`${ctx.name}, ton métabolisme augmente de 10-20% en phase lutéale — tu as VRAIMENT besoin de 200 à 300 cal de plus par jour.\n\n🥗 À privilégier :\n• Glucides complexes : patate douce, avoine, riz complet\n• Magnésium : chocolat noir, amandes, noix\n• Vitamine B6 : banane, avocat, volaille\n• Tryptophane (précurseur de sérotonine) : dinde, œufs, graines de courge\n\n🍫 Envies de sucre ? C'est ta sérotonine qui baisse. Les glucides complexes la remontent sans le crash. Zéro culpabilité. 💛`, ctx),

    sport: (ctx) => `${ctx.name}, à J${ctx.currentDay} adapte l'intensité !\n\n${ctx.currentDay <= ctx.cycleLength - 7
      ? '📋 Première moitié lutéale :\n• Musculation modérée\n• Natation, vélo\n• Cardio moyen\n• Pilates'
      : '📋 Fin de phase lutéale :\n• Yoga doux, yin yoga\n• Marche\n• Stretching, foam rolling\n• Pilates léger'}\n\nTon corps récupère moins bien — baisse l'intensité progressivement. Le foam rolling est ton meilleur ami. 🧘‍♀️`,

    dormir: (ctx) => `${ctx.name}, la progestérone te rend somnolente MAIS peut fragmenter ton sommeil — c'est le paradoxe lutéal.\n\n🌙 Solutions :\n• Magnésium au coucher\n• Tisane camomille 45 min avant\n• Pas d'écran après 21h\n• Chambre à 18-19°C (ta temp corporelle monte)\n• Pas de café après 14h (la progestérone rend plus sensible)\n• Routine STRICTE : même heure chaque soir\n\nVise 8-9h en phase lutéale. 😴`,

    sucre: (ctx) => adaptFoodText(`${ctx.name}, les envies de sucre en phase lutéale sont 100% biologiques !\n\n🧠 Pourquoi :\n• Ta sérotonine baisse\n• Ton métabolisme augmente (+10-20%)\n• Ton corps demande du carburant\n\n✅ Solutions malignes :\n• Chocolat noir 70%+ (magnésium + plaisir)\n• Porridge avoine-banane-cannelle\n• Dattes + beurre de cacahuète\n• Patate douce rôtie au miel\n• Smoothie banane-cacao\n\nMange. Nourris. Ton. Corps. C'est pas de la faiblesse, c'est de la biologie. 💛`, ctx),

    ballonnements: (ctx) => adaptFoodText(`${ctx.name}, les ballonnements en phase lutéale sont liés à la progestérone qui ralentit la digestion.\n\n💡 Solutions :\n• Mange lentement, portions plus petites\n• Gingembre (tisane ou dans les plats)\n• Fenouil (tisane miracle anti-ballonnements)\n• Évite : sodas, chewing-gums, crucifères crus\n• Marche 15 min après les repas\n• Probiotiques : yaourt, kéfir\n\nC'est temporaire — ça s'améliore après les règles. 🌿`, ctx),

    irritabilite: (ctx) => adaptFoodText(`${ctx.name}, l'irritabilité en phase lutéale est ultra fréquente. La chute d'œstrogène + la montée de progestérone impactent directement la sérotonine.\n\n🧘‍♀️ Plan d'action :\n• Magnésium (régule le système nerveux)\n• Oméga-3 (saumon, noix)\n• Respiration 4-7-8 quand ça monte\n• Limite le café et le sucre raffiné\n• Mouvement doux (marche, yoga)\n• Communique tes besoins à ton entourage\n\nCe n'est PAS toi — ce sont tes hormones. Et c'est valide. 💜`, ctx),

    acne: (ctx) => adaptFoodText(`${ctx.name}, l'acné pré-menstruelle est liée à la chute d'œstrogène et la montée relative de testostérone.\n\n✨ Plan peau :\n• Zinc : graines de courge, pois chiches, fruits de mer\n• Oméga-3 : saumon, graines de lin\n• Évite les produits laitiers (si sensible)\n• Nettoyage doux (pas de décapage !)   \n• Hydrate bien ta peau\n• Évite de toucher ton visage\n\nZone T et mâchoire = typiquement hormonal. Ça s'améliore après les règles. 🌸`, ctx),

    pleurer: (ctx) => `${ctx.name}, l'envie de pleurer en phase lutéale c'est la chute de sérotonine + les fluctuations de progestérone.\n\nC'est valide. C'est hormonal. C'est PAS de la faiblesse.\n\n💛 Ce qui aide :\n• Pleure si tu en as besoin (ça libère le stress)\n• Magnésium + B6 (régulent l'humeur)\n• Mouvement doux (endorphines)\n• Journal intime (écris ce que tu ressens)\n• Contact physique (câlin, massage)\n\nDans quelques jours ça passe — tes hormones se stabilisent. 🌱`,

    stress: (ctx) => `${ctx.name}, ton seuil de stress est naturellement plus bas en phase lutéale — la progestérone amplifie tout.\n\n🧘 Plan anti-stress :\n• Respiration guidée (utilise l'outil LUNA)\n• Magnésium matin + soir\n• Réduis ta to-do list (priorise)\n• Dis non plus souvent\n• Nature (même 15 min)\n• Limite les réseaux sociaux\n\nTon corps est en mode "protection" — respecte ça. Tu seras en mode "action" dans quelques jours. 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, la confiance peut baisser en phase lutéale — c'est l'œstrogène qui chute.\n\n💪 Rappels importants :\n• C'est TEMPORAIRE (quelques jours)\n• Ta valeur ne dépend pas de ton énergie\n• Réduis les comparaisons (limite les réseaux)\n• Fais des choses qui te font du bien\n• Relis tes réussites dans ton journal\n\nDans quelques jours, la phase folliculaire ramène la confiance naturellement. En attendant, sois douce avec toi. ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau en phase lutéale est liée à la progestérone.\n\n💧 Solutions :\n• Hydrate-toi +++ (ça paraît paradoxal mais ça aide)\n• Réduis le sel\n• Potassium : banane, avocat, patate douce\n• Marche quotidienne (circulation)\n• Tisane de pissenlit (drainante)\n• Surélève tes jambes le soir\n\nTu peux prendre 1-3 kg — c'est de l'eau, pas du gras. Ça part en début de règles. 💛`,

    hiit: (ctx) => `${ctx.name}, en phase lutéale le HIIT c'est déconseillé — surtout en fin de phase.\n\n${ctx.currentDay <= ctx.cycleLength - 7
      ? 'Tu es en début de phase lutéale — tu peux encore faire du cardio modéré, de la muscu légère. Mais écoute ton corps.'
      : 'Tu es en fin de phase lutéale — privilégie yoga, marche, Pilates. Ton corps récupère moins bien.'}\n\n🧠 Pourquoi :\n• Cortisol déjà élevé (le HIIT en rajoute)\n• Récupération musculaire réduite\n• Risque de blessure augmenté\n\nGarde le HIIT pour la phase folliculaire — c'est là que tu en tires le max. 💪`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, voici des snacks réconfortants pour ta phase lutéale :\n\n🍫 Idées snack :\n• Pudding de chia au chocolat (magnésium + oméga-3)\n• Muffins banane-noix (tryptophane + glucides complexes)\n• Tartine beurre de cacahuète + banane\n• Chocolat noir 70% + amandes\n• Dattes + noix de cajou\n• Porridge froid overnight oats\n\n💡 Ton métabolisme augmente de 10-20% — ces snacks nourrissent le besoin sans le crash. Zéro culpabilité ! 💛\n\n👉 Va voir Recettes > Snacks pour les recettes complètes ! 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, voici les boissons idéales pour ta phase lutéale :\n\n🍵 À privilégier :\n• Chocolat chaud au lait d'amande (magnésium + réconfort)\n• Tisane camomille-lavande (apaisante)\n• Moon milk à l'ashwagandha (relaxant)\n• Tisane de gingembre (anti-ballonnements)\n• Rooibos (sans caféine + antioxydants)\n\n🚫 À limiter :\n• Café après 14h (progestérone = plus sensible à la caféine)\n\n💡 La camomille + le magnésium = combo anti-SPM. 🌙`, ctx),

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! 🧊\n\nEntre tes ingrédients et LUNA te propose les meilleures recettes pour ta phase lutéale.\n\n💡 En phase lutéale, priorise :\n• Glucides complexes : patate douce, avoine\n• Magnésium : chocolat noir, amandes\n• Tryptophane : dinde, banane, graines de courge\n\nTon métabolisme augmente — nourris-le bien ! 💛`,

    default: (ctx) => adaptFoodText(`${ctx.name}, tu es à J${ctx.currentDay} — phase lutéale. La progestérone domine.\n\n📋 Tes priorités :\n• Mange plus (+200-300 cal/jour, glucides complexes)\n• Sport modéré → doux\n• Sommeil 8-9h (routine stricte)\n• Magnésium +++\n• Bienveillance envers toi-même\n\nEncore ${ctx.daysUntilPeriod} jours avant tes règles. Les envies, la fatigue, les émotions — c'est hormonal, pas personnel. 💜`, ctx),
  },
};

// Mapping de mots-clés vers les clés de réponse
const KEYWORD_MAP = [
  { keys: ['fatigue', 'fatiguée', 'épuisée', 'crevée', 'énergie', 'aucune énergie', 'pas d\'énergie', 'force', 'booster', 'vidée'], response: 'fatigue' },
  { keys: ['normal', 'ressens', 'symptôme', 'symptome', 'bizarre', 'inquiète', 'sens'], response: 'normal' },
  { keys: ['ovulation', 'ovule', 'fertile', 'fertilité', 'enceinte', 'bébé'], response: 'ovulation' },
  { keys: ['règles', 'regles', 'prochaines', 'combien de jours', 'menstruel'], response: 'regles' },
  { keys: ['manger', 'aliment', 'nourrir', 'faim', 'cuisine', 'nutrition', 'besoin', 'petit-déj', 'déjeuner', 'dîner'], response: 'manger' },
  { keys: ['sport', 'exercice', 'entraîn', 'entrainement', 'fitness', 'mouvement', 'bouger', 'muscu', 'course'], response: 'sport' },
  { keys: ['dormir', 'sommeil', 'coucher', 'insomnie', 'nuit', 'soir', 'routine'], response: 'dormir' },
  { keys: ['sucre', 'envie', 'craving', 'chocolat', 'gourmand', 'grignoter', 'craquer'], response: 'sucre' },
  { keys: ['ballon', 'gonfle', 'ventre', 'digestion', 'gaz', 'gonflé', 'ballonnement'], response: 'ballonnements' },
  { keys: ['irritable', 'irritabilité', 'colère', 'énerv', 'agacée', 'humeur', 'nerv'], response: 'irritabilite' },
  { keys: ['acné', 'bouton', 'peau', 'imperfection', 'teint'], response: 'acne' },
  { keys: ['pleurer', 'pleure', 'larme', 'triste', 'tristesse', 'déprimée', 'déprime'], response: 'pleurer' },
  { keys: ['stress', 'anxi', 'panique', 'overwhelm', 'submergée', 'débordée'], response: 'stress' },
  { keys: ['confiance', 'estime', 'légitime', 'nulle', 'imposteur', 'doute'], response: 'confiance' },
  { keys: ['rétention', 'eau', 'gonflée', 'poids', 'kilo'], response: 'retention' },
  { keys: ['recette', 'plat', 'repas', 'menu', 'réconfort', 'cuisiner'], response: 'manger' },
  { keys: ['snack', 'goûter', 'grignoter', 'encas', 'collation', '4 heures'], response: 'snack' },
  { keys: ['boisson', 'boire', 'thé', 'tisane', 'smoothie', 'infusion', 'latte', 'jus'], response: 'boisson' },
  { keys: ['frigo', 'ingrédient', 'restes', 'quoi faire avec', 'j\'ai dans mon'], response: 'frigo' },
  { keys: ['hiit', 'intense', 'cardio', 'crossfit', 'sprint'], response: 'hiit' },
  { keys: ['yoga'], response: 'sport' },
];

// ===== SYSTÈME DE RÉPONSE DYNAMIQUE =====
// Gère les questions "puis-je...?", "est-ce que je peux...?" sur des sujets spécifiques

const PHASE_LABELS = {
  menstrual: 'menstruelle',
  follicular: 'folliculaire',
  ovulatory: 'ovulatoire',
  luteal: 'lutéale',
};

const PHASE_ENERGY = {
  menstrual: 'basse',
  follicular: 'en hausse',
  ovulatory: 'au max',
  luteal: 'en baisse',
};

// Aliments et conseils par phase
const FOOD_ADVICE = {
  menstrual: {
    good: ['lentilles', 'épinards', 'viande rouge', 'saumon', 'sardines', 'chocolat noir', 'gingembre', 'curcuma', 'amandes', 'banane', 'avocat', 'patate douce', 'riz complet', 'tofu', 'œufs', 'poulet', 'quinoa', 'fruits rouges', 'brocoli', 'noix', 'graines de lin', 'kiwi', 'orange', 'poivron', 'yaourt', 'kéfir', 'soupe', 'bouillon', 'thé vert', 'tisane'],
    ok: ['pâtes', 'pain', 'riz', 'fromage', 'pomme de terre', 'concombre', 'tomate', 'carotte', 'courgette', 'haricots', 'maïs', 'mangue', 'ananas', 'pastèque', 'melon', 'raisin', 'pomme', 'poire', 'miel', 'crème', 'beurre'],
    limit: ['café', 'alcool', 'sodas', 'fritures', 'charcuterie', 'sucre raffiné', 'sel en excès', 'plats très épicés'],
    why_good: 'Ton corps perd du fer et a besoin d\'anti-inflammatoires.',
    why_limit: 'Ça peut amplifier l\'inflammation, les crampes et la rétention d\'eau.',
  },
  follicular: {
    good: ['poulet', 'œufs', 'quinoa', 'légumineuses', 'graines de courge', 'pois chiches', 'yaourt', 'kéfir', 'kimchi', 'avocat', 'brocoli', 'épinards', 'saumon', 'légumes colorés', 'graines germées', 'noix', 'amandes', 'fruits frais', 'tofu', 'lentilles', 'patate douce', 'riz complet', 'haricots', 'crevettes', 'thon'],
    ok: ['viande rouge', 'pâtes', 'pain', 'fromage', 'chocolat', 'riz', 'pomme de terre', 'crème', 'beurre', 'miel', 'café', 'concombre', 'tomate', 'carotte', 'mangue', 'ananas', 'banane'],
    limit: ['alcool en excès', 'sodas', 'fast food', 'sucre raffiné en excès'],
    why_good: 'L\'œstrogène remonte — ton corps est en mode construction et récupération.',
    why_limit: 'Ton corps est efficace, pas la peine de le charger inutilement.',
  },
  ovulatory: {
    good: ['légumes verts', 'brocoli', 'chou-fleur', 'chou', 'fruits rouges', 'quinoa', 'graines', 'saumon', 'avocat', 'concombre', 'tomate', 'radis', 'céréales complètes', 'légumineuses', 'kéfir', 'kombucha', 'edamame', 'spiruline'],
    ok: ['poulet', 'œufs', 'viande rouge', 'pâtes', 'riz', 'pain', 'fromage', 'pomme de terre', 'chocolat', 'café', 'fruits', 'noix', 'amandes', 'tofu', 'poisson', 'patate douce', 'banane'],
    limit: ['alcool', 'sodas', 'fritures', 'sucre raffiné', 'plats très lourds'],
    why_good: 'Ton œstrogène est au max — les fibres et crucifères aident ton foie à éliminer l\'excès.',
    why_limit: 'Ton corps est au top, pas besoin de le ralentir.',
  },
  luteal: {
    good: ['patate douce', 'avoine', 'riz complet', 'chocolat noir', 'amandes', 'noix', 'banane', 'avocat', 'dinde', 'poulet', 'œufs', 'graines de courge', 'saumon', 'épinards', 'lentilles', 'quinoa', 'yaourt', 'dattes', 'cannelle', 'gingembre', 'camomille'],
    ok: ['viande rouge', 'pâtes', 'pain', 'riz', 'fromage', 'pomme de terre', 'tofu', 'fruits', 'légumes', 'beurre de cacahuète', 'miel', 'crème', 'concombre', 'tomate'],
    limit: ['café après 14h', 'alcool', 'sucre raffiné', 'sel en excès', 'sodas', 'fritures', 'aliments ultra-transformés'],
    why_good: 'Ton métabolisme augmente de 10-20% et ta sérotonine baisse — les glucides complexes et le magnésium sont tes meilleurs alliés.',
    why_limit: 'Ça peut aggraver les ballonnements, l\'irritabilité et les troubles du sommeil.',
  },
};

// Sports et conseils par phase
const SPORT_ADVICE = {
  menstrual: {
    great: ['yoga', 'yoga restauratif', 'yin yoga', 'stretching', 'marche', 'marche douce', 'natation douce', 'pilates doux', 'tai chi', 'méditation'],
    ok: ['natation', 'pilates', 'vélo léger', 'danse douce', 'aquagym'],
    caution: ['hiit', 'crossfit', 'sprint', 'musculation lourde', 'boxe', 'running intense', 'cardio intense', 'muscu', 'course intensive', 'marathon'],
    why: 'Tes hormones sont au plus bas — ton corps récupère. L\'objectif c\'est de bouger en douceur.',
  },
  follicular: {
    great: ['hiit', 'musculation', 'muscu', 'cardio', 'course', 'running', 'sprint', 'danse', 'boxe', 'escalade', 'crossfit', 'natation', 'vélo', 'tennis', 'football', 'basketball', 'handball'],
    ok: ['yoga', 'pilates', 'marche', 'stretching', 'natation douce', 'randonnée', 'ski', 'surf', 'badminton', 'volleyball'],
    caution: [],
    why: 'L\'œstrogène remonte = meilleure récupération musculaire. C\'est ta MEILLEURE phase pour te dépasser !',
  },
  ovulatory: {
    great: ['hiit', 'sprint', 'musculation lourde', 'boxe', 'crossfit', 'course', 'danse', 'sports d\'équipe', 'tennis', 'escalade', 'cardio intense', 'muscu'],
    ok: ['natation', 'vélo', 'yoga', 'pilates', 'marche', 'randonnée', 'surf', 'tout sport'],
    caution: [],
    why: 'Pic hormonal = pic de performance ! Tout est au max. Attention juste à bien t\'échauffer (ligaments plus lâches).',
  },
  luteal: {
    great: ['yoga', 'pilates', 'marche', 'natation', 'stretching', 'foam rolling', 'yin yoga', 'tai chi', 'vélo doux'],
    ok: ['musculation modérée', 'muscu légère', 'natation', 'vélo', 'danse', 'randonnée calme', 'aquagym'],
    caution: ['hiit', 'crossfit', 'sprint', 'cardio intense', 'musculation lourde', 'boxe', 'running intense', 'marathon'],
    why: 'La progestérone augmente, le cortisol aussi — ton corps récupère moins bien. Baisse l\'intensité progressivement.',
  },
};

// Alternatives intelligentes par catégorie d'envie
const SMART_FOOD_ALTERNATIVES = {
  // Envie de sucré
  sucre: ['chocolat noir 70%+', 'dattes', 'banane', 'miel', 'fruits secs', 'compote maison sans sucre ajouté'],
  'sucre raffiné': ['chocolat noir 70%+', 'dattes', 'banane écrasée', 'miel', 'sirop d\'érable', 'fruits secs'],
  chocolat: ['chocolat noir 70%+ (riche en magnésium !)', 'cacao cru en smoothie', 'mousse au chocolat noir maison'],
  bonbon: ['fruits secs (abricots, figues)', 'dattes fourrées aux amandes', 'billes d\'énergie maison'],
  gâteau: ['banana bread maison', 'energy balls avoine-cacao', 'pancakes à la banane', 'muffins aux myrtilles sans sucre raffiné'],
  glace: ['nice cream (banane congelée mixée)', 'yaourt glacé aux fruits', 'sorbet maison'],
  pâtisserie: ['energy balls', 'banana bread', 'crumble aux fruits avec flocons d\'avoine'],
  biscuit: ['galettes de riz + beurre de cacahuète', 'crackers maison aux graines', 'biscuits avoine-banane'],
  confiture: ['compote maison', 'purée de fruits', 'tranches de banane + miel'],
  nutella: ['purée de noisettes + cacao', 'beurre de cacahuète + cacao', 'pâte à tartiner maison'],
  sirop: ['miel', 'sirop d\'érable pur (en petite quantité)', 'purée de dattes'],
  soda: ['eau pétillante + citron', 'kombucha', 'eau infusée (concombre, menthe, fruits)', 'jus frais maison dilué'],

  // Envie de caféine
  café: ['thé vert matcha', 'chicorée', 'décaféiné', 'golden latte (lait + curcuma)', 'thé chai'],
  thé: ['tisane (camomille, verveine)', 'rooibos', 'infusion gingembre-citron'],

  // Envie d'alcool
  alcool: ['kombucha', 'mocktail aux fruits', 'eau pétillante + sirop naturel', 'jus de cranberry pétillant'],
  vin: ['kombucha', 'jus de raisin pétillant', 'mocktail rosé (eau de rose + pamplemousse)'],
  bière: ['bière sans alcool', 'kombucha', 'ginger beer artisanale'],
  'alcool en excès': ['mocktails', 'kombucha', 'eau pétillante aromatisée'],

  // Envie de gras/salé
  frites: ['patates douces rôties au four', 'frites de légumes (carottes, courgettes)', 'chips de chou kale'],
  fritures: ['version au four', 'air fryer', 'légumes rôtis croustillants', 'falafels au four'],
  pizza: ['pizza maison sur pâte complète', 'galette de sarrasin garnie', 'pizza sur base de chou-fleur'],
  burger: ['burger maison avec pain complet', 'burger de lentilles', 'wrap de laitue garni'],
  'fast food': ['version maison (burger, wraps, bowls)', 'pokeball maison', 'wrap poulet-avocat'],
  kebab: ['wrap maison poulet grillé + crudités + sauce yaourt', 'bowl méditerranéen'],
  tacos: ['tacos maison avec tortilla de maïs + garniture fraîche', 'bowl mexicain'],
  charcuterie: ['saumon fumé', 'poulet grillé émincé', 'houmous + crudités'],
  'sel en excès': ['herbes aromatiques', 'épices', 'citron', 'graines de sésame'],

  // Plats lourds
  'plats très lourds': ['bowls équilibrés', 'plats complets mais légers', 'wok de légumes + protéine'],
  'plats très épicés': ['épices douces (curcuma, cannelle, cumin)', 'herbes fraîches', 'gingembre frais'],
  'aliments ultra-transformés': ['version maison du même plat', 'snacks faits maison', 'crackers + houmous'],
  'café après 14h': ['décaféiné', 'tisane relaxante', 'golden latte', 'rooibos', 'eau citronnée tiède'],
  'sucre raffiné en excès': ['chocolat noir', 'dattes', 'fruits frais', 'smoothie maison'],
};

// Alternatives intelligentes par catégorie de sport
const SMART_SPORT_ALTERNATIVES = {
  hiit: ['circuit training modéré', 'HIIT adapté (intervalles plus longs, repos plus longs)', 'vélo à intervalles doux'],
  crossfit: ['circuit training modéré', 'musculation contrôlée', 'pilates dynamique'],
  sprint: ['marche rapide', 'course modérée', 'vélo à rythme confortable'],
  'cardio intense': ['cardio modéré (vélo, elliptique)', 'marche rapide', 'natation tranquille'],
  'musculation lourde': ['musculation modérée (charges réduites)', 'pilates avec résistance', 'yoga power'],
  boxe: ['shadow boxing léger', 'arts martiaux doux (tai chi)', 'cours de self-defense débutant'],
  'running intense': ['jogging léger', 'marche rapide', 'marche nordique'],
  'course intensive': ['jogging tranquille', 'marche rapide en nature', 'vélo doux'],
  marathon: ['course courte et modérée', 'marche longue', 'vélo sur distance'],
  muscu: ['pilates', 'yoga dynamique', 'musculation légère avec plus de répétitions'],
};

// ===== BASE DE DONNÉES RECETTES PAR PHASE × REPAS =====
const RECIPES = {
  menstrual: {
    petit_dej: [
      {
        name: 'Porridge réconfort anti-crampes',
        ingredients: ['flocons d\'avoine', 'lait végétal', 'banane', 'chocolat noir', 'cannelle', 'graines de lin'],
        instructions: 'Fais cuire les flocons dans le lait 5 min. Ajoute la banane écrasée, le chocolat noir en copeaux, la cannelle et les graines de lin.',
        why: 'L\'avoine apporte des glucides lents, la banane du magnésium (anti-crampes), le chocolat noir booste la sérotonine.',
        tags: ['vegetarien', 'vegan_possible', 'sans_gluten_possible', 'anti-inflammatoire'],
        time: '10 min',
      },
      {
        name: 'Smoothie fer & vitalité',
        ingredients: ['épinards', 'banane', 'beurre de cacahuète', 'cacao cru', 'lait d\'amande', 'miel'],
        instructions: 'Mixe tout ensemble jusqu\'à consistance lisse. Ajoute des glaçons si tu veux.',
        why: 'Les épinards apportent du fer, le cacao du magnésium, la banane du potassium — tout ce que ton corps perd pendant les règles.',
        tags: ['vegetarien', 'vegan_possible', 'sans_gluten', 'rapide'],
        time: '5 min',
      },
      {
        name: 'Tartines avocat-œuf mollet',
        ingredients: ['pain complet', 'avocat', 'œuf', 'citron', 'sel', 'poivre', 'graines de sésame'],
        instructions: 'Fais cuire l\'œuf 6 min dans l\'eau bouillante. Écrase l\'avocat avec le citron. Tartine et dépose l\'œuf.',
        why: 'L\'avocat apporte du bon gras et du potassium, l\'œuf des protéines et du fer héminique facile à absorber.',
        tags: ['vegetarien', 'rapide'],
        time: '10 min',
      },
    ],
    dejeuner: [
      {
        name: 'Bowl lentilles-patate douce-épinards',
        ingredients: ['lentilles corail', 'patate douce', 'épinards', 'curcuma', 'ail', 'huile d\'olive', 'citron'],
        instructions: 'Rôtis la patate douce en cubes 25 min au four. Cuis les lentilles 15 min avec le curcuma. Assemble avec les épinards frais, l\'ail et un filet de citron.',
        why: 'Les lentilles = fer + protéines végétales. Le curcuma est anti-inflammatoire. La patate douce apporte des glucides complexes réconfortants.',
        tags: ['vegan', 'sans_gluten', 'anti-inflammatoire', 'riche_fer'],
        time: '30 min',
      },
      {
        name: 'Saumon teriyaki & riz complet',
        ingredients: ['pavé de saumon', 'sauce soja', 'miel', 'gingembre', 'riz complet', 'brocoli', 'graines de sésame'],
        instructions: 'Marine le saumon dans soja+miel+gingembre 15 min. Poêle 4 min chaque côté. Sers avec le riz et le brocoli vapeur.',
        why: 'Le saumon = oméga-3 anti-inflammatoires (réduit les crampes). Le gingembre apaise les nausées. Le brocoli apporte du fer végétal.',
        tags: ['sans_gluten_possible', 'omega3', 'anti-inflammatoire'],
        time: '25 min',
      },
      {
        name: 'Soupe veloutée réconfort',
        ingredients: ['carottes', 'patate douce', 'gingembre frais', 'lait de coco', 'curcuma', 'bouillon de légumes'],
        instructions: 'Fais cuire carottes et patate douce dans le bouillon 20 min. Ajoute gingembre, curcuma, lait de coco. Mixe.',
        why: 'Chaleur + gingembre anti-nausée + curcuma anti-inflammatoire = le combo parfait pour les jours de règles.',
        tags: ['vegan', 'sans_gluten', 'anti-inflammatoire', 'réconfortant'],
        time: '25 min',
      },
    ],
    diner: [
      {
        name: 'Wok doux poulet-gingembre',
        ingredients: ['poulet émincé', 'gingembre frais', 'brocoli', 'carottes', 'sauce soja', 'huile de sésame', 'riz basmati'],
        instructions: 'Fais sauter le poulet avec le gingembre râpé. Ajoute les légumes et la sauce soja. Sers sur le riz.',
        why: 'Le gingembre soulage crampes et nausées. Le poulet apporte des protéines légères. Les légumes fournissent fer et vitamines.',
        tags: ['léger', 'anti-inflammatoire'],
        time: '20 min',
      },
      {
        name: 'Dahl de lentilles corail',
        ingredients: ['lentilles corail', 'tomates concassées', 'lait de coco', 'curcuma', 'cumin', 'gingembre', 'ail', 'riz'],
        instructions: 'Fais revenir ail, gingembre, épices. Ajoute lentilles + tomates + lait de coco. Cuis 20 min. Sers avec du riz.',
        why: 'Ultra réconfortant, riche en fer, anti-inflammatoire avec le curcuma. Le repas doudou parfait pour les règles.',
        tags: ['vegan', 'sans_gluten', 'réconfortant', 'riche_fer'],
        time: '25 min',
      },
    ],
    gouter: [
      {
        name: 'Chocolat chaud au lait d\'amande',
        ingredients: ['lait d\'amande', 'cacao cru', 'miel', 'cannelle', 'une pincée de sel'],
        instructions: 'Chauffe le lait, fouette avec le cacao, le miel et la cannelle.',
        why: 'Le cacao = magnésium pur (anti-crampes + boost sérotonine). La cannelle régule la glycémie.',
        tags: ['vegan_possible', 'sans_gluten', 'réconfortant'],
        time: '5 min',
      },
      {
        name: 'Energy balls cacao-dattes',
        ingredients: ['dattes Medjool', 'amandes', 'cacao cru', 'noix de coco râpée', 'beurre de cacahuète'],
        instructions: 'Mixe tout au blender. Forme des boules. 30 min au frigo.',
        why: 'Les dattes = fer + énergie rapide. Les amandes = magnésium. Le cacao = sérotonine. Le goûter anti-règles parfait.',
        tags: ['vegan', 'sans_gluten', 'batch_cooking'],
        time: '10 min + 30 min frigo',
      },
    ],
    snack: [
      { name: 'Banane + chocolat noir 70%', why: 'Magnésium + potassium + sérotonine', tags: ['vegan', 'sans_gluten'] },
      { name: 'Amandes + dattes', why: 'Magnésium + fer + énergie douce', tags: ['vegan', 'sans_gluten'] },
      { name: 'Yaourt + miel + graines de lin', why: 'Protéines + oméga-3 + douceur', tags: ['vegetarien', 'sans_gluten'] },
      { name: 'Tartine beurre de cacahuète + banane', why: 'Protéines + magnésium + réconfort', tags: ['vegan_possible'] },
    ],
  },
  follicular: {
    petit_dej: [
      {
        name: 'Omelette protéinée aux herbes',
        ingredients: ['3 œufs', 'épinards', 'feta', 'herbes fraîches', 'pain complet grillé'],
        instructions: 'Bats les œufs, ajoute épinards et herbes. Cuis en omelette, ajoute la feta. Sers avec le pain grillé.',
        why: 'L\'œstrogène remonte = ton corps construit du muscle. Les protéines du matin maximisent cette fenêtre anabolique.',
        tags: ['vegetarien', 'riche_protéines'],
        time: '10 min',
      },
      {
        name: 'Bowl protéiné açaï-granola',
        ingredients: ['purée d\'açaï', 'banane', 'granola', 'graines de courge', 'fruits frais', 'yaourt grec'],
        instructions: 'Mixe l\'açaï congelé avec la banane. Verse dans un bowl. Ajoute granola, graines et fruits.',
        why: 'L\'açaï = antioxydants puissants. Le yaourt grec = protéines. Les graines de courge = zinc pour la croissance folliculaire.',
        tags: ['vegetarien', 'sans_gluten_possible'],
        time: '5 min',
      },
      {
        name: 'Smoothie vert protéiné',
        ingredients: ['épinards', 'banane', 'yaourt grec', 'graines de chanvre', 'mangue', 'lait d\'amande'],
        instructions: 'Mixe tout. Ajoute des glaçons si tu veux.',
        why: 'Protéines + zinc + fer + antioxydants. Ton corps absorbe mieux les nutriments en phase folliculaire.',
        tags: ['vegetarien', 'sans_gluten', 'rapide'],
        time: '5 min',
      },
    ],
    dejeuner: [
      {
        name: 'Pokeball saumon-avocat-quinoa',
        ingredients: ['quinoa', 'saumon frais ou fumé', 'avocat', 'edamame', 'concombre', 'mangue', 'sauce soja', 'graines de sésame'],
        instructions: 'Cuis le quinoa. Dispose tous les ingrédients en bowl. Arrose de sauce soja et graines de sésame.',
        why: 'Protéines complètes du quinoa + oméga-3 du saumon + zinc des edamame = combo parfait pour la construction hormonale.',
        tags: ['sans_gluten', 'riche_protéines'],
        time: '20 min',
      },
      {
        name: 'Salade poulet grillé-grenade-feta',
        ingredients: ['poulet grillé', 'mesclun', 'grenade', 'feta', 'noix', 'vinaigrette citron-huile d\'olive'],
        instructions: 'Grille le poulet. Assemble la salade. Ajoute grenade, feta, noix et vinaigrette.',
        why: 'Protéines + antioxydants de la grenade + bon gras des noix. Léger mais nourrissant pour ton énergie montante.',
        tags: ['sans_gluten'],
        time: '15 min',
      },
      {
        name: 'Wrap pois chiches-légumes grillés',
        ingredients: ['pois chiches', 'courgette', 'poivron', 'houmous', 'tortilla complète', 'épinards', 'citron'],
        instructions: 'Grille les légumes et les pois chiches au four. Tartine la tortilla de houmous, garnis et roule.',
        why: 'Pois chiches = protéines + zinc + fer. Parfait pour soutenir la production d\'œstrogène.',
        tags: ['vegan', 'riche_fer'],
        time: '20 min',
      },
    ],
    diner: [
      {
        name: 'Sauté de crevettes à l\'ail et brocoli',
        ingredients: ['crevettes', 'brocoli', 'ail', 'gingembre', 'sauce soja', 'riz complet', 'huile de sésame'],
        instructions: 'Fais sauter l\'ail et gingembre, ajoute les crevettes 3 min, puis le brocoli. Sauce soja + sésame. Sers sur le riz.',
        why: 'Les crevettes = iode + zinc + protéines légères. Le brocoli aide le foie à métaboliser l\'œstrogène qui monte.',
        tags: ['sans_gluten', 'léger'],
        time: '15 min',
      },
      {
        name: 'Buddha bowl quinoa-légumes rôtis',
        ingredients: ['quinoa', 'patate douce', 'pois chiches', 'kale', 'avocat', 'tahini', 'citron'],
        instructions: 'Rôtis patate douce et pois chiches 25 min. Assemble avec quinoa, kale massé, avocat et sauce tahini-citron.',
        why: 'Protéines complètes + fer + zinc + fibres. Nourrissant et parfait pour la construction hormonale.',
        tags: ['vegan', 'sans_gluten', 'riche_fer'],
        time: '30 min',
      },
    ],
    gouter: [
      {
        name: 'Toast avocat-graines de courge',
        ingredients: ['pain complet', 'avocat', 'graines de courge', 'citron', 'piment d\'Espelette'],
        instructions: 'Écrase l\'avocat avec le citron. Tartine. Parsème de graines de courge et piment.',
        why: 'L\'avocat apporte du bon gras, les graines de courge du zinc essentiel pour la croissance folliculaire.',
        tags: ['vegan', 'rapide'],
        time: '5 min',
      },
      {
        name: 'Yaourt grec, miel, noix & graines',
        ingredients: ['yaourt grec', 'miel', 'noix', 'graines de courge', 'quelques myrtilles'],
        instructions: 'Assemble dans un bol. C\'est tout !',
        why: 'Protéines du yaourt + zinc des graines + antioxydants des myrtilles. Le goûter construction musculaire.',
        tags: ['vegetarien', 'sans_gluten', 'rapide'],
        time: '2 min',
      },
    ],
    snack: [
      { name: 'Pomme + beurre d\'amande', why: 'Fibres + protéines + bon gras', tags: ['vegan', 'sans_gluten'] },
      { name: 'Graines de courge + quelques noix de cajou', why: 'Zinc + magnésium pour la production hormonale', tags: ['vegan', 'sans_gluten'] },
      { name: 'Edamame salés', why: 'Protéines végétales + phytoœstrogènes', tags: ['vegan', 'sans_gluten'] },
      { name: 'Houmous + bâtonnets de carottes', why: 'Fer + zinc + fibres', tags: ['vegan', 'sans_gluten'] },
    ],
  },
  ovulatory: {
    petit_dej: [
      {
        name: 'Smoothie bowl antioxydant',
        ingredients: ['fruits rouges congelés', 'banane', 'épinards', 'graines de chia', 'granola', 'noix de coco'],
        instructions: 'Mixe les fruits, banane et épinards épais. Verse en bowl. Décore avec chia, granola et coco.',
        why: 'Les antioxydants des fruits rouges + fibres des graines aident ton foie à éliminer l\'excès d\'œstrogène au pic.',
        tags: ['vegan_possible', 'sans_gluten_possible'],
        time: '5 min',
      },
      {
        name: 'Tartines complètes saumon-concombre',
        ingredients: ['pain de seigle', 'saumon fumé', 'fromage frais', 'concombre', 'aneth', 'citron'],
        instructions: 'Tartine de fromage frais. Dépose le saumon, concombre et aneth. Filet de citron.',
        why: 'Protéines + oméga-3 + légèreté. Ton métabolisme est rapide, pas besoin de te charger.',
        tags: ['léger'],
        time: '5 min',
      },
    ],
    dejeuner: [
      {
        name: 'Salade croquante quinoa-avocat-grenade',
        ingredients: ['quinoa', 'avocat', 'grenade', 'roquette', 'concombre', 'radis', 'vinaigrette citron-tahini'],
        instructions: 'Assemble tous les ingrédients frais sur le quinoa cuit et froid. Arrose de vinaigrette.',
        why: 'Fibres du quinoa + crucifères (roquette) aident le foie à métaboliser l\'excès d\'œstrogène. Frais et léger pour ton pic d\'énergie.',
        tags: ['vegan', 'sans_gluten', 'léger'],
        time: '15 min',
      },
      {
        name: 'Wok de légumes croquants-tofu',
        ingredients: ['tofu ferme', 'brocoli', 'poivron', 'edamame', 'sauce soja', 'gingembre', 'huile de sésame'],
        instructions: 'Presse et coupe le tofu en cubes. Fais sauter avec les légumes et la sauce.',
        why: 'Crucifères (brocoli) = DIM, un composé qui aide le métabolisme de l\'œstrogène. Le tofu apporte des phytoœstrogènes doux.',
        tags: ['vegan', 'sans_gluten', 'léger'],
        time: '15 min',
      },
    ],
    diner: [
      {
        name: 'Saumon en papillote citron-herbes',
        ingredients: ['pavé de saumon', 'courgette', 'tomates cerises', 'citron', 'herbes de Provence', 'quinoa'],
        instructions: 'Emballe saumon + légumes dans du papier sulfurisé. Four 180°C, 18 min. Sers avec quinoa.',
        why: 'Oméga-3 du saumon + fibres du quinoa. Léger le soir pour un sommeil optimal malgré ton énergie débordante.',
        tags: ['sans_gluten', 'léger', 'omega3'],
        time: '25 min',
      },
      {
        name: 'Taboulé de chou-fleur frais',
        ingredients: ['chou-fleur', 'concombre', 'tomates', 'persil', 'menthe', 'citron', 'huile d\'olive', 'grenade'],
        instructions: 'Mixe le chou-fleur cru en semoule. Mélange avec les légumes coupés fin, herbes et vinaigrette.',
        why: 'Le chou-fleur = crucifère top pour aider le foie à détoxifier l\'excès d\'œstrogène. Ultra frais et léger.',
        tags: ['vegan', 'sans_gluten', 'léger'],
        time: '15 min',
      },
    ],
    gouter: [
      {
        name: 'Smoothie vert détox',
        ingredients: ['concombre', 'épinards', 'pomme verte', 'gingembre', 'citron', 'eau de coco'],
        instructions: 'Mixe tout avec des glaçons.',
        why: 'Hydratant + détoxifiant. Aide ton foie à gérer le pic d\'œstrogène.',
        tags: ['vegan', 'sans_gluten', 'détox'],
        time: '5 min',
      },
    ],
    snack: [
      { name: 'Crudités + houmous', why: 'Fibres + protéines végétales, léger et frais', tags: ['vegan', 'sans_gluten'] },
      { name: 'Fruits rouges + quelques amandes', why: 'Antioxydants + bon gras', tags: ['vegan', 'sans_gluten'] },
      { name: 'Kombucha + crackers de graines', why: 'Probiotiques + fibres', tags: ['vegan'] },
      { name: 'Edamame + graines de tournesol', why: 'Protéines + sélénium pour la détox', tags: ['vegan', 'sans_gluten'] },
    ],
  },
  luteal: {
    petit_dej: [
      {
        name: 'Porridge banane-cannelle-noix',
        ingredients: ['flocons d\'avoine', 'lait végétal', 'banane', 'cannelle', 'noix', 'miel', 'beurre de cacahuète'],
        instructions: 'Cuis les flocons 5 min. Ajoute banane écrasée, cannelle, noix et un filet de beurre de cacahuète.',
        why: 'Glucides complexes + tryptophane de la banane et de l\'avoine boostent ta sérotonine qui chute. La cannelle stabilise ta glycémie.',
        tags: ['vegan_possible', 'réconfortant', 'sans_gluten_possible'],
        time: '10 min',
      },
      {
        name: 'Pancakes protéinés banane-avoine',
        ingredients: ['banane', 'flocons d\'avoine', '2 œufs', 'cannelle', 'myrtilles', 'miel'],
        instructions: 'Mixe banane+avoine+œufs. Poêle comme des pancakes. Garnis de myrtilles et miel.',
        why: 'Glucides complexes qui boostent la sérotonine + protéines pour la satiété. Le petit-déj anti-PMS.',
        tags: ['vegetarien', 'sans_gluten'],
        time: '15 min',
      },
      {
        name: 'Tartines complètes avocat-dinde',
        ingredients: ['pain complet', 'avocat', 'tranches de dinde', 'tomate', 'graines de sésame'],
        instructions: 'Tartine l\'avocat écrasé, dépose la dinde et la tomate. Parsème de graines.',
        why: 'La dinde = tryptophane (précurseur de sérotonine). L\'avocat = magnésium + B6. Le duo anti-irritabilité.',
        tags: ['riche_protéines'],
        time: '5 min',
      },
    ],
    dejeuner: [
      {
        name: 'Curry doux patate douce-pois chiches',
        ingredients: ['patate douce', 'pois chiches', 'lait de coco', 'curry doux', 'épinards', 'riz complet'],
        instructions: 'Fais revenir la patate douce en cubes. Ajoute curry, lait de coco, pois chiches. Cuis 20 min. Ajoute les épinards en fin.',
        why: 'Patate douce = glucides complexes + vitamine B6. Pois chiches = magnésium. Lait de coco = satiété. Le repas anti-PMS par excellence.',
        tags: ['vegan', 'sans_gluten', 'réconfortant'],
        time: '25 min',
      },
      {
        name: 'Bowl automnal quinoa-poulet-avocat',
        ingredients: ['quinoa', 'poulet grillé', 'avocat', 'patate douce rôtie', 'graines de courge', 'sauce tahini'],
        instructions: 'Assemble tous les ingrédients en bowl. Nape de sauce tahini.',
        why: 'Protéines + glucides complexes + magnésium des graines. Nourrissant et stabilisant pour tes humeurs.',
        tags: ['sans_gluten'],
        time: '25 min',
      },
    ],
    diner: [
      {
        name: 'Risotto champignons-épinards',
        ingredients: ['riz arborio', 'champignons', 'épinards', 'parmesan', 'bouillon', 'ail', 'oignon'],
        instructions: 'Fais revenir oignon et champignons. Ajoute le riz, mouille au bouillon petit à petit. Incorpore épinards et parmesan en fin.',
        why: 'Les champignons = vitamine D + tryptophane. Les épinards = magnésium. Le réconfort en version nutritionnellement top.',
        tags: ['vegetarien', 'réconfortant'],
        time: '30 min',
      },
      {
        name: 'Saumon rôti, patate douce & brocoli',
        ingredients: ['pavé de saumon', 'patate douce', 'brocoli', 'huile d\'olive', 'ail', 'citron'],
        instructions: 'Rôtis patate douce 20 min. Ajoute saumon et brocoli, 15 min de plus au four.',
        why: 'Oméga-3 anti-inflammatoires + B6 de la patate douce + magnésium du brocoli. Le dîner anti-PMS complet.',
        tags: ['sans_gluten', 'omega3', 'anti-inflammatoire'],
        time: '35 min',
      },
    ],
    gouter: [
      {
        name: 'Nice cream chocolat-banane',
        ingredients: ['2 bananes congelées', 'cacao cru', 'beurre de cacahuète', 'éclats de cacao'],
        instructions: 'Mixe les bananes congelées avec le cacao. Ajoute une cuillère de beurre de cacahuète. Décore.',
        why: 'Satisfait l\'envie de glace/chocolat sans sucre raffiné. La banane congelée = crémeux naturel + tryptophane + magnésium.',
        tags: ['vegan', 'sans_gluten', 'réconfortant'],
        time: '5 min',
      },
      {
        name: 'Mug cake avoine-chocolat',
        ingredients: ['flocons d\'avoine', 'cacao', 'banane', 'œuf', 'chocolat noir'],
        instructions: 'Mixe avoine+banane+cacao+œuf. Verse dans un mug. Micro-ondes 2 min. Ajoute le chocolat noir.',
        why: 'Le goûter réconfort express. Glucides complexes + magnésium + sérotonine. Quand t\'as une envie de gâteau.',
        tags: ['vegetarien', 'sans_gluten', 'rapide'],
        time: '5 min',
      },
    ],
    snack: [
      { name: 'Chocolat noir 70% + amandes', why: 'Magnésium × 2 = anti-crampes + anti-irritabilité', tags: ['vegan', 'sans_gluten'] },
      { name: 'Dattes fourrées beurre de cacahuète', why: 'Énergie naturelle + magnésium + goût caramel', tags: ['vegan', 'sans_gluten'] },
      { name: 'Banane + carrés de chocolat noir', why: 'Tryptophane + magnésium = boost sérotonine', tags: ['vegan', 'sans_gluten'] },
      { name: 'Porridge overnight chocolat', why: 'Prépare la veille : avoine + cacao + lait végétal + chia', tags: ['vegan_possible', 'batch_cooking'] },
    ],
  },
};

// ===== NUTRIMENTS CLÉS PAR PHASE =====
const PHASE_NUTRIENTS = {
  menstrual: {
    priority: ['fer', 'magnésium', 'vitamine C', 'oméga-3', 'vitamine B12'],
    why: 'Tu perds du fer via le sang menstruel. Le magnésium réduit les crampes. La vitamine C aide à absorber le fer. Les oméga-3 sont anti-inflammatoires.',
    hormones: 'Œstrogène et progestérone au plus bas → fatigue, crampes, sensibilité.',
    metabolism: 'Ton métabolisme ralentit légèrement. Privilégie les repas chauds et réconfortants.',
  },
  follicular: {
    priority: ['zinc', 'protéines', 'vitamine E', 'probiotiques', 'fer'],
    why: 'L\'œstrogène remonte = ton corps construit des tissus. Le zinc soutient la maturation du follicule. Les protéines aident la récupération musculaire.',
    hormones: 'Œstrogène en hausse → énergie montante, meilleure humeur, peau plus belle.',
    metabolism: 'Ton métabolisme est efficient. C\'est la meilleure phase pour les repas variés et protéinés.',
  },
  ovulatory: {
    priority: ['fibres', 'antioxydants', 'crucifères (DIM)', 'eau', 'sélénium'],
    why: 'Pic d\'œstrogène = ton foie doit métaboliser l\'excès. Les fibres et crucifères (brocoli, chou) aident la détoxification hormonale.',
    hormones: 'Œstrogène au MAX + pic de LH + légère hausse de testostérone → énergie et libido au sommet.',
    metabolism: 'Ton métabolisme est rapide. Mange léger, frais, riche en fibres.',
  },
  luteal: {
    priority: ['magnésium', 'vitamine B6', 'tryptophane', 'glucides complexes', 'calcium'],
    why: 'La progestérone monte + sérotonine baisse. Le magnésium et B6 régulent l\'humeur. Le tryptophane booste la sérotonine. Les glucides complexes évitent les fringales.',
    hormones: 'Progestérone dominante → somnolence, envies de sucre, irritabilité, rétention d\'eau.',
    metabolism: 'Ton métabolisme augmente de 10-20%. Tu as BESOIN de 200-300 cal de plus par jour. Ne te restreins pas.',
  },
};

// ===== DÉTECTION DU TYPE DE REPAS =====
function detectMealType(q) {
  if (q.match(/petit[- ]?d[eé]j|breakfast|matin|r[eé]veil|au lever/i)) return 'petit_dej';
  if (q.match(/d[eé]jeuner|midi|lunch|repas de midi/i)) return 'dejeuner';
  if (q.match(/d[iî]ner|soir|souper|ce soir|repas du soir/i)) return 'diner';
  if (q.match(/go[uû]ter|16h|quatre.?heure|apr[eè]s.?midi|en.?cas|quatre heure/i)) return 'gouter';
  if (q.match(/snack|grigno|faim|petit creux|collation/i)) return 'snack';
  if (q.match(/smoothie|jus|boisson|boire/i)) return 'smoothie';
  return null;
}

// ===== DÉTECTION DES PRÉFÉRENCES ALIMENTAIRES =====
function detectDietPreference(q) {
  if (q.match(/v[eé]g[eé]talien|vegan/i)) return 'vegan';
  if (q.match(/v[eé]g[eé]tarien/i)) return 'vegetarien';
  if (q.match(/sans gluten|gluten.?free|c[oœ]liaque/i)) return 'sans_gluten';
  if (q.match(/sans lactose|intol[eé]ran.*lait|sans lait/i)) return 'sans_lactose';
  if (q.match(/sans sucre|diab[eé]t|glyc[eé]mi/i)) return 'sans_sucre';
  return null;
}

// ——— Filtrage alimentaire selon le profil ———
function getDietLabel(ctx) {
  const prefs = ctx.dietPreferences || ['omnivore'];
  const labels = [];
  if (prefs.includes('Végane')) labels.push('végane 🌱');
  else if (prefs.includes('Végétarienne')) labels.push('végétarienne 🥚');
  if (prefs.includes('Sans gluten')) labels.push('sans gluten');
  if (prefs.includes('Sans lactose')) labels.push('sans lactose');
  return labels.length > 0 ? labels.join(', ') : '';
}

function filterFoodList(foods, ctx) {
  const prefs = ctx.dietPreferences || ['omnivore'];
  const issues = ctx.healthIssues || [];

  // Define what to exclude
  const meatFish = ['viande rouge', 'bœuf', 'poulet', 'dinde', 'porc', 'saumon', 'sardines', 'maquereau', 'thon', 'crevettes', 'poisson', 'fruits de mer', 'huîtres', 'poisson blanc', 'saumon fumé', 'charcuterie', 'jambon'];
  const animalProducts = ['œufs', 'miel', 'yaourt', 'yaourt grec', 'kéfir', 'fromage', 'lait', 'crème', 'beurre', 'crème fraîche'];
  const dairy = ['yaourt', 'yaourt grec', 'kéfir', 'fromage', 'lait', 'crème', 'beurre', 'crème fraîche', 'lait entier'];
  const glutenFoods = ['pain', 'pain complet', 'pâtes', 'pâtes complètes', 'avoine', 'flocons d\'avoine', 'semoule', 'blé', 'orge', 'seigle', 'gâteau', 'biscuit', 'croissant'];

  let excluded = [];
  if (prefs.includes('Végane')) excluded = [...meatFish, ...animalProducts];
  else if (prefs.includes('Végétarienne')) excluded = [...meatFish];
  if (prefs.includes('Sans gluten')) excluded = [...excluded, ...glutenFoods];
  if (prefs.includes('Sans lactose')) excluded = [...excluded, ...dairy];

  if (excluded.length === 0) return foods;
  return foods.filter(f => !excluded.some(ex => f.toLowerCase().includes(ex.toLowerCase())));
}

// Replacements for filtered-out foods
function getDietReplacements(ctx) {
  const prefs = ctx.dietPreferences || ['omnivore'];
  const replacements = {};

  if (prefs.includes('Végane') || prefs.includes('Végétarienne')) {
    replacements['viande rouge'] = 'lentilles';
    replacements['poulet'] = 'tofu';
    replacements['dinde'] = 'tempeh';
    replacements['saumon'] = 'graines de lin + graines de chia';
    replacements['sardines'] = 'noix + graines de chanvre';
    replacements['poisson'] = 'tofu ou tempeh';
    replacements['crevettes'] = 'edamame';
  }
  if (prefs.includes('Végane')) {
    replacements['œufs'] = 'tofu brouillé';
    replacements['yaourt'] = 'yaourt de soja';
    replacements['yaourt grec'] = 'yaourt de coco';
    replacements['kéfir'] = 'kombucha';
    replacements['fromage'] = 'levure nutritionnelle';
    replacements['miel'] = 'sirop d\'érable';
    replacements['lait'] = 'lait d\'amande';
  }
  if (prefs.includes('Sans lactose')) {
    replacements['yaourt'] = 'yaourt sans lactose';
    replacements['kéfir'] = 'kéfir d\'eau';
    replacements['fromage'] = 'fromage sans lactose';
    replacements['lait'] = 'lait d\'amande';
    replacements['crème'] = 'crème de coco';
  }
  if (prefs.includes('Sans gluten')) {
    replacements['avoine'] = 'avoine certifiée sans gluten';
    replacements['pain complet'] = 'pain sans gluten';
    replacements['pain'] = 'pain sans gluten';
    replacements['pâtes'] = 'pâtes de riz ou sarrasin';
  }

  return replacements;
}

function adaptFoodText(text, ctx) {
  const replacements = getDietReplacements(ctx);
  let adapted = text;
  for (const [original, replacement] of Object.entries(replacements)) {
    adapted = adapted.replace(new RegExp(original, 'gi'), replacement);
  }
  return adapted;
}

// ===== FILTRER LES RECETTES PAR PRÉFÉRENCE =====
function filterRecipesByDiet(recipes, diet) {
  if (!diet) return recipes;
  return recipes.filter((r) => {
    if (!r.tags) return true;
    if (diet === 'vegan') return r.tags.some((t) => t === 'vegan' || t === 'vegan_possible');
    if (diet === 'vegetarien') return r.tags.some((t) => t === 'vegan' || t === 'vegan_possible' || t === 'vegetarien');
    if (diet === 'sans_gluten') return r.tags.some((t) => t === 'sans_gluten' || t === 'sans_gluten_possible');
    return true;
  });
}

// ===== GÉNÉRER UNE SUGGESTION DE RECETTE =====
function generateRecipeResponse(phase, mealType, diet, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];
  const phaseRecipes = RECIPES[phase];

  // Si type de repas détecté
  if (mealType && phaseRecipes[mealType]) {
    let recipes = phaseRecipes[mealType];
    if (diet) recipes = filterRecipesByDiet(recipes, diet);
    if (recipes.length === 0) recipes = phaseRecipes[mealType]; // fallback

    const recipe = recipes[Math.floor(Math.random() * recipes.length)];
    if (!recipe) return null;

    // Recette complète vs snack simple
    if (recipe.instructions) {
      const dietLabel = diet === 'vegan' ? ' 🌱 (vegan)' : diet === 'vegetarien' ? ' 🥚 (végé)' : diet === 'sans_gluten' ? ' (sans gluten)' : '';
      return `Voilà une idée pour toi en phase ${phaseName} (J${ctx.currentDay})${dietLabel} :\n\n👩‍🍳 ${recipe.name}\n⏱️ ${recipe.time}\n\n📝 Ingrédients :\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n👉 Préparation :\n${recipe.instructions}\n\n🧠 Pourquoi c'est top pour toi :\n${recipe.why}\n\n💡 En phase ${phaseName}, ton corps a surtout besoin de : ${nutrients.priority.slice(0, 3).join(', ')}. ${nutrients.why.split('.')[0]}.`;
    }
    // Snack simple
    return `Un snack parfait pour ta phase ${phaseName} (J${ctx.currentDay}) :\n\n✨ ${recipe.name}\n\n🧠 ${recipe.why}\n\n${nutrients.hormones}\n\nAutres idées :\n${phaseRecipes.snack.filter((s) => s.name !== recipe.name).slice(0, 2).map((s) => `• ${s.name} — ${s.why}`).join('\n')}`;
  }

  // Pas de type de repas → suggestion générale avec un repas complet
  const mealTypes = ['petit_dej', 'dejeuner', 'diner'];
  const randomMeal = mealTypes[Math.floor(Math.random() * mealTypes.length)];
  let recipes = phaseRecipes[randomMeal];
  if (diet) recipes = filterRecipesByDiet(recipes, diet);
  if (!recipes || recipes.length === 0) recipes = phaseRecipes[randomMeal];
  const recipe = recipes[Math.floor(Math.random() * recipes.length)];

  if (!recipe || !recipe.instructions) return null;

  const mealLabels = { petit_dej: 'Petit-déjeuner', dejeuner: 'Déjeuner', diner: 'Dîner' };
  return `Voilà ce que je te propose pour ${(mealLabels[randomMeal] || 'aujourd\'hui').toLowerCase()} en phase ${phaseName} :\n\n👩‍🍳 ${recipe.name}\n⏱️ ${recipe.time}\n\n📝 Ingrédients :\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n👉 ${recipe.instructions}\n\n🧠 Pourquoi c'est parfait :\n${recipe.why}\n\n💡 ${nutrients.metabolism}`;
}

// ===== GÉNÉRER UNE JOURNÉE COMPLÈTE =====
function generateFullDayMenu(phase, diet, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];
  const phaseRecipes = RECIPES[phase];

  const pick = (type) => {
    let pool = phaseRecipes[type] || [];
    if (diet) {
      const filtered = filterRecipesByDiet(pool, diet);
      if (filtered.length > 0) pool = filtered;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const petitDej = pick('petit_dej');
  const dejeuner = pick('dejeuner');
  const gouter = pick('gouter') || pick('snack');
  const diner = pick('diner');

  let response = `Voilà ta journée nutrition optimisée pour la phase ${phaseName} (J${ctx.currentDay}) :\n\n`;
  response += `☀️ PETIT-DÉJ :\n${petitDej ? `👩‍🍳 ${petitDej.name}${petitDej.time ? ` (${petitDej.time})` : ''}\n${petitDej.why ? `💡 ${petitDej.why.split('.')[0]}.` : ''}` : 'Porridge + fruits + graines'}\n\n`;
  response += `🍽️ DÉJEUNER :\n${dejeuner ? `👩‍🍳 ${dejeuner.name}${dejeuner.time ? ` (${dejeuner.time})` : ''}\n${dejeuner.why ? `💡 ${dejeuner.why.split('.')[0]}.` : ''}` : 'Bowl complet protéines + légumes + céréales'}\n\n`;
  response += `🍵 GOÛTER :\n${gouter ? `✨ ${gouter.name}\n${gouter.why ? `💡 ${gouter.why.split('.')[0]}.` : ''}` : 'Fruits + oléagineux'}\n\n`;
  response += `🌙 DÎNER :\n${diner ? `👩‍🍳 ${diner.name}${diner.time ? ` (${diner.time})` : ''}\n${diner.why ? `💡 ${diner.why.split('.')[0]}.` : ''}` : 'Protéine légère + légumes + féculents complets'}\n\n`;
  response += `🧬 Tes hormones :\n${nutrients.hormones}\n\n📊 Nutriments prioritaires : ${nutrients.priority.join(', ')}\n${nutrients.metabolism}`;

  return response;
}

// ===== RÉPONSE NUTRITION SPÉCIFIQUE (anti-inflammatoire, riche en fer, etc.) =====
function generateNutrientResponse(nutrient, phase, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];

  const NUTRIENT_FOODS = {
    fer: {
      foods: ['lentilles', 'épinards', 'viande rouge', 'tofu', 'pois chiches', 'graines de courge', 'quinoa', 'sardines', 'haricots rouges'],
      tip: 'Combine toujours avec de la vitamine C (citron, poivron, kiwi) pour doubler l\'absorption du fer.',
      why: 'Le fer transporte l\'oxygène. En phase menstruelle tu en perds beaucoup — à reconstituer absolument.',
    },
    magnesium: {
      foods: ['chocolat noir 70%+', 'amandes', 'noix de cajou', 'banane', 'avocat', 'épinards', 'graines de courge', 'edamame'],
      tip: 'Le magnésium au coucher aide aussi le sommeil et réduit les crampes nocturnes.',
      why: 'Le magnésium régule 300+ réactions dans ton corps : humeur, muscles, sommeil, crampes.',
    },
    omega3: {
      foods: ['saumon', 'sardines', 'maquereau', 'graines de lin', 'graines de chia', 'noix', 'huile de colza'],
      tip: 'Vise 2-3 portions de poisson gras par semaine, ou une cuillère de graines de lin moulues chaque jour.',
      why: 'Les oméga-3 réduisent l\'inflammation, les crampes, améliorent l\'humeur et protègent le cœur.',
    },
    zinc: {
      foods: ['graines de courge', 'pois chiches', 'noix de cajou', 'lentilles', 'crevettes', 'huîtres', 'fromage', 'œufs'],
      tip: 'Le zinc est essentiel en phase folliculaire pour la maturation du follicule et la qualité de l\'ovulation.',
      why: 'Le zinc booste l\'immunité, aide à la production hormonale et à la beauté de la peau.',
    },
    vitamineb6: {
      foods: ['banane', 'avocat', 'dinde', 'poulet', 'saumon', 'patate douce', 'graines de tournesol', 'pistaches'],
      tip: 'La B6 est surtout cruciale en phase lutéale — elle aide à convertir le tryptophane en sérotonine.',
      why: 'La vitamine B6 réduit l\'irritabilité, la rétention d\'eau et les sautes d\'humeur du PMS.',
    },
    antioxydants: {
      foods: ['fruits rouges', 'grenade', 'cacao cru', 'curcuma', 'thé vert matcha', 'légumes colorés', 'noix', 'graines de chia'],
      tip: 'Plus c\'est coloré, plus c\'est riche en antioxydants. Mange l\'arc-en-ciel !',
      why: 'Les antioxydants protègent tes cellules, réduisent l\'inflammation et améliorent ta peau.',
    },
    proteines: {
      foods: ['œufs', 'poulet', 'saumon', 'yaourt grec', 'lentilles', 'quinoa', 'tofu', 'pois chiches', 'graines de chanvre'],
      tip: 'Vise 1.2-1.6g de protéines par kg de poids corporel. Répartis-les sur tes 3 repas.',
      why: 'Les protéines soutiennent la production hormonale, la récupération musculaire et la satiété.',
    },
    tryptophane: {
      foods: ['dinde', 'banane', 'avoine', 'graines de courge', 'œufs', 'chocolat noir', 'noix de cajou', 'tofu'],
      tip: 'Combine avec des glucides complexes pour aider le tryptophane à atteindre le cerveau et produire de la sérotonine.',
      why: 'Le tryptophane est le précurseur de la sérotonine (hormone du bonheur) et de la mélatonine (sommeil).',
    },
  };

  // Détecte quel nutriment est demandé
  let key = null;
  if (nutrient.match(/fer\b|iron|an[eé]mi/i)) key = 'fer';
  else if (nutrient.match(/magn[eé]sium|crampe|muscle/i)) key = 'magnesium';
  else if (nutrient.match(/om[eé]ga|poisson|anti.?inflamm/i)) key = 'omega3';
  else if (nutrient.match(/zinc|peau|immunit/i)) key = 'zinc';
  else if (nutrient.match(/b6|pms|irrit|humeur/i)) key = 'vitamineb6';
  else if (nutrient.match(/antioxyd|d[eé]tox|radicaux/i)) key = 'antioxydants';
  else if (nutrient.match(/prot[eé]in|muscle|muscu/i)) key = 'proteines';
  else if (nutrient.match(/tryptoph|s[eé]rotonin|bonheur/i)) key = 'tryptophane';

  if (!key) return null;

  const data = NUTRIENT_FOODS[key];
  return `En phase ${phaseName} (J${ctx.currentDay}), voici les meilleurs aliments riches en ${key === 'vitamineb6' ? 'vitamine B6' : key === 'omega3' ? 'oméga-3' : key} :\n\n🥗 Top aliments :\n${data.foods.map((f) => `• ${f}`).join('\n')}\n\n💡 Astuce : ${data.tip}\n\n🧠 Pourquoi c'est important :\n${data.why}\n\n🧬 ${nutrients.hormones}\n\n📊 En phase ${phaseName}, tes nutriments prioritaires sont : ${nutrients.priority.join(', ')}.`;
}

// Détecte si c'est une question "puis-je / est-ce que je peux"
function isCanIQuestion(q) {
  return q.match(/puis.?je|peux.?je|est.?ce que je (peux|devrais|dois)|je (peux|devrais|dois)|c'?est (bien|bon|ok|okay) (de|si|que)|c'?est une bonne idée|ça va si|possible de|recommand/i);
}

// Cherche un aliment dans la question
function findFood(q) {
  const foods = [
    'viande', 'viande rouge', 'bœuf', 'boeuf', 'poulet', 'dinde', 'porc', 'agneau', 'veau',
    'poisson', 'saumon', 'thon', 'sardine', 'crevette', 'fruits de mer',
    'œuf', 'oeuf', 'œufs', 'oeufs',
    'lait', 'fromage', 'yaourt', 'crème', 'beurre', 'produits laitiers',
    'pâtes', 'riz', 'pain', 'céréales', 'avoine', 'quinoa', 'blé',
    'chocolat', 'chocolat noir', 'sucre', 'gâteau', 'bonbon', 'glace', 'pâtisserie', 'biscuit',
    'café', 'thé', 'alcool', 'vin', 'bière',
    'salade', 'soupe', 'légumes', 'fruits', 'concombre', 'tomate', 'carotte', 'brocoli', 'épinard', 'chou',
    'avocat', 'banane', 'pomme', 'orange', 'mangue', 'ananas', 'fraise', 'myrtille',
    'noix', 'amande', 'noisette', 'cacahuète', 'graines',
    'tofu', 'soja', 'lentilles', 'pois chiches', 'haricots',
    'patate douce', 'pomme de terre', 'frites',
    'pizza', 'burger', 'fast food', 'sushi', 'kebab', 'tacos',
    'miel', 'confiture', 'nutella', 'sirop',
    'huile d\'olive', 'huile de coco',
    'protéines', 'glucides', 'lipides', 'fibres',
    'soda', 'jus de fruit', 'smoothie', 'eau',
    'épices', 'curcuma', 'gingembre', 'cannelle',
  ];
  for (const food of foods) {
    if (q.includes(food)) return food;
  }
  return null;
}

// Cherche un sport dans la question
function findSport(q) {
  const sports = [
    'hiit', 'cardio', 'cardio intense', 'musculation', 'muscu', 'musculation lourde',
    'yoga', 'yin yoga', 'yoga restauratif', 'pilates',
    'course', 'courir', 'running', 'sprint', 'jogging', 'footing',
    'marche', 'marcher', 'randonnée',
    'natation', 'nager', 'piscine', 'aquagym',
    'vélo', 'cyclisme', 'spinning',
    'danse', 'danser', 'zumba',
    'boxe', 'kickboxing', 'arts martiaux', 'judo', 'karaté',
    'crossfit', 'circuit training',
    'stretching', 'étirement', 'foam rolling',
    'escalade', 'grimpe',
    'tennis', 'badminton', 'squash', 'ping pong',
    'football', 'basket', 'volleyball', 'handball', 'rugby',
    'ski', 'snowboard', 'surf', 'paddle',
    'abdos', 'pompes', 'squats', 'gainage', 'planche',
    'corde à sauter', 'trampoline',
    'tai chi', 'méditation',
  ];
  for (const sport of sports) {
    if (q.includes(sport)) return sport;
  }
  return null;
}

// Génère une réponse dynamique pour "puis-je manger X ?"
function generateFoodResponse(food, phase, ctx) {
  const advice = FOOD_ADVICE[phase];
  const filteredGood = filterFoodList(advice.good, ctx);
  const filteredOk = filterFoodList(advice.ok, ctx);
  const phaseName = PHASE_LABELS[phase];
  const qFood = food.toLowerCase();

  // Cherche dans quelle catégorie est l'aliment
  const isGood = filteredGood.some((f) => qFood.includes(f) || f.includes(qFood));
  const isOk = filteredOk.some((f) => qFood.includes(f) || f.includes(qFood));
  const isLimit = advice.limit.some((f) => qFood.includes(f) || f.includes(qFood));

  if (isGood) {
    return `Carrément ! ${food.charAt(0).toUpperCase() + food.slice(1)}, c'est un super choix en phase ${phaseName} (J${ctx.currentDay}). 👌\n\n${advice.why_good}\n\n${food.charAt(0).toUpperCase() + food.slice(1)} t'apporte exactement ce dont ton corps a besoin en ce moment. Fonce ! 🌿`;
  }

  if (isLimit) {
    // Cherche des alternatives intelligentes dans la même catégorie d'envie
    const limitItem = advice.limit.find((f) => qFood.includes(f) || f.includes(qFood));
    const smartAlts = SMART_FOOD_ALTERNATIVES[limitItem] || SMART_FOOD_ALTERNATIVES[qFood] || null;

    if (smartAlts) {
      const altList = smartAlts.slice(0, 4).map((a) => `• ${a}`).join('\n');
      return `Alors, ${food} en phase ${phaseName}... c'est pas interdit, mais c'est pas l'idéal non plus.\n\n⚠️ ${advice.why_limit}\n\nMais si t'as cette envie, j'ai mieux pour toi :\n${altList}\n\nC'est dans le même esprit, mais ton corps va beaucoup mieux réagir. 😊\n\nEt si tu craques quand même, zéro culpabilité — juste une petite quantité et savoure. 💛`;
    }

    return `Alors, ${food} en phase ${phaseName}... c'est pas interdit, mais c'est pas l'idéal non plus.\n\n⚠️ ${advice.why_limit}\n\nSi tu en as vraiment envie, fais-toi plaisir — mais en petite quantité. Ton corps te dira merci si tu privilégies plutôt : ${filteredGood.slice(0, 4).join(', ')}.\n\nL'idée c'est pas de te priver, c'est de comprendre l'impact. 💛`;
  }

  if (isOk) {
    return `Oui, tu peux manger ${food} sans souci ! C'est pas l'aliment le plus stratégique en phase ${phaseName}, mais y'a aucun problème.\n\nPour optimiser, combine-le avec des aliments riches en ${phase === 'menstrual' ? 'fer et magnésium' : phase === 'luteal' ? 'magnésium et vitamine B6' : phase === 'ovulatory' ? 'fibres et antioxydants' : 'protéines et zinc'}.\n\n${advice.why_good} 🌱`;
  }

  // Aliment non trouvé dans les listes → réponse neutre et encourageante
  return `Bien sûr que tu peux manger ${food} ! Aucun aliment n'est "interdit" — l'important c'est l'équilibre.\n\nEn phase ${phaseName} (J${ctx.currentDay}), ton corps a surtout besoin de :\n• ${filteredGood.slice(0, 3).join('\n• ')}\n\n${advice.why_good}\n\nMange ce qui te fait du bien, et essaie d'intégrer ces aliments quand tu peux. Zéro culpabilité. 💛`;
}

// Génère une réponse dynamique pour "puis-je faire X sport ?"
function generateSportResponse(sport, phase, ctx) {
  const advice = SPORT_ADVICE[phase];
  const phaseName = PHASE_LABELS[phase];
  const qSport = sport.toLowerCase();

  const isGreat = advice.great.some((s) => qSport.includes(s) || s.includes(qSport));
  const isOk = advice.ok.some((s) => qSport.includes(s) || s.includes(qSport));
  const isCaution = advice.caution.some((s) => qSport.includes(s) || s.includes(qSport));

  if (isGreat) {
    return `Oh oui, ${sport} c'est parfait en phase ${phaseName} ! Tu es à J${ctx.currentDay}, ton énergie est ${PHASE_ENERGY[phase]}. 💪\n\n${advice.why}\n\nFonce, c'est exactement ce qu'il faut pour ton corps en ce moment ! 🔥`;
  }

  if (isCaution) {
    // Cherche des alternatives intelligentes similaires au sport demandé
    const cautionItem = advice.caution.find((s) => qSport.includes(s) || s.includes(qSport));
    const smartAlts = SMART_SPORT_ALTERNATIVES[cautionItem] || SMART_SPORT_ALTERNATIVES[qSport] || null;

    if (smartAlts) {
      const altList = smartAlts.slice(0, 3).map((a) => `• ${a}`).join('\n');
      return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName}... c'est pas le meilleur timing pour aller à fond.\n\n🧠 ${advice.why}\n\nMais si t'as envie de bouger dans cet esprit, essaie plutôt :\n${altList}\n\nC'est le même type d'effort, adapté à ton corps en ce moment. Tu sentiras la différence ! 💪\n\nEt si ton corps te dit "go", écoute-le — adapte juste l'intensité. Tu pourras ${phase === 'menstrual' || phase === 'luteal' ? 'tout donner en phase folliculaire' : 'monter en puissance bientôt'}. 🔥`;
    }

    const alternatives = advice.great.slice(0, 4).join(', ');
    return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName}... je te recommande d'y aller doucement ou de choisir une alternative.\n\n🧠 ${advice.why}\n\nSi tu te sens vraiment bien et que ton corps dit oui — écoute-le. Mais si tu hésites, essaie plutôt : ${alternatives}.\n\nL'objectif c'est pas de t'empêcher, c'est que tu tires le meilleur de ton entraînement au bon moment. Tu pourras ${phase === 'menstrual' || phase === 'luteal' ? 'y revenir à fond en phase folliculaire' : 'adapter l\'intensité'}. 💪`;
  }

  if (isOk) {
    return `Oui, ${sport} c'est tout à fait faisable en phase ${phaseName} (J${ctx.currentDay}) ! 👍\n\n${advice.why}\n\nÉcoute ton corps et adapte l'intensité si besoin. L'important c'est de bouger de façon qui te fait du bien. 🌟`;
  }

  // Sport non trouvé → réponse adaptative
  return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName} ? Ça dépend de l'intensité !\n\nTon énergie est ${PHASE_ENERGY[phase]} à J${ctx.currentDay}.\n\n${advice.why}\n\n✅ Ce qui est top en ce moment : ${advice.great.slice(0, 4).join(', ')}\n\nÉcoute ton corps — si tu te sens capable, vas-y. Si tu sens que c'est trop, adapte. Le meilleur sport, c'est celui que tu fais avec plaisir. 💛`;
}

// Compteur global pour varier les intros
let _introCounter = 0;

// Intros variées — certaines avec prénom, d'autres sans, pour un ton naturel
function naturalizeResponse(text, name) {
  if (!name || name === 'ma belle') return text;

  _introCounter++;
  const idx = _introCounter % 8;

  // Patterns de remplacement : on ne met le prénom qu'1 fois sur 3-4 environ
  // et on varie la formulation
  const namePattern = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},\\s*`, 'i');

  if (!namePattern.test(text)) return text;

  // Retirer le "Prénom, " du début
  const rest = text.replace(namePattern, '');
  // Mettre la première lettre en majuscule
  const capitalized = rest.charAt(0).toUpperCase() + rest.slice(1);

  switch (idx) {
    case 0: return `${name}, ${rest}`; // Prénom classique
    case 1: return `Alors, ${rest}`; // Décontracté
    case 2: return `Hey ! ${capitalized}`; // Pep's
    case 3: return `${name} — ${rest}`; // Prénom avec tiret
    case 4: return capitalized; // Pas de prénom, direct
    case 5: return `Écoute, ${rest}`; // Intime
    case 6: return capitalized; // Direct aussi
    case 7: return `OK ${name}, ${rest}`; // Décontracté + prénom
    default: return capitalized;
  }
}

export function getLunaResponse(question, phase, userContext = {}) {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const qOriginal = question.toLowerCase();
  const responses = RESPONSES[phase] || RESPONSES.follicular;

  const name = userContext.name || 'ma belle';
  const ctx = {
    name,
    phase,
    currentDay: userContext.currentDay || 1,
    cycleLength: userContext.cycleLength || 28,
    periodLength: userContext.periodLength || 5,
    daysUntilPeriod: userContext.daysUntilPeriod || 0,
    energy: userContext.energy || null,
    symptoms: userContext.symptoms || [],
    goals: userContext.goals || [],
    dietPreferences: userContext.dietPreferences || ['omnivore'],
    healthIssues: userContext.healthIssues || [],
  };

  // 0. Détection prioritaire : NUTRITION & RECETTES
  const mealType = detectMealType(qOriginal);
  const diet = detectDietPreference(qOriginal);

  // Use profile diet if not explicitly mentioned in question
  const profileDiet = (() => {
    const prefs = userContext.dietPreferences || [];
    if (prefs.includes('Végane')) return 'vegan';
    if (prefs.includes('Végétarienne')) return 'vegetarien';
    if (prefs.includes('Sans gluten')) return 'sans_gluten';
    if (prefs.includes('Sans lactose')) return 'sans_lactose';
    return null;
  })();
  const effectiveDiet = diet || profileDiet;
  const dietIntro = getDietLabel(ctx) ? `\n(Adapté à ton alimentation ${getDietLabel(ctx)})\n` : '';
  const isRecipeRequest = qOriginal.match(/recette|recipe|cuisiner|pr[eé]par|id[eé]e.*(repas|plat|menu)|qu'?est.?ce (que |qu'?)?(je|on) (mange|cuisine|pr[eé]pare)|quoi manger|que manger|menu|meal prep/i);
  const isMealQuestion = qOriginal.match(/manger.*(soir|midi|matin|ce)|petit[- ]?d[eé]j|d[eé]jeuner|d[iî]ner|go[uû]ter|snack|collation|repas (du|de|ce)/i);
  const isFullDayRequest = qOriginal.match(/journ[eé]e.*(compl[eè]te|enti[eè]re|type)|menu.*(jour|complet|semaine)|quoi manger (toute la journ|aujourd)|plan.*(alimentaire|nutritionnel|repas)/i);
  const isNutrientQuestion = qOriginal.match(/riche en|source de|aliment.*(fer|magn|prot|zinc|vitamine|om[eé]ga|fibre|antioxyd|calcium|tryptoph)|anti.?inflamm|d[eé]tox|boost|hormones?.*(aliment|nourri|manger)/i);
  const isDietQuestion = qOriginal.match(/v[eé]g[eé]t(arien|alien)|vegan|sans (gluten|lactose|sucre)|r[eé]gime|intol[eé]ran/i);

  // Journée complète
  if (isFullDayRequest) {
    const raw = generateFullDayMenu(phase, effectiveDiet, ctx);
    return naturalizeResponse(raw + dietIntro, name);
  }

  // Recette ou question "qu'est-ce que je mange ce soir ?"
  if (isRecipeRequest || isMealQuestion || (mealType && !findFood(qOriginal))) {
    const raw = generateRecipeResponse(phase, mealType, effectiveDiet, ctx);
    if (raw) return naturalizeResponse(raw + dietIntro, name);
  }

  // Question nutriment spécifique ("aliments riches en fer", "anti-inflammatoire")
  if (isNutrientQuestion) {
    const raw = generateNutrientResponse(qOriginal, phase, ctx);
    if (raw) return naturalizeResponse(raw + dietIntro, name);
  }

  // Question régime alimentaire avec phase
  if (isDietQuestion) {
    const detectedDiet = detectDietPreference(qOriginal) || profileDiet;
    const phaseName = PHASE_LABELS[phase];
    const nutrients = PHASE_NUTRIENTS[phase];
    const phaseRecipes = RECIPES[phase];

    // Trouver des recettes adaptées au régime
    const allRecipes = [...(phaseRecipes.petit_dej || []), ...(phaseRecipes.dejeuner || []), ...(phaseRecipes.diner || []), ...(phaseRecipes.gouter || [])];
    const filtered = detectedDiet ? filterRecipesByDiet(allRecipes, detectedDiet) : allRecipes;
    const dietLabel = detectedDiet === 'vegan' ? 'vegan 🌱' : detectedDiet === 'vegetarien' ? 'végétarienne 🥚' : detectedDiet === 'sans_gluten' ? 'sans gluten' : detectedDiet === 'sans_lactose' ? 'sans lactose' : '';

    const picks = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    let raw = `En phase ${phaseName} (J${ctx.currentDay})${dietLabel ? ` avec une alimentation ${dietLabel}` : ''}, voilà ce que je te recommande :\n\n`;
    raw += `🧬 ${nutrients.hormones}\n\n`;
    raw += `📊 Nutriments prioritaires : ${nutrients.priority.join(', ')}\n\n`;
    raw += `👩‍🍳 Idées de recettes adaptées :\n`;
    picks.forEach((r) => {
      raw += `\n• ${r.name}${r.time ? ` (${r.time})` : ''}\n  ${r.why ? `💡 ${r.why.split('.')[0]}.` : ''}`;
    });
    raw += `\n\n${nutrients.metabolism}\n\nDis-moi si tu veux la recette détaillée d'une de ces idées ! 💛`;
    return naturalizeResponse(raw, name);
  }

  // 1. Question spécifique "puis-je manger/faire X ?"
  const canI = isCanIQuestion(qOriginal);
  const detectedFood = findFood(qOriginal);
  const detectedSport = findSport(qOriginal);

  // Question sur un aliment spécifique
  if (detectedFood && (canI || qOriginal.match(/manger|boire|prendre|consommer|cuisiner|préparer/))) {
    const raw = generateFoodResponse(detectedFood, phase, ctx);
    return naturalizeResponse(raw, name);
  }

  // Question sur un sport spécifique
  if (detectedSport && (canI || qOriginal.match(/faire|pratiquer|aller|commencer|continuer|essayer/))) {
    const raw = generateSportResponse(detectedSport, phase, ctx);
    return naturalizeResponse(raw, name);
  }

  // 2. Ensuite, cherche dans les réponses prédéfinies par mot-clé
  let bestMatch = null;
  let bestScore = 0;

  for (const mapping of KEYWORD_MAP) {
    let score = 0;
    for (const key of mapping.keys) {
      const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q.includes(normalizedKey) || qOriginal.includes(key)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping.response;
    }
  }

  // Si on a un bon match dans les réponses prédéfinies
  if (bestMatch && bestScore > 0) {
    const responseFn = responses[bestMatch] || responses['default'];
    const raw = responseFn(ctx);
    return naturalizeResponse(raw, name);
  }

  // 3. Si rien ne matche, génère une réponse contextuelle intelligente
  const phaseName = PHASE_LABELS[phase];
  const energyLevel = PHASE_ENERGY[phase];
  const foodAdvice = FOOD_ADVICE[phase];
  const sportAdvice = SPORT_ADVICE[phase];

  // Détecte le sujet général pour orienter la réponse — NUTRITION en priorité
  if (qOriginal.match(/manger|aliment|nourri|repas|cuisine|recette|plat|petit.?d[eé]j|d[eé]jeuner|d[iî]ner|go[uû]ter|snack|grigno|faim|nutrition|food/)) {
    // Essaye d'abord de donner une recette
    const recipeResponse = generateRecipeResponse(phase, mealType, effectiveDiet, ctx);
    if (recipeResponse) return naturalizeResponse(recipeResponse + dietIntro, name);
    const raw = responses['manger'](ctx);
    return naturalizeResponse(raw + dietIntro, name);
  }

  if (qOriginal.match(/sport|exerc|entra[iî]n|fitness|bouger|activ|course|muscu|nage|vélo|danse|yoga/)) {
    const raw = responses['sport'](ctx);
    return naturalizeResponse(raw, name);
  }

  if (qOriginal.match(/dormir|sommeil|nuit|coucher|r[eé]veill|insomni|sieste|repos/)) {
    const raw = responses['dormir'](ctx);
    return naturalizeResponse(raw, name);
  }

  if (qOriginal.match(/humeur|[eé]motion|pleure|triste|col[eè]re|irrit|anxi[eé]t|stress|paniqu|peur|angois/)) {
    const raw = (responses['irritabilite'] || responses['stress'] || responses['default'])(ctx);
    return naturalizeResponse(raw, name);
  }

  if (qOriginal.match(/peau|bouton|acn[eé]|cheveu|ongle|teint|ride|cerne/)) {
    const raw = (responses['acne'] || responses['default'])(ctx);
    return naturalizeResponse(raw, name);
  }

  if (qOriginal.match(/libido|sexe|sexuel|d[eé]sir|intimit[eé]|couple|relation/)) {
    const libidoResponse = phase === 'ovulatory'
      ? `C'est ta phase ovulatoire — ta libido est naturellement au plus haut ! L'œstrogène + la testostérone boostent le désir.\n\nC'est complètement normal et sain. Profite de cette énergie. ✨`
      : phase === 'menstrual'
      ? `En phase menstruelle, la libido est souvent plus basse. C'est hormonal — œstrogène et progestérone sont au plancher.\n\nCertaines femmes ont quand même du désir pendant les règles (les orgasmes peuvent même soulager les crampes !). Écoute ton corps. 💜`
      : phase === 'follicular'
      ? `En phase folliculaire, ta libido remonte progressivement avec l'œstrogène. Tu vas sentir le désir augmenter jusqu'à l'ovulation.\n\nTout est normal — ton corps se prépare ! 🌸`
      : `En phase lutéale, la libido peut baisser à cause de la progestérone. C'est physiologique.\n\nSi tu ressens moins de désir, c'est pas un problème — ça reviendra en phase folliculaire/ovulatoire. Sois patiente avec toi. 💛`;
    return naturalizeResponse(`${ctx.name}, ${libidoResponse}`, name);
  }

  if (qOriginal.match(/travail|boulot|productiv|concentr|m[eé]moire|cerveau|cr[eé]ativ|r[eé]union|pr[eé]sentation|examen/)) {
    const workResponse = phase === 'ovulatory'
      ? `Tu es en phase ovulatoire — c'est ton PIC de productivité ! Tes capacités verbales, ta mémoire et ta confiance sont au sommet.\n\n🚀 C'est LE moment pour :\n• Présentations importantes\n• Brainstorming, créativité\n• Négociations\n• Networking\n\nProfite de cette fenêtre de 2-3 jours ! 👑`
      : phase === 'follicular'
      ? `Phase folliculaire = ta créativité et ta motivation remontent ! C'est parfait pour :\n\n• Lancer de nouveaux projets\n• Apprendre de nouvelles choses\n• Planifier et organiser\n• Résoudre des problèmes\n\nTon cerveau est en mode "construction" — utilise cette énergie ! 🧠✨`
      : phase === 'menstrual'
      ? `En phase menstruelle, ta concentration peut être réduite — c'est normal.\n\n💡 Adapte :\n• Tâches simples et routinières\n• Pas de décisions majeures si possible\n• Sessions de travail courtes (25 min + pause)\n• Introspection, bilan, réflexion\n\nC'est le moment de réfléchir plutôt que d'agir. La productivité revient bientôt. 🌱`
      : `En phase lutéale, la concentration peut fluctuer avec la progestérone.\n\n💡 Conseils :\n• Travaille sur tes forces (tâches connues)\n• Sessions courtes avec pauses\n• Finis ce que tu as commencé plutôt que de commencer du neuf\n• Priorise l'essentiel\n\nGarde les gros projets pour la phase folliculaire. 📋`;
    return naturalizeResponse(`${ctx.name}, ${workResponse}`, name);
  }

  // 4. Réponse par défaut contextuelle et utile
  const raw = responses['default'](ctx);
  return naturalizeResponse(raw, name);
}
