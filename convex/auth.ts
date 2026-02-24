import { betterAuth } from "better-auth/minimal";
import { anonymous } from "better-auth/plugins";
import {
  createClient,
  type AuthFunctions,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { crossDomain, convex } from "@convex-dev/better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL ?? "http://localhost:5173";
const authBaseUrl =
  process.env.BETTER_AUTH_BASE_URL ??
  process.env.CONVEX_SITE_URL ??
  process.env.VITE_CONVEX_SITE_URL ??
  siteUrl;

// Explicit AuthFunctions type annotation breaks the circular initializer reference.
const authFunctions: AuthFunctions = internal.auth;

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {
    user: {
      async onCreate(ctx, user) {
        // Link newly-created BA users to existing teamMembers by email
        // (triggered when a user signs up or is created via the invite flow)
        if (!user.email) return;
        const members = await (ctx.db as any)
          .query("teamMembers")
          .withIndex("by_email", (q: any) => q.eq("email", user.email))
          .collect();
        for (const member of members) {
          if (!member.userId) {
            await (ctx.db as any).patch(member._id, { userId: user._id });
          }
        }
      },
    },
  },
});

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: authBaseUrl,
    basePath: "/api/auth",
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig }),
      anonymous(),
    ],
  });

// Internal trigger callbacks — called by the betterAuth component
export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

// Public queries for the client
const clientApi = authComponent.clientApi();

// Used by ConvexBetterAuthProvider and AuthBoundary
export const getAuthUser = clientApi.getAuthUser;

// Alias for backward compatibility with crpc.auth.loggedInUser
export const loggedInUser = clientApi.getAuthUser;
