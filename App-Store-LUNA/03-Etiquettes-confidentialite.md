# 🔒 Étiquettes de confidentialité (App Privacy) — LUNA

> Réponses prêtes pour le questionnaire « App Privacy » dans App Store Connect.
> (Apple → ta fiche app → « Confidentialité de l'app »)
> Basé sur une vérification réelle du code. Dernière mise à jour : 28/06/2026

---

## 🟢 Le résumé en une phrase
LUNA collecte uniquement les données nécessaires à son fonctionnement, **liées à ton compte**, stockées chez **Supabase**. **Aucun pistage, aucune publicité, aucun partage à des fins marketing, aucune IA externe.**

→ À la question d'Apple **« Utilisez-vous les données pour le suivi (tracking) ? »** : répondre **NON** partout.

---

## Données COLLECTÉES (à déclarer « Oui, collectées »)

Pour chacune, les réponses sont les mêmes :
- **Liée à l'identité de l'utilisateur ?** → **Oui** (rattachée au compte)
- **Utilisée pour le suivi (tracking) ?** → **NON**
- **But ?** → **Fonctionnement de l'app** (App Functionality)

| Catégorie Apple | Donnée concernée dans LUNA |
|-----------------|----------------------------|
| **Coordonnées (Contact Info)** → Nom | Prénom dans le profil |
| **Coordonnées** → Adresse e-mail | Email du compte |
| **Santé et fitness** → Santé | Cycle, règles, symptômes, température, SPM/endométriose/SOPK, allergies, préférences alimentaires |
| **Santé et fitness** → Forme physique | Séances et activités sportives |
| **Contenu utilisateur** → Photos | Photo de profil (avatar) |
| **Contenu utilisateur** → Autre contenu | Journal, notes, check-ins, messages du chat |
| **Identifiants** → ID utilisateur | Identifiant de compte (Supabase) |

> **Note v1 (food-first) :** l'app v1 met en avant le **cycle, les check-ins, les recettes/favoris et le frigo**. Le **sport, le journal et le chat** sont masqués dans l'interface (code conservé). On **garde quand même** leurs déclarations ci-dessus : sur-déclarer est **sans risque** côté Apple, alors que sous-déclarer peut faire refuser l'app — et ces données seront réactivées si on réaffiche ces écrans.

---

## Données NON collectées (à déclarer « Non »)
- ❌ Localisation
- ❌ Informations financières / Achats
- ❌ Historique de navigation / de recherche
- ❌ Contacts
- ❌ **Données d'utilisation / Analytics** (aucun outil de tracking installé)
- ❌ **Diagnostics** (aucun outil de rapport de crash)
- ❌ Coordonnées physiques, données de capteurs autres

---

## Prestataires (sous-traitants, PAS du pistage)
Ce ne sont pas des « partenaires publicitaires » — ils traitent les données **pour ton compte**, pour faire fonctionner l'app :
- **Supabase** → hébergement de la base de données et stockage (compte, profil, cycle, journal…)
- **Google** → uniquement la connexion « Se connecter avec Google » (authentification)

→ Ça ne compte pas comme du « tracking » au sens d'Apple.

---

## ⚠️ Point d'attention santé
Les données de cycle sont **sensibles**. Apple les classe dans **« Santé »** (Health). C'est bien ce qu'on déclare. Veille à ce que ta politique de confidentialité (déjà en ligne) explique clairement :
- quelles données tu collectes,
- pourquoi,
- qu'elles ne sont jamais vendues ni utilisées pour la pub.
(C'est déjà le cas dans `/confidentialite` ✅)
