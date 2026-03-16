# LegalOS

Ghana-first AI-assisted legal practice management SaaS.

## Monorepo Structure
- `docs/`: product, API, schema, workflow, environment, and design reference
- `backend/`: FastAPI backend, services, workers, and tests
- `frontend/`: Next.js App Router frontend and design system primitives
- `ai_service/`: separate AI suggestion microservice
- `infra/`: local and production docker compose files

## Prerequisites
- Node 20+
- Python 3.12+
- Docker
- pnpm

## Quick Start
1. `pnpm install`
2. `docker-compose up -d`
3. Start backend and frontend services from their workspace directories

## Current Starter Modes
- Frontend defaults to `DATA_SOURCE=mock` unless you explicitly set `DATA_SOURCE=api`.
- For API-backed case pages, set `DATA_SOURCE=api` and `LEGALOS_API_BASE_URL=http://localhost:8000`.
- Cases now have a live read-only backend slice at `/api/v1/cases` and `/api/v1/cases/{id}`.
- Tasks and calendar remain mock-backed until their backend endpoints are implemented.

## Docs
See `docs/` for the PRD, schema, API, workflows, environment variables, design system, and Symphony setup runbook.
