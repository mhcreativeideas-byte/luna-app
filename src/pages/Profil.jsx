import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Camera, Settings, Share2, TrendingUp, Trash2, Pencil, Send, Check } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import BackButton from '../components/ui/BackButton';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const PHASE_NEEDS = {
  menstrual: ['Repos', 'Douceur', 'Patience'],
  follicular: ['Encouragement', 'Aventure', 'Spontanéité'],
  ovulatory: ['Complicité', 'Communication', 'Énergie'],
  luteal: ['Patience', 'Douceur', 'Pas de prise de tête'],
};

const PHASE_COLORS = {
  menstrual: { bg: '#D4727F', bgLight: '#FDE8EB', accent: '#A85566' },
  follicular: { bg: '#7BAE7F', bgLight: '#EDF5ED', accent: '#4D7A50' },
  ovulatory: { bg: '#E8A87C', bgLight: '#FFF3EB', accent: '#C47A4A' },
  luteal: { bg: '#B09ACB', bgLight: '#F3EEF8', accent: '#7D6A96' },
};

function generateShareCanvas(cycleInfo, userName) {
  const phase = cycleInfo.phase;
  const colors = PHASE_COLORS[phase];
  const phaseData = cycleInfo.phaseData;
  const needs = PHASE_NEEDS[phase];

  const W = 600, H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#FBF8F6');
  grad.addColorStop(1, colors.bgLight);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative circle top-right
  ctx.beginPath();
  ctx.arc(W + 20, -20, 140, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '18';
  ctx.fill();

  // Decorative circle bottom-left
  ctx.beginPath();
  ctx.arc(-30, H + 10, 120, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '12';
  ctx.fill();

  // Phase icon circle
  ctx.beginPath();
  ctx.arc(W / 2, 120, 50, 0, Math.PI * 2);
  ctx.fillStyle = colors.bg + '20';
  ctx.fill();

  // Phase emoji
  ctx.font = '40px serif';
  ctx.textAlign = 'center';
  ctx.fillText(phaseData.icon, W / 2, 137);

  // Phase name
  ctx.font = 'bold 32px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#2D2226';
  ctx.textAlign = 'center';
  ctx.fillText(phaseData.name, W / 2, 210);

  // Cycle day
  ctx.font = '18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.fillText(`Jour ${cycleInfo.currentDay} sur ${cycleInfo.cycleLength}`, W / 2, 245);

  // Divider line
  ctx.strokeStyle = colors.bg + '40';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(80, 280);
  ctx.lineTo(W - 80, 280);
  ctx.stroke();

  // Energy bar label
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.textAlign = 'left';
  ctx.fillText('ÉNERGIE', 60, 325);

  // Energy bar percentage
  ctx.textAlign = 'right';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = colors.accent;
  ctx.fillText(`${cycleInfo.energyLevel}%`, W - 60, 325);

  // Energy bar background
  const barX = 60, barY = 340, barW = W - 120, barH = 12;
  ctx.fillStyle = '#E8E4E0';
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW, barH, 6);
  ctx.fill();

  // Energy bar fill
  ctx.fillStyle = colors.bg;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barW * (cycleInfo.energyLevel / 100), barH, 6);
  ctx.fill();

  // Next period
  ctx.textAlign = 'center';
  ctx.font = '16px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#5A4A4E';
  const periodText = cycleInfo.daysUntilPeriod <= 0
    ? 'Règles prévues aujourd\'hui'
    : cycleInfo.daysUntilPeriod === 1
      ? 'Prochaines règles demain'
      : `Prochaines règles dans ${cycleInfo.daysUntilPeriod} jours`;
  ctx.fillText(periodText, W / 2, 400);

  // "Ce dont j'ai besoin" section
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F';
  ctx.fillText('CE DONT J\'AI BESOIN', W / 2, 465);

  // Need pills
  const pillY = 490;
  const pillH = 44;
  const pillGap = 12;
  const totalPillWidth = needs.reduce((acc, n) => {
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    return acc + ctx.measureText(n).width + 36;
  }, 0) + (needs.length - 1) * pillGap;
  let pillX = (W - totalPillWidth) / 2;

  needs.forEach((need) => {
    ctx.font = '16px system-ui, -apple-system, sans-serif';
    const textW = ctx.measureText(need).width;
    const pw = textW + 36;

    // Pill background
    ctx.fillStyle = colors.bg + '20';
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pw, pillH, 22);
    ctx.fill();

    // Pill border
    ctx.strokeStyle = colors.bg + '50';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pw, pillH, 22);
    ctx.stroke();

    // Pill text
    ctx.fillStyle = colors.accent;
    ctx.textAlign = 'center';
    ctx.fillText(need, pillX + pw / 2, pillY + 28);

    pillX += pw + pillGap;
  });

  // Personal message area
  if (userName) {
    ctx.font = 'italic 16px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#8A7B7F';
    ctx.textAlign = 'center';
    ctx.fillText(`— ${userName}`, W / 2, 590);
  }

  // LUNA branding
  ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = colors.bg + '80';
  ctx.textAlign = 'center';
  ctx.fillText('LUNA 🌙', W / 2, H - 50);
  ctx.font = '11px system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#8A7B7F80';
  ctx.fillText('Vis en harmonie avec ton cycle', W / 2, H - 30);

  return canvas;
}

