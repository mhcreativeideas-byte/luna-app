// ============================================================
// luna — Couche native des notifications locales
// ============================================================
// Programme sur iOS le plan calculé par notificationPlan.js.
// Sans effet sur le web (l'app y est de toute façon murée).
// La permission n'est JAMAIS demandée à froid : uniquement via
// requestNotifPermission(), appelée depuis l'écran d'explication
// après l'onboarding (ou depuis les Paramètres).
//
// ⚠️ PIÈGE (corrigé le 2026-07-12) : ne JAMAIS passer l'objet
// LocalNotifications dans un `await` (ex. `await plugin()` où la
// fonction renvoie l'objet). C'est un Proxy Capacitor : `await` lit
// sa propriété `.then`, que le Proxy fabrique comme une pseudo-méthode
// native… qui ne répond jamais. La promesse pend pour toujours, sans
// erreur — les rappels n'ont jamais fonctionné en natif à cause de ça.
// On importe donc le module statiquement et on appelle ses méthodes
// directement : seule la promesse de la MÉTHODE est attendue.
// ============================================================
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { buildNotificationPlan } from './notificationPlan';

const isNative = () => Capacitor.isNativePlatform();

// Permission déjà accordée ? (sans rien déclencher)
export async function hasNotifPermission() {
  if (!isNative()) return false;
  try {
    const { display } = await LocalNotifications.checkPermissions();
    return display === 'granted';
  } catch {
    return false;
  }
}

// Demande la permission (affiche la pop-up iOS). À n'appeler que
// depuis un geste volontaire de l'utilisatrice.
export async function requestNotifPermission() {
  if (!isNative()) return false;
  try {
    const { display } = await LocalNotifications.requestPermissions();
    return display === 'granted';
  } catch {
    return false;
  }
}

// Reprogramme TOUT le plan (annule l'existant puis replanifie).
// Appelée à chaque ouverture / changement de profil : c'est ce qui
// fait vivre la fenêtre glissante et la notification « retrouvailles ».
export async function syncNotifications(profile) {
  if (!isNative()) return;
  try {
    if (!(await hasNotifPermission())) return;

    const { notifications: pending } = await LocalNotifications.getPending();
    if (pending?.length) {
      await LocalNotifications.cancel({ notifications: pending.map((n) => ({ id: n.id })) });
    }

    const plan = buildNotificationPlan(profile);
    if (!plan.length) return;

    await LocalNotifications.schedule({
      notifications: plan.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        schedule: { at: n.at },
        sound: undefined, // son par défaut iOS
      })),
    });
  } catch (e) {
    console.error('Sync notifications error:', e);
  }
}
