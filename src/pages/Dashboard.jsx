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
  estrogen: { label: 'Œstrogène', levels: { high: 'au sommet', rising: 'en hausse', medium: 'stable', low: 'en baisse' } },
  progesterone: { label: 'Progestérone', levels: { high: 'au sommet', low: 'en baisse' } },
  lh: { label: 'LH', levels: { peak: 'au pic', low: 'stable' } },
  fsh: { label: 'FSH', levels: { rising: 'en hausse', low: 'stable' } },
};

const BODY_TODAY = {
  menstrual: 'Ton corps se renouvelle. L\'œstrogène et la progestérone sont au plus bas — c\'est pour ça que tu peux te sentir fatiguée, un peu à fleur de peau. Ce n\'est pas une faiblesse. C\'est ton corps qui se prépare à un nouveau départ. Offre-lui de la douceur, du fer, du repos. Tu n\'as rien à prouver cette semaine.',
  follicular: 'Quelque chose se réveille en toi. L\'œstrogène remonte et avec elle, ton énergie, ta créativité, ta motivation. Tu te sens plus légère ? C\'est normal. Ton corps entre dans sa phase la plus productive. C\'est maintenant qu\'il faut oser : un nouveau sport, un projet audacieux, une conversation importante.',
  ovulatory: 'Tu rayonnes — et ce n\'est pas qu\'une impression. Œstrogène au sommet, testostérone en soutien : ta confiance, ta communication et tes performances physiques sont à leur maximum. Les gens autour de toi le sentent aussi. Profite de cette énergie solaire.',
  luteal: 'Ton corps se prépare, et il te demande d\'être douce avec lui. La progestérone prend les commandes — tu peux ressentir des envies de sucre, de la fatigue, des émotions plus intenses. Tout ça est normal. Ton métabolisme augmente de 10%, ton corps brûle plus : nourris-le. C\'est le moment de finir plutôt que de commencer, de cocooner plutôt que de performer.',
};

const SIGNATURE_MESSAGES = [
  'Ton cycle n\'est pas un obstacle. C\'est ta boussole intérieure.',
  'Chaque jour de ton cycle mérite une attention différente.',
  'Comprendre ton corps, c\'est reprendre le pouvoir sur ta vie.',
  'Tu n\'as pas à fonctionner de la même façon 30 jours par mois. Et c\'est ta force.',
];

const DAILY_SELECTIONS = {
  menstrual: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Nourris ce qui te répare', subtitle: 'Des aliments riches en fer et en douceur pour traverser cette phase en force', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Fitness', tagColor: '#C4727F', illustration: SportIcon, title: 'Moins c\'est plus', subtitle: 'Des mouvements doux qui respectent ton énergie du moment', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Autorise-toi à ralentir', subtitle: 'Des idées cocooning pour te retrouver', bg: '#F3EEF8', to: '/conseils' },
  ],
  follicular: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Ton énergie se construit dans l\'assiette', subtitle: 'Des aliments qui soutiennent ta montée en puissance', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Fitness', tagColor: '#C4727F', illustration: SportIcon, title: 'L\'énergie monte, surfe dessus', subtitle: 'C\'est le moment de repousser tes limites', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Crée, lance, ose', subtitle: 'Ton cerveau est en mode conquête', bg: '#F3EEF8', to: '/conseils' },
  ],
  ovulatory: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Léger, frais, vibrant', subtitle: 'Comme toi cette semaine', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Fitness', tagColor: '#C4727F', illustration: SportIcon, title: 'Repousse tes limites', subtitle: 'Ton corps est prêt pour l\'excellence', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Brille en société', subtitle: 'Ta communication est au sommet', bg: '#F3EEF8', to: '/conseils' },
  ],
  luteal: [
    { tag: 'Alimentation', tagColor: '#D4846A', illustration: FoodIcon, title: 'Laisse ton corps choisir', subtitle: 'Réconfort et nutriments pour traverser cette phase sereinement', bg: '#FFF3EB', to: '/conseils' },
    { tag: 'Fitness', tagColor: '#C4727F', illustration: SportIcon, title: 'Bouge en douceur', subtitle: 'Des mouvements qui apaisent plutôt qu\'épuisent', bg: '#FDE8EB', to: '/conseils' },
    { tag: 'Bien-être', tagColor: '#B09ACB', illustration: JournalIcon, title: 'Prends soin de toi', subtitle: 'Des rituels pour te recentrer, c\'est non négociable', bg: '#F3EEF8', to: '/conseils' },
  ],
};

