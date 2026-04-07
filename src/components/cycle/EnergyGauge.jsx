import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';
import { EnergyGaugeSkeleton } from '../ui/SkeletonLoader';

export default function EnergyGauge() {
  const { cycleInfo } = useCycle();
  if (!cycleInfo) return <EnergyGaugeSkeleton />;

  const { phaseData } = cycleInfo;
  const energy = phaseData.energy;

  const getEnergyLabel = (e) => {
    if (e >= 80) return 'Maximale';
    if (e >= 60) return 'Haute';
    if (e >= 40) return 'Modérée';
    return 'Basse';
  };

  return (
    <div className="bg-luna-cream-light rounded-luna p-4">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={18} style={{ color: phaseData.color }} />
        <span className="text-sm font-semibold text-luna-text font-body">Niveau d'énergie</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${energy}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: phaseData.color }}
          />
        </div>
        <span className="text-sm font-accent font-bold" style={{ color: phaseData.colorDark }}>
          {energy}%
        </span>
      </div>
      <p className="text-xs text-luna-text-secondary mt-2 font-body">
        {getEnergyLabel(energy)} — {phaseData.keyword}
      </p>
    </div>
  );
}
