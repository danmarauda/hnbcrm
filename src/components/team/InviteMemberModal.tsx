import { useState } from "react";
;
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
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import {
  User,
  Bot,
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldAlert,
  Key,
  Sparkles,
} from "lucide-react";

interface InviteMemberModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: Id<"organizations">;
}

type MemberType = "human" | "ai";
type Step = "type" | "form" | "result";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const HUMAN_ROLES: { value: Role; label: string; desc: string }[] = [
  { value: "agent", label: "Agent", desc: "Basic access to leads and contacts" },
  { value: "manager", label: "Manager", desc: "Manages leads, team, and reports" },
  { value: "admin", label: "Admin", desc: "Full access to the entire organization" },
];

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
  const [resultApiKey, setResultApiKey] = useState<string | null>(null);
  const [resultMemberName, setResultMemberName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // AI agent fields
  const [generateApiKey, setGenerateApiKey] = useState(true);

  const crpc = useCRPC();
  const { mutateAsync: inviteHuman } = useMutation(crpc.nodeActions.inviteHumanMember.mutationOptions());
  const { mutateAsync: createAiMember } = useMutation(crpc.teamMembers.createTeamMember.mutationOptions());
  const { mutateAsync: createApiKey } = useMutation(crpc.nodeActions.createApiKey.mutationOptions());

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (memberType === "human") {
        if (!email.trim()) {
          toast.error("Email is required for human members.");
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

        setResultMemberName(name.trim());
        setTempPassword(result.tempPassword ?? null);
        setStep("result");
        toast.success(
          result.isNewUser
            ? "Member invited successfully!"
            : "Member added to organization!"
        );
      } else {
        // Create AI agent
        const teamMemberId = await createAiMember({
          organizationId,
          name: name.trim(),
          role: "ai",
          type: "ai",
          permissions: customPermissions ? permissions : undefined,
        });

        // Auto-generate API key if requested
        if (generateApiKey) {
          const keyName = slugify(name.trim());
          const keyResult = await createApiKey({
            organizationId,
            teamMemberId,
            name: keyName,
          });
          setResultApiKey(keyResult.apiKey);
        }

        setResultMemberName(name.trim());
        setStep("result");
        toast.success("AI agent created successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add member.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied!");
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
    setResultApiKey(null);
    setResultMemberName("");
    setCopied(false);
    setRevealed(false);
    setGenerateApiKey(true);
    onClose();
  };

  // --- Type selection step ---
  const renderTypeStep = () => (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        Select the type of member you want to add.
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
            <p className="text-sm font-semibold text-text-primary">Human</p>
            <p className="text-xs text-text-muted mt-1">
              Invite by email with a temporary password
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
            <p className="text-sm font-semibold text-text-primary">AI Agent</p>
            <p className="text-xs text-text-muted mt-1">
              Create an agent with an API key for automations
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  // --- Human form step ---
  const renderHumanForm = () => (
    <>
      <Input
        label="Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Joao Silva"
        required
      />

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
          Role
        </label>
        <div className="flex flex-wrap gap-2">
          {HUMAN_ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => handleRoleChange(r.value)}
              className={cn(
                "px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]",
                role === r.value
                  ? "bg-brand-500 text-white"
                  : "bg-surface-raised text-text-secondary hover:bg-surface-overlay border border-border-subtle"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom permissions toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          Customize permissions
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
  );

  // --- AI agent form step ---
  const renderAiForm = () => (
    <>
      {/* Descriptive header */}
      <div className="flex items-start gap-3 p-3 bg-surface-sunken rounded-lg border border-border">
        <Sparkles size={18} className="text-semantic-warning shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary leading-relaxed">
          AI agents operate via <strong>API keys</strong> for automations, bots, and integrations.
          After creating, use the key in the <code className="text-text-primary bg-surface-overlay px-1 rounded">X-API-Key</code> request header.
        </p>
      </div>

      <Input
        label="Agent Name *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g.: Sales Bot, Qualification Agent"
        required
      />

      {/* API Key generation */}
      <div className="space-y-2 p-3 bg-surface-sunken rounded-lg border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-brand-500" />
            <span className="text-sm font-medium text-text-primary">Generate API Key</span>
          </div>
          <button
            type="button"
            onClick={() => setGenerateApiKey(!generateApiKey)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              generateApiKey ? "bg-brand-500" : "bg-surface-overlay border border-border-strong"
            )}
            role="switch"
            aria-checked={generateApiKey}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                generateApiKey ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>
        {generateApiKey && name.trim() && (
          <p className="text-xs text-text-muted">
            Key name: <code className="text-text-primary bg-surface-overlay px-1 rounded">{slugify(name.trim())}</code>
          </p>
        )}
        {!generateApiKey && (
          <p className="text-xs text-text-muted">
              You can generate keys later in Settings &gt; API Keys.
          </p>
        )}
      </div>

      {/* Permissions */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-secondary">
          Customize permissions
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

      {!customPermissions && (
        <p className="text-xs text-text-muted -mt-2">
          Default: access to the agent's leads, contacts, and conversations.
        </p>
      )}

      {customPermissions && (
        <PermissionsEditor
          value={permissions}
          onChange={setPermissions}
          role="ai"
        />
      )}
    </>
  );

  // --- Form step (wrapper) ---
  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {memberType === "human" ? renderHumanForm() : renderAiForm()}

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep("type")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting
            ? "Creating..."
            : memberType === "human"
              ? "Invite Member"
              : generateApiKey
                ? "Create Agent and Key"
                : "Create Agent"}
        </Button>
      </div>
    </form>
  );

  // --- Result step ---
  const renderResultStep = () => (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-semantic-success/10 mb-3">
          <Check size={28} className="text-semantic-success" />
        </div>
        <p className="text-base font-semibold text-text-primary">
          {resultMemberName}
        </p>
        <p className="text-sm text-text-secondary mt-1">
          {memberType === "human" ? "Member added successfully." : "AI agent created successfully."}
        </p>
      </div>

      {/* Human: show temp password */}
      {tempPassword && (
        <>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Temporary password
            </label>
            <div className="flex items-center gap-2 bg-surface-sunken border border-border rounded-lg p-3">
              <code className="flex-1 text-sm font-mono text-text-primary break-all select-all">
                {revealed ? tempPassword : "\u2022".repeat(12)}
              </code>
              <button
                onClick={() => setRevealed(!revealed)}
                className="flex-shrink-0 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                aria-label={revealed ? "Hide" : "Reveal"}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => handleCopy(tempPassword)}
            className="w-full"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Password"}
          </Button>

          <div className="flex gap-3 bg-semantic-warning/5 border border-semantic-warning/20 rounded-lg p-3">
            <ShieldAlert size={20} className="flex-shrink-0 text-semantic-warning mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Send this password to the member securely. They will be required to change it on first access.
            </p>
          </div>
        </>
      )}

      {/* AI: show API key */}
      {resultApiKey && (
        <>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
              API Key
            </label>
            <div className="flex items-center gap-2 bg-surface-sunken border border-border rounded-lg p-3">
              <code className="flex-1 text-sm font-mono text-text-primary break-all select-all">
                {revealed ? resultApiKey : resultApiKey.slice(0, 10) + "\u2022".repeat(24) + resultApiKey.slice(-4)}
              </code>
              <button
                onClick={() => setRevealed(!revealed)}
                className="flex-shrink-0 p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-raised transition-colors"
                aria-label={revealed ? "Hide" : "Reveal"}
              >
                {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => handleCopy(resultApiKey)}
            className="w-full"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy API Key"}
          </Button>

          <div className="flex gap-3 bg-semantic-warning/5 border border-semantic-warning/20 rounded-lg p-3">
            <ShieldAlert size={20} className="flex-shrink-0 text-semantic-warning mt-0.5" />
            <p className="text-sm text-text-secondary leading-relaxed">
              Save this key securely. You will not be able to see it again.
              Use no header <code className="bg-surface-overlay px-1 rounded text-text-primary">X-API-Key</code> request header.
            </p>
          </div>
        </>
      )}

      <Button variant="secondary" onClick={handleClose} className="w-full">
        Close
      </Button>
    </div>
  );

  const titles: Record<Step, string> = {
    type: "Add Member",
    form: memberType === "human" ? "Invite Member" : "Create AI Agent",
    result: memberType === "human" ? "Member Created" : "AI Agent Created",
  };

  return (
    <Modal open={open} onClose={handleClose} title={titles[step]}>
      {step === "type" && renderTypeStep()}
      {step === "form" && renderFormStep()}
      {step === "result" && renderResultStep()}
    </Modal>
  );
}
