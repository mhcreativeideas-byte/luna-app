import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Cookie, ChevronDown, Sparkles, Lightbulb, Droplets, ShieldCheck, ShieldAlert } from 'lucide-react';
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

const mealLabels = {
  breakfast: { label: 'Petit-déjeuner', tag: 'MORNING RITUAL' },
  lunch: { label: 'Déjeuner', tag: 'LUNCH' },
  dinner: { label: 'Dîner', tag: 'DINNER' },
};

// ——— Mapping santé : nutriments & superaliments par condition ———
const HEALTH_NUTRIENT_MAP = {
  'SPM sévère': ['Magnésium', 'Vitamine B6', 'Calcium', 'Omega-3'],
  'Endométriose': ['Omega-3', 'Antioxydants', 'Glutathion', 'Fer', 'Fibres'],
  'SOPK': ['Fibres', 'Zinc', 'Glucides complexes', 'Magnésium', 'Probiotiques'],
  'Cycles irréguliers': ['Zinc', 'Vitamines B', 'Vitamine B6', 'Protéines'],
};

const HEALTH_SUPERFOODS = {
  'SPM sévère': ['Chocolat noir', 'Chocolat noir 70%', 'Graines de courge', 'Bananes', 'Amandes', 'Épinards', 'Noix de cajou', 'Sardines'],
  'Endométriose': ['Saumon', 'Graines de lin', 'Brocoli', 'Épinards', 'Graines de chia', 'Avocat', 'Noix', 'Maquereau', 'Huile d\'olive'],
  'SOPK': ['Lentilles', 'Graines de lin', 'Brocoli', 'Graines de chia', 'Avoine', 'Cannelle', 'Quinoa', 'Patate douce', 'Sarrasin', 'Amandes'],
  'Cycles irréguliers': ['Graines de lin', 'Graines de courge', 'Avocat', 'Noix', 'Saumon', 'Œufs', 'Graines de sésame', 'Zinc'],
};

