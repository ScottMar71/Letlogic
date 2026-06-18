#!/usr/bin/env bash
# Fix Supabase Auth Site URL + redirect allow list (remote project).
# Requires a personal access token: https://supabase.com/dashboard/account/tokens
#
# Usage:
#   export SUPABASE_ACCESS_TOKEN="sbp_..."
#   ./scripts/fix-supabase-auth-urls.sh

set -euo pipefail

PROJECT_REF="${PROJECT_REF:-uuoumjybomsatccydqii}"

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  echo "Error: set SUPABASE_ACCESS_TOKEN (https://supabase.com/dashboard/account/tokens)" >&2
  exit 1
fi

curl -sS -X PATCH "https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "site_url": "https://www.letlogic.app",
    "uri_allow_list": "https://www.letlogic.app/auth/callback,https://letlogic.app/auth/callback,http://localhost:3000/auth/callback,http://127.0.0.1:3000/auth/callback"
  }' | python3 -m json.tool

echo ""
echo "Done. Request a NEW magic link from https://www.letlogic.app/login (old emails still point at the previous Site URL)."
