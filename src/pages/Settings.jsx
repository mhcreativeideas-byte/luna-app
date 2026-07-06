import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, LogOut, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import BottomSheet from '../components/ui/BottomSheet';
import { Capacitor } from '@capacitor/core';
import { useCycle } from '../contexts/CycleContext';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import { restorePurchases } from '../lib/purchases';
import BackButton from '../components/ui/BackButton';

const goalOptions = [
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
      <div className="bg-white rounded-[22px] divide-y divide-gray-50" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const { name, cycleLength, periodLength, notifications, goals, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime, dispatch, signOut, user } = useCycle();

  const [confirm, setConfirm] = useState(null);

  // Gérer / résilier : Apple impose que ça se fasse dans les Réglages iOS.
  // On ouvre simplement la page « Abonnements » du compte Apple.
  const openManageSubscription = () => {
    const url = Capacitor.isNativePlatform()
      ? 'itms-apps://apps.apple.com/account/subscriptions'
      : 'https://apps.apple.com/account/subscriptions';
    window.open(url, '_blank');
  };

  // « Restaurer mes achats » : obligatoire pour Apple (nouvel iPhone, réinstall).
  const handleRestore = async () => {
    const res = await restorePurchases();
    if (res.ok) toast('Ton abonnement a été restauré 💛', 'success');
    else if (res.none) toast('Aucun achat à restaurer pour le moment.', 'info');
    else toast('Restauration impossible : ' + (res.error || 'réessaie plus tard'), 'error');
  };

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
    toast('Objectifs enregistrés ✓');
  };

  const saveDiet = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { dietPreferences: editedDiet } });
    setShowDiet(false);
    toast('Régime enregistré ✓');
  };

  const saveHealth = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { healthIssues: editedHealth } });
    setShowHealth(false);
    toast('Enregistré ✓');
  };

  const toggleAllergy = (id) => {
    setEditedAllergies(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const saveAllergies = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { allergies: editedAllergies } });
    setShowAllergies(false);
    toast('Allergies enregistrées ✓');
  };

  const saveCooking = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { cookingLevel: editedCookingLevel, cookingTime: editedCookingTime } });
    setShowCooking(false);
    toast('Préférences enregistrées ✓');
  };

  const [showCycleLength, setShowCycleLength] = useState(false);
  const [showPeriodLength, setShowPeriodLength] = useState(false);
  const [editedCycleLength, setEditedCycleLength] = useState(cycleLength || 28);
  const [editedPeriodLength, setEditedPeriodLength] = useState(periodLength || 5);

  const saveCycleLength = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { cycleLength: editedCycleLength } });
    setShowCycleLength(false);
    toast('Durée du cycle enregistrée ✓');
  };

  const savePeriodLength = () => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { periodLength: editedPeriodLength } });
    setShowPeriodLength(false);
    toast('Durée des règles enregistrée ✓');
  };

  const dietLabel = (dietPreferences || ['Omnivore']).join(', ');
  const healthLabel = (healthIssues || []).length > 0 ? `${healthIssues.length} sélectionné${healthIssues.length > 1 ? 's' : ''}` : 'Aucun';

  return (
    <div className="space-y-2 pb-6">
      {/* Header */}
      <div className="mb-6">
        <BackButton />
        <h1 className="font-display text-2xl text-luna-text">Paramètres</h1>
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
          onClick={() => setConfirm({
            title: 'Réinitialiser le calendrier ?',
            message: 'Tu repars de zéro. Tes données de cycle seront perdues.',
            confirmLabel: 'Réinitialiser',
            Icon: RotateCcw,
            action: () => {
              dispatch({ type: 'RESET' });
              localStorage.removeItem('luna-profile');
              window.location.href = '/';
            },
          })}
        />
      </Section>

      <Section title="Abonnement">
        <SettingRow label="Gérer mon abonnement" onClick={openManageSubscription} />
        <SettingRow label="Restaurer mes achats" onClick={handleRestore} />
      </Section>

      <Section title="Notifications">
        <SettingToggle
          label="Activer les notifications"
          checked={notifications}
          onChange={(val) => dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: val } })}
        />
      </Section>

      <Section title="App">
        <SettingRow label="Langue" value="Français" />
      </Section>

      <Section title="Réseaux sociaux">
        <SettingRow label="Instagram" value="@luna.cyclesfood" onClick={() => window.open('https://www.instagram.com/luna.cyclesfood', '_blank')} />
      </Section>

      <Section title="Communauté">
        <SettingRow label="Partage tes commentaires" onClick={() => window.location.href = 'mailto:hello@lunawellness.app?subject=Commentaire luna'} />
        <SettingRow label="Signaler un bug" onClick={() => window.location.href = 'mailto:hello@lunawellness.app?subject=Bug luna'} />
        <SettingRow label="Demander une fonctionnalité" onClick={() => window.location.href = 'mailto:hello@lunawellness.app?subject=Suggestion luna'} />
        <SettingRow label="Contacte-nous" onClick={() => window.location.href = 'mailto:hello@lunawellness.app?subject=Contact luna'} />
      </Section>

      <Section title="Légal">
        <SettingRow label="Conditions générales" onClick={() => navigate('/conditions')} />
        <SettingRow label="Politique de confidentialité" onClick={() => navigate('/confidentialite')} />
      </Section>

      <Section title="Zone sensible">
        <SettingRow
          label="Réinitialiser le profil"
          danger
          onClick={() => setConfirm({
            title: 'Réinitialiser ton profil ?',
            message: 'Tu devras refaire l\'onboarding. Tes données seront effacées.',
            confirmLabel: 'Réinitialiser le profil',
            danger: true,
            Icon: RotateCcw,
            action: async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  await Promise.all([
                    supabase.from('users').delete().eq('auth_id', user.id),
                    supabase.from('user_tracking').delete().eq('auth_id', user.id),
                    supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`]),
                  ]);
                }
                dispatch({ type: 'RESET' });
                localStorage.removeItem('luna-profile');
                window.location.href = '/onboarding';
              } catch (err) {
                toast('Erreur : ' + err.message, 'error');
              }
            },
          })}
        />
        <SettingRow
          label="Supprimer le compte"
          danger
          onClick={() => setConfirm({
            title: 'Supprimer le compte ?',
            message: 'Cette action est définitive. Toutes tes données seront perdues.',
            confirmLabel: 'Supprimer définitivement',
            danger: true,
            Icon: Trash2,
            action: async () => {
              try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  await Promise.all([
                    supabase.from('user_tracking').delete().eq('auth_id', user.id),
                    supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`]),
                  ]);
                  await supabase.rpc('delete_user_completely', { user_auth_id: user.id });
                }
                dispatch({ type: 'RESET' });
                localStorage.clear();
                await supabase.auth.signOut();
                window.location.href = '/';
              } catch (err) {
                toast('Erreur : ' + err.message, 'error');
              }
            },
          })}
        />
      </Section>

      <div className="pt-2 space-y-2">
        {user && (
          <p className="text-center text-xs text-luna-text-hint font-body mb-2">
            Connectée en tant que {user.email}
          </p>
        )}
        <button
          onClick={() => setConfirm({
            title: 'Te déconnecter ?',
            message: 'Tu pourras te reconnecter à tout moment.',
            confirmLabel: 'Déconnexion',
            Icon: LogOut,
            action: async () => {
              await signOut();
              navigate('/');
            },
          })}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-[22px] bg-white text-sm font-body font-semibold text-luna-rose active:scale-[0.99] transition-all"
          style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}
        >
          <LogOut size={16} />
          Déconnexion
        </button>
        <p className="text-center text-xs text-luna-text-hint font-body mt-4">
          luna v3.0.0
        </p>
      </div>

      {/* Fenêtre de confirmation (remplace window.confirm) */}
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        danger={confirm?.danger}
        Icon={confirm?.Icon}
        onCancel={() => setConfirm(null)}
        onConfirm={() => { const a = confirm?.action; setConfirm(null); a?.(); }}
      />

      {/* Goals Modal */}
      <BottomSheet open={showGoals} onClose={() => setShowGoals(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Mes objectifs</h3>

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
                        ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-luna-rose-light'
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
      </BottomSheet>

      {/* Diet Modal */}
      <BottomSheet open={showDiet} onClose={() => setShowDiet(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Mon alimentation</h3>

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
                        ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-luna-rose-light'
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
      </BottomSheet>

      {/* Health Modal */}
      <BottomSheet open={showHealth} onClose={() => setShowHealth(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Santé hormonale</h3>

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
                        ? 'border-luna-rose bg-luna-rose-bg'
                        : 'border-gray-100 bg-white hover:border-luna-rose-light'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className={`text-sm font-body font-semibold ${editedHealth.includes(id) ? 'text-luna-rose-deep' : 'text-luna-text-body'}`}>
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
      </BottomSheet>

      {/* Allergies Modal */}
      <BottomSheet open={showAllergies} onClose={() => setShowAllergies(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Mes allergies</h3>

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
                        ? 'border-luna-rose bg-luna-rose-bg text-luna-rose-deep'
                        : 'border-gray-100 bg-white text-luna-text-muted hover:border-luna-rose-light'
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
      </BottomSheet>

      {/* Cooking Modal */}
      <BottomSheet open={showCooking} onClose={() => setShowCooking(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">En cuisine</h3>

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
                            ? 'border-luna-rose bg-luna-rose-bg'
                            : 'border-gray-100 bg-white hover:border-luna-rose-light'
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
                            ? 'border-luna-rose bg-luna-rose-bg'
                            : 'border-gray-100 bg-white hover:border-luna-rose-light'
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
      </BottomSheet>

      {/* Cycle Length Modal */}
      <BottomSheet open={showCycleLength} onClose={() => setShowCycleLength(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Durée du cycle</h3>

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
      </BottomSheet>

      {/* Period Length Modal */}
      <BottomSheet open={showPeriodLength} onClose={() => setShowPeriodLength(false)}>
        <h3 className="font-display text-lg text-luna-text mb-4">Durée des règles</h3>

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
      </BottomSheet>
    </div>
  );
}
