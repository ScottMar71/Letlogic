/** Map Supabase Auth errors to user-friendly copy. */
export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("rate_limit")) {
    return "Too many attempts recently. Wait a few minutes, then try again.";
  }

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid credentials")
  ) {
    return "Email or password is incorrect.";
  }

  if (lower.includes("invalid") && lower.includes("email")) {
    return "Please enter a valid email address.";
  }

  if (lower.includes("signup") && lower.includes("disabled")) {
    return "New sign-ups are currently disabled. Contact support if you need access.";
  }

  if (lower.includes("password") && lower.includes("weak")) {
    return "Choose a stronger password — at least 6 characters.";
  }

  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Sign in instead.";
  }

  return message;
}
