import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, User, Settings, LogOut } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';
import ConfirmDialog from './ConfirmDialog';

export default function TopMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useCycle();

  return (
    <div className="flex justify-end relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        className="w-11 h-11 rounded-full bg-white border border-gray-100 flex items-center justify-center text-luna-text-muted hover:text-luna-text hover:border-gray-200 transition-all active:scale-95"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <MoreHorizontal size={18} />
      </button>

      <AnimatePresence>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -5 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50 w-52"
            >
              <button
                onClick={() => { setMenuOpen(false); navigate('/profil'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
              >
                <User size={16} className="text-luna-text-muted" />
                Mon profil
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/parametres'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} className="text-luna-text-muted" />
                Paramètres
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setMenuOpen(false); setConfirmLogout(true); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-body text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Se déconnecter
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmLogout}
        title="Te déconnecter ?"
        message="Tu pourras te reconnecter à tout moment."
        confirmLabel="Déconnexion"
        Icon={LogOut}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={async () => { setConfirmLogout(false); await signOut(); }}
      />
    </div>
  );
}
