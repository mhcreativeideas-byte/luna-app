# 👤 Compte de démonstration (pour le testeur Apple)

> Apple exige un compte qui marche **sans inscription** pour valider une app avec connexion.
> Ces infos se collent dans App Store Connect → ta fiche app → **« Informations pour l'examen de l'app »** (App Review Information).
> Dernière mise à jour : 28/06/2026

---

## 🟢 En résumé
LUNA demande une connexion → Apple a besoin d'un **identifiant + mot de passe de test** déjà créés, avec un cycle déjà rempli (pour que le testeur voie l'app vivante tout de suite).

> 💡 **Fais-le directement dans le SIMULATEUR** (pas seulement sur le web) : ça connecte aussi le simulateur avec des données → juste après, l'assistant capture les **vraies captures App Store** (Point 3) en un instant. Deux choses réglées d'un coup.

---

## Identifiants recommandés
- **Email :** `demo@lunawellness.app` (ou `apple-review@lunawellness.app`)
- **Mot de passe :** un mot de passe simple mais solide, p. ex. `LunaDemo2026!`

*(Choisis ce que tu veux — note juste exactement la même chose dans App Store Connect.)*

---

## ✅ Étape à faire toi-même (2 min — je ne peux pas la faire à ta place)
Je n'ai pas accès à l'administration de ta base Supabase, donc **c'est toi qui crées ce compte**, comme une vraie utilisatrice :

1. Ouvre LUNA, va sur **Créer un compte** avec l'email/mot de passe ci-dessus.
2. **Confirme l'email** si Supabase le demande :
   - soit l'email pointe vers une boîte que tu contrôles (recommandé),
   - soit, dans Supabase → **Authentication → Users**, ouvre le compte et clique **Confirm email** à la main.
3. **Termine l'onboarding** (prénom, date des dernières règles, alimentation…) pour que le compte ait un cycle rempli.
4. Fais **1 ou 2 check-ins** (avec quelques symptômes) → ça fait apparaître la carte « symptôme → aliment » et un rapport de profil non vide. L'app paraît tout de suite vivante.
5. Vérifie que tu peux te **déconnecter puis reconnecter** avec ces identifiants.

---

## À coller dans App Store Connect (App Review Information)
- **Connexion requise :** Oui
- **Nom d'utilisateur :** `demo@lunawellness.app`
- **Mot de passe :** `LunaDemo2026!`
- **Notes (exemple) :**
  > LUNA est une app de bien-être féminin centrée sur le cycle menstruel et l'alimentation. Connecte-toi avec le compte fourni : un cycle et des check-ins sont déjà enregistrés. Onglet « Mon cycle » = phase + calendrier + check-in du jour ; « Manger » = menu du jour + recettes ; « Mes aliments » = nutriments de la phase. L'app est un outil de bien-être, pas un dispositif médical (disclaimer visible dans l'app).

---

## ⚠️ À ne pas oublier
- Garde ce compte **actif et confirmé** jusqu'à la fin de l'examen (ne le supprime pas).
- Si tu actives un jour « Se connecter avec Apple », le testeur peut aussi l'utiliser — mais garde **toujours** un compte email/mot de passe de secours ici.
