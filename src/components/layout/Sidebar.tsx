import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Kanban,
  MessageSquare,
  ArrowRightLeft,
  Users,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";
import type { Tab } from "./BottomTabBar";

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "board", label: "Pipeline", icon: Kanban },
  { id: "inbox", label: "Caixa de Entrada", icon: MessageSquare },
  { id: "handoffs", label: "Repasses", icon: ArrowRightLeft },
  { id: "team", label: "Equipe", icon: Users },
  { id: "audit", label: "Auditoria", icon: ScrollText },
  { id: "settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSignOut: () => void;
  orgSelector?: React.ReactNode;
}

export function Sidebar({ activeTab, onTabChange, onSignOut, orgSelector }: SidebarProps) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-20 flex-col bg-surface-raised border-r border-border w-16 lg:w-56 transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <img
          src="/orange_icon_logo_transparent-bg-528x488.png"
          alt="HNBCRM"
          className="h-8 w-8 object-contain shrink-0"
        />
        <span className="hidden lg:block text-lg font-bold text-text-primary tracking-tight">
          HNBCRM
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "min-h-[44px]",
                isActive
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-overlay"
              )}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              <Icon size={20} className="shrink-0" />
              <span className="hidden lg:block truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-border p-2 space-y-1 shrink-0">
        {orgSelector && (
          <div className="px-1 py-2">
            {orgSelector}
          </div>
        )}
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-semantic-error hover:bg-semantic-error/10 transition-colors min-h-[44px]"
          title="Sair"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden lg:block">Sair</span>
        </button>
      </div>
    </aside>
  );
}