function SharePartnerCard({ cycleInfo, name }) {
  const [shared, setShared] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!cycleInfo) return null;

  const phase = cycleInfo.phase;
  const phaseData = cycleInfo.phaseData;
  const needs = PHASE_NEEDS[phase];
  const colors = PHASE_COLORS[phase];

  const handleShare = useCallback(async () => {
    const canvas = generateShareCanvas(cycleInfo, name);

    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'luna-phase.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `LUNA — ${phaseData.name}`,
          text: `Je suis en ${phaseData.name} (jour ${cycleInfo.currentDay}/${cycleInfo.cycleLength}). Mon énergie est à ${cycleInfo.energyLevel}%.`,
          files: [file],
        });
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } else {
        // Fallback: download the image
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'luna-phase.png';
        link.href = url;
        link.click();
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fallback: download
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'luna-phase.png';
        link.href = url;
        link.click();
      }
    }
  }, [cycleInfo, name, phaseData]);

  const handlePreview = useCallback(() => {
    if (previewUrl) {
      setPreviewUrl(null);
      return;
    }
    const canvas = generateShareCanvas(cycleInfo, name);
    setPreviewUrl(canvas.toDataURL('image/png'));
  }, [cycleInfo, name, previewUrl]);

  return (
    <div
      className="bg-white rounded-[20px] p-5"
      style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Share2 size={16} style={{ color: colors.bg }} />
        <h3 className="font-display text-base text-luna-text">Ensemble</h3>
      </div>
      <p className="text-sm text-luna-text-muted font-body mb-4 leading-relaxed">
        Envoie ta carte du jour à ton partenaire pour qu'il comprenne ta phase.
      </p>

      {/* Mini preview of card content */}
      <div
        className="rounded-[16px] p-4 mb-4"
        style={{ backgroundColor: colors.bgLight, border: `1px solid ${colors.bg}20` }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: `${colors.bg}20` }}
          >
            {phaseData.icon}
          </div>
          <div>
            <p className="font-display text-sm text-luna-text font-semibold">{phaseData.name}</p>
            <p className="text-[11px] font-body text-luna-text-muted">
              Jour {cycleInfo.currentDay}/{cycleInfo.cycleLength} · Énergie {cycleInfo.energyLevel}%
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {needs.map((need) => (
            <span
              key={need}
              className="text-[11px] font-body font-medium px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${colors.bg}18`, color: colors.accent }}
            >
              {need}
            </span>
          ))}
        </div>
      </div>

      {/* Preview image */}
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <img
              src={previewUrl}
              alt="Aperçu de la carte"
              className="w-full rounded-[12px]"
              style={{ border: `1px solid ${colors.bg}20` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-body font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ backgroundColor: colors.bg }}
        >
          {shared ? <Check size={15} /> : <Send size={15} />}
          {shared ? 'Envoyé !' : 'Envoyer la carte'}
        </button>
        <button
          onClick={handlePreview}
          className="px-4 py-2.5 rounded-full text-sm font-body font-medium transition-all"
          style={{ backgroundColor: `${colors.bg}12`, color: colors.accent }}
        >
          {previewUrl ? 'Masquer' : 'Aperçu'}
        </button>
      </div>
    </div>
  );
}

