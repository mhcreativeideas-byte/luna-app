import { motion } from 'framer-motion';
import { useCycle } from '../../contexts/CycleContext';

export default function PhaseCard() {
  const { cycleInfo } = useCycle();
  if (!cycleInfo) return null;

  const { phaseData, currentDay, cycleLength } = cycleInfo;
  const progress = (currentDay / cycleLength) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-luna p-6 relative overflow-hidden"
      style={{ backgroundColor: phaseData.bgColor }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
        style={{ backgroundColor: phaseData.color }}
      />

      <div className="relative z-10 text-center">
        <span className="text-5xl mb-3 block">{phaseData.icon}</span>
        <h2
          className="font-display text-2xl md:text-3xl mb-1"
          style={{ color: phaseData.colorDark }}
        >
          {phaseData.name}
        </h2>
        <p className="text-sm text-luna-text-secondary mb-4 font-accent font-semibold">
          Jour {currentDay} sur {cycleLength}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto h-2.5 bg-white/60 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: phaseData.color }}
          />
        </div>

        <p className="text-sm leading-relaxed" style={{ color: phaseData.colorDark }}>
          {phaseData.encouragement}
        </p>
      </div>
    </motion.div>
  );
}
