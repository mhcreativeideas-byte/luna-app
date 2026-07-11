import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { Send, Check, Pencil, Plus, Sparkles } from 'lucide-react';
import { SkeletonCard } from '../ui/SkeletonLoader';
import logoLuna from '../../assets/wordmark-luna-noir.png';

// Carte « Partage ta phase » : la femme prépare une jolie carte de sa phase
// et l'envoie à son partenaire (image PNG via canvas + partage natif).
// Design validé 2026-07-11 : fond flouté doux aux couleurs officielles de la
// phase, anneau du cycle avec point de progression posé SUR l'anneau selon
// le jour, humeur en héros, étiquettes, liste d'actions « Tu peux : » écrite
// pour lui, petit mot optionnel, wordmark luna en bas à droite.

// Le wordmark est préchargé une fois pour pouvoir le dessiner en synchrone
// dans le canvas (le partage web doit partir dans le geste du tap).
const logoImg = typeof window !== 'undefined' ? new window.Image() : null;
if (logoImg) logoImg.src = logoLuna;

const PHASE_ORDER = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

// Couleurs officielles de la charte (src/index.css) : ne pas dévier.
// blob = teinte du halo flouté secondaire (rose clair pour menstruelle).
const PHASE_COLORS = {
  menstrual: { bg: '#D4727F', bgLight: '#FDE8EB', accent: '#A85A66', blob: '#E8A5AE' },
  follicular: { bg: '#7BAE7F', bgLight: '#EDF5ED', accent: '#4D7A50', blob: '#7BAE7F' },
  ovulatory: { bg: '#E8A87C', bgLight: '#FFF3EB', accent: '#C47A4A', blob: '#E8A87C' },
  luteal: { bg: '#B09ACB', bgLight: '#F3EEF8', accent: '#7D6A96', blob: '#B09ACB' },
};

// ─── Humeurs proposées par phase (le héros de la carte) ───
const MOODS = {
  menstrual: [
    { label: 'Douceur', headline: 'J\'ai besoin de douceur' },
    { label: 'Cocon', headline: 'Envie de me cocooner' },
    { label: 'Sensible', headline: 'Je me sens sensible' },
    { label: 'Fatiguée', headline: 'Je suis fatiguée aujourd\'hui' },
  ],
  follicular: [
    { label: 'Pleine d\'élan', headline: 'Je déborde d\'énergie' },
    { label: 'Motivée', headline: 'J\'ai envie de me lancer' },
    { label: 'Créative', headline: 'Plein d\'idées en tête' },
    { label: 'Partante', headline: 'Partante pour une aventure' },
  ],
  ovulatory: [
    { label: 'Rayonnante', headline: 'Je rayonne aujourd\'hui' },
    { label: 'Complice', headline: 'Envie de complicité ce soir' },
    { label: 'Sociable', headline: 'D\'humeur à tout partager' },
    { label: 'Confiante', headline: 'Je me sens au top' },
  ],
  luteal: [
    { label: 'Cocon', headline: 'Mode cocon activé' },
    { label: 'Sensible', headline: 'Un peu à fleur de peau' },
    { label: 'Patiente', headline: 'Sois patient avec moi' },
    { label: 'Ralentie', headline: 'J\'ai besoin de ralentir' },
  ],
};

// ─── Étiquettes (pastilles) par phase ───
const TAG_POOLS = {
  menstrual: ['Repos', 'Douceur', 'Patience', 'Câlins', 'Calme', 'Cocooning'],
  follicular: ['Élan', 'Spontanéité', 'Projets', 'Énergie', 'Nouveautés', 'Motivation'],
  ovulatory: ['Complicité', 'Échanges', 'Énergie', 'Sorties', 'Connexion', 'Confiance'],
  luteal: ['Patience', 'Calme', 'Douceur', 'Cocon', 'Réconfort', 'Lenteur'],
};

