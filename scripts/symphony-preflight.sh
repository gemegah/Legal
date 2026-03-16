#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd -- "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

check_cmd() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    printf '[ok] %s: %s\n' "$name" "$(command -v "$name")"
  else
    printf '[missing] %s\n' "$name"
  fi
}

echo "LegalOS Symphony preflight"
echo "repo: $root_dir"
echo

check_cmd git

if command -v mise >/dev/null 2>&1; then
  printf '[ok] mise: %s\n' "$(command -v mise)"
elif [ -x "$HOME/.local/bin/mise" ]; then
  printf '[ok] mise: %s (not on PATH)\n' "$HOME/.local/bin/mise"
else
  echo "[missing] mise"
fi

check_cmd node
check_cmd pnpm
check_cmd python3
check_cmd gh
check_cmd docker

if command -v docker >/dev/null 2>&1 && docker compose version >/tmp/legalos-symphony-docker-compose.txt 2>/tmp/legalos-symphony-docker-compose-error.txt; then
  printf '[ok] docker compose: %s\n' "$(head -n 1 /tmp/legalos-symphony-docker-compose.txt)"
else
  echo "[missing] docker compose"
  if [ -s /tmp/legalos-symphony-docker-compose-error.txt ]; then
    cat /tmp/legalos-symphony-docker-compose-error.txt
  fi
fi

if bash ./scripts/symphony-codex.sh --version >/tmp/legalos-symphony-codex-version.txt 2>/tmp/legalos-symphony-codex-error.txt; then
  printf '[ok] codex: %s\n' "$(tr -d '\r' </tmp/legalos-symphony-codex-version.txt)"
else
  printf '[missing] codex\n'
  cat /tmp/legalos-symphony-codex-error.txt
fi

if [ -n "${LINEAR_API_KEY:-}" ]; then
  echo "[ok] LINEAR_API_KEY"
else
  echo "[missing] LINEAR_API_KEY"
fi

if bash ./scripts/symphony-codex.sh mcp list 2>/tmp/legalos-symphony-mcp-error.txt | grep -q '^linear'; then
  echo "[ok] codex mcp linear"
else
  echo "[missing] codex mcp linear"
  cat /tmp/legalos-symphony-mcp-error.txt
fi
