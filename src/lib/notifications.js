// ============================================================
// luna — Couche native des notifications locales
// ============================================================
// Programme sur iOS le plan calculé par notificationPlan.js.
// Sans effet sur le web (l'app y est de toute façon murée).
// La permission n'est JAMAIS demandée à froid : uniquement via
// requestNotifPermission(), appelée depuis l'écran d'explication
// après l'onboarding (ou depuis les Paramètres).
// ============================================================
import { Capacitor } from '@capacitor/core';
import { buildNotificationPlan } from './notificationPlan';

const isNative = () => Capacitor.isNativePlatform();

async function plugin() {
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  return LocalNotifications;
}

// Permission déjà accordée ? (sans rien déclencher)
export async function hasNotifPermission() {
  if (!isNative()) return false;
  try {
    const { display } = await (await plugin()).checkPermissions();
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
    const { display } = await (await plugin()).requestPermissions();
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
    const ln = await plugin();
    if (!(await hasNotifPermission())) return;

    const { notifications: pending } = await ln.getPending();
    if (pending?.length) {
      await ln.cancel({ notifications: pending.map((n) => ({ id: n.id })) });
    }

    const plan = buildNotificationPlan(profile);
    if (!plan.length) return;

    await ln.schedule({
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
