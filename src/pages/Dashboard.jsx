import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, UtensilsCrossed, Moon, BookOpen, Sparkles, Settings, User, LogOut, X, Flame, MoreHorizontal } from 'lucide-react';
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

export default function Dashboard() {
  const { greeting, cycleInfo, todayCheckIn, name, signOut } = useCycle();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength, periodLength, energyLevel, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const displayName = name || '';
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const cards = SANCTUARY_CARDS[phase] || SANCTUARY_CARDS.follicular;
  const titles = PHASE_TITLES[phase] || PHASE_TITLES.follicular;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      {/* Top Bar — Menu button */}
      <motion.div variants={item} className="flex justify-end relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-luna-text-muted hover:text-luna-text hover:border-gray-200 transition-all"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        >
          <MoreHorizontal size={18} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 w-52"
              >
                <button
                  onClick={() => { setMenuOpen(false); navigate('/profil'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="text-luna-text-muted" />
                  Mon profil
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/plus'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
                >
                  <Sparkles size={16} className="text-luna-text-muted" />
                  Plus
                </button>
                <button
                  onClick={() => { setMenuOpen(false); navigate('/parametres'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} className="text-luna-text-muted" />
                  Paramètres
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { setMenuOpen(false); signOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Se déconnecter
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
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

      {/* Energy Gauge */}
      <motion.div variants={item} className="flex items-center gap-4">
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
      </motion.div>

      {/* Cycle Circle — Phase-colored ring with LUNA logo */}
      <motion.div variants={item} className="flex flex-col items-center py-6 cursor-pointer" onClick={() => navigate('/calendrier')} whileTap={{ scale: 0.97 }}>
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
              const C = 2 * Math.PI * R; // ~553
              const cx = 100, cy = 100;
              const ovulationDay = cycleLength - 14;
              const ovulatoryStart = ovulationDay - 1;
              const ovulatoryEnd = ovulationDay + 1;

              // Phase boundaries as fractions of cycle
              const phases = [
                { name: 'menstrual', start: 0, end: periodLength / cycleLength, color: '#D4727F' },
                { name: 'follicular', start: periodLength / cycleLength, end: ovulatoryStart / cycleLength, color: '#7BAE7F' },
                { name: 'ovulatory', start: ovulatoryStart / cycleLength, end: ovulatoryEnd / cycleLength, color: '#E8A87C' },
                { name: 'luteal', start: ovulatoryEnd / cycleLength, end: 1, color: '#B09ACB' },
              ];

              const gap = 0.008; // small gap between segments
              const progressAngle = (currentDay / cycleLength) * 360;

              return (
                <>
                  {/* Phase segments */}
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
                        strokeWidth={isCurrentPhase ? 8 : 5}
                        strokeLinecap="round"
                        strokeDasharray={`${dashLen} ${C - dashLen}`}
                        strokeDashoffset={dashOffset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                        opacity={isCurrentPhase ? 1 : 0.35}
                      />
                    );
                  })}

                  {/* Progress dot — positioned along the ring */}
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

      {/* Disclaimer */}
      <motion.div variants={item} className="text-center pt-4 pb-2">
        <p className="text-[10px] text-luna-text-hint font-body italic">
          "Comprends ton corps. Adapte ta vie."
        </p>
      </motion.div>
    </motion.div>
  );
}
