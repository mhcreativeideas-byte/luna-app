import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { CHAT_SUGGESTIONS } from '../data/chatResponses';
import { SportIcon, FoodIcon, JournalIcon, BrandSymbol, Divider } from '../components/illustrations/LunaIllustrations';

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
  estrogen: { label: 'Œstrogène', levels: { high: 'au max', rising: 'en hausse', medium: 'stable', low: 'basse' } },
  progesterone: { label: 'Progestérone', levels: { high: 'élevée', low: 'basse' } },
  lh: { label: 'LH', levels: { peak: 'pic', low: 'stable' } },
  fsh: { label: 'FSH', levels: { rising: 'en hausse', low: 'stable' } },
};

const BODY_TODAY = {
  menstrual: 'Œstrogène et progestérone au plus bas. C\'est ce qui cause la fatigue, les crampes et la baisse d\'énergie. Ton corps élimine la muqueuse utérine — c\'est un processus qui demande de l\'énergie. Priorités : fer, anti-inflammatoires, repos. Ce n\'est pas un manque de volonté, c\'est de la physiologie.',
  follicular: 'L\'œstrogène remonte progressivement. Concrètement : plus d\'énergie, meilleure récupération musculaire, humeur en hausse, créativité boostée. C\'est ta fenêtre pour te challenger — ton corps récupère plus vite et apprend mieux pendant cette phase.',
  ovulatory: 'Pic d\'œstrogène + montée de testostérone. Résultat : confiance en hausse, capacités verbales au max, performances physiques à leur sommet. Tes ligaments sont plus lâches (attention aux blessures), mais ta force et ton endurance sont au top.',
  luteal: 'La progestérone domine. Ton métabolisme augmente de 10 à 20% — tu as besoin de plus de calories, et c\'est normal. Les envies de sucre sont biologiques : ta sérotonine baisse. Côté énergie, ça descend progressivement. C\'est le moment de finir tes projets, pas d\'en commencer de nouveaux.',
};

const DAILY_SELECTIONS = {
  menstrual: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Fer, magnésium, oméga-3', subtitle: 'Ce dont ton corps a besoin pour compenser les pertes', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Mouvement', tagColor: '#C4727F', illustration: SportIcon, title: 'Yoga, stretching, marche', subtitle: 'Mouvements doux adaptés à ton niveau d\'énergie', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Repos actif', subtitle: 'Tu récupères mieux quand tu t\'écoutes', bg: '#F3EEF8', to: '/conseils' },
  ],
  follicular: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Protéines et énergie', subtitle: 'Ton corps construit — donne-lui le carburant', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Mouvement', tagColor: '#C4727F', illustration: SportIcon, title: 'Cardio, muscu, défis', subtitle: 'Ton corps récupère vite — c\'est le moment de pousser', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Nouveaux projets', subtitle: 'Ta créativité et ta motivation sont en hausse', bg: '#F3EEF8', to: '/conseils' },
  ],
  ovulatory: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Fibres et antioxydants', subtitle: 'Pour accompagner le pic hormonal', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Mouvement', tagColor: '#C4727F', illustration: SportIcon, title: 'Haute intensité', subtitle: 'Force et endurance au max — pousse tes limites', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Communication et social', subtitle: 'Tes capacités verbales sont à leur pic', bg: '#F3EEF8', to: '/conseils' },
  ],
  luteal: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Glucides complexes, magnésium', subtitle: '+200-300 cal/jour — ton métabolisme a augmenté', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Mouvement', tagColor: '#C4727F', illustration: SportIcon, title: 'Intensité modérée → douce', subtitle: 'Pilates, natation, marche — baisse progressivement', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Organisation et tri', subtitle: 'C\'est le moment de finaliser, pas de lancer', bg: '#F3EEF8', to: '/conseils' },
  ],
};

