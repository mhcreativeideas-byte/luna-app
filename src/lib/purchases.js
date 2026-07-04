// ============================================================
// Paiement Apple In-App Purchase — couche d'abstraction (squelette)
// ============================================================
// État actuel : le paywall est VISUEL (IAP_ENABLED = false), l'abonnement
// n'est pas encore facturé. Tout le reste de l'app passe par ce module,
// si bien qu'au moment de brancher le vrai paiement il n'y aura RIEN à
// changer ailleurs.
//
// Marche à suivre au branchement (quand le compte Apple Developer est prêt) :
//   1. App Store Connect → créer les 2 abonnements auto-renouvelables
//      avec exactement les identifiants PRODUCT_IDS ci-dessous
//      (+ essai gratuit de 7 jours en offre d'introduction).
//   2. Installer le plugin choisi (recommandation : RevenueCat,
//      @revenuecat/purchases-capacitor — gère les reçus, la restauration
//      et les statuts d'abonnement pour nous), puis `npx cap sync ios`.
//   3. Remplir les TODO ci-dessous avec les appels du plugin.
//   4. Passer IAP_ENABLED à true. C'est tout.
// ============================================================

import { Capacitor } from '@capacitor/core';

// Identifiants produits App Store Connect (à créer à l'identique)
export const PRODUCT_IDS = {
  monthly: 'app.lunawellness.sub.monthly',
  annual: 'app.lunawellness.sub.annual',
};

// ⚠️ Passer à true UNIQUEMENT quand le plugin est branché et les produits
// créés dans App Store Connect — sinon l'achat échouerait pour tout le monde.
const IAP_ENABLED = false;

// Le paiement Apple n'existe que dans l'app native (jamais sur le web).
export function isIAPAvailable() {
  return IAP_ENABLED && Capacitor.isNativePlatform();
}

// Lance l'achat de l'abonnement choisi ('monthly' | 'annual').
// Retourne { ok, cancelled?, error?, simulated? } — jamais d'exception.
export async function purchase(planId) {
  if (!isIAPAvailable()) {
    // Mode visuel actuel : on laisse passer, comme aujourd'hui.
    return { ok: true, simulated: true, planId };
  }
  // TODO (branchement RevenueCat) — remplacer le return ci-dessous par :
  //   try {
  //     const { Purchases } = await import('@revenuecat/purchases-capacitor');
  //     const offerings = await Purchases.getOfferings();
  //     const pkg = ... retrouver le package correspondant à PRODUCT_IDS[planId]
  //     const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
  //     return { ok: customerInfo.entitlements.active['premium'] != null };
  //   } catch (e) {
  //     const cancelled = e?.userCancelled;
  //     return { ok: false, cancelled, error: cancelled ? null : e?.message };
  //   }
  return { ok: false, error: 'IAP non branché' };
}

// « Restaurer mes achats » — obligatoire pour Apple (nouvel iPhone, réinstallation).
export async function restorePurchases() {
  if (!isIAPAvailable()) return { ok: false, none: true };
  // TODO (branchement RevenueCat) — remplacer le return ci-dessous par :
  //   try {
  //     const { Purchases } = await import('@revenuecat/purchases-capacitor');
  //     const { customerInfo } = await Purchases.restorePurchases();
  //     return { ok: customerInfo.entitlements.active['premium'] != null };
  //   } catch (e) { return { ok: false, error: e?.message }; }
  return { ok: false, none: true };
}

// L'abonnement est-il actif ? (à interroger au démarrage pour murer/démurer)
export async function isSubscribed() {
  if (!isIAPAvailable()) {
    // Tant que le paiement n'est pas branché, tout le monde a accès.
    return true;
  }
  // TODO (branchement RevenueCat) :
  // const { Purchases } = await import('@revenuecat/purchases-capacitor');
  // const { customerInfo } = await Purchases.getCustomerInfo();
  // return customerInfo.entitlements.active['premium'] != null;
  return true;
}
