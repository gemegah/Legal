# Production Risk Review

Date: 2026-03-19
Scope: `legalos/frontend`, `legalos/backend`, `legalos/ai_service`

## Summary

The main production blocker is the backend API surface for cases and documents. It is currently exposed without real authentication, tenant isolation, or membership enforcement. Secondary issues include unsafe auth stubs, a non-verifying document upload confirmation flow, frontend routes that hard-fail in API mode, and several UI fallbacks that mask broken integrations with believable fake data.

## Findings

### 1. Critical: live backend API is effectively public and unscoped

The mounted case and document routes have no auth dependency, no tenant filter, and no membership check. Anonymous callers can read and mutate shared data.

References:
- `legalos/backend/app/routers/__init__.py`
- `legalos/backend/app/routers/cases.py`
- `legalos/backend/app/routers/documents.py`
- `legalos/backend/app/services/document_service.py`

Impact:
- Confidentiality failure across firms
- Integrity failure on document mutations
- Direct production blocker for multi-tenant deployment

### 2. High: auth and tenancy helpers are dev stubs

`get_current_user()` fabricates a fixed user and infers role from header substrings. `get_db()` yields `None`. `require_case_member()` only checks whether the case id starts with `case-`.

Reference:
- `legalos/backend/app/dependencies.py`

Impact:
- Unsafe to attach to production routes
- Easy future regression if these helpers are reused without replacement

### 3. Medium: document upload confirmation does not verify upload integrity

The API returns fake upload and download URLs, and the confirm step ignores `storage_key`, checksum, MIME type, and file size before accepting the upload.

References:
- `legalos/backend/app/routers/documents.py`
- `legalos/backend/app/services/document_service.py`

Impact:
- Forged confirm requests can advance document state
- Document integrity and audit reliability are compromised

### 4. Medium: several frontend routes fail in API mode

Some shipped routes call repository methods whose API implementations explicitly throw. In `DATA_SOURCE="api"` mode this can produce route-level 500s.

References:
- `legalos/frontend/src/app/(app)/tasks/page.tsx`
- `legalos/frontend/src/features/tasks/server/repository.ts`
- `legalos/frontend/src/app/(app)/calendar/page.tsx`
- `legalos/frontend/src/features/calendar/server/repository.ts`
- `legalos/frontend/src/app/(app)/billing/page.tsx`
- `legalos/frontend/src/features/billing/server/repository.ts`

Impact:
- API-mode rollouts will fail on core practitioner routes
- Partial backend enablement is not safe

### 5. Medium: frontend surfaces mask broken integrations with fake data

Settings silently falls back to mock firm and user data when API calls fail. Some creation flows fabricate business values like `CAS-NEW`, `Generated Client`, `Internal Client`, `Current User`, and `https://example.com/generated`.

References:
- `legalos/frontend/src/features/settings/server/repository.ts`
- `legalos/frontend/src/features/documents/components/DocumentsWorkspaceClient.tsx`
- `legalos/frontend/src/features/tasks/components/TaskWorkspace.tsx`
- `legalos/frontend/src/features/billing/components/CaseBillingClient.tsx`
- `legalos/frontend/src/features/calendar/components/calendar/ModalComponents.tsx`

Impact:
- Broken integrations appear healthy
- Practitioners can be misled by false but plausible records

## Severity Order

1. Critical: unauthenticated and unscoped backend case/document routes
2. High: unsafe auth and tenancy helper stubs
3. Medium: unverified document upload confirmation flow
4. Medium: frontend API-mode route crashes
5. Medium: UI fallback truthfulness issues

## Non-Findings

- No additional serious production-risk issues were found in `legalos/ai_service`
- No separate live webhook or payment-idempotency issue was reported because those paths appear placeholder or not mounted in the active API router

## Recommended First Fixes

1. Put authenticated user dependencies on every mounted practitioner route
2. Enforce firm scoping and case membership checks in all case/document reads and writes
3. Replace dev auth helpers before any further backend route exposure
4. Block or gate API-mode frontend routes that depend on unwired repositories
5. Remove fake business-value fallbacks from shipped UI flows
