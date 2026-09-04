#!/usr/bin/env bash
# Demo host only (tbott.by1002.com). Do not use this path for tbottinc.com.
set -euo pipefail

cd /srv/apps/tbott
git fetch --all
git reset --hard origin/main
docker compose up -d --build
docker image prune -f
