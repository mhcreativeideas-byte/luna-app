import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Heart, Gift, Check, Apple, Mail, ArrowRight, ChevronDown } from 'lucide-react';
import { BrandSymbol, Divider } from '../components/illustrations/LunaIllustrations';
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

// Tableau « Sans LUNA / Avec LUNA » — repris de l'onboarding (même ton émotionnel).
const comparisons = [
  { sans: "Tu t'emportes sans comprendre pourquoi", avec: "Tu sais que c'est ta phase, pas toi", emojiSans: '😢', emojiAvec: '🌙' },
  { sans: "Tu dévores du chocolat à 23h et tu t'en veux", avec: "Tes envies sont normales — et on les apaise", emojiSans: '🍫', emojiAvec: '🌿' },
  { sans: "Tu te réveilles déjà crevée certains matins", avec: "Tu sais quand ralentir, et pourquoi", emojiSans: '💀', emojiAvec: '⚡' },
  { sans: "Ventre en feu, tu serres les dents", avec: "Tu manges ce qui calme tes douleurs", emojiSans: '🤯', emojiAvec: '🌸' },
  { sans: "Tu te sens gonflée, rien ne te va", avec: "Tu dégonfles avec les bons aliments", emojiSans: '👖', emojiAvec: '☀️' },
  { sans: "20h, rien de prévu, encore un Uber Eats", avec: "Ton menu t'attend, prêt chaque matin", emojiSans: '🥡', emojiAvec: '🍽️' },
];

// Aperçu de l'app (vraies captures)
const appShots = [
  { src: '/app/cycle.png', label: 'Ton cycle, jour après jour' },
  { src: '/app/manger.png', label: 'Ton menu, pensé pour ta phase' },
  { src: '/app/aliments.png', label: 'Les aliments qu\'il te faut' },
];

// ── Cadre iPhone autour d'une capture ───────────────────────────────────────
function PhoneFrame({ src, className = '', style }) {
  return (
    <div className={`rounded-[2.4rem] bg-[#1a1416] p-[7px] ${className}`} style={{ boxShadow: '0 22px 55px rgba(45,34,38,0.28)', ...style }}>
      <img src={src} alt="Aperçu de l'app LUNA" className="w-full rounded-[1.9rem] block" />
    </div>
  );
}

// ── Formulaire liste d'attente ──────────────────────────────────────────────
// Enregistre l'email dans la table Supabase `waitlist`, puis déclenche le
// téléchargement du guide offert (lead magnet). Une inscription déjà existante
// est traitée comme un succès (on redonne quand même le guide).
function WaitlistForm({ source = 'landing' }) {
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

    // 23505 = email déjà inscrit → succès quand même, on redonne le guide.
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
      <p className="text-xs text-luna-text-hint font-body mt-3 text-center leading-relaxed">
        Sans engagement · Zéro spam · Désinscription en 1 clic
      </p>
    </form>
  );
}

// ── Badge « Télécharger dans l'App Store » ──────────────────────────────────
// Affiché UNIQUEMENT quand APP_LAUNCHED = true (au lancement de l'app).
// ⚠️ Badge DESSINÉ (SVG maison). Au lancement, utilise le visuel OFFICIEL Apple :
// https://developer.apple.com/app-store/marketing/guidelines/ (version FR).
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

// Le CTA (formulaire email avant lancement, badge App Store après)
function CtaBlock({ source }) {
  return APP_LAUNCHED
    ? <div className="flex justify-center"><AppStoreBadge /></div>
    : <WaitlistForm source={source} />;
}

