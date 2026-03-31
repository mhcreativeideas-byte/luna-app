import { motion } from 'framer-motion';
import { Clock, Flame, AlertTriangle, HelpCircle } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { EXERCISES } from '../data/exercises';
import PageHeader from '../components/layout/PageHeader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function IntensityBar({ level, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-8 h-2.5 rounded-full transition-all"
            style={{
              backgroundColor: i <= level ? color : '#e5e5e5',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Sport() {
  const { cycleInfo } = useCycle();
  if (!cycleInfo) return null;

  const { phase, phaseData } = cycleInfo;
  const data = EXERCISES[phase];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <PageHeader
          title="Sport & Mouvement"
          subtitle={data.intro}
        />
      </motion.div>

      {/* Main workout card */}
      <motion.div
        variants={item}
        className="rounded-luna p-5"
        style={{ backgroundColor: phaseData.bgColor }}
      >
        <h3 className="font-display text-xl mb-1" style={{ color: phaseData.colorDark }}>
          Programme du jour
        </h3>
        <p className="text-lg font-bold text-luna-text font-body mb-3">{data.type}</p>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-sm text-luna-text-secondary font-body">
            <Clock size={16} style={{ color: phaseData.color }} />
            {data.duration}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-luna-text-secondary font-body">
            <Flame size={16} style={{ color: phaseData.color }} />
            {data.intensityLabel}
          </div>
        </div>

        <IntensityBar level={data.intensity} color={phaseData.color} />

        <p className="text-sm text-luna-text-secondary mt-4 italic font-body leading-relaxed">
          "{data.message}"
        </p>
      </motion.div>

      {/* Exercises */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-3">Exercices recommandés</h3>
        <div className="space-y-3">
          {data.exercises.map((ex, i) => (
            <motion.div
              key={i}
              variants={item}
              className="bg-luna-cream-light rounded-luna p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-luna-text font-body">{ex.name}</h4>
                <span
                  className="text-xs font-accent font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: phaseData.bgColor, color: phaseData.colorDark }}
                >
                  {ex.duration}
                </span>
              </div>
              <p className="text-sm text-luna-text-secondary font-body leading-relaxed">
                {ex.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Why this sport */}
      <motion.div
        variants={item}
        className="rounded-luna p-4"
        style={{ backgroundColor: phaseData.bgColor }}
      >
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle size={18} style={{ color: phaseData.colorDark }} />
          <h3 className="font-display text-base" style={{ color: phaseData.colorDark }}>
            Pourquoi ce sport aujourd'hui ?
          </h3>
        </div>
        <p className="text-sm leading-relaxed font-body" style={{ color: phaseData.colorDark }}>
          {data.whyThisSport}
        </p>
      </motion.div>

      {/* Sports to avoid */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-luna-rose-dark" />
          <h3 className="font-display text-base text-luna-text">Sports à éviter</h3>
        </div>
        <div className="space-y-3">
          {data.avoid.map((a, i) => (
            <div key={i}>
              <p className="text-sm font-semibold text-luna-text font-body">
                <span className="text-luna-rose-dark">✗</span> {a.name}
              </p>
              <p className="text-xs text-luna-text-secondary font-body ml-4 mt-0.5">
                {a.reason}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
