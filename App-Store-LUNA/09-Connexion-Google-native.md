# 🔑 Connexion Google en natif (iOS) — LUNA

> État du chantier « Google natif » + le seul réglage à faire de ton côté.
> Dernière mise à jour : 29/06/2026

---

## ✅ Fait (côté code, par l'assistant)
- En **natif**, « Continuer avec Google » ouvre le **navigateur système** puis revient dans l'app via un **deep-link** : `app.lunawellness://login-callback`.
- Le retour est capté et la session est créée automatiquement (échange du code).
- Le **schéma d'URL** `app.lunawellness` est enregistré dans `Info.plist`.
- ⚠️ Le **web n'est pas touché** (la connexion Google du site marche comme avant).
- Vérifié : compile, build natif OK, page d'auth web intacte, 0 erreur.

## 🔴 Ce que TOI seule peux faire (1 réglage, 2 min)
Dans **Supabase** → ton projet → **Authentication** → **URL Configuration** → section **Redirect URLs** :
1. Clique **Add URL**
2. Ajoute exactement : `app.lunawellness://login-callback`
3. Enregistre.

*(Le provider Google est déjà activé pour le web, rien d'autre à changer là.)*

## 🧪 Comment on teste (ensemble, après ton réglage)
1. Tu me dis « c'est réglé dans Supabase ».
2. Je relance LUNA sur le simulateur.
3. Tu tapes **« Continuer avec Google »** → un navigateur s'ouvre → tu te connectes avec un compte Google → ça revient dans l'app, connectée. 🎉
4. Si le simulateur fait des siennes avec Google, on retestera sur ton vrai iPhone une fois le compte Apple actif (le code, lui, sera déjà bon).

## ℹ️ À ne pas confondre
- Ceci = **Google** en natif (faisable maintenant, sans compte Apple).
- **« Sign in with Apple »** = étape séparée, qui **nécessite le compte Apple Developer** (config dans le portail Apple). On la fera plus tard.
