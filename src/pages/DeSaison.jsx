import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import AuroraHeader from '../components/ui/AuroraHeader';
import { SEASONAL_FOODS, FOOD_IMAGES, FOOD_EMOJIS, SEASONAL_MONTH_NAMES } from '../data/seasonal';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function FoodBubble({ name }) {
  const img = FOOD_IMAGES[name];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-20 h-20 rounded-full bg-white flex items-center justify-center"
        style={{ boxShadow: '0 6px 20px rgba(45,34,38,0.06)' }}
      >
        {img ? (
          <img src={img} alt={name} className="w-14 h-14 object-contain" loading="lazy" />
        ) : (
          <span className="text-3xl">{FOOD_EMOJIS[name] || '🥗'}</span>
        )}
      </div>
      <p className="text-[11px] font-body text-luna-text-body text-center leading-tight">{name}</p>
    </div>
  );
}

// Page « De saison » : les fruits et légumes du mois (saisonnalité Manger
// Bouger), avec les photos de public/foods/. Accessible depuis l'onglet Manger.
export default function DeSaison() {
  const month = new Date().getMonth() + 1;
  const monthName = SEASONAL_MONTH_NAMES[month - 1];
  const { fruits = [], legumes = [] } = SEASONAL_FOODS[month] || {};

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-6">
      <BackButton />

      {/* En-tête aurore */}
      <AuroraHeader
        title="De saison"
        accent={`Le meilleur de ${monthName}`}
        intro="Manger de saison, c'est plus de goût, plus de nutriments et moins cher. Voici ce que la nature t'offre ce mois-ci."
      />

      {/* Fruits */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg text-luna-text mb-4">Fruits</h2>
        <div className="grid grid-cols-3 gap-x-3 gap-y-5">
          {fruits.map((name) => <FoodBubble key={name} name={name} />)}
        </div>
      </motion.div>

      {/* Légumes */}
      <motion.div variants={item}>
        <h2 className="font-display text-lg text-luna-text mb-4">Légumes</h2>
        <div className="grid grid-cols-3 gap-x-3 gap-y-5">
          {legumes.map((name) => <FoodBubble key={name} name={name} />)}
        </div>
      </motion.div>

      <motion.div variants={item} className="text-center pt-2">
        <p className="text-[10px] text-luna-text-hint font-body italic">
          Saisonnalité d'après le calendrier Manger Bouger (France).
        </p>
      </motion.div>
    </motion.div>
  );
}
