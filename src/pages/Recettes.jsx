import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, X, Sparkles, Filter } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { RECIPES } from '../data/recipes';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MEAL_TYPES = [
  { id: 'all', label: 'Tout', icon: '🍽️' },
  { id: 'breakfast', label: 'Petit-déj', icon: '🌅' },
  { id: 'lunch', label: 'Déjeuner', icon: '☀️' },
  { id: 'dinner', label: 'Dîner', icon: '🌙' },
  { id: 'snack', label: 'Snack', icon: '🍪' },
  { id: 'drink', label: 'Boisson', icon: '🥤' },
];

const PHASE_FILTERS = [
  { id: 'current', label: 'Ma phase' },
  { id: 'menstrual', label: 'Menstruelle', icon: '🌙' },
  { id: 'follicular', label: 'Folliculaire', icon: '🌱' },
  { id: 'ovulatory', label: 'Ovulatoire', icon: '☀️' },
  { id: 'luteal', label: 'Lutéale', icon: '🍂' },
];

const mealLabels = {
  breakfast: { label: 'Petit-déjeuner', tag: 'MORNING RITUAL' },
  lunch: { label: 'Déjeuner', tag: 'LUNCH' },
  dinner: { label: 'Dîner', tag: 'DINNER' },
  snack: { label: 'Snack', tag: 'SNACK' },
  drink: { label: 'Boisson', tag: 'BOISSON' },
};

