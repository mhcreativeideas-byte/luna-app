// Fonction serveur Vercel — appelée automatiquement chaque jour (Cron).
// Si le jeton Instagram a plus de ~45 jours, elle en demande un frais à Meta
// (valable 60 jours de plus) et le range dans Supabase. Zéro action manuelle.

const IG_GRAPH = 'https://graph.instagram.com';

async function sb(path, options = {}) {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

export default async function handler(req, res) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.VITE_SUPABASE_URL) {
    return res.status(500).json({ ok: false, reason: 'not_configured' });
  }
  try {
    // Lit le jeton actuel + sa date.
    const r = await sb('meta_tokens?id=eq.instagram&select=access_token,updated_at');
    const rows = await r.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) return res.status(200).json({ ok: false, reason: 'no_token' });

    const ageDays = (Date.now() - new Date(row.updated_at).getTime()) / 86400000;
    if (ageDays < 45) {
      return res.status(200).json({ ok: true, skipped: true, ageDays: Math.round(ageDays) });
    }

    // Demande un jeton frais (valable 60 j).
    const refRes = await fetch(`${IG_GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(row.access_token)}`);
    const refData = await refRes.json();
    if (refData.error) return res.status(200).json({ ok: false, error: refData.error.message });

    // Range le nouveau jeton.
    await sb('meta_tokens', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ id: 'instagram', access_token: refData.access_token, updated_at: new Date().toISOString() }),
    });

    return res.status(200).json({ ok: true, refreshed: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
