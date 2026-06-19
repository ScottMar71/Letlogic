import { describe, expect, it } from "vitest";
import { canDeleteAdminUser } from "./permissions";

describe("canDeleteAdminUser", () => {
  it("blocks deleting your own account", () => {
    const result = canDeleteAdminUser({
      actorId: "user-1",
      targetId: "user-1",
      targetEmail: "landlord@example.com",
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/own account/i);
  });

  it("blocks deleting admin accounts", () => {
    const previous = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = "admin@letlogic.app";

    const result = canDeleteAdminUser({
      actorId: "actor-1",
      targetId: "admin-1",
      targetEmail: "admin@letlogic.app",
    });

    process.env.ADMIN_EMAILS = previous;

    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/admin accounts/i);
  });

  it("allows deleting a regular user", () => {
    const previous = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = "admin@letlogic.app";

    const result = canDeleteAdminUser({
      actorId: "actor-1",
      targetId: "user-1",
      targetEmail: "landlord@example.com",
    });

    process.env.ADMIN_EMAILS = previous;

    expect(result).toEqual({ allowed: true });
  });
});
