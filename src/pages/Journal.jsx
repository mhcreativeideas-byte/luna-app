import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Save, Feather, Sparkles, Wind, History, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BarChart3, TrendingUp, TrendingDown, Minus, Dumbbell, Moon as MoonIcon, Smile } from 'lucide-react';
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
  { emoji: '😊', label: 'Super', value: 5 },
  { emoji: '🙂', label: 'Bien', value: 4 },
  { emoji: '😐', label: 'Neutre', value: 3 },
  { emoji: '😔', label: 'Pas top', value: 2 },
  { emoji: '😢', label: 'Difficile', value: 1 },
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

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function getMonthEntries(entries, year, month) {
  return entries.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function computeMonthStats(entries) {
  if (!entries.length) return null;
  const energies = entries.filter((e) => e.energy).map((e) => e.energy);
  const moodValues = entries.filter((e) => e.mood).map((e) => {
    const m = moods.find((mo) => mo.label === e.mood);
    return m ? m.value : 3;
  });

  const allSymptoms = entries.flatMap((e) => e.symptoms || []);
  const symptomCounts = {};
  allSymptoms.forEach((s) => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Energy by phase
  const energyByPhase = {};
  entries.forEach((e) => {
    if (e.phase && e.energy) {
      if (!energyByPhase[e.phase]) energyByPhase[e.phase] = [];
      energyByPhase[e.phase].push(e.energy);
    }
  });
  const avgEnergyByPhase = {};
  Object.entries(energyByPhase).forEach(([p, vals]) => {
    avgEnergyByPhase[p] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
  });

  // Sport sessions (entries with mood or energy = they checked in)
  const sportDays = entries.filter((e) => e.sportValidated).length;

  return {
    totalEntries: entries.length,
    avgEnergy: energies.length ? Math.round(energies.reduce((a, b) => a + b, 0) / energies.length * 10) / 10 : null,
    avgMood: moodValues.length ? Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length * 10) / 10 : null,
    topSymptoms,
    avgEnergyByPhase,
    sportDays,
  };
}

function TrendIcon({ current, previous }) {
  if (!previous || !current) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.3) return <Minus size={14} className="text-luna-text-hint" />;
  if (diff > 0) return <TrendingUp size={14} className="text-green-500" />;
  return <TrendingDown size={14} className="text-red-400" />;
}

