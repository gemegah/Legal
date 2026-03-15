# Plan: SPE-18 Practitioner Settings, Team, and Account Screens

**Generated**: 2026-03-09
**Estimated Complexity**: Medium-High

## Overview

`SPE-18` should replace the current `/settings` placeholder with a real settings area for practitioner users, split into three screens:

1. **Practice Settings**: firm-level operational defaults and firm identity
2. **Team**: user roster, invites, role changes, access status
3. **Account**: current user profile, password/security, notification preferences

The implementation should follow the existing LegalOS dashboard patterns:

- App Router route entrypoints under `frontend/src/app/(app)`
- feature-local `components`, `types`, `server/queries`, and `server/repository`
- UI-first delivery backed by realistic mock/repository data where backend contracts do not yet exist

Visually, the settings area should feel calmer and more editorial than the high-density workspaces:

- use the existing forest, cream, gold, and ink palette from `docs/DESIGN_SYSTEM.md`
- keep Playfair Display for major headings and DM Sans for UI text
- add a dedicated settings sub-navigation rather than one oversized single page
- favor clear card groupings, restrained status color, and strong section hierarchy over dense tables everywhere

## Repo Constraints

- `frontend/src/app/(app)/settings/page.tsx` is currently a placeholder stub.
- The dashboard shell already routes users into `/settings` from the sidebar and topbar metadata.
- Existing API docs already support most **team-management** work:
  - `GET /v1/auth/me`
  - `GET /v1/users`
  - `POST /v1/users/invite`
  - `PATCH /v1/users/{id}`
  - `POST /v1/users/{id}/deactivate`
- Existing docs do **not** yet define firm-settings endpoints or self-serve account preference endpoints.
- Tenant safety and role enforcement must stay aligned with `legalos/agents.md`: all tenant-scoped reads and writes derive `firm_id` from JWT, never from the client.

## Competitor Research Summary

Research date: 2026-03-09

### Competitor patterns that repeated across Clio, MyCase, PracticePanther, and Smokeball

- Settings are usually divided into **personal**, **firm/account**, and **users/team** sections instead of one flat page.
- **Admin-only** controls govern firm settings, billing defaults, and user management.
- **Personal account** settings are self-serve and usually include profile, password, timezone, notifications, and MFA/security actions.
- Team management is not just invite/deactivate. Competitors expose **role/permission visibility**, **last login or status**, and **security reset actions**.
- Deactivation typically preserves work history and assignments rather than deleting the user.
- Legal SaaS competitors frequently separate **case visibility** from **billing visibility**, because finance access is more sensitive than ordinary case collaboration.

### Product takeaways for LegalOS

- LegalOS should mirror the same IA split, but avoid importing competitor complexity wholesale.
- For v1, the highest-value screens are:
  - firm profile + defaults
  - staff roster + invites + role/status controls
  - self-service account/security/preferences
- Custom roles, office locations, user groups, and heavy admin configuration should stay out of scope unless needed for `SPE-18`.
- Because LegalOS is Ghana-first, billing/payment defaults should reference the real product constraints already in the repo:
  - GHS-only
  - Hubtel + Paystack context
  - reminder cadence and firm contact identity case more than US-specific accounting setup

## Recommended Information Architecture

### Route structure

- `frontend/src/app/(app)/settings/layout.tsx`
- `frontend/src/app/(app)/settings/page.tsx`
- `frontend/src/app/(app)/settings/practice/page.tsx`
- `frontend/src/app/(app)/settings/team/page.tsx`
- `frontend/src/app/(app)/settings/account/page.tsx`

### Feature structure

- `frontend/src/features/settings/types.ts`
- `frontend/src/features/settings/data/mock.ts`
- `frontend/src/features/settings/server/repository.ts`
- `frontend/src/features/settings/server/queries.ts`
- `frontend/src/features/settings/components/SettingsShell.tsx`
- `frontend/src/features/settings/components/PracticeSettingsClient.tsx`
- `frontend/src/features/settings/components/TeamSettingsClient.tsx`
- `frontend/src/features/settings/components/AccountSettingsClient.tsx`

### Screen responsibilities

#### Practice Settings

- Firm identity:
  - workspace name
  - legal name
  - primary email
  - primary phone
  - timezone
- Operational defaults:
  - default reminder cadence
  - default payment reminder behavior
  - invoice footer or billing note copy
- Access framing:
  - clearly label which fields are admin-only
  - display read-only explanatory blocks for settings that are planned but not yet wired

#### Team

- Team roster with:
  - full name
  - email
  - role
  - active/inactive state
  - invite status if pending
  - last login
