import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import {
  resolvePermissions,
  hasPermission,
  type PermissionCategory,
  type Role,
  type Permissions,
} from "./permissions";

export async function requireAuth(ctx: QueryCtx | MutationCtx, organizationId: Id<"organizations">) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error("Not authenticated");
  const userMember = await ctx.db
    .query("teamMembers")
    .withIndex("by_organization_and_user", (q) =>
      q.eq("organizationId", organizationId).eq("userId", userId)
    )
    .first();
  if (!userMember) throw new Error("Not authorized");
  return userMember;
}

/**
 * Require auth + check a specific permission level.
 * Throws "Permissão insuficiente" if the member lacks the required permission.
 */
export async function requirePermission(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">,
  category: PermissionCategory,
  requiredLevel: string
) {
  const member = await requireAuth(ctx, organizationId);
  const permissions = resolvePermissions(
    member.role as Role,
    (member as any).permissions as Permissions | undefined
  );
  if (!hasPermission(permissions, category, requiredLevel)) {
    throw new Error("Permissão insuficiente");
  }
  return member;
}
