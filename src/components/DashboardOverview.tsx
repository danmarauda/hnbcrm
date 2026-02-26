import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Tab } from "@/components/layout/BottomTabBar";
import { TAB_ROUTES } from "@/lib/routes";
import type { AppOutletContext } from "@/components/layout/AuthLayout";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";
import { RecentActivityWidget } from "@/components/RecentActivityWidget";
import { UpcomingTasksWidget } from "@/components/UpcomingTasksWidget";
import { UpcomingEventsWidget } from "@/components/UpcomingEventsWidget";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useCRPC } from "@/lib/crpc";
import { Id } from "../../convex/_generated/dataModel";
import { staggerContainer } from "@/lib/animations";
import {
  Handshake,
  DollarSign,
  Target,
  ArrowRightLeft,
  Users,
  Kanban,
  MessageSquare,
  Contact2,
  ScrollText,
  Globe,
  Webhook,
  Bookmark,
  Server,
  Paperclip,
  Zap,
  Search,
  Layers,
  Bot,
  Bell,
  FileUp,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export function DashboardOverview() {
  const { organizationId } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();
  const onTabChange = (tab: Tab) => navigate(TAB_ROUTES[tab]);
  const crpc = useCRPC();
  const { data: stats } = useQuery(crpc.dashboard.getDashboardStats.queryOptions({ organizationId }));
  const { data: currentMember } = useQuery(crpc.teamMembers.getCurrentTeamMember.queryOptions({ organizationId }));

  if (!stats || !currentMember) return <LoadingSkeleton />;

  const totalPipelineValue = stats.pipelineStats.reduce((sum, b) => sum + b.totalValue, 0);
  const totalLeads = stats.pipelineStats.reduce((sum, b) => sum + b.totalLeads, 0);
  const firstName = currentMember.name.split(" ")[0];

  return (
    <div className="space-y-8 max-w-7xl relative">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.02),transparent)]" />
      <div className="absolute inset-0 -z-10 grid-overlay opacity-30" />

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl glass flex items-center justify-center shrink-0 border border-white/10">
          <Handshake size={28} className="text-white/80" />
        </div>
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary tracking-wide">Hello, {firstName}!</h1>
          <p className="text-sm md:text-base text-text-secondary">{stats.organizationName} — Humans & bots, together in your CRM.</p>
        </div>
      </motion.div>

      <OnboardingChecklist organizationId={organizationId} />

      {/* Stats Bento Grid */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bento-grid grid-cols-2 md:grid-cols-4">
        <StatCard icon={DollarSign} label="Pipeline Value" value={formatCurrency(totalPipelineValue)} trend="+12%" />
        <StatCard icon={Target} label="Active Leads" value={totalLeads.toString()} trend="+5" />
        <StatCard icon={ArrowRightLeft} label="Pending Handoffs" value={stats.pendingHandoffs.toString()} highlight={stats.pendingHandoffs > 0} />
        <StatCard icon={Users} label="Team Members" value={stats.teamMemberCount.toString()} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-3 tracking-wide uppercase text-sm">Quick Actions</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          <QuickActionCard icon={Kanban} label="Go to Pipeline" onClick={() => onTabChange("board")} />
          <QuickActionCard icon={MessageSquare} label="Inbox" onClick={() => onTabChange("inbox")} />
          <QuickActionCard icon={ArrowRightLeft} label="View Handoffs" onClick={() => onTabChange("handoffs")} />
          <QuickActionCard icon={Users} label="Manage Team" onClick={() => onTabChange("team")} />
        </div>
      </motion.div>

      {/* Pipeline + Team Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bento-grid grid-cols-1 lg:grid-cols-2">
        <PipelineByBoardWidget pipelineStats={stats.pipelineStats} />
        <Card variant="bento" className="p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Team Performance</h3>
          {stats.teamPerformance.length === 0 ? (
            <p className="text-text-muted">No team data yet.</p>
          ) : (
            <div className="space-y-2">
              {stats.teamPerformance.map((member, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between p-2 glass rounded-lg">
                  <div className="flex items-center gap-2">
                    <Avatar name={member.memberName} type={member.memberType as "human" | "ai"} size="sm" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{member.memberName}</span>
                      <Badge variant={member.memberType === "ai" ? "warning" : "info"}>{member.memberType === "ai" ? "AI" : "Human"}</Badge>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-text-primary tabular-nums">{member.leadCount} leads</span>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      <MyTasksWidget organizationId={organizationId} onTabChange={onTabChange} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-grid grid-cols-1 lg:grid-cols-2">
        <UpcomingTasksWidget organizationId={organizationId} />
        <UpcomingEventsWidget organizationId={organizationId} />
      </motion.div>

      {/* Features */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4 tracking-wide uppercase text-sm">Platform</h2>
        <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {existingFeatures(totalLeads, totalPipelineValue, stats, onTabChange).map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + idx * 0.03 }}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Coming Soon */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-lg font-semibold text-text-primary tracking-wide uppercase text-sm">Coming Soon</h2>
          <Badge variant="glow">Next Features</Badge>
        </div>
        <div className="bento-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {comingSoonFeatures.map((feature, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + idx * 0.03 }}>
              <ComingSoonCard {...feature} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <RecentActivityWidget organizationId={organizationId} />
    </div>
  );
}

