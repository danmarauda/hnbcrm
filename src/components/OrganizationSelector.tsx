import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface OrganizationSelectorProps {
  selectedOrgId: Id<"organizations"> | null;
  onSelectOrg: (orgId: Id<"organizations"> | null) => void;
}

export function OrganizationSelector({ selectedOrgId, onSelectOrg }: OrganizationSelectorProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgSlug, setNewOrgSlug] = useState("");

  const organizations = useQuery(api.organizations.getUserOrganizations);
  const createOrganization = useMutation(api.organizations.createOrganization);

  const selectedOrg = organizations?.find(org => org && org._id === selectedOrgId);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim() || !newOrgSlug.trim()) return;

    try {
      const orgId = await createOrganization({
        name: newOrgName,
        slug: newOrgSlug,
      });
      onSelectOrg(orgId);
      setNewOrgName("");
      setNewOrgSlug("");
      setShowCreateForm(false);
    } catch (error) {
      toast.error("Falha ao criar organização. O slug pode já estar em uso.");
    }
  };

  if (!organizations) {
    return (
      <div className="flex items-center justify-center p-2">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={selectedOrgId || ""}
        onChange={(e) => onSelectOrg(e.target.value ? (e.target.value as Id<"organizations">) : null)}
        className={cn(
          "w-full bg-surface-raised border border-border text-text-primary rounded-field",
          "px-3 py-2 text-sm",
          "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
          "transition-colors",
          "lg:min-w-48"
        )}
      >
        <option value="">Selecionar Organização</option>
        {organizations.filter(Boolean).map((org) => {
          if (!org) return null;
          return (
            <option key={org._id} value={org._id}>
              {org.name} ({org.role})
            </option>
          );
        })}
      </select>

      {organizations.length === 0 && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-surface-overlay border border-border rounded-card shadow-elevated z-10 min-w-80">
          <h3 className="font-medium text-text-primary mb-2">Nenhuma organização encontrada</h3>
          <p className="text-sm text-text-secondary mb-4">Crie sua primeira organização para começar.</p>

          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
            >
              Criar Organização
            </Button>
          ) : (
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <Input
                type="text"
                placeholder="Nome da Organização"
                value={newOrgName}
                onChange={(e) => {
                  setNewOrgName(e.target.value);
                  setNewOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                }}
                required
              />
              <Input
                type="text"
                placeholder="Slug (identificador URL)"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1"
                >
                  Criar
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
