type RequestHeaders = {
  get(name: string): string | null;
};

/** Origin for the current request (e.g. http://localhost:3000 in dev). */
export function getRequestOrigin(headersList: RequestHeaders): string {
  const host =
    headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  }

  const proto =
    headersList.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");

  return `${proto}://${host}`;
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
