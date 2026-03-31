import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Feather, Sparkles, Wind, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { AFFIRMATIONS, MORNING_RITUALS } from '../data/affirmations';
import { PHASES } from '../data/phases';
import PageHeader from '../components/layout/PageHeader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const moods = [
  { emoji: '😊', label: 'Super' },
  { emoji: '🙂', label: 'Bien' },
  { emoji: '😐', label: 'Neutre' },
  { emoji: '😔', label: 'Pas top' },
  { emoji: '😢', label: 'Difficile' },
];

const symptoms = [
  'Crampes', 'Ballonnements', 'Maux de tête', 'Sensibilité poitrine',
  'Acné', 'Fatigue', 'Insomnie', 'Irritabilité',
  'Motivation haute', 'Créativité', 'Confiance', 'Libido',
];

export default function Journal() {
  const { cycleInfo, journalEntries, dispatch } = useCycle();
  const [showHistory, setShowHistory] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const todayEntry = journalEntries.find((e) => e.date === today) || {
    date: today,
    mood: null,
    energy: 5,
    symptoms: [],
    text: '',
  };

  const [mood, setMood] = useState(todayEntry.mood);
  const [energy, setEnergy] = useState(todayEntry.energy);
  const [selectedSymptoms, setSelectedSymptoms] = useState(todayEntry.symptoms);
  const [text, setText] = useState(todayEntry.text);
  const [saved, setSaved] = useState(false);

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay } = cycleInfo;
  const affirmations = AFFIRMATIONS[phase];
  const affirmationIdx = (currentDay - 1) % affirmations.length;
  const ritual = MORNING_RITUALS[phase];

  const toggleSymptom = (s) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const saveEntry = () => {
    dispatch({
      type: 'ADD_JOURNAL_ENTRY',
      payload: {
        date: today,
        phase,
        mood,
        energy,
        symptoms: selectedSymptoms,
        text,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const pastEntries = [...journalEntries]
    .filter((e) => e.date !== today)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item}>
        <PageHeader
          title="Mon Journal"
          subtitle="Un espace rien qu'à toi pour te reconnecter à ton corps."
          icon="✍️"
        />
      </motion.div>

      {/* Morning ritual */}
      <motion.div
        variants={item}
        className="rounded-luna p-5"
        style={{ backgroundColor: phaseData.bgColor }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} style={{ color: phaseData.colorDark }} />
          <h3 className="font-display text-base" style={{ color: phaseData.colorDark }}>
            Rituel du matin
          </h3>
        </div>

        {/* Affirmation */}
        <div className="bg-white/60 rounded-luna-sm p-3 mb-3">
          <p className="text-xs font-accent font-semibold text-luna-text-secondary mb-1">Affirmation du jour</p>
          <p className="text-sm font-body font-semibold italic" style={{ color: phaseData.colorDark }}>
            "{affirmations[affirmationIdx]}"
          </p>
        </div>

        {/* Breathing */}
        <div className="bg-white/60 rounded-luna-sm p-3 mb-3">
          <p className="text-xs font-accent font-semibold text-luna-text-secondary mb-1">
            <Wind size={12} className="inline mr-1" />
            {ritual.breathing.name} ({ritual.breathing.duration})
          </p>
          <p className="text-sm font-body text-luna-text-secondary">
            {ritual.breathing.description}
          </p>
        </div>

        {/* Intention */}
        <div className="bg-white/60 rounded-luna-sm p-3">
          <p className="text-xs font-accent font-semibold text-luna-text-secondary mb-1">Intention du jour</p>
          <p className="text-sm font-body" style={{ color: phaseData.colorDark }}>
            {ritual.intention}
          </p>
        </div>
      </motion.div>

      {/* Mood tracker */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <h3 className="font-display text-lg text-luna-text mb-3">Comment tu te sens aujourd'hui ?</h3>
        <div className="flex justify-between mb-4">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setMood(m.label)}
              className={`flex flex-col items-center gap-1 p-2 rounded-luna-sm transition-all ${
                mood === m.label ? 'scale-110 bg-white shadow-sm' : 'opacity-60 hover:opacity-80'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-body text-luna-text-secondary">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Energy slider */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-body text-luna-text">Énergie</span>
            <span className="text-sm font-accent font-bold" style={{ color: phaseData.colorDark }}>
              {energy}/10
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-luna-rose"
          />
        </div>

        {/* Symptoms */}
        <div>
          <p className="text-sm font-body text-luna-text mb-2">Symptômes & ressentis</p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((s) => (
              <button
                key={s}
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1 rounded-full text-xs font-body transition-all border ${
                  selectedSymptoms.includes(s)
                    ? 'border-luna-rose bg-luna-rose/10 text-luna-rose-dark font-semibold'
                    : 'border-luna-rose/20 bg-white text-luna-text-secondary'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Journal entry */}
      <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
        <div className="flex items-center gap-2 mb-3">
          <Feather size={18} style={{ color: phaseData.color }} />
          <h3 className="font-display text-base text-luna-text">Journal intime</h3>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={phaseData.journalPrompt}
          rows={4}
          className="w-full px-4 py-3 rounded-luna-sm bg-white border border-luna-rose/15 text-sm font-body text-luna-text resize-none focus:outline-none focus:ring-2 focus:ring-luna-rose/30 transition-all placeholder:text-luna-text-secondary/50"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={saveEntry}
            className="flex items-center gap-2 px-5 py-2 rounded-luna-sm text-white text-sm font-body font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: saved ? '#A8D5BA' : phaseData.color }}
          >
            {saved ? (
              <>Sauvegardé ✓</>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* History */}
      {pastEntries.length > 0 && (
        <motion.div variants={item} className="bg-luna-cream-light rounded-luna p-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full"
          >
            <div className="flex items-center gap-2">
              <History size={18} style={{ color: phaseData.color }} />
              <h3 className="font-display text-base text-luna-text">Mon historique</h3>
            </div>
            {showHistory ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showHistory && (
            <div className="mt-3 space-y-3">
              {pastEntries.map((entry, i) => {
                const entryPhase = entry.phase ? PHASES[entry.phase] : null;
                const moodObj = moods.find((m) => m.label === entry.mood);
                return (
                  <div key={i} className="bg-white rounded-luna-sm p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-accent text-luna-text-secondary">
                        {new Date(entry.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                        {entryPhase && (
                          <span className="ml-2">{entryPhase.icon} {entryPhase.shortName}</span>
                        )}
                      </span>
                      <div className="flex items-center gap-1">
                        {moodObj && <span>{moodObj.emoji}</span>}
                        <span className="text-xs font-accent">⚡{entry.energy}/10</span>
                      </div>
                    </div>
                    {entry.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1">
                        {entry.symptoms.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 bg-luna-cream rounded-full text-luna-text-secondary">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.text && (
                      <p className="text-xs text-luna-text-secondary font-body line-clamp-2">
                        {entry.text}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
