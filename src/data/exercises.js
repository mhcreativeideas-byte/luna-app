export const EXERCISES = {
  menstrual: {
    type: 'Yoga doux, stretching, marche',
    duration: '20-30 min',
    intensity: 1,
    intensityLabel: 'Basse',
    message: 'Écoute ton corps. Si tu n\'as pas envie de bouger, une simple marche de 10 minutes suffit. Zéro culpabilité.',
    intro: 'Ton corps travaille dur pendant les règles. Privilégie les mouvements doux qui soulagent et apaisent.',
    exercises: [
      {
        name: 'Posture de l\'enfant (Balasana)',
        duration: '2 min',
        description: 'À genoux, penche-toi en avant, bras tendus devant toi. Respire profondément. Cette posture soulage les douleurs lombaires et apaise le système nerveux.',
      },
      {
        name: 'Torsion allongée',
        duration: '1 min par côté',
        description: 'Allongée sur le dos, ramène un genou vers la poitrine et fais-le basculer de l\'autre côté. Maintiens en respirant. Soulage les tensions abdominales.',
      },
      {
        name: 'Marche lente en nature',
        duration: '15 min',
        description: 'Marche douce à l\'extérieur, sans forcer le rythme. Concentre-toi sur ta respiration et les sensations autour de toi. Idéal pour l\'humeur.',
      },
      {
        name: 'Étirements bas du dos',
        duration: '5 min',
        description: 'Chat-vache (dos rond / dos creux) à quatre pattes, doucement, au rythme de ta respiration. Soulage les crampes et la tension musculaire.',
      },
    ],
    avoid: [
      { name: 'CrossFit / HIIT intense', reason: 'Tes réserves en fer sont basses, ton corps récupère. Forcer risque d\'augmenter la fatigue et l\'inflammation.' },
      { name: 'Abdominaux intenses', reason: 'Augmentent la pression abdominale et peuvent aggraver les crampes.' },
      { name: 'Course longue distance', reason: 'Trop exigeant pour ton niveau d\'énergie actuel. Garde ça pour la phase folliculaire.' },
    ],
    whyThisSport: 'Pendant tes règles, la progestérone et l\'œstrogène sont au plus bas. Ton corps utilise son énergie pour renouveler la muqueuse utérine. Les mouvements doux améliorent la circulation sanguine et réduisent naturellement les crampes grâce aux endorphines.',
  },

  follicular: {
    type: 'HIIT, musculation, cardio, danse',
    duration: '40-50 min',
    intensity: 3,
    intensityLabel: 'Haute',
    message: 'L\'œstrogène remonte = meilleure récupération musculaire et motivation au top. Challenge-toi !',
    intro: 'Ton énergie monte en flèche ! Profite de cette phase pour repousser tes limites et te challenger.',
    exercises: [
      {
        name: 'Circuit HIIT — 4 rounds',
        duration: '20 min',
        description: '40s effort / 20s repos : Burpees → Squats sautés → Mountain climbers → Planche. 1 min de repos entre les rounds.',
      },
      {
        name: 'Musculation haut du corps',
        duration: '15 min',
        description: 'Pompes (3x12), Dips sur chaise (3x10), Rowing haltères (3x12), Curl biceps (3x10). Augmente les charges si tu te sens forte !',
      },
      {
        name: 'Cardio vélo ou course',
        duration: '20 min',
        description: 'Course ou vélo à intensité modérée-haute. Tu peux intégrer des intervalles : 1 min rapide / 1 min récupération.',
      },
      {
        name: 'Cool down & étirements',
        duration: '5 min',
        description: 'Étirements de tous les groupes musculaires travaillés. Maintiens chaque étirement 30 secondes minimum.',
      },
    ],
    avoid: [
      { name: 'Rester sédentaire', reason: 'C\'est le meilleur moment du cycle pour progresser physiquement. Ne gâche pas cette fenêtre d\'opportunité !' },
      { name: 'Sous-alimenter l\'entraînement', reason: 'Ton corps construit du muscle — il a besoin de protéines et de glucides pour récupérer.' },
    ],
    whyThisSport: 'L\'œstrogène favorise la synthèse des protéines musculaires → meilleure récupération → tu peux aller plus fort. La tolérance à la douleur est aussi plus élevée en cette phase. C\'est scientifiquement le meilleur moment pour gagner en force !',
  },

  ovulatory: {
    type: 'Performance maximale, sport collectif, compétition',
    duration: '45-60 min',
    intensity: 4,
    intensityLabel: 'Maximale',
    message: 'Pic de force et d\'endurance ! C\'est LE moment pour tester tes limites. Attention à bien t\'échauffer car la laxité ligamentaire est plus élevée.',
    intro: 'Tu es au sommet de ta forme physique ! Force, endurance, coordination — tout est au max.',
    exercises: [
      {
        name: 'Entraînement force & puissance',
        duration: '25 min',
        description: 'Squats lourds (4x8), Deadlifts (4x6), Développé épaules (3x10), Fentes marchées (3x12 par jambe). C\'est le moment d\'augmenter tes charges !',
      },
      {
        name: 'Sprint intervals',
        duration: '15 min',
        description: '8 sprints de 30 secondes avec 1 min de récupération. Sur piste, vélo ou rameur. Donne tout !',
      },
      {
        name: 'Cours collectifs haute énergie',
        duration: '45-60 min',
        description: 'Boxing, spinning, danse cardio, CrossFit... Profite de l\'énergie du groupe et de ta confiance naturelle !',
      },
      {
        name: 'Tentative de records personnels',
        duration: 'Variable',
        description: 'C\'est LE moment pour tester tes PR (personal records). Ton corps est prêt, ta confiance aussi. Go !',
      },
    ],
    avoid: [
      { name: 'Sauter l\'échauffement', reason: 'La laxité ligamentaire est plus élevée autour de l\'ovulation → risque accru de blessures aux genoux et chevilles. 10 min d\'échauffement minimum !' },
      { name: 'Ignorer la fatigue', reason: 'L\'euphorie de l\'ovulation peut masquer des signaux de fatigue. Écoute ton corps même quand tu te sens invincible.' },
    ],
    whyThisSport: 'Le pic combiné d\'œstrogène et de testostérone te donne ta force maximale, ta meilleure endurance et ta coordination optimale. Les études montrent que les performances sportives féminines culminent autour de l\'ovulation. Profites-en !',
  },

  luteal: {
    type: 'Modéré → Doux (progressif)',
    duration: '20-40 min',
    intensity: 2,
    intensityLabel: 'Modérée à Basse',
    message: 'Ton métabolisme augmente, tu brûles plus de calories au repos. Baisse l\'intensité progressivement et privilégie les mouvements doux en fin de phase.',
    intro: 'L\'énergie redescend progressivement. Adapte l\'intensité au fil des jours — forte au début, douce à la fin.',
    exercises: [
      {
        name: 'Musculation charges modérées (semaine 1)',
        duration: '30 min',
        description: 'Circuit avec charges modérées : Squats (3x12), Pompes (3x10), Rowing (3x12), Planche (3x30s). Ne cherche pas les PR, maintiens ta forme.',
      },
      {
        name: 'Natation ou vélo (semaine 1)',
        duration: '30 min',
        description: 'Natation ou vélo à rythme confortable. Ces sports portés sont parfaits quand le corps commence à gonfler et à être sensible.',
      },
      {
        name: 'Yoga restauratif (semaine 2)',
        duration: '30 min',
        description: 'Postures tenues longtemps avec supports (coussins, couvertures). Pigeon, papillon allongé, torsion douce. Concentre-toi sur la respiration.',
      },
      {
        name: 'Marche méditative & foam rolling (semaine 2)',
        duration: '20 min',
        description: 'Marche lente en pleine conscience + 10 min de foam rolling sur les zones tendues (mollets, cuisses, dos). Parfait pour gérer le stress prémenstruel.',
      },
    ],
    avoid: [
      { name: 'HIIT intense en fin de phase', reason: 'Ton cortisol est déjà élevé — l\'entraînement intense le fait monter encore plus, aggravant irritabilité et insomnie.' },
      { name: 'Se forcer quand le corps dit non', reason: 'Les jours pré-menstruels, le repos est plus bénéfique qu\'un entraînement forcé. Une marche douce suffit.' },
      { name: 'Exercices à fort impact', reason: 'Sensibilité de la poitrine, rétention d\'eau et gonflements rendent les impacts inconfortables. Préfère les sports portés.' },
    ],
    whyThisSport: 'La progestérone monte puis chute en fin de phase. Ton corps utilise plus de graisses comme carburant (idéal pour le cardio modéré) mais ta température corporelle est plus élevée, ce qui peut réduire l\'endurance. Écoute la baisse progressive et adapte-toi.',
  },
};
