import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

export const metadata = marketingPageMetadata({
  title: "Cookie Policy",
  description:
    "How LetLogic uses cookies and similar technologies, and the choices available to you.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="How we use cookies and similar technologies on LetLogic."
    >
      <p>
        This Cookie Policy explains how {site.name} uses cookies and similar
        technologies. It should be read alongside our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>What cookies are</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They are widely used to make sites work, or work more
        efficiently, and to provide information to site operators.
      </p>

      <h2>How we use cookies</h2>
      <p>
        We keep our use of cookies to a minimum. We currently use only{" "}
        <strong>strictly necessary cookies</strong> — those required to operate
        the service securely. Under UK PECR rules, strictly necessary cookies do
        not require consent, so we do not show a cookie banner.
      </p>

      <h2>Cookies we use</h2>
      <ul>
        <li>
          <strong>Authentication / session:</strong> set when you sign in, to
          keep you securely logged in and protect your account.
        </li>
        <li>
          <strong>Security:</strong> used to help protect the service against
          fraud and abuse.
        </li>
      </ul>
      <p>
        We do not use advertising cookies, and we do not sell your data. If we
        introduce analytics or other non-essential cookies in future, we will
        update this policy and request your consent first where required.
      </p>

      <h2>Third-party processors</h2>
      <p>
        Some essential functions are provided by trusted processors (such as our
        authentication and hosting providers) that may set cookies necessary for
        those functions. See the sub-processors section of our{" "}
        <Link href="/privacy">Privacy Policy</Link> for the full list.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can control and delete cookies through your browser settings.
        Because the cookies we use are strictly necessary, blocking them may
        stop you from signing in or using parts of the service.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this Cookie Policy from time to time. We will update the
        &ldquo;Last updated&rdquo; date above when we do. Questions? Email{" "}
        <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
      </p>
    </LegalPage>
  );
}
