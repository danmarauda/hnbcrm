import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

interface LeadDetailPanelProps {
  leadId: Id<"leads">;
  organizationId: Id<"organizations">;
  onClose: () => void;
}

type Tab = "conversation" | "details" | "activity";

export function LeadDetailPanel({ leadId, organizationId, onClose }: LeadDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("conversation");

  const tabLabels: Record<Tab, string> = {
    conversation: "Conversa",
    details: "Detalhes",
    activity: "Atividade",
  };

  return (
    <SlideOver open={true} onClose={onClose} title="Detalhes do Lead">
      {/* Tab Bar */}
      <div className="flex border-b border-border bg-surface-raised">
        {(["conversation", "details", "activity"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium text-center transition-colors",
              activeTab === tab
                ? "text-brand-500 border-b-2 border-brand-500"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "conversation" && (
          <ConversationTab
            leadId={leadId}
            organizationId={organizationId}
          />
        )}
        {activeTab === "details" && (
          <DetailsTab leadId={leadId} />
        )}
        {activeTab === "activity" && (
          <ActivityTab leadId={leadId} />
        )}
      </div>
    </SlideOver>
  );
}

/* ------------------------------------------------------------------ */
/*  Conversation Tab                                                   */
/* ------------------------------------------------------------------ */

function ConversationTab({
  leadId,
  organizationId,
}: {
  leadId: Id<"leads">;
  organizationId: Id<"organizations">;
}) {
  const [messageText, setMessageText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.conversations.getConversations, {
    organizationId,
    leadId,
  });

  const firstConversation = conversations && conversations.length > 0 ? conversations[0] : null;

  const messages = useQuery(
    api.conversations.getMessages,
    firstConversation ? { conversationId: firstConversation._id } : "skip"
  );

  const sendMessage = useMutation(api.conversations.sendMessage);
  const createConversation = useMutation(api.conversations.createConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || sending) return;
    setSending(true);

    try {
      let conversationId: Id<"conversations">;

      if (firstConversation) {
        conversationId = firstConversation._id;
      } else {
        conversationId = await createConversation({
          organizationId,
          leadId,
          channel: "internal",
        });
      }

      await sendMessage({
        conversationId,
        content: messageText.trim(),
        contentType: "text",
        isInternal,
      });

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSenderLabel = (senderType: string): string => {
    const labels: Record<string, string> = {
      contact: "Contato",
      ai: "IA",
      human: "Humano",
    };
    return labels[senderType] || senderType;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!conversations && (
          <div className="flex justify-center py-8">
            <Spinner size="md" />
          </div>
        )}

        {conversations && conversations.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">
            Nenhuma conversa ainda. Envie uma mensagem para iniciar.
          </div>
        )}

        {messages &&
          messages.map((msg) => {
            const isOutbound = msg.direction === "outbound";
            const isInternalMsg = msg.direction === "internal";

            return (
              <div
                key={msg._id}
                className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                    isInternalMsg
                      ? "bg-surface-overlay border-2 border-dashed border-semantic-warning/40 text-text-primary"
                      : isOutbound
                      ? "bg-brand-600 text-white"
                      : "bg-surface-sunken text-text-primary"
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-medium mb-1",
                      isInternalMsg
                        ? "text-semantic-warning"
                        : isOutbound
                        ? "text-brand-100"
                        : "text-text-muted"
                    )}
                  >
                    {getSenderLabel(msg.senderType)}
                    {isInternalMsg && " (nota interna)"}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <div
                    className={cn(
                      "text-xs mt-1",
                      isInternalMsg
                        ? "text-semantic-warning/80"
                        : isOutbound
                        ? "text-brand-100"
                        : "text-text-muted"
                    )}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="border-t border-border p-4 bg-surface-raised">
        <div className="flex items-center gap-2 mb-2">
          <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
              className="rounded border-border-strong text-semantic-warning focus:ring-semantic-warning accent-semantic-warning"
            />
            Nota interna
          </label>
        </div>
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isInternal ? "Escreva uma nota interna..." : "Digite uma mensagem..."}
            rows={2}
            className="flex-1 px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
            style={{ fontSize: "16px" }}
          />
          <Button
            onClick={handleSend}
            disabled={!messageText.trim() || sending}
            variant="primary"
            size="md"
            className="self-end"
          >
            {sending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Details Tab                                                        */
/* ------------------------------------------------------------------ */

function DetailsTab({ leadId }: { leadId: Id<"leads"> }) {
  const lead = useQuery(api.leads.getLead, { leadId });
  const updateLead = useMutation(api.leads.updateLead);
  const updateQualification = useMutation(api.leads.updateLeadQualification);

  const [title, setTitle] = useState("");
  const [value, setValue] = useState(0);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [temperature, setTemperature] = useState<"cold" | "warm" | "hot">("cold");
  const [tags, setTags] = useState("");

  const [budget, setBudget] = useState(false);
  const [authority, setAuthority] = useState(false);
  const [need, setNeed] = useState(false);
  const [timeline, setTimeline] = useState(false);

  const [saving, setSaving] = useState(false);
  const [savingBant, setSavingBant] = useState(false);

  // Populate form when lead data loads
  useEffect(() => {
    if (lead) {
      setTitle(lead.title);
      setValue(lead.value);
      setPriority(lead.priority);
      setTemperature(lead.temperature);
      setTags((lead.tags || []).join(", "));
      setBudget(lead.qualification?.budget ?? false);
      setAuthority(lead.qualification?.authority ?? false);
      setNeed(lead.qualification?.need ?? false);
      setTimeline(lead.qualification?.timeline ?? false);
    }
  }, [lead]);

  if (!lead) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      await updateLead({
        leadId,
        title,
        value,
        priority,
        temperature,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (error) {
      console.error("Failed to update lead:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBant = async () => {
    setSavingBant(true);
    try {
      const score = [budget, authority, need, timeline].filter(Boolean).length;
      await updateQualification({
        leadId,
        qualification: { budget, authority, need, timeline, score },
      });
    } catch (error) {
      console.error("Failed to update qualification:", error);
    } finally {
      setSavingBant(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Contact Info (read-only) */}
      <div>
        <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Informações do Contato
        </h3>
        <div className="bg-surface-sunken rounded-card p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Nome</span>
            <span className="text-text-primary font-medium">
              {lead.contact
                ? `${lead.contact.firstName || ""} ${lead.contact.lastName || ""}`.trim() || "—"
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Email</span>
            <span className="text-text-primary">{lead.contact?.email || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Telefone</span>
            <span className="text-text-primary">{lead.contact?.phone || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Empresa</span>
            <span className="text-text-primary">{lead.contact?.company || "—"}</span>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div>
        <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Detalhes do Lead
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">Valor</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as typeof priority)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">Temperatura</label>
            <select
              value={temperature}
              onChange={(e) => setTemperature(e.target.value as typeof temperature)}
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              style={{ fontSize: "16px" }}
            >
              <option value="cold">Frio</option>
              <option value="warm">Morno</option>
              <option value="hot">Quente</option>
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-text-secondary mb-1">
              Tags <span className="text-text-muted font-normal">(separadas por vírgula)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ex: enterprise, urgente, follow-up"
              className="w-full px-3 py-2 bg-surface-raised border border-border-strong text-text-primary rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 placeholder:text-text-muted"
              style={{ fontSize: "16px" }}
            />
          </div>

          <Button
            onClick={handleSaveDetails}
            disabled={saving}
            variant="primary"
            size="md"
            className="w-full"
          >
            {saving ? "Salvando..." : "Salvar Detalhes"}
          </Button>
        </div>
      </div>

      {/* BANT Qualification */}
      <div>
        <h3 className="text-[13px] font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Qualificação BANT
        </h3>
        <div className="space-y-3">
          {[
            { label: "Orçamento", checked: budget, setter: setBudget },
            { label: "Autoridade", checked: authority, setter: setAuthority },
            { label: "Necessidade", checked: need, setter: setNeed },
            { label: "Prazo", checked: timeline, setter: setTimeline },
          ].map(({ label, checked, setter }) => (
            <label
              key={label}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setter(e.target.checked)}
                className="rounded border-border-strong text-brand-500 focus:ring-brand-500 accent-brand-500"
              />
              <span className="text-sm text-text-primary">{label}</span>
            </label>
          ))}

          <div className="text-xs text-text-muted">
            Pontuação: {[budget, authority, need, timeline].filter(Boolean).length}/4
          </div>

          <Button
            onClick={handleSaveBant}
            disabled={savingBant}
            variant="primary"
            size="md"
            className="w-full"
          >
            {savingBant ? "Salvando..." : "Salvar Qualificação"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity Tab                                                       */
/* ------------------------------------------------------------------ */

const activityTypeConfig: Record<string, { color: string; letter: string }> = {
  created: { color: "bg-semantic-success", letter: "C" },
  stage_change: { color: "bg-purple-500", letter: "S" },
  assignment: { color: "bg-indigo-500", letter: "A" },
  message_sent: { color: "bg-brand-500", letter: "M" },
  handoff: { color: "bg-brand-600", letter: "H" },
  qualification_update: { color: "bg-semantic-warning", letter: "Q" },
  note: { color: "bg-surface-overlay", letter: "N" },
  call: { color: "bg-teal-500", letter: "P" },
  email_sent: { color: "bg-semantic-info", letter: "E" },
};

function ActivityTab({ leadId }: { leadId: Id<"leads"> }) {
  const activities = useQuery(api.activities.getActivities, {
    leadId,
  });

  if (!activities) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="md" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted text-sm">
        Nenhuma atividade registrada ainda.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {activities.map((activity) => {
            const config = activityTypeConfig[activity.type] || {
              color: "bg-text-muted",
              letter: "?",
            };

            return (
              <div key={activity._id} className="relative flex items-start gap-3 pl-1">
                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    config.color
                  )}
                >
                  {config.letter}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      {activity.actorName}
                    </span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-0.5">
                    {activity.content || activity.type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