- Actions:
  - invite new staff user
  - edit role
  - activate/deactivate user
  - filter by role/status
- Visibility rules:
  - admins can mutate users
  - lawyers/staff should see a restricted explanatory state, not broken controls

#### Account

- Current user profile:
  - name
  - email
  - title
  - timezone
  - optional phone
- Security:
  - password change entrypoint
  - MFA status card
  - recent session/login activity placeholder if no backend contract exists yet
- Preferences:
  - notification toggles
  - reminder digest preferences
  - interface defaults that belong to the individual user, not the firm

## Sprint 1: Settings Foundation

**Goal**: Replace the stub with a real settings shell and sub-route structure.

**Demo/Validation**:

- `/settings`, `/settings/practice`, `/settings/team`, and `/settings/account` render inside the existing dashboard shell
- secondary settings navigation works on desktop and mobile
- settings pages visually match the dashboard's existing density, spacing, and typography

### Task 1.1: Add settings feature scaffolding

- **Location**:
  - `frontend/src/features/settings/*`
- **Description**:
  - create the settings feature module with types, mock data, repository, and query helpers following the same pattern as billing/messages
- **Dependencies**: none
- **Acceptance Criteria**:
  - settings data can be fetched server-side by route entrypoints
  - initial data shape supports all three screens without ad hoc props
- **Validation**:
  - typecheck and lint pass for new feature files

### Task 1.2: Introduce nested settings routes and shared shell

- **Location**:
  - `frontend/src/app/(app)/settings/layout.tsx`
  - `frontend/src/app/(app)/settings/page.tsx`
  - `frontend/src/app/(app)/settings/practice/page.tsx`
  - `frontend/src/app/(app)/settings/team/page.tsx`
  - `frontend/src/app/(app)/settings/account/page.tsx`
- **Description**:
  - add a dedicated settings layout with section nav and shared page framing
  - make `/settings` redirect or default to `practice`
- **Dependencies**:
  - Task 1.1
- **Acceptance Criteria**:
  - route transitions preserve the app shell
  - active state is clear in the settings sub-nav
  - mobile layout stacks cleanly without horizontal overflow
- **Validation**:
  - manual route smoke check in browser

### Task 1.3: Add settings-specific styling tokens and layout rules

- **Location**:
  - `frontend/src/app/globals.css`
  - or a feature-local stylesheet if the repo pattern warrants it
- **Description**:
  - add styles for settings nav, settings cards, roster layout, and account/security panels
- **Dependencies**:
  - Task 1.2
- **Acceptance Criteria**:
  - no new generic one-off utility sprawl
  - settings styling reads as part of the same product, not a disconnected admin panel
- **Validation**:
  - desktop/tablet/mobile screenshots or browser checks

## Sprint 2: Practice Settings Screen

**Goal**: Deliver the firm-level settings screen with clear admin framing.

**Demo/Validation**:

- practice settings show populated firm identity and defaults
- save actions work against mock/repository state or wired API if available
- non-admin state is legible and intentional

### Task 2.1: Model practice settings data and repository methods

- **Location**:
  - `frontend/src/features/settings/types.ts`
  - `frontend/src/features/settings/data/mock.ts`
  - `frontend/src/features/settings/server/repository.ts`
  - `frontend/src/features/settings/server/queries.ts`
- **Description**:
  - define the firm settings shape aligned to existing schema/API terminology where possible
- **Dependencies**:
  - Sprint 1 foundation
- **Acceptance Criteria**:
  - fields map cleanly to existing `firms` schema terms where possible
  - default reminder and billing defaults are represented explicitly
- **Validation**:
  - route renders complete non-empty state

### Task 2.2: Build the Practice Settings client UI

- **Location**:
  - `frontend/src/features/settings/components/PracticeSettingsClient.tsx`
- **Description**:
  - implement grouped cards for firm profile, operational defaults, and billing defaults
  - reuse existing `Input`, `Button`, `Badge`, and modal patterns where possible
- **Dependencies**:
  - Task 2.1
- **Acceptance Criteria**:
  - edit affordances are obvious
  - explanatory helper text reflects Ghana-first product constraints
  - empty/error/success microstates are present
- **Validation**:
  - manual browser QA across breakpoints

### Task 2.3: Define backend follow-up for firm settings APIs

- **Location**:
  - `docs/API.md`
  - `backend/app/routers/*`
  - `backend/app/services/*`
  - `backend/app/tests/*`
- **Description**:
  - document or implement the missing read/update endpoints for firm settings if `SPE-18` is intended to go beyond UI-first mocks
- **Dependencies**:
  - Task 2.1
