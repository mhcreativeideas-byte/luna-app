import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Refrigerator, UtensilsCrossed } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import DailyMenu from '../components/food/DailyMenu';
import PhaseHero from '../components/food/PhaseHero';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildRequiredTags, buildDietLabel, filterRecipes } from '../data/recipeFilters';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MANGER_TITLES = {
  menstrual: { main: 'Manger pour', italic: 'se régénérer' },
  follicular: { main: 'Manger pour', italic: 's\'élancer' },
  ovulatory: { main: 'Manger pour', italic: 'rayonner' },
  luteal: { main: 'Manger pour', italic: 's\'apaiser' },
};

const MANGER_INTROS = {
  menstrual: 'Ton menu du jour et tes recettes, pensés pour reconstituer ton énergie pendant tes règles.',
  follicular: 'Ton menu du jour et tes recettes, pour accompagner ton énergie qui remonte.',
  ovulatory: 'Ton menu du jour et tes recettes, légers et colorés pour ton pic d\'énergie.',
  luteal: 'Ton menu du jour et tes recettes, réconfortants et équilibrés pour cette phase.',
};

export default function Recettes() {
  const { cycleInfo, dietPreferences, healthIssues, cookingTime, cookingLevel, allergies } = useCycle();

  const currentPhase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[currentPhase];
  // Recettes chargées, étiquetées par phase : tant que la phase affichée ne
  // correspond pas, `recipes` vaut null (état de chargement) sans reset manuel.
  const [loadedRecipes, setLoadedRecipes] = useState(null);

  useEffect(() => {
    let cancelled = false;
    RECIPE_LOADERS[currentPhase]().then((data) => {
      if (!cancelled) setLoadedRecipes({ phase: currentPhase, data });
    });
    return () => { cancelled = true; };
  }, [currentPhase]);

  const recipes = loadedRecipes?.phase === currentPhase ? loadedRecipes.data : null;

  // Compte des recettes adaptées (pour la carte) — mêmes filtres que la liste,
  // avec les réglages par défaut du profil.
  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);
  const dietLabel = buildDietLabel(dietPreferences, healthIssues);
  const recipeCount = filterRecipes(recipes, {
    requiredTags,
    allergies,
    selectedLevel: cookingLevel || 'avance',
    selectedTime: cookingTime || '',
  }).length;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <TopMenu />

      {/* En-tête « Manger » — composant partagé compact (même déco que Mes aliments) */}
      <motion.div variants={item}>
        <PhaseHero
          phaseData={phaseData}
          section="Manger"
          titleMain={MANGER_TITLES[currentPhase].main}
          titleItalic={MANGER_TITLES[currentPhase].italic}
          intro={MANGER_INTROS[currentPhase]}
        />
      </motion.div>

      {/* Menu du jour — l'action du jour, en haut de « Manger » */}
      <DailyMenu />

      {/* Bandeau Mon frigo — cuisiner avec ce qu'on a déjà */}
      <motion.div variants={item}>
        <Link
          to="/mon-frigo"
          className="flex items-center gap-4 rounded-[24px] p-4 active:scale-[0.99] transition-transform"
          style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}14)`, boxShadow: '0 8px 26px rgba(45,34,38,0.06)' }}
        >
          <div className="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center flex-shrink-0">
            <Refrigerator size={20} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg text-luna-text leading-tight">Mon frigo</h2>
            <p className="text-xs font-body text-luna-text-muted mt-0.5">Cuisine avec ce que tu as déjà.</p>
          </div>
          <ChevronRight size={18} style={{ color: phaseData.colorDark }} className="flex-shrink-0" />
        </Link>
      </motion.div>

      {/* Carte Toutes les recettes — ouvre la page dédiée */}
      <motion.div variants={item}>
        <Link
          to="/recettes-liste"
          className="flex items-center gap-4 rounded-[24px] p-4 active:scale-[0.99] transition-transform"
          style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}14)`, boxShadow: '0 8px 26px rgba(45,34,38,0.06)' }}
        >
          <div className="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed size={20} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg text-luna-text leading-tight">Toutes les recettes</h2>
            <p className="text-xs font-body text-luna-text-muted mt-0.5">
              {recipes ? `${recipeCount} recette${recipeCount > 1 ? 's' : ''} adaptées à ta phase` : 'Recettes adaptées à ta phase'}
              {dietLabel && <span> · 🌱 {dietLabel}</span>}
            </p>
          </div>
          <ChevronRight size={18} style={{ color: phaseData.colorDark }} className="flex-shrink-0" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