export default function Alimentation() {
  const { cycleInfo, dietPreferences, healthIssues } = useCycle();
  const [openRecipe, setOpenRecipe] = useState(null);
  const [openNutrient, setOpenNutrient] = useState(null);
  const [expandedDrink, setExpandedDrink] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const recipes = RECIPES[phase];
  const titles = PHASE_FOOD_TITLES[phase];
  const nutrientsFull = phaseData.nutrientsFull || {};

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

  // ——— Sélection de la recette compatible ———
  const selectRecipe = (variants) => {
    if (!Array.isArray(variants)) return variants; // compat ancien format
    if (variants.length === 1) return variants[0]; // une seule recette
    // Sans filtre → recette originale (dernière dans le tableau)
    if (!requiredTags.length) return variants[variants.length - 1];
    // Avec filtre → première recette compatible, sinon originale
    const match = variants.find(r => requiredTags.every(tag => (r.tags || []).includes(tag)));
    return match || variants[variants.length - 1];
  };

  // Construire les recettes filtrées pour cette phase
  const filteredRecipes = recipes
    ? Object.fromEntries(
        Object.entries(recipes).map(([key, variants]) => [key, selectRecipe(variants)])
      )
    : null;

  if (!filteredRecipes) return null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Phase tag + Title */}
      <motion.div variants={item}>
        <p className="text-[10px] font-body text-luna-text-hint uppercase tracking-widest mb-3">
          {phaseData.shortName} · Alimentation
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          {titles.main}{' '}
          <em style={{ color: phaseData.colorDark }}>{titles.italic}</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          {PHASE_FOOD_INTROS[phase]}
        </p>
      </motion.div>

      {/* Priority Nutrients — Interactive */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} style={{ color: phaseData.color }} />
            <h2 className="font-display text-lg text-luna-text">Nutriments prioritaires</h2>
          </div>
          <p className="text-xs font-body text-luna-text-hint mb-4">Clique sur un nutriment pour découvrir les aliments à privilégier.</p>

          <div className="flex flex-wrap gap-2">
            {phaseData.nutrients.map((n) => {
              const isBeneficial = hasHealthBadges && beneficialNutrients.has(n);
              return (
                <button
                  key={n}
                  onClick={() => { setOpenNutrient(openNutrient === n ? null : n); setSelectedFood(null); }}
                  className="px-4 py-2.5 rounded-[14px] text-sm font-body font-semibold transition-all duration-300 inline-flex items-center gap-1.5"
                  style={openNutrient === n ? {
                    backgroundColor: phaseData.color,
                    color: 'white',
                    boxShadow: `0 4px 12px ${phaseData.color}40`,
                  } : {
                    backgroundColor: phaseData.bgColor,
                    color: phaseData.colorDark,
                  }}
                >
                  {n}
                  {isBeneficial && (
                    <span className="text-[10px]" title="Recommandé pour ta santé">💚</span>
                  )}
                </button>
              );
            })}
          </div>
          {hasHealthBadges && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
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

      {/* Expanded Nutrient Detail */}
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
              style={{ boxShadow: '0 4px 20px rgba(45,34,38,0.08)' }}
            >
              {/* Header band */}
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}15)` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display text-xl text-luna-text">{openNutrient}</h3>
                  <button
                    onClick={() => setOpenNutrient(null)}
                    className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center"
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
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">
                    Aliments riches en {openNutrient.toLowerCase()}
                  </p>
                  {isFiltering && (
                    <span
                      className="text-[9px] font-body font-semibold px-2 py-0.5 rounded-pill"
                      style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}
                    >
                      🌱 {dietLabel}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {filterFoods(nutrientsFull[openNutrient].foods).map((food, i) => {
                    const isActive = selectedFood === food.name;
                    const isSuperfood = hasHealthBadges && superfoodSet.has(food.name);
                    return (
                      <motion.button
                        key={food.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedFood(isActive ? null : food.name)}
                        className="flex flex-col items-center gap-1.5 transition-all"
                      >
                        <div className="relative">
                          <div
                            className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl transition-all"
                            style={{
                              backgroundColor: isActive ? `${phaseData.color}25` : phaseData.bgColor,
                              border: isActive ? `2px solid ${phaseData.color}` : '2px solid transparent',
                              transform: isActive ? 'scale(1.08)' : 'scale(1)',
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
                      className="mt-4 flex items-start gap-2.5 rounded-[14px] px-4 py-3"
                      style={{ backgroundColor: `${phaseData.color}10` }}
                    >
                      <Lightbulb size={14} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
                      <p className="text-xs font-body text-luna-text-body leading-relaxed italic">
                        {displayText}
                      </p>
                    </motion.div>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Recettes d'aujourd'hui */}
      <motion.div variants={item}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-luna-text">Recettes d'aujourd'hui</h2>
          <span className="text-xs font-body text-luna-text-hint">Swipe →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {Object.entries(filteredRecipes).map(([key, recipe]) => (
            <button
              key={key}
              onClick={() => setOpenRecipe(key)}
              className="flex-shrink-0 w-[72%] md:w-[45%] snap-start text-left group"
            >
              {/* Photo card */}
              <div className="relative aspect-square rounded-[24px] overflow-hidden mb-3">
                {recipe.photo ? (
                  <img
                    src={recipe.photo}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-5xl"
                    style={{ backgroundColor: phaseData.bgColor }}
                  >
                    🍽
                  </div>
                )}
                {/* Subtle overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-pill bg-white/90 backdrop-blur-sm text-luna-text">
                    {mealLabels[key].tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-body text-white/90 flex items-center gap-1">
                    <Clock size={10} /> {recipe.prepTime}
                  </span>
                  <span className="text-[10px] font-body font-semibold text-white/90 px-2 py-0.5 rounded-pill bg-black/30 backdrop-blur-sm">
                    {recipe.calories} kcal
                  </span>
                </div>
              </div>
              {/* Title */}
              <h3 className="font-display text-base text-luna-text leading-snug">{recipe.name}</h3>
              <p className="text-xs font-body text-luna-text-muted mt-1 leading-relaxed line-clamp-2">
                {recipe.description}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Drinks */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
              <Droplets size={20} style={{ color: phaseData.colorDark }} />
            </div>
            <div>
              <h3 className="font-display text-base text-luna-text">Boissons</h3>
              <p className="text-[10px] font-body text-luna-text-muted">Clique pour savoir pourquoi</p>
            </div>
          </div>

          {/* Good drinks */}
          {(() => {
            const filteredGood = filterFoods(phaseData.drinks.good);
            return (
              <div className="rounded-[16px] bg-white/70 p-4 mb-3" style={{ boxShadow: '0 1px 6px rgba(45,34,38,0.03)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} style={{ color: '#7BAE7F' }} />
                    <p className="text-[10px] font-body font-bold uppercase tracking-widest" style={{ color: '#7BAE7F' }}>
                      À privilégier
                    </p>
                  </div>
                  {isFiltering && (
                    <span className="text-[9px] font-body font-semibold px-2 py-0.5 rounded-pill" style={{ backgroundColor: '#7BAE7F15', color: '#4D7A50' }}>
                      🌱 {dietLabel}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredGood.map((d, i) => {
                    const key = `good-${i}`;
                    const isOpen = expandedDrink === key;
                    return (
                      <button
                        key={i}
                        onClick={() => setExpandedDrink(isOpen ? null : key)}
                        className="inline-flex items-center gap-1.5 text-xs font-body font-medium px-3 py-2 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: isOpen ? '#7BAE7F25' : '#7BAE7F12',
                          color: '#4D7A50',
                          border: isOpen ? '1.5px solid #7BAE7F' : '1px solid #7BAE7F25',
                          boxShadow: isOpen ? '0 2px 8px rgba(123,174,127,0.2)' : 'none',
                        }}
                      >
                        🍵 {d.name}
                      </button>
                    );
                  })}
                </div>
                {/* Shared explanation zone */}
                <AnimatePresence>
                  {expandedDrink?.startsWith('good-') && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pl-3 pr-2 py-2.5 text-xs font-body text-luna-text-body leading-relaxed rounded-[12px] bg-[#7BAE7F0A]"
                        style={{ borderLeft: '3px solid #7BAE7F' }}
                      >
                        <span className="font-semibold" style={{ color: '#4D7A50' }}>
                          {filteredGood[Number(expandedDrink.split('-')[1])]?.name} →
                        </span>{' '}
                        {filteredGood[Number(expandedDrink.split('-')[1])]?.why}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })()}

          {/* Bad drinks */}
          <div className="rounded-[16px] bg-white/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert size={14} style={{ color: '#D4727F' }} />
              <p className="text-[10px] font-body font-bold uppercase tracking-widest" style={{ color: '#D4727F' }}>
                À limiter
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {phaseData.drinks.bad.map((d, i) => {
                const key = `bad-${i}`;
                const isOpen = expandedDrink === key;
                return (
                  <button
                    key={i}
                    onClick={() => setExpandedDrink(isOpen ? null : key)}
                    className="inline-flex items-center gap-1.5 text-xs font-body font-medium px-3 py-2 rounded-full transition-all duration-200"
                    style={{
                      backgroundColor: isOpen ? '#D4727F20' : '#D4727F10',
                      color: '#A3555F',
                      border: isOpen ? '1.5px solid #D4727F' : '1px solid #D4727F20',
                      boxShadow: isOpen ? '0 2px 8px rgba(212,114,127,0.2)' : 'none',
                    }}
                  >
                    ⚠️ {d.name}
                  </button>
                );
              })}
            </div>
            {/* Shared explanation zone */}
            <AnimatePresence>
              {expandedDrink?.startsWith('bad-') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pl-3 pr-2 py-2.5 text-xs font-body text-luna-text-body leading-relaxed rounded-[12px] bg-[#D4727F08]"
                    style={{ borderLeft: '3px solid #D4727F' }}
                  >
                    <span className="font-semibold" style={{ color: '#A3555F' }}>
                      {phaseData.drinks.bad[Number(expandedDrink.split('-')[1])]?.name} →
                    </span>{' '}
                    {phaseData.drinks.bad[Number(expandedDrink.split('-')[1])]?.why}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Sugar Cravings - Luteal only */}
      {phase === 'luteal' && phaseData.sugarCravings && (
        <motion.div variants={item}>
          <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Cookie size={16} style={{ color: phaseData.colorDark }} />
              <h3 className="font-display text-base text-luna-text">Envies de sucre ?</h3>
            </div>
            <p className="text-sm font-body text-luna-text-muted leading-relaxed mb-3">
              {phaseData.sugarCravings.explanation}
            </p>
            <div className="flex flex-wrap gap-2">
              {phaseData.sugarCravings.alternatives.map((a, i) => (
                <span
                  key={i}
                  className="text-xs font-body px-3 py-1.5 rounded-pill"
                  style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quote */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm font-body text-luna-text-hint italic px-8 leading-relaxed">
          "Mange pour la femme que tu es aujourd'hui."
        </p>
      </motion.div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {openRecipe && filteredRecipes[openRecipe] && (
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
              {/* Photo in modal */}
              {filteredRecipes[openRecipe].photo && (
                <div className="relative h-52 overflow-hidden rounded-t-[28px] md:rounded-t-[24px]">
                  <img
                    src={filteredRecipes[openRecipe].photo}
                    alt={filteredRecipes[openRecipe].name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setOpenRecipe(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <X size={16} className="text-luna-text-muted" />
                  </button>
                </div>
              )}

              {/* Header if no photo */}
              {!filteredRecipes[openRecipe].photo && (
                <div className="sticky top-0 bg-white rounded-t-[28px] md:rounded-t-[24px] p-5 flex justify-between items-start border-b border-gray-50 z-10">
                  <div>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                      {mealLabels[openRecipe].tag}
                    </p>
                    <h3 className="font-display text-lg text-luna-text">{filteredRecipes[openRecipe].name}</h3>
                  </div>
                  <button
                    onClick={() => setOpenRecipe(null)}
                    className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <X size={16} className="text-luna-text-muted" />
                  </button>
                </div>
              )}

              <div className="p-5 space-y-5">
                {/* Title (when photo exists) */}
                {filteredRecipes[openRecipe].photo && (
                  <div>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                      {mealLabels[openRecipe].tag}
                    </p>
                    <h3 className="font-display text-xl text-luna-text">{filteredRecipes[openRecipe].name}</h3>
                  </div>
                )}

                {/* Time + Calories + Nutrients */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                    <Clock size={12} /> {filteredRecipes[openRecipe].prepTime}
                  </span>
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                    {filteredRecipes[openRecipe].calories} kcal
                  </span>
                  {filteredRecipes[openRecipe].nutrients.map((n) => (
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
                    {filteredRecipes[openRecipe].ingredients.map((ing, i) => (
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
                    {filteredRecipes[openRecipe].steps.map((step, i) => (
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
