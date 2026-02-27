export interface IndustryTemplate {
  key: string;
  label: string;
  icon: string;
  boardName: string;
  boardColor: string;
  stages: {
    name: string;
    color: string;
    isClosedWon?: boolean;
    isClosedLost?: boolean;
  }[];
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    key: "real_estate",
    label: "Real Estate",
    icon: "Building2",
    boardName: "Real Estate Pipeline",
    boardColor: "#3B82F6",
    stages: [
      { name: "New Contact", color: "#3B82F6" },
      { name: "Visit Scheduled", color: "#8B5CF6" },
      { name: "Proposal Sent", color: "#F59E0B" },
      { name: "Documentation", color: "#06B6D4" },
      { name: "Contract Signed", color: "#10B981", isClosedWon: true },
      { name: "Withdrawn", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "ecommerce",
    label: "E-commerce",
    icon: "ShoppingCart",
    boardName: "Pipeline E-commerce",
    boardColor: "#EC4899",
    stages: [
      { name: "Lead Captured", color: "#3B82F6" },
      { name: "First Contact", color: "#8B5CF6" },
      { name: "Demo", color: "#F59E0B" },
      { name: "Negotiation", color: "#EC4899" },
      { name: "Closed Won", color: "#10B981", isClosedWon: true },
      { name: "Closed Lost", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "saas",
    label: "SaaS",
    icon: "Cloud",
    boardName: "Pipeline SaaS",
    boardColor: "#8B5CF6",
    stages: [
      { name: "MQL", color: "#06B6D4" },
      { name: "SQL", color: "#3B82F6" },
      { name: "Demo Scheduled", color: "#8B5CF6" },
      { name: "Proposal", color: "#F59E0B" },
      { name: "Negotiation", color: "#EC4899" },
      { name: "Won", color: "#10B981", isClosedWon: true },
      { name: "Lost", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "services",
    label: "Services",
    icon: "Wrench",
    boardName: "Services Pipeline",
    boardColor: "#F59E0B",
    stages: [
      { name: "Prospecting", color: "#3B82F6" },
      { name: "Qualification", color: "#8B5CF6" },
      { name: "Quote", color: "#F59E0B" },
      { name: "Approval", color: "#06B6D4" },
      { name: "Contract Signed", color: "#10B981", isClosedWon: true },
      { name: "Not Closed", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "education",
    label: "Education",
    icon: "GraduationCap",
    boardName: "Education Pipeline",
    boardColor: "#06B6D4",
    stages: [
      { name: "Interested", color: "#3B82F6" },
      { name: "Enrollment In Progress", color: "#8B5CF6" },
      { name: "Documents Sent", color: "#F59E0B" },
      { name: "Approved", color: "#06B6D4" },
      { name: "Enrolled", color: "#10B981", isClosedWon: true },
      { name: "Dropped Out", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    icon: "HeartPulse",
    boardName: "Healthcare Pipeline",
    boardColor: "#EF4444",
    stages: [
      { name: "First Contact", color: "#3B82F6" },
      { name: "Evaluation", color: "#8B5CF6" },
      { name: "Quote", color: "#F59E0B" },
      { name: "Treatment", color: "#EC4899" },
      { name: "Completed", color: "#10B981", isClosedWon: true },
      { name: "Cancelled", color: "#6B7280", isClosedLost: true },
    ],
  },
  {
    key: "finance",
    label: "Finance",
    icon: "Landmark",
    boardName: "Finance Pipeline",
    boardColor: "#10B981",
    stages: [
      { name: "Qualified Lead", color: "#3B82F6" },
      { name: "Profile Analysis", color: "#8B5CF6" },
      { name: "Proposal", color: "#F59E0B" },
      { name: "Approval", color: "#06B6D4" },
      { name: "Contrato", color: "#10B981", isClosedWon: true },
      { name: "Rejected", color: "#EF4444", isClosedLost: true },
    ],
  },
  {
    key: "other",
    label: "Other",
    icon: "MoreHorizontal",
    boardName: "Sales Pipeline",
    boardColor: "#3B82F6",
    stages: [
      { name: "New Lead", color: "#3B82F6" },
      { name: "Qualified", color: "#8B5CF6" },
      { name: "Proposal", color: "#F59E0B" },
      { name: "Negotiation", color: "#EC4899" },
      { name: "Closed Won", color: "#10B981", isClosedWon: true },
      { name: "Closed Lost", color: "#6B7280", isClosedLost: true },
    ],
  },
];

export const COMPANY_SIZES = [
  { key: "solo", label: "Solo" },
  { key: "2-5", label: "2-5" },
  { key: "6-20", label: "6-20" },
  { key: "21-50", label: "21-50" },
  { key: "50+", label: "50+" },
];

export const MAIN_GOALS = [
  { key: "sales", label: "Manage sales", icon: "TrendingUp" },
  { key: "contacts", label: "Organize contacts", icon: "Contact2" },
  { key: "support", label: "Automate support", icon: "Bot" },
  { key: "all", label: "All of it!", icon: "Sparkles" },
];

const LEGACY_INDUSTRY_KEY_MAP: Record<string, string> = {
  imobiliaria: "real_estate",
  servicos: "services",
  educacao: "education",
  saude: "healthcare",
  financeiro: "finance",
  outro: "other",
};

export const STAGE_COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#6B7280",
];

export function getTemplateByIndustry(industry: string): IndustryTemplate {
  const normalizedIndustry = LEGACY_INDUSTRY_KEY_MAP[industry] ?? industry;
  return (
    INDUSTRY_TEMPLATES.find((t) => t.key === normalizedIndustry) ||
    INDUSTRY_TEMPLATES[INDUSTRY_TEMPLATES.length - 1]
  );
}