- **Acceptance Criteria**:
  - clear contract exists for reading/updating firm settings
  - admin-only enforcement is explicit
- **Validation**:
  - API doc update and service/router tests if implemented

## Sprint 3: Team Screen

**Goal**: Deliver a usable team roster and user-management workspace for admins.

**Demo/Validation**:

- admin can view user roster, invite a user, edit a role, and deactivate a user
- non-admin experience clearly explains restrictions
- list states cover pending, active, inactive, and empty filters

### Task 3.1: Connect team data to existing user API contracts

- **Location**:
  - `frontend/src/features/settings/server/repository.ts`
  - optional shared API client files if they already exist in the frontend
- **Description**:
  - wire repository methods to `GET /v1/users`, `POST /v1/users/invite`, `PATCH /v1/users/{id}`, and `POST /v1/users/{id}/deactivate`
  - if live frontend API plumbing does not exist yet, keep realistic repository mocks with the same contract shape
- **Dependencies**:
  - Sprint 1 foundation
- **Acceptance Criteria**:
  - data shape includes last login and invite status
  - role and active state can be represented without UI hacks
- **Validation**:
  - manual CRUD smoke check against mock or live contract

### Task 3.2: Build the Team roster and controls

- **Location**:
  - `frontend/src/features/settings/components/TeamSettingsClient.tsx`
- **Description**:
  - implement team KPIs, filter controls, roster table/cards, invite modal, and per-user action menus
- **Dependencies**:
  - Task 3.1
- **Acceptance Criteria**:
  - desktop uses a readable roster/table layout
  - mobile collapses into cards without losing actions
  - deactivation copy makes clear that historical work remains intact
- **Validation**:
  - manual browser QA

### Task 3.3: Add permission-aware states

- **Location**:
  - team client component and route-level query plumbing
- **Description**:
  - ensure admins get mutating controls while lawyers/staff get limited or read-only states
- **Dependencies**:
  - Task 3.2
- **Acceptance Criteria**:
  - hidden or disabled controls are intentional and explained
  - no admin-only CTA is accidentally available to non-admin roles
- **Validation**:
  - role-based UI smoke test using mocked viewer variants

## Sprint 4: Account Screen

**Goal**: Deliver a polished self-service account page for the signed-in practitioner.

**Demo/Validation**:

- account page shows the current user profile
- security and preferences are organized into clear cards
- missing backend pieces are handled with deliberate placeholders rather than fake completeness

### Task 4.1: Connect current-user data

- **Location**:
  - `frontend/src/features/settings/server/repository.ts`
  - `frontend/src/features/settings/server/queries.ts`
- **Description**:
  - use `GET /v1/auth/me` as the base account context
  - extend with mock preference/security data until real endpoints exist
- **Dependencies**:
  - Sprint 1 foundation
- **Acceptance Criteria**:
  - account page always has a reliable viewer context
  - user profile content is not duplicated ad hoc from sidebar constants
- **Validation**:
  - route renders correctly with current user data

### Task 4.2: Build profile, security, and preferences panels

- **Location**:
  - `frontend/src/features/settings/components/AccountSettingsClient.tsx`
- **Description**:
  - implement separate cards for profile, password/security, and notification preferences
  - highlight MFA/session state as a first-class security block rather than burying it in a generic form
- **Dependencies**:
  - Task 4.1
- **Acceptance Criteria**:
  - user can distinguish personal settings from firm settings immediately
  - card hierarchy remains clear on small screens
  - security actions are visually prominent but not alarmist
- **Validation**:
  - browser QA on desktop/mobile

### Task 4.3: Define backend follow-up for self-service account APIs

- **Location**:
  - `docs/API.md`
  - backend router/service/test files as needed
- **Description**:
  - document or implement any missing endpoints for:
    - updating own profile
    - changing password
    - saving notification preferences
    - exposing session/MFA status
- **Dependencies**:
  - Task 4.1
- **Acceptance Criteria**:
  - missing contracts are explicit and not buried in frontend TODOs
  - security-sensitive mutations are scoped to the current user or admins as appropriate
- **Validation**:
  - API doc review and tests if backend work is included

## Sprint 5: Polish, Accessibility, and QA

**Goal**: Make the settings area feel production-ready rather than like a leftover admin page.

**Demo/Validation**:

- keyboard navigation works across settings nav, forms, modals, and menus
- all three settings screens are responsive
- loading, empty, error, and success states exist

### Task 5.1: Accessibility and interaction pass

- **Location**:
  - settings components and shared styling
- **Description**:
  - verify focus order, labels, error messaging, pressed states, and modal accessibility
- **Dependencies**:
  - Sprints 2-4
