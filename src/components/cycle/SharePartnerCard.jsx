import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, Pencil, Plus, Sparkles } from 'lucide-react';
import { SkeletonCard } from '../ui/SkeletonLoader';

// Carte « Ensemble » : la femme prépare une jolie carte de sa phase et
// l'envoie à son partenaire (image PNG générée via canvas + partage natif).
// Refonte 2026-07-06 : phrase d'humeur en héros, énergie en douceur (mot +
// points, plus de %), sections en pastilles avec suggestions à taper, jour
// du cycle optionnel, plus de compte à rebours des règles.

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

// ─── Suggestions de pastilles par phase et par section ───
const POOLS = {
  menstrual: {
    help: ['Patience', 'Un câlin', 'Du repos', 'De la douceur', 'De l\'écoute', 'De l\'espace'],
    food: ['Chocolat chaud', 'Plat réconfortant', 'Tisane gingembre', 'Fruits rouges', 'Une bonne soupe'],
    avoid: ['Les remarques sur ma fatigue', 'Me forcer à sortir', '« C\'est tes règles ? »'],
  },
  follicular: {
    help: ['Ton encouragement', 'De la spontanéité', 'Partager mes idées', 'Une sortie', 'Ta bonne humeur'],
    food: ['Salade colorée', 'Bowl protéiné', 'Un smoothie', 'Quelque chose de frais'],
    avoid: ['Freiner mon élan', 'Annuler nos projets', 'Me surprotéger'],
  },
  ovulatory: {
    help: ['De la complicité', 'Communiquer', 'Ta présence', 'Un moment à deux', 'Des projets'],
    food: ['Un repas léger', 'À partager à deux', 'Un jus maison', 'Quelque chose de frais'],
    avoid: ['Me laisser seule ce soir', 'Les conflits inutiles', 'Reporter nos discussions'],
  },
  luteal: {
    help: ['De la patience', 'Un câlin', 'De la douceur', 'Pas de prise de tête', 'Du calme'],
    food: ['Du chocolat', 'Patate douce', 'Un plat réconfortant', 'Infusion camomille'],
    avoid: ['Les sujets stressants', '« Tu réagis trop »', 'Commenter ce que je mange'],
  },
};

const SECTION_META = {
  help: { emoji: '💛', title: 'Ce qui m\'aide' },
  food: { emoji: '🍽️', title: 'Ce qui me ferait plaisir' },
  avoid: { emoji: '🚫', title: 'À éviter ce soir' },
};

const PHASE_COLORS = {
  menstrual: { bg: '#D4727F', bgLight: '#FDE8EB', accent: '#A85A66' },
  follicular: { bg: '#7BAE7F', bgLight: '#EDF5ED', accent: '#4D7A50' },
  ovulatory: { bg: '#E8A87C', bgLight: '#FFF3EB', accent: '#C47A4A' },
  luteal: { bg: '#B09ACB', bgLight: '#F3EEF8', accent: '#7D6A96' },
};

const SUBLINE = 'Voici où j\'en suis, et ce qui m\'aiderait.';

