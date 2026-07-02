import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Heart, Gift, Check, Bell, Apple, Sparkles, Mail, ArrowRight } from 'lucide-react';
import { PHASES, PHASE_ORDER } from '../data/phases';
import { BrandSymbol, HormonesIcon, SelfCareIcon, EnergyIcon, Divider } from '../components/illustrations/LunaIllustrations';
import IntroCarousel from '../components/IntroCarousel';
import { supabase } from '../lib/supabase';

const LEAD_MAGNET_PATH = '/LUNA-Guide-Quoi-manger-a-chaque-phase.pdf';

// ┌─────────────────────────────────────────────────────────────────────────┐
// │ LANCEMENT DE L'APP — un seul interrupteur à changer le jour J.           │
// │                                                                           │
// │ • Tant que APP_LAUNCHED = false → la page montre la LISTE D'ATTENTE.      │
// │ • Le jour du lancement : mets APP_LAUNCHED = true et colle le lien de     │
// │   ta fiche App Store dans APP_STORE_URL. La page affichera alors le       │
// │   bouton « Télécharger dans l'App Store » à la place du formulaire email. │
// │   (Pense aussi à remplacer le badge dessiné par le visuel officiel Apple  │
// │    — voir composant AppStoreBadge plus bas.)                              │
// └─────────────────────────────────────────────────────────────────────────┘
const APP_LAUNCHED = false;
const APP_STORE_URL = 'https://apps.apple.com/app/idXXXXXXXXX'; // ← à remplir au lancement

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
    desc: 'Œstrogène, progestérone, LH, FSH. Elles dirigent ton énergie, ton humeur et tes fringales. LUNA te montre ce qu\'elles font, jour après jour.',
    Illustration: HormonesIcon,
    gradient: 'linear-gradient(135deg, #FDE8EB 0%, #F5D0D5 100%)',
  },
  {
    title: 'Zéro culpabilité',
    desc: 'Envie de sucre en fin de cycle ? Normal, ton métabolisme augmente. Fatiguée pendant tes règles ? Logique, tes hormones sont au plancher. Ici, on t\'explique pourquoi.',
    Illustration: SelfCareIcon,
    gradient: 'linear-gradient(135deg, #FFF3EB 0%, #F5DCC8 100%)',
  },
  {
    title: 'Une assiette qui évolue avec ton cycle',
    desc: 'Menu du jour, recettes et nutriments clés, adaptés à ta phase hormonale. Pas de régime générique : ce dont ton corps a besoin aujourd\'hui.',
    Illustration: EnergyIcon,
    gradient: 'linear-gradient(135deg, #F3EEF8 0%, #E0D5EB 100%)',
  },
];

