# LegalOS API Reference

## Summary
Implementation-ready REST contract for the LegalOS staff API (`/v1`) and client portal API (`/portal/v1`).

## Global Conventions

### Base Paths
- Staff API: `/v1`
- Portal API: `/portal/v1`

### Authentication and Authorization
- All endpoints require `Authorization: Bearer <token>` unless marked `[public]`
- `role=client` tokens must be rejected by all non-portal endpoints
- Tenant scoping always comes from the JWT, never from client-supplied `firm_id`
- AI endpoints create or manage pending suggestions only
- Webhooks are `[public]` but must verify signatures before any DB write

### Response Envelope
```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

### Errors
Errors use RFC 7807 Problem Details inside the envelope.

Common statuses:
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `422 Unprocessable Entity`
- `429 Too Many Requests`
- `500 Internal Server Error`

### Pagination
Use `?page=1&per_page=20`.

Paginated responses include:
```json
{
  "total": 120,
  "page": 1,
  "per_page": 20,
  "pages": 6
}
```

## Staff API

### Auth

#### `POST /v1/auth/register`
- Auth: `[public]`
- Purpose: create the initial firm and first admin user
- Request body:
```json
{
  "firm_name": "Mensah & Co.",
  "firm_slug": "mensah-co",
  "admin_name": "Ama Mensah",
  "admin_email": "ama@mensahco.gh",
  "password": "strong-password"
}
```
- Response: `data`
```json
{
  "firm": { "id": "uuid", "name": "Mensah & Co.", "slug": "mensah-co" },
  "user": { "id": "uuid", "full_name": "Ama Mensah", "email": "ama@mensahco.gh", "role": "admin" },
  "tokens": { "access_token": "jwt", "refresh_token": "token", "token_type": "bearer", "expires_in": 3600 }
}
```
- Errors: `409`, `422`

#### `POST /v1/auth/login`
- Auth: `[public]`
- Purpose: authenticate staff user
- Request body:
```json
{ "email": "ama@mensahco.gh", "password": "strong-password" }
```
- Response: user plus access/refresh tokens
- Errors: `401`, `403`

#### `POST /v1/auth/refresh`
- Auth: `[public]`
- Purpose: rotate access token with refresh token
- Request body:
```json
{ "refresh_token": "token" }
```
- Response: new access token, rotated refresh token, expiry metadata
- Errors: `401`, `409`

#### `POST /v1/auth/logout`
- Auth: authenticated staff user
- Purpose: revoke current refresh token
- Request body:
```json
{ "refresh_token": "token" }
```
- Response:
```json
{ "revoked": true }
```

#### `GET /v1/auth/me`
- Auth: authenticated staff user
- Purpose: return current user context
- Response:
```json
{
  "id": "uuid",
  "firm_id": "uuid",
  "full_name": "Ama Mensah",
  "email": "ama@mensahco.gh",
  "role": "admin",
  "is_active": true
}
```

### Users

#### `GET /v1/users`
- Auth: `admin`
- Purpose: list firm users
- Query params: `page`, `per_page`, `role`, `is_active`
- Response item:
```json
{
  "id": "uuid",
  "full_name": "Kwame Asare",
  "email": "kwame@firm.gh",
  "role": "lawyer",
  "is_active": true,
  "last_login_at": "2026-03-02T09:00:00Z"
}
```

#### `POST /v1/users/invite`
- Auth: `admin`
- Purpose: invite a new staff user
- Request body:
```json
{ "full_name": "Nana Ofori", "email": "nana@firm.gh", "role": "staff" }
```
- Response: invited user with `invite_status`
- Errors: `409`, `422`

#### `PATCH /v1/users/{id}`
- Auth: `admin`
- Purpose: update user fields
- Request body:
```json
{ "full_name": "Nana Ofori", "role": "lawyer", "is_active": true }
```
- Errors: `403`, `404`

#### `POST /v1/users/{id}/deactivate`
- Auth: `admin`
- Purpose: deactivate user without deleting history
- Response:
```json
{ "id": "uuid", "is_active": false }
```

### Clients

#### `GET /v1/clients`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: list firm clients
- Query params: `page`, `per_page`, `portal_enabled`, `query`

#### `POST /v1/clients`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: create client
- Request body:
```json
{
  "name": "Acme Industries",
  "email": "legal@acme.com",
  "phone": "+233200000000",
  "address": "Accra, Ghana",
  "portal_enabled": true
}
```

#### `GET /v1/clients/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: get client detail

#### `PATCH /v1/clients/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: update client profile and portal settings

#### `POST /v1/clients/{id}/portal-credentials`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: generate or reset portal credentials
- Request body:
```json
{ "send_invite": true }
```
- Response:
```json
{ "portal_enabled": true, "temporary_password_issued": true }
```

### Matters

