#!/bin/bash

# Verify current API key restrictions for a given key ID.

set -euo pipefail

PROJECT=${GCLOUD_PROJECT:-kbe-website}
KEY_ID=${1:-}

if [[ -z "$KEY_ID" ]]; then
  echo "Usage: GCLOUD_PROJECT=<project> $0 <KEY_ID>"
  echo "Hint: gcloud services api-keys list --project=$PROJECT"
  exit 1
fi

echo "Project: $PROJECT"
echo "Key ID:  $KEY_ID"
echo ""

set -x
gcloud services api-keys describe "$KEY_ID" --project="$PROJECT" --format=json \
  | jq '{displayName, restrictions}'
set +x

