import { authComponent } from "../auth";
import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import {
  resolvePermissions,
  hasPermission,
  type PermissionCategory,
  type Role,
  type Permissions,
} from "./permissions";

export async function requireAuth(
  ctx: QueryCtx | MutationCtx,
  organizationId: Id<"organizations">
) {
  const baUser = await authComponent.safeGetAuthUser(ctx);
  if (!baUser) throw new Error("Not authenticated");

  // Look up the team member for this org/user combo
  const userMember = await ctx.db
    .query("teamMembers")
    .withIndex("by_organization_and_user", (q) =>
      q.eq("organizationId", organizationId).eq("userId", baUser._id)
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
