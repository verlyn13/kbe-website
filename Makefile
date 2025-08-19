.PHONY: help preflight doctor agent-preflight zone ns dns

ZONE := $(shell awk -F= '/^ZONE=/{print $$2}' .cloudflare 2>/dev/null | tr -d '"' | tr -d "'" )

help:
	@echo "Cloudflare Helpers"
	@echo "  preflight - Verify account/token and (if ZONE set) sync zone IDs via cf-go"
	@echo "  doctor   - Full diagnostics and zone sync"
	@echo "  agent-preflight - Non-interactive preflight for CI"
	@echo "  zone      - Show zone info"
	@echo "  ns        - Show nameservers"
	@echo "  dns       - List DNS records"

preflight:
	@which cf-go >/dev/null 2>&1 || (echo "cf-go not found; run 'make install' in cf-go repo" && exit 1)
	@cf-go diag account -v
	@if [ -n "$(ZONE)" ]; then \
		echo "Syncing gopass for zone $(ZONE)..."; \
		cf-go sync gopass --zone $(ZONE) --verify; \
	else \
		echo "No ZONE found in .cloudflare; skipping zone sync."; \
	fi

zone:
	@which cf-go >/dev/null 2>&1 || (echo "cf-go not found; run 'make install' in cf-go repo" && exit 1)
	cf-go zone

ns:
	@which cf-go >/dev/null 2>&1 || (echo "cf-go not found; run 'make install' in cf-go repo" && exit 1)
	cf-go ns

dns:
	@which cf-go >/dev/null 2>&1 || (echo "cf-go not found; run 'make install' in cf-go repo" && exit 1)
	cf-go dns list

doctor:
	@set -euo pipefail; \
	if ! command -v cf-go >/dev/null; then \
	  echo "❌ cf-go not installed. Run 'make install' in cf-go repo."; exit 1; \
	fi; \
	if [ ! -f .cloudflare ]; then \
	  echo "❌ Missing .cloudflare at repo root (needs PROJECT_NAME, ZONE)."; exit 1; \
	fi; \
	echo "🔎 cf-go version:"; cf-go --version || true; \
	echo "🔎 Account diagnostics:"; cf-go diag account -v; \
	ZONE="$$(awk -F= '/^ZONE=/{print $$2}' .cloudflare | tr -d '"\'')"; \
	if [ -n "$$ZONE" ]; then \
	  echo "🔎 Zone sync verify ($$ZONE):"; cf-go sync gopass --zone "$$ZONE" --verify; \
	else \
	  echo "⚠️  ZONE not set in .cloudflare; skipping zone checks."; \
	fi; \
	echo "✅ doctor complete"

agent-preflight:
	@CF_GO_NONINTERACTIVE=1 CF_GO_OUTPUT=json cf-go diag account -o json >/dev/null
	@CF_GO_NONINTERACTIVE=1 CF_GO_OUTPUT=json cf-go zone -o json >/dev/null || true
