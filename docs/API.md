# LegalOS API Reference

## Base Conventions
- Base path: `/v1`
- Auth: `Authorization: Bearer <token>` unless marked public
- Response envelope: `{ data, meta?, error? }`
- Errors: RFC 7807 Problem Details
- Pagination: `?page=1&per_page=20` -> `meta: { total, page, per_page, pages }`

## Endpoint Groups
- Auth: register, login, refresh, logout, me
- Users: list, invite, update, deactivate
- Clients: list, create, get, update, portal credentials
- Matters: list, create, get, update, archive, AI summary, audit log
- Tasks: matter list, create, update, delete, mine
- Events: firm calendar, create, update, delete, matter events
- Documents: list, upload initiate, upload confirm, metadata, download, AI analyze, search
- Time entries: list, create, update, delete
- Expenses: list, create
- Invoices: list, create, AI draft, get, update, send, void, payment link, AR aging
- Notes: list, create, update, delete
- Messages: list, create
- AI Suggestions: list pending, accept, dismiss
- Webhooks: Hubtel, Paystack
- Portal (`/portal/v1`): auth, matters, documents, invoices, pay, messages, upload
