---
name: launch-app
description: Launch LegalOS for runtime validation in mock mode or API mode during Symphony runs.
---

# Launch App

Use this skill when a LegalOS change needs runtime validation.

## Modes

### Mock mode

Use for frontend-only work that does not depend on live backend behavior.

Commands:

```bash
pnpm --dir frontend dev
```

Expected app URL:

```text
http://127.0.0.1:3000
```

Behavior notes:

- `DATA_SOURCE` defaults to `mock`
- this is the fastest validation path for most UI polish, design-system, and layout tickets

### API mode

Use when the ticket touches backend contracts, live data wiring, workflow sequencing, portal access, or AI-assisted flows.

Commands:

```bash
docker compose up -d

cd backend
source ../.venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

If the ticket touches the AI microservice, start it in a second shell:

```bash
cd ai_service
source ../.venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Then start the frontend in a third shell:

```bash
DATA_SOURCE=api LEGALOS_API_BASE_URL=http://127.0.0.1:8000 pnpm --dir frontend dev
```

Expected URLs:

```text
Frontend: http://127.0.0.1:3000
Backend:  http://127.0.0.1:8000
AI:       http://127.0.0.1:8001
```

## Validation expectations

- Capture the exact path exercised in the browser and the expected result.
- Prefer mock mode unless the ticket requires API mode.
- If the ticket changes a user-facing flow, include a short runtime proof in the Linear workpad.
