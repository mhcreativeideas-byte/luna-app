import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Cookie, ArrowRight } from 'lucide-react';
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
  follicular: 'L\'œstrogène remonte — ton corps est en mode construction. Protéines, zinc et probiotiques sont tes alliés.',
  ovulatory: 'Pic hormonal : privilégie les fibres pour éliminer l\'excès d\'œstrogène et les antioxydants pour protéger tes cellules.',
  luteal: 'Ton métabolisme augmente de 10-20%. Nourris-le avec des glucides complexes et du magnésium. Les envies de sucre sont normales.',
};

const mealLabels = {
  breakfast: { label: 'Petit-déjeuner', tag: 'MORNING RITUAL' },
  lunch: { label: 'Déjeuner', tag: 'LUNCH' },
  dinner: { label: 'Dîner', tag: 'DINNER' },
};

export default function Alimentation() {
  const { cycleInfo } = useCycle();
  const [openRecipe, setOpenRecipe] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const recipes = RECIPES[phase];
  const titles = PHASE_FOOD_TITLES[phase];

  if (!recipes) return null;

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

      {/* Priority Nutrients */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h2 className="font-display text-lg text-luna-text mb-1">Nutriments prioritaires</h2>
          <p className="text-xs font-body text-luna-text-hint mb-4">Ce dont ton corps a besoin maintenant.</p>

          <div className="flex flex-wrap gap-2">
            {phaseData.nutrients.map((n) => (
              <div
                key={n}
                className="px-4 py-2.5 rounded-[14px] text-sm font-body font-semibold"
                style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
              >
                {n}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Nutrient Details */}
      <motion.div variants={item}>
        <div className="space-y-2">
          {phaseData.nutrients.map((n) => (
            phaseData.nutrientDetails[n] && (
              <div
                key={n}
                className="rounded-[16px] p-4 bg-white"
                style={{ boxShadow: '0 1px 8px rgba(45,34,38,0.03)' }}
              >
                <h4 className="text-sm font-display text-luna-text mb-1">{n}</h4>
                <p className="text-xs font-body text-luna-text-muted leading-relaxed">
                  {phaseData.nutrientDetails[n]}
                </p>
              </div>
            )
          ))}
        </div>
      </motion.div>

      {/* Recettes d'aujourd'hui — Horizontal Carousel */}
      <motion.div variants={item}>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl text-luna-text">Recettes d'aujourd'hui</h2>
          <span className="text-xs font-body text-luna-text-hint">Swipe →</span>
        </div>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2 snap-x snap-mandatory">
          {Object.entries(recipes).map(([key, recipe]) => (
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
          <h3 className="font-display text-base text-luna-text mb-3">Boissons</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-body font-bold uppercase tracking-widest mb-2" style={{ color: '#7BAE7F' }}>
                À privilégier
              </p>
              <ul className="space-y-1.5">
                {phaseData.drinks.good.map((d, i) => (
                  <li key={i} className="text-xs font-body text-luna-text-body flex items-start gap-1.5">
                    <span className="text-[#7BAE7F] mt-0.5">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[9px] font-body font-bold uppercase tracking-widest mb-2" style={{ color: '#D4727F' }}>
                À limiter
              </p>
              <ul className="space-y-1.5">
                {phaseData.drinks.bad.map((d, i) => (
                  <li key={i} className="text-xs font-body text-luna-text-body flex items-start gap-1.5">
                    <span className="text-[#D4727F] mt-0.5">✕</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
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
        {openRecipe && recipes[openRecipe] && (
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
              {recipes[openRecipe].photo && (
                <div className="relative h-52 overflow-hidden rounded-t-[28px] md:rounded-t-[24px]">
                  <img
                    src={recipes[openRecipe].photo}
                    alt={recipes[openRecipe].name}
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
              {!recipes[openRecipe].photo && (
                <div className="sticky top-0 bg-white rounded-t-[28px] md:rounded-t-[24px] p-5 flex justify-between items-start border-b border-gray-50 z-10">
                  <div>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                      {mealLabels[openRecipe].tag}
                    </p>
                    <h3 className="font-display text-lg text-luna-text">{recipes[openRecipe].name}</h3>
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
                {recipes[openRecipe].photo && (
                  <div>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                      {mealLabels[openRecipe].tag}
                    </p>
                    <h3 className="font-display text-xl text-luna-text">{recipes[openRecipe].name}</h3>
                  </div>
                )}

                {/* Time + Calories + Nutrients */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-body flex items-center gap-1 text-luna-text-hint">
                    <Clock size={12} /> {recipes[openRecipe].prepTime}
                  </span>
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-pill bg-luna-cream text-luna-text">
                    {recipes[openRecipe].calories} kcal
                  </span>
                  {recipes[openRecipe].nutrients.map((n) => (
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
                    {recipes[openRecipe].ingredients.map((ing, i) => (
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
                    {recipes[openRecipe].steps.map((step, i) => (
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
