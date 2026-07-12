import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Petites vibrations douces sur les actions importantes, pour que l'app « se
// sente » native en main. Sans effet sur le web (le navigateur d'aperçu ne
// vibre pas) : chaque appel est silencieusement ignoré hors iPhone.

const isNative = () => Capacitor.isNativePlatform();

// Tap léger : sélection d'une humeur, ajout aux courses, favori…
export async function tapLight() {
  if (!isNative()) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Jamais bloquant : la vibration est un bonus, pas une fonctionnalité.
  }
}

// Confirmation : enregistrement du check-in, action réussie.
export async function tapSuccess() {
  if (!isNative()) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Jamais bloquant.
  }
}
