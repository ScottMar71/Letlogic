"use server";

import { z } from "zod";
import { getContactInboxEmail } from "@/lib/contact/inbox";
import { site } from "@/lib/site";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  subject: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters)")
    .max(5000),
  // Honeypot — must stay empty for real humans.
  company: z.string().max(0).optional().default(""),
});

export type ContactResult = { success: true } | { error: string };

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    subject: formData.get("subject") ?? "",
    message: formData.get("message") ?? "",
    company: formData.get("company") ?? "",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    // A filled honeypot trips the company max(0) rule — treat as success silently.
    if (first?.path[0] === "company") return { success: true };
    return { error: first?.message ?? "Please check the form and try again." };
  }

  const { name, email, subject, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY not set — enquiry not emailed");
    return {
      error:
        "Contact form is temporarily unavailable. Please email us directly.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.name} Contact <noreply@${site.domain}>`,
        to: [getContactInboxEmail()],
        reply_to: email,
        subject: subject
          ? `[Contact] ${subject}`
          : `[Contact] New enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "(none)"}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend send failed:", res.status, detail);
      return {
        error:
          "Sorry, we couldn't send your message right now. Please email us directly.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[contact] Resend request error:", err);
    return {
      error:
        "Sorry, we couldn't send your message right now. Please email us directly.",
    };
  }
}
