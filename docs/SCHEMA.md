# LegalOS Database Schema

## Summary
Implementation-ready PostgreSQL 16 schema for LegalOS. This schema supports multi-tenant matter management, documents, billing, client portal access, payments, audit logging, and AI suggestions.

## Schema Conventions
- PostgreSQL 16 target
- UUID primary keys for all domain tables except `audit_log`
- `audit_log` uses `BIGSERIAL`
- Every tenant-scoped table includes `firm_id UUID NOT NULL`
- Timestamps use `TIMESTAMPTZ`
- Monetary values use `NUMERIC(12,2)` unless noted otherwise
- Core mutable tables include `created_at` and `updated_at`
- Foreign keys use `ON DELETE RESTRICT` by default, or `SET NULL` where history should be preserved
- Tenant safety still depends on app-side filtering by JWT-derived `firm_id`

## Required Extensions
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
```

## Enum Definitions
```sql
CREATE TYPE user_role AS ENUM ('admin', 'lawyer', 'staff', 'client');
CREATE TYPE matter_status AS ENUM ('active', 'pending', 'closed', 'archived');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'blocked', 'cancelled');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE event_type AS ENUM ('hearing', 'filing_deadline', 'meeting', 'mention', 'reminder', 'other');
CREATE TYPE event_source AS ENUM ('manual', 'ai_extracted');
CREATE TYPE ocr_status AS ENUM ('pending', 'done', 'failed');
CREATE TYPE invoice_status AS ENUM ('draft', 'reviewed', 'sent', 'partially_paid', 'paid', 'overdue', 'void');
CREATE TYPE payment_method AS ENUM ('momo_mtn', 'momo_vodafone', 'momo_airteltigo', 'card', 'bank_transfer', 'cash', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'confirmed', 'failed', 'cancelled', 'refunded');
CREATE TYPE ai_suggestion_status AS ENUM ('pending', 'accepted', 'edited', 'dismissed');
```

## Full DDL

### 1. `firms`
```sql
CREATE TABLE firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  legal_name TEXT,
  primary_email CITEXT,
  primary_phone TEXT,
  timezone TEXT NOT NULL DEFAULT 'Africa/Accra',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```
Comment: tenant record for each law firm.

### 2. `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  email CITEXT NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  accepted_invite_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_firm_email_key UNIQUE (firm_id, email)
);
CREATE INDEX idx_users_firm_id ON users (firm_id);
CREATE INDEX idx_users_firm_role ON users (firm_id, role);
```
Comment: staff and client-role users scoped to a firm.

### 3. `refresh_tokens`
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens (user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens (expires_at);
```
Comment: hashed refresh tokens for rotation and revocation.

### 4. `clients`
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  email CITEXT,
  phone TEXT,
  address TEXT,
  portal_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  portal_password_hash TEXT,
  portal_last_login_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT clients_firm_email_key UNIQUE (firm_id, email)
);
CREATE INDEX idx_clients_firm_id ON clients (firm_id);
CREATE INDEX idx_clients_portal_enabled ON clients (firm_id, portal_enabled);
```
Comment: external clients and their portal access settings.

### 5. `contacts`
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email CITEXT,
  phone TEXT,
  organization TEXT,
  title TEXT,
  kind TEXT NOT NULL DEFAULT 'general',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_contacts_firm_id ON contacts (firm_id);
CREATE INDEX idx_contacts_client_id ON contacts (client_id);
```
Comment: opposing parties, counsel, and other related contacts.

### 6. `matters`
```sql
CREATE TABLE matters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  matter_type TEXT NOT NULL,
  practice_area TEXT NOT NULL,
  status matter_status NOT NULL DEFAULT 'active',
  court TEXT,
  suit_number TEXT,
  opposing_party TEXT,
  opposing_counsel TEXT,
  lead_lawyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  next_deadline_at TIMESTAMPTZ,
  unpaid_balance_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_matters_firm_id ON matters (firm_id);
CREATE INDEX idx_matters_firm_status ON matters (firm_id, status);
CREATE INDEX idx_matters_client_id ON matters (client_id);
CREATE INDEX idx_matters_next_deadline_at ON matters (firm_id, next_deadline_at);
```
Comment: the core container object for all legal work.

### 7. `matter_members`
```sql
CREATE TABLE matter_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  member_role TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT matter_members_unique UNIQUE (matter_id, user_id)
);
CREATE INDEX idx_matter_members_firm_id ON matter_members (firm_id);
CREATE INDEX idx_matter_members_user_id ON matter_members (user_id);
```
Comment: matter-local access control and assignment map.

