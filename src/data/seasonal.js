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
  'Blette': '🥬', 'Fenouil': '🌿', 'Haricot vert': '🫘', 'Poivron': '🫑',
  'Tomate': '🍅', 'Maïs': '🌽', 'Brocoli': '🥦', 'Courge': '🎃',
};

export const SEASONAL_FOODS = {
  1: { // Janvier
    fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Pomme', 'Poire'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou-fleur', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
  2: { // Février
    fruits: ['Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Pomme', 'Poire'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Topinambour'],
  },
  3: { // Mars
    fruits: ['Citron', 'Kiwi', 'Orange', 'Pamplemousse', 'Pomme', 'Poire'],
    legumes: ['Asperge', 'Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou-fleur', 'Endive', 'Épinard', 'Navet', 'Panais', 'Poireau', 'Radis', 'Topinambour'],
  },
  4: { // Avril
    fruits: ['Citron', 'Fraise', 'Kiwi', 'Pomme', 'Rhubarbe'],
    legumes: ['Artichaut', 'Asperge', 'Betterave', 'Carotte', 'Chou-fleur', 'Cresson', 'Épinard', 'Laitue', 'Navet', 'Petit pois', 'Poireau', 'Radis'],
  },
  5: { // Mai
    fruits: ['Cerise', 'Fraise', 'Rhubarbe', 'Pomme', 'Kiwi'],
    legumes: ['Artichaut', 'Asperge', 'Aubergine', 'Betterave', 'Carotte', 'Chou-fleur', 'Concombre', 'Courgette', 'Épinard', 'Laitue', 'Petit pois', 'Radis'],
  },
  6: { // Juin
    fruits: ['Abricot', 'Cerise', 'Fraise', 'Framboise', 'Melon', 'Nectarine', 'Pêche', 'Rhubarbe'],
    legumes: ['Artichaut', 'Asperge', 'Aubergine', 'Betterave', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Petit pois', 'Poivron', 'Radis', 'Tomate'],
  },
  7: { // Juillet
    fruits: ['Abricot', 'Cassis', 'Cerise', 'Figue', 'Fraise', 'Framboise', 'Groseille', 'Melon', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Prune'],
    legumes: ['Artichaut', 'Aubergine', 'Betterave', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Maïs', 'Poivron', 'Radis', 'Tomate'],
  },
  8: { // Août
    fruits: ['Abricot', 'Cassis', 'Figue', 'Framboise', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Nectarine', 'Pastèque', 'Pêche', 'Poire', 'Prune', 'Raisin'],
    legumes: ['Artichaut', 'Aubergine', 'Betterave', 'Blette', 'Carotte', 'Concombre', 'Courgette', 'Fenouil', 'Haricot vert', 'Laitue', 'Maïs', 'Poivron', 'Radis', 'Tomate'],
  },
  9: { // Septembre
    fruits: ['Figue', 'Framboise', 'Melon', 'Mirabelle', 'Mûre', 'Myrtille', 'Pêche', 'Poire', 'Pomme', 'Prune', 'Raisin'],
    legumes: ['Artichaut', 'Aubergine', 'Betterave', 'Blette', 'Brocoli', 'Carotte', 'Chou', 'Concombre', 'Courgette', 'Épinard', 'Fenouil', 'Haricot vert', 'Laitue', 'Poivron', 'Tomate'],
  },
  10: { // Octobre
    fruits: ['Châtaigne', 'Coing', 'Figue', 'Noix', 'Poire', 'Pomme', 'Raisin'],
    legumes: ['Betterave', 'Brocoli', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Endive', 'Épinard', 'Fenouil', 'Navet', 'Panais', 'Poireau', 'Potiron'],
  },
  11: { // Novembre
    fruits: ['Châtaigne', 'Citron', 'Clémentine', 'Coing', 'Kiwi', 'Mandarine', 'Noix', 'Orange', 'Poire', 'Pomme'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Courge', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
  12: { // Décembre
    fruits: ['Châtaigne', 'Citron', 'Clémentine', 'Kiwi', 'Mandarine', 'Orange', 'Pamplemousse', 'Pomme', 'Poire'],
    legumes: ['Betterave', 'Carotte', 'Céleri', 'Chou', 'Chou de Bruxelles', 'Chou-fleur', 'Endive', 'Épinard', 'Mâche', 'Navet', 'Panais', 'Poireau', 'Potiron', 'Topinambour'],
  },
};
