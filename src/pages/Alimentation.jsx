import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, ChevronRight, Clock, Sparkles, Lightbulb, Leaf, UtensilsCrossed, AlertTriangle, Heart, Star } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import TopMenu from '../components/ui/TopMenu';
import PhaseHero from '../components/food/PhaseHero';

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

const PHASE_INSIGHTS = {
  menstrual: 'Savais-tu que ton métabolisme de repos augmente légèrement pendant cette phase ?',
  follicular: 'L\'œstrogène améliore la plasticité cérébrale — tu apprends plus vite en cette phase.',
  ovulatory: 'Ta voix change légèrement pendant l\'ovulation. Elle devient plus mélodieuse.',
  luteal: 'Ton métabolisme augmente de 10-20%. Manger plus est normal et nécessaire.',
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
  'Eau de coco': '/foods/noix.png',
};

// Emoji de repli pour les aliments sans photo
const FOOD_EMOJI_FALLBACK = {
  'Huile d\'olive': '🫒',
  'Huile de chanvre': '🌱',
  'Eau de coco': '🥥',
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
  const [selectedFood, setSelectedFood] = useState(null);
  const [openDailyRecipe, setOpenDailyRecipe] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [expandedBadDrink, setExpandedBadDrink] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const titles = PHASE_FOOD_TITLES[phase];
  const nutrientsFull = phaseData.nutrientsFull || {};

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      Object.entries(RECIPE_LOADERS).map(([k, loader]) => loader().then((data) => [k, data]))
    ).then((entries) => {
      if (!cancelled) setAllRecipes(Object.fromEntries(entries));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setSelectedFood(null);
  }, [phase]);

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
    return foods.filter(f => requiredTags.every(tag => (f.tags || []).includes(tag)));
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
      <TopMenu />

      {/* ===== HERO ===== */}
      <motion.div variants={item}>
        <PhaseHero
          phaseData={phaseData}
          section="Nutrition"
          titleMain={titles.main}
          titleItalic={titles.italic}
          intro={PHASE_FOOD_INTROS[phase]}
        />
      </motion.div>

      {/* ===== INSIGHT DU JOUR ===== */}
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
              {PHASE_INSIGHTS[phase]}
            </p>
          </div>
        </div>
      </motion.div>

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

                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mb-2.5 bg-white"
                    style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.06)' }}
                  >
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={food.name}
                        loading="lazy"
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <span className="text-2xl" style={{ display: imgSrc ? 'none' : 'block' }}>{emoji}</span>
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

      {/* ===== DÉTAIL ALIMENT (bottom sheet simplifié) ===== */}
      <AnimatePresence>
        {selectedFood && (() => {
          const food = flatFoods.find(f => f.name === selectedFood);
          if (!food) return null;
          const imgSrc = FOOD_IMG[food.name];
          const emoji = food.emoji || FOOD_EMOJI_FALLBACK[food.name] || '🍽️';
          return (
            <motion.div
              key={selectedFood}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div
                className="rounded-[22px] p-4 flex items-start gap-4"
                style={{ backgroundColor: `${phaseData.color}08`, border: `1px solid ${phaseData.color}18` }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden bg-white flex-shrink-0"
                  style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.06)' }}
                >
                  {imgSrc ? (
                    <img src={imgSrc} alt={food.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-xl">{emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-base text-luna-text">{food.name}</h3>
                    <span className="text-[9px] font-body font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${phaseData.color}18`, color: phaseData.colorDark }}
                    >
                      {food.nutrients.join(' · ')}
                    </span>
                  </div>
                  <p className="text-xs font-body text-luna-text-body leading-relaxed">
                    {food.why}
                  </p>
                  {food.nutrients.length > 0 && (
                    <Link
                      to={`/recettes-liste?nutrient=${encodeURIComponent(food.nutrients[0])}`}
                      className="inline-flex items-center gap-1.5 mt-2.5 text-[11px] font-body font-bold"
                      style={{ color: phaseData.colorDark }}
                    >
                      <UtensilsCrossed size={11} />
                      Voir les recettes
                      <ChevronRight size={11} />
                    </Link>
                  )}
                </div>
              </div>
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
                    — {phaseData.drinks.bad[expandedBadDrink].why}
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
