// Insights du jour par phase : plusieurs par phase, un est choisi chaque jour
// (stable dans la journée) via un tirage basé sur la date. Faits vérifiés sur
// sources scientifiques (revues systématiques, PubMed/PMC).
// Affiché en bas de l'onglet « Manger » (Recettes.jsx).
export const PHASE_INSIGHTS = {
  menstrual: [
    'Pendant tes règles, tes hormones sont au plus bas : ta fatigue est physiologique, pas un manque de volonté.',
    'Tu perds du fer à chaque cycle. Les aliments riches en fer (lentilles, épinards, légumineuses) aident à retrouver ton énergie.',
    'Les crampes viennent des prostaglandines, des molécules inflammatoires. Les oméga-3 et le magnésium agissent comme anti-inflammatoires naturels.',
    'Ton métabolisme de repos est plutôt à son point le plus bas en ce moment. Il remontera en fin de cycle.',
  ],
  follicular: [
    'L\'œstrogène remonte : c\'est souvent le retour de l\'énergie et d\'une meilleure humeur.',
    'Ta sensibilité à l\'insuline est meilleure en début de cycle : ton corps gère bien les glucides.',
    'Belle fenêtre pour bouger : certaines études suggèrent de meilleurs gains de force quand l\'œstrogène est haut.',
    'L\'œstrogène soutient le collagène : beaucoup de femmes trouvent leur peau plus belle en cette phase.',
  ],
  ovulatory: [
    'Pic d\'œstrogène, de LH et de testostérone : souvent le moment où tu te sens la plus énergique et sociable.',
    'Ta température corporelle va légèrement monter juste après l\'ovulation, sous l\'effet de la progestérone.',
    'Le savais-tu ? Ta voix peut devenir légèrement plus mélodieuse autour de l\'ovulation.',
    'Un bon moment pour les échanges importants : tes capacités verbales et sociales sont au top.',
  ],
  luteal: [
    'Ton métabolisme augmente un peu en fin de cycle (~5 %) : avoir un peu plus faim est normal.',
    'La progestérone fait monter ta température de 0,3 à 0,5 °C, tu peux donc avoir plus chaud que d\'habitude.',
    'Les envies de sucre viennent d\'une baisse de sérotonine. Les glucides complexes et le chocolat noir aident en douceur.',
    'La progestérone a un effet apaisant : si tu te sens ralentie, c\'est ton corps qui te parle.',
  ],
};

// Choisit un insight du jour, stable dans la journée et différent chaque jour.
export const getDailyInsight = (phase) => {
  const list = PHASE_INSIGHTS[phase] || PHASE_INSIGHTS.follicular;
  const d = new Date();
  const daySeed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return list[daySeed % list.length];
};
