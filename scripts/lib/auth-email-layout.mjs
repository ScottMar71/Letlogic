const SITE_URL = "https://www.letlogic.app";
const LOGO_URL = `${SITE_URL}/brand/logo-stacked.svg`;
const SUPPORT_EMAIL = "support@letlogic.app";

const BRAND = {
  navy: "#0F1C2E",
  teal: "#00C49F",
  muted: "#5A6B7D",
  border: "#E8ECF0",
  canvas: "#F4F6F8",
};

export function emailButton(href, label) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
  <tr>
    <td align="center" style="border-radius:8px;background-color:${BRAND.teal};">
      <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr>
</table>`;
}

export function emailOtpCode(token) {
  return `<p style="margin:24px 0;font-size:32px;font-weight:700;letter-spacing:0.35em;color:${BRAND.navy};">${token}</p>`;
}

export function wrapAuthEmail({ title, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.canvas};font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${BRAND.canvas};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,28,46,0.08);">
          <tr>
            <td align="center" style="padding:40px 40px 24px;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <img src="${LOGO_URL}" alt="LetLogic" width="160" height="136" style="display:block;border:0;max-width:160px;width:160px;height:auto;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px;color:${BRAND.navy};font-size:16px;line-height:1.6;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 40px;border-top:1px solid ${BRAND.border};color:${BRAND.muted};font-size:14px;line-height:1.6;">
              <p style="margin:0 0 8px;font-weight:600;color:${BRAND.navy};">The LetLogic team</p>
              <p style="margin:0 0 4px;">LetLogic Ltd · Tenant screening for UK landlords</p>
              <p style="margin:0;">
                <a href="mailto:${SUPPORT_EMAIL}" style="color:${BRAND.teal};text-decoration:none;">${SUPPORT_EMAIL}</a>
                · <a href="${SITE_URL}" style="color:${BRAND.teal};text-decoration:none;">www.letlogic.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
