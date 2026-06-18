import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("Supabase recovery email template", () => {
  it("uses the SSR token_hash recovery flow", () => {
    const template = readFileSync(
      join(process.cwd(), "supabase/templates/recovery.html"),
      "utf8",
    );

    expect(template).toContain("/auth/callback?");
    expect(template).toContain("token_hash={{ .TokenHash }}");
    expect(template).toContain("type=recovery");
    expect(template).toContain("next=/reset-password");
    expect(template).not.toContain(".ConfirmationURL");
  });
});
