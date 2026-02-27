import { useState } from "react";
;
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import {
  Plus,
  X,
  Phone,
  Mail,
  CalendarClock,
  Users as UsersIcon,
  Search,
  ClipboardList,
} from "lucide-react";

const ACTIVITY_TYPES = [
  { value: "todo", label: "Task" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "follow_up", label: "Follow-up" },
  { value: "meeting", label: "Meeting" },
  { value: "research", label: "Research" },
] as const;

const PRIORITIES = [
  { value: "low", label: "Low", color: "bg-surface-overlay text-text-secondary" },
  { value: "medium", label: "Medium", color: "bg-semantic-info/10 text-semantic-info" },
  { value: "high", label: "High", color: "bg-semantic-warning/10 text-semantic-warning" },
  { value: "urgent", label: "Urgent", color: "bg-semantic-error/10 text-semantic-error" },
] as const;

const RECURRENCE_OPTIONS = [
  { value: "", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
] as const;

interface CreateTaskModalProps {
  organizationId: Id<"organizations">;
  isOpen: boolean;
  onClose: () => void;
  defaultLeadId?: Id<"leads">;
  defaultContactId?: Id<"contacts">;
}

export function CreateTaskModal({
  organizationId,
  isOpen,
  onClose,
  defaultLeadId,
  defaultContactId,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"task" | "reminder">("task");
  const [activityType, setActivityType] = useState<string>("todo");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [leadId, setLeadId] = useState<string>(defaultLeadId ?? "");
  const [contactId, setContactId] = useState<string>(defaultContactId ?? "");
  const [recurrence, setRecurrence] = useState("");
  const [checklist, setChecklist] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  const crpc = useCRPC();
  const { data: teamMembers } = useQuery(crpc.teamMembers.getTeamMembers.queryOptions({ organizationId }));
  const { data: contacts } = useQuery(crpc.contacts.getContacts.queryOptions({ organizationId }));
  const { mutateAsync: createTask } = useMutation(crpc.tasks.createTask.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      let dueDateTs: number | undefined;
      if (dueDate) {
        const dateStr = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T23:59`;
        dueDateTs = new Date(dateStr).getTime();
      }

      await createTask({
        organizationId,
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        activityType: activityType as "todo" | "call" | "email" | "follow_up" | "meeting" | "research",
        dueDate: dueDateTs,
        priority,
        assignedTo: assignedTo ? (assignedTo as Id<"teamMembers">) : undefined,
        leadId: leadId ? (leadId as Id<"leads">) : undefined,
        contactId: contactId ? (contactId as Id<"contacts">) : undefined,
        recurrence: recurrence
          ? { pattern: recurrence as "daily" | "weekly" | "biweekly" | "monthly" }
          : undefined,
        checklist: checklist.length > 0 ? checklist : undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      toast.success("Task created successfully!");
      resetForm();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setType("task");
    setActivityType("todo");
    setDueDate("");
    setDueTime("");
    setPriority("medium");
    setAssignedTo("");
    setLeadId(defaultLeadId ?? "");
    setContactId(defaultContactId ?? "");
    setRecurrence("");
    setChecklist([]);
    setNewChecklistItem("");
    setTags([]);
    setTagInput("");
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: newChecklistItem.trim(), completed: false },
    ]);
    setNewChecklistItem("");
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || tags.includes(tag)) return;
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Title <span className="text-semantic-error">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes adicionais..."
            rows={2}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted resize-none text-sm"
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Type: Task / Reminder */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">Tipo</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType("task")}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                type === "task"
                  ? "bg-brand-500/10 text-brand-500 border-2 border-brand-500"
                  : "bg-surface-raised text-text-secondary border-2 border-border hover:border-border-strong"
              )}
            >
              Task
            </button>
            <button
              type="button"
              onClick={() => setType("reminder")}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                type === "reminder"
                  ? "bg-brand-500/10 text-brand-500 border-2 border-brand-500"
                  : "bg-surface-raised text-text-secondary border-2 border-border hover:border-border-strong"
              )}
            >
              Reminder
            </button>
          </div>
        </div>

        {/* Activity Type */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Activity Type
          </label>
          <select
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            style={{ fontSize: "16px" }}
          >
            {ACTIVITY_TYPES.map((at) => (
              <option key={at.value} value={at.value}>
                {at.label}
              </option>
            ))}
          </select>
        </div>

        {/* Due date + time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Data de Vencimento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Time
            </label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Priority pill selector */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Prioridade
          </label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-medium rounded-full transition-colors",
                  priority === p.value
                    ? cn(p.color, "ring-2 ring-brand-500 ring-offset-1 ring-offset-surface-base")
                    : "bg-surface-raised text-text-muted hover:text-text-secondary"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Assignee */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Owner
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            style={{ fontSize: "16px" }}
          >
            <option value="">Unassigned</option>
            {teamMembers?.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        {/* Contact */}
        {!defaultContactId && (
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Contact
            </label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            >
              <option value="">No</option>
              {contacts?.map((c) => (
                <option key={c._id} value={c._id}>
                  {[c.firstName, c.lastName].filter(Boolean).join(" ") || c.email || "No name"}
                  {c.company ? ` (${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Recurrence */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Recurrence
          </label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            style={{ fontSize: "16px" }}
          >
            {RECURRENCE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Checklist */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">
            Checklist
          </label>
          {checklist.length > 0 && (
            <div className="space-y-1 mb-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-surface-sunken rounded-lg"
                >
                  <ClipboardList size={14} className="text-text-muted shrink-0" />
                  <span className="flex-1 text-sm text-text-primary truncate">
                    {item.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeChecklistItem(item.id)}
                    className="p-0.5 text-text-muted hover:text-semantic-error transition-colors"
                    aria-label="Remove item"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addChecklistItem();
                }
              }}
              placeholder="Add item..."
              className="flex-1 px-3 py-1.5 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addChecklistItem}
              aria-label="Add item ao checklist"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1">Tags</label>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-500/10 text-brand-400 text-xs font-medium rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-brand-300"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Add tag..."
              className="flex-1 px-3 py-1.5 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addTag}
              aria-label="Add tag"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            size="md"
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting || !title.trim()}
            variant="primary"
            size="md"
            className="flex-1"
          >
            {submitting ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
