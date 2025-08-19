#!/bin/bash

# Enforce API key restrictions for the Firebase Web API key.
# Requires: gcloud (with Application Default Credentials), project set or provided via --project.

set -euo pipefail

PROJECT=${GCLOUD_PROJECT:-kbe-website}
KEY_ID=""
ENVIRONMENT=""
DRY_RUN=false

usage() {
  cat << EOF
Usage: GCLOUD_PROJECT=<project> $0 --key-id <KEY_ID> --env <dev|preview|prod> [--dry-run]

Examples:
  GCLOUD_PROJECT=kbe-website $0 --key-id abcd1234-... --env prod

Notes:
  - KEY_ID is the API key ID (not the key value). Find via:
      gcloud services api-keys list --project=
  - This script uses 'gcloud services api-keys update' (GA). If your gcloud is older,
    install latest SDK or switch to 'gcloud alpha services api-keys'.
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --key-id)
      KEY_ID="$2"; shift 2;;
    --env)
      ENVIRONMENT="$2"; shift 2;;
    --dry-run)
      DRY_RUN=true; shift;;
    -h|--help)
      usage; exit 0;;
    *)
      echo "Unknown arg: $1"; usage; exit 1;;
  esac
done

if [[ -z "$KEY_ID" || -z "$ENVIRONMENT" ]]; then
  usage; exit 1
fi

allowed_referrers_dev=(
  "http://localhost:9002/*"
  "https://localhost:9002/*"
)

allowed_referrers_preview=(
  "https://kbe-website.firebaseapp.com/*"
  "https://kbe-website.web.app/*"
  "https://kbe-website--kbe-website.us-central1.hosted.app/*"
)

allowed_referrers_prod=(
  "https://homerenrichment.com/*"
  "https://www.homerenrichment.com/*"
  "https://kbe-website--kbe-website.us-central1.hosted.app/*"
)

case "$ENVIRONMENT" in
  dev)
    ALLOWED=("${allowed_referrers_dev[@]}") ;;
  preview)
    ALLOWED=("${allowed_referrers_dev[@]}" "${allowed_referrers_preview[@]}") ;;
  prod)
    ALLOWED=("${allowed_referrers_dev[@]}" "${allowed_referrers_prod[@]}") ;;
  *)
    echo "Invalid --env. Use dev|preview|prod"; exit 1 ;;
esac

# APIs to allow
APIS=(
  identitytoolkit.googleapis.com
  firestore.googleapis.com
  firebaseinstallations.googleapis.com
  firebaseappcheck.googleapis.com
)

echo "Project:        $PROJECT"
echo "Key ID:         $KEY_ID"
echo "Environment:    $ENVIRONMENT"
echo "Referrers (n=${#ALLOWED[@]}):"
printf '  - %s\n' "${ALLOWED[@]}"
echo "APIs (n=${#APIS[@]}):"
printf '  - %s\n' "${APIS[@]}"

if $DRY_RUN; then
  echo "\nDry run enabled. No changes applied."
  exit 0
fi

# Build --allowed-referrers flag (comma-separated)
REF_LIST=$(IFS=, ; echo "${ALLOWED[*]}")

# Build repeated --api-target flags
API_TARGET_FLAGS=()
for svc in "${APIS[@]}"; do
  API_TARGET_FLAGS+=("--api-target=service=${svc},methods=*")
done

set -x
gcloud services api-keys update "$KEY_ID" \
  --project="$PROJECT" \
  --allowed-referrers="$REF_LIST" \
  "${API_TARGET_FLAGS[@]}"
set +x

echo "\n✅ Applied restrictions to key $KEY_ID"

