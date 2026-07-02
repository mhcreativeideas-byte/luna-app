// Génère les icônes LUNA en PNG à toutes les tailles, en 2 familles :
//   - "anneau"  : U du logo + anneau du cycle (fichiers icon-<variante>-*)
//   - "lettre"  : le U seul (fichiers icon-lettre-<variante>-*)
// 3 variantes chacune : ton sur ton rosé (principale/claire), rose foncé (U blanc), prune nuit (sombre).
// Usage : node scripts/generate-luna-icon.mjs [dossierSortie]
import sharp from 'sharp'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dir = path.dirname(fileURLToPath(import.meta.url))
const OUT = process.argv[2] || 'public/app-icon-preview'

// Tracé exact du U du logo LUNA (boîte 688x704, centre 344,352)
const { d: UPATHS } = JSON.parse(await readFile(path.join(__dir, 'luna-u-path.json'), 'utf8'))
const UD = UPATHS[0]

// Couleurs de phase exactes (charte LUNA)
const MEN = '#D4727F', FOL = '#7BAE7F', OVU = '#E8A87C', LUT = '#B09ACB'

// Géométrie (boîte carrée 1024, full-bleed — iOS applique lui-même le masque arrondi)
const CX = 512, CY = 512, R = 360, W = 76, UH = 340
// U seul : plus grand puisqu'il n'y a plus d'anneau autour
const UH_LETTRE = 600

function u(cx, cy, h, fill) {
  const s = h / 704
  const tx = cx - 344 * s, ty = cy - 352 * s
  return `<g transform="translate(${tx.toFixed(2)},${ty.toFixed(2)}) scale(${s.toFixed(4)})" fill="${fill}"><path d="${UD}"/></g>`
}
function ring(cx, cy, r, w) {
  return `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${MEN}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="M${cx + r} ${cy} A${r} ${r} 0 0 1 ${cx} ${cy + r}" fill="none" stroke="${FOL}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="M${cx} ${cy + r} A${r} ${r} 0 0 1 ${cx - r} ${cy}" fill="none" stroke="${OVU}" stroke-width="${w}" stroke-linecap="round"/>
  <path d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx} ${cy - r}" fill="none" stroke="${LUT}" stroke-width="${w}" stroke-linecap="round"/>`
}
export function iconSvg(bg, uColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  ${ring(CX, CY, R, W)}
  ${u(CX, CY, UH, uColor)}
</svg>`
}
// Icône "lettre seule" : juste le U, sans anneau
export function letterSvg(bg, uColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="${bg}"/>
  ${u(CX, CY, UH_LETTRE, uColor)}
</svg>`
}

const variants = [
  { name: 'rose',   bg: '#FDE8EB', u: '#C4727F' }, // ton sur ton rosé — principale (claire)
  { name: 'fonce',  bg: '#A85A66', u: '#FFFFFF' }, // rose foncé, U blanc
  { name: 'prune',  bg: '#33283B', u: '#FDF1F0' }, // prune nuit — sombre
]
const sizes = [1024, 512, 192, 180, 32, 16]

async function emit(prefix, buf) {
  await writeFile(path.join(OUT, `${prefix}.svg`), buf)
  for (const s of sizes) {
    await sharp(buf, { density: 384 }).resize(s, s).png().toFile(path.join(OUT, `${prefix}-${s}.png`))
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await mkdir(OUT, { recursive: true })
  for (const v of variants) {
    await emit(`icon-${v.name}`, Buffer.from(iconSvg(v.bg, v.u)))          // famille anneau
    await emit(`icon-lettre-${v.name}`, Buffer.from(letterSvg(v.bg, v.u))) // famille lettre seule
  }
  console.log('Icônes générées dans', OUT)
}
