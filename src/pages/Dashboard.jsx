import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Moon, BookOpen, Sparkles, Flame, ChevronLeft, ChevronRight, Droplets, Sun, Check, CircleDot, Thermometer, Trash2 } from 'lucide-react';
import TopMenu from '../components/ui/TopMenu';
import { useCycle } from '../contexts/CycleContext';
import { getPhaseForDay, PHASES, PHASE_ORDER } from '../data/phases';

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

const PHASE_TITLES = {
  menstrual: { main: 'Repos &', italic: 'Renouveau' },
  follicular: { main: 'Énergie &', italic: 'Renouveau' },
  ovulatory: { main: 'Rayonnement &', italic: 'Puissance' },
  luteal: { main: 'Transition &', italic: 'Douceur' },
};

const SANCTUARY_CARDS = {
  menstrual: [
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Fer & Oméga-3', subtitle: 'Booste ta vitalité avec des épinards frais et du saumon.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SPORT', icon: Dumbbell, title: 'Yoga doux', subtitle: 'Mouvements fluides pour soulager les tensions lombaires.', link: '/sport', color: '#D4727F', bg: '#FDE8EB' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 9h', subtitle: 'Ton corps travaille dur, donne-lui le repos nécessaire.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Journaling : Introspection', subtitle: 'Écris trois choses que ton corps t\'a apprises.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  follicular: [
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Protéines & Zinc', subtitle: 'Ton corps construit — donne-lui le carburant.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SPORT', icon: Dumbbell, title: 'HIIT & Cardio', subtitle: 'Ton corps récupère vite — c\'est le moment de pousser.', link: '/sport', color: '#7BAE7F', bg: '#EDF5ED' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 8h', subtitle: 'Recale ton rythme circadien — lève-toi tôt.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Nouveaux projets', subtitle: 'Lance ce que tu repousses depuis trop longtemps.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  ovulatory: [
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Fibres & Antioxydants', subtitle: 'Accompagne le pic hormonal avec les bons nutriments.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SPORT', icon: Dumbbell, title: 'Haute intensité', subtitle: 'Force et endurance au max — pousse tes limites.', link: '/sport', color: '#E8A87C', bg: '#FFF3EB' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 8h', subtitle: 'Beaucoup d\'énergie mais protège ton sommeil.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Communication & Leadership', subtitle: 'Tes capacités verbales sont à leur pic.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  luteal: [
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Magnésium & Glucides', subtitle: '+200-300 cal/jour — ton métabolisme a augmenté.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SPORT', icon: Dumbbell, title: 'Modéré → Doux', subtitle: 'Pilates, natation, marche — baisse progressivement.', link: '/sport', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 9h', subtitle: 'La progestérone te rend somnolente — écoute ton corps.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Organisation & tri', subtitle: 'C\'est le moment de finaliser, pas de lancer.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
};

const PHASE_INSIGHTS = {
  menstrual: 'Savais-tu que ton métabolisme de repos augmente légèrement pendant cette phase ?',
  follicular: 'L\'œstrogène améliore la plasticité cérébrale — tu apprends plus vite en cette phase.',
  ovulatory: 'Ta voix change légèrement pendant l\'ovulation. Elle devient plus mélodieuse.',
  luteal: 'Ton métabolisme augmente de 10-20%. Manger plus est normal et nécessaire.',
};

const MONTH_NAMES = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const PHASE_ICONS = {
  menstrual: Droplets,
  follicular: Sun,
  ovulatory: Sparkles,
  luteal: Moon,
};

export default function Dashboard() {
  const { cycleInfo, name, cycleLength, periodLength, lastPeriodDate, periodLogs, temperatureLogs, spottingLogs, dispatch } = useCycle();
  const navigate = useNavigate();

  // Calendar state
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmCycleReset, setConfirmCycleReset] = useState(false);
  const [tempInput, setTempInput] = useState('');
  const [tempDirty, setTempDirty] = useState(false);
  const [editingTemp, setEditingTemp] = useState(false);
  const [tempConfirming, setTempConfirming] = useState(false);
  const [tempToConfirm, setTempToConfirm] = useState(null);

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, energyLevel, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const displayName = name || '';
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const cards = SANCTUARY_CARDS[phase] || SANCTUARY_CARDS.follicular;

  // Calendar logic
  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);
  const logs = periodLogs || [];

  const getDayInfo = (year, month, dayNum) => {
    const date = new Date(year, month, dayNum);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const diffDays = Math.floor((date - lastPeriod) / (1000 * 60 * 60 * 24));
    const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
    const dayPhase = getPhaseForDay(cycleDay, cycleLength, periodLength);
    const isToday = date.toDateString() === today.toDateString();
    const isPeriodEstimated = cycleDay <= periodLength;
    const isManualPeriod = logs.includes(dateStr);
    const isPeriod = isPeriodEstimated || isManualPeriod;
    const isOvulation = cycleDay === cycleLength - 14;
    const isFertileWindow = cycleDay >= cycleLength - 17 && cycleDay <= cycleLength - 12;
    return { cycleDay, phase: dayPhase, isToday, isPeriod, isPeriodEstimated, isManualPeriod, isOvulation, isFertileWindow, date, dateStr };
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;

  const prevMonth = () => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); };
  const nextMonth = () => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); };

  // Phase segments for cycle bar
  const ovulationDay = cycleLength - 14;
  const ovulatoryStart = ovulationDay - 1;
  const ovulatoryEnd = ovulationDay + 1;

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

      {/* Cycle Circle — Phase-colored ring with LUNA logo */}
      <motion.div variants={item} className="flex flex-col items-center py-6">
        <div className="relative w-56 h-56">
          {/* LUNA logo watermark */}
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

              const phases = [
                { name: 'menstrual', start: 0, end: periodLength / cycleLength, color: '#D4727F' },
                { name: 'follicular', start: periodLength / cycleLength, end: ovulatoryStart / cycleLength, color: '#7BAE7F' },
                { name: 'ovulatory', start: ovulatoryStart / cycleLength, end: ovulatoryEnd / cycleLength, color: '#E8A87C' },
                { name: 'luteal', start: ovulatoryEnd / cycleLength, end: 1, color: '#B09ACB' },
              ];

              const gap = 0.008;
              const progressAngle = (currentDay / cycleLength) * 360;

              return (
                <>
                  {phases.map((p, i) => {
                    const startAngle = p.start + (i === 0 ? 0 : gap / 2);
                    const endAngle = p.end - (i === phases.length - 1 ? 0 : gap / 2);
                    const dashLen = (endAngle - startAngle) * C;
                    const dashOffset = -(startAngle * C);
                    const isCurrentPhase = p.name === phase;
                    return (
                      <circle
                        key={p.name}
                        cx={cx} cy={cy} r={R}
                        fill="none"
                        stroke={p.color}
                        strokeWidth={isCurrentPhase ? 12 : 8}
                        strokeLinecap="round"
                        strokeDasharray={`${dashLen} ${C - dashLen}`}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        opacity={isCurrentPhase ? 1 : 0.35}
                      />
                    );
                  })}

                  <circle
                    cx={cx} cy={cy - R} r="6"
                    fill="#FFFFFF"
                    stroke={phaseData.color}
                    strokeWidth="3"
                    transform={`rotate(${progressAngle} ${cx} ${cy})`}
                    style={{ filter: `drop-shadow(0 0 4px ${phaseData.color}80)` }}
                  />
                  <circle
                    cx={cx} cy={cy - R} r="2.5"
                    fill={phaseData.colorDark || phaseData.color}
                    transform={`rotate(${progressAngle} ${cx} ${cy})`}
                  />
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
      </motion.div>

      {/* Today's Mood Board */}
      <motion.div variants={item}>
        <h2 className="font-display text-xl text-luna-text mb-1">Aujourd'hui</h2>
        <p className="text-xs font-body text-luna-text-hint mb-4">{phaseData.name}</p>

        {/* Energy Gauge */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Energy Gauge</span>
          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: phaseData.color }}
              initial={{ width: 0 }}
              animate={{ width: `${energyLevel}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <span className="text-sm font-display font-bold" style={{ color: phaseData.colorDark }}>
            {energyLevel}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(card.link)}
              className="rounded-[20px] p-4 flex flex-col items-center text-center cursor-pointer"
              style={{ backgroundColor: card.bg }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5"
                style={{ backgroundColor: `${card.color}18` }}
              >
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <span
                className="text-[9px] font-body font-bold uppercase tracking-widest mb-1"
                style={{ color: card.color }}
              >
                {card.tag}
              </span>
              <h3 className="font-display text-sm text-luna-text leading-snug">{card.title}</h3>
              <p className="text-[11px] font-body text-luna-text-muted mt-1 leading-relaxed">{card.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* L'Insight */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${phaseData.color}20` }}
            >
              <Sparkles size={14} style={{ color: phaseData.color }} />
            </div>
            <h3 className="font-display text-base text-luna-text">L'Insight du jour</h3>
          </div>
          <p className="text-sm font-body text-luna-text-body leading-relaxed italic">
            "{PHASE_INSIGHTS[phase]}"
          </p>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* CALENDRIER — merged from Calendar page                */}
      {/* ═══════════════════════════════════════════════════════ */}

      {/* Section title */}
      <motion.div variants={item}>
        <h2 className="font-display text-xl text-luna-text">Mon calendrier</h2>
        <p className="text-xs font-body text-luna-text-hint mt-1">Suivi jour par jour de ton cycle</p>
      </motion.div>

      {/* Cycle overview card */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5 bg-white" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.06)' }}>
          {/* Current phase */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ backgroundColor: phaseData.bgColor }}
              >
                {phaseData.icon}
              </div>
              <div>
                <p className="font-display text-base text-luna-text">{phaseData.shortName}</p>
                <p className="text-xs font-body text-luna-text-muted">Jour {currentDay} sur {cycleLength}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display font-bold" style={{ color: phaseData.colorDark }}>
                {daysUntilPeriod}
              </p>
              <p className="text-[9px] font-body text-luna-text-hint uppercase">jours avant règles</p>
            </div>
          </div>

          {/* Cycle progress bar with phase colors */}
          <div className="relative mb-3">
            <div className="h-3 rounded-full overflow-hidden flex">
              {[
                { key: 'menstrual', width: (periodLength / cycleLength) * 100 },
                { key: 'follicular', width: ((ovulationDay - 1 - periodLength) / cycleLength) * 100 },
                { key: 'ovulatory', width: (3 / cycleLength) * 100 },
                { key: 'luteal', width: ((cycleLength - ovulationDay - 1) / cycleLength) * 100 },
              ].map((seg) => (
                <div
                  key={seg.key}
                  className="h-full"
                  style={{ width: `${seg.width}%`, backgroundColor: PHASES[seg.key].color, opacity: 0.3 }}
                />
              ))}
            </div>
            {/* Current position indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white transition-all duration-500"
              style={{
                left: `${Math.round((currentDay / cycleLength) * 100)}%`,
                transform: `translateX(-50%) translateY(-50%)`,
                backgroundColor: phaseData.color,
                boxShadow: `0 0 0 3px ${phaseData.color}30`,
              }}
            />
          </div>

          {/* Phase labels under bar */}
          <div className="flex">
            {[
              { key: 'menstrual', width: (periodLength / cycleLength) * 100 },
              { key: 'follicular', width: ((ovulationDay - 1 - periodLength) / cycleLength) * 100 },
              { key: 'ovulatory', width: (3 / cycleLength) * 100 },
              { key: 'luteal', width: ((cycleLength - ovulationDay - 1) / cycleLength) * 100 },
            ].map((seg) => {
              const pd = PHASES[seg.key];
              const Icon = PHASE_ICONS[seg.key];
              return (
                <div key={seg.key} className="flex flex-col items-center" style={{ width: `${seg.width}%` }}>
                  <Icon size={10} style={{ color: pd.color }} />
                  <span className="text-[8px] font-body text-luna-text-hint mt-0.5 leading-none">
                    {pd.shortName.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Calendar grid */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45,34,38,0.06)' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-display text-lg text-luna-text">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button onClick={nextMonth} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Legend pills */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1">
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color }} />
              Confirmé
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.menstrual.color, opacity: 0.45 }} />
              Estimé
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.follicular.color }} />
              Folliculaire
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.ovulatory.color }} />
              Ovulation
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PHASES.luteal.color }} />
              Lutéale
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-body text-luna-text-muted whitespace-nowrap px-2.5 py-1 rounded-pill bg-gray-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#C4727F', opacity: 0.6 }} />
              Spotting
            </span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {WEEKDAYS.map((wd, i) => (
              <span key={i} className="text-center text-[10px] font-body font-semibold text-luna-text-hint uppercase tracking-wider py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const info = getDayInfo(year, month, dayNum);
              const isSelected = selectedDay?.date?.toDateString() === info.date.toDateString();
              const dp = PHASES[info.phase];

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    const next = isSelected ? null : info;
                    setSelectedDay(next);
                    setConfirmStart(false);
                    setConfirmCycleReset(false);
                    setTempInput('');
                    setTempDirty(false);
                    setEditingTemp(false);
                  }}
                  className="aspect-square rounded-[14px] flex flex-col items-center justify-center relative transition-all"
                  style={{
                    backgroundColor: info.isManualPeriod
                      ? PHASES.menstrual.color
                      : info.isPeriodEstimated
                        ? `${PHASES.menstrual.color}60`
                        : info.isOvulation
                          ? PHASES.ovulatory.color
                          : `${dp.color}15`,
                    border: isSelected
                      ? `2px solid ${dp.color}`
                      : info.isFertileWindow && !info.isOvulation
                        ? `1.5px dashed ${PHASES.ovulatory.color}`
                        : '2px solid transparent',
                    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: isSelected ? `0 4px 12px ${dp.color}30` : 'none',
                  }}
                >
                  <span
                    className="text-xs font-body font-semibold"
                    style={{ color: info.isPeriod || info.isOvulation ? 'white' : '#4A3F43' }}
                  >
                    {dayNum}
                  </span>

                  {info.isManualPeriod && (
                    <Check size={8} className="absolute top-0.5 right-0.5" style={{ color: 'white' }} strokeWidth={3} />
                  )}

                  {info.isPeriodEstimated && !info.isManualPeriod && (
                    <CircleDot size={7} className="absolute top-0.5 right-0.5" style={{ color: 'white', opacity: 0.7 }} />
                  )}

                  {(spottingLogs || []).includes(info.dateStr) && (
                    <span className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#C4727F' }} />
                  )}

                  {info.isToday && (
                    <span
                      className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: info.isPeriod || info.isOvulation ? 'white' : dp.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Selected day detail */}
      {selectedDay && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(45,34,38,0.06)' }}>
            {/* Header colored */}
            <div className="p-5" style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-1">
                    {selectedDay.date.toLocaleDateString('fr-FR', { weekday: 'long' })}
                  </p>
                  <h3 className="font-display text-xl text-luna-text">
                    {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                  </h3>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${PHASES[selectedDay.phase]?.color}20` }}
                >
                  {PHASES[selectedDay.phase]?.icon}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white p-5 space-y-3">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill text-white"
                  style={{ backgroundColor: PHASES[selectedDay.phase]?.color }}
                >
                  {PHASES[selectedDay.phase]?.shortName}
                </span>
                <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#F5F2F0', color: '#5A4A4E' }}>
                  Jour {selectedDay.cycleDay}/{cycleLength}
                </span>
                {selectedDay.isOvulation && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.ovulatory.bgColor, color: PHASES.ovulatory.colorDark }}>
                    ⭐ Ovulation
                  </span>
                )}
                {selectedDay.isFertileWindow && !selectedDay.isOvulation && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.ovulatory.bgColor, color: PHASES.ovulatory.colorDark }}>
                    🔸 Fenêtre fertile
                  </span>
                )}
                {selectedDay.isManualPeriod && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: PHASES.menstrual.bgColor, color: PHASES.menstrual.colorDark }}>
                    ✓ Règles confirmées
                  </span>
                )}
                {selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && (
                  <span className="text-xs font-body font-semibold px-3 py-1.5 rounded-pill" style={{ backgroundColor: '#F5F2F0', color: '#9A8A8E' }}>
                    ~ Règles estimées
                  </span>
                )}
              </div>

              {/* Phase summary */}
              <p className="text-sm font-body text-luna-text-body leading-relaxed">
                {PHASES[selectedDay.phase]?.summary}
              </p>

              {/* Hormones */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Œstrogène', level: selectedDay.phase === 'ovulatory' ? 'Élevé' : selectedDay.phase === 'follicular' ? 'En hausse' : selectedDay.phase === 'luteal' ? 'Moyen' : 'Bas' },
                  { label: 'Progestérone', level: selectedDay.phase === 'luteal' ? 'Élevée' : 'Basse' },
                ].map((h) => (
                  <div key={h.label} className="rounded-[12px] p-2.5" style={{ backgroundColor: PHASES[selectedDay.phase]?.bgColor }}>
                    <p className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest">{h.label}</p>
                    <p className="text-xs font-body font-semibold mt-0.5" style={{ color: PHASES[selectedDay.phase]?.colorDark }}>{h.level}</p>
                  </div>
                ))}
              </div>

              {/* Basal Temperature */}
              <div className="pt-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Température basale</p>
                {(() => {
                  const tempLogs = temperatureLogs || {};
                  const raw = tempLogs[selectedDay.dateStr];
                  const savedTemp = (raw !== undefined && raw !== null && raw !== '' && !isNaN(Number(raw))) ? Number(raw) : null;
                  const hasSaved = savedTemp !== null;
                  const phaseColor = PHASES[selectedDay.phase]?.color;
                  const phaseDark = PHASES[selectedDay.phase]?.colorDark;

                  if (tempConfirming && tempToConfirm !== null) {
                    return (
                      <div className="rounded-[14px] px-4 py-4" style={{ backgroundColor: `${phaseColor}10`, border: `1.5px solid ${phaseColor}30` }}>
                        <div className="text-center mb-3">
                          <p className="text-2xl font-display font-bold" style={{ color: phaseDark }}>{tempToConfirm}°C</p>
                          <p className="text-xs font-body text-luna-text-muted mt-1">C'est bien ta température ?</p>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempToConfirm) } });
                              setEditingTemp(false); setTempInput(''); setTempDirty(false); setTempConfirming(false); setTempToConfirm(null);
                            }}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            <Check size={13} />
                            Valider
                          </button>
                          <button
                            onClick={() => { setTempConfirming(false); setTempToConfirm(null); setEditingTemp(true); }}
                            className="px-4 py-2 rounded-full text-xs font-body font-semibold transition-all"
                            style={{ backgroundColor: '#E8E4E0', color: '#8A7B7F' }}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (hasSaved && !editingTemp) {
                    return (
                      <button
                        onClick={() => { setEditingTemp(true); setTempInput(String(savedTemp)); setTempDirty(false); }}
                        className="w-full flex items-center gap-3 rounded-[14px] px-4 py-3 transition-all hover:shadow-sm active:scale-[0.98]"
                        style={{ backgroundColor: `${phaseColor}10`, border: `1.5px solid ${phaseColor}30` }}
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${phaseColor}20` }}>
                          <Thermometer size={14} style={{ color: phaseDark }} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-lg font-display font-bold" style={{ color: phaseDark }}>{savedTemp}°C</p>
                          <p className="text-[10px] font-body text-luna-text-muted">Appuie pour modifier ou supprimer</p>
                        </div>
                        <Check size={16} style={{ color: phaseColor }} />
                      </button>
                    );
                  }

                  if (hasSaved && editingTemp) {
                    return (
                      <div className="rounded-[14px] px-4 py-3" style={{ backgroundColor: '#F8F6F4' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${phaseColor}20` }}>
                            <Thermometer size={14} style={{ color: phaseDark }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="36.5"
                              value={tempInput}
                              onChange={(e) => { setTempInput(e.target.value); }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const val = parseFloat(tempInput.replace(',', '.'));
                                  if (!isNaN(val) && val > 0) { setTempToConfirm(val); setTempConfirming(true); setEditingTemp(false); }
                                }
                              }}
                              className="w-full bg-transparent text-sm font-body font-semibold text-luna-text outline-none placeholder:text-luna-text-hint placeholder:font-normal"
                              autoFocus
                            />
                            <p className="text-[10px] font-body text-luna-text-muted mt-0.5">Modifie ta température</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #E8E4E0' }}>
                          <button
                            onClick={() => {
                              const val = parseFloat(tempInput.replace(',', '.'));
                              if (!isNaN(val) && val > 0) { setTempToConfirm(val); setTempConfirming(true); setEditingTemp(false); }
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            <Check size={13} />
                            Confirmer
                          </button>
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: null } });
                              setTempInput(''); setTempDirty(false); setEditingTemp(false);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                            style={{ backgroundColor: '#D4727F15', color: '#D4727F' }}
                          >
                            <Trash2 size={13} />
                            Supprimer
                          </button>
                          <button
                            onClick={() => { setEditingTemp(false); setTempInput(''); setTempDirty(false); }}
                            className="px-3 py-1.5 rounded-full text-xs font-body text-luna-text-muted hover:text-luna-text transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    );
                  }

                  const tempVal = parseFloat((tempInput || '').replace(',', '.'));
                  const isTempValid = !isNaN(tempVal) && tempVal > 0;

                  return (
                    <div className="rounded-[14px] px-4 py-3" style={{ backgroundColor: '#F8F6F4' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E4E0' }}>
                          <Thermometer size={14} className="text-luna-text-muted" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" placeholder="36.5"
                            value={tempInput}
                            onChange={(e) => { setTempInput(e.target.value); setTempDirty(true); }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && isTempValid) {
                                dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempVal) } });
                                setEditingTemp(false); setTempInput(''); setTempDirty(false);
                              }
                            }}
                            className="w-full bg-transparent text-sm font-body font-semibold text-luna-text outline-none placeholder:text-luna-text-hint placeholder:font-normal"
                          />
                          <p className="text-[10px] font-body text-luna-text-muted mt-0.5">En °C, au réveil avant de te lever</p>
                        </div>
                        {isTempValid && (
                          <button
                            onClick={() => {
                              dispatch({ type: 'SET_TEMPERATURE', payload: { date: selectedDay.dateStr, temperature: String(tempVal) } });
                              setEditingTemp(false); setTempInput(''); setTempDirty(false);
                            }}
                            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-body font-semibold text-white transition-all"
                            style={{ backgroundColor: phaseColor }}
                          >
                            Valider
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Period logging actions */}
              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest">Suivi des règles</p>

                {selectedDay.isPeriodEstimated && (
                  <button
                    onClick={() => {
                      dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                      setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: !prev.isManualPeriod, isPeriod: true } : null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{
                      backgroundColor: selectedDay.isManualPeriod ? PHASES.menstrual.bgColor : '#F8F6F4',
                      border: selectedDay.isManualPeriod ? `1.5px solid ${PHASES.menstrual.color}` : '1.5px solid transparent',
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedDay.isManualPeriod ? PHASES.menstrual.color : '#E8E4E0' }}
                    >
                      {selectedDay.isManualPeriod
                        ? <Check size={14} className="text-white" />
                        : <Droplets size={14} className="text-luna-text-muted" />
                      }
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">
                        {selectedDay.isManualPeriod ? 'Règles confirmées ✓' : 'Confirmer ce jour de règles'}
                      </p>
                      <p className="text-[10px] font-body text-luna-text-muted">
                        {selectedDay.isManualPeriod ? 'Appuie pour retirer la confirmation' : 'L\'estimation semble correcte ? Confirme d\'un tap'}
                      </p>
                    </div>
                  </button>
                )}

                {!selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && !confirmStart && (
                  <button
                    onClick={() => setConfirmStart(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{ backgroundColor: '#F8F6F4', border: '1.5px solid transparent' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E8E4E0' }}>
                      <Droplets size={14} className="text-luna-text-muted" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">J'ai eu mes règles ce jour</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Ce jour n'est pas dans l'estimation</p>
                    </div>
                  </button>
                )}

                {!selectedDay.isPeriodEstimated && !selectedDay.isManualPeriod && confirmStart && (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">Marquer comme jour de règles ?</p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} — ce jour n'était pas prévu dans l'estimation.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                          setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: true, isPeriod: true } : null);
                          setConfirmStart(false);
                        }}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-white transition-colors"
                        style={{ backgroundColor: PHASES.menstrual.color }}
                      >
                        Oui, marquer
                      </button>
                      <button
                        onClick={() => setConfirmStart(false)}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-luna-text-muted bg-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {!selectedDay.isPeriodEstimated && selectedDay.isManualPeriod && (
                  <button
                    onClick={() => {
                      dispatch({ type: 'TOGGLE_PERIOD_DAY', payload: { date: selectedDay.dateStr } });
                      setSelectedDay((prev) => prev ? { ...prev, isManualPeriod: false, isPeriod: false } : null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                    style={{
                      backgroundColor: PHASES.menstrual.bgColor,
                      border: `1.5px solid ${PHASES.menstrual.color}`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PHASES.menstrual.color }}>
                      <Check size={14} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">Règles marquées ✓</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Appuie pour retirer</p>
                    </div>
                  </button>
                )}

                {!confirmCycleReset ? (
                  <button
                    onClick={() => setConfirmCycleReset(true)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-[14px] transition-all"
                    style={{ backgroundColor: '#FFF8F0', border: '1.5px solid #F2C0A830' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#F2C0A830' }}>
                      <CircleDot size={14} style={{ color: '#C4727F' }} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-body font-semibold text-luna-text">Début de mes règles</p>
                      <p className="text-[10px] font-body text-luna-text-muted">Recalcule tout le cycle à partir de ce jour</p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-[14px] p-4" style={{ backgroundColor: PHASES.menstrual.bgColor, border: `1.5px solid ${PHASES.menstrual.color}40` }}>
                    <p className="text-sm font-body text-luna-text font-semibold mb-1">Confirmer le début de tes règles ?</p>
                    <p className="text-xs font-body text-luna-text-muted mb-3">
                      Le {selectedDay.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} sera ton nouveau jour 1. Toutes les estimations de ton cycle seront recalculées.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          dispatch({ type: 'SET_PERIOD_START', payload: { date: selectedDay.dateStr } });
                          setConfirmCycleReset(false);
                          setSelectedDay(null);
                        }}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-white transition-colors"
                        style={{ backgroundColor: PHASES.menstrual.color }}
                      >
                        Oui, recalculer
                      </button>
                      <button
                        onClick={() => setConfirmCycleReset(false)}
                        className="flex-1 py-2.5 rounded-pill text-sm font-body font-semibold text-luna-text-muted bg-white transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {/* Spotting toggle */}
                {(() => {
                  const hasSpotting = (spottingLogs || []).includes(selectedDay.dateStr);
                  return (
                    <button
                      onClick={() => {
                        dispatch({ type: 'TOGGLE_SPOTTING', payload: { date: selectedDay.dateStr } });
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all"
                      style={{
                        backgroundColor: hasSpotting ? '#FDE8EB' : '#F8F6F4',
                        border: hasSpotting ? '1.5px solid #C4727F' : '1.5px solid transparent',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: hasSpotting ? '#C4727F' : '#E8E4E0' }}
                      >
                        {hasSpotting
                          ? <Check size={14} className="text-white" />
                          : <Droplets size={14} style={{ color: '#C4727F' }} />
                        }
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-body font-semibold text-luna-text">
                          {hasSpotting ? 'Spotting noté ✓' : 'Spotting'}
                        </p>
                        <p className="text-[10px] font-body text-luna-text-muted">
                          {hasSpotting ? 'Appuie pour retirer' : 'Légères pertes de sang en dehors des règles'}
                        </p>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar disclaimer */}
      <motion.div variants={item}>
        <div className="rounded-[16px] p-3" style={{ backgroundColor: phaseData.bgColor }}>
          <p className="text-xs font-body text-luna-text-muted text-center leading-relaxed">
            📅 Les dates sont des estimations basées sur ton cycle de {cycleLength} jours. Les variations sont normales.
          </p>
        </div>
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
