import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/usePermissions";
import { Id } from "../../../convex/_generated/dataModel";
import type { PermissionCategory } from "../../../convex/lib/permissions";
import {
  LayoutDashboard,
  Kanban,
  Contact2,
  MessageSquare,
  CheckSquare,
  CalendarDays,
  ArrowRightLeft,
  Users,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";
import type { Tab } from "./BottomTabBar";
import { TAB_ROUTES, PATH_TO_TAB } from "@/lib/routes";

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
  permission?: { category: PermissionCategory; level: string };
}

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "board", label: "Pipeline", icon: Kanban, permission: { category: "leads", level: "view_own" } },
  { id: "contacts", label: "Contacts", icon: Contact2, permission: { category: "contacts", level: "view" } },
  { id: "inbox", label: "Inbox", icon: MessageSquare, permission: { category: "inbox", level: "view_own" } },
  { id: "handoffs", label: "Handoffs", icon: ArrowRightLeft, permission: { category: "inbox", level: "view_own" } },
  { id: "tasks", label: "Tasks", icon: CheckSquare, permission: { category: "tasks", level: "view_own" } },
  { id: "calendar", label: "Calendar", icon: CalendarDays, permission: { category: "tasks", level: "view_own" } },
  { id: "team", label: "Team", icon: Users, permission: { category: "team", level: "view" } },
  { id: "audit", label: "Audit", icon: ScrollText, permission: { category: "auditLogs", level: "view" } },
  { id: "settings", label: "Settings", icon: Settings, permission: { category: "settings", level: "view" } },
];

interface SidebarProps {
  onSignOut: () => void;
  organizationId: Id<"organizations">;
  orgSelector?: React.ReactNode;
}

export function Sidebar({ onSignOut, organizationId, orgSelector }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = PATH_TO_TAB[location.pathname];
  const { can } = usePermissions(organizationId);

  const visibleItems = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.permission) return true;
      return can(item.permission.category, item.permission.level);
    });
  }, [can]);

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-20 flex-col glass glass-lg border-r border-glass-border w-16 lg:w-56 transition-all duration-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-glass-border shrink-0">
        <img src="/orange_icon_logo_transparent-bg-528x488.png" alt="HNBCRM" className="h-8 w-8 object-contain shrink-0" />
        <span className="hidden lg:block text-lg font-bold text-text-primary tracking-tight font-display">HNBCRM</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto glass-scrollbar">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => navigate(TAB_ROUTES[item.id])}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "min-h-[44px] relative overflow-hidden",
                isActive
                  ? "bg-white/5 text-white border border-white/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent hover:border-glass-border"
              )}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
            >
              {isActive && <motion.div layoutId="sidebar-active-glow" className="absolute inset-0 bg-white/[0.02] rounded-lg" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
              <Icon size={20} className="shrink-0 relative z-10" />
              <span className="hidden lg:block truncate relative z-10">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-glass-border p-2 space-y-1 shrink-0">
        {orgSelector && <div className="px-1 py-2">{orgSelector}</div>}
        <motion.button
          onClick={onSignOut}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-semantic-error hover:bg-semantic-error/5 border border-transparent hover:border-semantic-error/20 transition-all duration-200 min-h-[44px]"
          title="Sign Out"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="hidden lg:block">Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}
