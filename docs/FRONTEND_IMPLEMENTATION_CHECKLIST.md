# Frontend Implementation Checklist

This checklist mirrors the Linear project `LegalOS Frontend MVP` and is grouped into the same three frontend tracks.
Last cross-checked against the current frontend routes/components: 2026-03-09.

Status rule:
- `[x]` means the surface is implemented and reflected in current routes/components.
- `[ ]` means work is still open, in review, partial, starter-only, or not implemented enough to treat as done.
- Inline notes call out issues that are actively in review or intentionally partial.

Execution order:
1. Practitioner dashboard
2. Customer portal
3. Landing page

## 1. Practitioner Dashboard (start here)

UI-first sequencing note (2026-03-05): `SPE-9` is deferred to a separate thread.
Current UI-completion order for dashboard: `SPE-14` -> `SPE-15` -> `SPE-16` -> `SPE-17` -> `SPE-18` -> `SPE-19`.

- [x] `SPE-8` Build authenticated practitioner app shell
- [ ] `SPE-9` Wire dashboard home to live practitioner data
- [x] `SPE-10` Implement case list workspace
- [x] `SPE-11` Implement case detail shell and summary header
- [x] `SPE-12` Build task management views for case and personal work
- [x] `SPE-13` Build shared calendar and deadline management UI
- [ ] `SPE-14` Implement document center and case document workflows
- [x] `SPE-15` Implement billing workspace for time, expenses, invoices, and payments
- [ ] `SPE-16` Build notes and audit interfaces
- [ ] `SPE-17` Implement AI suggestion review flows in practitioner UI
- [x] `SPE-18` Build practitioner settings, team, and account screens
- [ ] `SPE-19` Complete dashboard-wide accessibility, responsiveness, and PWA polish

Current dashboard screen status:
- Built for MVP: app shell, dashboard home, cases list/detail, tasks, calendar, billing workspace, invoice detail, case notes, case audit.
- Prototype/backlog only: message center exists in code but is not part of MVP scope.
- Starter/placeholder only: documents, case documents.

## 2. Customer Portal

- [ ] `SPE-26` Build client portal auth and session shell
- [ ] `SPE-27` Implement client case list and case detail timeline
- [ ] `SPE-28` Build shared documents and client upload workflows
- [ ] `SPE-29` Implement portal invoice views and payment initiation
- [ ] `SPE-30` Build derived timeline significance states, visibility cues, and self-service activity feedback UI
- [ ] `SPE-31` Complete customer portal mobile-first QA and accessibility

Deferred messaging backlog:
- Practitioner/internal messaging moves to V2; existing message-center code is prototype only.
- Client portal messaging moves to V2 after the timeline-first portal ships.
- AI-assisted client update drafting also moves to V2 with the broader messaging redesign.
- Richer portal notifications beyond core status and invoice visibility also move to the later portal expansion.

Current portal status:
- Starter/preview routes exist for portal home, case detail, and invoice detail.
- Portal auth/session wiring, timeline data, uploads, and mobile/accessibility QA are not complete enough to mark done.
- Messaging is intentionally deferred and should not be treated as a v1 completion criterion.

## 3. LegalOS Landing Page

- [ ] `SPE-20` Define landing page information architecture and conversion flow
- [ ] `SPE-21` Build LegalOS marketing hero and primary CTA section
- [ ] `SPE-22` Implement feature storytelling sections for Work, Evidence, Money, and AI
- [ ] `SPE-23` Build social proof, FAQ, and objections handling sections
- [ ] `SPE-24` Implement landing navigation, footer, and auth handoff
- [ ] `SPE-25` Complete landing page SEO, performance, and mobile polish

## Frontend-wide Definition of Done

- [ ] All pages have loading, empty, error, and success states
- [ ] Role-based access and visibility rules are enforced in the UI
- [ ] Responsive behavior is verified on mobile, tablet, and desktop
- [ ] Keyboard navigation and base accessibility checks are complete
- [ ] API integrations replace placeholder data on implemented screens
- [ ] Core user journeys are manually smoke-tested before closing issues

Linear sync note:
- This file should stay aligned with the issue states in `LegalOS Frontend MVP`.
- Use the current route/component surface plus the design-system surface-status table as the completion evidence.
