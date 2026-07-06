import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Apple, Refrigerator, ShoppingCart, ChevronRight, Lightbulb } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildRequiredTags, filterRecipes } from '../data/recipeFilters';
import { getDailyInsight } from '../data/insights';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Ligne de l'onglet « Manger » : grande, tactile, une action par ligne
// (icône ronde colorée + titre + sous-titre). Couleurs fixes de la charte
// luna (pêche, menthe, lavande) — pas de thème par phase ici, c'est un sommaire.
function Row({ to, iconBg, iconColor, Icon, label, sub, badge }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3.5 bg-white rounded-[20px] p-4 active:scale-[0.99] transition-transform"
      style={{ boxShadow: '0 6px 20px rgba(45,34,38,0.05)' }}
    >
      <div
        className="w-11 h-11 rounded-[15px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display text-lg text-luna-text leading-tight">{label}</p>
        {sub && <p className="text-[11px] font-body text-luna-text-muted mt-0.5">{sub}</p>}
      </div>
      {badge != null ? (
        <span
          className="min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-body font-bold text-white flex-shrink-0"
          style={{ backgroundColor: iconColor }}
        >
          {badge}
        </span>
      ) : (
        <ChevronRight size={18} className="flex-shrink-0" style={{ color: '#C9BCB0' }} />
      )}
    </Link>
  );
}

// Onglet « Manger » : accueil de tout l'alimentaire, en lignes empilées.
// Recettes en vedette, puis Mon frigo / Aliments / Courses, et l'Insight du
// jour en clôture (déplacé depuis la page Aliments, même design). Le menu du
// jour vit sur Aujourd'hui. « De saison » reste dans le code (route
// /de-saison) mais n'est plus affiché ici.
export default function Recettes() {
  const { cycleInfo, dietPreferences, healthIssues, cookingTime, cookingLevel, allergies, shoppingList } = useCycle();

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

  // Compte des recettes adaptées (pour la vedette) — mêmes filtres que la
  // liste, avec les réglages par défaut du profil.
  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);
  const recipeCount = filterRecipes(recipes, {
    requiredTags,
    allergies,
    selectedLevel: cookingLevel || 'avance',
    selectedTime: cookingTime || '',
  }).length;

  const shoppingRemaining = (shoppingList || []).reduce((n, b) => n + b.items.filter((it) => !it.checked).length, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <TopMenu />

      {/* En-tête : titre + pastille de phase */}
      <motion.div variants={item}>
        <h1 className="font-display text-[28px] text-luna-text leading-tight">Manger</h1>
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 mt-2"
          style={{ backgroundColor: phaseData.bgColor }}
        >
          <span className="text-sm leading-none">{phaseData.icon}</span>
          <span className="text-xs font-body font-semibold" style={{ color: phaseData.colorDark }}>
            {phaseData.shortName}
          </span>
        </div>
      </motion.div>

      {/* Recettes en vedette — bandeau pleine largeur */}
      <motion.div variants={item}>
        <Link
          to="/recettes-liste"
          className="flex items-center gap-3.5 rounded-[24px] p-5 active:scale-[0.99] transition-transform"
          style={{ backgroundColor: '#FDE8EB', boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}
        >
          <div className="w-12 h-12 rounded-[16px] bg-white flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} style={{ color: '#C4727F' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-xl text-luna-text leading-tight">Recettes</p>
            <p className="text-[11px] font-body text-luna-text-muted mt-0.5">
              {recipes ? `${recipeCount} adaptées à toi` : 'Adaptées à ta phase'}
            </p>
          </div>
          <ChevronRight size={18} style={{ color: '#C4727F' }} className="flex-shrink-0" />
        </Link>
      </motion.div>

      {/* Les accès, en lignes empilées : Mon frigo, Aliments, Courses */}
      <motion.div variants={item} className="space-y-3">
        <Row
          to="/mon-frigo"
          iconBg="#EDF5F8"
          iconColor="#7BAAB8"
          Icon={Refrigerator}
          label="Mon frigo"
          sub="Cuisine avec ce que tu as"
        />
        <Row
          to="/alimentation"
          iconBg="#FFF3EB"
          iconColor="#C07A4A"
          Icon={Apple}
          label="Aliments"
          sub="Les alliés de ta phase"
        />
        <Row
          to="/courses"
          iconBg="#F3EEF8"
          iconColor="#7D6A96"
          Icon={ShoppingCart}
          label="Courses"
          sub={shoppingRemaining > 0 ? `${shoppingRemaining} article${shoppingRemaining > 1 ? 's' : ''} restant${shoppingRemaining > 1 ? 's' : ''}` : 'Ta liste par recette'}
          badge={shoppingRemaining > 0 ? shoppingRemaining : null}
        />
      </motion.div>

      {/* Insight du jour — déplacé depuis Aliments, même design */}
      <motion.div variants={item}>
        <div
          className="rounded-[18px] px-4 py-3.5 flex items-start gap-3"
          style={{ backgroundColor: `${phaseData.color}0D`, border: `1px solid ${phaseData.color}1F` }}
        >
          <Lightbulb size={15} className="flex-shrink-0 mt-0.5" style={{ color: phaseData.color }} />
          <div>
            <p className="text-[11px] font-body font-semibold text-luna-text-muted mb-0.5">
              Insight du jour
            </p>
            <p className="text-[13px] font-body text-luna-text-body leading-relaxed italic">
              {getDailyInsight(currentPhase)}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
