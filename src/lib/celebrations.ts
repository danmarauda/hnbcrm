export type MilestoneId =
  | "first_lead"
  | "first_contact"
  | "first_invite"
  | "first_webhook"
  | "custom_fields"
  | "wizard_complete"
  | "checklist_complete";

export interface MilestoneConfig {
  title: string;
  description: string;
}

export const MILESTONES: Record<MilestoneId, MilestoneConfig> = {
  first_lead: {
    title: "Primeiro Lead!",
    description: "You created your first lead in the CRM.",
  },
  first_contact: {
    title: "First Contact!",
    description: "Seu primeiro contact foi adicionado.",
  },
  first_invite: {
    title: "Team Crescendo!",
    description: "You invited your first team member.",
  },
  first_webhook: {
    title: "Integrado!",
    description: "Webhook or API key configured.",
  },
  custom_fields: {
    title: "Custom!",
    description: "Campos personalizados explorados.",
  },
  wizard_complete: {
    title: "All Pronto!",
    description: "Your CRM is configured and ready to use.",
  },
  checklist_complete: {
    title: "Missao Cumprida!",
    description: "All initial steps were completed!",
  },
};

export interface SpotlightConfig {
  id: string;
  title: string;
  description: string;
}

export const SPOTLIGHTS: SpotlightConfig[] = [
  {
    id: "board",
    title: "Pipeline Kanban",
    description:
      "Drag cards between stages to update your lead status.",
  },
  {
    id: "contacts",
    title: "Contacts",
    description:
      "Register and organize contacts. Use search by name, email, or company.",
  },
  {
    id: "inbox",
    title: "Inbox",
    description:
      "All conversations in one place — WhatsApp, email, and webchat.",
  },
  {
    id: "handoffs",
    title: "Handoffs",
    description:
      "When AI needs human help, handoffs appear here.",
  },
  {
    id: "team",
    title: "Team",
    description:
      "Manage humans and AI bots as one team.",
  },
];
