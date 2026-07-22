type RequestHeaders = {
  get(name: string): string | null;
};

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, "");
}

function isLocalHost(host: string): boolean {
  return (
    host.includes("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".local")
  );
}

/**
 * Canonical origin for auth email redirects (password reset, etc.).
 * Production always uses NEXT_PUBLIC_SITE_URL so emails never point at preview URLs.
 * Local dev uses the request host (localhost).
 */
export function getAuthRedirectOrigin(headersList: RequestHeaders): string {
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "";

  if (host && isLocalHost(host)) {
    const proto = headersList.get("x-forwarded-proto") ?? "http";
    return normalizeOrigin(`${proto}://${host}`);
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    return normalizeOrigin(fromEnv);
  }

  if (host) {
    const proto =
      headersList.get("x-forwarded-proto") ??
      (isLocalHost(host) ? "http" : "https");
    return normalizeOrigin(`${proto}://${host}`);
  }

  return "http://localhost:3000";
}

/** Build the Supabase email redirect URL for auth callbacks. */
export function buildAuthCallbackUrl(origin: string, next: string): string {
  return `${normalizeOrigin(origin)}/auth/callback?next=${encodeURIComponent(next)}`;
}

/**
 * Interstitial URL for email OTP links. Mail scanners can prefetch GET requests;
 * this page does not verify tokens until the user continues explicitly.
 */
export function buildAuthConfirmUrl(origin: string, next: string): string {
  return `${normalizeOrigin(origin)}/auth/confirm?next=${encodeURIComponent(next)}`;
}

/** Prevent open redirects — only allow same-origin relative paths. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  if (next.includes("\\") || next.includes("\0")) {
    return "/";
  }
  return next;
}
