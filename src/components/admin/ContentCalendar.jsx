import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, X, Trash2,
  Image, Images, Video, RefreshCw, CalendarHeart,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from '../../lib/toast';

// ── Référentiels (couleurs = charte luna, cf. CLAUDE.md) ────────────────────
// Phase du cycle ciblée par le post → teinte le fond du jour.
const PHASES = {
  menstrual:  { label: 'Menstruelle',  bg: '#FDE8EB', border: '#F3D2D8', dot: '#D4727F' },
  follicular: { label: 'Folliculaire', bg: '#EDF5ED', border: '#D8E8D8', dot: '#7BAE7F' },
  ovulatory:  { label: 'Ovulatoire',   bg: '#FFF3EB', border: '#F5E0CD', dot: '#E8A87C' },
  luteal:     { label: 'Lutéale',      bg: '#F3EEF8', border: '#E4D9EE', dot: '#B09ACB' },
};
const PHASE_KEYS = ['menstrual', 'follicular', 'ovulatory', 'luteal'];

// Format Instagram → pastille blanche + icône.
const FORMATS = {
  post:     { label: 'Post',      Icon: Image },
  carousel: { label: 'Carrousel', Icon: Images },
  reel:     { label: 'Reel',      Icon: Video },
};
const FORMAT_KEYS = ['post', 'carousel', 'reel'];

// Statut → texte coloré en haut à droite du jour.
const STATUSES = {
  draft:     { label: 'À finir',    color: '#BA7517' },
  ready:     { label: 'Prête',      color: '#5B8A1E' },
  scheduled: { label: 'Programmée', color: '#8A6FB0' },
  published: { label: 'En ligne',   color: '#0F8A63' },
};
const STATUS_KEYS = ['draft', 'ready', 'scheduled', 'published'];

// Thématiques → pastille colorée. Liste modifiable ici.
const THEMES = [
  { value: 'recette',  label: 'Recette',   bg: '#FBEBDF', color: '#B5661F' },
  { value: 'astuce',   label: 'Astuce',    bg: '#E3F0F3', color: '#4E7C8A' },
  { value: 'conseil',  label: 'Conseil',   bg: '#EDEDE3', color: '#6B6650' },
  { value: 'symptome', label: 'Symptôme',  bg: '#FBE7EB', color: '#A85A66' },
  { value: 'quiz',     label: 'Quiz',      bg: '#F0EAF7', color: '#7A5E9E' },
  { value: 'bienetre', label: 'Bien-être', bg: '#EAF3E7', color: '#5A7E4E' },
];
const themeMap = Object.fromEntries(THEMES.map((t) => [t.value, t]));

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// Clé 'YYYY-MM-DD' locale (sans décalage de fuseau).
const dateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

// Brouillon vide pour un nouveau post.
const emptyDraft = (date) => ({
  id: null,
  date,
  phase: 'follicular',
  format: 'post',
  thematique: 'recette',
  titre: '',
  legende: '',
  hashtags: '',
  statut: 'draft',
  heure: '',
  visuel: '',
});

