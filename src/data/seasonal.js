export const FOOD_EMOJIS = {
  // Fruits
  'Citron': '🍋', 'Clémentine': '🍊', 'Kiwi': '🥝', 'Mandarine': '🍊', 'Orange': '🍊',
  'Pamplemousse': '🍊', 'Pomme': '🍎', 'Poire': '🍐', 'Fraise': '🍓', 'Rhubarbe': '🌿',
  'Cerise': '🍒', 'Abricot': '🍑', 'Framboise': '🫐', 'Melon': '🍈', 'Nectarine': '🍑',
  'Pêche': '🍑', 'Figue': '🟤', 'Cassis': '🫐', 'Groseille': '🔴', 'Myrtille': '🫐',
  'Pastèque': '🍉', 'Prune': '🟣', 'Mirabelle': '🟡', 'Mûre': '🫐', 'Raisin': '🍇',
  'Châtaigne': '🌰', 'Coing': '🍐', 'Noix': '🥜',
  // Légumes
  'Betterave': '🟣', 'Carotte': '🥕', 'Céleri': '🌿', 'Chou': '🥬', 'Chou-fleur': '🥦',
  'Endive': '🥬', 'Épinard': '🥬', 'Mâche': '🥬', 'Navet': '🤍', 'Panais': '🤍',
  'Poireau': '🥬', 'Potiron': '🎃', 'Topinambour': '🥔', 'Asperge': '🌿', 'Radis': '🔴',
  'Artichaut': '🌿', 'Chou de Bruxelles': '🥬', 'Aubergine': '🍆', 'Concombre': '🥒',
  'Courgette': '🥒', 'Laitue': '🥬', 'Petit pois': '🟢', 'Cresson': '🌿',
  'Blette': '🥬', 'Fenouil': '🌿', 'Haricot vert': '🫛', 'Poivron': '🫑',
  'Tomate': '🍅', 'Maïs': '🌽', 'Brocoli': '🥦', 'Courge': '🎃',
};

// Mapping nom français → chemin image locale dans public/foods/
export const FOOD_IMAGES = {
  // Fruits
  'Citron': '/foods/citron.png',
  'Clémentine': '/foods/clementine.png',
  'Kiwi': '/foods/kiwi.png',
  'Mandarine': '/foods/mandarine.png',
  'Orange': '/foods/orange.png',
  'Pamplemousse': '/foods/pamplemousse.png',
  'Pomme': '/foods/pomme.png',
  'Poire': '/foods/poire.png',
  'Fraise': '/foods/fraise.png',
  'Rhubarbe': '/foods/rhubarbe.png',
  'Cerise': '/foods/cerise.png',
  'Abricot': '/foods/abricot.png',
  'Framboise': '/foods/framboise.png',
  'Melon': '/foods/melon.png',
  'Nectarine': '/foods/nectarine.png',
  'Pêche': '/foods/peche.png',
  'Figue': '/foods/figue.png',
  'Cassis': '/foods/cassis.png',
  'Groseille': '/foods/groseille.png',
  'Myrtille': '/foods/myrtille.png',
  'Pastèque': '/foods/pasteque.png',
  'Prune': '/foods/prune.png',
  // 'Mirabelle' retiré : l'image était une prune foncée (les mirabelles sont jaunes) → emoji
  'Mûre': '/foods/mure.png',
  'Raisin': '/foods/raisin.png',
  // 'Châtaigne' retiré : l'image était un sachet emballé → emoji 🌰
  'Coing': '/foods/coing.png',
  'Noix': '/foods/noix.png',
  // Légumes
  'Betterave': '/foods/betterave.png',
  'Carotte': '/foods/carotte.png',
  'Céleri': '/foods/celeri.png',
  'Chou': '/foods/chou.png',
  'Chou-fleur': '/foods/chou-fleur.png',
  'Endive': '/foods/endive.png',
  'Épinard': '/foods/epinard.png',
  'Mâche': '/foods/mache.png',
  'Navet': '/foods/navet.png',
  'Panais': '/foods/panais.png',
  'Poireau': '/foods/poireau.png',
  'Potiron': '/foods/potiron.png',
  'Topinambour': '/foods/topinambour.png',
  'Asperge': '/foods/asperge.png',
  'Radis': '/foods/radis.png',
  'Artichaut': '/foods/artichaut.png',
  // 'Chou de Bruxelles' retiré : image jugée pas assez belle → emoji 🥬 (source dans design-sources/foods/)
  'Aubergine': '/foods/aubergine.png',
  'Concombre': '/foods/concombre.png',
  'Courgette': '/foods/courgette.png',
  'Laitue': '/foods/laitue.png',
  'Petit pois': '/foods/petit-pois.png',
  'Cresson': '/foods/cresson.png',
  'Blette': '/foods/blette.png',
  // 'Fenouil' retiré : l'image était un sachet de graines → emoji 🌿
  // 'Haricot vert' retiré : image jugée pas assez belle → emoji 🫛 (source dans design-sources/foods/)
  // 'Poivron' retiré : l'image était un moulin à poivre noir → emoji 🫑
  'Tomate': '/foods/tomate.png',
  // 'Maïs' retiré : l'image était une boîte de conserve → emoji 🌽
  'Brocoli': '/foods/brocoli.png',
  'Courge': '/foods/courge.png',
};

