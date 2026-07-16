import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight, BarChart3, Sparkles } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';
import { PHASES } from '../../data/phases';
import { ProfilSkeleton } from '../ui/SkeletonLoader';

// Rapport mensuel (check-ins, énergie par phase, ressentis fréquents).
// Extrait de Profil.jsx — affiché sur la page « Mon bilan » (/bilan).

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function getMonthCheckIns(checkIns, year, month) {
  return (checkIns || []).filter((c) => { const d = new Date(c.date); return d.getFullYear() === year && d.getMonth() === month; });
}

function computeMonthStats(checkIns) {
  if (!checkIns.length) return null;
  const energies = checkIns.filter((c) => typeof c.energy === 'number').map((c) => c.energy);
  const allSymptoms = checkIns.flatMap((c) => Object.values(c.symptoms || {}).flat());
  const symptomCounts = {};
  allSymptoms.forEach((s) => { symptomCounts[s] = (symptomCounts[s] || 0) + 1; });
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const energyByPhase = {};
  checkIns.forEach((c) => {
    if (c.phase && typeof c.energy === 'number') {
      if (!energyByPhase[c.phase]) energyByPhase[c.phase] = [];
      energyByPhase[c.phase].push(c.energy);
    }
  });
  const avgEnergyByPhase = {};
  Object.entries(energyByPhase).forEach(([p, vals]) => {
    avgEnergyByPhase[p] = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });
  return {
    totalEntries: checkIns.length,
    avgEnergy: energies.length ? Math.round(energies.reduce((a, b) => a + b, 0) / energies.length) : null,
    topSymptoms, avgEnergyByPhase,
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
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
    </div>
  );
}

export default function MonthlyReport() {
  const { cycleInfo, checkIns, favorites, cycleLength, periodLength } = useCycle();
  const now = new Date();
  const [reportMonth, setReportMonth] = useState(now.getMonth());
  const [reportYear, setReportYear] = useState(now.getFullYear());

  const currentMonthCheckIns = useMemo(() => getMonthCheckIns(checkIns, reportYear, reportMonth), [checkIns, reportYear, reportMonth]);
  const prevMo = reportMonth === 0 ? 11 : reportMonth - 1;
  const prevYr = reportMonth === 0 ? reportYear - 1 : reportYear;
  const prevMonthCheckIns = useMemo(() => getMonthCheckIns(checkIns, prevYr, prevMo), [checkIns, prevYr, prevMo]);

  const currentStats = useMemo(() => computeMonthStats(currentMonthCheckIns), [currentMonthCheckIns]);
  const prevStats = useMemo(() => computeMonthStats(prevMonthCheckIns), [prevMonthCheckIns]);

  const navPrev = () => { if (reportMonth === 0) { setReportMonth(11); setReportYear(reportYear - 1); } else setReportMonth(reportMonth - 1); };
  const navNext = () => {
    if (reportMonth === now.getMonth() && reportYear === now.getFullYear()) return;
    if (reportMonth === 11) { setReportMonth(0); setReportYear(reportYear + 1); } else setReportMonth(reportMonth + 1);
  };

  const insights = useMemo(() => {
    const msgs = [];
    if (!currentStats) return msgs;
    if (currentStats.avgEnergy != null && prevStats?.avgEnergy != null) {
      const diff = currentStats.avgEnergy - prevStats.avgEnergy;
      if (diff > 5) msgs.push(`Ton énergie moyenne a augmenté de ${diff} points ce mois.`);
      else if (diff < -5) msgs.push('Ton énergie était un peu plus basse ce mois. Écoute ton corps.');
      else msgs.push('Ton énergie est restée stable par rapport au mois dernier.');
    }
    if (currentStats.totalEntries > 0) msgs.push(`Tu as fait ${currentStats.totalEntries} check-in${currentStats.totalEntries > 1 ? 's' : ''} ce mois.`);
    if (currentStats.avgEnergyByPhase.follicular > 70) msgs.push('Ton énergie en phase folliculaire est excellente, tu en profites bien !');
    if (currentStats.topSymptoms.length > 0) { const top = currentStats.topSymptoms[0]; msgs.push(`"${top[0]}" est ton ressenti le plus fréquent ce mois (${top[1]}x).`); }
    return msgs;
  }, [currentStats, prevStats]);

  if (!cycleInfo) return <ProfilSkeleton />;
  const phaseData = cycleInfo.phaseData;

  return (
    <div className="rounded-[28px] overflow-hidden" style={{ backgroundColor: phaseData.bgColor }}>
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
          <button onClick={navPrev} className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-luna-text-muted hover:text-luna-text active:text-luna-text transition-colors">
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
          <div className="bg-white/60 rounded-[22px] p-6 text-center">
            <BarChart3 size={32} className="mx-auto mb-2 text-luna-text-hint opacity-30" />
            <p className="text-sm font-body text-luna-text-muted mb-3">Fais ton check-in du jour pour voir ton rapport ici.</p>
            <Link
              to="/checkin"
              className="inline-block text-xs font-body font-semibold px-4 py-2 rounded-pill text-white"
              style={{ backgroundColor: phaseData.color }}
            >
              Faire mon check-in
            </Link>
          </div>
        )}

        {currentStats && (
          <>
            <div className="bg-white rounded-[22px] p-4" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
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
                  <p className="text-[8px] font-body text-luna-text-hint uppercase">Check-ins</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 rounded-[12px] bg-gray-50">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-base font-display font-bold text-luna-text">{currentStats.avgEnergy != null ? `${currentStats.avgEnergy}%` : '—'}</p>
                    <TrendIcon current={currentStats.avgEnergy} previous={prevStats?.avgEnergy} />
                  </div>
                  <p className="text-[8px] font-body text-luna-text-hint uppercase">Énergie moy.</p>
                </div>
                <div className="text-center p-2 rounded-[12px] bg-gray-50">
                  <p className="text-base font-display font-bold text-luna-text">{favorites?.length || 0}</p>
                  <p className="text-[8px] font-body text-luna-text-hint uppercase">Recettes ❤️</p>
                </div>
              </div>
              {prevStats && currentStats.avgEnergy != null && prevStats.avgEnergy != null && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1.5">
                    vs {MONTH_NAMES[prevMo]}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendIcon current={currentStats.avgEnergy} previous={prevStats.avgEnergy} />
                    <span className="text-[10px] font-body text-luna-text-muted">
                      Énergie {(currentStats.avgEnergy > prevStats.avgEnergy ? '+' : '') + (currentStats.avgEnergy - prevStats.avgEnergy)} pts
                    </span>
                  </div>
                </div>
              )}
            </div>

            {Object.keys(currentStats.avgEnergyByPhase).length > 0 && (
              <div className="bg-white rounded-[22px] p-4" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
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
                            <span className="text-xs font-display font-bold" style={{ color: pd.colorDark }}>{val}%</span>
                            {prevVal && <TrendIcon current={val} previous={prevVal} />}
                          </div>
                        </div>
                        <ProgressBar value={val} max={100} color={pd.color} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStats.topSymptoms.length > 0 && (
              <div className="bg-white rounded-[22px] p-4" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
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
              <div className="bg-white/60 rounded-[22px] p-4">
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
              📊 Plus tu fais de check-ins, plus ton rapport sera précis.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
