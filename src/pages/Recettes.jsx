import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Apple, Refrigerator, Leaf, ShoppingCart, ChevronRight } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildRequiredTags, filterRecipes } from '../data/recipeFilters';
import { SEASONAL_MONTH_NAMES } from '../data/seasonal';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Tuile du sommaire « Manger » : grande, tactile, un mot + un sous-titre court.
// Couleurs fixes de la charte luna (rose, pêche, menthe, sauge) — pas de thème
// par phase ici, c'est un sommaire.
function Tile({ to, bg, iconColor, Icon, label, sub, badge }) {
  return (
    <Link
      to={to}
      className="relative flex flex-col justify-between rounded-[24px] p-5 min-h-[122px] active:scale-[0.98] transition-transform"
      style={{ backgroundColor: bg, boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}
    >
      {badge != null && (
        <span
          className="absolute top-3 right-3 min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center text-[11px] font-body font-bold text-white"
          style={{ backgroundColor: iconColor }}
        >
          {badge}
        </span>
      )}
      <Icon size={24} style={{ color: iconColor }} />
      <div>
        <p className="font-display text-lg text-luna-text leading-tight">{label}</p>
        {sub && <p className="text-[11px] font-body text-luna-text-muted mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

// Onglet « Manger » : le sommaire de tout l'alimentaire — Recettes en vedette
// (bandeau pleine largeur), puis la grille 2×2. Le menu du jour vit sur Aujourd'hui.
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

  // Compte des recettes adaptées (pour la tuile) — mêmes filtres que la liste,
  // avec les réglages par défaut du profil.
  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);
  const recipeCount = filterRecipes(recipes, {
    requiredTags,
    allergies,
    selectedLevel: cookingLevel || 'avance',
    selectedTime: cookingTime || '',
  }).length;

  const monthName = SEASONAL_MONTH_NAMES[new Date().getMonth()];
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
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <BookOpen size={21} style={{ color: '#C4727F' }} />
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

      {/* La grille 2×2 */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <Tile
          to="/alimentation"
          bg="#FFF3EB"
          iconColor="#C07A4A"
          Icon={Apple}
          label="Aliments"
          sub="Les alliés de ta phase"
        />
        <Tile
          to="/mon-frigo"
          bg="#EDF5F8"
          iconColor="#7BAAB8"
          Icon={Refrigerator}
          label="Mon frigo"
          sub="Cuisine avec ce que tu as"
        />
        <Tile
          to="/courses"
          bg="#F3EEF8"
          iconColor="#8B76A8"
          Icon={ShoppingCart}
          label="Courses"
          sub={shoppingRemaining > 0 ? `${shoppingRemaining} article${shoppingRemaining > 1 ? 's' : ''} restant${shoppingRemaining > 1 ? 's' : ''}` : 'Ta liste par recette'}
          badge={shoppingRemaining > 0 ? shoppingRemaining : null}
        />
        <Tile
          to="/de-saison"
          bg="#EDF5ED"
          iconColor="#4D7A50"
          Icon={Leaf}
          label="De saison"
          sub={`En ${monthName}`}
        />
      </motion.div>
    </motion.div>
  );
}
