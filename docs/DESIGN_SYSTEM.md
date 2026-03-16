# LegalOS Design System Handoff

Last updated: 2026-03-16

This document is the practitioner-first UI handoff for LegalOS. It replaces the earlier token stub with a production-ready design-system specification grounded in three sources of truth:

1. The implemented frontend surfaces in `legalos/frontend`
2. The product intent in `legalos/docs/PRD.md`
3. The committed visual references in `legalos/docs/designs`

The goal is not to rebrand LegalOS. The goal is to make the current visual system explicit enough that another coding agent can extend it consistently, migrate pieces to stronger primitives, and ship unfinished screens without re-deciding the design language.

No runtime API contracts are defined here. The public interface is the documentation contract consumed by designers and coding agents.

## 1. Product Intent And Scope

### 1.1 Design objective

LegalOS is a Ghana-first legal practice management system. The interface must support three product jobs from the PRD:

- Organise work
- Prove work
- Get paid

The UI should therefore feel:

- Professional, structured, and calm rather than generic SaaS
- Dense enough for legal operations, but not visually noisy
- Explicit about status, urgency, and ownership
- Trustworthy around money, audit trails, and client-facing visibility
- Conservative with AI, always presenting it as reviewed assistance rather than autonomous output

### 1.2 Primary surface in this revision

This design system is practitioner-first. It is written for the authenticated practitioner dashboard and case operations workspace.

Primary coverage:

- App shell
- Dashboard home
- Cases list workspace
- Case detail shell
- Tasks workspace
- Shared calendar and case calendar
- Billing workspace
- Invoice detail
- Notes workspace
- Audit workspace
- Settings hub and child screens

Secondary inheritors, not primary design targets in this revision:

- Portal
- Auth
- Marketing

For portal work in this phase, extend toward a timeline-first self-service surface for derived significant updates, invoices, and shared documents. Do not treat any messaging surface as part of the v1 target.

Partial surfaces that must be documented truthfully as incomplete:

- Documents center
- Case documents

### 1.3 Surface status as of this handoff

| Surface | Status | Handoff expectation |
|---|---|---|
| App shell | Implemented | Fully specified |
| Dashboard home | Implemented | Fully specified |
| Cases list | Implemented | Fully specified |
| Case detail shell | Implemented | Fully specified |
| Tasks | Implemented | Fully specified as workspace pattern |
| Shared calendar | Implemented | Fully specified |
| Billing workspace | Implemented | Fully specified |
| Invoice detail | Implemented | Fully specified |
| Notes | Implemented | Fully specified as case sub-workspace |
| Audit | Implemented | Fully specified as case sub-workspace |
| Messages | Deferred / hidden | Code remains in the repo, but the practitioner route is not shipped in nav and currently returns `notFound()` |
| Settings | Implemented | Fully specified |
| Documents center | Partial implementation | Mock-backed workspace is shipped, but full backend integration and completion criteria are still open |
| Case documents | Partial implementation | Case-scoped document workflow is shipped on the same mock-backed pattern, but still not complete enough to mark done |
| Portal surfaces | Starter only | Shared tokens plus timeline-first portal guidance; client messaging stays deferred |
| Auth surfaces | Starter only | Shared tokens only |

## 2. Visual Language Summary

LegalOS uses a restrained legal-operational palette:

- Deep forest green as the primary authority color
- Warm gold as the emphasis and action color
- Cream and soft off-white neutrals for working canvas and cards
- Dark ink for typography and high-value numeric content

The tone should stay closer to "practice operations system" than "high-saturation startup dashboard".

Core visual rules:

- Gold is for emphasis, selected states, and value accents. It must not flood the interface.
- Forest is for authority, navigation, and primary action.
- Cream is an active working canvas, not a decorative background.
- Display type is reserved for page titles, case titles, invoice numbers, and KPI numbers that justify gravitas.
- Most workspace composition should rely on clean cards, separators, pills, tables, and muted labels rather than decorative illustration.

## 3. Source References

Use these as grounding references before introducing new UI:

- `legalos/frontend/src/app/tokens.css`
- `legalos/frontend/src/app/globals.css`
- `legalos/frontend/src/components/layout/AppShell.tsx`
- `legalos/frontend/src/components/layout/Sidebar.tsx`
- `legalos/frontend/src/components/dashboard/DashboardHome.tsx`
- `legalos/frontend/src/features/calendar/components/CalendarWorkspace.tsx`
- `legalos/frontend/src/features/settings/components/SettingsShell.tsx`

If code and screenshots disagree, follow the code for shipped behavior and the screenshots for intended composition.

## 4. Semantic Token Contract

This section defines the canonical token vocabulary. New screens should use semantic roles first and raw color values only when defining the token source itself.

### 4.1 Palette families

Only two named hue palettes should drive the product.

#### Primary palette

Derived from the current forest family.

