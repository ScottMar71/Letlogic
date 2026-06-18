import Link from "next/link";
import { GuideLayout } from "@/components/marketing/guide-layout";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { getGuide, guidePath } from "@/lib/guides";

const guide = getGuide("right-to-rent")!;

export const metadata = marketingPageMetadata({
  title: "Right to Rent checks explained",
  description: guide.description,
  path: guidePath(guide.slug),
});

const FAQS = [
  {
    question: "Who needs a Right to Rent check?",
    answer:
      "In England, landlords (or their agents) must check that all adults aged 18+ who will live in the property as their only or main home have the right to rent, regardless of whether they're named on the tenancy. The scheme applies in England only.",
  },
  {
    question: "Does LetLogic do Right to Rent checks?",
    answer:
      "No. Right to Rent is a separate legal requirement with its own accepted documents and Home Office processes. LetLogic is a screening aid and does not perform or replace Right to Rent checks.",
  },
  {
    question: "When should the check be done?",
    answer:
      "The check must be completed before the start of the tenancy. Doing it too early or skipping follow-up checks where someone has a time-limited right can create compliance gaps.",
  },
];

export default function RightToRentGuide() {
  return (
    <GuideLayout
      slug={guide.slug}
      title={guide.title}
      description={guide.description}
      datePublished={guide.datePublished}
      intro="What Right to Rent involves, who it applies to, and how it differs from screening."
      faqs={FAQS}
    >
      <p>
        Right to Rent is a legal requirement for landlords in England to check
        that prospective adult occupiers have the right to rent property in the
        UK. It is separate from tenant screening, but the two are easy to
        confuse, so it&apos;s worth being clear on the difference.
      </p>

      <h2>Who must be checked</h2>
      <p>
        You must check all occupiers aged 18 and over who will use the property
        as their only or main home — even if they aren&apos;t named on the
        tenancy agreement. The scheme applies in <strong>England only</strong>;
        Scotland, Wales, and Northern Ireland have different rules.
      </p>

      <h2>How the check works</h2>
      <ul>
        <li>
          Obtain original acceptable documents, a share code for an online
          check, or use a certified identity service provider as appropriate.
        </li>
        <li>Check the documents are genuine and belong to the person, in their presence or via a permitted video/online method.</li>
        <li>Make and keep a dated copy for the duration of the tenancy and afterwards as advised.</li>
        <li>Diarise follow-up checks where someone has a time-limited right to rent.</li>
      </ul>
      <p>
        Always confirm the current process and accepted documents via official
        government guidance before you rely on it — rules change, and this guide
        is general information, not legal advice.
      </p>

      <h2>Right to Rent vs tenant screening</h2>
      <p>
        Right to Rent answers a legal question: does this person have the right
        to rent? <Link href="/tenant-screening">Tenant screening</Link> answers
        a commercial one: is this tenancy likely to be affordable and stable?
        You generally need both — and a credit check or formal referencing may
        also be appropriate. See how screening compares to a{" "}
        <Link href="/tenant-screening-vs-credit-check">credit check</Link>.
      </p>
    </GuideLayout>
  );
}
