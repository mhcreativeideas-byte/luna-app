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
    desc: 'Œstrogène, progestérone, LH, FSH. Elles dirigent ton énergie, ton humeur et tes performances. LUNA te montre ce qu\'elles font, jour après jour.',
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
    title: 'Une assiette qui évolue avec ton cycle',
    desc: 'Menu du jour, recettes et nutriments clés, adaptés à ta phase hormonale. Pas de régime générique : des recommandations alimentaires qui correspondent à ce que ton corps vit aujourd\'hui.',
    Illustration: EnergyIcon,
    gradient: 'linear-gradient(135deg, #F3EEF8 0%, #E0D5EB 100%)',
  },
];

const comparisons = [
  {
    emoji: '🍫',
    theme: 'Fringales',
    before: '"Je craque sur le sucre H24. J\'ai aucune discipline."',
    after: 'Ton métabolisme brûle 200-300 cal/jour de plus en phase lutéale. Ton corps réclame du carburant : chocolat noir, dattes, fruits — plutôt que de culpabiliser.',
  },
  {
    emoji: '🌙',
    theme: 'Crampes',
    before: '"Crampes terribles, j\'avale un cachet et je serre les dents."',
    after: 'Le magnésium détend les muscles : chocolat noir, amandes, banane. LUNA te propose direct les recettes qui apaisent.',
  },
  {
    emoji: '🩸',
    theme: 'Énergie',
    before: '"Vidée pendant mes règles, je carbure au café et je tiens pas."',
    after: 'Tes règles puisent dans ton fer. Lentilles, épinards, œufs : LUNA te montre quoi manger pour recharger.',
  },
  {
    emoji: '✨',
    theme: 'Peau',
    before: '"Poussée d\'acné juste avant mes règles, encore une fois."',
    after: 'Le zinc aide à réguler ta peau : graines de courge, pois chiches, noix. On te guide vers les bons aliments.',
  },
];

const phases = PHASE_ORDER.map((key) => ({ key, ...PHASES[key] }));

export default function Landing() {
  return (
    <main className="min-h-screen bg-luna-bg">
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
            Ton cycle influence ton énergie, ton humeur, tes fringales — chaque jour différemment. LUNA t'aide à comprendre ton corps et à adapter ton alimentation à chaque phase.
          </motion.p>

          <motion.div variants={item} className="flex flex-col items-center gap-4">
            <Link to="/auth?mode=signup" className="btn-luna text-base">
              Créer mon compte
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/auth?mode=login"
              className="inline-flex items-center gap-2 text-sm font-body font-semibold text-luna-text-muted hover:text-luna-text transition-colors"
            >
              J'ai déjà un compte
            </Link>
            <p className="text-xs text-luna-text-hint font-body mt-1">
              Basé sur la recherche en endocrinologie. Données privées et chiffrées.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Problem statement */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-luna-text-body font-body text-base md:text-lg leading-relaxed">
            On compte nos calories et nos pas. Mais <strong className="text-luna-text">personne ne nous a appris à nourrir notre corps selon notre cycle</strong>. Pourtant, il impacte tout : énergie, humeur, digestion, peau, fringales. Chaque phase a ses besoins. Il est temps d'en tenir compte.
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
            Des informations concrètes, personnalisées, adaptées à ta phase.
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
            Ton cycle dure ~28 jours. À chaque phase, tes hormones changent. Et ton corps avec.
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
          <div className="grid md:grid-cols-2 gap-5">
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[24px] overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}
              >
                {/* SANS LUNA — partie grise/terne */}
                <div className="bg-gray-50 px-5 pt-5 pb-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-base bg-gray-100 grayscale opacity-60">
                      {c.emoji}
                    </span>
                    <span className="text-[11px] font-body font-bold text-luna-text-hint uppercase tracking-widest">{c.theme}</span>
                  </div>
                  <p className="text-sm text-luna-text-muted font-body leading-relaxed italic">
                    {c.before}
                  </p>
                </div>

                {/* AVEC LUNA — partie colorée et impactante */}
                <div className="bg-white px-5 pt-4 pb-5 relative">
                  {/* Badge AVEC LUNA */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-9 h-9 rounded-full flex items-center justify-center text-base" style={{ background: 'linear-gradient(135deg, #FDE8EB 0%, #FFF3EB 100%)' }}>
                      {c.emoji}
                    </span>
                    <span
                      className="text-[10px] font-body font-bold uppercase tracking-widest px-3 py-1 rounded-pill text-white"
                      style={{ background: 'linear-gradient(135deg, #C4727F 0%, #D4918A 100%)' }}
                    >
                      avec luna
                    </span>
                  </div>
                  <p className="text-sm font-body text-luna-text font-semibold leading-relaxed">
                    {c.after}
                  </p>
                  {/* Accent bar */}
                  <div className="absolute top-0 left-5 right-5 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #C4727F 0%, #F2C0A8 100%)' }} />
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
          <Link to="/auth?mode=signup" className="btn-luna text-base">
            Commencer gratuitement
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
        <div className="flex items-center justify-center gap-4 mt-5 text-xs font-body">
          <Link to="/confidentialite" className="text-luna-text-muted hover:text-luna-rose transition-colors">
            Confidentialité
          </Link>
          <span className="text-luna-text-hint">·</span>
          <Link to="/conditions" className="text-luna-text-muted hover:text-luna-rose transition-colors">
            Conditions
          </Link>
        </div>
        <p className="text-[11px] text-luna-text-hint font-body mt-4">© 2026 LUNA</p>
      </footer>
    </main>
  );
}
