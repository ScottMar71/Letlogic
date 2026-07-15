import { describe, expect, it } from "vitest";
import {
  buildIntakeSubmittedEmail,
  intakeSubmittedSubject,
} from "@/lib/email/templates/intake-submitted";

describe("intakeSubmittedSubject", () => {
  it("includes the applicant name", () => {
    expect(intakeSubmittedSubject("Jane Doe")).toBe(
      "Applicant form received — Jane Doe",
    );
  });
});

describe("buildIntakeSubmittedEmail", () => {
  const base = {
    landlordEmail: "landlord@example.com",
    landlordName: "Alex",
    applicantName: "Jane Doe",
    propertyLabel: "12 High Street, London",
    reviewUrl: "https://www.letlogic.app/screen?intake=abc",
  };

  it("includes review link in html and text", () => {
    const { html, text } = buildIntakeSubmittedEmail(base);
    expect(html).toContain(base.reviewUrl);
    expect(text).toContain(base.reviewUrl);
    expect(html).toContain("Jane Doe");
    expect(html).toContain("12 High Street, London");
    expect(html).toContain("Hi Alex,");
  });

  it("escapes html in applicant name", () => {
    const { html } = buildIntakeSubmittedEmail({
      ...base,
      applicantName: '<script>alert("x")</script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("omits property line when not set", () => {
    const { html, text } = buildIntakeSubmittedEmail({
      ...base,
      propertyLabel: null,
    });
    expect(html).not.toContain("High Street");
    expect(text).not.toContain(" for 12 High Street");
  });
});
