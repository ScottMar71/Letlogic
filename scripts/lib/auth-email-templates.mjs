import { emailButton, emailOtpCode, wrapAuthEmail } from "./auth-email-layout.mjs";

const CALLBACK = "{{ .SiteURL }}/auth/callback";

function heading(text) {
  return `<h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;font-weight:700;color:#0F1C2E;">${text}</h1>`;
}

function paragraph(text) {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

function muted(text) {
  return `<p style="margin:24px 0 0;font-size:14px;color:#5A6B7D;">${text}</p>`;
}

function securityAlert(actionText) {
  return muted(
    `If you did not ${actionText}, contact us immediately at <a href="mailto:support@letlogic.app" style="color:#00C49F;text-decoration:none;">support@letlogic.app</a>.`,
  );
}

export const authEmailTemplates = [
  {
    key: "confirmation",
    file: "confirmation.html",
    subjectKey: "mailer_subjects_confirmation",
    contentKey: "mailer_templates_confirmation_content",
    subject: "Confirm your LetLogic account",
    build() {
      const body = [
        heading("Confirm your email address"),
        paragraph(
          "Thanks for signing up for LetLogic. Click the button below to confirm your email address and finish creating your account.",
        ),
        emailButton(
          `${CALLBACK}?token_hash={{ .TokenHash }}&type=email&next=/dashboard`,
          "Confirm email address",
        ),
        muted(
          "This link expires in 1 hour and can only be used once. If you did not create a LetLogic account, you can safely ignore this email.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "invite",
    file: "invite.html",
    subjectKey: "mailer_subjects_invite",
    contentKey: "mailer_templates_invite_content",
    subject: "You've been invited to LetLogic",
    build() {
      const body = [
        heading("You've been invited"),
        paragraph(
          "You've been invited to join LetLogic. Click the button below to accept your invitation and set up your account.",
        ),
        emailButton(
          `${CALLBACK}?token_hash={{ .TokenHash }}&type=invite&next=/dashboard`,
          "Accept invitation",
        ),
        muted(
          "This link expires in 1 hour and can only be used once. If you were not expecting this invitation, you can safely ignore this email.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "magic_link",
    file: "magic-link.html",
    subjectKey: "mailer_subjects_magic_link",
    contentKey: "mailer_templates_magic_link_content",
    subject: "Your LetLogic sign-in link",
    build() {
      const body = [
        heading("Sign in to LetLogic"),
        paragraph(
          "Click the button below to sign in. You can also enter the one-time code in the app if you prefer.",
        ),
        emailButton(
          "{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email",
          "Sign in to LetLogic",
        ),
        paragraph("Your one-time sign-in code:"),
        emailOtpCode("{{ .Token }}"),
        muted(
          "This link and code expire in 1 hour and can only be used once. If you did not request this email, you can safely ignore it.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "email_change",
    file: "email-change.html",
    subjectKey: "mailer_subjects_email_change",
    contentKey: "mailer_templates_email_change_content",
    subject: "Confirm your new LetLogic email",
    build() {
      const body = [
        heading("Confirm your new email address"),
        paragraph(
          "We received a request to change the email address on your LetLogic account to <strong>{{ .NewEmail }}</strong>.",
        ),
        emailButton(
          `${CALLBACK}?token_hash={{ .TokenHash }}&type=email_change&next=/dashboard`,
          "Confirm new email address",
        ),
        muted(
          "If you did not request this change, contact us immediately at support@letlogic.app.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "recovery",
    file: "recovery.html",
    subjectKey: "mailer_subjects_recovery",
    contentKey: "mailer_templates_recovery_content",
    subject: "Reset your LetLogic password",
    build() {
      const body = [
        heading("Reset your password"),
        paragraph(
          "We received a request to reset your LetLogic password. Click the button below to choose a new one.",
        ),
        emailButton(
          `${CALLBACK}?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`,
          "Reset password",
        ),
        muted(
          "This link expires in 1 hour and can only be used once. If you did not request a password reset, you can safely ignore this email.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "reauthentication",
    file: "reauthentication.html",
    subjectKey: "mailer_subjects_reauthentication",
    contentKey: "mailer_templates_reauthentication_content",
    subject: "Your LetLogic verification code",
    build() {
      const body = [
        heading("Verify it's you"),
        paragraph(
          "Enter the verification code below to continue with your LetLogic account. This helps keep your account secure.",
        ),
        emailOtpCode("{{ .Token }}"),
        muted(
          "This code expires shortly and can only be used once. If you did not request this, contact us at support@letlogic.app.",
        ),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
];

export const securityNotificationTemplates = [
  {
    key: "password_changed_notification",
    file: "notifications/password-changed.html",
    subjectKey: "mailer_subjects_password_changed_notification",
    contentKey: "mailer_templates_password_changed_notification_content",
    enabledKey: "mailer_notifications_password_changed_enabled",
    subject: "Your LetLogic password was changed",
    build() {
      const body = [
        heading("Your password was changed"),
        paragraph(
          "The password for your LetLogic account was recently changed. If you made this change, no action is needed.",
        ),
        emailButton("{{ .SiteURL }}/forgot-password", "Reset password"),
        securityAlert("change your password"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "email_changed_notification",
    file: "notifications/email-changed.html",
    subjectKey: "mailer_subjects_email_changed_notification",
    contentKey: "mailer_templates_email_changed_notification_content",
    enabledKey: "mailer_notifications_email_changed_enabled",
    subject: "Your LetLogic email address was changed",
    build() {
      const body = [
        heading("Your email address was changed"),
        paragraph(
          "The email address for your LetLogic account was changed from <strong>{{ .OldEmail }}</strong> to <strong>{{ .Email }}</strong>.",
        ),
        securityAlert("request this change"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "phone_changed_notification",
    file: "notifications/phone-changed.html",
    subjectKey: "mailer_subjects_phone_changed_notification",
    contentKey: "mailer_templates_phone_changed_notification_content",
    enabledKey: "mailer_notifications_phone_changed_enabled",
    subject: "Your LetLogic phone number was changed",
    build() {
      const body = [
        heading("Your phone number was changed"),
        paragraph(
          "The phone number for your LetLogic account was changed from <strong>{{ .OldPhone }}</strong> to <strong>{{ .Phone }}</strong>.",
        ),
        securityAlert("request this change"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "mfa_factor_enrolled_notification",
    file: "notifications/mfa-factor-enrolled.html",
    subjectKey: "mailer_subjects_mfa_factor_enrolled_notification",
    contentKey: "mailer_templates_mfa_factor_enrolled_notification_content",
    enabledKey: "mailer_notifications_mfa_factor_enrolled_enabled",
    subject: "A verification method was added to your LetLogic account",
    build() {
      const body = [
        heading("A verification method was added"),
        paragraph(
          "Sign-in verification method <strong>{{ .FactorType }}</strong> was added to your LetLogic account.",
        ),
        securityAlert("add this verification method"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "mfa_factor_unenrolled_notification",
    file: "notifications/mfa-factor-unenrolled.html",
    subjectKey: "mailer_subjects_mfa_factor_unenrolled_notification",
    contentKey: "mailer_templates_mfa_factor_unenrolled_notification_content",
    enabledKey: "mailer_notifications_mfa_factor_unenrolled_enabled",
    subject: "A verification method was removed from your LetLogic account",
    build() {
      const body = [
        heading("A verification method was removed"),
        paragraph(
          "Sign-in verification method <strong>{{ .FactorType }}</strong> was removed from your LetLogic account.",
        ),
        securityAlert("remove this verification method"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "identity_linked_notification",
    file: "notifications/identity-linked.html",
    subjectKey: "mailer_subjects_identity_linked_notification",
    contentKey: "mailer_templates_identity_linked_notification_content",
    enabledKey: "mailer_notifications_identity_linked_enabled",
    subject: "A sign-in method was linked to your LetLogic account",
    build() {
      const body = [
        heading("A sign-in method was linked"),
        paragraph(
          "Your <strong>{{ .Provider }}</strong> account was linked as a sign-in method for <strong>{{ .Email }}</strong>.",
        ),
        securityAlert("link this sign-in method"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
  {
    key: "identity_unlinked_notification",
    file: "notifications/identity-unlinked.html",
    subjectKey: "mailer_subjects_identity_unlinked_notification",
    contentKey: "mailer_templates_identity_unlinked_notification_content",
    enabledKey: "mailer_notifications_identity_unlinked_enabled",
    subject: "A sign-in method was removed from your LetLogic account",
    build() {
      const body = [
        heading("A sign-in method was removed"),
        paragraph(
          "Your <strong>{{ .Provider }}</strong> account was removed as a sign-in method for <strong>{{ .Email }}</strong>.",
        ),
        securityAlert("remove this sign-in method"),
      ].join("\n");
      return wrapAuthEmail({ title: this.subject, bodyHtml: body });
    },
  },
];

export const allEmailTemplates = [
  ...authEmailTemplates,
  ...securityNotificationTemplates,
];
