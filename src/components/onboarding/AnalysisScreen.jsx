import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check } from 'lucide-react';

// Écran d'analyse de l'onboarding (le « moment magique » avant la révélation).
// Mix A+B validé par Margaux : l'anneau signature de luna se remplit (0→100 %)
// pendant que SES vraies réponses s'allument une par une. Durée ~2,6 s, calée
// sur startAnalysis() dans Onboarding.jsx.
const DURATION = 2.6;
const EASE = [0.4, 0, 0.2, 1];
const R = 42;
const C = 2 * Math.PI * R;

export default function AnalysisScreen({ name, chips }) {
  const pct = useMotionValue(0);
  const label = useTransform(pct, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    const controls = animate(pct, 100, { duration: DURATION, ease: EASE });
    return () => controls.stop();
  }, [pct]);

  return (
    <div
      className="h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-8"
      style={{
        background: 'linear-gradient(180deg, #FDE8EB 0%, #FAF7F5 46%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Anneau signature qui se remplit */}
      <div className="relative" style={{ width: 168, height: 168, marginBottom: 26 }}>
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="analysisRing" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8A5AE" />
              <stop offset="50%" stopColor="#C4727F" />
              <stop offset="100%" stopColor="#B09ACB" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={R} fill="none" stroke="#EFE4E6" strokeWidth="6" />
          <motion.circle
            cx="50" cy="50" r={R} fill="none"
            stroke="url(#analysisRing)" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: DURATION, ease: EASE }}
          />
        </svg>

        {/* Point lumineux en tête de l'anneau */}
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: DURATION, ease: EASE }}
        >
          <div style={{ position: 'absolute', top: 5, left: '50%', width: 12, height: 12, marginLeft: -6, borderRadius: '50%', background: '#fff', border: '2.5px solid #C4727F', boxShadow: '0 0 10px rgba(196,114,127,0.5)' }} />
        </motion.div>

        {/* Pourcentage animé au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="font-display font-bold leading-none" style={{ fontSize: '2rem', color: '#A85A66' }}>
            {label}
          </motion.span>
          <span style={{ fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A99CA0', marginTop: 3 }}>
            analyse
          </span>
        </div>
      </div>

      {/* Titre personnalisé */}
      <h1 className="font-display text-[20px] text-luna-text text-center leading-tight mb-6">
        On construit ton programme,{' '}
        <em className="not-italic" style={{ fontStyle: 'italic', color: '#A85A66' }}>{name || 'à toi'}.</em>
      </h1>

      {/* Les vraies réponses qui s'allument une par une */}
      <div className="w-full max-w-[280px] space-y-2.5">
        {chips.map((c, i) => {
          const delay = 0.35 + i * 0.5;
          return (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.4 }}
              className="flex items-center gap-3 bg-white rounded-[14px] px-3.5 py-2.5"
              style={{ boxShadow: '0 3px 14px rgba(45,34,38,0.05)' }}
            >
              <span className="text-[15px] flex-shrink-0">{c.icon}</span>
              <span className="flex-1 text-[12.5px] font-body font-medium text-luna-text leading-tight">{c.label}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 0.25, type: 'spring', stiffness: 400, damping: 14 }}
                className="flex-shrink-0"
              >
                <Check size={15} style={{ color: '#7BAE7F' }} />
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
