// Catégories de questions suggérées avec icônes
export const SUGGESTION_CATEGORIES = [
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
    id: 'food',
    label: '🍽️ Alimentation',
    questions: [
      'Quoi manger aujourd\'hui ?',
      'Pourquoi j\'ai des envies de sucre ?',
      'Quoi manger pour réduire les ballonnements ?',
      'Une recette adaptée à ma phase ?',
      'Comment réduire la rétention d\'eau ?',
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
      'Combien de sport par semaine ?',
    ],
  },
  {
    id: 'sleep',
    label: '😴 Sommeil',
    questions: [
      'Comment mieux dormir ce soir ?',
      'Pourquoi je dors mal en ce moment ?',
      'Quelle routine du soir adopter ?',
      'Combien d\'heures dormir ?',
    ],
  },
  {
    id: 'mood',
    label: '💭 Bien-être',
    questions: [
      'Comment gérer mon irritabilité ?',
      'Des astuces pour mon acné hormonale ?',
      'Pourquoi j\'ai envie de pleurer ?',
      'Comment gérer le stress hormonal ?',
      'Comment booster ma confiance ?',
    ],
  },
];

// Questions rapides affichées au début (les plus fréquentes)
export const QUICK_SUGGESTIONS = [
  'Pourquoi je suis fatiguée ?',
  'Quoi manger aujourd\'hui ?',
  'Quel sport faire ?',
  'Comment mieux dormir ?',
];

// Réponses complètes par phase — chaque réponse est une fonction qui reçoit le contexte utilisatrice
// ctx = { name, phase, currentDay, cycleLength, periodLength, daysUntilPeriod, energy, symptoms, goals }

