import {
  Users,
  UserCircle,
  Building2,
  UserPlus,
  ArrowRightLeft,
  MessageSquare,
  LayoutDashboard,
  Layers,
  Webhook,
  Radio,
  SlidersHorizontal,
  Key,
  BookmarkCheck,
} from "lucide-react";

// Entity icon mapping
export const ENTITY_ICONS: Record<string, any> = {
  lead: Users,
  contact: UserCircle,
  organization: Building2,
  teamMember: UserPlus,
  handoff: ArrowRightLeft,
  message: MessageSquare,
  board: LayoutDashboard,
  stage: Layers,
  webhook: Webhook,
  leadSource: Radio,
  fieldDefinition: SlidersHorizontal,
  apiKey: Key,
  savedView: BookmarkCheck,
};

// Action badge mapping
export const ACTION_LABELS: Record<string, { label: string; variant: string }> = {
  create: { label: "Create", variant: "success" },
  update: { label: "Update", variant: "info" },
  delete: { label: "Delete", variant: "error" },
  move: { label: "Move", variant: "brand" },
  assign: { label: "Assign", variant: "info" },
  handoff: { label: "Handoff", variant: "warning" },
};

// Field label mapping for diff table
export const FIELD_LABELS: Record<string, string> = {
  stageId: "Stage",
  assignedTo: "Owner",
  status: "Status",
  priority: "Priority",
  title: "Title",
  name: "Name",
  value: "Value",
  email: "Email",
  phone: "Phone",
  company: "Company",
  temperature: "Temperature",
  tags: "Tags",
  qualification: "Qualification",
  contactId: "Contact",
};

// Date grouping utility
export function getDateGroup(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);
  const monthAgo = new Date(today.getTime() - 30 * 86400000);

  if (date >= today) return "Today";
  if (date >= yesterday) return "Yesterday";
  if (date >= weekAgo) return "This Week";
  if (date >= monthAgo) return "This Month";
  return "Older";
}

// Relative time utility
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(timestamp).toLocaleDateString("en-US");
}

// Client-side description fallback
export const ACTION_VERBS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  move: "Moved",
  assign: "Assigned",
  handoff: "Handed off",
};

export const ENTITY_LABELS: Record<string, string> = {
  lead: "lead",
  contact: "contact",
  organization: "organization",
  teamMember: "member",
  handoff: "handoff",
  message: "message",
  board: "board",
  stage: "stage",
  webhook: "webhook",
  leadSource: "lead source",
  fieldDefinition: "custom field",
  apiKey: "API key",
  savedView: "saved view",
};

export function buildClientDescription(log: any): string {
  const verb = ACTION_VERBS[log.action] || log.action;
  const label = ENTITY_LABELS[log.entityType] || log.entityType;
  const meta = log.metadata as Record<string, unknown> | undefined;
  const name = (meta?.title as string) || (meta?.name as string) || "";
  return name ? `${verb} ${label} '${name}'` : `${verb} ${label}`;
}

// Value formatter for diff
export function formatDiffValue(val: unknown): string {
  if (val === undefined || val === null) return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number") return String(val);
  if (Array.isArray(val)) return val.join(", ") || "—";
  if (typeof val === "object") return "Updated";
  return String(val);
}

// Group logs by date label (extracted from AuditLogs IIFE)
export function groupLogsByDate(logs: any[]): { label: string; logs: any[] }[] {
  const groups: { label: string; logs: any[] }[] = [];
  let currentGroup: string | null = null;

  for (const log of logs) {
    const group = getDateGroup(log.createdAt);
    if (group !== currentGroup) {
      groups.push({ label: group, logs: [log] });
      currentGroup = group;
    } else {
      groups[groups.length - 1].logs.push(log);
    }
  }

  return groups;
}
