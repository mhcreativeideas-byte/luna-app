import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';
import MonthlyReport from '../components/cycle/MonthlyReport';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Page « Mon bilan » — le rapport mensuel, sorti de Profil pour être
// accessible depuis l'onglet Mon cycle.
export default function Bilan() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <BackButton />
      <motion.div variants={item}>
        <h1 className="font-display text-2xl text-luna-text">Mon bilan</h1>
      </motion.div>
      <motion.div variants={item}>
        <MonthlyReport />
      </motion.div>
    </motion.div>
  );
}
