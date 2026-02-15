# HNBCRM — Convex Backend

Real-time backend powered by [Convex](https://convex.dev). All queries are reactive, mutations are transactional, and HTTP actions serve the REST API.

## File Layout

| File | Purpose |
|------|---------|
| `schema.ts` | All table definitions, indexes, and validators |
| `router.ts` | REST API endpoints (`/api/v1/*`) with API key auth |
| `http.ts` | Wires HTTP routes from `router.ts` |
| `leads.ts` | Lead CRUD, stage moves, assignment, qualification |
| `contacts.ts` | Contact CRUD with 20+ enrichment fields |
| `conversations.ts` | Multi-channel conversations and messages |
| `handoffs.ts` | AI-to-human handoff workflow |
| `boards.ts` | Pipeline boards and stage management |
| `organizations.ts` | Organization CRUD and settings |
| `teamMembers.ts` | Human + AI team member management |
| `activities.ts` | Activity timeline events on leads |
| `auditLogs.ts` | Audit trail with severity and entity filters |
| `dashboard.ts` | Aggregation queries for the dashboard |
| `webhooks.ts` | Webhook CRUD |
| `nodeActions.ts` | Node.js actions: API key hashing, webhook dispatch |
| `apiKeys.ts` | API key generation and validation |
| `llmsTxt.ts` | `/llms.txt` and `/llms-full.txt` endpoint content |
| `onboarding.ts` | Onboarding wizard and checklist state |
| `seed.ts` | Development seed data |
| `lib/auth.ts` | Shared `requireAuth()` helper |

## Authentication

Every public query/mutation uses `requireAuth(ctx, organizationId)` from `lib/auth.ts` to verify the user is authenticated and belongs to the organization. The REST API authenticates via `X-API-Key` header.

## REST API

Endpoints are defined in `router.ts` and mounted in `http.ts`. All routes follow the pattern:

```
GET|POST|PUT|DELETE /api/v1/{resource}
```

Covers: leads, contacts, conversations, handoffs, boards, team-members, and field-definitions.

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Convex Functions](https://docs.convex.dev/functions)
- [Convex Best Practices](https://docs.convex.dev/understanding/best-practices/)
