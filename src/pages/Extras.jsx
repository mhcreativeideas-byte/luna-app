import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Moon, ChevronRight, ChevronLeft, Sparkles, BarChart3, TrendingUp, TrendingDown, Minus, Footprints, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SPORT_SUMMARY = {
  menstrual: {
    title: 'Douceur & Récupération',
    desc: 'Privilégie le yoga doux, la marche légère et les étirements. Ton corps a besoin de repos.',
    activities: ['Yoga doux', 'Marche', 'Stretching'],
  },
  follicular: {
    title: 'Énergie & Performance',
    desc: 'Ton énergie remonte, c\'est le moment de pousser. HIIT, cardio, musculation.',
    activities: ['HIIT', 'Cardio', 'Musculation'],
  },
  ovulatory: {
    title: 'Puissance & Dépassement',
    desc: 'Tu es à ton pic physique. Force, endurance et haute intensité.',
    activities: ['Haute intensité', 'CrossFit', 'Course'],
  },
  luteal: {
    title: 'Transition & Adaptation',
    desc: 'Baisse progressivement l\'intensité. Pilates, natation, marche active.',
    activities: ['Pilates', 'Natation', 'Marche active'],
  },
};

const SLEEP_SUMMARY = {
  menstrual: {
    title: 'Le sanctuaire du sommeil',
    desc: 'Objectif 9h. Ton corps travaille dur pour se renouveler, donne-lui le repos nécessaire.',
    tips: ['Tisane camomille', 'Bouillotte', 'Position fœtale'],
  },
  follicular: {
    title: 'Repos & Régénération',
    desc: 'Objectif 8h. Recale ton rythme circadien et profite de l\'énergie matinale.',
    tips: ['Lever tôt', 'Lumière naturelle', 'Routine stable'],
  },
  ovulatory: {
    title: 'Récupération Stratégique',
    desc: 'Objectif 8h. Beaucoup d\'énergie mais protège ton sommeil pour performer.',
    tips: ['Pas d\'écran le soir', 'Méditation', 'Chambre fraîche'],
  },
  luteal: {
    title: 'Douceur & Cocooning',
    desc: 'Objectif 9h. La progestérone te rend somnolente, écoute ton corps.',
    tips: ['Magnésium', 'Respiration guidée', 'Bain tiède'],
  },
};

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const moods = [
  { emoji: '😊', label: 'Super', value: 5 },
  { emoji: '🙂', label: 'Bien', value: 4 },
  { emoji: '😐', label: 'Neutre', value: 3 },
  { emoji: '😔', label: 'Pas top', value: 2 },
  { emoji: '😢', label: 'Difficile', value: 1 },
];

