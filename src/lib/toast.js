// Mini système de notifications isolé (pas de Context global → aucun re-render de l'app).
// Usage : import { toast } from '../lib/toast';  toast('Enregistré ✓');  toast('Erreur', 'error');

let listeners = [];
let counter = 0;

export function toast(message, type = 'success') {
  const id = ++counter;
  listeners.forEach((l) => l({ id, message, type }));
  return id;
}

export function subscribeToast(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
