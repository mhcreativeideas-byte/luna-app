import { useRef, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Camera, Settings, Share2, TrendingUp, TrendingDown, Minus, Trash2, Pencil, Send, Check, ChevronLeft, ChevronRight, BarChart3, Sparkles, Eye, EyeOff, X, Plus, MessageCircle } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';
import { ProfilSkeleton, SkeletonCard } from '../components/ui/SkeletonLoader';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
  return entries.filter((e) => { const d = new Date(e.date); return d.getFullYear() === year && d.getMonth() === month; });
}
function getMonthSportSessions(sessions, year, month) {
  return (sessions || []).filter((s) => { const d = new Date(s.date); return d.getFullYear() === year && d.getMonth() === month; });
}
function getMonthSportLogs(logs, year, month) {
  return (logs || []).filter((l) => { const d = new Date(l.date); return d.getFullYear() === year && d.getMonth() === month; });
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
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
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
  sportSessions.forEach((s) => { if (s.phase) sportByPhase[s.phase] = (sportByPhase[s.phase] || 0) + 1; });
  const stepsData = sportLogs.filter((l) => l.steps > 0).map((l) => l.steps);
  const avgSteps = stepsData.length ? Math.round(stepsData.reduce((a, b) => a + b, 0) / stepsData.length) : 0;
  const allCustomActivities = sportLogs.flatMap((l) => l.activities || []);
  const totalCustomSessions = allCustomActivities.length;
  const totalCustomDuration = allCustomActivities.reduce((sum, a) => sum + (a.duration || 0), 0);
  return {
    totalEntries: entries.length,
    avgEnergy: energies.length ? Math.round(energies.reduce((a, b) => a + b, 0) / energies.length * 10) / 10 : null,
    avgMood: moodValues.length ? Math.round(moodValues.reduce((a, b) => a + b, 0) / moodValues.length * 10) / 10 : null,
    topSymptoms, avgEnergyByPhase, totalSportSessions, sportByPhase, avgSteps, totalCustomSessions, totalCustomDuration,
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

function MonthlyReport() {
  const { cycleInfo, journalEntries, sportSessions, sportLogs, cycleLength, periodLength } = useCycle();
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth());
  const [reportYear, setReportYear] = useState(now.getFullYear());

  if (!cycleInfo) return <ProfilSkeleton />;
  const phaseData = cycleInfo.phaseData;

  const currentMonthEntries = useMemo(() => getMonthEntries(journalEntries, reportYear, reportMonth), [journalEntries, reportYear, reportMonth]);
  const currentMonthSport = useMemo(() => getMonthSportSessions(sportSessions, reportYear, reportMonth), [sportSessions, reportYear, reportMonth]);
  const currentMonthLogs = useMemo(() => getMonthSportLogs(sportLogs, reportYear, reportMonth), [sportLogs, reportYear, reportMonth]);
  const prevMo = reportMonth === 0 ? 11 : reportMonth - 1;
  const prevYr = reportMonth === 0 ? reportYear - 1 : reportYear;
  const prevMonthEntries = useMemo(() => getMonthEntries(journalEntries, prevYr, prevMo), [journalEntries, prevYr, prevMo]);
  const prevMonthSport = useMemo(() => getMonthSportSessions(sportSessions, prevYr, prevMo), [sportSessions, prevYr, prevMo]);
  const prevMonthLogs = useMemo(() => getMonthSportLogs(sportLogs, prevYr, prevMo), [sportLogs, prevYr, prevMo]);

  const currentStats = useMemo(() => computeMonthStats(currentMonthEntries, currentMonthSport, currentMonthLogs), [currentMonthEntries, currentMonthSport, currentMonthLogs]);
  const prevStats = useMemo(() => computeMonthStats(prevMonthEntries, prevMonthSport, prevMonthLogs), [prevMonthEntries, prevMonthSport, prevMonthLogs]);

  const navPrev = () => { if (reportMonth === 0) { setReportMonth(11); setReportYear(reportYear - 1); } else setReportMonth(reportMonth - 1); };
  const navNext = () => {
    if (reportMonth === now.getMonth() && reportYear === now.getFullYear()) return;
    if (reportMonth === 11) { setReportMonth(0); setReportYear(reportYear + 1); } else setReportMonth(reportMonth + 1);
  };

  const insights = useMemo(() => {
    const msgs = [];
    if (!currentStats) return msgs;
    if (currentStats.avgEnergy && prevStats?.avgEnergy) {
      const diff = currentStats.avgEnergy - prevStats.avgEnergy;
      if (diff > 0.5) msgs.push(`Ton énergie moyenne a augmenté de ${Math.round(diff * 10) / 10} points ce mois.`);
      else if (diff < -0.5) msgs.push(`Ton énergie était un peu plus basse ce mois. Écoute ton corps.`);
      else msgs.push('Ton énergie est restée stable par rapport au mois dernier.');
    }
    if (currentStats.totalEntries > 0) msgs.push(`Tu as rempli ton journal ${currentStats.totalEntries} jour${currentStats.totalEntries > 1 ? 's' : ''} ce mois.`);
    if (currentStats.avgEnergyByPhase.follicular > 7) msgs.push('Ton énergie en phase folliculaire est excellente — tu en profites bien !');
    if (currentStats.topSymptoms.length > 0) { const top = currentStats.topSymptoms[0]; msgs.push(`"${top[0]}" est ton ressenti le plus fréquent ce mois (${top[1]}x).`); }
    if (currentStats.totalSportSessions > 0) {
      if (prevStats?.totalSportSessions) {
        const diff = currentStats.totalSportSessions - prevStats.totalSportSessions;
        if (diff > 0) msgs.push(`Tu as fait ${diff} séance${diff > 1 ? 's' : ''} de plus que le mois dernier. Continue !`);
        else if (diff < 0) msgs.push(`Un peu moins de sport ce mois. Écoute ton corps, chaque mouvement compte.`);
        else msgs.push(`${currentStats.totalSportSessions} séances ce mois, comme le mois dernier. Belle régularité !`);
      } else msgs.push(`Tu as bougé ${currentStats.totalSportSessions} fois ce mois. Ton corps te remercie !`);
    }
    if (currentStats.avgSteps > 0) {
      if (currentStats.avgSteps >= 10000) msgs.push(`${(currentStats.avgSteps / 1000).toFixed(1)}k pas/jour en moyenne — objectif atteint !`);
      else msgs.push(`${(currentStats.avgSteps / 1000).toFixed(1)}k pas/jour en moyenne. Chaque pas compte !`);
    }
    if (currentStats.totalCustomSessions > 0) msgs.push(`${currentStats.totalCustomSessions} activité${currentStats.totalCustomSessions > 1 ? 's' : ''} pour ${currentStats.totalCustomDuration} min ce mois.`);
    return msgs;
  }, [currentStats, prevStats]);

  return (
    <div className="rounded-[24px] overflow-hidden" style={{ backgroundColor: phaseData.bgColor }}>
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
        <div className="flex items-center justify-between">
          <button onClick={navPrev} className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-display text-base text-luna-text">
            {MONTH_NAMES[reportMonth]} {reportYear}
          </h3>
          <button
            onClick={navNext}
            className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center transition-colors"
            style={{ opacity: (reportMonth === now.getMonth() && reportYear === now.getFullYear()) ? 0.3 : 1 }}
            disabled={reportMonth === now.getMonth() && reportYear === now.getFullYear()}
          >
            <ChevronRight size={16} className="text-luna-text-muted" />
          </button>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {!currentStats && (
          <div className="bg-white/60 rounded-[18px] p-6 text-center">
            <BarChart3 size={32} className="mx-auto mb-2 text-luna-text-hint opacity-30" />
            <p className="text-sm font-body text-luna-text-muted">Remplis ton journal pour voir ton rapport ici.</p>
          </div>
        )}

        {currentStats && (
          <>
            <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: '0 2px 8px rgba(45,34,38,0.04)' }}>
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
              {prevStats && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1.5">
                    vs {MONTH_NAMES[prevMo]}
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

            <p className="text-[10px] font-body text-luna-text-hint text-center px-4">
              📊 Plus tu remplis ton journal, plus ton rapport sera précis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const PHASE_NEEDS = {
  menstrual: ['Repos', 'Douceur', 'Patience'],
  follicular: ['Encouragement', 'Aventure', 'Spontanéité'],
  ovulatory: ['Complicité', 'Communication', 'Énergie'],
  luteal: ['Patience', 'Douceur', 'Pas de prise de tête'],
};

const PHASE_SUPPORT = {
  menstrual: ['Une bouillotte serait la bienvenue', 'Ne prends pas mon silence personnellement', 'Un câlin sans rien dire, c\'est parfait'],
  follicular: ['C\'est le bon moment pour planifier ensemble', 'Encourage mes nouvelles idées', 'Propose-moi une sortie ou activité'],
  ovulatory: ['Planifie un moment à deux ce soir', 'C\'est le moment de parler de sujets importants', 'Je suis partante pour une surprise'],
  luteal: ['Un câlin vaut mieux qu\'une solution', 'Propose-moi un thé ou un chocolat chaud', 'Sois patient, ça va passer'],
};

const PHASE_AVOID = {
  menstrual: ['Évite les remarques sur ma fatigue', 'Pas de "c\'est tes règles ou quoi ?"', 'Ne me force pas à sortir si je n\'ai pas envie'],
  follicular: ['Ne freine pas mon enthousiasme', 'Évite d\'annuler nos projets', 'Pas besoin de me surprotéger'],
  ovulatory: ['Évite de me laisser seule ce soir', 'Pas de conflits inutiles, je suis réceptive', 'Ne remets pas à plus tard nos discussions'],
  luteal: ['Évite les sujets stressants ce soir', 'Pas de "tu réagis trop"', 'Ne commente pas ce que je mange'],
};

const PHASE_FOOD_IDEAS = {
  menstrual: ['Chocolat noir et fruits rouges', 'Un plat chaud réconfortant', 'Tisane au gingembre'],
  follicular: ['Salade fraîche et colorée', 'Bowl protéiné avec avocat', 'Un smoothie aux fruits'],
  ovulatory: ['Quelque chose de léger et frais', 'Un repas à partager ensemble', 'Jus de fruits maison'],
  luteal: ['Du chocolat (oui, vraiment)', 'Patate douce et plat réconfortant', 'Infusion camomille avant de dormir'],
};

const PHASE_COLORS = {
  menstrual: { bg: '#D4727F', bgLight: '#FDE8EB', accent: '#A85566' },
  follicular: { bg: '#7BAE7F', bgLight: '#EDF5ED', accent: '#4D7A50' },
  ovulatory: { bg: '#E8A87C', bgLight: '#FFF3EB', accent: '#C47A4A' },
  luteal: { bg: '#B09ACB', bgLight: '#F3EEF8', accent: '#7D6A96' },
};

const ENERGY_LABELS = {
  low: 'Énergie basse — elle a besoin de calme et de douceur',
  medium: 'Énergie moyenne — un rythme tranquille lui convient',
  high: 'Pleine d\'énergie — elle est partante pour des activités !',
};
const getEnergyLabel = (level) => level <= 35 ? ENERGY_LABELS.low : level <= 65 ? ENERGY_LABELS.medium : ENERGY_LABELS.high;

function generateShareCanvas(cycleInfo, userName, sections) {
  const phase = cycleInfo.phase;
  const colors = PHASE_COLORS[phase];
  const phaseData = cycleInfo.phaseData;

  const W = 600;

  // ─── Pre-calculate height ───
  const activeSections = Object.entries(sections).filter(([, s]) => s.enabled && s.items.length > 0);
  let contentH = 440; // header area (icon + name + day + divider + energy + period)
  activeSections.forEach(([key, s]) => {
    if (key === 'needs') contentH += 65;
    else if (key === 'personalMessage') contentH += s.items[0] ? 45 : 0;
    else contentH += 28 + s.items.length * 20 + 14; // title + items + gap
  });
  contentH += 65; // name + branding
  const H = Math.max(550, contentH);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ─── Background gradient ───
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#FBF8F6');
  grad.addColorStop(0.6, colors.bgLight);
  grad.addColorStop(1, '#FBF8F6');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circles
  ctx.beginPath();
  ctx.arc(W + 10, -30, 150, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '14';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-40, H + 20, 130, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '10';
  ctx.fill();

  // ─── Phase icon circle ───
  ctx.beginPath();
  ctx.arc(W / 2, 120, 50, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '20';
  ctx.fill();
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.fillText(phaseData.icon, W / 2, 137);

  // Phase name
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#2D2226';
  ctx.fillText(phaseData.name, W / 2, 210);

  // Cycle day
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.fillText(`Jour ${cycleInfo.currentDay} sur ${cycleInfo.cycleLength}`, W / 2, 245);

  // Divider
  ctx.strokeStyle = colors.bg + '40';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 280);
  ctx.lineTo(W - 80, 280);
  ctx.stroke();

  // ─── Energy (flat style, like original) ───
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.textAlign = 'left';
  ctx.fillText('ÉNERGIE', 60, 325);
  ctx.textAlign = 'right';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = colors.accent;
  ctx.fillText(`${cycleInfo.energyLevel}%`, W - 60, 325);

  // Energy bar
  const barX = 60, barY = 340, barW = W - 120, barH = 12;
  ctx.fillStyle = '#E8E4E0';
  ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 6); ctx.fill();
  ctx.fillStyle = colors.bg;
  ctx.beginPath(); ctx.roundRect(barX, barY, barW * (cycleInfo.energyLevel / 100), barH, 6); ctx.fill();

  // Energy explanation
  ctx.font = '13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.textAlign = 'center';
  ctx.fillText(getEnergyLabel(cycleInfo.energyLevel), W / 2, 375);

  // ─── Period info ───
  ctx.textAlign = 'center';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#5A4A4E';
  const periodText = cycleInfo.daysUntilPeriod <= 0
    ? 'Règles prévues aujourd\'hui'
    : cycleInfo.daysUntilPeriod === 1 ? 'Prochaines règles demain'
      : `Prochaines règles dans ${cycleInfo.daysUntilPeriod} jours`;
  ctx.fillText(periodText, W / 2, 410);

  let curY = 435;

  // ─── Helper: draw a lightweight section (no card, just content) ───
  const drawSection = (title, items, emoji) => {
    // Thin separator line
    ctx.strokeStyle = colors.bg + '30';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(80, curY);
    ctx.lineTo(W - 80, curY);
    ctx.stroke();
    curY += 16;

    // Emoji + Title inline
    ctx.font = '14px serif';
    ctx.textAlign = 'left';
    ctx.fillText(emoji, 75, curY + 1);
    ctx.font = '600 12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = colors.accent;
    ctx.fillText(title, 97, curY);

    curY += 22;

    // Items — compact
    items.forEach((item) => {
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#5A4A4E';
      ctx.textAlign = 'left';
      ctx.fillText(`·  ${item}`, 85, curY);
      curY += 18;
    });

    curY += 6;
  };

  // ─── Draw active sections ───
  activeSections.forEach(([key, s]) => {
    if (key === 'needs' && s.items.length > 0) {
      ctx.font = '600 11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#8A7B7F';
      ctx.textAlign = 'center';
      ctx.fillText('CE DONT J\'AI BESOIN', W / 2, curY);
      const pillY = curY + 12;
      const pillH = 30;
      const pillGap = 8;
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      const totalPW = s.items.reduce((a, n) => a + ctx.measureText(n).width + 24, 0) + (s.items.length - 1) * pillGap;
      let pX = (W - totalPW) / 2;
      s.items.forEach((need) => {
        const tw = ctx.measureText(need).width;
        const pw = tw + 24;
        ctx.fillStyle = colors.bg + '18';
        ctx.beginPath(); ctx.roundRect(pX, pillY, pw, pillH, 15); ctx.fill();
        ctx.strokeStyle = colors.bg + '40';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(pX, pillY, pw, pillH, 15); ctx.stroke();
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'center';
        ctx.fillText(need, pX + pw / 2, pillY + 19);
        pX += pw + pillGap;
      });
      curY = pillY + pillH + 22;
    } else if (key === 'support') {
      drawSection('Comment me soutenir', s.items, '💛');
    } else if (key === 'avoid') {
      drawSection('Ce qu\'il vaut mieux éviter', s.items, '🚫');
    } else if (key === 'food') {
      drawSection('Ce qui me ferait plaisir', s.items, '🍽️');
    } else if (key === 'personalMessage' && s.items[0]) {
      // Thin separator
      ctx.strokeStyle = colors.bg + '30';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(80, curY);
      ctx.lineTo(W - 80, curY);
      ctx.stroke();
      curY += 20;
      // Message text — simple italic centered
      ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = colors.accent;
      ctx.textAlign = 'center';
      ctx.fillText(`"${s.items[0]}"`, W / 2, curY);
      curY += 18;
    }
  });

  // ─── User name ───
  if (userName) {
    curY += 8;
    ctx.font = 'italic 13px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#8A7B7F';
    ctx.textAlign = 'center';
    ctx.fillText(`— ${userName}`, W / 2, curY);
  }

  // ─── LUNA branding (tight to bottom) ───
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = colors.bg + '60';
  ctx.textAlign = 'center';
  ctx.fillText('LUNA 🌙', W / 2, H - 30);
  ctx.font = '10px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F50';
  ctx.fillText('Vis en harmonie avec ton cycle', W / 2, H - 15);

  return canvas;
}

// ─── Editable Section Row ───
function SectionToggle({ label, emoji, enabled, onToggle, items, onUpdateItems, colors }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [newValue, setNewValue] = useState('');

  const startEdit = (i) => { setEditingIdx(i); setEditValue(items[i]); };
  const confirmEdit = () => {
    if (editValue.trim()) {
      const updated = [...items];
      updated[editingIdx] = editValue.trim();
      onUpdateItems(updated);
    }
    setEditingIdx(null);
  };
  const removeItem = (i) => onUpdateItems(items.filter((_, idx) => idx !== i));
  const addItem = () => {
    if (newValue.trim()) {
      onUpdateItems([...items, newValue.trim()]);
      setNewValue('');
      setAdding(false);
    }
  };

  return (
    <div className="mb-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{emoji}</span>
          <span className="font-body text-sm font-semibold text-luna-text">{label}</span>
        </div>
        <div
          className="w-9 h-5 rounded-full flex items-center transition-all duration-200 px-0.5"
          style={{ backgroundColor: enabled ? colors.bg : '#D5D0D2' }}
        >
          <div
            className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
            style={{ transform: enabled ? 'translateX(16px)' : 'translateX(0)' }}
          />
        </div>
      </button>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-6 pb-2 space-y-1.5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 group">
                  {editingIdx === i ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && confirmEdit()}
                        className="flex-1 text-xs font-body bg-white border rounded-lg px-2 py-1.5 outline-none"
                        style={{ borderColor: colors.bg }}
                        autoFocus
                      />
                      <button onClick={confirmEdit} className="p-1">
                        <Check size={13} style={{ color: colors.bg }} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs font-body text-luna-text-body flex-1">• {item}</span>
                      <button onClick={() => startEdit(i)} className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil size={11} className="text-luna-text-hint" />
                      </button>
                      <button onClick={() => removeItem(i)} className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={11} className="text-luna-text-hint" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {adding ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Ajouter..."
                    className="flex-1 text-xs font-body bg-white border rounded-lg px-2 py-1.5 outline-none"
                    style={{ borderColor: colors.bg }}
                    autoFocus
                  />
                  <button onClick={addItem} className="p-1">
                    <Check size={13} style={{ color: colors.bg }} />
                  </button>
                  <button onClick={() => { setAdding(false); setNewValue(''); }} className="p-1">
                    <X size={13} className="text-luna-text-hint" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-1 text-[11px] font-body mt-1 transition-opacity"
                  style={{ color: colors.bg }}
                >
                  <Plus size={11} /> Ajouter
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SharePartnerCard({ cycleInfo, name }) {
  const [shared, setShared] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editing, setEditing] = useState(false);

  const phase = cycleInfo?.phase;
  const phaseData = cycleInfo?.phaseData;
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.menstrual;

  // Sections state
  const [sections, setSections] = useState(() => ({
    needs: { enabled: true, items: [...(PHASE_NEEDS[phase] || [])] },
    support: { enabled: true, items: [...(PHASE_SUPPORT[phase] || [])] },
    avoid: { enabled: false, items: [...(PHASE_AVOID[phase] || [])] },
    food: { enabled: false, items: [...(PHASE_FOOD_IDEAS[phase] || [])] },
    personalMessage: { enabled: false, items: [''] },
  }));

  const [personalMsg, setPersonalMsg] = useState('');

  if (!cycleInfo) return <SkeletonCard height={200} />;

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
    setPreviewUrl(null);
  };

  const updateSectionItems = (key, items) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], items } }));
    setPreviewUrl(null);
  };

  const finalSections = {
    ...sections,
    personalMessage: { ...sections.personalMessage, items: [personalMsg] },
  };

  const handleShare = async () => {
    const canvas = generateShareCanvas(cycleInfo, name, finalSections);
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'luna-phase.png', { type: 'image/png' });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `LUNA — ${phaseData.name}`,
          text: `Je suis en ${phaseData.name} (jour ${cycleInfo.currentDay}/${cycleInfo.cycleLength}). Mon énergie est à ${cycleInfo.energyLevel}%.`,
          files: [file],
        });
      } else {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'luna-phase.png';
        link.href = url;
        link.click();
      }
      setShared(true);
      setTimeout(() => setShared(false), 3000);
    } catch (err) {
      if (err.name !== 'AbortError') {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'luna-phase.png';
        link.href = url;
        link.click();
      }
    }
  };

  const handlePreview = () => {
    if (previewUrl) { setPreviewUrl(null); return; }
    const canvas = generateShareCanvas(cycleInfo, name, finalSections);
    setPreviewUrl(canvas.toDataURL('image/png'));
  };

  return (
    <div
      className="bg-white rounded-[20px] p-5"
      style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Share2 size={16} style={{ color: colors.bg }} />
          <h3 className="font-display text-base text-luna-text">Ensemble</h3>
        </div>
        <button
          onClick={() => { setEditing(!editing); setPreviewUrl(null); }}
          className="flex items-center gap-1 text-xs font-body font-medium px-3 py-1.5 rounded-full transition-all"
          style={{ backgroundColor: editing ? colors.bg : `${colors.bg}15`, color: editing ? '#fff' : colors.accent }}
        >
          <Pencil size={11} />
          {editing ? 'Terminé' : 'Personnaliser'}
        </button>
      </div>
      <p className="text-sm text-luna-text-muted font-body mb-4 leading-relaxed">
        Personnalise ta carte et envoie-la à ton partenaire pour qu'il comprenne ta phase.
      </p>

      {/* Editing panel */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-[16px] p-4 mb-4"
              style={{ backgroundColor: colors.bgLight, border: `1px solid ${colors.bg}15` }}
            >
              <p className="text-[11px] font-body text-luna-text-hint mb-3 uppercase tracking-wider">Active ou désactive les sections</p>

              <SectionToggle
                label="Ce dont j'ai besoin"
                emoji="💜"
                enabled={sections.needs.enabled}
                onToggle={() => toggleSection('needs')}
                items={sections.needs.items}
                onUpdateItems={(items) => updateSectionItems('needs', items)}
                colors={colors}
              />
              <SectionToggle
                label="Comment me soutenir"
                emoji="💛"
                enabled={sections.support.enabled}
                onToggle={() => toggleSection('support')}
                items={sections.support.items}
                onUpdateItems={(items) => updateSectionItems('support', items)}
                colors={colors}
              />
              <SectionToggle
                label="Ce qu'il vaut mieux éviter"
                emoji="🚫"
                enabled={sections.avoid.enabled}
                onToggle={() => toggleSection('avoid')}
                items={sections.avoid.items}
                onUpdateItems={(items) => updateSectionItems('avoid', items)}
                colors={colors}
              />
              <SectionToggle
                label="Ce qui me ferait plaisir à manger"
                emoji="🍽️"
                enabled={sections.food.enabled}
                onToggle={() => toggleSection('food')}
                items={sections.food.items}
                onUpdateItems={(items) => updateSectionItems('food', items)}
                colors={colors}
              />

              {/* Personal message */}
              <div className="mb-1">
                <button onClick={() => toggleSection('personalMessage')} className="flex items-center justify-between w-full py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">✉️</span>
                    <span className="font-body text-sm font-semibold text-luna-text">Mon message perso</span>
                  </div>
                  <div
                    className="w-9 h-5 rounded-full flex items-center transition-all duration-200 px-0.5"
                    style={{ backgroundColor: sections.personalMessage.enabled ? colors.bg : '#D5D0D2' }}
                  >
                    <div
                      className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                      style={{ transform: sections.personalMessage.enabled ? 'translateX(16px)' : 'translateX(0)' }}
                    />
                  </div>
                </button>
                <AnimatePresence>
                  {sections.personalMessage.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={personalMsg}
                        onChange={(e) => { setPersonalMsg(e.target.value); setPreviewUrl(null); }}
                        placeholder="Ex: Journée difficile, sois patient ce soir 💜"
                        className="w-full text-xs font-body bg-white border rounded-xl px-3 py-2 outline-none resize-none mt-1"
                        style={{ borderColor: `${colors.bg}40` }}
                        rows={2}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini preview (when not editing) */}
      {!editing && (
        <div
          className="rounded-[16px] p-4 mb-4"
          style={{ backgroundColor: colors.bgLight, border: `1px solid ${colors.bg}20` }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${colors.bg}20` }}
            >
              {phaseData.icon}
            </div>
            <div>
              <p className="font-display text-sm text-luna-text font-semibold">{phaseData.name}</p>
              <p className="text-[11px] font-body text-luna-text-muted">
                Jour {cycleInfo.currentDay}/{cycleInfo.cycleLength} · Énergie {cycleInfo.energyLevel}%
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {sections.needs.enabled && sections.needs.items.map((need) => (
              <span key={need} className="text-[11px] font-body font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${colors.bg}18`, color: colors.accent }}>
                {need}
              </span>
            ))}
          </div>
          {/* Summary of active sections */}
          <div className="flex flex-wrap gap-1 mt-1">
            {sections.support.enabled && <span className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}>💛 Soutien</span>}
            {sections.avoid.enabled && <span className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}>🚫 À éviter</span>}
            {sections.food.enabled && <span className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}>🍽️ Repas</span>}
            {sections.personalMessage.enabled && personalMsg && <span className="text-[10px] font-body px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}>✉️ Message</span>}
          </div>
        </div>
      )}

      {/* Preview image */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <img src={previewUrl} alt="Aperçu de la carte" className="w-full rounded-[12px]" style={{ border: `1px solid ${colors.bg}20` }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: colors.bg }}
        >
          {shared ? <Check size={15} /> : <Send size={15} />}
          {shared ? 'Envoyé !' : 'Envoyer la carte'}
        </button>
        <button
          onClick={handlePreview}
          className="px-4 py-2.5 rounded-full text-sm font-body font-medium transition-all"
          style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}
        >
          {previewUrl ? 'Masquer' : 'Aperçu'}
        </button>
      </div>
    </div>
  );
}

