import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Brain, Zap } from 'lucide-react';
import { PHASES, PHASE_ORDER } from '../data/phases';
import { BrandSymbol, HormonesIcon, SelfCareIcon, EnergyIcon, Divider } from '../components/illustrations/LunaIllustrations';

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
    title: 'Tes hormones, décryptées',
    desc: 'Œstrogène, progestérone, LH, FSH — elles dirigent ton énergie, ton humeur et tes performances. LUNA te montre ce qu\'elles font, jour après jour.',
    Illustration: HormonesIcon,
    gradient: 'linear-gradient(135deg, #FDE8EB 0%, #F5D0D5 100%)',
  },
  {
    title: 'Zéro culpabilité',
    desc: 'Envie de sucre en fin de cycle ? Normal, ton métabolisme augmente de 10%. Fatiguée pendant tes règles ? Logique, tes hormones sont au plancher. Ici, on t\'explique pourquoi.',
    Illustration: SelfCareIcon,
    gradient: 'linear-gradient(135deg, #FFF3EB 0%, #F5DCC8 100%)',
  },
  {
    title: 'Des conseils qui changent chaque jour',
    desc: 'Sport, alimentation, sommeil, bien-être — adaptés à ta phase hormonale. Pas de programme générique. Des recommandations qui correspondent à ce que ton corps vit aujourd\'hui.',
    Illustration: EnergyIcon,
    gradient: 'linear-gradient(135deg, #F3EEF8 0%, #E0D5EB 100%)',
  },
];

const comparisons = [
  {
    before: 'Je n\'arrive pas à m\'entraîner cette semaine. J\'ai zéro motivation.',
    after: 'Je suis en fin de cycle. Mon énergie est basse, c\'est hormonal. Yoga cette semaine, cardio la semaine prochaine.',
  },
  {
    before: 'Pourquoi j\'ai autant faim ? Je craque tout le temps.',
    after: 'Mon métabolisme augmente en phase lutéale. J\'ai besoin de 200-300 cal de plus par jour. C\'est mon corps qui parle, pas un manque de volonté.',
  },
  {
    before: 'Ma présentation était nulle. J\'étais pas du tout à l\'aise.',
    after: 'Je planifie mes présentations en phase ovulatoire. Mes capacités verbales et ma confiance sont à leur max — c\'est prouvé.',
  },
];

const phases = PHASE_ORDER.map((key) => ({ key, ...PHASES[key] }));

