import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';
import { PHASES } from '../../data/phases';
import { RECIPE_LOADERS } from '../../data/recipeLoaders';
import { buildDailyMenu } from '../../data/dailyMenu';
import AddToListBanner from './AddToListBanner';


// Bloc « Ta journée idéale » : le menu du jour adapté à la phase.
// Deux affichages : variant="full" (carte détaillée, page Menu) et
// variant="carousel" (cartes horizontales compactes, accueil Aujourd'hui).
// Même chargement, même fenêtre de détail dans les deux cas.
export default function DailyMenu({ variant = 'full' }) {
  const { cycleInfo, dietPreferences, healthIssues, allergies } = useCycle();
  const [openDailyRecipe, setOpenDailyRecipe] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setRecipes(null);
    RECIPE_LOADERS[phase]().then((data) => {
      if (!cancelled) setRecipes(data);
    });
    return () => { cancelled = true; };
  }, [phase]);

  const dailyMenu = useMemo(() => {
    if (!recipes) return [];
    const tags = [];
    const prefs = dietPreferences || ['omnivore'];
    const issues = healthIssues || [];
    if (prefs.includes('Végane')) tags.push('vegan');
    else if (prefs.includes('Végétarienne')) tags.push('vegetarien');
    if (prefs.includes('Sans gluten')) tags.push('sans_gluten');
    if (prefs.includes('Sans lactose')) tags.push('sans_lactose');
    if (issues.includes('SOPK')) tags.push('sopk_friendly');
    return buildDailyMenu(recipes, phaseData, {
      requiredTags: tags,
      allergies: allergies || [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, recipes, dietPreferences, healthIssues, allergies]);

  if (variant === 'carousel') {
    return (
      <>
        {dailyMenu.length === 0 ? (
          <div className="flex items-center justify-center py-8 bg-white rounded-[20px]">
            <img src="/logo-luna.svg" alt="luna" className="w-12 opacity-40 animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {dailyMenu.map((m, i) => {
              const MealIcon = m.Icon;
              return (
                <motion.button
                  key={m.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                  onClick={() => setOpenDailyRecipe(m.recipe)}
                  className="bg-white rounded-[20px] p-3.5 text-left active:scale-[0.97] transition-transform"
                  style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.06)' }}
                >
                  <div
                    className="w-10 h-10 rounded-[13px] flex items-center justify-center mb-2.5"
                    style={{ backgroundColor: phaseData.bgColor }}
                  >
                    <MealIcon size={18} style={{ color: phaseData.colorDark }} />
                  </div>
                  <p className="text-[10px] font-body font-bold uppercase tracking-wider mb-1" style={{ color: phaseData.color }}>
                    {m.time}
                  </p>
                  <p className="text-[13px] font-body font-semibold text-luna-text leading-snug line-clamp-2 min-h-[34px]">
                    {m.recipe.name}
                  </p>
                  <p className="text-[11px] font-body text-luna-text-hint mt-1.5">{m.recipe.prepTime}</p>
                </motion.button>
              );
            })}
          </div>
        )}
        <RecipeSheet recipe={openDailyRecipe} onClose={() => setOpenDailyRecipe(null)} phaseData={phaseData} />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-[28px] overflow-hidden" style={{ boxShadow: '0 8px 28px rgba(45,34,38,0.06)' }}>
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}18)` }}
          >
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

          {/* Meals */}
          <div className="bg-white px-4 py-3">
            {dailyMenu.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <img src="/logo-luna.svg" alt="luna" className="w-14 opacity-40 animate-pulse" />
              </div>
            ) : (
              <div className="space-y-2">
                {dailyMenu.map((m, i) => {
                  const MealIcon = m.Icon;
                  return (
                  <motion.div
                    key={m.key}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i, duration: 0.3 }}
                    onClick={() => setOpenDailyRecipe(m.recipe)}
                    className="flex items-center gap-3.5 rounded-[18px] p-3.5 transition-all cursor-pointer active:scale-[0.98]"
                    style={{ backgroundColor: i % 2 === 0 ? `${phaseData.color}06` : 'transparent' }}
                  >
                    <div
                      className="w-14 h-14 rounded-[16px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: phaseData.bgColor }}
                    >
                      <MealIcon size={24} style={{ color: phaseData.colorDark }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-body font-bold uppercase tracking-wider" style={{ color: phaseData.color }}>{m.time}</span>
                        <span className="text-[10px] font-body text-luna-text-hint">·</span>
                        <span className="text-[10px] font-body text-luna-text-hint">{m.recipe.prepTime}</span>
                      </div>
                      <p className="text-sm font-body font-semibold text-luna-text leading-snug line-clamp-2">{m.recipe.name}</p>
                      {m.drink && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px]">{m.drinkIcon}</span>
                          <span className="text-[10px] font-body text-luna-text-muted">{m.drink}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className="text-[10px] font-body font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${phaseData.color}12`, color: phaseData.colorDark }}
                      >
                        {m.recipe.calories} kcal
                      </span>
                    </div>
                  </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </motion.div>

      <RecipeSheet recipe={openDailyRecipe} onClose={() => setOpenDailyRecipe(null)} phaseData={phaseData} />
    </>
  );
}

// ===== Fenêtre du bas : détail d'une recette du menu du jour =====
function RecipeSheet({ recipe: openDailyRecipe, onClose, phaseData }) {
  return (
    <>
      <AnimatePresence>
        {openDailyRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-end justify-center"
            onClick={onClose}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] w-full max-w-md overflow-y-auto overscroll-contain"
              style={{ maxHeight: '95vh', WebkitOverflowScrolling: 'touch' }}
            >
              <div
                className="sticky top-0 z-10 relative h-32 overflow-hidden rounded-t-[28px] flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}25)` }}
              >
                <span className="text-5xl">{openDailyRecipe.emoji || '🍽️'}</span>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
              </div>

              <div className="p-5 pb-24 space-y-5">
                <div>
                  <h3 className="font-display text-xl text-luna-text">{openDailyRecipe.name}</h3>
                  {openDailyRecipe.description && (
                    <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{openDailyRecipe.description}</p>
                  )}
                </div>

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

                <AddToListBanner recipe={openDailyRecipe} source="menu" />

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
    </>
  );
}
