import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Cookie, Droplets, Check } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { RECIPES } from '../data/recipes';
import PageHeader from '../components/layout/PageHeader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const mealLabels = {
  breakfast: { label: 'Petit-déjeuner', icon: '🌅' },
  lunch: { label: 'Déjeuner', icon: '☀️' },
  dinner: { label: 'Dîner', icon: '🌙' },
};

export default function Food() {
  const { cycleInfo } = useCycle();
  const [openRecipe, setOpenRecipe] = useState(null);

  if (!cycleInfo) return null;

  const { phase, phaseData } = cycleInfo;
  const recipes = RECIPES[phase];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <PageHeader
          title="Alimentation"
          subtitle="Nourris ton corps avec ce dont il a besoin aujourd'hui."
        />
      </motion.div>

      {/* Nutrients */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-3">Nutriments prioritaires</h3>
        <div className="flex flex-wrap gap-2">
          {phaseData.nutrients.map((n) => (
            <div
              key={n}
              className="px-3 py-2 rounded-luna-sm text-sm font-body font-semibold cursor-default"
              style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
            >
              {n}
              {phaseData.nutrientDetails[n] && (
                <p className="text-xs font-normal mt-1 opacity-80">{phaseData.nutrientDetails[n]}</p>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Meals */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-3">Idées repas du jour</h3>
        <div className="space-y-3">
          {Object.entries(recipes).map(([key, recipe]) => (
            <motion.div
              key={key}
              variants={item}
              className="bg-luna-cream-light rounded-luna p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{mealLabels[key].icon}</span>
                <span className="text-xs font-accent font-semibold text-luna-text-secondary uppercase tracking-wide">
                  {mealLabels[key].label}
                </span>
              </div>
              <h4 className="text-base font-bold text-luna-text font-body">{recipe.name}</h4>
              <p className="text-sm text-luna-text-secondary font-body mt-1">{recipe.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1 text-xs text-luna-text-secondary font-accent">
                  <Clock size={14} />
                  {recipe.prepTime}
                </div>
                <div className="flex gap-1">
                  {recipe.nutrients.map((n) => (
                    <span
                      key={n}
                      className="text-[10px] px-2 py-0.5 rounded-full font-accent"
                      style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setOpenRecipe(key)}
                className="mt-3 text-sm font-body font-bold transition-colors"
                style={{ color: phaseData.colorDark }}
              >
                Voir la recette →
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Drinks */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <div className="flex items-center gap-2 mb-3">
          <Droplets size={18} style={{ color: phaseData.color }} />
          <h3 className="font-display text-base text-luna-text">Boissons recommandées</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-luna-mint-dark mb-2 font-body">✅ À privilégier</p>
            <ul className="space-y-1">
              {phaseData.drinks.good.map((d, i) => (
                <li key={i} className="text-sm text-luna-text-secondary font-body flex items-start gap-1.5">
                  <Check size={14} className="text-luna-mint mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-luna-rose-dark mb-2 font-body">❌ À limiter</p>
            <ul className="space-y-1">
              {phaseData.drinks.bad.map((d, i) => (
                <li key={i} className="text-sm text-luna-text-secondary font-body flex items-start gap-1.5">
                  <X size={14} className="text-luna-rose-dark mt-0.5 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Sugar cravings (luteal) */}
      {phase === 'luteal' && phaseData.sugarCravings && (
        <motion.div
          variants={item}
          className="rounded-luna p-4"
          style={{ backgroundColor: phaseData.bgColor }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Cookie size={18} style={{ color: phaseData.colorDark }} />
            <h3 className="font-display text-base" style={{ color: phaseData.colorDark }}>
              Envies de sucre ? C'est normal !
            </h3>
          </div>
          <p className="text-sm font-body leading-relaxed mb-3" style={{ color: phaseData.colorDark }}>
            {phaseData.sugarCravings.explanation}
          </p>
          <p className="text-xs font-semibold mb-2" style={{ color: phaseData.colorDark }}>
            Alternatives saines :
          </p>
          <ul className="space-y-1">
            {phaseData.sugarCravings.alternatives.map((a, i) => (
              <li key={i} className="text-sm font-body" style={{ color: phaseData.colorDark }}>
                • {a}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Recipe Modal */}
      <AnimatePresence>
        {openRecipe && recipes[openRecipe] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpenRecipe(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-luna sm:rounded-luna p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-accent text-luna-text-secondary uppercase">
                    {mealLabels[openRecipe].icon} {mealLabels[openRecipe].label}
                  </span>
                  <h3 className="font-display text-xl text-luna-text mt-1">
                    {recipes[openRecipe].name}
                  </h3>
                </div>
                <button
                  onClick={() => setOpenRecipe(null)}
                  className="p-1 hover:bg-luna-cream rounded-full transition-colors"
                >
                  <X size={20} className="text-luna-text-secondary" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-luna-text mb-2 font-body">Ingrédients</h4>
                <ul className="space-y-1">
                  {recipes[openRecipe].ingredients.map((ing, i) => (
                    <li key={i} className="text-sm text-luna-text-secondary font-body flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: phaseData.color }} />
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-luna-text mb-2 font-body">Préparation</h4>
                <ol className="space-y-2">
                  {recipes[openRecipe].steps.map((step, i) => (
                    <li key={i} className="text-sm text-luna-text-secondary font-body flex gap-2">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: phaseData.color }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