- **Acceptance Criteria**:
  - tab flow is complete
  - interactive controls have visible focus and accessible naming
- **Validation**:
  - keyboard-only manual test

### Task 5.2: Responsive and state-completeness pass

- **Location**:
  - settings routes/components
- **Description**:
  - add mobile/tablet polish and verify all state variants
- **Dependencies**:
  - Sprints 2-4
- **Acceptance Criteria**:
  - no overflow or broken table/card behavior on narrow screens
  - loading/empty/error/success states exist per screen
- **Validation**:
  - manual responsive QA

### Task 5.3: Verification and closure

- **Location**:
  - frontend and any touched backend surface
- **Description**:
  - run the smallest relevant verification subset before closing the issue
- **Dependencies**:
  - Task 5.1
  - Task 5.2
- **Acceptance Criteria**:
  - verification output is captured and any skipped checks are called out explicitly
- **Validation**:
  - `pnpm --dir legalos/frontend lint`
  - `pnpm --dir legalos/frontend build`
  - `cd legalos/backend; pytest` if backend contracts/tests changed

## Testing Strategy

- Prefer UI-first incremental delivery with one screen merged at a time.
- Reuse repository/query patterns already present in billing, messages, calendar, and documents.
- Add unit coverage for any new pure helpers in the settings feature.
- If backend APIs are added, cover:
  - admin authorization for firm/team mutations
  - self-service scoping for account mutations
  - tenant isolation for all user and firm reads/writes

## Potential Risks and Gotchas

- **Scope creep from competitors**: Clio/MyCase-style settings can easily expand into billing setup, templates, custom fields, integrations, and CRM administration. Keep `SPE-18` limited to practice, team, and account.
- **Missing backend contracts**: team APIs are already documented, but firm/account endpoints are not. The plan must explicitly separate UI-first placeholders from live-write functionality.
- **Role ambiguity**: `admin`, `lawyer`, and `staff` should not all receive the same settings controls. This needs deliberate UX, not just hidden buttons.
- **Sensitive finance access**: team permissions should not imply blanket billing visibility without explicit policy.
- **Deactivation semantics**: the UI must make clear that deactivation removes access but preserves audit/work history.
- **Timezone and reminders**: these settings have real downstream effects on deadlines and client reminders, so labels and defaults need to be precise for Ghana-based firms.

## Recommended Assumptions

- Use a **three-screen settings IA** instead of a single long page.
- Treat **Practice Settings** and **Team** as admin-owned surfaces.
- Treat **Account** as self-service for every authenticated practitioner user.
- Ship **role-based read-only states** for non-admin users rather than blocking them from the entire settings route.
- Keep **custom roles, user groups, and multi-office setup** out of the initial scope unless product explicitly adds them.

## Rollback Plan

- If nested settings routing proves too disruptive, keep `/settings` as the shell and gate the three surfaces behind internal tabs first.
- If backend endpoints are not ready, ship the screens with repository-backed mocks and explicit "coming next" treatment for unwired save actions instead of inventing unstable contracts.
- If the team screen becomes the only backend-ready surface, merge it first and keep practice/account behind staged follow-up tickets.

## Competitor Sources

- Clio Manage user and permissions model:
  - https://help.clio.com/hc/en-us/articles/9199060880411-Manage-Users-in-Clio-Manage
  - https://help.clio.com/hc/en-us/articles/9200279456667-Account-Users-and-Permissions
  - https://help.clio.com/hc/en-us/articles/9284653811739-User-Security-Settings-for-Administrators
  - https://help.clio.com/hc/en-150/articles/9290346939547-Set-Up-Clio-Manage
- MyCase settings, permissions, and account/security patterns:
  - https://supportcenter.mycase.com/en/articles/9369855-navigating-settings-in-mycase
  - https://supportcenter.mycase.com/en/articles/9369840-editing-user-access-permissions
  - https://supportcenter.mycase.com/en/articles/9369819-how-do-i-access-my-account-settings-page
  - https://supportcenter.mycase.com/en/articles/9369842-resetting-multi-factor-authentication-for-users
- PracticePanther profile, roles, and user management:
  - https://support.practicepanther.com/en/articles/480046-how-to-edit-your-profile-in-practicepanther-s-settings
  - https://support.practicepanther.com/en/articles/479878-deactivating-and-reactivating-users
  - https://support.practicepanther.com/en/articles/480113-access-levels-tutorial
  - https://support.practicepanther.com/en/articles/2828514-save-time-when-assigning-users-with-user-groups
- Smokeball permission management:
  - https://support.smokeball.com/hc/en-us/articles/8402863411991-Managing-Staff-and-User-Permissions-in-Smokeball
