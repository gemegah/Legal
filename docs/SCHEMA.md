# LegalOS Database Schema

## Overview
This document defines the MVP PostgreSQL schema for LegalOS. All tenant-scoped tables include `firm_id`, and `audit_log` is append-only with a BIGSERIAL primary key.

## Tables
1. `firms`
2. `users`
3. `refresh_tokens`
4. `clients`
5. `contacts`
6. `matters`
7. `matter_members`
8. `tasks`
9. `events`
10. `notes`
11. `documents`
12. `doc_versions`
13. `time_entries`
14. `expenses`
15. `invoices`
16. `invoice_lines`
17. `payments`
18. `messages`
19. `notification_queue`
20. `audit_log`
21. `ai_suggestions`

## Key Notes
- `documents.tags` uses `TEXT[]` with a GIN index.
- `doc_versions` stores `ocr_text`, `ocr_status`, and `checksum_sha256`.
- `time_entries.rate_ghs` uses `NUMERIC(12,2)`.
- `payments.gateway_ref` is unique for idempotency.
- `ai_suggestions` stores pending AI output with `expires_at`.
