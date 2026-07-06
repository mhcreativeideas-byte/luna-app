// Fonction serveur Vercel — envoie l'email de bienvenue luna via Resend.
//
// Déclenchée par un Webhook Supabase (Database → Webhooks) sur l'INSERT
// d'une ligne dans la table `users` (= fin d'onboarding, le prénom est connu).
// L'inscription reste « entrée immédiate » : aucun blocage, l'email arrive
// en parallèle.
//
// Variables d'environnement Vercel nécessaires :
//   RESEND_API_KEY         — clé API Resend (commence par re_...)
//   WELCOME_WEBHOOK_SECRET — mot de passe partagé avec le webhook Supabase
// Optionnel :
//   WELCOME_FROM           — expéditeur (défaut : luna <hello@lunawellness.app>)

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

// Prénom nettoyé : première lettre en majuscule, pas d'injection HTML.
function cleanFirstName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const first = raw.trim().split(/\s+/)[0] || '';
  const safe = first.replace(/[<>&"]/g, '').slice(0, 40);
  if (!safe) return '';
  return safe.charAt(0).toUpperCase() + safe.slice(1);
}

// Gabarit de l'email (design validé + charte luna). `name` peut être vide.
function welcomeEmailHtml(name) {
  const logo = 'https://lunawellness.app/email-logo-luna.png';
  const intro = name
    ? `${name}, il y a des jours où tu débordes d'énergie. Et d'autres où ton corps te demande de ralentir, sans que tu comprennes pourquoi.`
    : `Il y a des jours où tu débordes d'énergie. Et d'autres où ton corps te demande de ralentir, sans que tu comprennes pourquoi.`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,500&family=DM+Sans:wght@400;600&display=swap" rel="stylesheet">
<title>Bienvenue sur luna</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF7F5;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#FAF7F5;font-size:1px;line-height:1px;">
    Fini de deviner. Voici comment manger et vivre au rythme de ton cycle.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF7F5;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#FFFFFF;border-radius:28px;overflow:hidden;box-shadow:0 8px 40px rgba(45,34,38,0.06);">

          <tr>
            <td align="center" style="background-color:#F0C4C9;background-image:linear-gradient(160deg,#F0C4C9 0%,#EDC4B3 55%,#FAF8F5 100%);padding:44px 32px 40px;">
              <img src="${logo}" width="132" alt="luna" style="display:block;width:132px;height:auto;border:0;margin:0 auto 14px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;color:#7d5b60;letter-spacing:0.2px;">
                Ton bien-être, au rythme de ton corps
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 34px 8px;">

              <h1 style="margin:0 0 22px;font-family:'Playfair Display',Georgia,serif;font-weight:600;font-size:26px;line-height:1.3;color:#2D2226;">
                Ton rythme commence ici 🌙
              </h1>

              <p style="margin:0 0 18px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;color:#4A3F43;">
                ${intro}
              </p>

              <p style="margin:0 0 18px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;color:#4A3F43;">
                Ce n'est pas dans ta tête. C'est ton cycle. Et à partir d'aujourd'hui, tu n'as plus à le deviner.
              </p>

              <p style="margin:0 0 28px;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:16px;line-height:1.65;color:#4A3F43;">
                <strong style="color:#2D2226;">luna</strong> lit ta phase et t'accompagne, un jour après l'autre, pour manger et vivre en accord avec ton corps.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 0;border-top:1px solid #F0EAE6;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                      <td valign="top" style="width:44px;">
                        <div style="width:34px;height:34px;border-radius:12px;background-color:#FDE8EB;text-align:center;line-height:34px;font-size:17px;">🌙</div>
                      </td>
                      <td valign="middle" style="font-family:'DM Sans',-apple-system,sans-serif;font-size:15.5px;line-height:1.5;color:#4A3F43;">
                        <strong style="color:#2D2226;">Tu sais où tu en es.</strong> Ta phase du jour, expliquée en douceur.
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-top:1px solid #F0EAE6;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                      <td valign="top" style="width:44px;">
                        <div style="width:34px;height:34px;border-radius:12px;background-color:#EDF5ED;text-align:center;line-height:34px;font-size:17px;">🥗</div>
                      </td>
                      <td valign="middle" style="font-family:'DM Sans',-apple-system,sans-serif;font-size:15.5px;line-height:1.5;color:#4A3F43;">
                        <strong style="color:#2D2226;">Tu manges ce qui te fait du bien.</strong> Recettes et aliments adaptés à ta phase.
                      </td>
                    </tr></table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 0;border-top:1px solid #F0EAE6;border-bottom:1px solid #F0EAE6;">
                    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                      <td valign="top" style="width:44px;">
                        <div style="width:34px;height:34px;border-radius:12px;background-color:#F3EEF8;text-align:center;line-height:34px;font-size:17px;">🛒</div>
                      </td>
                      <td valign="middle" style="font-family:'DM Sans',-apple-system,sans-serif;font-size:15.5px;line-height:1.5;color:#4A3F43;">
                        <strong style="color:#2D2226;">Zéro charge mentale.</strong> Ton menu du jour et ta liste de courses, déjà prêts.
                      </td>
                    </tr></table>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:32px 0 8px;">
                <tr>
                  <td align="center">
                    <a href="https://lunawellness.app" style="display:block;background-color:#C4727F;color:#FFFFFF;font-family:'DM Sans',-apple-system,sans-serif;font-size:16.5px;font-weight:600;text-decoration:none;text-align:center;padding:17px 24px;border-radius:16px;">
                      Découvrir mon rythme
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 4px;font-family:'DM Sans',-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#756568;">
                Prends soin de toi, on avance à ton rythme.
              </p>
              <p style="margin:0 0 4px;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:16px;color:#2D2226;">
                L'équipe luna
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:28px 34px 34px;">
              <div style="border-top:1px solid #F0EAE6;padding-top:22px;text-align:center;">
                <a href="https://instagram.com/luna.cyclesfood" style="font-family:'DM Sans',-apple-system,sans-serif;font-size:14px;color:#C4727F;text-decoration:none;">Suis-nous sur Instagram · @luna.cyclesfood</a>
                <div style="margin-top:10px;font-family:'DM Sans',-apple-system,sans-serif;font-size:12.5px;color:#A79B9E;">
                  © luna wellness · <a href="https://lunawellness.app" style="color:#A79B9E;text-decoration:underline;">lunawellness.app</a>
                </div>
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, reason: 'method_not_allowed' });
  }
  if (!process.env.RESEND_API_KEY || !process.env.WELCOME_WEBHOOK_SECRET) {
    return res.status(500).json({ ok: false, reason: 'not_configured' });
  }

  // Sécurité : le webhook Supabase doit envoyer ce mot de passe partagé.
  const secret = req.headers['x-webhook-secret'];
  if (secret !== process.env.WELCOME_WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false, reason: 'unauthorized' });
  }

  try {
    // Payload d'un webhook Supabase : { type, table, record, old_record }.
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    if (body.type && body.type !== 'INSERT') {
      return res.status(200).json({ ok: true, skipped: 'not_insert' });
    }
    const record = body.record || {};
    const email = (record.email || '').trim();
    if (!email) {
      return res.status(200).json({ ok: true, skipped: 'no_email' });
    }

    const name = cleanFirstName(record.name);
    const from = process.env.WELCOME_FROM || 'luna <hello@lunawellness.app>';

    const resendRes = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Bienvenue sur luna 🌙',
        html: welcomeEmailHtml(name),
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      return res.status(200).json({ ok: false, reason: 'resend_error', status: resendRes.status, detail });
    }

    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
