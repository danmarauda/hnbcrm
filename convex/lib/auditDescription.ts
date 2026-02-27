/**
 * Generates human-readable English descriptions for audit log entries.
 */

const ENTITY_LABELS: Record<string, string> = {
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
  task: "task",
  calendarEvent: "calendar event",
};

const ACTION_VERBS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  delete: "Deleted",
  move: "Moved",
  assign: "Assigned",
  handoff: "Handed off",
};

interface BuildDescriptionArgs {
  action: string;
  entityType: string;
  metadata?: Record<string, unknown>;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
}

export function buildAuditDescription({
  action,
  entityType,
  metadata,
  changes,
}: BuildDescriptionArgs): string {
  const verb = ACTION_VERBS[action] || action;
  const label = ENTITY_LABELS[entityType] || entityType;

  const name =
    (metadata?.title as string) ||
    (metadata?.name as string) ||
    "";

  const nameStr = name ? ` '${name}'` : "";

  // Special cases
  if (action === "move" && metadata?.fromStageName && metadata?.toStageName) {
    return `${verb} ${label}${nameStr} from '${metadata.fromStageName}' to '${metadata.toStageName}'`;
  }

  if (action === "assign" && metadata?.assigneeName) {
    return `${verb} ${label}${nameStr} to ${metadata.assigneeName}`;
  }

  if (action === "handoff") {
    const parts = [verb, label];
    if (nameStr) parts.push(nameStr.trim());
    if (metadata?.fromMemberName && metadata?.toMemberName) {
      return `${parts.join(" ")} from ${metadata.fromMemberName} to ${metadata.toMemberName}`;
    }
    if (metadata?.toMemberName) {
      return `${parts.join(" ")} to ${metadata.toMemberName}`;
    }
    return parts.join(" ");
  }

  if (action === "update" && changes?.after) {
    const fields = Object.keys(changes.after);
    if (fields.length === 1) {
      return `${verb} ${label}${nameStr} (${fields[0]})`;
    }
    if (fields.length > 1) {
      return `${verb} ${label}${nameStr} (${fields.length} fields)`;
    }
  }

  return `${verb} ${label}${nameStr}`;
}
