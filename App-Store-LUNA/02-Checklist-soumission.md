# ✅ Checklist soumission App Store — LUNA

> Tout ce qu'il faut pour soumettre LUNA et passer la validation Apple.
> Coche les cases au fur et à mesure. Dernière mise à jour : 27/06/2026

---

## A. Technique (les gros morceaux)
- [ ] **Emballer LUNA en app native** avec Capacitor (l'App Store refuse les sites web bruts)
- [ ] **Ajouter les notifications push** (donne de la « valeur native » → évite le refus règle 4.2)
- [ ] **Ajouter « Se connecter avec Apple »** (obligatoire car Google est proposé)
- [ ] **Construire l'app avec Xcode** sur le Mac (étape finale)

## B. Confidentialité & données (crucial — app santé)
- [x] Politique de confidentialité accessible (`/confidentialite`)
- [x] Conditions générales / CGU (`/conditions`)
- [x] Suppression de compte dans l'app (Paramètres)
- [x] Données chiffrées (Supabase)
- [ ] **Étiquettes de confidentialité** (questionnaire « App Privacy » dans App Store Connect)
- [ ] Vérifier le **disclaimer médical** bien visible

## C. Connexion
- [x] Email / mot de passe
- [x] Connexion Google
- [ ] **Se connecter avec Apple** (à ajouter)

## D. Contenu de la fiche App Store
- [x] Nom, sous-titre, description, mots-clés → voir `01-Fiche-App-Store.md`
- [x] Catégorie choisie (Santé et remise en forme)
- [x] Email de support (hello@lunawellness.app)
- [x] **Icône 1024×1024** (sans transparence) → `icone-1024.png` *(générée depuis icon-512 ; à ré-exporter depuis le fichier d'origine pour des traits parfaitement nets si besoin)*
- [ ] **Captures d'écran** aux formats iPhone imposés
- [ ] **Classification d'âge** (questionnaire)
- [ ] **Compte de démonstration** pour le testeur Apple

## E. Compte développeur Apple
- [ ] Inscription Apple Developer Program (compte **Individuel**)
- [ ] Vérification d'identité (pièce d'identité + selfie)
- [ ] Paiement 99 €/an

## F. Pièges qui font REFUSER (à garder en tête)
- [ ] L'app ne doit pas être « juste un site web » → push notifications règlent ça
- [ ] Aucun bug / crash pendant le test Apple (déjà bien nettoyé ✅)
- [ ] « Se connecter avec Apple » présent si Google l'est
- [ ] Disclaimer médical présent (prédictions de cycle)
- [ ] Aucun lien cassé, aucun contenu placeholder

---

## 📌 Ordre conseillé
1. Technique : Capacitor + Sign in with Apple + push + disclaimer
2. Visuels : icône 1024 + captures d'écran
3. Compte développeur + soumission

## 📂 Fichiers de ce dossier
- `01-Fiche-App-Store.md` → tous les textes à copier-coller
- `02-Checklist-soumission.md` → ce fichier
- (à venir) `icone-1024.png` → l'icône App Store
- (à venir) `captures/` → les captures d'écran
