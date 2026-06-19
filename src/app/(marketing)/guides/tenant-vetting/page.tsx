import Link from "next/link";
import { GuideLayout } from "@/components/marketing/guide-layout";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { getGuide, guidePath } from "@/lib/guides";

const guide = getGuide("tenant-vetting")!;

export const metadata = marketingPageMetadata({
  title: "Tenant vetting in the UK",
  description: guide.description,
  path: guidePath(guide.slug),
});

const FAQS = [
  {
    question: "What is the difference between tenant vetting and tenant screening?",
    answer:
      "Tenant vetting is the full pre-tenancy process — identity checks, Right to Rent, affordability, credit checks, references, and employment verification. Tenant screening is one part of that process: a structured assessment of whether an applicant is likely to afford and sustain the tenancy. LetLogic provides AI-powered screening as a fast first pass; it does not replace the other vetting steps.",
  },
  {
    question: "Can landlords charge tenants for referencing?",
    answer:
      "No. Under the Tenant Fees Act 2019, landlords cannot charge tenants separately for referencing, credit checks, or administrative processing. These are prohibited payments.",
  },
  {
    question: "Does LetLogic replace formal tenant referencing?",
    answer:
      "No. LetLogic complements referencing by giving you an instant, explainable read on affordability and stability from the information you provide. Formal referencing independently verifies employment, income, and landlord references with third parties. See our comparison of LetLogic vs tenant referencing for more detail.",
  },
  {
    question: "Why is tenant vetting more important since Section 21 was abolished?",
    answer:
      "Since 1 May 2026, landlords can no longer use no-fault Section 21 evictions. Removing a non-paying or disruptive tenant now depends on establishing grounds under Section 8, which can take several months. Thorough vetting at the outset is one of the most cost-effective forms of risk management available.",
  },
];

