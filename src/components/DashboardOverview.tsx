import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Avatar } from "@/components/ui/Avatar";

interface DashboardOverviewProps {
  organizationId: Id<"organizations">;
}

export function DashboardOverview({ organizationId }: DashboardOverviewProps) {
  const stats = useQuery(api.dashboard.getDashboardStats, {
    organizationId,
  });

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalPipelineValue = stats.pipelineStats.reduce((sum, s) => sum + s.totalValue, 0);
  const totalLeads = stats.pipelineStats.reduce((sum, s) => sum + s.leadCount, 0);

  // Activity type translations
  const activityTypeLabels: Record<string, string> = {
    created: "criado",
    stage_change: "mudança de etapa",
    assignment: "atribuição",
    message_sent: "mensagem enviada",
    handoff: "repasse",
    qualification_update: "qualificação",
    note: "nota",
  };

  // Activity type badge variants
  const activityTypeBadges: Record<string, "success" | "brand" | "info" | "warning" | "default"> = {
    created: "success",
    stage_change: "brand",
    assignment: "info",
    message_sent: "info",
    handoff: "warning",
    qualification_update: "warning",
    note: "default",
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-text-primary">Painel</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-text-secondary mb-1">Valor Total do Pipeline</p>
          <p className="text-2xl font-bold text-semantic-success tabular-nums">
            ${totalPipelineValue.toLocaleString()}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary mb-1">Leads Ativos</p>
          <p className="text-2xl font-bold text-brand-500 tabular-nums">{totalLeads}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary mb-1">Repasses Pendentes</p>
          <p className="text-2xl font-bold text-semantic-warning tabular-nums">{stats.pendingHandoffs}</p>
        </Card>
        <Card>
          <p className="text-sm text-text-secondary mb-1">Fontes de Leads</p>
          <p className="text-2xl font-bold text-brand-500 tabular-nums">{stats.leadsBySource.length}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Pipeline por Etapa</h3>
          {stats.pipelineStats.length === 0 ? (
            <p className="text-text-muted">Nenhum lead no pipeline ainda.</p>
          ) : (
            <div className="space-y-3">
              {stats.pipelineStats.map((stage) => {
                const percentage = totalPipelineValue > 0
                  ? (stage.totalValue / totalPipelineValue) * 100
                  : 0;
                return (
                  <div key={stage.stageId}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text-primary">{stage.stageName}</span>
                      <span className="text-sm text-text-secondary tabular-nums">
                        {stage.leadCount} leads - ${stage.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-surface-sunken rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${Math.max(percentage, 2)}%`,
                          backgroundColor: stage.stageColor,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Leads by Source */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Leads por Fonte</h3>
          {stats.leadsBySource.length === 0 ? (
            <p className="text-text-muted">Nenhum dado de fonte ainda.</p>
          ) : (
            <div className="space-y-2">
              {stats.leadsBySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface-sunken rounded">
                  <span className="text-sm font-medium text-text-primary">{source.sourceName}</span>
                  <Badge variant="brand" className="tabular-nums">
                    {source.count}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Team Performance */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Desempenho da Equipe</h3>
          {stats.teamPerformance.length === 0 ? (
            <p className="text-text-muted">Nenhum dado de equipe ainda.</p>
          ) : (
            <div className="space-y-2">
              {stats.teamPerformance.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-surface-sunken rounded">
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={member.memberName}
                      type={member.memberType as "human" | "ai"}
                      size="sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{member.memberName}</span>
                      <Badge variant={member.memberType === "ai" ? "warning" : "info"}>
                        {member.memberType === "ai" ? "IA" : "Humano"}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">
                    {member.leadCount} leads
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Atividade Recente</h3>
          {stats.recentActivities.length === 0 ? (
            <p className="text-text-muted">Nenhuma atividade recente.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentActivities.map((activity) => {
                const badgeVariant = activityTypeBadges[activity.type] || "default";
                const typeLabel = activityTypeLabels[activity.type] || activity.type.replace("_", " ");

                return (
                  <div key={activity._id} className="flex items-start gap-3 text-sm">
                    <Badge variant={badgeVariant} className="shrink-0">
                      {typeLabel}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary truncate">{activity.content || typeLabel}</p>
                      <p className="text-text-muted text-xs">
                        {activity.actorName} - {new Date(activity.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
