import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { ContactForm } from "./contact-form";

export const metadata = marketingPageMetadata({
  title: "Contact the LetLogic team",
  description:
    "Get in touch with LetLogic for questions about tenant screening, your account, billing, or letting-agent partnerships. We reply within two working days.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />

      <main id="main-content" className="mx-auto w-full max-w-[var(--container-content)] flex-1 px-4 py-16">
        <div className="space-y-2">
          <p className="section-label">Contact</p>
          <h1 className="text-4xl font-bold tracking-tight text-text">
            Get in touch
          </h1>
          <p className="max-w-2xl text-lg text-text-muted">
            Questions about screening, your account, billing, or a partnership?
            Use the form to open your email app, or write to us directly below.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm />

          <aside className="space-y-6">
            <div className="card">
              <h2 className="font-semibold text-text">Email us directly</h2>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-brand-600 underline hover:text-brand-500"
                  >
                    {site.email}
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

    </>
  );
}
