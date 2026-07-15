import { captureServerError } from "@/lib/observability/sentry";
import { sendEmail } from "@/lib/email/ses";
import { buildIntakeSubmittedEmail } from "@/lib/email/templates/intake-submitted";
import { site } from "@/lib/site";

export type IntakeSubmittedNotification = {
  intakeLinkId: string;
  landlordEmail: string;
  landlordName: string | null;
  applicantName: string;
  propertyLabel: string | null;
};

/** Notify the landlord that an applicant submitted their intake form. */
export async function sendIntakeSubmittedEmail(
  input: IntakeSubmittedNotification,
): Promise<void> {
  const reviewUrl = `${site.url}/screen?intake=${input.intakeLinkId}`;
  const { subject, html, text } = buildIntakeSubmittedEmail({
    landlordName: input.landlordName,
    landlordEmail: input.landlordEmail,
    applicantName: input.applicantName,
    propertyLabel: input.propertyLabel,
    reviewUrl,
  });

  const result = await sendEmail({
    to: input.landlordEmail,
    subject,
    html,
    text,
    messageTag: "intake_submitted",
  });

  if (result.ok) return;

  // Submit still succeeded; surface skip/fail so ops can fix SES without blocking applicants.
  captureServerError(new Error(result.error), {
    tags: {
      area: "email",
      stage: "intake_submitted",
      ...(result.skipped ? { ses: "skipped" } : {}),
    },
    extra: {
      intakeLinkId: input.intakeLinkId,
      to: input.landlordEmail,
      skipped: Boolean(result.skipped),
    },
  });
}
