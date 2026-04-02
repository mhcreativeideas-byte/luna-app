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

      {/* Cycle Circle — LUNA Moon Design */}
      <motion.div variants={item} className="flex flex-col items-center py-4">
        <div className="relative w-52 h-52">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={phaseData.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={phaseData.colorDark || phaseData.color} stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={phaseData.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={phaseData.colorDark || phaseData.color} stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Subtle fill circle */}
            <circle cx="100" cy="100" r="88" fill="url(#moonGradient)" />

            {/* Background track */}
            <circle cx="100" cy="100" r="88" fill="none" stroke="#F0EBE8" strokeWidth="2.5" />

            {/* Progress arc */}
            <circle
              cx="100" cy="100" r="88"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(currentDay / cycleLength) * 553} 553`}
              transform="rotate(-90 100 100)"
            />

            {/* Crescent moon shape */}
            <g transform="translate(100, 100)" opacity="0.12">
              {/* Outer circle of crescent */}
              <circle cx="0" cy="0" r="50" fill="none" stroke={phaseData.colorDark || '#7B6B7B'} strokeWidth="2" />
              {/* Inner circle to create crescent effect */}
              <circle cx="12" cy="-8" r="42" fill="url(#moonGradient)" stroke="none" />
              {/* Wave at bottom */}
              <path
                d={`M -35 20 Q -18 8 0 20 Q 18 32 35 20`}
                fill="none"
                stroke={phaseData.colorDark || '#7B6B7B'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>

            {/* Progress dot */}
            <circle
              cx="100" cy="12" r="5"
              fill={phaseData.colorDark || phaseData.color}
              transform={`rotate(${(currentDay / cycleLength) * 360} 100 100)`}
            >
              <animate attributeName="r" values="5;6.5;5" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] font-body uppercase tracking-widest mb-1" style={{ color: phaseData.colorDark || phaseData.color, opacity: 0.6 }}>
              Jour du cycle
            </p>
            <p className="text-5xl font-display font-bold leading-none" style={{ color: phaseData.colorDark || '#2D2226' }}>
              {String(currentDay).padStart(2, '0')}
            </p>
            <p className="text-xs font-body text-luna-text-hint mt-1">
              sur {cycleLength} jours
            </p>
          </div>
        </div>

        {/* Next period indicator */}
        <motion.div
          className="mt-3 px-5 py-2 rounded-full flex items-center gap-2"
          style={{ backgroundColor: `${phaseData.color}15` }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm" role="img" aria-label="goutte">🩸</span>
          <p className="text-sm font-body" style={{ color: phaseData.colorDark || '#2D2226' }}>
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
