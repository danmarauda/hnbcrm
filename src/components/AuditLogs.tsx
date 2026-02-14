import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

interface AuditLogsProps {
  organizationId: Id<"organizations">;
}

export function AuditLogs({ organizationId }: AuditLogsProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");

  const auditLogs = useQuery(api.auditLogs.getAuditLogs, {
    organizationId,
    severity: selectedSeverity !== "all"
      ? (selectedSeverity as "low" | "medium" | "high" | "critical")
      : undefined,
    entityType: selectedEntityType !== "all" ? selectedEntityType : undefined,
  });

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "create": return "success";
      case "update": return "info";
      case "delete": return "error";
      case "move": return "brand";
      case "assign": return "info";
      case "handoff": return "warning";
      default: return "default";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "low": return "default";
      case "medium": return "warning";
      case "high": return "error";
      case "critical": return "error";
      default: return "default";
    }
  };

  const handleExportCsv = () => {
    if (!auditLogs || auditLogs.logs.length === 0) {
      toast.error("Nenhum dado para exportar.");
      return;
    }
    const headers = ["Timestamp", "Action", "Entity Type", "Entity ID", "Severity", "Actor", "Actor Type", "Description"];
    const rows = auditLogs.logs.map((log) => {
      const meta = log.metadata as Record<string, unknown> | undefined;
      const desc = meta?.title || meta?.name || `${log.action} ${log.entityType}`;
      return [
        new Date(log.createdAt).toISOString(),
        log.action,
        log.entityType,
        log.entityId,
        log.severity,
        log.actorName,
        log.actorType,
        `"${String(desc).replace(/"/g, '""')}"`,
      ].join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-primary">Logs de Auditoria</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">Todas as Severidades</option>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="critical">Crítica</option>
          </select>

          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="all">Todos os Tipos</option>
            <option value="lead">Leads</option>
            <option value="contact">Contatos</option>
            <option value="organization">Organizações</option>
            <option value="teamMember">Membros</option>
            <option value="handoff">Repasses</option>
            <option value="message">Mensagens</option>
          </select>

          <Button variant="secondary" onClick={handleExportCsv}>
            Exportar CSV
          </Button>
        </div>
      </div>

      <Card>
        {!auditLogs && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {auditLogs && auditLogs.logs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-text-primary mb-2">Nenhum log encontrado</h3>
            <p className="text-text-secondary">
              Os logs de auditoria aparecerão aqui conforme as atividades ocorrem.
            </p>
          </div>
        )}

        {auditLogs && auditLogs.logs.length > 0 && (
          <div className="divide-y divide-border">
            {auditLogs.logs.map((log) => {
              // Build a changes summary string
              let changesSummary = "";
              if (log.changes) {
                const afterKeys = log.changes.after
                  ? Object.keys(log.changes.after)
                  : [];
                if (afterKeys.length > 0) {
                  changesSummary = afterKeys
                    .map((key) => {
                      const before = log.changes?.before?.[key];
                      const after = log.changes?.after?.[key];
                      if (typeof after === "object") {
                        return `${key} updated`;
                      }
                      return before !== undefined
                        ? `${key}: ${before} -> ${after}`
                        : `${key}: ${after}`;
                    })
                    .join(", ");
                }
              }

              // Build description from metadata or changes
              let description = "";
              if (log.metadata) {
                const meta = log.metadata as Record<string, unknown>;
                if (meta.title) {
                  description = `${log.action} ${log.entityType}: "${meta.title}"`;
                } else if (meta.name) {
                  description = `${log.action} ${log.entityType}: "${meta.name}"`;
                }
              }
              if (!description) {
                description = `${log.action} ${log.entityType}`;
              }

              return (
                <div
                  key={log._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 hover:bg-surface-overlay transition-colors gap-3"
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant={getSeverityBadgeVariant(log.severity)}>
                        {log.severity}
                      </Badge>
                      <Badge variant="default">
                        {log.entityType}
                      </Badge>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-text-primary truncate">
                        {description}
                      </p>
                      {changesSummary && (
                        <p className="text-xs text-text-muted truncate mt-0.5">
                          {changesSummary}
                        </p>
                      )}
                      <p className="text-sm text-text-secondary mt-0.5">
                        por {log.actorName}{" "}
                        <span className="text-text-muted">({log.actorType})</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-sm text-text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination hint */}
        {auditLogs && auditLogs.hasMore && (
          <div className="text-center py-3 border-t border-border">
            <p className="text-sm text-text-muted">
              Exibindo {auditLogs.logs.length} de {auditLogs.total} registros
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