export default function Profil() {
  const { name, cycleLength, periodLength, cycleInfo, checkIns, goals, dispatch, profileImage } = useCycle();
  const fileInputRef = useRef(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) { height = Math.round(height * maxSize / width); width = maxSize; }
        } else {
          if (height > maxSize) { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        dispatch({ type: 'SET_PROFILE', payload: { profileImage: dataUrl } });
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

  const totalCheckIns = checkIns?.length || 0;

  const symptomCounts = {};
  (checkIns || []).forEach((c) => {
    Object.values(c.symptoms || {}).flat().forEach((s) => {
      symptomCounts[s] = (symptomCounts[s] || 0) + 1;
    });
  });
  const topSymptoms = Object.entries(symptomCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 pb-6">
      <BackButton />
      {/* Header */}
      <motion.div variants={item} className="flex justify-between items-start">
        <h1 className="font-display text-2xl text-luna-text">Profil</h1>
        <Link
          to="/parametres"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-luna-text-muted hover:text-luna-text transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(45, 34, 38, 0.06)' }}
        >
          <Settings size={18} />
        </Link>
      </motion.div>

      {/* Avatar & name */}
      <motion.div variants={item} className="text-center py-4">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div
            className="cursor-pointer"
            onClick={() => profileImage ? setShowPhotoMenu(!showPhotoMenu) : fileInputRef.current?.click()}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #F5D0D5, #F2C0A8)',
                }}
              >
                <span className="text-2xl font-display text-white">{name?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #C4727F, #D4846A)' }}
            >
              <Camera size={13} className="text-white" />
            </div>
          </div>

          {/* Photo menu */}
          <AnimatePresence>
            {showPhotoMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded-[16px] overflow-hidden z-20"
                style={{ boxShadow: '0 4px 20px rgba(45, 34, 38, 0.12)', minWidth: '160px' }}
              >
                <button
                  onClick={() => { setShowPhotoMenu(false); fileInputRef.current?.click(); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-body text-luna-text hover:bg-gray-50 transition-colors"
                >
                  <Pencil size={15} className="text-luna-text-muted" />
                  Modifier
                </button>
                <div className="h-px bg-gray-100" />
                <button
                  onClick={() => { setShowPhotoMenu(false); dispatch({ type: 'SET_PROFILE', payload: { profileImage: null } }); }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 text-sm font-body text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <h2 className="font-display text-xl text-luna-text">{name}</h2>
        {cycleInfo && (
          <p className="text-xs font-body text-luna-text-hint mt-1">
            {cycleInfo.phaseData.icon} {cycleInfo.phaseData.name} — Jour {cycleInfo.currentDay}
          </p>
        )}
      </motion.div>

      {/* Backdrop to close photo menu */}
      {showPhotoMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowPhotoMenu(false)} />
      )}

      {/* Cycle stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{cycleLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de cycle</p>
        </div>
        <div className="bg-white rounded-[20px] p-5 text-center" style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{periodLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de règles</p>
        </div>
      </motion.div>

      {/* Calendar link */}
      <motion.div variants={item}>
        <Link
          to="/dashboard"
          className="flex items-center gap-4 bg-white rounded-[20px] p-4 hover:shadow-md transition-all"
          style={{ boxShadow: '0 2px 12px rgba(45, 34, 38, 0.04)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FDE8EB, #F5D0D5)' }}
          >
            <Calendar size={20} style={{ color: '#C4727F' }} />
          </div>
          <div>
            <p className="text-sm font-body font-semibold text-luna-text">Mon calendrier</p>
            <p className="text-xs text-luna-text-hint font-body">Visualise ton cycle mois par mois</p>
          </div>
        </Link>
      </motion.div>

      {/* Together card — Share with partner */}
      <motion.div variants={item}>
        <SharePartnerCard cycleInfo={cycleInfo} name={name} />
      </motion.div>

      {/* Insights card */}
      <motion.div variants={item}>
        <div
          className="rounded-[20px] p-5 text-white relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #C4727F 0%, #D4846A 50%, #E8A87C 100%)',
          }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} />
              <h3 className="font-display text-base">Insights</h3>
            </div>
            {totalCheckIns >= 15 ? (
              <div>
                <p className="text-sm font-body mb-3 opacity-90">
                  Tes patterns bases sur {totalCheckIns} check-ins :
                </p>
                {topSymptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {topSymptoms.map(([symptom, count]) => (
                      <span key={symptom} className="text-xs px-2.5 py-1 rounded-pill bg-white/20 font-body">
                        {symptom} ({count}x)
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm font-body mb-2 opacity-90 leading-relaxed">
                  Plus tu enregistres, plus LUNA détecte tes patterns. Après 3 cycles complets, tu auras une vue précise de tes tendances.
                </p>
                <p className="text-xs font-body opacity-70">
                  {totalCheckIns}/15 check-ins
                </p>
                <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-white/60 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalCheckIns / 15) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Goals */}
      <motion.div variants={item}>
        <h3 className="text-[10px] font-body font-bold text-luna-text-hint uppercase tracking-widest mb-2">Mes objectifs</h3>
        <div className="flex flex-wrap gap-2">
          {(goals || []).map((g) => (
            <span
              key={g}
              className="text-xs font-body px-3.5 py-2 rounded-pill bg-white text-luna-text-body"
              style={{ boxShadow: '0 1px 4px rgba(45,34,38,0.06)' }}
            >
              {g}
            </span>
          ))}
          {(!goals || goals.length === 0) && (
            <p className="text-xs text-luna-text-hint font-body">Aucun objectif defini</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
