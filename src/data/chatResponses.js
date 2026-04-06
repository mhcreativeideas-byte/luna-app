import { RECIPES as CATALOG_RECIPES } from './recipes';

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

// ===== RÉPONSES CONVERSATIONNELLES PAR PHASE =====
// Chaque réponse sonne comme une copine bienveillante, pas un article médical
// ctx = { name, phase, currentDay, cycleLength, periodLength, daysUntilPeriod, energy, symptoms, goals }

const RESPONSES = {
  menstrual: {
    fatigue: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, à J${ctx.currentDay} c'est totalement normal d'être à plat — tes hormones sont au plus bas en ce moment.\n\nCe qui va vraiment t'aider : du chocolat noir et des amandes pour le magnésium, des lentilles ou des épinards pour le fer, et surtout te coucher tôt. 8-9h de sommeil c'est pas du luxe cette semaine, c'est un vrai besoin.\n\nTa fatigue va remonter dans 2-3 jours quand l'œstrogène reprend. Patience 🌱`,
      `${ctx.name}, J${ctx.currentDay} et fatiguée ? C'est clairement tes hormones — œstrogène et progestérone sont au plancher.\n\nMise sur le magnésium (amandes, chocolat noir, banane) et le fer (lentilles, épinards). Bois beaucoup d'eau et accorde-toi une vraie nuit longue ce soir.\n\nC'est pas un coup de mou, c'est ton corps qui se régénère. Ça passe dans quelques jours 💛`,
    ]), ctx),

    normal: (ctx) => pickOne([
      `${ctx.name}, oui, tout ce que tu ressens est normal pour J${ctx.currentDay}. Tes hormones sont au plus bas, et ça peut donner : fatigue, crampes, envie de rester au chaud, sensibilité émotionnelle, ballonnements...\n\nTon corps élimine la muqueuse utérine — c'est un vrai travail interne. Sois douce avec toi, c'est pas le moment de tout donner. Ça remonte bientôt 💜`,
      `${ctx.name}, ce que tu ressens à J${ctx.currentDay} est complètement logique. Phase menstruelle = hormones au plancher. Fatigue, crampes, émotions à fleur de peau — c'est le package.\n\nRien d'inquiétant, ton corps fait son job. Prends soin de toi et ne te mets pas la pression. La remontée arrive vite 🌸`,
    ]),

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${Math.max(0, ctx.cycleLength - 14)}, soit dans environ ${Math.max(0, ctx.cycleLength - 14 - ctx.currentDay)} jours.\n\nTu le sentiras sûrement : montée d'énergie, meilleure humeur, parfois une petite douleur d'un côté du ventre. En attendant, repose-toi — la phase folliculaire va te redonner de l'élan ✨`,

    regles: (ctx) => pickOne([
      `${ctx.name}, tu es à J${ctx.currentDay} en phase menstruelle — tes règles sont là. Ton cycle fait ${ctx.cycleLength} jours, donc les prochaines arriveront dans environ ${ctx.daysUntilPeriod} jours.\n\nSi t'as des douleurs : bouillotte sur le ventre, tisane gingembre ou curcuma, et du magnésium (amandes, chocolat noir). Prends soin de toi cette semaine 🌙`,
      `${ctx.name}, J${ctx.currentDay} — tu es dans tes règles. Prochaines dans environ ${ctx.daysUntilPeriod} jours (cycle de ${ctx.cycleLength} jours).\n\nPour soulager les douleurs, le combo curcuma + gingembre + bouillotte, c'est simple mais tellement efficace. Et le magnésium au coucher aide aussi les crampes 💜`,
    ]),

    manger: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, pendant tes règles ton corps perd du fer — c'est la priorité numéro 1.\n\nMise sur les lentilles, épinards, tofu, et combine toujours avec de la vitamine C (citron, kiwi, poivron) pour mieux absorber le fer. Le curcuma et le gingembre sont top en anti-inflammatoire, et le chocolat noir 70%+ c'est ton meilleur ami pour le magnésium.\n\nÀ limiter : le café (il bloque le fer) et l'alcool (amplifie l'inflammation). Mais si t'as envie de chocolat, fonce — ton corps réclame du magnésium 🍫`,
      `${ctx.name}, en phase menstruelle, pense fer + anti-inflammatoire.\n\nConcrètement : lentilles, épinards, saumon ou sardines, et des épices comme le curcuma et le gingembre. Ajoute du citron sur tes plats pour mieux absorber le fer.\n\nÉvite de trop forcer sur le café (mauvais pour l'absorption du fer) et privilégie les repas chauds et réconfortants. Ton corps a besoin de douceur 🌿`,
    ]), ctx),

    sport: (ctx) => pickOne([
      `${ctx.name}, à J${ctx.currentDay} pas de pression sur le sport. Ton énergie est au plus bas et c'est normal.\n\nCe qui fait du bien : yoga doux, marche tranquille, stretching, natation douce. Même 10 minutes de marche ça compte.\n\nLe HIIT, la muscu lourde, le cardio intense — garde ça pour la phase folliculaire. Là tu vas tout déchirer. Pour l'instant, on est en mode récupération 💪`,
      `${ctx.name}, écoute ton corps à J${ctx.currentDay}. C'est le moment du yoga restauratif, de la marche douce, du stretching.\n\nPas besoin de forcer — bouger un peu suffit. L'intensité, ça revient naturellement en phase folliculaire. Ton corps récupère, laisse-le faire 🧘‍♀️`,
    ]),

    dormir: (ctx) => `${ctx.name}, le sommeil en phase menstruelle peut être perturbé par les douleurs. Ce qui aide : une bouillotte sur le ventre au coucher, une tisane camomille, et la chambre à 18-19°C.\n\nSi t'as du magnésium, prends-le le soir. Et vise 8-9h — ton corps en a vraiment besoin en ce moment. Dernier repas léger, 2h avant de dormir 🌙`,

    sucre: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, les envies de sucre pendant les règles c'est 100% hormonal — ta sérotonine est basse et ton cerveau cherche du sucre rapide pour la remonter.\n\nL'astuce : chocolat noir 70%+, banane avec du beurre de cacahuète, porridge avoine-miel-cannelle, ou dattes + amandes. Ça nourrit le besoin sans le pic glycémique.\n\nZéro culpabilité — c'est de la biochimie, pas un manque de volonté 💛`,
      `${ctx.name}, envie de sucre ? Totalement normal en phase menstruelle — c'est ta sérotonine qui est basse.\n\nAu lieu de craquer sur du sucre raffiné, essaie le chocolat noir 70%+ (magnésium + plaisir), des dattes avec des amandes, ou une banane avec du beurre de cacahuète. Même effet réconfortant, sans le crash après.\n\nTon corps te parle, écoute-le intelligemment 🍫`,
    ]), ctx),

    ballonnements: (ctx) => adaptFoodText(`${ctx.name}, les ballonnements pendant les règles sont causés par les prostaglandines — les mêmes qui provoquent les crampes.\n\nCe qui aide vraiment : tisane de gingembre ou de fenouil, manger lentement en petites portions, marcher un peu après les repas. Évite les boissons gazeuses et les chewing-gums.\n\nÇa s'améliore après tes règles, promis 🌿`, ctx),

    irritabilite: (ctx) => `${ctx.name}, l'irritabilité pendant les règles c'est hormonal — tes œstrogènes et ta sérotonine sont au plancher.\n\nCe qui aide : la respiration 4-7-8 (inspire 4s, retiens 7s, expire 8s), du magnésium, une marche en extérieur pour la sérotonine naturelle. Et évite le café qui peut amplifier l'anxiété.\n\nC'est pas toi le problème, ce sont tes hormones. Et ça passe 💜`,

    acne: (ctx) => adaptFoodText(`${ctx.name}, l'acné autour des règles c'est la chute d'œstrogène qui ne protège plus ta peau.\n\nMise sur le zinc (graines de courge, pois chiches) et les oméga-3 (saumon, noix, graines de lin). Bois beaucoup d'eau et nettoyage doux — surtout pas de décapage.\n\nTa peau va s'améliorer en phase folliculaire quand l'œstrogène remonte 🌸`, ctx),

    pleurer: (ctx) => `${ctx.name}, avoir envie de pleurer pendant les règles c'est complètement normal. Tes hormones sont au plancher.\n\nSi t'as besoin de pleurer, pleure — ça libère du cortisol et ça fait du bien. Accorde-toi du cocooning : couverture, tisane, série réconfortante. Parle à quelqu'un si tu en ressens le besoin.\n\nDans 2-3 jours l'œstrogène remonte et tu te sentiras déjà mieux 🌱`,

    stress: (ctx) => `${ctx.name}, le stress est amplifié pendant les règles parce que tes hormones régulatrices sont basses.\n\nEssaie la respiration 4-7-8 (3 cycles minimum), mange des amandes ou du chocolat noir pour le magnésium, et va marcher même 15 minutes. Limite le café et les écrans si tu peux.\n\nTon seuil de tolérance est naturellement plus bas en ce moment. C'est hormonal, pas de la fragilité 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, c'est normal de se sentir moins confiante pendant les règles — la chute d'œstrogène impacte directement l'estime de soi.\n\nRappelle-toi que c'est temporaire (2-3 jours). Ton corps fait un travail incroyable et tu n'as rien à prouver à personne cette semaine.\n\nDans quelques jours, l'œstrogène remonte et ta confiance avec. En attendant, sois ta meilleure amie ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau pendant les règles c'est hormonal. Paradoxalement, boire plus d'eau aide à la réduire.\n\nRéduis le sel, mise sur le potassium (banane, avocat, patate douce) et marche un peu pour activer la circulation. La tisane de pissenlit est aussi un bon drainant naturel.\n\nLes 1-2 kg en plus c'est de l'eau, pas du gras — ça part après les règles 💧`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, en phase menstruelle les meilleurs snacks c'est ceux qui apportent du fer et du magnésium.\n\nMes favoris : chocolat noir 70% + amandes, banane + beurre de cacahuète, dattes fourrées aux noix, ou un petit energy ball chocolat-dattes.\n\nVa voir la section Recettes > Snacks pour plus d'idées adaptées à ta phase 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, les meilleures boissons pour tes règles :\n\nGolden milk au curcuma (anti-inflammatoire), infusion gingembre-citron (aide les crampes), tisane de camomille (relaxante). Et beaucoup d'eau !\n\nÀ limiter : le café qui réduit l'absorption du fer, et l'alcool qui amplifie l'inflammation 🌿`, ctx),

    douleur: (ctx) => pickOne([
      `${ctx.name}, les crampes et douleurs à J${ctx.currentDay} c'est les prostaglandines — des molécules inflammatoires qui font contracter l'utérus.\n\nCe qui aide concrètement : bouillotte sur le ventre (ça détend les muscles), tisane gingembre ou curcuma (anti-inflammatoire naturel), magnésium (amandes, chocolat noir). Le gingembre est aussi efficace qu'un ibuprofène dans certaines études.\n\nSi les douleurs sont très intenses ou inhabituelles, n'hésite pas à en parler à ton médecin 💜`,
      `${ctx.name}, j'ai mal pour toi 💜 Les douleurs menstruelles c'est ultra fréquent et c'est hormonal.\n\nMes meilleures armes : bouillotte sur le bas-ventre, tisane gingembre-curcuma, magnésium, et la position fœtale si ça tire beaucoup. Évite le café qui peut aggraver les crampes.\n\nSi ça ne passe pas ou que c'est invalidant, parle-en à ton médecin — tu ne dois pas souffrir en silence.`,
    ]),

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! Tu y entres tes ingrédients et je te propose des recettes adaptées à ta phase menstruelle.\n\nEn ce moment, priorise les ingrédients riches en fer (lentilles, épinards, tofu) et en magnésium (amandes, chocolat noir). Le gingembre et le curcuma sont tes alliés anti-douleur 🧊`,

    default: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, tu es à J${ctx.currentDay} en phase menstruelle. Tes hormones sont au plus bas — c'est le moment de ralentir.\n\nLes priorités : fer + vitamine C, magnésium, sport doux, beaucoup de sommeil et d'eau. Ton corps se régénère, il a besoin de douceur.\n\nTout va remonter en phase folliculaire. Dis-moi si tu veux des conseils plus précis sur la nutrition, le sport ou le bien-être 🌱`,
      `${ctx.name}, J${ctx.currentDay} — phase menstruelle. Ton corps travaille en coulisses.\n\nRepose-toi, mange bien (fer, magnésium), bouge doucement. C'est pas le moment de te pousser, c'est le moment de prendre soin de toi.\n\nSur quoi tu veux que je t'aide ? Nutrition, sport, sommeil, humeur ? 💜`,
    ]), ctx),
  },

  follicular: {
    fatigue: (ctx) => pickOne([
      `${ctx.name}, encore fatiguée à J${ctx.currentDay} ? C'est normal — l'œstrogène remonte mais elle est pas encore à son pic.\n\nCe qui va accélérer les choses : lumière naturelle le matin (15 min dehors), des protéines au petit-déj (œufs, yaourt grec), et un peu de mouvement même léger.\n\nTon énergie monte chaque jour. D'ici quelques jours tu vas te sentir en pleine forme 🚀`,
      `${ctx.name}, à J${ctx.currentDay} l'énergie revient progressivement. Si t'es encore un peu à plat, c'est que l'œstrogène monte doucement.\n\nBouge un peu, mange protéiné le matin, et expose-toi à la lumière naturelle. Le déclic arrive bientôt 💪`,
    ]),

    normal: (ctx) => `${ctx.name}, en phase folliculaire (J${ctx.currentDay}) c'est ta phase de renouveau ! L'œstrogène remonte et avec elle : plus d'énergie, meilleure humeur, créativité en hausse, peau plus lumineuse.\n\nTon corps se prépare à l'ovulation — c'est le moment idéal pour lancer des projets, essayer des choses nouvelles, te dépasser au sport. Profites-en 💫`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est estimée vers J${ctx.cycleLength - 14}, soit dans environ ${Math.max(0, ctx.cycleLength - 14 - ctx.currentDay)} jours.\n\nTu le sentiras : pic d'énergie, meilleure humeur, parfois une légère douleur d'un côté du ventre, glaire cervicale type "blanc d'œuf".\n\nC'est ta période la plus fertile du cycle ✨`,

    manger: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, l'œstrogène remonte et ton corps est en mode construction — il a besoin de protéines et de zinc.\n\nMise sur le poulet, les œufs, le quinoa, les graines de courge, les pois chiches. Ajoute des probiotiques (yaourt, kéfir, kimchi) et des légumes variés et colorés.\n\nC'est le moment des repas riches et variés — ta digestion est au top 🌿`,
      `${ctx.name}, ta phase folliculaire c'est le moment de manger varié et protéiné. Ton corps construit, il a besoin de briques.\n\nŒufs, quinoa, légumineuses, graines de courge pour le zinc, légumes colorés, probiotiques. Et ton métabolisme est efficace, donc profites-en 🌱`,
    ]), ctx),

    sport: (ctx) => pickOne([
      `${ctx.name}, c'est TA meilleure phase pour le sport ! L'œstrogène booste ta récupération musculaire.\n\nHIIT, musculation, cardio, course, danse, boxe — c'est maintenant que tu peux tout donner. Ton corps récupère plus vite qu'à n'importe quel autre moment du cycle.\n\nProfite de cette fenêtre pour progresser 💪🔥`,
      `${ctx.name}, fonce ! Phase folliculaire = meilleure récupération musculaire. C'est le moment de te dépasser : HIIT, muscu, cardio intense, tout est permis.\n\nTon corps en tirera le maximum de bénéfices. Vas-y à fond 🔥`,
    ]),

    dormir: (ctx) => `${ctx.name}, bonne nouvelle — ton sommeil s'améliore naturellement avec la montée d'œstrogène !\n\nProfite pour recaler ton rythme : coucher à heure fixe, lever tôt avec la lumière naturelle, sport le matin ou en journée. 7-8h suffisent en phase folliculaire.\n\nC'est le moment idéal pour poser de bonnes habitudes de sommeil 😴`,

    sucre: (ctx) => adaptFoodText(`${ctx.name}, en phase folliculaire les envies de sucre devraient diminuer car l'œstrogène et la sérotonine remontent.\n\nSi tu en as encore, vérifie ton sommeil et ton petit-déj — un petit-déj pas assez protéiné peut provoquer des fringales. Essaie œufs + avocat + pain complet le matin.\n\nTon corps gère mieux le sucre en ce moment — c'est la meilleure phase pour réduire les envies 🍎`, ctx),

    irritabilite: (ctx) => `${ctx.name}, irritable en phase folliculaire c'est moins courant — ça peut venir d'autre chose.\n\nVérifie ton sommeil, ton stress, ton alimentation, ton hydratation. 5 minutes de respiration profonde ou une marche en extérieur peuvent aider rapidement.\n\nTon œstrogène devrait améliorer ton humeur dans les prochains jours 🌸`,

    acne: (ctx) => adaptFoodText(`${ctx.name}, ta peau devrait s'améliorer ! L'œstrogène qui remonte la protège.\n\nPour accélérer : zinc (graines de courge, fruits de mer), vitamine A (patate douce, carottes), beaucoup d'eau, et un nettoyage doux matin et soir.\n\nSi l'acné persiste, c'est peut-être plus lié au stress ou à l'alimentation 🌿`, ctx),

    confiance: (ctx) => `${ctx.name}, ta confiance remonte naturellement avec l'œstrogène ! Profite de cette phase pour planifier tes meetings importants, prendre la parole, lancer un projet qui te tient à cœur.\n\nTa communication et ta créativité sont en hausse — utilise cette fenêtre ✨`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, pour ta phase folliculaire mise sur les snacks protéinés :\n\nGranola maison, crackers + houmous, œuf dur + graines de courge, yaourt grec + fruits, pomme + beurre d'amande.\n\nL'œstrogène remonte, ton corps construit — les protéines et le zinc sont tes alliés ! Va voir Recettes > Snacks pour plus d'idées 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, en phase folliculaire les meilleures boissons :\n\nSmoothie vert énergie (épinards, banane, spiruline), matcha latte pour une énergie longue durée, eau de coco citronnée, thé vert.\n\nLe matcha c'est top en ce moment — la L-théanine donne une énergie calme et concentrée ☕`, ctx),

    douleur: (ctx) => `${ctx.name}, des douleurs en phase folliculaire c'est moins courant. Si ça vient de la fin de tes règles, ça devrait s'améliorer rapidement avec la montée d'œstrogène.\n\nSi ça persiste : tisane gingembre, bouillotte, et magnésium. Et si c'est inhabituel, n'hésite pas à consulter 💛`,

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! Entre tes ingrédients et je te propose des recettes adaptées à ta phase folliculaire.\n\nEn ce moment, priorise les protéines (poulet, œufs, quinoa), le zinc (graines de courge, pois chiches) et les probiotiques (yaourt, kéfir). Ton corps est en mode construction 🌿`,

    default: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, J${ctx.currentDay} en phase folliculaire — ton œstrogène remonte et c'est que du bon !\n\nC'est ta phase de renouveau : sport intense, nouveaux projets, alimentation variée et protéinée. Ta communication est au top, ton énergie monte chaque jour.\n\nSur quoi tu veux que je t'aide ? 🚀`,
      `${ctx.name}, phase folliculaire à J${ctx.currentDay} — tu montes en puissance !\n\nProfite pour te dépasser au sport, manger varié et protéiné, et lancer des projets. C'est ta fenêtre de croissance.\n\nDis-moi ce dont tu as besoin 💫`,
    ]), ctx),
  },

  ovulatory: {
    fatigue: (ctx) => pickOne([
      `${ctx.name}, fatiguée en phase ovulatoire ? C'est inhabituel — tes hormones sont à leur pic.\n\nVérifie ton sommeil des derniers jours, ton hydratation, un éventuel surentraînement ou un stress important. Si tout est OK, écoute ton corps — même au pic on peut avoir besoin de repos.\n\nAccorde-toi une journée douce 💛`,
      `${ctx.name}, c'est surprenant d'être fatiguée à J${ctx.currentDay} en phase ovulatoire. T'as bien dormi ? Assez bu d'eau ? Pas trop poussé au sport ?\n\nSi c'est un jour off, c'est OK — écoute ton corps. Sinon, une marche et un bon repas protéiné devraient relancer la machine 💪`,
    ]),

    normal: (ctx) => `${ctx.name}, phase ovulatoire à J${ctx.currentDay} — c'est ton pic hormonal ! Énergie et endurance au sommet, confiance boostée, peau éclatante, libido plus élevée.\n\nC'est ta fenêtre de 2-3 jours pour briller — présentations, dates, records sportifs. Fonce ✨`,

    ovulation: (ctx) => `${ctx.name}, tu es en plein dedans ! J${ctx.currentDay}, c'est ta fenêtre ovulatoire.\n\nLes signes typiques : glaire cervicale transparente et élastique, légère douleur d'un côté du ventre, pic de libido, température basale qui monte légèrement.\n\nC'est ta période la plus fertile — cette fenêtre dure environ 24-48h 🌟`,

    manger: (ctx) => adaptFoodText(`${ctx.name}, ton œstrogène est au max — ton corps a besoin de fibres pour éliminer l'excès.\n\nMise sur les légumes verts, les crucifères (brocoli, chou-fleur), les fruits rouges pour les antioxydants, et les céréales complètes. Mange frais et léger.\n\nIdée : un poke bowl saumon-avocat-edamame-quinoa. Parfait pour cette phase 🐟`, ctx),

    sport: (ctx) => pickOne([
      `${ctx.name}, c'est ton PEAK ! Ton corps est à son maximum de performance.\n\nHIIT, sprint, boxe, muscu lourde — c'est maintenant que tu bats tes records. Sports d'équipe aussi, ta coordination est au top.\n\nJuste une chose : échauffe-toi bien, tes ligaments sont plus lâches avec l'œstrogène au max 💪🔥`,
      `${ctx.name}, phase ovulatoire = performance maximale. Fonce sur tout ce qui est intense : HIIT, musculation, cardio, boxe. Ton corps est prêt.\n\nPense à bien t'échauffer (ligaments plus lâches) et vas-y à fond 🔥`,
    ]),

    dormir: (ctx) => `${ctx.name}, t'as beaucoup d'énergie mais ne néglige pas le sommeil ! 7-8h restent nécessaires.\n\nUne courte méditation pour redescendre le soir (10 min), pas d'écran 30 min avant de dormir. La phase lutéale arrive bientôt et tu auras besoin de bonnes réserves 😴`,

    confiance: (ctx) => `${ctx.name}, ta confiance est naturellement au MAX ! L'œstrogène + la testostérone = combo gagnant.\n\nC'est LE moment pour les négociations, entretiens, first dates, conversations difficiles, proposer tes idées. Tes capacités verbales et ton charisme sont à leur sommet.\n\nProfite de ces 2-3 jours 👑`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, pour ton pic ovulatoire, mise sur les snacks légers et antioxydants :\n\nSalade de fruits (baies, kiwi, grenade), edamame, crudités au tzatziki, tartine pain complet + avocat, ou un mix noix-baies.\n\nTon œstrogène est au max — les fibres et antioxydants aident ton corps à tout gérer 🌟`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, en phase ovulatoire les boissons parfaites :\n\nEau infusée détox (concombre, citron, menthe), jus betterave-pomme-gingembre, thé vert glacé, kombucha, smoothie aux fruits rouges.\n\nLes antioxydants et les fibres aident ton foie à éliminer l'excès d'œstrogène ✨`, ctx),

    douleur: (ctx) => `${ctx.name}, une légère douleur d'un côté du bas-ventre en phase ovulatoire c'est classique — ça s'appelle le "mittelschmerz". C'est l'ovule qui est libéré.\n\nSi c'est supportable, pas d'inquiétude. Un peu de chaleur sur le ventre aide. Si c'est vraiment douloureux ou que ça dure, consulte ton médecin 🌸`,

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! Entre tes ingrédients et je te propose des recettes adaptées à ta phase ovulatoire.\n\nEn ce moment, priorise les fibres (légumes verts, céréales complètes), les antioxydants (fruits rouges) et les crucifères (brocoli, chou-fleur) 🌟`,

    default: (ctx) => pickOne([
      `${ctx.name}, J${ctx.currentDay} — pic ovulatoire ! Tes hormones sont au sommet : performances physiques au max, communication boostée, énergie débordante, peau lumineuse.\n\nC'est ta fenêtre de 2-3 jours pour tout donner. Sur quoi tu veux que je t'aide ? 🌟`,
      `${ctx.name}, phase ovulatoire à J${ctx.currentDay} — tu es à ton maximum ! Sport intense, projets ambitieux, socialisation... tout est aligné.\n\nDis-moi ce dont tu as besoin et je t'aide à en profiter au max ✨`,
    ]),
  },

  luteal: {
    fatigue: (ctx) => pickOne([
      `${ctx.name}, la fatigue en phase lutéale à J${ctx.currentDay} c'est 100% normal — la progestérone a un effet sédatif naturel.\n\nCe qui aide : magnésium le soir (amandes ou complément), pas de café après 14h, des glucides complexes (patate douce, avoine), et te coucher 30 min plus tôt.\n\nC'est pas un manque de volonté — c'est de la biochimie. Ton corps se prépare 🌙`,
      `${ctx.name}, J${ctx.currentDay} en phase lutéale — normal d'être fatiguée, c'est la progestérone qui fait ça.\n\nMagnésium au coucher, glucides complexes dans l'assiette, et accorde-toi une sieste de 20 min si tu peux. Le café après 14h c'est non par contre.\n\nÇa passera en début de cycle prochain 💛`,
    ]),

    normal: (ctx) => `${ctx.name}, en phase lutéale (J${ctx.currentDay}) tu peux ressentir : fatigue, envies de sucre, sensibilité émotionnelle, ballonnements, seins sensibles, sommeil perturbé...\n\nC'est la progestérone qui fait tout ça. Et ton métabolisme augmente de 10-20% — tu as réellement besoin de manger plus. C'est pas de la faiblesse, c'est ta biologie 💜`,

    ovulation: (ctx) => `${ctx.name}, ton ovulation est passée ! Tu es maintenant en phase lutéale à J${ctx.currentDay}.\n\nProchaines règles estimées dans environ ${ctx.daysUntilPeriod} jours. L'énergie va baisser progressivement — adapte le sport, mange plus de glucides complexes, et installe une bonne routine de sommeil 🌸`,

    regles: (ctx) => `${ctx.name}, tes prochaines règles sont estimées dans environ ${ctx.daysUntilPeriod} jours.\n\nPrépare-toi : stock de chocolat noir et d'amandes (magnésium), tisanes camomille et gingembre, bouillotte prête. Et planifie des journées un peu plus calmes si possible.\n\nSi tes règles sont irrégulières, note bien quand elles arrivent — ça m'aide à mieux estimer 📅`,

    manger: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, ton métabolisme augmente de 10-20% en phase lutéale — tu as VRAIMENT besoin de 200-300 cal de plus par jour. Ne te restreins pas.\n\nMise sur les glucides complexes (patate douce, avoine, riz complet), le magnésium (chocolat noir, amandes), la vitamine B6 (banane, avocat) et le tryptophane pour la sérotonine (dinde, œufs, graines de courge).\n\nLes envies de sucre ? C'est ta sérotonine qui baisse. Les glucides complexes la remontent sans le crash 💛`,
      `${ctx.name}, en phase lutéale, mange plus — c'est un besoin réel. Ton métabolisme tourne plus vite.\n\nPatate douce, avoine, chocolat noir, amandes, banane, avocat. Tout ce qui est réconfortant ET nourrissant. Le tryptophane (dinde, œufs) aide aussi ta sérotonine.\n\nZéro culpabilité sur les quantités, ton corps en a besoin 🍫`,
    ]), ctx),

    sport: (ctx) => pickOne([
      `${ctx.name}, à J${ctx.currentDay} adapte l'intensité.\n\n${ctx.currentDay <= ctx.cycleLength - 7
        ? 'Début de phase lutéale : muscu modérée, natation, vélo, Pilates — c\'est encore OK de pousser un peu.'
        : 'Fin de phase lutéale : yoga doux, marche, stretching, Pilates léger. Ton corps récupère moins bien.'}\n\nLe foam rolling est ton meilleur ami en ce moment. Garde le HIIT pour la phase folliculaire 🧘‍♀️`,
      `${ctx.name}, phase lutéale à J${ctx.currentDay} — baisse l'intensité progressivement.\n\n${ctx.currentDay <= ctx.cycleLength - 7
        ? 'Tu peux encore faire de la muscu modérée, du vélo, de la natation.'
        : 'Privilégie le yoga, la marche, le stretching. Ton corps a besoin de douceur.'}\n\nTu reprendras à fond en phase folliculaire 💪`,
    ]),

    dormir: (ctx) => `${ctx.name}, la progestérone te rend somnolente MAIS peut fragmenter ton sommeil — c'est le paradoxe lutéal.\n\nMagnésium au coucher, tisane camomille 45 min avant, chambre à 18-19°C (ta température corporelle monte), pas de café après 14h. Routine stricte : même heure chaque soir.\n\nVise 8-9h en phase lutéale 😴`,

    sucre: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, les envies de sucre en phase lutéale sont 100% biologiques ! Ta sérotonine baisse, ton métabolisme augmente, ton corps demande du carburant.\n\nAlternatives malignes : chocolat noir 70%+, porridge avoine-banane-cannelle, dattes + beurre de cacahuète, patate douce rôtie au miel, smoothie banane-cacao.\n\nMange. Nourris. Ton. Corps. C'est de la biologie, pas de la faiblesse 💛`,
      `${ctx.name}, envie de sucre ? Ton corps te le demande pour de bonnes raisons — sérotonine basse + métabolisme en hausse.\n\nFais-toi plaisir intelligemment : chocolat noir, dattes + amandes, banane + beurre de cacahuète, porridge chaud. Ça nourrit le besoin sans le crash.\n\nAucune culpabilité à avoir 🍫`,
    ]), ctx),

    ballonnements: (ctx) => adaptFoodText(`${ctx.name}, les ballonnements en phase lutéale c'est la progestérone qui ralentit ta digestion.\n\nCe qui aide : manger lentement, portions plus petites, tisane de gingembre ou de fenouil, marche 15 min après les repas. Évite les sodas, chewing-gums, et les crucifères crus.\n\nC'est temporaire — ça s'améliore après les règles 🌿`, ctx),

    irritabilite: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, l'irritabilité en phase lutéale c'est ultra fréquent — la chute d'œstrogène + la progestérone impactent directement la sérotonine.\n\nMagnésium (amandes, chocolat noir), oméga-3 (saumon, noix), respiration 4-7-8 quand ça monte. Limite le café et le sucre raffiné, et communique tes besoins à ton entourage.\n\nCe n'est PAS toi — ce sont tes hormones. Et c'est valide 💜`,
      `${ctx.name}, si t'es à cran c'est hormonal — ta sérotonine chute en phase lutéale.\n\nDu magnésium, de la respiration profonde, et surtout dis à ton entourage que c'est pas le meilleur moment pour te chercher. Limite aussi le café.\n\nÇa passe en quelques jours, promis 💜`,
    ]), ctx),

    acne: (ctx) => adaptFoodText(`${ctx.name}, l'acné pré-menstruelle c'est la chute d'œstrogène et la montée relative de testostérone.\n\nZinc (graines de courge, pois chiches), oméga-3 (saumon, graines de lin), beaucoup d'eau, nettoyage doux. Si t'es sensible aux produits laitiers, essaie de les réduire cette semaine.\n\nZone T et mâchoire = typiquement hormonal. Ça s'améliore après les règles 🌸`, ctx),

    pleurer: (ctx) => `${ctx.name}, l'envie de pleurer en phase lutéale c'est la chute de sérotonine et les fluctuations de progestérone. C'est valide, c'est hormonal, c'est pas de la faiblesse.\n\nPleure si t'en as besoin — ça libère le stress. Magnésium + B6 pour réguler l'humeur, mouvement doux pour les endorphines, et écris ce que tu ressens si ça t'aide.\n\nDans quelques jours ça passe 🌱`,

    stress: (ctx) => `${ctx.name}, ton seuil de stress est naturellement plus bas en phase lutéale — la progestérone amplifie tout.\n\nRespiration guidée, magnésium matin et soir, réduis ta to-do list, dis non plus souvent. Même 15 min en nature ça aide.\n\nTon corps est en mode "protection" — respecte ça. Tu seras en mode "action" dans quelques jours 💆‍♀️`,

    confiance: (ctx) => `${ctx.name}, la confiance peut baisser en phase lutéale — c'est l'œstrogène qui chute.\n\nC'est TEMPORAIRE. Ta valeur ne dépend pas de ton énergie. Réduis les comparaisons, limite les réseaux sociaux, fais des choses qui te font du bien.\n\nLa phase folliculaire ramène la confiance naturellement. En attendant, sois douce avec toi ✨`,

    retention: (ctx) => `${ctx.name}, la rétention d'eau en phase lutéale c'est la progestérone.\n\nBois plus d'eau (oui, paradoxalement), réduis le sel, mise sur le potassium (banane, avocat, patate douce), marche un peu chaque jour. La tisane de pissenlit est un bon drainant naturel.\n\nLes 1-3 kg en plus c'est de l'eau, pas du gras. Ça part en début de règles 💛`,

    hiit: (ctx) => `${ctx.name}, le HIIT en phase lutéale c'est déconseillé — surtout en fin de phase.\n\n${ctx.currentDay <= ctx.cycleLength - 7
      ? 'Tu es en début de phase lutéale — tu peux encore faire du cardio modéré, de la muscu légère. Mais écoute ton corps.'
      : 'Tu es en fin de phase — privilégie yoga, marche, Pilates.'}\n\nTon cortisol est déjà élevé, le HIIT en rajoute et la récupération est moins bonne. Garde ça pour la phase folliculaire 💪`,

    snack: (ctx) => adaptFoodText(`${ctx.name}, en phase lutéale mise sur les snacks réconfortants :\n\nPudding de chia au chocolat, muffins banane-noix, tartine beurre de cacahuète + banane, chocolat noir 70% + amandes, dattes + noix de cajou.\n\nTon métabolisme augmente de 10-20% — ces snacks nourrissent le besoin sans le crash. Va voir Recettes > Snacks pour les recettes complètes 🍪`, ctx),

    boisson: (ctx) => adaptFoodText(`${ctx.name}, les meilleures boissons pour ta phase lutéale :\n\nChocolat chaud au lait d'amande (magnésium + réconfort), tisane camomille-lavande (apaisante), moon milk à l'ashwagandha, tisane gingembre (anti-ballonnements), rooibos.\n\nLimite le café après 14h — la progestérone te rend plus sensible à la caféine 🌙`, ctx),

    douleur: (ctx) => `${ctx.name}, des douleurs en phase lutéale c'est souvent le syndrome prémenstruel — la progestérone peut provoquer crampes, douleurs dans le bas-ventre, seins sensibles.\n\nBouillotte sur le ventre, magnésium (amandes, chocolat noir), tisane gingembre. Si c'est très intense à chaque cycle, parle-en à ton médecin — tu ne dois pas subir 💜`,

    frigo: (ctx) => `${ctx.name}, va sur "Mon Frigo" dans la section Alimentation ! Entre tes ingrédients et je te propose des recettes adaptées à ta phase lutéale.\n\nEn ce moment, priorise les glucides complexes (patate douce, avoine), le magnésium (chocolat noir, amandes) et le tryptophane (dinde, banane, graines de courge) 💛`,

    default: (ctx) => adaptFoodText(pickOne([
      `${ctx.name}, J${ctx.currentDay} en phase lutéale — la progestérone domine.\n\nMange plus (+200-300 cal/jour, glucides complexes), adapte le sport (modéré puis doux), dors 8-9h, magnésium +++.\n\nEncore ${ctx.daysUntilPeriod} jours avant tes règles. Les envies, la fatigue, les émotions — c'est hormonal, pas personnel. Sur quoi tu veux que je t'aide ? 💜`,
      `${ctx.name}, phase lutéale à J${ctx.currentDay}. Ton corps ralentit et c'est normal.\n\nPrends soin de toi : mange bien, dors plus, bouge doucement. C'est pas le moment de te pousser.\n\nDis-moi ce dont tu as besoin — nutrition, sport, sommeil, humeur ? 🌙`,
    ]), ctx),
  },
};