// ─── « Tu peux : » actions concrètes proposées au partenaire ───
const ACTION_POOLS = {
  menstrual: [
    'Préparer un plat bien réconfortant',
    'Apporter une boisson chaude',
    'Un câlin sans rien dire',
    'Prévoir une soirée cocooning',
    'Une bouillotte, un plaid',
    'Éviter les remarques sur ma fatigue',
  ],
  follicular: [
    'Proposer une sortie spontanée',
    'Encourager mes nouvelles idées',
    'Tester un nouveau restaurant à deux',
    'Planifier un week-end ensemble',
    'Suivre mon rythme, il est rapide',
  ],
  ovulatory: [
    'Organiser un vrai moment à deux',
    'Lancer les grandes discussions',
    'Prévoir une sortie où on se fait beaux',
    'Un repas léger à partager',
    'Me garder ta soirée',
  ],
  luteal: [
    'Proposer un thé ou un chocolat chaud',
    'Un plaid, un film, zéro programme',
    'Éviter les sujets qui fâchent ce soir',
    'Du chocolat, sans commentaire',
    'Être patient si je suis à fleur de peau',
  ],
};

// Énergie « douce » : un mot + des points (jamais de pourcentage).
function getEnergy(level) {
  if (level <= 35) return { word: 'énergie douce', dots: 1 };
  if (level <= 65) return { word: 'énergie tranquille', dots: 2 };
  return { word: 'pleine énergie', dots: 3 };
}

// Position (en radians, sens horaire depuis le haut) du jour sur l'anneau.
function cycleAngle(cycleInfo) {
  const len = Math.max(1, cycleInfo.cycleLength || 28);
  const day = Math.min(Math.max(1, cycleInfo.currentDay || 1), len);
  return ((day - 1) / len) * Math.PI * 2;
}

