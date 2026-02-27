import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Bot,
  Check,
  Key,
  Server,
  Table2,
  Globe,
  Webhook,
  Code2,
  Rocket,
  Play,
  Search as SearchIcon,
  Download,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { CodeBlock } from "@/components/developers/CodeBlock";
import { ALL_ENDPOINTS, API_CATEGORIES, getEndpointsByCategory } from "@/lib/apiRegistry";
import { SEO } from "@/components/SEO";

const sections = [
  { id: "quick-start", label: "Quick Start", icon: Rocket },
  { id: "playground", label: "Playground", icon: Play },
  { id: "auth", label: "Authentication", icon: Key },
  { id: "mcp", label: "MCP Server", icon: Server },
  { id: "mcp-tools", label: "MCP Tools", icon: Table2 },
  { id: "openclaw", label: "OpenClaw", icon: Bot },
  { id: "agent-skills", label: "Agent Skills", icon: BookOpen },
  { id: "rest-api", label: "REST API", icon: Globe },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "examples", label: "Examples", icon: Code2 },
];

function ToolRow({ name, description, params }: { name: string; description: string; params: string }) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="py-2.5 px-3 font-mono text-xs text-brand-400">{name}</td>
      <td className="py-2.5 px-3 text-sm text-text-secondary">{description}</td>
      <td className="py-2.5 px-3 font-mono text-xs text-text-muted">{params}</td>
    </tr>
  );
}

