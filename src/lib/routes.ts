import type { Tab } from "@/components/layout/BottomTabBar";

export const TAB_ROUTES: Record<Tab, string> = {
  dashboard: "/app/dashboard",
  board: "/app/pipeline",
  contacts: "/app/contacts",
  inbox: "/app/inbox",
  tasks: "/app/tasks",
  calendar: "/app/calendar",
  handoffs: "/app/handoffs",
  team: "/app/team",
  audit: "/app/audit",
  settings: "/app/settings",
};

export const PATH_TO_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_ROUTES).map(([tab, path]) => [path, tab as Tab])
) as Record<string, Tab>;
