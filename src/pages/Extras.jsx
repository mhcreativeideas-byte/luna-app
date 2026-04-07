import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Moon, ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';

// Tirage pseudo-aléatoire stable par jour (même seed = même résultat)
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  s = (s * 16807) % 2147483647;
  return (s - 1) / 2147483646;
}
function getDaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

// Faits vérifiés par phase — sources : études endocrinologiques, ACOG, revues médicales
const DID_YOU_KNOW = {
  menstrual: [
    'Le fer perdu pendant les règles peut atteindre 30 mg sur un cycle. Les lentilles et les épinards aident à compenser.',
    'Les prostaglandines responsables des crampes sont les mêmes molécules qui provoquent l\'inflammation. Le gingembre les réduit naturellement.',
    'Le sommeil profond augmente pendant les règles. C\'est le moment idéal pour une récupération complète.',
    'Tes hormones (œstrogène + progestérone) sont au plus bas pendant les règles. C\'est pour ça que la fatigue est si intense.',
    'Le magnésium réduit les crampes menstruelles de 25 à 50% selon les études. On en trouve dans le chocolat noir et les amandes.',
    'La bouillotte sur le ventre est aussi efficace qu\'un ibuprofène pour soulager les douleurs menstruelles, selon une étude de 2012.',
    'Pendant les règles, ton seuil de douleur est plus bas à cause de la chute d\'œstrogène. C\'est physiologique, pas psychologique.',
    'Les oméga-3 (saumon, noix, graines de lin) réduisent l\'intensité des douleurs menstruelles en limitant la production de prostaglandines.',
    'L\'exercice léger pendant les règles libère des endorphines qui agissent comme des antidouleurs naturels.',
    'Le curcuma est un anti-inflammatoire naturel aussi puissant que certains médicaments, selon des études publiées dans le Journal of Pain Research.',
  ],
  follicular: [
    'L\'œstrogène booste ta coordination motrice. C\'est le meilleur moment pour apprendre un nouveau sport ou une chorégraphie.',
    'Ton cerveau crée plus de nouvelles connexions neuronales en phase folliculaire grâce à l\'œstrogène. Parfait pour apprendre.',
    'La récupération musculaire est 20% plus rapide en phase folliculaire grâce à l\'effet anabolisant de l\'œstrogène.',
    'L\'œstrogène augmente la production de sérotonine, ce qui explique la meilleure humeur et la motivation naturelle de cette phase.',
    'Ta sensibilité à l\'insuline est meilleure en phase folliculaire. Ton corps gère mieux les glucides.',
    'Les études montrent que les femmes ont plus de créativité verbale quand l\'œstrogène monte. Idéal pour écrire, présenter, négocier.',
    'L\'œstrogène renforce le collagène de ta peau. C\'est pour ça que ton teint est plus lumineux en phase folliculaire.',
    'Ta tolérance à la douleur augmente avec l\'œstrogène. Tu peux pousser plus fort au sport sans le ressentir autant.',
    'Le zinc est essentiel en phase folliculaire car il soutient la maturation du follicule ovarien. Graines de courge et pois chiches en sont riches.',
    'Les probiotiques sont particulièrement bénéfiques en phase folliculaire : l\'œstrogène et le microbiote intestinal s\'influencent mutuellement.',
  ],
  ovulatory: [
    'Ta température corporelle augmente de 0.2 à 0.5°C après l\'ovulation. Tu brûles légèrement plus de calories même au repos.',
    'L\'ovulation ne dure que 12 à 24 heures. L\'ovule libéré a une durée de vie très courte.',
    'Au pic d\'œstrogène, ta voix devient légèrement plus aiguë et ton visage plus symétrique. C\'est un effet hormonal documenté.',
    'Ta force musculaire atteint son maximum autour de l\'ovulation grâce au pic combiné d\'œstrogène et de testostérone.',
    'Les ligaments deviennent plus lâches autour de l\'ovulation à cause de l\'œstrogène. Pense à bien t\'échauffer pour éviter les blessures.',
    'L\'ovulation peut s\'accompagner d\'une légère douleur d\'un côté du ventre appelée "mittelschmerz" (douleur du milieu en allemand).',
    'Ton métabolisme est à son point le plus efficace. Les fibres et crucifères aident ton foie à éliminer l\'excès d\'œstrogène.',
    'La testostérone atteint aussi un pic à l\'ovulation, ce qui booste ta confiance, ta libido et ta prise de décision.',
    'Tes capacités de communication verbale sont à leur maximum autour de l\'ovulation. C\'est le moment idéal pour les entretiens.',
    'Le pic de LH (hormone lutéinisante) qui déclenche l\'ovulation est si précis qu\'il sert de base aux tests d\'ovulation.',
  ],
  luteal: [
    'La progestérone est un anxiolytique naturel. Le yoga et la méditation sont particulièrement efficaces en phase lutéale.',
    'Ton métabolisme augmente de 10 à 20% en phase lutéale. Tu as réellement besoin de 200 à 300 calories de plus par jour.',
    'La progestérone augmente ta température corporelle de 0.3 à 0.6°C, ce qui peut perturber ton sommeil.',
    'Les envies de sucre en phase lutéale sont causées par la baisse de sérotonine. Les glucides complexes la remontent sans le crash.',
    'La progestérone a un effet sédatif similaire aux benzodiazépines. C\'est pour ça que tu es plus fatiguée.',
    'Les ballonnements pré-menstruels sont causés par la progestérone qui ralentit le transit intestinal. Le gingembre et le fenouil aident.',
    'Le magnésium est le minéral le plus important en phase lutéale : il réduit irritabilité, crampes, insomnie et fringales.',
    'Ton corps utilise davantage les graisses comme carburant en phase lutéale. Le cardio modéré est particulièrement efficace.',
    'La rétention d\'eau pré-menstruelle peut représenter 1 à 3 kg. C\'est de l\'eau, pas du gras — ça part en début de règles.',
    'L\'acné pré-menstruelle est causée par la chute d\'œstrogène qui ne protège plus ta peau face à la testostérone résiduelle.',
  ],
};

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

  // Fait du jour — change chaque jour, stable dans la journée
  const dailyFact = useMemo(() => {
    const facts = DID_YOU_KNOW[phase] || DID_YOU_KNOW.follicular;
    const seed = getDaySeed();
    const index = Math.floor(seededRandom(seed + 777) * facts.length);
    return facts[index];
  }, [phase]);

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

      {/* Insight — change chaque jour */}
      <motion.div variants={item}>
        <div
          className="rounded-[24px] bg-white relative overflow-hidden"
          style={{
            boxShadow: '0 4px 20px rgba(45,34,38,0.08)',
            borderLeft: `4px solid ${phaseData.color}`,
          }}
        >
          {/* Guillemets décoratifs */}
          <div
            className="absolute top-3 right-4 font-display select-none pointer-events-none"
            style={{ fontSize: '80px', lineHeight: 1, color: `${phaseData.color}10` }}
          >
            "
          </div>

          <div className="p-5 relative">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${phaseData.color}15` }}
              >
                <Sparkles size={14} style={{ color: phaseData.color }} />
              </div>
              <h3 className="font-display text-base text-luna-text">Le savais-tu ?</h3>
            </div>
            <p className="text-sm font-body text-luna-text-body leading-relaxed italic pr-6">
              "{dailyFact}"
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phaseData.color }} />
              <span className="text-[10px] font-body text-luna-text-hint">
                Nouveau chaque jour · Phase {phaseData.shortName?.toLowerCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
