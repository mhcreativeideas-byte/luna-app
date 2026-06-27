# 🚀 Évolutions futures — LUNA

> Fonctionnalités à développer plus tard, notées pour ne rien oublier.
> Dernière mise à jour : 27/06/2026

---

## 💳 Système de paiement & abonnements (priorité business)

**Objectif** : proposer un abonnement **gratuit** + **payant**, en **mensuel** ou **annuel**, et suivre les revenus.

### ⚠️ RÈGLE APPLE TRÈS IMPORTANTE à connaître AVANT de coder
Pour une app sur l'**App Store**, les abonnements à du **contenu numérique** (accès aux fonctions de l'app) **DOIVENT** passer par le système de paiement d'Apple : **In-App Purchase (IAP)**.
- ❌ On **ne peut PAS** utiliser Stripe/PayPal pour faire payer l'abonnement sur iPhone (Apple refuse l'app).
- 💰 Apple prend une **commission de 15 à 30 %** sur chaque abonnement.
- ✅ Stripe reste possible **uniquement** pour la version **web** (hors App Store) — mais attention, on ne peut pas rediriger les utilisatrices iPhone vers le paiement web (interdit par Apple).

👉 **Conclusion** : si tu veux monétiser sur l'App Store, il faudra mettre en place **Apple In-App Purchase**. À bien anticiper (technique + 30 % de commission dans tes calculs de prix).

### Ce qui est DÉJÀ prêt côté admin ✅
La section **« Abonnements & revenus »** est déjà construite dans l'admin. Elle se remplira **automatiquement** dès que les paiements seront branchés. Elle calcule déjà :
- Abonnées payantes + taux de conversion
- Revenu récurrent mensuel (MRR)
- Encaissé ce mois
- Répartition gratuit/payant et mensuel/annuel

### Ce qu'il restera à faire (le jour J)
1. Choisir le système : **Apple IAP** (pour iOS) et/ou **Stripe** (pour le web)
2. Définir les offres et les prix (mensuel / annuel)
3. Ajouter les champs sur chaque utilisatrice : `subscription_status`, `subscription_plan`, `subscription_price`, `subscription_last_payment`
4. Construire la page d'abonnement + la gestion des renouvellements
5. → La section admin se remplit toute seule

---

## 📋 Autres chantiers déjà identifiés (rappel)
- [ ] **Emballage natif (Capacitor)** — indispensable pour soumettre à l'App Store
- [ ] **« Se connecter avec Apple »** — obligatoire car Google est proposé (à activer une fois le compte développeur prêt)
- [ ] **Notifications push** — donne de la valeur native + utile pour l'engagement
- [ ] **Captures d'écran** App Store
- [ ] **Compte de démonstration** pour le testeur Apple

---

## 📂 Voir aussi
- `02-Checklist-soumission.md` → la checklist complète App Store
