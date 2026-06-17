import { site } from "@/lib/site";

export function TrustBar({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600 border border-zinc-200 rounded-lg px-4 py-3 bg-zinc-50">
      <span>Last updated: {lastUpdated}</span>
      <span>·</span>
      <span>England &amp; Wales</span>
      <span>·</span>
      <span className="font-medium text-zinc-800">Not legal advice</span>
    </div>
  );
}

export function LegalDisclaimer() {
  return (
    <p className="text-xs text-zinc-500 leading-relaxed">
      {site.name} generates document drafts to assist UK landlords. This is not
      legal advice. You are responsible for verifying accuracy and compliance
      before serving any notice. Seek a solicitor for complex cases.
    </p>
  );
}