// ─────────────────────────────────────────────────────────────
//  Génération de l'image partagée (canvas → PNG)
// ─────────────────────────────────────────────────────────────
function wrapText(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function generateShareCanvas(cycleInfo, userName, state) {
  const phase = cycleInfo.phase;
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.menstrual;
  const phaseData = cycleInfo.phaseData;
  const energy = getEnergy(cycleInfo.energyLevel);
  const serif = '"Playfair Display", Georgia, serif';
  const sans = 'system-ui, -apple-system, sans-serif';
  const W = 600;
  const PAD = 44;
  const innerW = W - PAD * 2;

  const tags = state.sections.tags.enabled ? state.sections.tags.items : [];
  const actions = state.sections.actions.enabled ? state.sections.actions.items : [];

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');

  // Passe 1 : mesure la hauteur totale. Passe 2 : dessine.
  const layout = (drawing) => {
    const H = canvas.height;

    if (drawing) {
      // Fond : crème → teinte de phase, + halos floutés dans les couleurs
      // officielles (effet « photo hors focus »).
      const base = ctx.createLinearGradient(0, 0, 0, H);
      base.addColorStop(0, '#FAF8F5');
      base.addColorStop(0.65, colors.bgLight);
      base.addColorStop(1, colors.bgLight);
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);
      const blob = (x, y, r, c, a) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, c + a);
        g.addColorStop(1, c + '00');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      };
      blob(W * 0.78, H * 0.12, 200, colors.bg, '66');
      blob(W * 0.20, H * 0.38, 300, colors.blob, '59');
      blob(W * 0.72, H * 0.88, 340, colors.bg, '4D');
    }

    // ── Anneau du cycle ──
    const R = 142;
    const cx = W / 2;
    const cy = 46 + R;
    if (drawing) {
      ctx.strokeStyle = colors.bg + '8C';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      // Point de progression posé SUR l'anneau, à la position du jour.
      const angle = cycleAngle(cycleInfo);
      ctx.beginPath();
      ctx.arc(cx + R * Math.sin(angle), cy - R * Math.cos(angle), 11, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg;
      ctx.fill();

      // Les 3 autres phases en petits points aux cardinaux (on saute le
      // cardinal le plus proche du gros point pour ne pas le chevaucher).
      const nearest = Math.round(angle / (Math.PI / 2)) % 4;
      const others = PHASE_ORDER.filter((p) => p !== phase);
      let oi = 0;
      [0, 1, 2, 3].forEach((card) => {
        if (card === nearest || oi >= others.length) return;
        const a = (card * Math.PI) / 2;
        ctx.beginPath();
        ctx.arc(cx + R * Math.sin(a), cy - R * Math.cos(a), 5.5, 0, Math.PI * 2);
        ctx.fillStyle = PHASE_COLORS[others[oi]].bg + '80';
        ctx.fill();
        oi += 1;
      });

      // Textes au centre de l'anneau
      ctx.textAlign = 'center';
      ctx.fillStyle = colors.accent;
      ctx.font = `600 12px ${sans}`;
      ctx.letterSpacing = '4px';
      ctx.fillText('PHASE', cx + 2, cy - 52);
      ctx.letterSpacing = '0px';
      ctx.font = `600 36px ${serif}`;
      ctx.fillStyle = '#2D2226';
      ctx.fillText(phaseData.shortName || phaseData.name, cx, cy - 12);
      if (state.showCycleDay) {
        ctx.font = `14px ${sans}`;
        ctx.fillStyle = '#756568';
        ctx.fillText(`jour ${cycleInfo.currentDay}`, cx, cy + 16);
      }
      // Énergie : mot + 3 points
      const ey = cy + (state.showCycleDay ? 46 : 34);
      ctx.font = `13px ${sans}`;
      const ew = ctx.measureText(energy.word).width;
      const dotsW = 3 * 9 + 2 * 5;
      const startX = cx - (ew + 10 + dotsW) / 2;
      ctx.textAlign = 'left';
      ctx.fillStyle = colors.accent;
      ctx.fillText(energy.word, startX, ey + 4);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(startX + ew + 10 + 4.5 + i * 14, ey, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = i < energy.dots ? colors.bg : colors.bg + '40';
        ctx.fill();
      }
    }

    let y = 46 + 2 * R + 56;

    // ── Humeur du jour (héros) ──
    ctx.font = `italic 500 25px ${serif}`;
    const hl = wrapText(ctx, `« ${state.headline} »`, innerW);
    if (drawing) {
      ctx.fillStyle = '#2D2226';
      ctx.textAlign = 'center';
      hl.forEach((ln, i) => ctx.fillText(ln, W / 2, y + i * 33));
    }
    y += (hl.length - 1) * 33 + 24;

    // ── Étiquettes (pastilles blanches centrées) ──
    if (tags.length) {
      ctx.font = `500 15px ${sans}`;
      const padX = 15, gap = 8, h = 32;
      const rows = [];
      let row = [], rw = 0;
      tags.forEach((t) => {
        const cw = ctx.measureText(t).width + padX * 2;
        const need = cw + (row.length ? gap : 0);
        if (rw + need > innerW && row.length) {
          rows.push({ row, rw });
          row = [];
          rw = 0;
        }
        row.push({ t, cw });
        rw += cw + (row.length > 1 ? gap : 0);
      });
      if (row.length) rows.push({ row, rw });
      rows.forEach((r) => {
        let x = (W - r.rw) / 2;
        r.row.forEach(({ t, cw }) => {
          if (drawing) {
            ctx.fillStyle = 'rgba(255,255,255,0.72)';
            ctx.beginPath(); ctx.roundRect(x, y, cw, h, 16); ctx.fill();
            ctx.fillStyle = colors.accent;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(t, x + cw / 2, y + h / 2 + 1);
            ctx.textBaseline = 'alphabetic';
          }
          x += cw + gap;
        });
        y += h + 9;
      });
      y += 12;
    }

    // ── « Tu peux : » liste d'actions pour lui ──
    if (actions.length) {
      if (drawing) {
        ctx.strokeStyle = colors.bg + '40';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(PAD, y);
        ctx.lineTo(W - PAD, y);
        ctx.stroke();
      }
      y += 30;
      if (drawing) {
        ctx.font = `600 12px ${sans}`;
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'left';
        ctx.letterSpacing = '3px';
        ctx.fillText('TU PEUX :', PAD, y);
        ctx.letterSpacing = '0px';
      }
      y += 26;
      ctx.font = `15px ${sans}`;
      actions.forEach((item) => {
        const lines = wrapText(ctx, item, innerW - 32);
        if (drawing) {
          ctx.strokeStyle = colors.bg;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(PAD + 8, y + 3, 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#4A3F43';
          ctx.textAlign = 'left';
          lines.forEach((ln, i) => ctx.fillText(ln, PAD + 28, y + 8 + i * 21));
        }
        y += lines.length * 21 + 12;
      });
      y += 8;
    }

    // ── Petit mot perso (encadré blanc) ──
    if (state.personalEnabled && state.personalMsg.trim()) {
      ctx.font = `italic 15px ${serif}`;
      const ml = wrapText(ctx, `« ${state.personalMsg.trim()} »`, innerW - 36);
      const bh = ml.length * 22 + 26;
      if (drawing) {
        ctx.fillStyle = 'rgba(255,255,255,0.78)';
        ctx.beginPath(); ctx.roundRect(PAD, y, innerW, bh, 14); ctx.fill();
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'left';
        ml.forEach((ln, i) => ctx.fillText(ln, PAD + 18, y + 27 + i * 22));
      }
      y += bh + 20;
    }

    // ── Signature + wordmark luna (transparent, jamais de fond) ──
    y += 6;
    if (drawing) {
      ctx.font = `italic 16px ${serif}`;
      ctx.fillStyle = colors.accent;
      ctx.textAlign = 'left';
      if (userName) ctx.fillText(userName, PAD, y + 12);
      if (logoImg && logoImg.complete && logoImg.naturalWidth) {
        const lh = 17;
        const lw = logoImg.naturalWidth * (lh / logoImg.naturalHeight);
        ctx.globalAlpha = 0.85;
        ctx.drawImage(logoImg, W - PAD - lw, y - 1, lw, lh);
        ctx.globalAlpha = 1;
      } else {
        ctx.font = `600 13px ${sans}`;
        ctx.fillStyle = '#756568';
        ctx.textAlign = 'right';
        ctx.fillText('luna', W - PAD, y + 12);
      }
    }
    y += 42;

    return y;
  };

  canvas.height = Math.max(720, layout(false));
  layout(true);
  return canvas;
}

