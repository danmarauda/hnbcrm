# HNBCRM — Humans & Bots CRM

Multi-tenant CRM where human team members and AI bots collaborate to manage leads, conversations, and handoffs. Built with [Convex](https://convex.dev) + React + TailwindCSS.

Connected to Convex deployment [`tacit-chicken-195`](https://dashboard.convex.dev/d/tacit-chicken-195).

## Quick Start

```bash
npm install
npm run dev          # Frontend (Vite) + Backend (Convex) in parallel
```

## Project Structure

- `src/` — React frontend (Vite, TailwindCSS, dark theme, PT-BR UI)
- `convex/` — Convex backend (queries, mutations, actions, HTTP API)
- `public/` — Logo assets (orange handshake icon)

## Authentication

Uses [Convex Auth](https://auth.convex.dev/) with Password + Anonymous providers.

## HTTP API

RESTful endpoints at `/api/v1/` in `convex/router.ts`, authenticated via `X-API-Key` header.

## Docs

- [Convex Overview](https://docs.convex.dev/understanding/)
- [Hosting & Deployment](https://docs.convex.dev/production/)
- [Best Practices](https://docs.convex.dev/understanding/best-practices/)
