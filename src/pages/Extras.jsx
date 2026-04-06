import { motion } from 'framer-motion';
import { Dumbbell, Moon, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const SPORT_SUMMARY = {
  menstrual: {
    title: 'Douceur & Récupération',
    desc: 'Privilégie le yoga doux, la marche légère et les étirements. Ton corps a besoin de repos.',
    activities: ['Yoga doux', 'Marche', 'Stretching'],
  },
  follicular: {
    title: 'Énergie & Performance',
    desc: 'Ton énergie remonte, c\'est le moment de pousser. HIIT, cardio, musculation.',
    activities: ['HIIT', 'Cardio', 'Musculation'],
  },
  ovulatory: {
    title: 'Puissance & Dépassement',
    desc: 'Tu es à ton pic physique. Force, endurance et haute intensité.',
    activities: ['Haute intensité', 'CrossFit', 'Course'],
  },
  luteal: {
    title: 'Transition & Adaptation',
    desc: 'Baisse progressivement l\'intensité. Pilates, natation, marche active.',
    activities: ['Pilates', 'Natation', 'Marche active'],
  },
};

const SLEEP_SUMMARY = {
  menstrual: {
    title: 'Le sanctuaire du sommeil',
    desc: 'Objectif 9h. Ton corps travaille dur pour se renouveler, donne-lui le repos nécessaire.',
    tips: ['Tisane camomille', 'Bouillotte', 'Position fœtale'],
  },
  follicular: {
    title: 'Repos & Régénération',
    desc: 'Objectif 8h. Recale ton rythme circadien et profite de l\'énergie matinale.',
    tips: ['Lever tôt', 'Lumière naturelle', 'Routine stable'],
  },
  ovulatory: {
    title: 'Récupération Stratégique',
    desc: 'Objectif 8h. Beaucoup d\'énergie mais protège ton sommeil pour performer.',
    tips: ['Pas d\'écran le soir', 'Méditation', 'Chambre fraîche'],
  },
  luteal: {
    title: 'Douceur & Cocooning',
    desc: 'Objectif 9h. La progestérone te rend somnolente, écoute ton corps.',
    tips: ['Magnésium', 'Respiration guidée', 'Bain tiède'],
  },
};

export default function Extras() {
  const { cycleInfo } = useCycle();
  if (!cycleInfo) return null;

  const { phase, phaseData } = cycleInfo;
  const sport = SPORT_SUMMARY[phase] || SPORT_SUMMARY.follicular;
  const sleep = SLEEP_SUMMARY[phase] || SLEEP_SUMMARY.follicular;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      <BackButton />
      {/* Header */}
      <motion.div variants={item}>
        <p className="text-[11px] font-body text-luna-text-hint uppercase tracking-widest mb-2">
          {phaseData.shortName} · Bien-être
        </p>
        <h1 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight">
          Aller <em className="not-italic" style={{ fontStyle: 'italic', color: phaseData.colorDark }}>plus loin</em>
        </h1>
        <p className="text-sm font-body text-luna-text-muted mt-2 leading-relaxed">
          Complète ta routine alimentaire avec des conseils sport et sommeil adaptés à ta phase.
        </p>
      </motion.div>

      {/* Sport Card */}
      <motion.div variants={item}>
        <Link
          to="/sport"
          className="block rounded-[24px] p-5 transition-all hover:shadow-md group"
          style={{ backgroundColor: '#EDF5ED' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: '#7BAE7F20' }}>
              <Dumbbell size={22} style={{ color: '#7BAE7F' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-luna-text">{sport.title}</h2>
                <ChevronRight size={18} className="text-luna-text-hint group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{sport.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {sport.activities.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs font-body font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#7BAE7F18', color: '#4D7A50' }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Sommeil Card */}
      <motion.div variants={item}>
        <Link
          to="/sommeil"
          className="block rounded-[24px] p-5 transition-all hover:shadow-md group"
          style={{ backgroundColor: '#F3EEF8' }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ backgroundColor: '#B09ACB20' }}>
              <Moon size={22} style={{ color: '#B09ACB' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg text-luna-text">{sleep.title}</h2>
                <ChevronRight size={18} className="text-luna-text-hint group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm font-body text-luna-text-muted mt-1 leading-relaxed">{sleep.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {sleep.tips.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-body font-medium px-3 py-1 rounded-full"
                    style={{ backgroundColor: '#B09ACB18', color: '#7D6A96' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Insight */}
      <motion.div variants={item}>
        <div className="rounded-[24px] p-5" style={{ backgroundColor: phaseData.bgColor }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${phaseData.color}20` }}>
              <Sparkles size={14} style={{ color: phaseData.color }} />
            </div>
            <h3 className="font-display text-base text-luna-text">Le savais-tu ?</h3>
          </div>
          <p className="text-sm font-body text-luna-text-body leading-relaxed italic">
            {phase === 'menstrual' && '"Le sommeil profond augmente de 10% pendant les règles. C\'est le moment idéal pour une récupération complète."'}
            {phase === 'follicular' && '"L\'œstrogène booste ta coordination motrice. C\'est le meilleur moment pour apprendre un nouveau sport."'}
            {phase === 'ovulatory' && '"Ta température corporelle est plus élevée : tu brûles plus de calories même au repos."'}
            {phase === 'luteal' && '"La progestérone est un anxiolytique naturel. Le yoga et la méditation sont 2x plus efficaces en phase lutéale."'}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
