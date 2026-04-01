import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { CHAT_SUGGESTIONS } from '../data/chatResponses';
import { CONSEILS } from '../data/conseils';
import { SportIcon, FoodIcon, SleepIcon, JournalIcon, BrandSymbol, Divider } from '../components/illustrations/LunaIllustrations';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PHASE_GRADIENTS = {
  menstrual: 'linear-gradient(160deg, #F5D0D5 0%, #E8A5AE 40%, #D4727F 100%)',
  follicular: 'linear-gradient(160deg, #D4EAD5 0%, #A8CCA9 40%, #7BAE7F 100%)',
  ovulatory: 'linear-gradient(160deg, #F5DCC8 0%, #F0C4A4 40%, #E8A87C 100%)',
  luteal: 'linear-gradient(160deg, #E0D5EB 0%, #CEBED9 40%, #B09ACB 100%)',
};

const hormoneLabels = {
  estrogen: { label: 'Oestrogene', levels: { high: '↑↑', rising: '↗', medium: '→', low: '↓' } },
  progesterone: { label: 'Progesterone', levels: { high: '↑↑', low: '↓' } },
  lh: { label: 'LH', levels: { peak: '⚡', low: '→' } },
  fsh: { label: 'FSH', levels: { rising: '↗', low: '→' } },
};

