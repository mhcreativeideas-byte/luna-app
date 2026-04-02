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
    emoji: '🏋️‍♀️',
    theme: 'Sport',
    before: '"Zéro motivation pour le sport cette semaine. Je culpabilise."',
    after: 'Phase lutéale = énergie basse. C\'est hormonal, pas un manque de volonté. Yoga aujourd\'hui, HIIT dans 5 jours.',
  },
  {
    emoji: '🍫',
    theme: 'Alimentation',
    before: '"Je craque sur le sucre H24. J\'ai aucune discipline."',
    after: 'Ton métabolisme brûle 200-300 cal/jour de plus en phase lutéale. Ton corps réclame du carburant. Nourris-le.',
  },
  {
    emoji: '💼',
    theme: 'Vie pro',
    before: '"Ma présentation était nulle. Je me sentais pas légitime."',
    after: 'En phase ovulatoire, ta confiance et tes capacités verbales sont au max. Planifie tes moments clés.',
  },
  {
    emoji: '😴',
    theme: 'Sommeil',
    before: '"Impossible de dormir, je tourne dans mon lit depuis 2h."',
    after: 'La progestérone chute avant tes règles et perturbe le sommeil. Magnésium + pas d\'écran = game changer.',
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
              Comprendre mon cycle
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
          <h2 className="font-display text-2xl md:text-3xl text-center text-luna-text mb-2">
            Même situation.<br /><em className="text-luna-primary">Deux réalités.</em>
          </h2>
          <p className="text-center text-luna-text-muted font-body text-sm mb-12 max-w-md mx-auto">
            Quand tu comprends ton cycle, tu arrêtes de te battre contre ton corps.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[24px] overflow-hidden bg-white"
                style={{ boxShadow: '0 2px 20px rgba(45,34,38,0.06)' }}
              >
                {/* Theme header */}
                <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #FDE8EB 0%, #FFF3EB 100%)' }}>
                    {c.emoji}
                  </span>
                  <span className="text-[11px] font-body font-bold text-luna-text uppercase tracking-widest">{c.theme}</span>
                </div>

                {/* Sans LUNA */}
                <div className="px-5 pb-4">
                  <p className="text-sm text-luna-text-muted font-body leading-relaxed italic">
                    {c.before}
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-5 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[9px] font-body font-bold uppercase tracking-widest" style={{ color: '#C4727F' }}>avec luna</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Avec LUNA */}
                <div className="px-5 pt-4 pb-5">
                  <p className="text-sm font-body text-luna-text font-medium leading-relaxed">
                    {c.after}
                  </p>
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
            Comprendre mon cycle
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
