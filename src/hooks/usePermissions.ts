;
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useQuery, useMutation, skipToken } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import {
  resolvePermissions,
  hasPermission,
  type Permissions,
  type PermissionCategory,
  type Role,
} from "../../convex/lib/permissions";

interface UsePermissionsResult {
  /** Resolved permissions for the current user */
  permissions: Permissions | null;
  /** The current user's role */
  role: Role | null;
  /** Whether the current member data is still loading */
  isLoading: boolean;
  /** Check if the user has at least the given level for a category */
  can: (category: PermissionCategory, requiredLevel: string) => boolean;
  /** Whether the user must change their password before continuing */
  mustChangePassword: boolean;
  /** The current team member record */
  member: {
    _id: Id<"teamMembers">;
    name: string;
    email?: string;
    role: string;
    type: string;
    status: string;
    permissions?: Permissions | null;
    mustChangePassword?: boolean;
  } | null;
}

export function usePermissions(organizationId: Id<"organizations">): UsePermissionsResult {
  const crpc = useCRPC();
  const { data: member } = useQuery(crpc.teamMembers.getCurrentTeamMember.queryOptions(organizationId ? { organizationId } : skipToken));

  const isLoading = member === undefined;

  const role = member ? (member.role as Role) : null;
  const permissions = member
    ? resolvePermissions(member.role as Role, member.permissions as Permissions | undefined)
    : null;

  const can = (category: PermissionCategory, requiredLevel: string): boolean => {
    if (!permissions) return false;
    return hasPermission(permissions, category, requiredLevel);
  };

  const mustChangePassword = member?.mustChangePassword === true;

  return {
    permissions,
    role,
    isLoading,
    can,
    mustChangePassword,
    member: member as UsePermissionsResult["member"],
  };
}
