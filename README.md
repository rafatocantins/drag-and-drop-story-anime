# Echoes Studio Monorepo

This monorepo scaffolds an episodic storytelling studio featuring a Vite + React front-end and a Fastify + Prisma back-end for the **Echoes of Lisboa** demo narrative.

## Structure

- `frontend/` – Vite + React + TypeScript workspace with Zustand state, Tailwind UI, Monaco editor, and React Flow visualization for narrative arcs.
- `backend/` – Fastify server in TypeScript with Prisma models for narratives, approval workflows, analytics, and queue/email integrations.

## Frontend

### Scripts

```bash
cd frontend
npm install
npm run dev       # start local dev server
npm run build     # type-check and build
npm run test      # unit tests via Vitest
npm run test:e2e  # Playwright UI smoke tests
```

### Highlights

- Zustand store hydrates the Echoes of Lisboa demo narrative.
- Monaco editor powers the AI prompt composer with beat autofill helpers.
- React Flow renders the branching episode graph.
- TailwindCSS drives the cinematic UI palette.

## Backend

### Scripts

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run migrate:dev  # or migrate for production
npm run seed         # populate Echoes of Lisboa demo data
npm run dev          # start Fastify server with hot reload
npm run test         # Vitest unit tests (composer, adapters, approval flow)
npm run test:e2e     # Playwright API flow test
```

### Services & Integrations

- Prisma schema models narratives, characters, episodes, polls, engagements, prompts, and approval requests with SQLite/Postgres compatibility.
- Memory composer performs embedding-based recall using a deterministic hashing provider and vector search.
- Prompt builder utilities craft AI instructions tailored to tone and episode focus.
- Image generation + social channel adapters (Instagram/Facebook) provide integration stubs.
- Nodemailer approval workflow, BullMQ queues, and analytics collectors are ready for infrastructure wiring.

## Testing

Vitest suites cover state stores, composer logic, adapter behavior, and approval workflows. Playwright tests exercise the end-to-end composer-to-approval happy path via the mocked Fastify server and validate the UI smoke screen.