function getMonthEntries(entries, year, month) {
  return entries.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function getMonthSportSessions(sessions, year, month) {
  return (sessions || []).filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function getMonthSportLogs(logs, year, month) {
  return (logs || []).filter((l) => {
    const d = new Date(l.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

function computeMonthStats(entries, sportSessions = [], sportLogs = []) {
  if (!entries.length && !sportSessions.length && !sportLogs.length) return null;

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

  const totalSportSessions = sportSessions.length;
  const sportByPhase = {};
  const sportTypes = {};
  sportSessions.forEach((s) => {
    if (s.phase) sportByPhase[s.phase] = (sportByPhase[s.phase] || 0) + 1;
    if (s.type) sportTypes[s.type] = (sportTypes[s.type] || 0) + 1;
  });
  const topSportType = Object.entries(sportTypes).sort((a, b) => b[1] - a[1])[0] || null;

  const stepsData = sportLogs.filter((l) => l.steps > 0).map((l) => l.steps);
  const avgSteps = stepsData.length ? Math.round(stepsData.reduce((a, b) => a + b, 0) / stepsData.length) : 0;
  const totalStepsDays = stepsData.length;

  const allCustomActivities = sportLogs.flatMap((l) => l.activities || []);
  const totalCustomSessions = allCustomActivities.length;
  const totalCustomDuration = allCustomActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
  const customActivityCounts = {};
  allCustomActivities.forEach((a) => {
    if (a.name) customActivityCounts[a.name] = (customActivityCounts[a.name] || 0) + 1;
  });
  const topCustomActivities = Object.entries(customActivityCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return {
    totalEntries: entries.length,
    avgEnergy: energies.length ? Math.round(energies.reduce((a, b) => a + b, 0) / energies.length * 10) / 10 : null,
    avgMood: moodValues.length ? Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length * 10) / 10 : null,
    topSymptoms,
    avgEnergyByPhase,
    totalSportSessions,
    sportByPhase,
    topSportType,
    avgSteps,
    totalStepsDays,
    totalCustomSessions,
    totalCustomDuration,
    topCustomActivities,
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

export default function Extras() {
  const { cycleInfo, journalEntries, sportSessions, sportLogs, cycleLength, periodLength } = useCycle();
  if (!cycleInfo) return null;

  const { phase, phaseData } = cycleInfo;
  const sport = SPORT_SUMMARY[phase] || SPORT_SUMMARY.follicular;
  const sleep = SLEEP_SUMMARY[phase] || SLEEP_SUMMARY.follicular;

  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth());
  const [reportYear, setReportYear] = useState(now.getFullYear());

  const currentMonthEntries = useMemo(() => getMonthEntries(journalEntries, reportYear, reportMonth), [journalEntries, reportYear, reportMonth]);
  const currentMonthSport = useMemo(() => getMonthSportSessions(sportSessions, reportYear, reportMonth), [sportSessions, reportYear, reportMonth]);
  const currentMonthLogs = useMemo(() => getMonthSportLogs(sportLogs, reportYear, reportMonth), [sportLogs, reportYear, reportMonth]);
  const prevMonth = reportMonth === 0 ? 11 : reportMonth - 1;
  const prevYear = reportMonth === 0 ? reportYear - 1 : reportYear;
  const prevMonthEntries = useMemo(() => getMonthEntries(journalEntries, prevYear, prevMonth), [journalEntries, prevYear, prevMonth]);
  const prevMonthSport = useMemo(() => getMonthSportSessions(sportSessions, prevYear, prevMonth), [sportSessions, prevYear, prevMonth]);
  const prevMonthLogs = useMemo(() => getMonthSportLogs(sportLogs, prevYear, prevMonth), [sportLogs, prevYear, prevMonth]);

  const currentStats = useMemo(() => computeMonthStats(currentMonthEntries, currentMonthSport, currentMonthLogs), [currentMonthEntries, currentMonthSport, currentMonthLogs]);
  const prevStats = useMemo(() => computeMonthStats(prevMonthEntries, prevMonthSport, prevMonthLogs), [prevMonthEntries, prevMonthSport, prevMonthLogs]);

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

  const insights = useMemo(() => {
    const msgs = [];
    if (!currentStats) return msgs;

    if (currentStats.avgEnergy && prevStats?.avgEnergy) {
      const diff = currentStats.avgEnergy - prevStats.avgEnergy;
      if (diff > 0.5) msgs.push(`Ton énergie moyenne a augmenté ce mois (+${Math.round(diff * 10) / 10}). Continue comme ça !`);
      else if (diff < -0.5) msgs.push(`Ton énergie moyenne a baissé ce mois (${Math.round(diff * 10) / 10}). Écoute ton corps et adapte.`);
    }

    if (currentStats.totalEntries > 0) {
      msgs.push(`Tu as rempli ton journal ${currentStats.totalEntries} jour${currentStats.totalEntries > 1 ? 's' : ''} ce mois.`);
    }

    if (currentStats.avgEnergyByPhase.follicular > 7) {
      msgs.push('Ton énergie folliculaire est excellente — tu capitalises bien sur cette phase !');
    }

    if (currentStats.topSymptoms.length > 0) {
      const top = currentStats.topSymptoms[0];
      msgs.push(`Ton ressenti le plus fréquent : "${top[0]}" (${top[1]}x ce mois).`);
    }

    if (currentStats.totalSportSessions > 0) {
      if (prevStats?.totalSportSessions) {
        const diff = currentStats.totalSportSessions - prevStats.totalSportSessions;
        if (diff > 0) msgs.push(`+${diff} séance${diff > 1 ? 's' : ''} de sport vs le mois dernier. Bravo !`);
        else if (diff < 0) msgs.push(`Un peu moins de sport ce mois (${currentStats.totalSportSessions} vs ${prevStats.totalSportSessions}). Écoute ton corps.`);
        else msgs.push(`${currentStats.totalSportSessions} séances ce mois, comme le mois dernier. Belle régularité !`);
      } else {
        msgs.push(`Tu as bougé ${currentStats.totalSportSessions} fois ce mois. Ton corps te remercie !`);
      }
    }

    return msgs;
  }, [currentStats, prevStats]);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-[11px] font-body text-luna-text-hint uppercase tracking-widest mb-2">
          {phaseData.shortName} · Bien-être
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          Aller <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>plus loin</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          Complète ta routine alimentaire avec des conseils sport et sommeil adaptés à ta phase.
        </p>
      </motion.div>

      {/* ============ RAPPORT MENSUEL ============ */}
      <motion.div variants={item}>
        <div className="rounded-[24px] overflow-hidden" style={{ backgroundColor: phaseData.bgColor }}>
          {/* Header rapport */}
          <div className="p-5 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
                <BarChart3 size={20} style={{ color: phaseData.colorDark }} />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg text-luna-text">Rapport mensuel</h2>
                <p className="text-[10px] font-body text-luna-text-muted">Tes stats et tendances</p>
              </div>
            </div>

            {/* Month navigation */}
            <div className="flex items-center justify-between">
              <button onClick={navPrevMonth} className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
                <ChevronLeft size={16} />
              </button>
              <h3 className="font-display text-base text-luna-text">
                {MONTH_NAMES[reportMonth]} {reportYear}
              </h3>
              <button
                onClick={navNextMonth}
                className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center transition-colors"
                style={{ opacity: (reportMonth === now.getMonth() && reportYear === now.getFullYear()) ? 0.3 : 1 }}
                disabled={reportMonth === now.getMonth() && reportYear === now.getFullYear()}
              >
                <ChevronRight size={16} className="text-luna-text-muted" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-5 pb-5 space-y-4">
            {/* No data */}
            {!currentStats && (
              <div className="bg-white/60 rounded-[18px] p-6 text-center">
                <BarChart3 size={32} className="mx-auto mb-2 text-luna-text-hint opacity-30" />
                <p className="text-sm font-body text-luna-text-muted">
                  Remplis ton journal pour voir ton rapport ici.
                </p>
              </div>
            )}

            {currentStats && (
              <>
                {/* Vue d'ensemble */}
                <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                  {/* Cycle info */}
                  <div className="flex items-center gap-3 mb-3 text-center">
                    <div className="flex-1 p-2 rounded-[12px]" style={{ backgroundColor: phaseData.bgColor }}>
                      <p className="text-lg font-display font-bold" style={{ color: phaseData.colorDark }}>{periodLength}j</p>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Règles</p>
                    </div>
                    <div className="flex-1 p-2 rounded-[12px]" style={{ backgroundColor: phaseData.bgColor }}>
                      <p className="text-lg font-display font-bold" style={{ color: phaseData.colorDark }}>{cycleLength}j</p>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Cycle</p>
                    </div>
                    <div className="flex-1 p-2 rounded-[12px] bg-gray-50">
                      <p className="text-lg font-display font-bold text-luna-text">{currentStats.totalEntries}</p>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Jours suivis</p>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-[12px] bg-gray-50">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-base font-display font-bold text-luna-text">{currentStats.totalSportSessions}</p>
                        {prevStats && <TrendIcon current={currentStats.totalSportSessions} previous={prevStats.totalSportSessions} />}
                      </div>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Sport</p>
                    </div>
                    <div className="text-center p-2 rounded-[12px] bg-gray-50">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-base font-display font-bold text-luna-text">{currentStats.avgEnergy || '—'}</p>
                        <TrendIcon current={currentStats.avgEnergy} previous={prevStats?.avgEnergy} />
                      </div>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Énergie</p>
                    </div>
                    <div className="text-center p-2 rounded-[12px] bg-gray-50">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-base font-display font-bold text-luna-text">{currentStats.avgMood || '—'}</p>
                        <TrendIcon current={currentStats.avgMood} previous={prevStats?.avgMood} />
                      </div>
                      <p className="text-[8px] font-body text-luna-text-hint uppercase">Humeur</p>
                    </div>
                  </div>

                  {/* Comparison */}
                  {prevStats && (
                    <div className="mt-3 pt-3 border-t border-gray-50">
                      <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1.5">
                        vs {MONTH_NAMES[prevMonth]}
                      </p>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1">
                          <TrendIcon current={currentStats.avgEnergy} previous={prevStats.avgEnergy} />
                          <span className="text-[10px] font-body text-luna-text-muted">
                            Énergie {currentStats.avgEnergy && prevStats.avgEnergy ? (currentStats.avgEnergy > prevStats.avgEnergy ? '+' : '') + (Math.round((currentStats.avgEnergy - prevStats.avgEnergy) * 10) / 10) : '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendIcon current={currentStats.totalSportSessions} previous={prevStats.totalSportSessions} />
                          <span className="text-[10px] font-body text-luna-text-muted">
                            Sport {currentStats.totalSportSessions > prevStats.totalSportSessions ? '+' : ''}{currentStats.totalSportSessions - prevStats.totalSportSessions}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Énergie par phase */}
                {Object.keys(currentStats.avgEnergyByPhase).length > 0 && (
                  <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                    <h4 className="text-xs font-display font-semibold text-luna-text mb-3">Énergie par phase</h4>
                    <div className="space-y-3">
                      {['menstrual', 'follicular', 'ovulatory', 'luteal'].map((p) => {
                        const val = currentStats.avgEnergyByPhase[p];
                        const prevVal = prevStats?.avgEnergyByPhase?.[p];
                        const pd = PHASES[p];
                        if (!val) return null;
                        return (
                          <div key={p}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs">{pd.icon}</span>
                                <span className="text-[11px] font-body font-semibold text-luna-text">{pd.shortName}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-display font-bold" style={{ color: pd.colorDark }}>{val}/10</span>
                                {prevVal && <TrendIcon current={val} previous={prevVal} />}
                              </div>
                            </div>
                            <ProgressBar value={val} max={10} color={pd.color} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sport par phase */}
                {currentStats.totalSportSessions > 0 && (
                  <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Dumbbell size={14} style={{ color: phaseData.colorDark }} />
                      <h4 className="text-xs font-display font-semibold text-luna-text">Activité sportive</h4>
                    </div>
                    <div className="space-y-2.5">
                      {['menstrual', 'follicular', 'ovulatory', 'luteal'].map((p) => {
                        const count = currentStats.sportByPhase[p] || 0;
                        const pd = PHASES[p];
                        if (!count) return null;
                        return (
                          <div key={p}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs">{pd.icon}</span>
                                <span className="text-[11px] font-body font-semibold text-luna-text">{pd.shortName}</span>
                              </div>
                              <span className="text-xs font-display font-bold" style={{ color: pd.colorDark }}>{count} séances</span>
                            </div>
                            <ProgressBar value={count} max={Math.max(currentStats.totalSportSessions, 8)} color={pd.color} />
                          </div>
                        );
                      })}
                    </div>
                    {currentStats.topSportType && (
                      <div className="mt-3 pt-3 border-t border-gray-50 text-center">
                        <p className="text-[10px] font-body text-luna-text-muted">
                          🏅 Activité préférée : <strong className="text-luna-text">{currentStats.topSportType[0]}</strong> ({currentStats.topSportType[1]}x)
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pas & Activités */}
                {(currentStats.avgSteps > 0 || currentStats.totalCustomSessions > 0) && (
                  <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <Footprints size={14} style={{ color: phaseData.colorDark }} />
                      <h4 className="text-xs font-display font-semibold text-luna-text">Pas & Activités</h4>
                    </div>
                    {currentStats.avgSteps > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-body text-luna-text">Pas/jour (moyenne)</span>
                          <span className="text-sm font-display font-bold" style={{ color: phaseData.colorDark }}>
                            {(currentStats.avgSteps / 1000).toFixed(1)}k
                          </span>
                        </div>
                        <ProgressBar value={currentStats.avgSteps} max={10000} color={phaseData.color} />
                      </div>
                    )}
                    {currentStats.totalCustomSessions > 0 && (
                      <div className="flex gap-2">
                        <div className="flex-1 text-center p-2 rounded-[12px]" style={{ backgroundColor: phaseData.bgColor }}>
                          <p className="text-base font-display font-bold text-luna-text">{currentStats.totalCustomSessions}</p>
                          <p className="text-[8px] font-body text-luna-text-hint uppercase">Activités</p>
                        </div>
                        <div className="flex-1 text-center p-2 rounded-[12px]" style={{ backgroundColor: phaseData.bgColor }}>
                          <p className="text-base font-display font-bold text-luna-text">{currentStats.totalCustomDuration}</p>
                          <p className="text-[8px] font-body text-luna-text-hint uppercase">Minutes</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Ressentis */}
                {currentStats.topSymptoms.length > 0 && (
                  <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
                    <h4 className="text-xs font-display font-semibold text-luna-text mb-3">Ressentis fréquents</h4>
                    <div className="space-y-2">
                      {currentStats.topSymptoms.map(([symptom, count]) => (
                        <div key={symptom} className="flex items-center justify-between">
                          <span className="text-[11px] font-body text-luna-text">{symptom}</span>
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: phaseData.color }} />
                              ))}
                            </div>
                            <span className="text-[10px] font-body text-luna-text-hint">{count}x</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                {insights.length > 0 && (
                  <div className="bg-white/60 rounded-[18px] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={13} style={{ color: phaseData.colorDark }} />
                      <h4 className="text-xs font-display font-semibold text-luna-text">Tes insights</h4>
                    </div>
                    <div className="space-y-1.5">
                      {insights.map((msg, i) => (
                        <p key={i} className="text-[11px] font-body text-luna-text-body leading-relaxed">• {msg}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-[10px] font-body text-luna-text-hint text-center px-4">
                  📊 Plus tu remplis ton journal, plus ton rapport sera précis.
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Journal Card */}
      <motion.div variants={item}>
        <Link
          to="/journal"
          className="block rounded-[24px] p-5 transition-all hover:shadow-md group"
          style={{ backgroundColor: phaseData.bgColor }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
              <BookOpen size={22} style={{ color: phaseData.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-luna-text">Mon journal</h2>
                <ChevronRight size={18} className="text-luna-text-hint group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">
                Humeur, énergie, symptômes et pensées du jour.
              </p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Sport Card */}
      <motion.div variants={item}>
        <Link
          to="/sport"
          className="block rounded-[24px] p-5 transition-all hover:shadow-md group"
          style={{ backgroundColor: '#EDF5ED' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: '#7BAE7F20' }}>
              <Dumbbell size={22} style={{ color: '#7BAE7F' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-luna-text">{sport.title}</h2>
                <ChevronRight size={18} className="text-luna-text-hint group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{sport.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {sport.activities.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs font-body font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#7BAE7F18', color: '#4D7A50' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Sommeil Card */}
      <motion.div variants={item}>
        <Link
          to="/sommeil"
          className="block rounded-[24px] p-5 transition-all hover:shadow-md group"
          style={{ backgroundColor: '#F3EEF8' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: '#B09ACB20' }}>
              <Moon size={22} style={{ color: '#B09ACB' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-luna-text">{sleep.title}</h2>
                <ChevronRight size={18} className="text-luna-text-hint group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{sleep.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {sleep.tips.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-body font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#B09ACB18', color: '#7D6A96' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Insight */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
              <Sparkles size={14} style={{ color: phaseData.color }} />
            </div>
            <h3 className="font-display text-base text-luna-text">Le savais-tu ?</h3>
          </div>
          <p className="text-sm font-body text-luna-text-body leading-relaxed italic">
            {phase === 'menstrual' && '"Le sommeil profond augmente de 10% pendant les règles. C\'est le moment idéal pour une récupération complète."'}
            {phase === 'follicular' && '"L\'œstrogène booste ta coordination motrice. C\'est le meilleur moment pour apprendre un nouveau sport."'}
            {phase === 'ovulatory' && '"Ta température corporelle est plus élevée : tu brûles plus de calories même au repos."'}
            {phase === 'luteal' && '"La progestérone est un anxiolytique naturel. Le yoga et la méditation sont 2x plus efficaces en phase lutéale."'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
