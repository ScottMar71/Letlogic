import { describe, expect, it } from "vitest";
import { friendlyAuthError } from "./errors";

describe("friendlyAuthError", () => {
  it("maps rate limit errors", () => {
    expect(friendlyAuthError("email rate limit exceeded")).toMatch(/Too many attempts/);
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
