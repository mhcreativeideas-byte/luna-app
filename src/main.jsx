import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import './index.css'
import App from './App.jsx'

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