### 8. `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tasks_firm_id ON tasks (firm_id);
CREATE INDEX idx_tasks_matter_id ON tasks (matter_id);
CREATE INDEX idx_tasks_assignee_id ON tasks (assignee_id);
CREATE INDEX idx_tasks_due_at ON tasks (firm_id, due_at);
```
Comment: `deleted_at` is a soft-delete marker retained for auditability.

### 9. `events`
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID REFERENCES matters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type NOT NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location TEXT,
  source event_source NOT NULL DEFAULT 'manual',
  ai_confidence DOUBLE PRECISION,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT events_ai_confidence_range CHECK (ai_confidence IS NULL OR (ai_confidence >= 0 AND ai_confidence <= 1))
);
CREATE INDEX idx_events_firm_id ON events (firm_id);
CREATE INDEX idx_events_matter_id ON events (matter_id);
CREATE INDEX idx_events_starts_at ON events (firm_id, starts_at);
```
Comment: `ai_confidence` is populated only for AI-extracted events.

### 10. `notes`
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notes_firm_id ON notes (firm_id);
CREATE INDEX idx_notes_matter_id ON notes (matter_id);
```

### 11. `documents`
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  is_client_shared BOOLEAN NOT NULL DEFAULT FALSE,
  latest_version_number INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_documents_firm_id ON documents (firm_id);
CREATE INDEX idx_documents_matter_id ON documents (matter_id);
CREATE INDEX idx_documents_tags_gin ON documents USING GIN (tags);
```
Comment: `storage_key` points to the latest canonical document object.

### 12. `doc_versions`
```sql
CREATE TABLE doc_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  checksum_sha256 TEXT NOT NULL,
  ocr_text TEXT,
  ocr_status ocr_status NOT NULL DEFAULT 'pending',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT doc_versions_unique UNIQUE (document_id, version_number)
);
CREATE INDEX idx_doc_versions_firm_id ON doc_versions (firm_id);
CREATE INDEX idx_doc_versions_document_id ON doc_versions (document_id);
CREATE INDEX idx_doc_versions_ocr_status ON doc_versions (firm_id, ocr_status);
```
Comment: immutable document version history with OCR tracking.

### 13. `time_entries`
```sql
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  rate_ghs NUMERIC(12,2) NOT NULL CHECK (rate_ghs >= 0),
  is_billable BOOLEAN NOT NULL DEFAULT TRUE,
  invoice_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_time_entries_firm_id ON time_entries (firm_id);
CREATE INDEX idx_time_entries_matter_id ON time_entries (matter_id);
CREATE INDEX idx_time_entries_invoice_id ON time_entries (invoice_id);
```
Comment: unbilled entries remain editable; sent-invoice entries are locked by application rules.

### 14. `expenses`
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  description TEXT NOT NULL,
  amount_ghs NUMERIC(12,2) NOT NULL CHECK (amount_ghs >= 0),
  expense_date DATE NOT NULL,
  receipt_key TEXT,
  invoice_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_expenses_firm_id ON expenses (firm_id);
CREATE INDEX idx_expenses_matter_id ON expenses (matter_id);
CREATE INDEX idx_expenses_invoice_id ON expenses (invoice_id);
```
Comment: `receipt_key` stores the object storage reference for proof of expense.

### 15. `invoices`
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  invoice_number TEXT NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  notes TEXT,
  subtotal_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  due_date DATE NOT NULL,
  voided_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT invoices_firm_invoice_number_key UNIQUE (firm_id, invoice_number),
  CONSTRAINT invoices_paid_lte_total CHECK (paid_ghs <= total_ghs)
);
CREATE INDEX idx_invoices_firm_id ON invoices (firm_id);
CREATE INDEX idx_invoices_client_id ON invoices (client_id);
CREATE INDEX idx_invoices_status_due_date ON invoices (firm_id, status, due_date);
```
Comment: `paid_ghs` is the reconciled total from confirmed payments.

### 16. `invoice_lines`
```sql
CREATE TABLE invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  source_type TEXT,
  source_id UUID,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  line_total_ghs NUMERIC(12,2) NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoice_lines_invoice_id ON invoice_lines (invoice_id);
CREATE INDEX idx_invoice_lines_position ON invoice_lines (invoice_id, position);
```
Comment: `source_type` and `source_id` can trace the line back to a time entry or expense.