export default function Landing() {
  return (
    <div className="min-h-screen bg-luna-bg">
      {/* Hero */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #F5D0D5 0%, #F2C0A8 30%, #FAF7F5 70%, #FAF7F5 100%)',
          }}
        />
        <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute top-40 -left-16 w-48 h-48 rounded-full bg-white/15 blur-2xl" />

        <div className="relative px-4 pt-16 pb-16 md:pt-24 md:pb-24 text-center max-w-3xl mx-auto">
          <motion.div variants={item} className="mb-6">
            <img src="/logo-luna.png" alt="LUNA" className="w-44 md:w-52 mx-auto mb-4" />
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-3xl md:text-5xl text-luna-text mb-5 leading-tight"
          >
            Reprends le contrôle<br />de ton cycle
          </motion.h1>

          <motion.p
            variants={item}
            className="text-luna-text-muted text-base md:text-lg font-body max-w-lg mx-auto mb-8 leading-relaxed"
          >
            Ton cycle influence ton énergie, ton humeur, tes performances — chaque jour différemment. LUNA t'aide à comprendre ce qui se passe dans ton corps et à adapter ton quotidien en conséquence.
          </motion.p>

          <motion.div variants={item} className="space-y-3">
            <Link to="/onboarding" className="btn-luna text-base">
              Commencer — c'est gratuit
              <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-luna-text-hint font-body mt-3">
              Basé sur la recherche en endocrinologie. Données privées et chiffrées.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Problem statement */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-luna-text-body font-body text-base md:text-lg leading-relaxed">
            On suit nos pas, notre sommeil, nos calories — mais <strong className="text-luna-text">personne ne nous a appris à comprendre notre cycle</strong>. Pourtant, il impacte tout : énergie, humeur, digestion, peau, libido, performances cognitives. Chaque jour du mois est différent. Il est temps d'en tenir compte.
          </p>
        </div>
      </section>

      {/* Why LUNA */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center text-luna-text mb-3">
            Ce que LUNA fait pour toi
          </h2>
          <p className="text-center text-luna-text-muted font-body text-sm mb-10 max-w-md mx-auto">
            Des informations concrètes, personnalisées, mises à jour chaque jour.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {whyCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[24px] p-6 relative overflow-hidden"
                style={{ background: card.gradient }}
              >
                <div className="absolute top-4 right-4 opacity-15">
                  <card.Illustration size={56} />
                </div>
                <div className="relative">
                  <card.Illustration size={40} className="mb-4 opacity-70" />
                  <h3 className="font-display text-lg text-luna-text mb-2">{card.title}</h3>
                  <p className="text-sm text-luna-text-muted font-body leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center text-luna-text mb-3">
            4 phases. 4 réalités différentes.
          </h2>
          <p className="text-center text-luna-text-muted font-body text-sm mb-10 max-w-md mx-auto">
            Ton cycle dure ~28 jours. À chaque phase, tes hormones changent — et ton corps avec.
          </p>
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-4 md:pb-0 snap-x hide-scrollbar">
            {phases.map((p, i) => (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-shrink-0 w-56 md:w-auto rounded-[24px] p-6 text-center snap-start"
                style={{ backgroundColor: p.bgColor }}
              >
                <span className="text-4xl mb-3 block">{p.icon}</span>
                <h3 className="font-display text-base mb-1" style={{ color: p.colorDark }}>
                  {p.shortName}
                </h3>
                <p className="text-xs font-body text-luna-text-muted mb-3">Jours {p.days}</p>
                <p className="text-sm font-body leading-relaxed" style={{ color: p.colorDark }}>
                  {p.summary.split('.')[0]}.
                </p>
                <span
                  className="inline-block mt-4 px-4 py-1.5 rounded-pill text-xs font-body font-semibold text-white"
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
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center text-luna-text mb-3">
            Sans LUNA / Avec LUNA
          </h2>
          <p className="text-center text-luna-text-muted font-body text-sm mb-10 max-w-md mx-auto">
            Même situation. Mais quand tu comprends ton corps, tout change.
          </p>
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
                <div className="bg-gray-50 rounded-[20px] p-5 opacity-60">
                  <p className="text-[10px] font-body font-bold text-luna-text-hint mb-2 uppercase tracking-wider">Sans LUNA</p>
                  <p className="text-sm text-luna-text-muted font-body leading-relaxed">{c.before}</p>
                </div>
                <div className="rounded-[20px] p-5" style={{ background: 'linear-gradient(135deg, #FDE8EB 0%, #FFF3EB 100%)' }}>
                  <p className="text-[10px] font-body font-bold uppercase tracking-wider mb-2" style={{ color: '#C4727F' }}>Avec LUNA</p>
                  <p className="text-sm font-body text-luna-text-body leading-relaxed">{c.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #FAF7F5 0%, #F5D0D5 50%, #F2C0A8 100%)',
          }}
        />
        <div className="relative">
          <h2 className="font-display text-2xl md:text-3xl text-luna-text mb-4">
            Ton corps fonctionne par cycles.<br />Ton quotidien devrait aussi.
          </h2>
          <p className="text-luna-text-muted font-body mb-8 text-sm max-w-sm mx-auto">
            Rejoins les femmes qui ont arrêté de subir leur cycle et qui ont commencé à s'en servir.
          </p>
          <Link to="/onboarding" className="btn-luna text-base">
            Commencer — c'est gratuit
            <ArrowRight size={18} />
          </Link>
          <Divider className="mx-auto mt-10" />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 bg-white text-center">
        <BrandSymbol size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm text-luna-text-muted font-body">
          Conçu par des femmes, pour des femmes.
        </p>
        <p className="text-xs text-luna-text-hint font-body mt-1">
          LUNA — Comprends ton cycle. Adapte ta vie.
        </p>
      </footer>
    </div>
  );
}
