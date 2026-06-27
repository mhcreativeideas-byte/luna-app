import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

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
