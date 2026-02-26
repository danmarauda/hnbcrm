import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
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
  MoreHorizontal,
} from "lucide-react";
import { TAB_ROUTES, PATH_TO_TAB } from "@/lib/routes";

export type Tab = "dashboard" | "board" | "contacts" | "inbox" | "tasks" | "calendar" | "handoffs" | "team" | "audit" | "settings";

interface NavItem {
  id: Tab;
  label: string;
  icon: React.ElementType;
  permission?: { category: PermissionCategory; level: string };
}

const primaryTabs: NavItem[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "board", label: "Pipeline", icon: Kanban, permission: { category: "leads", level: "view_own" } },
  { id: "calendar", label: "Calendar", icon: CalendarDays, permission: { category: "tasks", level: "view_own" } },
  { id: "inbox", label: "Inbox", icon: MessageSquare, permission: { category: "inbox", level: "view_own" } },
  { id: "tasks", label: "Tasks", icon: CheckSquare, permission: { category: "tasks", level: "view_own" } },
];

const moreTabs: NavItem[] = [
  { id: "contacts", label: "Contacts", icon: Contact2, permission: { category: "contacts", level: "view" } },
  { id: "handoffs", label: "Handoffs", icon: ArrowRightLeft, permission: { category: "inbox", level: "view_own" } },
  { id: "team", label: "Team", icon: Users, permission: { category: "team", level: "view" } },
  { id: "audit", label: "Audit", icon: ScrollText, permission: { category: "auditLogs", level: "view" } },
  { id: "settings", label: "Settings", icon: Settings, permission: { category: "settings", level: "view" } },
];

interface BottomTabBarProps {
  organizationId: Id<"organizations">;
  showMore: boolean;
  onToggleMore: () => void;
}

export function BottomTabBar({ organizationId, showMore, onToggleMore }: BottomTabBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = PATH_TO_TAB[location.pathname];
  const { can } = usePermissions(organizationId);

  const visiblePrimary = useMemo(() => primaryTabs.filter((t) => !t.permission || can(t.permission.category, t.permission.level)), [can]);
  const visibleMore = useMemo(() => moreTabs.filter((t) => !t.permission || can(t.permission.category, t.permission.level)), [can]);
  const moreTabIds = useMemo(() => new Set(visibleMore.map((t) => t.id)), [visibleMore]);
  const isMoreActive = moreTabIds.has(activeTab as Tab);

  return (
    <>
      <AnimatePresence>{showMore && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={onToggleMore} aria-hidden="true" />}</AnimatePresence>

      <AnimatePresence>
        {showMore && visibleMore.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-[calc(64px+env(safe-area-inset-bottom,0px))] right-2 z-50 glass glass-lg rounded-xl border border-glass-border p-1 min-w-[160px]"
          >
            {visibleMore.map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => { navigate(TAB_ROUTES[tab.id]); onToggleMore(); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  activeTab === tab.id ? "text-white bg-white/5 border border-white/10" : "text-text-secondary hover:text-text-primary hover:bg-white/[0.03] border border-transparent"
                )}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden glass border-t border-glass-border pb-safe">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-around h-16">
          {visiblePrimary.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => navigate(TAB_ROUTES[tab.id])}
                whileTap={{ scale: 0.9 }}
                className={cn("flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-all duration-200 relative", isActive ? "text-white" : "text-text-muted")}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && <motion.div layoutId="tab-active-bg" className="absolute inset-0 bg-white/5 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                <Icon size={20} className="relative z-10" />
                <span className="text-[11px] font-medium relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}

          {visibleMore.length > 0 && (
            <motion.button onClick={onToggleMore} whileTap={{ scale: 0.9 }} className={cn("flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] transition-all duration-200 relative", isMoreActive ? "text-white" : "text-text-muted")} aria-label="More options">
              {isMoreActive && <motion.div layoutId="tab-active-bg-more" className="absolute inset-0 bg-white/5 rounded-lg" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
              <MoreHorizontal size={20} className="relative z-10" />
              <span className="text-[11px] font-medium relative z-10">More</span>
            </motion.button>
          )}
        </div>
      </nav>
    </>
  );
}
