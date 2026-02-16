import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Internal query: find user by email in the users table
export const queryUserByEmail = internalQuery({
  args: { email: v.string() },
  returns: v.any(),
  handler: async (ctx, args) => {
    // users table doesn't have an email index, so we filter
    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .take(1);
    return users[0] ?? null;
  },
});

// Internal query: get auth account (password provider) for current user
export const queryAuthAccountForCurrentUser = internalQuery({
  args: {},
  returns: v.any(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Find the password auth account for this user
    const accounts = await ctx.db
      .query("authAccounts")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("provider"), "password")
        )
      )
      .take(1);

    if (accounts.length === 0) return null;
    return { ...accounts[0], userId };
  },
});

// Internal mutation: insert a new user and their auth account
export const insertUserAndAuthAccount = internalMutation({
  args: {
    email: v.string(),
    name: v.string(),
    passwordHash: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Create user record
    const userId = await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
    } as any);

    // Create auth account linked to user
    await ctx.db.insert("authAccounts" as any, {
      userId,
      provider: "password",
      providerAccountId: args.email,
      secret: args.passwordHash,
    } as any);

    return userId;
  },
});

// Internal mutation: update the secret (password hash) on an auth account
export const patchAuthAccountSecret = internalMutation({
  args: {
    authAccountId: v.string(),
    newSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.authAccountId as any, {
      secret: args.newSecret,
    } as any);
    return null;
  },
});
