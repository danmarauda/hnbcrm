import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { SignInForm } from "./SignInForm";
import { Toaster } from "sonner";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { OrganizationSelector } from "./components/OrganizationSelector";
import { AppShell } from "./components/layout/AppShell";
import { Spinner } from "./components/ui/Spinner";
import type { Tab } from "./components/layout/BottomTabBar";

export default function App() {
  const [selectedOrgId, setSelectedOrgId] = useState<Id<"organizations"> | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-surface-base">
      <Authenticated>
        <AppShell
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSignOut={() => signOut()}
          orgSelector={
            <OrganizationSelector
              selectedOrgId={selectedOrgId}
              onSelectOrg={setSelectedOrgId}
            />
          }
        >
          <Content selectedOrgId={selectedOrgId} activeTab={activeTab} onTabChange={setActiveTab} />
        </AppShell>
      </Authenticated>

      <Unauthenticated>
        <AuthScreen />
      </Unauthenticated>

      <Toaster theme="dark" />
    </div>
  );
}

function Content({
  selectedOrgId,
  activeTab,
  onTabChange
}: {
  selectedOrgId: Id<"organizations"> | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedOrgId) {
    return <WelcomeScreen />;
  }

  return (
    <Dashboard
      organizationId={selectedOrgId}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

function WelcomeScreen() {
  return (
    <div className="flex items-center justify-center h-screen px-4">
      <div className="text-center max-w-md">
        <img
          src="/orange_icon_logo_transparent-bg-528x488.png"
          alt="HNBCRM"
          className="h-20 w-20 mx-auto mb-6 animate-fade-in-up"
        />
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 animate-fade-in-up">
          Bem-vindo ao HNBCRM
        </h1>
        <p className="text-text-secondary text-base md:text-lg animate-fade-in-up">
          Selecione uma organização para começar
        </p>
      </div>
    </div>
  );
}

function AuthScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-b from-surface-overlay to-surface-base">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <img
            src="/orange_icon_logo_transparent-bg-528x488.png"
            alt="HNBCRM"
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
            HNBCRM
          </h1>
          <p className="text-lg md:text-xl text-text-secondary">
            CRM multi-tenant com colaboração humano-IA
          </p>
        </div>
        <div className="animate-fade-in-up">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
