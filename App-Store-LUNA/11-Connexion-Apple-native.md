# 🍎 Connexion Apple en natif (iOS) — LUNA

> État du chantier « Sign in with Apple » + les 3 réglages à faire de ton côté.
> **Pourquoi c'est obligatoire :** dès qu'une app propose un login social tiers (ici Google),
> Apple exige (règle 4.8) qu'elle propose AUSSI « Se connecter avec Apple ». Sans ça = **rejet automatique**.
> Dernière mise à jour : 29/06/2026

---

## ✅ Fait (côté code, par l'assistant)
- En **natif**, « Continuer avec Apple » ouvre la **vraie fenêtre Apple** (Face ID / Touch ID), pas un popup web.
- Plugin installé : `@capacitor-community/apple-sign-in`, synchronisé dans le projet iOS.
- Sécurité **nonce** (code à usage unique haché en SHA-256) gérée automatiquement, comme Apple l'exige.
- Le jeton Apple est transmis à Supabase (`signInWithIdToken`) → session créée → redirection vers l'app.
- La **capability** « Sign in with Apple » est créée (`ios/App/App/App.entitlements`) et branchée dans le projet Xcode (Debug + Release).
- ⚠️ Le **web n'est pas cassé** : sur le site, le bouton Apple fait une redirection OAuth classique.
- Vérifié : compile, lint OK, build OK, bouton affiché et propre, 0 erreur console.

---

## 🔴 Ce que TOI seule peux faire (3 réglages — il faut ton compte Apple Developer actif)

### 1) Apple Developer — activer Sign in with Apple
Sur https://developer.apple.com → **Certificates, Identifiers & Profiles** :
1. **Identifiers** → ton App ID `app.lunawellness` → coche **Sign in with Apple** → **Save**.
2. **Keys** → bouton **+** → nomme la clé (ex. « LUNA Apple Sign In ») → coche **Sign in with Apple** → **Configure** (choisis ton App ID principal) → **Continue** → **Register**.
   - **Télécharge le fichier `.p8`** (⚠️ téléchargeable UNE seule fois, garde-le précieusement).
   - Note le **Key ID** (10 caractères) et ton **Team ID** (en haut à droite du compte).
3. **Identifiers** → bouton **+** → **Services IDs** → crée un Services ID (ex. `app.lunawellness.signin`).
   - Coche **Sign in with Apple** → **Configure** → ajoute le domaine et l'URL de retour Supabase :
     - **Domain** : `<ton-projet>.supabase.co`
     - **Return URL** : `https://<ton-projet>.supabase.co/auth/v1/callback`
   - **Save**.

### 2) Supabase — activer le provider Apple
Dans **Supabase** → ton projet → **Authentication** → **Providers** → **Apple** :
- **Enable** Apple.
- **Client IDs** (champ « Authorized Client IDs ») : mets le **bundle id** `app.lunawellness` (pour la connexion native).
- Pour le web, renseigne aussi : **Services ID** (celui de l'étape 1.3), **Team ID**, **Key ID**, et le contenu de la **clé `.p8`**.
- **Save**.
- Vérifie que `app.lunawellness://login-callback` est bien dans **URL Configuration → Redirect URLs** (déjà ajouté pour Google).

### 3) Xcode — ta signature (Development Team)
Dans **Xcode**, ouvre `ios/App/App.xcworkspace` → cible **App** → onglet **Signing & Capabilities** :
- Choisis ton **Team** (ton compte Apple Developer) dans le menu.
- La capability **Sign in with Apple** doit déjà apparaître (le fichier `App.entitlements` est branché). Si elle n'y est pas, clique **+ Capability** → **Sign in with Apple**.

---

## 🧪 Comment on teste (ensemble, après tes réglages)
1. Tu me dis « c'est réglé (Apple Developer + Supabase + Xcode) ».
2. Je relance LUNA sur le simulateur ou sur ton iPhone.
3. Tu tapes **« Continuer avec Apple »** → la fenêtre Apple monte du bas → tu valides → ça revient dans l'app, connectée. 🎉
   - Note : sur **simulateur**, Sign in with Apple marche si un compte Apple est connecté dans les Réglages du simulateur. Sinon on teste sur ton vrai iPhone.

---

## ℹ️ Notes
- Ceci = **Apple** en natif. À ne pas confondre avec le doc `09-Connexion-Google-native.md` (Google).
- Tant que les 3 réglages ne sont pas faits, le bouton s'affiche mais la connexion ne s'effectuera pas (normal).
- Aucune dépense ici : tout est inclus dans le compte Apple Developer (99 $/an déjà nécessaire pour publier).
