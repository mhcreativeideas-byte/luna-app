import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCycle } from '../contexts/CycleContext';
import { ARTICLES, MEDITATIONS } from '../data/articles';
import { RECIPES } from '../data/recipes';
import { PHASES, PHASE_ORDER } from '../data/phases';

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
      <motion.div variants={item}>
        <h1 className="section-title text-2xl">EXPLORER</h1>
      </motion.div>

      {/* Phase tabs */}
      <motion.div variants={item} className="flex gap-1 overflow-x-auto hide-scrollbar -mx-4 px-4">
        {PHASE_ORDER.map((p) => (
          <button
            key={p}
            onClick={() => setActivePhase(p)}
            className={`flex-shrink-0 px-4 py-2 text-sm font-body font-semibold transition-all border-b-2 ${
              activePhase === p
                ? 'border-luna-orange text-luna-orange'
                : 'border-transparent text-luna-text-muted hover:text-luna-text-body'
            }`}
          >
            {PHASES[p].icon} {PHASES[p].shortName}
          </button>
        ))}
      </motion.div>

      {/* Articles */}
      <motion.div variants={item}>
        <h3 className="section-title text-base mb-3">ARTICLES</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {articles.map((article, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 rounded-luna overflow-hidden"
              style={{ backgroundColor: phaseData.bgColor }}
            >
              <div className="h-32 flex items-center justify-center text-5xl">
                {article.emoji}
              </div>
              <div className="p-4">
                <h4 className="text-sm font-body font-bold text-luna-text leading-tight mb-1">
                  {article.title}
                </h4>
                <p className="text-xs text-luna-text-muted font-body">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recipes */}
      <motion.div variants={item}>
        <h3 className="section-title text-base mb-3">RECETTES D'AUJOURD'HUI</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {recipeList.map((recipe, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 rounded-luna bg-luna-cream-card overflow-hidden"
            >
              <div className="h-32 flex items-center justify-center text-5xl bg-luna-cream-light">
                {i === 0 ? '🥣' : i === 1 ? '🥗' : '🍲'}
              </div>
              <div className="p-4">
                <span className="text-[10px] font-accent font-bold text-luna-text-hint uppercase">
                  {i === 0 ? 'Petit-déjeuner' : i === 1 ? 'Déjeuner' : 'Dîner'}
                </span>
                <h4 className="text-sm font-body font-bold text-luna-text leading-tight mt-0.5 mb-1">
                  {recipe.name}
                </h4>
                <p className="text-xs text-luna-text-muted font-body">{recipe.description}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {recipe.nutrients.map((n) => (
                    <span key={n} className="text-[10px] font-accent px-2 py-0.5 rounded-pill bg-luna-orange/10 text-luna-orange-deep">
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
        <h3 className="section-title text-base mb-3">MÉDITATIONS DU JOUR</h3>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
          {meditations.map((med, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 rounded-luna p-4"
              style={{ backgroundColor: phaseData.bgColor }}
            >
              <span className="text-3xl block mb-2">{med.emoji}</span>
              <h4 className="text-sm font-body font-bold text-luna-text mb-1">{med.title}</h4>
              <p className="text-xs text-luna-text-muted font-body mb-2">{med.description}</p>
              <span className="text-xs font-accent font-semibold" style={{ color: phaseData.colorDark }}>
                {med.duration}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
