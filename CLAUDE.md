# LUNA — Contexte du projet

> Ce fichier est lu automatiquement au début de chaque conversation. Il résume l'app pour repartir vite.

## C'est quoi LUNA
App de **bien-être féminin** centrée sur le **cycle menstruel**. Elle aide chaque utilisatrice à comprendre sa phase (menstruelle, folliculaire, ovulatoire, lutéale) et adapte sport, alimentation, recettes, sommeil et conseils à cette phase. Ton doux, bienveillant, sans culpabilité. Public francophone. Site : lunawellness.app

## 🎯 OBJECTIF PRINCIPAL (important)
Le but est une **vraie app iPhone native**, emballée avec **Capacitor** — **PAS** une simple web app. iPhone d'abord (Android optionnel plus tard). Le code web actuel n'est que la **base de développement**. Toutes les décisions doivent viser l'app iOS sur l'App Store.

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
