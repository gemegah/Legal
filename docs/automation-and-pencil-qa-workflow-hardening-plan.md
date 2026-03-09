# Plan: Automation and Pencil QA Workflow Hardening

**Generated**: 2026-03-06
**Estimated Complexity**: High

## Overview
This plan reduces engineering and design errors by introducing a layered automation system across code quality, CI, test coverage, and design QA. It prioritizes fast feedback for local development, then adds CI enforcement, then builds a dedicated Pencil review/fix loop for spacing, hierarchy, component usage, and UX quality.

Project-specific analysis highlights:
- The monorepo has minimal top-level automation scripts (`test` currently prints a placeholder).
- Backend tests are mostly stubs except matter route checks.
- No repository CI workflow is present.
- Frontend has strict TypeScript, but no automated test suite and no visual regression automation.
- `legalwireframes.pen` currently has 0 reusable components and 0 variables, which makes consistency checks and auto-fixes harder.

## Prerequisites
- GitHub repository access (for CI workflows and branch protection)
- Local tooling: `pnpm`, Python 3.12+, Docker
- Baseline command contracts agreed by team (what must pass before merge)
- Pencil MCP server configured (already present in Codex config)

## Sprint 1: Establish Local Quality Gates
**Goal**: Standardize one-command local validation and remove manual/forgotten checks.
**Demo/Validation**:
- Run a single command and see lint/type/test status for frontend and backend.
- Confirm command fails on known bad input and passes on clean branch.

### Task 1.1: Add unified workspace quality scripts
- **Location**: `package.json`, `backend/pyproject.toml` (or add `backend/Makefile`)
- **Description**: Add scripts for `lint`, `typecheck`, `test`, and `quality` that cover frontend + backend.
- **Dependencies**: None
- **Acceptance Criteria**:
  - Root `quality` script executes all checks and exits non-zero on failures.
  - Backend checks include `ruff`, `black --check`, `mypy`, `pytest`.
  - Frontend checks include `next lint` and `tsc --noEmit`.
- **Validation**:
  - Run `pnpm quality` and capture pass/fail behavior.

### Task 1.2: Add pre-commit automation
- **Location**: `.pre-commit-config.yaml`, `docs/WORKFLOWS.md`
- **Description**: Add pre-commit hooks for formatting/linting to catch easy failures before commit.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - Commit is blocked on lint/type/style issues.
  - Hooks are documented with one-time setup command.
- **Validation**:
  - Create intentional lint failure and verify commit block.

### Task 1.3: Add script entrypoint docs
- **Location**: `README.md`, `CONTRIBUTING.md`
- **Description**: Document mandatory local commands and expected pass criteria.
- **Dependencies**: Task 1.1
- **Acceptance Criteria**:
  - New contributor can run quality checks from docs only.
- **Validation**:
  - Fresh shell walkthrough test.

## Sprint 2: Add CI Enforcement and Merge Safety
**Goal**: Ensure failing code/tests/design checks cannot be merged silently.
**Demo/Validation**:
- Open a PR with an intentional error and verify CI fails.
- Open a clean PR and verify required checks pass.

### Task 2.1: Create CI workflow for frontend/backend
- **Location**: `.github/workflows/ci.yml`
- **Description**: Add matrix-style jobs for frontend lint/type/build and backend lint/type/tests.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - CI runs on push + pull request.
  - Failing checks fail the workflow.
- **Validation**:
  - Trigger workflow with failing test and observe blocked status.

### Task 2.2: Add dependency and security scanning
- **Location**: `.github/workflows/security.yml`
- **Description**: Add dependency vulnerability checks and static safety checks for Python/Node lockfiles.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Vulnerability report generated on schedule + PR.
- **Validation**:
  - Confirm report artifact and status output.

### Task 2.3: Define branch protection policy
- **Location**: `docs/WORKFLOWS.md`
- **Description**: Document required checks and no-bypass merge rules.
- **Dependencies**: Task 2.1
- **Acceptance Criteria**:
  - Required checks list is explicit and actionable.
- **Validation**:
  - Policy walkthrough with at least one dry-run PR.

## Sprint 3: Strengthen Functional and Contract Tests
**Goal**: Catch behavioral regressions and mock-vs-api mismatches early.
**Demo/Validation**:
- Test suite catches breaking API and UI behavior changes.
- Mock and API data sources produce compatible UI contracts.

### Task 3.1: Replace backend test stubs with meaningful coverage
- **Location**: `backend/app/tests/test_auth.py`, `test_billing.py`, `test_documents.py`, `test_webhooks.py`
- **Description**: Implement route/service tests for auth, billing, documents, and webhook validation/idempotency.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - Stub files replaced with real assertions.
  - Critical architecture rules from `agents.md` are covered.
