import Link from "next/link";
import { LegalPage } from "@/components/layout/legal-page";
import { site } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How LetLogic collects, uses, and protects personal data under UK GDPR and the Data Protection Act 2018.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How we collect, use, and protect personal data when you use LetLogic."
    >
      <p>
        This Privacy Policy explains how {site.company.legalName} (&ldquo;
        {site.name}&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal
        data in connection with the {site.name} tenant-screening service. We
        process personal data in accordance with the UK GDPR and the Data
        Protection Act 2018.
      </p>

      <h2>Who we are</h2>
      <p>
        {site.company.legalName} is a company registered in{" "}
        {site.company.registeredIn} (company number{" "}
        {site.company.companyNumber}), with its registered office at{" "}
        {site.company.address}. For privacy matters, contact us at{" "}
        <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
      </p>

      <h2>Controller and processor roles</h2>
      <p>
        We are the <strong>controller</strong> for account, billing, and usage
        data described below. When you, as a landlord or agent, submit a
        prospective tenant&apos;s details to be screened, you are the{" "}
        <strong>controller</strong> of that applicant data and {site.name} acts
        as a <strong>processor</strong> on your behalf. You are responsible for
        having a lawful basis and for providing applicants with appropriate
        privacy information.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> email address and authentication
          details (we use magic-link sign-in, so we do not store passwords).
        </li>
        <li>
          <strong>Billing data:</strong> purchase and subscription records.
          Card details are handled directly by Stripe — we never see or store
          full card numbers.
        </li>
        <li>
          <strong>Screening inputs:</strong> the applicant details you paste in
          to be screened (for example income, employment, and affordability
          information).
        </li>
        <li>
          <strong>Screening outputs:</strong> the risk score, summary, and
          recommendations we generate.
        </li>
        <li>
          <strong>Technical data:</strong> limited logs needed to operate and
          secure the service.
        </li>
      </ul>

      <h2>How we use data and our lawful bases</h2>
      <ul>
        <li>
          <strong>To provide the service</strong> (generating screenings,
          managing your account) — performance of a contract.
        </li>
        <li>
          <strong>To take payment</strong> — performance of a contract and
          compliance with legal obligations.
        </li>
        <li>
          <strong>To secure and improve the service</strong> — our legitimate
          interests, balanced against your rights.
        </li>
        <li>
          <strong>To respond to enquiries</strong> you send us — our legitimate
          interests in supporting users.
        </li>
      </ul>
      <p>
        {site.name} is a decision-support tool. It does not carry out solely
        automated decision-making with legal or similarly significant effects —
        you remain the decision-maker for any tenancy.
      </p>

      <h2>Sub-processors</h2>
      <p>
        We use a small number of trusted providers to run the service. Each is
        bound by appropriate data-processing terms:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — authentication and database hosting.
        </li>
        <li>
          <strong>OpenAI</strong> — generating screening assessments. Inputs are
          not used to train its models under our API terms.
        </li>
        <li>
          <strong>Stripe</strong> — payment processing.
        </li>
        <li>
          <strong>Resend</strong> — transactional and enquiry email delivery.
        </li>
        <li>
          <strong>Vercel</strong> — application hosting.
        </li>
      </ul>

      <h2>International transfers</h2>
      <p>
        Some providers may process data outside the UK. Where they do, we rely
        on appropriate safeguards such as the UK International Data Transfer
        Agreement or adequacy regulations.
      </p>

      <h2>Retention</h2>
      <p>
        We keep account and billing records for as long as your account is
        active and as required to meet legal obligations. Screening inputs and
        outputs are retained to provide the service and may be deleted on
        request, subject to any legal retention requirements.
      </p>

      <h2>Your rights</h2>
      <p>
        Subject to conditions, you have the right to access, rectify, erase,
        restrict, or object to the processing of your personal data, and the
        right to data portability. To exercise these rights, email{" "}
        <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>. You also
        have the right to complain to the Information Commissioner&apos;s Office
        (ICO) at{" "}
        <a href="https://ico.org.uk" target="_blank" rel="noreferrer">
          ico.org.uk
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        We use only the cookies that are strictly necessary to run the service.
        See our <Link href="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will update the
        &ldquo;Last updated&rdquo; date above when we do.
      </p>
    </LegalPage>
  );
}
