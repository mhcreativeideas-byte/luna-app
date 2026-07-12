import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ChevronRight, Clock, Sparkles, Leaf, UtensilsCrossed, AlertTriangle, Heart, Star } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { matchesRequiredTags } from '../data/recipeFilters';
import BackButton from '../components/ui/BackButton';
import AuroraHeader from '../components/ui/AuroraHeader';
import AddToListBanner from '../components/food/AddToListBanner';
import { PHASE_FOOD_ACCENTS, PHASE_FOOD_INTROS } from '../data/phaseHeaders';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Nom d'aliment → chemin image dans public/foods/
const FOOD_IMG = {
  'Lentilles': '/foods/lentilles.png',
  'Épinards': '/foods/epinards.png',
  'Viande rouge': '/foods/viande-rouge.png',
  'Tofu': '/foods/tofu.png',
  'Quinoa': '/foods/quinoa.png',
  'Pois chiches': '/foods/pois-chiches.png',
  'Brocoli': '/foods/brocoli.png',
  'Sardines': '/foods/sardines.png',
  'Saumon': '/foods/saumon.png',
  'Graines de lin': '/foods/graines-de-lin.png',
  'Graines de chia': '/foods/graines-de-chia.png',
  'Noix': '/foods/noix.png',
  'Avocat': '/foods/avocat.png',
  'Maquereau': '/foods/maquereau.png',
  'Edamame': '/foods/edamame.png',
  'Chocolat noir': '/foods/chocolat-noir.png',
  'Chocolat noir 70%': '/foods/chocolat-noir.png',
  'Amandes': '/foods/amandes.png',
  'Bananes': '/foods/bananes.png',
  'Graines de courge': '/foods/graines-de-courge.png',
  'Avoine': '/foods/avoine.png',
  'Dattes': '/foods/dattes.png',
  'Oranges': '/foods/orange.png',
  'Kiwi': '/foods/kiwi.png',
  'Poivrons': '/foods/poivrons.png',
  'Fraises': '/foods/fraise.png',
  'Citron': '/foods/citron.png',
  'Mangue': '/foods/mangue.png',
  'Tomates': '/foods/tomate.png',
  'Poulet': '/foods/poulet.png',
  'Dinde': '/foods/dinde.png',
  'Œufs': '/foods/oeufs.png',
  'Yaourt grec': '/foods/yaourt-grec.png',
  'Yaourt nature': '/foods/yaourt-nature.png',
  'Crevettes': '/foods/crevettes.png',
  'Graines de chanvre': '/foods/graines-de-chanvre.png',
  'Tempeh': '/foods/tempeh.png',
  'Légumineuses': '/foods/legumineuses.png',
  'Haricots noirs': '/foods/haricots-noirs.png',
  'Haricots': '/foods/haricots.png',
  'Kimchi': '/foods/kimchi.png',
  'Kéfir': '/foods/kefir.png',
  'Choucroute': '/foods/choucroute.png',
  'Miso': '/foods/miso.png',
  'Cornichons lacto': '/foods/cornichons.png',
  'Graines de sésame': '/foods/graines-de-sesame.png',
  'Patate douce': '/foods/patate-douce.png',
  'Riz complet': '/foods/riz-complet.png',
  'Pain complet': '/foods/pain-complet.png',
  'Sarrasin': '/foods/sarrasin.png',
  'Framboises': '/foods/framboises.png',
  'Myrtilles': '/foods/myrtille.png',
  'Grenades': '/foods/grenades.png',
  'Huîtres': '/foods/huitres.png',
  'Figues sèches': '/foods/figues-seches.png',
  'Spiruline': '/foods/spiruline.png',
  'Noix de cajou': '/foods/noix-de-cajou.png',
  'Tahini': '/foods/tahini.png',
  'Pistaches': '/foods/pistaches.png',
  'Graines de tournesol': '/foods/graines-de-tournesol.png',
  'Céréales complètes': '/foods/cereales-completes.png',
  'Pâtes complètes': '/foods/pates-completes.png',
  'Betterave': '/foods/betterave.png',
  'Cacao cru': '/foods/cacao-cru.png',
  'Pommes': '/foods/pomme.png',
  'Poires': '/foods/poire.png',
  'Pommes de terre': '/foods/pommes-de-terre.png',
  'Asperges': '/foods/asperge.png',
  'Artichauts': '/foods/artichaut.png',
  'Chou kale': '/foods/chou-kale.png',
  'Chou-fleur': '/foods/chou-fleur.png',
  'Champignons': '/foods/champignons.png',
  'Ail': '/foods/ail.png',
  'Pruneaux': '/foods/pruneaux.png',
  'Fromage': '/foods/fromage.png',
  'Bœuf': '/foods/boeuf.png',
  'Eau de coco': '/foods/eau-de-coco.png',
  'Eau de coco fraîche': '/foods/eau-de-coco.png',
  'Huile d\'olive': '/foods/huile-olive.png',
  'Huile de chanvre': '/foods/huile-chanvre.png',
  'Kombucha': '/foods/kombucha.png',
  'Lait d\'amande': '/foods/lait-amande.png',
};