// ===== HELPERS DE VARIÉTÉ =====
// Choisit aléatoirement une réponse parmi plusieurs variantes
function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Mapping de mots-clés vers les clés de réponse
// ORDRE = PRIORITÉ : les plus spécifiques en premier
const KEYWORD_MAP = [
  // Questions très spécifiques en premier
  { keys: ['frigo', 'ingrédient', 'restes', 'quoi faire avec', 'j\'ai dans mon'], response: 'frigo' },
  { keys: ['hiit', 'crossfit', 'sprint', 'cardio intense'], response: 'hiit' },
  { keys: ['snack', 'goûter', 'encas', 'collation', '4 heures', 'quatre heure'], response: 'snack' },
  { keys: ['boisson', 'boire', 'thé', 'tisane', 'infusion', 'latte', 'jus'], response: 'boisson' },
  // Douleurs spécifiques (crampes, douleurs menstruelles)
  { keys: ['douleur', 'crampe', 'mal au ventre', 'mal au bas', 'douloureuse', 'douloureux', 'j\'ai mal'], response: 'douleur' },
  // Symptômes physiques spécifiques
  { keys: ['ballon', 'gonfle', 'digestion', 'gaz', 'ballonnement'], response: 'ballonnements' },
  { keys: ['acné', 'bouton', 'peau', 'imperfection', 'teint'], response: 'acne' },
  { keys: ['rétention', 'gonflée', 'kilo', 'prise de poids'], response: 'retention' },
  // Humeurs/émotions
  { keys: ['pleurer', 'pleure', 'larme', 'triste', 'tristesse', 'déprimée', 'déprime'], response: 'pleurer' },
  { keys: ['irritable', 'irritabilité', 'colère', 'énerv', 'agacée', 'nerv'], response: 'irritabilite' },
  { keys: ['confiance', 'estime', 'légitime', 'nulle', 'imposteur', 'doute'], response: 'confiance' },
  { keys: ['stress', 'anxi', 'panique', 'overwhelm', 'submergée', 'débordée'], response: 'stress' },
  // Sujets principaux
  { keys: ['sucre', 'craving', 'gourmand', 'craquer', 'envie de sucre', 'envie de gras'], response: 'sucre' },
  { keys: ['fatigue', 'fatiguée', 'épuisée', 'crevée', 'aucune énergie', 'pas d\'énergie', 'vidée'], response: 'fatigue' },
  { keys: ['ovulation', 'ovule', 'fertile', 'fertilité', 'enceinte', 'bébé'], response: 'ovulation' },
  { keys: ['règles', 'regles', 'prochaines', 'combien de jours', 'menstruel', 'prochaines règles'], response: 'regles' },
  { keys: ['dormir', 'sommeil', 'insomnie', 'nuit', 'routine du soir', 'routine soir'], response: 'dormir' },
  { keys: ['sport', 'exercice', 'entraîn', 'entrainement', 'fitness', 'mouvement', 'muscu', 'course', 'yoga'], response: 'sport' },
  { keys: ['normal', 'symptôme', 'symptome', 'bizarre', 'inquiète'], response: 'normal' },
  { keys: ['manger', 'aliment', 'nourrir', 'nutrition', 'petit-déj', 'déjeuner', 'dîner', 'recette', 'plat', 'repas', 'menu', 'cuisiner'], response: 'manger' },
];

