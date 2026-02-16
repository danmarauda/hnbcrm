import type { Tab } from "@/components/layout/BottomTabBar";

export const TAB_ROUTES: Record<Tab, string> = {
  dashboard: "/app/painel",
  board: "/app/pipeline",
  contacts: "/app/contatos",
  inbox: "/app/entrada",
  tasks: "/app/tarefas",
  handoffs: "/app/repasses",
  team: "/app/equipe",
  audit: "/app/auditoria",
  settings: "/app/configuracoes",
};

export const PATH_TO_TAB: Record<string, Tab> = Object.fromEntries(
  Object.entries(TAB_ROUTES).map(([tab, path]) => [path, tab as Tab])
) as Record<string, Tab>;
