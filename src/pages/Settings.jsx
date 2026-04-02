import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';

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
  const { name, cycleLength, periodLength, notifications, goals, dispatch } = useCycle();

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
        <SettingRow label="Objectifs" value={`${goals?.length || 0} selectionnes`} />
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
        <button
          onClick={() => {
            if (window.confirm('Te déconnecter de LUNA ?')) {
              window.location.href = '/';
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
    </div>
  );
}