// ===== SYSTÈME DE RÉPONSE DYNAMIQUE =====

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
    limit: ['café', 'alcool', 'vin', 'vin rouge', 'vin blanc', 'bière', 'sodas', 'fritures', 'charcuterie', 'sucre raffiné', 'sel en excès', 'plats très épicés'],
    why_good: 'Ton corps perd du fer et a besoin d\'anti-inflammatoires.',
    why_limit: 'Ça peut amplifier l\'inflammation, les crampes et la rétention d\'eau.',
  },
  follicular: {
    good: ['poulet', 'œufs', 'quinoa', 'légumineuses', 'graines de courge', 'pois chiches', 'yaourt', 'kéfir', 'kimchi', 'avocat', 'brocoli', 'épinards', 'saumon', 'légumes colorés', 'graines germées', 'noix', 'amandes', 'fruits frais', 'tofu', 'lentilles', 'patate douce', 'riz complet', 'haricots', 'crevettes', 'thon'],
    ok: ['viande rouge', 'pâtes', 'pain', 'fromage', 'chocolat', 'riz', 'pomme de terre', 'crème', 'beurre', 'miel', 'café', 'concombre', 'tomate', 'carotte', 'mangue', 'ananas', 'banane'],
    limit: ['alcool', 'alcool en excès', 'vin', 'vin rouge', 'vin blanc', 'bière', 'sodas', 'fast food', 'sucre raffiné en excès'],
    why_good: 'L\'œstrogène remonte — ton corps est en mode construction et récupération.',
    why_limit: 'Ton corps est efficace, pas la peine de le charger inutilement.',
  },
  ovulatory: {
    good: ['légumes verts', 'brocoli', 'chou-fleur', 'chou', 'fruits rouges', 'quinoa', 'graines', 'saumon', 'avocat', 'concombre', 'tomate', 'radis', 'céréales complètes', 'légumineuses', 'kéfir', 'kombucha', 'edamame', 'spiruline'],
    ok: ['poulet', 'œufs', 'viande rouge', 'pâtes', 'riz', 'pain', 'fromage', 'pomme de terre', 'chocolat', 'café', 'fruits', 'noix', 'amandes', 'tofu', 'poisson', 'patate douce', 'banane'],
    limit: ['alcool', 'vin', 'vin rouge', 'vin blanc', 'bière', 'sodas', 'fritures', 'sucre raffiné', 'plats très lourds'],
    why_good: 'Ton œstrogène est au max — les fibres et crucifères aident ton foie à éliminer l\'excès.',
    why_limit: 'Ton corps est au top, pas besoin de le ralentir.',
  },
  luteal: {
    good: ['patate douce', 'avoine', 'riz complet', 'chocolat noir', 'amandes', 'noix', 'banane', 'avocat', 'dinde', 'poulet', 'œufs', 'graines de courge', 'saumon', 'épinards', 'lentilles', 'quinoa', 'yaourt', 'dattes', 'cannelle', 'gingembre', 'camomille'],
    ok: ['viande rouge', 'pâtes', 'pain', 'riz', 'fromage', 'pomme de terre', 'tofu', 'fruits', 'légumes', 'beurre de cacahuète', 'miel', 'crème', 'concombre', 'tomate'],
    limit: ['café après 14h', 'alcool', 'vin', 'vin rouge', 'vin blanc', 'bière', 'sucre raffiné', 'sel en excès', 'sodas', 'fritures', 'aliments ultra-transformés'],
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
  café: ['thé vert matcha', 'chicorée', 'décaféiné', 'golden latte (lait + curcuma)', 'thé chai'],
  thé: ['tisane (camomille, verveine)', 'rooibos', 'infusion gingembre-citron'],
  alcool: ['kombucha', 'mocktail aux fruits', 'eau pétillante + sirop naturel', 'jus de cranberry pétillant'],
  vin: ['kombucha', 'jus de raisin pétillant', 'mocktail rosé (eau de rose + pamplemousse)'],
  bière: ['bière sans alcool', 'kombucha', 'ginger beer artisanale'],
  'alcool en excès': ['mocktails', 'kombucha', 'eau pétillante aromatisée'],
  frites: ['patates douces rôties au four', 'frites de légumes (carottes, courgettes)', 'chips de chou kale'],
  fritures: ['version au four', 'air fryer', 'légumes rôtis croustillants', 'falafels au four'],
  pizza: ['pizza maison sur pâte complète', 'galette de sarrasin garnie', 'pizza sur base de chou-fleur'],
  burger: ['burger maison avec pain complet', 'burger de lentilles', 'wrap de laitue garni'],
  'fast food': ['version maison (burger, wraps, bowls)', 'pokeball maison', 'wrap poulet-avocat'],
  kebab: ['wrap maison poulet grillé + crudités + sauce yaourt', 'bowl méditerranéen'],
  tacos: ['tacos maison avec tortilla de maïs + garniture fraîche', 'bowl mexicain'],
  charcuterie: ['saumon fumé', 'poulet grillé émincé', 'houmous + crudités'],
  'sel en excès': ['herbes aromatiques', 'épices', 'citron', 'graines de sésame'],
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
  if (q.match(/smoothie/i)) return 'smoothie';
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
  if (!ctx) return text;
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

// ===== ALLERGÈNES (même logique que Recettes.jsx) =====
const ALLERGEN_KEYWORDS = {
  'Fruits à coque': ['amande', 'noix', 'noisette', 'pistache', 'cajou', 'pécan', 'macadamia'],
  'Arachides': ['arachide', 'cacahuète', 'cacahouète', 'beurre de cacahuète'],
  'Soja': ['soja', 'tofu', 'tempeh', 'edamame', 'miso', 'sauce soja', 'tamari'],
  'Œufs': ['œuf', 'oeuf', 'mayonnaise'],
  'Poisson': ['saumon', 'thon', 'cabillaud', 'sardine', 'maquereau', 'truite', 'anchois', 'poisson'],
  'Crustacés': ['crevette', 'crabe', 'homard', 'langoustine', 'crustacé', 'fruits de mer', 'gambas'],
  'Lait': ['lait', 'fromage', 'beurre', 'crème fraîche', 'crème liquide', 'yaourt', 'ricotta', 'parmesan', 'mozzarella', 'feta', 'mascarpone'],
  'Blé': ['blé', 'farine', 'pain', 'pâtes', 'spaghetti', 'penne', 'couscous', 'boulgour', 'semoule', 'tortilla', 'wrap'],
  'Sésame': ['sésame', 'tahini', 'tahin'],
  'Céleri': ['céleri', 'celeri'],
  'Moutarde': ['moutarde'],
  'Sulfites': ['vin blanc', 'vin rouge', 'vin rosé', 'vinaigre balsamique', 'sulfite'],
};

// Vérifie si une recette du catalogue contient un allergène
function catalogRecipeHasAllergen(recipe, allergies) {
  if (!allergies || allergies.length === 0) return false;
  const fullText = [...(recipe.ingredients || []), ...(recipe.steps || [])].join(' ').toLowerCase();
  return allergies.some((allergy) => {
    const keywords = ALLERGEN_KEYWORDS[allergy] || [];
    return keywords.some((kw) => fullText.includes(kw.toLowerCase()));
  });
}

// Mapping type de repas bot → catalogue
const MEAL_TYPE_MAP = {
  petit_dej: 'breakfast',
  dejeuner: 'lunch',
  diner: 'dinner',
  gouter: 'snack',
  snack: 'snack',
  smoothie: 'snack',
};

// Parse le temps de préparation en minutes
function parsePrepTime(str) {
  if (!str) return 999;
  const m = str.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 999;
}

// ===== RÉCUPÉRER LES RECETTES DU CATALOGUE FILTRÉES =====
function getCatalogRecipes(phase, mealType, ctx) {
  const catalogPhase = CATALOG_RECIPES?.[phase];
  if (!catalogPhase) return [];

  // Mapper le type de repas
  const catalogMealKey = mealType ? MEAL_TYPE_MAP[mealType] : null;

  // Récupérer les recettes (d'un type ou tous)
  let pool = [];
  if (catalogMealKey && catalogPhase[catalogMealKey]) {
    pool = [...catalogPhase[catalogMealKey]];
  } else {
    // Pas de type spécifique → prendre breakfast + lunch + dinner
    ['breakfast', 'lunch', 'dinner'].forEach((key) => {
      if (catalogPhase[key]) pool.push(...catalogPhase[key]);
    });
  }

  // Appliquer les filtres du profil
  const prefs = ctx.dietPreferences || [];
  const allergies = ctx.allergies || [];
  const issues = ctx.healthIssues || [];

  return pool.filter((recipe) => {
    const tags = recipe.tags || [];

    // Filtre régime alimentaire
    if (prefs.includes('Végane') && !tags.some(t => t === 'vegan')) return false;
    if (prefs.includes('Végétarienne') && !tags.some(t => ['vegan', 'vegetarien'].includes(t))) return false;
    if (prefs.includes('Sans gluten') && !tags.some(t => ['sans_gluten'].includes(t))) return false;
    if (prefs.includes('Sans lactose') && !tags.some(t => ['sans_lactose', 'vegan'].includes(t))) return false;

    // Filtre SOPK
    if (issues.includes('SOPK') && !tags.some(t => t === 'sopk_friendly')) return false;

    // Filtre allergènes
    if (catalogRecipeHasAllergen(recipe, allergies)) return false;

    return true;
  });
}

// Formate une recette du catalogue pour la réponse bot
function formatCatalogRecipe(recipe, phaseName, nutrients) {
  const dietLabel = '';
  const ingredientsList = recipe.ingredients.slice(0, 8).map((i) => `• ${i}`).join('\n');
  const stepsText = recipe.steps.join(' ');
  const whyText = recipe.whyThisPhase || '';

  return `J'ai une idée pour toi :\n\n${recipe.emoji || '👩‍🍳'} ${recipe.name}\n⏱️ ${recipe.prepTime}\n\n📝 Ingrédients :\n${ingredientsList}\n\n👉 ${stepsText}\n\n💡 ${whyText}\n\nEn phase ${phaseName}, ton corps a surtout besoin de ${nutrients.priority.slice(0, 3).join(', ')}.`;
}

// ===== GÉNÉRER UNE SUGGESTION DE RECETTE =====
// Combine les 40 recettes internes (prioritaires) + les 601 du catalogue
function generateRecipeResponse(phase, mealType, diet, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];
  const phaseRecipes = RECIPES[phase];

  // 1. D'abord chercher dans les recettes internes du bot (40 recettes détaillées)
  if (mealType && phaseRecipes[mealType]) {
    let internalRecipes = phaseRecipes[mealType];
    if (diet) internalRecipes = filterRecipesByDiet(internalRecipes, diet);

    // 50% de chance d'utiliser une recette interne si disponible, sinon catalogue
    if (internalRecipes.length > 0 && Math.random() < 0.4) {
      const nonRecent = internalRecipes.filter(r => !wasRecentlyProposed(r.name));
      const recipe = nonRecent.length > 0 ? nonRecent[Math.floor(Math.random() * nonRecent.length)] : internalRecipes[Math.floor(Math.random() * internalRecipes.length)];
      trackRecipe(recipe.name);
      if (recipe.instructions) {
        const dietLabel = diet === 'vegan' ? ' 🌱 (vegan)' : diet === 'vegetarien' ? ' 🥚 (végé)' : diet === 'sans_gluten' ? ' (sans gluten)' : '';
        return `J'ai une idée pour toi${dietLabel} :\n\n👩‍🍳 ${recipe.name}\n⏱️ ${recipe.time}\n\n📝 Ingrédients :\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n👉 ${recipe.instructions}\n\n💡 ${recipe.why}\n\nEn phase ${phaseName}, ton corps a surtout besoin de ${nutrients.priority.slice(0, 3).join(', ')}.`;
      }
      if (recipe.name && recipe.why) {
        return `Un snack parfait pour toi en ce moment :\n\n✨ ${recipe.name}\n💡 ${recipe.why}\n\nAutres idées :\n${phaseRecipes.snack.filter((s) => s.name !== recipe.name).slice(0, 2).map((s) => `• ${s.name} — ${s.why}`).join('\n')}`;
      }
    }
  }

  // 2. Chercher dans le catalogue des 601 recettes (avec filtres profil)
  const catalogPool = getCatalogRecipes(phase, mealType, ctx);
  if (catalogPool.length > 0) {
    const nonRecentCatalog = catalogPool.filter(r => !wasRecentlyProposed(r.name));
    const recipe = nonRecentCatalog.length > 0 ? nonRecentCatalog[Math.floor(Math.random() * nonRecentCatalog.length)] : catalogPool[Math.floor(Math.random() * catalogPool.length)];
    trackRecipe(recipe.name);
    return formatCatalogRecipe(recipe, phaseName, nutrients);
  }

  // 3. Fallback : recettes internes sans filtre de type
  if (!mealType) {
    const mealTypes = ['petit_dej', 'dejeuner', 'diner'];
    const randomMeal = mealTypes[Math.floor(Math.random() * mealTypes.length)];
    let recipes = phaseRecipes[randomMeal] || [];
    if (diet) {
      const filtered = filterRecipesByDiet(recipes, diet);
      if (filtered.length > 0) recipes = filtered;
    }
    const nonRecentFallback = recipes.filter(r => !wasRecentlyProposed(r.name));
    const recipe = nonRecentFallback.length > 0 ? nonRecentFallback[Math.floor(Math.random() * nonRecentFallback.length)] : recipes[Math.floor(Math.random() * recipes.length)];
    if (recipe) trackRecipe(recipe.name);
    if (recipe && recipe.instructions) {
      const mealLabels = { petit_dej: 'petit-déjeuner', dejeuner: 'déjeuner', diner: 'dîner' };
      return `J'ai trouvé une super idée de ${mealLabels[randomMeal] || 'repas'} pour ta phase ${phaseName} :\n\n👩‍🍳 ${recipe.name}\n⏱️ ${recipe.time}\n\n📝 Ingrédients :\n${recipe.ingredients.map((i) => `• ${i}`).join('\n')}\n\n👉 ${recipe.instructions}\n\n💡 ${recipe.why}\n\n${nutrients.metabolism}`;
    }
  }

  // 4. Dernier fallback : catalogue sans filtre de type
  const anyPool = getCatalogRecipes(phase, null, ctx);
  if (anyPool.length > 0) {
    const nonRecentAny = anyPool.filter(r => !wasRecentlyProposed(r.name));
    const recipe = nonRecentAny.length > 0 ? nonRecentAny[Math.floor(Math.random() * nonRecentAny.length)] : anyPool[Math.floor(Math.random() * anyPool.length)];
    trackRecipe(recipe.name);
    return formatCatalogRecipe(recipe, phaseName, nutrients);
  }

  return null;
}

