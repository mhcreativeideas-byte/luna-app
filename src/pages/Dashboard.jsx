import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Dumbbell, UtensilsCrossed, Moon, BookOpen, Sparkles, MessageCircle } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { QUICK_SUGGESTIONS as CHAT_SUGGESTIONS } from '../data/chatResponses';

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
    { tag: 'SPORT', icon: Dumbbell, title: 'Yoga doux', subtitle: 'Mouvements fluides pour soulager les tensions lombaires.', link: '/sport', color: '#D4727F', bg: '#FDE8EB' },
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Fer & Oméga-3', subtitle: 'Booste ta vitalité avec des épinards frais et du saumon.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 9h', subtitle: 'Ton corps travaille dur, donne-lui le repos nécessaire.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Journaling : Introspection', subtitle: 'Écris trois choses que ton corps t\'a apprises.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  follicular: [
    { tag: 'SPORT', icon: Dumbbell, title: 'HIIT & Cardio', subtitle: 'Ton corps récupère vite — c\'est le moment de pousser.', link: '/sport', color: '#7BAE7F', bg: '#EDF5ED' },
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Protéines & Zinc', subtitle: 'Ton corps construit — donne-lui le carburant.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 8h', subtitle: 'Recale ton rythme circadien — lève-toi tôt.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Nouveaux projets', subtitle: 'Lance ce que tu repousses depuis trop longtemps.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  ovulatory: [
    { tag: 'SPORT', icon: Dumbbell, title: 'Haute intensité', subtitle: 'Force et endurance au max — pousse tes limites.', link: '/sport', color: '#E8A87C', bg: '#FFF3EB' },
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Fibres & Antioxydants', subtitle: 'Accompagne le pic hormonal avec les bons nutriments.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
    { tag: 'SLEEP', icon: Moon, title: 'Objectif 8h', subtitle: 'Beaucoup d\'énergie mais protège ton sommeil.', link: '/sommeil', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'MINDSET', icon: BookOpen, title: 'Communication & Leadership', subtitle: 'Tes capacités verbales sont à leur pic.', link: '/journal', color: '#8A7B7F', bg: '#F0EBE8' },
  ],
  luteal: [
    { tag: 'SPORT', icon: Dumbbell, title: 'Modéré → Doux', subtitle: 'Pilates, natation, marche — baisse progressivement.', link: '/sport', color: '#B09ACB', bg: '#F3EEF8' },
    { tag: 'FOOD', icon: UtensilsCrossed, title: 'Magnésium & Glucides', subtitle: '+200-300 cal/jour — ton métabolisme a augmenté.', link: '/alimentation', color: '#D4846A', bg: '#FFF3EB' },
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
  const { greeting, cycleInfo, todayCheckIn, name } = useCycle();

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength, energyLevel, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const displayName = name || '';
  const timeGreeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const cards = SANCTUARY_CARDS[phase] || SANCTUARY_CARDS.follicular;
  const titles = PHASE_TITLES[phase] || PHASE_TITLES.follicular;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
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

      {/* Cycle Circle — LUNA Moon IS the circle */}
      <motion.div variants={item} className="flex flex-col items-center py-6">
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="progressArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={phaseData.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={phaseData.colorDark || phaseData.color} />
              </linearGradient>
            </defs>

            {/* ===== LUNA LOGO = THE CYCLE CIRCLE ===== */}
            {/* Center (100, 100), radius 82 — the logo IS the main element */}

            {/* 1. Outer circle arc — background track (light) */}
            <path
              d="M 30 58 A 82 82 0 1 1 148 28"
              fill="none"
              stroke="#DDD5CE"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 2. Outer circle arc — progress overlay (phase color) */}
            <motion.circle
              cx="100" cy="100" r="82"
              fill="none"
              stroke="url(#progressArc)"
              strokeWidth="2.8"
              strokeLinecap="round"
              initial={{ strokeDasharray: '0 515.2' }}
              animate={{ strokeDasharray: `${(currentDay / cycleLength) * 515.2} 515.2` }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              transform="rotate(-90 100 100)"
            />

            {/* 3. Small dot at end of outer circle (~1:30) */}
            <circle cx="148" cy="28" r="3" fill={phaseData.colorDark || '#8B7B7F'} opacity="0.6" />

            {/* 4. Crescent inner edge → flows into wave 1
                 Starts at same tip as outer circle gap (top-left)
                 Slim crescent hugging the left side of the circle
                 Smooth transition into S-wave across the bottom */}
            <path
              d="M 30 58
                 C 42 72, 40 92, 36 110
                 C 30 134, 42 152, 68 150
                 C 94 148, 116 132, 134 136
                 C 152 140, 166 132, 176 120"
              fill="none"
              stroke={phaseData.colorDark || '#8B7B7F'}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* 5. Second wave — thinner, parallel, gives leaf/depth effect */}
            <path
              d="M 48 160
                 C 72 150, 100 168, 128 154
                 C 150 144, 164 148, 176 136"
              fill="none"
              stroke={phaseData.colorDark || '#8B7B7F'}
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.2"
            />

            {/* 6. Progress dot on the ring */}
            <circle
              cx="100" cy="18" r="4"
              fill={phaseData.colorDark || phaseData.color}
              transform={`rotate(${(currentDay / cycleLength) * 360} 100 100)`}
            >
              <animate attributeName="r" values="4;5;4" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle
              cx="100" cy="18" r="1.8"
              fill="#FFFFFF"
              opacity="0.85"
              transform={`rotate(${(currentDay / cycleLength) * 360} 100 100)`}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p
              className="text-[9px] font-body uppercase tracking-[0.2em] mb-1"
              style={{ color: phaseData.colorDark || phaseData.color, opacity: 0.5 }}
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
            <p className="text-[11px] font-body mt-1" style={{ color: '#B5A8A0' }}>
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

      {/* Today's Sanctuary */}
      <motion.div variants={item}>
        <h2 className="font-display text-xl text-luna-text mb-1">Aujourd'hui</h2>
        <p className="text-xs font-body text-luna-text-hint mb-4">{phaseData.name}</p>

        <div className="space-y-3">
          {cards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="block rounded-[20px] p-4 transition-all hover:shadow-md group"
              style={{ backgroundColor: card.bg }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${card.color}20` }}
                >
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-body font-bold text-luna-text-hint uppercase tracking-widest">{card.tag}</span>
                  <h3 className="font-display text-base text-luna-text mt-0.5">{card.title}</h3>
                  <p className="text-xs font-body text-luna-text-muted mt-0.5 leading-relaxed">{card.subtitle}</p>
                </div>
                <ArrowRight size={16} className="flex-shrink-0 text-luna-text-hint mt-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
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

      {/* Quick Check-in or Ask LUNA */}
      <motion.div variants={item}>
        {!todayCheckIn ? (
          <Link
            to="/checkin"
            className="block rounded-[20px] p-5 text-center transition-all hover:shadow-md"
            style={{
              background: 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)',
            }}
          >
            <p className="text-white font-display text-lg mb-1">Comment tu te sens ?</p>
            <p className="text-white/80 text-xs font-body">Enregistre ton check-in quotidien</p>
          </Link>
        ) : (
          <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(45,34,38,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} style={{ color: '#C4727F' }} />
              <h3 className="font-display text-base text-luna-text">Demande à LUNA</h3>
            </div>
            <div className="space-y-2">
              {CHAT_SUGGESTIONS.slice(0, 3).map((s, i) => (
                <Link
                  key={i}
                  to={`/chat?q=${encodeURIComponent(s)}`}
                  className="block text-sm font-body text-luna-text-body px-3 py-2 rounded-[12px] bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        )}
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
