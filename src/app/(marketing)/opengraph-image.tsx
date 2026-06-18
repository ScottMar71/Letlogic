import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — UK tenant screening`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {site.name}
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.4, opacity: 0.92, maxWidth: 900 }}>
          Explainable tenant screening for UK landlords
        </div>
      </div>
    ),
    { ...size },
  );
}
