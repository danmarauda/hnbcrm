/**
 * File Quota Management
 *
 * Defines storage limits by organization tier and validates upload quotas.
 */

import { QueryCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { formatFileSize } from "./fileValidation";

export const FILE_QUOTAS = {
  free: {
    totalStorage: 1 * 1024 * 1024 * 1024, // 1GB
    maxFileSize: 10 * 1024 * 1024, // 10MB
    uploadsPerDay: 100,
  },
  pro: {
    totalStorage: 10 * 1024 * 1024 * 1024, // 10GB
    maxFileSize: 20 * 1024 * 1024, // 20MB
    uploadsPerDay: 1000,
  },
} as const;

/**
 * Get organization tier (for now, all orgs are "free")
 * TODO: Add tier field to organizations table when billing is implemented
 */
function getOrganizationTier(_organizationId: Id<"organizations">): "free" | "pro" {
  return "free";
}

/**
 * Check if organization can upload a file (validates quota limits)
 *
 * Throws error if quota exceeded
 */
export async function checkUploadQuota(
  ctx: QueryCtx,
  args: {
    organizationId: Id<"organizations">;
    fileSize: number;
  }
): Promise<void> {
  const tier = getOrganizationTier(args.organizationId);
  const quota = FILE_QUOTAS[tier];

  // Check individual file size
  if (args.fileSize > quota.maxFileSize) {
    throw new Error(
      `Arquivo muito grande (${formatFileSize(args.fileSize)}). Máximo permitido para o plano ${tier}: ${formatFileSize(quota.maxFileSize)}`
    );
  }

  // Get total storage used by organization
  const orgFiles = await ctx.db
    .query("files")
    .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
    .collect();

  const totalUsed = orgFiles.reduce((sum, file) => sum + file.size, 0);

  // Check if adding this file would exceed total storage quota
  if (totalUsed + args.fileSize > quota.totalStorage) {
    throw new Error(
      `Cota de armazenamento excedida. Usando ${formatFileSize(totalUsed)} de ${formatFileSize(quota.totalStorage)}. Este arquivo (${formatFileSize(args.fileSize)}) excederia o limite.`
    );
  }

  // Check daily upload limit (last 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentUploads = orgFiles.filter((file) => file.createdAt > oneDayAgo);

  if (recentUploads.length >= quota.uploadsPerDay) {
    throw new Error(
      `Limite diário de uploads atingido (${quota.uploadsPerDay} uploads nas últimas 24 horas). Plano: ${tier}.`
    );
  }
}

/**
 * Get organization storage stats
 */
export async function getStorageStats(
  ctx: QueryCtx,
  organizationId: Id<"organizations">
): Promise<{
  tier: "free" | "pro";
  totalUsed: number;
  totalQuota: number;
  filesCount: number;
  uploadsLast24h: number;
  dailyQuota: number;
}> {
  const tier = getOrganizationTier(organizationId);
  const quota = FILE_QUOTAS[tier];

  const orgFiles = await ctx.db
    .query("files")
    .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
    .collect();

  const totalUsed = orgFiles.reduce((sum, file) => sum + file.size, 0);

  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const uploadsLast24h = orgFiles.filter((file) => file.createdAt > oneDayAgo).length;

  return {
    tier,
    totalUsed,
    totalQuota: quota.totalStorage,
    filesCount: orgFiles.length,
    uploadsLast24h,
    dailyQuota: quota.uploadsPerDay,
  };
}
