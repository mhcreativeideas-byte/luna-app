import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEFAULT_COLOR = '#C4727F';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #FFF8F6 0%, #FDE8EB 50%, #F3EEF8 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-[24px] shadow-sm px-8 py-12 max-w-md w-full text-center"
        style={{ boxShadow: '0 4px 24px rgba(196, 114, 127, 0.10)' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          className="text-5xl mb-4"
        >
          🌙
        </motion.div>

        <h1
          className="font-display text-7xl font-bold mb-4"
          style={{ color: DEFAULT_COLOR }}
        >
          404
        </h1>

        <p className="text-lg font-semibold text-gray-800 mb-2">
          Oups, cette page n'existe pas
        </p>

        <p className="text-sm text-gray-500 mb-8">
          La page que tu cherches semble avoir disparu...
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[16px] text-white font-medium transition-transform active:scale-95"
          style={{ backgroundColor: DEFAULT_COLOR }}
        >
          Retour à l'accueil
        </button>
      </motion.div>
    </div>
  );
}
