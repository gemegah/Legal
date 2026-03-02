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

## Docs
See `docs/` for the PRD, schema, API, workflows, environment variables, and design system.
