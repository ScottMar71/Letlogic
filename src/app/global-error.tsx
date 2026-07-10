"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
          textAlign: "center",
          margin: 0,
        }}
      >
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
          Something went wrong
        </h1>
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          We&apos;ve been notified and are looking into it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            display: "inline-block",
            marginTop: "0.75rem",
            marginLeft: "0.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            background: "#fff",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Home
        </a>
      </body>
    </html>
  );
}