| Token | Value | Use |
|---|---|---|
| `primary-50` | `#eef5f1` | soft fills, selected backgrounds in light mode |
| `primary-100` | `#d8e9df` | low-emphasis surfaces |
| `primary-200` | `#b6d1c1` | subtle borders and badges |
| `primary-300` | `#8bb39b` | supportive chart or tag accents |
| `primary-400` | `#5f9376` | supportive states |
| `primary-500` | `#1e5038` | active supportive UI |
| `primary-600` | `#143d29` | elevated nav and strong emphasis |
| `primary-700` | `#103423` | deep emphasis |
| `primary-800` | `#0b2d1e` | primary brand/nav color |
| `primary-900` | `#071d14` | dark mode anchor surface |

#### Secondary palette

Derived from the current gold family.

| Token | Value | Use |
|---|---|---|
| `secondary-50` | `#fdf7eb` | soft highlight fills |
| `secondary-100` | `#f8ebc7` | low-emphasis badges |
| `secondary-200` | `#efd793` | supportive emphasis |
| `secondary-300` | `#e4b96a` | warm highlight text or icon |
| `secondary-400` | `#d9a84c` | active secondary emphasis |
| `secondary-500` | `#c9963a` | canonical gold |
| `secondary-600` | `#b58327` | stronger CTA emphasis |
| `secondary-700` | `#966b1f` | dense highlight text |
| `secondary-800` | `#765319` | dark mode edge emphasis |
| `secondary-900` | `#5b4014` | specialty dark gold |

### 4.2 Neutral scale

The interface depends heavily on neutrals. These should be treated as a proper scale, not leftovers.

| Token | Value | Use |
|---|---|---|
| `neutral-0` | `#ffffff` | elevated surface |
| `neutral-25` | `#faf8f3` | default canvas / cream |
| `neutral-50` | `#f3f0e8` | tinted canvas sections |
| `neutral-100` | `#e8e4da` | default border |
| `neutral-200` | `#d6d1c5` | stronger border |
| `neutral-300` | `#b7b0a2` | disabled text and dividers |
| `neutral-500` | `#7a7a72` | muted text |
| `neutral-700` | `#3d3d39` | support text / icons |
| `neutral-900` | `#1a1a18` | primary text / ink |

### 4.3 Status accents

These are supporting accents, not alternate brands.

| Token | Value | Use |
|---|---|---|
| `success` | `#1d6e4a` | paid, active completion, positive validation |
| `warning` | `#b8860b` | pending, reminders, AI caution, aging balances |
| `danger` | `#c0392b` | urgent deadlines, overdue states, destructive warnings |
| `info` | `#1a4a7a` | AI metadata, informational states |

### 4.4 Semantic color roles

Use these roles when describing or implementing screens.

| Role | Light mode | Dark mode target | Notes |
|---|---|---|---|
| `bg-canvas` | `neutral-25` | `#0d1110` | page background |
| `bg-surface` | `neutral-0` | `#131918` | standard card surface |
| `bg-surface-elevated` | `#ffffff` | `#18201e` | dialogs, elevated cards |
| `bg-panel-tint` | `secondary-50` or subtle gradient | `#171d1b` with restrained glow | hero panels and softly framed sections |
| `bg-sidebar` | `primary-800` | `primary-900` | persistent navigation |
| `border-subtle` | `neutral-100` | `rgba(255,255,255,0.08)` | default border |
| `border-strong` | `neutral-200` | `rgba(255,255,255,0.16)` | selected states and dense cards |
| `text-primary` | `neutral-900` | `#f3f1ea` | main copy |
| `text-secondary` | `neutral-500` | `#bdb7ab` | muted copy |
| `icon-default` | `neutral-700` | `#d2ccbf` | utility icons |
| `nav-link-default` | `rgba(255,255,255,0.50)` | `rgba(255,255,255,0.56)` | inactive sidebar links |
| `nav-link-active-bg` | `rgba(201,150,58,0.16)` | `rgba(201,150,58,0.20)` | active nav background |
| `nav-link-active-text` | `secondary-300` | `secondary-200` | active nav text/icon |
| `focus-ring` | `rgba(201,150,58,0.20)` | `rgba(228,185,106,0.26)` | shared focus treatment |
| `row-selected` | `secondary-50` | `rgba(201,150,58,0.10)` | selected rows/cards |
| `ai-highlight` | `info` + `secondary-500` support | muted blue with gold edge | AI review surfaces only |
| `client-safe-highlight` | `secondary-50` | `rgba(201,150,58,0.12)` | client-visible communication |
| `danger-highlight` | `rgba(192,57,43,0.10)` | `rgba(192,57,43,0.14)` | urgent deadline and destructive warning backgrounds |

### 4.5 Typography contract