#### `GET /v1/matters`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: list matters visible to current user
- Query params: `page`, `per_page`, `status`, `client_id`, `query`, `assigned_to_me`
- Response item:
```json
{
  "id": "uuid",
  "client_id": "uuid",
  "title": "Estate Administration - Mensah",
  "matter_type": "probate",
  "practice_area": "estate",
  "status": "active",
  "next_deadline_at": "2026-03-07T09:00:00Z",
  "unpaid_balance_ghs": 1200.0
}
```

#### `POST /v1/matters`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: create matter
- Request body:
```json
{
  "client_id": "uuid",
  "title": "Estate Administration - Mensah",
  "matter_type": "probate",
  "practice_area": "estate",
  "status": "active",
  "court": "High Court, Accra",
  "suit_number": null,
  "opposing_party": null,
  "opposing_counsel": null,
  "lead_lawyer_id": "uuid"
}
```

#### `GET /v1/matters/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: get matter detail

#### `PATCH /v1/matters/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: update matter metadata

#### `POST /v1/matters/{id}/archive`
- Auth: `admin`, `lawyer`
- Purpose: archive matter
- Response:
```json
{ "id": "uuid", "status": "archived", "archived_at": "2026-03-02T11:00:00Z" }
```

#### `GET /v1/matters/{id}/ai-summary`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: request or retrieve an AI matter summary draft
- Response:
```json
{
  "suggestion_id": "uuid",
  "status": "pending",
  "suggestion_type": "matter_summary",
  "payload": {
    "summary": "The matter is active and awaiting a filing deadline.",
    "next_actions": ["Review filing", "Confirm hearing date"],
    "risk_flags": ["Deadline approaching"]
  },
  "expires_at": "2026-03-03T11:00:00Z"
}
```

#### `GET /v1/matters/{id}/audit-log`
- Auth: `admin`, `lawyer`, policy-controlled `staff`
- Purpose: list matter audit entries
- Query params: `page`, `per_page`, `action`
- Response item:
```json
{
  "id": 1032,
  "entity_type": "matter",
  "entity_id": "uuid",
  "action": "update",
  "diff": { "status": ["pending", "active"] },
  "created_at": "2026-03-02T11:05:00Z"
}
```

### Tasks

#### `GET /v1/matters/{matter_id}/tasks`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list matter tasks
- Query params: `page`, `per_page`, `status`, `priority`

#### `POST /v1/matters/{matter_id}/tasks`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: create task
- Request body:
```json
{
  "title": "File affidavit",
  "description": "Prepare and file before deadline.",
  "assignee_id": "uuid",
  "status": "todo",
  "priority": "high",
  "due_at": "2026-03-05T12:00:00Z"
}
```

#### `PATCH /v1/tasks/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: update task state or assignment

#### `DELETE /v1/tasks/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: delete task (contract-level delete; implementation may soft-delete)
- Response:
```json
{ "deleted": true }
```

#### `GET /v1/tasks/mine`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: list tasks assigned to current user

### Events

#### `GET /v1/events`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: firm calendar view
- Query params: `page`, `per_page`, `date_from`, `date_to`, `matter_id`, `event_type`

#### `POST /v1/events`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: create event
- Request body:
```json
{
  "matter_id": "uuid",
  "title": "Court hearing",
  "description": "Main hearing date",
  "event_type": "hearing",
  "starts_at": "2026-03-07T09:00:00Z",
  "ends_at": "2026-03-07T11:00:00Z",
  "location": "High Court, Accra",
  "source": "manual"
}
```

#### `PATCH /v1/events/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: update event fields

#### `DELETE /v1/events/{id}`
- Auth: `admin`, `lawyer`
- Purpose: delete event

#### `GET /v1/matters/{matter_id}/events`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list events for a matter

### Documents

#### `GET /v1/matters/{matter_id}/documents`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list matter documents

#### `POST /v1/matters/{matter_id}/documents/upload-initiate`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: create pending document and return presigned upload target
- Request body:
```json
{
  "title": "Court Notice - 7 March",
  "document_type": "court_notice",
  "file_name": "court-notice.pdf",
  "mime_type": "application/pdf",
  "file_size_bytes": 234221,
  "tags": ["court", "notice"]
}
```
- Response:
```json
{
  "document_id": "uuid",
  "upload_url": "https://storage.example/upload",
  "storage_key": "firms/uuid/matters/uuid/documents/uuid/v1.pdf",
  "expires_in": 900
}
```

#### `POST /v1/matters/{matter_id}/documents/{doc_id}/confirm`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: confirm upload and enqueue OCR
- Request body:
```json
{
  "storage_key": "firms/uuid/matters/uuid/documents/uuid/v1.pdf",
  "checksum_sha256": "hex",
  "mime_type": "application/pdf",
  "file_size_bytes": 234221
}
```
- Response:
```json
{ "document_id": "uuid", "version_id": "uuid", "ocr_status": "pending" }
```

