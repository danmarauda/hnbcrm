/**
 * better-convex cRPC server builder.
 *
 * Exports the cRPC procedure builder for optional use in new functions.
 * Existing functions continue to use native Convex query/mutation builders
 * (which produce proper "public"/"internal" visibility literal types compatible
 * with api.* and internal.* FilterApi namespaces).
 *
 * The initCRPC builder is available here for future new functions that want
 * to use the cRPC chainable API with Zod validation.
 */
import { initCRPC } from "better-convex/server";
import type { DataModel } from "../_generated/dataModel";
import { z } from "zod";

const c = initCRPC.dataModel<DataModel>().create();

export const publicQuery = c.query;
export const publicMutation = c.mutation;
export const publicAction = c.action;

export const privateQuery = c.query.internal();
export const privateMutation = c.mutation.internal();
export const privateAction = c.action.internal();

export const router = c.router;

/** Convex Id expressed as a plain string for Zod validation. */
export const zId = z.string();
