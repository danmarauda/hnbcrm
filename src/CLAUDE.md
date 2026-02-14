# CLAUDE.md — Frontend (React + TailwindCSS)

## Structure

```
src/
├── main.tsx                    # Entry: ConvexAuthProvider wrapper
├── App.tsx                     # Auth gates, AppShell integration, org selector
├── SignInForm.tsx              # Password + Anonymous sign-in (PT-BR)
├── SignOutButton.tsx           # Sign-out button
├── index.css                  # CSS custom properties (dark/light), auth classes, shimmer
├── lib/
│   └── utils.ts               # cn() utility (clsx + tailwind-merge)
└── components/
    ├── ui/                    # Reusable UI primitives
    │   ├── Button.tsx         # Pill button (primary, secondary, ghost, dark, danger)
    │   ├── Input.tsx          # Bordered input with label, error, icon
    │   ├── Badge.tsx          # Semantic pill badge (default, brand, success, error, warning, info)
    │   ├── Card.tsx           # Surface card (default, sunken, interactive)
    │   ├── Modal.tsx          # Bottom sheet (mobile) / centered dialog (desktop)
    │   ├── SlideOver.tsx      # Full-screen (mobile) / side panel (desktop)
    │   ├── Spinner.tsx        # Brand-colored loading spinner
    │   ├── Skeleton.tsx       # Shimmer loading placeholder
    │   └── Avatar.tsx         # Initials avatar with AI badge + status dot
    ├── layout/                # App shell and navigation
    │   ├── AppShell.tsx       # Orchestrates Sidebar (md+) vs BottomTabBar (mobile)
    │   ├── Sidebar.tsx        # Desktop left nav — collapsed (md), expanded (lg)
    │   └── BottomTabBar.tsx   # Mobile bottom tabs (exports Tab type)
    ├── Dashboard.tsx           # Tab content renderer (receives activeTab from AppShell)
    ├── DashboardOverview.tsx   # Metrics overview
    ├── KanbanBoard.tsx         # Pipeline board with drag-and-drop
    ├── LeadDetailPanel.tsx     # SlideOver for lead details
    ├── CreateLeadModal.tsx     # Modal for creating new leads
    ├── Inbox.tsx               # Conversation inbox (responsive list/detail)
    ├── HandoffQueue.tsx        # AI-to-human handoff management
    ├── TeamPage.tsx            # Team member management
    ├── Settings.tsx            # Organization settings (5 sub-sections)
    ├── AuditLogs.tsx           # Audit log viewer with filters
    ├── ErrorBoundary.tsx       # Error boundary wrapper
    └── OrganizationSelector.tsx # Org switcher dropdown
```

## Patterns

**Data fetching:** Always use `useQuery(api.module.functionName, args)` from `convex/react`. Pass `"skip"` instead of args when dependencies aren't ready:
```tsx
const leads = useQuery(
  api.leads.list,
  selectedOrgId ? { organizationId: selectedOrgId } : "skip"
);
```

**Mutations:** Use `useMutation(api.module.functionName)` and call the returned function. Wrap with toast notifications from `sonner`:
```tsx
const createLead = useMutation(api.leads.create);
toast.promise(createLead({ ... }), { loading: "Criando...", success: "Criado!", error: "Falha" });
```

**Loading states:** Use the `Spinner` component:
```tsx
if (data === undefined) return <Spinner size="lg" />;
```

**Auth gates:** Use `<Authenticated>` and `<Unauthenticated>` from `convex/react` to conditionally render.

**Organization scoping:** The selected `organizationId` is passed as a prop from `App.tsx` → `Dashboard.tsx` → child components. Every query includes it.

**Navigation:** `App.tsx` manages `activeTab` state and passes it through `AppShell` → `Dashboard`. The `AppShell` renders `Sidebar` (md+) or `BottomTabBar` (mobile). The `Tab` type is exported from `BottomTabBar.tsx`.

## Styling

- **Dark theme default** — CSS custom properties in `index.css` (`:root` = dark, `.light` = override)
- **Mobile-first** — base styles target mobile, responsive via `md:`, `lg:` breakpoints
- **Color tokens:** `bg-surface-base`, `bg-surface-raised`, `text-text-primary`, `text-text-secondary`, `border-border`, `bg-brand-600`
- **Components:** Use `cn()` from `@/lib/utils` for conditional classes. All UI primitives in `src/components/ui/`
- **Icons:** `lucide-react` (tree-shakeable SVGs) — never use emoji icons
- **Buttons:** Pill shape (`rounded-full`), primary = `bg-brand-600 text-white`
- **Cards:** `rounded-card border border-border bg-surface-raised`

## UI Language

All user-facing text is in **Portuguese (BR)**. Navigation: Painel, Pipeline, Caixa de Entrada, Repasses, Equipe, Auditoria, Configurações.

## Path Alias

`@/` maps to `src/` — use `@/components/ui/Button` for imports.

## Key Dependencies

- `convex/react` — `useQuery`, `useMutation`, `Authenticated`, `Unauthenticated`
- `@convex-dev/auth/react` — `ConvexAuthProvider`, `useAuthActions`
- `sonner` — `toast` for notifications, `<Toaster theme="dark" />` in App.tsx
- `lucide-react` — SVG icons
- `clsx` + `tailwind-merge` — via `cn()` utility