// Tasks Widget
const TASK_PRIORITY_BADGE: Record<string, { variant: "default" | "info" | "warning" | "error"; label: string }> = {
  low: { variant: "default", label: "Low" },
  medium: { variant: "info", label: "Medium" },
  high: { variant: "warning", label: "High" },
  urgent: { variant: "error", label: "Urgent" },
};

function MyTasksWidget({ organizationId, onTabChange }: { organizationId: Id<"organizations">; onTabChange: (tab: Tab) => void }) {
  const crpc = useCRPC();
  const [now] = useState(() => Date.now());
  const { data: myTasks } = useQuery(crpc.tasks.getMyTasks.queryOptions({ organizationId }));
  const { data: taskCounts } = useQuery(crpc.tasks.getTaskCounts.queryOptions({ organizationId, now }));
  const { mutateAsync: completeTask } = useMutation(crpc.tasks.completeTask.mutationOptions());

  const handleComplete = async (taskId: Id<"tasks">) => {
    try { await completeTask({ taskId }); toast.success("Task completed!"); } catch { toast.error("Failed to complete task"); }
  };

  return (
    <Card variant="bento" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-text-primary">My Tasks</h3>
          {taskCounts && taskCounts.overdue > 0 && <Badge variant="error">{taskCounts.overdue} overdue</Badge>}
        </div>
        <button onClick={() => onTabChange("tasks")} className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors font-medium">
          View all <ChevronRight size={16} />
        </button>
      </div>
      {myTasks === undefined ? (
        <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
      ) : myTasks.length === 0 ? (
        <p className="text-sm text-text-muted py-4 text-center">No pending tasks.</p>
      ) : (
        <div className="space-y-1">
          {myTasks.slice(0, 5).map((task) => {
            const pb = TASK_PRIORITY_BADGE[task.priority] || TASK_PRIORITY_BADGE.medium;
            const isOverdue = task.dueDate && task.dueDate < now && task.status !== "completed";
            return (
              <div key={task._id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <button onClick={() => handleComplete(task._id)} className="shrink-0 w-5 h-5 rounded-full border-2 border-glass-border hover:border-white/30 flex items-center justify-center transition-colors" aria-label="Complete task" />
                <span className="flex-1 text-sm text-text-primary truncate">{task.title}</span>
                <Badge variant={pb.variant} className="text-[10px] shrink-0">{pb.label}</Badge>
                {task.dueDate && <span className={cn("text-xs font-medium tabular-nums shrink-0", isOverdue ? "text-semantic-error" : "text-text-muted")}>{formatTaskRelativeDate(task.dueDate, now)}</span>}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function formatTaskRelativeDate(dueDate: number, now: number): string {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const dueDay = new Date(dueDate); dueDay.setHours(0, 0, 0, 0);
  const diffDays = Math.round((dueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < -1) return `${Math.abs(diffDays)}d ago`;
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `${diffDays}d`;
  return new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

// Pipeline Widget
interface BoardPipelineStats {
  boardId: string; boardName: string; boardColor: string; boardOrder: number; totalLeads: number; totalValue: number;
  stages: { stageId: string; stageName: string; stageColor: string; stageOrder: number; leadCount: number; totalValue: number; isClosedWon: boolean; isClosedLost: boolean }[];
}

function PipelineByBoardWidget({ pipelineStats }: { pipelineStats: BoardPipelineStats[] }) {
  const [selectedBoardIdx, setSelectedBoardIdx] = useState(0);
  if (pipelineStats.length === 0) return <Card variant="bento" className="p-6"><h3 className="text-lg font-semibold text-text-primary mb-4">Pipeline by Board</h3><p className="text-text-muted">No leads in pipeline yet.</p></Card>;
  const safeIdx = selectedBoardIdx >= 0 && selectedBoardIdx < pipelineStats.length ? selectedBoardIdx : 0;
  const selectedBoard = pipelineStats[safeIdx];

  return (
    <Card variant="bento" className="p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Pipeline by Board</h3>
      {pipelineStats.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3">
          {pipelineStats.map((board, idx) => (
            <button key={board.boardId} onClick={() => setSelectedBoardIdx(idx)} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200", idx === safeIdx ? "bg-white text-black" : "glass text-text-secondary hover:bg-glass-bg-hover")}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: board.boardColor }} />
              {board.boardName}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-glass-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedBoard.boardColor }} />
          <span className="text-sm font-medium text-text-primary">{selectedBoard.boardName}</span>
        </div>
        <span className="text-sm text-text-secondary tabular-nums">{selectedBoard.totalLeads} leads · ${selectedBoard.totalValue.toLocaleString("en-US")}</span>
      </div>
      <div className="space-y-3">
        {selectedBoard.stages.map((stage) => {
          const percentage = selectedBoard.totalValue > 0 ? (stage.totalValue / selectedBoard.totalValue) * 100 : 0;
          return (
            <div key={stage.stageId}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">{stage.stageName}</span>
                  {stage.isClosedWon && <Badge variant="success" className="text-[10px] px-1.5 py-0">Won</Badge>}
                  {stage.isClosedLost && <Badge variant="error" className="text-[10px] px-1.5 py-0">Lost</Badge>}
                </div>
                <span className="text-sm text-text-secondary tabular-nums">{stage.leadCount} leads · ${stage.totalValue.toLocaleString("en-US")}</span>
              </div>
              <div className="w-full bg-surface-sunken rounded-full h-2 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(percentage, 2)}%` }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-2 rounded-full" style={{ backgroundColor: stage.stageColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Stat Card
function StatCard({ icon: Icon, label, value, trend, highlight }: { icon: React.ElementType; label: string; value: string; trend?: string; highlight?: boolean }) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
      <Card variant={highlight ? "bentoBrand" : "bento"} asMotion className="p-4 md:p-5">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl glass flex items-center justify-center shrink-0">
            <Icon size={18} className="text-white/80" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-secondary truncate">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tabular-nums text-text-primary">{value}</p>
              {trend && <span className="text-xs font-medium text-semantic-success flex items-center gap-0.5"><TrendingUp size={12} />{trend}</span>}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function QuickActionCard({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return <Card variant="bento" asMotion onClick={onClick} className="min-w-[140px] shrink-0 md:min-w-0 md:shrink !p-3 flex items-center gap-3 cursor-pointer"><div className="w-8 h-8 rounded-lg glass flex items-center justify-center shrink-0"><Icon size={18} className="text-white/80" /></div><span className="text-sm font-medium text-text-primary">{label}</span></Card>;
}

function FeatureCard({ icon: Icon, title, description, dataBadge, onClick }: { icon: React.ElementType; title: string; description: string; dataBadge?: string; onClick: () => void }) {
  return (
    <Card variant="bento" asMotion onClick={onClick} className="flex flex-col gap-3 cursor-pointer p-5">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl glass flex items-center justify-center shrink-0"><Icon size={20} className="text-white/80" /></div>
        {dataBadge && <Badge variant="glow" className="text-xs">{dataBadge}</Badge>}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        <p className="text-xs text-text-muted mt-1 line-clamp-2">{description}</p>
      </div>
    </Card>
  );
}

function ComingSoonCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <Card variant="glass" className="flex flex-col gap-3 opacity-60 p-5">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl glass flex items-center justify-center shrink-0"><Icon size={20} className="text-text-muted" /></div>
        <Badge variant="warning" className="text-xs">Soon</Badge>
      </div>
      <div><h4 className="text-sm font-semibold text-text-secondary">{title}</h4><p className="text-xs text-text-muted mt-1 line-clamp-2">{description}</p></div>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center gap-4"><Skeleton variant="circle" className="h-14 w-14 rounded-2xl" /><div className="space-y-2 flex-1"><Skeleton className="h-7 w-48" /><Skeleton className="h-4 w-72" /></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="card" className="h-24" />)}</div>
      <Skeleton variant="card" className="h-12" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Skeleton variant="card" className="h-48" /><Skeleton variant="card" className="h-48" /></div>
    </div>
  );
}

function existingFeatures(totalLeads: number, totalPipelineValue: number, stats: { pendingHandoffs: number; teamMemberCount: number }, onTabChange: (tab: Tab) => void) {
  return [
    { icon: Kanban, title: "Kanban Pipeline", description: "Manage leads with drag-and-drop between configurable stages", dataBadge: `${totalLeads} leads`, onClick: () => onTabChange("board") },
    { icon: Target, title: "Lead Management", description: "BANT qualification, temperature, priority, and custom fields", dataBadge: formatCurrency(totalPipelineValue), onClick: () => onTabChange("board") },
    { icon: Contact2, title: "Contacts", description: "Complete registry with search by name, email, and company", onClick: () => onTabChange("contacts") },
    { icon: MessageSquare, title: "Multi-channel Conversations", description: "WhatsApp, Telegram, email, and webchat in a unified inbox", dataBadge: "Multichannel", onClick: () => onTabChange("inbox") },
    { icon: ArrowRightLeft, title: "AI-Human Handoffs", description: "Intelligent lead transfers between bots and humans", dataBadge: stats.pendingHandoffs > 0 ? `${stats.pendingHandoffs} pending` : undefined, onClick: () => onTabChange("handoffs") },
    { icon: Users, title: "Collaborative Team", description: "Manage human members and AI bots as a unified team", dataBadge: `${stats.teamMemberCount} members`, onClick: () => onTabChange("team") },
    { icon: ScrollText, title: "Complete Audit", description: "Detailed history of all actions with filters and export", dataBadge: "Exportable", onClick: () => onTabChange("audit") },
    { icon: Globe, title: "REST API", description: "19 authenticated endpoints for external integrations", dataBadge: "19 endpoints", onClick: () => onTabChange("settings") },
    { icon: Webhook, title: "Webhook System", description: "Real-time notifications for CRM events via HTTP", dataBadge: "Real-time", onClick: () => onTabChange("settings") },
    { icon: Bookmark, title: "Saved Views", description: "Custom filters for leads and contacts with sharing", onClick: () => onTabChange("board") },
  ];
}

const comingSoonFeatures = [
  { icon: Server, title: "MCP Server", description: "Integration protocol with external AI agents and tools" },
  { icon: Paperclip, title: "Files & Attachments", description: "Upload and storage of documents linked to leads" },
  { icon: Zap, title: "Automation Engine", description: "Automatic rules to move leads, assign, and notify" },
  { icon: Search, title: "Command Palette", description: "Quick search with Cmd+K to access any CRM resource" },
  { icon: Layers, title: "Bulk Operations", description: "Update, move, or assign multiple leads at once" },
  { icon: Bot, title: "AI Co-pilot", description: "Intelligent suggestions for responses and next steps" },
  { icon: Bell, title: "Notifications", description: "Real-time alerts about leads, handoffs, and team activity" },
  { icon: FileUp, title: "Import/Export", description: "CSV import and bulk data export to spreadsheets" },
];

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toLocaleString("en-US")}`;
}
