import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';

const goalOptions = [
  { id: 'sport', label: 'Adapter mon sport', icon: '🏃‍♀️' },
  { id: 'food', label: 'Mieux manger', icon: '🥗' },
  { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
  { id: 'emotions', label: 'Gerer mes emotions', icon: '🧠' },
  { id: 'discomfort', label: 'Moins de douleurs', icon: '🌸' },
  { id: 'energy', label: 'Plus d\'energie', icon: '⚡' },
  { id: 'skin', label: 'Soigner ma peau', icon: '✨' },
  { id: 'strength', label: 'Me sentir forte', icon: '💪' },
];

function SettingRow({ label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 text-sm font-body transition-colors ${
        danger ? 'text-red-400' : 'text-luna-text-body'
      } hover:bg-luna-cream/50`}
    >
      <span>{label}</span>
      <div className="flex items-center gap-2 text-luna-text-hint">
        {value && <span className="text-xs">{value}</span>}
        {onClick && <ChevronRight size={16} />}
      </div>
    </button>
  );
}

function SettingToggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <span className="text-sm font-body text-luna-text-body">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          checked ? 'bg-luna-rose' : 'bg-luna-sage/50'
        }`}
      >
        <span
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform"
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(4px)' }}
        />
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest px-5 mb-2">
        {title}
      </p>
      <div className="bg-white rounded-[20px] divide-y divide-gray-50" style={{ boxShadow: '0 2px 16px rgba(45, 34, 38, 0.04)' }}>
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { name, cycleLength, periodLength, notifications, goals, dispatch, signOut, user } = useCycle();
  const [showGoals, setShowGoals] = useState(false);
  const [editedGoals, setEditedGoals] = useState(goals || []);

  const toggleGoal = (id) => {
    setEditedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const saveGoals = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { goals: editedGoals } });
    setShowGoals(false);
  };

  return (
    <div className="space-y-2 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="font-display text-xl text-luna-text">Parametres</h1>
      </div>

      <Section title="Profil">
        <SettingRow label="Nom" value={name} />
        <SettingRow label="Objectifs" value={`${goals?.length || 0} selectionnes`} onClick={() => { setEditedGoals(goals || []); setShowGoals(true); }} />
      </Section>

      <Section title="Cycle">
        <SettingRow label="Duree du cycle" value={`${cycleLength} jours`} />
        <SettingRow label="Duree des regles" value={`${periodLength} jours`} />
        <SettingToggle
          label="Suivi intelligent"
          checked={false}
          onChange={() => {}}
        />
        <SettingRow
          label="Reinitialiser le calendrier"
          onClick={() => {
            if (window.confirm('Repartir de zero ? Tes donnees seront perdues.')) {
              dispatch({ type: 'RESET' });
              localStorage.removeItem('luna-profile');
              window.location.href = '/';
            }
          }}
        />
      </Section>

      <Section title="App">
        <SettingToggle
          label="Notifications"
          checked={notifications}
          onChange={(val) => dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: val } })}
        />
        <SettingRow label="Langue" value="Francais" />
      </Section>

      <Section title="Communaute">
        <SettingRow label="Partage tes commentaires" />
        <SettingRow label="Signaler un bug" />
        <SettingRow label="Demander une fonctionnalite" />
        <SettingRow label="Contacte-nous" />
      </Section>

      <Section title="Legal">
        <SettingRow label="Conditions generales" />
        <SettingRow label="Politique de confidentialite" />
      </Section>

      <Section title="Zone sensible">
        <SettingRow
          label="Réinitialiser le profil"
          danger
          onClick={() => {
            if (window.confirm('Réinitialiser ton profil LUNA ? Toutes tes données seront perdues.')) {
              dispatch({ type: 'RESET' });
              localStorage.removeItem('luna-profile');
              window.location.href = '/';
            }
          }}
        />
        <SettingRow
          label="Supprimer le compte"
          danger
          onClick={() => {
            if (window.confirm('Supprimer définitivement ton compte ? Cette action est irréversible.')) {
              dispatch({ type: 'RESET' });
              localStorage.removeItem('luna-profile');
              window.location.href = '/';
            }
          }}
        />
      </Section>

      <div className="pt-2 space-y-2">
        {user && (
          <p className="text-center text-xs text-luna-text-hint font-body mb-2">
            Connectee en tant que {user.email}
          </p>
        )}
        <button
          onClick={async () => {
            if (window.confirm('Te deconnecter de LUNA ?')) {
              await signOut();
              navigate('/');
            }
          }}
          className="w-full text-center py-3 text-sm font-body text-luna-text-hint hover:text-luna-text-muted transition-colors"
        >
          Deconnexion
        </button>
        <p className="text-center text-xs text-luna-text-hint font-body mt-4">
          LUNA v3.0.0
        </p>
      </div>

      {/* Goals Modal */}
      <AnimatePresence>
        {showGoals && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowGoals(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Mes objectifs</h3>
                <button
                  onClick={() => setShowGoals(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-luna-text-muted font-body mb-4">
                Selectionne ou retire des objectifs selon tes besoins.
              </p>

              {/* Goal chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {goalOptions.map(({ id, label, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleGoal(id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full text-sm font-body font-semibold transition-all border-2 ${
                      editedGoals.includes(id)
                        ? 'border-orange-300 bg-orange-50 text-orange-700'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-orange-200'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </motion.button>
                ))}
              </div>

              {/* Save button */}
              <button
                onClick={saveGoals}
                disabled={editedGoals.length === 0}
                className="btn-luna w-full justify-center text-base py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enregistrer ({editedGoals.length} objectif{editedGoals.length > 1 ? 's' : ''})
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
