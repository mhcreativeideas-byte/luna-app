# 📱 Empaquetage iOS avec Capacitor — LUNA

> Où on en est et ce qu'il reste. Dernière mise à jour : 28/06/2026

---

## ✅ Fait (fondations, sans Xcode)
- Capacitor installé (`@capacitor/core`, `ios`, `splash-screen`, `status-bar`, `keyboard` + CLI).
- `capacitor.config.json` créé :
  - **appId** : `app.lunawellness` *(modifiable tant qu'il n'est pas enregistré chez Apple)*
  - **appName** : LUNA · **webDir** : `dist`
  - couleurs de marque (fond crème), splash, status bar (texte foncé), clavier.
- `index.html` déjà prêt (`viewport-fit=cover`, splash, theme-color).
- `.gitignore` : `CM/` (tes contenus créa) exclu.

---

## ⏭️ À faire, dans l'ordre

### 1. Installer Xcode (TOI — c'est le blocage)
- App Store → **Xcode** (gros téléchargement, ~7-12 Go, 1-3 h). Lance-le maintenant.
- Une fois installé : l'ouvrir une fois, accepter la licence.
- Installer **CocoaPods** si besoin (Terminal) : `sudo gem install cocoapods` *(ou `brew install cocoapods`)*.

### 2. Générer le projet iOS (MOI, quand Xcode est prêt)
- `npx cap add ios` → crée le dossier `ios/` (projet Xcode).
- Générer icône + splash natifs à partir de l'icône 1024 et du dégradé signature (`@capacitor/assets`).
- `npm run build && npx cap sync` → copie l'app web dans le natif.

### 3. Voir l'app tourner (TOI + MOI)
- `npx cap open ios` → ouvre Xcode → bouton ▶︎ sur un **simulateur iPhone 15 Pro**.
- 🎉 **Le simulateur ne demande PAS le compte Apple payant** → tu verras LUNA en natif tout de suite.
- La connexion **email / mot de passe** marchera directement.

---

## ⚠️ Étape suivante (séparée) : la connexion sociale en natif
- **Google OAuth** ne marchera pas tel quel dans l'app native → il faut le passer en deep link / navigateur natif.
- **« Se connecter avec Apple »** à ajouter (obligatoire pour la soumission).
- → On traite ça **après** avoir vu l'app tourner sur le simulateur (c'est la partie technique la plus délicate).

## Pour tester sur ton vrai iPhone / soumettre
- Nécessite le **compte Apple Developer** (99 €/an) — à lancer en parallèle (le plus long).
- Puis : Sign in with Apple OK → captures → compte démo → soumission.
