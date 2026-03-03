# Plan: SPE-13 Shared Calendar and Deadline UI

**Generated**: March 3, 2026
**Estimated Complexity**: Medium

## Overview
Implement the practitioner-facing shared calendar workspace and the matter-scoped calendar tab using the same delivery pattern established for `SPE-12` tasks: feature-local types, mock data, server query wrappers, a reusable client component, and route entrypoints that compose the UI from those primitives.

This pass is scoped to frontend UI only. It will ship demoable calendar and deadline management views backed by mock data, with room for later API integration.

## Assumptions
- The scope is limited to frontend implementation for the existing Next.js app.
- Event data remains mocked for this pass, matching how tasks were introduced.
- The firm calendar route (`/calendar`) and matter calendar route (`/matters/[id]/calendar`) should both become functional.
- The UI should emphasize weekly scheduling, urgent deadlines, and reminder visibility, inspired by the provided reference image but adapted to the LegalOS visual system.

## Prerequisites
- Existing Next.js frontend under `frontend/`
- Existing app shell (`Sidebar`, `Topbar`, shared button styles, global CSS tokens)
- Existing matter query helpers for resolving matter titles where needed

## Sprint 1: Calendar Domain and Data Shape
**Goal**: Establish a stable feature module for calendar/events data and UI state.
**Demo/Validation**:
- Import the shared calendar feature from a route without TypeScript errors
- Confirm mocked firm and matter event lists resolve correctly

### Task 1.1: Add calendar feature types
- **Location**: `frontend/src/features/calendar/types.ts`
- **Description**: Define event, reminder, event type, and calendar view/filter types for the shared and matter calendars.
- **Dependencies**: None
- **Acceptance Criteria**:
  - Shared interfaces cover event cards, timeline slots, and deadline summaries
  - Types support filtering by view and matter scope
- **Validation**:
  - TypeScript imports compile from server/query and component layers

### Task 1.2: Add mock event data and selectors
- **Location**: `frontend/src/features/calendar/data/mock.ts`
- **Description**: Add realistic firm-wide and matter-linked event data, plus lookup helpers for firm and matter views.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Mock data includes hearings, filing deadlines, meetings, and reminders
  - Helpers support filtering by matter ID
- **Validation**:
  - Route queries can render non-empty firm and matter calendars

### Task 1.3: Add server query wrappers
- **Location**: `frontend/src/features/calendar/server/queries.ts`
- **Description**: Add cache-backed query helpers mirroring the tasks feature pattern for firm and matter event retrieval.
- **Dependencies**: Task 1.2
- **Acceptance Criteria**:
  - Query helpers return typed payloads for both route entrypoints
  - Matter-specific query safely handles empty IDs
- **Validation**:
  - Route files can `await` the query helpers without additional transformation

## Sprint 2: Shared and Matter Calendar UI
**Goal**: Replace placeholder routes with a reusable calendar workspace that is visually aligned with the existing practitioner dashboard.
**Demo/Validation**:
- Open `/calendar` and see a populated weekly calendar with deadline side panels
- Open `/matters/[id]/calendar` and see the same UI constrained to that matter

### Task 2.1: Build reusable calendar workspace component
- **Location**: `frontend/src/features/calendar/components/CalendarWorkspace.tsx`
- **Description**: Implement a client component with toolbar controls, weekly grid, event cards, deadline agenda, and reminder/deadline insights.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - Component supports firm and matter scopes
  - Layout adapts for desktop and mobile
  - Event cards visually distinguish event types and urgency
- **Validation**:
  - Manual browser check confirms rendering in both routes

### Task 2.2: Wire the shared calendar page
- **Location**: `frontend/src/app/(app)/calendar/page.tsx`
- **Description**: Replace the placeholder with the firm calendar route using the new query helper and reusable component.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - `/calendar` renders the shared calendar workspace
  - Default view shows firm-level events and deadlines
- **Validation**:
  - Manual browser check on `/calendar`

### Task 2.3: Wire the matter calendar page
- **Location**: `frontend/src/app/(app)/matters/[id]/calendar/page.tsx`
- **Description**: Replace the placeholder tab content with the matter-scoped calendar workspace and matter title context.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - `/matters/[id]/calendar` renders matter-filtered events
  - Empty or missing events still produce a coherent state
- **Validation**:
  - Manual browser check on a seeded matter route

## Sprint 3: Styling and QA
**Goal**: Integrate the new workspace into the existing design system and verify it behaves cleanly across breakpoints.
**Demo/Validation**:
- Styling is consistent with the rest of the practitioner dashboard
- No lint-blocking issues are introduced by the change set

### Task 3.1: Add calendar-specific styles
- **Location**: `frontend/src/app/globals.css`
- **Description**: Add scoped calendar workspace styles, event color states, agenda panels, and responsive rules.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - Styles are namespaced and do not regress existing task layouts
  - The weekly grid remains readable on mobile via adaptive layout
- **Validation**:
  - Manual browser resize check

### Task 3.2: Validate the frontend build surface
- **Location**: `frontend/`
- **Description**: Run lint (or the closest available frontend validation) and fix any issues caused by the new feature.
- **Dependencies**: Task 3.1
- **Acceptance Criteria**:
  - Validation completes or any environment-specific blocker is documented
- **Validation**:
  - `npm run lint`

## Testing Strategy
- Manual smoke test `/calendar` for layout, content density, and CTA affordances
- Manual smoke test `/matters/[id]/calendar` for scoped filtering and matter-specific copy
- Responsive check at desktop and mobile widths
- Run `npm run lint` in `frontend/`

## Potential Risks & Gotchas
- Existing worktree changes from the task feature may overlap with shared files like `globals.css`; edits must be appended carefully.
- Weekly grid UIs can become unreadable on smaller screens if the desktop structure is reused unchanged; the mobile layout should stack agenda and timeline sections.
- The top bar and sidebar already include calendar navigation; route-level changes should preserve those existing shell assumptions.
- Because this is mock-data driven, the component shape should avoid overfitting to temporary fixtures so later API integration stays straightforward.

## Rollback Plan
- Revert the new calendar feature files
- Restore the two calendar route files to their placeholder content
- Remove the calendar-specific CSS block from `frontend/src/app/globals.css`