export default function Dashboard() {
  const { greeting, cycleInfo, todayCheckIn } = useCycle();

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength, energyLevel, hormones, daysUntilPeriod } = cycleInfo;
  const conseils = CONSEILS[phase];

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dailySelections = [
    {
      tag: 'Alimentation',
      tagColor: '#D4846A',
      illustration: FoodIcon,
      title: phase === 'menstrual' ? 'Nourris ton corps avec douceur'
        : phase === 'follicular' ? 'L\'energie monte, alimente-la'
        : phase === 'ovulatory' ? 'Mange colore, rayonne'
        : 'Laisse ton corps choisir ce qui lui va',
      subtitle: phase === 'menstrual' ? 'Aliments riches en fer et anti-inflammatoires'
        : phase === 'follicular' ? 'Proteines et energie pour surfer sur la vague'
        : phase === 'ovulatory' ? 'Antioxydants et fibres pour accompagner ton pic'
        : 'Aliments pour equilibrer ton humeur',
      bg: '#FFF3EB',
      to: '/conseils',
    },
    {
      tag: 'Fitness',
      tagColor: '#C4727F',
      illustration: SportIcon,
      title: phase === 'menstrual' ? 'Ecoute, ralentis, respire'
        : phase === 'follicular' ? 'L\'energie monte, surfe dessus'
        : phase === 'ovulatory' ? 'Tu es au sommet, donne tout'
        : 'Bouge en douceur',
      subtitle: phase === 'menstrual' ? 'Mouvements doux qui soulagent et apaisent'
        : phase === 'follicular' ? 'C\'est le moment de te challenger'
        : phase === 'ovulatory' ? 'Force, endurance et performance au max'
        : 'Mouvements pour relacher la tension',
      bg: '#FDE8EB',
      to: '/conseils',
    },
    {
      tag: 'Bien-etre',
      tagColor: '#B09ACB',
      illustration: JournalIcon,
      title: phase === 'menstrual' ? 'Cocooning mode on'
        : phase === 'follicular' ? 'Lance ce qui te fait vibrer'
        : phase === 'ovulatory' ? 'Rayonne et connecte-toi'
        : 'Prends soin de toi',
      subtitle: phase === 'menstrual' ? 'Activites douces pour honorer ton corps'
        : phase === 'follicular' ? 'Nouveaux projets, nouvelles connexions'
        : phase === 'ovulatory' ? 'Activites qui t\'ancrent et te revelent'
        : 'Self-care et reconfort au programme',
      bg: '#F3EEF8',
      to: '/conseils',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Hero Greeting with Gradient */}
      <motion.div variants={item}>
        <div
          className="rounded-luna-lg p-6 pb-8 relative overflow-hidden"
          style={{
            background: PHASE_GRADIENTS[phase],
            borderRadius: '28px',
          }}
        >
          <div className="relative z-10">
            <p className="text-sm font-body text-white/80 capitalize mb-1">{today}</p>
            <h1 className="font-display text-2xl md:text-3xl text-white leading-tight mb-4">
              {greeting}
            </h1>
            <p className="text-sm text-white/85 font-body leading-relaxed max-w-[90%]">
              Tu es en <span className="font-semibold">{phaseData.name}</span>. {phaseData.summary.split('.')[0]}.
            </p>
          </div>

          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-12 w-24 h-24 rounded-full bg-white/8" />
        </div>
      </motion.div>

      {/* Cycle Circle */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-6 text-center" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
          <p className="text-xs font-body font-semibold text-luna-text-hint uppercase tracking-wider mb-4">Current State</p>

          <div className="relative w-44 h-44 mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#F0EBE8" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={phaseData.color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(currentDay / cycleLength) * 327} 327`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl mb-1">{phaseData.icon}</span>
              <p className="text-3xl font-display font-bold" style={{ color: phaseData.colorDark }}>
                {String(currentDay).padStart(2, '0')}
              </p>
              <p className="text-[10px] font-body text-luna-text-hint mt-0.5">
                Jour {currentDay} sur {cycleLength}
              </p>
            </div>
          </div>

          {/* Hormone badges */}
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(hormones).map(([key, level]) => (
              <span
                key={key}
                className="text-xs font-body px-3 py-1.5 rounded-pill"
                style={{
                  backgroundColor: `${phaseData.color}15`,
                  color: phaseData.colorDark,
                }}
              >
                {hormoneLabels[key].label} {hormoneLabels[key].levels[level]}
              </span>
            ))}
          </div>

          <p className="text-xs text-luna-text-hint font-body mt-4">
            Prochaines regles dans <span className="font-semibold text-luna-text-muted">{daysUntilPeriod} jours</span>
          </p>
        </div>
      </motion.div>

      {/* Energy Gauge */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base text-luna-text">Energy Gauge</h3>
            <span className="text-2xl font-display font-bold" style={{ color: phaseData.colorDark }}>
              {energyLevel}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: phaseData.color }}
              initial={{ width: 0 }}
              animate={{ width: `${energyLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-luna-text-muted font-body mt-2.5 leading-relaxed">
            {phaseData.bodyToday.split('.')[0]}.
          </p>
        </div>
      </motion.div>

      {/* Mon corps aujourd'hui + Check-in */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] p-5 relative overflow-hidden"
          style={{ backgroundColor: phaseData.bgColor }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{phaseData.icon}</span>
            <div className="flex-1">
              <h3 className="font-display text-base text-luna-text mb-1.5">Mon corps aujourd'hui</h3>
              <p className="text-sm text-luna-text-body font-body leading-relaxed">
                {phaseData.bodyToday}
              </p>
              {!todayCheckIn && (
                <Link
                  to="/checkin"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-body font-semibold transition-colors"
                  style={{ color: phaseData.colorDark }}
                >
                  Enregistre tes symptomes <ArrowRight size={14} />
                </Link>
              )}
              {todayCheckIn && (
                <p className="mt-3 text-xs font-body text-luna-text-hint">
                  ✓ Check-in enregistre — energie {todayCheckIn.energy}/100
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demande a LUNA */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-white/90" />
            <h3 className="font-display text-lg text-white">Demande a LUNA</h3>
          </div>
          <div className="space-y-2 mb-3">
            {CHAT_SUGGESTIONS.slice(0, 3).map((suggestion, i) => (
              <Link
                key={i}
                to={`/chat?q=${encodeURIComponent(suggestion)}`}
                className="block bg-white/15 backdrop-blur-sm rounded-[14px] px-4 py-2.5 text-sm font-body text-white hover:bg-white/25 transition-all"
              >
                {suggestion}
              </Link>
            ))}
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 text-sm font-body font-semibold text-white/90 hover:text-white transition-opacity mt-1"
          >
            <MessageCircle size={14} />
            Pose-moi toutes tes questions
          </Link>
        </div>
      </motion.div>

      {/* Daily Rituals */}
      <motion.div variants={item}>
        <h3 className="font-display text-xl text-luna-text mb-1">Daily Rituals</h3>
        <p className="text-xs font-body text-luna-text-hint mb-4 uppercase tracking-wider">Recommande pour ta phase</p>

        <div className="space-y-3">
          {dailySelections.map((sel, i) => (
            <Link
              key={i}
              to={sel.to}
              className="flex items-center gap-4 bg-white rounded-[20px] p-4 transition-all hover:shadow-md group"
              style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center"
                style={{ backgroundColor: sel.bg }}
              >
                {sel.illustration && <sel.illustration size={28} />}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className="text-[10px] font-body font-bold uppercase tracking-wider"
                  style={{ color: sel.tagColor }}
                >
                  {sel.tag}
                </span>
                <h4 className="text-sm font-display text-luna-text leading-tight mt-0.5">
                  {sel.title}
                </h4>
                <p className="text-xs text-luna-text-muted font-body mt-0.5 truncate">{sel.subtitle}</p>
              </div>
              <ArrowRight size={16} className="flex-shrink-0 text-luna-text-hint group-hover:text-luna-text-muted transition-colors" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Signature */}
      <motion.div variants={item} className="text-center py-6">
        <Divider className="mx-auto mb-4" />
        <BrandSymbol size={36} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm text-luna-text-hint font-display italic leading-relaxed px-4">
          "Ton cycle n'est pas un obstacle. C'est ta boussole interieure."
        </p>
      </motion.div>
    </motion.div>
  );
}