- **Validation**:
  - `pytest` with per-domain passing tests.

### Task 3.2: Add frontend unit/integration test harness
- **Location**: `frontend/package.json`, `frontend/src/**/__tests__/*`
- **Description**: Add a test runner (Vitest or Jest), test core state mapping and data-source switching logic.
- **Dependencies**: Sprint 1
- **Acceptance Criteria**:
  - `pnpm --filter frontend test` exists and runs in CI.
- **Validation**:
  - Introduce intentional regression in repository selector and verify failure.

### Task 3.3: Add API contract smoke tests for App Router pages
- **Location**: `frontend/src/features/*/server/*.ts`, `frontend/tests/contracts/*`
- **Description**: Validate that API payloads match expected UI types and fail fast on schema drift.
- **Dependencies**: Task 3.2
- **Acceptance Criteria**:
  - Contract tests run for at least matters, tasks, calendar.
- **Validation**:
  - Break payload shape in fixture and verify test failure.

## Sprint 4: Build Pencil Design QA Foundation
**Goal**: Convert the `.pen` file into a consistent system that can be audited automatically.
**Demo/Validation**:
- Reusable components and variables exist in `legalwireframes.pen`.
- Design checks report deterministic warnings.

### Task 4.1: Introduce global design variables in Pencil
- **Location**: `legalwireframes.pen` (via Pencil variables tooling), `docs/DESIGN_SYSTEM.md`
- **Description**: Create variable mappings for color, spacing, radius, and typography tokens aligned to frontend tokens.
- **Dependencies**: None
- **Acceptance Criteria**:
  - `pencil get_variables` no longer returns empty variable map.
  - Key tokens are shared and named consistently.
- **Validation**:
  - Run variable export check and compare against CSS token set.

### Task 4.2: Extract reusable components from repeated frame patterns
- **Location**: `legalwireframes.pen`
- **Description**: Convert repeated UI blocks (cards, buttons, headers, side panels) into reusable components.
- **Dependencies**: Task 4.1
- **Acceptance Criteria**:
  - Reusable component count > 0 and instances replace duplicates.
- **Validation**:
  - `batch_get` search with `reusable: true` returns expected component set.

### Task 4.3: Define frame naming and route-state conventions
- **Location**: `docs/WORKFLOWS.md`, `docs/FRONTEND_IMPLEMENTATION_CHECKLIST.md`
- **Description**: Standardize route/state naming patterns to allow deterministic audits.
- **Dependencies**: Task 4.2
- **Acceptance Criteria**:
  - Frame names include route + state + viewport metadata.
- **Validation**:
  - Naming linter script reports 0 violations on updated set.

## Sprint 5: Implement Automated Pencil Error Detection and Auto-Fix
**Goal**: Automatically detect and optionally correct spacing, hierarchy, component misuse, and layout inconsistencies.
**Demo/Validation**:
- One command produces a design QA report.
- Auto-fix mode resolves approved classes of issues safely.

### Task 5.1: Build `pencil-audit` script pipeline
- **Location**: `scripts/pencil/audit.ts` (or `.py`), `scripts/pencil/rules/*.json`
- **Description**: Query frame metadata/layout via Pencil MCP (`batch_get`, `snapshot_layout`, `search_all_unique_properties`) and evaluate rule violations.
- **Dependencies**: Sprint 4
- **Acceptance Criteria**:
  - Report includes: spacing outliers, clipped elements, missing token usage, inconsistent radii/font sizes, duplicate non-component blocks.
- **Validation**:
  - Run audit on current `.pen` and review deterministic findings.

### Task 5.2: Build `pencil-autofix` for safe deterministic changes
- **Location**: `scripts/pencil/autofix.ts`, `scripts/pencil/rules/autofix-map.json`
- **Description**: Apply safe corrections (tokenized spacing/radius/text-size normalization, color normalization) using `replace_all_matching_properties` and `batch_design`.
- **Dependencies**: Task 5.1
- **Acceptance Criteria**:
  - Auto-fix only touches allowed properties and creates before/after report.
- **Validation**:
  - Dry-run then apply mode with diff summary.

### Task 5.3: Add UX hierarchy and component-use checks
- **Location**: `scripts/pencil/rules/hierarchy.json`, `scripts/pencil/rules/component-use.json`
- **Description**: Detect anti-patterns such as title/body scale inversions, low-contrast copy areas, direct custom blocks where a reusable component exists.
- **Dependencies**: Task 5.1, Task 4.2
- **Acceptance Criteria**:
  - Hierarchy violations and component bypasses are flagged per frame.
