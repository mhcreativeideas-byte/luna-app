export const PHASES = {
  menstrual: {
    name: 'Phase Menstruelle',
    shortName: 'Menstruelle',
    icon: '🌙',
    emoji: '🌙',
    color: '#E25B33',
    colorDark: '#C2441A',
    bgColor: '#FFF0EB',
    keyword: 'Repos',
    days: '1-5',
    energy: 30,
    encouragement: 'Ton corps travaille dur pour toi. Accorde-lui le repos qu\'il mérite. 💜',
    bodyToday: 'Ton corps se régénère. L\'œstrogène et la progestérone sont au plus bas. C\'est normal de ressentir de la fatigue — ton corps travaille dur pour toi.',
    summary: 'Phase de repos et d\'introspection. Tes hormones sont au plus bas, c\'est le moment de ralentir et de prendre soin de toi.',
    mindset: 'Journaling & introspection',
    nutrients: ['Fer', 'Omega-3', 'Magnésium', 'Vitamine C'],
    nutrientDetails: {
      'Fer': 'Tu perds du fer pendant tes règles. Compense avec des lentilles, épinards, viande rouge, tofu.',
      'Omega-3': 'Anti-inflammatoires naturels qui aident contre les crampes. Saumon, sardines, graines de lin.',
      'Magnésium': 'Réduit les crampes et la fatigue. Chocolat noir, amandes, bananes.',
      'Vitamine C': 'Aide à absorber le fer. Agrumes, poivrons, kiwi.',
    },
    drinks: {
      good: ['Tisanes anti-inflammatoires', 'Golden latte (curcuma)', 'Eau citron chaud', 'Infusion gingembre'],
      bad: ['Café fort', 'Alcool', 'Boissons glacées', 'Sodas'],
    },
    avoid: ['HIIT intense', 'Café après 14h', 'Restrictions caloriques', 'Planifier trop de social'],
    sleepHours: '8-9h',
    sleepQuality: 'Sommeil profond facilité par la baisse hormonale',
    sleepTips: [
      'Bouillotte sur le ventre pour soulager les crampes',
      'Magnésium en complément avant le coucher',
      'Position fœtale pour réduire les douleurs abdominales',
    ],
    journalPrompt: 'Qu\'est-ce que ton corps t\'a appris aujourd\'hui ?',
    affirmation: 'Je m\'autorise à ralentir. Mon repos est productif.',
    fact: 'Pendant tes règles, ton taux d\'hormones est au plus bas. C\'est pour ça que tu te sens fatiguée — c\'est physiologique, pas un manque de volonté.',
  },

  follicular: {
    name: 'Phase Folliculaire',
    shortName: 'Folliculaire',
    icon: '🌿',
    emoji: '🌿',
    color: '#D6CDB8',
    colorDark: '#8B7E66',
    bgColor: '#F7F4EF',
    keyword: 'Énergie',
    days: '6-13',
    energy: 75,
    encouragement: 'L\'énergie monte ! C\'est le moment de te challenger et de lancer de nouveaux projets. 🌿',
    bodyToday: 'L\'œstrogène remonte doucement. Tu vas sentir ton énergie et ta motivation revenir. Profite de cette vague montante pour lancer ce qui te tient à cœur.',
    summary: 'L\'œstrogène remonte progressivement. Ton énergie, ta motivation et ta créativité augmentent jour après jour.',
    mindset: 'Planification & nouveaux défis',
    nutrients: ['Protéines', 'Zinc', 'Vitamines B', 'Probiotiques'],
    nutrientDetails: {
      'Protéines': 'Ton corps construit et répare. Poulet, œufs, légumineuses, tofu.',
      'Zinc': 'Soutient le système immunitaire et la peau. Graines de courge, pois chiches, viande.',
      'Vitamines B': 'Énergie cellulaire et humeur. Céréales complètes, légumes verts, bananes.',
      'Probiotiques': 'Équilibre intestinal et immunitaire. Yaourt, kéfir, choucroute, kimchi.',
    },
    drinks: {
      good: ['Matcha', 'Eau de coco', 'Smoothies protéinés', 'Jus de betterave'],
      bad: ['Excès de caféine', 'Boissons très sucrées'],
    },
    avoid: ['Rester sédentaire', 'Sous-manger (ton corps a besoin de carburant)', 'Reporter tes projets'],
    sleepHours: '7-8h',
    sleepQuality: 'Sommeil réparateur, facilité par la montée d\'œstrogène',
    sleepTips: [
      'Profite de cette phase pour recaler ton rythme circadien',
      'Lève-toi tôt et expose-toi à la lumière naturelle',
      'L\'énergie est là — couche-toi à heure fixe pour en profiter',
    ],
    journalPrompt: 'Quels projets t\'excitent en ce moment ?',
    affirmation: 'Je suis capable de grandes choses. Mon énergie est ma force.',
    fact: 'En phase folliculaire, ton taux d\'œstrogène remonte. C\'est pour ça que tu te sens plus motivée et énergique !',
  },

  ovulatory: {
    name: 'Phase Ovulatoire',
    shortName: 'Ovulation',
    icon: '☀️',
    emoji: '☀️',
    color: '#F5A623',
    colorDark: '#D4910A',
    bgColor: '#FFF8EC',
    keyword: 'Rayonnement',
    days: '14-16',
    energy: 95,
    encouragement: 'Tu rayonnes ! Communication, confiance, performance : tout est au max. ☀️',
    bodyToday: 'Pic hormonal ! L\'œstrogène et la testostérone sont au max. Ta communication, ta confiance et tes performances sont à leur apogée.',
    summary: 'Pic d\'œstrogène et de testostérone. Tu es au sommet de ton énergie, ta confiance et ton charisme.',
    mindset: 'Communication & leadership',
    nutrients: ['Fibres', 'Antioxydants', 'Zinc', 'Glutathion'],
    nutrientDetails: {
      'Fibres': 'Aide à éliminer l\'excès d\'œstrogène. Légumes verts, céréales complètes, fruits.',
      'Antioxydants': 'Protègent les cellules en période de pic hormonal. Fruits rouges, légumes colorés.',
      'Zinc': 'Soutient l\'ovulation et l\'immunité. Huîtres, graines, légumineuses.',
      'Glutathion': 'Détoxifiant puissant. Brocoli, ail, épinards, avocat.',
    },
    drinks: {
      good: ['Eau détox concombre-menthe', 'Thé vert', 'Kombucha', 'Jus de légumes frais'],
      bad: ['Excès de caféine (énergie déjà naturelle)', 'Alcool en excès'],
    },
    avoid: ['Ignorer ton besoin de connexion sociale', 'Ne pas profiter de cette énergie', 'Négliger l\'échauffement (laxité ligamentaire accrue)'],
    sleepHours: '7-8h',
    sleepQuality: 'Énergie naturellement élevée, attention à ne pas accumuler une dette de sommeil',
    sleepTips: [
      'Tu as naturellement plus d\'énergie, attention à ne pas accumuler de dette de sommeil',
      'Profite des soirées pour socialiser mais garde un horaire de coucher',
      'Méditation courte pour canaliser l\'énergie avant le sommeil',
    ],
    journalPrompt: 'De quoi es-tu fière cette semaine ?',
    affirmation: 'Je rayonne et j\'inspire. Ma voix compte.',
    fact: 'Pendant l\'ovulation, ton cerveau est au max de ses capacités verbales et sociales grâce au pic d\'œstrogène.',
  },

  luteal: {
    name: 'Phase Lutéale',
    shortName: 'Lutéale',
    icon: '🍂',
    emoji: '🍂',
    color: '#C9A0D3',
    colorDark: '#A67BB5',
    bgColor: '#F8F0FF',
    keyword: 'Transition',
    days: '17-28',
    energy: 45,
    encouragement: 'Ton corps se prépare. Écoute-le, nourris-le, et sois douce avec toi-même. 🍂',
    bodyToday: 'La progestérone prend le relais. Ton énergie se tourne vers l\'intérieur. C\'est le moment de ralentir, finaliser tes projets et prendre soin de toi.',
    summary: 'La progestérone domine. Ton corps ralentit, tes émotions peuvent être plus intenses. C\'est le temps de la douceur.',
    mindset: 'Organisation & cocooning',
    nutrients: ['Magnésium', 'Vitamine B6', 'Calcium', 'Glucides complexes'],
    nutrientDetails: {
      'Magnésium': 'Combat le SPM, les crampes et l\'irritabilité. Chocolat noir, noix, légumineuses.',
      'Vitamine B6': 'Régule l\'humeur et réduit la rétention d\'eau. Bananes, pommes de terre, volaille.',
      'Calcium': 'Diminue les symptômes prémenstruels. Produits laitiers, amandes, brocoli.',
      'Glucides complexes': 'Stabilisent la glycémie et l\'humeur. Patate douce, avoine, riz complet.',
    },
    drinks: {
      good: ['Infusions magnésium', 'Lait d\'or (golden milk)', 'Tisanes digestives', 'Eau tiède citronnée'],
      bad: ['Café après 14h', 'Alcool', 'Boissons très sucrées', 'Excès de sel (rétention d\'eau)'],
    },
    avoid: ['Se culpabiliser pour ses envies de sucre', 'S\'imposer un régime strict', 'Prévoir trop d\'engagements sociaux', 'HIIT intense en fin de phase'],
    sleepHours: '8-9h',
    sleepQuality: 'La progestérone te rend somnolente mais peut fragmenter le sommeil',
    sleepTips: [
      'La progestérone te rend somnolente mais peut fragmenter le sommeil',
      'Routine stricte recommandée — même heure chaque soir',
      'Évite les écrans 1h avant le coucher',
    ],
    journalPrompt: 'De quoi as-tu besoin pour te sentir bien ?',
    affirmation: 'Je m\'écoute sans culpabilité. Mes besoins sont valides.',
    fact: 'En phase lutéale, ton métabolisme augmente de 10-20%. Manger plus est NORMAL et nécessaire.',
    sugarCravings: {
      explanation: 'Ton métabolisme est plus élevé en phase lutéale. La progestérone fait baisser ta sérotonine, ce qui crée des envies de glucides. C\'est de la biologie, pas de la faiblesse !',
      alternatives: [
        'Chocolat noir 70%',
        'Dattes fourrées au beurre de cacahuète',
        'Banana nice cream',
        'Energy balls maison',
        'Smoothie banane-cacao',
      ],
    },
  },
};

export const PHASE_ORDER = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

export function getPhaseForDay(day, cycleLength, periodLength) {
  const ovulationDay = cycleLength - 14;
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;

  if (day <= periodLength) return 'menstrual';
  if (day <= ovulatoryStart) return 'follicular';
  if (day <= ovulatoryEnd) return 'ovulatory';
  return 'luteal';
}
