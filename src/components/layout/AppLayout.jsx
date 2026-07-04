import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCycle } from '../../contexts/CycleContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

function EmailBanner() {
  const { user } = useCycle();
  const [dismissed, setDismissed] = useState(() => Boolean(localStorage.getItem('luna-email-banner-dismissed')));
  const [justSignedUp] = useState(() => Boolean(localStorage.getItem('luna-email-unverified')));

  // Afficher si l'email n'est pas confirmé OU si on vient de s'inscrire
  const show = !dismissed && (justSignedUp || (user && !user.email_confirmed_at));

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('luna-email-banner-dismissed', 'true');
    localStorage.removeItem('luna-email-unverified');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Mail size={16} className="text-amber-600" />
          </div>
          <p className="text-sm text-amber-800 font-body flex-1">
            Vérifie ta boîte mail, on t'a envoyé un petit mot de bienvenue 💌
          </p>
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="w-11 h-11 -my-2 -mr-3 flex items-center justify-center text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-luna-bg">
      <Sidebar />
      <main className="lg:ml-64 px-4 md:px-6 lg:px-8 max-w-4xl pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-[calc(env(safe-area-inset-bottom)+5rem)] lg:pt-6 lg:pb-6">
        <EmailBanner />
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