#### `PATCH /v1/documents/{id}/metadata`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: update document metadata only
- Request body:
```json
{ "title": "Updated title", "document_type": "affidavit", "tags": ["affidavit"], "is_client_shared": true }
```

#### `GET /v1/documents/{id}/download`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: get time-limited download URL
- Response:
```json
{ "download_url": "https://storage.example/download", "expires_in": 900 }
```

#### `POST /v1/documents/{id}/analyze`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: run AI deadline extraction from OCR text
- Request body:
```json
{}
```
- Response:
```json
{
  "suggestions": [
    {
      "id": "uuid",
      "status": "pending",
      "suggestion_type": "deadline_extract",
      "payload": {
        "title": "Hearing",
        "date": "2026-03-07",
        "event_type": "hearing",
        "confidence": 0.84
      }
    }
  ]
}
```

#### `GET /v1/documents/search`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: search OCR-indexed documents
- Query params: `q`, `page`, `per_page`, `matter_id`, `document_type`

### Time Entries

#### `GET /v1/matters/{matter_id}/time-entries`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list time entries for a matter

#### `POST /v1/matters/{matter_id}/time-entries`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: create time entry
- Request body:
```json
{
  "description": "Reviewed court filing",
  "work_date": "2026-03-02",
  "duration_minutes": 90,
  "rate_ghs": 300.0,
  "is_billable": true
}
```

#### `PATCH /v1/time-entries/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: update unbilled time entry
- Errors: `409` if already linked to a sent invoice

#### `DELETE /v1/time-entries/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: delete unbilled time entry
- Errors: `409` if invoicing has locked the record

### Expenses

#### `GET /v1/matters/{matter_id}/expenses`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list matter expenses

#### `POST /v1/matters/{matter_id}/expenses`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: create expense
- Request body:
```json
{
  "description": "Court filing fee",
  "amount_ghs": 150.0,
  "expense_date": "2026-03-02",
  "receipt_key": "firms/uuid/receipts/uuid.pdf"
}
```

### Invoices

#### `GET /v1/invoices`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: list invoices
- Query params: `page`, `per_page`, `status`, `client_id`, `matter_id`

#### `POST /v1/invoices`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: create invoice from reviewed line items
- Request body:
```json
{
  "matter_id": "uuid",
  "client_id": "uuid",
  "due_date": "2026-03-15",
  "notes": "Professional fees rendered.",
  "lines": [
    { "description": "Drafting and filing", "quantity": 2.0, "unit_price_ghs": 300.0 }
  ]
}
```

#### `POST /v1/invoices/draft-from-matter`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: generate AI invoice draft
- Request body:
```json
{ "matter_id": "uuid" }
```
- Response:
```json
{
  "suggestion_id": "uuid",
  "status": "pending",
  "payload": {
    "lines": [
      { "description": "Review and filing work", "quantity": 1.0, "unit_price": 600.0 }
    ],
    "narrative": "Fees for professional services rendered."
  }
}
```

#### `GET /v1/invoices/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: get invoice detail, lines, and payment summary

#### `PATCH /v1/invoices/{id}`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: update draft or reviewed invoice
- Errors: `409` if invoice is already sent or void

#### `POST /v1/invoices/{id}/send`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: mark invoice sent and queue notifications
- Response:
```json
{ "id": "uuid", "status": "sent", "sent_at": "2026-03-02T12:00:00Z" }
```

#### `POST /v1/invoices/{id}/void`
- Auth: `admin`, `lawyer`
- Purpose: void an invoice
- Errors: `409` if confirmed payments already exist

#### `GET /v1/invoices/{id}/payment-link`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: generate client-facing payment link
- Response:
```json
{
  "invoice_id": "uuid",
  "payment_url": "https://app.legalos/portal/invoices/uuid",
  "supported_methods": ["momo_mtn", "momo_vodafone", "momo_airteltigo", "card"]
}
```

#### `GET /v1/reports/ar-aging`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: accounts receivable aging report
- Response:
```json
{
  "currency": "GHS",
  "buckets": { "0_30": 1000.0, "31_60": 500.0, "61_90": 200.0, "90_plus": 75.0 },
  "invoices": []
}
```

### Notes

#### `GET /v1/matters/{matter_id}/notes`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list notes

#### `POST /v1/matters/{matter_id}/notes`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: create note
- Request body:
```json
{ "content": "Client confirmed attendance.", "is_pinned": false }
```

#### `PATCH /v1/notes/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: update note

#### `DELETE /v1/notes/{id}`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: delete note

### Messages

#### `GET /v1/matters/{matter_id}/messages`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: list matter thread messages