const RESPONSES = {
  menstrual: {
    fatigue: (ctx) => `${ctx.name}, c'est complètement normal que tu sois fatiguée. Tu es à J${ctx.currentDay} — tes hormones (œstrogène et progestérone) sont au plus bas.\n\n💡 Ce que tu peux faire :\n• Magnésium : chocolat noir, amandes, bananes\n• Fer : lentilles, épinards, viande rouge\n• Dormir 8-9h (c'est pas du luxe, c'est un besoin)\n• Hydrate-toi bien (1,5-2L/jour)\n\nTa fatigue n'est pas un échec — c'est ton corps qui se régénère. Ça remonte dans 2-3 jours avec l'œstrogène. 🌱`,

    normal: (ctx) => `Oui ${ctx.name}, tout ce que tu ressens est normal pour J${ctx.currentDay}. Tes hormones sont au plancher, ce qui peut provoquer :\n\n• Fatigue, manque de motivation\n• Crampes, douleurs dans le bas-ventre\n• Envie de t'isoler, sensibilité émotionnelle\n• Ballonnements, troubles digestifs\n\nTon corps élimine la muqueuse utérine — c'est un vrai travail interne. Sois douce avec toi, c'est pas le moment de te pousser. 💜`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${ctx.cycleLength - 14} de ton cycle, soit dans environ ${ctx.cycleLength - 14 - ctx.currentDay} jours.\n\nTu le sentiras probablement : montée d'énergie, meilleure humeur, parfois une légère douleur d'un côté du ventre. En attendant, repose-toi — la phase folliculaire qui arrive va te redonner de l'élan. ✨`,

    regles: (ctx) => `${ctx.name}, encore environ ${ctx.daysUntilPeriod} jours avant tes prochaines règles (ton cycle fait ${ctx.cycleLength} jours). Mais là tu es en plein dedans ! J${ctx.currentDay}, phase menstruelle.\n\nSi tes douleurs sont fortes :\n• Bouillotte sur le ventre\n• Anti-inflammatoires naturels : curcuma, gingembre\n• Magnésium (aide les crampes)\n• Position fœtale pour dormir`,

    manger: (ctx) => `${ctx.name}, pendant tes règles ton corps perd du fer — c'est LA priorité.\n\n🥗 À privilégier :\n• Fer : lentilles, épinards, viande rouge, tofu\n• Vitamine C (pour absorber le fer) : agrumes, poivrons, kiwi\n• Anti-inflammatoires : curcuma, gingembre, saumon, sardines\n• Magnésium : chocolat noir 70%+, amandes\n\n🚫 À limiter :\n• Café (réduit l'absorption du fer)\n• Alcool (amplifie l'inflammation)\n• Trop de sel (aggrave la rétention d'eau)\n\nEnvie de chocolat ? C'est normal — ton corps réclame du magnésium. Fonce sur le chocolat noir. 🍫`,

    sport: (ctx) => `${ctx.name}, à J${ctx.currentDay} ton énergie est au plus bas. Pas de pression !\n\n✅ Aujourd'hui :\n• Yoga restauratif ou yin yoga\n• Marche douce (20-30 min)\n• Stretching léger\n• Natation douce\n\n❌ Évite :\n• HIIT, crossfit, sprint\n• Muscu lourde\n• Tout ce qui te met K.O.\n\nMême 10 minutes de marche comptent. L'objectif c'est de bouger sans te vider. Tu reprendras l'intensité en phase folliculaire. 💪`,

    dormir: (ctx) => `${ctx.name}, le sommeil en phase menstruelle peut être perturbé par les douleurs.\n\n🌙 Mes conseils :\n• Bouillotte sur le ventre au coucher\n• Tisane camomille ou gingembre\n• Magnésium si tu en as (au coucher)\n• Chambre à 18-19°C\n• Dernier repas léger, 2h avant\n• Position fœtale si douleurs abdominales\n\nVise 8-9h de sommeil — ton corps en a vraiment besoin en ce moment.`,

    sucre: (ctx) => `${ctx.name}, les envies de sucre pendant les règles c'est 100% hormonal. Ta sérotonine (hormone du bonheur) est basse → ton cerveau cherche du sucre rapide pour la remonter.\n\n🧠 Alternative maligne :\n• Chocolat noir 70%+ (magnésium + plaisir)\n• Banane + beurre de cacahuète\n• Porridge avoine-miel-cannelle\n• Dattes + amandes\n\nCes options nourrissent le besoin sans le pic glycémique. Zéro culpabilité — c'est de la biochimie, pas un manque de volonté. 💛`,

    ballonnements: (ctx) => `${ctx.name}, les ballonnements pendant les règles sont causés par les prostaglandines (qui provoquent aussi les crampes).\n\n💡 Solutions :\n• Gingembre (en tisane ou râpé dans les plats)\n• Fenouil (tisane ou cru en salade)\n• Évite les boissons gazeuses et chewing-gums\n• Mange lentement, en petites portions\n• Probiotiques : yaourt nature, kéfir\n• Marche douce après les repas\n\nÇa s'améliore après tes règles, promis. 🌿`,

    irritabilite: (ctx) => `${ctx.name}, l'irritabilité pendant les règles c'est hormonal — tes œstrogènes sont au plancher et ta sérotonine aussi.\n\n🧘‍♀️ Ce qui aide :\n• Respiration 4-7-8 (calme le système nerveux)\n• Magnésium (régule l'humeur)\n• Évite le café (amplifie l'anxiété)\n• Marche en extérieur (sérotonine naturelle)\n• Donne-toi la permission de dire non\n\nCe n'est pas toi le problème — ce sont tes hormones. Et ça passe. 💜`,

    acne: (ctx) => `${ctx.name}, l'acné hormonale autour des règles est liée à la chute d'œstrogène (qui protège ta peau).\n\n✨ Ce qui aide :\n• Zinc : graines de courge, pois chiches\n• Oméga-3 : saumon, noix, graines de lin\n• Hydratation ++ (eau + aliments riches en eau)\n• Évite les produits laitiers si tu y es sensible\n• Nettoyage doux (pas de décapage !)\n\nTa peau va s'améliorer en phase folliculaire quand l'œstrogène remonte. Patience. 🌸`,

    pleurer: (ctx) => `${ctx.name}, avoir envie de pleurer pendant les règles c'est complètement normal. Tes hormones sont au plancher — œstrogène ET progestérone.\n\nCe n'est pas de la faiblesse, c'est de la chimie.\n\n💛 Ce qui peut t'aider :\n• Pleure si tu en as besoin (ça libère du cortisol)\n• Cocooning : couverture, tisane, série réconfortante\n• Parle à quelqu'un qui te comprend\n• Écris dans ton journal ce que tu ressens\n\nDans 2-3 jours l'œstrogène remonte et tu te sentiras déjà mieux. 🌱`,

    stress: (ctx) => `${ctx.name}, le stress est amplifié pendant les règles car tes hormones régulatrices sont basses.\n\n🧘 Plan anti-stress :\n• Respiration 4-7-8 (3 cycles minimum)\n• Magnésium (amandes, chocolat noir)\n• Marche en nature (même 15 min)\n• Limite le café et les écrans\n• Couche-toi plus tôt\n\nTon seuil de tolérance est naturellement plus bas en ce moment. C'est pas de la fragilité, c'est hormonal. 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, c'est normal de se sentir moins confiante pendant les règles — la chute d'œstrogène impacte directement l'estime de soi.\n\n💪 Rappelle-toi :\n• C'est temporaire (2-3 jours)\n• Ton corps fait un travail incroyable\n• Tu n'as rien à prouver à personne cette semaine\n• Ta valeur ne dépend pas de ta productivité\n\nDans quelques jours, l'œstrogène remonte et ta confiance avec. En attendant, sois ta meilleure amie. ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau pendant les règles est liée aux fluctuations hormonales.\n\n💧 Solutions :\n• Bois plus d'eau (paradoxalement, ça aide)\n• Réduis le sel\n• Potassium : banane, avocat, patate douce\n• Marche légère (active la circulation)\n• Tisane de pissenlit (drainante naturelle)\n\nTu peux prendre 1-2 kg d'eau — c'est pas du gras, c'est hormonal. Ça part après les règles.`,

    default: (ctx) => `${ctx.name}, tu es à J${ctx.currentDay} — phase menstruelle. Tes hormones sont au plus bas.\n\n📋 Les priorités :\n• Fer (lentilles, épinards) + vitamine C\n• Magnésium (chocolat noir, amandes)\n• Sport doux (yoga, marche)\n• Sommeil 8-9h\n• Hydratation\n\nTon corps se régénère — c'est le moment de ralentir sans culpabiliser. Tout va remonter en phase folliculaire. 🌱`,
  },

  follicular: {
    fatigue: (ctx) => `${ctx.name}, si tu te sens encore fatiguée à J${ctx.currentDay}, c'est normal — l'œstrogène remonte progressivement mais n'est pas encore à son pic.\n\n⚡ Boosters d'énergie :\n• Lumière naturelle le matin (15 min minimum)\n• Protéines au petit-déj (œufs, yaourt grec)\n• Mouvement : même 20 min de marche rapide\n• Hydratation dès le réveil\n\nTon énergie va monter chaque jour. D'ici 3-4 jours tu te sentiras en pleine forme ! 🚀`,

    normal: (ctx) => `${ctx.name}, en phase folliculaire (J${ctx.currentDay}) tu devrais sentir :\n\n✨ Le positif :\n• Énergie qui remonte\n• Meilleure humeur, plus d'optimisme\n• Créativité en hausse\n• Meilleure récupération musculaire\n• Peau plus lumineuse\n\nC'est ta phase de "renouveau" — ton corps se prépare à l'ovulation. Profite de cette montée d'énergie pour lancer des projets ! 💫`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${ctx.cycleLength - 14}, soit dans environ ${Math.max(0, ctx.cycleLength - 14 - ctx.currentDay)} jours.\n\n🔔 Signes à observer :\n• Glaire cervicale type "blanc d'œuf"\n• Légère douleur d'un côté du ventre\n• Pic d'énergie et de libido\n• Confiance en hausse\n\nC'est ton moment le plus fertile du cycle. ✨`,

    manger: (ctx) => `${ctx.name}, l'œstrogène remonte — ton corps est en mode construction !\n\n🥗 À privilégier :\n• Protéines : poulet, œufs, quinoa, légumineuses\n• Zinc : graines de courge, pois chiches\n• Probiotiques : yaourt, kéfir, kimchi\n• Légumes variés et colorés\n• Graines germées, alfalfa\n\nC'est le moment des repas riches et variés — ton métabolisme est efficace et ta digestion au top. 🌿`,

    sport: (ctx) => `${ctx.name}, c'est TA meilleure phase pour le sport ! L'œstrogène booste ta récupération musculaire.\n\n🏋️ Go pour :\n• HIIT, crossfit, cardio intense\n• Musculation (augmente les charges)\n• Course à pied, sprint\n• Danse, escalade, boxe\n• Essaye un nouveau sport !\n\nTon corps récupère plus vite qu'à n'importe quel autre moment du cycle. C'est maintenant que tu progresses le plus. 💪🔥`,

    dormir: (ctx) => `${ctx.name}, bonne nouvelle — ton sommeil s'améliore naturellement avec la montée d'œstrogène !\n\n🌙 Profite pour recaler ton rythme :\n• Coucher à heure fixe\n• Lever tôt, lumière naturelle dès le réveil\n• 7-8h suffisent en phase folliculaire\n• Sport le matin ou en journée (pas le soir)\n\nC'est le moment idéal pour poser de bonnes habitudes de sommeil. 😴`,

    sucre: (ctx) => `${ctx.name}, en phase folliculaire les envies de sucre devraient diminuer car ton œstrogène remonte (et ta sérotonine avec).\n\nSi tu en as encore :\n• C'est peut-être un manque de sommeil\n• Ou un petit-déj pas assez protéiné\n• Essaie : œufs + avocat + pain complet le matin\n• Snack : pomme + beurre de cacahuète\n\nTon corps gère mieux le sucre en ce moment — c'est la meilleure phase pour réduire les envies. 🍎`,

    irritabilite: (ctx) => `${ctx.name}, si tu es irritable en phase folliculaire c'est moins courant — ça peut venir d'autres facteurs :\n\n🔍 Vérifie :\n• Sommeil suffisant ? (7-8h)\n• Stress externe (boulot, relations) ?\n• Alimentation équilibrée ?\n• Hydratation ?\n\n💡 Solutions rapides :\n• 5 min de respiration profonde\n• Marche en extérieur\n• Parle à quelqu'un\n\nTon œstrogène devrait naturellement améliorer ton humeur dans les prochains jours. 🌸`,

    acne: (ctx) => `${ctx.name}, ta peau devrait s'améliorer en phase folliculaire ! L'œstrogène qui remonte protège ta peau.\n\n✨ Pour accélérer :\n• Zinc : graines de courge, fruits de mer\n• Vitamine A : patate douce, carottes\n• Hydratation +++ \n• Probiotiques (lien intestin-peau)\n• Nettoyage doux matin et soir\n\nSi l'acné persiste, c'est peut-être lié au stress ou à l'alimentation plus qu'aux hormones. 🌿`,

    confiance: (ctx) => `${ctx.name}, ta confiance remonte naturellement avec l'œstrogène ! C'est le moment d'en profiter.\n\n🚀 Profite de cette phase pour :\n• Planifier tes meetings importants\n• Prendre la parole en public\n• Lancer un projet qui te tient à cœur\n• Sortir de ta zone de confort\n\nTa communication et ta créativité sont en hausse — utilise cette fenêtre ! ✨`,

    default: (ctx) => `${ctx.name}, tu es à J${ctx.currentDay} — phase folliculaire. Ton œstrogène remonte et c'est que du bon !\n\n📋 Profite pour :\n• Sport intense (meilleure récupération)\n• Nouveaux projets (créativité en hausse)\n• Alimentation variée et protéinée\n• Social (ta communication est au top)\n\nC'est ta phase de renouveau — tu montes en puissance chaque jour. 🚀`,
  },

  ovulatory: {
    fatigue: (ctx) => `${ctx.name}, fatiguée en phase ovulatoire ? C'est inhabituel — tes hormones sont à leur pic.\n\n🔍 Vérifie :\n• Sommeil suffisant ces derniers jours ?\n• Hydratation OK ?\n• Surentraînement possible ?\n• Stress important ?\n\nSi tout est normal, écoute ton corps — même en phase de pic, on peut avoir besoin de repos. Accorde-toi une journée douce. 💛`,

    normal: (ctx) => `${ctx.name}, en phase ovulatoire (J${ctx.currentDay}) c'est ton pic hormonal ! Tu devrais sentir :\n\n🔥 Au max :\n• Énergie et endurance au sommet\n• Confiance et communication boostées\n• Libido plus élevée\n• Peau éclatante\n• Capacités verbales au top\n\nC'est ta fenêtre de 2-3 jours pour briller — présentations, dates, records sportifs. Fonce ! ✨`,

    ovulation: (ctx) => `${ctx.name}, tu es en plein dedans ! J${ctx.currentDay}, c'est ta fenêtre ovulatoire.\n\n🔔 Signes typiques :\n• Glaire cervicale transparente et élastique\n• Légère douleur d'un côté (mittelschmerz)\n• Température basale qui monte légèrement\n• Pic de libido\n\nC'est ta période la plus fertile. Cette fenêtre dure environ 24-48h. 🌟`,

    manger: (ctx) => `${ctx.name}, ton œstrogène est au max — ton corps a besoin de fibres pour éliminer l'excès.\n\n🥗 À privilégier :\n• Fibres : légumes verts, céréales complètes, graines\n• Antioxydants : fruits rouges, légumes colorés\n• Crucifères : brocoli, chou-fleur (aident le foie)\n• Hydratation ++\n\n🍽️ Idée repas :\nPoke bowl saumon-avocat-edamame-quinoa. Frais, léger, riche en fibres. Parfait ! 🐟`,

    sport: (ctx) => `${ctx.name}, c'est ton PEAK ! Ton corps est à son maximum de performance.\n\n🏆 Fonce sur :\n• HIIT, sprint, boxe\n• Musculation lourde (bats tes records !)\n• Sports d'équipe (coordination au top)\n• Cours collectifs intenses\n\n⚠️ Attention : tes ligaments sont plus lâches (œstrogène). Échauffe-toi bien pour éviter les blessures. 💪🔥`,

    dormir: (ctx) => `${ctx.name}, tu as beaucoup d'énergie mais ne néglige pas le sommeil !\n\n🌙 Conseils :\n• 7-8h restent nécessaires\n• Méditation courte pour redescendre (10 min)\n• Eau détox concombre-menthe le soir\n• Pas d'écran 30 min avant de dormir\n\nLa descente d'énergie arrive bientôt (phase lutéale) — protège ton sommeil maintenant. 😴`,

    confiance: (ctx) => `${ctx.name}, ta confiance est naturellement au MAX en ce moment ! L'œstrogène + la testostérone = combo gagnant.\n\n🚀 C'est LE moment pour :\n• Négociations, présentations\n• Entretiens d'embauche\n• First dates\n• Conversations difficiles\n• Proposer tes idées\n\nTes capacités verbales et ton charisme sont à leur sommet. Profite de ces 2-3 jours ! 👑`,

    default: (ctx) => `${ctx.name}, J${ctx.currentDay} — tu es à ton pic ovulatoire ! Tes hormones sont au sommet.\n\n🔥 Ce que ça veut dire :\n• Performances physiques au max\n• Communication et confiance boostées\n• Énergie au top\n• Peau lumineuse, libido haute\n\nC'est ta fenêtre de 2-3 jours pour briller — profite-en à fond ! 🌟`,
  },

  luteal: {
    fatigue: (ctx) => `${ctx.name}, la fatigue en phase lutéale (J${ctx.currentDay}) est 100% normale. La progestérone a un effet sédatif naturel.\n\n💡 Plan d'action :\n• Magnésium au coucher (amandes, complément)\n• Pas de café après 14h\n• Glucides complexes (patate douce, avoine)\n• Sieste de 20 min si possible\n• Couche-toi 30 min plus tôt\n\nC'est pas un manque de volonté — c'est de la biochimie. Ton corps se prépare. 🌙`,

    normal: (ctx) => `${ctx.name}, en phase lutéale (J${ctx.currentDay}) tu peux ressentir :\n\n📋 Fréquent :\n• Fatigue, énergie en baisse\n• Envies de sucre/réconfort\n• Sensibilité émotionnelle\n• Ballonnements, seins sensibles\n• Sommeil plus difficile\n• Peau plus grasse\n\nC'est la progestérone qui fait tout ça. Ton métabolisme augmente de 10-20% — mange plus, c'est normal. Tu n'es pas "faible", tu es en phase lutéale. 💜`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est passée ! Tu es maintenant en phase lutéale (J${ctx.currentDay}).\n\nProchaines règles estimées dans environ ${ctx.daysUntilPeriod} jours.\n\n📋 À prévoir :\n• Énergie en baisse progressive\n• Adapter le sport (moins intense)\n• Plus de glucides complexes\n• Routine de sommeil stricte\n\nTon corps se prépare pour les prochaines règles. 🌸`,

    regles: (ctx) => `${ctx.name}, tes prochaines règles sont estimées dans environ ${ctx.daysUntilPeriod} jours.\n\n📋 Prépare-toi :\n• Stock de magnésium (chocolat noir, amandes)\n• Tisanes (camomille, gingembre)\n• Bouillotte prête\n• Repas anti-inflammatoires\n• Planifie des journées plus calmes\n\nSi tes règles sont irrégulières, note bien quand elles arrivent dans le calendrier — ça aide LUNA à mieux estimer. 📅`,

    manger: (ctx) => `${ctx.name}, ton métabolisme augmente de 10-20% en phase lutéale — tu as VRAIMENT besoin de 200 à 300 cal de plus par jour.\n\n🥗 À privilégier :\n• Glucides complexes : patate douce, avoine, riz complet\n• Magnésium : chocolat noir, amandes, noix\n• Vitamine B6 : banane, avocat, volaille\n• Tryptophane (précurseur de sérotonine) : dinde, œufs, graines de courge\n\n🍫 Envies de sucre ? C'est ta sérotonine qui baisse. Les glucides complexes la remontent sans le crash. Zéro culpabilité. 💛`,

    sport: (ctx) => `${ctx.name}, à J${ctx.currentDay} adapte l'intensité !\n\n${ctx.currentDay <= ctx.cycleLength - 7
      ? '📋 Première moitié lutéale :\n• Musculation modérée\n• Natation, vélo\n• Cardio moyen\n• Pilates'
      : '📋 Fin de phase lutéale :\n• Yoga doux, yin yoga\n• Marche\n• Stretching, foam rolling\n• Pilates léger'}\n\nTon corps récupère moins bien — baisse l'intensité progressivement. Le foam rolling est ton meilleur ami. 🧘‍♀️`,

    dormir: (ctx) => `${ctx.name}, la progestérone te rend somnolente MAIS peut fragmenter ton sommeil — c'est le paradoxe lutéal.\n\n🌙 Solutions :\n• Magnésium au coucher\n• Tisane camomille 45 min avant\n• Pas d'écran après 21h\n• Chambre à 18-19°C (ta temp corporelle monte)\n• Pas de café après 14h (la progestérone rend plus sensible)\n• Routine STRICTE : même heure chaque soir\n\nVise 8-9h en phase lutéale. 😴`,

    sucre: (ctx) => `${ctx.name}, les envies de sucre en phase lutéale sont 100% biologiques !\n\n🧠 Pourquoi :\n• Ta sérotonine baisse\n• Ton métabolisme augmente (+10-20%)\n• Ton corps demande du carburant\n\n✅ Solutions malignes :\n• Chocolat noir 70%+ (magnésium + plaisir)\n• Porridge avoine-banane-cannelle\n• Dattes + beurre de cacahuète\n• Patate douce rôtie au miel\n• Smoothie banane-cacao\n\nMange. Nourris. Ton. Corps. C'est pas de la faiblesse, c'est de la biologie. 💛`,

    ballonnements: (ctx) => `${ctx.name}, les ballonnements en phase lutéale sont liés à la progestérone qui ralentit la digestion.\n\n💡 Solutions :\n• Mange lentement, portions plus petites\n• Gingembre (tisane ou dans les plats)\n• Fenouil (tisane miracle anti-ballonnements)\n• Évite : sodas, chewing-gums, crucifères crus\n• Marche 15 min après les repas\n• Probiotiques : yaourt, kéfir\n\nC'est temporaire — ça s'améliore après les règles. 🌿`,

    irritabilite: (ctx) => `${ctx.name}, l'irritabilité en phase lutéale est ultra fréquente. La chute d'œstrogène + la montée de progestérone impactent directement la sérotonine.\n\n🧘‍♀️ Plan d'action :\n• Magnésium (régule le système nerveux)\n• Oméga-3 (saumon, noix)\n• Respiration 4-7-8 quand ça monte\n• Limite le café et le sucre raffiné\n• Mouvement doux (marche, yoga)\n• Communique tes besoins à ton entourage\n\nCe n'est PAS toi — ce sont tes hormones. Et c'est valide. 💜`,

    acne: (ctx) => `${ctx.name}, l'acné pré-menstruelle est liée à la chute d'œstrogène et la montée relative de testostérone.\n\n✨ Plan peau :\n• Zinc : graines de courge, pois chiches, fruits de mer\n• Oméga-3 : saumon, graines de lin\n• Évite les produits laitiers (si sensible)\n• Nettoyage doux (pas de décapage !)   \n• Hydrate bien ta peau\n• Évite de toucher ton visage\n\nZone T et mâchoire = typiquement hormonal. Ça s'améliore après les règles. 🌸`,

    pleurer: (ctx) => `${ctx.name}, l'envie de pleurer en phase lutéale c'est la chute de sérotonine + les fluctuations de progestérone.\n\nC'est valide. C'est hormonal. C'est PAS de la faiblesse.\n\n💛 Ce qui aide :\n• Pleure si tu en as besoin (ça libère le stress)\n• Magnésium + B6 (régulent l'humeur)\n• Mouvement doux (endorphines)\n• Journal intime (écris ce que tu ressens)\n• Contact physique (câlin, massage)\n\nDans quelques jours ça passe — tes hormones se stabilisent. 🌱`,

    stress: (ctx) => `${ctx.name}, ton seuil de stress est naturellement plus bas en phase lutéale — la progestérone amplifie tout.\n\n🧘 Plan anti-stress :\n• Respiration guidée (utilise l'outil LUNA)\n• Magnésium matin + soir\n• Réduis ta to-do list (priorise)\n• Dis non plus souvent\n• Nature (même 15 min)\n• Limite les réseaux sociaux\n\nTon corps est en mode "protection" — respecte ça. Tu seras en mode "action" dans quelques jours. 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, la confiance peut baisser en phase lutéale — c'est l'œstrogène qui chute.\n\n💪 Rappels importants :\n• C'est TEMPORAIRE (quelques jours)\n• Ta valeur ne dépend pas de ton énergie\n• Réduis les comparaisons (limite les réseaux)\n• Fais des choses qui te font du bien\n• Relis tes réussites dans ton journal\n\nDans quelques jours, la phase folliculaire ramène la confiance naturellement. En attendant, sois douce avec toi. ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau en phase lutéale est liée à la progestérone.\n\n💧 Solutions :\n• Hydrate-toi +++ (ça paraît paradoxal mais ça aide)\n• Réduis le sel\n• Potassium : banane, avocat, patate douce\n• Marche quotidienne (circulation)\n• Tisane de pissenlit (drainante)\n• Surélève tes jambes le soir\n\nTu peux prendre 1-3 kg — c'est de l'eau, pas du gras. Ça part en début de règles. 💛`,

    hiit: (ctx) => `${ctx.name}, en phase lutéale le HIIT c'est déconseillé — surtout en fin de phase.\n\n${ctx.currentDay <= ctx.cycleLength - 7
      ? 'Tu es en début de phase lutéale — tu peux encore faire du cardio modéré, de la muscu légère. Mais écoute ton corps.'
      : 'Tu es en fin de phase lutéale — privilégie yoga, marche, Pilates. Ton corps récupère moins bien.'}\n\n🧠 Pourquoi :\n• Cortisol déjà élevé (le HIIT en rajoute)\n• Récupération musculaire réduite\n• Risque de blessure augmenté\n\nGarde le HIIT pour la phase folliculaire — c'est là que tu en tires le max. 💪`,

    default: (ctx) => `${ctx.name}, tu es à J${ctx.currentDay} — phase lutéale. La progestérone domine.\n\n📋 Tes priorités :\n• Mange plus (+200-300 cal/jour, glucides complexes)\n• Sport modéré → doux\n• Sommeil 8-9h (routine stricte)\n• Magnésium +++\n• Bienveillance envers toi-même\n\nEncore ${ctx.daysUntilPeriod} jours avant tes règles. Les envies, la fatigue, les émotions — c'est hormonal, pas personnel. 💜`,
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
  { keys: ['hiit', 'intense', 'cardio', 'crossfit', 'sprint'], response: 'hiit' },
  { keys: ['yoga'], response: 'sport' },
];

export function getLunaResponse(question, phase, userContext = {}) {
  const q = question.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const qOriginal = question.toLowerCase();
  const responses = RESPONSES[phase] || RESPONSES.follicular;

  // Trouver la meilleure réponse par mot-clé
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

  const responseKey = bestMatch || 'default';
  const responseFn = responses[responseKey] || responses['default'];

  const ctx = {
    name: userContext.name || 'ma belle',
    phase,
    currentDay: userContext.currentDay || 1,
    cycleLength: userContext.cycleLength || 28,
    periodLength: userContext.periodLength || 5,
    daysUntilPeriod: userContext.daysUntilPeriod || 0,
    energy: userContext.energy || null,
    symptoms: userContext.symptoms || [],
    goals: userContext.goals || [],
  };

  return responseFn(ctx);
}
