import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, ChevronRight, Flame, Zap, Heart, Check } from 'lucide-react';
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
  const [sessionValidated, setSessionValidated] = useState(false);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const exerciseData = EXERCISES[phase];

  if (!exerciseData) return null;

  const titles = PHASE_SPORT_TITLES[phase];
  const intensityDots = Array.from({ length: 4 }, (_, i) => i < exerciseData.intensity);

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

      {/* Hero Card with Photo — recommandation du jour */}
      <motion.div variants={item}>
        <div className="rounded-[24px] overflow-hidden relative" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}>
          {/* Hero photo */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={exerciseData.heroPhoto}
              alt="Recommandation sport"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-pill bg-white/90 backdrop-blur-sm text-luna-text">
                ✦ Recommandation du jour
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-display text-xl text-white mb-1">{exerciseData.type}</h2>
              <p className="text-xs font-body text-white/80">Durée recommandée : {exerciseData.duration}</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              {/* Intensity dots */}
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Intensité</span>
                <div className="flex gap-1">
                  {intensityDots.map((active, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full transition-colors"
                      style={{
                        backgroundColor: active ? phaseData.color : `${phaseData.color}25`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs font-body font-semibold px-3 py-1 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                {exerciseData.intensityLabel}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Flame size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.intensity * 25}%</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Effort</p>
              </div>
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Clock size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.duration.split('-')[0]}</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Min</p>
              </div>
              <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                <Heart size={16} className="mx-auto mb-1" style={{ color: phaseData.colorDark }} />
                <p className="text-lg font-display font-bold text-luna-text">{exerciseData.exercises.length}</p>
                <p className="text-[9px] font-body text-luna-text-hint uppercase">Idées</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Séance validée */}
      <motion.div variants={item}>
        <button
          onClick={() => setSessionValidated(!sessionValidated)}
          className="w-full rounded-[20px] p-5 flex items-center justify-between transition-all"
          style={{
            backgroundColor: sessionValidated ? phaseData.bgColor : 'white',
            boxShadow: '0 2px 12px rgba(45,34,38,0.04)',
            border: sessionValidated ? `2px solid ${phaseData.color}` : '2px solid transparent',
          }}
        >
          <div className="text-left">
            <h3 className="font-display text-base text-luna-text">
              {sessionValidated ? 'Séance validée !' : 'Tu as bougé aujourd\'hui ?'}
            </h3>
            <p className="text-xs font-body text-luna-text-muted mt-0.5">
              {sessionValidated ? 'Bravo, ton corps te remercie 💪' : 'Marque ta séance quand c\'est fait.'}
            </p>
          </div>
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: sessionValidated ? phaseData.color : phaseData.bgColor,
            }}
          >
            <Check size={20} style={{ color: sessionValidated ? 'white' : phaseData.colorDark }} />
          </div>
        </button>
      </motion.div>

      {/* Nos recommandations — avec photos */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-xl text-luna-text">Nos recommandations</h2>
            <p className="text-xs font-body text-luna-text-hint mt-0.5">
              Activités adaptées à ta phase {phaseData.shortName.toLowerCase()}.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {exerciseData.exercises.map((ex, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelectedExercise(ex)}
              className="w-full text-left bg-white rounded-[20px] overflow-hidden transition-all hover:shadow-md group"
              style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}
            >
              <div className="flex">
                {/* Photo */}
                <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden">
                  <img
                    src={ex.photo}
                    alt={ex.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                  <h3 className="text-sm font-display text-luna-text leading-snug">{ex.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-body text-luna-text-hint flex items-center gap-1">
                      <Clock size={10} /> {ex.duration}
                    </span>
                    <span className="text-[10px] font-body font-semibold px-2 py-0.5 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                      {ex.sets}
                    </span>
                  </div>
                </div>

                <div className="flex items-center pr-4">
                  <ChevronRight size={16} className="text-luna-text-hint group-hover:text-luna-text-muted transition-colors" />
                </div>
              </div>
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
                <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs">✕</span>
                </span>
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
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} style={{ color: phaseData.colorDark }} />
            <h3 className="font-display text-base text-luna-text">Pourquoi ces recommandations ?</h3>
          </div>
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
              className="bg-white rounded-t-[28px] md:rounded-[24px] w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Photo hero */}
              <div className="relative h-56 overflow-hidden rounded-t-[28px] md:rounded-t-[24px]">
                <img
                  src={selectedExercise.photo}
                  alt={selectedExercise.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-display text-xl text-white">{selectedExercise.name}</h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white" style={{ backgroundColor: phaseData.color }}>
                    <Clock size={12} />
                    {selectedExercise.duration}
                  </span>
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}>
                    {selectedExercise.sets}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm font-body text-luna-text-body leading-relaxed">
                  {selectedExercise.description}
                </p>

                {/* Info disclaimer */}
                <div className="rounded-[14px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
                  <p className="text-xs font-body text-luna-text-muted leading-relaxed text-center">
                    💡 Adapte l'intensité à ton ressenti. L'important, c'est de bouger à ton rythme.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
