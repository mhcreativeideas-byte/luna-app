# 🔍 QA natif — LUNA

> Tests de stabilité avant soumission. Dernière mise à jour : 29/06/2026

---

## ✅ Vérifié
- **Tous les écrans rendent** (Mon cycle, Manger, Mes aliments, Mon frigo, Check-in, Profil, Paramètres, Auth, Landing, Onboarding) — au simulateur (natif) et en preview web.
- **0 erreur console** sur l'ensemble de la navigation.
- **Petit écran (375 px, iPhone SE)** : aucun débordement horizontal (Dashboard, Manger, Mes aliments). Les seuls éléments « larges » sont des cercles décoratifs clippés par leur conteneur `overflow-hidden` → pas de scroll horizontal réel.
- **États vides** : Profil sans check-in → message + bouton « Faire mon check-in » ; Dashboard sans check-in → pas de carte symptôme, pas de crash.
- **Suppression de compte** (obligatoire Apple) : présente et accessible dans Paramètres → confirmation, suppression des données (`users` + `user_tracking`), RPC `delete_user_completely`, puis déconnexion.
- **Zones de sécurité** (encoche / barre d'accueil) gérées (cf. Point 1).
- **Hors-ligne** : architecture **local-first** — session lue depuis le cache (pas de réseau pour `getSession`), recettes embarquées dans le bundle, calcul des phases en local, écritures Supabase encapsulées en `try/catch`. → l'app se lance et fonctionne sans réseau ; la synchro reprend au retour du réseau.

## 🔎 À garder en tête (dépendances backend, déjà en place côté Supabase)
- RPC `delete_user_completely` doit exister dans Supabase (suppression du compte auth).
- Provider Google activé (web). Pour Google **natif**, voir `09-Connexion-Google-native.md`.

## 🧪 À re-tester sur appareil réel (une fois le compte Apple actif)
- Retour haptique au tap (le simulateur n'a pas de moteur taptique).
- Round-trip connexion Google natif.
- Comportement clavier + zones de sécurité sur différents iPhones physiques.
