import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera, Users, TrendingUp, Eye, Heart,
  ArrowUpRight, ArrowDownRight, Images, Video, Image,
  Bookmark, Share2, MessageCircle, MapPin, RefreshCw, PlugZap,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Tableau de bord des statistiques Instagram.
// Les valeurs disponibles via l'API Meta se remplissent en direct ; les zones
// non encore branchées (audience, heures) restent en « à venir ».

const card = 'bg-white rounded-2xl p-6 shadow-sm border border-gray-100';
const sectionTitle = 'font-display text-lg text-gray-800 mb-4';
const skeleton = 'bg-gray-100 rounded';

const nf = new Intl.NumberFormat('fr-FR');
const show = (v) => (v === null || v === undefined ? '—' : nf.format(v));

const FORMAT_LABEL = {
  IMAGE: 'Post',
  CAROUSEL_ALBUM: 'Carrousel',
  VIDEO: 'Reel',
};

function MetricCard({ icon, label, value, chipBg, chipColor }) {
  const empty = value === null || value === undefined;
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: chipBg, color: chipColor }}>
          {icon}
        </div>
        <span className="text-sm text-gray-500 font-body">{label}</span>
      </div>
      <p className={`text-3xl font-bold font-accent ${empty ? 'text-gray-300' : 'text-gray-800'}`}>{empty ? '—' : value}</p>
    </div>
  );
}

function BarRow({ label, pct, color, value, last }) {
  return (
    <div className={`flex items-center gap-3 ${last ? '' : 'mb-2.5'}`}>
      <span className="text-xs text-gray-500 font-body w-20 flex items-center gap-1.5">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, opacity: 0.35 }} />
      </div>
      <span className="text-xs text-gray-400 font-body w-8 text-right">{value === undefined ? '—' : value}</span>
    </div>
  );
}

