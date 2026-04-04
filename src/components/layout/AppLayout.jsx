import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCycle } from '../../contexts/CycleContext';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

function EmailBanner() {
  const { user } = useCycle();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Afficher si l'email n'est pas confirmé OU si on vient de s'inscrire
    const justSignedUp = localStorage.getItem('luna_email_unverified');
    const dismissed = localStorage.getItem('luna_email_banner_dismissed');
    const emailNotConfirmed = user && !user.email_confirmed_at;

    if ((justSignedUp || emailNotConfirmed) && !dismissed) {
      setShow(true);
    }
  }, [user]);

  const dismiss = () => {
    setShow(false);
    localStorage.setItem('luna_email_banner_dismissed', 'true');
    localStorage.removeItem('luna_email_unverified');
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
            className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"
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
      <main className="lg:ml-64 pb-20 lg:pb-6 px-4 md:px-6 lg:px-8 pt-6 max-w-4xl">
        <EmailBanner />
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
