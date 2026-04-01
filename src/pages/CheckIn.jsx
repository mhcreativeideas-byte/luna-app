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
  const phaseColor = cycleInfo?.phaseData?.color || '#C4727F';

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-xl text-luna-text">Check-in</h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 px-4">
        <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: phaseColor }} />
        <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: step >= 1 ? phaseColor : '#F0EBE8' }} />
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
              Comment te sens-tu, côté énergie, en ce moment ?
            </h2>

            {/* Blob */}
            <div className="flex justify-center py-8">
              <motion.div
                animate={{ width: blobSize, height: blobSize }}
                transition={{ type: 'spring', damping: 15 }}
                className="rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${phaseColor}20` }}
              >
                <motion.div
                  animate={{ width: blobSize * 0.7, height: blobSize * 0.7 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${phaseColor}40` }}
                >
                  <span className="text-3xl font-display font-bold" style={{ color: phaseColor }}>
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
                style={{ accentColor: phaseColor }}
              />
              <div className="flex justify-between text-xs text-luna-text-hint font-body mt-1">
                <span>Vidée</span>
                <span>En feu</span>
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
                  className="flex-shrink-0 px-3.5 py-2 rounded-pill text-xs font-body font-semibold transition-all whitespace-nowrap"
                  style={activeCategory === i ? {
                    backgroundColor: '#2D2226',
                    color: 'white',
                  } : {
                    backgroundColor: 'white',
                    color: '#8A7B7F',
                    boxShadow: '0 1px 4px rgba(45,34,38,0.06)',
                  }}
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
                        className="px-3.5 py-2 rounded-pill text-sm font-body font-semibold transition-all border"
                        style={{
                          backgroundColor: isSelected ? colors.bg : 'white',
                          borderColor: isSelected ? colors.border : '#F0EBE8',
                          color: isSelected ? colors.text : '#8A7B7F',
                          boxShadow: isSelected ? 'none' : '0 1px 4px rgba(45,34,38,0.04)',
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
                placeholder="Un mot pour toi, un souvenir de la journée, ou juste comment tu te sens..."
                className="w-full px-5 py-3.5 rounded-[18px] bg-white border border-gray-100 text-luna-text font-body text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ '--tw-ring-color': `${phaseColor}30` }}
              />
            </div>

            {/* Summary */}
            {Object.values(symptoms).some((arr) => arr.length > 0) && (
              <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                <p className="text-xs font-body text-luna-text-hint mb-2">Selectionnes :</p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.values(symptoms).flat().map((s) => (
                    <span
                      key={s}
                      className="text-xs font-body px-2.5 py-1 rounded-pill"
                      style={{
                        backgroundColor: `${phaseColor}15`,
                        color: cycleInfo?.phaseData?.colorDark || '#A85A66',
                      }}
                    >
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
            C'est noté
          </button>
        </div>
      )}
    </div>
  );
}