function PostCard({ post, kind }) {
  const good = kind === 'good';
  if (!post) {
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
  return (
    <a href={post.permalink} target="_blank" rel="noreferrer" className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-luna-rose/40 transition-colors">
      <p className="text-xs font-body font-semibold mb-3 flex items-center gap-1.5" style={{ color: good ? '#5B8A1E' : '#B5661F' }}>
        {good ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {good ? 'Meilleur post' : 'Moins bon post'}
      </p>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-gray-100 overflow-hidden flex items-center justify-center text-gray-300">
          {post.thumb ? <img src={post.thumb} alt="" className="w-full h-full object-cover" /> : <Image size={18} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 font-body line-clamp-2">{post.caption || 'Sans légende'}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 font-body">
            <span className="flex items-center gap-1"><Heart size={12} /> {nf.format(post.likes)}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {nf.format(post.comments)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function InstagramStats() {
  const [state, setState] = useState({ status: 'loading', data: null });

  const load = async () => {
    setState({ status: 'loading', data: null });
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      const r = await fetch('/api/instagram-stats', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const d = await r.json();
      if (!d.connected) {
        setState({ status: d.reason === 'unauthorized' ? 'unauthorized' : 'notconnected', data: null });
      } else {
        setState({ status: 'ok', data: d });
      }
    } catch {
      setState({ status: 'notconnected', data: null });
    }
  };

  useEffect(() => { load(); }, []);

  const d = state.data;

  // Répartition par format (à partir des posts récents)
  const fmtRows = (() => {
    if (!d?.byFormat) return null;
    const entries = Object.entries(d.byFormat);
    const max = Math.max(...entries.map(([, n]) => n), 1);
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([type, n]) => ({ label: FORMAT_LABEL[type] || type, n, pct: Math.round((n / max) * 100) }));
  })();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

      {/* Bandeau d'état de connexion */}
      {state.status !== 'ok' && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-luna-rose/10 flex items-center justify-center text-luna-rose flex-shrink-0">
            {state.status === 'loading' ? <RefreshCw size={18} className="animate-spin" /> : <PlugZap size={18} />}
          </div>
          <div className="flex-1">
            <p className="font-body font-semibold text-gray-800 text-sm">
              {state.status === 'loading' ? 'Chargement des statistiques…'
                : state.status === 'unauthorized' ? 'Accès réservé à l\'admin'
                : 'Instagram pas encore connecté'}
            </p>
            <p className="text-xs text-gray-400 font-body mt-0.5">
              {state.status === 'loading' ? 'Un instant, on interroge Instagram.'
                : state.status === 'unauthorized' ? 'Reconnecte-toi avec ton compte admin pour voir les chiffres.'
                : 'Ajoute tes clés Meta dans Vercel, puis recharge : tes vrais chiffres s\'afficheront ici.'}
            </p>
          </div>
          {state.status !== 'loading' && (
            <button onClick={load} className="flex items-center gap-2 px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-body">
              <RefreshCw size={13} /> Réessayer
            </button>
          )}
        </div>
      )}

      {/* ── Zone 1 : Vue d'ensemble ─────────────────────────────────────── */}
      <div className={card}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display text-lg text-gray-800 flex items-center gap-2">
            <Camera size={18} className="text-luna-rose" />
            Statistiques Instagram
          </h3>
          {state.status === 'ok' ? (
            <span className="text-xs font-body text-green-700 bg-green-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Connecté {d.username ? `· @${d.username}` : ''}
            </span>
          ) : (
            <span className="text-xs font-body text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">
              📸 S'activera une fois Instagram connecté
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard icon={<Users size={20} />} label="Abonnés" value={d ? show(d.followers) : null} chipBg="#FBE7EB" chipColor="#C4727F" />
          <MetricCard icon={<TrendingUp size={20} />} label="Nouveaux (30j)" value={d ? show(d.new30) : null} chipBg="#EDF5ED" chipColor="#7BAE7F" />
          <MetricCard icon={<Eye size={20} />} label="Portée (30j)" value={d ? show(d.reach30) : null} chipBg="#FFF3EB" chipColor="#E8A87C" />
          <MetricCard icon={<Heart size={20} />} label="Engagement" value={d?.engagementRate != null ? `${d.engagementRate}%` : null} chipBg="#F3EEF8" chipColor="#B09ACB" />
        </div>
        {state.status === 'ok' && d?.errors?.length > 0 && (
          <p className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 font-body">
            Détail technique : {d.errors.join(' · ')}
          </p>
        )}
      </div>

      {/* ── Zone 2 : Top contenus ───────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Top contenus</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <PostCard post={d?.topPost} kind="good" />
          <PostCard post={d?.worstPost} kind="bad" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-3">Par thématique <span className="text-xs text-gray-300 font-normal">· à venir</span></p>
            <BarRow label="Recette" pct={70} color="#B5661F" />
            <BarRow label="Symptôme" pct={52} color="#A85A66" />
            <BarRow label="Astuce" pct={38} color="#4E7C8A" />
            <BarRow label="Quiz" pct={22} color="#7A5E9E" last />
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-sm font-body font-semibold text-gray-700 mb-3">Par format</p>
            {fmtRows ? (
              fmtRows.map((f, i) => (
                <BarRow key={f.label} label={f.label} pct={f.pct} value={f.n} color="#C4727F" last={i === fmtRows.length - 1} />
              ))
            ) : (
              <>
                <BarRow label={<><Images size={13} /> Carrousel</>} pct={66} color="#C4727F" />
                <BarRow label={<><Video size={13} /> Reel</>} pct={48} color="#C4727F" />
                <BarRow label={<><Image size={13} /> Post</>} pct={30} color="#C4727F" last />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Zone 3 : Quand publier ──────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Quand publier <span className="text-xs text-gray-300 font-normal">· à venir</span></h3>
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
              {[['L', 34], ['M', 52], ['M', 42], ['J', 62], ['V', 48], ['S', 36], ['D', 28]].map(([day, h], i) => (
                <div key={i} className="flex-1 text-center">
                  <div className={`${skeleton} mx-auto mb-1.5`} style={{ height: `${h}%` }} />
                  <span className="text-xs text-gray-400 font-body">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Zone 4 : Ton audience ───────────────────────────────────────── */}
      <div className={card}>
        <h3 className={sectionTitle}>Ton audience <span className="text-xs text-gray-300 font-normal">· à venir</span></h3>
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
