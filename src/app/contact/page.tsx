import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { site } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the LetLogic team — questions, support, and partnership enquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <MarketingHeader />

      <main id="main-content" className="mx-auto w-full max-w-[var(--container-content)] flex-1 px-4 py-16">
        <div className="space-y-2">
          <p className="section-label">Contact</p>
          <h1 className="text-4xl font-bold tracking-tight text-text">
            Get in touch
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Questions about screening, your account, billing, or a partnership?
            Send us a message and we&apos;ll come back to you by email.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm />

          <aside className="space-y-6">
            <div className="card">
              <h2 className="font-semibold text-text">Email us directly</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <span className="text-text-subtle">General</span>
                  <br />
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-brand-600 underline hover:text-brand-500"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <span className="text-text-subtle">Support</span>
                  <br />
                  <a
                    href={`mailto:${site.supportEmail}`}
                    className="font-medium text-brand-600 underline hover:text-brand-500"
                  >
                    {site.supportEmail}
                  </a>
                </li>
                <li>
                  <span className="text-text-subtle">Privacy &amp; data</span>
                  <br />
                  <a
                    href={`mailto:${site.privacyEmail}`}
                    className="font-medium text-brand-600 underline hover:text-brand-500"
                  >
                    {site.privacyEmail}
                  </a>
                </li>
              </ul>
            </div>

            <div className="card">
              <h2 className="font-semibold text-text">Response times</h2>
              <p className="mt-2 text-sm text-text-muted">
                We aim to reply within two working days. LetLogic supports UK
                landlords only.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
