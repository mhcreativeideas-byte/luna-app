import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Fenêtre qui monte du bas (bottom sheet), façon iOS.
 * - Fond sombre cliquable pour fermer
 * - Glisser vers le bas pour fermer
 * - Respecte la safe-area de l'iPhone
 */
export default function BottomSheet({ open, onClose, title, children }) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Fond sombre */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* La fenêtre */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 bottom-0 z-[60] bg-luna-bg rounded-t-[28px] flex flex-col"
            style={{ maxHeight: '90vh', boxShadow: '0 -8px 40px rgba(45,34,38,0.20)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 34, stiffness: 330 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {/* Poignée */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(117,101,104,0.28)' }} />
            </div>

            {title && (
              <p className="text-center text-xs font-body font-semibold text-luna-text-hint uppercase tracking-widest pb-1 flex-shrink-0">
                {title}
              </p>
            )}

            <div
              className="overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
