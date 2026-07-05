import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Camera, Settings, Share2, Trash2, Pencil, ChevronRight, BarChart3 } from 'lucide-react';
import { useCycle } from '../contexts/CycleContext';
import { supabase } from '../lib/supabase';
import { toast } from '../lib/toast';
import BackButton from '../components/ui/BackButton';
import BottomSheet from '../components/ui/BottomSheet';
import SharePartnerCard from '../components/cycle/SharePartnerCard';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Le rapport mensuel et la carte partenaire vivent désormais dans l'onglet
// Mon cycle (composants src/components/cycle/) — le Profil garde des accès.
export default function Profil() {
  const { name, cycleLength, periodLength, cycleInfo, dispatch, profileImage, user } = useCycle();
  const phaseData = cycleInfo?.phaseData || { color: '#B0A5AA', colorDark: '#6B5E62', bgColor: '#F5F2F0' };
  const fileInputRef = useRef(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showPartnerSheet, setShowPartnerSheet] = useState(false);

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
        if (user) {
          canvas.toBlob(async (blob) => {
            const path = `${user.id}/avatar.jpg`;
            await supabase.storage.from('avatars').upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
            dispatch({ type: 'SET_PROFILE', payload: { profileImage: `${urlData.publicUrl}?t=${Date.now()}` } });
            toast('Photo de profil mise à jour ✓');
          }, 'image/jpeg', 0.8);
        } else {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          dispatch({ type: 'SET_PROFILE', payload: { profileImage: dataUrl } });
        }
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  };

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
                  onClick={() => { setShowPhotoMenu(false); if (user) { supabase.storage.from('avatars').remove([`${user.id}/avatar.jpg`]); } dispatch({ type: 'SET_PROFILE', payload: { profileImage: null } }); }}
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
        <div className="bg-white rounded-[22px] p-5 text-center" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{cycleLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de cycle</p>
        </div>
        <div className="bg-white rounded-[22px] p-5 text-center" style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}>
          <p className="text-3xl font-display font-bold text-luna-text">{periodLength}</p>
          <p className="text-xs text-luna-text-hint font-body mt-1">jours de règles</p>
        </div>
      </motion.div>

      {/* Calendar link */}
      <motion.div variants={item}>
        <Link
          to="/calendrier"
          className="flex items-center gap-4 bg-white rounded-[22px] p-4 active:scale-[0.99] transition-all"
          style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}30)` }}
          >
            <Calendar size={20} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-luna-text">Mon calendrier</p>
            <p className="text-xs text-luna-text-hint font-body">Visualise ton cycle mois par mois</p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0" style={{ color: phaseData.colorDark }} />
        </Link>
      </motion.div>

      {/* Bilan mensuel — la page vit dans Mon cycle, accès conservé ici */}
      <motion.div variants={item}>
        <Link
          to="/bilan"
          className="flex items-center gap-4 bg-white rounded-[22px] p-4 active:scale-[0.99] transition-all"
          style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}30)` }}
          >
            <BarChart3 size={20} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-luna-text">Mon bilan mensuel</p>
            <p className="text-xs text-luna-text-hint font-body">Tes stats et tendances du mois</p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0" style={{ color: phaseData.colorDark }} />
        </Link>
      </motion.div>

      {/* Carte à partager — ligne qui ouvre une fenêtre du bas */}
      <motion.div variants={item}>
        <button
          onClick={() => setShowPartnerSheet(true)}
          className="w-full flex items-center gap-4 bg-white rounded-[22px] p-4 active:scale-[0.99] transition-all text-left"
          style={{ boxShadow: '0 8px 24px rgba(45,34,38,0.06)' }}
        >
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${phaseData.bgColor}, ${phaseData.color}30)` }}
          >
            <Share2 size={19} style={{ color: phaseData.colorDark }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-luna-text">Carte à partager</p>
            <p className="text-xs text-luna-text-hint font-body">Aide ton partenaire à comprendre ta phase</p>
          </div>
          <ChevronRight size={18} className="flex-shrink-0" style={{ color: phaseData.colorDark }} />
        </button>
      </motion.div>

      <BottomSheet open={showPartnerSheet} onClose={() => setShowPartnerSheet(false)} title="Carte à partager">
        <SharePartnerCard cycleInfo={cycleInfo} name={name} />
      </BottomSheet>

    </motion.div>
  );
}
