import { site } from "@/lib/site";

export type IntakeSubmittedEmailInput = {
  landlordName: string | null;
  landlordEmail: string;
  applicantName: string;
  propertyLabel: string | null;
  reviewUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function intakeSubmittedSubject(applicantName: string): string {
  return `Applicant form received — ${applicantName}`;
}

export function buildIntakeSubmittedEmail(input: IntakeSubmittedEmailInput): {
  subject: string;
  html: string;
  text: string;
} {
  const applicant = escapeHtml(input.applicantName);
  const greeting = input.landlordName
    ? `Hi ${escapeHtml(input.landlordName)},`
    : "Hi,";
  const propertyLine = input.propertyLabel
    ? ` for <strong>${escapeHtml(input.propertyLabel)}</strong>`
    : "";
  const propertyText = input.propertyLabel ? ` for ${input.propertyLabel}` : "";

  const subject = intakeSubmittedSubject(input.applicantName);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4F6F8;font-family:'DM Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F4F6F8;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,28,46,0.08);">
          <tr>
            <td align="center" style="padding:40px 40px 24px;">
              <a href="${site.url}" style="text-decoration:none;">
                <img src="${site.url}/brand/logo-stacked.svg" alt="${site.name}" width="160" height="136" style="display:block;border:0;max-width:160px;width:160px;height:auto;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px;color:#0F1C2E;font-size:16px;line-height:1.6;">
              <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;color:#0F1C2E;">Applicant form received</h1>
              <p style="margin:0 0 16px;">${greeting}</p>
              <p style="margin:0 0 16px;"><strong>${applicant}</strong> has submitted their tenant application${propertyLine}.</p>
              <p style="margin:0 0 16px;">Review their answers in LetLogic, then run the screening when you're ready (uses one credit).</p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="border-radius:8px;background-color:#00C49F;">
                    <a href="${input.reviewUrl}" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:8px;">Review &amp; screen</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:14px;color:#5A6B7D;">You can also open this from your <a href="${site.url}/dashboard" style="color:#00C49F;text-decoration:none;">dashboard</a> under Applicant forms.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px 40px;border-top:1px solid #E8ECF0;color:#5A6B7D;font-size:14px;line-height:1.6;">
              <p style="margin:0 0 8px;font-weight:600;color:#0F1C2E;">The ${site.name} team</p>
              <p style="margin:0 0 4px;">${site.company.legalName} · Tenant screening for UK landlords</p>
              <p style="margin:0;">
                <a href="mailto:${site.email}" style="color:#00C49F;text-decoration:none;">${site.email}</a>
                · <a href="${site.url}" style="color:#00C49F;text-decoration:none;">${site.domain}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${greeting.replace(/<[^>]+>/g, "")}

${input.applicantName} has submitted their tenant application${propertyText}.

Review their answers and run the screening when you're ready (uses one credit):
${input.reviewUrl}

Dashboard: ${site.url}/dashboard

—
The ${site.name} team
${site.company.legalName}
${site.email}`;

  return { subject, html, text };
}
