import { Sunrise, Sun, Cookie, Moon } from 'lucide-react';
import { containsAllergen, matchesRequiredTags } from './recipeFilters';

// Construction du menu du jour (4 repas adaptés à la phase + préférences).
// Extrait de DailyMenu.jsx pour être partagé avec la page Mes courses
// (« Générer depuis mon menu »). Le tirage est stable toute la journée.

// Pseudo-random basé sur la date (stable toute la journée donnée) —
// permet aussi de générer le menu d'un jour futur (menu de la semaine).
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const getDaySeed = (d = new Date()) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

export const MEAL_SLOTS = [
  { key: 'breakfast', time: 'Matin', Icon: Sunrise },
  { key: 'lunch', time: 'Midi', Icon: Sun },
  { key: 'snack', time: 'Snack', Icon: Cookie },
  { key: 'dinner', time: 'Soir', Icon: Moon },
];

const DRINK_ICONS = {
  'tisane': '🍵', 'infusion': '🍵', 'thé': '🍵', 'matcha': '🍵',
  'lait': '🥛', 'golden': '🥛', 'smoothie': '🥤', 'jus': '🥤',
  'eau': '💧', 'kéfir': '🥛', 'kombucha': '🍵', 'chocolat': '☕',
  'cacao': '☕', 'bouillon': '🍲', 'limonade': '🍋', 'grenade': '🥤',
  'hibiscus': '🌺',
};

const getDrinkIcon = (drinkName) => {
  const lower = drinkName.toLowerCase();
  for (const [keyword, icon] of Object.entries(DRINK_ICONS)) {
    if (lower.includes(keyword)) return icon;
  }
  return '🍵';
};

export const buildDailyMenu = (recipes, phaseData, { requiredTags = [], allergies = [], cookingLevel, cookingTime, date } = {}) => {
  if (!recipes) return [];
  const rand = seededRandom(getDaySeed(date) + phaseData.shortName.charCodeAt(0));
  const goodDrinks = phaseData.drinks?.good || [];

  const LEVEL_ORDER = { debutant: 1, intermediaire: 2, avance: 3 };
  const maxLevel = LEVEL_ORDER[cookingLevel] || 3;

  const maxTime = (() => {
    if (!cookingTime || cookingTime === '60min+') return null;
    if (cookingTime === '15min') return 15;
    if (cookingTime === '30min') return 30;
    if (cookingTime === '45min') return 45;
    return null;
  })();

  const parseMinutes = (prepTime) => {
    if (!prepTime) return 999;
    const str = prepTime.toLowerCase().replace(/\s/g, '');
    const hMatch = str.match(/(\d+)\s*h/);
    const mMatch = str.match(/(\d+)\s*min/);
    let total = 0;
    if (hMatch) total += parseInt(hMatch[1]) * 60;
    if (mMatch) total += parseInt(mMatch[1]);
    if (!hMatch && !mMatch) { const num = parseInt(str); total = isNaN(num) ? 999 : num; }
    return total;
  };

  const shuffledDrinks = [...goodDrinks];
  for (let i = shuffledDrinks.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffledDrinks[i], shuffledDrinks[j]] = [shuffledDrinks[j], shuffledDrinks[i]];
  }
  let drinkIndex = 0;

  // Tags de régime : jamais relâchés (avec les allergies). Les tags santé
  // (SOPK, SPM, anti-inflammatoire) sont des préférences : on ne les relâche
  // qu'en dernier recours pour ne pas laisser un repas vide.
  const DIET_TAGS = ['vegan', 'vegetarien', 'sans_gluten', 'sans_lactose'];
  const dietTags = requiredTags.filter((t) => DIET_TAGS.includes(t));

  return MEAL_SLOTS.map((slot) => {
    const pool = recipes[slot.key];
    if (!pool || pool.length === 0) return null;
    const safe = pool.filter((recipe) => !containsAllergen(recipe, allergies));
    const matchesPractical = (recipe) => {
      const recipeLevel = LEVEL_ORDER[recipe.difficulty] || 1;
      if (recipeLevel > maxLevel) return false;
      if (maxTime && parseMinutes(recipe.prepTime) > maxTime) return false;
      return true;
    };
    // Paliers : filtres complets → sans temps/niveau → sans tags santé.
    // On ne descend JAMAIS sous « régime + allergies ».
    const available =
      [
        safe.filter((r) => matchesRequiredTags(r, requiredTags) && matchesPractical(r)),
        safe.filter((r) => matchesRequiredTags(r, requiredTags)),
        safe.filter((r) => matchesRequiredTags(r, dietTags)),
      ].find((list) => list.length > 0) || [];
    if (available.length === 0) return null;
    const idx = Math.floor(rand() * available.length);
    const recipe = available[idx];
    const drink = shuffledDrinks[drinkIndex % shuffledDrinks.length] || null;
    drinkIndex++;
    return {
      ...slot,
      recipe,
      drink: drink?.name || '',
      drinkIcon: drink ? getDrinkIcon(drink.name) : '🍵',
    };
  }).filter(Boolean);
};
