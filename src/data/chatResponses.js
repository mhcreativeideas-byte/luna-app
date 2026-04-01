export const CHAT_SUGGESTIONS = [
  'Quoi manger aujourd\'hui ?',
  'De quoi mon corps a besoin ?',
  'Quel sport est adapté en ce moment ?',
  'Une recette adaptée à ma phase',
  'Comment mieux dormir ce soir ?',
];

export const CHAT_RESPONSES = {
  menstrual: {
    'manger': 'Pendant tes règles, tu perds du fer — c\'est la priorité. Lentilles, épinards, viande rouge, tofu. Ajoute de la vitamine C (agrumes, poivrons) pour mieux absorber le fer. Côté anti-inflammatoires : curcuma, gingembre, saumon, sardines. Le chocolat noir 70%+ est pertinent aussi — il apporte du magnésium qui aide contre les crampes.',
    'sport': 'Ton énergie est à son plus bas, c\'est hormonal. Yoga restauratif, stretching, marche lente — l\'idée c\'est de bouger sans te vider. Si un jour tu ne sens pas, même 10 minutes de marche comptent. L\'important c\'est de ne pas forcer — tu reprendras l\'intensité en phase folliculaire.',
    'énergie': 'Œstrogène et progestérone sont au plancher — la fatigue est physiologique. Trois leviers : magnésium (amandes, chocolat noir, bananes), hydratation (1,5-2L/jour), et sommeil (vise 8-9h). Ça remonte dans quelques jours quand l\'œstrogène commence à repartir.',
    'recette': 'Bowl lentilles-épinards-saumon, sauce curcuma-citron. Riche en fer, oméga-3 et anti-inflammatoires — exactement ce qu\'il te faut. Option sucrée : porridge avoine-banane-chocolat noir avec graines de lin. Magnésium + fibres + sérotonine.',
    'routine': 'Dernier repas 2h avant le coucher, léger. Bouillotte sur le ventre si crampes. Tisane camomille ou gingembre. Magnésium si tu en as. Chambre à 18-19°C. Position fœtale si douleurs abdominales — ça réduit la pression.',
    'default': 'Tu es en phase menstruelle. Tes hormones sont au plus bas, ce qui explique la fatigue et la baisse d\'énergie. Priorités : fer (lentilles, épinards), magnésium (chocolat noir, amandes), oméga-3 (saumon, sardines). Côté sport : doux uniquement. Côté mental : c\'est normal de ralentir. C\'est pas de la faiblesse, c\'est ton corps qui se régénère.',
  },
  follicular: {
    'manger': 'L\'œstrogène remonte — ton corps est en mode construction. Il a besoin de protéines : poulet, œufs, quinoa, légumineuses. Ajoute du zinc (graines de courge, pois chiches) et des probiotiques (yaourt, kéfir, kimchi). C\'est le moment des repas riches et variés.',
    'sport': 'Ton œstrogène remonte = meilleure récupération musculaire. C\'est ta meilleure fenêtre pour te challenger. HIIT, musculation, cardio intense, danse, escalade — ton corps est prêt. Tu vas récupérer plus vite qu\'à n\'importe quel autre moment du cycle.',
    'énergie': 'L\'œstrogène remonte progressivement et emmène avec elle ta motivation, ta créativité et ton énergie. Expose-toi à la lumière naturelle le matin — ça amplifie l\'effet. C\'est le moment de lancer ce que tu repousses depuis un moment.',
    'recette': 'Smoothie bowl protéiné : banane, beurre de cacahuète, lait d\'amande, granola, graines de chia. Déjeuner : quinoa-poulet-brocoli-avocat. Dîner : sauté de tofu, légumes croquants, kimchi. Construction + énergie.',
    'routine': 'Ton sommeil s\'améliore naturellement avec la montée d\'œstrogène. Profites-en pour recaler ton rythme : coucher à heure fixe, lever tôt, lumière naturelle le matin. C\'est maintenant que les bonnes habitudes se mettent en place.',
    'default': 'Phase folliculaire — ton énergie remonte. L\'œstrogène augmente progressivement : meilleure récupération, plus de motivation, créativité en hausse. C\'est TA fenêtre pour te challenger au sport, lancer des projets, tester des choses nouvelles. Ton corps est dans sa meilleure phase de performance — utilise-la.',
  },
  ovulatory: {
    'manger': 'Pic hormonal = ton corps a besoin de fibres pour éliminer l\'excès d\'œstrogène. Légumes verts, céréales complètes, graines. Antioxydants : fruits rouges, légumes colorés. Hydrate-toi bien. Pas besoin de manger plus — ton métabolisme n\'a pas changé.',
    'sport': 'Ton corps est à son pic de performance. Force, endurance, coordination, récupération — tout est au max. C\'est maintenant que tu bats tes records. HIIT, sprint, muscu lourde, boxe — fonce. Seul point d\'attention : tes ligaments sont plus lâches, échauffe-toi bien.',
    'énergie': 'Œstrogène au max + montée de testostérone = tu es au sommet. Tes capacités verbales, ta confiance et tes performances physiques sont à leur meilleur niveau du mois. Un conseil : ne néglige pas le sommeil sous prétexte que tu te sens bien.',
    'recette': 'Açaí bowl ce matin. Poke bowl saumon-mangue-edamame au déjeuner. Salade composée ceviche le soir. Frais, léger, riche en fibres et antioxydants. Parfait pour cette phase.',
    'routine': 'Tu as beaucoup d\'énergie mais ton corps a quand même besoin de récupérer. Méditation courte pour redescendre, eau détox concombre-menthe, coucher avant minuit. Protège ton sommeil — la descente d\'énergie arrive bientôt.',
    'default': 'Phase ovulatoire — tu es à ton pic. Œstrogène au max, testostérone en hausse. Concrètement : performances physiques au sommet, capacités verbales boostées, confiance en hausse. C\'est le moment pour les présentations, les négociations, les records sportifs. Profite de cette fenêtre — elle dure 2-3 jours.',
  },
  luteal: {
    'manger': 'Ton métabolisme augmente de 10-20% — tu as besoin de 200 à 300 calories de plus par jour. C\'est un fait physiologique, pas une excuse. Glucides complexes : patate douce, avoine, riz complet. Magnésium : chocolat noir, amandes, noix. Vitamine B6 : banane, avocat, volaille. Les envies de sucre ? C\'est ta sérotonine qui baisse — les glucides complexes aident.',
    'sport': 'Première moitié de la phase : muscu modérée, natation, vélo. Deuxième moitié : baisse vers le yoga, Pilates, marche. Ton corps récupère moins bien — adapte l\'intensité. Le foam rolling et les étirements deviennent tes meilleurs alliés.',
    'énergie': 'La progestérone augmente — elle a un effet sédatif naturel. Ta température corporelle monte aussi, ce qui peut fragmenter le sommeil. Magnésium le soir, pas de café après 14h, routine de coucher stricte. C\'est pas un manque de motivation — c\'est de la biochimie.',
    'recette': 'Pancakes avoine-banane-cannelle au petit-déj. Curry doux de pois chiches-patate douce au déjeuner. Gratin de légumes au fromage le soir. Réconfortant ET nutritif — magnésium, B6, glucides complexes.',
    'routine': 'La progestérone te rend somnolente mais peut fragmenter ton sommeil. Solutions : tisane camomille 45 min avant, pas d\'écran après 21h, chambre à 18-19°C. Si tu as du magnésium en complément, prends-le au coucher. Routine stricte = meilleur sommeil en phase lutéale.',
    'default': 'Phase lutéale — ton corps change de mode. Métabolisme en hausse (+10-20%), énergie en baisse, émotions amplifiées par la progestérone. Concrètement : mange plus (c\'est normal), baisse l\'intensité sportive progressivement, et priorise le sommeil. Les envies de sucre sont biologiques — ta sérotonine baisse. Les glucides complexes aident.',
  },
};

export function getLunaResponse(question, phase) {
  const q = question.toLowerCase();
  const responses = CHAT_RESPONSES[phase] || CHAT_RESPONSES.follicular;

  if (q.includes('manger') || q.includes('aliment') || q.includes('nourrir') || q.includes('faim') || q.includes('cuisine') || q.includes('besoin')) {
    return responses['manger'];
  }
  if (q.includes('sport') || q.includes('exercice') || q.includes('bouger') || q.includes('entraîn') || q.includes('fitness') || q.includes('mouvement')) {
    return responses['sport'];
  }
  if (q.includes('énergie') || q.includes('fatigue') || q.includes('fatiguée') || q.includes('booster') || q.includes('force')) {
    return responses['énergie'];
  }
  if (q.includes('recette') || q.includes('plat') || q.includes('repas') || q.includes('menu') || q.includes('réconfort')) {
    return responses['recette'];
  }
  if (q.includes('soir') || q.includes('routine') || q.includes('sommeil') || q.includes('dormir') || q.includes('coucher')) {
    return responses['routine'];
  }
  return responses['default'];
}