// Emoji de secours si la photo ne charge pas
const FOOD_EMOJI_FALLBACK = {
  'Huile d\'olive': '🫒',
  'Huile de chanvre': '🌱',
  'Eau de coco': '🥥',
  'Eau de coco fraîche': '🥥',
};

// Scale individuel par image pour harmoniser les tailles dans les cercles
// (calculé à partir de la taille réelle du contenu visible de chaque PNG)
// Cible : ~70% du cercle rempli. <1 = réduire, >1 = agrandir.
const FOOD_SCALE = {
  // --- Très petits dans leur image → agrandir beaucoup ---
  'Kéfir': 1.55, 'Figues sèches': 1.55, 'Kimchi': 1.55,
  'Yaourt nature': 1.5, 'Avocat': 1.45, 'Bananes': 1.4,
  'Haricots': 1.4, 'Choucroute': 1.35, 'Œufs': 1.35,
  'Crevettes': 1.35, 'Framboises': 1.35, 'Pistaches': 1.35,
  'Sardines': 1.3, 'Edamame': 1.25, 'Graines de courge': 1.25,
  'Pommes de terre': 1.25, 'Poulet': 1.25, 'Chou kale': 1.2,
  'Tempeh': 1.2, 'Dattes': 1.2, 'Fromage': 1.15,
  'Graines de tournesol': 1.15, 'Pruneaux': 1.15,
  'Champignons': 1.12, 'Haricots noirs': 1.12, 'Miso': 1.12,
  'Bœuf': 1.1, 'Graines de chia': 1.1, 'Huîtres': 1.1,
  'Poivrons': 1.1, 'Spiruline': 1.1, 'Tofu': 1.1,
  'Viande rouge': 1.1, 'Noix de cajou': 1.08, 'Quinoa': 1.08,
  'Pain complet': 1.05, 'Patate douce': 1.05, 'Yaourt grec': 1.05,
  'Cornichons lacto': 1.03, 'Céréales complètes': 1.03, 'Maquereau': 1.03,
  // --- Taille correcte (70-80%) → pas de changement ---
  // amandes, pâtes complètes, dinde, pois chiches, sarrasin, etc.
  // --- Remplissent beaucoup leur image → réduire ---
  'Rhubarbe': 0.88, 'Panais': 0.87, 'Prune': 0.87, 'Raisin': 0.87,
  'Radis': 0.85, 'Topinambour': 0.85,
  'Clémentine': 0.84, 'Fraises': 0.84,
  'Abricot': 0.83,
  'Betterave': 0.82, 'Melon': 0.82, 'Navet': 0.82,
  'Brocoli': 0.8,
  'Courgette': 0.81, 'Noix': 0.81, 'Pamplemousse': 0.81,
  'Chou-fleur': 0.8,
  'Concombre': 0.79,
  'Blette': 0.78, 'Céleri': 0.78, 'Épinards': 0.78, 'Poireau': 0.78, 'Tomates': 0.78,
  'Aubergine': 0.77, 'Cerise': 0.77, 'Cresson': 0.77, 'Endive': 0.77, 'Kiwi': 0.77,
  'Artichauts': 0.77, 'Asperges': 0.77, 'Groseille': 0.77, 'Mûre': 0.77, 'Petit pois': 0.77,
  'Carotte': 0.76, 'Cassis': 0.76, 'Myrtilles': 0.76,
  'Chou': 0.75, 'Citron': 0.75, 'Laitue': 0.75, 'Mâche': 0.75,
  'Poires': 0.75, 'Pommes': 0.75,
  'Mandarine': 0.75, 'Oranges': 0.75,
  'Châtaigne': 0.75, 'Chou de Bruxelles': 0.75, 'Courge': 0.75,
  'Fenouil': 0.75, 'Figue': 0.75, 'Framboise': 0.75,
  'Haricot vert': 0.75, 'Maïs': 0.75, 'Mirabelle': 0.75,
  'Nectarine': 0.75, 'Pêche': 0.75, 'Poivron': 0.75, 'Potiron': 0.75,
  // --- Bouteilles et verres (hauts et étroits → légèrement agrandir) ---
  'Huile d\'olive': 1.12, 'Huile de chanvre': 1.12,
  'Kombucha': 1.08, 'Lait d\'amande': 1.08,
  // --- Moyens (légèrement réduire) ---
  'Cacao cru': 0.91, 'Chocolat noir': 0.91, 'Chocolat noir 70%': 0.91,
  'Graines de lin': 0.91, 'Lentilles': 0.88, 'Tahini': 0.91,
  'Graines de sésame': 0.92, 'Riz complet': 0.92,
  'Légumineuses': 0.9, 'Pastèque': 0.95, 'Saumon': 0.9,
  'Avoine': 0.97, 'Grenades': 0.97, 'Mangue': 0.97,
};

