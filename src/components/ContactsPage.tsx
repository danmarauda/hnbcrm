import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Contact2, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { ContactDetailPanel } from "./ContactDetailPanel";
import { CreateContactModal } from "./CreateContactModal";
import { cn } from "@/lib/utils";

interface ContactsPageProps {
  organizationId: Id<"organizations">;
}

export function ContactsPage({ organizationId }: ContactsPageProps) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<Id<"contacts"> | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Use search query when search text is >= 2 chars, otherwise get all contacts
  const searchResults = useQuery(
    api.contacts.searchContacts,
    debouncedSearch.length >= 2 ? { organizationId, searchText: debouncedSearch } : "skip"
  );

  const allContacts = useQuery(
    api.contacts.getContacts,
    debouncedSearch.length < 2 ? { organizationId } : "skip"
  );

  const contacts = debouncedSearch.length >= 2 ? searchResults : allContacts;

  const handleRowClick = (contactId: Id<"contacts">) => {
    setSelectedContactId(contactId);
  };

  const handleClosePanel = () => {
    setSelectedContactId(null);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Contatos</h1>
              <p className="text-sm text-text-secondary mt-1">
                Gerencie seus contatos e relacionamentos
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowCreateModal(true)}
              className="shrink-0"
            >
              <Plus size={20} className="mr-2" />
              Novo Contato
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por nome, email, empresa..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Content */}
        {contacts === undefined ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-surface-overlay flex items-center justify-center mb-4">
              <Contact2 size={32} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {debouncedSearch ? "Nenhum contato encontrado" : "Nenhum contato"}
            </h3>
            <p className="text-sm text-text-secondary mb-6 text-center max-w-md">
              {debouncedSearch
                ? "Tente ajustar sua busca ou adicione um novo contato"
                : "Adicione seu primeiro contato para começar"}
            </p>
            {!debouncedSearch && (
              <Button variant="primary" size="md" onClick={() => setShowCreateModal(true)}>
                <Plus size={20} className="mr-2" />
                Criar Contato
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-surface-raised border border-border rounded-card overflow-hidden">
            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">
                      Contato
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">
                      Empresa
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">
                      Email
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-6 py-3">
                      Tags
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts.map((contact) => {
                    const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
                    const displayName = fullName || contact.email || contact.phone || "Sem nome";
                    const tags = contact.tags || [];

                    return (
                      <tr
                        key={contact._id}
                        onClick={() => handleRowClick(contact._id)}
                        className="hover:bg-surface-overlay cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={displayName} size="sm" />
                            <div>
                              <div className="text-sm font-medium text-text-primary">
                                {displayName}
                              </div>
                              {contact.title && (
                                <div className="text-xs text-text-muted">{contact.title}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-primary">
                            {contact.company || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-text-secondary">
                            {contact.email || "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="default">
                                {tag}
                              </Badge>
                            ))}
                            {tags.length > 2 && (
                              <Badge variant="default">+{tags.length - 2}</Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile: List */}
            <div className="md:hidden divide-y divide-border">
              {contacts.map((contact) => {
                const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
                const displayName = fullName || contact.email || contact.phone || "Sem nome";
                const tags = contact.tags || [];

                return (
                  <div
                    key={contact._id}
                    onClick={() => handleRowClick(contact._id)}
                    className="p-4 hover:bg-surface-overlay active:bg-surface-overlay transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar name={displayName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary mb-0.5">
                          {displayName}
                        </div>
                        {contact.company && (
                          <div className="text-sm text-text-secondary mb-1">
                            {contact.company}
                          </div>
                        )}
                        {contact.email && (
                          <div className="text-sm text-text-muted mb-2">
                            {contact.email}
                          </div>
                        )}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="default">
                                {tag}
                              </Badge>
                            ))}
                            {tags.length > 3 && (
                              <Badge variant="default">+{tags.length - 3}</Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contact Detail Panel */}
      {selectedContactId && (
        <ContactDetailPanel contactId={selectedContactId} onClose={handleClosePanel} />
      )}

      {/* Create Contact Modal */}
      {showCreateModal && (
        <CreateContactModal organizationId={organizationId} onClose={handleCloseCreateModal} />
      )}
    </>
  );
}
