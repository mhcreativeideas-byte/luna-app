import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from '../contexts/CycleContext';
import { ARTICLES, MEDITATIONS } from '../data/articles';
import { RECIPES } from '../data/recipes';
import { PHASES, PHASE_ORDER } from '../data/phases';
import { FoodIcon, MindsetIcon } from '../components/illustrations/LunaIllustrations';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Explorer() {
  const { cycleInfo } = useCycle();
  const [activePhase, setActivePhase] = useState(cycleInfo?.phase || 'follicular');

  const articles = ARTICLES[activePhase] || [];
  const meditations = MEDITATIONS[activePhase] || [];
  const recipes = RECIPES[activePhase] || {};
  const phaseData = PHASES[activePhase];

  const recipeList = [recipes.breakfast, recipes.lunch, recipes.dinner].filter(Boolean);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-4">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="font-display text-2xl text-luna-text">Explorer</h1>
        <p className="text-xs font-body text-luna-text-hint mt-0.5">Des idées pour prendre soin de toi, chaque jour différemment.</p>
      </motion.div>

      {/* Phase tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
        {PHASE_ORDER.map((p) => {
          const isActive = activePhase === p;
          return (
            <button
              key={p}
              onClick={() => setActivePhase(p)}
              className="flex-shrink-0 px-5 py-2.5 text-sm font-body font-semibold transition-all rounded-pill"
              style={isActive ? {
                backgroundColor: PHASES[p].color,
                color: 'white',
                boxShadow: `0 4px 12px ${PHASES[p].color}30`,
              } : {
                backgroundColor: '#F0EBE8',
                color: '#8A7B7F',
              }}
            >
              {PHASES[p].icon} {PHASES[p].shortName}
            </button>
          );
        })}
      </motion.div>

      {/* Articles */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-3">Ce que ton corps essaie de te dire</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {articles.map((article, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 rounded-[20px] overflow-hidden bg-white"
              style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}
            >
              <div
                className="h-32 flex items-center justify-center text-5xl"
                style={{ backgroundColor: phaseData.bgColor }}
              >
                {article.emoji}
              </div>
              <div className="p-4">
                <h4 className="text-sm font-body font-bold text-luna-text leading-tight mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-luna-text-muted font-body leading-relaxed">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recipes */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: phaseData.bgColor }}>
            <FoodIcon size={20} />
          </div>
          <h3 className="font-display text-lg text-luna-text">Dans ton assiette aujourd'hui</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {recipeList.map((recipe, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 rounded-[20px] overflow-hidden bg-white"
              style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}
            >
              <div className="h-32 flex items-center justify-center text-5xl bg-luna-cream">
                {i === 0 ? '🥣' : i === 1 ? '🥗' : '🍲'}
              </div>
              <div className="p-4">
                <span
                  className="text-[10px] font-body font-bold uppercase tracking-wider"
                  style={{ color: phaseData.colorDark }}
                >
                  {i === 0 ? 'Petit-dejeuner' : i === 1 ? 'Dejeuner' : 'Diner'}
                </span>
                <h4 className="text-sm font-body font-bold text-luna-text leading-tight mt-0.5 mb-1">
                  {recipe.name}
                </h4>
                <p className="text-xs text-luna-text-muted font-body leading-relaxed">{recipe.description}</p>
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {recipe.nutrients.map((n) => (
                    <span
                      key={n}
                      className="text-[10px] font-body px-2.5 py-0.5 rounded-pill"
                      style={{
                        backgroundColor: `${phaseData.color}15`,
                        color: phaseData.colorDark,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Meditations */}
      <motion.div variants={item}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: phaseData.bgColor }}>
            <MindsetIcon size={20} />
          </div>
          <h3 className="font-display text-lg text-luna-text">Un moment rien qu'à toi</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {meditations.map((med, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 rounded-[20px] p-5 bg-white relative overflow-hidden"
              style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}
            >
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: `linear-gradient(160deg, ${phaseData.bgColor}, transparent 60%)` }}
              />
              <div className="relative">
                <span className="text-3xl block mb-2">{med.emoji}</span>
                <h4 className="text-sm font-body font-bold text-luna-text mb-1">{med.title}</h4>
                <p className="text-xs text-luna-text-muted font-body mb-3 leading-relaxed">{med.description}</p>
                <span
                  className="text-xs font-body font-semibold px-3 py-1 rounded-pill"
                  style={{
                    backgroundColor: `${phaseData.color}15`,
                    color: phaseData.colorDark,
                  }}
                >
                  {med.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
