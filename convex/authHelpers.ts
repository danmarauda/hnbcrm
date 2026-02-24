/**
 * Better Auth helpers — thin wrappers used by nodeActions.ts.
 * User/account creation is now handled by the Better Auth HTTP API.
 */

import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";
import { authComponent } from "./auth";

// Internal query: find a Better Auth user by email
export const queryUserByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    const baUser = await authComponent.getAnyUserById(ctx, args.email).catch(
      () => null
    );
    if (baUser && baUser.email === args.email) return baUser;

    // Fall back to scanning team members by email to find linked BA user ID
    const member = await ctx.db
      .query("teamMembers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!member?.userId) return null;

    return authComponent.getAnyUserById(ctx, member.userId);
  },
});

// Internal mutation: clear the mustChangePassword flag for a team member
export const clearMustChangePasswordByUserId = internalMutation({
  args: { baUserId: v.string(), organizationId: v.id("organizations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("teamMembers")
      .withIndex("by_organization_and_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", args.baUserId)
      )
      .first();
    if (member?.mustChangePassword) {
      await ctx.db.patch(member._id, { mustChangePassword: false });
    }
    return null;
  },
});
