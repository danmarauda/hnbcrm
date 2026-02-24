/**
 * ORM setup — populated in Phase 2 once schema.ts is migrated to
 * better-convex/orm convexTable definitions with defineRelations.
 *
 * For now this module re-exports a placeholder. Update this file after
 * schema.ts migration is complete to attach ctx.orm to all cRPC procedures.
 */

// Will be activated in Phase 2 once schema exports `relations`:
//
//   import { createOrm } from "better-convex/orm";
//   import type { MutationCtx, QueryCtx } from "../_generated/server";
//   import { relations } from "../schema";
//
//   export const orm = createOrm({ schema: relations });
//   export const withOrm = <Ctx extends QueryCtx | MutationCtx>(ctx: Ctx) => ({
//     ...ctx,
//     orm: orm.db(ctx),
//   });

export {};
