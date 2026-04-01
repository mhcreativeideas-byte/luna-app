import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { CHAT_SUGGESTIONS } from '../data/chatResponses';
import { CONSEILS } from '../data/conseils';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const hormoneLabels = {
  estrogen: { label: 'Œstrogène', levels: { high: '↑↑', rising: '↗', medium: '→', low: '↓' } },
  progesterone: { label: 'Progestérone', levels: { high: '↑↑', low: '↓' } },
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

  // Daily selections based on phase
  const dailySelections = [
    {
      tag: 'Alimentation',
      tagColor: '#E8733E',
      title: phase === 'menstrual' ? 'NOURRIS TON CORPS AVEC DOUCEUR'
        : phase === 'follicular' ? 'L\'ÉNERGIE MONTE, ALIMENTE-LA'
        : phase === 'ovulatory' ? 'MANGE COLORÉ, RAYONNE'
        : 'LAISSE TON CORPS CHOISIR CE QUI LUI VA',
      subtitle: phase === 'menstrual' ? 'Découvre des aliments riches en fer et anti-inflammatoires'
        : phase === 'follicular' ? 'Protéines et énergie pour surfer sur la vague'
        : phase === 'ovulatory' ? 'Antioxydants et fibres pour accompagner ton pic'
        : 'Découvre des aliments pour équilibrer ton humeur',
      emoji: '🥗',
      bg: '#F5F0E8',
      to: '/conseils',
    },
    {
      tag: 'Fitness',
      tagColor: '#D94F1E',
      title: phase === 'menstrual' ? 'ÉCOUTE, RALENTIS, RESPIRE'
        : phase === 'follicular' ? 'L\'ÉNERGIE MONTE, SURFE DESSUS'
        : phase === 'ovulatory' ? 'TU ES AU SOMMET, DONNE TOUT'
        : 'BOUGE EN DOUCEUR',
      subtitle: phase === 'menstrual' ? 'Des mouvements doux qui soulagent et apaisent'
        : phase === 'follicular' ? 'C\'est le moment de te challenger'
        : phase === 'ovulatory' ? 'Force, endurance et performance au max'
        : 'Découvre des mouvements pour relâcher la tension',
      emoji: '🏃‍♀️',
      bg: '#FFF0EB',
      to: '/conseils',
    },
    {
      tag: 'Activité',
      tagColor: '#F5A623',
      title: phase === 'menstrual' ? 'COCOONING MODE ON'
        : phase === 'follicular' ? 'LANCE CE QUI TE FAIT VIBRER'
        : phase === 'ovulatory' ? 'UNE PETITE IDÉE PEUT ILLUMINER TA JOURNÉE'
        : 'PRENDS SOIN DE TOI',
      subtitle: phase === 'menstrual' ? 'Des activités douces pour honorer ton corps'
        : phase === 'follicular' ? 'Nouveaux projets, nouvelles connexions'
        : phase === 'ovulatory' ? 'Découvre des activités qui t\'ancrent'
        : 'Self-care et réconfort au programme',
      emoji: '✨',
      bg: '#FFF8EC',
      to: '/conseils',
    },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="font-display text-2xl md:text-3xl text-luna-text">{greeting}</h1>
        <p className="text-sm text-luna-text-muted font-body capitalize">{today}</p>
      </motion.div>

      {/* Hormone visualization */}
      <motion.div variants={item}>
        <div className="rounded-luna p-5 text-center relative overflow-hidden" style={{ backgroundColor: phaseData.bgColor }}>
          {/* Cycle circle */}
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Background circle */}
              <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E0D8" strokeWidth="8" opacity="0.3" />
              {/* Progress arc */}
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke={phaseData.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(currentDay / cycleLength) * 327} 327`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl">{phaseData.icon}</span>
              <p className="text-xs font-accent font-bold mt-1" style={{ color: phaseData.colorDark }}>
                Jour {currentDay}/{cycleLength}
              </p>
            </div>
          </div>

          <h3 className="font-display text-lg" style={{ color: phaseData.colorDark }}>
            {phaseData.name}
          </h3>
          <p className="text-xs text-luna-text-muted font-body mt-1">
            Prochaines règles dans {daysUntilPeriod} jours
          </p>

          {/* Hormone badges */}
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {Object.entries(hormones).map(([key, level]) => (
              <span
                key={key}
                className="text-xs font-accent px-2.5 py-1 rounded-pill bg-white/60"
                style={{ color: phaseData.colorDark }}
              >
                {hormoneLabels[key].label} {hormoneLabels[key].levels[level]}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mon corps aujourd'hui */}
      <motion.div variants={item}>
        <div className="rounded-luna p-5 bg-luna-cream-light border-l-4" style={{ borderLeftColor: phaseData.color }}>
          <h3 className="font-display text-base text-luna-text mb-2">Mon corps aujourd'hui</h3>
          <p className="text-sm text-luna-text-body font-body leading-relaxed">
            {phaseData.bodyToday}
          </p>
          {!todayCheckIn && (
            <Link
              to="/checkin"
              className="inline-flex items-center gap-1 mt-3 text-sm font-body font-semibold text-luna-orange hover:text-luna-orange-deep transition-colors"
            >
              Enregistre tes symptômes <ArrowRight size={14} />
            </Link>
          )}
          {todayCheckIn && (
            <p className="mt-3 text-xs font-body text-luna-text-hint">
              ✓ Check-in enregistré — énergie {todayCheckIn.energy}/100
            </p>
          )}
        </div>
      </motion.div>

      {/* Demande à LUNA */}
      <motion.div variants={item}>
        <div className="rounded-luna p-5 bg-gradient-to-br from-luna-orange/90 to-luna-amber/80 text-white">
          <h3 className="font-display text-lg font-bold mb-3">DEMANDE À LUNA</h3>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {CHAT_SUGGESTIONS.map((suggestion, i) => (
              <Link
                key={i}
                to={`/chat?q=${encodeURIComponent(suggestion)}`}
                className="bg-white/20 backdrop-blur-sm rounded-luna-sm px-3 py-2 text-sm font-body hover:bg-white/30 transition-all text-left"
              >
                {suggestion}
              </Link>
            ))}
          </div>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 text-sm font-body font-semibold opacity-90 hover:opacity-100 transition-opacity"
          >
            <MessageCircle size={14} />
            Pose-moi toutes tes questions 💬
          </Link>
        </div>
      </motion.div>

      {/* Sélections du jour */}
      <motion.div variants={item}>
        <h3 className="section-title text-base mb-3">LES MEILLEURES SÉLECTIONS DU JOUR</h3>
        <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar -mx-4 px-4">
          {dailySelections.map((sel, i) => (
            <Link
              key={i}
              to={sel.to}
              className="flex-shrink-0 w-[85%] md:w-[45%] rounded-luna overflow-hidden relative group"
              style={{ backgroundColor: sel.bg }}
            >
              <div className="p-5 min-h-[180px] flex flex-col justify-between">
                <span
                  className="text-xs font-accent font-bold px-2.5 py-1 rounded-pill self-start text-white"
                  style={{ backgroundColor: sel.tagColor }}
                >
                  {sel.tag}
                </span>
                <div className="mt-auto">
                  <span className="text-4xl block mb-2">{sel.emoji}</span>
                  <h4 className="font-display text-base text-luna-text leading-tight mb-1">
                    {sel.title}
                  </h4>
                  <p className="text-xs text-luna-text-muted font-body">{sel.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Signature message */}
      <motion.div variants={item} className="text-center py-4">
        <p className="text-sm text-luna-text-hint font-display italic leading-relaxed px-4">
          "Laisse place à la curiosité, prends soin de toi. Rappelle-toi que ton cycle peut être un allié vers l'épanouissement."
        </p>
      </motion.div>
    </motion.div>
  );
}
