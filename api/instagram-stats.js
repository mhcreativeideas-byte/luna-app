// Fonction serveur Vercel — récupère les statistiques Instagram de Luna.
// Lit META_ACCESS_TOKEN (clé de Page) + IG_USER_ID dans les variables Vercel,
// appelle l'API Graph de Meta, et renvoie les chiffres au tableau de bord admin.
// Protégée : n'accepte que la connexion de l'admin (jeton Supabase vérifié).
//
// Variables Vercel nécessaires : META_ACCESS_TOKEN, IG_USER_ID
// (+ VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, déjà présentes, pour la sécurité).

// Système « Instagram Login » : les appels passent par graph.instagram.com
// (non versionné), avec le jeton Instagram longue durée (META_ACCESS_TOKEN).
const GRAPH = 'https://graph.instagram.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mhcreative.ideas@gmail.com';

async function verifyAdmin(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  try {
    const r = await fetch(`${url}/auth/v1/user`, {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return false;
    const u = await r.json();
    return u && u.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

async function gget(path, params) {
  const token = (process.env.META_ACCESS_TOKEN || '').trim();
  const qs = new URLSearchParams({ ...params, access_token: token }).toString();
  const r = await fetch(`${GRAPH}/${path}?${qs}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message);
  return j;
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const TOKEN = process.env.META_ACCESS_TOKEN;
  const IG = process.env.IG_USER_ID;
  if (!TOKEN || !IG) {
    return res.status(200).json({ connected: false, reason: 'not_configured' });
  }

  if (!(await verifyAdmin(req))) {
    return res.status(401).json({ connected: false, reason: 'unauthorized' });
  }

  const errors = [];
  const out = { connected: true };

  // 1) Profil : abonnés + nombre de posts (fiable). `me` = le compte du jeton.
  try {
    const p = await gget(`me`, { fields: 'followers_count,media_count,username' });
    out.username = p.username;
    out.followers = p.followers_count ?? null;
    out.mediaCount = p.media_count ?? null;
  } catch (e) { errors.push('profil: ' + e.message); }

  // 2) Posts récents (jusqu'à 30) : sert au top/flop et à l'engagement
  let media = [];
  try {
    const m = await gget(`me/media`, {
      fields: 'id,caption,media_type,thumbnail_url,media_url,permalink,timestamp,like_count,comments_count',
      limit: '30',
    });
    media = (m.data || []).map((x) => ({
      id: x.id,
      caption: (x.caption || '').slice(0, 90),
      thumb: x.thumbnail_url || x.media_url || null,
      permalink: x.permalink,
      type: x.media_type,
      likes: x.like_count || 0,
      comments: x.comments_count || 0,
      score: (x.like_count || 0) + (x.comments_count || 0),
    }));
  } catch (e) { errors.push('media: ' + e.message); }

  if (media.length) {
    const sorted = [...media].sort((a, b) => b.score - a.score);
    out.topPost = sorted[0];
    out.worstPost = sorted[sorted.length - 1];
    const avg = media.reduce((s, x) => s + x.score, 0) / media.length;
    out.avgInteractions = Math.round(avg);
    if (out.followers) {
      out.engagementRate = Math.round((avg / out.followers) * 1000) / 10; // % à 1 décimale
    }
    // Répartition par format (post / carrousel / reel)
    const fmt = {};
    for (const x of media) fmt[x.type] = (fmt[x.type] || 0) + 1;
    out.byFormat = fmt;
  }

  // 3) Portée sur ~30 jours. API Instagram Login : metric_type=total_value requis.
  try {
    const until = Math.floor(Date.now() / 1000);
    const since = until - 30 * 24 * 3600;
    const ins = await gget(`${IG}/insights`, {
      metric: 'reach', period: 'day', metric_type: 'total_value',
      since: String(since), until: String(until),
    });
    out.reach30 = ins.data?.[0]?.total_value?.value ?? null;
  } catch (e) { errors.push('reach: ' + e.message); }

  // 4) Nouveaux abonnés : la métrique follower_count n'est PAS fournie par Meta
  // pour les comptes de moins de 100 abonnés -> on n'appelle pas (reste « — »).

  out.errors = errors;
  return res.status(200).json(out);
}