// Énergie « douce » : un mot + un nombre de points (plus de pourcentage).
function getEnergy(level) {
  if (level <= 35) return { word: 'énergie douce', dots: 1 };
  if (level <= 65) return { word: 'énergie tranquille', dots: 2 };
  return { word: 'pleine énergie', dots: 3 };
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

// Mesure ou dessine une rangée de pastilles. Renvoie le y final.
function chips(ctx, items, x, y, maxW, draw, colors) {
  const padX = 13, gap = 7, h = 30, rowGap = 9;
  ctx.font = '14px system-ui, -apple-system, sans-serif';
  let cx = x, cy = y;
  items.forEach((it) => {
    const w = ctx.measureText(it).width + padX * 2;
    if (cx + w > x + maxW && cx > x) { cx = x; cy += h + rowGap; }
    if (draw) {
      ctx.fillStyle = colors.bg + '20';
      ctx.beginPath(); ctx.roundRect(cx, cy, w, h, 15); ctx.fill();
      ctx.fillStyle = colors.accent;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(it, cx + padX, cy + h / 2 + 1);
      ctx.textBaseline = 'alphabetic';
    }
    cx += w + gap;
  });
  return cy + h;
}

function generateShareCanvas(cycleInfo, userName, state) {
  const colors = PHASE_COLORS[cycleInfo.phase] || PHASE_COLORS.menstrual;
  const phaseData = cycleInfo.phaseData;
  const energy = getEnergy(cycleInfo.energyLevel);
  const W = 600;
  const PAD = 40;
  const innerW = W - PAD * 2;
  const serif = '"Playfair Display", Georgia, serif';

  const activeSections = ['help', 'food', 'avoid'].filter(
    (k) => state.sections[k].enabled && state.sections[k].items.length > 0
  );

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = 10;
  const ctx = canvas.getContext('2d');

  // ── Passe 1 : mesurer la hauteur ──
  const layout = (drawing) => {
    let y = 46;

    if (drawing) {
      // Fond dégradé crème → teinte de phase
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#FBF8F6');
      grad.addColorStop(1, colors.bgLight);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, canvas.height);
      // Cercle décoratif
      ctx.beginPath();
      ctx.arc(W + 20, -20, 130, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg + '12';
      ctx.fill();
    }

    // Header : pastille emoji + nom de phase (+ jour optionnel) / énergie
    if (drawing) {
      ctx.beginPath();
      ctx.arc(PAD + 24, y + 20, 24, 0, Math.PI * 2);
      ctx.fillStyle = colors.bg + '22';
      ctx.fill();
      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      ctx.fillText(phaseData.icon, PAD + 24, y + 29);

      ctx.textAlign = 'left';
      ctx.font = '600 15px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = colors.accent;
      ctx.fillText(phaseData.name, PAD + 60, y + (state.showCycleDay ? 12 : 24));
      if (state.showCycleDay) {
        ctx.font = '13px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#75656899';
        ctx.fillText(`jour ${cycleInfo.currentDay}`, PAD + 60, y + 32);
      }

      // Énergie (mot + points), aligné à droite
      ctx.textAlign = 'right';
      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = colors.accent;
      ctx.fillText(energy.word, W - PAD, y + 12);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(W - PAD - 4 - i * 12, y + 28, 4, 0, Math.PI * 2);
        ctx.fillStyle = i < energy.dots ? colors.bg : colors.bg + '40';
        ctx.fill();
      }
      ctx.textAlign = 'left';
    }
    y += 74;

    // Héros : la phrase d'humeur
    ctx.font = `600 34px ${serif}`;
    const headlineLines = wrapText(ctx, state.headline || phaseData.name, innerW);
    if (drawing) {
      ctx.fillStyle = '#2D2226';
      ctx.textAlign = 'left';
      headlineLines.forEach((ln, i) => ctx.fillText(ln, PAD, y + 30 + i * 42));
    }
    y += headlineLines.length * 42 + 8;

    // Sous-ligne
    if (drawing) {
      ctx.font = '15px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#4A3F43';
      ctx.fillText(SUBLINE, PAD, y + 14);
    }
    y += 40;

    // Sections
    activeSections.forEach((key) => {
      const meta = SECTION_META[key];
      if (drawing) {
        ctx.font = '13px serif';
        ctx.textAlign = 'left';
        ctx.fillText(meta.emoji, PAD, y + 12);
        ctx.font = '600 13px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = colors.accent;
        ctx.fillText(meta.title, PAD + 24, y + 11);
      }
      y += 26;
      y = chips(ctx, state.sections[key].items, PAD, y, innerW, drawing, colors);
      y += 22;
    });

    // Petit mot perso (encadré blanc)
    if (state.personalEnabled && state.personalMsg.trim()) {
      ctx.font = `italic 15px ${serif}`;
      const msgLines = wrapText(ctx, `« ${state.personalMsg.trim()} »`, innerW - 32);
      const boxH = msgLines.length * 22 + 26;
      if (drawing) {
        ctx.fillStyle = '#FFFFFFCC';
        ctx.beginPath(); ctx.roundRect(PAD, y, innerW, boxH, 14); ctx.fill();
        ctx.fillStyle = colors.accent;
        ctx.textAlign = 'left';
        msgLines.forEach((ln, i) => ctx.fillText(ln, PAD + 16, y + 26 + i * 22));
      }
      y += boxH + 22;
    }

    // Signature + branding luna
    if (drawing) {
      ctx.font = `italic 15px ${serif}`;
      ctx.fillStyle = colors.accent;
      ctx.textAlign = 'left';
      if (userName) ctx.fillText(`— ${userName}`, PAD, y + 12);
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#75656899';
      ctx.textAlign = 'right';
      ctx.fillText('luna 🌙', W - PAD, y + 12);
      ctx.textAlign = 'left';
    }
    y += 40;

    return y;
  };

  const totalH = Math.max(560, layout(false));
  canvas.height = totalH;
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
function ChipSection({ sectionKey, enabled, items, pool, onToggle, onChange, colors }) {
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const meta = SECTION_META[sectionKey];

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
          {meta.emoji}&nbsp; {meta.title}
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
                    className="text-xs font-body bg-white border rounded-full px-3 py-1.5 outline-none w-28"
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
//  Aperçu live de la carte (HTML, WYSIWYG avec le PNG)
// ─────────────────────────────────────────────────────────────
function PreviewCard({ cycleInfo, name, headline, sections, personalEnabled, personalMsg, showCycleDay, colors }) {
  const phaseData = cycleInfo.phaseData;
  const energy = getEnergy(cycleInfo.energyLevel);
  const active = ['help', 'food', 'avoid'].filter((k) => sections[k].enabled && sections[k].items.length > 0);

  return (
    <div
      className="rounded-[22px] p-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(165deg, #FBF8F6 0%, ${colors.bgLight} 100%)`,
        border: `0.5px solid ${colors.bg}22`,
      }}
    >
      <div
        className="absolute rounded-full"
        style={{ top: -34, right: -34, width: 120, height: 120, background: `${colors.bg}12` }}
      />
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{ backgroundColor: `${colors.bg}22` }}
            >
              {phaseData.icon}
            </div>
            <div>
              <p className="text-xs font-body font-semibold leading-tight" style={{ color: colors.accent }}>
                {phaseData.name}
              </p>
              {showCycleDay && (
                <p className="text-[11px] font-body text-luna-text-hint mt-0.5">jour {cycleInfo.currentDay}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-body mb-1" style={{ color: colors.accent }}>{energy.word}</p>
            <div className="flex justify-end gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: i < energy.dots ? colors.bg : `${colors.bg}40` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Héros */}
        <p className="font-display leading-tight mt-4 mb-2" style={{ fontSize: 24, color: '#2D2226' }}>
          {headline}
        </p>
        <p className="text-xs font-body mb-4" style={{ color: '#4A3F43' }}>{SUBLINE}</p>

        {/* Sections */}
        {active.map((key) => (
          <div key={key} className="mb-3">
            <p className="text-[11px] font-body font-semibold mb-1.5" style={{ color: colors.accent }}>
              {SECTION_META[key].emoji}&nbsp; {SECTION_META[key].title}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sections[key].items.map((it) => (
                <span
                  key={it}
                  className="text-[11px] font-body font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: `${colors.bg}1c`, color: colors.accent }}
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Petit mot */}
        {personalEnabled && personalMsg.trim() && (
          <div className="rounded-[13px] px-3 py-2.5 mb-3" style={{ backgroundColor: '#FFFFFFCC' }}>
            <p className="font-display italic text-xs leading-snug" style={{ color: colors.accent }}>
              « {personalMsg.trim()} »
            </p>
          </div>
        )}

        {/* Signature */}
        <div className="flex items-center justify-between mt-3">
          {name ? (
            <p className="font-display italic text-sm" style={{ color: colors.accent }}>— {name}</p>
          ) : <span />}
          <p className="text-[11px] font-body text-luna-text-hint">luna 🌙</p>
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
  const pools = POOLS[phase] || POOLS.menstrual;

  const [shared, setShared] = useState(false);
  const [editing, setEditing] = useState(false);

  const [headline, setHeadline] = useState(moods[0].headline);
  const [customMood, setCustomMood] = useState(false);
  const [sections, setSections] = useState(() => ({
    help: { enabled: true, items: pools.help.slice(0, 3) },
    food: { enabled: true, items: pools.food.slice(0, 2) },
    avoid: { enabled: true, items: pools.avoid.slice(0, 2) },
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

  // iOS exige que navigator.share parte dans le même geste que le tap, sans
  // await préalable. On prépare donc l'image de façon synchrone (dataURL →
  // File), puis on lance le partage immédiatement.
  const handleShare = () => {
    let dataUrl;
    let file;
    try {
      const canvas = generateShareCanvas(cycleInfo, name, state);
      dataUrl = canvas.toDataURL('image/png');
      const bin = atob(dataUrl.split(',')[1]);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      file = new File([bytes], 'luna-phase.png', { type: 'image/png' });
    } catch {
      return;
    }

    const confirmSent = () => { setShared(true); setTimeout(() => setShared(false), 3000); };
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

              {/* Sections */}
              {['help', 'food', 'avoid'].map((key) => (
                <ChipSection
                  key={key}
                  sectionKey={key}
                  enabled={sections[key].enabled}
                  items={sections[key].items}
                  pool={pools[key]}
                  onToggle={() => toggleSection(key)}
                  onChange={(items) => changeSection(key, items)}
                  colors={colors}
                />
              ))}

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