#### `POST /v1/matters/{matter_id}/messages`
- Auth: `admin`, `lawyer`, `staff` with matter access
- Purpose: post message
- Request body:
```json
{ "body": "Please review the attached draft.", "is_client_visible": true }
```

### AI Suggestions

#### `GET /v1/ai-suggestions`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: list pending AI suggestions
- Query params: `page`, `per_page`, `entity_type`, `entity_id`, `status`

#### `POST /v1/ai-suggestions/{id}/accept`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: accept a pending AI suggestion
- Request body:
```json
{ "edited_payload": {} }
```
- Response:
```json
{ "id": "uuid", "status": "accepted" }
```
- Errors: `409` if already accepted, dismissed, or expired

#### `POST /v1/ai-suggestions/{id}/dismiss`
- Auth: `admin`, `lawyer`, `staff`
- Purpose: dismiss a pending AI suggestion
- Request body:
```json
{ "reason": "Not relevant" }
```
- Response:
```json
{ "id": "uuid", "status": "dismissed" }
```

### Webhooks

#### `POST /v1/webhooks/hubtel`
- Auth: `[public]`
- Purpose: receive Hubtel payment webhook
- Request body: gateway-defined payload
- Response:
```json
{ "received": true }
```
- Processing rules: verify HMAC, return `200 OK` quickly, enqueue reconciliation, deduplicate by `gateway_ref`

#### `POST /v1/webhooks/paystack`
- Auth: `[public]`
- Purpose: receive Paystack payment webhook
- Request body: gateway-defined payload
- Response:
```json
{ "received": true }
```
- Processing rules: verify signature, return `200 OK` quickly, enqueue reconciliation, deduplicate by `gateway_ref`

## Portal API

### Portal Auth

#### `POST /portal/v1/auth/login`
- Auth: `[public]`
- Purpose: authenticate client portal user
- Request body:
```json
{ "email": "client@example.com", "password": "portal-password" }
```
- Response:
```json
{
  "client": { "id": "uuid", "name": "Acme Industries" },
  "tokens": { "access_token": "jwt", "token_type": "bearer", "expires_in": 3600 }
}
```

#### `POST /portal/v1/auth/logout`
- Auth: authenticated client
- Purpose: terminate portal session
- Request body:
```json
{}
```

### Portal Matters

#### `GET /portal/v1/matters`
- Auth: authenticated client
- Purpose: list only the client's visible matters

#### `GET /portal/v1/matters/{id}`
- Auth: authenticated client with access to the matter
- Purpose: return client-safe matter detail only
- Excludes: internal notes, non-shared documents, internal-only messages

### Portal Documents

#### `GET /portal/v1/matters/{id}/documents`
- Auth: authenticated client
- Purpose: list only explicitly shared documents

#### `POST /portal/v1/documents/upload`
- Auth: authenticated client
- Purpose: upload a requested document to the firm
- Request body:
```json
{ "matter_id": "uuid", "title": "Requested ID copy", "file_name": "id-copy.pdf", "mime_type": "application/pdf" }
```

### Portal Invoices

#### `GET /portal/v1/invoices`
- Auth: authenticated client
- Purpose: list only the client's invoices

#### `GET /portal/v1/invoices/{id}`
- Auth: authenticated client with invoice access
- Purpose: view invoice detail and payment status

#### `POST /portal/v1/invoices/{id}/pay`
- Auth: authenticated client with invoice access
- Purpose: initiate payment
- Request body:
```json
{ "payment_method": "momo_mtn", "phone_number": "+233200000000" }
```
- Response:
```json
{ "payment_id": "uuid", "status": "pending", "checkout_url": "https://gateway.example/checkout" }
```

### Portal Messages

#### `GET /portal/v1/messages`
- Auth: authenticated client
- Purpose: list client-visible message threads
- Query params: `matter_id`, `page`, `per_page`

#### `POST /portal/v1/messages`
- Auth: authenticated client
- Purpose: send a message to the firm
- Request body:
```json
{ "matter_id": "uuid", "body": "Please confirm receipt of the uploaded document." }
```

## Assumptions / Inferred Defaults
- All resource IDs are UUID strings except `audit_log.id`, which is numeric
- List endpoints are paginated by default where collection size is expected to grow materially
- `DELETE` for tasks and notes is a contract-level delete; implementations may soft-delete internally
- Matter access for `lawyer` and `staff` is enforced through matter membership or admin override
- `GET /v1/matters/{id}/ai-summary` returns a pending AI suggestion payload rather than directly persisted summary text
- `POST /v1/documents/{id}/analyze` may return one or many pending `ai_suggestions`
- `POST /v1/ai-suggestions/{id}/accept` may apply an optional edited payload before persisting accepted results
- Portal upload is documented as one endpoint even if implementation later splits initiate and confirm steps
- Webhook payloads remain gateway-defined and are stored raw in `payments.gateway_payload`