// ——— Mapping santé : nutriments & superaliments par condition ———
const HEALTH_NUTRIENT_MAP = {
  'SPM sévère': ['Magnésium', 'Vitamine B6', 'Calcium', 'Oméga-3'],
  'Endométriose': ['Oméga-3', 'Antioxydants', 'Glutathion', 'Fer', 'Fibres'],
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
  // Sélection étiquetée par phase : un changement de phase invalide la
  // sélection sans avoir besoin d'un effet de remise à zéro.
  const [selected, setSelected] = useState(null);
  const [openDailyRecipe, setOpenDailyRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [expandedBadDrink, setExpandedBadDrink] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const nutrientsFull = useMemo(() => phaseData.nutrientsFull || {}, [phaseData]);

  const selectedFood = selected?.phase === phase ? selected.name : null;
  const setSelectedFood = (name) => setSelected(name ? { phase, name } : null);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      Object.entries(RECIPE_LOADERS).map(([k, loader]) => loader().then((data) => [k, data]))
    ).then((entries) => {
      if (!cancelled) setAllRecipes(Object.fromEntries(entries));
    });
    return () => { cancelled = true; };
  }, []);

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
    return foods.filter(f => matchesRequiredTags(f, requiredTags));
  };

  const isFiltering = requiredTags.length > 0;

  // ——— Badges santé ———
  const userIssues = healthIssues || [];
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

  // ——— Aplatir tous les aliments par phase, dédupliqués ———
  const flatFoods = useMemo(() => {
    const foodMap = new Map();
    for (const [nutrientName, nutrientData] of Object.entries(nutrientsFull)) {
      for (const food of (nutrientData.foods || [])) {
        if (foodMap.has(food.name)) {
          const existing = foodMap.get(food.name);
          if (!existing.nutrients.includes(nutrientName)) {
            existing.nutrients.push(nutrientName);
          }
        } else {
          foodMap.set(food.name, {
            ...food,
            nutrients: [nutrientName],
          });
        }
      }
    }
    return Array.from(foodMap.values());
  }, [nutrientsFull]);

  const filteredFoods = filterFoods(flatFoods);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <BackButton />

      {/* En-tête aurore */}
      <AuroraHeader
        title="Aliments"
        accent={PHASE_FOOD_ACCENTS[phase]}
        intro={PHASE_FOOD_INTROS[phase]}
      />


      {/* ===== ALIMENTS — grille 2 colonnes ===== */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[28px] p-5" style={{ boxShadow: '0 8px 28px rgba(45,34,38,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: `${phaseData.color}15` }}
              >
                <Sparkles size={16} style={{ color: phaseData.colorDark }} />
              </div>
              <h2 className="font-display text-lg text-luna-text leading-tight">Tes aliments clés</h2>
            </div>
            {isFiltering && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-body font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}
              >
                <Leaf size={10} className="flex-shrink-0" /> {dietLabel}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredFoods.map((food, i) => {
              const imgSrc = FOOD_IMG[food.name];
              const emoji = food.emoji || FOOD_EMOJI_FALLBACK[food.name] || '🍽️';
              const isSuperfood = hasHealthBadges && superfoodSet.has(food.name);
              const isActive = selectedFood === food.name;

              return (
                <motion.button
                  key={food.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03, duration: 0.35 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedFood(isActive ? null : food.name)}
                  className="relative flex flex-col items-center text-center rounded-[20px] px-3 pt-4 pb-3 transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? `${phaseData.color}12` : '#FAF7F5',
                    border: isActive ? `1.5px solid ${phaseData.color}50` : '1.5px solid transparent',
                  }}
                >
                  {isSuperfood && (
                    <div
                      className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'white', boxShadow: '0 1px 4px rgba(45,34,38,0.12)' }}
                    >
                      <Star size={10} fill="currentColor" style={{ color: '#E8A87C' }} />
                    </div>
                  )}

                  <div className="w-[76px] h-[76px] rounded-full overflow-hidden mb-2.5 bg-white flex items-center justify-center"
                    style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.06)' }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={food.name}
                        loading="lazy"
                        className="object-contain"
                        style={{ width: `${60 * (FOOD_SCALE[food.name] || 1)}px`, height: `${60 * (FOOD_SCALE[food.name] || 1)}px` }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span className="text-3xl" style={{ display: imgSrc ? 'none' : 'block' }}>{emoji}</span>
                  </div>

                  <span className="text-[13px] font-body font-bold text-luna-text leading-tight">
                    {food.name}
                  </span>

                  <span
                    className="text-[10px] font-body font-semibold mt-1 leading-tight"
                    style={{ color: phaseData.color }}
                  >
                    {food.nutrients.join(' · ')}
                  </span>

                  <p className="text-[10px] font-body text-luna-text-hint mt-1 leading-snug italic line-clamp-2">
                    {food.why.split('.')[0]}.
                  </p>
                </motion.button>
              );
            })}
          </div>

          {hasHealthBadges && (
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
              <Star size={11} className="flex-shrink-0" fill="currentColor" style={{ color: '#E8A87C' }} />
              <p className="text-[10px] font-body text-luna-text-hint">
                = Superaliment pour {userIssues.join(' & ')}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ===== DÉTAIL ALIMENT (bottom sheet) ===== */}
      <AnimatePresence>
        {selectedFood && (() => {
          const food = flatFoods.find(f => f.name === selectedFood);
          if (!food) return null;
          const imgSrc = FOOD_IMG[food.name];
          const emoji = food.emoji || FOOD_EMOJI_FALLBACK[food.name] || '🍽️';
          return (
            <motion.div
              key="food-sheet-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/25 z-[60] flex items-end justify-center"
              onClick={() => setSelectedFood(null)}
            >
              <motion.div
                key={selectedFood}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-t-[28px] w-full max-w-md"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
              >
                {/* Poignée */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                <div className="px-5 pb-4">
                  {/* En-tête : photo + nom + nutriments */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-[76px] h-[76px] rounded-full overflow-hidden bg-luna-cream flex-shrink-0 flex items-center justify-center"
                      style={{ boxShadow: '0 2px 10px rgba(45,34,38,0.08)' }}
                    >
                      {imgSrc ? (
                        <img src={imgSrc} alt={food.name} className="object-contain"
                          style={{ width: `${60 * (FOOD_SCALE[food.name] || 1)}px`, height: `${60 * (FOOD_SCALE[food.name] || 1)}px` }} />
                      ) : (
                        <span className="text-3xl">{emoji}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-luna-text">{food.name}</h3>
                      <span
                        className="text-[11px] font-body font-semibold"
                        style={{ color: phaseData.color }}
                      >
                        {food.nutrients.join(' · ')}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
                    >
                      <X size={14} className="text-luna-text-muted" />
                    </button>
                  </div>

                  {/* Explication */}
                  <p className="text-[13px] font-body text-luna-text-body leading-relaxed mb-4">
                    {food.why}
                  </p>

                  {/* Lien recettes */}
                  {food.nutrients.length > 0 && (
                    <Link
                      to={`/recettes-liste?nutrient=${encodeURIComponent(food.nutrients[0])}`}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-[16px] transition-all active:scale-[0.98]"
                      style={{ backgroundColor: phaseData.bgColor }}
                    >
                      <UtensilsCrossed size={14} style={{ color: phaseData.colorDark }} />
                      <span className="text-[13px] font-body font-bold" style={{ color: phaseData.colorDark }}>
                        Voir les recettes
                      </span>
                      <ChevronRight size={14} style={{ color: phaseData.colorDark }} />
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ===== À LIMITER ===== */}
      {phaseData.drinks?.bad?.length > 0 && (
        <motion.div variants={item}>
          <div className="bg-white rounded-[28px] p-5" style={{ boxShadow: '0 8px 28px rgba(45,34,38,0.06)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: '#D4727F15' }}>
                <AlertTriangle size={16} style={{ color: '#C4727F' }} />
              </div>
              <div>
                <h2 className="font-display text-lg text-luna-text leading-tight">À limiter</h2>
                <p className="text-[11px] font-body text-luna-text-hint mt-0.5">Touche pour savoir pourquoi</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phaseData.drinks.bad.map((d, i) => {
                const isOpen = expandedBadDrink === i;
                return (
                  <button
                    key={i}
                    onClick={() => setExpandedBadDrink(isOpen ? null : i)}
                    className="text-[12px] font-body font-semibold px-3.5 py-2 rounded-full transition-all"
                    style={{
                      backgroundColor: isOpen ? '#D4727F20' : '#D4727F12',
                      color: '#A3555F',
                      border: isOpen ? '1.5px solid #D4727F' : '1.5px solid transparent',
                    }}
                  >
                    {d.name}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {expandedBadDrink !== null && phaseData.drinks.bad[expandedBadDrink] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-3 pl-4 pr-3 py-3 text-xs font-body text-luna-text-body leading-relaxed rounded-[14px]"
                    style={{ backgroundColor: '#FDF5F5', borderLeft: '3px solid #D4727F' }}
                  >
                    <span className="font-bold" style={{ color: '#A3555F' }}>
                      {phaseData.drinks.bad[expandedBadDrink].name}
                    </span>{' '}
                    : {phaseData.drinks.bad[expandedBadDrink].why}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ===== ENVIES DE SUCRE — Luteal only ===== */}
      {phase === 'luteal' && phaseData.sugarCravings && (() => {
        const findMatchingRecipe = (altName) => {
          const lower = altName.toLowerCase();
          const keywords = lower.includes('energy balls') ? ['energy balls']
            : lower.includes('glace maison') || lower.includes('nice cream') ? ['nice cream', 'glace']
            : lower.includes('smoothie banane-cacao') ? ['smoothie banane-cacao', 'smoothie banane cacao']
            : lower.includes('dattes fourrées') ? ['dattes fourrées', 'bouchées de dattes']
            : [];
          if (keywords.length === 0) return null;
          for (const ph of ['luteal', 'menstrual', 'follicular', 'ovulatory']) {
            const phRecipes = allRecipes?.[ph];
            if (!phRecipes) continue;
            for (const mealType of ['snack', 'drink', 'breakfast', 'lunch', 'dinner']) {
              const pool = phRecipes[mealType];
              if (!pool) continue;
              const match = pool.find(r => keywords.some(kw => r.name.toLowerCase().includes(kw)));
              if (match) return match;
            }
          }
          return null;
        };

        return (
          <motion.div variants={item}>
            <div
              className="rounded-[28px] overflow-hidden"
              style={{ boxShadow: '0 8px 28px rgba(45,34,38,0.06)' }}
            >
              <div
                className="px-5 pt-5 pb-4"
                style={{ background: `linear-gradient(135deg, #FFF5E6, #FFECD2)` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: '#E8A87C30' }}>
                    <Cookie size={18} style={{ color: '#D4846A' }} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-luna-text">Envies de sucre ?</h3>
                    <p className="text-[10px] font-body text-luna-text-muted mt-0.5">C'est normal en phase lutéale</p>
                  </div>
                </div>
              </div>
              <div className="bg-white px-5 py-4">
                <p className="text-sm font-body text-luna-text-body leading-relaxed mb-4">
                  {phaseData.sugarCravings.explanation}
                </p>
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-3">
                  Alternatives saines
                </p>
                <div className="flex flex-wrap gap-2">
                  {phaseData.sugarCravings.alternatives.map((a, i) => {
                    const matchedRecipe = findMatchingRecipe(a);
                    return matchedRecipe ? (
                      <button
                        key={i}
                        onClick={() => setOpenDailyRecipe(matchedRecipe)}
                        className="text-xs font-body font-semibold px-3.5 py-2 rounded-[12px] transition-all active:scale-95"
                        style={{ backgroundColor: '#FFF5E6', color: '#B8764A', border: '1px solid #E8A87C40' }}
                      >
                        {a} <span className="text-[10px] opacity-60">→</span>
                      </button>
                    ) : (
                      <span
                        key={i}
                        className="text-xs font-body font-semibold px-3.5 py-2 rounded-[12px]"
                        style={{ backgroundColor: '#FFF5E6', color: '#B8764A', border: '1px solid #E8A87C25' }}
                      >
                        {a}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })()}

      {/* ===== RECIPE DETAIL MODAL ===== */}
      <AnimatePresence>
        {openDailyRecipe && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-end justify-center"
            onClick={() => setOpenDailyRecipe(null)}
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
                  onClick={() => setOpenDailyRecipe(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white active:bg-white transition-colors"
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
                  <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-luna-cream text-luna-text">
                    {openDailyRecipe.calories} kcal
                  </span>
                  {(openDailyRecipe.nutrients || []).map((n) => (
                    <span
                      key={n}
                      className="text-[10px] font-body font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                    >
                      {n}
                    </span>
                  ))}
                </div>

                <AddToListBanner recipe={openDailyRecipe} />

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

    </motion.div>
  );
}
