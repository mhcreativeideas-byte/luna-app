// Fonction serveur Vercel — assistant de connexion Meta en UN clic.
// La cliente ouvre cette page, clique « Se connecter à Instagram », approuve
// sur Facebook (Page Luna + compte Instagram), et Facebook la renvoie ici avec
// un code. La fonction échange ce code, trouve la Page + le compte Instagram,
// et affiche les 2 valeurs à coller dans Vercel (META_ACCESS_TOKEN, IG_USER_ID).
//
// Variables Vercel nécessaires : META_APP_ID, META_APP_SECRET.
// À configurer côté Meta une fois : ajouter l'URL de redirection
//   https://lunawellness.app/api/meta-setup
// dans « Facebook Login for Business » → Paramètres → URI de redirection OAuth valides.

const GRAPH = 'https://graph.facebook.com/v21.0';
const SCOPES = 'pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights';

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
  const APP_ID = process.env.META_APP_ID;
  const redirect = redirectUri(req);
  const dialog = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirect)}&scope=${encodeURIComponent(SCOPES)}&response_type=code`;
  return page(`
    <h1>🌙 Connexion Instagram de Luna</h1>
    <p>Clique sur le bouton ci-dessous, puis <b>approuve sur Facebook</b> (choisis ta Page Luna et ton compte Instagram). C'est tout : tu n'as aucune case à cocher.</p>
    ${message ? `<div class="err">${message}</div>` : ''}
    <a class="btn" href="${dialog}">Se connecter à Instagram →</a>
  `);
}

export default async function handler(req, res) {
  const APP_ID = process.env.META_APP_ID;
  const APP_SECRET = process.env.META_APP_SECRET;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!APP_ID || !APP_SECRET) {
    return res.status(500).send(page(`<h1>Configuration incomplète</h1>
      <p class="err">Il manque <span class="k">META_APP_ID</span> et/ou <span class="k">META_APP_SECRET</span> dans Vercel. Ajoute-les, redéploie, puis recharge cette page.</p>`));
  }

  const url = new URL(req.url, `https://${req.headers['x-forwarded-host'] || req.headers.host}`);
  const code = url.searchParams.get('code');
  const oauthErr = url.searchParams.get('error_description') || url.searchParams.get('error');

  if (oauthErr) {
    return res.status(200).send(connectPage(req, 'Connexion refusée ou annulée : ' + oauthErr + '. Réessaie.'));
  }

  if (!code) {
    return res.status(200).send(connectPage(req, null));
  }

  // On a le code : on l'échange contre un jeton, puis on cherche la Page + Instagram.
  try {
    const redirect = redirectUri(req);
    const exRes = await fetch(`${GRAPH}/oauth/access_token?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(redirect)}&client_secret=${APP_SECRET}&code=${encodeURIComponent(code)}`);
    const exData = await exRes.json();
    if (exData.error) throw new Error(exData.error.message);
    let userToken = exData.access_token;

    // Passe en longue durée (~60 jours).
    const llRes = await fetch(`${GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${encodeURIComponent(userToken)}`);
    const llData = await llRes.json();
    if (llData.access_token) userToken = llData.access_token;

    // Trouve la Page + le compte Instagram lié + le jeton de Page (ne périme pas).
    const pagesRes = await fetch(`${GRAPH}/me/accounts?fields=name,access_token,instagram_business_account{id,username}&access_token=${encodeURIComponent(userToken)}`);
    const pagesData = await pagesRes.json();
    if (pagesData.error) throw new Error(pagesData.error.message);

    const pages = pagesData.data || [];
    const withIg = pages.find((p) => p.instagram_business_account && p.instagram_business_account.id);

    if (!withIg) {
      const names = pages.map((p) => p.name).join(', ') || 'aucune';
      return res.status(200).send(page(`<h1>Compte Instagram introuvable</h1>
        <p class="err">Aucune de tes Pages n'a de compte Instagram professionnel lié. Pages trouvées : ${names}.</p>
        <p>Vérifie que <b>@luna.cyclesfood</b> est bien un compte <b>Professionnel</b> relié à ta Page Facebook, puis réessaie.</p>
        <a class="btn" href="/api/meta-setup">← Réessayer</a>`));
    }

    const igId = withIg.instagram_business_account.id;
    const igUser = withIg.instagram_business_account.username || '';
    const pageToken = withIg.access_token;

    return res.status(200).send(page(`
      <h1>✅ C'est bon, ta connexion est prête !</h1>
      <p>Compte Instagram détecté : <span class="k">@${igUser}</span> (Page « ${withIg.name} »).</p>
      <p>Copie les <b>2 valeurs</b> ci-dessous et colle-les dans <b>Vercel</b> (Settings → Environment Variables → Add) :</p>

      <label>1. Variable <span class="k">META_ACCESS_TOKEN</span></label>
      <div class="val">${pageToken}</div>

      <label>2. Variable <span class="k">IG_USER_ID</span></label>
      <div class="val">${igId}</div>

      <ol>
        <li>Crée ces 2 variables dans Vercel avec exactement ces noms (environnement Production).</li>
        <li>Redéploie l'app (Deployments → Redeploy).</li>
        <li>Ouvre l'onglet <b>Statistiques</b> dans l'admin : tes vrais chiffres s'affichent.</li>
      </ol>
      <p style="color:#756568;font-size:13px">Garde cette page privée puis ferme-la. Cette clé de Page ne périme pas tant que tu ne retires pas l'app.</p>
    `));
  } catch (err) {
    return res.status(200).send(connectPage(req, 'Erreur : ' + (err.message || 'réessaie') + '.'));
  }
}
