import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";

export function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="px-4 py-2 rounded-lg bg-surface-overlay text-text-secondary border border-border font-semibold hover:bg-surface-raised hover:text-text-primary transition-colors shadow-sm hover:shadow"
      onClick={() => void signOut()}
    >
      Sair
    </button>
  );
}
