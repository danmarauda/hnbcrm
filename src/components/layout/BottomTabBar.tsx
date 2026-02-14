import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Kanban,
  Contact2,
  MessageSquare,
  ArrowRightLeft,
  MoreHorizontal,
} from "lucide-react";

export type Tab = "dashboard" | "board" | "contacts" | "inbox" | "handoffs" | "team" | "audit" | "settings";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "board", label: "Pipeline", icon: Kanban },
  { id: "contacts", label: "Contatos", icon: Contact2 },
  { id: "inbox", label: "Entrada", icon: MessageSquare },
  { id: "handoffs", label: "Repasses", icon: ArrowRightLeft },
];

interface BottomTabBarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  showMore: boolean;
  onToggleMore: () => void;
}

export function BottomTabBar({ activeTab, onTabChange, showMore, onToggleMore }: BottomTabBarProps) {
  const isMoreActive = activeTab === "team" || activeTab === "audit" || activeTab === "settings";

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40" onClick={onToggleMore} aria-hidden="true" />
      )}

      {/* More menu popup */}
      {showMore && (
        <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom,0px))] right-2 z-50 bg-surface-overlay border border-border rounded-xl shadow-elevated animate-fade-in-up p-1 min-w-[160px]">
          <button
            onClick={() => { onTabChange("team"); onToggleMore(); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
              activeTab === "team" ? "text-brand-500 bg-brand-500/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
            )}
          >
            Equipe
          </button>
          <button
            onClick={() => { onTabChange("audit"); onToggleMore(); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
              activeTab === "audit" ? "text-brand-500 bg-brand-500/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
            )}
          >
            Auditoria
          </button>
          <button
            onClick={() => { onTabChange("settings"); onToggleMore(); }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
              activeTab === "settings" ? "text-brand-500 bg-brand-500/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
            )}
          >
            Configurações
          </button>
        </div>
      )}

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-surface-raised border-t border-border pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors",
                  isActive ? "text-brand-500" : "text-text-muted"
                )}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={20} />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={onToggleMore}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-colors",
              isMoreActive ? "text-brand-500" : "text-text-muted"
            )}
            aria-label="Mais opções"
          >
            <MoreHorizontal size={20} />
            <span className="text-[11px] font-medium">Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}
