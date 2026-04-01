import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { CONSEILS } from '../data/conseils';
import { PHASES, PHASE_ORDER } from '../data/phases';

const filterLabels = {
  alimentation: 'Alimentation',
  fitness: 'Fitness',
  activites: 'Activites',
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
      <div>
        <h1 className="font-display text-2xl text-luna-text">Conseils</h1>
        <p className="text-xs font-body text-luna-text-hint mt-0.5">Adaptes a ta phase hormonale</p>
      </div>

      {/* Phase tabs — pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
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
      </div>

      {/* Sub-filters */}
      <div className="flex gap-2">
        {Object.entries(filterLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className="px-4 py-2 rounded-pill text-sm font-body font-semibold transition-all"
            style={activeFilter === key ? {
              backgroundColor: '#2D2226',
              color: 'white',
            } : {
              backgroundColor: 'white',
              color: '#4A3F43',
              boxShadow: '0 1px 4px rgba(45,34,38,0.06)',
            }}
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
            <div
              className="aspect-square rounded-[18px] bg-white flex items-center justify-center text-4xl group-hover:scale-105 transition-transform mb-2"
              style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.05)' }}
            >
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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] md:rounded-[24px] w-full max-w-md max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white rounded-t-[28px] md:rounded-t-[24px] p-5 flex justify-between items-start border-b border-gray-50 z-10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedItem.emoji}</span>
                  <h3 className="font-display text-lg text-luna-text">{selectedItem.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X size={16} className="text-luna-text-muted" />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Phase badge */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white"
                  style={{ backgroundColor: phaseData.color }}
                >
                  {phaseData.icon} Phase {phaseData.shortName}
                </span>

                {/* Benefits */}
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Pourquoi c'est bien pour toi</h4>
                  <p className="text-sm text-luna-text-body font-body leading-relaxed">
                    {selectedItem.detail}
                  </p>
                </div>

                <hr className="border-gray-50" />

                {/* Tips */}
                <div>
                  <h4 className="text-sm font-body font-bold text-luna-text mb-2">Conseils pratiques</h4>
                  <ul className="space-y-2.5">
                    {selectedItem.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-luna-text-body font-body leading-relaxed">
                        <span
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: phaseData.color }}
                        />
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
