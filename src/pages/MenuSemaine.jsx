import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Check } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import { useCycle } from '../contexts/CycleContext';
import { PHASES, getPhaseForDay } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildDailyMenu } from '../data/dailyMenu';
import { RecipeSheet } from '../components/food/DailyMenu';
import { buildRequiredTags } from '../data/recipeFilters';
import { toast } from '../lib/toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Page « Ma semaine » (route /menu-semaine) : les 7 prochains jours, chacun
// avec son menu adapté à la phase de CE jour-là (le menu de jeudi suit ta
// phase de jeudi). Ouverte via « Tout voir » depuis l'accueil Aujourd'hui.
// Un bouton envoie toute la semaine dans la liste de courses.
export default function MenuSemaine() {
  const { lastPeriodDate, cycleLength, periodLength, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime, shoppingList, dispatch } = useCycle();
  const [openRecipe, setOpenRecipe] = useState(null); // { recipe, phaseData }
  const [recipesByPhase, setRecipesByPhase] = useState({});
  const [addedWeek, setAddedWeek] = useState(false);

  // Les 7 prochains jours + leur phase (même calcul que le calendrier)
  const days = useMemo(() => {
    if (!lastPeriodDate) return [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPeriod = new Date(lastPeriodDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const diffDays = Math.floor((date - lastPeriod) / 86400000);
      const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
      const phase = getPhaseForDay(cycleDay, cycleLength, periodLength);
      return { date, cycleDay, phase, i };
    });
  }, [lastPeriodDate, cycleLength, periodLength]);

  // Charger les recettes de chaque phase présente dans la semaine
  useEffect(() => {
    const phases = [...new Set(days.map((d) => d.phase))];
    let cancelled = false;
    Promise.all(phases.map((p) => RECIPE_LOADERS[p]().then((data) => [p, data]))).then((entries) => {
      if (!cancelled) setRecipesByPhase(Object.fromEntries(entries));
    });
    return () => { cancelled = true; };
  }, [days]);

  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);

  // Menu de chaque jour (stable par date)
  const weekMenus = useMemo(() => {
    return days.map((d) => {
      const recipes = recipesByPhase[d.phase];
      const menu = recipes
        ? buildDailyMenu(recipes, PHASES[d.phase], { requiredTags, allergies: allergies || [], cookingLevel, cookingTime, date: d.date })
        : [];
      return { ...d, menu };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, recipesByPhase, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime]);

  const ready = weekMenus.length > 0 && weekMenus.every((d) => d.menu.length > 0);

  const dayLabel = (d) => {
    if (d.i === 0) return 'Aujourd\'hui';
    if (d.i === 1) return 'Demain';
    return cap(d.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric' }));
  };

  const addWeekToShopping = () => {
    let added = 0;
    const seen = new Set(shoppingList.filter((b) => b.id !== 'ajouts').map((b) => b.name));
    weekMenus.forEach((d) => {
      d.menu.forEach((m) => {
        if (!seen.has(m.recipe.name)) {
          seen.add(m.recipe.name);
          dispatch({
            type: 'ADD_SHOPPING_RECIPE',
            payload: { name: m.recipe.name, ingredients: m.recipe.ingredients, emoji: m.recipe.emoji, source: 'menu' },
          });
          added += 1;
        }
      });
    });
    toast(added > 0
      ? `${added} recette${added > 1 ? 's' : ''} de la semaine ajoutée${added > 1 ? 's' : ''} 🛒`
      : 'Toute ta semaine est déjà dans la liste ✓');
    setAddedWeek(true);
    setTimeout(() => setAddedWeek(false), 2500);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-6">
      <BackButton />

      {/* En-tête */}
      <motion.div variants={item}>
        <h1 className="font-display text-[28px] text-luna-text leading-tight">Ma semaine</h1>
        <p className="text-sm font-body text-luna-text-muted mt-1">
          7 jours de menus, adaptés à ton cycle jour après jour.
        </p>
      </motion.div>

      {/* Ajouter toute la semaine aux courses */}
      <motion.div variants={item}>
        <button
          onClick={addWeekToShopping}
          disabled={!ready}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[14px] font-body font-bold text-white active:scale-[0.99] transition-transform"
          style={{ backgroundColor: '#B09ACB', boxShadow: '0 8px 22px #B09ACB40', opacity: ready ? 1 : 0.5 }}
        >
          {addedWeek ? <Check size={16} /> : <ShoppingCart size={16} />}
          {addedWeek ? 'Ajoutée à tes courses !' : 'Ajouter la semaine à mes courses'}
        </button>
      </motion.div>

      {/* Un bloc par jour */}
      {weekMenus.map((d) => {
        const pd = PHASES[d.phase];
        return (
          <motion.div key={d.i} variants={item}>
            {/* Jour + phase */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="font-display text-lg text-luna-text">{dayLabel(d)}</span>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-body font-bold"
                style={{ backgroundColor: pd.bgColor, color: pd.colorDark }}
              >
                {pd.icon} {pd.shortName}
              </span>
            </div>

            {/* Les repas du jour */}
            <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.05)' }}>
              {d.menu.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <img src="/logo-luna.svg" alt="luna" className="w-10 opacity-40 animate-pulse" />
                </div>
              ) : (
                d.menu.map((m, mi) => {
                  const MealIcon = m.Icon;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setOpenRecipe({ recipe: m.recipe, phaseData: pd })}
                      className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:scale-[0.99] transition-transform"
                      style={{ borderTop: mi === 0 ? 'none' : '0.5px solid #F5EEF0' }}
                    >
                      <div className="w-10 h-10 rounded-[13px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: pd.bgColor }}>
                        <MealIcon size={18} style={{ color: pd.colorDark }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-body font-bold uppercase tracking-wider" style={{ color: pd.color }}>{m.time}</span>
                          <span className="text-[10px] font-body text-luna-text-hint">· {m.recipe.prepTime}</span>
                        </div>
                        <p className="text-[13px] font-body font-semibold text-luna-text leading-snug line-clamp-1">{m.recipe.name}</p>
                      </div>
                      <span
                        className="text-[10px] font-body font-bold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${pd.color}12`, color: pd.colorDark }}
                      >
                        {m.recipe.calories} kcal
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        );
      })}

      <RecipeSheet recipe={openRecipe?.recipe || null} onClose={() => setOpenRecipe(null)} phaseData={openRecipe?.phaseData || PHASES.menstrual} />
    </motion.div>
  );
}