// Noms de mois en minuscules pour l'affichage saisonnier (« en juillet »)
export const SEASONAL_MONTH_NAMES = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

// Source officielle : calendrier de saison Manger Bouger, vérifié le 2026-07-05
// https://www.mangerbouger.fr/manger-mieux/bien-manger-sans-se-ruiner/calendrier-de-saison/les-fruits-et-legumes-de-[mois]
// Chaque mois = liste officielle Manger Bouger, limitée aux aliments présents dans FOOD_EMOJIS.
// Équivalences assumées : « Salade » (Manger Bouger) → 'Laitue' · « Pomelo » (janvier) → 'Pamplemousse'.
// Retirés partout car absents du calendrier Manger Bouger : Châtaigne, Noix (fruits à coque non couverts).
export const SEASONAL_FOODS = {
  1: { // Janvier
    fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Cresson', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
  2: { // Février
    fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Cresson', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Topinambour'],
  },
  3: { // Mars
    fruits: ['Kiwi', 'Orange', 'Pamplemousse', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Cresson', 'Endive', 'Épinard', 'Navet', 'Panais', 'Poireau', 'Radis'],
  },
  4: { // Avril
    fruits: ['Pamplemousse', 'Pomme', 'Rhubarbe'],
    legumes: ['Asperge', 'Betterave', 'Carotte', 'Cresson', 'Endive', 'Épinard', 'Fenouil', 'Laitue', 'Navet', 'Poireau', 'Radis'],
  },
  5: { // Mai
    fruits: ['Fraise', 'Pamplemousse', 'Rhubarbe'],
    legumes: ['Artichaut', 'Asperge', 'Carotte', 'Concombre', 'Courgette', 'Cresson', 'Épinard', 'Fenouil', 'Laitue', 'Navet', 'Petit pois', 'Radis'],
  },
  6: { // Juin
    fruits: ['Abricot', 'Cassis', 'Cerise', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Pamplemousse', 'Pastèque', 'Pêche', 'Rhubarbe'],
    legumes: ['Artichaut', 'Asperge', 'Aubergine', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Petit pois', 'Poivron', 'Radis', 'Tomate'],
  },
  7: { // Juillet
    fruits: ['Abricot', 'Cassis', 'Cerise', 'Figue', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Myrtille', 'Pastèque', 'Pêche', 'Prune'],
    legumes: ['Artichaut', 'Aubergine', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Maïs', 'Petit pois', 'Poivron', 'Radis', 'Tomate'],
  },
  8: { // Août
    fruits: ['Abricot', 'Cassis', 'Figue', 'Framboise', 'Groseille', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Poire', 'Pomme', 'Prune'],
    legumes: ['Artichaut', 'Aubergine', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Maïs', 'Poivron', 'Tomate'],
  },
  9: { // Septembre
    fruits: ['Figue', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Poire', 'Pomme', 'Prune', 'Raisin'],
    legumes: ['Artichaut', 'Aubergine', 'Blette', 'Brocoli', 'Carotte', 'Chou-fleur', 'Concombre', 'Courge', 'Courgette', 'Cresson', 'Épinard', 'Fenouil', 'Haricot vert', 'Laitue', 'Maïs', 'Poireau', 'Poivron', 'Potiron', 'Tomate'],
  },
  10: { // Octobre
    fruits: ['Coing', 'Figue', 'Poire', 'Pomme', 'Raisin'],
    legumes: ['Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Concombre', 'Courge', 'Courgette', 'Cresson', 'Endive', 'Épinard', 'Fenouil', 'Haricot vert', 'Laitue', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron'],
  },
  11: { // Novembre
    fruits: ['Clémentine', 'Kiwi', 'Mandarine', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Blette', 'Brocoli', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Cresson', 'Endive', 'Épinard', 'Fenouil', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
  12: { // Décembre
    fruits: ['Clémentine', 'Kiwi', 'Mandarine', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Cresson', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
};