- **Validation**:
  - Seed known violations and verify rule triggers.

### Task 5.4: Integrate design QA into CI as non-blocking then blocking gate
- **Location**: `.github/workflows/design-qa.yml`
- **Description**: Run audit in PR CI; start with warnings then move to required checks once false positive rate is acceptable.
- **Dependencies**: Tasks 5.1–5.3, Sprint 2
- **Acceptance Criteria**:
  - PR comment/report posted for changed `.pen` files.
- **Validation**:
  - PR with intentional design rule violation produces actionable output.

## Sprint 6: Add Visual and UX Regression Loop
**Goal**: Detect subtle visual drift between Pencil source and implemented frontend UI.
**Demo/Validation**:
- Nightly/PR visual diff reports for core routes.
- UX checklist score visible for each route.

### Task 6.1: Add Playwright route screenshot baselines
- **Location**: `frontend/tests/visual/*.spec.ts`, `frontend/tests/visual/baselines/*`
- **Description**: Capture canonical screenshots for key routes/states and compare in CI.
- **Dependencies**: Sprint 2
- **Acceptance Criteria**:
  - Visual diff threshold configured; regressions produce artifacts.
- **Validation**:
  - Introduce UI style drift and verify diff alert.

### Task 6.2: Add Pencil-vs-Frontend parity checks
- **Location**: `scripts/design/parity-check.ts`
- **Description**: Compare route/frame metadata and selected geometry heuristics between `.pen` and rendered pages.
- **Dependencies**: Sprint 5, Task 6.1
- **Acceptance Criteria**:
  - Mismatch report includes spacing, typography class, and component-presence deltas.
- **Validation**:
  - Deliberately change one route’s spacing and verify parity failure.

### Task 6.3: Publish route-level UX quality checklist automation
- **Location**: `docs/FRONTEND_IMPLEMENTATION_CHECKLIST.md`, `scripts/design/ux-score.ts`
- **Description**: Convert UX criteria (responsiveness, affordance clarity, state coverage, accessibility basics) into scored checks.
- **Dependencies**: Tasks 6.1–6.2
- **Acceptance Criteria**:
  - Each core route has a measurable UX score and action items.
- **Validation**:
  - Run score script and review generated summary.

## Suggested New Skills (Codex)

### Skill A: `pencil-design-auditor`
- **Purpose**: Run full frame/component/spacing/hierarchy audit and generate ranked findings.
- **Inputs**: `.pen` path, route frame IDs, rule profile (`strict`, `balanced`, `ship-fast`).
- **Outputs**: Markdown report + fix candidates + confidence rating.

### Skill B: `pencil-auto-fixer`
- **Purpose**: Apply safe property normalizations and convert repeat blocks to components when deterministic.
- **Inputs**: Audit report, allowed fix classes.
- **Outputs**: Patch summary with rollback instructions.

### Skill C: `pencil-ux-critic`
- **Purpose**: Evaluate each frame for hierarchy, readability, CTA prominence, error-state clarity, and mobile ergonomics.
- **Inputs**: Frame IDs + screenshots.
- **Outputs**: UX scorecard with severity labels and specific remediations.

### Skill D: `design-implementation-parity`
- **Purpose**: Compare Pencil frames with live frontend via Playwright captures and flag drift.
- **Inputs**: Route map, viewport matrix.
- **Outputs**: Visual diff artifacts + structured parity report.

## Testing Strategy
- Local first: `quality` command must pass before commit.
- CI second: required checks on PRs.
- Design QA third: audit report on `.pen` changes.
- Visual parity fourth: scheduled + PR diffs for critical routes.
- Roll out strictness in phases: advisory -> warning threshold -> blocking.

## Potential Risks & Gotchas
- False positives in design rules can create alert fatigue.
  - Mitigation: Begin with non-blocking mode and maintain suppression list with expiry.
- Current `.pen` lacks reusable components/variables, so component-use checks may initially be noisy.
  - Mitigation: Complete Sprint 4 before enforcing Sprint 5 rules.
- Snapshot clipping warnings can include benign nodes (e.g., announcer artifacts).
  - Mitigation: Maintain allowlist patterns in audit rules.
- Mock/API dual data source can hide integration bugs.
  - Mitigation: Add contract tests and run API-backed smoke suite in CI nightly.

## Rollback Plan
- Keep all new automation behind explicit scripts/CI jobs so they can be disabled per workflow file.
- Add `design-qa` and `visual-regression` as separate checks to allow temporary rollback without disabling core CI.
- For auto-fix pipelines, always support `--dry-run` and commit before apply.
- Revert by removing or disabling workflows and scripts introduced in each sprint; no schema/data migration dependency is required for rollback.
