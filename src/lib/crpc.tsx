import { api } from "../../convex/_generated/api";
import { createCRPCContext } from "better-convex/react";

/**
 * CRPC client context for TanStack Query integration.
 *
 * Meta is an empty object because we're using the existing Convex folder
 * structure (convex/*.ts) rather than better-convex's `convex/functions/`
 * layout, so the auto-generated meta.ts file isn't available. Auth metadata
 * per-function is handled by @convex-dev/auth (not Better Auth) for now.
 */
export const { CRPCProvider, useCRPC, useCRPCClient } = createCRPCContext<typeof api>({
  api,
  meta: {} as any,
});
