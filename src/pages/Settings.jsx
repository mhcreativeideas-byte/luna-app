import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';

function SettingRow({ label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 text-sm font-body transition-colors ${
        danger ? 'text-red-500' : 'text-luna-text-body'
      } hover:bg-luna-cream-card/50`}
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
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm font-body text-luna-text-body">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-luna-orange' : 'bg-luna-sage/50'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5.5 left-0.5' : 'left-0.5'
          }`}
          style={{ transform: checked ? 'translateX(22px)' : 'translateX(0)' }}
        />
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-accent font-bold text-luna-text-hint uppercase tracking-wider px-4 mb-1">
        {title}
      </p>
      <div className="bg-luna-cream-light rounded-luna divide-y divide-luna-sage/10">
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
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-luna-text-muted hover:text-luna-text">
          <ChevronLeft size={24} />
        </button>
        <h1 className="section-title text-xl">PARAMÈTRES</h1>
      </div>

      <Section title="Profil">
        <SettingRow label="Nom" value={name} />
        <SettingRow label="Objectifs" value={`${goals?.length || 0} sélectionnés`} />
      </Section>

      <Section title="Cycle">
        <SettingRow label="Durée du cycle" value={`${cycleLength} jours`} />
        <SettingRow label="Durée des règles" value={`${periodLength} jours`} />
        <SettingToggle
          label="Suivi intelligent"
          checked={false}
          onChange={() => {}}
        />
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

      <div className="pt-4">
        <button className="w-full text-center py-3 text-sm font-body text-luna-text-hint">
          Déconnexion
        </button>
        <button
          onClick={() => {
            if (window.confirm('Supprimer définitivement ton compte ? Cette action est irréversible.')) {
              dispatch({ type: 'RESET' });
              localStorage.removeItem('luna-profile');
              window.location.href = '/';
            }
          }}
          className="w-full text-center py-3 text-sm font-body text-red-400"
        >
          Supprimer le compte
        </button>
        <p className="text-center text-xs text-luna-text-hint font-accent mt-4">
          LUNA v2.0.0
        </p>
      </div>
    </div>
  );
}
