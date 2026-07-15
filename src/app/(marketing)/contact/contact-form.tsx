"use client";

import { useState } from "react";
import { site } from "@/lib/site";

function buildMailtoUrl(form: HTMLFormElement): string {
  const data = new FormData(form);
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const subject = String(data.get("subject") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  const company = String(data.get("company") ?? "").trim();

  if (company) {
    return "";
  }

  const mailSubject = subject
    ? `[Contact] ${subject}`
    : `[Contact] Enquiry from ${name || "LetLogic visitor"}`;

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    subject ? `Subject: ${subject}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    subject: mailSubject,
    body,
  });

  return `mailto:${site.email}?${params.toString()}`;
}

export function ContactForm() {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const mailto = buildMailtoUrl(e.currentTarget);
    if (!mailto) {
      return;
    }

    window.location.href = mailto;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-border bg-surface p-6"
    >
      {/* Honeypot field — hidden from humans, catches bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="field-label">Name</span>
          <input
            type="text"
            name="name"
            required
            maxLength={120}
            className="input"
            placeholder="Your name"
          />
        </label>
        <label className="block space-y-1">
          <span className="field-label">Email</span>
          <input
            type="email"
            name="email"
            required
            maxLength={254}
            className="input"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="field-label">Subject (optional)</span>
        <input
          type="text"
          name="subject"
          maxLength={200}
          className="input"
          placeholder="What's this about?"
        />
      </label>

      <label className="block space-y-1">
        <span className="field-label">Message</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          className="textarea"
          placeholder="How can we help?"
        />
      </label>

      <button type="submit" className="btn-primary w-full">
        Open email to send
      </button>

      <p className="text-sm text-text-muted">
        Your email app will open with this message addressed to{" "}
        <a
          href={`mailto:${site.email}`}
          className="font-medium text-brand-ink underline hover:text-brand-ink-hover"
        >
          {site.email}
        </a>
        .
      </p>

      {error && (
        <p className="rounded-lg border border-danger-border bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
