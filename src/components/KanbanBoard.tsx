import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { CreateLeadModal } from "./CreateLeadModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  organizationId: Id<"organizations">;
}

export function KanbanBoard({ organizationId }: KanbanBoardProps) {
  const [selectedBoardId, setSelectedBoardId] = useState<Id<"boards"> | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<Id<"leads"> | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const boards = useQuery(api.boards.getBoards, {
    organizationId
  });

  const stages = useQuery(api.boards.getStages,
    selectedBoardId ? { boardId: selectedBoardId } : "skip"
  );

  const leads = useQuery(api.leads.getLeads,
    selectedBoardId ? {
      organizationId,
      boardId: selectedBoardId,
    } : "skip"
  );

  const moveLeadToStage = useMutation(api.leads.moveLeadToStage);

  // Select first board by default
  React.useEffect(() => {
    if (boards && boards.length > 0 && !selectedBoardId) {
      setSelectedBoardId(boards[0]._id);
    }
  }, [boards, selectedBoardId]);

  if (!boards) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-text-primary mb-2">Nenhum quadro encontrado</h3>
        <p className="text-text-secondary">Crie seu primeiro pipeline de vendas para começar.</p>
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain");

    if (leadId && stageId) {
      try {
        await moveLeadToStage({
          leadId: leadId as Id<"leads">,
          stageId: stageId as Id<"stages">,
        });
      } catch (error) {
        console.error("Failed to move lead:", error);
      }
    }
  };

  // Priority variant mapping
  const getPriorityVariant = (priority: string): "error" | "warning" | "default" => {
    if (priority === "urgent") return "error";
    if (priority === "high") return "warning";
    return "default";
  };

  // Temperature variant mapping
  const getTemperatureVariant = (temperature: string): "error" | "warning" | "info" => {
    if (temperature === "hot") return "error";
    if (temperature === "warm") return "warning";
    return "info";
  };

  // Priority label mapping
  const getPriorityLabel = (priority: string): string => {
    const labels: Record<string, string> = {
      urgent: "Urgente",
      high: "Alta",
      medium: "Média",
      low: "Baixa",
    };
    return labels[priority] || priority;
  };

  // Temperature label mapping
  const getTemperatureLabel = (temperature: string): string => {
    const labels: Record<string, string> = {
      hot: "Quente",
      warm: "Morno",
      cold: "Frio",
    };
    return labels[temperature] || temperature;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Board Selector + Create Lead */}
      <div className="mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2 overflow-x-auto flex-1 min-w-0">
            {boards.map((board) => (
              <button
                key={board._id}
                onClick={() => setSelectedBoardId(board._id)}
                className={cn(
                  "px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-150",
                  selectedBoardId === board._id
                    ? "bg-brand-600 text-white"
                    : "bg-surface-overlay text-text-secondary hover:bg-surface-raised"
                )}
              >
                {board.name}
              </button>
            ))}
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            size="md"
            className="whitespace-nowrap"
          >
            <Plus size={20} />
            Criar Lead
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      {stages && (
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-6 h-full min-w-max pb-6 scroll-smooth snap-x snap-mandatory">
            {stages.map((stage) => {
              const stageLeads = leads?.filter(lead => lead.stageId === stage._id) || [];

              return (
                <div
                  key={stage._id}
                  className="flex-shrink-0 w-80 bg-surface-sunken rounded-card p-4 flex flex-col snap-start"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage._id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text-primary">{stage.name}</h3>
                    <span className="bg-surface-overlay text-text-secondary px-2.5 py-0.5 rounded-full text-xs font-medium tabular-nums">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead._id)}
                        onClick={() => setSelectedLeadId(lead._id)}
                        className="bg-surface-raised p-4 rounded-card border border-border cursor-pointer hover:border-border-strong hover:shadow-card-hover transition-all"
                      >
                        <h4 className="font-medium text-text-primary mb-2">{lead.title}</h4>

                        {lead.contact && (
                          <p className="text-sm text-text-secondary mb-2">
                            {lead.contact.firstName} {lead.contact.lastName}
                            {lead.contact.company && ` • ${lead.contact.company}`}
                          </p>
                        )}

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-semibold text-brand-400 tabular-nums">
                            R$ {lead.value.toLocaleString("pt-BR")}
                          </span>

                          {lead.assignee && (
                            <Avatar
                              name={lead.assignee.name}
                              type={lead.assignee.type}
                              size="sm"
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant={getPriorityVariant(lead.priority)}>
                            {getPriorityLabel(lead.priority)}
                          </Badge>

                          <Badge variant={getTemperatureVariant(lead.temperature)}>
                            {getTemperatureLabel(lead.temperature)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lead Detail Panel */}
      {selectedLeadId && (
        <LeadDetailPanel
          leadId={selectedLeadId}
          organizationId={organizationId}
          onClose={() => setSelectedLeadId(null)}
        />
      )}

      {/* Create Lead Modal */}
      {showCreateModal && selectedBoardId && (
        <CreateLeadModal
          organizationId={organizationId}
          boardId={selectedBoardId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