export function DevelopersPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("quick-start");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) {
        sectionRefs.current[section.id] = el;
        observer.observe(el);
      }
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Developer Documentation"
        description="REST API, MCP server, webhooks and agent skills to integrate AI into HNBCRM. 44 documented endpoints with an interactive playground."
        keywords="api, rest, mcp, webhooks, developer, integration, ai agents"
      />
      <div className="min-h-screen bg-surface-base text-text-primary">
        {/* Header */}
      <header className="sticky top-0 z-30 bg-surface-base/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/orange_icon_logo_transparent-bg-528x488.png"
                alt="HNBCRM Logo"
                className="h-7 w-7 object-contain"
              />
              <span className="text-lg font-bold text-text-primary">HNBCRM</span>
            </Link>
            <span className="text-text-muted">/</span>
            <span className="text-sm font-medium text-text-secondary">Developers</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-sm mx-4">
            <div className="relative flex-1">
              <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface-overlay border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <Link to="/" className="flex-shrink-0">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile ToC */}
      <nav className="md:hidden sticky top-[57px] z-20 bg-surface-base/80 backdrop-blur-md border-b border-border overflow-x-auto">
        <div className="flex gap-1 px-4 py-2">
          {sections.map((s) =>
            s.id === "playground" ? (
              <Link
                key={s.id}
                to="/developers/playground"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors text-text-muted hover:text-text-secondary"
              >
                <s.icon size={14} />
                {s.label}
                <ExternalLink size={10} />
              </Link>
            ) : (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  activeSection === s.id
                    ? "bg-brand-500/10 text-brand-400"
                    : "text-text-muted hover:text-text-secondary"
                )}
              >
                <s.icon size={14} />
                {s.label}
              </button>
            )
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 flex gap-8">
        {/* Desktop Sidebar ToC */}
        <nav className="hidden md:block w-52 flex-shrink-0">
          <div className="sticky top-[73px] py-8 space-y-1">
            {sections.map((s) =>
              s.id === "playground" ? (
                <Link
                  key={s.id}
                  to="/developers/playground"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left text-text-muted hover:text-text-secondary hover:bg-surface-raised"
                >
                  <s.icon size={16} />
                  {s.label}
                  <ExternalLink size={12} className="ml-auto opacity-50" />
                </Link>
              ) : (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                    activeSection === s.id
                      ? "bg-brand-500/10 text-brand-400"
                      : "text-text-muted hover:text-text-secondary hover:bg-surface-raised"
                  )}
                >
                  <s.icon size={16} />
                  {s.label}
                </button>
              )
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-8 md:py-12 space-y-16 md:space-y-24">
          {/* Hero */}
          <section className="space-y-4">
            <Badge variant="brand">Developer Docs</Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Developers
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl">
              Build on HNBCRM — integrate AI agents, automate workflows, and
              extend your CRM.
            </p>
          </section>

          {/* Quick Start */}
          <section id="quick-start" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Rocket className="text-brand-400" size={24} />
              Quick Start
            </h2>
            <p className="text-text-secondary">
              Start using the API in 3 simple steps.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <Card className="p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-500">1</span>
                </div>
                <h3 className="font-semibold text-text-primary">Generate your API Key</h3>
                <p className="text-sm text-text-secondary">
                  Go to <span className="text-brand-400">Settings &gt; API Keys</span> in the app and create a new key.
                </p>
              </Card>

              {/* Step 2 */}
              <Card className="p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-500">2</span>
                </div>
                <h3 className="font-semibold text-text-primary">Make your first request</h3>
                <p className="text-sm text-text-secondary">
                  Use cURL or any HTTP client:
                </p>
                <CodeBlock language="bash">{`curl -X GET "https://YOUR-DEPLOYMENT.convex.site/api/v1/boards" \\
  -H "X-API-Key: your_api_key_here"`}</CodeBlock>
              </Card>

              {/* Step 3 */}
              <Card className="p-6 space-y-3">
                <div className="w-8 h-8 rounded-full bg-brand-500/10 border border-brand-500 flex items-center justify-center">
                  <span className="text-sm font-bold text-brand-500">3</span>
                </div>
                <h3 className="font-semibold text-text-primary">Explore the Playground</h3>
                <p className="text-sm text-text-secondary">
                  Test all endpoints directly in the browser, full-screen.
                </p>
                <Link to="/developers/playground">
                  <Button variant="primary" size="sm">
                    <Play size={14} />
                    Open Playground
                  </Button>
                </Link>
              </Card>
            </div>
          </section>

          {/* Playground CTA */}
          <section id="playground" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Play className="text-brand-400" size={24} />
              API Playground
            </h2>
            <Card className="p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                <Play size={28} className="text-brand-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  Test endpoints in real time
                </h3>
                <p className="text-sm text-text-secondary">
                  Configure your Base URL and API key, select an endpoint, and send requests directly from your browser.
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <a href="/api/v1/openapi.json" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm">
                    <Download size={14} />
                    OpenAPI Spec
                  </Button>
                </a>
                <Link to="/developers/playground">
                  <Button variant="primary">
                    <Play size={16} />
                    Open Playground
                  </Button>
                </Link>
              </div>
            </Card>
          </section>

          {/* Authentication */}
          <section id="auth" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Key className="text-brand-400" size={24} />
              Authentication
            </h2>
            <p className="text-text-secondary">
              All REST API and MCP server calls are authenticated via
              API key. Generate your keys in{" "}
              <span className="text-brand-400 font-medium">
                Settings &gt; API Keys
              </span>{" "}
              in the app.
            </p>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">How to use</h3>
              <p className="text-sm text-text-secondary">
                Send the header <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">X-API-Key</code> in
                all requests:
              </p>
              <CodeBlock language="bash">{`curl -X GET "https://YOUR-DEPLOYMENT.convex.site/api/v1/leads" \\
  -H "X-API-Key: your_api_key_here"`}</CodeBlock>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="font-semibold text-text-primary">Error responses</h3>
              <div className="text-sm text-text-secondary space-y-2">
                <p>
                  <code className="text-semantic-error bg-surface-overlay px-1.5 py-0.5 rounded text-xs">401</code>{" "}
                  — Invalid or missing key
                </p>
                <p>
                  <code className="text-semantic-error bg-surface-overlay px-1.5 py-0.5 rounded text-xs">403</code>{" "}
                  — No permission for this resource
                </p>
                <p>
                  <code className="text-semantic-error bg-surface-overlay px-1.5 py-0.5 rounded text-xs">429</code>{" "}
                  — Rate limit exceeded
                </p>
              </div>
            </Card>
          </section>

          {/* MCP Server */}
          <section id="mcp" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Server className="text-brand-400" size={24} />
              MCP Server
            </h2>
            <p className="text-text-secondary">
              The Model Context Protocol (MCP) lets AI agents interact
              directly with your CRM in a structured and secure way.
            </p>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Installation</h3>
              <CodeBlock language="bash">{`npx hnbcrm-mcp`}</CodeBlock>
              <p className="text-sm text-text-muted">
                Available via{" "}
                <a href="https://www.npmjs.com/package/hnbcrm-mcp" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                  npm
                </a>.
              </p>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                Configuration — Claude Desktop
              </h3>
              <p className="text-sm text-text-secondary">
                Add to your <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">claude_desktop_config.json</code>:
              </p>
              <CodeBlock language="json">{`{
  "mcpServers": {
    "hnbcrm": {
      "command": "npx",
      "args": ["-y", "hnbcrm-mcp"],
      "env": {
        "HNBCRM_API_KEY": "your_api_key_here",
        "HNBCRM_API_URL": "https://YOUR-DEPLOYMENT.convex.site"
      }
    }
  }
}`}</CodeBlock>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                Configuration — Claude Code
              </h3>
              <p className="text-sm text-text-secondary">
                In your <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">.mcp.json</code> in the project:
              </p>
              <CodeBlock language="json">{`{
  "mcpServers": {
    "hnbcrm": {
      "command": "npx",
      "args": ["-y", "hnbcrm-mcp"],
      "env": {
        "HNBCRM_API_KEY": "your_api_key_here",
        "HNBCRM_API_URL": "https://YOUR-DEPLOYMENT.convex.site"
      }
    }
  }
}`}</CodeBlock>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                Configuration — Cursor / VS Code
              </h3>
              <p className="text-sm text-text-secondary">
                Add to <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">.cursor/mcp.json</code> or <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">.vscode/mcp.json</code>:
              </p>
              <CodeBlock language="json">{`{
  "mcpServers": {
    "hnbcrm": {
      "command": "npx",
      "args": ["-y", "hnbcrm-mcp"],
      "env": {
        "HNBCRM_API_KEY": "your_api_key_here",
        "HNBCRM_API_URL": "https://YOUR-DEPLOYMENT.convex.site"
      }
    }
  }
}`}</CodeBlock>
            </Card>
          </section>

          {/* MCP Tools Reference */}
          <section id="mcp-tools" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Table2 className="text-brand-400" size={24} />
              MCP Tools — Reference
            </h2>
            <p className="text-text-secondary">
              The MCP server exposes 44 tools organized by category. Each
              each tool maps to a CRM action.
            </p>

            {/* Leads */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Leads
                  <Badge variant="brand">7 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_create_lead" description="Creates a new lead in the pipeline" params="title, contact?, value?" />
                    <ToolRow name="crm_list_leads" description="Lists leads with filters" params="boardId?, stageId?, assignedTo?" />
                    <ToolRow name="crm_get_lead" description="Returns lead details" params="id" />
                    <ToolRow name="crm_update_lead" description="Updates lead fields" params="leadId, title?, value?, priority?" />
                    <ToolRow name="crm_delete_lead" description="Permanently removes a lead" params="leadId" />
                    <ToolRow name="crm_move_lead" description="Move lead to another stage" params="leadId, stageId" />
                    <ToolRow name="crm_assign_lead" description="Assigns lead to a member" params="leadId, assignedTo?" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Contacts */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Contacts
                  <Badge variant="brand">7 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_list_contacts" description="Lists all contacts" params="—" />
                    <ToolRow name="crm_get_contact" description="Returns contact details" params="id" />
                    <ToolRow name="crm_create_contact" description="Creates a new contact" params="firstName?, email?, phone?, company?" />
                    <ToolRow name="crm_update_contact" description="Updates contact data" params="contactId, fields..." />
                    <ToolRow name="crm_enrich_contact" description="Adds enrichment data" params="contactId, fields, source" />
                    <ToolRow name="crm_get_contact_gaps" description="Identifies empty fields" params="id" />
                    <ToolRow name="crm_search_contacts" description="Searches contacts by text" params="query, limit?" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Conversations */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Conversations
                  <Badge variant="brand">3 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_list_conversations" description="List lead conversations" params="leadId?" />
                    <ToolRow name="crm_get_messages" description="Return messages from a conversation" params="conversationId" />
                    <ToolRow name="crm_send_message" description="Sends a message in a conversation" params="conversationId, content" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Handoffs */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Handoffs
                  <Badge variant="brand">4 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_request_handoff" description="Requests AI-to-human handoff" params="leadId, reason" />
                    <ToolRow name="crm_list_handoffs" description="Lists handoffs by status" params="status?" />
                    <ToolRow name="crm_accept_handoff" description="Accepts a pending handoff" params="handoffId, notes?" />
                    <ToolRow name="crm_reject_handoff" description="Rejects a pending handoff" params="handoffId, notes?" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Pipeline */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Pipeline
                  <Badge variant="brand">3 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_list_boards" description="Lists boards with their stages" params="—" />
                    <ToolRow name="crm_list_team" description="Lists team members" params="—" />
                    <ToolRow name="crm_get_dashboard" description="Returns pipeline analytics" params="—" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Activities */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Activities
                  <Badge variant="brand">2 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_get_activities" description="Lead activity timeline" params="leadId, limit?" />
                    <ToolRow name="crm_create_activity" description="Logs a note, call, or email" params="leadId, type, content?" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Tasks */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Tasks
                  <Badge variant="brand">12 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="crm_list_tasks" description="List tasks with filters" params="status?, priority?, assignedTo?" />
                    <ToolRow name="crm_get_task" description="Returns task details" params="taskId" />
                    <ToolRow name="crm_create_task" description="Creates a new task or reminder" params="title, type?, dueDate?" />
                    <ToolRow name="crm_update_task" description="Updates task fields" params="taskId, title?, priority?" />
                    <ToolRow name="crm_delete_task" description="Permanently deletes a task" params="taskId" />
                    <ToolRow name="crm_complete_task" description="Marks a task as completed" params="taskId" />
                    <ToolRow name="crm_snooze_task" description="Snoozes a task to a future date" params="taskId, snoozedUntil" />
                    <ToolRow name="crm_archive_task" description="Archives a completed task" params="taskId" />
                    <ToolRow name="crm_unarchive_task" description="Restores an archived task" params="taskId" />
                    <ToolRow name="crm_add_task_comment" description="Adds a comment to a task" params="taskId, content" />
                    <ToolRow name="crm_list_task_comments" description="Lists comments for a task" params="taskId" />
                    <ToolRow name="crm_search_tasks" description="Search tasks by text" params="query, limit?" />
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Calendar */}
            <Card className="p-0 overflow-hidden">
              <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                <h3 className="font-semibold text-text-primary flex items-center gap-2">
                  Calendar
                  <Badge variant="brand">6 tools</Badge>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-surface-sunken/50">
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-40">Tool</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                      <th className="py-2 px-3 text-xs font-semibold text-text-muted w-48">Key Parameters</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ToolRow name="calendar_list_events" description="Lists events in a period" params="startDate, endDate, assignedTo?" />
                    <ToolRow name="calendar_get_event" description="Returns event details" params="eventId" />
                    <ToolRow name="calendar_create_event" description="Creates a new calendar event" params="title, eventType, startTime, endTime" />
                    <ToolRow name="calendar_update_event" description="Updates event fields" params="eventId, title?, startTime?" />
                    <ToolRow name="calendar_delete_event" description="Permanently removes an event" params="eventId" />
                    <ToolRow name="calendar_reschedule_event" description="Reschedules an event to a new time" params="eventId, newStartTime" />
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* OpenClaw Integration */}
          <section id="openclaw" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Bot className="text-brand-400" size={24} />
              OpenClaw
            </h2>
            <p className="text-text-secondary">
              HNBCRM is natively compatible with{" "}
              <a href="https://github.com/openclaw/openclaw" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">
                OpenClaw
              </a>
              {" "}&mdash; the open-source AI agent with 100k+ stars on GitHub.
              Connect your CRM to OpenClaw via MCP in minutes.
            </p>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Quick Setup</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">1.</span> Install the MCP server via npm:
                  </p>
                  <CodeBlock language="bash">{`npm install -g hnbcrm-mcp`}</CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">2.</span> Configure in OpenClaw (MCP bridge):
                  </p>
                  <CodeBlock language="json">{`{
  "mcpServers": {
    "hnbcrm": {
      "command": "npx",
      "args": ["-y", "hnbcrm-mcp"],
      "env": {
        "HNBCRM_API_URL": "https://your-deployment.convex.site",
        "HNBCRM_API_KEY": "your_api_key_here"
      }
    }
  }
}`}</CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">3.</span> Copy the Agent Skill (optional, improves agent context):
                  </p>
                  <CodeBlock language="bash">{`cp -r .claude/skills/hnbcrm/ ~/.openclaw/workspace/skills/hnbcrm/`}</CodeBlock>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">What OpenClaw can do with HNBCRM</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Manage pipeline leads automatically",
                  "Enrich contacts with web research data",
                  "Reply to conversations and send messages",
                  "Request handoffs for human sales reps",
                  "Create tasks and schedule calendar events",
                  "Generate pipeline analytics reports",
                ].map((capability) => (
                  <div key={capability} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="text-brand-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Agent Skills */}
          <section id="agent-skills" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="text-brand-400" size={24} />
              Agent Skills
            </h2>
            <p className="text-text-secondary">
              Portable open-standard skill that teaches any AI agent to operate as a member
              of the CRM team — manage leads, enrich contacts, respond to conversations, and
              execute handoffs to humans.
            </p>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Skill Contents</h3>
              <p className="text-sm text-text-secondary">
                The skill lives in <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">.claude/skills/hnbcrm/</code> e
                follows the <span className="text-brand-400">AgentSkills.io</span>. It can be copied to any platform.
              </p>
              <div className="space-y-2">
                {[
                  { file: "SKILL.md", desc: "Main skill file — agent role, bootstrap, workflows, best practices" },
                  { file: "references/WORKFLOWS.md", desc: "Step-by-step playbooks: intake, qualification, enrichment, handoffs" },
                  { file: "references/API_REFERENCE.md", desc: "Complete MCP tools <> REST endpoints mapping" },
                  { file: "references/DATA_MODEL.md", desc: "Tables, fields, and enum values" },
                  { file: "references/SETUP.md", desc: "Platform configuration (Claude, Cursor, VS Code, Gemini, OpenClaw)" },
                ].map((item) => (
                  <div key={item.file} className="flex items-start gap-3 p-3 rounded-lg bg-surface-overlay border border-border">
                    <code className="text-xs font-mono text-brand-400 whitespace-nowrap mt-0.5">{item.file}</code>
                    <span className="text-sm text-text-secondary">{item.desc}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Quick Setup</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">1.</span> Configure the MCP server (required for tools):
                  </p>
                  <CodeBlock language="bash">{`# Set environment variables
export HNBCRM_API_URL="https://your-deployment.convex.site"
export HNBCRM_API_KEY="your_api_key_here"

# Test the connection
npx hnbcrm-mcp`}</CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">2.</span> Copy the skill to your agent:
                  </p>
                  <CodeBlock language="bash">{`# Claude Code (auto-detects this)
# For other platforms:
cp -r .claude/skills/hnbcrm/ ~/.your-platform/skills/hnbcrm/`}</CodeBlock>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    <span className="text-brand-400 font-semibold">3.</span> The agent reads SKILL.md and starts bootstrap:
                  </p>
                  <CodeBlock language="text">{`1. crm_list_team → discovers identity and team
2. crm_list_boards → learns pipeline stages
3. crm_list_handoffs → checks pending work
4. crm_list_leads -> reviews assigned leads`}</CodeBlock>
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Compatible Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Claude Code",
                  "Claude Desktop",
                  "Cursor",
                  "VS Code",
                  "Gemini CLI",
                  "OpenClaw",
                  "REST API (any agent)",
                ].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-overlay border border-border text-text-secondary"
                  >
                    {platform}
                  </span>
                ))}
              </div>
              <p className="text-sm text-text-muted">
                The skill works with any platform that supports MCP or REST API. See{" "}
                <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">references/SETUP.md</code>{" "}
                for detailed instructions.
              </p>
            </Card>
          </section>

          {/* REST API */}
          <section id="rest-api" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Globe className="text-brand-400" size={24} />
              REST API
            </h2>
            <p className="text-text-secondary">
              Base URL: <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">https://YOUR-DEPLOYMENT.convex.site/api/v1</code>
            </p>
            <p className="text-sm text-text-secondary">
              All endpoints require the header{" "}
              <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">X-API-Key</code>.
              Responses in JSON. Total: {ALL_ENDPOINTS.length} endpoints.
            </p>

            {API_CATEGORIES.map((category) => {
              const endpoints = getEndpointsByCategory(category);
              // Apply search filter
              const filtered = searchQuery
                ? endpoints.filter((ep) =>
                    ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ep.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                : endpoints;
              if (filtered.length === 0) return null;

              return (
                <Card key={category} className="p-0 overflow-hidden">
                  <div className="px-4 py-3 bg-surface-overlay border-b border-border">
                    <h3 className="font-semibold text-text-primary flex items-center gap-2">
                      {category}
                      <Badge variant="brand">{filtered.length}</Badge>
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-border bg-surface-sunken/50">
                          <th className="py-2 px-3 text-xs font-semibold text-text-muted w-16">Method</th>
                          <th className="py-2 px-3 text-xs font-semibold text-text-muted w-56">Path</th>
                          <th className="py-2 px-3 text-xs font-semibold text-text-muted">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((ep) => (
                          <tr
                            key={ep.id}
                            className="border-b border-border last:border-b-0 hover:bg-surface-overlay/50 cursor-pointer transition-colors"
                            onClick={() => navigate(`/developers/playground?endpoint=${ep.id}`)}
                          >
                            <td className="py-2.5 px-3">
                              <span className={cn(
                                "font-mono text-xs font-semibold",
                                ep.method === "GET" ? "text-semantic-success" : "text-semantic-info"
                              )}>
                                {ep.method}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-xs text-brand-400">{ep.path}</td>
                            <td className="py-2.5 px-3 text-sm text-text-secondary">{ep.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              );
            })}
          </section>

          {/* Webhooks */}
          <section id="webhooks" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Webhook className="text-brand-400" size={24} />
              Webhooks
            </h2>
            <p className="text-text-secondary">
              Receive real-time notifications when events happen in the CRM.
              Configure webhooks in{" "}
              <span className="text-brand-400 font-medium">
                Settings &gt; Webhooks
              </span>.
            </p>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Available events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "lead.created",
                  "lead.updated",
                  "lead.deleted",
                  "lead.stage_changed",
                  "lead.assigned",
                  "contact.created",
                  "contact.updated",
                  "conversation.message_sent",
                  "handoff.requested",
                  "handoff.accepted",
                  "handoff.rejected",
                ].map((event) => (
                  <code
                    key={event}
                    className="text-xs font-mono text-brand-400 bg-surface-overlay px-2 py-1.5 rounded border border-border"
                  >
                    {event}
                  </code>
                ))}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                Signature verification — HMAC-SHA256
              </h3>
              <p className="text-sm text-text-secondary">
                Each webhook request includes the header{" "}
                <code className="text-brand-400 bg-surface-overlay px-1.5 py-0.5 rounded text-xs">
                  X-Webhook-Signature
                </code>{" "}
                with the HMAC-SHA256 signature of the body using your webhook secret.
              </p>
              <CodeBlock language="javascript">{`const crypto = require("crypto");

function verifyWebhook(body, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}</CodeBlock>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">Payload example</h3>
              <CodeBlock language="json">{`{
  "event": "lead.created",
  "timestamp": "2026-02-15T12:00:00.000Z",
  "data": {
    "id": "jd7x...",
    "title": "New lead via form",
    "boardId": "kn8y...",
    "stageId": "m2a4...",
    "contactId": "p5b7...",
    "assignedTo": null,
    "customFields": {},
    "createdAt": 1739620800000
  }
}`}</CodeBlock>
            </Card>
          </section>

          {/* Code Examples */}
          <section id="examples" className="space-y-6 scroll-mt-24">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Code2 className="text-brand-400" size={24} />
              Code Examples
            </h2>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                Create lead from web form
              </h3>
              <p className="text-sm text-text-secondary">
                Send contact form data directly to the CRM:
              </p>
              <CodeBlock language="javascript">{`async function createLeadFromForm(formData) {
  const response = await fetch(
    "https://YOUR-DEPLOYMENT.convex.site/api/v1/inbound/lead",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.HNBCRM_API_KEY,
      },
      body: JSON.stringify({
        title: \`Lead: \${formData.name}\`,
        contact: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        message: formData.message,
      }),
    }
  );

  const data = await response.json();
  console.log("Lead created:", data.leadId);
  return data;
}`}</CodeBlock>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">
                AI agent integration
              </h3>
              <p className="text-sm text-text-secondary">
                Example of an agent that monitors leads and requests a handoff when
                necessary:
              </p>
              <CodeBlock language="javascript">{`async function aiAgentCheckLeads(apiKey, baseUrl) {
  // 1. List unassigned leads
  const res = await fetch(\`\${baseUrl}/api/v1/leads\`, {
    headers: { "X-API-Key": apiKey },
  });
  const { leads } = await res.json();

  for (const lead of leads) {
    if (!lead.assignedTo) {
      /// 2. Check lead conversations
      const convRes = await fetch(
        \`\${baseUrl}/api/v1/conversations?leadId=\${lead._id}\`,
        { headers: { "X-API-Key": apiKey } }
      );
      const { conversations } = await convRes.json();

      if (conversations.length > 0) {
        // 3. Request handoff to human
        await fetch(\`\${baseUrl}/api/v1/leads/handoff\`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
          },
          body: JSON.stringify({
            leadId: lead._id,
            reason: "Lead with active conversations and no assignment",
          }),
        });
        console.log(\`Handoff requested for lead: \${lead.title}\`);
      }
    }
  }
}`}</CodeBlock>
            </Card>
          </section>

          {/* Bottom spacer */}
          <div className="h-16" />
        </main>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/orange_icon_logo_transparent-bg-528x488.png"
              alt="HNBCRM Logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-text-primary">HNBCRM</span>
          </div>
          <div className="flex items-center justify-center gap-6 mb-4">
            <Link
              to="/"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/sign-in"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            &copy; 2025 HNBCRM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
    </>
  );
}
