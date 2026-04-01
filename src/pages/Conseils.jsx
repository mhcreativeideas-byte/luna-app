import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { CONSEILS } from '../data/conseils';
import { PHASES, PHASE_ORDER } from '../data/phases';

const filterLabels = {
  alimentation: 'Alimentation',
  fitness: 'Fitness',
  activites: 'Activités',
};

export default function Conseils() {
  const { cycleInfo } = useCycle();
  const [activePhase, setActivePhase] = useState(cycleInfo?.phase || 'follicular');
  const [activeFilter, setActiveFilter] = useState('alimentation');
  const [selectedItem, setSelectedItem] = useState(null);

  const phaseData = PHASES[activePhase];
  const items = CONSEILS[activePhase]?.[activeFilter] || [];

  return (
    <div className="space-y-5 pb-4">
      {/* Header */}
      <h1 className="section-title text-2xl">CONSEILS</h1>

      {/* Phase tabs */}
      <div className="flex gap-1 overflow-x-auto hide-scrollbar -mx-4 px-4">
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
      </div>

      {/* Sub-filters */}
      <div className="flex gap-2">
        {Object.entries(filterLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-pill text-sm font-body font-semibold transition-all ${
              activeFilter === key
                ? 'bg-luna-text text-white'
                : 'bg-luna-cream-card text-luna-text-body hover:bg-luna-sage/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-3">
        {items.map((it, i) => (
          <motion.button
            key={it.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setSelectedItem(it)}
            className="text-center group"
          >
            <div className="aspect-square rounded-luna bg-luna-cream-card flex items-center justify-center text-4xl group-hover:scale-105 transition-transform mb-2">
              {it.emoji}
            </div>
            <p className="text-xs font-body font-bold text-luna-text leading-tight">{it.name}</p>
          </motion.button>
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luna-cream-light rounded-t-3xl md:rounded-luna w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-luna-cream-light rounded-t-3xl md:rounded-t-luna p-4 flex justify-between items-start border-b border-luna-sage/20 z-10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedItem.emoji}</span>
                  <h3 className="section-title text-lg">{selectedItem.name.toUpperCase()}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1 rounded-full hover:bg-luna-cream-card transition-colors"
                >
                  <X size={20} className="text-luna-text-muted" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Phase badge */}
                <span
                  className="inline-flex items-center gap-1 text-xs font-accent font-bold px-3 py-1 rounded-pill text-white"
                  style={{ backgroundColor: phaseData.color }}
                >
                  {phaseData.icon} Phase {phaseData.shortName}
                </span>

                {/* Benefits */}
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Avantages ✨</h4>
                  <p className="text-sm text-luna-text-body font-body leading-relaxed">
                    {selectedItem.detail}
                  </p>
                </div>

                {/* Separator */}
                <hr className="border-luna-sage/20" />

                {/* Tips */}
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Conseils 💡</h4>
                  <ul className="space-y-2">
                    {selectedItem.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-luna-text-body font-body">
                        <span className="text-luna-orange mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
