import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ChevronRight, Clock, Sparkles, Lightbulb, Leaf, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPES } from '../data/recipes';
import { SEASONAL_FOODS, FOOD_EMOJIS, FOOD_IMAGES } from '../data/seasonal';
import TopMenu from '../components/ui/TopMenu';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_FOOD_TITLES = {
  menstrual: { main: 'Nourrir &', italic: 'Réparer' },
  follicular: { main: 'Construire &', italic: 'Énergiser' },
  ovulatory: { main: 'L\'éclat de', italic: 'la Nutrition' },
  luteal: { main: 'Réconfort &', italic: 'Équilibre' },
};

const PHASE_FOOD_INTROS = {
  menstrual: 'Pendant tes règles, concentre-toi sur les aliments riches en fer et anti-inflammatoires pour compenser les pertes.',
  follicular: 'L\'œstrogène remonte. Ton corps est en mode construction. Protéines, zinc et probiotiques sont tes alliés.',
  ovulatory: 'Pic hormonal : privilégie les fibres pour éliminer l\'excès d\'œstrogène et les antioxydants pour protéger tes cellules.',
  luteal: 'Ton métabolisme augmente de 10-20%. Nourris-le avec des glucides complexes et du magnésium. Les envies de sucre sont normales.',
};

const NUTRIENT_ICONS = {
  'Magnésium': '🧲',
  'Vitamine B6': '💊',
  'Calcium': '🦴',
  'Glucides complexes': '🌾',
  'Tryptophane': '🧠',
  'Fer': '🩸',
  'Vitamine C': '🍊',
  'Oméga-3': '🐟',
  'Zinc': '⚡',
  'Protéines': '💪',
  'Vitamine E': '🌿',
  'Probiotiques': '🦠',
  'Fibres': '🥦',
  'Antioxydants': '🫐',
  'Crucifères (DIM)': '🥬',
  'Eau': '💧',
  'Sélénium': '🌰',
  'Vitamine B12': '🔴',
};

// ——— Mapping santé : nutriments & superaliments par condition ———
const HEALTH_NUTRIENT_MAP = {
  'SPM sévère': ['Magnésium', 'Vitamine B6', 'Calcium', 'Oméga-3'],
  'Endométriose': ['Oméga-3', 'Antioxydants', 'Glutathion', 'Fer', 'Fibres'],
  'SOPK': ['Fibres', 'Zinc', 'Glucides complexes', 'Magnésium', 'Probiotiques'],
  'Cycles irréguliers': ['Zinc', 'Vitamines B', 'Vitamine B6', 'Protéines'],
};

const HEALTH_SUPERFOODS = {
  'SPM sévère': ['Chocolat noir', 'Chocolat noir 70%', 'Graines de courge', 'Bananes', 'Amandes', 'Épinards', 'Noix de cajou', 'Sardines'],
  'Endométriose': ['Saumon', 'Graines de lin', 'Brocoli', 'Épinards', 'Graines de chia', 'Avocat', 'Noix', 'Maquereau', 'Huile d\'olive'],
  'SOPK': ['Lentilles', 'Graines de lin', 'Brocoli', 'Graines de chia', 'Avoine', 'Cannelle', 'Quinoa', 'Patate douce', 'Sarrasin', 'Amandes'],
  'Cycles irréguliers': ['Graines de lin', 'Graines de courge', 'Avocat', 'Noix', 'Saumon', 'Œufs', 'Graines de sésame', 'Zinc'],
};

// Pseudo-random basé sur la date du jour (stable dans la journée)
const seededRandom = (seed) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const getDaySeed = () => {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
};

const MEAL_SLOTS = [
  { key: 'breakfast', time: 'Matin', icon: '🌅' },
  { key: 'lunch', time: 'Midi', icon: '☀️' },
  { key: 'snack', time: 'Snack', icon: '🍪' },
  { key: 'dinner', time: 'Soir', icon: '🌙' },
];

