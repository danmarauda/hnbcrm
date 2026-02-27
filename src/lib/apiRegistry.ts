// Single source of truth for all REST API endpoints
// Drives the playground forms, docs tables, and OpenAPI generation

export type ParamLocation = "query" | "body";

export interface ApiParam {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  location: ParamLocation;
  description: string;
  enumValues?: string[];
  default?: string;
  nested?: ApiParam[];
}

export interface ApiEndpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  category: string;
  title: string;
  description: string;
  params: ApiParam[];
  responseExample: Record<string, unknown>;
}

export const API_CATEGORIES = [
  "Leads",
  "Contacts",
  "Conversations",
  "Handoffs",
  "Pipeline",
  "Activities",
  "Tasks",
  "Files",
  "Dashboard",
  "Sources",
  "Audit",
] as const;

export type ApiCategory = (typeof API_CATEGORIES)[number];

export const ALL_ENDPOINTS: ApiEndpoint[] = [
  // ---- Leads ----
  {
    id: "inbound-lead",
    method: "POST",
    path: "/api/v1/inbound/lead",
    category: "Leads",
    title: "Create Lead (Inbound)",
    description: "Creates a lead with optional contact and message. Auto-assigns to an AI agent if configured.",
    params: [
      { name: "title", type: "string", required: true, location: "body", description: "Lead title" },
      { name: "contact", type: "object", required: false, location: "body", description: "Contact data", nested: [
        { name: "email", type: "string", required: false, location: "body", description: "Contact email" },
        { name: "phone", type: "string", required: false, location: "body", description: "Phone" },
        { name: "firstName", type: "string", required: false, location: "body", description: "First name" },
        { name: "lastName", type: "string", required: false, location: "body", description: "Last name" },
        { name: "company", type: "string", required: false, location: "body", description: "Company" },
      ]},
      { name: "message", type: "string", required: false, location: "body", description: "Initial message (creates conversation)" },
      { name: "channel", type: "string", required: false, location: "body", description: "Conversation channel", enumValues: ["whatsapp", "telegram", "email", "webchat", "internal"], default: "webchat" },
      { name: "value", type: "number", required: false, location: "body", description: "Lead value", default: "0" },
      { name: "currency", type: "string", required: false, location: "body", description: "Currency (e.g. BRL)" },
      { name: "priority", type: "string", required: false, location: "body", description: "Priority", enumValues: ["low", "medium", "high", "urgent"], default: "medium" },
      { name: "temperature", type: "string", required: false, location: "body", description: "Temperature", enumValues: ["cold", "warm", "hot"], default: "cold" },
      { name: "sourceId", type: "string", required: false, location: "body", description: "Lead source ID" },
      { name: "tags", type: "array", required: false, location: "body", description: "Lead tags", default: "[]" },
      { name: "customFields", type: "object", required: false, location: "body", description: "Custom fields", default: "{}" },
    ],
    responseExample: { success: true, leadId: "jd7x8k2m9n4p5q1r", contactId: "k3b7y9w2x5z8a4c6" },
  },
  {
    id: "list-leads",
    method: "GET",
    path: "/api/v1/leads",
    category: "Leads",
    title: "List Leads",
    description: "List leads with optional filters by board, stage, and assignee.",
    params: [
      { name: "boardId", type: "string", required: false, location: "query", description: "Filter by board" },
      { name: "stageId", type: "string", required: false, location: "query", description: "Filter by stage" },
      { name: "assignedTo", type: "string", required: false, location: "query", description: "Filter by assignee" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      leads: [
        { _id: "jd7x8k2m9n4p5q1r", title: "New lead via form", boardId: "kn8y...", stageId: "m2a4...", contactId: "p5b7...", assignedTo: null, value: 5000, priority: "medium", temperature: "warm", tags: [], customFields: {}, _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|jd7x8k2m9n4p5q1r",
      hasMore: false,
    },
  },
  {
    id: "get-lead",
    method: "GET",
    path: "/api/v1/leads/get",
    category: "Leads",
    title: "Lead Details",
    description: "Returns full lead details by ID.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "Lead ID" },
    ],
    responseExample: {
      lead: { _id: "jd7x8k2m9n4p5q1r", title: "Example lead", boardId: "kn8y...", stageId: "m2a4...", contactId: "p5b7...", assignedTo: null, value: 5000, priority: "medium", temperature: "warm", tags: ["inbound"], customFields: {}, _creationTime: 1739620800000 },
    },
  },
  {
    id: "update-lead",
    method: "POST",
    path: "/api/v1/leads/update",
    category: "Leads",
    title: "Update Lead",
    description: "Updates fields on an existing lead.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
      { name: "title", type: "string", required: false, location: "body", description: "New title" },
      { name: "value", type: "number", required: false, location: "body", description: "New value" },
      { name: "priority", type: "string", required: false, location: "body", description: "New priority", enumValues: ["low", "medium", "high", "urgent"] },
      { name: "temperature", type: "string", required: false, location: "body", description: "New temperature", enumValues: ["cold", "warm", "hot"] },
      { name: "tags", type: "array", required: false, location: "body", description: "New tags" },
      { name: "customFields", type: "object", required: false, location: "body", description: "Custom fields" },
      { name: "sourceId", type: "string", required: false, location: "body", description: "Source ID" },
    ],
    responseExample: { success: true },
  },
  {
    id: "delete-lead",
    method: "POST",
    path: "/api/v1/leads/delete",
    category: "Leads",
    title: "Delete Lead",
    description: "Permanently deletes a lead.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
    ],
    responseExample: { success: true },
  },
  {
    id: "move-lead-stage",
    method: "POST",
    path: "/api/v1/leads/move-stage",
    category: "Leads",
    title: "Move Lead Stage",
    description: "Move a lead to another pipeline stage.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
      { name: "stageId", type: "string", required: true, location: "body", description: "New stage ID" },
    ],
    responseExample: { success: true },
  },
  {
    id: "assign-lead",
    method: "POST",
    path: "/api/v1/leads/assign",
    category: "Leads",
    title: "Assign Lead",
    description: "Assigns a lead to a team member.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
      { name: "assignedTo", type: "string", required: false, location: "body", description: "Member ID (null to unassign)" },
    ],
    responseExample: { success: true },
  },
  {
    id: "request-handoff",
    method: "POST",
    path: "/api/v1/leads/handoff",
    category: "Leads",
    title: "Request Handoff",
    description: "Requests a handoff from AI to human for a lead.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
      { name: "reason", type: "string", required: true, location: "body", description: "Handoff reason" },
      { name: "toMemberId", type: "string", required: false, location: "body", description: "Target member ID" },
      { name: "summary", type: "string", required: false, location: "body", description: "Context summary" },
      { name: "suggestedActions", type: "array", required: false, location: "body", description: "Suggested actions", default: "[]" },
    ],
    responseExample: { success: true, handoffId: "h4n8d0f2f9i3d1x7" },
  },

  // ---- Contacts ----
  {
    id: "list-contacts",
    method: "GET",
    path: "/api/v1/contacts",
    category: "Contacts",
    title: "List Contacts",
    description: "Lists all contacts in the organization.",
    params: [
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "500" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      contacts: [
        { _id: "k3b7y9w2x5z8a4c6", firstName: "Maria", lastName: "Silva", email: "maria@empresa.com", phone: "+5511999999999", company: "Company LTDA", _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|k3b7y9w2x5z8a4c6",
      hasMore: false,
    },
  },
  {
    id: "create-contact",
    method: "POST",
    path: "/api/v1/contacts/create",
    category: "Contacts",
    title: "Create Contact",
    description: "Creates a new contact in the organization.",
    params: [
      { name: "firstName", type: "string", required: false, location: "body", description: "First name" },
      { name: "lastName", type: "string", required: false, location: "body", description: "Last name" },
      { name: "email", type: "string", required: false, location: "body", description: "Email" },
      { name: "phone", type: "string", required: false, location: "body", description: "Phone" },
      { name: "company", type: "string", required: false, location: "body", description: "Company" },
      { name: "title", type: "string", required: false, location: "body", description: "Job title" },
      { name: "whatsappNumber", type: "string", required: false, location: "body", description: "WhatsApp number" },
      { name: "telegramUsername", type: "string", required: false, location: "body", description: "Telegram username" },
      { name: "tags", type: "array", required: false, location: "body", description: "Tags" },
      { name: "bio", type: "string", required: false, location: "body", description: "Bio" },
      { name: "linkedinUrl", type: "string", required: false, location: "body", description: "LinkedIn URL" },
      { name: "city", type: "string", required: false, location: "body", description: "City" },
      { name: "state", type: "string", required: false, location: "body", description: "State" },
      { name: "country", type: "string", required: false, location: "body", description: "Country" },
      { name: "industry", type: "string", required: false, location: "body", description: "Industry" },
      { name: "companySize", type: "string", required: false, location: "body", description: "Company size" },
      { name: "cnpj", type: "string", required: false, location: "body", description: "CNPJ" },
      { name: "companyWebsite", type: "string", required: false, location: "body", description: "Website" },
      { name: "customFields", type: "object", required: false, location: "body", description: "Custom fields" },
    ],
    responseExample: { success: true, contactId: "k3b7y9w2x5z8a4c6" },
  },
  {
    id: "get-contact",
    method: "GET",
    path: "/api/v1/contacts/get",
    category: "Contacts",
    title: "Contact Details",
    description: "Returns full contact details by ID.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "Contact ID" },
    ],
    responseExample: {
      contact: { _id: "k3b7y9w2x5z8a4c6", firstName: "Maria", lastName: "Silva", email: "maria@empresa.com", phone: "+5511999999999", company: "Company LTDA", tags: ["customer"], _creationTime: 1739620800000 },
    },
  },
  {
    id: "update-contact",
    method: "POST",
    path: "/api/v1/contacts/update",
    category: "Contacts",
    title: "Update Contact",
    description: "Updates data for an existing contact.",
    params: [
      { name: "contactId", type: "string", required: true, location: "body", description: "Contact ID" },
      { name: "firstName", type: "string", required: false, location: "body", description: "First name" },
      { name: "lastName", type: "string", required: false, location: "body", description: "Last name" },
      { name: "email", type: "string", required: false, location: "body", description: "Email" },
      { name: "phone", type: "string", required: false, location: "body", description: "Phone" },
      { name: "company", type: "string", required: false, location: "body", description: "Company" },
      { name: "title", type: "string", required: false, location: "body", description: "Job title" },
      { name: "tags", type: "array", required: false, location: "body", description: "Tags" },
      { name: "city", type: "string", required: false, location: "body", description: "City" },
      { name: "state", type: "string", required: false, location: "body", description: "State" },
      { name: "country", type: "string", required: false, location: "body", description: "Country" },
      { name: "customFields", type: "object", required: false, location: "body", description: "Custom fields" },
    ],
    responseExample: { success: true },
  },
  {
    id: "enrich-contact",
    method: "POST",
    path: "/api/v1/contacts/enrich",
    category: "Contacts",
    title: "Enrich Contact",
    description: "Enriches contact data via AI agent.",
    params: [
      { name: "contactId", type: "string", required: true, location: "body", description: "Contact ID" },
      { name: "fields", type: "object", required: true, location: "body", description: "Fields to enrich (key: value)" },
      { name: "source", type: "string", required: true, location: "body", description: "Data source (e.g.: linkedin, google)" },
      { name: "confidence", type: "number", required: false, location: "body", description: "Confidence (0-1)" },
    ],
    responseExample: { success: true },
  },
  {
    id: "contact-gaps",
    method: "GET",
    path: "/api/v1/contacts/gaps",
    category: "Contacts",
    title: "Enrichment Gaps",
    description: "Returns empty contact fields that can be enriched.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "Contact ID" },
    ],
    responseExample: {
      contact: { _id: "k3b7y9w2x5z8a4c6", firstName: "Maria", missingFields: ["linkedinUrl", "industry", "companySize"], enrichmentScore: 45 },
    },
  },
  {
    id: "search-contacts",
    method: "GET",
    path: "/api/v1/contacts/search",
    category: "Contacts",
    title: "Search Contacts",
    description: "Search contacts by text (name, email, company).",
    params: [
      { name: "q", type: "string", required: true, location: "query", description: "Search text" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 100)", default: "20" },
    ],
    responseExample: {
      contacts: [
        { _id: "k3b7y9w2x5z8a4c6", firstName: "Maria", lastName: "Silva", email: "maria@empresa.com", company: "Company LTDA" },
      ],
    },
  },

  // ---- Conversations ----
  {
    id: "list-conversations",
    method: "GET",
    path: "/api/v1/conversations",
    category: "Conversations",
    title: "List Conversations",
    description: "Lists conversations, optionally filtered by lead.",
    params: [
      { name: "leadId", type: "string", required: false, location: "query", description: "Filter by lead" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      conversations: [
        { _id: "c9v2s4t7n1a8e3r6", leadId: "jd7x8k2m9n4p5q1r", channel: "webchat", status: "active", lastMessageAt: 1739620800000, _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|c9v2s4t7n1a8e3r6",
      hasMore: false,
    },
  },
  {
    id: "get-messages",
    method: "GET",
    path: "/api/v1/conversations/messages",
    category: "Conversations",
    title: "Conversation Messages",
    description: "Return all messages from a conversation.",
    params: [
      { name: "conversationId", type: "string", required: true, location: "query", description: "Conversation ID" },
    ],
    responseExample: {
      messages: [
        { _id: "m5s8g3j1k7p4q9w2", conversationId: "c9v2s4t7n1a8e3r6", content: "Hello, I would like to know more.", contentType: "text", isInternal: false, _creationTime: 1739620800000 },
      ],
    },
  },
  {
    id: "send-message",
    method: "POST",
    path: "/api/v1/conversations/send",
    category: "Conversations",
    title: "Send Message",
    description: "Sends a message in an existing conversation.",
    params: [
      { name: "conversationId", type: "string", required: true, location: "body", description: "Conversation ID" },
      { name: "content", type: "string", required: true, location: "body", description: "Message content" },
      { name: "contentType", type: "string", required: false, location: "body", description: "Content type", enumValues: ["text", "image", "file", "audio"], default: "text" },
      { name: "isInternal", type: "boolean", required: false, location: "body", description: "Internal note?", default: "false" },
    ],
    responseExample: { success: true, messageId: "m5s8g3j1k7p4q9w2" },
  },

  // ---- Handoffs ----
  {
    id: "list-handoffs",
    method: "GET",
    path: "/api/v1/handoffs",
    category: "Handoffs",
    title: "List Handoffs",
    description: "Lists handoffs with an optional status filter.",
    params: [
      { name: "status", type: "string", required: false, location: "query", description: "Filter by status", enumValues: ["pending", "accepted", "rejected"] },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      handoffs: [
        { _id: "h4n8d0f2f9i3d1x7", leadId: "jd7x8k2m9n4p5q1r", status: "pending", reason: "Customer requested human support", _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|h4n8d0f2f9i3d1x7",
      hasMore: false,
    },
  },
  {
    id: "pending-handoffs",
    method: "GET",
    path: "/api/v1/handoffs/pending",
    category: "Handoffs",
    title: "Pending Handoffs",
    description: "Lists only handoffs with pending status.",
    params: [],
    responseExample: {
      handoffs: [
        { _id: "h4n8d0f2f9i3d1x7", leadId: "jd7x8k2m9n4p5q1r", status: "pending", reason: "Complex negotiation", _creationTime: 1739620800000 },
      ],
    },
  },
  {
    id: "accept-handoff",
    method: "POST",
    path: "/api/v1/handoffs/accept",
    category: "Handoffs",
    title: "Accept Handoff",
    description: "Accepts a pending handoff.",
    params: [
      { name: "handoffId", type: "string", required: true, location: "body", description: "Handoff ID" },
      { name: "notes", type: "string", required: false, location: "body", description: "Acceptance notes" },
    ],
    responseExample: { success: true },
  },
  {
    id: "reject-handoff",
    method: "POST",
    path: "/api/v1/handoffs/reject",
    category: "Handoffs",
    title: "Reject Handoff",
    description: "Rejects a pending handoff.",
    params: [
      { name: "handoffId", type: "string", required: true, location: "body", description: "Handoff ID" },
      { name: "notes", type: "string", required: false, location: "body", description: "Rejection reason" },
    ],
    responseExample: { success: true },
  },

  // ---- Pipeline / Reference ----
  {
    id: "list-boards",
    method: "GET",
    path: "/api/v1/boards",
    category: "Pipeline",
    title: "List Boards",
    description: "Lists boards (pipelines) with their stages.",
    params: [],
    responseExample: {
      boards: [
        {
          _id: "kn8y3b7w2x5z8a4c",
          name: "Sales Pipeline",
          isDefault: true,
          stages: [
            { _id: "m2a4...", name: "New", order: 0 },
            { _id: "n5b8...", name: "Qualified", order: 1 },
            { _id: "p7c2...", name: "Proposal", order: 2 },
            { _id: "q9d4...", name: "Closed", order: 3 },
          ],
        },
      ],
    },
  },
  {
    id: "list-team-members",
    method: "GET",
    path: "/api/v1/team-members",
    category: "Pipeline",
    title: "List Team Members",
    description: "Lists all team members (humans and AI).",
    params: [],
    responseExample: {
      members: [
        { _id: "t2m5k8j3n7p1q4w9", name: "Ana Costa", type: "human", role: "admin", status: "active" },
        { _id: "t3m6k9j4n8p2q5w0", name: "AI Agent", type: "ai", role: "member", status: "active" },
      ],
    },
  },
  {
    id: "list-field-definitions",
    method: "GET",
    path: "/api/v1/field-definitions",
    category: "Pipeline",
    title: "List Custom Fields",
    description: "Lists custom field definitions.",
    params: [],
    responseExample: {
      fields: [
        { _id: "f1d3k5j7n9p1q3w5", name: "receita_anual", label: "Annual Revenue", type: "number", entityType: "lead" },
      ],
    },
  },

  // ---- Activities ----
  {
    id: "list-activities",
    method: "GET",
    path: "/api/v1/activities",
    category: "Activities",
    title: "List Activities",
    description: "Lists activities for a lead.",
    params: [
      { name: "leadId", type: "string", required: true, location: "query", description: "Lead ID" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 200)", default: "50" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      activities: [
        { _id: "a1c3t5v7y9b1d3f5", leadId: "jd7x8k2m9n4p5q1r", type: "note", content: "Call completed", _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|a1c3t5v7y9b1d3f5",
      hasMore: false,
    },
  },
  {
    id: "create-activity",
    method: "POST",
    path: "/api/v1/activities",
    category: "Activities",
    title: "Create Activity",
    description: "Creates an activity on a lead.",
    params: [
      { name: "leadId", type: "string", required: true, location: "body", description: "Lead ID" },
      { name: "type", type: "string", required: true, location: "body", description: "Activity type", enumValues: ["note", "call", "email", "meeting", "task"] },
      { name: "content", type: "string", required: false, location: "body", description: "Activity content" },
      { name: "metadata", type: "object", required: false, location: "body", description: "Additional metadata" },
    ],
    responseExample: { success: true, activityId: "a1c3t5v7y9b1d3f5" },
  },

  // ---- Tasks ----
  {
    id: "list-tasks",
    method: "GET",
    path: "/api/v1/tasks",
    category: "Tasks",
    title: "List Tasks",
    description: "Lists tasks with optional filters by status, priority, assignee, lead, and type.",
    params: [
      { name: "status", type: "string", required: false, location: "query", description: "Filter by status", enumValues: ["pending", "in_progress", "completed", "cancelled"] },
      { name: "priority", type: "string", required: false, location: "query", description: "Filter by priority", enumValues: ["low", "medium", "high", "urgent"] },
      { name: "assignedTo", type: "string", required: false, location: "query", description: "Filter by assignee" },
      { name: "leadId", type: "string", required: false, location: "query", description: "Filter by lead" },
      { name: "contactId", type: "string", required: false, location: "query", description: "Filter by contact" },
      { name: "type", type: "string", required: false, location: "query", description: "Filter by type", enumValues: ["task", "reminder"] },
      { name: "activityType", type: "string", required: false, location: "query", description: "Filter by activity type", enumValues: ["todo", "call", "email", "follow_up", "meeting", "research"] },
      { name: "dueBefore", type: "number", required: false, location: "query", description: "Due date before (timestamp ms)" },
      { name: "dueAfter", type: "number", required: false, location: "query", description: "Due date after (timestamp ms)" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      tasks: [
        { _id: "tk1a2b3c4d5e6f7g", title: "Call customer", type: "task", status: "pending", priority: "high", activityType: "call", dueDate: 1739620800000, assignedTo: "t2m5k8j3n7p1q4w9", leadId: "jd7x8k2m9n4p5q1r", _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|tk1a2b3c4d5e6f7g",
      hasMore: false,
    },
  },
  {
    id: "get-task",
    method: "GET",
    path: "/api/v1/tasks/get",
    category: "Tasks",
    title: "Task Details",
    description: "Returns full task details by ID.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "Task ID" },
    ],
    responseExample: {
      task: { _id: "tk1a2b3c4d5e6f7g", title: "Call customer", type: "task", status: "pending", priority: "high", activityType: "call", dueDate: 1739620800000, assignedTo: "t2m5k8j3n7p1q4w9", leadId: "jd7x8k2m9n4p5q1r", checklist: [{ id: "c1", title: "Prepare agenda", completed: true }], _creationTime: 1739620800000 },
    },
  },
  {
    id: "my-tasks",
    method: "GET",
    path: "/api/v1/tasks/my",
    category: "Tasks",
    title: "Minhas Tasks",
    description: "Returns pending and in-progress tasks for the authenticated agent.",
    params: [],
    responseExample: {
      tasks: [
        { _id: "tk1a2b3c4d5e6f7g", title: "Follow-up with lead", type: "task", status: "pending", priority: "medium", activityType: "follow_up", dueDate: 1739620800000, _creationTime: 1739620800000 },
      ],
    },
  },
  {
    id: "overdue-tasks",
    method: "GET",
    path: "/api/v1/tasks/overdue",
    category: "Tasks",
    title: "Overdue Tasks",
    description: "Lists tasks overdue with pending or in-progress status.",
    params: [
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      tasks: [
        { _id: "tk1a2b3c4d5e6f7g", title: "Send proposta", type: "task", status: "pending", priority: "urgent", dueDate: 1739534400000, _creationTime: 1739448000000 },
      ],
      nextCursor: "1739534400000|tk1a2b3c4d5e6f7g",
      hasMore: false,
    },
  },
  {
    id: "search-tasks",
    method: "GET",
    path: "/api/v1/tasks/search",
    category: "Tasks",
    title: "Search Tasks",
    description: "Search tasks by text (title, description).",
    params: [
      { name: "q", type: "string", required: true, location: "query", description: "Search text" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 100)", default: "50" },
    ],
    responseExample: {
      tasks: [
        { _id: "tk1a2b3c4d5e6f7g", title: "Research competitors", type: "task", status: "in_progress", priority: "medium", activityType: "research", _creationTime: 1739620800000 },
      ],
    },
  },
  {
    id: "create-task",
    method: "POST",
    path: "/api/v1/tasks/create",
    category: "Tasks",
    title: "Create Task",
    description: "Creates a new task or reminder.",
    params: [
      { name: "title", type: "string", required: true, location: "body", description: "Task title" },
      { name: "type", type: "string", required: false, location: "body", description: "Type", enumValues: ["task", "reminder"], default: "task" },
      { name: "priority", type: "string", required: false, location: "body", description: "Priority", enumValues: ["low", "medium", "high", "urgent"], default: "medium" },
      { name: "activityType", type: "string", required: false, location: "body", description: "CRM activity type", enumValues: ["todo", "call", "email", "follow_up", "meeting", "research"] },
      { name: "description", type: "string", required: false, location: "body", description: "Detailed description" },
      { name: "dueDate", type: "number", required: false, location: "body", description: "Due date (timestamp ms)" },
      { name: "leadId", type: "string", required: false, location: "body", description: "Associated lead ID" },
      { name: "contactId", type: "string", required: false, location: "body", description: "Associated contact ID" },
      { name: "assignedTo", type: "string", required: false, location: "body", description: "Assignee member ID" },
      { name: "recurrence", type: "object", required: false, location: "body", description: "Recurrence", nested: [
        { name: "pattern", type: "string", required: true, location: "body", description: "Pattern", enumValues: ["daily", "weekly", "biweekly", "monthly"] },
        { name: "endDate", type: "number", required: false, location: "body", description: "End date (timestamp ms)" },
      ]},
      { name: "checklist", type: "array", required: false, location: "body", description: "Checklist items" },
      { name: "tags", type: "array", required: false, location: "body", description: "Tags" },
    ],
    responseExample: { success: true, taskId: "tk1a2b3c4d5e6f7g" },
  },
  {
    id: "update-task",
    method: "POST",
    path: "/api/v1/tasks/update",
    category: "Tasks",
    title: "Update Task",
    description: "Updates fields on an existing task.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
      { name: "title", type: "string", required: false, location: "body", description: "New title" },
      { name: "description", type: "string", required: false, location: "body", description: "New description" },
      { name: "priority", type: "string", required: false, location: "body", description: "New priority", enumValues: ["low", "medium", "high", "urgent"] },
      { name: "activityType", type: "string", required: false, location: "body", description: "New activity type", enumValues: ["todo", "call", "email", "follow_up", "meeting", "research"] },
      { name: "dueDate", type: "number", required: false, location: "body", description: "New due date (timestamp ms)" },
      { name: "tags", type: "array", required: false, location: "body", description: "New tags" },
    ],
    responseExample: { success: true },
  },
  {
    id: "complete-task",
    method: "POST",
    path: "/api/v1/tasks/complete",
    category: "Tasks",
    title: "Complete Task",
    description: "Marks a task as completed.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
    ],
    responseExample: { success: true },
  },
  {
    id: "delete-task",
    method: "POST",
    path: "/api/v1/tasks/delete",
    category: "Tasks",
    title: "Delete Task",
    description: "Permanently deletes a task.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
    ],
    responseExample: { success: true },
  },
  {
    id: "assign-task",
    method: "POST",
    path: "/api/v1/tasks/assign",
    category: "Tasks",
    title: "Assign Task",
    description: "Assigns or unassigns a task to a team member.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
      { name: "assignedTo", type: "string", required: false, location: "body", description: "Member ID (omit to unassign)" },
    ],
    responseExample: { success: true },
  },
  {
    id: "snooze-task",
    method: "POST",
    path: "/api/v1/tasks/snooze",
    category: "Tasks",
    title: "Set Reminder",
    description: "Sets a reminder for a task.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
      { name: "snoozedUntil", type: "number", required: true, location: "body", description: "Reminder datetime (timestamp ms)" },
    ],
    responseExample: { success: true },
  },
  {
    id: "bulk-tasks",
    method: "POST",
    path: "/api/v1/tasks/bulk",
    category: "Tasks",
    title: "Bulk Operations",
    description: "Executes bulk operations on multiple tasks (complete, delete, assign).",
    params: [
      { name: "taskIds", type: "array", required: true, location: "body", description: "Task IDs" },
      { name: "action", type: "string", required: true, location: "body", description: "Action to execute", enumValues: ["complete", "delete", "assign"] },
      { name: "assignedTo", type: "string", required: false, location: "body", description: "Member ID (only for assign action)" },
    ],
    responseExample: { success: true },
  },
  {
    id: "list-task-comments",
    method: "GET",
    path: "/api/v1/tasks/comments",
    category: "Tasks",
    title: "List Comentarios",
    description: "Lists comments for a task.",
    params: [
      { name: "taskId", type: "string", required: true, location: "query", description: "Task ID" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 500)", default: "200" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
    ],
    responseExample: {
      comments: [
        { _id: "tc1a2b3c4d5e6f7g", taskId: "tk1a2b3c4d5e6f7g", authorId: "t2m5k8j3n7p1q4w9", authorType: "human", content: "Call made, customer requested follow-up Thursday.", _creationTime: 1739620800000 },
      ],
      nextCursor: "1739620800000|tc1a2b3c4d5e6f7g",
      hasMore: false,
    },
  },
  {
    id: "add-task-comment",
    method: "POST",
    path: "/api/v1/tasks/comments/add",
    category: "Tasks",
    title: "Add Comment",
    description: "Adds a comment to a task.",
    params: [
      { name: "taskId", type: "string", required: true, location: "body", description: "Task ID" },
      { name: "content", type: "string", required: true, location: "body", description: "Comment content" },
      { name: "mentionedUserIds", type: "array", required: false, location: "body", description: "Mentioned member IDs" },
    ],
    responseExample: { success: true, commentId: "tc1a2b3c4d5e6f7g" },
  },

  // ---- Files ----
  {
    id: "generate-upload-url",
    method: "POST",
    path: "/api/v1/files/upload-url",
    category: "Files",
    title: "Generate Upload URL",
    description: "Generates a presigned URL for direct file upload to Convex Storage.",
    params: [],
    responseExample: { uploadUrl: "https://convex-storage.s3.amazonaws.com/..." },
  },
  {
    id: "save-file",
    method: "POST",
    path: "/api/v1/files",
    category: "Files",
    title: "Save File Metadata",
    description: "Saves file metadata after upload. Validates MIME type, size, and quotas.",
    params: [
      { name: "storageId", type: "string", required: true, location: "body", description: "Storage ID returned by upload" },
      { name: "name", type: "string", required: true, location: "body", description: "File name" },
      { name: "mimeType", type: "string", required: true, location: "body", description: "MIME type (e.g. image/jpeg, application/pdf)" },
      { name: "size", type: "number", required: true, location: "body", description: "Tamanho em bytes" },
      { name: "fileType", type: "string", required: true, location: "body", description: "File type", enumValues: ["message_attachment", "contact_photo", "member_avatar", "lead_document", "import_file", "other"] },
      { name: "messageId", type: "string", required: false, location: "body", description: "Message ID (for attachments)" },
      { name: "contactId", type: "string", required: false, location: "body", description: "Contact ID (for photos)" },
      { name: "leadId", type: "string", required: false, location: "body", description: "Lead ID (for documents)" },
      { name: "metadata", type: "object", required: false, location: "body", description: "Additional metadata" },
    ],
    responseExample: { success: true, fileId: "f1l3s2t4r5a6g7e8" },
  },
  {
    id: "get-file-url",
    method: "GET",
    path: "/api/v1/files/:id/url",
    category: "Files",
    title: "Get Download URL",
    description: "Returns a download URL for a file. URL expires after a few minutes.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "File ID" },
    ],
    responseExample: { url: "https://convex-storage.s3.amazonaws.com/download/..." },
  },
  {
    id: "delete-file",
    method: "DELETE",
    path: "/api/v1/files/:id",
    category: "Files",
    title: "Delete File",
    description: "Permanently deletes file and metadata from storage.",
    params: [
      { name: "id", type: "string", required: true, location: "query", description: "File ID" },
    ],
    responseExample: { success: true },
  },

  // ---- Dashboard ----
  {
    id: "dashboard",
    method: "GET",
    path: "/api/v1/dashboard",
    category: "Dashboard",
    title: "Dashboard Analytics",
    description: "Returns dashboard metrics and KPIs.",
    params: [],
    responseExample: {
      totalLeads: 142,
      leadsThisMonth: 28,
      conversionRate: 0.23,
      totalValue: 450000,
      leadsByStage: { New: 45, Qualified: 32, Proposal: 18, Closed: 12 },
      tasks: { total: 24, byStatus: { pending: 10, in_progress: 5, completed: 8, cancelled: 1 } },
    },
  },

  // ---- Lead Sources ----
  {
    id: "list-lead-sources",
    method: "GET",
    path: "/api/v1/lead-sources",
    category: "Sources",
    title: "List Sources de Lead",
    description: "Lists all configured lead sources.",
    params: [],
    responseExample: {
      sources: [
        { _id: "s1r3c5e7g9i1k3m5", name: "Website", type: "organic", isActive: true },
        { _id: "s2r4c6e8g0i2k4m6", name: "Google Ads", type: "paid", isActive: true },
      ],
    },
  },

  // ---- Audit Logs ----
  {
    id: "list-audit-logs",
    method: "GET",
    path: "/api/v1/audit-logs",
    category: "Audit",
    title: "List Logs de Audit",
    description: "Lists audit logs with advanced filters and cursor pagination.",
    params: [
      { name: "entityType", type: "string", required: false, location: "query", description: "Entity type" },
      { name: "action", type: "string", required: false, location: "query", description: "Action type", enumValues: ["create", "update", "delete", "stage_change", "assign", "handoff_request", "handoff_accept", "handoff_reject"] },
      { name: "severity", type: "string", required: false, location: "query", description: "Severity", enumValues: ["low", "medium", "high", "critical"] },
      { name: "actorId", type: "string", required: false, location: "query", description: "Actor ID" },
      { name: "startDate", type: "number", required: false, location: "query", description: "Start date (timestamp ms)" },
      { name: "endDate", type: "number", required: false, location: "query", description: "End date (timestamp ms)" },
      { name: "cursor", type: "string", required: false, location: "query", description: "Pagination cursor" },
      { name: "limit", type: "number", required: false, location: "query", description: "Result limit (max 200)" },
    ],
    responseExample: {
      logs: [
        { _id: "al1g3k5m7o9q1s3u", entityType: "lead", action: "create", severity: "low", description: "Lead created: New lead", _creationTime: 1739620800000 },
      ],
      nextCursor: "eyJ...",
      hasMore: true,
    },
  },
];

export function getEndpoint(id: string): ApiEndpoint | undefined {
  return ALL_ENDPOINTS.find((e) => e.id === id);
}

export function getEndpointsByCategory(category: string): ApiEndpoint[] {
  return ALL_ENDPOINTS.filter((e) => e.category === category);
}
