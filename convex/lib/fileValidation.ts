/**
 * File Validation Utilities
 *
 * MIME type whitelist, size limits, and validation helpers for file uploads.
 */

export const ALLOWED_MIME_TYPES = {
  // Images (10MB max)
  images: {
    "image/jpeg": { maxSize: 10 * 1024 * 1024, extensions: [".jpg", ".jpeg"] },
    "image/png": { maxSize: 10 * 1024 * 1024, extensions: [".png"] },
    "image/gif": { maxSize: 10 * 1024 * 1024, extensions: [".gif"] },
    "image/webp": { maxSize: 10 * 1024 * 1024, extensions: [".webp"] },
  },

  // Documents (20MB max)
  documents: {
    "application/pdf": { maxSize: 20 * 1024 * 1024, extensions: [".pdf"] },
    "application/msword": { maxSize: 20 * 1024 * 1024, extensions: [".doc"] },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxSize: 20 * 1024 * 1024,
      extensions: [".docx"]
    },
    "application/vnd.ms-excel": { maxSize: 20 * 1024 * 1024, extensions: [".xls"] },
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxSize: 20 * 1024 * 1024,
      extensions: [".xlsx"]
    },
  },

  // Text (10MB max)
  text: {
    "text/plain": { maxSize: 10 * 1024 * 1024, extensions: [".txt"] },
    "text/csv": { maxSize: 10 * 1024 * 1024, extensions: [".csv"] },
    "application/json": { maxSize: 10 * 1024 * 1024, extensions: [".json"] },
  },

  // Audio (10MB max)
  audio: {
    "audio/mpeg": { maxSize: 10 * 1024 * 1024, extensions: [".mp3"] },
    "audio/wav": { maxSize: 10 * 1024 * 1024, extensions: [".wav"] },
    "audio/ogg": { maxSize: 10 * 1024 * 1024, extensions: [".ogg"] },
  },
} as const;

/**
 * Get all allowed MIME types as a flat object
 */
function getAllAllowedMimeTypes(): Record<string, { maxSize: number; extensions: readonly string[] }> {
  return {
    ...ALLOWED_MIME_TYPES.images,
    ...ALLOWED_MIME_TYPES.documents,
    ...ALLOWED_MIME_TYPES.text,
    ...ALLOWED_MIME_TYPES.audio,
  };
}

/**
 * Validate if a MIME type is allowed
 */
export function validateMimeType(mimeType: string): boolean {
  const allowed = getAllAllowedMimeTypes();
  return mimeType in allowed;
}

/**
 * Get max file size for a given MIME type (in bytes)
 */
export function getMaxFileSize(mimeType: string): number | null {
  const allowed = getAllAllowedMimeTypes();
  return allowed[mimeType]?.maxSize ?? null;
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): "image" | "document" | "text" | "audio" | "other" {
  if (mimeType in ALLOWED_MIME_TYPES.images) return "image";
  if (mimeType in ALLOWED_MIME_TYPES.documents) return "document";
  if (mimeType in ALLOWED_MIME_TYPES.text) return "text";
  if (mimeType in ALLOWED_MIME_TYPES.audio) return "audio";
  return "other";
}

/**
 * Validate file upload (throws on error)
 */
export function validateFileUpload(args: {
  mimeType: string;
  size: number;
  name: string;
}): void {
  // Check MIME type
  if (!validateMimeType(args.mimeType)) {
    throw new Error(`Tipo de arquivo não permitido: ${args.mimeType}`);
  }

  // Check size
  const maxSize = getMaxFileSize(args.mimeType);
  if (!maxSize) {
    throw new Error(`Tipo de arquivo não permitido: ${args.mimeType}`);
  }

  if (args.size > maxSize) {
    throw new Error(
      `Arquivo muito grande (${formatFileSize(args.size)}). Máximo permitido: ${formatFileSize(maxSize)}`
    );
  }

  // Check name
  if (!args.name || args.name.trim().length === 0) {
    throw new Error("Nome do arquivo é obrigatório");
  }
}