export default function Landing() {
  // Dans l'app native : carrousel d'intro court. Sur le web : vitrine.
  if (Capacitor.isNativePlatform()) {
    return <IntroCarousel />;
  }
  return (
    <main className="min-h-screen bg-luna-bg overflow-x-hidden">
      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, #F5D0D5 0%, #F2C0A8 34%, #FAF7F5 78%, #FAF7F5 100%)' }}
        />
        <div className="absolute top-24 -right-16 w-56 h-56 rounded-full bg-white/20 blur-2xl" />
        <div className="absolute top-52 -left-16 w-48 h-48 rounded-full bg-white/15 blur-2xl" />

        <div className="relative px-5 pt-[calc(env(safe-area-inset-top)+3rem)] pb-14 text-center max-w-xl mx-auto">
          <motion.img
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            src="/logo-luna.png" alt="LUNA" className="w-36 md:w-44 mx-auto mb-5"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-white/70 backdrop-blur-sm text-luna-primary-dark text-xs font-body font-bold uppercase tracking-widest">
              <Apple size={14} />
              {APP_LAUNCHED ? "Disponible sur l'App Store" : "Bientôt sur l'App Store"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-[34px] leading-[1.12] md:text-5xl text-luna-text mb-4"
          >
            Arrête de subir<br />ton cycle.<br />
            <em style={{ fontStyle: 'italic', color: '#A85A66' }}>Comprends-le.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="text-luna-text-muted text-base md:text-lg font-body max-w-md mx-auto mb-7 leading-relaxed"
          >
            {APP_LAUNCHED
              ? "L'app qui adapte ton assiette à chaque phase — pour retrouver ton énergie, sans culpabiliser."
              : "L'app qui adapte ton assiette à chaque phase. Inscris-toi et reçois ton guide offert."}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <CtaBlock source="hero" />
          </motion.div>

          {/* Mockup iPhone */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <PhoneFrame src="/app/manger.png" className="w-[230px] md:w-[260px]" />
          </motion.div>
        </div>

        {/* indicateur de scroll */}
        <div className="relative flex justify-center pb-6 -mt-2">
          <ChevronDown className="text-luna-primary/50 animate-bounce" size={22} />
        </div>
      </section>

      {/* ══ LE PROBLÈME — photo d'ambiance en bandeau + texte sur crème ═══════ */}
      <section className="bg-luna-bg">
        <div className="relative">
          <img src="/ambiance-cuisine.jpg" alt="" className="w-full h-[320px] md:h-[420px] object-cover object-top" />
          {/* fondu vers le crème pour une transition douce */}
          <div className="absolute bottom-0 inset-x-0 h-28" style={{ background: 'linear-gradient(180deg, rgba(250,247,245,0) 0%, #FAF7F5 100%)' }} />
        </div>
        <div className="px-6 pt-4 pb-14 max-w-xl mx-auto text-center">
          <h2 className="font-display text-[27px] md:text-4xl text-luna-text leading-tight mb-3">
            Ton corps te parle chaque jour.<br />
            <em style={{ fontStyle: 'italic', color: '#A85A66' }}>Et si tu l'écoutais ?</em>
          </h2>
          <p className="text-luna-text-muted font-body text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            Chaque phase de ton cycle a ses besoins. Personne ne t'a appris à les nourrir. LUNA, si.
          </p>
        </div>
      </section>

      {/* ══ TABLEAU SANS / AVEC LUNA ═════════════════════════════════════════ */}
      <section className="px-5 py-16 bg-luna-bg">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-[26px] md:text-3xl text-luna-text leading-tight">
              Aujourd'hui, tu subis.
            </h2>
            <p className="font-display text-[26px] md:text-3xl leading-tight mt-0.5" style={{ color: '#C4727F', fontStyle: 'italic' }}>
              Demain, tu comprends.
            </p>
          </div>

          <div className="rounded-[20px] overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(45,34,38,0.08)' }}>
            <div className="grid grid-cols-2">
              <div className="bg-gray-50 py-3 px-4">
                <p className="text-[11px] font-body font-bold text-luna-text-hint uppercase tracking-widest text-center">Sans LUNA</p>
              </div>
              <div className="py-3 px-4" style={{ backgroundColor: '#FDE8EB' }}>
                <p className="text-[11px] font-body font-bold uppercase tracking-widest text-center" style={{ color: '#A85A66' }}>Avec LUNA</p>
              </div>
            </div>
            {comparisons.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-2 border-t border-gray-100"
              >
                <div className="bg-gray-50 px-4 py-3.5 flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5 grayscale opacity-60">{c.emojiSans}</span>
                  <p className="text-[13px] font-body text-luna-text-muted leading-snug">{c.sans}</p>
                </div>
                <div className="px-4 py-3.5 flex items-start gap-2.5" style={{ backgroundColor: '#FFFBFC' }}>
                  <span className="text-base flex-shrink-0 mt-0.5">{c.emojiAvec}</span>
                  <p className="text-[13px] font-body font-semibold text-luna-text leading-snug">{c.avec}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="font-display text-lg text-center mt-8" style={{ color: '#A85A66', fontStyle: 'italic' }}>
            Et si tu arrêtais de te battre contre toi-même ?
          </p>
        </div>
      </section>

      {/* ══ APERÇU DE L'APP ══════════════════════════════════════════════════ */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="px-5 max-w-xl mx-auto text-center mb-9">
          <h2 className="font-display text-[26px] md:text-3xl text-luna-text leading-tight mb-2">
            Voici ton quotidien<br />avec LUNA
          </h2>
          <p className="text-luna-text-muted font-body text-sm">
            Une app pensée comme une amie qui s'y connaît.
          </p>
        </div>
        <div className="flex gap-5 overflow-x-auto px-5 pb-4 snap-x hide-scrollbar md:justify-center">
          {appShots.map((shot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="flex-shrink-0 w-[200px] snap-center text-center"
            >
              <PhoneFrame src={shot.src} className="w-[200px] mb-4" />
              <p className="text-sm font-body font-semibold text-luna-text px-2">{shot.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ LE CADEAU — vraie couverture du guide ════════════════════════════ */}
      {!APP_LAUNCHED && (
        <section className="px-5 py-16" style={{ background: 'linear-gradient(180deg, #FDE8EB 0%, #FFF3EB 100%)' }}>
          <div className="max-w-xl mx-auto flex flex-col items-center text-center">
            <span className="inline-block px-3 py-1 rounded-pill bg-luna-primary text-white text-[11px] font-body font-bold uppercase tracking-widest mb-6">
              Cadeau de bienvenue
            </span>
            <motion.div
              initial={{ opacity: 0, y: 24, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-7"
            >
              <img
                src="/guide-cover.png"
                alt="Guide LUNA — Quoi manger à chaque phase"
                className="w-[220px] md:w-[260px] rounded-[14px]"
                style={{ boxShadow: '0 24px 60px rgba(45,34,38,0.28)' }}
              />
            </motion.div>
            <h2 className="font-display text-[26px] md:text-3xl text-luna-text leading-tight mb-3">
              Ton guide offert :<br /><em style={{ fontStyle: 'italic', color: '#A85A66' }}>« Quoi manger à chaque phase »</em>
            </h2>
            <p className="text-luna-text-muted font-body text-sm md:text-base leading-relaxed max-w-sm mb-6">
              Les aliments qui soutiennent ton corps à chaque moment de ton cycle. Reçois-le tout de suite en t'inscrivant.
            </p>
            <a href="#rejoindre" className="inline-flex items-center gap-2 text-sm font-body font-bold text-luna-primary hover:text-luna-primary-dark transition-colors">
              Je le veux
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      )}

      {/* ══ CTA FINAL ════════════════════════════════════════════════════════ */}
      <section id="rejoindre" className="px-5 py-20 text-center relative overflow-hidden scroll-mt-6">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FAF7F5 0%, #F5D0D5 55%, #F2C0A8 100%)' }} />
        <div className="relative max-w-xl mx-auto">
          <h2 className="font-display text-[28px] md:text-4xl text-luna-text leading-tight mb-4">
            {APP_LAUNCHED
              ? <>Ton corps fonctionne par cycles.<br /><em style={{ fontStyle: 'italic', color: '#A85A66' }}>Ton assiette aussi.</em></>
              : <>Rejoins les premières.<br /><em style={{ fontStyle: 'italic', color: '#A85A66' }}>Avant tout le monde.</em></>}
          </h2>
          <p className="text-luna-text-muted font-body mb-8 text-sm md:text-base max-w-sm mx-auto">
            {APP_LAUNCHED
              ? 'Rejoins les femmes qui ont arrêté de subir leur cycle et ont commencé à s\'en servir.'
              : 'Ton guide offert + ta réduction fondatrice t\'attendent. Sois prévenue dès la sortie de LUNA.'}
          </p>
          <CtaBlock source="cta-final" />
          <Divider className="mx-auto mt-12" />
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="px-4 py-10 bg-white text-center">
        <BrandSymbol size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm text-luna-text-muted font-body inline-flex items-center gap-1.5">
          Conçu avec <Heart size={13} className="text-luna-primary fill-luna-primary" /> par des femmes, pour des femmes.
        </p>
        <p className="text-xs text-luna-text-hint font-body mt-1">
          LUNA — Comprends ton cycle. Adapte ton assiette.
        </p>
        <div className="flex items-center justify-center gap-4 mt-5 text-xs font-body">
          <Link to="/confidentialite" className="text-luna-text-muted hover:text-luna-rose transition-colors">Confidentialité</Link>
          <span className="text-luna-text-hint">·</span>
          <Link to="/conditions" className="text-luna-text-muted hover:text-luna-rose transition-colors">Conditions</Link>
        </div>
        <p className="text-[11px] text-luna-text-hint font-body mt-4">© 2026 LUNA</p>
      </footer>
    </main>
  );
}