export default function ContentCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [draft, setDraft] = useState(null);   // post en cours d'édition/création
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_posts')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      console.error('Fetch content_posts error:', error);
      // 42P01 = table inexistante → on guide vers la création de la table.
      if (error.code === '42P01') setTableMissing(true);
    } else {
      setTableMissing(false);
      setPosts(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Regroupe les posts par date pour un accès instantané dans la grille.
  const postsByDate = {};
  for (const p of posts) {
    (postsByDate[p.date] ||= []).push(p);
  }

  const goMonth = (delta) => {
    let m = month + delta;
    let y = year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth(m);
    setYear(y);
  };

  const handleSave = async () => {
    if (!draft.titre.trim()) {
      toast('Donne un titre à ton post ✨', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      date: draft.date,
      phase: draft.phase,
      format: draft.format,
      thematique: draft.thematique,
      titre: draft.titre.trim(),
      legende: draft.legende,
      hashtags: draft.hashtags,
      statut: draft.statut,
      heure: draft.heure || null,
      visuel: draft.visuel || null,
    };
    try {
      let error;
      if (draft.id) {
        ({ error } = await supabase.from('content_posts').update(payload).eq('id', draft.id));
      } else {
        ({ error } = await supabase.from('content_posts').insert(payload));
      }
      if (error) throw error;
      toast(draft.id ? 'Post mis à jour ✓' : 'Post ajouté ✓');
      setDraft(null);
      setConfirmDelete(false);
      fetchPosts();
    } catch (err) {
      console.error('Save content_post error:', err);
      toast('Erreur : ' + (err.message || 'réessaie'), 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!draft?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('content_posts').delete().eq('id', draft.id);
      if (error) throw error;
      toast('Post supprimé ✓');
      setDraft(null);
      setConfirmDelete(false);
      fetchPosts();
    } catch (err) {
      console.error('Delete content_post error:', err);
      toast('Erreur : ' + (err.message || 'réessaie'), 'error');
    }
    setSaving(false);
  };

  // ── Construction de la grille (lundi en premier) ──────────────────────────
  const firstOffset = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = lundi
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const rows = Math.ceil((firstOffset + daysInMonth) / 7);
  const cells = [];
  for (let i = 0; i < rows * 7; i++) {
    const dayNum = i - firstOffset + 1;
    if (dayNum < 1) {
      cells.push({ out: true, label: daysInPrev + dayNum });
    } else if (dayNum > daysInMonth) {
      cells.push({ out: true, label: dayNum - daysInMonth });
    } else {
      cells.push({ out: false, day: dayNum, key: dateKey(year, month, dayNum) });
    }
  }

  const monthCount = posts.filter((p) => p.date?.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* En-tête */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-gray-800 flex items-center gap-2">
            <CalendarHeart size={18} className="text-luna-rose" />
            Calendrier édito
          </h3>
          <p className="text-xs text-gray-400 font-body mt-0.5">
            {monthCount} post{monthCount > 1 ? 's' : ''} planifié{monthCount > 1 ? 's' : ''} en {MONTHS[month].toLowerCase()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-body"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
          <button
            onClick={() => { setDraft(emptyDraft(todayKey)); setConfirmDelete(false); }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-luna-rose text-white rounded-xl hover:bg-luna-rose-dark transition-all font-body font-semibold"
          >
            <Plus size={14} />
            Nouveau post
          </button>
        </div>
      </div>

      {tableMissing ? (
        <div className="p-8 text-center">
          <p className="font-body text-gray-700 mb-2">La table <code className="bg-gray-100 px-1.5 py-0.5 rounded">content_posts</code> n'existe pas encore.</p>
          <p className="text-sm text-gray-400 font-body">Crée-la dans Supabase (voir les instructions données), puis clique sur « Actualiser ».</p>
        </div>
      ) : (
        <div className="p-4 sm:p-5">
          {/* Navigation mois */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => goMonth(-1)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors" aria-label="Mois précédent">
              <ChevronLeft size={20} />
            </button>
            <h4 className="font-display text-xl text-gray-800">{MONTHS[month]} {year}</h4>
            <button onClick={() => goMonth(1)} className="p-2 rounded-xl hover:bg-gray-100 text-luna-rose transition-colors" aria-label="Mois suivant">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-gray-400 font-body pb-1">{d}</div>
            ))}
          </div>

          {/* Grille */}
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((c, i) => {
              if (c.out) {
                return <div key={i} className="min-h-[104px] rounded-xl" />;
              }
              const dayPosts = postsByDate[c.key] || [];
              const isToday = c.key === todayKey;
              return (
                <div
                  key={i}
                  onClick={() => { setDraft(emptyDraft(c.key)); setConfirmDelete(false); }}
                  className="min-h-[104px] rounded-xl bg-white border border-gray-100 p-1.5 flex flex-col gap-1 cursor-pointer hover:border-luna-rose/40 transition-colors"
                  style={isToday ? { boxShadow: 'inset 0 0 0 2px #E8A5AE' } : undefined}
                >
                  <span className={`text-[11px] font-semibold font-body ${isToday ? 'text-luna-rose' : 'text-gray-500'}`}>{c.day}</span>
                  {dayPosts.map((p) => {
                    const phase = PHASES[p.phase] || PHASES.follicular;
                    const fmt = FORMATS[p.format] || FORMATS.post;
                    const st = STATUSES[p.statut] || STATUSES.draft;
                    const thm = themeMap[p.thematique];
                    const Icon = fmt.Icon;
                    return (
                      <div
                        key={p.id}
                        onClick={(e) => { e.stopPropagation(); setDraft({ ...emptyDraft(p.date), ...p }); setConfirmDelete(false); }}
                        className="rounded-lg p-1.5 flex flex-col gap-1.5 hover:brightness-[0.98] transition-all"
                        style={{ background: phase.bg, border: `0.5px solid ${phase.border}` }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: phase.dot }} />
                          <span className="text-[9px] font-semibold font-body leading-none ml-auto" style={{ color: st.color }}>{st.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <span className="inline-flex items-center gap-1 text-[8.5px] font-medium font-body px-1.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                            <Icon size={9} />{fmt.label}
                          </span>
                          {thm && (
                            <span className="text-[8.5px] font-medium font-body px-1.5 py-0.5 rounded-full" style={{ background: thm.bg, color: thm.color }}>
                              {thm.label}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-semibold text-gray-800 font-body leading-tight line-clamp-2">{p.titre}</p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Légendes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 font-body mb-2 tracking-wide">FOND = PHASE</p>
              <div className="flex flex-col gap-1.5">
                {PHASE_KEYS.map((k) => (
                  <span key={k} className="flex items-center gap-2 text-xs text-gray-600 font-body">
                    <span className="w-4 h-3 rounded" style={{ background: PHASES[k].bg, border: `0.5px solid ${PHASES[k].border}` }} />
                    {PHASES[k].label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 font-body mb-2 tracking-wide">STATUT (en haut à droite)</p>
              <div className="flex flex-col gap-1.5">
                {STATUS_KEYS.map((k) => (
                  <span key={k} className="text-xs font-semibold font-body" style={{ color: STATUSES[k].color }}>{STATUSES[k].label}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 font-body mb-2 tracking-wide">PASTILLES</p>
              <div className="flex flex-wrap gap-1.5">
                {FORMAT_KEYS.map((k) => {
                  const Icon = FORMATS[k].Icon;
                  return (
                    <span key={k} className="inline-flex items-center gap-1 text-[11px] font-medium font-body px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500">
                      <Icon size={11} />{FORMATS[k].label}
                    </span>
                  );
                })}
                {THEMES.map((t) => (
                  <span key={t.value} className="text-[11px] font-medium font-body px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Fiche d'un post (fenêtre qui monte du bas) ────────────────────── */}
      <AnimatePresence>
        {draft && (
          <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center" onClick={() => { setDraft(null); setConfirmDelete(false); }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[92vh] overflow-y-auto"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              <div className="sticky top-0 bg-white/95 backdrop-blur px-5 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
                <h3 className="font-display text-lg text-gray-800">{draft.id ? 'Modifier le post' : 'Nouveau post'}</h3>
                <button onClick={() => { setDraft(null); setConfirmDelete(false); }} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400"><X size={18} /></button>
              </div>

              <div className="px-5 py-4 space-y-4 font-body">
                {/* Date + heure */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Date">
                    <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="Heure (optionnel)">
                    <input type="time" value={draft.heure || ''} onChange={(e) => setDraft({ ...draft, heure: e.target.value })} className={inputCls} />
                  </Field>
                </div>

                {/* Titre */}
                <Field label="Titre du post">
                  <input type="text" value={draft.titre} onChange={(e) => setDraft({ ...draft, titre: e.target.value })} placeholder="Ex : 3 aliments anti-crampes" className={inputCls} />
                </Field>

                {/* Phase + Format */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Phase du cycle">
                    <select value={draft.phase} onChange={(e) => setDraft({ ...draft, phase: e.target.value })} className={inputCls}>
                      {PHASE_KEYS.map((k) => <option key={k} value={k}>{PHASES[k].label}</option>)}
                    </select>
                  </Field>
                  <Field label="Format">
                    <select value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} className={inputCls}>
                      {FORMAT_KEYS.map((k) => <option key={k} value={k}>{FORMATS[k].label}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Thématique + Statut */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Thématique">
                    <select value={draft.thematique} onChange={(e) => setDraft({ ...draft, thematique: e.target.value })} className={inputCls}>
                      {THEMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Statut">
                    <select value={draft.statut} onChange={(e) => setDraft({ ...draft, statut: e.target.value })} className={inputCls}>
                      {STATUS_KEYS.map((k) => <option key={k} value={k}>{STATUSES[k].label}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Légende */}
                <Field label="Légende (texte de la publication)">
                  <textarea value={draft.legende} onChange={(e) => setDraft({ ...draft, legende: e.target.value })} rows={4} placeholder="Écris ta légende ici…" className={`${inputCls} resize-none`} />
                </Field>

                {/* Hashtags */}
                <Field label="Hashtags">
                  <input type="text" value={draft.hashtags} onChange={(e) => setDraft({ ...draft, hashtags: e.target.value })} placeholder="#cyclemenstruel #alimentation…" className={inputCls} />
                </Field>

                {/* Visuel */}
                <Field label="Lien du visuel (optionnel)">
                  <input type="text" value={draft.visuel || ''} onChange={(e) => setDraft({ ...draft, visuel: e.target.value })} placeholder="URL de l'image / du carrousel" className={inputCls} />
                </Field>
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4 flex items-center gap-3">
                {draft.id && (
                  confirmDelete ? (
                    <div className="flex items-center gap-2 mr-auto">
                      <span className="text-xs text-gray-500">Sûre ?</span>
                      <button onClick={handleDelete} disabled={saving} className="px-3 py-2 text-sm bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">Supprimer</button>
                      <button onClick={() => setConfirmDelete(false)} className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(true)} className="p-2.5 mr-auto text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Supprimer">
                      <Trash2 size={18} />
                    </button>
                  )
                )}
                <button onClick={() => { setDraft(null); setConfirmDelete(false); }} className="px-4 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Annuler</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm bg-luna-rose text-white rounded-xl font-semibold hover:bg-luna-rose-dark transition-colors disabled:opacity-60">
                  {saving ? 'Un instant…' : draft.id ? 'Enregistrer' : 'Ajouter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-luna-rose focus:ring-2 focus:ring-luna-rose/20 transition-all';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
