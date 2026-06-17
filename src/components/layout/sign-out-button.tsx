import { signOut } from "@/app/actions/auth";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={className ?? "nav-link"}>
        Sign out
      </button>
    </form>
  );
}
