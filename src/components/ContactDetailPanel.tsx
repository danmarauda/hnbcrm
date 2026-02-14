import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface ContactDetailPanelProps {
  contactId: Id<"contacts">;
  onClose: () => void;
}

export function ContactDetailPanel({ contactId, onClose }: ContactDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<"info" | "leads">("info");
  const [editing, setEditing] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [tags, setTags] = useState("");

  // Queries
  const contactData = useQuery(api.contacts.getContactWithLeads, { contactId });

  // Mutations
  const updateContact = useMutation(api.contacts.updateContact);
  const deleteContact = useMutation(api.contacts.deleteContact);

  // Initialize form when contact data loads
  if (contactData && !editing && !firstName && !lastName) {
    setFirstName(contactData.contact.firstName || "");
    setLastName(contactData.contact.lastName || "");
    setEmail(contactData.contact.email || "");
    setPhone(contactData.contact.phone || "");
    setCompany(contactData.contact.company || "");
    setTitle(contactData.contact.title || "");
    setWhatsappNumber(contactData.contact.whatsappNumber || "");
    setTelegramUsername(contactData.contact.telegramUsername || "");
    setTags((contactData.contact.tags || []).join(", "));
  }

  const handleSave = async () => {
    if (!contactData) return;

    const updatePromise = updateContact({
      contactId,
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      title: title.trim() || undefined,
      whatsappNumber: whatsappNumber.trim() || undefined,
      telegramUsername: telegramUsername.trim() || undefined,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean) || undefined,
    });

    toast.promise(updatePromise, {
      loading: "Salvando...",
      success: () => {
        setEditing(false);
        return "Contato atualizado com sucesso";
      },
      error: "Falha ao atualizar contato",
    });
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este contato?")) return;

    const deletePromise = deleteContact({ contactId });

    toast.promise(deletePromise, {
      loading: "Excluindo...",
      success: () => {
        onClose();
        return "Contato excluído com sucesso";
      },
      error: "Falha ao excluir contato",
    });
  };

  if (!contactData) {
    return (
      <SlideOver open={true} onClose={onClose}>
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </SlideOver>
    );
  }

  const { contact, leads } = contactData;
  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
  const displayName = fullName || contact.email || contact.phone || "Sem nome";

  return (
    <SlideOver open={true} onClose={onClose} title={displayName}>
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="border-b border-border px-4 md:px-6 shrink-0">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("info")}
              className={cn(
                "px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "info"
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={cn(
                "px-1 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "leads"
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              )}
            >
              Leads Vinculados ({leads.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {activeTab === "info" ? (
            <div className="space-y-4">
              {!editing ? (
                <>
                  <InfoField label="Nome" value={contact.firstName} />
                  <InfoField label="Sobrenome" value={contact.lastName} />
                  <InfoField label="Email" value={contact.email} />
                  <InfoField label="Telefone" value={contact.phone} />
                  <InfoField label="Empresa" value={contact.company} />
                  <InfoField label="Cargo" value={contact.title} />
                  <InfoField label="WhatsApp" value={contact.whatsappNumber} />
                  <InfoField label="Telegram" value={contact.telegramUsername} />
                  {contact.tags && contact.tags.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-text-secondary mb-2">Tags</div>
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, idx) => (
                          <Badge key={idx} variant="default">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => setEditing(true)}
                      className="w-full"
                    >
                      Editar Informações
                    </Button>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        style={{ fontSize: "16px" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      WhatsApp
                    </label>
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Telegram
                    </label>
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="cliente, vip, parceiro"
                      className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      style={{ fontSize: "16px" }}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => {
                        setEditing(false);
                        // Reset form
                        setFirstName(contact.firstName || "");
                        setLastName(contact.lastName || "");
                        setEmail(contact.email || "");
                        setPhone(contact.phone || "");
                        setCompany(contact.company || "");
                        setTitle(contact.title || "");
                        setWhatsappNumber(contact.whatsappNumber || "");
                        setTelegramUsername(contact.telegramUsername || "");
                        setTags((contact.tags || []).join(", "));
                      }}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" variant="primary" size="md" className="flex-1">
                      Salvar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {leads.length === 0 ? (
                <div className="text-center py-8 text-text-secondary">
                  Nenhum lead vinculado
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead._id}
                    className="p-4 bg-surface-sunken border border-border rounded-card"
                  >
                    <div className="font-medium text-text-primary mb-1">{lead.title}</div>
                    {lead.value > 0 && (
                      <div className="text-sm text-text-secondary mb-1">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(lead.value)}
                      </div>
                    )}
                    {lead.stageName && (
                      <Badge variant="default" className="mt-2">
                        {lead.stageName}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer - Delete button */}
        <div className="border-t border-border px-4 md:px-6 py-4 shrink-0">
          <Button
            variant="danger"
            size="md"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 size={18} className="mr-2" />
            Excluir Contato
          </Button>
        </div>
      </div>
    </SlideOver>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-text-secondary mb-1">{label}</div>
      <div className="text-sm text-text-primary">{value || "—"}</div>
    </div>
  );
}