// ─────────────────────────────────────────────────────────────
//  Petits composants d'interface
// ─────────────────────────────────────────────────────────────
function Switch({ on, colors }) {
  return (
    <div
      className="w-9 h-5 rounded-full flex items-center px-0.5 flex-none transition-colors duration-200"
      style={{ backgroundColor: on ? colors.bg : '#D9D2D4' }}
    >
      <div
        className="w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
        style={{ transform: on ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </div>
  );
}

// Une section : interrupteur + pastilles à sélectionner + ajout perso.
function ChipSection({ label, emoji, enabled, items, pool, onToggle, onChange, colors }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');

  const shown = [...pool, ...items.filter((i) => !pool.includes(i))];

  const toggleChip = (val) => {
    onChange(items.includes(val) ? items.filter((x) => x !== val) : [...items, val]);
  };
  const addCustom = () => {
    const v = value.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setValue('');
    setAdding(false);
  };

  return (
    <div className="py-1">
      <button onClick={onToggle} className="flex items-center justify-between w-full py-1.5">
        <span className="font-body text-sm font-semibold text-luna-text">
          {emoji}&nbsp; {label}
        </span>
        <Switch on={enabled} colors={colors} />
      </button>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pt-1.5 pb-2">
              {shown.map((chip) => {
                const active = items.includes(chip);
                return (
                  <button
                    key={chip}
                    onClick={() => toggleChip(chip)}
                    className="text-xs font-body font-medium px-3 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1"
                    style={
                      active
                        ? { backgroundColor: colors.bg, color: '#fff' }
                        : { backgroundColor: '#FAF7F5', color: '#9A8C8F', border: '0.5px solid #EADFE1' }
                    }
                  >
                    {active && <Check size={11} />}
                    {chip}
                  </button>
                );
              })}
              {adding ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                    placeholder="Écrire..."
                    className="text-xs font-body bg-white border rounded-full px-3 py-1.5 outline-none w-32"
                    style={{ borderColor: colors.bg }}
                    autoFocus
                  />
                  <button onClick={addCustom} className="p-1"><Check size={13} style={{ color: colors.bg }} /></button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="text-xs font-body font-medium px-3 py-1.5 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: '#FAF7F5', color: '#756568', border: `0.5px dashed ${colors.bg}66` }}
                >
                  <Plus size={11} /> écrire
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Aperçu live de la carte (HTML, fidèle au PNG partagé)
// ─────────────────────────────────────────────────────────────
function PreviewCard({ cycleInfo, name, headline, sections, personalEnabled, personalMsg, showCycleDay, colors }) {
  const phase = cycleInfo.phase;
  const phaseData = cycleInfo.phaseData;
  const energy = getEnergy(cycleInfo.energyLevel);
  const tags = sections.tags.enabled ? sections.tags.items : [];
  const actions = sections.actions.enabled ? sections.actions.items : [];

  const RING = 200;
  const R = RING / 2;
  const angle = cycleAngle(cycleInfo);
  const dotX = R + R * Math.sin(angle) - 6;
  const dotY = R - R * Math.cos(angle) - 6;
  const nearest = Math.round(angle / (Math.PI / 2)) % 4;
  const others = PHASE_ORDER.filter((p) => p !== phase);
  const smallDots = [0, 1, 2, 3]
    .filter((c) => c !== nearest)
    .map((c, i) => {
      const a = (c * Math.PI) / 2;
      return {
        x: R + R * Math.sin(a) - 3,
        y: R - R * Math.cos(a) - 3,
        color: PHASE_COLORS[others[i]]?.bg,
      };
    });

  return (
    <div
      className="rounded-[26px] overflow-hidden relative"
      style={{
        background: `radial-gradient(110px 160px at 78% 12%, ${colors.bg}66 0%, transparent 70%), radial-gradient(180px 240px at 20% 38%, ${colors.blob}59 0%, transparent 70%), radial-gradient(220px 280px at 72% 88%, ${colors.bg}4D 0%, transparent 75%), linear-gradient(180deg, #FAF8F5 0%, ${colors.bgLight} 65%)`,
        border: `0.5px solid ${colors.bg}30`,
      }}
    >
      <div className="px-6 pt-6 pb-5">
        {/* Anneau du cycle */}
        <div className="relative mx-auto" style={{ width: RING, height: RING }}>
          <div className="absolute inset-0 rounded-full" style={{ border: `1.5px solid ${colors.bg}8C` }} />
          <div
            className="absolute rounded-full"
            style={{ left: dotX, top: dotY, width: 12, height: 12, backgroundColor: colors.bg }}
          />
          {smallDots.map((d, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{ left: d.x, top: d.y, width: 6, height: 6, backgroundColor: d.color, opacity: 0.5 }}
            />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-body font-semibold" style={{ color: colors.accent, letterSpacing: '2.5px' }}>
              PHASE
            </p>
            <p className="font-display leading-tight mt-0.5" style={{ fontSize: 25, fontWeight: 600, color: '#2D2226' }}>
              {phaseData.shortName || phaseData.name}
            </p>
            {showCycleDay && (
              <p className="text-[11px] font-body mt-1" style={{ color: '#756568' }}>jour {cycleInfo.currentDay}</p>
            )}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] font-body" style={{ color: colors.accent }}>{energy.word}</span>
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: colors.bg, opacity: i < energy.dots ? 1 : 0.25 }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Humeur */}
        <p className="font-display italic text-center mt-4" style={{ fontSize: 18, color: '#2D2226' }}>
          « {headline} »
        </p>

        {/* Étiquettes */}
        {tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-1.5 mt-3">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-body font-medium px-3 py-1 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.72)', color: colors.accent }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Tu peux : */}
        {actions.length > 0 && (
          <>
            <div className="h-px mt-4 mb-3" style={{ backgroundColor: `${colors.bg}40` }} />
            <p className="text-[10px] font-body font-semibold mb-2.5" style={{ color: colors.accent, letterSpacing: '2px' }}>
              TU PEUX :
            </p>
            <div className="flex flex-col gap-2.5">
              {actions.map((it) => (
                <div key={it} className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full flex-none"
                    style={{ border: `1.2px solid ${colors.bg}` }}
                  />
                  <span className="text-xs font-body" style={{ color: '#4A3F43' }}>{it}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Petit mot */}
        {personalEnabled && personalMsg.trim() && (
          <div className="rounded-[13px] px-3.5 py-2.5 mt-4" style={{ backgroundColor: 'rgba(255,255,255,0.78)' }}>
            <p className="font-display italic text-xs leading-snug" style={{ color: colors.accent }}>
              « {personalMsg.trim()} »
            </p>
          </div>
        )}

        {/* Signature + logo */}
        <div className="flex items-center justify-between mt-4">
          {name ? (
            <p className="font-display italic text-sm" style={{ color: colors.accent }}>{name}</p>
          ) : <span />}
          <img src={logoLuna} alt="luna" className="h-[15px] w-auto opacity-80" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Composant principal
// ─────────────────────────────────────────────────────────────
export default function SharePartnerCard({ cycleInfo, name }) {
  const phase = cycleInfo?.phase;
  const colors = PHASE_COLORS[phase] || PHASE_COLORS.menstrual;
  const moods = MOODS[phase] || MOODS.menstrual;
  const tagPool = TAG_POOLS[phase] || TAG_POOLS.menstrual;
  const actionPool = ACTION_POOLS[phase] || ACTION_POOLS.menstrual;

  const [shared, setShared] = useState(false);
  const [editing, setEditing] = useState(false);

  const [headline, setHeadline] = useState(moods[0].headline);
  const [customMood, setCustomMood] = useState(false);
  const [sections, setSections] = useState(() => ({
    tags: { enabled: true, items: tagPool.slice(0, 3) },
    actions: { enabled: true, items: actionPool.slice(0, 3) },
  }));
  const [personalEnabled, setPersonalEnabled] = useState(false);
  const [personalMsg, setPersonalMsg] = useState('');
  const [showCycleDay, setShowCycleDay] = useState(false);

  const state = useMemo(
    () => ({ headline, sections, personalEnabled, personalMsg, showCycleDay }),
    [headline, sections, personalEnabled, personalMsg, showCycleDay]
  );

  if (!cycleInfo) return <SkeletonCard height={280} />;

  const toggleSection = (key) =>
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  const changeSection = (key, items) =>
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], items } }));

  // Deux chemins de partage :
  // - App native (Capacitor) : navigator.share n'existe pas dans la WebView.
  //   On écrit le PNG dans le cache puis on ouvre la feuille de partage iOS
  //   via le plugin Share.
  // - Web (Safari) : navigator.share doit partir dans le même geste que le
  //   tap, sans await préalable. On prépare donc l'image en synchrone.
  const handleShare = () => {
    let dataUrl;
    try {
      const canvas = generateShareCanvas(cycleInfo, name, state);
      dataUrl = canvas.toDataURL('image/png');
    } catch {
      return;
    }

    const confirmSent = () => { setShared(true); setTimeout(() => setShared(false), 3000); };

    if (Capacitor.isNativePlatform()) {
      (async () => {
        try {
          const [{ Filesystem, Directory }, { Share }] = await Promise.all([
            import('@capacitor/filesystem'),
            import('@capacitor/share'),
          ]);
          const { uri } = await Filesystem.writeFile({
            path: 'luna-phase.png',
            data: dataUrl.split(',')[1],
            directory: Directory.Cache,
          });
          await Share.share({ title: `luna : ${cycleInfo.phaseData.name}`, files: [uri] });
          confirmSent();
        } catch {
          // Partage annulé par l'utilisatrice : on ne fait rien.
        }
      })();
      return;
    }

    let file;
    try {
      const bin = atob(dataUrl.split(',')[1]);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      file = new File([bytes], 'luna-phase.png', { type: 'image/png' });
    } catch {
      return;
    }

    const download = () => {
      const link = document.createElement('a');
      link.download = 'luna-phase.png';
      link.href = dataUrl;
      link.click();
      confirmSent();
    };

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator
        .share({
          title: `luna : ${cycleInfo.phaseData.name}`,
          text: `${headline}. Voici ma carte du jour 💜`,
          files: [file],
        })
        .then(confirmSent)
        .catch((err) => { if (err.name !== 'AbortError') download(); });
    } else {
      download();
    }
  };

  return (
    <div className="pb-2">
      <p className="text-sm text-luna-text-muted font-body mb-4 leading-relaxed text-center">
        Prépare une jolie carte de ta phase et envoie-la à ton partenaire pour qu'il te comprenne aujourd'hui.
      </p>

      {/* Aperçu live */}
      <PreviewCard
        cycleInfo={cycleInfo}
        name={name}
        headline={headline}
        sections={sections}
        personalEnabled={personalEnabled}
        personalMsg={personalMsg}
        showCycleDay={showCycleDay}
        colors={colors}
      />

      {/* Bouton Personnaliser */}
      <button
        onClick={() => setEditing(!editing)}
        className="flex items-center justify-center gap-1.5 w-full mt-3 py-2.5 rounded-full text-sm font-body font-medium transition-all active:scale-[0.98]"
        style={{ backgroundColor: editing ? colors.bg : `${colors.bg}15`, color: editing ? '#fff' : colors.accent }}
      >
        <Pencil size={13} />
        {editing ? 'Terminer la personnalisation' : 'Personnaliser ma carte'}
      </button>

      {/* Panneau d'édition */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-[18px] p-4 mt-3"
              style={{ backgroundColor: colors.bgLight, border: `0.5px solid ${colors.bg}20` }}
            >
              {/* Humeur du jour */}
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={13} style={{ color: colors.accent }} />
                <p className="text-[11px] font-body font-semibold uppercase tracking-wider" style={{ color: colors.accent }}>
                  Ton humeur du jour
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {moods.map((m) => {
                  const active = !customMood && headline === m.headline;
                  return (
                    <button
                      key={m.label}
                      onClick={() => { setHeadline(m.headline); setCustomMood(false); }}
                      className="text-xs font-body font-medium px-3 py-1.5 rounded-full transition-all active:scale-95"
                      style={
                        active
                          ? { backgroundColor: colors.bg, color: '#fff' }
                          : { backgroundColor: `${colors.bg}12`, color: colors.accent }
                      }
                    >
                      {m.label}
                    </button>
                  );
                })}
                <button
                  onClick={() => { setCustomMood(true); setHeadline(''); }}
                  className="text-xs font-body font-medium px-3 py-1.5 rounded-full flex items-center gap-1"
                  style={{ backgroundColor: '#FAF7F5', color: '#756568', border: `0.5px dashed ${colors.bg}66` }}
                >
                  <Plus size={11} /> écrire
                </button>
              </div>
              {customMood && (
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Écris ton humeur, ex : J'ai besoin d'un câlin"
                  maxLength={42}
                  className="w-full text-sm font-body bg-white border rounded-xl px-3 py-2 outline-none mt-2"
                  style={{ borderColor: `${colors.bg}55` }}
                  autoFocus
                />
              )}
              <p className="text-[11px] font-body text-luna-text-hint mt-2 leading-relaxed">
                luna te propose des idées par phase. Tape dessus pour les ajouter ou les retirer.
              </p>

              <div className="h-px my-3" style={{ backgroundColor: `${colors.bg}22` }} />

              {/* Étiquettes */}
              <ChipSection
                label="Mes besoins en quelques mots"
                emoji="💜"
                enabled={sections.tags.enabled}
                items={sections.tags.items}
                pool={tagPool}
                onToggle={() => toggleSection('tags')}
                onChange={(items) => changeSection('tags', items)}
                colors={colors}
              />

              {/* Tu peux : */}
              <ChipSection
                label="« Tu peux » : des idées pour lui"
                emoji="💛"
                enabled={sections.actions.enabled}
                items={sections.actions.items}
                pool={actionPool}
                onToggle={() => toggleSection('actions')}
                onChange={(items) => changeSection('actions', items)}
                colors={colors}
              />

              {/* Petit mot perso */}
              <div className="py-1">
                <button
                  onClick={() => setPersonalEnabled((v) => !v)}
                  className="flex items-center justify-between w-full py-1.5"
                >
                  <span className="font-body text-sm font-semibold text-luna-text">✉️&nbsp; Mon petit mot</span>
                  <Switch on={personalEnabled} colors={colors} />
                </button>
                <AnimatePresence>
                  {personalEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <textarea
                        value={personalMsg}
                        onChange={(e) => setPersonalMsg(e.target.value)}
                        placeholder="Ex : Journée un peu rude, sois tout doux ce soir 💜"
                        maxLength={90}
                        rows={2}
                        className="w-full text-xs font-body bg-white border rounded-xl px-3 py-2 outline-none resize-none mt-1"
                        style={{ borderColor: `${colors.bg}40` }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-px my-2" style={{ backgroundColor: `${colors.bg}22` }} />

              {/* Jour du cycle optionnel */}
              <button
                onClick={() => setShowCycleDay((v) => !v)}
                className="flex items-center justify-between w-full py-1.5"
              >
                <span className="text-left">
                  <span className="font-body text-sm font-semibold text-luna-text">📅&nbsp; Montrer le jour du cycle</span>
                  <span className="block text-[11px] font-body text-luna-text-hint mt-0.5">
                    Optionnel, laisse-le désactivé pour rester discrète
                  </span>
                </span>
                <Switch on={showCycleDay} colors={colors} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envoyer */}
      <button
        onClick={handleShare}
        className="flex items-center justify-center gap-2 w-full mt-4 py-3.5 rounded-[16px] text-sm font-body font-semibold text-white transition-all active:scale-[0.98]"
        style={{ backgroundColor: colors.bg }}
      >
        {shared ? <Check size={16} /> : <Send size={16} />}
        {shared ? 'Envoyé !' : 'Envoyer la carte'}
      </button>
    </div>
  );
}
