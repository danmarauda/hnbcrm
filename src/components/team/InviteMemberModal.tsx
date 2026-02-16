import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { PermissionsEditor } from "./PermissionsEditor";
import {
  type Permissions,
  type Role,
  DEFAULT_PERMISSIONS,
} from "../../../convex/lib/permissions";
import { cn } from "@/lib/utils";
import { User, Bot, Copy, Check, Eye, EyeOff, ShieldAlert } from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: Id<"organizations">;
}

type MemberType = "human" | "ai";
type Step = "type" | "form" | "result";

const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  manager: "Gerente",
  agent: "Agente",
  ai: "IA",
};

export function InviteMemberModal({
  open,
  onClose,
  organizationId,
}: InviteMemberModalProps) {
  const [step, setStep] = useState<Step>("type");
  const [memberType, setMemberType] = useState<MemberType>("human");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("agent");
  const [customPermissions, setCustomPermissions] = useState(false);
  const [permissions, setPermissions] = useState<Permissions>(DEFAULT_PERMISSIONS.agent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [resultMemberId, setResultMemberId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // AI agent fields
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [capabilityInput, setCapabilityInput] = useState("");

  const inviteHuman = useAction(api.nodeActions.inviteHumanMember);
  const createAiMember = useMutation(api.teamMembers.createTeamMember);

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setPermissions(DEFAULT_PERMISSIONS[newRole]);
  };

  const handleSelectType = (type: MemberType) => {
    setMemberType(type);
    if (type === "ai") {
      setRole("ai");
      setPermissions(DEFAULT_PERMISSIONS.ai);
    } else {
      setRole("agent");
      setPermissions(DEFAULT_PERMISSIONS.agent);
    }
    setStep("form");
  };

  const handleAddCapability = () => {
    const cap = capabilityInput.trim();
    if (cap && !capabilities.includes(cap)) {
      setCapabilities([...capabilities, cap]);
      setCapabilityInput("");
    }
  };

  const handleRemoveCapability = (cap: string) => {
    setCapabilities(capabilities.filter((c) => c !== cap));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (memberType === "human") {
        if (!email.trim()) {
          toast.error("Email e obrigatorio para membros humanos.");
          setIsSubmitting(false);
          return;
        }
        const result = await inviteHuman({
          organizationId,
          name: name.trim(),
          email: email.trim(),
          role: role as "admin" | "manager" | "agent",
          permissions: customPermissions ? permissions : undefined,
        });

        setResultMemberId(result.teamMemberId);
        setTempPassword(result.tempPassword ?? null);
        setStep("result");
        toast.success(
          result.isNewUser
            ? "Membro convidado com sucesso!"
            : "Membro adicionado a organizacao!"
        );
      } else {
        await createAiMember({
          organizationId,
          name: name.trim(),
          role: "ai",
          type: "ai",
          capabilities: capabilities.length > 0 ? capabilities : undefined,
        });
        toast.success("Agente IA criado com sucesso!");
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || "Falha ao adicionar membro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!tempPassword) return;
    await navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    toast.success("Senha copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setStep("type");
    setMemberType("human");
    setName("");
    setEmail("");
    setRole("agent");
    setCustomPermissions(false);
    setPermissions(DEFAULT_PERMISSIONS.agent);
    setTempPassword(null);
    setResultMemberId(null);
    setCopied(false);
    setRevealed(false);
    setCapabilities([]);
    setCapabilityInput("");
    onClose();
  };

  const renderTypeStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Selecione o tipo de membro que deseja adicionar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSelectType("human")}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all min-h-[44px]",
            "border-border-strong hover:border-brand-500 hover:bg-brand-500/5"
          )}
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-500/10">
            <User size={24} className="text-brand-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">Humano</p>
            <p className="text-xs text-text-muted mt-1">
              Convide por email com senha temporaria
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelectType("ai")}
          className={cn(
            "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all min-h-[44px]",
            "border-border-strong hover:border-brand-500 hover:bg-brand-500/5"
          )}
        >
          <div className="flex items-center justify-center h-12 w-12 rounded-full bg-semantic-warning/10">
            <Bot size={24} className="text-semantic-warning" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">Agente IA</p>
            <p className="text-xs text-text-muted mt-1">
              Crie um agente de inteligencia artificial
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nome *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={memberType === "human" ? "Joao Silva" : "Agente de Vendas"}
        required
      />

      {memberType === "human" && (
        <>
          <Input
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joao@empresa.com"
            required
          />

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Funcao
            </label>
            <div className="flex flex-wrap gap-2">
              {(["agent", "manager", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRoleChange(r)}
                  className={cn(
                    "px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]",
                    role === r
                      ? "bg-brand-500 text-white"
                      : "bg-surface-raised text-text-secondary hover:bg-surface-overlay border border-border-subtle"
                  )}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {/* Custom permissions toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Personalizar permissoes
            </span>
            <button
              type="button"
              onClick={() => setCustomPermissions(!customPermissions)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                customPermissions ? "bg-brand-500" : "bg-surface-overlay border border-border-strong"
              )}
              role="switch"
              aria-checked={customPermissions}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                  customPermissions ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          </div>

          {customPermissions && (
            <PermissionsEditor
              value={permissions}
              onChange={setPermissions}
              role={role}
            />
          )}
        </>
      )}

      {memberType === "ai" && (
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
            Capacidades
          </label>
          <div className="flex gap-2">
            <Input
              value={capabilityInput}
              onChange={(e) => setCapabilityInput(e.target.value)}
              placeholder="Ex: responder leads, qualificar"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCapability();
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleAddCapability}
            >
              Adicionar
            </Button>
          </div>
          {capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {capabilities.map((cap) => (
                <Badge key={cap} variant="brand" className="cursor-pointer" onClick={() => handleRemoveCapability(cap)}>
                  {cap} &times;
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep("type")}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting
            ? "Adicionando..."
            : memberType === "human"
              ? "Convidar Membro"
              : "Criar Agente"}
        </Button>
      </div>
    </form>
  );

  const renderResultStep = () => (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-semantic-success/10 mb-3">
          <Check size={28} className="text-semantic-success" />
        </div>
        <p className="text-sm text-text-secondary">
          Membro adicionado com sucesso.
        </p>
      </div>

      {tempPassword && (
        <>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Senha temporaria
            </label>
            <div className="flex items-center gap-2 bg-surface-sunken border border-border rounded-lg p-3">
              <code className="flex-1 text-sm font-mono text-text-primary break-all select-all">
                {revealed ? tempPassword : "\u2022".repeat(12)}
              </code>
              <button
                onClick={() => setRevealed(!revealed)}
                className="flex-shrink-0 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                aria-label={revealed ? "Ocultar senha" : "Revelar senha"}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={handleCopy}
            className="w-full"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copiada!" : "Copiar Senha"}
          </Button>

          <div className="flex gap-3 bg-semantic-warning/5 border border-semantic-warning/20 rounded-lg p-3">
            <ShieldAlert size={20} className="flex-shrink-0 text-semantic-warning mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Envie esta senha ao membro de forma segura. Ele sera obrigado a altera-la no primeiro acesso.
            </p>
          </div>
        </>
      )}

      <Button variant="secondary" onClick={handleClose} className="w-full">
        Fechar
      </Button>
    </div>
  );

  const titles: Record<Step, string> = {
    type: "Adicionar Membro",
    form: memberType === "human" ? "Convidar Membro" : "Criar Agente IA",
    result: "Membro Criado",
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[step]}>
      {step === "type" && renderTypeStep()}
      {step === "form" && renderFormStep()}
      {step === "result" && renderResultStep()}
    </Modal>
  );
}
