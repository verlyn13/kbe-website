#!/usr/bin/env bash
# Complete Sentry release workflow for kbe-website (Homer Enrichment Hub)
# This script creates a Sentry release, uploads source maps, and tracks deployment
#
# Usage:
#   ./scripts/sentry-release.sh [environment]
#
# Examples:
#   ./scripts/sentry-release.sh production
#   ./scripts/sentry-release.sh staging
#   SENTRY_RELEASE="v1.0.0" ./scripts/sentry-release.sh production

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[info]${NC} $*"; }
log_success() { echo -e "${GREEN}[success]${NC} $*"; }
log_warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
log_error() { echo -e "${RED}[error]${NC} $*"; }

# Configuration
RELEASE_VERSION="${SENTRY_RELEASE:-$(git rev-parse --short HEAD 2>/dev/null || echo "dev-$(date +%s)")}"
ENVIRONMENT="${1:-${DEPLOY_ENV:-production}}"
SENTRY_ORG="${SENTRY_ORG:-}"
SENTRY_PROJECT="${SENTRY_PROJECT:-kbe-website}"
SENTRY_AUTH_TOKEN="${SENTRY_AUTH_TOKEN:-}"

# Validate requirements
log_info "Validating Sentry configuration..."

if ! command -v sentry-cli &> /dev/null; then
  log_error "sentry-cli not found. Install with: npm install -g @sentry/cli"
  exit 1
fi

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  log_error "SENTRY_AUTH_TOKEN not set"
  log_info "Store your token in gopass: gopass insert sentry/auth-token"
  log_info "Then add to .envrc: export SENTRY_AUTH_TOKEN=\"\$(gopass show sentry/auth-token)\""
  exit 1
fi

if [ -z "$SENTRY_ORG" ]; then
  log_error "SENTRY_ORG not set"
  log_info "Add to .envrc: export SENTRY_ORG=\"your-org-slug\""
  exit 1
fi

# Check if .next directory exists (build output)
if [ ! -d ".next" ]; then
  log_error ".next directory not found. Run 'bun run build' first."
  exit 1
fi

log_success "Configuration valid"
log_info "Organization: $SENTRY_ORG"
log_info "Project: $SENTRY_PROJECT"
log_info "Release: $RELEASE_VERSION"
log_info "Environment: $ENVIRONMENT"
echo ""

# Step 1: Create release
log_info "📦 Creating Sentry release..."
if sentry-cli releases new "$RELEASE_VERSION" 2>/dev/null; then
  log_success "Release created: $RELEASE_VERSION"
else
  log_warn "Release already exists, continuing..."
fi

# Step 2: Associate commits
log_info "🔗 Associating commits with release..."
if sentry-cli releases set-commits "$RELEASE_VERSION" --auto 2>/dev/null; then
  log_success "Commits associated with release"
else
  log_warn "Could not associate commits (not a git repository or no remote)"
fi

# Step 3: Upload source maps
log_info "📤 Uploading source maps..."

# Next.js generates source maps in multiple locations
SOURCE_MAP_DIRS=(
  ".next/static/chunks"
  ".next/server/app"
  ".next/server/chunks"
)

UPLOAD_COUNT=0
for dir in "${SOURCE_MAP_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    log_info "Uploading from: $dir"
    if sentry-cli sourcemaps upload \
      --release "$RELEASE_VERSION" \
      --org "$SENTRY_ORG" \
      --project "$SENTRY_PROJECT" \
      --url-prefix "~/_next" \
      "$dir" 2>/dev/null; then
      log_success "Uploaded source maps from $dir"
      UPLOAD_COUNT=$((UPLOAD_COUNT + 1))
    else
      log_warn "Failed to upload from $dir (may not contain source maps)"
    fi
  else
    log_warn "Directory not found: $dir"
  fi
done

if [ $UPLOAD_COUNT -eq 0 ]; then
  log_error "No source maps uploaded. Check your build configuration."
  log_info "Ensure productionBrowserSourceMaps: true in next.config.js"
  exit 1
fi

log_success "Source maps uploaded successfully"

# Step 4: Finalize release
log_info "🏁 Finalizing release..."
if sentry-cli releases finalize "$RELEASE_VERSION" 2>/dev/null; then
  log_success "Release finalized"
else
  log_warn "Could not finalize release"
fi

# Step 5: Create deploy
log_info "🚀 Creating deploy for environment: $ENVIRONMENT"
if sentry-cli releases deploys "$RELEASE_VERSION" new -e "$ENVIRONMENT" 2>/dev/null; then
  log_success "Deploy created for $ENVIRONMENT"
else
  log_warn "Could not create deploy"
fi

# Summary
echo ""
log_success "✅ Sentry release complete!"
echo ""
log_info "View release at:"
echo "https://sentry.io/organizations/$SENTRY_ORG/releases/$RELEASE_VERSION/"
echo ""
log_info "View project issues at:"
echo "https://sentry.io/organizations/$SENTRY_ORG/issues/?project=$SENTRY_PROJECT&query=release:$RELEASE_VERSION"
echo ""

# Optional: Verify source maps
log_info "To verify source maps were uploaded correctly, run:"
echo "sentry-cli sourcemaps explain --release \"$RELEASE_VERSION\" \"/_next/static/chunks/app/page-[hash].js\""
