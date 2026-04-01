import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { SYMPTOM_CATEGORIES, TAG_COLORS } from '../data/symptoms';

export default function CheckIn() {
  const navigate = useNavigate();
  const { dispatch, cycleInfo } = useCycle();
  const [step, setStep] = useState(0);
  const [energy, setEnergy] = useState(50);
  const [activeCategory, setActiveCategory] = useState(0);
  const [symptoms, setSymptoms] = useState({});
  const [note, setNote] = useState('');

  const toggleSymptom = (catId, label) => {
    setSymptoms((prev) => {
      const catSymptoms = prev[catId] || [];
      return {
        ...prev,
        [catId]: catSymptoms.includes(label)
          ? catSymptoms.filter((s) => s !== label)
          : [...catSymptoms, label],
      };
    });
  };

  const save = () => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({
      type: 'ADD_CHECKIN',
      payload: { date: today, energy, symptoms, note, phase: cycleInfo?.phase },
    });
    navigate('/dashboard');
  };

  const blobSize = 80 + (energy / 100) * 80;
  const phaseColor = cycleInfo?.phaseData?.color || '#D94F1E';

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={24} />
        </button>
        <h1 className="section-title text-xl">CHECK-IN</h1>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Energy */}
        {step === 0 && (
          <motion.div
            key="energy"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="font-display text-xl text-luna-text text-center">
              Comment te sens-tu, côté énergie ?
            </h2>

            {/* Blob */}
            <div className="flex justify-center py-8">
              <motion.div
                animate={{ width: blobSize, height: blobSize }}
                transition={{ type: 'spring', damping: 15 }}
                className="rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${phaseColor}30` }}
              >
                <motion.div
                  animate={{ width: blobSize * 0.7, height: blobSize * 0.7 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${phaseColor}60` }}
                >
                  <span className="text-3xl font-accent font-bold" style={{ color: phaseColor }}>
                    {energy}
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* Slider */}
            <div className="px-4">
              <input
                type="range"
                min={0}
                max={100}
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-luna-text-hint font-body mt-1">
                <span>Épuisée 😴</span>
                <span>Au top ⚡</span>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="btn-luna w-full justify-center">
              Continuer
            </button>
          </motion.div>
        )}

        {/* Step 1: Symptoms */}
        {step === 1 && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-4"
          >
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-1">
              {SYMPTOM_CATEGORIES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-pill text-xs font-body font-semibold transition-all whitespace-nowrap ${
                    activeCategory === i
                      ? 'bg-luna-text text-white'
                      : 'bg-luna-cream-card text-luna-text-muted'
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-2"
                >
                  {SYMPTOM_CATEGORIES[activeCategory].tags.map((tag) => {
                    const isSelected = (symptoms[SYMPTOM_CATEGORIES[activeCategory].id] || []).includes(tag.label);
                    const colors = TAG_COLORS[tag.color];
                    return (
                      <motion.button
                        key={tag.label}
                        whileTap={{ scale: 1.05 }}
                        onClick={() => toggleSymptom(SYMPTOM_CATEGORIES[activeCategory].id, tag.label)}
                        className="px-3 py-2 rounded-pill text-sm font-body font-semibold transition-all border"
                        style={{
                          backgroundColor: isSelected ? colors.bg : '#FFFBF5',
                          borderColor: isSelected ? colors.border : '#E5E0D8',
                          color: isSelected ? colors.text : '#7A6B63',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        {tag.label}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Note */}
            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ajoute une petite remarque ici pour toi..."
                className="w-full px-4 py-3 rounded-pill bg-white border border-luna-sage/30 text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:ring-luna-orange/30"
              />
            </div>

            {/* Summary */}
            {Object.values(symptoms).some((arr) => arr.length > 0) && (
              <div className="bg-luna-cream-card rounded-luna p-3">
                <p className="text-xs font-body text-luna-text-muted mb-1">Sélectionnés :</p>
                <div className="flex flex-wrap gap-1">
                  {Object.values(symptoms).flat().map((s) => (
                    <span key={s} className="text-xs font-body px-2 py-0.5 rounded-pill bg-luna-orange/10 text-luna-orange-deep">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky save button */}
      {step === 1 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 lg:bottom-4 lg:left-64">
          <button onClick={save} className="btn-luna w-full justify-center text-base py-4">
            <Check size={18} />
            Confirmer mon check-in
          </button>
        </div>
      )}
    </div>
  );
}