function ProgressBar({ value, max = 10, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

export default function Journal() {
  const { cycleInfo, journalEntries, checkIns, dispatch } = useCycle();
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' | 'rapport'

  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth());
  const [reportYear, setReportYear] = useState(now.getFullYear());

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

  // Report data
  const currentMonthEntries = useMemo(() => getMonthEntries(journalEntries, reportYear, reportMonth), [journalEntries, reportYear, reportMonth]);
  const prevMonth = reportMonth === 0 ? 11 : reportMonth - 1;
  const prevYear = reportMonth === 0 ? reportYear - 1 : reportYear;
  const prevMonthEntries = useMemo(() => getMonthEntries(journalEntries, prevYear, prevMonth), [journalEntries, prevYear, prevMonth]);

  const currentStats = useMemo(() => computeMonthStats(currentMonthEntries), [currentMonthEntries]);
  const prevStats = useMemo(() => computeMonthStats(prevMonthEntries), [prevMonthEntries]);

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

  const navPrevMonth = () => {
    if (reportMonth === 0) { setReportMonth(11); setReportYear(reportYear - 1); }
    else setReportMonth(reportMonth - 1);
  };
  const navNextMonth = () => {
    const isCurrentMonth = reportMonth === now.getMonth() && reportYear === now.getFullYear();
    if (isCurrentMonth) return;
    if (reportMonth === 11) { setReportMonth(0); setReportYear(reportYear + 1); }
    else setReportMonth(reportMonth + 1);
  };

  // Insights generation
  const insights = useMemo(() => {
    const msgs = [];
    if (!currentStats) return msgs;

    if (currentStats.avgEnergy && prevStats?.avgEnergy) {
      const diff = currentStats.avgEnergy - prevStats.avgEnergy;
      if (diff > 0.5) msgs.push(`Ton énergie moyenne a augmenté de ${Math.round(diff * 10) / 10} points ce mois.`);
      else if (diff < -0.5) msgs.push(`Ton énergie était un peu plus basse ce mois. Écoute ton corps.`);
      else msgs.push('Ton énergie est restée stable par rapport au mois dernier.');
    }

    if (currentStats.totalEntries > 0) {
      msgs.push(`Tu as rempli ton journal ${currentStats.totalEntries} jour${currentStats.totalEntries > 1 ? 's' : ''} ce mois.`);
    }

    if (currentStats.avgEnergyByPhase.follicular > 7) {
      msgs.push('Ton énergie en phase folliculaire est excellente — tu en profites bien !');
    }

    if (currentStats.topSymptoms.length > 0) {
      const top = currentStats.topSymptoms[0];
      msgs.push(`"${top[0]}" est ton ressenti le plus fréquent ce mois (${top[1]}x).`);
    }

    return msgs;
  }, [currentStats, prevStats]);

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
          Un espace rien qu'à toi pour te reconnecter à ton corps et suivre ton évolution.
        </p>
      </motion.div>

      {/* Tabs: Journal / Rapport */}
      <motion.div variants={item}>
        <div className="flex gap-2 bg-white rounded-[16px] p-1.5" style={{ boxShadow: '0 1px 8px rgba(45,34,38,0.04)' }}>
          <button
            onClick={() => setActiveTab('journal')}
            className="flex-1 py-2.5 rounded-[12px] text-sm font-body font-semibold transition-all text-center"
            style={activeTab === 'journal' ? { backgroundColor: phaseData.bgColor, color: phaseData.colorDark } : { color: '#8A7B7F' }}
          >
            Mon journal
          </button>
          <button
            onClick={() => setActiveTab('rapport')}
            className="flex-1 py-2.5 rounded-[12px] text-sm font-body font-semibold transition-all text-center flex items-center justify-center gap-1.5"
            style={activeTab === 'rapport' ? { backgroundColor: phaseData.bgColor, color: phaseData.colorDark } : { color: '#8A7B7F' }}
          >
            <BarChart3 size={14} />
            Rapport mensuel
          </button>
        </div>
      </motion.div>

      {/* ============ TAB: JOURNAL ============ */}
      {activeTab === 'journal' && (
        <>
          {/* Morning Ritual / Mindset */}
          <motion.div variants={item}>
            <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
                  <Sparkles size={14} style={{ color: phaseData.color }} />
                </div>
                <h3 className="font-display text-base text-luna-text">Mindset du jour</h3>
              </div>
              <div className="bg-white/60 rounded-[16px] p-4 mb-3">
                <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Affirmation</p>
                <p className="text-sm font-body font-semibold italic leading-relaxed" style={{ color: phaseData.colorDark }}>
                  "{affirmations[affirmationIdx]}"
                </p>
              </div>
              <div className="bg-white/60 rounded-[16px] p-4 mb-3">
                <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">
                  <Wind size={10} className="inline mr-1" />
                  Respiration · {ritual.breathing.duration}
                </p>
                <p className="text-xs font-body text-luna-text-muted leading-relaxed">{ritual.breathing.description}</p>
              </div>
              <div className="bg-white/60 rounded-[16px] p-4">
                <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Intention</p>
                <p className="text-sm font-body" style={{ color: phaseData.colorDark }}>{ritual.intention}</p>
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
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-[14px] transition-all ${mood === m.label ? 'scale-110' : 'opacity-50 hover:opacity-70'}`}
                    style={mood === m.label ? { backgroundColor: phaseData.bgColor } : {}}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[9px] font-body text-luna-text-muted">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-body text-luna-text">Énergie</span>
                  <span className="text-sm font-display font-bold" style={{ color: phaseData.colorDark }}>{energy}/10</span>
                </div>
                <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="w-full" style={{ accentColor: phaseData.color }} />
              </div>

              <div>
                <p className="text-sm font-body text-luna-text mb-2">Symptômes & ressentis</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className="px-3 py-1.5 rounded-pill text-xs font-body transition-all"
                      style={selectedSymptoms.includes(s) ? { backgroundColor: phaseData.bgColor, color: phaseData.colorDark, fontWeight: 600 } : { backgroundColor: '#F5F2F0', color: '#8A7B7F' }}
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
                  {saved ? <>Sauvegardé ✓</> : <><Save size={16} />Sauvegarder</>}
                </button>
              </div>
            </div>
          </motion.div>

          {/* History */}
          {pastEntries.length > 0 && (
            <motion.div variants={item}>
              <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
                <button onClick={() => setShowHistory(!showHistory)} className="flex items-center justify-between w-full">
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
                              {new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              {entryPhase && <span className="ml-2">{entryPhase.icon} {entryPhase.shortName}</span>}
                            </span>
                            <div className="flex items-center gap-1">
                              {moodObj && <span>{moodObj.emoji}</span>}
                              <span className="text-xs font-body text-luna-text-hint">⚡{entry.energy}/10</span>
                            </div>
                          </div>
                          {entry.symptoms?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {entry.symptoms.map((s) => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 bg-white rounded-pill text-luna-text-muted font-body">{s}</span>
                              ))}
                            </div>
                          )}
                          {entry.text && <p className="text-xs text-luna-text-muted font-body line-clamp-2">{entry.text}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* ============ TAB: RAPPORT MENSUEL ============ */}
      {activeTab === 'rapport' && (
        <>
          {/* Month navigation */}
          <motion.div variants={item}>
            <div className="flex items-center justify-between">
              <button onClick={navPrevMonth} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors" style={{ boxShadow: '0 1px 6px rgba(45,34,38,0.06)' }}>
                <ChevronLeft size={18} />
              </button>
              <h2 className="font-display text-xl text-luna-text">
                {MONTH_NAMES[reportMonth]} {reportYear}
              </h2>
              <button
                onClick={navNextMonth}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-colors"
                style={{ boxShadow: '0 1px 6px rgba(45,34,38,0.06)', opacity: (reportMonth === now.getMonth() && reportYear === now.getFullYear()) ? 0.3 : 1 }}
                disabled={reportMonth === now.getMonth() && reportYear === now.getFullYear()}
              >
                <ChevronRight size={18} className="text-luna-text-muted" />
              </button>
            </div>
          </motion.div>

          {/* No data state */}
          {!currentStats && (
            <motion.div variants={item}>
              <div className="bg-white rounded-[24px] p-8 text-center" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
                <BarChart3 size={40} className="mx-auto mb-3 text-luna-text-hint opacity-30" />
                <h3 className="font-display text-base text-luna-text mb-1">Pas encore de données</h3>
                <p className="text-sm font-body text-luna-text-muted">
                  Remplis ton journal et tes check-ins pour voir ton rapport mensuel apparaître ici.
                </p>
              </div>
            </motion.div>
          )}

          {currentStats && (
            <>
              {/* Vue d'ensemble */}
              <motion.div variants={item}>
                <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
                  <h3 className="font-display text-base text-luna-text mb-4">Vue d'ensemble</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Entries */}
                    <div className="text-center p-3 rounded-[14px] bg-gray-50">
                      <p className="text-2xl font-display font-bold text-luna-text">{currentStats.totalEntries}</p>
                      <p className="text-[9px] font-body text-luna-text-hint uppercase mt-1">Jours suivis</p>
                    </div>
                    {/* Avg Energy */}
                    <div className="text-center p-3 rounded-[14px]" style={{ backgroundColor: phaseData.bgColor }}>
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-2xl font-display font-bold text-luna-text">{currentStats.avgEnergy || '—'}</p>
                        <TrendIcon current={currentStats.avgEnergy} previous={prevStats?.avgEnergy} />
                      </div>
                      <p className="text-[9px] font-body text-luna-text-hint uppercase mt-1">Énergie moy.</p>
                    </div>
                    {/* Avg Mood */}
                    <div className="text-center p-3 rounded-[14px] bg-gray-50">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-2xl font-display font-bold text-luna-text">{currentStats.avgMood || '—'}</p>
                        <TrendIcon current={currentStats.avgMood} previous={prevStats?.avgMood} />
                      </div>
                      <p className="text-[9px] font-body text-luna-text-hint uppercase mt-1">Humeur moy.</p>
                    </div>
                  </div>

                  {/* Comparison with prev month */}
                  {prevStats && (
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">
                        vs {MONTH_NAMES[prevMonth]} {prevYear}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <TrendIcon current={currentStats.avgEnergy} previous={prevStats.avgEnergy} />
                          <span className="text-xs font-body text-luna-text-muted">
                            Énergie {currentStats.avgEnergy > prevStats.avgEnergy ? '+' : ''}{currentStats.avgEnergy && prevStats.avgEnergy ? Math.round((currentStats.avgEnergy - prevStats.avgEnergy) * 10) / 10 : '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendIcon current={currentStats.avgMood} previous={prevStats.avgMood} />
                          <span className="text-xs font-body text-luna-text-muted">
                            Humeur {currentStats.avgMood > prevStats.avgMood ? '+' : ''}{currentStats.avgMood && prevStats.avgMood ? Math.round((currentStats.avgMood - prevStats.avgMood) * 10) / 10 : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Énergie par phase */}
              {Object.keys(currentStats.avgEnergyByPhase).length > 0 && (
                <motion.div variants={item}>
                  <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
                    <h3 className="font-display text-base text-luna-text mb-4">Énergie par phase</h3>
                    <div className="space-y-4">
                      {['menstrual', 'follicular', 'ovulatory', 'luteal'].map((p) => {
                        const val = currentStats.avgEnergyByPhase[p];
                        const prevVal = prevStats?.avgEnergyByPhase?.[p];
                        const pd = PHASES[p];
                        if (!val) return null;
                        return (
                          <div key={p}>
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{pd.icon}</span>
                                <span className="text-xs font-body font-semibold text-luna-text">{pd.shortName}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-display font-bold" style={{ color: pd.colorDark }}>{val}/10</span>
                                {prevVal && <TrendIcon current={val} previous={prevVal} />}
                              </div>
                            </div>
                            <ProgressBar value={val} max={10} color={pd.color} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Symptômes fréquents */}
              {currentStats.topSymptoms.length > 0 && (
                <motion.div variants={item}>
                  <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
                    <h3 className="font-display text-base text-luna-text mb-4">Ressentis fréquents</h3>
                    <div className="space-y-3">
                      {currentStats.topSymptoms.map(([symptom, count]) => (
                        <div key={symptom} className="flex items-center justify-between">
                          <span className="text-sm font-body text-luna-text">{symptom}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: count }).map((_, i) => (
                                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: phaseData.color }} />
                              ))}
                            </div>
                            <span className="text-xs font-body text-luna-text-hint w-6 text-right">{count}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Insights */}
              {insights.length > 0 && (
                <motion.div variants={item}>
                  <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={16} style={{ color: phaseData.colorDark }} />
                      <h3 className="font-display text-base text-luna-text">Tes insights</h3>
                    </div>
                    <div className="space-y-2.5">
                      {insights.map((msg, i) => (
                        <div key={i} className="bg-white/60 rounded-[14px] px-4 py-3">
                          <p className="text-sm font-body text-luna-text-body leading-relaxed">{msg}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Disclaimer */}
              <motion.div variants={item}>
                <div className="rounded-[16px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
                  <p className="text-xs font-body text-luna-text-muted text-center leading-relaxed">
                    📊 Ce rapport est basé sur les données que tu as renseignées. Plus tu remplis ton journal, plus il sera précis.
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </>
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
