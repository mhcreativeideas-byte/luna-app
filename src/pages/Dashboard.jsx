import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Flame, ChevronRight, Heart, Apple, CalendarDays, Droplets, Sun, Moon } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';
import { useCycle } from '../contexts/CycleContext';
import { findSymptomFood } from '../data/symptomFoods';
import { PHASES } from '../data/phases';

const PHASE_ICONS = {
  menstrual: Droplets,
  follicular: Sun,
  ovulatory: Sparkles,
  luteal: Moon,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_SUBTITLES = {
  menstrual: 'Ton corps est en phase de renouveau.\nAujourd\'hui, privilégie le repos et l\'écoute de soi.',
  follicular: 'L\'énergie remonte. Ton corps est prêt\nà se dépasser et à créer.',
  ovulatory: 'Tu es à ton pic. Performances,\nconfiance et communication au max.',
  luteal: 'Ton corps se prépare. Écoute-le,\nnourris-le, et adapte ton rythme.',
};

export default function Dashboard() {
  const { cycleInfo, name, cycleLength, periodLength, todayCheckIn } = useCycle();
  const navigate = useNavigate();

  if (!cycleInfo) return <DashboardSkeleton />;

  const { phase, phaseData, currentDay, energyLevel, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const displayName = name || '';
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const energyLabel = energyLevel >= 70 ? 'Haute' : energyLevel >= 45 ? 'Modérée' : 'Basse';
  const PHASE_MOODS = { menstrual: 'Repos', follicular: 'Élan', ovulatory: 'Rayonnante', luteal: 'Cocooning' };
  const moodLabel = PHASE_MOODS[phase] || 'Sereine';

  // Phase segments for cycle ring
  const ovulationDay = cycleLength - 14;
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

      {/* Hero Greeting */}
      <motion.div variants={item}>
        <p className="text-[11px] font-body text-luna-text-hint uppercase tracking-widest mb-2">
          {phaseData.shortName} · Jour {currentDay}
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          {timeGreeting}, <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>{displayName}.</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed whitespace-pre-line">
          {PHASE_SUBTITLES[phase]}
        </p>
      </motion.div>

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
              const progressAngle = (currentDay / cycleLength) * 360;

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
            {daysUntilPeriod <= 0
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
                left: `${Math.round((currentDay / cycleLength) * 100)}%`,
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

      {/* Stats du jour (Énergie · Humeur) */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.06)' }}>
          <Flame size={18} style={{ color: phaseData.color }} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-body text-luna-text-muted leading-tight">Énergie</p>
            <p className="font-display text-base text-luna-text leading-tight">{energyLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-[20px] px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.06)' }}>
          <Sparkles size={18} style={{ color: phaseData.colorDark }} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-body text-luna-text-muted leading-tight">Humeur</p>
            <p className="font-display text-base text-luna-text leading-tight">{moodLabel}</p>
          </div>
        </div>
      </motion.div>

      {/* Check-in du jour — accessible depuis Mon cycle */}
      <motion.div variants={item}>
        <div
          onClick={() => navigate('/checkin')}
          className="rounded-[20px] p-4 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform bg-white"
          style={{ boxShadow: '0 8px 26px rgba(45,34,38,0.06)' }}
        >
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: phaseData.bgColor }}>
            <Heart size={19} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-base text-luna-text leading-tight">Mon check-in du jour</h2>
            <p className="text-xs font-body text-luna-text-muted mt-0.5">
              {todayCheckIn ? 'Déjà noté aujourd\'hui ✓ — appuie pour modifier' : 'Comment tu te sens aujourd\'hui ?'}
            </p>
          </div>
          <ChevronRight size={18} style={{ color: phaseData.colorDark }} className="flex-shrink-0" />
        </div>
      </motion.div>

      {/* Boucle symptôme → aliment : conseil nutrition d'après le check-in */}
      {(() => {
        const symptoms = todayCheckIn?.symptoms ? Object.values(todayCheckIn.symptoms).flat() : [];
        const advice = findSymptomFood(symptoms);
        if (!advice) return null;
        return (
          <motion.div variants={item}>
            <div
              className="rounded-[26px] p-5"
              style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}14)`, boxShadow: '0 8px 26px rgba(45,34,38,0.06)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Apple size={15} style={{ color: phaseData.colorDark }} />
                <p className="text-[10px] font-body font-bold uppercase tracking-widest" style={{ color: phaseData.color }}>
                  {advice.title}
                </p>
              </div>
              <p className="text-sm font-body text-luna-text-body leading-relaxed">
                {advice.why} Pense à : <span className="font-semibold">{advice.foods.join(', ')}</span>.
              </p>
              <button
                onClick={() => navigate(`/recettes-liste?nutrient=${encodeURIComponent(advice.nutrient)}`)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-[14px] text-[13px] font-body font-bold text-white transition-all active:scale-[0.99]"
                style={{ backgroundColor: phaseData.color, boxShadow: `0 4px 14px ${phaseData.color}40` }}
              >
                Voir les recettes riches en {advice.nutrient.toLowerCase()}
                <ChevronRight size={15} />
              </button>
            </div>
          </motion.div>
        );
      })()}

      {/* Accès au calendrier complet */}
      <motion.div variants={item}>
        <button
          onClick={() => navigate('/calendrier')}
          className="w-full rounded-[26px] p-5 flex items-center gap-4 active:scale-[0.99] transition-transform text-white"
          style={{ background: `linear-gradient(135deg, ${phaseData.color}, ${phaseData.colorDark})`, boxShadow: `0 10px 28px ${phaseData.color}40` }}
        >
          <div className="w-12 h-12 rounded-[16px] flex items-center justify-center flex-shrink-0 bg-white/20">
            <CalendarDays size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h2 className="font-display text-lg leading-tight">Mon calendrier</h2>
            <p className="text-xs font-body text-white/80 mt-0.5">
              Suivi du mois, température, règles et spotting
            </p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0 text-white/90" />
        </button>
      </motion.div>

      {/* Disclaimer */}
      <motion.div variants={item} className="text-center pt-4 pb-2">
        <p className="text-[10px] text-luna-text-hint font-body italic">
          "Comprends ton corps. Adapte ta vie."
        </p>
      </motion.div>
    </motion.div>
  );
}
