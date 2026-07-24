import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { BiometricAuth } from '@aparajita/capacitor-biometric-auth';
import { Lock } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';

// Verrouillage de l'app (Face ID / code) — natif seulement, activable dans
// Paramètres → Confidentialité. Deux moments de verrouillage :
// 1. Démarrage à froid (si le réglage était actif dans le cache local).
// 2. Passage en arrière-plan : on verrouille IMMÉDIATEMENT, si bien que
//    l'aperçu du multitâche iOS montre l'écran verrouillé, pas les données.
// ⚠️ Règle Capacitor du projet : jamais d'await sur un objet plugin (Proxy),
// uniquement sur les promesses de ses MÉTHODES — c'est le cas ici.
export default function AppLock() {
  const { appLock } = useCycle();
  const isNative = Capacitor.isNativePlatform();
  const [locked, setLocked] = useState(() => isNative && Boolean(appLock));
  const appLockRef = useRef(appLock);
  const authBusy = useRef(false);

  useEffect(() => {
    appLockRef.current = appLock;
    // Réglage désactivé pendant que l'écran de verrouillage est affiché
    // (cas limite : désactivation depuis un autre appareil) → on libère.
    if (!appLock) setLocked(false);
  }, [appLock]);

  useEffect(() => {
    if (!isNative) return undefined;
    const sub = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive && appLockRef.current) setLocked(true);
    });
    return () => {
      sub.then((handle) => handle.remove()).catch(() => {});
    };
  }, [isNative]);

  const tryUnlock = async () => {
    if (authBusy.current) return;
    authBusy.current = true;
    try {
      await BiometricAuth.authenticate({
        reason: 'Déverrouille luna pour retrouver ton espace',
        cancelTitle: 'Annuler',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Utiliser le code',
      });
      setLocked(false);
    } catch {
      // Refus ou échec : on reste verrouillée, le bouton permet de réessayer.
    } finally {
      authBusy.current = false;
    }
  };

  // Tente le déverrouillage tout seul dès que l'écran apparaît (petite pause
  // pour laisser l'app revenir au premier plan avant la fenêtre Face ID).
  useEffect(() => {
    if (!locked) return undefined;
    const t = setTimeout(tryUnlock, 400);
    return () => clearTimeout(t);
  }, [locked]);

  if (!isNative || !locked) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-8"
      style={{
        background: 'linear-gradient(180deg, #F0C4C9 0%, #EDC4B3 45%, #FAF8F5 100%)',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <p className="font-display text-5xl text-luna-text mb-8">luna</p>
      <div className="w-16 h-16 rounded-full bg-white/70 flex items-center justify-center mb-5 shadow-sm">
        <Lock size={26} className="text-luna-rose-dark" />
      </div>
      <p className="font-body text-[15px] text-luna-text-body text-center mb-10">
        Ton espace est verrouillé.
      </p>
      <button
        onClick={tryUnlock}
        className="btn-luna w-full max-w-xs justify-center text-base py-3.5"
      >
        Déverrouiller
      </button>
    </div>
  );
}
