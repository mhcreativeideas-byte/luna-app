// Logique de filtrage des recettes, partagée entre l'écran « Manger »
// (qui n'a besoin que du compte) et la page « Toutes les recettes »
// (filtres interactifs + grille). Source unique pour éviter toute divergence.

export const ALLERGEN_KEYWORDS = {
  'Fruits à coque': ['amande', 'noix', 'noisette', 'pistache', 'cajou', 'pécan', 'macadamia', 'pralin', 'fruits à coque'],
  'Arachides': ['arachide', 'cacahuète', 'cacahouète', 'beurre de cacahuète', 'peanut'],
  'Soja': ['soja', 'tofu', 'tempeh', 'edamame', 'miso', 'sauce soja', 'tamari', 'protéine de soja'],
  'Œufs': ['œuf', 'oeuf', 'jaune d\'œuf', 'blanc d\'œuf', 'mayonnaise'],
  'Poisson': ['saumon', 'thon', 'cabillaud', 'sardine', 'maquereau', 'truite', 'anchois', 'bar', 'dorade', 'colin', 'merlu', 'poisson'],
  'Crustacés': ['crevette', 'crabe', 'homard', 'langoustine', 'crustacé', 'fruits de mer', 'gambas'],
  'Lait': ['lait', 'fromage', 'beurre', 'crème fraîche', 'crème liquide', 'yaourt', 'yogourt', 'ricotta', 'parmesan', 'mozzarella', 'gruyère', 'emmental', 'comté', 'chèvre', 'feta', 'mascarpone', 'crème entière'],
  'Blé': ['blé', 'farine', 'pain', 'pâtes', 'spaghetti', 'penne', 'fusilli', 'couscous', 'boulgour', 'semoule', 'croûton', 'chapelure', 'tortilla', 'wrap'],
  'Sésame': ['sésame', 'tahini', 'tahin', 'gomasio'],
  'Céleri': ['céleri', 'celeri'],
  'Moutarde': ['moutarde'],
  'Sulfites': ['vin blanc', 'vin rouge', 'vin rosé', 'vinaigre balsamique', 'sulfite'],
};

const LEVEL_ORDER = { debutant: 1, intermediaire: 2, avance: 3 };

// Extraire les minutes depuis le champ prepTime (ex: "10 min", "1h15", "45 min")
export function parseMinutes(prepTime) {
  if (!prepTime) return 999;
  const str = prepTime.toLowerCase().replace(/\s/g, '');
  const hMatch = str.match(/(\d+)\s*h/);
  const mMatch = str.match(/(\d+)\s*min/);
  let total = 0;
  if (hMatch) total += parseInt(hMatch[1]) * 60;
  if (mMatch) total += parseInt(mMatch[1]);
  if (!hMatch && !mMatch) {
    const num = parseInt(str);
    total = isNaN(num) ? 999 : num;
  }
  return total;
}

export function containsAllergen(recipe, allergyList) {
  if (!allergyList || allergyList.length === 0) return false;
  const fullText = ((recipe.ingredients || []).join(' ') + ' ' + (recipe.name || '')).toLowerCase();
  return allergyList.some((allergy) => {
    const keywords = ALLERGEN_KEYWORDS[allergy] || [];
    return keywords.some((kw) => fullText.includes(kw.toLowerCase()));
  });
}

// Tags requis selon le profil (régime + santé)
export function buildRequiredTags(dietPreferences, healthIssues) {
  const tags = [];
  const prefs = dietPreferences || ['omnivore'];
  const issues = healthIssues || [];
  if (prefs.includes('Végane')) tags.push('vegan');
  else if (prefs.includes('Végétarienne')) tags.push('vegetarien');
  if (prefs.includes('Sans gluten')) tags.push('sans_gluten');
  if (prefs.includes('Sans lactose')) tags.push('sans_lactose');
  if (issues.includes('SOPK')) tags.push('sopk_friendly');
  if (issues.includes('Anti-inflammatoire')) tags.push('anti_inflammatoire');
  if (issues.includes('Endométriose')) tags.push('anti_inflammatoire');
  if (issues.includes('SPM sévère')) tags.push('spm_friendly');
  return tags;
}

// Libellé lisible du régime/santé (ex: "Sans gluten · Endométriose")
export function buildDietLabel(dietPreferences, healthIssues) {
  const labels = [];
  const prefs = dietPreferences || [];
  const issues = healthIssues || [];
  if (prefs.includes('Végane')) labels.push('Végane');
  else if (prefs.includes('Végétarienne')) labels.push('Végétarienne');
  if (prefs.includes('Sans gluten')) labels.push('Sans gluten');
  if (prefs.includes('Sans lactose')) labels.push('Sans lactose');
  if (issues.includes('SOPK')) labels.push('SOPK');
  if (issues.includes('Anti-inflammatoire')) labels.push('Anti-inflammatoire');
  if (issues.includes('Endométriose')) labels.push('Endométriose');
  if (issues.includes('SPM sévère')) labels.push('SPM sévère');
  return labels.join(' · ');
}

export function timeToMaxMinutes(selectedTime) {
  if (!selectedTime || selectedTime === '60min+') return null;
  if (selectedTime === '15min') return 15;
  if (selectedTime === '30min') return 30;
  if (selectedTime === '45min') return 45;
  return null;
}

// Filtre principal : applique repas + tags régime + temps + allergènes + niveau
// + cuisine + nutriment. (Le mode « favoris » est géré à part dans le composant.)
export function filterRecipes(recipes, {
  selectedMeal = 'all',
  requiredTags = [],
  allergies = [],
  selectedLevel = 'avance',
  selectedTime = '',
  selectedCuisines = [],
  nutrientFilter = '',
  maxCalories = null,
} = {}) {
  const out = [];
  if (!recipes) return out;
  const maxTime = timeToMaxMinutes(selectedTime);
  const maxLevel = LEVEL_ORDER[selectedLevel] || 3;

  Object.entries(recipes).forEach(([mealType, items]) => {
    if (selectedMeal !== 'all' && selectedMeal !== 'favorites' && mealType !== selectedMeal) return;
    if (!Array.isArray(items)) return;
    items.forEach((recipe) => {
      if (requiredTags.length > 0) {
        const recipeTags = recipe.tags || [];
        if (!requiredTags.every((tag) => recipeTags.includes(tag))) return;
      }
      if (maxTime && parseMinutes(recipe.prepTime) > maxTime) return;
      if (containsAllergen(recipe, allergies)) return;
      const recipeLevel = LEVEL_ORDER[recipe.difficulty] || 1;
      if (recipeLevel > maxLevel) return;
      if (selectedCuisines.length > 0 && !selectedCuisines.includes(recipe.cuisine)) return;
      if (nutrientFilter && !(recipe.nutrients || []).some((n) => n.toLowerCase().includes(nutrientFilter.toLowerCase()))) return;
      if (maxCalories && Number(recipe.calories) > maxCalories) return;
      out.push({ ...recipe, mealType });
    });
  });
  return out;
}
