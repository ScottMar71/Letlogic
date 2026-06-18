import Link from "next/link";
import { GuideLayout } from "@/components/marketing/guide-layout";
import { marketingPageMetadata } from "@/lib/seo/metadata";
import { getGuide, guidePath } from "@/lib/guides";

const guide = getGuide("reading-a-tenant-application")!;

export const metadata = marketingPageMetadata({
  title: "How to read a tenant application",
  description: guide.description,
  path: guidePath(guide.slug),
});

const FAQS = [
  {
    question: "What are the most important things in a tenant application?",
    answer:
      "Income relative to the rent, how stable that income is, rental history and references, and whether the application is complete. Together these tell you whether the tenancy is likely to be sustainable.",
  },
  {
    question: "What are common red flags?",
    answer:
      "Income that barely covers the rent, very short time in a role with no explanation, unexplained gaps in employment or address history, reluctance to provide references, and missing key details. None is necessarily disqualifying — each is a prompt to ask a question.",
  },
  {
    question: "How do I stay fair when reviewing applications?",
    answer:
      "Focus on affordability, stability, and references rather than protected characteristics, apply the same standard to every applicant, and keep your reasoning explainable. Avoid automated decisions about people.",
  },
];

export default function ReadingApplicationGuide() {
  return (
    <GuideLayout
      slug={guide.slug}
      title={guide.title}
      description={guide.description}
      datePublished={guide.datePublished}
      intro="A practical walkthrough of the signals that matter and the questions worth asking."
      faqs={FAQS}
    >
      <p>
        A tenant application can arrive as a tidy form or a long, rambling email.
        Either way, the goal is the same: separate the signal from the noise and
        decide whether the tenancy is likely to work. Here&apos;s a simple way to
        read one.
      </p>

      <h2>1. Start with affordability</h2>
      <p>
        Compare income to the rent first. If the numbers don&apos;t work, little
        else matters. Our{" "}
        <Link href="/guides/tenant-affordability">affordability guide</Link>{" "}
        covers income multiples and what counts as income.
      </p>

      <h2>2. Check stability</h2>
      <p>
        Look at employment type, time in role, and whether the income picture is
        consistent. Stable, predictable income is usually more reassuring than a
        high but uncertain figure.
      </p>

      <h2>3. Read the history and references</h2>
      <p>
        Rental history and previous landlord references add context the numbers
        can&apos;t. Note anything you&apos;d want to verify — and remember Right
        to Rent is a separate legal step (see our{" "}
        <Link href="/guides/right-to-rent">Right to Rent guide</Link>).
      </p>

      <h2>4. Notice what&apos;s missing</h2>
      <p>
        Gaps are not automatically red flags, but they are prompts. If the
        deposit source, an employer reference, or recent payslips are missing,
        that&apos;s your next question rather than your conclusion.
      </p>

      <h2>5. Keep it fair and explainable</h2>
      <p>
        Apply the same standard to everyone, focus on affordability and
        stability rather than protected characteristics, and keep your reasoning
        clear. This is exactly what{" "}
        <Link href="/tenant-screening">LetLogic</Link> is built to support — it
        turns the application into an explainable risk read and suggests the
        follow-up questions to ask. See an{" "}
        <Link href="/sample">example report</Link>.
      </p>
    </GuideLayout>
  );
}
