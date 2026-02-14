import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DashboardOverview } from "./DashboardOverview";
import { KanbanBoard } from "./KanbanBoard";
import { Inbox } from "./Inbox";
import { HandoffQueue } from "./HandoffQueue";
import { TeamPage } from "./TeamPage";
import { Settings } from "./Settings";
import { AuditLogs } from "./AuditLogs";
import { ErrorBoundary } from "./ErrorBoundary";
import { Spinner } from "./ui/Spinner";
import type { Tab } from "./layout/BottomTabBar";

interface DashboardProps {
  organizationId: Id<"organizations">;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Dashboard({ organizationId, activeTab, onTabChange }: DashboardProps) {
  const currentMember = useQuery(api.teamMembers.getCurrentTeamMember, {
    organizationId
  });

  if (!currentMember) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-base">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="h-full p-4 md:p-6 overflow-y-auto">
        {activeTab === "dashboard" && (
          <ErrorBoundary>
            <DashboardOverview organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "board" && (
          <ErrorBoundary>
            <KanbanBoard organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "inbox" && (
          <ErrorBoundary>
            <Inbox organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "handoffs" && (
          <ErrorBoundary>
            <HandoffQueue organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "team" && (
          <ErrorBoundary>
            <TeamPage organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "audit" && (
          <ErrorBoundary>
            <AuditLogs organizationId={organizationId} />
          </ErrorBoundary>
        )}
        {activeTab === "settings" && (
          <ErrorBoundary>
            <Settings organizationId={organizationId} />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}
