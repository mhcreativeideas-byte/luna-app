export const CHAT_SUGGESTIONS = [
  'Qu\'est-ce que je devrais manger aujourd\'hui ?',
  'Mon corps a besoin de quoi en ce moment ?',
  'Quel mouvement me ferait du bien ?',
  'Donne-moi une recette réconfortante',
  'Comment mieux dormir ce soir ?',
];

export const CHAT_RESPONSES = {
  menstrual: {
    'manger': 'Ton corps est en plein renouvellement — il perd du fer et a besoin de récupérer. Mise sur les aliments anti-inflammatoires : curcuma, gingembre, saumon. Complète avec des sources de fer : lentilles, épinards, viande rouge. Et surtout, du repos. Ce n\'est pas de la paresse, c\'est de l\'intelligence corporelle.',
    'sport': 'Ton énergie est basse, et ton corps te demande de la douceur. Yoga restauratif, stretching, marche lente — tout ce qui t\'apaise sans te vider. Si tu n\'as pas envie de bouger, même 10 minutes de marche suffisent. Zéro culpabilité.',
    'énergie': 'Tes hormones sont au plus bas — c\'est pour ça que tu te sens à plat. C\'est temporaire et c\'est normal. Magnésium, sommeil, hydratation et mouvements doux. Dans quelques jours, la montée d\'énergie commence.',
    'recette': 'Un bowl lentilles-épinards-saumon avec sauce curcuma. Riche en fer et oméga-3, c\'est exactement ce dont ton corps a besoin. Ou un porridge aux fruits rouges et chocolat noir si tu veux du réconfort. Tu mérites les deux.',
    'routine': 'Ce soir, offre-toi un vrai moment : dernier repas léger 2h avant le coucher, bain chaud ou bouillotte sur le ventre, tisane camomille-gingembre, magnésium. Ton corps se régénère pendant le sommeil — aide-le.',
    'default': 'Ton corps travaille dur pour se renouveler en ce moment. Le mot d\'ordre : douceur. Nourris-toi bien — fer, magnésium, oméga-3 — et accorde-toi le repos dont tu as besoin. Si tu fais moins que d\'habitude, ce n\'est pas de la faiblesse. C\'est de l\'écoute.',
  },
  follicular: {
    'manger': 'L\'énergie monte et ton corps a besoin de carburant pour suivre. Protéines pour construire — poulet, œufs, quinoa — zinc et probiotiques pour le système immunitaire. C\'est le moment des smoothies bowl protéinés et des repas colorés.',
    'sport': 'Ton énergie remonte et tes muscles récupèrent plus vite grâce à l\'œstrogène. C\'est LE moment pour te challenger : HIIT, musculation, cardio intense, danse... Tout ce qui te fait vibrer. Ton corps est prêt à en donner plus — fais-lui confiance.',
    'énergie': 'L\'œstrogène remonte et avec elle, ta motivation et ta créativité. Cette vague d\'énergie est un cadeau — surfe dessus. Lève-toi tôt, expose-toi à la lumière naturelle, et lance-toi dans ce qui te tient à cœur.',
    'recette': 'Smoothie bowl protéiné au petit-déjeuner, poulet quinoa-brocoli au déjeuner, sauté de tofu aux légumes fermentés ce soir. Énergie et reconstruction, ton corps va adorer.',
    'routine': 'Profite de cette énergie pour recaler ton rythme de sommeil. Dîner protéiné, écrans éteints 1h avant, lecture inspirante, coucher à heure fixe. Demain tu attaques forte.',
    'default': 'Tu entres dans ta phase la plus productive. L\'œstrogène remonte, tu es plus motivée, créative et énergique. C\'est le moment de lancer des projets, de te challenger au sport et de profiter pleinement de cette montée en puissance.',
  },
  ovulatory: {
    'manger': 'Ton corps gère un pic hormonal — aide-le avec des fibres et des antioxydants. Poke bowl, salades colorées, fruits frais, graines de courge. Léger, frais et vibrant. Comme toi cette semaine.',
    'sport': 'Tu es au sommet. Force, endurance, coordination — tout est à son maximum. C\'est le moment pour les records personnels, les cours collectifs haute énergie, la boxe ou les sprints. Ton corps est prêt pour l\'excellence — saisis cette fenêtre.',
    'énergie': 'Ton énergie est naturellement au maximum. Tu te sens invincible — et c\'est un peu vrai. Juste une chose : ne néglige pas le sommeil. Même au sommet, ton corps a besoin de récupérer.',
    'recette': 'Açaí bowl ce matin, poke bowl saumon-mangue-edamame au déjeuner, grande salade colorée avec ceviche le soir. Frais, léger et plein de vitalité.',
    'routine': 'Ce soir : méditation courte pour canaliser toute cette belle énergie, eau détox concombre-menthe, et couche-toi à une heure raisonnable même si tu as l\'impression de pouvoir veiller. Ton futur toi te remerciera.',
    'default': 'Tu rayonnes — et ce n\'est pas qu\'une impression. Tes capacités de communication, ta confiance et tes performances sont à leur maximum. C\'est LE moment pour les présentations, les rendez-vous importants et les défis sportifs. Profite de ce pic.',
  },
  luteal: {
    'manger': 'C\'est important de bien nourrir ton corps en ce moment. La progestérone augmente ton métabolisme — tu as besoin de 200 à 300 calories de plus par jour, et c\'est normal. Privilégie les glucides complexes (patate douce, avoine), le magnésium (chocolat noir, amandes) et la vitamine B6 (banane, avocat). Fais-toi plaisir, ton corps te remerciera.',
    'sport': 'Commence la semaine avec de la muscu modérée ou de la natation, puis baisse progressivement vers le yoga, le Pilates et la marche. En fin de phase, privilégie le foam rolling et les étirements. Des mouvements qui apaisent plutôt qu\'épuisent.',
    'énergie': 'La progestérone te rend somnolente et c\'est parfaitement normal. Magnésium, bon sommeil, mouvement doux et alimentation riche. Ce n\'est pas un manque de volonté, c\'est de la biologie. Tiens bon, la montée d\'énergie folliculaire approche.',
    'recette': 'Pancakes avoine-banane ce matin, curry doux de pois chiches au déjeuner, gratin de légumes au fromage ce soir. Du réconfort et des nutriments anti-SPM — exactement ce qu\'il te faut.',
    'routine': 'La progestérone te rend somnolente mais peut fragmenter ton sommeil — classique en fin de cycle. Ce soir, essaie ça : tisane de camomille 45 min avant le coucher, pas d\'écran après 21h, chambre à 18-19°C, et si tu as du magnésium en complément, c\'est le moment. Ton corps se prépare, aide-le à se reposer.',
    'default': 'Ton corps te demande de la douceur en ce moment, et il a raison. Ton métabolisme est plus élevé — manger plus est normal. La progestérone te ralentit — c\'est biologique, pas un manque de volonté. Et tes émotions sont amplifiées — utilise-les comme une boussole. Prends soin de toi, c\'est la meilleure chose que tu puisses faire.',
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