const comparisons = [
  {
    emoji: '🍫',
    theme: 'Fringales',
    before: '"Je craque sur le sucre H24. J\'ai aucune discipline."',
    after: 'Ton métabolisme brûle plus en phase lutéale. Ton corps réclame du carburant : chocolat noir, dattes, fruits — au lieu de culpabiliser.',
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

// ── Formulaire liste d'attente ──────────────────────────────────────────────
// Enregistre l'email dans la table Supabase `waitlist`, puis déclenche le
// téléchargement du guide offert (lead magnet). Une inscription déjà existante
// est traitée comme un succès (on redonne quand même le guide).
function WaitlistForm({ source = 'landing', compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = LEAD_MAGNET_PATH;
    link.download = 'LUNA-Guide-Quoi-manger-a-chaque-phase.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErrorMsg('Oups, cette adresse email semble incorrecte.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    const { error } = await supabase.from('waitlist').insert({ email: clean, source });

    // 23505 = email déjà inscrit → on considère ça comme un succès et on redonne le guide.
    if (error && error.code !== '23505') {
      console.error('Waitlist insert error:', error);
      setErrorMsg('Un souci est survenu. Réessaie dans un instant.');
      setStatus('error');
      return;
    }

    setStatus('success');
    triggerDownload();
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto rounded-[24px] bg-white p-6 text-center"
        style={{ boxShadow: '0 8px 32px rgba(196,114,127,0.18)' }}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C4727F 0%, #E8A87C 100%)' }}>
          <Check className="text-white" size={28} strokeWidth={2.5} />
        </div>
        <h3 className="font-display text-xl text-luna-text mb-2">Tu es sur la liste 🌙</h3>
        <p className="text-sm text-luna-text-muted font-body leading-relaxed mb-4">
          Ton guide <strong className="text-luna-text">« Quoi manger à chaque phase »</strong> se télécharge.
          Tu seras parmi les premières prévenues au lancement — avec ta réduction fondatrice.
        </p>
        <button
          onClick={triggerDownload}
          className="inline-flex items-center gap-2 text-sm font-body font-semibold text-luna-primary hover:text-luna-primary-dark transition-colors"
        >
          <Gift size={16} />
          Le téléchargement n'a pas démarré ? Clique ici
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-luna-text-hint" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
            placeholder="ton@email.com"
            autoComplete="email"
            inputMode="email"
            className="w-full pl-11 pr-4 py-4 rounded-[18px] border border-luna-primary/20 bg-white text-base font-body text-luna-text placeholder:text-luna-text-hint focus:outline-none focus:border-luna-primary focus:ring-2 focus:ring-luna-primary/20 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-luna w-full justify-center text-base disabled:opacity-70"
        >
          {status === 'loading' ? 'Un instant…' : (
            <>
              Je veux mon guide offert
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-500 font-body mt-2 text-center">{errorMsg}</p>
      )}
      {!compact && (
        <p className="text-xs text-luna-text-hint font-body mt-3 text-center leading-relaxed">
          Sans engagement · Zéro spam · Désinscription en 1 clic
        </p>
      )}
    </form>
  );
}

// ── Badge « Télécharger dans l'App Store » ──────────────────────────────────
// Affiché UNIQUEMENT quand APP_LAUNCHED = true (au lancement de l'app).
// ⚠️ Ce badge est DESSINÉ (SVG maison) pour la mise en page. Le jour du
// lancement, Apple demande d'utiliser son visuel OFFICIEL : télécharge-le sur
// https://developer.apple.com/app-store/marketing/guidelines/ (version FR),
// mets-le dans public/ et remplace le <svg> ci-dessous par une <img>.
function AppStoreBadge({ className = '' }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 bg-black text-white rounded-2xl pl-5 pr-7 py-3.5 hover:opacity-90 transition-opacity ${className}`}
    >
      <svg viewBox="0 0 384 512" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-body opacity-90">Télécharger dans l'</span>
        <span className="block text-xl font-body font-semibold -mt-0.5">App Store</span>
      </span>
    </a>
  );
}

export default function Landing() {
  // Dans l'app native : carrousel d'intro court. Sur le web : vitrine liste d'attente.
  if (Capacitor.isNativePlatform()) {
    return <IntroCarousel />;
  }
  return (
    <main className="min-h-screen bg-luna-bg">
      {/* ── Hero + capture email ─────────────────────────────────────────── */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #F5D0D5 0%, #F2C0A8 30%, #FAF7F5 72%, #FAF7F5 100%)',
          }}
        />
        <div className="absolute top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute top-40 -left-16 w-48 h-48 rounded-full bg-white/15 blur-2xl" />

        <div className="relative px-4 pt-[calc(env(safe-area-inset-top)+3.5rem)] pb-16 text-center max-w-2xl mx-auto">
          <motion.div variants={item} className="mb-5">
            <img src="/logo-luna.png" alt="LUNA" className="w-40 md:w-48 mx-auto" />
          </motion.div>

          {/* Badge "bientôt" / "disponible" selon le lancement */}
          <motion.div variants={item} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-white/70 backdrop-blur-sm text-luna-primary-dark text-xs font-body font-bold uppercase tracking-widest">
              <Apple size={14} />
              {APP_LAUNCHED ? "Disponible sur l'App Store" : "Bientôt sur l'App Store"}
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-3xl md:text-5xl text-luna-text mb-5 leading-tight"
          >
            L'app qui adapte ton assiette<br />à ton cycle arrive
          </motion.h1>

          <motion.p
            variants={item}
            className="text-luna-text-muted text-base md:text-lg font-body max-w-lg mx-auto mb-7 leading-relaxed"
          >
            Ton cycle influence ton énergie, ton humeur, tes fringales — chaque jour différemment.
            {APP_LAUNCHED
              ? <> Télécharge LUNA et adapte enfin ton assiette à chaque phase.</>
              : <> Inscris-toi à la liste d'attente et reçois tout de suite ton <strong className="text-luna-text">guide offert</strong>.</>}
          </motion.p>

          <motion.div variants={item} className="flex justify-center">
            {APP_LAUNCHED ? <AppStoreBadge /> : <WaitlistForm source="hero" />}
          </motion.div>

          {/* Micro-preuves (uniquement avant lancement) */}
          {!APP_LAUNCHED && (
            <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-7 text-xs font-body text-luna-text-muted">
              <span className="inline-flex items-center gap-1.5"><Gift size={14} className="text-luna-primary" /> Guide PDF offert</span>
              <span className="inline-flex items-center gap-1.5"><Bell size={14} className="text-luna-primary" /> Prévenue au lancement</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles size={14} className="text-luna-primary" /> Réduction fondatrice</span>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* ── Le guide offert (lead magnet) ────────────────────────────────── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-[28px] p-7 md:p-9 flex flex-col md:flex-row items-center gap-7 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FDE8EB 0%, #FFF3EB 100%)' }}
          >
            <div className="absolute -top-8 -right-8 opacity-10">
              <Gift size={140} className="text-luna-primary" />
            </div>
            <div className="relative flex-shrink-0">
              <div className="w-28 h-36 md:w-32 md:h-44 rounded-2xl bg-white flex items-center justify-center shadow-lg rotate-[-4deg]">
                <BrandSymbol size={54} className="opacity-80" />
              </div>
            </div>
            <div className="relative flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 rounded-pill bg-luna-primary text-white text-[11px] font-body font-bold uppercase tracking-widest mb-3">
                Cadeau de bienvenue
              </span>
              <h2 className="font-display text-2xl text-luna-text mb-2">
                Ton guide « Quoi manger à chaque phase »
              </h2>
              <p className="text-sm text-luna-text-muted font-body leading-relaxed">
                Les aliments qui soutiennent ton corps à chaque moment de ton cycle : quoi mettre dans
                ton assiette pendant tes règles, en phase folliculaire, à l'ovulation et avant tes règles.
                Offert dès ton inscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Le problème ──────────────────────────────────────────────────── */}
      <section className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-luna-text-body font-body text-base md:text-lg leading-relaxed">
            On compte nos calories et nos pas. Mais <strong className="text-luna-text">personne ne nous a appris à nourrir notre corps selon notre cycle</strong>. Pourtant, il impacte tout : énergie, humeur, digestion, peau, fringales. Chaque phase a ses besoins. Il est temps d'en tenir compte.
          </p>
        </div>
      </section>

      {/* ── Ce que LUNA t'apporte ────────────────────────────────────────── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-center text-luna-text mb-3">
            Ce que LUNA fera pour toi
          </h2>
          <p className="text-center text-luna-text-muted font-body text-sm mb-10 max-w-md mx-auto">
            Des conseils concrets, personnalisés, adaptés à ta phase.
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

      {/* ── Les 4 phases ─────────────────────────────────────────────────── */}
      <section className="px-4 py-14">
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

      {/* ── Avant / Après ────────────────────────────────────────────────── */}
      <section className="px-4 py-14 bg-white">
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
                {/* SANS LUNA */}
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
                {/* AVEC LUNA */}
                <div className="bg-white px-5 pt-4 pb-5 relative">
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
                  <div className="absolute top-0 left-5 right-5 h-[2px] rounded-full" style={{ background: 'linear-gradient(90deg, #C4727F 0%, #F2C0A8 100%)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────────── */}
      <section className="px-4 py-20 text-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #FAF7F5 0%, #F5D0D5 55%, #F2C0A8 100%)',
          }}
        />
        <div className="relative max-w-xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl text-luna-text mb-4">
            {APP_LAUNCHED
              ? <>Ton corps fonctionne par cycles.<br />Ton assiette aussi.</>
              : <>Sois la première prévenue<br />quand LUNA sort</>}
          </h2>
          <p className="text-luna-text-muted font-body mb-8 text-sm max-w-sm mx-auto">
            {APP_LAUNCHED
              ? 'Rejoins les femmes qui ont arrêté de subir leur cycle et ont commencé à s\'en servir.'
              : 'Rejoins les femmes qui ont arrêté de subir leur cycle. Ton guide offert + ta réduction fondatrice t\'attendent.'}
          </p>
          {APP_LAUNCHED
            ? <div className="flex justify-center"><AppStoreBadge /></div>
            : <WaitlistForm source="cta-final" />}
          <Divider className="mx-auto mt-12" />
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="px-4 py-10 bg-white text-center">
        <BrandSymbol size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm text-luna-text-muted font-body inline-flex items-center gap-1.5">
          Conçu avec <Heart size={13} className="text-luna-primary fill-luna-primary" /> par des femmes, pour des femmes.
        </p>
        <p className="text-xs text-luna-text-hint font-body mt-1">
          LUNA — Comprends ton cycle. Adapte ton assiette.
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
