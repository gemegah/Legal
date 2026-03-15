# LegalOS Agent Guide

## 1. Project Identity
- Product: LegalOS
- Market: Ghana-first (West Africa expansion later)
- Stack: FastAPI (Python 3.12) + Next.js 14 App Router + PostgreSQL 16 + Celery + Redis + Typesense + Cloudflare R2
- AI: Anthropic Claude API (suggestions only; never autonomous actions)
- Payments: Hubtel (MoMo) + Paystack (card)
- Currency: GHS only in v1

## 2. Core Architectural Rules
1. Tenancy is sacred. Every tenant-scoped query must filter by `firm_id`, derived from JWT only.
2. AI never auto-saves. Every AI suggestion persists as `status=pending` until explicit user acceptance.
3. Audit log is append-only. No code may update or delete `audit_log`.
4. Client role is isolated. `role=client` tokens are valid only on `/portal/v1/*`.
5. Webhooks verify before processing. Hubtel and Paystack signatures must be validated before writes; return HTTP 200 immediately and enqueue work.
6. Business logic lives in `services/`. Routers call services, services call the DB, workers call services.
7. Payments are idempotent. Use `gateway_ref` as a unique processing key.
8. Secrets never in code. Use environment variables only.

## 3. Domain Map
- Work: Case, Task, Event, Note, Contact
- Evidence: Document, DocVersion, OCR, Search
- Money: TimeEntry, Expense, Invoice, InvoiceLine, Payment
- Communication: NotificationQueue, ClientPortalTimeline, ClientPortal

## 4. Role Hierarchy
`admin > lawyer > staff > client`

## 5. Product And UX Truth Sources

For implementation decisions that go beyond the raw code, consult these documents explicitly:

- `docs/WORKFLOWS.md` for the three canonical end-to-end product workflows
- `docs/PRD.md` for product scope, v1 boundaries, and feature intent
- `system.md` for the end-to-end system map and service boundaries
- `docs/DESIGN_SYSTEM.md` for practitioner-first UI rules, surface-status truthfulness, and extension guidance

Use them to resolve behavior, workflow sequencing, and UI presentation questions. Do not re-invent policy from scratch inside feature code.

## 6. Implementation Rules

- Keep portal behavior as a strict subset of practitioner behavior with separate visibility rules.
- Treat AI as reviewed assistance. Labels, accept/edit/dismiss controls, and pending status must remain explicit in the UI and API.
- Respect document truthfulness rules from `docs/DESIGN_SYSTEM.md`: placeholder and partial workflows must be described and tracked as partial, not complete.
- Keep workflow sequencing aligned with `docs/WORKFLOWS.md` and `system.md`, especially around OCR, AI review, reminders, invoice creation, payments, and portal updates.

## 7. File Naming Conventions
- Python: `snake_case` files, `PascalCase` classes, `snake_case` functions
- TypeScript: `kebab-case` files, `PascalCase` components, `camelCase` functions
- Database: `snake_case` tables and columns
- API routes: `kebab-case` path segments and plural nouns
- Environment variables: `SCREAMING_SNAKE_CASE`

## 8. PR / Commit Rules
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`
- Never commit `.env` files
- Never commit `node_modules/` or `.venv/`
- Run `pnpm lint` and `pytest` before committing

## 9. When You Are Unsure
- Check `docs/PRD.md` for product decisions
- Check `docs/API.md` for endpoint contracts
- Check `docs/SCHEMA.md` for DB schema
- Check `docs/WORKFLOWS.md` and `system.md` for workflow behavior
- Check `docs/DESIGN_SYSTEM.md` for UI decisions and truthfulness rules
- If still unsure, leave `// TODO(agent): <question>` and continue
