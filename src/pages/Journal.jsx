import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Feather, Sparkles, Wind, History, ChevronDown, ChevronUp } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { AFFIRMATIONS, MORNING_RITUALS } from '../data/affirmations';
import { PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
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

const PHASE_JOURNAL_TITLES = {
  menstrual: { main: 'Introspection &', italic: 'Libération' },
  follicular: { main: 'Vision &', italic: 'Ambition' },
  ovulatory: { main: 'Expression &', italic: 'Connexion' },
  luteal: { main: 'Écoute &', italic: 'Bienveillance' },
};

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

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];
  const currentDay = cycleInfo?.currentDay || 1;
  const affirmations = AFFIRMATIONS[phase];
  const affirmationIdx = (currentDay - 1) % affirmations.length;
  const ritual = MORNING_RITUALS[phase];
  const titles = PHASE_JOURNAL_TITLES[phase];

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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Phase tag + Title */}
      <motion.div variants={item}>
        <p className="text-[10px] font-body text-luna-text-hint uppercase tracking-widest mb-3">
          {phaseData.shortName} · Journal
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          {titles.main}{' '}
          <em style={{ color: phaseData.colorDark }}>{titles.italic}</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          Un espace rien qu'à toi pour te reconnecter à ton corps et tes émotions.
        </p>
      </motion.div>

      {/* Morning Ritual / Mindset */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${phaseData.color}20` }}
            >
              <Sparkles size={14} style={{ color: phaseData.color }} />
            </div>
            <h3 className="font-display text-base text-luna-text">Mindset du jour</h3>
          </div>

          {/* Affirmation */}
          <div className="bg-white/60 rounded-[16px] p-4 mb-3">
            <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Affirmation</p>
            <p className="text-sm font-body font-semibold italic leading-relaxed" style={{ color: phaseData.colorDark }}>
              "{affirmations[affirmationIdx]}"
            </p>
          </div>

          {/* Breathing */}
          <div className="bg-white/60 rounded-[16px] p-4 mb-3">
            <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">
              <Wind size={10} className="inline mr-1" />
              Respiration · {ritual.breathing.duration}
            </p>
            <p className="text-xs font-body text-luna-text-muted leading-relaxed">
              {ritual.breathing.description}
            </p>
          </div>

          {/* Intention */}
          <div className="bg-white/60 rounded-[16px] p-4">
            <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Intention</p>
            <p className="text-sm font-body" style={{ color: phaseData.colorDark }}>
              {ritual.intention}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mood Tracker */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <h3 className="font-display text-lg text-luna-text mb-4">Comment tu te sens ?</h3>
          <div className="flex justify-between mb-5">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-[14px] transition-all ${
                  mood === m.label ? 'scale-110' : 'opacity-50 hover:opacity-70'
                }`}
                style={mood === m.label ? { backgroundColor: phaseData.bgColor } : {}}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[9px] font-body text-luna-text-muted">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Energy slider */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-body text-luna-text">Énergie</span>
              <span className="text-sm font-display font-bold" style={{ color: phaseData.colorDark }}>
                {energy}/10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: phaseData.color }}
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
                  className="px-3 py-1.5 rounded-pill text-xs font-body transition-all"
                  style={selectedSymptoms.includes(s) ? {
                    backgroundColor: phaseData.bgColor,
                    color: phaseData.colorDark,
                    fontWeight: 600,
                  } : {
                    backgroundColor: '#F5F2F0',
                    color: '#8A7B7F',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Journal Entry */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Feather size={16} style={{ color: phaseData.color }} />
            <h3 className="font-display text-base text-luna-text">Journal intime</h3>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={phaseData.journalPrompt}
            rows={5}
            className="w-full px-4 py-3 rounded-[14px] bg-gray-50 border-0 text-sm font-body text-luna-text resize-none focus:outline-none focus:ring-2 transition-all placeholder:text-luna-text-hint/50"
            style={{ '--tw-ring-color': `${phaseData.color}40` }}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={saveEntry}
              className="flex items-center gap-2 px-6 py-2.5 rounded-[12px] text-white text-sm font-body font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: saved ? '#7BAE7F' : phaseData.color }}
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
        </div>
      </motion.div>

      {/* History */}
      {pastEntries.length > 0 && (
        <motion.div variants={item}>
          <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <History size={16} style={{ color: phaseData.color }} />
                <h3 className="font-display text-base text-luna-text">Mon historique</h3>
              </div>
              {showHistory ? <ChevronUp size={18} className="text-luna-text-hint" /> : <ChevronDown size={18} className="text-luna-text-hint" />}
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                {pastEntries.map((entry, i) => {
                  const entryPhase = entry.phase ? PHASES[entry.phase] : null;
                  const moodObj = moods.find((m) => m.label === entry.mood);
                  return (
                    <div key={i} className="rounded-[14px] p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-body text-luna-text-hint">
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
                          <span className="text-xs font-body text-luna-text-hint">⚡{entry.energy}/10</span>
                        </div>
                      </div>
                      {entry.symptoms?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-1">
                          {entry.symptoms.map((s) => (
                            <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white rounded-pill text-luna-text-muted font-body">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {entry.text && (
                        <p className="text-xs text-luna-text-muted font-body line-clamp-2">
                          {entry.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Quote */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm font-body text-luna-text-hint italic px-8 leading-relaxed">
          "{phaseData.affirmation}"
        </p>
      </motion.div>
    </motion.div>
  );
}
