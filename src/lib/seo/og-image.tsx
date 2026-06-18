import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/** Shared Open Graph image dimensions and content type for all routes. */
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

type OgImageOptions = {
  /** Main line, e.g. the page's topic. */
  heading: string;
  /** Optional eyebrow label above the brand name. */
  eyebrow?: string;
};

/**
 * Renders a branded 1200x630 OG image with the LetLogic wordmark and a heading.
 * Reused by route-level `opengraph-image` files to keep social cards on-brand.
 */
export function renderOgImage({ heading, eyebrow }: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "72px",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {eyebrow ? (
            <div
              style={{
                fontSize: 22,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                opacity: 0.8,
              }}
            >
              {eyebrow}
            </div>
          ) : null}
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.01em" }}>
            {site.name}
          </div>
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 1000,
          }}
        >
          {heading}
        </div>
        <div style={{ fontSize: 26, opacity: 0.9 }}>
          Explainable tenant screening for UK landlords
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