// ===== GÉNÉRER UNE JOURNÉE COMPLÈTE =====
function generateFullDayMenu(phase, diet, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];
  const phaseRecipes = RECIPES[phase];

  const pick = (type) => {
    // Internal recipes
    let internalPool = phaseRecipes[type] || [];
    if (diet) {
      const filtered = filterRecipesByDiet(internalPool, diet);
      if (filtered.length > 0) internalPool = filtered;
    }

    // Catalog recipes
    const catalogMealKey = MEAL_TYPE_MAP[type];
    let catalogPool = catalogMealKey ? getCatalogRecipes(phase, type, ctx) : [];

    // 40% internal, 60% catalog when both available
    if (internalPool.length > 0 && catalogPool.length > 0) {
      const useInternal = Math.random() < 0.4;
      const pool = useInternal ? internalPool : catalogPool;
      const recipe = pool[Math.floor(Math.random() * pool.length)];
      trackRecipe(recipe.name);
      return recipe;
    }

    const combinedPool = [...internalPool, ...catalogPool];
    if (combinedPool.length === 0) return null;
    const recipe = combinedPool[Math.floor(Math.random() * combinedPool.length)];
    trackRecipe(recipe.name);
    return recipe;
  };

  const petitDej = pick('petit_dej');
  const dejeuner = pick('dejeuner');
  const gouter = pick('gouter') || pick('snack');
  const diner = pick('diner');

  const recipeTime = (r) => r.time || r.prepTime || '';
  const recipeWhy = (r) => r.why || r.whyThisPhase || '';

  let response = `Voilà ta journée nutrition pour la phase ${phaseName} (J${ctx.currentDay}) :\n\n`;
  response += `☀️ PETIT-DÉJ :\n${petitDej ? `👩‍🍳 ${petitDej.name}${recipeTime(petitDej) ? ` (${recipeTime(petitDej)})` : ''}\n${recipeWhy(petitDej) ? `💡 ${recipeWhy(petitDej).split('.')[0]}.` : ''}` : 'Porridge + fruits + graines'}\n\n`;
  response += `🍽️ DÉJEUNER :\n${dejeuner ? `👩‍🍳 ${dejeuner.name}${recipeTime(dejeuner) ? ` (${recipeTime(dejeuner)})` : ''}\n${recipeWhy(dejeuner) ? `💡 ${recipeWhy(dejeuner).split('.')[0]}.` : ''}` : 'Bowl complet protéines + légumes + céréales'}\n\n`;
  response += `🍵 GOÛTER :\n${gouter ? `✨ ${gouter.name}\n${recipeWhy(gouter) ? `💡 ${recipeWhy(gouter).split('.')[0]}.` : ''}` : 'Fruits + oléagineux'}\n\n`;
  response += `🌙 DÎNER :\n${diner ? `👩‍🍳 ${diner.name}${recipeTime(diner) ? ` (${recipeTime(diner)})` : ''}\n${recipeWhy(diner) ? `💡 ${recipeWhy(diner).split('.')[0]}.` : ''}` : 'Protéine légère + légumes + féculents complets'}\n\n`;
  response += `🧬 Tes hormones : ${nutrients.hormones}\n\n📊 Nutriments prioritaires : ${nutrients.priority.join(', ')}\n${nutrients.metabolism}`;

  return response;
}

