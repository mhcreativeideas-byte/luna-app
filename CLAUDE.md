# LUNA — Contexte du projet

> Ce fichier est lu automatiquement au début de chaque conversation. Il résume l'app pour repartir vite.

## C'est quoi LUNA
App de **bien-être féminin** centrée sur le **cycle menstruel**. Elle aide chaque utilisatrice à comprendre sa phase (menstruelle, folliculaire, ovulatoire, lutéale) et adapte sport, alimentation, recettes, sommeil et conseils à cette phase. Ton doux, bienveillant, sans culpabilité. Public francophone. Site : lunawellness.app

## 🎯 OBJECTIF PRINCIPAL (important)
Le but est une **vraie app iPhone native**, emballée avec **Capacitor** — **PAS** une simple web app. iPhone d'abord (Android optionnel plus tard). Le code web actuel n'est que la **base de développement**. Toutes les décisions doivent viser l'app iOS sur l'App Store.

## 🎨 DESIGN & ERGONOMIE (très important)
**Penser « app iPhone native », JAMAIS « site web ».** Référence d'ambiance : apps de bien-être premium type **Calm / Flo / Clue** — épuré, doux, spacieux, haut de gamme. Règles à appliquer systématiquement :
- **Gros boutons bien visibles**, pleine largeur, hauteur confortable. Zone tactile **≥ 44px** (règle Apple). Coins bien arrondis (style iOS doux).
- **Disposition en lignes empilées** (row-based) : **une action / une info par ligne**, claire et aérée. Pas de grilles denses façon web.
- **Espacements généreux**, beaucoup de respiration. **Une info principale par écran**, pas de surcharge.
- **Navigation en bas** (barre d'onglets, déjà en place) — actions principales accessibles **au pouce**.
- **Fenêtres qui montent du bas** (bottom sheets) pour les détails/modals, pas de pop-up façon web.
- **Pas de survol (hover)** : on est tactile. Feedback au tap (légère réduction d'échelle), transitions douces (Framer Motion).
- **Respecter les zones de sécurité** iPhone (encoche, barre du bas) : `env(safe-area-inset-*)`.
- **Texte lisible** : tailles confortables, contraste suffisant (surtout les textes secondaires pâles).
- `touch-action: manipulation` partout (déjà fait) pour des taps qui répondent du premier coup.
→ En cas de doute, choisir la solution la plus **grosse, claire, tactile et épurée**, comme une vraie app iOS.

## 🎨 Charte de branding (couleurs exactes — ne pas dévier)
**Polices** : Titres = **Playfair Display** (serif élégant, `--font-display`) · Corps = **DM Sans** (`--font-body`).
**Ton** : doux, bienveillant, **sans culpabilité**, tutoiement, féminin, premium.

**Couleurs principales :**
- Rose LUNA (primaire) : `#C4727F` · foncé `#A85A66` · clair `#E8A5AE` · fond `#FDE8EB`
- Fond crème de l'app : `#FAF7F5` · cartes `#F5F1EE` · blanc `#FFFFFF`
- Texte : titres `#2D2226` · corps `#4A3F43` · atténué `#756568` · indices `#7A6D70`
- Lavande (secondaire) : `#B09ACB` · Pêche : `#E8A87C` · Menthe/ciel : `#A8C8D5` · Sauge : `#C8C0B4`

**Dégradé signature** (splash, écran de chargement) : `#F0C4C9` → `#EDC4B3` → `#FAF8F5` (haut → bas).

**Couleurs des 4 phases du cycle :**
- 🌙 Menstruelle : `#D4727F` (fond `#FDE8EB`)
- 🌿 Folliculaire : `#7BAE7F` (fond `#EDF5ED`)
- ☀️ Ovulatoire : `#E8A87C` (fond `#FFF3EB`)
- 🍂 Lutéale : `#B09ACB` (fond `#F3EEF8`)

> Toutes ces couleurs sont définies en variables CSS dans `src/index.css` (`--color-luna-*`). Toujours réutiliser ces variables, ne pas inventer de nouvelles teintes.

## Stack technique
- **JavaScript + React 19** (fichiers `.jsx`, pas de TypeScript)
- **Vite** (build) · **Tailwind CSS v4** (style) · **React Router v7** (navigation)
- **Framer Motion** (animations) · **lucide-react** (icônes)
- **Supabase** (backend : base de données, authentification, stockage)
- Hébergé sur **Vercel** · déploiement = `git push origin main` → Vercel déploie tout seul (~1-2 min)

## Commandes
- `npm run dev` — serveur de dev
- `npm run build` — build de production (toujours vérifier que ça passe avant de pousser)
- `npm run lint` — ESLint

## Structure
- `src/pages/` — les écrans : Landing, Auth, Onboarding, Dashboard, Sport, Alimentation, Recettes, MonFrigo, Sommeil, Journal, CheckIn, Chat, Profil, Settings, Extras, Calendar, Admin, CGU, Privacy, NotFound
- `src/contexts/CycleContext.jsx` — **état global** (profil, cycle, journal, favoris, frigo…) + sync Supabase + calcul des phases
- `src/data/` — contenus : recettes par phase (`recipes-*.js`), `seasonal.js` (fruits/légumes de saison + images `public/foods/`), `phases.js`, `exercises.js`, `chatResponses.js` (le chat est **local/règles**, pas d'IA externe)
- `App-Store-LUNA/` — tous les documents de soumission App Store (fiche, checklist, confidentialité, âge, icône, évolutions futures)

## Authentification & comptes
- Supabase Auth : **email/mot de passe** + **Google OAuth**
- `/auth` = page des utilisatrices (inscription / connexion)
- `/admin` = espace admin **séparé**, avec sa **propre connexion** (ne renvoie jamais vers l'app). Réservé à `ADMIN_EMAILS` = `mhcreative.ideas@gmail.com`. Affiche les stats **agrégées** (RGPD : pas de données santé individuelles) + une section « Abonnements & revenus » prête pour de futurs paiements.

## Base de données (Supabase)
- Table `users` — profil (nom, email, cycle, objectifs, préférences alimentaires, santé…)
- Table `user_tracking` — suivi (journal, sport, check-ins, règles, conversations, favoris, frigo, réglages)
- Storage `avatars` — photos de profil

## ⚠️ Points importants / pièges
- **Service worker DÉSACTIVÉ** pendant le dev (`src/main.jsx` le désinscrit) : il gardait d'anciennes versions en cache et bloquait les mises à jour (spinner, écran blanc…). À **réactiver seulement au lancement** (network-first). `public/sw.js` existe mais n'est plus enregistré.
- Après un déploiement, le navigateur peut garder l'ancienne version → tester en **fenêtre privée** ou vider le cache.
- Toujours **vérifier le build** avant de pousser. Les warnings ESLint `react-hooks/exhaustive-deps` sur les effets de chargement de recettes sont **intentionnels**.

## Reste à faire pour l'App Store (gros chantiers)
Capacitor (emballage natif) · **Sign in with Apple** (obligatoire car Google est proposé) · notifications push · captures d'écran · compte de démonstration · finir l'inscription Apple Developer (compte **Individuel**, auto-entrepreneur). ⚠️ Abonnements iOS = **Apple In-App Purchase obligatoire** (commission 15-30 %), pas Stripe.

## La propriétaire (comment communiquer)
**Margaux**, graphiste **auto-entrepreneur**, **débutante en code**. Préfère des explications **simples, claires, en français**, étape par étape. Éviter le jargon. Être honnête sur ce qui marche / ce qui reste à faire.
