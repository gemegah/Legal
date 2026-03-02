# Contributing to LegalOS

## Before you write any code
1. Read `agents.md`, especially the architectural rules.
2. Check `docs/` for the relevant spec.
3. If building a new feature, confirm it is in scope per `docs/PRD.md`.

## What Never To Do
- Write to `audit_log` outside `audit_service.py`
- Store `firm_id` in frontend localStorage or pass it in request bodies
- Auto-accept AI suggestions without user confirmation
- Use `role=client` tokens on non-portal endpoints
