import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import { subscribeToast } from '../lib/toast';

// Composant monté une seule fois (dans App). Seul lui se re-dessine quand un toast
// apparaît — le reste de l'app n'est pas impacté.
export default function Toaster() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return subscribeToast((t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 2600);
    });
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top) + 14px)',
        left: 0,
        right: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-body text-sm font-semibold"
            style={{
              background: t.type === 'error' ? '#FBE9E7' : '#FFFFFF',
              color: t.type === 'error' ? '#A85A66' : '#2D2226',
              boxShadow: '0 6px 24px rgba(45,34,38,0.14)',
              border: '1px solid rgba(45,34,38,0.06)',
              maxWidth: '90vw',
            }}
          >
            {t.type === 'error' ? (
              <AlertCircle size={16} style={{ color: '#C4727F', flexShrink: 0 }} />
            ) : (
              <Check size={16} style={{ color: '#6B9E76', flexShrink: 0 }} />
            )}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
