import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { BottomTabBar } from "./BottomTabBar";

interface AppShellProps {
  onSignOut: () => void;
  orgSelector?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ onSignOut, orgSelector, children }: AppShellProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="min-h-screen bg-surface-base">
      {/* Desktop sidebar */}
      <Sidebar
        onSignOut={onSignOut}
        orgSelector={orgSelector}
      />

      {/* Main content area */}
      <main className="md:ml-16 lg:ml-56 transition-all duration-200">
        <div className="min-h-screen pb-20 md:pb-0">
          <div className="h-full p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomTabBar
        showMore={showMore}
        onToggleMore={() => setShowMore(!showMore)}
      />
    </div>
  );
}