// ===== RÉPONSE NUTRITION SPÉCIFIQUE =====
function generateNutrientResponse(nutrient, phase, ctx) {
  const phaseName = PHASE_LABELS[phase];
  const nutrients = PHASE_NUTRIENTS[phase];

  const NUTRIENT_FOODS = {
    fer: {
      foods: ['lentilles', 'épinards', 'viande rouge', 'tofu', 'pois chiches', 'graines de courge', 'quinoa', 'sardines', 'haricots rouges'],
      tip: 'Combine toujours avec de la vitamine C (citron, poivron, kiwi) pour doubler l\'absorption.',
      why: 'Le fer transporte l\'oxygène. En phase menstruelle tu en perds beaucoup.',
    },
    magnesium: {
      foods: ['chocolat noir 70%+', 'amandes', 'noix de cajou', 'banane', 'avocat', 'épinards', 'graines de courge', 'edamame'],
      tip: 'Le magnésium au coucher aide aussi le sommeil et réduit les crampes nocturnes.',
      why: 'Le magnésium régule 300+ réactions dans ton corps : humeur, muscles, sommeil, crampes.',
    },
    omega3: {
      foods: ['saumon', 'sardines', 'maquereau', 'graines de lin', 'graines de chia', 'noix', 'huile de colza'],
      tip: 'Vise 2-3 portions de poisson gras par semaine, ou une cuillère de graines de lin moulues par jour.',
      why: 'Les oméga-3 réduisent l\'inflammation, les crampes, et améliorent l\'humeur.',
    },
    zinc: {
      foods: ['graines de courge', 'pois chiches', 'noix de cajou', 'lentilles', 'crevettes', 'huîtres', 'fromage', 'œufs'],
      tip: 'Essentiel en phase folliculaire pour la maturation du follicule et la qualité de l\'ovulation.',
      why: 'Le zinc booste l\'immunité, aide à la production hormonale et à la beauté de la peau.',
    },
    vitamineb6: {
      foods: ['banane', 'avocat', 'dinde', 'poulet', 'saumon', 'patate douce', 'graines de tournesol', 'pistaches'],
      tip: 'Cruciale en phase lutéale — elle aide à convertir le tryptophane en sérotonine.',
      why: 'La vitamine B6 réduit l\'irritabilité, la rétention d\'eau et les sautes d\'humeur du PMS.',
    },
    antioxydants: {
      foods: ['fruits rouges', 'grenade', 'cacao cru', 'curcuma', 'thé vert matcha', 'légumes colorés', 'noix', 'graines de chia'],
      tip: 'Plus c\'est coloré, plus c\'est riche en antioxydants. Mange l\'arc-en-ciel !',
      why: 'Les antioxydants protègent tes cellules, réduisent l\'inflammation et améliorent ta peau.',
    },
    proteines: {
      foods: ['œufs', 'poulet', 'saumon', 'yaourt grec', 'lentilles', 'quinoa', 'tofu', 'pois chiches', 'graines de chanvre'],
      tip: 'Vise 1.2-1.6g de protéines par kg. Répartis-les sur tes 3 repas.',
      why: 'Les protéines soutiennent la production hormonale, la récupération musculaire et la satiété.',
    },
    tryptophane: {
      foods: ['dinde', 'banane', 'avoine', 'graines de courge', 'œufs', 'chocolat noir', 'noix de cajou', 'tofu'],
      tip: 'Combine avec des glucides complexes pour aider le tryptophane à atteindre le cerveau.',
      why: 'Le tryptophane est le précurseur de la sérotonine (bonheur) et de la mélatonine (sommeil).',
    },
  };

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
  const keyLabel = key === 'vitamineb6' ? 'vitamine B6' : key === 'omega3' ? 'oméga-3' : key;
  return `Les meilleurs aliments riches en ${keyLabel} pour ta phase ${phaseName} :\n\n${data.foods.map((f) => `• ${f}`).join('\n')}\n\n💡 ${data.tip}\n\n${data.why}\n\nEn phase ${phaseName}, tes nutriments prioritaires : ${nutrients.priority.join(', ')}.`;
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

// Détecte si c'est une boisson (pour adapter le verbe "manger" → "boire")
function isDrinkItem(food) {
  const drinks = ['vin', 'vin rouge', 'vin blanc', 'bière', 'alcool', 'café', 'thé', 'soda', 'jus', 'jus de fruit', 'smoothie', 'eau', 'tisane', 'infusion', 'latte', 'kombucha', 'lait'];
  return drinks.some(d => food.toLowerCase().includes(d) || d.includes(food.toLowerCase()));
}

// Génère une réponse dynamique pour "puis-je manger/boire X ?"
function generateFoodResponse(food, phase, ctx) {
  const advice = FOOD_ADVICE[phase];
  const filteredGood = filterFoodList(advice.good, ctx);
  const filteredOk = filterFoodList(advice.ok, ctx);
  const phaseName = PHASE_LABELS[phase];
  const qFood = food.toLowerCase();
  const verb = isDrinkItem(food) ? 'boire' : 'manger';
  const verbDu = isDrinkItem(food) ? 'boire du' : 'manger du';

  const isGood = filteredGood.some((f) => qFood.includes(f) || f.includes(qFood));
  const isOk = filteredOk.some((f) => qFood.includes(f) || f.includes(qFood));
  const isLimit = advice.limit.some((f) => qFood.includes(f) || f.includes(qFood));

  if (isGood) {
    return pickOne([
      `Carrément ! ${food.charAt(0).toUpperCase() + food.slice(1)} c'est un super choix en phase ${phaseName}. ${advice.why_good} Fonce 🌿`,
      `Oh oui, ${food} c'est parfait en ce moment ! ${advice.why_good} Tu fais bien d'en ${verb} 💛`,
      `Top choix ! ${food.charAt(0).toUpperCase() + food.slice(1)} c'est exactement ce dont ton corps a besoin en phase ${phaseName}. ${advice.why_good} 🌟`,
    ]);
  }

  if (isLimit) {
    const limitItem = advice.limit.find((f) => qFood.includes(f) || f.includes(qFood));
    const smartAlts = SMART_FOOD_ALTERNATIVES[limitItem] || SMART_FOOD_ALTERNATIVES[qFood] || null;

    if (smartAlts) {
      const altList = smartAlts.slice(0, 3).map((a) => `• ${a}`).join('\n');
      return `${food.charAt(0).toUpperCase() + food.slice(1)} en phase ${phaseName}... c'est pas interdit, mais c'est pas l'idéal. ${advice.why_limit}\n\nSi t'as cette envie, j'ai mieux :\n${altList}\n\nMême plaisir, meilleur pour ton corps. Et si tu craques quand même, zéro culpabilité 💛`;
    }

    return `${food.charAt(0).toUpperCase() + food.slice(1)} en phase ${phaseName}... c'est pas l'idéal. ${advice.why_limit}\n\nSi t'en as vraiment envie, fais-toi plaisir en petite quantité. Mais privilégie plutôt : ${filteredGood.slice(0, 3).join(', ')}.\n\nL'idée c'est de comprendre l'impact, pas de se priver 💛`;
  }

  if (isOk) {
    return `Oui, ${food} c'est tout à fait OK ! C'est pas ${isDrinkItem(food) ? 'la boisson la plus stratégique' : 'l\'aliment le plus stratégique'} en phase ${phaseName}, mais y'a aucun souci.\n\nPour optimiser, combine avec des aliments riches en ${phase === 'menstrual' ? 'fer et magnésium' : phase === 'luteal' ? 'magnésium et vitamine B6' : phase === 'ovulatory' ? 'fibres et antioxydants' : 'protéines et zinc'} 🌱`;
  }

  return `Bien sûr que tu peux ${verb} ${food} ! Rien n'est interdit — l'important c'est l'équilibre.\n\nEn phase ${phaseName}, ton corps a surtout besoin de :\n• ${filteredGood.slice(0, 3).join('\n• ')}\n\n${advice.why_good}\n\nFais-toi plaisir 💛`;
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
    return pickOne([
      `Oh oui, ${sport} c'est parfait en phase ${phaseName} ! Ton énergie est ${PHASE_ENERGY[phase]}. ${advice.why}\n\nFonce 🔥`,
      `${sport.charAt(0).toUpperCase() + sport.slice(1)} en ce moment ? Parfait ! ${advice.why} Vas-y à fond 💪`,
    ]);
  }

  if (isCaution) {
    const cautionItem = advice.caution.find((s) => qSport.includes(s) || s.includes(qSport));
    const smartAlts = SMART_SPORT_ALTERNATIVES[cautionItem] || SMART_SPORT_ALTERNATIVES[qSport] || null;

    if (smartAlts) {
      const altList = smartAlts.slice(0, 3).map((a) => `• ${a}`).join('\n');
      return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName}... c'est pas le meilleur timing.\n\n${advice.why}\n\nEssaie plutôt :\n${altList}\n\nMême esprit, adapté à ton corps. ${phase === 'menstrual' || phase === 'luteal' ? 'Tu pourras tout donner en phase folliculaire' : 'Tu pourras monter en puissance bientôt'} 💪`;
    }

    const alternatives = advice.great.slice(0, 3).join(', ');
    return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName}... je te recommande d'y aller doucement.\n\n${advice.why}\n\nSi ton corps dit oui, écoute-le. Sinon, essaie : ${alternatives}.\n\n${phase === 'menstrual' || phase === 'luteal' ? 'Tu y reviendras à fond en phase folliculaire' : 'Adapte juste l\'intensité'} 💪`;
  }

  if (isOk) {
    return `Oui, ${sport} c'est faisable en phase ${phaseName} ! ${advice.why}\n\nÉcoute ton corps et adapte l'intensité si besoin 🌟`;
  }

  return `${sport.charAt(0).toUpperCase() + sport.slice(1)} en phase ${phaseName} ? Ça dépend de l'intensité !\n\nTon énergie est ${PHASE_ENERGY[phase]} à J${ctx.currentDay}. ${advice.why}\n\nCe qui est top en ce moment : ${advice.great.slice(0, 3).join(', ')}.\n\nÉcoute ton corps — le meilleur sport c'est celui que tu fais avec plaisir 💛`;
}

// ===== GESTION DES SALUTATIONS, REMERCIEMENTS, SMALL TALK =====
const GREETINGS = [
  (ctx) => `Hey ${ctx.name} ! 💛 Comment tu te sens aujourd'hui ? Je suis là si tu as besoin de quoi que ce soit.`,
  (ctx) => `Coucou ${ctx.name} ! T'es en phase ${PHASE_LABELS[ctx.phase]} à J${ctx.currentDay}. Qu'est-ce que je peux faire pour toi ?`,
  (ctx) => `Salut ${ctx.name} ! 😊 Tu veux qu'on parle nutrition, sport, sommeil, ou autre chose ?`,
  (ctx) => `Hello ${ctx.name} 💛 Dis-moi tout, je suis toute ouïe !`,
];