const DRINK_ICONS = {
  'tisane': '🍵', 'infusion': '🍵', 'thé': '🍵', 'matcha': '🍵',
  'lait': '🥛', 'golden': '🥛', 'smoothie': '🥤', 'jus': '🥤',
  'eau': '💧', 'kéfir': '🥛', 'kombucha': '🍵',
};

const getDrinkIcon = (drinkName) => {
  const lower = drinkName.toLowerCase();
  for (const [keyword, icon] of Object.entries(DRINK_ICONS)) {
    if (lower.includes(keyword)) return icon;
  }
  return '🍵';
};

// Mots-clés allergènes (même liste que Recettes.jsx)
const ALLERGEN_KEYWORDS = {
  'Fruits à coque': ['amande', 'noix', 'noisette', 'pistache', 'cajou', 'pécan', 'macadamia', 'pralin'],
  'Arachides': ['arachide', 'cacahuète', 'cacahouète', 'beurre de cacahuète', 'peanut'],
  'Soja': ['soja', 'tofu', 'tempeh', 'edamame', 'miso', 'sauce soja', 'tamari'],
  'Œufs': ['œuf', 'oeuf', 'jaune d\'œuf', 'blanc d\'œuf', 'mayonnaise'],
  'Poisson': ['saumon', 'thon', 'cabillaud', 'sardine', 'maquereau', 'truite', 'anchois', 'bar', 'dorade', 'poisson'],
  'Crustacés': ['crevette', 'crabe', 'homard', 'langoustine', 'crustacé', 'fruits de mer', 'gambas'],
  'Lait': ['lait', 'fromage', 'beurre', 'crème fraîche', 'crème liquide', 'yaourt', 'ricotta', 'parmesan', 'mozzarella', 'gruyère', 'feta', 'mascarpone'],
  'Blé': ['blé', 'farine', 'pain', 'pâtes', 'spaghetti', 'penne', 'couscous', 'boulgour', 'semoule', 'tortilla', 'wrap'],
  'Sésame': ['sésame', 'tahini', 'tahin'],
  'Céleri': ['céleri', 'celeri'],
  'Moutarde': ['moutarde'],
};

const containsAllergen = (recipe, allergyList) => {
  if (!allergyList || allergyList.length === 0) return false;
  const fullText = ((recipe.ingredients || []).join(' ') + ' ' + (recipe.name || '')).toLowerCase();
  return allergyList.some(allergy => {
    const keywords = ALLERGEN_KEYWORDS[allergy] || [];
    return keywords.some(kw => fullText.includes(kw.toLowerCase()));
  });
};

const buildDailyMenu = (phase, phaseData, { requiredTags = [], allergies = [], cookingLevel, cookingTime } = {}) => {
  const recipes = RECIPES[phase];
  if (!recipes) return [];
  const rand = seededRandom(getDaySeed() + phase.charCodeAt(0));
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

  return MEAL_SLOTS.map((slot) => {
    const pool = recipes[slot.key];
    if (!pool || pool.length === 0) return null;

    // Filtrer le pool selon le profil
    const filtered = pool.filter(recipe => {
      if (requiredTags.length > 0 && !requiredTags.every(tag => (recipe.tags || []).includes(tag))) return false;
      if (containsAllergen(recipe, allergies)) return false;
      const recipeLevel = LEVEL_ORDER[recipe.difficulty] || 1;
      if (recipeLevel > maxLevel) return false;
      if (maxTime && parseMinutes(recipe.prepTime) > maxTime) return false;
      return true;
    });

    const available = filtered.length > 0 ? filtered : pool; // fallback si aucun résultat
    const idx = Math.floor(rand() * available.length);
    const recipe = available[idx];
    const drinkIdx = Math.floor(rand() * goodDrinks.length);
    const drink = goodDrinks[drinkIdx] || null;
    return {
      ...slot,
      recipe,
      drink: drink?.name || '',
      drinkIcon: drink ? getDrinkIcon(drink.name) : '🍵',
    };
  }).filter(Boolean);
};

