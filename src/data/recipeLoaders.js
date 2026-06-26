export const RECIPE_LOADERS = {
  menstrual: () => import('./recipes-menstrual').then(m => m.RECIPES_MENSTRUAL),
  follicular: () => import('./recipes-follicular').then(m => m.RECIPES_FOLLICULAR),
  ovulatory: () => import('./recipes-ovulatory').then(m => m.RECIPES_OVULATORY),
  luteal: () => import('./recipes-luteal').then(m => m.RECIPES_LUTEAL),
};