const THANKS = [
  (ctx) => `Avec plaisir ${ctx.name} ! N'hésite pas si tu as d'autres questions 💛`,
  (ctx) => `De rien ! Je suis là pour ça 😊 Hésite pas à revenir.`,
  (ctx) => `Ravie d'avoir pu t'aider ${ctx.name} ! Prends soin de toi 💜`,
  (ctx) => `C'est normal 💛 Si tu as besoin de quoi que ce soit, je suis là !`,
];

const HOW_ARE_YOU = [
  (ctx) => `Moi ça va toujours 😊 Mais toi, comment tu te sens à J${ctx.currentDay} ? T'as de l'énergie, t'es fatiguée ? Dis-moi !`,
  (ctx) => `Super bien merci ! Et toi ${ctx.name} ? Tu veux qu'on fasse un petit point sur ta phase ?`,
  (ctx) => `Toujours en forme pour t'aider ! Et toi, quoi de neuf ? Comment tu gères ta phase ${PHASE_LABELS[ctx.phase]} ?`,
];

// Compteur global pour varier les intros
let _introCounter = 0;

// ===== SUIVI DES RECETTES PROPOSÉES =====
const _recentRecipes = [];
const MAX_RECENT = 10;

function trackRecipe(name) {
  if (!name) return;
  _recentRecipes.unshift(name);
  if (_recentRecipes.length > MAX_RECENT) _recentRecipes.length = MAX_RECENT;
}