export default function Profil() {
  const { name, cycleLength, periodLength, cycleInfo, checkIns, goals, dispatch, profileImage } = useCycle();
  const phaseData = cycleInfo?.phaseData || { color: '#B0A5AA', colorDark: '#6B5E62', bgColor: '#F5F2F0' };
  const fileInputRef = useRef(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        dispatch({ type: 'SET_PROFILE', payload: { profileImage: dataUrl } });
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const totalCheckIns = checkIns?.length || 0;

  const symptomCounts = {};
  (checkIns || []).forEach((c) => {
    Object.values(c.symptoms || {}).flat().forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <BackButton />
      {/* Header */}
      <motion.div variants={item} className="flex justify-between items-start">
        <h1 className="font-display text-2xl text-luna-text">Profil</h1>
        <Link
          to="/parametres"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <Settings size={18} />
        </Link>
      </motion.div>

      {/* Avatar & name */}
      <motion.div variants={item} className="text-center py-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div
            className="cursor-pointer"
            onClick={() => profileImage ? setShowPhotoMenu(!showPhotoMenu) : fileInputRef.current?.click()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #F5D0D5, #F2C0A8)',
                }}
              >
                <span className="text-2xl font-display text-white">{name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #C4727F, #D4846A)' }}
            >
              <Camera size={13} className="text-white" />
            </div>
          </div>

          {/* Photo menu */}
          <AnimatePresence>
            {showPhotoMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded-[16px] overflow-hidden z-20"
                style={{ boxShadow: '0 4px 20px rgba(45, 34, 38, 0.12)', minWidth: '160px' }}
              >
                <button
                  onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={15} className="text-luna-text-muted" />
                  Modifier
                </button>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={() => { setShowPhotoMenu(false); dispatch({ type: 'SET_PROFILE', payload: { profileImage: null } }); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-body text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <h2 className="font-display text-xl text-luna-text">{name}</h2>
        {cycleInfo && (
          <p className="text-xs font-body text-luna-text-hint mt-1">
            {cycleInfo.phaseData.icon} {cycleInfo.phaseData.name} — Jour {cycleInfo.currentDay}
          </p>
        )}
      </motion.div>

      {/* Backdrop to close photo menu */}
      {showPhotoMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowPhotoMenu(false)} />
      )}

      {/* Cycle stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{cycleLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de cycle</p>
        </div>
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{periodLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de règles</p>
        </div>
      </motion.div>

      {/* Calendar link */}
      <motion.div variants={item}>
        <Link
          to="/dashboard"
          className="flex items-center gap-4 bg-white rounded-[20px] p-4 hover:shadow-md transition-all"
          style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FDE8EB, #F5D0D5)' }}
          >
            <Calendar size={20} style={{ color: '#C4727F' }} />
          </div>
          <div>
            <p className="text-sm font-body font-semibold text-luna-text">Mon calendrier</p>
            <p className="text-xs text-luna-text-hint font-body">Visualise ton cycle mois par mois</p>
          </div>
        </Link>
      </motion.div>

      {/* Monthly Report */}
      <motion.div variants={item}>
        <MonthlyReport />
      </motion.div>

      {/* Together card — Share with partner */}
      <motion.div variants={item}>
        <SharePartnerCard cycleInfo={cycleInfo} name={name} />
      </motion.div>

      {/* Insights card */}
      <motion.div variants={item}>
        <div
          className="rounded-[20px] p-5 relative overflow-hidden"
          style={{
            backgroundColor: phaseData.bgColor,
          }}
        >
          <div
            className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
            style={{ backgroundColor: phaseData.color }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} style={{ color: phaseData.colorDark }} />
              <h3 className="font-display text-base text-luna-text">Insights</h3>
            </div>
            {totalCheckIns >= 15 ? (
              <div>
                <p className="text-sm font-body mb-3 text-luna-text-body">
                  Tes patterns basés sur {totalCheckIns} check-ins :
                </p>
                {topSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {topSymptoms.map(([symptom, count]) => (
                      <span
                        key={symptom}
                        className="text-xs px-2.5 py-1 rounded-pill font-body font-semibold"
                        style={{ backgroundColor: `${phaseData.color}20`, color: phaseData.colorDark }}
                      >
                        {symptom} ({count}x)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-body mb-2 text-luna-text-body leading-relaxed">
                  Plus tu enregistres, plus LUNA détecte tes patterns. Après 3 cycles complets, tu auras une vue précise de tes tendances.
                </p>
                <p className="text-xs font-body text-luna-text-muted">
                  {totalCheckIns}/15 check-ins
                </p>
                <div className="h-2 rounded-full mt-3 overflow-hidden" style={{ backgroundColor: `${phaseData.color}20` }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalCheckIns / 15) * 100)}%`, backgroundColor: phaseData.color }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
