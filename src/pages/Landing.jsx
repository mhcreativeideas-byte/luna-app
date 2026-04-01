import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { PHASES } from '../data/phases';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const whyCards = [
  {
    title: 'Comprends ton corps',
    desc: 'Découvre comment tes hormones influencent ton énergie, ton humeur et tes performances chaque jour du mois.',
    icon: '🔬',
  },
  {
    title: 'Vis sans culpabilité',
    desc: 'Tes envies de sucre, ta fatigue, tes sautes d\'humeur ont une explication. Et ce n\'est pas un manque de volonté.',
    icon: '💜',
  },
  {
    title: 'Deviens ta propre experte',
    desc: 'Cycle après cycle, apprends à anticiper, planifier et tirer le meilleur de chaque phase.',
    icon: '✨',
  },
];

const comparisons = [
  {
    before: 'Je suis nulle, je n\'arrive pas à m\'entraîner cette semaine.',
    after: 'Je suis en phase lutéale, mon corps a besoin de douceur. Yoga aujourd\'hui, HIIT lundi !',
  },
  {
    before: 'Pourquoi j\'ai autant faim ? Je craque, zéro volonté.',
    after: 'Mon métabolisme augmente de 10% en phase lutéale. Manger plus est normal et nécessaire.',
  },
  {
    before: 'Ma présentation était catastrophique, je n\'étais pas à l\'aise.',
    after: 'Je planifie mes présentations en phase ovulatoire, quand ma communication est au top.',
  },
];

const phases = [
  { key: 'menstrual', ...PHASES.menstrual },
  { key: 'follicular', ...PHASES.follicular },
  { key: 'ovulatory', ...PHASES.ovulatory },
  { key: 'luteal', ...PHASES.luteal },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-luna-bg">
      {/* Hero */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="px-4 pt-16 pb-12 md:pt-24 md:pb-20 text-center max-w-3xl mx-auto"
      >
        <motion.div variants={item} className="mb-6">
          <img
            src="/logo-luna.png"
            alt="LUNA"
            className="w-48 md:w-56 mx-auto mb-4"
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-4xl md:text-5xl text-luna-text mb-4 leading-tight"
        >
          Vis en harmonie avec ton cycle
        </motion.h1>

        <motion.p
          variants={item}
          className="text-luna-text-secondary text-base md:text-lg font-body max-w-xl mx-auto mb-8 leading-relaxed"
        >
          LUNA t'accompagne chaque jour avec des conseils sport, alimentation, sommeil et bien-être adaptés à ta phase hormonale.
        </motion.p>

        <motion.div variants={item}>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3 bg-luna-primary text-white rounded-luna-sm font-body font-bold text-base hover:bg-luna-primary-dark transition-all shadow-lg shadow-luna-primary/30"
          >
            Découvrir mon cycle
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.section>

      {/* Why LUNA */}
      <section className="px-4 py-12 bg-luna-cream-light">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-luna-text text-center mb-8">
            Pourquoi LUNA ?
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {whyCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-luna p-6 shadow-sm"
              >
                <span className="text-3xl mb-3 block">{card.icon}</span>
                <h3 className="font-display text-lg text-luna-text mb-2">{card.title}</h3>
                <p className="text-sm text-luna-text-secondary font-body leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-luna-text text-center mb-8">
            Les 4 phases de ton cycle
          </h2>
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x">
            {phases.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-56 md:w-auto rounded-luna p-5 text-center snap-start"
                style={{ backgroundColor: p.bgColor }}
              >
                <span className="text-4xl mb-2 block">{p.icon}</span>
                <h3 className="font-display text-base mb-1" style={{ color: p.colorDark }}>
                  {p.shortName}
                </h3>
                <p className="text-xs font-accent text-luna-text-secondary mb-2">Jours {p.days}</p>
                <p className="text-sm font-body" style={{ color: p.colorDark }}>
                  {p.summary.split('.')[0]}.
                </p>
                <span
                  className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-body font-bold text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {p.keyword}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="px-4 py-12 bg-luna-cream-light">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-luna-text text-center mb-8">
            Avant / Avec LUNA
          </h2>
          <div className="space-y-4">
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="grid md:grid-cols-2 gap-3"
              >
                <div className="bg-gray-100 rounded-luna p-4 opacity-70">
                  <p className="text-xs font-accent font-semibold text-gray-500 mb-1">Avant</p>
                  <p className="text-sm text-gray-600 font-body">{c.before}</p>
                </div>
                <div className="rounded-luna p-4" style={{ backgroundColor: PHASES.luteal.bgColor }}>
                  <p className="text-xs font-accent font-semibold text-luna-mint-dark mb-1">Avec LUNA</p>
                  <p className="text-sm font-body text-luna-text">{c.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="font-display text-2xl md:text-3xl text-luna-text mb-4">
          Prête à te reconnecter à ton corps ?
        </h2>
        <p className="text-luna-text-secondary font-body mb-6">
          Ton cycle n'est pas un obstacle. C'est ta boussole intérieure.
        </p>
        <Link
          to="/onboarding"
          className="inline-flex items-center gap-2 px-8 py-3 bg-luna-primary text-white rounded-luna-sm font-body font-bold hover:bg-luna-primary-dark transition-all shadow-lg shadow-luna-primary/30"
        >
          Commencer gratuitement
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-luna-rose/10 text-center">
        <img src="/logo-luna.png" alt="LUNA" className="w-16 mx-auto mb-3 opacity-60" />
        <p className="text-sm text-luna-text-secondary font-body">
          Fait avec <Heart size={14} className="inline text-luna-rose" /> pour les femmes
        </p>
        <p className="text-xs text-luna-text-secondary/60 font-body mt-1">
          LUNA — Vis en harmonie avec ton cycle
        </p>
      </footer>
    </div>
  );
}
