/** Map Supabase Auth errors to user-friendly copy. */
export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("confirmation email")) {
    return "We couldn't send a confirmation email. Try again in a few minutes, or contact support if the problem persists.";
  }

  if (lower.includes("rate limit") || lower.includes("rate_limit")) {
    if (lower.includes("email")) {
      return "Our email provider limit was reached (from earlier sign-in tests). Wait up to an hour, then try again — or use Sign in if you already have an account.";
    }
    return "Too many sign-in or sign-up attempts from your network. Wait about 5 minutes, then try again.";
  }

  if (lower.includes("email not confirmed")) {
    return "Confirm your email first — check your inbox for a link from LetLogic, then try signing in again.";
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
