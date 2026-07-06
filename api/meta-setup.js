// Fonction serveur Vercel — connexion Instagram en UN clic (système « Instagram
// Login », le nouveau système Meta). La cliente ouvre cette page, clique
// « Se connecter à Instagram », approuve sur Instagram, et est renvoyée ici avec
// un code. La fonction échange le code contre un jeton longue durée (60 j) et
// affiche les 2 valeurs à coller dans Vercel : META_ACCESS_TOKEN + IG_USER_ID.
//
// Variables Vercel nécessaires : IG_APP_ID, IG_APP_SECRET
//   (= « Identifiant de l'app Instagram » + « Clé secrète de l'app Instagram »,
//    à récupérer dans le cas d'usage Instagram de l'app Meta — PAS les mêmes
//    que META_APP_ID/META_APP_SECRET, qui sont côté Facebook).
// À configurer côté Meta une fois : ajouter l'URI de redirection
//   https://lunawellness.app/api/meta-setup
// dans les réglages « Business login » du cas d'usage Instagram.

const IG_AUTH = 'https://www.instagram.com/oauth/authorize';
const IG_TOKEN = 'https://api.instagram.com/oauth/access_token';
const IG_GRAPH = 'https://graph.instagram.com';
// Scope minimal et sûr pour lire profil + médias (abonnés, posts, likes/comm.).
const SCOPES = 'instagram_business_basic';

function redirectUri(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `https://${host}/api/meta-setup`;
}

function page(bodyHtml) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connexion Instagram — Luna</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAF7F5;color:#2D2226;margin:0;padding:24px;line-height:1.5}
  .card{max-width:640px;margin:24px auto;background:#fff;border:1px solid #F0E4E6;border-radius:20px;padding:24px}
  h1{font-size:20px;margin:0 0 8px}
  p{color:#4A3F43;font-size:15px}
  a.btn{display:inline-block;margin-top:12px;background:#C4727F;color:#fff;text-decoration:none;border-radius:12px;padding:14px 22px;font-size:16px;font-weight:600}
  label{display:block;font-weight:600;font-size:14px;margin:16px 0 6px}
  .val{background:#F5F1EE;border:1px solid #E4D9DB;border-radius:12px;padding:12px;font-family:monospace;font-size:13px;word-break:break-all;margin:6px 0 16px;user-select:all}
  .k{display:inline-block;background:#FDE8EB;color:#A85A66;font-weight:600;font-size:12px;padding:3px 8px;border-radius:8px}
  .err{background:#FCEBEB;border:1px solid #F0C0C0;color:#A32D2D;border-radius:12px;padding:12px;font-size:14px}
  ol{color:#4A3F43;font-size:14px}
</style></head><body><div class="card">${bodyHtml}</div></body></html>`;
}

function connectPage(req, message) {
  const IG_APP_ID = process.env.IG_APP_ID;
  const redirect = redirectUri(req);
  const dialog = `${IG_AUTH}?client_id=${IG_APP_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
  return page(`
    <h1>🌙 Connexion Instagram de Luna</h1>
    <p>Clique sur le bouton ci-dessous, puis <b>approuve sur Instagram</b>. C'est tout : aucune case à cocher.</p>
    ${message ? `<div class="err">${message}</div>` : ''}
    <a class="btn" href="${dialog}">Se connecter à Instagram →</a>
  `);
}

export default async function handler(req, res) {
  const IG_APP_ID = process.env.IG_APP_ID;
  const IG_APP_SECRET = process.env.IG_APP_SECRET;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!IG_APP_ID || !IG_APP_SECRET) {
    return res.status(500).send(page(`<h1>Configuration incomplète</h1>
      <p class="err">Il manque <span class="k">IG_APP_ID</span> et/ou <span class="k">IG_APP_SECRET</span> dans Vercel. Ajoute-les (ce sont l'identifiant et la clé secrète de l'app <b>Instagram</b>), redéploie, puis recharge cette page.</p>`));
  }

  const url = new URL(req.url, `https://${req.headers['x-forwarded-host'] || req.headers.host}`);
  const code = url.searchParams.get('code');
  const oauthErr = url.searchParams.get('error_description') || url.searchParams.get('error');

  if (oauthErr) return res.status(200).send(connectPage(req, 'Connexion refusée ou annulée : ' + oauthErr + '. Réessaie.'));
  if (!code) return res.status(200).send(connectPage(req, null));

  try {
    const redirect = redirectUri(req);

    // 1) Échange le code contre un jeton court + l'ID utilisateur Instagram.
    const body = new URLSearchParams({
      client_id: IG_APP_ID,
      client_secret: IG_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: redirect,
      code,
    });
    const tRes = await fetch(IG_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const tData = await tRes.json();
    if (tData.error_message || tData.error) throw new Error(tData.error_message || tData.error_type || 'échange du code impossible');
    const first = Array.isArray(tData.data) ? tData.data[0] : tData;
    const shortToken = first.access_token;
    const userId = first.user_id;
    if (!shortToken) throw new Error('jeton court introuvable dans la réponse');

    // 2) Passe le jeton en longue durée (60 jours).
    const llRes = await fetch(`${IG_GRAPH}/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(IG_APP_SECRET)}&access_token=${encodeURIComponent(shortToken)}`);
    const llData = await llRes.json();
    if (llData.error) throw new Error(llData.error.message);
    const longToken = llData.access_token || shortToken;

    return res.status(200).send(page(`
      <h1>✅ C'est bon, ta connexion Instagram est prête !</h1>
      <p>Copie les <b>2 valeurs</b> ci-dessous et colle-les dans <b>Vercel</b> (Settings → Environment Variables → Add) :</p>

      <label>1. Variable <span class="k">META_ACCESS_TOKEN</span></label>
      <div class="val">${longToken}</div>

      <label>2. Variable <span class="k">IG_USER_ID</span></label>
      <div class="val">${userId}</div>

      <ol>
        <li>Crée ces 2 variables dans Vercel avec exactement ces noms (environnement Production).</li>
        <li>Redéploie l'app (Deployments → Redeploy).</li>
        <li>Ouvre l'onglet <b>Statistiques</b> dans l'admin : tes vrais chiffres s'affichent.</li>
      </ol>
      <p style="color:#756568;font-size:13px">Cette clé dure 60 jours (renouvelable automatiquement plus tard). Garde cette page privée puis ferme-la.</p>
    `));
  } catch (err) {
    return res.status(200).send(connectPage(req, 'Erreur : ' + (err.message || 'réessaie') + '.'));
  }
}
