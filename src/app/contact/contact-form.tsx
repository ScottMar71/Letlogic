"use client";

import { useState } from "react";
import { submitContact } from "@/app/actions/contact";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-success-border bg-success-bg p-6">
        <h2 className="font-semibold text-text">Thanks — message sent</h2>
        <p className="mt-1 text-sm text-text-muted">
          We&apos;ve received your enquiry and will get back to you by email as
          soon as we can.
        </p>
      </div>
    );
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

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Sending…" : "Send message"}
      </button>

      {error && (
        <p className="rounded-lg border border-danger-border bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
