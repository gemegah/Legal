# Product Requirements Document
## Ghana Legal Practice Management SaaS
*AI-Assisted | Ghana-First | v1.0*

| | |
|---|---|
| **Status** | Draft |
| **Target Release** | MVP -- Q3 2025 |
| **Primary Market** | Ghana (West Africa expansion later) |

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [What We're Building](#2-what-were-building)
3. [Who It's For](#3-who-its-for)
4. [The Core Model -- Case as Container](#4-the-core-model--case-as-container)
5. [Feature Requirements](#5-feature-requirements)
6. [The AI Layer](#6-the-ai-layer)
7. [Key Workflows](#7-key-workflows)
8. [MVP Scope](#8-mvp-scope)
9. [Success Metrics](#9-success-metrics)
10. [Risks](#10-risks)
11. [What We're Not Building](#11-what-were-not-building)

---

## 1. The Problem

Ghana law firms run on spreadsheets, WhatsApp, and physical files. This creates five compounding failures:

**Missed deadlines.** Court dates are tracked in personal diaries. There is no central, firm-wide system with automated reminders. One missed filing can collapse a case.

**Lost documents.** Files live in email threads, USB drives, and WhatsApp chats with no version control and no way to search across them instantly.

**Revenue leakage.** Time is not logged in real time. Invoices are issued late or inconsistently. Collecting payment -- especially via Mobile Money -- requires manual back-and-forth.

**Admin overload.** Clients call for status updates that require staff to interrupt billable work. There's no self-service option.

**No audit trail.** When disputes arise about work done, documents shared, or payments received, there's no tamper-evident record to reference.

Generic Western SaaS tools (Clio, MyCase) don't solve this because they don't support Mobile Money, don't understand Ghana court document formats, and are priced for US firms.

---

## 2. What We're Building

A **Ghana-first law firm operating system** -- a web-based PWA that digitises and streamlines the three core jobs every firm must do:

> **Organise work. Prove work. Get paid.**

An embedded AI layer reduces administrative overhead across document handling, deadline management, and invoicing. The AI is not legal advice -- it is a practical multiplier that generates suggestions humans always confirm.

### First Principles

A law firm transforms inputs into outputs:

**Inputs:** client requests, facts, documents, court notices, time spent, expenses

**Outputs:** organised cases, work completed on time, documents managed correctly, invoices sent and paid, transparent client visibility, and a complete audit trail

The product has exactly three jobs:
1. **Organise work** -- Case system
2. **Prove work** -- Documents + audit
3. **Get paid** -- Billing + payments

---

## 3. Who It's For

| Persona | Role | Primary Needs |
|---------|------|---------------|
| Managing Partner | Firm owner / principal lawyer | Overview of all cases, financial health, team utilisation |
| Associate / Lawyer | Fee earner | Task lists, time logging, document access, deadline visibility |
| Legal Secretary / PA | Admin and support staff | Case intake, scheduling, status tracking, invoice dispatch |
| Client | External portal user | Status updates, document access, invoice payment via MoMo or card |

---

## 4. The Core Model -- Case as Container

Everything in the system revolves around one object: **the Case**.

A Case is a container that holds everything related to a single legal engagement:

- **People** -- client, opposing party, counsel, assigned staff
- **Tasks** -- to-do items with owners and due dates
- **Deadlines / events** -- hearings, filing dates, meetings
- **Documents** -- files with versioning, OCR index, and metadata
- **Notes** -- timestamped working notes
- **Time entries + expenses** -- billable and non-billable
- **Invoices + payments** -- with reconciliation status
- **Audit log** -- immutable record of who did what, when

If Case is designed cleanly, the whole product stays coherent. Every other feature is either a view into a Case, an action on a Case, or a report across Cases.

---

## 5. Feature Requirements

The system is organised into four domains.

---

### Domain 1 -- Work (Case Operations)

**Purpose:** Move cases forward without chaos.

#### Case Management
- Create, edit, archive, and search cases with fields for case type, practice area, status, court, suit number, opposing party, and opposing counsel
- Case dashboard shows status, next deadline, unpaid balance, and recent activity at a glance
- Assign a lead lawyer and additional case members with role-based visibility (lead / member / viewer)
- Bulk case import via CSV for onboarding existing firms

#### Task Management
- Create tasks within a case with title, description, assignee, due date, priority, and status
- Templates: create reusable task checklists per case type (e.g. conveyancing checklist)
- Overdue task alerts via email and in-app notification
- Personal task view: all tasks assigned to the current user across all cases

#### Calendar & Deadlines
- Shared firm calendar with case-linked events
- Event types: hearing, filing deadline, meeting, reminder, other
- Automatic reminders at configurable intervals -- 7 days, 3 days, 1 day, same day
- AI-extracted deadline suggestions from uploaded court documents (user confirms before saving)

#### Notes
- Rich-text notes on any case, timestamped and attributed to the creator
- Pin important notes to the top of the case

---

### Domain 2 -- Evidence (Documents, Search, Audit)

**Purpose:** Store, find, and prove work.

#### Document Management
- Upload PDFs, scans, and Office files to any case
- Version control: every upload creates a new version; previous versions are preserved and accessible
- Tag documents with type (court order, affidavit, contract, etc.) and custom tags
- Share specific documents with the client portal (explicit sharing, not automatic)

#### Search
- Full-text search across all firm documents using OCR-extracted text
- Sub-second results; filter by case, date range, document type, uploader
- Results scoped strictly to the user's own firm

#### Audit Trail
- Every create, update, delete, upload, and view action on any case object is logged
- Log captures: user, action, entity, timestamp, IP address, and a diff of what changed
- Audit log is append-only -- no user, including admin, can delete or modify entries
- Exportable as PDF for compliance or dispute resolution

---

### Domain 3 -- Money (Billing & Payments)

**Purpose:** Get paid faster and reduce revenue leakage.

#### Time & Expense Tracking
- One-click time entry from any case page; start/stop timer also available
- Log expenses with description, amount, date, and optional receipt upload
- Classify entries as billable or non-billable
- Entries lock once included in a sent invoice

#### Invoicing
- Generate an invoice from case time and expense entries
- AI-proposed invoice line items and billing narrative based on logged activity (user reviews and edits before saving)
- Invoice approval workflow: Draft -> Reviewed -> Sent
- Invoice statuses: Draft, Sent, Partially Paid, Paid, Overdue, Void
- Partial payment support

#### Payments
- MoMo payment link per invoice (MTN, Vodafone, AirtelTigo via Hubtel)
- Card payment via Paystack
- Auto-reconciliation on payment webhook: invoice status and paid amount update automatically
- AR aging report: outstanding balances grouped by 0-30, 31-60, 61-90, 90+ days
- Automated overdue reminders to clients at configurable intervals

---

### Domain 4 -- Communication (Client Portal & Notifications)

**Purpose:** Reduce admin load and increase client trust.

#### Client Portal
- Clients log in with their own credentials (separate from firm staff login)
- View a read-only case timeline of significant updates and assigned lawyer
- Download documents explicitly shared by the firm
- Upload documents requested by the firm
- View and pay invoices directly (MoMo or card)
- Timeline entries are derived from significant activity only: case status changes, court/hearing outcomes, shared documents, invoice issued or paid events, payment status changes, and client upload requests or completions
- Cannot see internal notes, non-shared documents, or billing details of other clients

#### Notifications
- Email notifications: deadline reminders, invoice dispatch, payment receipt, overdue alerts
- SMS notifications (opt-in per client)
- WhatsApp notifications (opt-in per client, Phase 2)
- In-app notification centre with read/unread state

---

## 6. The AI Layer

> **AI is not the product. AI is a multiplier.**

The AI layer is a set of assist functions. It reads inputs, generates suggested outputs, and **always requires human review before any data is saved**. It is never presented as legal advice.

| Feature | Input | Output |
|---------|-------|--------|
| **Deadline extraction** | Uploaded court notice (OCR text) | Suggested calendar events and tasks for user review |
| **Case status summary** | Case activity log and notes | Plain-language summary of current status and next steps |
| **Invoice draft** | Logged time entries and expenses | Proposed line items and billing narrative for lawyer review |
| **Intake assist** *(Phase 2)* | Intake form responses | Pre-populated Case, Client, and task checklist |

### Rules for the AI layer

- Every AI suggestion is labelled **"AI Draft -- Review before saving"**
- No AI output is committed to the database without an explicit user confirmation action
- Suggestions expire after 24 hours if not actioned
- Low-confidence deadline extractions (< 0.7) are flagged with a warning

---

## 7. Key Workflows

### Workflow A -- Upload Court Notice -> Never Miss a Deadline

1. Lawyer uploads a PDF court order to a case
2. System creates a document record and queues OCR processing
3. OCR text is sent to the AI service for deadline and party extraction
4. AI returns suggested calendar events with dates, types, and confidence scores
5. Lawyer reviews suggestions, edits if needed, and confirms
6. Events are saved to the case calendar and the firm-wide calendar
7. Reminders are automatically scheduled at 7 days, 3 days, 1 day, and same day

---

### Workflow B -- Case Work -> Invoice -> MoMo Payment

1. Lawyer logs time and expenses against the case throughout the engagement
2. At billing point, clicks **Draft Invoice** -- AI proposes line items and narrative from the activity log
3. Lawyer reviews, edits, and approves the draft
4. Invoice is published to the client portal; a MoMo payment link is generated and emailed to the client
5. Client pays via MoMo USSD prompt on their phone
6. Hubtel sends a payment webhook to the system
7. System auto-reconciles: invoice status updates to Paid, firm receives notification

---

### Workflow C -- Client Portal Reduces Admin Calls

1. Significant case activity occurs: a status changes, a hearing outcome is recorded, a document is shared, an invoice is issued or paid, or an upload request is completed
2. Client portal timeline updates automatically with the derived milestone
3. Client logs in, reviews the timeline, downloads shared documents, uploads requested files, or pays the invoice -- without calling the firm
4. All client actions are saved to the case audit log

---

## 8. MVP Scope

### v1.0 -- Must Have

**Work domain**
- Case CRUD with all core fields
- Task management with assignees, due dates, priorities
- Calendar with deadline events and automated reminders (email + SMS)
- Notes

**Evidence domain**
- Document upload with versioning
- OCR extraction and full-text search
- Immutable audit trail on all case objects

**Money domain**
- Time and expense logging
- Invoice generation with approval workflow
- MoMo (Hubtel) and card (Paystack) payment links
- Auto-reconciliation on payment webhook
- AR aging report

**Communication domain**
- Client portal: derived significant-activity timeline, shared documents, invoices, and payments
- Email notifications

**AI layer**
- Deadline extraction from uploaded documents
- Case status summary
- Invoice draft proposal

**Platform**
- Multi-tenant authentication with RBAC (admin, lawyer, staff, client)
- PWA (works on mobile browser, no app store required)

---

### Phase 2 -- Should Have

- AI intake assist (intake form -> pre-populated case)
- Messaging workspace and practitioner/internal messaging refinement
- Client portal messaging and richer portal notifications
- AI-assisted client update drafting
- WhatsApp Business notification channel
- Automated overdue invoice reminders
- Bulk case CSV import
- Workflow automation (no-code task triggers)
- Full mobile PWA optimisation

---

### Phase 3 -- Nice to Have

- Legal research database integration (third-party API)
- E-signature integration
- Trust accounting
- Advanced analytics (revenue per practice area, utilisation rates)
- Two-factor authentication
- Multi-currency support
- Self-hosted / on-premise option for enterprise clients
- Multi-jurisdiction support (West Africa expansion)

---

## 9. Success Metrics

| Metric | Baseline | MVP Target |
|--------|----------|------------|
| Missed court deadlines per firm per month | Unknown -- manual tracking | 0 confirmed misses |
| Days from work complete to invoice sent | > 7 days typical | â‰¤ 2 days |
| Days sales outstanding (DSO) | > 45 days typical | < 30 days |
| Client portal adoption | 0% | > 60% of active clients |
| Document retrieval time | Minutes to hours | < 10 seconds |
| Lawyer time on admin tasks (hrs/week) | Estimated 8-12 hrs | < 4 hrs |

---

## 10. Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| AI misidentifies deadlines from ambiguous court notices | Medium | All AI suggestions require explicit confirmation; confidence scoring flags uncertain extractions |
| MoMo gateway downtime interrupts payment collection | Medium | Fallback to manual payment recording; auto-retry reconciliation queue |
| Client data breach erodes law firm trust | Low-Medium | Encryption at rest and in transit, row-level tenancy, annual penetration testing |
| Low adoption due to change resistance | High | Onboarding support, migration tooling, quick demo of time-to-invoice improvement |
| Poor OCR quality on handwritten or low-resolution scans | Medium | Confidence scoring; flag low-confidence extractions for full manual review |

---

## 11. What We're Not Building

These are hard exclusions for v1 -- not backlog items, not "maybe later" -- explicitly out of scope to ship fast and manage legal and technical risk:

- **AI legal advice** -- the AI layer generates suggestions only; it never tells a lawyer what to do
- **Outcome prediction** -- no win probability, no sentencing estimates, no risk scoring
- **Autonomous document filing** to any court system
- **Legal research database** -- integrate third-party tools in v2 rather than compete with them
- **Multi-currency** -- GHS only in v1
- **Deletion of audit log entries** -- this must never be implemented, in any version

---

*-- End of PRD --*
