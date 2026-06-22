import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Supabase recovery email template", () => {
  it("uses the confirm interstitial before token verification", () => {
    const template = readFileSync(
      join(process.cwd(), "supabase/templates/recovery.html"),
      "utf8",
    );

    expect(template).toContain("{{ .RedirectTo }}&token_hash={{ .TokenHash }}");
    expect(template).toContain("type=recovery");
    expect(template).toContain("{{ .Token }}");
    expect(template).not.toContain(".ConfirmationURL");
    expect(template).not.toContain("/auth/callback?");
  });
});