export default function Dashboard() {
  const { greeting, cycleInfo, todayCheckIn } = useCycle();

  if (!cycleInfo) return null;

  const { phase, phaseData, currentDay, cycleLength, energyLevel, hormones, daysUntilPeriod } = cycleInfo;

  const hour = new Date().getHours();
  const timeGreeting = hour < 12
    ? `Bonjour ${greeting?.split(' ').pop() || ''}. Voici ce que ton corps attend de toi aujourd'hui.`
    : hour < 18
      ? `Cet après-midi, écoute ce que ton corps te dit.`
      : `Bonne soirée ${greeting?.split(' ').pop() || ''}. Prends soin de toi ce soir.`;

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const dailySelections = DAILY_SELECTIONS[phase] || DAILY_SELECTIONS.follicular;
  const signatureMessage = SIGNATURE_MESSAGES[currentDay % SIGNATURE_MESSAGES.length];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-4">
      {/* Hero Greeting with Gradient */}
      <motion.div variants={item}>
        <div
          className="rounded-[28px] p-6 pb-8 relative overflow-hidden"
          style={{ background: PHASE_GRADIENTS[phase] }}
        >
          <div className="relative z-10">
            <p className="text-sm font-body text-white/80 capitalize mb-1">{today}</p>
            <h1 className="font-display text-xl md:text-2xl text-white leading-snug mb-1">
              {timeGreeting}
            </h1>
          </div>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-4 -right-12 w-24 h-24 rounded-full bg-white/8" />
        </div>
      </motion.div>

      {/* Cycle Circle */}
      <motion.div variants={item}>
        <div className="bg-white rounded-[24px] p-6 text-center" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.06)' }}>
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
          <p className="text-xs font-body font-semibold text-luna-text-hint uppercase tracking-wider mb-3">Tes hormones en ce moment</p>
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
            Prochaines règles dans <span className="font-semibold text-luna-text-muted">{daysUntilPeriod} jours</span>
          </p>
        </div>
      </motion.div>

      {/* Mon corps aujourd'hui */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5 relative overflow-hidden" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{phaseData.icon}</span>
            <div className="flex-1">
              <h3 className="font-display text-base text-luna-text mb-2">Mon corps aujourd'hui</h3>
              <p className="text-sm text-luna-text-body font-body leading-relaxed">
                {BODY_TODAY[phase]}
              </p>
              {!todayCheckIn && (
                <Link
                  to="/checkin"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-body font-semibold transition-colors"
                  style={{ color: phaseData.colorDark }}
                >
                  Comment je me sens aujourd'hui <ArrowRight size={14} />
                </Link>
              )}
              {todayCheckIn && (
                <p className="mt-3 text-xs font-body text-luna-text-hint">
                  ✓ Check-in enregistré — énergie {todayCheckIn.energy}/100
                </p>
              )}
            </div>
          </div>
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
            Pose-moi toutes tes questions
          </Link>
        </div>
      </motion.div>

      {/* Daily Rituals */}
      <motion.div variants={item}>
        <h3 className="font-display text-xl text-luna-text mb-1">Tes rituels du jour</h3>
        <p className="text-xs font-body text-luna-text-hint mb-4 uppercase tracking-wider">Recommandés pour ta phase</p>

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
        <p className="text-sm text-luna-text-hint font-display italic leading-relaxed px-4">
          "{signatureMessage}"
        </p>
      </motion.div>
    </motion.div>
  );
}
