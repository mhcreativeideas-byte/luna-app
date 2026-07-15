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
    return trimmedStart + out + after;
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
    return trimmedStart + out + after;
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
