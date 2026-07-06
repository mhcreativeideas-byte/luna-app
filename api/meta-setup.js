// Fonction serveur Vercel — assistant de connexion Meta (une seule fois).
// Tu colles ton jeton court (généré dans l'Explorateur d'API Graph), et cette
// page te renvoie : (1) une CLÉ D'ACCÈS longue durée (Page, ne périme pas) et
// (2) l'IDENTIFIANT de ton compte Instagram. Tu colles ensuite ces 2 valeurs
// dans Vercel (META_ACCESS_TOKEN et IG_USER_ID).
//
// Nécessite les variables d'environnement : META_APP_ID, META_APP_SECRET.

const GRAPH = 'https://graph.facebook.com/v21.0';

function page(bodyHtml) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connexion Instagram — Luna</title>
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAF7F5;color:#2D2226;margin:0;padding:24px;line-height:1.5}
  .card{max-width:640px;margin:24px auto;background:#fff;border:1px solid #F0E4E6;border-radius:20px;padding:24px}
  h1{font-size:20px;margin:0 0 8px}
  p{color:#4A3F43;font-size:15px}
  label{display:block;font-weight:600;font-size:14px;margin:16px 0 6px}
  textarea{width:100%;box-sizing:border-box;padding:12px;border:1px solid #E4D9DB;border-radius:12px;font-size:13px;min-height:90px;font-family:monospace}
  button{margin-top:16px;background:#C4727F;color:#fff;border:0;border-radius:12px;padding:12px 20px;font-size:15px;font-weight:600;cursor:pointer}
  .val{background:#F5F1EE;border:1px solid #E4D9DB;border-radius:12px;padding:12px;font-family:monospace;font-size:13px;word-break:break-all;margin:6px 0 16px;user-select:all}
  .k{display:inline-block;background:#FDE8EB;color:#A85A66;font-weight:600;font-size:12px;padding:3px 8px;border-radius:8px}
  .err{background:#FCEBEB;border:1px solid #F0C0C0;color:#A32D2D;border-radius:12px;padding:12px;font-size:14px}
  ol{color:#4A3F43;font-size:14px}
</style></head><body><div class="card">${bodyHtml}</div></body></html>`;
}

function form(message) {
  return page(`
    <h1>🌙 Connexion Instagram de Luna</h1>
    <p>Colle ci-dessous le <b>jeton d'accès court</b> que tu viens de générer dans l'Explorateur d'API Graph, puis clique sur le bouton.</p>
    ${message ? `<div class="err">${message}</div>` : ''}
    <form method="POST">
      <label>Jeton d'accès (colle-le ici)</label>
      <textarea name="token" placeholder="EAAB..." required></textarea>
      <button type="submit">Générer ma clé longue durée →</button>
    </form>
  `);
}

export default async function handler(req, res) {
  const APP_ID = process.env.META_APP_ID;
  const APP_SECRET = process.env.META_APP_SECRET;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!APP_ID || !APP_SECRET) {
    return res.status(500).send(page(`<h1>Configuration incomplète</h1>
      <p class="err">Il manque <span class="k">META_APP_ID</span> et/ou <span class="k">META_APP_SECRET</span> dans les variables d'environnement Vercel. Ajoute-les d'abord, puis recharge cette page.</p>`));
  }

  if (req.method !== 'POST') {
    return res.status(200).send(form(null));
  }

  // Récupère le jeton collé (Vercel parse le corps du formulaire).
  let shortToken = (req.body && (req.body.token || req.body.get?.('token'))) || '';
  if (typeof shortToken !== 'string') shortToken = String(shortToken || '');
  shortToken = shortToken.trim();
  if (!shortToken) return res.status(200).send(form('Le jeton est vide, colle-le à nouveau.'));

  try {
    // 1) Échange court -> longue durée (~60 jours pour un jeton utilisateur).
    const exRes = await fetch(`${GRAPH}/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${encodeURIComponent(shortToken)}`);
    const exData = await exRes.json();
    if (exData.error) throw new Error(exData.error.message);
    const longUserToken = exData.access_token;

    // 2) Trouve la Page + le compte Instagram lié + le jeton de Page (ne périme pas).
    const pagesRes = await fetch(`${GRAPH}/me/accounts?fields=name,access_token,instagram_business_account{id,username}&access_token=${encodeURIComponent(longUserToken)}`);
    const pagesData = await pagesRes.json();
    if (pagesData.error) throw new Error(pagesData.error.message);

    const pages = pagesData.data || [];
    const withIg = pages.find((p) => p.instagram_business_account && p.instagram_business_account.id);

    if (!withIg) {
      const names = pages.map((p) => p.name).join(', ') || 'aucune';
      return res.status(200).send(page(`<h1>Compte Instagram introuvable</h1>
        <p class="err">Aucune de tes Pages n'a de compte Instagram professionnel lié. Pages trouvées : ${names}.</p>
        <p>Vérifie que <b>@luna.cyclesfood</b> est bien un compte <b>Professionnel</b> relié à ta Page Facebook, puis régénère un jeton et réessaie.</p>`));
    }

    const igId = withIg.instagram_business_account.id;
    const igUser = withIg.instagram_business_account.username || '';
    const pageToken = withIg.access_token; // jeton de Page longue durée (ne périme pas)

    return res.status(200).send(page(`
      <h1>✅ C'est bon, ta connexion est prête !</h1>
      <p>Compte Instagram détecté : <span class="k">@${igUser}</span> (Page « ${withIg.name} »).</p>
      <p>Copie les <b>2 valeurs</b> ci-dessous et colle-les dans <b>Vercel</b> (Settings → Environment Variables) :</p>

      <label>1. Variable <span class="k">META_ACCESS_TOKEN</span></label>
      <div class="val">${pageToken}</div>

      <label>2. Variable <span class="k">IG_USER_ID</span></label>
      <div class="val">${igId}</div>

      <ol>
        <li>Crée ces 2 variables dans Vercel avec exactement ces noms.</li>
        <li>Redéploie l'app (Vercel → Deployments → Redeploy).</li>
        <li>Ouvre l'onglet <b>Statistiques</b> dans l'admin : tes vrais chiffres s'affichent.</li>
      </ol>
      <p style="color:#756568;font-size:13px">Cette clé de Page ne périme pas tant que tu ne changes pas ton mot de passe / ne retires pas l'app. Garde cette page privée puis ferme-la.</p>
    `));
  } catch (err) {
    return res.status(200).send(form('Erreur : ' + (err.message || 'jeton invalide ou expiré. Régénère un jeton et réessaie.')));
  }
}
