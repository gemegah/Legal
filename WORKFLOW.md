---
tracker:
  kind: linear
  project_slug: "legalos-delivery-b3af8edc96cd"
  active_states:
    - Todo
    - In Progress
    - Merging
    - Rework
  terminal_states:
    - Closed
    - Cancelled
    - Canceled
    - Duplicate
    - Done
polling:
  interval_ms: 5000
workspace:
  root: ~/code/legalos-symphony-workspaces
hooks:
  after_create: |
    git clone --depth 1 https://github.com/gemegah/Legal.git .
    bash ./scripts/symphony-bootstrap.sh
  before_remove: |
    branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$branch" ] && command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
      gh pr list --head "$branch" --state open --json number --jq '.[].number' | while read -r pr; do
        [ -n "$pr" ] && gh pr close "$pr" --comment "Closing because the Linear issue for branch $branch entered a terminal state without merge."
      done
    fi
agent:
  max_concurrent_agents: 3
  max_turns: 20
codex:
  command: bash ./scripts/symphony-codex.sh --config shell_environment_policy.inherit=all --config model_reasoning_effort=xhigh --model gpt-5.3-codex app-server
  approval_policy: never
  thread_sandbox: danger-full-access
  turn_sandbox_policy:
    type: dangerFullAccess
---

You are working on a Linear ticket `{{ issue.identifier }}` for LegalOS.

{% if attempt %}
Continuation context:

- This is retry attempt #{{ attempt }} because the ticket is still in an active state.
- Resume from the current workspace state unless the branch PR is already closed or merged.
- Do not repeat completed investigation or validation unless new code changes require it.
{% endif %}

Issue context:
Identifier: {{ issue.identifier }}
Title: {{ issue.title }}
Current status: {{ issue.state }}
Labels: {{ issue.labels }}
URL: {{ issue.url }}

Description:
{% if issue.description %}
{{ issue.description }}
{% else %}
No description provided.
{% endif %}

## Non-negotiable rules

1. This is an unattended orchestration session. Never ask a human to perform follow-up actions unless the issue is blocked by missing required auth, permissions, or secrets.
2. Final message must report completed actions and blockers only. Do not include user next steps.
3. Work only inside the provided repository clone.
4. Use the `linear_graphql` tool exposed by Symphony's app server for Linear interactions. Do not use a Linear MCP server from inside the worker session.

## LegalOS truth sources

Before changing behavior, resolve implementation truth in this order:

1. Shipped code in `frontend`, `backend`, and `ai_service`
2. `agents.md`
3. `docs/DESIGN_SYSTEM.md`
4. `docs/WORKFLOWS.md`, `docs/PRD.md`, and `system.md`
5. Supporting notes only if the earlier sources do not settle the question

If code and docs disagree, follow code for shipped behavior and update docs deliberately.

## LegalOS guardrails

- Tenancy is sacred. Never infer or persist `firm_id`; use the authenticated tenant context only.
- AI suggestions must remain explicit reviewed assistance. Never auto-accept or auto-save AI output.
- Client role behavior is isolated to `/portal/v1/*`.
- Audit log remains append-only.
- Payments and webhooks must stay idempotent and signature-verified.
- Respect `docs/DESIGN_SYSTEM.md` surface truthfulness rules. Placeholder and partial flows must stay visibly partial.

## Related skills

- `linear`: Linear GraphQL patterns for workpad, comments, attachments, and state changes
- `pull`: sync the branch with `origin/main` before handoff
- `push`: publish the branch after validation passes
- `commit`: create clean commits
- `land`: complete the merge loop when the ticket reaches `Merging`
- `launch-app`: runtime validation for LegalOS mock-mode and API-mode flows

## Status map

- `Backlog`: do not modify; wait for a human to move it to `Todo`
- `Todo`: immediately move to `In Progress`, create or refresh the workpad, then execute
- `In Progress`: continue execution
- `Human Review`: wait and poll; do not code
- `Merging`: use the `land` skill
- `Rework`: reset planning, address feedback, and re-run the full validation loop
- `Done`: no action required

## Workpad contract

Maintain one persistent Linear comment titled `## Codex Workpad`.

Use this exact structure:

````md
## Codex Workpad

```text
<hostname>:<abs-path>@<short-sha>
```

### Plan

- [ ] 1. Parent task
  - [ ] 1.1 Child task
- [ ] 2. Parent task

### Acceptance Criteria

- [ ] Criterion 1

### Validation

- [ ] command or runtime proof

### Notes

- timestamped note

### Confusions

- only include when something was genuinely unclear
````

Update the workpad in place at milestones: plan finalized, implementation complete, validation complete, and after review feedback is addressed.

## Execution flow

1. Fetch the issue state and route according to the status map.
2. If the state is `Todo`, move it to `In Progress` before doing any work.
3. Find or create the single `## Codex Workpad` comment.
4. Build a hierarchical plan, explicit acceptance criteria, and a validation checklist in that comment.
5. Capture a reproduction signal before code changes and record it in `Notes`.
6. Run the `pull` skill before editing code and record the sync result in `Notes`.
7. Implement the smallest coherent change that satisfies the ticket.
8. Reconcile the workpad after every meaningful milestone.
9. Only move to `Human Review` after the completion bar below is satisfied.

## Validation policy

Choose the smallest relevant validation set for the touched surface and record every command and result in the workpad.

- Frontend-only changes:
  - `pnpm --dir frontend lint`
  - `pnpm --dir frontend build`
  - run `launch-app` for runtime validation when the change affects behavior or UI
- Backend changes:
  - `cd backend && pytest`
- AI service changes:
  - run `cd ai_service && pytest` when tests exist
  - if tests do not exist yet, run the smallest useful smoke proof and record the gap explicitly
- Cross-stack changes:
  - run the relevant subset from all touched services
- If the ticket description contains `Validation`, `Test Plan`, or `Testing`, those items are mandatory and must be copied into the workpad checklist

For LegalOS runtime validation:

- Prefer mock-mode validation for frontend-only tickets
- Use API-mode when the change touches backend contracts, live data integration, portal behavior, or workflow sequencing
- Use `launch-app` to choose the correct mode

## PR and review loop

Before moving a ticket to `Human Review`:

1. Ensure all acceptance criteria and validation items are checked off in the workpad.
2. Attach or link the PR to the Linear issue.
3. Ensure the PR has the `symphony` label.
4. Sweep all PR feedback channels:
   - top-level PR comments
   - inline review comments
   - review summaries and states
5. Treat every actionable comment as blocking until code is updated or a justified pushback reply is posted.
6. Re-run validation after feedback-driven changes.
7. Confirm PR checks are green.

## Rework handling

When the issue is in `Rework`:

1. Re-read the issue and all review feedback.
2. Update the workpad plan to reflect what changes this attempt.
3. If the prior PR is closed or merged, create a fresh branch from `origin/main`.
4. Re-run the full implementation and validation loop.

## Completion bar before `Human Review`

- The workpad is current and accurate.
- Acceptance criteria are complete.
- Required validation is green for the latest commit.
- Runtime validation is complete for app-touching work.
- PR feedback sweep is complete with no unresolved actionable comments.
- The branch is pushed and the PR is linked on the issue.

## Blocked-access escape hatch

Use this only for true blockers such as missing required auth, permissions, or secrets.

- Document the blocker in the workpad.
- State exactly what is missing and why it blocks completion.
- Move the issue to `Human Review` only when the work is otherwise complete and the blocker is external.
