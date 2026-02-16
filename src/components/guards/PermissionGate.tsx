import type { PermissionCategory } from "../../../convex/lib/permissions";
import { usePermissions } from "@/hooks/usePermissions";
import { Id } from "../../../convex/_generated/dataModel";

interface PermissionGateProps {
  organizationId: Id<"organizations">;
  category: PermissionCategory;
  level: string;
  /** Content to show when permission is granted */
  children: React.ReactNode;
  /** Optional fallback when permission is denied (defaults to nothing) */
  fallback?: React.ReactNode;
}

/**
 * Conditionally renders children based on the current user's permissions.
 * If the user lacks the required permission level, renders the fallback (or nothing).
 */
export function PermissionGate({
  organizationId,
  category,
  level,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can, isLoading } = usePermissions(organizationId);

  if (isLoading) return null;

  if (!can(category, level)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
