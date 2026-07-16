import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.jsx'

// Suivi des erreurs en production (Sentry) — ne s'active QUE si la clé
// VITE_SENTRY_DSN est renseignée (Vercel pour le web, .env pour les builds
// iPhone), et jamais en développement. Réglé « zéro donnée personnelle » :
// pas de profil utilisateur, pas de cookies, erreurs techniques uniquement.
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  import('@sentry/react').then((Sentry) => {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      sendDefaultPii: false,
      tracesSampleRate: 0,
      beforeSend(event) {
        delete event.user;
        if (event.request) delete event.request.cookies;
        return event;
      },
    });
  }).catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Ressenti natif (iOS) : léger retour haptique au tap sur les éléments interactifs.
// Sur le web, on ne charge même pas le plugin. La barre d'état et le splash sont
// gérés par capacitor.config.json.
if (Capacitor.isNativePlatform()) {
  import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
    document.addEventListener(
      'click',
      (e) => {
        const t = e.target
        if (t instanceof Element && t.closest('button, a, [role="button"], .cursor-pointer')) {
          Haptics.impact({ style: ImpactStyle.Light }).catch(() => {})
        }
      },
      true
    )
  }).catch(() => {})
}

// Service worker désactivé pendant la phase de développement actif :
// il gardait d'anciennes versions en cache et bloquait les mises à jour.
// On désinscrit tout service worker existant + on vide les caches, pour que
// l'app charge toujours la dernière version. (On remettra un SW propre au lancement.)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister())
  })
  if (window.caches) {
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
  }
}
