import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';

const goalOptions = [
  { id: 'sport', label: 'Adapter mon sport', icon: '🏃‍♀️' },
  { id: 'food', label: 'Mieux manger', icon: '🥗' },
  { id: 'sleep', label: 'Mieux dormir', icon: '😴' },
  { id: 'emotions', label: 'Gérer mes émotions', icon: '🧠' },
  { id: 'discomfort', label: 'Moins de douleurs', icon: '🌸' },
  { id: 'energy', label: 'Plus d\'énergie', icon: '⚡' },
  { id: 'skin', label: 'Soigner ma peau', icon: '✨' },
  { id: 'strength', label: 'Me sentir forte', icon: '💪' },
];

const dietOptions = [
  { id: 'Omnivore', icon: '🍽️' },
  { id: 'Végétarienne', icon: '🥬' },
  { id: 'Végane', icon: '🌱' },
  { id: 'Sans gluten', icon: '🌾' },
  { id: 'Sans lactose', icon: '🥛' },
];

const healthOptions = [
  { id: 'SPM sévère', icon: '😣', desc: 'Douleurs, fatigue, irritabilité avant les règles' },
  { id: 'Endométriose', icon: '🩺', desc: 'Diagnostiquée ou suspectée' },
  { id: 'SOPK', icon: '🔬', desc: 'Syndrome des ovaires polykystiques' },
  { id: 'Cycles irréguliers', icon: '📅', desc: 'Cycles de durée variable' },
];

const allergyOptions = [
  { id: 'Fruits à coque', icon: '🥜' },
  { id: 'Arachides', icon: '🫘' },
  { id: 'Soja', icon: '🫛' },
  { id: 'Œufs', icon: '🥚' },
  { id: 'Poisson', icon: '🐟' },
  { id: 'Crustacés', icon: '🦐' },
  { id: 'Lait', icon: '🥛' },
  { id: 'Blé', icon: '🌾' },
  { id: 'Sésame', icon: '🌿' },
  { id: 'Céleri', icon: '🥬' },
  { id: 'Moutarde', icon: '🟡' },
  { id: 'Sulfites', icon: '🍷' },
];

const cookingLevelOptions = [
  { id: 'debutant', label: 'Débutant(e)', desc: 'Recettes simples et rapides', icon: '🌱' },
  { id: 'intermediaire', label: 'Intermédiaire', desc: 'À l\'aise en cuisine', icon: '🌿' },
  { id: 'avance', label: 'Avancé(e)', desc: 'J\'adore cuisiner !', icon: '👩‍🍳' },
];