| Role | Typeface | Weight | Guidance |
|---|---|---|---|
| `type-display` | Playfair Display | 500 to 600 | page titles, case titles, invoice numbers, hero-level metrics |
| `type-section-title` | Playfair Display | 500 | panel titles and internal workspace headings |
| `type-body` | DM Sans | 400 to 500 | core UI copy, rows, forms |
| `type-label` | DM Sans | 600 to 700 | field labels, table headers, eyebrow labels |
| `type-meta` | DM Sans | 500 to 600 | supporting copy, timestamps, hints |
| `type-numeric-display` | Playfair Display | 500 | KPI values and financial totals |

Sizing guidance:

- Display title: clamp from `2rem` to `3.5rem` depending on surface
- Case or page title: `1.5rem` to `2.15rem`
- Section title: `0.9375rem` to `1.35rem`
- Body UI copy: `0.875rem` to `1rem`
- Meta copy: `0.6875rem` to `0.8125rem`

### 4.6 Spacing, radius, border, shadow, and motion

#### Spacing scale

Use the existing spacing rhythm from `tokens.css`.

| Token | Value |
|---|---|
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |

#### Radius scale

| Token | Value | Use |
|---|---|---|
| `radius-sm` | `6px` | inner tags, compact controls |
| `radius-md` | `8px` | inputs, small cards, rows |
| `radius-lg` | `12px` | standard cards |
| `radius-xl` | `16px` to `18px` | hero panels and modal shells |
| `radius-pill` | `20px` | pills and status chips |
| `radius-full` | `9999px` | avatars and circular icon buttons |

#### Border and elevation

