import { useState } from "react";
import { Navigate, Outlet, ScrollRestoration } from "react-router";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { AppShell } from "./AppShell";
import { OrganizationSelector } from "../OrganizationSelector";
import { Spinner } from "../ui/Spinner";
import { Modal } from "../ui/Modal";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Building2, Plus } from "lucide-react";
import { toast } from "sonner";
import { OnboardingWizard } from "../onboarding/OnboardingWizard";
import { ErrorBoundary } from "../ErrorBoundary";
import { ChangePasswordScreen } from "../team/ChangePasswordScreen";
import { useQuery, useMutation, skipToken } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";

export type AppOutletContext = {
  organizationId: Id<"organizations">;
};

export function AuthLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [selectedOrgId, setSelectedOrgId] = useState<Id<"organizations"> | null>(null);
  const [wizardDone, setWizardDone] = useState(false);
  const signOut = () => authClient.signOut();

  const crpc = useCRPC();
  const { data: loggedInUser } = useQuery(crpc.auth.loggedInUser.queryOptions(isAuthenticated ? undefined : skipToken));
  const { data: onboardingProgress } = useQuery(crpc.onboarding.getOnboardingProgress.queryOptions(selectedOrgId ? { organizationId: selectedOrgId } : skipToken));
  const { data: currentMember } = useQuery(crpc.teamMembers.getCurrentTeamMember.queryOptions(selectedOrgId ? { organizationId: selectedOrgId } : skipToken));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-base">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-base">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!selectedOrgId) {
    return <WelcomeScreen onSelectOrg={setSelectedOrgId} />;
  }

  // Show wizard for new orgs
  if (
    onboardingProgress !== undefined &&
    !wizardDone &&
    (onboardingProgress === null || onboardingProgress.wizardCompleted === false)
  ) {
    return (
      <OnboardingWizard
        organizationId={selectedOrgId}
        onComplete={() => setWizardDone(true)}
      />
    );
  }

  if (!currentMember) {
    return (
      <div className="flex justify-center items-center h-screen bg-surface-base">
        <Spinner size="lg" />
      </div>
    );
  }

  // Force password change gate
  if (currentMember.mustChangePassword) {
    return (
      <ChangePasswordScreen
        organizationId={selectedOrgId}
        onSuccess={() => {
          // The currentMember query will reactively update when mustChangePassword is cleared
        }}
      />
    );
  }

  return (
    <>
      <ScrollRestoration />
      <AppShell
        onSignOut={() => signOut()}
        organizationId={selectedOrgId}
        orgSelector={
          <OrganizationSelector
            selectedOrgId={selectedOrgId}
            onSelectOrg={setSelectedOrgId}
          />
        }
      >
        <ErrorBoundary>
          <Outlet context={{ organizationId: selectedOrgId } satisfies AppOutletContext} />
        </ErrorBoundary>
      </AppShell>
    </>
  );
}

function WelcomeScreen({ onSelectOrg }: { onSelectOrg: (orgId: Id<"organizations">) => void }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const crpc = useCRPC();

  const { data: organizations } = useQuery(crpc.organizations.getUserOrganizations.queryOptions());
  const { mutateAsync: createOrganization } = useMutation(crpc.organizations.createOrganization.mutationOptions());

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgSlug.trim()) return;

    setIsCreating(true);
    try {
      const orgId = await createOrganization({
        name: newOrgName,
        slug: newOrgSlug,
      });
      toast.success("Organization created!");
      setShowCreateModal(false);
      setNewOrgName("");
      setNewOrgSlug("");
      onSelectOrg(orgId);
    } catch {
      toast.error("Failed to create organization. The slug may already be in use.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <img
            src="/orange_icon_logo_transparent-bg-528x488.png"
            alt="HNBCRM"
            className="h-20 w-20 mx-auto mb-6 object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Welcome to HNBCRM
          </h1>
          <p className="text-text-secondary text-base md:text-lg">
            Select an organization to get started
          </p>
        </div>

        {organizations === undefined ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up">
            {organizations.filter(Boolean).map((org) => {
              if (!org) return null;
              return (
                <Card
                  key={org._id}
                  variant="interactive"
                  className="flex items-center gap-4"
                  onClick={() => onSelectOrg(org._id as Id<"organizations">)}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-500/10 shrink-0">
                    <Building2 size={20} className="text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {org.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {org.slug}
                    </p>
                  </div>
                  <Badge variant="brand">{org.role}</Badge>
                </Card>
              );
            })}

            <Card
              variant="interactive"
              className="flex items-center gap-4 border-dashed"
              onClick={() => setShowCreateModal(true)}
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-surface-overlay shrink-0">
                <Plus size={20} className="text-text-muted" />
              </div>
              <p className="text-sm font-medium text-text-secondary">
                Create Organization
              </p>
            </Card>
          </div>
        )}

        <Modal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Organization"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Organization Name"
              placeholder="My Company"
              value={newOrgName}
              onChange={(e) => {
                setNewOrgName(e.target.value);
                setNewOrgSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-|-$/g, "")
                );
              }}
              required
            />
            <Input
              label="Slug (URL identifier)"
              placeholder="minha-empresa"
              value={newOrgSlug}
              onChange={(e) => setNewOrgSlug(e.target.value)}
              required
            />
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !newOrgName.trim() || !newOrgSlug.trim()}
                className="flex-1"
              >
                {isCreating ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
