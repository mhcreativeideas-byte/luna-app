import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Sparkles, Filter, Heart, RotateCcw, Search, Zap, Sprout, Leaf, ChefHat, Flame } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import { useCycle } from '../contexts/CycleContext';
import { toast } from '../lib/toast';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildRequiredTags, buildDietLabel, filterRecipes, timeToMaxMinutes } from '../data/recipeFilters';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MEAL_TYPES = [
  { id: 'all', label: 'Tout', icon: '🍽️' },
  { id: 'favorites', label: 'Favoris', icon: '❤️' },
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

const CALORIE_OPTIONS = [
  { id: 200, label: '≤ 200' },
  { id: 350, label: '≤ 350' },
  { id: 500, label: '≤ 500' },
];

const CUISINES = [
  { id: 'francais', label: 'Français' },
  { id: 'italien', label: 'Italien' },
  { id: 'asiatique', label: 'Asiatique' },
  { id: 'mediterraneen', label: 'Médit.' },
  { id: 'indien', label: 'Indien' },
  { id: 'mexicain', label: 'Mexicain' },
  { id: 'fusion', label: 'Healthy' },
];

const mealLabels = {
  breakfast: { tag: 'MORNING RITUAL' },
  lunch: { tag: 'LUNCH' },
  dinner: { tag: 'DINNER' },
  snack: { tag: 'SNACK' },
  drink: { tag: 'BOISSON' },
};

export default function RecipesList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const nutrientFilter = searchParams.get('nutrient') || '';
  const { cycleInfo, dietPreferences, healthIssues, cookingTime, cookingLevel, allergies, favorites, dispatch } = useCycle();
  const [selectedMeal, setSelectedMeal] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('current');
  const [openRecipe, setOpenRecipe] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [favRecipes, setFavRecipes] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(cookingLevel || 'avance');
  const [selectedTime, setSelectedTime] = useState(cookingTime || '');
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedCalories, setSelectedCalories] = useState(null);
  const [search, setSearch] = useState('');

  const toggleFavorite = (recipeName) => {
    if (!favorites.includes(recipeName)) toast('Ajouté à tes favoris ❤️');
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { name: recipeName } });
  };
  const isFavorite = (recipeName) => favorites.includes(recipeName);

  const currentPhase = cycleInfo?.phase || 'follicular';
  const activePhase = selectedPhase === 'current' ? currentPhase : selectedPhase;
  const phaseData = PHASES[activePhase];
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setRecipes(null);
    RECIPE_LOADERS[activePhase]().then((data) => {
      if (!cancelled) setRecipes(data);
    });
    return () => { cancelled = true; };
  }, [activePhase]);

  // Favoris inter-phases : charge toutes les phases une fois, quand on ouvre
  // « Mes favoris », pour montrer un favori quelle que soit sa phase d'origine.
  useEffect(() => {
    if (selectedMeal !== 'favorites' || favRecipes) return;
    let cancelled = false;
    Promise.all(
      Object.entries(RECIPE_LOADERS).map(([ph, loader]) => loader().then((data) => ({ ph, data })))
    ).then((results) => {
      if (cancelled) return;
      const list = [];
      results.forEach(({ ph, data }) => {
        Object.entries(data).forEach(([mealType, items]) => {
          if (!Array.isArray(items)) return;
          items.forEach((r) => list.push({ ...r, mealType, phase: ph }));
        });
      });
      setFavRecipes(list);
    });
    return () => { cancelled = true; };
  }, [selectedMeal, favRecipes]);

  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);
  const dietLabel = buildDietLabel(dietPreferences, healthIssues);
  const maxTime = timeToMaxMinutes(selectedTime);

  const allRecipes = filterRecipes(recipes, {
    selectedMeal, requiredTags, allergies, selectedLevel, selectedTime, selectedCuisines, nutrientFilter, maxCalories: selectedCalories,
  });

  const isFavMode = selectedMeal === 'favorites';
  const recipesLoading = isFavMode ? !favRecipes : !recipes;
  const baseRecipes = isFavMode ? (favRecipes || []).filter((r) => isFavorite(r.name)) : allRecipes;
  const searchQuery = search.trim().toLowerCase();
  const displayedRecipes = searchQuery
    ? baseRecipes.filter((r) => (r.name || '').toLowerCase().includes(searchQuery) || (r.description || '').toLowerCase().includes(searchQuery))
    : baseRecipes;
  const openRecipeData = openRecipe !== null ? displayedRecipes[openRecipe] : null;

  const hasActiveFilters = selectedPhase !== 'current' || selectedLevel !== 'avance' || (selectedTime && selectedTime !== '60min+') || selectedCuisines.length > 0 || selectedCalories;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      {/* En-tête */}
      <motion.div variants={item}>
        <BackButton />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-2xl text-luna-text leading-tight">Toutes les recettes</h1>
            <p className="text-xs font-body text-luna-text-hint mt-0.5">
              {allRecipes.length} recette{allRecipes.length > 1 ? 's' : ''} adaptées à ta phase
              {dietLabel && <span> · 🌱 {dietLabel}</span>}
              {maxTime && <span> · 🕐 ≤ {maxTime} min</span>}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filtres"
            className="relative w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0"
            style={showFilters ? {
              backgroundColor: phaseData.color,
              color: 'white',
              boxShadow: `0 4px 12px ${phaseData.color}40`,
            } : {
              backgroundColor: 'white',
              color: '#8A7B7F',
              boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)',
            }}
          >
            <Filter size={16} />
            {hasActiveFilters && !showFilters && (
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: phaseData.color }} />
            )}
          </button>
        </div>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 bg-white rounded-[18px] px-4 py-3" style={{ boxShadow: '0 4px 16px rgba(45,34,38,0.05)' }}>
          <Search size={18} className="text-luna-text-hint flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenRecipe(null); }}
            placeholder="Rechercher une recette…"
            className="flex-1 bg-transparent text-sm font-body text-luna-text outline-none placeholder:text-luna-text-hint"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Effacer" className="text-luna-text-hint flex-shrink-0">
              <X size={16} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Nutrient filter banner */}
      {nutrientFilter && (
        <motion.div variants={item}>
          <div className="flex items-center justify-between rounded-[16px] px-4 py-3" style={{ backgroundColor: phaseData.bgColor }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: phaseData.color }} />
              <p className="text-[12px] font-body font-semibold" style={{ color: phaseData.colorDark }}>
                Riches en <span className="lowercase">{nutrientFilter}</span>
              </p>
            </div>
            <button
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1 text-[11px] font-body font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-70"
              style={{ backgroundColor: 'white', color: phaseData.colorDark }}
            >
              Tout voir
              <X size={11} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter Panel (accordion) */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-[20px] p-4 space-y-4" style={{ backgroundColor: 'white', boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
              {/* Active filters summary */}
              {(() => {
                const activeTags = [];
                if (selectedPhase !== 'current') {
                  const pf = PHASE_FILTERS.find((p) => p.id === selectedPhase);
                  activeTags.push({ label: pf?.label, key: 'phase', onRemove: () => setSelectedPhase('current') });
                }
                if (selectedLevel !== 'avance') {
                  const lvlLabel = selectedLevel === 'debutant' ? 'Débutant' : 'Intermédiaire';
                  activeTags.push({ label: lvlLabel, key: 'level', onRemove: () => setSelectedLevel('avance') });
                }
                if (selectedTime && selectedTime !== '60min+') {
                  activeTags.push({ label: `≤ ${selectedTime.replace('min', ' min')}`, key: 'time', onRemove: () => setSelectedTime('') });
                }
                selectedCuisines.forEach((c) => {
                  const cuisineData = CUISINES.find((x) => x.id === c);
                  if (cuisineData) activeTags.push({ label: cuisineData.label, key: c, onRemove: () => setSelectedCuisines((prev) => prev.filter((x) => x !== c)) });
                });
                if (selectedCalories) {
                  activeTags.push({ label: `≤ ${selectedCalories} kcal`, key: 'calories', onRemove: () => setSelectedCalories(null) });
                }

                return activeTags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-gray-50">
                    <span className="text-[10px] font-body text-luna-text-hint uppercase tracking-wider">Actifs :</span>
                    {activeTags.map((tag) => (
                      <span
                        key={tag.key}
                        className="inline-flex items-center gap-1 text-[11px] font-body font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                      >
                        {tag.label}
                        <button onClick={tag.onRemove} className="hover:opacity-70">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                );
              })()}

              {/* Phase */}
              <div>
                <p className="text-[11px] font-body font-semibold text-luna-text uppercase tracking-wider mb-2">Phase</p>
                <div className="flex gap-1.5 flex-wrap">
                  {PHASE_FILTERS.map((pf) => (
                    <button
                      key={pf.id}
                      onClick={() => setSelectedPhase(pf.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                      style={selectedPhase === pf.id ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                    >
                      {pf.icon && <span className="text-[10px]">{pf.icon}</span>}
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temps + Niveau row */}
              <div className="flex gap-6 flex-wrap">
                <div>
                  <p className="text-[11px] font-body font-semibold text-luna-text uppercase tracking-wider mb-2">Temps</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: '15min', label: '15\'', Icon: Zap },
                      { id: '30min', label: '30\'', Icon: Clock },
                      { id: '45min', label: '45\'', Icon: Clock },
                      { id: '60min+', label: '∞', Icon: null },
                    ].map((t) => {
                      const isActive = selectedTime === t.id || (!selectedTime && t.id === '60min+');
                      const TIcon = t.Icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTime(t.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                          style={isActive ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                        >
                          {TIcon && <TIcon size={12} className="flex-shrink-0" />}
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-body font-semibold text-luna-text uppercase tracking-wider mb-2">Niveau</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: 'debutant', label: 'Facile', Icon: Sprout },
                      { id: 'intermediaire', label: 'Moyen', Icon: Leaf },
                      { id: 'avance', label: 'Tout', Icon: ChefHat },
                    ].map((lvl) => {
                      const LIcon = lvl.Icon;
                      return (
                        <button
                          key={lvl.id}
                          onClick={() => setSelectedLevel(lvl.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                          style={selectedLevel === lvl.id ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                        >
                          <LIcon size={12} className="flex-shrink-0" />
                          {lvl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Calories */}
              <div>
                <p className="text-[11px] font-body font-semibold text-luna-text uppercase tracking-wider mb-2">Calories</p>
                <div className="flex gap-1.5 flex-wrap">
                  {CALORIE_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCalories(c.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                      style={selectedCalories === c.id ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                    >
                      <Flame size={12} className="flex-shrink-0" />
                      {c.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedCalories(null)}
                    className="px-2.5 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                    style={!selectedCalories ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                  >
                    Tout
                  </button>
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <p className="text-[11px] font-body font-semibold text-luna-text uppercase tracking-wider mb-2">Cuisine</p>
                <div className="flex gap-1.5 flex-wrap">
                  {CUISINES.map((c) => {
                    const isActive = selectedCuisines.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelectedCuisines((prev) => prev.includes(c.id) ? prev.filter((x) => x !== c.id) : [...prev, c.id])}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-body font-semibold transition-all"
                        style={isActive ? { backgroundColor: phaseData.color, color: 'white' } : { backgroundColor: '#F5F3F1', color: '#8A7B7F' }}
                      >
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <button
                  onClick={() => {
                    setSelectedPhase('current');
                    setSelectedLevel(cookingLevel || 'avance');
                    setSelectedTime(cookingTime || '');
                    setSelectedCuisines([]);
                    setSelectedCalories(null);
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-body font-semibold text-luna-text-hint hover:text-luna-text transition-colors"
                >
                  <RotateCcw size={12} />
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 rounded-full text-[12px] font-body font-bold text-white transition-all"
                  style={{ backgroundColor: phaseData.color, boxShadow: `0 4px 12px ${phaseData.color}40` }}
                >
                  Voir {allRecipes.length} recette{allRecipes.length > 1 ? 's' : ''}
                </button>
              </div>
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
        {recipesLoading ? (
          <div className="text-center py-12">
            <img src="/logo-luna.png" alt="" className="w-16 mx-auto opacity-30 animate-pulse" />
          </div>
        ) : displayedRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">{isFavMode ? '❤️' : '🍽️'}</p>
            <p className="text-sm font-body text-luna-text-muted">
              {isFavMode ? 'Aucune recette en favori pour l\'instant. Touche le ❤️ sur une recette pour la retrouver ici.' : 'Aucune recette pour ce filtre.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedRecipes.map((recipe, i) => (
              <motion.div
                key={`${recipe.mealType}-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.35 }}
                onClick={() => setOpenRecipe(i)}
                className="text-left group cursor-pointer bg-white rounded-[22px] p-2.5 active:scale-[0.98] transition-transform"
                style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}
              >
                <div
                  className="relative aspect-[4/3] rounded-[16px] overflow-hidden mb-2.5 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}20)` }}
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform duration-500">
                    {recipe.emoji || '🍽️'}
                  </span>
                  <div className="absolute top-2 left-2">
                    <span className="text-[8px] font-body font-bold uppercase tracking-widest px-2 py-0.5 rounded-pill bg-white/90 text-luna-text">
                      {mealLabels[recipe.mealType]?.tag || recipe.mealType}
                    </span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.name); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Heart size={14} className={isFavorite(recipe.name) ? 'fill-red-400 text-red-400' : 'text-luna-text-hint'} />
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[9px] font-body flex items-center gap-1" style={{ color: phaseData.colorDark }}>
                      <Clock size={9} /> {recipe.prepTime}
                    </span>
                    <span className="text-[9px] font-body font-semibold px-1.5 py-0.5 rounded-pill" style={{ backgroundColor: `${phaseData.color}25`, color: phaseData.colorDark }}>
                      {recipe.calories} kcal
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-sm text-luna-text leading-snug line-clamp-2 px-1">{recipe.name}</h3>
                <p className="text-[10px] font-body text-luna-text-muted mt-0.5 mb-0.5 leading-relaxed line-clamp-2 px-1">
                  {recipe.description}
                </p>
              </motion.div>
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-4"
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
              <div
                className="relative h-40 overflow-hidden rounded-t-[28px] md:rounded-t-[24px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}25)` }}
              >
                <span className="text-7xl">{openRecipeData.emoji || '🍽️'}</span>
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(openRecipeData.name)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Heart size={16} className={isFavorite(openRecipeData.name) ? 'fill-red-400 text-red-400' : 'text-luna-text-muted'} />
                  </button>
                  <button
                    onClick={() => setOpenRecipe(null)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X size={16} className="text-luna-text-muted" />
                  </button>
                </div>
              </div>

              <div className="p-5 pb-[calc(env(safe-area-inset-bottom)+2rem)] space-y-5">
                <div>
                  <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                    {mealLabels[openRecipeData.mealType]?.tag}
                  </p>
                  <h3 className="font-display text-xl text-luna-text">{openRecipeData.name}</h3>
                </div>

                {openRecipeData.whyThisPhase && (
                  <div className="flex items-start gap-2.5 rounded-[14px] px-4 py-3" style={{ backgroundColor: `${phaseData.color}10` }}>
                    <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                    <p className="text-xs font-body leading-relaxed italic" style={{ color: phaseData.colorDark }}>
                      {openRecipeData.whyThisPhase}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                    <Clock size={12} /> {openRecipeData.prepTime}
                  </span>
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                    {openRecipeData.calories} kcal
                  </span>
                  {(openRecipeData.nutrients || []).map((n) => (
                    <span
                      key={n}
                      className="text-[10px] font-body font-semibold px-2.5 py-1 rounded-pill"
                      style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Ingrédients</h4>
                  <ul className="space-y-1.5">
                    {(openRecipeData.ingredients || []).map((ing, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-luna-text-body font-body">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: phaseData.color }} />
                        {ing}
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="border-gray-50" />

                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Préparation</h4>
                  <ol className="space-y-3">
                    {(openRecipeData.steps || []).map((step, i) => (
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
