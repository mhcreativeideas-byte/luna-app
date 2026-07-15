// Mise à l'échelle d'un ingrédient de recette selon un facteur (ex. « pour 2
// personnes » quand la recette est pour 1 → ×2). Utilisé par la liste de
// courses. Règle de sécurité ABSOLUE : si on ne sait pas parser la quantité
// avec certitude, on renvoie le texte INCHANGÉ (mieux vaut une ligne non
// multipliée qu'un calcul faux sur une liste de courses).

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Formate un rationnel num/den en quantité lisible.
// `measured` = unité de mesure (g, ml…) → on arrondit à un entier propre.
// Sinon (pièces, cuillères, pincées…) → on garde une jolie fraction.
function formatQuantity(num, den, measured) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  num /= g;
  den /= g;

  if (measured) {
    let v = num / den;
    // arrondis « de supermarché » : au multiple de 5 dès 20 (ex. 33,3 → 35),
    // à l'entier entre 5 et 20, au demi en dessous.
    if (v >= 20) v = Math.round(v / 5) * 5;
    else if (v >= 5) v = Math.round(v);
    else v = Math.round(v * 2) / 2;
    if (v <= 0) v = num / den; // ne jamais faire disparaître un ingrédient
    if (Number.isInteger(v)) return String(v);
    return String(v).replace('.', ',');
  }

  // Pièces / cuillères : entier + éventuelle fraction douce.
  if (den === 1) return String(num);

  const whole = Math.floor(num / den);
  const remNum = num - whole * den;
  // fraction restante remNum/den ∈ ]0,1[ → on l'aligne sur une fraction naturelle
  const frac = remNum / den;
  const NICE = [
    [0, ''],
    [1 / 4, '1/4'],
    [1 / 3, '1/3'],
    [1 / 2, '1/2'],
    [2 / 3, '2/3'],
    [3 / 4, '3/4'],
    [1, 'ROUND_UP'],
  ];
  let best = NICE[0];
  let bestDist = Infinity;
  for (const cand of NICE) {
    const d = Math.abs(frac - cand[0]);
    if (d < bestDist) {
      bestDist = d;
      best = cand;
    }
  }
  let w = whole;
  let fracLabel = best[1];
  if (fracLabel === 'ROUND_UP') {
    w += 1;
    fracLabel = '';
  }
  if (fracLabel === '' && w === 0) {
    // arrondi à zéro : on ne supprime pas, on garde la plus petite fraction sûre
    return '1/4';
  }
  if (w === 0) return fracLabel;
  if (fracLabel === '') return String(w);
  return `${w} ${fracLabel}`;
}

// Détecte, juste après la quantité, une unité de mesure (à arrondir).
const MEASURED_RE = /^\s*(g|kg|mg|ml|cl|dl|l|litres?|grammes?)\b/i;

// Unités / abréviations à NE PAS traiter comme un aliment comptable
// (pas d'accord de nombre dessus : « 2 c. à soupe », « 2 cm » sont corrects).
// « c. à soupe », « c.à.s », « càs », « cuillère »… + unités métriques.
// (le point de « c. » n'est pas une frontière de mot, d'où le \b seulement
// sur les unités alphabétiques.)
const UNIT_LEAD_RE = /^\s*(?:c\.|c\.à|càs|càc|cuils?|cuillères?|(?:g|kg|mg|ml|cl|dl|l|litres?|grammes?|cm|mm)\b)/i;

// Mots invariables (ou dont le « s » final fait partie du radical) : jamais
// de « s » ajouté, jamais retiré. Vérifié contre les ingrédients réels.
const INVARIABLE = new Set([
  'anis', 'radis', 'panais', 'ananas', 'jus', 'riz', 'cassis', 'gros',
  'concombre', 'épais', 'epais', 'frais',
]);

// Pluriels en -oux (les 7 exceptions courantes en cuisine : chou, genou…).
const OUX = new Set(['chou', 'genou', 'caillou', 'bijou', 'hibou', 'joujou', 'pou']);

// Accord d'un mot au singulier/pluriel (français, cas réguliers + garde-fous).
function agreeWord(word, plural) {
  const low = word.toLowerCase();
  if (INVARIABLE.has(low)) return word;
  if (plural) {
    if (/[sxz]$/i.test(word)) return word; // déjà pluriel ou invariable
    if (OUX.has(low)) return word + 'x'; // chou→choux
    if (/(eau|eu|au)$/i.test(word)) return word + 'x'; // morceau→morceaux
    return word + 's';
  }
  // singulier
  if (/eaux$/i.test(word)) return word.slice(0, -1); // morceaux→morceau
  if (/s$/i.test(word) && word.length > 3) return word.slice(0, -1);
  return word;
}

