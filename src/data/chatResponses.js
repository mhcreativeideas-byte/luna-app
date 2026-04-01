export const CHAT_SUGGESTIONS = [
  'Quoi manger pour me sentir mieux ?',
  'Quel sport faire aujourd\'hui ?',
  'Comment booster mon énergie ?',
  'Recette du jour',
  'Routine du soir',
];

export const CHAT_RESPONSES = {
  menstrual: {
    'manger': 'En phase menstruelle, ton corps a besoin de fer et d\'anti-inflammatoires. Privilégie les lentilles, épinards, saumon et chocolat noir. Un golden latte au curcuma fera des merveilles pour les crampes ! 🍫',
    'sport': 'Écoute ton corps avant tout. Le yoga doux, le stretching et la marche lente sont parfaits. Si tu n\'as pas envie de bouger, même 10 minutes de marche suffisent. Zéro culpabilité. 🧘',
    'énergie': 'Ton énergie est basse et c\'est normal — tes hormones sont au plancher. Magnésium, sommeil, hydratation et mouvements doux. Dans quelques jours, ça remonte ! 💜',
    'recette': 'Je te propose un bowl lentilles-épinards-saumon avec sauce curcuma. Riche en fer et oméga-3, parfait pour tes règles. Ou un porridge aux fruits rouges et chocolat noir si tu veux du réconfort ! 🍲',
    'routine': 'Ce soir : dernier repas léger 2h avant, bain chaud ou bouillotte, tisane camomille-gingembre, magnésium, et au lit tôt. Ton corps se régénère pendant le sommeil. 🌙',
    'default': 'En phase menstruelle, le mot d\'ordre c\'est DOUCEUR. Ton corps travaille dur pour se renouveler. Repose-toi, nourris-toi bien (fer, magnésium, oméga-3) et surtout : zéro culpabilité si tu fais moins que d\'habitude. C\'est de l\'intelligence, pas de la paresse. 💜',
  },
  follicular: {
    'manger': 'L\'énergie monte ! Ton corps a besoin de protéines pour construire (poulet, œufs, quinoa), de zinc et de probiotiques. C\'est le moment pour les smoothies bowl protéinés et les repas colorés ! 🥗',
    'sport': 'Go go go ! C\'est ta meilleure période pour le cardio, la muscu et les défis. HIIT, course, danse, escalade — ton corps récupère plus vite grâce à l\'œstrogène. Challenge-toi ! 🏃‍♀️',
    'énergie': 'Ton œstrogène remonte et avec lui ton énergie, ta motivation et ta créativité. Profite de cette vague ! Lève-toi tôt, expose-toi à la lumière naturelle, et lance-toi dans ce qui te tient à cœur. ☀️',
    'recette': 'Smoothie bowl protéiné ce matin (banane, beurre de cacahuète, protéine, granola), poulet quinoa-brocoli au déj, et sauté de tofu aux légumes fermentés ce soir. Énergie et construction ! 💪',
    'routine': 'Ce soir : profite de l\'énergie pour recaler ton rythme. Dîner protéiné, pas d\'écrans 1h avant, lecture inspirante, et coucher à heure fixe. Demain tu attaques forte ! 🌿',
    'default': 'Phase folliculaire = ta meilleure amie ! L\'œstrogène remonte, tu es plus motivée, créative et énergique. C\'est le moment de lancer des projets, te challenger au sport et profiter de cette vague d\'énergie. Surfe dessus ! 🌿',
  },
  ovulatory: {
    'manger': 'Ton corps a besoin de fibres et antioxydants pour gérer le pic hormonal. Poke bowl, salades colorées, fruits frais, graines de courge. Léger mais nutritif ! ☀️',
    'sport': 'Tu es au MAX ! Force, endurance, coordination — tout est au sommet. C\'est le moment pour les PR, les cours collectifs haute énergie, la boxe ou les sprints. Attention à bien t\'échauffer. 🥊',
    'énergie': 'Ton énergie est au sommet naturellement ! Attention juste à ne pas accumuler de dette de sommeil. Tu te sens invincible mais ton corps a quand même besoin de repos. ⚡',
    'recette': 'Açaí bowl ce matin, poke bowl saumon-mangue-edamame au déj, et grande salade colorée avec ceviche le soir. Frais, léger et vitaminé ! 🥗',
    'routine': 'Ce soir : méditation courte pour canaliser l\'énergie, eau détox concombre-menthe, et couche-toi même si tu as l\'impression de pouvoir veiller. Ton corps en a besoin. ☀️',
    'default': 'Phase ovulatoire = tu rayonnes ! Tes capacités de communication, ta confiance et tes performances sportives sont au max. C\'est LE moment pour les présentations, les rendez-vous importants et les records sportifs. Profite de ce pic ! ☀️',
  },
  luteal: {
    'manger': 'Ton métabolisme augmente de 10-20%, donc manger plus est NORMAL. Magnésium (chocolat noir, noix), glucides complexes (patate douce, avoine) et vitamine B6 (bananes). Tes envies de sucre sont biologiques, pas un manque de volonté. 🍫',
    'sport': 'Commence la semaine avec de la muscu modérée ou de la natation, puis baisse progressivement vers le yoga, le Pilates et la marche. En fin de phase, foam rolling et étirements. 🧘',
    'énergie': 'La progestérone te rend somnolente et c\'est normal. Magnésium, bon sommeil, mouvement doux et alimentation riche. Dans quelques jours tu retrouves la montée d\'énergie folliculaire. Tiens bon ! 🍂',
    'recette': 'Pancakes avoine-banane ce matin, curry doux de pois chiches au déj, et gratin de légumes au fromage ce soir. Réconfort et nutriments anti-SPM ! 🍲',
    'routine': 'Ce soir : tisane magnésium ou lait d\'or, pas d\'écrans 1h avant (la lumière bleue est encore plus perturbante en lutéale), journal de gratitude, et au lit tôt. Routine stricte = meilleur sommeil. 🌙',
    'default': 'Phase lutéale = le moment d\'être DOUCE avec toi-même. Ton métabolisme est plus élevé (manger plus est normal !), la progestérone te ralentit (c\'est biologique, pas un manque de volonté), et tes émotions sont amplifiées. Prends soin de toi, c\'est la meilleure chose que tu puisses faire. 🍂',
  },
};

export function getLunaResponse(question, phase) {
  const q = question.toLowerCase();
  const responses = CHAT_RESPONSES[phase] || CHAT_RESPONSES.follicular;

  if (q.includes('manger') || q.includes('aliment') || q.includes('nourrir') || q.includes('faim') || q.includes('cuisine')) {
    return responses['manger'];
  }
  if (q.includes('sport') || q.includes('exercice') || q.includes('bouger') || q.includes('entraîn') || q.includes('fitness')) {
    return responses['sport'];
  }
  if (q.includes('énergie') || q.includes('fatigue') || q.includes('fatiguée') || q.includes('booster') || q.includes('force')) {
    return responses['énergie'];
  }
  if (q.includes('recette') || q.includes('plat') || q.includes('repas') || q.includes('menu')) {
    return responses['recette'];
  }
  if (q.includes('soir') || q.includes('routine') || q.includes('sommeil') || q.includes('dormir') || q.includes('coucher')) {
    return responses['routine'];
  }
  return responses['default'];
}
