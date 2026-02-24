import { createAuthClient } from "better-auth/react";
import { anonymousClient } from "better-auth/client/plugins";
import { crossDomainClient, convexClient } from "@convex-dev/better-auth/client/plugins";

const convexUrl = import.meta.env.VITE_CONVEX_URL as string;
const siteUrl = import.meta.env.VITE_CONVEX_SITE_URL as string ?? window.location.origin;

// Better-auth endpoints are registered at /api/auth on the Convex site URL
const authBaseURL = `${siteUrl}/api/auth`;

export const authClient = createAuthClient({
  baseURL: authBaseURL,
  plugins: [
    crossDomainClient(),
    convexClient({ convexUrl }),
    anonymousClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