// Accorde le groupe nominal en tête (jusqu'à « de/d'/à/en/( , » ou un chiffre).
// Ex. « tranche épaisse de pain » ×2 → « tranches épaisses de pain ».
// On s'arrête au premier mot en Majuscule APRÈS le premier (dans ces données,
// c'est le nom de l'aliment : « pincée Cannelle » → « pincées Cannelle », la
// cannelle restant au singulier). Les adjectifs (minuscules) s'accordent.
function agreeNounPhrase(after, plural) {
  const lead = after.match(/^\s*/)[0];
  const body = after.slice(lead.length);
  const stop = body.search(/\b(de|d'|à|au|aux|en|pour|avec|sans|ou)\b|[,(%\d]/i);
  const head = stop === -1 ? body : body.slice(0, stop);
  const tail = stop === -1 ? '' : body.slice(stop);

  let firstDone = false;
  let stopped = false;
  const agreed = head.replace(/[A-Za-zÀ-ÿŒœŸ']+/g, (w) => {
    if (stopped || w.includes("'")) return w;
    if (!firstDone) {
      firstDone = true;
      return agreeWord(w, plural); // le mot porté par le nombre s'accorde toujours
    }
    // mot suivant en Majuscule = nom d'aliment distinct → on n'y touche pas (ni à la suite)
    if (/^[A-ZÀ-ÞŒŸ]/.test(w)) {
      stopped = true;
      return w;
    }
    return agreeWord(w, plural); // adjectif en minuscule → accord
  });
  return lead + agreed + tail;
}

// Accorde le nom qui suit la quantité, sauf si c'est une unité de mesure
// (« 2 c. à soupe », « 100 g » : rien à accorder). qty = quantité finale.
function adjustAfter(after, qty, measured) {
  if (measured || UNIT_LEAD_RE.test(after)) return after;
  return agreeNounPhrase(after, qty >= 2);
}

/**
 * Multiplie la quantité en tête d'un ingrédient par `factor`.
 * @param {string} text   ex. "1/2 avocat mûr", "50g de flocons"
 * @param {number} factor ex. 2 (double), 0.5 (moitié)
 * @returns {string} le texte mis à l'échelle, ou inchangé si non parsable.
 */
export function scaleIngredient(text, factor) {
  if (!text || typeof text !== 'string') return text;
  if (!(factor > 0) || factor === 1) return text;

  // Facteur en rationnel exact quand c'est simple (target/servings), sinon approx.
  let fN;
  let fD;
  const asFrac = approximateFraction(factor);
  fN = asFrac.n;
  fD = asFrac.d;

  const trimmedStart = text.match(/^\s*/)[0];
  const rest = text.slice(trimmedStart.length);

  // Plage (« 1-2 sachets ») : trop vague, on ne touche pas.
  if (/^\d+\s*[-à]\s*\d+/.test(rest)) return text;

  // Fraction « a/b … »
  let m = rest.match(/^(\d+)\s*\/\s*(\d+)/);
  if (m) {
    const vN = parseInt(m[1], 10);
    const vD = parseInt(m[2], 10);
    if (vD === 0) return text;
    const after = rest.slice(m[0].length);
    const measured = MEASURED_RE.test(after);
    const out = formatQuantity(vN * fN, vD * fD, measured);
    const adjusted = adjustAfter(after, (vN * fN) / (vD * fD), measured);
    return trimmedStart + out + adjusted;
  }

  // Entier ou décimal « 50 », « 1,5 »
  m = rest.match(/^(\d+)(?:[.,](\d+))?/);
  if (m) {
    const intPart = m[1];
    const decPart = m[2];
    let vN;
    let vD;
    if (decPart) {
      vN = parseInt(intPart + decPart, 10);
      vD = Math.pow(10, decPart.length);
    } else {
      vN = parseInt(intPart, 10);
      vD = 1;
    }
    const after = rest.slice(m[0].length);
    const measured = MEASURED_RE.test(after);
    const out = formatQuantity(vN * fN, vD * fD, measured);
    const adjusted = adjustAfter(after, (vN * fN) / (vD * fD), measured);
    return trimmedStart + out + adjusted;
  }

  // Pas de quantité en tête (« Sel, poivre », « quelques feuilles… ») → inchangé.
  return text;
}

// Rationnel simple à partir d'un facteur. Pour nos usages, factor = cible/portions
// avec cible et portions entiers ≤ ~8, donc factor est déjà rationnel simple.
function approximateFraction(x) {
  // cherche un petit dénominateur qui colle (jusqu'à 12)
  for (let d = 1; d <= 12; d++) {
    const n = Math.round(x * d);
    if (Math.abs(n / d - x) < 1e-9) return { n, d };
  }
  // repli : deux décimales
  return { n: Math.round(x * 100), d: 100 };
}

/**
 * Met à l'échelle une liste d'ingrédients.
 * @param {string[]} ingredients
 * @param {number} factor
 * @returns {string[]}
 */
export function scaleIngredients(ingredients, factor) {
  if (!Array.isArray(ingredients)) return ingredients;
  if (!(factor > 0) || factor === 1) return ingredients;
  return ingredients.map((ing) => scaleIngredient(ing, factor));
}
