// Données de démonstration — 3 mois de journal (fév, mars, avril 2026)
// À supprimer après validation du design

const phases = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
const moodsByPhase = {
  menstrual: ['Pas top', 'Difficile', 'Neutre', 'Pas top', 'Neutre'],
  follicular: ['Bien', 'Super', 'Bien', 'Super', 'Bien'],
  ovulatory: ['Super', 'Super', 'Bien', 'Super'],
  luteal: ['Neutre', 'Bien', 'Pas top', 'Neutre', 'Pas top', 'Difficile'],
};
const energyByPhase = {
  menstrual: [3, 2, 4, 3, 4],
  follicular: [7, 8, 7, 9, 8],
  ovulatory: [9, 10, 8, 9],
  luteal: [6, 5, 4, 5, 3, 4],
};
const symptomsByPhase = {
  menstrual: ['Crampes', 'Fatigue', 'Maux de tête', 'Ballonnements', 'Irritabilité'],
  follicular: ['Motivation haute', 'Créativité', 'Confiance'],
  ovulatory: ['Confiance', 'Libido', 'Motivation haute', 'Créativité'],
  luteal: ['Ballonnements', 'Insomnie', 'Irritabilité', 'Sensibilité poitrine', 'Acné', 'Fatigue'],
};
const textsByPhase = {
  menstrual: [
    'Journée lente, j\'ai écouté mon corps. Yoga doux ce matin.',
    'Crampes fortes ce matin, ça s\'est calmé l\'après-midi.',
    'J\'ai pris le temps de me reposer. Tisane et lecture.',
    '',
    'Début de règles, fatigue intense mais humeur ok.',
  ],
  follicular: [
    'Énergie de retour ! J\'ai couru 30 min ce matin.',
    'Super productive au travail. Je me sens bien.',
    'Sortie entre amies, je me sentais vraiment bien.',
    'Session muscu ce matin, je me sens forte.',
    '',
  ],
  ovulatory: [
    'Pleine forme ! Présentation au travail, très confiante.',
    'Cours de boxing intense, j\'ai tout donné.',
    'Peau qui brille, énergie au max.',
    '',
  ],
  luteal: [
    'Énergie qui baisse, c\'est ok. Natation douce.',
    'Envies de sucre, j\'ai opté pour du chocolat noir.',
    'Un peu irritable, j\'ai fait du yoga pour me calmer.',
    'Insomnie cette nuit, fatiguée aujourd\'hui.',
    'Ballonnements et sensibilité. Marche en nature.',
    '',
  ],
};

function getPhaseForDay(day, cycleLength = 28, periodLength = 5) {
  const ovulationDay = cycleLength - 14;
  if (day <= periodLength) return 'menstrual';
  if (day <= ovulationDay - 1) return 'follicular';
  if (day <= ovulationDay + 1) return 'ovulatory';
  return 'luteal';
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateDemoEntries() {
  const entries = [];
  const cycleLength = 28;
  const periodLength = 5;

  // Last period: March 18, 2026 — so we can calculate backwards
  const lastPeriodDate = new Date(2026, 2, 18); // March 18

  // Generate entries for Feb 1 - April 1, 2026
  const startDate = new Date(2026, 1, 1); // Feb 1
  const endDate = new Date(2026, 3, 1); // April 1

  const current = new Date(startDate);
  while (current <= endDate) {
    // Skip ~30% of days randomly (realistic: not every day is filled)
    if (Math.random() > 0.35) {
      const diffDays = Math.floor((current - lastPeriodDate) / (1000 * 60 * 60 * 24));
      const cycleDay = (((diffDays % cycleLength) + cycleLength) % cycleLength) + 1;
      const phase = getPhaseForDay(cycleDay, cycleLength, periodLength);

      const phaseMoods = moodsByPhase[phase];
      const phaseEnergies = energyByPhase[phase];
      const phaseSymptoms = symptomsByPhase[phase];
      const phaseTexts = textsByPhase[phase];

      // Pick 1-3 random symptoms
      const numSymptoms = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...phaseSymptoms].sort(() => Math.random() - 0.5);
      const pickedSymptoms = shuffled.slice(0, numSymptoms);

      entries.push({
        date: current.toISOString().split('T')[0],
        phase,
        mood: randomPick(phaseMoods),
        energy: randomPick(phaseEnergies),
        symptoms: pickedSymptoms,
        text: randomPick(phaseTexts),
      });
    }

    current.setDate(current.getDate() + 1);
  }

  return entries;
}