### 17. `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,
  amount_ghs NUMERIC(12,2) NOT NULL CHECK (amount_ghs >= 0),
  payment_method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  gateway_ref TEXT NOT NULL UNIQUE,
  gateway_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  paid_at TIMESTAMPTZ,
  reconciled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_payments_firm_id ON payments (firm_id);
CREATE INDEX idx_payments_invoice_id ON payments (invoice_id);
CREATE INDEX idx_payments_status ON payments (firm_id, status);
```
Comment: `gateway_ref` is the idempotency key for webhook reconciliation.

### 18. `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  matter_id UUID NOT NULL REFERENCES matters(id) ON DELETE RESTRICT,
  author_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  is_client_visible BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT messages_author_check CHECK (author_user_id IS NOT NULL OR author_client_id IS NOT NULL)
);
CREATE INDEX idx_messages_firm_id ON messages (firm_id);
CREATE INDEX idx_messages_matter_id ON messages (matter_id);
CREATE INDEX idx_messages_client_visible ON messages (matter_id, is_client_visible);
```
Comment: `is_client_visible` controls what the portal can see.

### 19. `notification_queue`
```sql
CREATE TABLE notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  send_after TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  last_error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notification_queue_firm_id ON notification_queue (firm_id);
CREATE INDEX idx_notification_queue_status_send_after ON notification_queue (status, send_after);
```
Comment: queue for email, SMS, WhatsApp, and in-app notifications.

### 20. `audit_log`
```sql
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  diff JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_log_firm_id ON audit_log (firm_id);
CREATE INDEX idx_audit_log_entity ON audit_log (entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log (firm_id, created_at DESC);
```
Comment: append-only immutable audit history; never update or delete rows.

### 21. `ai_suggestions`
```sql
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES firms(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  suggestion_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status ai_suggestion_status NOT NULL DEFAULT 'pending',
  confidence DOUBLE PRECISION,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT ai_suggestions_confidence_range CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
);
CREATE INDEX idx_ai_suggestions_firm_id ON ai_suggestions (firm_id);
CREATE INDEX idx_ai_suggestions_entity ON ai_suggestions (entity_type, entity_id);
CREATE INDEX idx_ai_suggestions_status_expires_at ON ai_suggestions (status, expires_at);
```
Comment: review-required AI output; never auto-persist to core tables.

## Integrity and Tenancy Notes
- Because `instructions.md` fixes table order with `time_entries` and `expenses` before `invoices`, their foreign keys to `invoices` are added after all tables are created:
```sql
ALTER TABLE time_entries
  ADD CONSTRAINT time_entries_invoice_id_fkey
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;

ALTER TABLE expenses
  ADD CONSTRAINT expenses_invoice_id_fkey
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL;
```
- All tenant-scoped queries must filter by JWT-derived `firm_id`
- `audit_log` is append-only by policy and must only be written through the audit service
- `payments.gateway_ref` must be treated as the unique idempotency key
- AI outputs remain pending until an explicit user accept action
- Portal access must be restricted to client-visible and explicitly shared records only

## Typesense `documents` Collection
```json
{
  "name": "documents",
  "fields": [
    { "name": "id", "type": "string" },
    { "name": "firm_id", "type": "string", "facet": true },
    { "name": "matter_id", "type": "string", "facet": true },
    { "name": "title", "type": "string" },
    { "name": "document_type", "type": "string", "facet": true },
    { "name": "tags", "type": "string[]", "facet": true },
    { "name": "ocr_text", "type": "string" },
    { "name": "uploaded_at", "type": "int64", "sort": true }
  ],
  "default_sorting_field": "uploaded_at"
}
```

## Assumptions / Inferred Defaults
- `pgcrypto` and `gen_random_uuid()` are used instead of `uuid-ossp`
- `citext` is used for case-insensitive email uniqueness
- `task_status`, `task_priority`, `invoice_status`, and `payment_status` values beyond the prompt were inferred from the PRD and workflows
- `tasks` uses soft delete via `deleted_at`
- `events.matter_id` is nullable so firm-wide reminders can exist
- `notification_queue.status` stays `TEXT` instead of a strict enum to keep worker states flexible at MVP
- `ai_suggestions` includes `suggestion_type` and optional `confidence` because the workflows imply multiple AI draft types and confidence-based review
- `updated_at` is omitted from append-only or immutable records like `audit_log`, `refresh_tokens`, and `doc_versions`
