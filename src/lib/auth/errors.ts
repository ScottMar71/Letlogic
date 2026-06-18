/** Map Supabase Auth errors to user-friendly copy. */
export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("rate_limit")) {
    return "Too many sign-in emails sent recently. Wait about an hour, then try again — or check your inbox for an earlier magic link.";
  }

  if (lower.includes("invalid") && lower.includes("email")) {
    return "Please enter a valid email address.";
  }

  if (lower.includes("signup") && lower.includes("disabled")) {
    return "New sign-ups are currently disabled. Contact support if you need access.";
  }

  return message;
}
