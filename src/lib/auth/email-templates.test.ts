import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const TEMPLATE_DIR = join(process.cwd(), "supabase/templates");

function listHtmlTemplates(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlTemplates(path);
    if (entry.name.endsWith(".html")) return [path];
    return [];
  });
}

const SSR_CALLBACK_TEMPLATES = [
  "confirmation.html",
  "invite.html",
  "email-change.html",
];

describe("Supabase auth email templates", () => {
  it("includes all required auth and notification template files", () => {
    const files = listHtmlTemplates(TEMPLATE_DIR).map((path) =>
      path.slice(TEMPLATE_DIR.length + 1),
    );
    expect(files).toEqual(
      expect.arrayContaining([
        "confirmation.html",
        "invite.html",
        "magic-link.html",
        "email-change.html",
        "recovery.html",
        "reauthentication.html",
        "notifications/password-changed.html",
        "notifications/email-changed.html",
        "notifications/phone-changed.html",
        "notifications/mfa-factor-enrolled.html",
        "notifications/mfa-factor-unenrolled.html",
        "notifications/identity-linked.html",
        "notifications/identity-unlinked.html",
      ]),
    );
  });

  it.each(SSR_CALLBACK_TEMPLATES)("uses token_hash SSR flow in %s", (file) => {
    const template = readFileSync(join(TEMPLATE_DIR, file), "utf8");
    expect(template).toContain("/auth/callback?");
    expect(template).toContain("token_hash={{ .TokenHash }}");
    expect(template).not.toContain("{{ .ConfirmationURL }}");
  });

  it("uses RedirectTo token_hash flow in magic-link.html", () => {
    const template = readFileSync(join(TEMPLATE_DIR, "magic-link.html"), "utf8");
    expect(template).toContain("{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email");
    expect(template).not.toContain("{{ .ConfirmationURL }}");
  });

  it("uses branded header and signature in every template", () => {
    for (const path of listHtmlTemplates(TEMPLATE_DIR)) {
      const template = readFileSync(path, "utf8");
      expect(template).toContain('alt="LetLogic"');
      expect(template).toContain("/brand/logo-stacked.svg");
      expect(template).toContain("The LetLogic team");
      expect(template).toContain("hello@letlogic.app");
    }
  });

  it("includes OTP code in magic link, recovery, and reauthentication templates", () => {
    const magicLink = readFileSync(join(TEMPLATE_DIR, "magic-link.html"), "utf8");
    const recovery = readFileSync(join(TEMPLATE_DIR, "recovery.html"), "utf8");
    const reauth = readFileSync(join(TEMPLATE_DIR, "reauthentication.html"), "utf8");
    expect(magicLink).toContain("{{ .Token }}");
    expect(recovery).toContain("{{ .Token }}");
    expect(reauth).toContain("{{ .Token }}");
  });

  it("recovery template uses confirm interstitial and RedirectTo", () => {
    const template = readFileSync(join(TEMPLATE_DIR, "recovery.html"), "utf8");
    expect(template).toContain("{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery");
    expect(template).toContain("type=recovery");
    expect(template).not.toContain("{{ .ConfirmationURL }}");
  });

  it("security notifications include expected template variables", () => {
    const emailChanged = readFileSync(
      join(TEMPLATE_DIR, "notifications/email-changed.html"),
      "utf8",
    );
    const identityLinked = readFileSync(
      join(TEMPLATE_DIR, "notifications/identity-linked.html"),
      "utf8",
    );
    const mfaEnrolled = readFileSync(
      join(TEMPLATE_DIR, "notifications/mfa-factor-enrolled.html"),
      "utf8",
    );

    expect(emailChanged).toContain("{{ .OldEmail }}");
    expect(emailChanged).toContain("{{ .Email }}");
    expect(identityLinked).toContain("{{ .Provider }}");
    expect(mfaEnrolled).toContain("{{ .FactorType }}");
  });
});