| Token | Value | Use |
|---|---|---|
| `border-default` | `1px` | standard outline |
| `shadow-sm` | `0 1px 4px rgba(0,0,0,0.05)` | default surface |
| `shadow-md` | `0 4px 18px rgba(0,0,0,0.07)` | hero surfaces |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.10)` | dialog depth |
| `shadow-ai` | `0 6px 20px rgba(0,0,0,0.15)` | AI suggestion cards only |

#### Motion

| Token | Value | Use |
|---|---|---|
| `transition-fast` | `140ms ease` | hover, select, focus |
| `transition-normal` | `180ms ease` | panel expansion or state shift |

Motion should be understated. No bouncy or playful transitions.

### 4.7 Layout constants

These values are already encoded in the current frontend and should remain stable unless the shell is intentionally redesigned.

| Token | Value | Use |
|---|---|---|
| `sidebar-width` | `216px` | practitioner desktop nav |
| `topbar-height` | `60px` | global app header |
| `content-padding-desktop` | `22px 28px 28px` | practitioner content well |
| `card-padding-default` | `20px` to `22px` | standard workspace cards |
| `hero-gap-default` | `20px` to `24px` | hero composition spacing |

## 5. Responsive System

LegalOS should use Tailwind default breakpoints exactly.

| Breakpoint | Min width | Primary intent |
|---|---|---|
| `sm` | `640px` | large mobile / small tablet |
| `md` | `768px` | tablet |
| `lg` | `1024px` | compact desktop |
| `xl` | `1280px` | standard desktop |
| `2xl` | `1536px` | spacious desktop |

### 5.1 Density modes

#### Desktop workspace mode: `lg` and above

- Persistent sidebar remains visible
- Tables remain tabular
- KPI and stat grids can render in 3 to 4 columns
- Multi-panel workspaces may use 2 to 3 columns
- Toolbar filters can remain inline

#### Tablet transitional mode: `md` to `lg`

- Sidebar should convert to collapsible sheet behavior if needed
- Hero surfaces can stack content and actions
- KPI grids reduce to 2 columns
- Dense tables should hide secondary columns before becoming cards
- Side panels move below the main work area

#### Mobile stacked mode: below `md`

- Sidebar becomes off-canvas
- Topbar remains compact and task-oriented
- Cards, filters, and actions stack vertically
- Tables become stacked record cards
- Every workspace should present one dominant column with secondary panels below
- Empty, loading, and error states must stay concise and not rely on wide layouts

### 5.2 Layout family collapse rules

| Family | Desktop | Tablet | Mobile |
|---|---|---|---|
| App shell | fixed sidebar + topbar + content | sidebar collapses | sheet nav + compact topbar |
| Workspace heroes | split copy/actions or copy/metrics | stack on smaller widths | single-column stack |
| KPI grids | 4-up or 3-up | 2-up | 1-up or 2-up depending on card depth |
| Filter bars | inline pills and search | wrap into rows | stacked controls |
| Tables | full columns | trim non-critical columns | record cards |
| Calendar/audit/settings | multi-column | reduce to 2 then 1 | single column |

## 6. Component Handoff Catalog

The system should map toward shadcn primitives where a standard primitive exists. Because this repo is not yet initialized for shadcn, treat the following as a target composition contract, not an immediate migration plan.

### 6.1 App shell

- Anatomy:
  - persistent sidebar
  - topbar with page title, optional subtitle, search, notifications, user avatar
  - scrollable content region
- States:
  - default
  - active nav item
  - hover nav item
  - unread count badge
  - compact/mobile nav
- Responsive:
  - fixed sidebar on desktop
  - sheet or drawer navigation below `lg`
- Shadcn mapping:
  - `Sidebar`
  - `Input` for search
  - `Button` or icon button variants for notifications
  - `Avatar`
  - `DropdownMenu` for account actions
- Bespoke allowance:
  - Sidebar branding block and firm card may stay custom wrappers around standard primitives

### 6.2 Hero panels and workspace intros

- Anatomy:
  - eyebrow label
  - display or page title
  - supporting copy
  - metrics or actions on the right
- States:
  - default
  - accent-tinted
  - read-only informational
- Responsive:
  - split composition at desktop
  - stack copy, actions, and metrics below `lg`
- Shadcn mapping:
  - `Card`
  - `Badge`
  - `Button`
  - `Separator` where internal sections exist
- Bespoke allowance:
  - gradient treatment may remain custom, but the structure should still read as card composition

### 6.3 Cards and stat cards

- Anatomy:
  - label
  - prominent numeric or status value
  - short explanatory copy
- States:
  - default
  - success
  - warning
  - danger
  - selected
- Responsive:
  - cards must support 1-up, 2-up, 3-up, and 4-up grids
- Shadcn mapping:
  - `Card`
  - `Badge` for state
- Bespoke allowance:
  - stat numerics can use custom typography tokens

### 6.4 Buttons, badges, chips, and pills

- Current LegalOS variants:
  - primary
  - accent
  - ghost
  - subtle
- Required states:
  - default
  - hover
  - focus
  - disabled
  - loading
  - active/selected where applicable
- Shadcn mapping:
  - `Button`
  - `Badge`
- Rules:
  - use pills for compact statuses, filters, and linked case references
  - do not invent custom text-link buttons where `Button` with a lightweight variant is sufficient
  - badge color meaning must remain consistent across workspaces

### 6.5 Inputs, selects, textareas, and validation

- Anatomy:
  - label
  - control
  - hint or helper text
  - validation copy when invalid
- States:
  - default
  - focus
  - invalid
  - disabled
  - read-only where needed
- Responsive:
  - form grids can be 2-column on desktop, but collapse to 1 column below `md`
- Shadcn mapping:
  - `Input`
  - `Select`
  - `Textarea`
  - `Label`
  - `Form`-style field grouping where available
- Rules:
  - do not hardcode form chrome with ad hoc wrappers if a form primitive is available
  - validation should rely on border, focus, and supporting copy, not color alone

### 6.6 Tabs and segmented filters

- Anatomy:
  - container list
  - triggers
  - active state with clear fill or border change
- States:
  - default
  - hover
  - active
  - disabled if needed
- Responsive:
  - may wrap or horizontally scroll
- Shadcn mapping:
  - `Tabs`
  - `Badge` for counts where needed
- Rules:
  - case sub-navigation and workspace filter chips should feel related but not identical
  - active state should use gold-tinted emphasis, not saturated fills

### 6.7 Tables, rows, and empty states

- Anatomy:
  - header row
  - data rows
  - status pill
  - optional row chevron
  - footer action or pagination stub
- States:
  - default
  - hover
  - selected
  - urgent row
  - empty
  - loading
- Responsive:
  - table on desktop
  - trimmed columns on tablet
  - card stack on mobile
- Shadcn mapping:
  - `Table`
  - `Badge`
  - `Skeleton`
  - `Empty` equivalent pattern if available, otherwise `Card` + muted content
- Rules:
  - row urgency should usually appear through deadline text color or left-edge cue, not full-row red fill

### 6.8 Dialog and sheet patterns

- Anatomy:
  - title
  - supporting copy if needed
  - content body
  - footer actions
- States:
  - standard modal
  - confirmation
  - mobile sheet
- Shadcn mapping:
  - `Dialog`
  - `Sheet`
  - `AlertDialog` for destructive confirmation
- Rules:
  - use elevated surfaces, gold-tinted edge only sparingly
  - titles are required

### 6.9 AI suggestion cards and review banners

- Anatomy:
  - AI label
  - suggestion summary
  - confidence or source metadata
  - review actions
- States:
  - suggestion ready
  - warning / low confidence
  - accepted
  - dismissed / expired
- Responsive:
  - cards stack vertically and keep action buttons visible
- Shadcn mapping:
  - `Card`
  - `Alert`
  - `Badge`
  - `Button`
- Rules:
  - every AI surface must visually imply "review before commit"
  - AI blue is secondary to the LegalOS palette; gold and muted blue should work together, never overpower the system

### 6.10 Calendar and scheduling views

- Anatomy:
  - hero stats
  - date range toolbar
  - view mode toggle
  - main schedule board or agenda list
  - right rail for deadlines and reminders
- States:
  - default
  - today marker
  - confirmed
  - tentative
  - AI review
  - critical urgency
- Responsive:
  - multi-column board on desktop
  - simplified columns or agenda bias on tablet
  - agenda-first on mobile
- Shadcn mapping:
  - `Tabs` for day/week/agenda
  - `Button`
  - `Badge`
  - `Card`
  - `Popover`
  - `Calendar` for date picking and mini-calendar interactions
- Bespoke allowance:
  - the full legal scheduler board remains a custom domain layout because shadcn does not ship a complete week scheduler
  - do not custom-build date-picker primitives when `Calendar` and `Popover` are available

### 6.11 Deferred messages workspace (V2 backlog)

This surface remains in the repo, but it is not part of the shipped practitioner experience.

- MVP rule:
  - do not treat messages workspace as part of the current handoff target
- Code truth:
  - the practitioner route currently returns `notFound()`
  - the primary sidebar and topbar no longer expose messages as an active shipped workspace
- V2 direction:
  - if revived later, redesign it separately from the v1 portal timeline
- Current guidance:
  - preserve tokens and shell consistency only
  - do not count this surface toward MVP completion

### 6.12 Settings navigation and governance panels

- Anatomy:
  - settings hero
  - sticky left navigation at desktop
  - governance panels
  - stats and footnotes
- States:
  - default
  - active nav
  - read-only informational
  - destructive or sensitive action
- Responsive:
  - sticky side nav only on desktop
  - single-column stack below `xl`
- Shadcn mapping:
  - `Card`
  - `Button`
  - `Badge`
  - `Input`
  - `Select`
  - `Textarea`
  - `Dialog`
  - `Table` for team members on desktop
- Rules:
  - settings should feel quieter and more governance-oriented than the operational dashboards

### 6.13 Current-to-target primitive map

| Current LegalOS pattern | Current implementation cue | Preferred shadcn target | Notes |
|---|---|---|---|
| custom sidebar shell | `.app-sidebar` | `Sidebar` | preserve branding block and firm card |
| custom button | `.btn` variants | `Button` | keep current variant language |
| custom badge | `.ui-badge` and status pills | `Badge` | centralize tone mapping |
| custom input/select | `.ui-input`, `.ui-select` | `Input`, `Select` | retain label/hint/error contract |
| custom modal | `.ui-modal` | `Dialog` or `Sheet` | use `AlertDialog` for destructive flows |
| custom table shell | `.data-table` | `Table` | preserve mobile card fallback |
| custom tabs/filter pills | case tabs and filter chips | `Tabs` plus `Badge` | pills may remain styled triggers |
| custom calendar chrome | calendar workspace | `Tabs`, `Popover`, `Calendar`, `Card`, `Badge` | full schedule grid remains bespoke |
| custom empty states | `.empty-state` | `Card` plus muted content, or `Empty` if added | no decorative illustration needed by default |
| custom avatars | `.avatar-circle` | `Avatar` | preserve initials fallback |

## 7. Global Interaction And State Rules

### 7.1 Status semantics

- `active` or completed-success states use green
- `pending`, caution, reminders, and partial payment states use gold/amber
- `urgent`, overdue, destructive, and critical deadline states use red
- `archived`, inactive, and low-priority support states use neutral gray
- AI metadata uses blue only as a support accent, never as a primary brand surface

### 7.2 Loading, empty, error, and success

Every screen and major card group should define four non-happy-path states:

- Loading:
  - use `Skeleton`
  - keep layout shape stable to avoid page jump
- Empty:
  - explain what is missing
  - give a next action when the user can fix it
- Error:
  - use concise issue copy and recovery action
  - destructive red should be reserved for real failure, not routine empty states
- Success:
  - usually transient feedback, not giant banners
  - use green sparingly

### 7.3 Urgency signals

Urgency should be readable at a glance but not flood the workspace.

Preferred escalation:

1. badge or pill tone
2. deadline text or label emphasis
3. subtle row edge or border cue
4. only then stronger warning surface

### 7.4 AI review signals

AI output must always communicate:

- source is AI-assisted
- human review is required
- confidence or uncertainty may case

Preferred treatment:

- eyebrow or badge that says AI draft/review
- gold plus blue-accented support styling
- action labels oriented around review and confirm, not auto-apply

### 7.5 Client-safe visibility signals

Any client-visible timeline milestone or document-sharing state should be marked with a clearly distinct but non-alarming gold-tinted cue. Internal-only work should remain visually separated.

### 7.6 Payment and billing signals

- paid: green
- partially paid: gold/amber
- overdue: red
- draft or unsent: neutral

Monetary summaries should prioritize legibility over decoration.

## 8. Screen Blueprints

These blueprints define composition and interaction expectations, not JSX structure.

### 8.1 Dashboard home

- Layout hierarchy:
  - KPI row
  - two-column content section with deadlines on the left and AI/payments on the right
  - active cases table
- Persistent vs contextual:
  - shell is persistent
  - dashboard content is overview-only and should link deeper
- Data density:
  - moderate density
  - enough to triage the day, not a full operations backlog
- Key signals:
  - urgent deadlines must surface early
  - AI suggestions remain review-oriented
  - unpaid amounts should read as actionable, not decorative
- Non-happy-path:
  - empty dashboard should prompt case creation, event entry, and invoice activity

### 8.2 Cases list workspace

- Layout hierarchy:
  - hero block
  - 4-up case KPIs
  - filter/search toolbar
  - data table
- Persistent vs contextual:
  - search and segmentation are contextual to the list
- Data density:
  - high density, because this is a tracking screen
- Key signals:
  - case status
  - next deadline
  - unpaid balance
  - owner / lead
- Responsive:
  - desktop table
  - mobile record cards with key facts stacked

### 8.3 Case detail shell

- Layout hierarchy:
  - breadcrumb
  - title and action row
  - case metadata grid
  - tabbed sub-navigation
  - active sub-workspace below
- Persistent vs contextual:
  - case identity block remains stable across sub-pages
  - tabs change content only
- Data density:
  - high information value, moderate visual noise
- Key signals:
  - status
  - case type
  - next deadline
  - court and suit number
  - contextual case actions

### 8.4 Tasks workspace

- Pattern role:
  - task workspace inherits case/workspace card patterns rather than inventing a new shell
- Composition:
  - task summary metrics
  - filter controls
  - task list grouped by urgency, ownership, or scope
- Key signals:
  - overdue
  - assigned to me
  - due soon
  - completed vs open

### 8.5 Shared calendar and case calendar

- Layout hierarchy:
  - hero with summary stats
  - toolbar with date range, filters, and view switcher
  - main schedule board or agenda
  - right rail for deadline watch and reminder coverage
- Persistent vs contextual:
  - filters and date range are contextual
  - scope label must always clarify firm vs case calendar
- Data density:
  - high on desktop, simplified on mobile
- Key signals:
  - today marker
  - urgency
  - confirmed vs tentative vs AI-review state
  - case linkage
- Responsive:
  - agenda view becomes the safest mobile default

### 8.6 Billing workspace

- Layout hierarchy:
  - summary hero
  - billing KPIs
  - invoice/time/expense management panels
  - payment and AR support panels
- Key signals:
  - totals
  - draft vs sent vs overdue vs paid states
  - payment channel expectations
  - revenue leakage points
- Data density:
  - moderate to high, but each monetary number must remain readable

### 8.7 Invoice detail

- Layout hierarchy:
  - invoice identity hero
  - summary and payment methods cards
  - line items and payment history once implemented
- Key signals:
  - invoice number
  - total
  - balance
  - payment readiness
  - client handoff state
- Tone:
  - more formal and document-like than dashboard cards

### 8.8 Notes workspace

- Layout hierarchy:
  - notes list panel
  - selected note editor/detail panel
  - metadata and tags
- Key signals:
  - pinned
  - AI-assisted
  - author and timestamp
- Tone:
  - quiet and text-centric

### 8.9 Audit workspace

- Layout hierarchy:
  - event feed
  - selected event detail
  - diff and metadata sections
- Key signals:
  - actor
  - entity
  - action type
  - before/after diff
  - client vs firm vs system origin
- Tone:
  - evidentiary, precise, and low-flourish

### 8.10 Deferred messages workspace (V2 backlog)

This workspace is deferred to V2.

- MVP expectation:
  - do not design new product work around the messages workspace
- Code truth:
  - existing implementation can remain in the repo as deferred backlog code
  - the practitioner route currently returns `notFound()` and is not exposed in the shipped nav
- Design implication:
  - active v1 communication guidance should focus on the derived client timeline, not conversation UI

### 8.11 Settings hub and child screens

- Layout hierarchy:
  - settings overview hero
  - left navigation
  - panelized content
- Tone:
  - calmer and more governance-focused than operational surfaces
- Key signals:
  - scope of control
  - role sensitivity
  - read-only boundaries
  - session and security posture

### 8.12 Documents and case documents

These surfaces are partial only.

What should already be considered canonical:

- document work belongs inside the practitioner shell
- document surfaces should use card plus table/list patterns
- versions, OCR state, and sharing controls should be explicit
- client-sharing status should be visually distinct from internal-only records

What is not yet canonical:

- final upload/dropzone behavior
- full version history interaction model
- final OCR processing states
- final search-result layout

## 9. Dark Mode Specification

Dark mode is a defined target even though it is not yet implemented.

### 9.1 Core rules

- Mirror the information hierarchy of light mode
- Preserve current density and operational clarity
- Keep forest as the anchoring dark surface family
- Use gold as accent and active emphasis only
- Avoid glowing neon styles, purple casts, or overly cold dashboards

### 9.2 Dark mode behavioral guidance

- Sidebar should deepen, not brighten
- Cards should step up with subtle tonal separation
- Borders should remain visible but quiet
- Text contrast should be high for numerics and titles, softer for metadata
- AI surfaces should use restrained blue-gold contrast rather than bright saturated blue
- Success, warning, and danger should remain legible without becoming fluorescent

### 9.3 Dark mode component notes

- Tables need stronger row dividers than light mode
- Pills and badges should rely on tinted fills, not just text color
- Hero gradients should simplify in dark mode
- Focus rings need slightly stronger alpha than light mode

## 10. JSONC Design-Brief Contract

Use the following JSONC shape when translating screenshots or reference boards into a LegalOS-aligned implementation brief.

```jsonc
{
  // Basic bookkeeping for the brief
  "meta": {
    "name": "LegalOS Practitioner Dashboard Brief",
    "product": "LegalOS",
    "surface": "practitioner",
    "mode_support": ["light", "dark"],
    "source_artifacts": [
      "legalos/docs/designs/LegalOS.png",
      "legalos/docs/designs/LegalOS-1.png",
      "legalos/docs/designs/LegalOS Design System.png",
      "legalos/docs/PRD.md"
    ]
  },

  // Product and workflow context that should guide layout decisions
  "product_context": {
    "market_positioning": "Ghana-first legal case management dashboard",
    "primary_jobs": ["organise work", "prove work", "get paid"],
    "ai_positioning": "reviewed assistance only",
    "primary_audience": [
      "managing partner",
      "lawyer",
      "legal secretary",
      "practice admin"
    ]
  },

  // Semantic tokens, not arbitrary one-off colors
  "theme_tokens": {
    "palettes": {
      "primary": {
        "50": "#eef5f1",
        "100": "#d8e9df",
        "200": "#b6d1c1",
        "300": "#8bb39b",
        "400": "#5f9376",
        "500": "#1e5038",
        "600": "#143d29",
        "700": "#103423",
        "800": "#0b2d1e",
        "900": "#071d14"
      },
      "secondary": {
        "50": "#fdf7eb",
        "100": "#f8ebc7",
        "200": "#efd793",
        "300": "#e4b96a",
        "400": "#d9a84c",
        "500": "#c9963a",
        "600": "#b58327",
        "700": "#966b1f",
        "800": "#765319",
        "900": "#5b4014"
      }
    },
    "neutrals": {
      "0": "#ffffff",
      "25": "#faf8f3",
      "50": "#f3f0e8",
      "100": "#e8e4da",
      "200": "#d6d1c5",
      "300": "#b7b0a2",
      "500": "#7a7a72",
      "700": "#3d3d39",
      "900": "#1a1a18"
    },
    "status": {
      "success": "#1d6e4a",
      "warning": "#b8860b",
      "danger": "#c0392b",
      "info": "#1a4a7a"
    },
    "roles": {
      "bg-canvas": "neutral-25",
      "bg-surface": "neutral-0",
      "bg-sidebar": "primary-800",
      "border-subtle": "neutral-100",
      "text-primary": "neutral-900",
      "text-secondary": "neutral-500",
      "focus-ring": "secondary-500 alpha treatment",
      "ai-highlight": "info plus restrained secondary support",
      "client-safe-highlight": "secondary-50",
      "danger-highlight": "danger tint"
    }
  },

  // Must match Tailwind defaults exactly
  "breakpoints": {
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "2xl": 1536
  },

  // Persistent shell definition
  "shell": {
    "sidebar": {
      "desktop_width": 216,
      "tone": "dark forest surface with gold active state",
      "regions": ["brand", "firm context", "primary nav", "settings", "user"]
    },
    "topbar": {
      "height": 60,
      "regions": ["title", "optional subtitle", "search", "alerts", "avatar"]
    }
  },

  // Reusable building blocks and preferred primitive mapping
  "components": {
    "hero_panel": {
      "preferred_primitive": "Card",
      "anatomy": ["eyebrow", "title", "supporting copy", "actions or metrics"]
    },
    "stat_card": {
      "preferred_primitive": "Card",
      "anatomy": ["label", "value", "subtext", "tone"]
    },
    "status_badge": {
      "preferred_primitive": "Badge",
      "states": ["active", "pending", "closed", "archived", "paid", "overdue"]
    },
    "forms": {
      "preferred_primitives": ["Input", "Select", "Textarea", "Label"],
      "states": ["default", "focus", "invalid", "disabled"]
    },
    "dialogs": {
      "preferred_primitives": ["Dialog", "Sheet", "AlertDialog"]
    },
    "calendar": {
      "preferred_primitives": ["Tabs", "Button", "Badge", "Popover", "Calendar"],
      "custom_wrapper_allowed": "week scheduler board only"
    }
  },

  // Screen-level composition, not code
  "screens": {
    "dashboard_home": {
      "hierarchy": ["kpis", "deadlines", "ai suggestions", "payments", "active cases table"],
      "density": "moderate",
      "signals": ["urgent deadlines", "ai review", "unpaid balances"]
    },
    "cases_list": {
      "hierarchy": ["hero", "case kpis", "filters", "table"],
      "density": "high"
    },
    "case_detail": {
      "hierarchy": ["identity header", "metadata grid", "tab nav", "sub-workspace"],
      "density": "high"
    },
    "tasks_workspace": {
      "hierarchy": ["summary metrics", "filters", "task list"],
      "density": "moderate to high"
    },
    "shared_calendar": {
      "hierarchy": ["hero", "toolbar", "schedule board", "right rail"],
      "density": "high desktop, simplified mobile"
    },
    "billing_workspace": {
      "hierarchy": ["hero", "money kpis", "invoice and payment panels"],
      "density": "moderate to high"
    },
    "invoice_detail": {
      "hierarchy": ["invoice hero", "summary", "payment methods", "line items"],
      "density": "moderate"
    },
    "notes_workspace": {
      "hierarchy": ["note list", "selected note", "meta"],
      "density": "moderate"
    },
    "audit_workspace": {
      "hierarchy": ["event feed", "detail panel", "diff"],
      "density": "high"
    },
    "settings": {
      "hierarchy": ["hero", "settings nav", "governance panels"],
      "density": "moderate"
    },
    "documents": {
      "status": "partial"
    }
  },

  // Shared state language across screens
  "interaction_states": {
    "global": ["loading", "empty", "error", "success"],
    "operational": ["urgent", "pending", "archived", "client-visible", "ai-review"]
  },

  // Dark mode should be a semantic mirror, not a redesign
  "dark_mode": {
    "status": "specified target",
    "rules": [
      "preserve hierarchy",
      "keep gold as accent only",
      "avoid neon or purple bias",
      "increase divider clarity for dense data views"
    ]
  },

  // Notes for implementers or downstream agents
  "implementation_notes": {
    "truthfulness": "mark document workflows as partial until fully implemented",
    "primitive_strategy": "prefer shadcn primitives for standard controls before custom markup",
    "ai_rules": "ai output must never appear autonomous"
  },

  // The actual human-facing prompt should be appended as a Markdown code block
  "implementation_prompt": "See Markdown prompt appendix below."
}
```

## 11. Markdown Prompt Appendix

Use this prompt when you want an agent or designer to generate a LegalOS-aligned implementation brief from screenshots or reference boards.

```md
You are describing the UI of LegalOS, a Ghana-first legal case management dashboard for practitioners. Analyze the provided LegalOS screenshots and produce a structured JSONC design brief that is grounded in the current LegalOS product tone, the implemented practitioner dashboard patterns, and the product priorities of organising work, proving work, and getting paid.

