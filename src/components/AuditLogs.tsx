import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
;
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import type { AppOutletContext } from "@/components/layout/AuthLayout";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import {
  Shield,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Monitor,
  Globe,
} from "lucide-react";
import {
  ENTITY_ICONS,
  ACTION_LABELS,
  FIELD_LABELS,
  buildClientDescription,
  formatRelativeTime,
  formatDiffValue,
  groupLogsByDate,
} from "@/lib/auditUtils";

export function AuditLogs() {
  const { organizationId } = useOutletContext<AppOutletContext>();
  const { can } = usePermissions(organizationId);

  // Filter state
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("all");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedActorId, setSelectedActorId] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // UI state
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const currentPage = cursorStack.length - 1;

  // Reset pagination helper
  const resetPagination = () => {
    setCursorStack([null]);
  };

  // Compute timestamps from preset/custom
  const { startTimestamp, endTimestamp } = useMemo(() => {
    const now = Date.now();
    if (datePreset === "24h")
      return { startTimestamp: now - 86400000, endTimestamp: now };
    if (datePreset === "7d")
      return { startTimestamp: now - 7 * 86400000, endTimestamp: now };
    if (datePreset === "30d")
      return { startTimestamp: now - 30 * 86400000, endTimestamp: now };
    if (datePreset === "custom") {
      return {
        startTimestamp: startDate ? new Date(startDate).getTime() : 0,
        endTimestamp: endDate
          ? new Date(endDate + "T23:59:59").getTime()
          : 0,
      };
    }
    return { startTimestamp: 0, endTimestamp: 0 };
  }, [datePreset, startDate, endDate]);

  // Queries
  const crpc = useCRPC();
  const { data: auditLogs } = useQuery(crpc.auditLogs.getAuditLogs.queryOptions({
    organizationId,
    severity:
      selectedSeverity !== "all"
        ? (selectedSeverity as "low" | "medium" | "high" | "critical")
        : undefined,
    entityType: selectedEntityType !== "all" ? selectedEntityType : undefined,
    action:
      selectedAction !== "all"
        ? (selectedAction as
            | "create"
            | "update"
            | "delete"
            | "move"
            | "assign"
            | "handoff")
        : undefined,
    actorId:
      selectedActorId !== "all"
        ? (selectedActorId as Id<"teamMembers">)
        : undefined,
    startDate: startTimestamp || undefined,
    endDate: endTimestamp || undefined,
    cursor: cursorStack[currentPage] ?? undefined,
  }));

  const { data: filters } = useQuery(crpc.auditLogs.getAuditLogFilters.queryOptions({
    organizationId,
  }));

  // Active filters tracking
  const activeFilters = useMemo(() => {
    const result: { key: string; label: string }[] = [];

    if (selectedSeverity !== "all") {
      const severityLabels: Record<string, string> = {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
      };
      result.push({
        key: "severity",
        label: `Severidade: ${severityLabels[selectedSeverity]}`,
      });
    }

    if (selectedEntityType !== "all") {
      const entityLabel =
        filters?.entityTypes.find((t) => t.value === selectedEntityType)
          ?.label || selectedEntityType;
      result.push({ key: "entityType", label: `Tipo: ${entityLabel}` });
    }

    if (selectedAction !== "all") {
      const actionLabel =
        filters?.actions.find((a) => a.value === selectedAction)?.label ||
        selectedAction;
      result.push({ key: "action", label: `Action: ${actionLabel}` });
    }

    if (selectedActorId !== "all") {
      const actorName =
        filters?.actors.find((a) => a.id === selectedActorId)?.name ||
        "Desconhecido";
      result.push({ key: "actorId", label: `Ator: ${actorName}` });
    }

    if (startDate || endDate) {
      const start = startDate
        ? new Date(startDate).toLocaleDateString("en-US")
        : "start";
      const end = endDate
        ? new Date(endDate).toLocaleDateString("en-US")
        : "now";
      result.push({ key: "date", label: `Period: ${start} to ${end}` });
    }

    return result;
  }, [
    selectedSeverity,
    selectedEntityType,
    selectedAction,
    selectedActorId,
    startDate,
    endDate,
    filters,
  ]);

  // Handlers
  const handlePresetClick = (preset: string) => {
    setDatePreset(preset);
    if (preset !== "custom") {
      setStartDate("");
      setEndDate("");
    }
    resetPagination();
  };

  const handleNextPage = () => {
    if (auditLogs?.nextCursor) {
      setCursorStack((prev) => [...prev, auditLogs.nextCursor]);
    }
  };

  const handlePrevPage = () => {
    setCursorStack((prev) => prev.slice(0, -1));
  };

  const clearFilter = (key: string) => {
    switch (key) {
      case "severity":
        setSelectedSeverity("all");
        break;
      case "entityType":
        setSelectedEntityType("all");
        break;
      case "action":
        setSelectedAction("all");
        break;
      case "actorId":
        setSelectedActorId("all");
        break;
      case "date":
        setDatePreset("all");
        setStartDate("");
        setEndDate("");
        break;
    }
    resetPagination();
  };

  const clearAllFilters = () => {
    setSelectedSeverity("all");
    setSelectedEntityType("all");
    setSelectedAction("all");
    setSelectedActorId("all");
    setDatePreset("all");
    setStartDate("");
    setEndDate("");
    resetPagination();
  };

  const handleExportCsv = () => {
    if (!auditLogs || auditLogs.logs.length === 0) {
      toast.error("No data to export.");
      return;
    }
    const headers = [
      "Date/Time",
      "Action",
      "Tipo",
      "ID",
      "Severidade",
      "Ator",
      "Actor Type",
      "Description",
    ];
    const rows = auditLogs.logs.map((log) => {
      const desc = log.description || buildClientDescription(log);
      return [
        new Date(log.createdAt).toLocaleString("en-US"),
        log.action,
        log.entityType,
        log.entityId,
        log.severity,
        log.actorName,
        log.actorType,
        `"${String(desc).replace(/"/g, '""')}"`,
      ].join(",");
    });
    const csv = "\ufeff" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!can("auditLogs", "view")) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20">
        <Shield size={48} className="text-text-muted" />
        <p className="text-text-secondary text-sm">You do not have permission to access audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-500/10">
            <Shield size={24} className="text-brand-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary">
              Audit Logs
            </h2>
            <p className="text-sm text-text-secondary">
              Monitor all activity in your organization
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleExportCsv}>
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="p-4 space-y-4">
          {/* Row 1: Date presets */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {["all", "24h", "7d", "30d", "custom"].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                    datePreset === preset
                      ? "bg-brand-500/20 text-brand-400"
                      : "bg-surface-overlay text-text-secondary hover:text-text-primary"
                  )}
                >
                  {preset === "all"
                    ? "All time"
                    : preset === "24h"
                    ? "Last 24h"
                    : preset === "7d"
                    ? "7 days"
                    : preset === "30d"
                    ? "30 days"
                    : "Custom"}
                </button>
              ))}
            </div>
            {datePreset === "custom" && (
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    resetPagination();
                  }}
                  className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3 py-2 text-sm max-w-[150px] focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  style={{ fontSize: "16px" }}
                />
                <span className="text-text-muted text-sm">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    resetPagination();
                  }}
                  className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3 py-2 text-sm max-w-[150px] focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                  style={{ fontSize: "16px" }}
                />
              </div>
            )}
          </div>

          {/* Row 2: Filter dropdowns */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            {/* Actor dropdown */}
            <select
              value={selectedActorId}
              onChange={(e) => {
                setSelectedActorId(e.target.value);
                resetPagination();
              }}
              className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              style={{ fontSize: "16px" }}
            >
              <option value="all">All Actors</option>
              {filters?.actors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.type === "ai" ? "AI" : "Human"})
                </option>
              ))}
            </select>

            {/* Action dropdown */}
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                resetPagination();
              }}
              className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              style={{ fontSize: "16px" }}
            >
              <option value="all">All Actions</option>
              {filters?.actions.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* Entity type dropdown */}
            <select
              value={selectedEntityType}
              onChange={(e) => {
                setSelectedEntityType(e.target.value);
                resetPagination();
              }}
              className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              style={{ fontSize: "16px" }}
            >
              <option value="all">All Types</option>
              {filters?.entityTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            {/* Severity dropdown */}
            <select
              value={selectedSeverity}
              onChange={(e) => {
                setSelectedSeverity(e.target.value);
                resetPagination();
              }}
              className="bg-surface-raised border border-border-strong text-text-primary rounded-field px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              style={{ fontSize: "16px" }}
            >
              <option value="all">Todas as Severidades</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Row 3: Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap border-t border-border pt-3 mt-1">
              {activeFilters.map((f) => (
                <span
                  key={f.key}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-medium"
                >
                  {f.label}
                  <button
                    onClick={() => clearFilter(f.key)}
                    className="hover:text-brand-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-xs text-text-muted hover:text-text-primary ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Log List */}
      <Card>
        {/* Loading skeleton */}
        {!auditLogs && (
          <div className="divide-y divide-border">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4">
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-3 w-16 shrink-0" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {auditLogs && auditLogs.logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-surface-overlay flex items-center justify-center mb-4">
              {activeFilters.length > 0 ? (
                <Search size={32} className="text-text-muted" />
              ) : (
                <Shield size={32} className="text-text-muted" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {activeFilters.length > 0
                ? "No logs found"
                : "No audit logs"}
            </h3>
            <p className="text-sm text-text-secondary text-center max-w-md">
              {activeFilters.length > 0
                ? "Try adjusting filters or expanding the date range."
                : "Audit logs appear here automatically as organization activity happens."}
            </p>
            {activeFilters.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={clearAllFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Log entries with date grouping */}
        {auditLogs && auditLogs.logs.length > 0 && (
          <>
            {groupLogsByDate(auditLogs.logs).map((group, gi) => (
                <div key={gi}>
                  {/* Date group header */}
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-sunken">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      {group.label}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-text-muted">
                      {group.logs.length}{" "}
                      {group.logs.length === 1 ? "events?" : "events?s"}
                    </span>
                  </div>

                  {/* Logs in group */}
                  <div className="divide-y divide-border">
                    {group.logs.map((log) => {
                      const EntityIcon =
                        ENTITY_ICONS[log.entityType] || Globe;
                      const actionInfo = ACTION_LABELS[log.action] || {
                        label: log.action,
                        variant: "default",
                      };
                      const isExpanded = expandedLogId === log._id;
                      const hasChanges =
                        log.changes &&
                        (log.changes.before || log.changes.after);
                      const description =
                        log.description || buildClientDescription(log);

                      return (
                        <div key={log._id}>
                          <button
                            onClick={() =>
                              hasChanges &&
                              setExpandedLogId(isExpanded ? null : log._id)
                            }
                            className={cn(
                              "w-full text-left flex items-start gap-3 p-4 transition-colors",
                              hasChanges
                                ? "hover:bg-surface-overlay cursor-pointer"
                                : "cursor-default"
                            )}
                          >
                            {/* Entity icon */}
                            <div className="p-2 rounded-lg bg-surface-overlay shrink-0">
                              <EntityIcon size={16} className="text-text-muted" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              {/* Row 1: badges */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={actionInfo.variant as any}>
                                  {actionInfo.label}
                                </Badge>
                                {log.severity !== "low" && (
                                  <span
                                    className={cn(
                                      "text-xs",
                                      log.severity === "medium" &&
                                        "text-semantic-warning",
                                      log.severity === "high" &&
                                        "text-semantic-error",
                                      log.severity === "critical" &&
                                        "text-semantic-error"
                                    )}
                                  >
                                    ●
                                  </span>
                                )}
                              </div>
                              {/* Row 2: description */}
                              <p className="font-medium text-text-primary text-sm mt-1 truncate">
                                {description}
                              </p>
                              {/* Row 3: actor */}
                              <div className="flex items-center gap-2 mt-1.5">
                                <Avatar
                                  name={log.actorName}
                                  type={
                                    log.actorMemberType === "ai" ? "ai" : "human"
                                  }
                                  size="sm"
                                  className="scale-75 origin-left"
                                />
                                <span className="text-xs text-text-secondary">
                                  {log.actorName}
                                </span>
                                <span className="text-xs text-text-muted">·</span>
                                <span className="text-xs text-text-muted">
                                  {log.actorType === "ai"
                                    ? "AI"
                                    : log.actorType === "system"
                                    ? "Sistema"
                                    : "Human"}
                                </span>
                              </div>
                            </div>

                            {/* Right: timestamp + chevron */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span
                                className="text-xs text-text-muted"
                                title={new Date(log.createdAt).toLocaleString(
                                  "en-US"
                                )}
                              >
                                {formatRelativeTime(log.createdAt)}
                              </span>
                              {hasChanges && (
                                <ChevronDown
                                  size={14}
                                  className={cn(
                                    "text-text-muted transition-transform duration-200",
                                    isExpanded && "rotate-180"
                                  )}
                                />
                              )}
                            </div>
                          </button>

                          {/* Expanded detail panel */}
                          {isExpanded && hasChanges && (
                            <div className="pl-[60px] pr-4 pb-4">
                              {/* Changes diff table */}
                              {(() => {
                                const afterKeys = log.changes.after
                                  ? Object.keys(log.changes.after)
                                  : [];
                                const beforeKeys = log.changes.before
                                  ? Object.keys(log.changes.before)
                                  : [];
                                const allKeys = [
                                  ...new Set([...beforeKeys, ...afterKeys]),
                                ];

                                if (allKeys.length === 0) return null;

                                return (
                                  <div className="rounded-lg border border-border overflow-hidden">
                                    {/* Header */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 bg-surface-sunken">
                                      <div className="px-3 py-2 text-xs font-medium text-text-muted">
                                        Campo
                                      </div>
                                      <div className="px-3 py-2 text-xs font-medium text-semantic-error/70 hidden sm:block">
                                        Antes
                                      </div>
                                      <div className="px-3 py-2 text-xs font-medium text-semantic-success/70 hidden sm:block">
                                        Depois
                                      </div>
                                    </div>
                                    {/* Rows */}
                                    <div className="divide-y divide-border">
                                      {allKeys.map((key) => {
                                        const before = log.changes.before?.[key];
                                        const after = log.changes.after?.[key];
                                        const label = FIELD_LABELS[key] || key;
                                        return (
                                          <div key={key}>
                                            {/* Desktop: 3-col grid */}
                                            <div className="hidden sm:grid sm:grid-cols-3 bg-surface-raised">
                                              <div className="px-3 py-2 text-xs text-text-secondary font-medium">
                                                {label}
                                              </div>
                                              <div className="px-3 py-2 text-xs text-text-muted">
                                                {formatDiffValue(before)}
                                              </div>
                                              <div className="px-3 py-2 text-xs text-text-primary">
                                                {formatDiffValue(after)}
                                              </div>
                                            </div>
                                            {/* Mobile: stacked */}
                                            <div className="sm:hidden px-3 py-2 bg-surface-raised space-y-1">
                                              <div className="text-xs text-text-secondary font-medium">
                                                {label}
                                              </div>
                                              <div className="text-xs">
                                                <span className="text-text-muted">
                                                  {formatDiffValue(before)}
                                                </span>
                                                <span className="text-text-muted mx-1">
                                                  →
                                                </span>
                                                <span className="text-text-primary">
                                                  {formatDiffValue(after)}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* IP + User Agent (for HTTP API calls) */}
                              {(log.ipAddress || log.userAgent) && (
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                                  {log.ipAddress && (
                                    <span className="flex items-center gap-1">
                                      <Monitor size={10} /> {log.ipAddress}
                                    </span>
                                  )}
                                  {log.userAgent && (
                                    <span className="truncate">
                                      {log.userAgent}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Pagination */}
            <div className="flex items-center justify-between py-3 px-4 border-t border-border">
              <span className="text-xs text-text-muted">
                Page {currentPage + 1}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={handlePrevPage}
                >
                  <ChevronLeft size={16} />
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!auditLogs.hasMore}
                  onClick={handleNextPage}
                >
                  Next
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