export default function Alimentation() {
  const { cycleInfo, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime } = useCycle();
  const [openNutrient, setOpenNutrient] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [openDailyRecipe, setOpenDailyRecipe] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const titles = PHASE_FOOD_TITLES[phase];
  const nutrientsFull = phaseData.nutrientsFull || {};
  const dailyMenu = useMemo(() => {
    const tags = [];
    const prefs = dietPreferences || ['omnivore'];
    const issues = healthIssues || [];
    if (prefs.includes('Végane')) tags.push('vegan');
    else if (prefs.includes('Végétarienne')) tags.push('vegetarien');
    if (prefs.includes('Sans gluten')) tags.push('sans_gluten');
    if (prefs.includes('Sans lactose')) tags.push('sans_lactose');
    if (issues.includes('SOPK')) tags.push('sopk_friendly');
    return buildDailyMenu(phase, phaseData, {
      requiredTags: tags,
      allergies: allergies || [],
      cookingLevel,
      cookingTime,
    });
  }, [phase, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime]);

  // ——— Filtrage alimentaire selon le profil ———
  const requiredTags = (() => {
    const tags = [];
    const prefs = dietPreferences || ['omnivore'];
    const issues = healthIssues || [];
    if (prefs.includes('Végane')) tags.push('vegan');
    else if (prefs.includes('Végétarienne')) tags.push('vegetarien');
    if (prefs.includes('Sans gluten')) tags.push('sans_gluten');
    if (prefs.includes('Sans lactose')) tags.push('sans_lactose');
    if (issues.includes('SOPK')) tags.push('sopk_friendly');
    return tags;
  })();

  const filterFoods = (foods) => {
    if (!requiredTags.length) return foods;
    const filtered = foods.filter(f => requiredTags.every(tag => (f.tags || []).includes(tag)));
    return filtered; // si rien ne matche, on n'affiche rien
  };

  const isFiltering = requiredTags.length > 0;

  // ——— Badges santé ———
  const userIssues = healthIssues || [];
  const beneficialNutrients = new Set(
    userIssues.flatMap(issue => HEALTH_NUTRIENT_MAP[issue] || [])
  );
  const superfoodSet = new Set(
    userIssues.flatMap(issue => HEALTH_SUPERFOODS[issue] || [])
  );
  const hasHealthBadges = userIssues.length > 0;

  const dietLabel = (() => {
    const labels = [];
    const prefs = dietPreferences || [];
    if (prefs.includes('Végane')) labels.push('Végane');
    else if (prefs.includes('Végétarienne')) labels.push('Végétarienne');
    if (prefs.includes('Sans gluten')) labels.push('Sans gluten');
    if (prefs.includes('Sans lactose')) labels.push('Sans lactose');
    if ((healthIssues || []).includes('SOPK')) labels.push('SOPK');
    return labels.join(' · ');
  })();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <TopMenu />

      {/* ===== HERO SECTION ===== */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] px-6 pt-6 pb-7 relative overflow-hidden"
          style={{
            background: `linear-gradient(145deg, ${phaseData.bgColor} 0%, ${phaseData.color}18 100%)`,
          }}
        >
          {/* Decorative circle */}
          <div
            className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: phaseData.color }}
          />
          <div
            className="absolute bottom-4 -left-6 w-20 h-20 rounded-full opacity-10"
            style={{ backgroundColor: phaseData.color }}
          />

          <div className="relative">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.2em] mb-3" style={{ color: phaseData.color }}>
              {phaseData.shortName} · Nutrition
            </p>
            <h1 className="font-display text-[30px] md:text-4xl text-luna-text leading-tight mb-3">
              {titles.main}{' '}
              <em style={{ color: phaseData.colorDark }}>{titles.italic}</em>
            </h1>
            <p className="text-sm font-body text-luna-text-body leading-relaxed">
              {PHASE_FOOD_INTROS[phase]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ===== TA JOURNÉE IDÉALE ===== */}
      <motion.div variants={item}>
        <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.05)' }}>
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}18)` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[14px] flex items-center justify-center"
                  style={{ backgroundColor: `${phaseData.color}20` }}
                >
                  <UtensilsCrossed size={18} style={{ color: phaseData.colorDark }} />
                </div>
                <div>
                  <h2 className="font-display text-lg text-luna-text leading-tight">Ta journée idéale</h2>
                  <p className="text-[10px] font-body text-luna-text-hint mt-0.5">Change chaque jour · Adaptée à ta phase</p>
                </div>
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="bg-white px-4 py-3">
            <div className="space-y-2">
              {dailyMenu.map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  onClick={() => setOpenDailyRecipe(m.recipe)}
                  className="flex items-center gap-3 rounded-[16px] p-3 transition-all cursor-pointer active:scale-[0.98]"
                  style={{ backgroundColor: i % 2 === 0 ? `${phaseData.color}06` : 'transparent' }}
                >
                  {/* Emoji recette */}
                  <div
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: phaseData.bgColor }}
                  >
                    <span className="text-2xl">{m.recipe.emoji || m.icon}</span>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-body font-bold uppercase tracking-wider" style={{ color: phaseData.color }}>{m.time}</span>
                      <span className="text-[9px] font-body text-luna-text-hint">·</span>
                      <span className="text-[9px] font-body text-luna-text-hint">{m.recipe.prepTime}</span>
                    </div>
                    <p className="text-[13px] font-body font-semibold text-luna-text leading-snug truncate">{m.recipe.name}</p>
                    {m.drink && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px]">{m.drinkIcon}</span>
                        <span className="text-[10px] font-body text-luna-text-muted">{m.drink}</span>
                      </div>
                    )}
                  </div>

                  {/* Calories */}
                  <div className="flex-shrink-0 text-right">
                    <span
                      className="text-[10px] font-body font-bold px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${phaseData.color}12`, color: phaseData.colorDark }}
                    >
                      {m.recipe.calories} kcal
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* À limiter */}
          <div className="px-5 py-3.5" style={{ backgroundColor: '#FDF8F8' }}>
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle size={12} style={{ color: '#C4727F' }} />
              <p className="text-[10px] font-body font-bold uppercase tracking-wider" style={{ color: '#A3555F' }}>
                À limiter
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phaseData.drinks.bad.map((d, i) => (
                <span
                  key={i}
                  className="text-[11px] font-body font-semibold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: '#D4727F12', color: '#A3555F' }}
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          {/* Bouton recettes */}
          <Link
            to="/recettes"
            className="flex items-center justify-center gap-2 px-5 py-3.5 transition-all hover:opacity-80"
            style={{ backgroundColor: phaseData.bgColor }}
          >
            <span className="text-[12px] font-body font-bold" style={{ color: phaseData.colorDark }}>
              Voir toutes les recettes
            </span>
            <ChevronRight size={14} style={{ color: phaseData.colorDark }} />
          </Link>
        </div>
      </motion.div>

      {/* ===== NUTRIMENTS PRIORITAIRES ===== */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.05)' }}>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-[12px] flex items-center justify-center"
              style={{ backgroundColor: `${phaseData.color}15` }}
            >
              <Sparkles size={16} style={{ color: phaseData.colorDark }} />
            </div>
            <div>
              <h2 className="font-display text-lg text-luna-text leading-tight">Nutriments prioritaires</h2>
              <p className="text-[10px] font-body text-luna-text-hint mt-0.5">Clique pour voir les aliments</p>
            </div>
          </div>

          {/* Nutrient grid — 2 columns */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {phaseData.nutrients.map((n) => {
              const isBeneficial = hasHealthBadges && beneficialNutrients.has(n);
              const isActive = openNutrient === n;
              const icon = NUTRIENT_ICONS[n] || '✨';
              return (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setOpenNutrient(isActive ? null : n); setSelectedFood(null); }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-[16px] text-left transition-all duration-300"
                  style={isActive ? {
                    backgroundColor: phaseData.color,
                    color: 'white',
                    boxShadow: `0 4px 16px ${phaseData.color}35`,
                  } : {
                    backgroundColor: phaseData.bgColor,
                    color: phaseData.colorDark,
                  }}
                >
                  <span className="text-lg flex-shrink-0">{icon}</span>
                  <span className="text-[13px] font-body font-semibold leading-tight">{n}</span>
                  {isBeneficial && (
                    <span className="text-[9px] ml-auto flex-shrink-0" title="Recommandé pour ta santé">💚</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {hasHealthBadges && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
              <span className="text-[10px]">💚</span>
              <p className="text-[10px] font-body text-luna-text-hint">
                = Nutriment clé pour {userIssues.join(' & ')}
              </p>
              <span className="text-[10px] ml-2">⭐</span>
              <p className="text-[10px] font-body text-luna-text-hint">
                = Superaliment pour toi
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== NUTRIENT DETAIL (expanded) ===== */}
      <AnimatePresence mode="wait">
        {openNutrient && nutrientsFull[openNutrient] && (
          <motion.div
            key={openNutrient}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}
            >
              {/* Header band */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}20)` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{NUTRIENT_ICONS[openNutrient] || '✨'}</span>
                    <h3 className="font-display text-xl text-luna-text">{openNutrient}</h3>
                  </div>
                  <button
                    onClick={() => setOpenNutrient(null)}
                    className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X size={14} className="text-luna-text-muted" />
                  </button>
                </div>
                <p className="text-sm font-body text-luna-text-body leading-relaxed">
                  {nutrientsFull[openNutrient].why}
                </p>
              </div>

              {/* Foods grid */}
              <div className="bg-white px-5 py-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">
                    Aliments riches en {openNutrient.toLowerCase()}
                  </p>
                  {isFiltering && (
                    <span
                      className="text-[9px] font-body font-semibold px-2.5 py-1 rounded-pill"
                      style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}
                    >
                      🌱 {dietLabel}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {filterFoods(nutrientsFull[openNutrient].foods).map((food, i) => {
                    const isActive = selectedFood === food.name;
                    const isSuperfood = hasHealthBadges && superfoodSet.has(food.name);
                    return (
                      <motion.button
                        key={food.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => setSelectedFood(isActive ? null : food.name)}
                        className="flex flex-col items-center gap-1.5 transition-all"
                      >
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl transition-all duration-200"
                            style={{
                              backgroundColor: isActive ? `${phaseData.color}25` : phaseData.bgColor,
                              border: isActive ? `2px solid ${phaseData.color}` : '2px solid transparent',
                              transform: isActive ? 'scale(1.1)' : 'scale(1)',
                              boxShadow: isActive ? `0 4px 12px ${phaseData.color}20` : 'none',
                            }}
                          >
                            {food.emoji}
                          </div>
                          {isSuperfood && (
                            <div
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                              style={{ backgroundColor: 'white', boxShadow: '0 1px 4px rgba(45,34,38,0.12)' }}
                              title="Particulièrement bénéfique pour toi"
                            >
                              ⭐
                            </div>
                          )}
                        </div>
                        <span
                          className="text-[11px] font-body text-center leading-tight transition-colors"
                          style={{
                            color: isActive ? phaseData.colorDark : '#4A3F43',
                            fontWeight: isActive ? 700 : 500,
                          }}
                        >
                          {food.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Food detail or general tip */}
                {(() => {
                  const activeFoodData = selectedFood
                    ? filterFoods(nutrientsFull[openNutrient].foods).find((f) => f.name === selectedFood)
                    : null;
                  const displayText = activeFoodData?.why || nutrientsFull[openNutrient].tip;
                  if (!displayText) return null;
                  return (
                    <motion.div
                      key={selectedFood || 'tip'}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 flex items-start gap-2.5 rounded-[16px] px-4 py-3.5"
                      style={{ backgroundColor: `${phaseData.color}08`, border: `1px solid ${phaseData.color}15` }}
                    >
                      <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                      <p className="text-xs font-body text-luna-text-body leading-relaxed">
                        {displayText}
                      </p>
                    </motion.div>
                  );
                })()}

                {/* Lien vers recettes */}
                <Link
                  to={`/recettes?nutrient=${encodeURIComponent(openNutrient)}`}
                  className="mt-4 flex items-center justify-center gap-2 py-3 rounded-[14px] transition-all hover:opacity-80"
                  style={{ backgroundColor: phaseData.bgColor }}
                >
                  <UtensilsCrossed size={13} style={{ color: phaseData.colorDark }} />
                  <span className="text-[12px] font-body font-bold" style={{ color: phaseData.colorDark }}>
                    Recettes riches en {openNutrient.toLowerCase()}
                  </span>
                  <ChevronRight size={13} style={{ color: phaseData.colorDark }} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== ENVIES DE SUCRE — Luteal only ===== */}
      {phase === 'luteal' && phaseData.sugarCravings && (
        <motion.div variants={item}>
          <div
            className="rounded-[24px] overflow-hidden"
            style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.05)' }}
          >
            <div
              className="px-5 pt-5 pb-4"
              style={{ background: `linear-gradient(135deg, #FFF5E6, #FFECD2)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: '#E8A87C30' }}>
                  <Cookie size={18} style={{ color: '#D4846A' }} />
                </div>
                <div>
                  <h3 className="font-display text-lg text-luna-text">Envies de sucre ?</h3>
                  <p className="text-[10px] font-body text-luna-text-muted mt-0.5">C'est normal en phase lutéale</p>
                </div>
              </div>
            </div>
            <div className="bg-white px-5 py-4">
              <p className="text-sm font-body text-luna-text-body leading-relaxed mb-4">
                {phaseData.sugarCravings.explanation}
              </p>
              <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-3">
                Alternatives saines
              </p>
              <div className="flex flex-wrap gap-2">
                {phaseData.sugarCravings.alternatives.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs font-body font-semibold px-3.5 py-2 rounded-[12px]"
                    style={{ backgroundColor: '#FFF5E6', color: '#B8764A', border: '1px solid #E8A87C25' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ===== FRUITS & LÉGUMES DE SAISON ===== */}
      {(() => {
        const currentMonth = new Date().getMonth() + 1;
        const seasonal = SEASONAL_FOODS[currentMonth];
        const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        if (!seasonal) return null;

        const FoodCard = ({ name, delay }) => {
          const imgSrc = FOOD_IMAGES[name];
          const emoji = FOOD_EMOJIS[name] || '🍽️';
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay * 0.04, duration: 0.4, ease: 'easeOut' }}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: '#FAF5F0', boxShadow: '0 2px 8px rgba(45,34,38,0.06)' }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={name}
                    loading="lazy"
                    className="w-12 h-12 object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                ) : null}
                <span className="text-xl" style={{ display: imgSrc ? 'none' : 'block' }}>{emoji}</span>
              </div>
              <span className="text-[10px] font-body font-semibold text-luna-text-body text-center leading-tight">{name}</span>
            </motion.div>
          );
        };

        return (
          <motion.div variants={item}>
            <div
              className="rounded-[24px] overflow-hidden"
              style={{ background: 'linear-gradient(180deg, #FDFBF8 0%, #FAF7F5 100%)', boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-2 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Leaf size={14} style={{ color: '#B09ACB' }} />
                  <p className="text-[10px] font-body font-bold uppercase tracking-[0.25em]" style={{ color: '#B09ACB' }}>
                    De saison
                  </p>
                </div>
                <h3 className="font-display text-3xl text-luna-text">
                  {monthNames[currentMonth]}
                </h3>
              </div>

              {/* Fruits */}
              <div className="px-5 pt-5 pb-4">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#F5DFD0' }} />
                  <h4 className="text-[10px] font-body font-bold uppercase tracking-[0.2em] px-3" style={{ color: '#D4846A' }}>
                    Fruits du mois
                  </h4>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#F5DFD0' }} />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {seasonal.fruits.map((fruit, i) => (
                    <FoodCard key={fruit} name={fruit} delay={i} />
                  ))}
                </div>
              </div>

              {/* Légumes */}
              <div className="px-5 pt-3 pb-5">
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: '#D4E8D4' }} />
                  <h4 className="text-[10px] font-body font-bold uppercase tracking-[0.2em] px-3" style={{ color: '#5A8A5E' }}>
                    Légumes du mois
                  </h4>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#D4E8D4' }} />
                </div>
                <div className="grid grid-cols-5 gap-y-3 gap-x-2 justify-items-center">
                  {seasonal.legumes.map((legume, i) => (
                    <FoodCard key={legume} name={legume} delay={seasonal.fruits.length + i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* ===== RECIPE DETAIL MODAL ===== */}
      <AnimatePresence>
        {openDailyRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => setOpenDailyRecipe(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] w-full max-w-md overflow-y-auto"
              style={{ maxHeight: '92vh' }}
            >
              {/* Emoji Header */}
              <div
                className="relative h-40 overflow-hidden rounded-t-[28px] md:rounded-t-[24px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}25)` }}
              >
                <span className="text-7xl">{openDailyRecipe.emoji || '🍽️'}</span>
                <button
                  onClick={() => setOpenDailyRecipe(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
              </div>

              <div className="p-5 pb-10 space-y-5">
                {/* Title */}
                <div>
                  <h3 className="font-display text-xl text-luna-text">{openDailyRecipe.name}</h3>
                  {openDailyRecipe.description && (
                    <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{openDailyRecipe.description}</p>
                  )}
                </div>

                {/* Why this phase */}
                {openDailyRecipe.whyThisPhase && (
                  <div
                    className="flex items-start gap-2.5 rounded-[14px] px-4 py-3"
                    style={{ backgroundColor: `${phaseData.color}10` }}
                  >
                    <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                    <p className="text-xs font-body leading-relaxed italic" style={{ color: phaseData.colorDark }}>
                      {openDailyRecipe.whyThisPhase}
                    </p>
                  </div>
                )}

                {/* Time + Calories + Nutrients */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                    <Clock size={12} /> {openDailyRecipe.prepTime}
                  </span>
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                    {openDailyRecipe.calories} kcal
                  </span>
                  {(openDailyRecipe.nutrients || []).map((n) => (
                    <span
                      key={n}
                      className="text-[10px] font-body font-semibold px-2.5 py-1 rounded-pill"
                      style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                {/* Ingredients */}
                {openDailyRecipe.ingredients && (
                  <div>
                    <h4 className="text-sm font-body font-bold text-luna-text mb-2">Ingrédients</h4>
                    <ul className="space-y-1.5">
                      {openDailyRecipe.ingredients.map((ing, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-luna-text-body font-body">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: phaseData.color }}
                          />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <hr className="border-gray-50" />

                {/* Steps */}
                {openDailyRecipe.steps && (
                  <div>
                    <h4 className="text-sm font-body font-bold text-luna-text mb-2">Préparation</h4>
                    <ol className="space-y-3">
                      {openDailyRecipe.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-luna-text-body font-body leading-relaxed">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: phaseData.color }}
                          >
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
