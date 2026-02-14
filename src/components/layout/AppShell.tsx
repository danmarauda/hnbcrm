import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomTabBar } from "./BottomTabBar";
import type { Tab } from "./BottomTabBar";

interface AppShellProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSignOut: () => void;
  orgSelector?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ activeTab, onTabChange, onSignOut, orgSelector, children }: AppShellProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Desktop sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        onSignOut={onSignOut}
        orgSelector={orgSelector}
      />

      {/* Main content area */}
      <main className="md:ml-16 lg:ml-56 transition-all duration-200">
        <div className="min-h-screen pb-20 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabChange={onTabChange}
        showMore={showMore}
        onToggleMore={() => setShowMore(!showMore)}
      />
    </div>
  );
}
