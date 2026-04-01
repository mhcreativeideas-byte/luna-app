import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, X, ChevronRight } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { EXERCISES } from '../data/exercises';
import { PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_SPORT_TITLES = {
  menstrual: { main: 'Douceur &', italic: 'Récupération' },
  follicular: { main: 'Énergie &', italic: 'Performance' },
  ovulatory: { main: 'Puissance &', italic: 'Dépassement' },
  luteal: { main: 'Transition &', italic: 'Adaptation' },
};

export default function Sport() {
  const { cycleInfo } = useCycle();
  const [selectedExercise, setSelectedExercise] = useState(null);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const exerciseData = EXERCISES[phase];

  if (!exerciseData) return null;

  const mainWorkout = exerciseData.exercises[0];
  const titles = PHASE_SPORT_TITLES[phase];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Phase tag + Title */}
      <motion.div variants={item}>
        <p className="text-[10px] font-body text-luna-text-hint uppercase tracking-widest mb-3">
          {phaseData.shortName} · Sport
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          {titles.main}{' '}
          <em style={{ color: phaseData.colorDark }}>{titles.italic}</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          {exerciseData.intro}
        </p>
      </motion.div>

      {/* Workout of the Day */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] p-5 relative overflow-hidden"
          style={{ backgroundColor: phaseData.bgColor }}
        >
          <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">
            ✦ Séance du jour
          </p>
          <h2 className="font-display text-xl text-luna-text mb-4">{mainWorkout.name}</h2>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span
              className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white"
              style={{ backgroundColor: phaseData.color }}
            >
              {exerciseData.duration}
            </span>
            <span
              className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill"
              style={{ backgroundColor: `${phaseData.color}20`, color: phaseData.colorDark }}
            >
              {exerciseData.intensityLabel}
            </span>
          </div>

          {/* Big stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/70 rounded-[16px] p-4">
              <p className="text-[9px] font-body text-luna-text-hint uppercase tracking-widest mb-1">Intensité</p>
              <p className="text-3xl font-display font-bold text-luna-text">{exerciseData.intensity * 25}%</p>
            </div>
            <div className="bg-white/70 rounded-[16px] p-4">
              <p className="text-[9px] font-body text-luna-text-hint uppercase tracking-widest mb-1">Durée</p>
              <p className="text-3xl font-display font-bold text-luna-text">
                {exerciseData.duration.split('-')[0]}
                <span className="text-sm font-body font-normal text-luna-text-muted ml-1">min</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedExercise(mainWorkout)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] text-white text-sm font-body font-bold uppercase tracking-wider transition-all hover:opacity-90"
            style={{ backgroundColor: phaseData.colorDark }}
          >
            <Play size={16} fill="white" />
            Voir la séance
          </button>
        </div>
      </motion.div>

      {/* La Séquence */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl text-luna-text">La séquence</h2>
            <p className="text-xs font-body text-luna-text-hint mt-0.5">
              Adaptée à ta phase {phaseData.shortName.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {exerciseData.exercises.map((ex, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedExercise(ex)}
              className="w-full text-left bg-white rounded-[20px] p-4 flex items-center gap-4 transition-all hover:shadow-md group"
              style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}
            >
              <div
                className="w-14 h-14 rounded-[16px] flex items-center justify-center text-lg font-display font-bold flex-shrink-0"
                style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display text-luna-text">{ex.name}</h3>
                <p className="text-xs font-body text-luna-text-hint mt-0.5">{ex.duration}</p>
              </div>
              <ChevronRight size={16} className="text-luna-text-hint group-hover:text-luna-text-muted transition-colors" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* À éviter */}
      <motion.div variants={item}>
        <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h3 className="font-display text-base text-luna-text mb-3">À éviter en ce moment</h3>
          <div className="space-y-3">
            {exerciseData.avoid.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red-400 text-sm mt-0.5">✕</span>
                <div>
                  <p className="text-sm font-body font-semibold text-luna-text">{a.name}</p>
                  <p className="text-xs font-body text-luna-text-muted mt-0.5 leading-relaxed">{a.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Pourquoi */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <h3 className="font-display text-base text-luna-text mb-2">Pourquoi ce type d'entraînement ?</h3>
          <p className="text-sm font-body text-luna-text-body leading-relaxed">
            {exerciseData.whyThisSport}
          </p>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm font-body text-luna-text-hint italic px-8 leading-relaxed">
          "{exerciseData.message}"
        </p>
      </motion.div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] md:rounded-[24px] w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white rounded-t-[28px] md:rounded-t-[24px] p-5 flex justify-between items-center border-b border-gray-50 z-10">
                <h3 className="font-display text-lg text-luna-text pr-4">{selectedExercise.name}</h3>
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white"
                  style={{ backgroundColor: phaseData.color }}
                >
                  <Clock size={12} />
                  {selectedExercise.duration}
                </span>
                <p className="text-sm font-body text-luna-text-body leading-relaxed">
                  {selectedExercise.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
