import { motion } from 'framer-motion';
import {
  Camera, Users, TrendingUp, Eye, Heart,
  ArrowUpRight, ArrowDownRight, Images, Video, Image,
  Bookmark, Share2, MessageCircle, MapPin,
} from 'lucide-react';

// Tableau de bord des statistiques Instagram.
// Pour l'instant : EMPLACEMENTS « à venir » (les valeurs se rempliront une fois
// le compte connecté via l'API Meta). Tout est en placeholder.

const card = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';
const sectionTitle = 'font-display text-lg text-gray-800 mb-4';
const skeleton = 'bg-gray-100 rounded';

function MetricCard({ icon, label, chipBg, chipColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: chipBg, color: chipColor }}>
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-body">{label}</span>
      </div>
      <p className="text-3xl font-bold font-accent text-gray-300">—</p>
    </div>
  );
}

// Ligne « label — barre — valeur » pour les classements (thématique, format, âge).
function BarRow({ label, pct, color, last }) {
  return (
    <div className={`flex items-center gap-3 ${last ? '' : 'mb-2.5'}`}>
      <span className="text-xs text-gray-500 font-body w-20 flex items-center gap-1.5">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, opacity: 0.35 }} />
      </div>
      <span className="text-xs text-gray-300 font-body w-6 text-right">—</span>
    </div>
  );
}

function PostPlaceholder({ kind }) {
  const good = kind === 'good';
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs font-body font-semibold mb-3 flex items-center gap-1.5" style={{ color: good ? '#5B8A1E' : '#B5661F' }}>
        {good ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {good ? 'Meilleur post' : 'Moins bon post'}
      </p>
      <div className="flex gap-3">
        <div className={`${skeleton} w-12 h-12 rounded-xl flex-shrink-0`} />
        <div className="flex-1 space-y-2 pt-1">
          <div className={`${skeleton} h-2.5 w-4/5`} />
          <div className={`${skeleton} h-2 w-1/2`} />
        </div>
      </div>
    </div>
  );
}

export default function InstagramStats() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* ── Zone 1 : Vue d'ensemble ─────────────────────────────────────── */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display text-lg text-gray-800 flex items-center gap-2">
            <Camera size={18} className="text-luna-rose" />
            Statistiques Instagram
          </h3>
          <span className="text-xs font-body text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
            📸 S'activera une fois Instagram connecté
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={<Users size={20} />} label="Abonnés" chipBg="#FBE7EB" chipColor="#C4727F" />
          <MetricCard icon={<TrendingUp size={20} />} label="Nouveaux (30j)" chipBg="#EDF5ED" chipColor="#7BAE7F" />
          <MetricCard icon={<Eye size={20} />} label="Portée" chipBg="#FFF3EB" chipColor="#E8A87C" />
          <MetricCard icon={<Heart size={20} />} label="Engagement" chipBg="#F3EEF8" chipColor="#B09ACB" />
        </div>
      </div>

      {/* ── Zone 2 : Top contenus ───────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Top contenus</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <PostPlaceholder kind="good" />
          <PostPlaceholder kind="bad" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-3">Par thématique</p>
            <BarRow label="Recette" pct={70} color="#B5661F" />
            <BarRow label="Symptôme" pct={52} color="#A85A66" />
            <BarRow label="Astuce" pct={38} color="#4E7C8A" />
            <BarRow label="Quiz" pct={22} color="#7A5E9E" last />
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-3">Par format</p>
            <BarRow label={<><Images size={13} /> Carrousel</>} pct={66} color="#C4727F" />
            <BarRow label={<><Video size={13} /> Reel</>} pct={48} color="#C4727F" />
            <BarRow label={<><Image size={13} /> Post</>} pct={30} color="#C4727F" last />
          </div>
        </div>
      </div>

      {/* ── Zone 3 : Quand publier ──────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Quand publier</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-4">Heures d'affluence</p>
            <div className="flex items-end gap-1.5 h-20">
              {[30, 45, 25, 60, 85, 70, 40, 55].map((h, i) => (
                <div key={i} className={`${skeleton} flex-1`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-body">
              <span>6h</span><span>12h</span><span>18h</span><span>23h</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-4">Meilleurs jours</p>
            <div className="flex items-end justify-between gap-2 h-20">
              {[['L', 34], ['M', 52], ['M', 42], ['J', 62], ['V', 48], ['S', 36], ['D', 28]].map(([d, h], i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={`${skeleton} mx-auto mb-1.5`} style={{ height: `${h}%` }} />
                  <span className="text-xs text-gray-400 font-body">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Zone 4 : Ton audience ───────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Ton audience</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-3">Tranche d'âge</p>
            <BarRow label="18-24" pct={40} color="#B09ACB" />
            <BarRow label="25-34" pct={70} color="#B09ACB" />
            <BarRow label="35-44" pct={45} color="#B09ACB" />
            <BarRow label="45 et +" pct={20} color="#B09ACB" last />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <AudienceStat icon={<Bookmark size={16} />} color="#E8A87C" label="Enreg." />
              <AudienceStat icon={<Share2 size={16} />} color="#7BAE7F" label="Partages" />
              <AudienceStat icon={<MessageCircle size={16} />} color="#B09ACB" label="Comm." />
            </div>
            <div className="rounded-2xl border border-gray-100 p-4 flex items-center gap-2">
              <MapPin size={16} className="text-luna-rose" />
              <span className="text-sm font-body font-semibold text-gray-700">Villes / pays</span>
              <span className="text-xs text-gray-300 font-body ml-auto">à venir</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-body mt-4 text-center">
          Les likes restent suivis, mais en secondaire : pour ton compte, enregistrements et partages comptent davantage.
        </p>
      </div>
    </motion.div>
  );
}

function AudienceStat({ icon, color, label }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
      <span style={{ color }} className="inline-flex">{icon}</span>
      <p className="text-2xl font-bold font-accent text-gray-300 mt-1">—</p>
      <span className="text-xs text-gray-400 font-body">{label}</span>
    </div>
  );
}