export default function Recettes() {
  const navigate = useNavigate();
  const { cycleInfo, dietPreferences, healthIssues, cookingTime, allergies } = useCycle();
  const [selectedMeal, setSelectedMeal] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('current');
  const [openRecipe, setOpenRecipe] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const currentPhase = cycleInfo?.phase || 'follicular';
  const activePhase = selectedPhase === 'current' ? currentPhase : selectedPhase;
  const phaseData = PHASES[activePhase];
  const recipes = RECIPES[activePhase];

  // Filtrage alimentaire selon le profil
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

  const selectRecipe = (variants) => {
    if (!Array.isArray(variants)) return variants;
    if (variants.length === 1) return variants[0];
    if (!requiredTags.length) return variants[variants.length - 1];
    const match = variants.find(r => requiredTags.every(tag => (r.tags || []).includes(tag)));
    return match || variants[variants.length - 1];
  };

  // Temps max en minutes selon le profil onboarding
  const maxTime = (() => {
    if (!cookingTime) return null; // pas de limite
    if (cookingTime === '15min') return 15;
    if (cookingTime === '30min') return 30;
    if (cookingTime === '45min') return 45;
    return null; // '60min+' = pas de limite
  })();

  // Extraire les minutes depuis le champ prepTime (ex: "10 min", "1h15", "45 min")
  const parseMinutes = (prepTime) => {
    if (!prepTime) return 999;
    const str = prepTime.toLowerCase().replace(/\s/g, '');
    const hMatch = str.match(/(\d+)\s*h/);
    const mMatch = str.match(/(\d+)\s*min/);
    let total = 0;
    if (hMatch) total += parseInt(hMatch[1]) * 60;
    if (mMatch) total += parseInt(mMatch[1]);
    if (!hMatch && !mMatch) {
      const num = parseInt(str);
      if (!isNaN(num)) total = num;
      else total = 999;
    }
    return total;
  };

  // Mots-clés allergènes dans les ingrédients
  const ALLERGEN_KEYWORDS = {
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
    'Sulfites': ['vin', 'vinaigre balsamique', 'sulfite'],
  };

  // Vérifier si une recette contient un allergène
  const containsAllergen = (recipe, allergyList) => {
    if (!allergyList || allergyList.length === 0) return false;
    const ingredientsText = (recipe.ingredients || []).join(' ').toLowerCase();
    const nameText = recipe.name?.toLowerCase() || '';
    const fullText = ingredientsText + ' ' + nameText;
    return allergyList.some((allergy) => {
      const keywords = ALLERGEN_KEYWORDS[allergy] || [];
      return keywords.some((kw) => fullText.includes(kw.toLowerCase()));
    });
  };

  // Construire la liste de toutes les recettes filtrées
  const allRecipes = [];
  if (recipes) {
    Object.entries(recipes).forEach(([mealType, items]) => {
      if (selectedMeal !== 'all' && mealType !== selectedMeal) return;
      if (!Array.isArray(items)) return;
      items.forEach((recipe) => {
        // Filtrer par tags alimentaires (préférences)
        if (requiredTags.length > 0) {
          const recipeTags = recipe.tags || [];
          const matches = requiredTags.every(tag => recipeTags.includes(tag));
          if (!matches) return;
        }
        // Filtrer par temps de cuisine max
        if (maxTime && parseMinutes(recipe.prepTime) > maxTime) return;
        // Filtrer par allergies (exclure les recettes contenant un allergène)
        if (containsAllergen(recipe, allergies)) return;
        allRecipes.push({ ...recipe, mealType });
      });
    });
  }

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

  const openRecipeData = openRecipe !== null ? allRecipes[openRecipe] : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-2xl text-luna-text">Recettes & Boissons</h1>
          <p className="text-xs font-body text-luna-text-hint mt-0.5">
            {phaseData.shortName} · {allRecipes.length} recette{allRecipes.length > 1 ? 's' : ''}
            {dietLabel && <span className="ml-1.5 text-luna-text-muted">· 🌱 {dietLabel}</span>}
            {maxTime && <span className="ml-1.5 text-luna-text-muted">· 🕐 ≤ {maxTime} min</span>}
            {allergies?.length > 0 && <span className="ml-1.5 text-luna-text-muted">· 🚫 {allergies.length} allergène{allergies.length > 1 ? 's' : ''}</span>}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <Filter size={18} />
        </button>
      </motion.div>

      {/* Phase filter (collapsible) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {PHASE_FILTERS.map((pf) => (
                <button
                  key={pf.id}
                  onClick={() => setSelectedPhase(pf.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-xs font-body font-semibold whitespace-nowrap transition-all border-2 flex-shrink-0"
                  style={selectedPhase === pf.id ? {
                    borderColor: phaseData.color,
                    backgroundColor: phaseData.bgColor,
                    color: phaseData.colorDark,
                  } : {
                    borderColor: '#F0EEEC',
                    backgroundColor: 'white',
                    color: '#8A7B7F',
                  }}
                >
                  {pf.icon && <span>{pf.icon}</span>}
                  {pf.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meal type filter */}
      <motion.div variants={item}>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
          {MEAL_TYPES.map((mt) => (
            <button
              key={mt.id}
              onClick={() => setSelectedMeal(mt.id)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-pill text-xs font-body font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={selectedMeal === mt.id ? {
                backgroundColor: phaseData.color,
                color: 'white',
                boxShadow: `0 4px 12px ${phaseData.color}40`,
              } : {
                backgroundColor: 'white',
                color: '#8A7B7F',
                boxShadow: '0 1px 4px rgba(45,34,38,0.06)',
              }}
            >
              <span>{mt.icon}</span>
              {mt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Recipe Grid */}
      <motion.div variants={item}>
        {allRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🍽️</p>
            <p className="text-sm font-body text-luna-text-muted">
              Aucune recette pour ce filtre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {allRecipes.map((recipe, i) => (
              <motion.button
                key={`${recipe.mealType}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                onClick={() => setOpenRecipe(i)}
                className="text-left group"
              >
                <div
                  className="relative aspect-[4/3] rounded-[18px] overflow-hidden mb-2.5 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}20)` }}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                    {recipe.emoji || '🍽️'}
                  </span>
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-body font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill bg-white/90 backdrop-blur-sm text-luna-text">
                      {mealLabels[recipe.mealType]?.tag || recipe.mealType}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[9px] font-body flex items-center gap-1" style={{ color: phaseData.colorDark }}>
                      <Clock size={9} /> {recipe.prepTime}
                    </span>
                    <span className="text-[9px] font-body font-semibold px-1.5 py-0.5 rounded-pill" style={{ backgroundColor: `${phaseData.color}25`, color: phaseData.colorDark }}>
                      {recipe.calories} kcal
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-sm text-luna-text leading-snug line-clamp-2">{recipe.name}</h3>
                <p className="text-[10px] font-body text-luna-text-muted mt-0.5 leading-relaxed line-clamp-2">
                  {recipe.description}
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {openRecipeData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setOpenRecipe(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] md:rounded-[24px] w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Emoji Header */}
              <div
                className="relative h-40 overflow-hidden rounded-t-[28px] md:rounded-t-[24px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}25)` }}
              >
                <span className="text-7xl">{openRecipeData.emoji || '🍽️'}</span>
                <button
                  onClick={() => setOpenRecipe(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Title */}
                <div>
                  <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                    {mealLabels[openRecipeData.mealType]?.tag}
                  </p>
                  <h3 className="font-display text-xl text-luna-text">{openRecipeData.name}</h3>
                </div>

                {/* Why this phase */}
                {openRecipeData.whyThisPhase && (
                  <div
                    className="flex items-start gap-2.5 rounded-[14px] px-4 py-3"
                    style={{ backgroundColor: `${phaseData.color}10` }}
                  >
                    <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                    <p className="text-xs font-body leading-relaxed italic" style={{ color: phaseData.colorDark }}>
                      {openRecipeData.whyThisPhase}
                    </p>
                  </div>
                )}

                {/* Time + Calories + Nutrients */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                    <Clock size={12} /> {openRecipeData.prepTime}
                  </span>
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                    {openRecipeData.calories} kcal
                  </span>
                  {openRecipeData.nutrients.map((n) => (
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
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Ingrédients</h4>
                  <ul className="space-y-1.5">
                    {openRecipeData.ingredients.map((ing, i) => (
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

                <hr className="border-gray-50" />

                {/* Steps */}
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Préparation</h4>
                  <ol className="space-y-3">
                    {openRecipeData.steps.map((step, i) => (
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