The output must cover both light mode and dark mode. Dark mode should be a semantic mirror of the same system, not a redesign.

Use Tailwind default breakpoints exactly:
- sm: 640
- md: 768
- lg: 1024
- xl: 1280
- 2xl: 1536

Color rules:
- Use only two hue palettes: primary and secondary.
- Primary should be derived from LegalOS forest green.
- Secondary should be derived from LegalOS gold.
- You may define as many neutrals and status accents as needed for surfaces, borders, text, warnings, AI review, and complex media.
- Gold is for emphasis and selected states, not for flooding large surfaces.

Product and tone rules:
- The system is practitioner-first.
- It should feel structured, calm, trustworthy, and operations-focused.
- AI must always read as reviewed assistance, never autonomous authority.
- Money, deadlines, audit, and client-visible communication must have especially clear visual states.
- Portal, auth, and marketing can inherit shared tokens, but the brief should focus on the practitioner dashboard.

Component rules:
- Prefer standard shadcn primitives for common interface needs instead of inventing bespoke widgets.
- Use shadcn-aligned composition for sidebar navigation, cards, buttons, badges, inputs, selects, textareas, tabs, tables, dialogs, sheets, alerts, avatars, popovers, separators, and date-picking calendar interactions.
- If a domain-specific layout still needs a custom wrapper, keep the wrapper thin and build it from approved primitives.
- Do not hardcode a new calendar/date-picker widget when a standard calendar primitive can be used.

The JSONC output should include:
- meta
- product_context
- theme_tokens
- breakpoints
- shell
- components
- screens
- interaction_states
- dark_mode
- implementation_notes
- implementation_prompt

Screen guidance:
- Fully describe the practitioner app shell, dashboard home, cases list, case detail shell, tasks, shared calendar, billing workspace, invoice detail, notes, audit, and settings.
- Mark documents and case-documents as partial if the screenshots or source material do not show a fully resolved workflow.

End the JSONC with an `implementation_prompt` field whose content is a short UI-only handoff for a developer. That prompt must describe what to build, how to use the token system, and how to use the approved component primitives. Do not mention broader stack details or non-UI implementation chatter.
```
