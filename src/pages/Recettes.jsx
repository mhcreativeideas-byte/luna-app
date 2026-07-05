import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Apple, Refrigerator, Leaf } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildRequiredTags, filterRecipes } from '../data/recipeFilters';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const MONTH_NAMES = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// Tuile du sommaire « Manger » : grande, tactile, un mot + un sous-titre court.
// Couleurs fixes de la charte luna (rose, pêche, menthe, sauge) — pas de thème
// par phase ici, c'est un sommaire.
function Tile({ to, bg, iconColor, Icon, label, sub }) {
  return (
    <Link
      to={to}
      className="flex flex-col justify-between rounded-[24px] p-5 min-h-[122px] active:scale-[0.98] transition-transform"
      style={{ backgroundColor: bg, boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}
    >
      <Icon size={24} style={{ color: iconColor }} />
      <div>
        <p className="font-display text-lg text-luna-text leading-tight">{label}</p>
        {sub && <p className="text-[11px] font-body text-luna-text-muted mt-0.5">{sub}</p>}
      </div>
    </Link>
  );
}

// Onglet « Manger » : le sommaire de tout l'alimentaire.
// Le menu du jour vit désormais sur l'accueil Aujourd'hui.
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

  // Compte des recettes adaptées (pour la tuile) — mêmes filtres que la liste,
  // avec les réglages par défaut du profil.
  const requiredTags = buildRequiredTags(dietPreferences, healthIssues);
  const recipeCount = filterRecipes(recipes, {
    requiredTags,
    allergies,
    selectedLevel: cookingLevel || 'avance',
    selectedTime: cookingTime || '',
  }).length;

  const monthName = MONTH_NAMES[new Date().getMonth()];

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

      {/* Les 4 grandes tuiles */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <Tile
          to="/recettes-liste"
          bg="#FDE8EB"
          iconColor="#C4727F"
          Icon={BookOpen}
          label="Recettes"
          sub={recipes ? `${recipeCount} adaptées à toi` : 'Adaptées à ta phase'}
        />
        <Tile
          to="/alimentation"
          bg="#FFF3EB"
          iconColor="#C47A4A"
          Icon={Apple}
          label="Aliments"
          sub="Les alliés de ta phase"
        />
        <Tile
          to="/mon-frigo"
          bg="#EAF1F4"
          iconColor="#5E8296"
          Icon={Refrigerator}
          label="Mon frigo"
          sub="Cuisine avec ce que tu as"
        />
        <Tile
          to="/de-saison"
          bg="#EDF2EA"
          iconColor="#71805F"
          Icon={Leaf}
          label="De saison"
          sub={`En ${monthName}`}
        />
      </motion.div>
    </motion.div>
  );
}
