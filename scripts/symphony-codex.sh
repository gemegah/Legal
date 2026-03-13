#!/usr/bin/env bash
set -euo pipefail

if command -v codex >/dev/null 2>&1; then
  exec codex "$@"
fi

if command -v powershell.exe >/dev/null 2>&1 && command -v wslpath >/dev/null 2>&1; then
  win_codex="$(
    powershell.exe -NoProfile -Command "(Get-Command codex.exe -ErrorAction SilentlyContinue).Source" \
      | tr -d '\r'
  )"

  if [ -n "$win_codex" ]; then
    linux_codex="$(wslpath -u "$win_codex")"
    if [ -x "$linux_codex" ]; then
      exec "$linux_codex" "$@"
    fi
  fi
fi

echo "symphony-codex: codex was not found in WSL or via the Windows fallback." >&2
echo "Install Codex in WSL or make codex.exe discoverable from Windows before launching Symphony." >&2
exit 1
