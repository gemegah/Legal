#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd -- "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "symphony-bootstrap: pnpm is required in WSL before workers can bootstrap LegalOS." >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "symphony-bootstrap: python3 is required in WSL before workers can bootstrap LegalOS." >&2
  exit 1
fi

pnpm install

python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install \
  -r backend/requirements.txt \
  -r backend/requirements-dev.txt \
  -r ai_service/requirements.txt
