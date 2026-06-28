// Boucle « symptôme → alimentation » : relie un ressenti noté au check-in
// à un nutriment clé + des aliments qui aident. C'est le cœur de la promesse
// de LUNA (gérer son cycle par l'assiette).
// Les `nutrient` correspondent à des tags réels de recettes (Fer, Magnésium,
// Zinc, Oméga-3, Fibres) pour que le lien « Voir les recettes » fonctionne.

export const SYMPTOM_FOOD_MAP = [
  {
    match: ['crampe', 'douleurs musculaires', 'mal de dos'],
    title: 'Apaiser tes crampes',
    nutrient: 'Magnésium',
    foods: ['chocolat noir', 'amandes', 'banane'],
    why: 'Le magnésium détend les muscles et calme les crampes.',
  },
  {
    match: ['migraine', 'maux de tête', 'mal de tête'],
    title: 'Calmer tes maux de tête',
    nutrient: 'Magnésium',
    foods: ['épinards', 'graines de courge', 'eau'],
    why: 'Le magnésium et une bonne hydratation aident à réduire les maux de tête.',
  },
  {
    match: ['fatigue', 'batterie faible', 'faible motivation', 'épuisée'],
    title: 'Recharger ton énergie',
    nutrient: 'Fer',
    foods: ['lentilles', 'épinards', 'œufs'],
    why: 'Le fer recharge ton énergie, surtout après les pertes menstruelles.',
  },
  {
    match: ['ballon', 'gaz', 'rétention', 'constipation', 'transit'],
    title: 'Dégonfler en douceur',
    nutrient: 'Fibres',
    foods: ['légumes verts', 'gingembre', 'avoine'],
    why: 'Les fibres et le gingembre apaisent la digestion et les ballonnements.',
  },
  {
    match: ['acné', 'bouton', 'peau'],
    title: 'Apaiser ta peau',
    nutrient: 'Zinc',
    foods: ['graines de courge', 'pois chiches', 'noix'],
    why: 'Le zinc soutient la peau et aide à réguler le sébum.',
  },
  {
    match: ['sucre', 'gourmandise', 'chocolat', 'glucide', 'soda'],
    title: 'Gérer tes envies de sucre',
    nutrient: 'Magnésium',
    foods: ['chocolat noir 70%', 'dattes', 'fruits'],
    why: 'Les envies de sucre cachent souvent un besoin de magnésium et de glucides complexes.',
  },
  {
    match: ['irritable', 'anxiété', 'saute', 'stress', 'déprimée', 'submergée', 'panique', 'tristesse', 'en larmes'],
    title: 'Apaiser ton humeur',
    nutrient: 'Oméga-3',
    foods: ['saumon', 'noix', 'graines de lin'],
    why: 'Les oméga-3 soutiennent l\'humeur et le système nerveux.',
  },
  {
    match: ['insomnie', 'manque de sommeil', 'réveil', 'sueurs nocturnes'],
    title: 'Mieux dormir ce soir',
    nutrient: 'Magnésium',
    foods: ['amandes', 'banane', 'tisane'],
    why: 'Le magnésium favorise un sommeil plus profond et réparateur.',
  },
];

// Renvoie le premier conseil correspondant aux symptômes du check-in (ou null)
export function findSymptomFood(symptoms) {
  if (!symptoms || symptoms.length === 0) return null;
  const lower = symptoms.map((s) => String(s).toLowerCase());
  for (const entry of SYMPTOM_FOOD_MAP) {
    if (entry.match.some((kw) => lower.some((s) => s.includes(kw)))) return entry;
  }
  return null;
}
