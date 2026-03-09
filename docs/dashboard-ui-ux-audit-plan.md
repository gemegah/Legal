# Plan: Dashboard UI UX Audit

**Generated**: 2026-03-09
**Estimated Complexity**: Medium

## Overview
Audit the implemented LegalOS dashboard experience in `legalos/frontend` as a product-facing UI, not just a codebase. The review will cover the shared shell, the home dashboard, and each shipped workspace reachable from the primary app navigation. Findings will be prioritized by severity and tied to concrete fixes, with special attention to trust-breaking issues, design-system drift, accessibility, responsiveness, and missing interaction states.

## Scope
- Shared shell: sidebar, topbar, layout, tokens, global styles
- Home dashboard: KPI cards, deadlines, AI widget, payments, active matters table
- Primary app workspaces implemented so far:
  - Matters
  - Matter detail and sub-tabs
  - Tasks
  - Calendar
  - Documents
  - Billing and invoice detail
  - Messages
  - Settings
- Cross-cutting concerns:
  - Information hierarchy
  - Navigation and wayfinding
  - Visual consistency
  - State design
  - Accessibility basics
  - Responsive behavior
  - Content realism and trust

## Audit Criteria
- Brand and design-system alignment with `legalos/docs/DESIGN_SYSTEM.md`
- Clarity of primary actions and page intent
- Density, spacing, readability, and scanability
- Component consistency across pages
- Accuracy and credibility of labels, dates, statuses, and sample data
- Empty, loading, selected, hover, focus, disabled, and error states
- Keyboard and screen-reader affordances where visible in code
- Mobile and tablet degradation

## Review Sequence
1. Inspect design tokens, shell, and shared primitives.
2. Inspect each route and its primary workspace component.
3. Run the frontend and visually validate the key screens.
4. Cross-check findings against the design-system contract.
5. Deliver prioritized findings with recommended fixes and missing-system proposals.

## Deliverable
- A findings-first audit covering:
  - Critical issues
  - High-priority gaps
  - Medium polish issues
  - Missing design-system foundations
  - Recommended remediation order

## Risks And Gotchas
- The frontend currently appears to rely on mock data, so some trust or content issues may be placeholders rather than integration bugs. They still matter because placeholders shape the product impression and interaction model.
- Large global CSS files may hide inconsistent component behavior across pages, so the audit must check both code patterns and rendered output.