export default function TenantVettingGuide() {
  return (
    <GuideLayout
      slug={guide.slug}
      title={guide.title}
      description={guide.description}
      datePublished={guide.datePublished}
      intro="What tenant vetting involves, the legal framework you must follow, and where screening tools fit in."
      faqs={FAQS}
    >
      <p>
        Tenant vetting, also called tenant referencing, is the process a landlord
        undertakes before granting a tenancy to assess whether a prospective
        tenant is suitable, financially capable, and legally entitled to rent in
        the UK. It typically combines identity and immigration checks,
        affordability assessments, reference checks, and a mandatory Right to
        Rent check. Where a tenant cannot meet affordability requirements
        independently, a guarantor may be used as additional security.
      </p>
      <p>
        Effective tenant vetting helps protect landlords from rent arrears and
        anti-social behaviour by selecting tenants who are likely to sustain the
        tenancy over the long term. Since the abolition of Section 21 on 1 May
        2026, this has become increasingly important, as removing a non-paying
        or disruptive tenant now depends entirely on establishing grounds under
        Section 8, a process that can take several months. Thorough vetting at
        the outset is therefore one of the most cost-effective forms of risk
        management available to landlords.
      </p>

      <h2>What tenant vetting covers</h2>
      <p>
        A comprehensive vetting process typically includes the following. Each
        step serves a different purpose — and together they give you a rounded
        picture before you commit to a tenancy.
      </p>

      <h3>Identity verification</h3>
      <p>
        Confirming that the applicant is who they claim to be by reviewing
        official documents such as a passport, driving licence, or other accepted
        forms of identification. This is a prerequisite for both Right to Rent
        compliance and any formal referencing.
      </p>

      <h3>Right to Rent check</h3>
      <p>
        A legal requirement in England under the Immigration Act 2014. Landlords
        must verify that every adult occupant has the legal right to rent
        residential property in the UK, either by checking original documents or
        by using the Home Office online service with a share code. Failure to
        carry out a valid check can result in a civil penalty.
      </p>
      <p>
        Right to Rent is separate from screening. See our{" "}
        <Link href="/guides/right-to-rent">Right to Rent guide</Link> for a
        plain-English walkthrough of who must be checked and how.
      </p>

      <h3>Affordability assessment</h3>
      <p>
        Assessing whether the tenant&apos;s income is sufficient to sustain the
        rental payments. Most landlords and referencing agencies use a
        rent-to-income ratio, typically requiring a gross annual income equal to
        30 times the monthly rent (equivalent to 2.5 times the annual rent).
        Where income falls below this threshold, a guarantor who meets the same
        affordability criteria is commonly requested.
      </p>
      <p>
        This is where <Link href="/tenant-screening">tenant screening</Link> adds
        the most value early in the process. LetLogic calculates the income
        multiple from the application you provide, weighs stability alongside
        affordability, and explains the result in plain English — including
        suggested follow-up questions and data gaps. See our{" "}
        <Link href="/guides/tenant-affordability">
          tenant affordability guide
        </Link>{" "}
        and a worked example on the{" "}
        <Link href="/sample">sample report</Link>.
      </p>

      <h3>Credit check</h3>
      <p>
        Reviewing a tenant&apos;s credit history to identify County Court
        Judgments (CCJs), bankruptcy, or patterns of missed payments that may
        indicate financial difficulties. This requires a regulated credit
        reference agency search — it cannot be inferred from an application
        alone.
      </p>
      <p>
        LetLogic is not a credit check. It may flag self-declared adverse credit
        or debts from the information you paste or enter, but it does not search
        credit files. See how screening compares to a{" "}
        <Link href="/tenant-screening-vs-credit-check">credit check</Link>.
      </p>

      <h3>Previous landlord or agent references</h3>
      <p>
        Seeking confirmation from previous landlords or letting agents that the
        tenant paid rent on time, looked after the property, and complied with
        the terms of their tenancy. Formal referencing agencies contact previous
        landlords directly; screening tools can only assess what the applicant
        has declared.
      </p>
      <p>
        When you screen with LetLogic, previous landlord reference details
        captured in the application are weighed alongside other signals — but
        unverified references are flagged as data gaps, with suggested questions
        to ask before you proceed.
      </p>

      <h3>Employment or income verification</h3>
      <p>
        Verifying employment status, salary, and income stability. This may also
        include assessing benefit income, self-employment accounts, or pension
        income where applicable. Formal referencing verifies income with
        employers or accountants; screening assesses consistency and stability
        from the documents and notes you provide.
      </p>
      <p>
        LetLogic captures employment type, time in role, and income sources in
        its structured form, or extracts them from pasted text or uploaded PDFs.
        It produces a stability score alongside affordability — useful for
        spotting gaps before you commission full referencing. Compare the depth
        of screening and referencing in our{" "}
        <Link href="/letlogic-vs-tenant-referencing">
          LetLogic vs tenant referencing
        </Link>{" "}
        guide.
      </p>

      <h2>Legal constraints landlords must follow</h2>
      <p>
        Tenant vetting must be conducted within a clear legal framework. Several
        key regulations apply.
      </p>

      <h3>Referencing fees are prohibited</h3>
      <p>
        Under the Tenant Fees Act 2019, landlords cannot charge tenants
        separately for referencing, credit checks, or administrative processing.
        These are prohibited payments, and charging them may result in
        enforcement action and could undermine possession proceedings if
        unlawful payments have been accepted.
      </p>

      <h3>Discrimination based on benefits or children is illegal</h3>
      <p>
        Since 1 May 2026, the Renters&apos; Rights Act has made it unlawful to
        refuse a tenancy, discourage an application, or treat a prospective
        tenant less favourably because they receive housing benefit or other
        state benefits, or because they have children.
      </p>
      <p>
        Landlords may still apply a consistent affordability assessment, provided
        it is applied equally to all applicants, considers all forms of income
        (including benefits), and is not adjusted based on a tenant&apos;s
        benefit status or family circumstances.
      </p>

      <h3>Equality Act obligations</h3>
      <p>
        The Equality Act 2010 continues to apply throughout the vetting process,
        prohibiting discrimination based on protected characteristics such as
        race, sex, disability, religion, age, sexual orientation, gender
        reassignment, pregnancy and maternity, and marriage or civil partnership.
      </p>
      <p>
        LetLogic is designed as a decision-support tool, not an automated
        decision-maker. It explicitly excludes protected characteristics from
        its analysis — the landlord remains responsible for fair, consistent
        vetting decisions.
      </p>

      <h3>Data protection requirements</h3>
      <p>
        Tenant vetting involves processing sensitive personal information.
        Landlords act as data controllers under UK GDPR and must have a lawful
        basis for processing personal data, retain information only for as long
        as necessary, and ensure it is stored and handled securely.
      </p>
      <p>
        When you use LetLogic, applicant data is processed to generate a
        screening report for your review. Our{" "}
        <Link href="/privacy">privacy policy</Link> explains how data is handled;
        you remain the data controller for the vetting decision itself.
      </p>

      <h3>Consistency and record keeping</h3>
      <p>
        Tenant vetting decisions should be applied consistently across all
        applicants. Applying different standards, whether through varying income
        thresholds, reference requirements, or document requests, may expose
        landlords to discrimination complaints.
      </p>
      <p>
        Maintaining clear written records of the vetting criteria used and the
        reasons behind decisions provides an important audit trail and may help
        defend against complaints raised through future Private Rented Sector
        Ombudsman or redress schemes.
      </p>
      <p>
        LetLogic&apos;s explainable output — summary, pros, cons, conditions, and
        suggested follow-up questions — supports this audit trail. Pro users can
        also export screening reports as PDFs for their records.
      </p>

      <h2>Where LetLogic fits in your vetting process</h2>
      <p>
        A practical vetting workflow often looks like this:
      </p>
      <ol>
        <li>
          <strong>Initial triage</strong> — screen the application with LetLogic
          to assess affordability, stability, and completeness in seconds.
        </li>
        <li>
          <strong>Follow-up</strong> — use suggested questions and flagged data
          gaps to request missing documents or clarify inconsistencies.
        </li>
        <li>
          <strong>Formal checks</strong> — commission credit checks, formal
          referencing, and Right to Rent checks on applicants worth progressing.
        </li>
        <li>
          <strong>Decision</strong> — compare shortlisted applicants (LetLogic
          Pro includes side-by-side comparison and a best-fit recommendation),
          then make your final decision with a clear record.
        </li>
      </ol>
      <p>
        LetLogic is an AI screening aid — not a credit check, referencing
        report, Right to Rent check, or legal advice. Used within a documented,
        standardised vetting process, it helps landlords make fair, transparent,
        and legally compliant decisions while reducing long-term tenancy risks.
      </p>
      <p>
        For a broader overview of how screening fits alongside other checks, see
        our <Link href="/tenant-screening">tenant screening guide</Link> and{" "}
        <Link href="/how-it-works">how LetLogic works</Link>.
      </p>
    </GuideLayout>
  );
}
