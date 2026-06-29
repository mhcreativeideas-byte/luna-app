# 📸 Captures d'écran App Store — LUNA

> Ce qu'il faut comme captures, et lesquelles raconter. Dernière mise à jour : 29/06/2026

---

## Formats demandés par Apple
- **6,9 pouces** (iPhone 17 Pro Max) → **1320 × 2868 px** — taille de référence actuelle.
- **6,7 pouces** → **1290 × 2796 px** (acceptée).
- **Entre 1 et 10 captures** (idéal : **4 à 5**).
- **PNG ou JPEG, RGB, sans transparence.** Pas de coins arrondis ni de barre d'état à ajouter (Apple gère).

---

## 🎬 Les 5 captures à raconter (l'ordre = l'argumentaire)
1. **Mon cycle** — l'anneau de phase + le jour du cycle. → « Comprends où tu en es. »
2. **Manger — ton menu du jour** (« Ta journée idéale »). → « Quoi manger aujourd'hui, adapté à ta phase. »
3. **Boucle symptôme → aliment** (carte « Apaiser tes crampes → magnésium »). → « Soulage tes symptômes par l'assiette. » *(LE différenciateur — à mettre tôt.)*
4. **Mes aliments** — nutriments de la phase + aliments. → « Les bons nutriments, au bon moment. »
5. **Une recette** (ou la grille). → « Des recettes pensées pour ton cycle. »

---

## 🎨 Conseils déco (ton terrain, tu es graphiste 😉)
- Garde le **fond crème** de la marque + une **phrase d'accroche courte** en haut de chaque capture (Playfair pour le titre).
- 1 idée par capture, beaucoup d'air, cohérent avec l'ambiance Calm/Flo.
- Reste honnête : pas de fonctionnalité montrée qui n'existe pas dans l'app.

---

## Comment on produit les vraies captures (pixel parfait)
La méthode propre : **capture directe depuis le simulateur**, app connectée avec des données.
- Simulateur **iPhone 17 Pro Max** (6,9") → un screenshot fait **exactement 1320 × 2868 px** = taille App Store, layout mobile réel.
- Commande utilisée par l'assistant : `xcrun simctl io booted screenshot fichier.png` → fichiers PNG aux bonnes dimensions, sans recadrage.

> 🔗 **Dépendance** : il faut que l'app soit **connectée + onboardée avec un peu de données** (cycle + 1 check-in) dans le simulateur. C'est exactement ce qu'on met en place au **Point 6 (compte démo)**. → Donc l'assistant capture les 5 héros **juste après le Point 6**, en vraie taille, et te les livre en fichiers.
>
> Toi ensuite (ta zone de graphiste) : habillage marketing (accroche Playfair, fond crème) si tu veux les enjoliver. Les fichiers bruts sont déjà aux bonnes dimensions et utilisables tels quels.

---

## État
- [x] **Sélection des 5 écrans héros validée** (liste ci-dessus, vus et confirmés)
- [x] Formats + méthode de capture définis
- [ ] 5 fichiers finaux 1320 × 2868 exportés → dossier `captures/` *(à capturer depuis le simulateur juste après le Point 6 — compte démo)*
