"use node";

import crypto from "crypto";
import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { permissionsValidator } from "./schema";
import { authComponent, createAuth } from "./auth";

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function hmacSha256(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function generateTempPassword(): string {
  return crypto.randomBytes(9).toString("base64url");
}

// Hash a string with SHA-256 (used by router to hash incoming API keys)
export const hashString = internalAction({
  args: { input: v.string() },
  returns: v.string(),
  handler: async (_ctx, args) => {
    return sha256(args.input);
  },
});

// Create API key with secure hashing
export const createApiKey = action({
  args: {
    organizationId: v.id("organizations"),
    teamMemberId: v.id("teamMembers"),
    name: v.string(),
    expiresAt: v.optional(v.number()),
  },
  returns: v.object({ apiKeyId: v.id("apiKeys"), apiKey: v.string() }),
  handler: async (ctx, args): Promise<{ apiKeyId: Id<"apiKeys">; apiKey: string }> => {
    const admin: any = await ctx.runQuery(internal.apiKeys.verifyAdmin, {
      organizationId: args.organizationId,
    });
    if (!admin) throw new Error("Not authorized — admin role required");

    const apiKey = `hnbcrm_${crypto.randomBytes(24).toString("base64url")}`;
    const keyHash = sha256(apiKey);

    const apiKeyId = await ctx.runMutation(internal.apiKeys.insertApiKey, {
      organizationId: args.organizationId,
      teamMemberId: args.teamMemberId,
      name: args.name,
      keyHash,
      actorId: admin._id,
      expiresAt: args.expiresAt,
    });

    return { apiKeyId, apiKey };
  },
});

// Invite a human team member — creates a Better Auth account with temp password if new
export const inviteHumanMember = action({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("manager"), v.literal("agent")),
    permissions: v.optional(permissionsValidator),
  },
  returns: v.object({
    teamMemberId: v.id("teamMembers"),
    isNewUser: v.boolean(),
    tempPassword: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<{
    teamMemberId: Id<"teamMembers">;
    isNewUser: boolean;
    tempPassword?: string;
  }> => {
    // Verify caller has team:manage permission
    const callerMember: any = await ctx.runQuery(
      internal.teamMembers.internalVerifyTeamManager,
      { organizationId: args.organizationId }
    );
    if (!callerMember) throw new Error("Permissão insuficiente");

    // Check if the email is already a member of this org
    const existingMemberInOrg: any = await ctx.runQuery(
      internal.teamMembers.internalGetMemberByEmail,
      { organizationId: args.organizationId, email: args.email }
    );
    if (existingMemberInOrg) {
      throw new Error("Este usuário já é membro desta organização");
    }

    // Check if the user already has a BA account (linked to any teamMember)
    const existingBaUserId: string | null = await ctx.runQuery(
      internal.teamMembers.internalGetBaUserIdByEmail,
      { email: args.email }
    );

    let isNewUser = false;
    let tempPassword: string | undefined;

    if (existingBaUserId) {
      // Existing BA user — just create the team member record linked to them
      const teamMemberId = await ctx.runMutation(
        internal.teamMembers.internalCreateInvitedMember,
        {
          organizationId: args.organizationId,
          userId: existingBaUserId,
          name: args.name,
          email: args.email,
          role: args.role,
          invitedBy: callerMember._id,
          mustChangePassword: false,
          permissions: args.permissions,
        }
      );
      return { teamMemberId, isNewUser: false };
    }

    // New user — create teamMember first (trigger will link after BA user is created)
    isNewUser = true;
    tempPassword = generateTempPassword();

    const teamMemberId = await ctx.runMutation(
      internal.teamMembers.internalCreateInvitedMember,
      {
        organizationId: args.organizationId,
        userId: undefined,
        name: args.name,
        email: args.email,
        role: args.role,
        invitedBy: callerMember._id,
        mustChangePassword: true,
        permissions: args.permissions,
      }
    );

    // Create the Better Auth user account (triggers will link userId to teamMember)
    const auth = createAuth(ctx as any);
    await auth.api.signUpEmail({
      body: { email: args.email, name: args.name, password: tempPassword },
    });

    return { teamMemberId, isNewUser, tempPassword };
  },
});

// Change password via Better Auth's changePassword endpoint
export const changePassword = action({
  args: {
    organizationId: v.id("organizations"),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  returns: v.object({ success: v.boolean() }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    const { auth, headers } = await authComponent.getAuth(createAuth as any, ctx as any);

    // Better Auth handles verification and hashing internally
    await auth.api.changePassword({
      headers,
      body: { currentPassword: args.currentPassword, newPassword: args.newPassword },
    });

    // Clear mustChangePassword flag for this user in this org
    const baUser = await authComponent.safeGetAuthUser(ctx as any);
    if (baUser?._id) {
      await ctx.runMutation(internal.authHelpers.clearMustChangePasswordByUserId, {
        baUserId: baUser._id,
        organizationId: args.organizationId,
      });
    }

    return { success: true };
  },
});

// Fire matching webhooks with HMAC-SHA256 signatures
export const triggerWebhooks = internalAction({
  args: {
    organizationId: v.id("organizations"),
    event: v.string(),
    payload: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const webhooks = await ctx.runQuery(internal.webhookTrigger.getMatchingWebhooks, {
      organizationId: args.organizationId,
      event: args.event,
    });

    for (const webhook of webhooks) {
      try {
        const body = JSON.stringify({
          event: args.event,
          timestamp: Date.now(),
          data: args.payload,
        });

        const signature = `sha256=${hmacSha256(body, webhook.secret)}`;

        await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": signature,
            "X-Webhook-Event": args.event,
          },
          body,
        });

        await ctx.runMutation(internal.webhookTrigger.updateWebhookTriggered, {
          webhookId: webhook._id,
        });
      } catch (error) {
        console.error(`Failed to trigger webhook ${webhook.name}:`, error);
      }
    }

    return null;
  },
});
