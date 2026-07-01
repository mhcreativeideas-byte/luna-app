import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';

// Écran d'abonnement (le VISUEL). Le vrai paiement passera par Apple In-App
// Purchase plus tard (App Store Connect + plugin) — pour l'instant les boutons
// mènent simplement à l'app via les callbacks.
const PLANS = {
  annual: { id: 'annual', label: 'Annuel', price: '59,99 €', period: '/an', sub: 'soit 5 €/mois', badge: '-50 %' },
  monthly: { id: 'monthly', label: 'Mensuel', price: '9,99 €', period: '/mois', sub: null, badge: null },
};

const BENEFITS = [
  'Recettes illimitées adaptées à ta phase',
  'Ton frigo malin & ton menu du jour',
  'Suivi complet de ton cycle & conseils',
  'Sans pub, sans culpabilité',
];

export default function Paywall({ onSubscribe, onLater, onRestore }) {
  const [plan, setPlan] = useState('annual');
  const selected = PLANS[plan];

  return (
    <div
      className="h-[100dvh] overflow-y-auto bg-luna-bg px-5"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto min-h-full flex flex-col"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 2.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)',
        }}
      >
        {/* En-tête */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FDE8EB' }}>
            <Sparkles size={26} style={{ color: '#C4727F' }} />
          </div>
          <h1 className="font-display text-[26px] text-luna-text leading-tight">
            Débloque tout <em className="not-italic" style={{ fontStyle: 'italic', color: '#A85A66' }}>LUNA</em>
          </h1>
          <p className="text-sm font-body text-luna-text-muted mt-2">
            Tout ce qu'il te faut pour vivre ton cycle en douceur.
          </p>
        </div>

        {/* Bénéfices */}
        <div className="space-y-2.5 mb-7">
          {BENEFITS.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EDF5ED' }}>
                <Check size={14} style={{ color: '#4E7A52' }} strokeWidth={2.5} />
              </div>
              <span className="text-sm font-body text-luna-text-body">{b}</span>
            </div>
          ))}
        </div>

        {/* Choix du plan */}
        <div className="space-y-2.5 mb-5">
          {Object.values(PLANS).map((p) => {
            const isActive = plan === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlan(p.id)}
                className="w-full relative rounded-[18px] px-4 py-3.5 text-left transition-all"
                style={{
                  backgroundColor: 'white',
                  border: isActive ? '2px solid #C4727F' : '1.5px solid #E8E0DC',
                  boxShadow: isActive ? '0 6px 18px rgba(196,114,127,0.16)' : 'none',
                }}
              >
                {p.badge && (
                  <span className="absolute -top-2.5 right-4 text-[10px] font-body font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#C4727F' }}>
                    {p.badge}
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: isActive ? '6px solid #C4727F' : '2px solid #D8CEC9' }} />
                    <span className="text-sm font-body font-semibold text-luna-text">{p.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-body font-bold text-luna-text">{p.price}</span>
                    <span className="text-xs font-body text-luna-text-muted">{p.period}</span>
                  </div>
                </div>
                {p.sub && (
                  <p className="text-[11px] font-body text-luna-text-muted mt-1 ml-7.5" style={{ marginLeft: '30px' }}>{p.sub}</p>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* CTA */}
        <button
          onClick={onSubscribe}
          className="btn-luna w-full justify-center text-base py-4"
        >
          Essai gratuit de 3 jours
        </button>
        <p className="text-[11px] font-body text-luna-text-hint text-center mt-2.5">
          Annulable à tout moment · puis {selected.price}{selected.period}
        </p>

        <div className="flex items-center justify-center gap-5 mt-4">
          <button onClick={onLater} className="text-sm font-body font-semibold text-luna-text-muted hover:text-luna-text transition-colors">
            Plus tard
          </button>
          {onRestore && (
            <>
              <span className="text-luna-text-hint">·</span>
              <button onClick={onRestore} className="text-sm font-body text-luna-text-hint hover:text-luna-text-muted transition-colors">
                Restaurer
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
