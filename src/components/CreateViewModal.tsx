import { useState } from "react";
;
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, skipToken } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";

interface CreateViewModalProps {
  organizationId: Id<"organizations">;
  entityType: "leads" | "contacts";
  onClose: () => void;
  onCreated?: (viewId: string) => void;
}

export function CreateViewModal({
  organizationId,
  entityType,
  onClose,
  onCreated,
}: CreateViewModalProps) {
  const [name, setName] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [selectedBoardId, setSelectedBoardId] = useState<
    Id<"boards"> | undefined
  >();
  const [selectedStageIds, setSelectedStageIds] = useState<Id<"stages">[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<
    Id<"teamMembers"> | undefined
  >();
  const [selectedPriority, setSelectedPriority] = useState<
    "low" | "medium" | "high" | "urgent" | undefined
  >();
  const [selectedTemperature, setSelectedTemperature] = useState<
    "cold" | "warm" | "hot" | undefined
  >();
  const [hasContact, setHasContact] = useState<boolean | undefined>();
  const [company, setCompany] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [tags, setTags] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch boards for pipeline filter
  const crpc = useCRPC();
  const { data: boards } = useQuery(crpc.boards.getBoards.queryOptions({ organizationId }));

  // Fetch stages if a board is selected
  const { data: stages } = useQuery(crpc.boards.getStages.queryOptions(selectedBoardId ? { boardId: selectedBoardId } : skipToken));

  // Fetch team members for assignee filter
  const { data: teamMembers } = useQuery(crpc.teamMembers.getTeamMembers.queryOptions({
    organizationId,
  }));

  const { mutateAsync: createSavedView } = useMutation(crpc.savedViews.createSavedView.mutationOptions());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Enter a name for the view");
      return;
    }

    setIsSubmitting(true);

    try {
      // Build filters object
      const filters: any = {};

      if (selectedBoardId) filters.boardId = selectedBoardId;
      if (selectedStageIds.length > 0) filters.stageIds = selectedStageIds;
      if (selectedAssignee) filters.assignedTo = selectedAssignee;
      if (selectedPriority) filters.priority = selectedPriority;
      if (selectedTemperature) filters.temperature = selectedTemperature;
      if (hasContact !== undefined) filters.hasContact = hasContact;
      if (company.trim()) filters.company = company.trim();
      if (minValue.trim()) filters.minValue = parseFloat(minValue);
      if (maxValue.trim()) filters.maxValue = parseFloat(maxValue);
      if (tags.trim()) {
        filters.tags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      const viewId = await createSavedView({
        organizationId,
        name: name.trim(),
        entityType,
        filters,
        isShared,
        sortBy,
        sortOrder,
      });

      toast.success("View created successfully");
      onCreated?.(viewId);
    } catch (error: any) {
      toast.error(error.message || "Failed to create view");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStage = (stageId: Id<"stages">) => {
    setSelectedStageIds((prev) =>
      prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId]
    );
  };

  return (
    <Modal open={true} onClose={onClose} title="Create New View">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <Input
          label="View Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g.: Leads Urgents do Pipeline A"
          required
          style={{ fontSize: "16px" }}
        />

        {/* Share Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-text-primary">
            Share with team?
          </label>
          <button
            type="button"
            onClick={() => setIsShared(!isShared)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              isShared ? "bg-brand-600" : "bg-surface-overlay"
            )}
            aria-label="Toggle sharing"
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white transition-transform",
                isShared ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Filters Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Filters</h3>

          {/* Pipeline (Leads only) */}
          {entityType === "leads" && (
            <>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  Pipeline
                </label>
                <select
                  value={selectedBoardId || ""}
                  onChange={(e) => {
                    setSelectedBoardId(
                      e.target.value ? (e.target.value as Id<"boards">) : undefined
                    );
                    setSelectedStageIds([]); // Reset stages when board changes
                  }}
                  className={cn(
                    "w-full bg-surface-raised border border-border-strong rounded-field",
                    "px-3.5 py-2.5 text-sm text-text-primary",
                    "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                    "transition-colors"
                  )}
                  style={{ fontSize: "16px" }}
                >
                  <option value="">All pipelines</option>
                  {boards?.map((board) => (
                    <option key={board._id} value={board._id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stages (only if board selected) */}
              {selectedBoardId && stages && stages.length > 0 && (
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                    Stages
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-surface-raised border border-border-strong rounded-field">
                    {stages.map((stage) => (
                      <label
                        key={stage._id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStageIds.includes(stage._id)}
                          onChange={() => toggleStage(stage._id)}
                          className="rounded border-border-strong text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-text-primary">
                          {stage.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignee */}
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  Assigned to
                </label>
                <select
                  value={selectedAssignee || ""}
                  onChange={(e) =>
                    setSelectedAssignee(
                      e.target.value ? (e.target.value as Id<"teamMembers">) : undefined
                    )
                  }
                  className={cn(
                    "w-full bg-surface-raised border border-border-strong rounded-field",
                    "px-3.5 py-2.5 text-sm text-text-primary",
                    "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                    "transition-colors"
                  )}
                  style={{ fontSize: "16px" }}
                >
                  <option value="">Anyone</option>
                  {teamMembers
                    ?.filter((m) => m.type === "human")
                    .map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  Prioridade
                </label>
                <select
                  value={selectedPriority || ""}
                  onChange={(e) =>
                    setSelectedPriority(
                      e.target.value as "low" | "medium" | "high" | "urgent" | undefined
                    )
                  }
                  className={cn(
                    "w-full bg-surface-raised border border-border-strong rounded-field",
                    "px-3.5 py-2.5 text-sm text-text-primary",
                    "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                    "transition-colors"
                  )}
                  style={{ fontSize: "16px" }}
                >
                  <option value="">Any priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                  Temperatura
                </label>
                <select
                  value={selectedTemperature || ""}
                  onChange={(e) =>
                    setSelectedTemperature(
                      e.target.value as "cold" | "warm" | "hot" | undefined
                    )
                  }
                  className={cn(
                    "w-full bg-surface-raised border border-border-strong rounded-field",
                    "px-3.5 py-2.5 text-sm text-text-primary",
                    "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                    "transition-colors"
                  )}
                  style={{ fontSize: "16px" }}
                >
                  <option value="">Any temperature</option>
                  <option value="cold">Frio</option>
                  <option value="warm">Morno</option>
                  <option value="hot">Quente</option>
                </select>
              </div>

              {/* Value Range */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Minimum Value"
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  placeholder="0"
                  style={{ fontSize: "16px" }}
                />
                <Input
                  label="Maximum Value"
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  placeholder="99999"
                  style={{ fontSize: "16px" }}
                />
              </div>

              {/* Has Contact Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-primary">
                  Has linked contact?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setHasContact(hasContact === true ? undefined : true)
                    }
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                      hasContact === true
                        ? "bg-brand-600 text-white"
                        : "bg-surface-overlay text-text-secondary hover:bg-surface-raised"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setHasContact(hasContact === false ? undefined : false)
                    }
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                      hasContact === false
                        ? "bg-brand-600 text-white"
                        : "bg-surface-overlay text-text-secondary hover:bg-surface-raised"
                    )}
                  >
                    No
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Company (Contacts only) */}
          {entityType === "contacts" && (
            <Input
              label="Empresa"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company name"
              style={{ fontSize: "16px" }}
            />
          )}

          {/* Tags (both) */}
          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tag1, Tag2, Tag3"
            style={{ fontSize: "16px" }}
          />
        </div>

        {/* Sort Options */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">
            Sorting
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Ordenar por
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={cn(
                  "w-full bg-surface-raised border border-border-strong rounded-field",
                  "px-3.5 py-2.5 text-sm text-text-primary",
                  "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                  "transition-colors"
                )}
                style={{ fontSize: "16px" }}
              >
                <option value="createdAt">Creation Date</option>
                <option value="updatedAt">Last Updated</option>
                {entityType === "leads" && (
                  <>
                    <option value="value">Valor</option>
                    <option value="title">Title</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1.5">
                Direction
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                className={cn(
                  "w-full bg-surface-raised border border-border-strong rounded-field",
                  "px-3.5 py-2.5 text-sm text-text-primary",
                  "focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
                  "transition-colors"
                )}
                style={{ fontSize: "16px" }}
              >
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !name.trim()}
            className="flex-1"
          >
            {isSubmitting ? <Spinner size="sm" /> : "Create View"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