const cookingTimeOptions = [
  { id: '15min', label: '15 min', desc: 'Express', icon: '⚡' },
  { id: '30min', label: '30 min', desc: 'Rapide', icon: '🕐' },
  { id: '45min', label: '45 min', desc: 'Tranquille', icon: '🍳' },
  { id: '60min+', label: '1h+', desc: 'J\'ai le temps', icon: '👩‍🍳' },
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
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
          checked ? 'bg-luna-rose' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
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
  const { name, cycleLength, periodLength, notifications, goals, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime, dispatch, signOut, user } = useCycle();
  const [showGoals, setShowGoals] = useState(false);
  const [editedGoals, setEditedGoals] = useState(goals || []);
  const [showDiet, setShowDiet] = useState(false);
  const [editedDiet, setEditedDiet] = useState(dietPreferences || ['Omnivore']);
  const [showHealth, setShowHealth] = useState(false);
  const [editedHealth, setEditedHealth] = useState(healthIssues || []);
  const [showAllergies, setShowAllergies] = useState(false);
  const [editedAllergies, setEditedAllergies] = useState(allergies || []);
  const [showCooking, setShowCooking] = useState(false);
  const [editedCookingLevel, setEditedCookingLevel] = useState(cookingLevel || '');
  const [editedCookingTime, setEditedCookingTime] = useState(cookingTime || '');

  const toggleGoal = (id) => {
    setEditedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleDiet = (id) => {
    setEditedDiet(prev => {
      if (id === 'Omnivore') return ['Omnivore'];
      const without = prev.filter(d => d !== 'Omnivore');
      if (without.includes(id)) {
        const result = without.filter(d => d !== id);
        return result.length === 0 ? ['Omnivore'] : result;
      }
      return [...without, id];
    });
  };

  const toggleHealth = (id) => {
    setEditedHealth(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  const saveGoals = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { goals: editedGoals } });
    setShowGoals(false);
  };

  const saveDiet = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { dietPreferences: editedDiet } });
    setShowDiet(false);
  };

  const saveHealth = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { healthIssues: editedHealth } });
    setShowHealth(false);
  };

  const toggleAllergy = (id) => {
    setEditedAllergies(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const saveAllergies = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { allergies: editedAllergies } });
    setShowAllergies(false);
  };

  const saveCooking = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { cookingLevel: editedCookingLevel, cookingTime: editedCookingTime } });
    setShowCooking(false);
  };

  const [showCycleLength, setShowCycleLength] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [editedCycleLength, setEditedCycleLength] = useState(cycleLength || 28);
  const [editedPeriodLength, setEditedPeriodLength] = useState(periodLength || 5);

  const saveCycleLength = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { cycleLength: editedCycleLength } });
    setShowCycleLength(false);
  };

  const savePeriodLength = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { periodLength: editedPeriodLength } });
    setShowPeriodLength(false);
  };

  const dietLabel = (dietPreferences || ['Omnivore']).join(', ');
  const healthLabel = (healthIssues || []).length > 0 ? `${healthIssues.length} sélectionné${healthIssues.length > 1 ? 's' : ''}` : 'Aucun';

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
        <h1 className="font-display text-xl text-luna-text">Paramètres</h1>
      </div>

      <Section title="Profil">
        <SettingRow label="Nom" value={name} />
        <SettingRow label="Objectifs" value={`${goals?.length || 0} sélectionnés`} onClick={() => { setEditedGoals(goals || []); setShowGoals(true); }} />
        <SettingRow label="Alimentation" value={dietLabel} onClick={() => { setEditedDiet(dietPreferences || ['Omnivore']); setShowDiet(true); }} />
        <SettingRow label="Santé hormonale" value={healthLabel} onClick={() => { setEditedHealth(healthIssues || []); setShowHealth(true); }} />
        <SettingRow label="Allergies" value={(allergies || []).length > 0 ? `${allergies.length} allergie${allergies.length > 1 ? 's' : ''}` : 'Aucune'} onClick={() => { setEditedAllergies(allergies || []); setShowAllergies(true); }} />
        <SettingRow label="Cuisine" value={[cookingLevelOptions.find(o => o.id === cookingLevel)?.label, cookingTimeOptions.find(o => o.id === cookingTime)?.label].filter(Boolean).join(' · ') || 'Non défini'} onClick={() => { setEditedCookingLevel(cookingLevel || ''); setEditedCookingTime(cookingTime || ''); setShowCooking(true); }} />
      </Section>

      <Section title="Cycle">
        <SettingRow label="Durée du cycle" value={`${cycleLength} jours`} onClick={() => { setEditedCycleLength(cycleLength || 28); setShowCycleLength(true); }} />
        <SettingRow label="Durée des règles" value={`${periodLength} jours`} onClick={() => { setEditedPeriodLength(periodLength || 5); setShowPeriodLength(true); }} />
        <SettingRow
          label="Réinitialiser le calendrier"
          onClick={() => {
            if (window.confirm('Repartir de zéro ? Tes données seront perdues.')) {
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
        <SettingRow label="Langue" value="Français" />
      </Section>

      <Section title="Réseaux sociaux">
        <SettingRow label="Instagram" value="@luna.wellness" onClick={() => window.open('https://www.instagram.com/luna.wellness', '_blank')} />
      </Section>

      <Section title="Communauté">
        <SettingRow label="Partage tes commentaires" />
        <SettingRow label="Signaler un bug" />
        <SettingRow label="Demander une fonctionnalité" />
        <SettingRow label="Contacte-nous" />
      </Section>

      <Section title="Légal">
        <SettingRow label="Conditions générales" />
        <SettingRow label="Politique de confidentialité" />
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
            Connectée en tant que {user.email}
          </p>
        )}
        <button
          onClick={async () => {
            if (window.confirm('Te déconnecter de LUNA ?')) {
              await signOut();
              navigate('/');
            }
          }}
          className="w-full text-center py-3 text-sm font-body text-luna-text-hint hover:text-luna-text-muted transition-colors"
        >
          Déconnexion
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
                Sélectionne ou retire des objectifs selon tes besoins.
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

      {/* Diet Modal */}
      <AnimatePresence>
        {showDiet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowDiet(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Mon alimentation</h3>
                <button
                  onClick={() => setShowDiet(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-luna-text-muted font-body mb-4">
                Modifie tes préférences alimentaires. Tes recommandations s'adapteront automatiquement.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {dietOptions.map(({ id, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDiet(id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full text-sm font-body font-semibold transition-all border-2 ${
                      editedDiet.includes(id)
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-green-200'
                    }`}
                  >
                    <span>{icon}</span>
                    {id}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={saveDiet}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Modal */}
      <AnimatePresence>
        {showHealth && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowHealth(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Santé hormonale</h3>
                <button
                  onClick={() => setShowHealth(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-luna-text-muted font-body mb-4">
                Indique tes soucis hormonaux pour des conseils personnalisés. Tu peux tout désélectionner si aucun ne te concerne.
              </p>

              <div className="space-y-2 mb-6">
                {healthOptions.map(({ id, icon, desc }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleHealth(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                      editedHealth.includes(id)
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-100 bg-white hover:border-purple-200'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className={`text-sm font-body font-semibold ${editedHealth.includes(id) ? 'text-purple-700' : 'text-luna-text-body'}`}>
                        {id}
                      </p>
                      <p className="text-xs font-body text-luna-text-muted">{desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <button
                onClick={saveHealth}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Allergies Modal */}
      <AnimatePresence>
        {showAllergies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowAllergies(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Mes allergies</h3>
                <button
                  onClick={() => setShowAllergies(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-sm text-luna-text-muted font-body mb-4">
                Sélectionne tes allergies pour filtrer les recettes automatiquement.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {allergyOptions.map(({ id, icon }) => (
                  <motion.button
                    key={id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAllergy(id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-body font-semibold transition-all border-2 ${
                      editedAllergies.includes(id)
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-red-200'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    {id}
                  </motion.button>
                ))}
              </div>

              <button
                onClick={saveAllergies}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cooking Modal */}
      <AnimatePresence>
        {showCooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCooking(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">En cuisine</h3>
                <button
                  onClick={() => setShowCooking(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Niveau en cuisine
                  </label>
                  <div className="space-y-2">
                    {cookingLevelOptions.map(({ id, label, desc, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditedCookingLevel(id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-left transition-all border-2 ${
                          editedCookingLevel === id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-100 bg-white hover:border-orange-200'
                        }`}
                      >
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="text-sm font-body font-semibold text-luna-text">{label}</p>
                          <p className="text-xs font-body text-luna-text-muted">{desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-luna-text-hint mb-2 font-body uppercase tracking-wider">
                    Temps de cuisine idéal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cookingTimeOptions.map(({ id, label, desc, icon }) => (
                      <motion.button
                        key={id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setEditedCookingTime(id)}
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-[16px] text-center transition-all border-2 ${
                          editedCookingTime === id
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-100 bg-white hover:border-orange-200'
                        }`}
                      >
                        <span className="text-xl">{icon}</span>
                        <p className="text-sm font-semibold text-luna-text font-body">{label}</p>
                        <p className="text-[10px] text-luna-text-muted font-body">{desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={saveCooking}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cycle Length Modal */}
      <AnimatePresence>
        {showCycleLength && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCycleLength(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Durée du cycle</h3>
                <button
                  onClick={() => setShowCycleLength(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditedCycleLength(prev => Math.max(20, prev - 1))}
                    className="w-10 h-10 rounded-full bg-luna-cream flex items-center justify-center text-luna-text font-bold text-lg hover:bg-luna-sage/30 transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-display text-luna-text">{editedCycleLength}</span>
                    <span className="text-sm text-luna-text-muted font-body ml-1">jours</span>
                  </div>
                  <button
                    onClick={() => setEditedCycleLength(prev => Math.min(45, prev + 1))}
                    className="w-10 h-10 rounded-full bg-luna-cream flex items-center justify-center text-luna-text font-bold text-lg hover:bg-luna-sage/30 transition-colors"
                  >
                    +
                  </button>
                </div>
                <input
                  type="range"
                  min={20}
                  max={45}
                  value={editedCycleLength}
                  onChange={(e) => setEditedCycleLength(Number(e.target.value))}
                  className="w-full mt-3 accent-luna-rose"
                />
              </div>

              <button
                onClick={saveCycleLength}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Period Length Modal */}
      <AnimatePresence>
        {showPeriodLength && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPeriodLength(false); }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-[24px] w-full max-w-md p-6"
              style={{ boxShadow: '0 8px 40px rgba(45, 34, 38, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-luna-text">Durée des règles</h3>
                <button
                  onClick={() => setShowPeriodLength(false)}
                  className="w-8 h-8 rounded-full bg-luna-cream flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setEditedPeriodLength(prev => Math.max(2, prev - 1))}
                    className="w-10 h-10 rounded-full bg-luna-cream flex items-center justify-center text-luna-text font-bold text-lg hover:bg-luna-sage/30 transition-colors"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-display text-luna-text">{editedPeriodLength}</span>
                    <span className="text-sm text-luna-text-muted font-body ml-1">jours</span>
                  </div>
                  <button
                    onClick={() => setEditedPeriodLength(prev => Math.min(10, prev + 1))}
                    className="w-10 h-10 rounded-full bg-luna-cream flex items-center justify-center text-luna-text font-bold text-lg hover:bg-luna-sage/30 transition-colors"
                  >
                    +
                  </button>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={editedPeriodLength}
                  onChange={(e) => setEditedPeriodLength(Number(e.target.value))}
                  className="w-full mt-3 accent-luna-rose"
                />
              </div>

              <button
                onClick={savePeriodLength}
                className="btn-luna w-full justify-center text-base py-3.5"
              >
                Enregistrer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
