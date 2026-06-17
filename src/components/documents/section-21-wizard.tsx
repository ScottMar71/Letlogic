"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSection21Checkout,
  generateSection21Preview,
} from "@/app/actions/documents";
import { PreviewPanel } from "@/components/documents/preview-panel";
import { section21Config } from "@/lib/documents/section-21/config";
import {
  section21Defaults,
  section21Schema,
  type Section21FormData,
} from "@/lib/documents/section-21/schema";
import type { GeneratedDocument } from "@/lib/documents/types";

const STEPS = ["Property", "Tenancy", "Notice", "Preview"] as const;

type Section21WizardProps = {
  isAuthenticated: boolean;
};

export function Section21Wizard({ isAuthenticated }: Section21WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Section21FormData>(section21Defaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedDocument | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const priceLabel = `£${(section21Config.pricePence / 100).toFixed(2)}`;

  function updateField<K extends keyof Section21FormData>(
    key: K,
    value: Section21FormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function updateTenant(index: number, value: string) {
    const names = [...form.tenantNames];
    names[index] = value;
    updateField("tenantNames", names);
  }

  function addTenant() {
    if (form.tenantNames.length < 6) {
      updateField("tenantNames", [...form.tenantNames, ""]);
    }
  }

  function validateStep(): boolean {
    const fieldsByStep: (keyof Section21FormData)[][] = [
      [
        "propertyAddressLine1",
        "city",
        "postcode",
        "landlordName",
        "landlordAddress",
      ],
      ["tenancyStartDate", "tenantNames", "rentAmount"],
      ["possessionDate"],
      [],
    ];

    const subset: Partial<Section21FormData> = {};
    for (const key of fieldsByStep[step]) {
      (subset as Record<string, unknown>)[key] = form[key];
    }

    const result = section21Schema.safeParse({ ...form, ...subset });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }

  async function handleNext() {
    if (!validateStep()) return;
    if (step < STEPS.length - 2) {
      setStep(step + 1);
      return;
    }
    if (step === STEPS.length - 2) {
      await runPreview();
      setStep(step + 1);
    }
  }

  async function runPreview() {
    setPreviewLoading(true);
    setPreviewError(null);
    const result = await generateSection21Preview(form);
    setPreviewLoading(false);
    if (!result.ok) {
      setPreviewError(result.error);
      setPreviewHtml(null);
      setGenerated(null);
      return;
    }
    setPreviewHtml(result.html);
    setGenerated(result.document);
  }

  async function handleCheckout() {
    if (!generated) return;

    if (!isAuthenticated) {
      router.push(
        `/login?next=${encodeURIComponent("/documents/section-21?step=preview")}`,
      );
      return;
    }

    setCheckoutLoading(true);
    const result = await createSection21Checkout(form, generated);
    setCheckoutLoading(false);

    if (!result.ok) {
      setPreviewError(result.error);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="space-y-6">
        <div className="flex gap-2">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`text-xs font-medium px-2 py-1 rounded ${
                i === step
                  ? "bg-zinc-900 text-white"
                  : i < step
                    ? "bg-zinc-200 text-zinc-700"
                    : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {step === 0 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-zinc-900 mb-2">
              Property &amp; landlord
            </legend>
            <Field label="Landlord full name" error={errors.landlordName}>
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.landlordName}
                onChange={(e) => updateField("landlordName", e.target.value)}
              />
            </Field>
            <Field label="Landlord address" error={errors.landlordAddress}>
              <textarea
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white min-h-[80px] focus:outline-2 focus:outline-zinc-900"
                value={form.landlordAddress}
                onChange={(e) => updateField("landlordAddress", e.target.value)}
              />
            </Field>
            <Field label="Property address line 1" error={errors.propertyAddressLine1}>
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.propertyAddressLine1}
                onChange={(e) =>
                  updateField("propertyAddressLine1", e.target.value)
                }
              />
            </Field>
            <Field label="Address line 2 (optional)">
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.propertyAddressLine2}
                onChange={(e) =>
                  updateField("propertyAddressLine2", e.target.value)
                }
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" error={errors.city}>
                <input
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                />
              </Field>
              <Field label="Postcode" error={errors.postcode}>
                <input
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white uppercase focus:outline-2 focus:outline-zinc-900"
                  value={form.postcode}
                  onChange={(e) => updateField("postcode", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-zinc-900 mb-2">
              Tenancy details
            </legend>
            <Field label="Tenancy start date" error={errors.tenancyStartDate}>
              <input
                type="date"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.tenancyStartDate}
                onChange={(e) => updateField("tenancyStartDate", e.target.value)}
              />
            </Field>
            <Field label="Monthly rent (£)" error={errors.rentAmount}>
              <input
                type="number"
                min="0"
                step="0.01"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.rentAmount || ""}
                onChange={(e) =>
                  updateField("rentAmount", Number(e.target.value))
                }
              />
            </Field>
            <Field label="Deposit protection scheme (optional)">
              <input
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.depositScheme}
                onChange={(e) => updateField("depositScheme", e.target.value)}
              />
            </Field>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-800">Tenant name(s)</p>
              {form.tenantNames.map((name, i) => (
                <input
                  key={i}
                  className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                  placeholder={`Tenant ${i + 1}`}
                  value={name}
                  onChange={(e) => updateTenant(i, e.target.value)}
                />
              ))}
              {errors.tenantNames && (
                <p className="text-sm text-red-600">{errors.tenantNames}</p>
              )}
              {form.tenantNames.length < 6 && (
                <button
                  type="button"
                  onClick={addTenant}
                  className="text-sm text-zinc-600 underline"
                >
                  Add another tenant
                </button>
              )}
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-zinc-900 mb-2">
              Notice details
            </legend>
            <Field
              label="Date tenant should give up possession"
              error={errors.possessionDate}
            >
              <input
                type="date"
                className="w-full border border-zinc-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-2 focus:outline-zinc-900"
                value={form.possessionDate}
                onChange={(e) => updateField("possessionDate", e.target.value)}
              />
            </Field>
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Minimum notice periods and restrictions apply. Verify the leave
              date complies with current legislation before serving.
            </p>
          </fieldset>
        )}

        {step < 3 && (
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              {step === 2 ? "Generate preview" : "Continue"}
            </button>
          </div>
        )}

        {step === 3 && (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="text-sm text-zinc-600 underline"
          >
            Edit details
          </button>
        )}
      </div>

      <div>
        {step === 3 ? (
          <PreviewPanel
            html={previewHtml}
            document={generated}
            loading={previewLoading}
            error={previewError}
            priceLabel={priceLabel}
            onCheckout={handleCheckout}
            checkoutLoading={checkoutLoading}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500 text-sm lg:sticky lg:top-8">
            Your watermarked preview will appear here after step 3.
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-zinc-800">{label}</span>
      {children}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </label>
  );
}
