import { describe, expect, it } from "vitest";
import { friendlyAuthError } from "./errors";

describe("friendlyAuthError", () => {
  it("maps email rate limit errors", () => {
    expect(friendlyAuthError("email rate limit exceeded")).toMatch(
      /email provider limit/,
    );
  });

  it("maps generic rate limit errors", () => {
    expect(friendlyAuthError("request rate limit exceeded")).toMatch(
      /Too many sign-in or sign-up attempts/,
    );
  });

  it("maps email not confirmed", () => {
    expect(friendlyAuthError("Email not confirmed")).toMatch(/Confirm your email/);
  });

  it("maps invalid credentials", () => {
    expect(friendlyAuthError("Invalid login credentials")).toBe(
      "Email or password is incorrect.",
    );
  });

  it("passes through unknown errors", () => {
    expect(friendlyAuthError("Something else")).toBe("Something else");
  });
});
