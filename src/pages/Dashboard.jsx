import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CalendarDays, BarChart3, Users } from 'lucide-react';
import { PHASE_ICONS } from '../data/phaseIcons';
import TopMenu from '../components/ui/TopMenu';
import AuroraHeader from '../components/ui/AuroraHeader';
import BottomSheet from '../components/ui/BottomSheet';
import SharePartnerCard from '../components/cycle/SharePartnerCard';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useCycle } from '../contexts/CycleContext';
import { PHASES, getOvulationDay } from '../data/phases';
import { PHASE_CYCLE_ACCENTS } from '../data/phaseHeaders';


const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Onglet « Mon cycle » : l'anneau signature, le calendrier, le bilan mensuel
// et l'espace partenaire. Le check-in et la salutation vivent sur Aujourd'hui.
export default function Dashboard() {
  const { cycleInfo, name, cycleLength, periodLength } = useCycle();
  const navigate = useNavigate();
  const [showPartnerSheet, setShowPartnerSheet] = useState(false);

  if (!cycleInfo) return <DashboardSkeleton />;

  const { phase, phaseData, currentDay, daysUntilPeriod } = cycleInfo;

  // Phase segments for cycle ring
  const ovulationDay = getOvulationDay(cycleLength, periodLength);
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;

  // Segments de la barre linéaire des 4 phases (sous l'anneau).
  // Somme = 100 % : menstruelle (periodLength j) + folliculaire + ovulatoire (3 j
  // centrés sur l'ovulation) + lutéale = cycleLength jours.
  const phaseSegments = [
    { key: 'menstrual', width: (periodLength / cycleLength) * 100 },
    { key: 'follicular', width: ((ovulationDay - 2 - periodLength) / cycleLength) * 100 },
    { key: 'ovulatory', width: (3 / cycleLength) * 100 },
    { key: 'luteal', width: ((cycleLength - ovulationDay - 1) / cycleLength) * 100 },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Top Bar — Menu button */}
      <motion.div variants={item}>
        <TopMenu />
      </motion.div>

      {/* En-tête aurore */}
      <AuroraHeader
        title="Mon cycle"
        accent={PHASE_CYCLE_ACCENTS[phase]}
        intro="Suis, comprends, anticipe."
      />

      {/* Cycle Circle — Phase-colored ring with luna logo */}
      <motion.div variants={item} className="flex flex-col items-center bg-white rounded-[32px] px-5 py-7" style={{ boxShadow: `0 14px 38px ${phaseData.color}2B` }}>
        <div className="relative w-56 h-56">
          {/* luna logo watermark */}
          <img
            src="/luna-moon.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain z-0"
            style={{ opacity: 0.12 }}
          />

          {/* Phase-colored ring + progress dot */}
          <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full z-10">
            {(() => {
              const R = 88;
              const C = 2 * Math.PI * R;
              const cx = 100, cy = 100;

              // Éclaircit une couleur hex vers le blanc (pour le départ du dégradé)
              const lighten = (hex, amt) => {
                const n = parseInt(hex.slice(1), 16);
                const r = Math.round((((n >> 16) & 255) * (1 - amt)) + 255 * amt);
                const g = Math.round((((n >> 8) & 255) * (1 - amt)) + 255 * amt);
                const b = Math.round(((n & 255) * (1 - amt)) + 255 * amt);
                return `rgb(${r},${g},${b})`;
              };
              const cDark = phaseData.colorDark || phaseData.color;
              const cLight = lighten(phaseData.color, 0.42);

              // Bornes en fractions de cycle : le segment [start, end] couvre les
              // jours start+1..end — l'ovulatoire (3 j) commence donc à ovulatoryStart-1.
              const phases = [
                { name: 'menstrual', start: 0, end: periodLength / cycleLength, color: '#D4727F' },
                { name: 'follicular', start: periodLength / cycleLength, end: (ovulatoryStart - 1) / cycleLength, color: '#7BAE7F' },
                { name: 'ovulatory', start: (ovulatoryStart - 1) / cycleLength, end: ovulatoryEnd / cycleLength, color: '#E8A87C' },
                { name: 'luteal', start: ovulatoryEnd / cycleLength, end: 1, color: '#B09ACB' },
              ];

              const gap = 0.008;
              // En retard de règles, currentDay dépasse cycleLength : le point
              // s'arrête à la fin de l'anneau au lieu d'entamer un 2e tour.
              const progressAngle = (Math.min(currentDay, cycleLength) / cycleLength) * 360;

              return (
                <>
                  <defs>
                    <linearGradient id="cycleRingGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={cLight} />
                      <stop offset="55%" stopColor={phaseData.color} />
                      <stop offset="100%" stopColor={cDark} />
                    </linearGradient>
                    <filter id="cycleRingGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="cycleRingHalo" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                  </defs>

                  {/* Rail discret en fond */}
                  <circle cx={cx} cy={cy} r={R} fill="none" stroke={phaseData.color} strokeWidth={13} opacity={0.07} />

                  {phases.map((p, i) => {
                    const startAngle = p.start + (i === 0 ? 0 : gap / 2);
                    const endAngle = p.end - (i === phases.length - 1 ? 0 : gap / 2);
                    const dashLen = (endAngle - startAngle) * C;
                    const dashOffset = -(startAngle * C);
                    const isCurrentPhase = p.name === phase;
                    if (isCurrentPhase) {
                      return (
                        <motion.circle
                          key={p.name}
                          cx={cx} cy={cy} r={R}
                          fill="none"
                          stroke="url(#cycleRingGrad)"
                          strokeWidth={13}
                          strokeLinecap="round"
                          strokeDasharray={`${dashLen} ${C}`}
                          transform={`rotate(-90 ${cx} ${cy})`}
                          filter="url(#cycleRingGlow)"
                          initial={{ strokeDashoffset: dashOffset + dashLen }}
                          animate={{ strokeDashoffset: dashOffset }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                        />
                      );
                    }
                    return (
                      <circle
                        key={p.name}
                        cx={cx} cy={cy} r={R}
                        fill="none"
                        stroke={p.color}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray={`${dashLen} ${C - dashLen}`}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        opacity={0.22}
                      />
                    );
                  })}

                  {/* Point de progression lumineux */}
                  <motion.g
                    transform={`rotate(${progressAngle} ${cx} ${cy})`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.0, duration: 0.45 }}
                  >
                    <circle cx={cx} cy={cy - R} r="11" fill={phaseData.color} opacity="0.45" filter="url(#cycleRingHalo)" />
                    <circle cx={cx} cy={cy - R} r="6" fill="#FFFFFF" stroke={phaseData.color} strokeWidth="2.5" />
                    <circle cx={cx} cy={cy - R} r="2.4" fill={cDark} />
                  </motion.g>
                </>
              );
            })()}
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <p
              className="text-[10px] font-body font-semibold uppercase tracking-[0.2em] mb-1"
              style={{ color: phaseData.colorDark || '#2D2226', opacity: 0.7 }}
            >
              Jour du cycle
            </p>
            <motion.p
              className="font-display font-bold leading-none"
              style={{ color: phaseData.colorDark || '#2D2226', fontSize: '3rem' }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {String(currentDay).padStart(2, '0')}
            </motion.p>
            <p className="text-[11px] font-body font-medium mt-1" style={{ color: '#8A7B7F' }}>
              sur {cycleLength} jours
            </p>
          </div>
        </div>

        {/* Next period indicator */}
        <motion.div
          className="mt-4 px-6 py-2.5 rounded-full flex items-center gap-2.5"
          style={{
            backgroundColor: `${phaseData.color}10`,
            border: `1px solid ${phaseData.color}20`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: phaseData.color, boxShadow: `0 0 6px ${phaseData.color}60` }}
          />
          <p className="text-[13px] font-body font-medium" style={{ color: phaseData.colorDark || '#2D2226' }}>
            {cycleInfo.isLate
              ? `Règles attendues depuis ${cycleInfo.lateDays} jour${cycleInfo.lateDays > 1 ? 's' : ''} · confirme-les sur l'accueil`
              : daysUntilPeriod <= 0
                ? 'Tes règles sont prévues aujourd\'hui'
                : daysUntilPeriod === 1
                  ? 'Prochaines règles demain'
                  : `Prochaines règles dans ${daysUntilPeriod} jours`
            }
          </p>
        </motion.div>

        {/* Barre linéaire des 4 phases — la "carte du cycle" en ligne */}
        <div className="w-full mt-6 pt-5" style={{ borderTop: '0.5px solid #EDE7E8' }}>
          <div className="relative mb-3">
            <div className="h-3 rounded-full overflow-hidden flex">
              {phaseSegments.map((seg) => (
                <div
                  key={seg.key}
                  className="h-full"
                  style={{ width: `${seg.width}%`, backgroundColor: PHASES[seg.key].color, opacity: 0.3 }}
                />
              ))}
            </div>
            <div
              className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white transition-all duration-500"
              style={{
                left: `${Math.round((Math.min(currentDay, cycleLength) / cycleLength) * 100)}%`,
                transform: 'translateX(-50%) translateY(-50%)',
                backgroundColor: phaseData.color,
                boxShadow: `0 0 0 3px ${phaseData.color}30`,
              }}
            />
          </div>
          <div className="flex">
            {phaseSegments.map((seg) => {
              const pd = PHASES[seg.key];
              const Icon = PHASE_ICONS[seg.key];
              return (
                <div key={seg.key} className="flex flex-col items-center" style={{ width: `${seg.width}%` }}>
                  <Icon size={11} style={{ color: pd.color }} />
                  <span className="text-[10px] font-body text-luna-text-hint mt-1 leading-none">
                    {pd.shortName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Accès au calendrier complet */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/calendrier')}
          className="w-full rounded-[26px] p-5 flex items-center gap-4 active:scale-[0.99] transition-transform text-white"
          style={{ backgroundColor: phaseData.color, boxShadow: `0 10px 28px ${phaseData.color}40` }}
        >
          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 bg-white/20">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            {/* Blanc en style direct : la règle globale h2 (index.css, hors layer)
                écrase les classes Tailwind comme text-white */}
            <h2 className="font-display text-lg leading-tight" style={{ color: '#FFFFFF' }}>Mon calendrier</h2>
            <p className="text-xs font-body text-white/80 mt-0.5">
              Suivi du mois, température, règles et spotting
            </p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0 text-white/90" />
        </button>
      </motion.div>

      {/* Mon bilan · Partenaire */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/bilan')}
          className="flex flex-col justify-between rounded-[24px] p-5 min-h-[110px] bg-white text-left active:scale-[0.98] transition-transform"
          style={{ boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}
        >
          <BarChart3 size={24} style={{ color: phaseData.colorDark }} />
          <div>
            <p className="font-display text-lg text-luna-text leading-tight">Mon bilan</p>
            <p className="text-[11px] font-body text-luna-text-muted mt-0.5">Tes stats du mois</p>
          </div>
        </button>
        <button
          onClick={() => setShowPartnerSheet(true)}
          className="flex flex-col justify-between rounded-[24px] p-5 min-h-[110px] text-left active:scale-[0.98] transition-transform"
          style={{ backgroundColor: '#F3EEF8', boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}
        >
          <Users size={24} style={{ color: '#7D6A96' }} />
          <div>
            <p className="font-display text-lg text-luna-text leading-tight">Partenaire</p>
            <p className="text-[11px] font-body text-luna-text-muted mt-0.5">Partage ta phase</p>
          </div>
        </button>
      </motion.div>

      <BottomSheet open={showPartnerSheet} onClose={() => setShowPartnerSheet(false)} title="Carte à partager">
        <SharePartnerCard cycleInfo={cycleInfo} name={name} />
      </BottomSheet>

      {/* Disclaimer */}
      <motion.div variants={item} className="text-center pt-4 pb-2">
        <p className="text-[10px] text-luna-text-hint font-body italic">
          "Comprends ton corps. Adapte ta vie."
        </p>
      </motion.div>
    </motion.div>
  );
}
