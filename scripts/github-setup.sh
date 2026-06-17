#!/usr/bin/env bash
set -euo pipefail

GH="${GH_BIN:-$HOME/.local/bin/gh-official}"
REPO_NAME="${1:-letlogic}"

if ! command -v "$GH" >/dev/null 2>&1; then
  echo "GitHub CLI not found at $GH"
  echo "Install: https://cli.github.com/"
  exit 1
fi

cd "$(dirname "$0")/.."

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "Log in to GitHub first:"
  "$GH" auth login --hostname github.com --git-protocol https --web
fi

if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote origin already set."
else
  "$GH" repo create "$REPO_NAME" \
    --private \
    --source=. \
    --remote=origin \
    --description "AI compliance assistant for UK landlords"
fi

git push -u origin main
echo "Done: $($GH repo view --json url -q .url)"