export default function Dashboard() {
  const { greeting, cycleInfo, todayCheckIn, name } = useCycle();

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength, energyLevel, hormones, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const displayName = name || '';
  const timeGreeting = hour < 12
    ? `Bonjour ${displayName}`
    : hour < 18
      ? `Bon après-midi ${displayName}`
      : `Bonsoir ${displayName}`;

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dailySelections = DAILY_SELECTIONS[phase] || DAILY_SELECTIONS.follicular;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Hero Greeting */}
      <motion.div variants={item}>
        <div
          className="rounded-[28px] p-6 pb-8 relative overflow-hidden"
          style={{ background: PHASE_GRADIENTS[phase] }}
        >
          <div className="relative z-10">
            <p className="text-sm font-body text-white/80 capitalize mb-1">{today}</p>
            <h1 className="font-display text-2xl md:text-3xl text-white leading-snug mb-3">
              {timeGreeting}
            </h1>
            <p className="text-sm text-white/90 font-body leading-relaxed">
              <strong>{phaseData.name}</strong> · Jour {currentDay}/{cycleLength} · Énergie ~{energyLevel}%
            </p>
          </div>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </motion.div>

      {/* Cycle Circle */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-6 text-center" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
          <div className="relative w-40 h-40 mx-auto mb-4">
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
              <span className="text-3xl mb-1">{phaseData.icon}</span>
              <p className="text-2xl font-display font-bold" style={{ color: phaseData.colorDark }}>
                J{currentDay}
              </p>
              <p className="text-[10px] font-body text-luna-text-hint mt-0.5">
                sur {cycleLength}
              </p>
            </div>
          </div>

          {/* Hormones */}
          <p className="text-[10px] font-body font-semibold text-luna-text-hint uppercase tracking-wider mb-3">Tes hormones aujourd'hui</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {Object.entries(hormones).map(([key, level]) => (
              <span
                key={key}
                className="text-xs font-body px-3 py-1.5 rounded-pill"
                style={{ backgroundColor: `${phaseData.color}15`, color: phaseData.colorDark }}
              >
                {hormoneLabels[key].label} {hormoneLabels[key].levels[level]}
              </span>
            ))}
          </div>

          <p className="text-xs text-luna-text-hint font-body mt-4">
            Règles dans <strong className="text-luna-text-muted">{daysUntilPeriod} jours</strong>
          </p>
        </div>
      </motion.div>

      {/* Energy */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-5" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-base text-luna-text">Niveau d'énergie estimé</h3>
            <span className="text-xl font-display font-bold" style={{ color: phaseData.colorDark }}>
              {energyLevel}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: phaseData.color }}
              initial={{ width: 0 }}
              animate={{ width: `${energyLevel}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Ce qui se passe dans ton corps */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <h3 className="font-display text-base text-luna-text mb-2">Ce qui se passe dans ton corps</h3>
          <p className="text-sm text-luna-text-body font-body leading-relaxed">
            {BODY_TODAY[phase]}
          </p>
          {!todayCheckIn && (
            <Link
              to="/checkin"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-body font-semibold transition-colors"
              style={{ color: phaseData.colorDark }}
            >
              Enregistrer mes symptômes <ArrowRight size={14} />
            </Link>
          )}
          {todayCheckIn && (
            <p className="mt-3 text-xs font-body text-luna-text-hint">
              ✓ Check-in du jour enregistré · énergie {todayCheckIn.energy}/100
            </p>
          )}
        </div>
      </motion.div>

      {/* Demande à LUNA */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-white/90" />
            <h3 className="font-display text-lg text-white">Demande à LUNA</h3>
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
            Poser une question
          </Link>
        </div>
      </motion.div>

      {/* Recommandations du jour */}
      <motion.div variants={item}>
        <h3 className="font-display text-lg text-luna-text mb-1">Adapté à ta phase</h3>
        <p className="text-xs font-body text-luna-text-hint mb-4">Ce que LUNA te recommande aujourd'hui</p>

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
                <span className="text-[10px] font-body font-bold uppercase tracking-wider" style={{ color: sel.tagColor }}>
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
        <p className="text-xs text-luna-text-hint font-body px-4">
          Informations basées sur la recherche en endocrinologie et physiologie féminine. LUNA ne remplace pas un avis médical.
        </p>
      </motion.div>
    </motion.div>
  );
}
