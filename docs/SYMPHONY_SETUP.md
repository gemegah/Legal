# Symphony Setup

This runbook is the LegalOS-specific setup for the Symphony workflow described in the `WORKFLOW.md` repo contract.

## What is already in place

- Repo-local worker skills in `.agents/skills/`:
  - `commit`
  - `debug`
  - `land`
  - `linear`
  - `pull`
  - `push`
  - `launch-app`
- LegalOS Symphony workflow contract at `WORKFLOW.md`
- New Linear delivery project:
  - `LegalOS Delivery`
  - URL: `https://linear.app/spearbytes/project/legalos-delivery-b3af8edc96cd`

`LegalOS Frontend MVP` remains the frontend checklist and status mirror. It is not the Symphony dispatch board.

## Runtime target

Run Symphony from `WSL2 Ubuntu`, not native Windows PowerShell.

Expected workspace root:

```text
~/code/legalos-symphony-workspaces
```

## Preflight

From WSL inside the repo:

```bash
bash ./scripts/symphony-preflight.sh
```

Minimum runtime requirements before launch:

- `git`
- `mise`
- `node`
- `pnpm`
- `python3`
- `gh`
- `docker`
- `LINEAR_API_KEY`
- `codex mcp list` includes `linear`

Notes:

- `scripts/symphony-codex.sh` will use a native WSL `codex` first.
- If WSL does not have `codex`, it falls back to the Windows `codex.exe` when available.
- The bootstrap still expects native WSL `node`, `pnpm`, and `python3`.
- `mise` is installed at `~/.local/bin/mise` on this machine. If a new shell does not find it, add its activation line to your WSL shell profile.

## Linear workflow states

The `Spearbytes` team still needs these custom states added in Linear team settings before Symphony can run cleanly:

- `Rework` with color `#db6e1f`
- `Human Review` with color `#da8b0d`
- `Merging` with color `#0f783c`

Reason:

- the current MCP tooling can create projects and issues, but not team workflow statuses
- the current browser session is not authenticated to Linear, so this step could not be automated safely

Linear path:

```text
Team Settings -> Issue statuses & automations
```

## Bootstrap behavior

Symphony clones LegalOS into each worker workspace and runs:

```bash
bash ./scripts/symphony-bootstrap.sh
```

That script:

- runs `pnpm install`
- creates a repo-local `.venv`
- installs backend, backend-dev, and AI service Python dependencies

## Launching Symphony

Clone and build the Symphony fork inside WSL, then launch it against this repo's `WORKFLOW.md`.

Example shape:

```bash
cd ~/code
git clone https://github.com/odysseus0/symphony.git
cd symphony/elixir

# install Elixir/Erlang with your preferred method or mise
# build Symphony

./bin/symphony /mnt/c/Users/LENOVO\ THINKPAD\ X1/Desktop/legal/legalos/WORKFLOW.md \
  --i-understand-that-this-will-be-running-without-the-usual-guardrails
```

If you want the dashboard:

```bash
./bin/symphony /mnt/c/Users/LENOVO\ THINKPAD\ X1/Desktop/legal/legalos/WORKFLOW.md \
  --port 4050 \
  --i-understand-that-this-will-be-running-without-the-usual-guardrails
```

## Mock mode vs API mode

Symphony workers should choose runtime validation mode based on ticket scope.

Use mock mode when:

- the change is frontend-only
- no live backend contract or workflow behavior is involved

Use API mode when:

- the change touches backend endpoints or schemas
- the frontend switches from mock data to live API behavior
- the change affects portal access, billing flows, reminders, or AI-assisted workflow sequencing

The exact commands are documented in `.agents/skills/launch-app/SKILL.md`.

## Operating model

Use `LegalOS Delivery` as the only Symphony-controlled project.

Recommended first rollout:

1. Symphony bootstrap in repo
2. launch-app runtime harness
3. one low-risk docs or frontend polish ticket
4. one additional independent low-risk ticket for the third agent

Start with `3` concurrent agents. Do not increase concurrency until at least two clean `Human Review` cycles complete without setup-related failures.
