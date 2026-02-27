import { useState } from "react";
;
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PermissionsEditor } from "./PermissionsEditor";
import {
  type Permissions,
  type Role,
  DEFAULT_PERMISSIONS,
  resolvePermissions,
} from "../../../convex/lib/permissions";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, skipToken } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import {
  Pencil, Trash2, RotateCcw, Save, X,
  Key, Plus, Copy, Check, Eye, EyeOff, ShieldAlert, Ban, RefreshCw,
} from "lucide-react";

interface TeamMember {
  _id: Id<"teamMembers">;
  name: string;
  email?: string;
  role: string;
  type: string;
  status: string;
  capabilities?: string[];
  permissions?: Permissions | null;
  mustChangePassword?: boolean;
  invitedBy?: Id<"teamMembers"> | null;
  avatarFileId?: Id<"files"> | null;
  avatarUrl?: string | null;
  createdAt: number;
}

interface MemberDetailSlideOverProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  organizationId: Id<"organizations">;
  /** Whether the current user has team manage permission */
  canManage: boolean;
  /** The current user's member id (to prevent self-removal) */
  currentMemberId?: Id<"teamMembers">;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  agent: "Agent",
  ai: "AI",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  busy: "Ocupado",
  inactive: "Inactive",
};

export function MemberDetailSlideOver({
  open,
  onClose,
  member,
  organizationId,
  canManage,
  currentMemberId,
}: MemberDetailSlideOverProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<Role>("agent");
  const [editPermissions, setEditPermissions] = useState<Permissions>(DEFAULT_PERMISSIONS.agent);
  const [customPermissions, setCustomPermissions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // API key state (for AI agents)
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [keyCopied, setKeyCopied] = useState(false);
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [revokeKeyId, setRevokeKeyId] = useState<Id<"apiKeys"> | null>(null);

  const crpc = useCRPC();
  const { mutateAsync: updateMember } = useMutation(crpc.teamMembers.updateTeamMember.mutationOptions());
  const { mutateAsync: updateMemberAvatar } = useMutation(crpc.teamMembers.updateMemberAvatar.mutationOptions());
  const { mutateAsync: removeMember } = useMutation(crpc.teamMembers.removeTeamMember.mutationOptions());
  const { mutateAsync: reactivateMember } = useMutation(crpc.teamMembers.reactivateTeamMember.mutationOptions());
  const { mutateAsync: createApiKeyAction } = useMutation(crpc.nodeActions.createApiKey.mutationOptions());
  const { mutateAsync: revokeApiKeyMutation } = useMutation(crpc.apiKeys.revokeApiKey.mutationOptions());

  // Fetch API keys for AI agents
  const { data: apiKeys } = useQuery(crpc.apiKeys.getApiKeysForMember.queryOptions(member && member.type === "ai"
      ? { organizationId, teamMemberId: member._id }
      : skipToken));

  if (!member) return null;

  const isSelf = currentMemberId === member._id;
  const isInactive = member.status === "inactive";
  const resolvedPermissions = resolvePermissions(
    member.role as Role,
    member.permissions as Permissions | undefined
  );

  const startEditing = () => {
    setEditName(member.name);
    setEditRole(member.role as Role);
    const hasCustom = !!member.permissions;
    setCustomPermissions(hasCustom);
    setEditPermissions(
      hasCustom
        ? { ...(member.permissions as Permissions) }
        : { ...DEFAULT_PERMISSIONS[member.role as Role] }
    );
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMember({
        teamMemberId: member._id,
        name: editName.trim() || undefined,
        role: editRole !== member.role ? editRole : undefined,
        permissions: customPermissions ? editPermissions : undefined,
      });
      toast.success("Member updated!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update member.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeMember({ teamMemberId: member._id });
      toast.success("Member removed.");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove member.");
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMember({ teamMemberId: member._id });
      toast.success("Member reactivated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to reactivate member.");
    }
  };

  const handleRoleChange = (newRole: Role) => {
    setEditRole(newRole);
    if (!customPermissions) {
      setEditPermissions(DEFAULT_PERMISSIONS[newRole]);
    }
  };

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) return;
    setCreatingKey(true);
    try {
      const result = await createApiKeyAction({
        organizationId,
        teamMemberId: member._id,
        name: newKeyName.trim(),
      });
      setNewKeyValue(result.apiKey);
      setNewKeyName("");
      toast.success("API key created!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create API key.");
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async () => {
    if (!revokeKeyId) return;
    try {
      await revokeApiKeyMutation({ apiKeyId: revokeKeyId, organizationId });
      toast.success("API key revoked!");
      setRevokeKeyId(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke key.");
    }
  };

  const handleCopyKey = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setKeyCopied(true);
    toast.success("Copied!");
    setTimeout(() => setKeyCopied(false), 2000);
  };

  const handleCloseNewKey = () => {
    setNewKeyValue(null);
    setKeyRevealed(false);
    setKeyCopied(false);
    setShowNewKey(false);
  };

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "brand" as const;
      case "manager": return "info" as const;
      case "agent": return "success" as const;
      case "ai": return "warning" as const;
      default: return "default" as const;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "success" as const;
      case "busy": return "warning" as const;
      case "inactive": return "error" as const;
      default: return "default" as const;
    }
  };

  return (
    <>
      <SlideOver open={open} onClose={onClose} title="Member Details">
        <div className="p-4 md:p-6 space-y-6">
          {/* Member header */}
          <div className="flex items-center gap-4">
            <AvatarUpload
              currentPhotoUrl={member.avatarUrl}
              initials={member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              organizationId={organizationId}
              fileType="member_avatar"
              teamMemberId={member._id}
              onPhotoChange={(fileId) => {
                updateMemberAvatar({ teamMemberId: member._id, avatarFileId: fileId });
              }}
              disabled={!canManage && currentMemberId !== member._id}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Member name"
                />
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-text-primary truncate">
                    {member.name}
                  </h3>
                  {member.email && (
                    <p className="text-sm text-text-secondary truncate">
                      {member.email}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Info badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={getRoleBadgeVariant(isEditing ? editRole : member.role)}>
              {ROLE_LABELS[isEditing ? editRole : member.role] || member.role}
            </Badge>
            <Badge variant={member.type === "ai" ? "warning" : "info"}>
              {member.type === "ai" ? "AI" : "Human"}
            </Badge>
            <Badge variant={getStatusBadgeVariant(member.status)}>
              {STATUS_LABELS[member.status] || member.status}
            </Badge>
          </div>

          {/* Role selector (edit mode, human only) */}
          {isEditing && member.type === "human" && (
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Role
              </label>
              <div className="flex flex-wrap gap-2">
                {(["agent", "manager", "admin"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px]",
                      editRole === r
                        ? "bg-brand-500 text-white"
                        : "bg-surface-raised text-text-secondary hover:bg-surface-overlay border border-border-subtle"
                    )}
                  >
                    {ROLE_LABELS[r]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Permissions section */}
          {isEditing ? (
            <div className="space-y-3">
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

              <PermissionsEditor
                value={editPermissions}
                onChange={setEditPermissions}
                role={editRole}
                disabled={!customPermissions}
              />
            </div>
          ) : (
            <div>
              <PermissionsEditor
                value={resolvedPermissions}
                onChange={() => {}}
                role={member.role as Role}
                disabled
              />
            </div>
          )}

          {/* API Keys section (AI agents only) */}
          {member.type === "ai" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-brand-500" />
                  <span className="text-sm font-semibold text-text-primary">Chaves API</span>
                </div>
                {canManage && !newKeyValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewKeyName(slugify(member.name));
                      setShowNewKey(true);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-brand-500 hover:text-brand-400 transition-colors"
                  >
                    <Plus size={14} />
                    New Key
                  </button>
                )}
              </div>

              {/* New key creation form */}
              {showNewKey && !newKeyValue && (
                <div className="p-3 bg-surface-sunken rounded-lg border border-border space-y-3">
                  <Input
                    label="Key Name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={slugify(member.name)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setShowNewKey(false); setNewKeyName(""); }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleCreateApiKey}
                      disabled={creatingKey || !newKeyName.trim()}
                      className="flex-1"
                    >
                      {creatingKey ? "Creating..." : "Create Key"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Newly created key reveal */}
              {newKeyValue && (
                <div className="p-3 bg-surface-sunken rounded-lg border border-semantic-success/30 space-y-3">
                  <div className="flex items-center gap-2 text-semantic-success">
                    <Check size={16} />
                    <span className="text-sm font-medium">Key created!</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-base border border-border rounded-lg p-2">
                    <code className="flex-1 text-xs font-mono text-text-primary break-all select-all">
                      {keyRevealed ? newKeyValue : newKeyValue.slice(0, 10) + "\u2022".repeat(20) + newKeyValue.slice(-4)}
                    </code>
                    <button
                      onClick={() => setKeyRevealed(!keyRevealed)}
                      className="flex-shrink-0 p-1 rounded text-text-muted hover:text-text-primary transition-colors"
                    >
                      {keyRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCopyKey(newKeyValue)}
                    className="w-full"
                  >
                    {keyCopied ? <Check size={14} /> : <Copy size={14} />}
                    {keyCopied ? "Copied!" : "Copy Key"}
                  </Button>
                  <div className="flex gap-2 items-start text-xs text-semantic-warning bg-semantic-warning/5 border border-semantic-warning/20 rounded-lg p-2">
                    <ShieldAlert size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Save it in a secure location. It will not be shown again.</span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCloseNewKey}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              )}

              {/* Existing keys list */}
              {apiKeys && apiKeys.length > 0 && !newKeyValue && (
                <div className="space-y-2">
                  {apiKeys.map((key: any) => (
                    <div
                      key={key._id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg border",
                        key.isActive
                          ? "bg-surface-sunken border-border"
                          : "bg-surface-sunken/50 border-border-subtle opacity-60"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-text-primary truncate">
                            {key.name}
                          </span>
                          {!key.isActive && (
                            <Badge variant="error">Revoked</Badge>
                          )}
                          {key.expiresAt && key.expiresAt < Date.now() && key.isActive && (
                            <Badge variant="warning">Expired</Badge>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          Created on {new Date(key.createdAt).toLocaleDateString("en-US")}
                          {key.lastUsed && (
                            <> · Used {new Date(key.lastUsed).toLocaleDateString("en-US")}</>
                          )}
                        </p>
                      </div>
                      {canManage && key.isActive && (
                        <button
                          onClick={() => setRevokeKeyId(key._id)}
                          className="flex-shrink-0 p-1.5 rounded-md text-text-muted hover:text-semantic-error hover:bg-semantic-error/10 transition-colors"
                          title="Revoke key"
                        >
                          <Ban size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {apiKeys && apiKeys.length === 0 && !showNewKey && !newKeyValue && (
                <p className="text-xs text-text-muted text-center py-2">
                  No API keys created.
                </p>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-text-muted space-y-1 pt-2 border-t border-border-subtle">
            <p>
              Created at{" "}
              {new Date(member.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
            {member.mustChangePassword && (
              <p className="text-semantic-warning">
                Waiting for password change
              </p>
            )}
          </div>

          {/* Action buttons */}
          {canManage && (
            <div className="space-y-2 pt-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={cancelEditing}
                    className="flex-1"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={startEditing}
                    className="w-full"
                  >
                    <Pencil size={16} />
                    Edit Member
                  </Button>

                  {isInactive ? (
                    <Button
                      variant="ghost"
                      onClick={handleReactivate}
                      className="w-full"
                    >
                      <RotateCcw size={16} />
                      Reactivate Member
                    </Button>
                  ) : (
                    !isSelf && (
                      <Button
                        variant="danger"
                        onClick={() => setShowRemoveConfirm(true)}
                        className="w-full"
                      >
                        <Trash2 size={16} />
                        Remove Member
                      </Button>
                    )
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </SlideOver>

      <ConfirmDialog
        open={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={handleRemove}
        title="Remove Member"
        description={`Are you sure you want to remove ${member.name} from the team? The status will be set to inactive.`}
        confirmLabel="Remove"
        variant="danger"
      />

      <ConfirmDialog
        open={!!revokeKeyId}
        onClose={() => setRevokeKeyId(null)}
        onConfirm={handleRevokeApiKey}
        title="Revoke API Key"
        description="This action is irreversible. Any integration using this key will stop working immediately."
        confirmLabel="Revoke"
        variant="danger"
      />
    </>
  );
}