function wasRecentlyProposed(name) {
  return _recentRecipes.includes(name);
}

// ===== DÉTECTION AUTOMATIQUE PAR HEURE =====
function detectMealTypeByTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return 'petit_dej';
  if (hour >= 11 && hour < 14) return 'dejeuner';
  if (hour >= 14 && hour < 17) return 'gouter';
  if (hour >= 17 && hour < 22) return 'diner';
  return 'snack';
}

// ===== RECHERCHE PAR INGRÉDIENTS =====
function findIngredientsList(question) {
  const match = question.match(/(?:j'?ai|avec|utiliser|dans mon frigo|il me reste)\s+(?:du |des |de la |de l'|le |la |les |un |une )?([\w\sàâéèêëïîôùûüç,']+)/i);
  if (!match) return null;
  const raw = match[1].replace(/\s+et\s+/g, ',').replace(/\s*,\s*/g, ',');
  const ingredients = raw.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 2);
  return ingredients.length > 0 ? ingredients : null;
}

function searchRecipesByIngredients(ingredients, phase, ctx) {
  const catalogPhase = CATALOG_RECIPES?.[phase];
  if (!catalogPhase) return null;

  let allRecipes = [];
  ['breakfast', 'lunch', 'dinner', 'snack'].forEach(key => {
    if (catalogPhase[key]) allRecipes.push(...catalogPhase[key]);
  });

  // Also search internal recipes
  const phaseRecipes = RECIPES[phase];
  ['petit_dej', 'dejeuner', 'diner', 'gouter'].forEach(key => {
    if (phaseRecipes[key]) allRecipes.push(...phaseRecipes[key]);
  });

  const scored = allRecipes.map(recipe => {
    const recipeText = [...(recipe.ingredients || [])].join(' ').toLowerCase();
    const matches = ingredients.filter(ing => recipeText.includes(ing));
    return { recipe, score: matches.length, matchedIngredients: matches };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

  return scored.length > 0 ? scored.slice(0, 3) : null;
}

// ===== DÉTECTION DE CUISINE =====
function detectCuisine(q) {
  if (q.match(/asiat|chinois|japonais|tha[ïi]|wok|sushi|ramen|noodle/i)) return 'asian';
  if (q.match(/italien|pasta|pizza|risotto|italie|pesto|bolognaise/i)) return 'italian';
  if (q.match(/mexicain|tacos|burrito|mexique|guacamole|fajita/i)) return 'mexican';
  if (q.match(/m[eé]diterran|grec|libanais|oriental|houmous|falafel/i)) return 'mediterranean';
  if (q.match(/indien|masala|tandoori|naan|inde|dal|curry indien/i)) return 'indian';
  if (q.match(/marocain|maroc|tajine|couscous|harira/i)) return 'moroccan';
  return null;
}

// ===== MÉMOIRE CONVERSATIONNELLE =====
function handleConversationMemory(question, history, phase, ctx) {
  if (!history || history.length < 2) return null;
  const q = question.toLowerCase();

  // Detect follow-up intent
  const isFollowUp = q.match(/^(oui|ouais|yes|ok|d'?accord|go|la premi[eè]re|la deuxi[eè]me|la troisi[eè]me|celle[- ]?l[aà]|donne[- ]?moi|d[eé]tails?|plus d'?infos?|la recette|comment (on fait|faire|pr[eé]parer)|ingr[eé]dients?|[eé]tapes?|montre|explique)/i);
  if (!isFollowUp) return null;

  // Find the last luna message with recipe suggestions
  const lastLunaMessages = history.filter(m => m.role === 'luna').slice(-3);

  for (const msg of lastLunaMessages.reverse()) {
    const content = msg.content;

    // Check if it contains recipe names (lines starting with 👩‍🍳 or ✨ or •)
    const recipeLines = content.match(/(?:👩‍🍳|✨)\s*(.+)/g);
    if (recipeLines && recipeLines.length > 0) {
      // User wants details on a recipe
      const cleanNames = recipeLines.map(l => l.replace(/(?:👩‍🍳|✨)\s*/, '').replace(/\s*\(.*\)/, '').trim());

      // Determine which recipe they want
      let targetName = cleanNames[0]; // default: first one
      if (q.match(/deuxi[eè]me|2[eè]?me|seconde/)) targetName = cleanNames[1] || cleanNames[0];
      if (q.match(/troisi[eè]me|3[eè]?me|derni[eè]re/)) targetName = cleanNames[cleanNames.length - 1] || cleanNames[0];

      // Search for the full recipe in catalog + internal
      const phaseName = PHASE_LABELS[phase];
      const nutrients = PHASE_NUTRIENTS[phase];

      // Search catalog
      const catalogPhase = CATALOG_RECIPES?.[phase];
      if (catalogPhase) {
        for (const mealKey of ['breakfast', 'lunch', 'dinner', 'snack']) {
          const recipes = catalogPhase[mealKey] || [];
          const found = recipes.find(r => r.name === targetName || r.name.includes(targetName) || targetName.includes(r.name));
          if (found) {
            return formatCatalogRecipe(found, phaseName, nutrients);
          }
        }
      }

      // Search internal
      const phaseRecipes = RECIPES[phase];
      for (const mealKey of ['petit_dej', 'dejeuner', 'diner', 'gouter', 'snack']) {
        const recipes = phaseRecipes[mealKey] || [];
        const found = recipes.find(r => r.name === targetName || r.name.includes(targetName) || targetName.includes(r.name));
        if (found && found.instructions) {
          return `Voilà la recette :\n\n👩‍🍳 ${found.name}\n⏱️ ${found.time}\n\n📝 Ingrédients :\n${found.ingredients.map(i => '• ' + i).join('\n')}\n\n👉 ${found.instructions}\n\n💡 ${found.why}`;
        }
      }

      // If we can't find the exact recipe, acknowledge
      return `Je n'ai pas retrouvé la recette exacte "${targetName}" mais je peux t'en proposer une autre ! Dis-moi quel type de repas tu veux (petit-déj, déjeuner, dîner, goûter) 💛`;
    }

    // Check if last message had topic-based suggestions (food advice etc.)
    if (content.includes('Dis-moi') || content.includes('dis-moi') || content.includes('Sur quoi')) {
      // User is responding to a prompt - let them ask freely
      return null;
    }
  }

  return null;
}

// Naturalise les réponses : varie l'intro, le ton, la structure
function naturalizeResponse(text, name) {
  if (!name || name === 'ma belle') return text;

  _introCounter++;
  const idx = _introCounter % 12;

  const namePattern = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},\\s*`, 'i');

  if (!namePattern.test(text)) return text;

  const rest = text.replace(namePattern, '');
  const capitalized = rest.charAt(0).toUpperCase() + rest.slice(1);

  switch (idx) {
    case 0: return `${name}, ${rest}`;
    case 1: return `Alors, ${rest}`;
    case 2: return `Hey ! ${capitalized}`;
    case 3: return capitalized; // Direct, pas de prénom
    case 4: return `${name} — ${rest}`;
    case 5: return `Bon, ${rest}`;
    case 6: return capitalized; // Direct
    case 7: return `Écoute, ${rest}`;
    case 8: return `${name}, ${rest}`;
    case 9: return `Allez, ${rest}`;
    case 10: return capitalized; // Direct
    case 11: return `OK ! ${capitalized}`;
    default: return capitalized;
  }
}

export function getLunaResponse(question, phase, userContext = {}, conversationHistory = []) {
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
    lastCheckInEnergy: userContext.energy,
    lastCheckInSymptoms: userContext.symptoms,
  };

  // ===== 0. SALUTATIONS, REMERCIEMENTS, SMALL TALK =====
  if (qOriginal.match(/^(salut|coucou|hello|hey|bonjour|bonsoir|yo|wesh|cc|bjr|bsr|hola|hi)\b/i) && qOriginal.length < 30) {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)](ctx);
  }
  if (qOriginal.match(/^(merci|thanks|thx|trop bien|super merci|ok merci|merci beaucoup|je te remercie)\b/i) && qOriginal.length < 40) {
    return THANKS[Math.floor(Math.random() * THANKS.length)](ctx);
  }
  if (qOriginal.match(/^(ça va|ca va|comment (tu vas|ça va|vas.?tu)|tu vas bien|la forme)/i) && qOriginal.length < 35) {
    return HOW_ARE_YOU[Math.floor(Math.random() * HOW_ARE_YOU.length)](ctx);
  }
  // Détresse / mal-être
  if (qOriginal.match(/en peux plus|en ai plus|aide.?moi|je vais pas bien|je vais mal|envie de mourir|suicid|je suis perdue|sais plus quoi faire|a bout|à bout|j.?arrive plus|au bout du rouleau|je craque/i)) {
    return pickOne([
      `${ctx.name}, je t'entends. Ce que tu ressens est valide et tu n'es pas seule 💜\n\nSi tu traverses un moment très difficile, parle à quelqu'un de confiance. Et si tu en as besoin, le 3114 (numéro national de prévention du suicide) est disponible 24h/24.\n\nJe suis là pour t'aider avec ton cycle, ta nutrition, ton bien-être — mais un vrai humain sera toujours mieux que moi pour les moments durs. Prends soin de toi ❤️`,
      `${ctx.name}, je suis là 💜 Tes émotions sont valides, et les fluctuations hormonales peuvent amplifier tout ce que tu ressens.\n\nN'hésite pas à en parler à quelqu'un de confiance. Et si ça va vraiment pas : 3114 (ligne d'écoute gratuite, 24h/24).\n\nMoi je peux t'aider sur ton cycle, ta nutrition, ton sport. Mais pour les moments difficiles, un humain sera toujours mieux. Tu comptes ❤️`,
    ]);
  }

  // Emoji-only messages
  if (question.trim().match(/^[\p{Emoji}\s]+$/u) && question.trim().length < 10) {
    return pickOne([
      `💛 Dis-moi ce dont tu as besoin ${ctx.name} ! Nutrition, sport, sommeil, humeur... je suis là.`,
      `😊 Tu veux qu'on parle de quoi ? Je suis toute à toi !`,
      `Hey ! T'as une question ? Je suis là pour t'aider 💜`,
    ]);
  }

  // ===== 0.5 MÉMOIRE CONVERSATIONNELLE =====
  const memoryResponse = handleConversationMemory(question, conversationHistory, phase, ctx);
  if (memoryResponse) return naturalizeResponse(memoryResponse, name);

  // ===== 1. BOISSONS (priorité haute — avant recettes) =====
  if (qOriginal.match(/boisson|quoi boire|que boire|boire.*aujourd|tisane|infusion/i) && !qOriginal.match(/manger|repas|recette|cuisiner/i)) {
    const raw = responses['boisson'] ? responses['boisson'](ctx) : responses['default'](ctx);
    return naturalizeResponse(raw, name);
  }

  // ===== 1.5 RECHERCHE PAR INGRÉDIENTS =====
  const ingredientPattern = qOriginal.match(/(?:j'?ai|avec|il me reste|utiliser)\s+/i);
  if (ingredientPattern && !qOriginal.match(/mal|douleur|problème|pas d'énergie/i)) {
    const ingredients = findIngredientsList(qOriginal);
    if (ingredients && ingredients.length > 0) {
      const results = searchRecipesByIngredients(ingredients, phase, ctx);
      if (results && results.length > 0) {
        const phaseName = PHASE_LABELS[phase];
        let response = `Avec ${ingredients.join(', ')}, voilà ce que je te propose pour ta phase ${phaseName} :\n\n`;
        results.forEach((r, i) => {
          const recipe = r.recipe;
          const time = recipe.time || recipe.prepTime || '';
          response += `${i + 1}. 👩‍🍳 ${recipe.name}${time ? ` (${time})` : ''}\n`;
          response += `   ✅ Match : ${r.matchedIngredients.join(', ')}\n`;
          if (recipe.why || recipe.whyThisPhase) response += `   💡 ${(recipe.why || recipe.whyThisPhase).split('.')[0]}.\n`;
          response += '\n';
        });
        response += `Dis-moi laquelle te tente et je te donne la recette complète 💛`;
        return naturalizeResponse(response, name);
      }
    }
  }

  // ===== 2. NUTRITION & RECETTES =====
  const mealType = detectMealType(qOriginal) || (qOriginal.match(/recette|manger|cuisiner|quoi.*manger|qu'?est.?ce (que |qu'?)?je mange/i) && !qOriginal.match(/soir|midi|matin|goûter|snack|petit/i) ? detectMealTypeByTime() : null);
  const diet = detectDietPreference(qOriginal);
  const cuisine = detectCuisine(qOriginal);

  const profileDiet = (() => {
    const prefs = userContext.dietPreferences || [];
    if (prefs.includes('Végane')) return 'vegan';
    if (prefs.includes('Végétarienne')) return 'vegetarien';
    if (prefs.includes('Sans gluten')) return 'sans_gluten';
    if (prefs.includes('Sans lactose')) return 'sans_lactose';
    return null;
  })();
  const effectiveDiet = diet || profileDiet;
  const dietIntro = getDietLabel(ctx) ? `\n(Adapté à ton alimentation ${getDietLabel(ctx)})` : '';
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
    // Cuisine filter
    if (cuisine) {
      const catalogPool = getCatalogRecipes(phase, mealType, ctx);
      const cuisineFiltered = catalogPool.filter(r => {
        const tags = (r.tags || []).join(' ').toLowerCase();
        const recipeCuisine = (r.cuisine || '').toLowerCase();
        return recipeCuisine.includes(cuisine) || tags.includes(cuisine);
      });
      if (cuisineFiltered.length > 0) {
        const recipe = cuisineFiltered[Math.floor(Math.random() * cuisineFiltered.length)];
        trackRecipe(recipe.name);
        const phaseName = PHASE_LABELS[phase];
        const nutrients = PHASE_NUTRIENTS[phase];
        const raw = formatCatalogRecipe(recipe, phaseName, nutrients);
        return naturalizeResponse(raw + dietIntro, name);
      }
    }
    const raw = generateRecipeResponse(phase, mealType, effectiveDiet, ctx);
    if (raw) return naturalizeResponse(raw + dietIntro, name);
  }

  // Question nutriment spécifique
  if (isNutrientQuestion) {
    const raw = generateNutrientResponse(qOriginal, phase, ctx);
    if (raw) return naturalizeResponse(raw + dietIntro, name);
  }

  // Question régime alimentaire
  if (isDietQuestion) {
    const detectedDiet = detectDietPreference(qOriginal) || profileDiet;
    const phaseName = PHASE_LABELS[phase];
    const nutrients = PHASE_NUTRIENTS[phase];
    const phaseRecipes = RECIPES[phase];

    const allRecipes = [...(phaseRecipes.petit_dej || []), ...(phaseRecipes.dejeuner || []), ...(phaseRecipes.diner || []), ...(phaseRecipes.gouter || [])];
    const filtered = detectedDiet ? filterRecipesByDiet(allRecipes, detectedDiet) : allRecipes;
    const dietLabel = detectedDiet === 'vegan' ? 'vegan 🌱' : detectedDiet === 'vegetarien' ? 'végétarienne 🥚' : detectedDiet === 'sans_gluten' ? 'sans gluten' : detectedDiet === 'sans_lactose' ? 'sans lactose' : '';

    const picks = filtered.sort(() => Math.random() - 0.5).slice(0, 3);
    let raw = `En phase ${phaseName}${dietLabel ? ` avec une alimentation ${dietLabel}` : ''}, voilà ce que je te recommande :\n\n`;
    raw += `${nutrients.hormones}\n\nNutriments prioritaires : ${nutrients.priority.join(', ')}\n\n`;
    raw += `Idées de recettes adaptées :\n`;
    picks.forEach((r) => {
      raw += `\n• ${r.name}${r.time ? ` (${r.time})` : ''}\n  💡 ${r.why ? r.why.split('.')[0] + '.' : ''}`;
    });
    raw += `\n\n${nutrients.metabolism}\n\nDis-moi si tu veux la recette détaillée d'une de ces idées 💛`;
    return naturalizeResponse(raw, name);
  }

  // ===== 2. Question "puis-je manger/faire X ?" =====
  const canI = isCanIQuestion(qOriginal);
  const detectedFood = findFood(qOriginal);
  const detectedSport = findSport(qOriginal);

  if (detectedFood && (canI || qOriginal.match(/manger|boire|prendre|consommer|cuisiner|préparer/))) {
    const raw = generateFoodResponse(detectedFood, phase, ctx);
    return naturalizeResponse(raw, name);
  }

  if (detectedSport && (canI || qOriginal.match(/faire|pratiquer|aller|commencer|continuer|essayer/))) {
    const raw = generateSportResponse(detectedSport, phase, ctx);
    return naturalizeResponse(raw, name);
  }

  // ===== 3. Réponses prédéfinies par mot-clé (PRIORITÉ REVUE) =====
  let bestMatch = null;
  let bestScore = 0;
  let bestPriority = 999;

  for (let i = 0; i < KEYWORD_MAP.length; i++) {
    const mapping = KEYWORD_MAP[i];
    let score = 0;
    for (const key of mapping.keys) {
      const normalizedKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (q.includes(normalizedKey) || qOriginal.includes(key)) {
        score++;
      }
    }
    // À score égal, prendre le mapping le plus haut dans la liste (plus spécifique)
    if (score > bestScore || (score === bestScore && score > 0 && i < bestPriority)) {
      bestScore = score;
      bestMatch = mapping.response;
      bestPriority = i;
    }
  }

  if (bestMatch && bestScore > 0) {
    const responseFn = responses[bestMatch] || responses['default'];
    const raw = responseFn(ctx);
    return naturalizeResponse(raw, name);
  }

  // ===== 4. Détection de sujet général (fallback intelligent) =====
  if (qOriginal.match(/manger|aliment|nourri|repas|cuisine|recette|plat|petit.?d[eé]j|d[eé]jeuner|d[iî]ner|go[uû]ter|snack|grigno|faim|nutrition|food/)) {
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
      ? `Ta libido est naturellement au plus haut en phase ovulatoire ! L'œstrogène + la testostérone boostent le désir. Profite de cette énergie ✨`
      : phase === 'menstrual'
      ? `En phase menstruelle, la libido est souvent plus basse — c'est hormonal. Mais certaines femmes ont quand même du désir (les orgasmes peuvent même soulager les crampes !). Écoute ton corps 💜`
      : phase === 'follicular'
      ? `Ta libido remonte progressivement avec l'œstrogène en phase folliculaire. Le désir va augmenter jusqu'à l'ovulation. Ton corps se prépare 🌸`
      : `En phase lutéale, la libido peut baisser à cause de la progestérone. C'est physiologique, pas un problème. Ça reviendra en phase folliculaire 💛`;
    return naturalizeResponse(`${ctx.name}, ${libidoResponse}`, name);
  }

  if (qOriginal.match(/travail|boulot|productiv|concentr|m[eé]moire|cerveau|cr[eé]ativ|r[eé]union|pr[eé]sentation|examen/)) {
    const workResponse = phase === 'ovulatory'
      ? `Tu es en phase ovulatoire — c'est ton PIC de productivité ! Capacités verbales, mémoire, confiance au sommet. C'est LE moment pour les présentations, brainstormings, négociations. Profite de cette fenêtre 👑`
      : phase === 'follicular'
      ? `Phase folliculaire = créativité et motivation en hausse ! Parfait pour lancer de nouveaux projets, apprendre, planifier. Ton cerveau est en mode construction 🧠✨`
      : phase === 'menstrual'
      ? `En phase menstruelle, ta concentration peut être réduite — c'est normal. Privilégie les tâches simples, sessions courtes (25 min + pause), introspection et bilan. C'est le moment de réfléchir plutôt que d'agir 🌱`
      : `En phase lutéale, la concentration fluctue avec la progestérone. Travaille sur tes forces, sessions courtes avec pauses, finis ce que t'as commencé plutôt que de commencer du neuf. Garde les gros projets pour la phase folliculaire 📋`;
    return naturalizeResponse(`${ctx.name}, ${workResponse}`, name);
  }

  // ===== 5. Hors sujet détecté =====
  if (qOriginal.match(/capital|président|météo|weather|quelle heure|math|calcul|histoire|géograph|politique|actualité|film|série|musique|chanson|jeu vidéo|recette de cuisine non/i)) {
    return pickOne([
      `${ctx.name}, je suis spécialisée dans ton cycle, ta nutrition et ton bien-être 😊 Sur ces sujets-là je suis imbattable !\n\nTu veux qu'on parle de ce que tu manges, de ton sport, de ton sommeil ou de comment tu te sens ?`,
      `Ah ça c'est pas trop mon domaine 😅 Moi je suis calée sur tout ce qui touche à ton cycle, tes hormones, ta nutrition et ton bien-être.\n\nPose-moi une question là-dessus et je t'aide avec plaisir 💛`,
    ]);
  }

  // ===== 6. Réponse par défaut — conversationnelle et utile =====
  // Add check-in context if available
  let checkInPrefix = '';
  if (ctx.lastCheckInEnergy && ctx.lastCheckInEnergy < 40) {
    checkInPrefix = `Je vois que ton énergie est à ${ctx.lastCheckInEnergy} aujourd'hui — prends soin de toi. `;
  } else if (ctx.lastCheckInEnergy && ctx.lastCheckInEnergy > 75) {
    checkInPrefix = `Ton énergie est à ${ctx.lastCheckInEnergy} aujourd'hui, super ! `;
  }
  if (ctx.lastCheckInSymptoms && ctx.lastCheckInSymptoms.length > 0) {
    const symptomList = ctx.lastCheckInSymptoms.slice(0, 3).join(', ');
    checkInPrefix += `Tu as noté ${symptomList} dans ton check-in. `;
  }
  const raw = responses['default'](ctx);
  return naturalizeResponse(checkInPrefix + raw, name);
}
