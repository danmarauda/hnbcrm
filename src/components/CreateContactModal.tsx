import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface CreateContactModalProps {
  organizationId: Id<"organizations">;
  onClose: () => void;
}

export function CreateContactModal({ organizationId, onClose }: CreateContactModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createContact = useMutation(api.contacts.createContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // At least one field must be filled
    if (
      !firstName.trim() &&
      !lastName.trim() &&
      !email.trim() &&
      !phone.trim() &&
      !company.trim()
    ) {
      toast.error("Forneça pelo menos um nome, email, telefone ou empresa");
      return;
    }

    setSubmitting(true);

    const createPromise = createContact({
      organizationId,
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

    toast.promise(createPromise, {
      loading: "Criando contato...",
      success: () => {
        onClose();
        return "Contato criado com sucesso";
      },
      error: "Falha ao criar contato",
    });

    try {
      await createPromise;
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose} title="Criar Novo Contato">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Nome
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Sobrenome
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Telefone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Empresa
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Cargo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            WhatsApp
          </label>
          <input
            type="text"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Telegram
          </label>
          <input
            type="text"
            value={telegramUsername}
            onChange={(e) => setTelegramUsername(e.target.value)}
            placeholder="@username"
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Tags (separadas por vírgula)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="cliente, vip, parceiro"
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {submitting ? "Criando..." : "Criar Contato"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
