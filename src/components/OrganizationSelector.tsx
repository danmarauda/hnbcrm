import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface OrganizationSelectorProps {
  selectedOrgId: Id<"organizations"> | null;
  onSelectOrg: (orgId: Id<"organizations"> | null) => void;
}

export function OrganizationSelector({ selectedOrgId, onSelectOrg }: OrganizationSelectorProps) {
  const organizations = useQuery(api.organizations.getUserOrganizations);

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
    </div>
  );
}
