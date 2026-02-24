import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

// Use URL-based JWKS - Better Auth manages keys internally via its DB tables.
// The JWKS endpoint is served at: ${CONVEX_SITE_URL}/api/auth/convex/jwks
export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
