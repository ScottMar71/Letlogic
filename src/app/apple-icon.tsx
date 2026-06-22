import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — matches public/brand/icon.svg at 180×180. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0F1C2E",
          borderRadius: 34,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 18,
            width: 27,
            height: 113,
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 131,
            top: 18,
            width: 27,
            height: 113,
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 18,
            width: 136,
            height: 27,
            background: "white",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 54,
            top: 50,
            width: 0,
            height: 0,
            borderTop: "38px solid transparent",
            borderBottom: "38px solid transparent",
            borderLeft: "72px solid #00C49F",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
