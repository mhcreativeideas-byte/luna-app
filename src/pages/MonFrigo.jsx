import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, X, Search, Sparkles, Clock, ChefHat } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { RECIPES } from '../data/recipes';
import { PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Catégories d'ingrédients pour sélection rapide
const INGREDIENT_CATEGORIES = [
  {
    id: 'fruits',
    label: 'Fruits',
    icon: '🍎',
    items: ['Pomme', 'Banane', 'Orange', 'Citron', 'Citron vert', 'Fraise', 'Framboise', 'Myrtille', 'Mangue',
      'Avocat', 'Poire', 'Kiwi', 'Cerise', 'Abricot', 'Pêche', 'Melon', 'Pastèque',
      'Raisin', 'Figue', 'Ananas', 'Noix de coco', 'Grenade', 'Açaí', 'Datte'],
  },
  {
    id: 'legumes',
    label: 'Légumes',
    icon: '🥬',
    items: ['Tomate', 'Concombre', 'Carotte', 'Courgette', 'Aubergine', 'Poivron', 'Brocoli',
      'Épinard', 'Laitue', 'Chou', 'Chou-fleur', 'Chou kale', 'Patate douce', 'Pomme de terre',
      'Oignon', 'Ail', 'Gingembre', 'Betterave', 'Radis', 'Fenouil', 'Céleri',
      'Poireau', 'Asperge', 'Maïs', 'Potimarron', 'Champignon'],
  },
  {
    id: 'proteines',
    label: 'Protéines',
    icon: '🥩',
    items: ['Poulet', 'Bœuf', 'Saumon', 'Thon', 'Sardines', 'Maquereau', 'Crevettes', 'Cabillaud',
      'Tofu', 'Tempeh', 'Œuf', 'Lentilles', 'Lentilles corail', 'Pois chiches',
      'Haricots rouges', 'Haricots noirs', 'Haricots blancs', 'Edamame'],
  },
  {
    id: 'laitiers',
    label: 'Laitiers',
    icon: '🧀',
    items: ['Lait', 'Lait d\'amande', 'Lait d\'avoine', 'Lait de coco', 'Yaourt',
      'Fromage', 'Crème fraîche', 'Beurre', 'Mozzarella', 'Parmesan', 'Feta', 'Chèvre', 'Ricotta'],
  },
  {
    id: 'feculents',
    label: 'Féculents',
    icon: '🌾',
    items: ['Riz', 'Riz complet', 'Quinoa', 'Avoine', 'Flocons d\'avoine', 'Pâtes', 'Pâtes complètes',
      'Pain complet', 'Sarrasin', 'Boulgour', 'Semoule', 'Tortilla', 'Farine', 'Nouilles'],
  },
  {
    id: 'graines',
    label: 'Graines & Noix',
    icon: '🥜',
    items: ['Amandes', 'Noix', 'Noix de cajou', 'Noisettes', 'Pistaches', 'Graines de lin',
      'Graines de chia', 'Graines de courge', 'Graines de tournesol', 'Graines de sésame',
      'Cacahuètes', 'Beurre de cacahuète', 'Beurre d\'amande', 'Tahini'],
  },
  {
    id: 'condiments',
    label: 'Épices & Co',
    icon: '🌿',
    items: ['Huile d\'olive', 'Vinaigre balsamique', 'Sauce soja', 'Tamari', 'Miel', 'Sirop d\'érable',
      'Curcuma', 'Cannelle', 'Chocolat noir', 'Cacao', 'Vanille', 'Basilic', 'Menthe',
      'Persil', 'Coriandre', 'Curry', 'Paprika', 'Moutarde', 'Houmous', 'Miso',
      'Spiruline', 'Matcha'],
  },
];

// Liste complète pour l'auto-complétion
const ALL_INGREDIENTS = INGREDIENT_CATEGORIES.flatMap((cat) => cat.items);

// Normaliser pour la recherche (gère œ→oe, æ→ae, etc.)
function normalize(str) {
  return str.toLowerCase().replace(/œ/g, 'oe').replace(/æ/g, 'ae').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Calculer le score de matching d'une recette avec les ingrédients du frigo
function getMatchScore(recipe, fridgeItems) {
  if (!recipe.ingredients || !fridgeItems.length) return { score: 0, matched: [], missing: [] };
  const normalizedFridge = fridgeItems.map(normalize);
  const matched = [];
  const missing = [];

  recipe.ingredients.forEach((ing) => {
    const normIng = normalize(ing);
    const found = normalizedFridge.some((fi) => normIng.includes(fi) || fi.includes(normIng));
    if (found) matched.push(ing);
    else missing.push(ing);
  });

  const score = recipe.ingredients.length > 0
    ? Math.round((matched.length / recipe.ingredients.length) * 100)
    : 0;

  return { score, matched, missing };
}

// Extraire les minutes depuis le champ prepTime
function parseMinutes(prepTime) {
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
}

// Mots-clés allergènes
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
  'Sulfites': ['vin blanc', 'vin rouge', 'vin rosé', 'vinaigre balsamique', 'sulfite'],
};

function containsAllergen(recipe, allergyList) {
  if (!allergyList || allergyList.length === 0) return false;
  const ingredientsText = (recipe.ingredients || []).join(' ').toLowerCase();
  const nameText = recipe.name?.toLowerCase() || '';
  const fullText = ingredientsText + ' ' + nameText;
  return allergyList.some((allergy) => {
    const keywords = ALLERGEN_KEYWORDS[allergy] || [];
    return keywords.some((kw) => fullText.includes(kw.toLowerCase()));
  });
}

export default function MonFrigo() {
  const navigate = useNavigate();
  const { cycleInfo, dietPreferences, healthIssues, cookingTime, cookingLevel, allergies } = useCycle();
  const [searchQuery, setSearchQuery] = useState('');
  const [fridgeItems, setFridgeItems] = useState(() => {
    try {
      const saved = localStorage.getItem('luna-frigo');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [openRecipe, setOpenRecipe] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const inputRef = useRef(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];

  // Persister dans localStorage
  useEffect(() => {
    localStorage.setItem('luna-frigo', JSON.stringify(fridgeItems));
  }, [fridgeItems]);

  // Auto-complétion
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const norm = normalize(searchQuery);
    return ALL_INGREDIENTS
      .filter((ing) => !fridgeItems.includes(ing) && normalize(ing).includes(norm))
      .slice(0, 6);
  }, [searchQuery, fridgeItems]);

  const addItem = (item) => {
    if (!fridgeItems.includes(item)) {
      setFridgeItems((prev) => [...prev, item]);
    }
    setSearchQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeItem = (item) => {
    setFridgeItems((prev) => prev.filter((i) => i !== item));
  };

  const addCustomItem = () => {
    const trimmed = searchQuery.trim();
    if (trimmed && !fridgeItems.includes(trimmed)) {
      setFridgeItems((prev) => [...prev, trimmed]);
    }
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Tags requis selon le profil
  const requiredTags = useMemo(() => {
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
  }, [dietPreferences, healthIssues]);

  // Temps max
  const maxTime = (() => {
    const time = cookingTime || '';
    if (!time || time === '60min+') return null;
    if (time === '15min') return 15;
    if (time === '30min') return 30;
    if (time === '45min') return 45;
    return null;
  })();

  // Niveau max
  const LEVEL_ORDER = { debutant: 1, intermediaire: 2, avance: 3 };
  const maxLevel = LEVEL_ORDER[cookingLevel] || 3;

  // Calculer les recettes matchées, triées par score
  const matchedRecipes = useMemo(() => {
    if (!fridgeItems.length) return [];

    const results = [];
    const recipes = RECIPES[phase];
    if (!recipes) return [];

    Object.entries(recipes).forEach(([mealType, items]) => {
      if (!Array.isArray(items)) return;
      items.forEach((recipe) => {
        // Filtrer par tags alimentaires
        if (requiredTags.length > 0) {
          const recipeTags = recipe.tags || [];
          if (!requiredTags.every(tag => recipeTags.includes(tag))) return;
        }
        // Filtrer par temps
        if (maxTime && parseMinutes(recipe.prepTime) > maxTime) return;
        // Filtrer par allergies
        if (containsAllergen(recipe, allergies)) return;
        // Filtrer par niveau
        const recipeLevel = LEVEL_ORDER[recipe.difficulty] || 1;
        if (recipeLevel > maxLevel) return;

        // Calculer le matching
        const match = getMatchScore(recipe, fridgeItems);
        if (match.score > 0) {
          results.push({ ...recipe, mealType, ...match });
        }
      });
    });

    // Trier par score décroissant
    return results.sort((a, b) => b.score - a.score);
  }, [fridgeItems, phase, requiredTags, maxTime, allergies, maxLevel]);

  const mealLabels = {
    breakfast: 'PETIT-DÉJ',
    lunch: 'DÉJEUNER',
    dinner: 'DÎNER',
    snack: 'SNACK',
    drink: 'BOISSON',
  };

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
        <div>
          <h1 className="font-display text-2xl text-luna-text">Mon Frigo</h1>
          <p className="text-xs font-body text-luna-text-hint mt-0.5">
            Dis-nous ce que tu as, on te dit quoi cuisiner
          </p>
        </div>
      </motion.div>

      {/* Search input */}
      <motion.div variants={item} className="relative">
        <div
          className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3.5"
          style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.06)' }}
        >
          <Search size={18} className="text-luna-text-hint flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (suggestions.length > 0) addItem(suggestions[0]);
                else addCustomItem();
              }
            }}
            placeholder="Ajoute un ingrédient..."
            className="flex-1 text-sm font-body text-luna-text bg-transparent focus:outline-none placeholder:text-luna-text-hint"
          />
          {searchQuery && (
            <button
              onClick={addCustomItem}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: phaseData.color, color: 'white' }}
            >
              <Plus size={16} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[16px] overflow-hidden z-30"
              style={{ boxShadow: '0 4px 20px rgba(45,34,38,0.12)' }}
            >
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => addItem(s)}
                  className="w-full text-left px-4 py-3 text-sm font-body text-luna-text-body hover:bg-luna-cream/50 transition-colors flex items-center gap-3 border-b border-gray-50 last:border-0"
                >
                  <Plus size={14} style={{ color: phaseData.color }} />
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Catégories d'ingrédients — sélection rapide */}
      {fridgeItems.length === 0 || activeCategory !== null ? (
        <motion.div variants={item}>
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
            {INGREDIENT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-xs font-body font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={activeCategory === cat.id ? {
                  backgroundColor: phaseData.color,
                  color: 'white',
                  boxShadow: `0 4px 12px ${phaseData.color}40`,
                } : {
                  backgroundColor: 'white',
                  color: '#8A7B7F',
                  boxShadow: '0 1px 4px rgba(45,34,38,0.06)',
                }}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Ingredient pills for selected category */}
          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pt-2">
                  {INGREDIENT_CATEGORIES.find((c) => c.id === activeCategory)?.items.map((ing) => {
                    const isInFridge = fridgeItems.includes(ing);
                    return (
                      <button
                        key={ing}
                        onClick={() => isInFridge ? removeItem(ing) : addItem(ing)}
                        className="px-3 py-1.5 rounded-pill text-xs font-body font-semibold transition-all border"
                        style={isInFridge ? {
                          backgroundColor: phaseData.bgColor,
                          borderColor: phaseData.color,
                          color: phaseData.colorDark,
                        } : {
                          backgroundColor: 'white',
                          borderColor: '#F0EEEC',
                          color: '#8A7B7F',
                        }}
                      >
                        {isInFridge && <span className="mr-1">✓</span>}
                        {ing}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {/* Frigo items */}
      <motion.div variants={item}>
        {fridgeItems.length === 0 && !activeCategory ? (
          <div className="text-center py-8 bg-white rounded-[20px]" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
            <p className="text-4xl mb-3">🧊</p>
            <p className="text-sm font-body text-luna-text-muted mb-1">Ton frigo est vide !</p>
            <p className="text-xs font-body text-luna-text-hint">
              Sélectionne une catégorie ci-dessus ou tape un ingrédient.
            </p>
          </div>
        ) : fridgeItems.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">
                Dans mon frigo ({fridgeItems.length})
              </p>
              <div className="flex items-center gap-3">
                {activeCategory === null && (
                  <button
                    onClick={() => setActiveCategory(INGREDIENT_CATEGORIES[0].id)}
                    className="text-[10px] font-body font-semibold transition-colors"
                    style={{ color: phaseData.color }}
                  >
                    + Ajouter
                  </button>
                )}
                <button
                  onClick={() => setFridgeItems([])}
                  className="text-[10px] font-body text-luna-text-hint hover:text-red-400 transition-colors"
                >
                  Tout vider
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {fridgeItems.map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-pill text-xs font-body font-semibold"
                  style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                >
                  {item}
                  <button
                    onClick={() => removeItem(item)}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/50 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}
      </motion.div>

      {/* Matched recipes */}
      {fridgeItems.length > 0 && (
        <motion.div variants={item}>
          <div className="flex items-center gap-2 mb-4">
            <ChefHat size={18} style={{ color: phaseData.color }} />
            <h2 className="font-display text-lg text-luna-text">
              {matchedRecipes.length > 0 ? `${matchedRecipes.length} recette${matchedRecipes.length > 1 ? 's' : ''} possible${matchedRecipes.length > 1 ? 's' : ''}` : 'Aucune recette trouvée'}
            </h2>
            <span className="text-[10px] font-body text-luna-text-hint ml-auto">
              Phase {phaseData.shortName}
            </span>
          </div>

          {matchedRecipes.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-[20px]" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
              <p className="text-sm font-body text-luna-text-muted mb-2">Ajoute plus d'ingrédients pour débloquer des recettes !</p>
              <Link
                to="/recettes"
                className="inline-flex items-center gap-2 text-sm font-body font-semibold transition-colors"
                style={{ color: phaseData.color }}
              >
                Voir toutes les recettes →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {matchedRecipes.map((recipe, i) => (
                <motion.button
                  key={`${recipe.mealType}-${recipe.name}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * Math.min(i, 10) }}
                  onClick={() => setOpenRecipe(i)}
                  className="w-full bg-white rounded-[20px] p-4 text-left flex gap-4 group"
                  style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}
                >
                  {/* Emoji thumbnail */}
                  <div
                    className="w-20 h-20 rounded-[14px] flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}20)` }}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-500">
                      {recipe.emoji || '🍽️'}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-body font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                        {mealLabels[recipe.mealType]}
                      </span>
                      <span className="text-[10px] font-body text-luna-text-hint flex items-center gap-1">
                        <Clock size={9} /> {recipe.prepTime}
                      </span>
                    </div>
                    <h3 className="font-display text-sm text-luna-text leading-snug mb-1.5 line-clamp-1">{recipe.name}</h3>

                    {/* Match indicator */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${recipe.score}%`,
                            backgroundColor: recipe.score >= 70 ? '#7BAE7F' : recipe.score >= 40 ? '#E8A87C' : '#D4727F',
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-body font-bold" style={{
                        color: recipe.score >= 70 ? '#7BAE7F' : recipe.score >= 40 ? '#E8A87C' : '#D4727F',
                      }}>
                        {recipe.score}%
                      </span>
                    </div>
                    <p className="text-[10px] font-body text-luna-text-hint mt-1">
                      {recipe.matched.length} ingrédient{recipe.matched.length > 1 ? 's' : ''} · {recipe.missing.length} manquant{recipe.missing.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {openRecipe !== null && matchedRecipes[openRecipe] && (
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
              {(() => {
                const recipe = matchedRecipes[openRecipe];
                return (
                  <>
                    <div
                      className="relative h-40 overflow-hidden rounded-t-[28px] md:rounded-t-[24px] flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}25)` }}
                    >
                      <span className="text-7xl">{recipe.emoji || '🍽️'}</span>
                      <button
                        onClick={() => setOpenRecipe(null)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                      >
                        <X size={16} className="text-luna-text-muted" />
                      </button>
                    </div>

                    <div className="p-5 space-y-5">
                      <div>
                        <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                          {mealLabels[recipe.mealType]}
                        </p>
                        <h3 className="font-display text-xl text-luna-text">{recipe.name}</h3>
                        <p className="text-xs font-body text-luna-text-hint mt-1">{recipe.description}</p>
                      </div>

                      {/* Match score */}
                      <div className="flex items-center gap-3 rounded-[14px] px-4 py-3" style={{ backgroundColor: recipe.score >= 70 ? '#EDF5ED' : recipe.score >= 40 ? '#FFF3EB' : '#FDE8EB' }}>
                        <Sparkles size={16} style={{ color: recipe.score >= 70 ? '#7BAE7F' : recipe.score >= 40 ? '#E8A87C' : '#D4727F' }} />
                        <div className="flex-1">
                          <p className="text-xs font-body font-semibold" style={{ color: recipe.score >= 70 ? '#4D7A50' : recipe.score >= 40 ? '#B06B3A' : '#A3555F' }}>
                            {recipe.score}% de matching avec ton frigo
                          </p>
                          <p className="text-[10px] font-body text-luna-text-hint mt-0.5">
                            {recipe.matched.length} ingrédient{recipe.matched.length > 1 ? 's' : ''} trouvé{recipe.matched.length > 1 ? 's' : ''} · {recipe.missing.length} manquant{recipe.missing.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Why this phase */}
                      {recipe.whyThisPhase && (
                        <div className="flex items-start gap-2.5 rounded-[14px] px-4 py-3" style={{ backgroundColor: `${phaseData.color}10` }}>
                          <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                          <p className="text-xs font-body leading-relaxed italic" style={{ color: phaseData.colorDark }}>
                            {recipe.whyThisPhase}
                          </p>
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                          <Clock size={12} /> {recipe.prepTime}
                        </span>
                        <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                          {recipe.calories} kcal
                        </span>
                      </div>

                      {/* Ingredients with match indicators */}
                      <div>
                        <h4 className="text-sm font-body font-bold text-luna-text mb-2">Ingrédients</h4>
                        <ul className="space-y-1.5">
                          {recipe.ingredients.map((ing, i) => {
                            const isMatched = recipe.matched.includes(ing);
                            return (
                              <li key={i} className="flex items-start gap-2.5 text-sm text-luna-text-body font-body">
                                <span
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] mt-0.5 flex-shrink-0"
                                  style={{
                                    backgroundColor: isMatched ? '#EDF5ED' : '#FDE8EB',
                                    color: isMatched ? '#7BAE7F' : '#D4727F',
                                  }}
                                >
                                  {isMatched ? '✓' : '✕'}
                                </span>
                                <span style={{ opacity: isMatched ? 1 : 0.6 }}>{ing}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      <hr className="border-gray-50" />

                      {/* Steps */}
                      <div>
                        <h4 className="text-sm font-body font-bold text-luna-text mb-2">Préparation</h4>
                        <ol className="space-y-3">
                          {recipe.steps.map((step, i) => (
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
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
