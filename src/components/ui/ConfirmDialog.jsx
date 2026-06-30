import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Fenêtre de confirmation façon iOS (centrée), dans la charte LUNA.
// Remplace les window.confirm() génériques du navigateur.
// danger=true → action rouge (suppression, perte de données).
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  danger = false,
  Icon,
  onConfirm,
  onCancel,
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(45,34,38,0.4)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[300px] bg-luna-bg rounded-[24px] p-6 text-center"
            style={{ boxShadow: '0 16px 44px rgba(45,34,38,0.28)' }}
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          >
            {Icon && (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3.5"
                style={{ backgroundColor: danger ? '#FCEBEB' : '#FDE8EB' }}
              >
                <Icon size={22} style={{ color: danger ? '#D14343' : '#C4727F' }} />
              </div>
            )}
            <h3 className="font-display text-lg text-luna-text mb-1.5">{title}</h3>
            {message && (
              <p className="text-[13px] font-body text-luna-text-muted leading-relaxed mb-5">
                {message}
              </p>
            )}
            <button
              onClick={onConfirm}
              className="w-full rounded-[16px] py-3.5 text-sm font-body font-semibold text-white mb-2 active:scale-[0.98] transition-transform"
              style={{ background: danger ? '#D14343' : 'linear-gradient(135deg, #C4727F, #D4846A)' }}
            >
              {confirmLabel}
            </button>
            <button
              onClick={onCancel}
              className="w-full rounded-[16px] py-3.5 text-sm font-body font-semibold text-luna-text-muted active:scale-[0.98] transition-transform"
              style={{ backgroundColor: '#F0EBE8' }}
            >
              {cancelLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
