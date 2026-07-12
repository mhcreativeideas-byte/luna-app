import { Moon, Sprout, Sun, Leaf } from 'lucide-react';

// Icônes de phase dessinées (trait fin lucide). Elles remplacent les émojis
// système 🌙🌿☀️🍂 qui variaient d'un appareil à l'autre (validé 2026-07-12).
// Correspondance fidèle au sens des émojis d'origine : lune = règles,
// pousse = renouveau folliculaire, soleil = ovulation, feuille = automne
// intérieur lutéal. Seule source de vérité : tout écran qui montre l'icône
// d'une phase passe par ici (ou par le composant <PhaseIcon>).
export const PHASE_ICONS = {
  menstrual: Moon,
  follicular: Sprout,
  ovulatory: Sun,
  luteal: Leaf,
};
