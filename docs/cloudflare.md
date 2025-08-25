# Cloudflare Integration

> Command legend: All examples use `cf-go`.
> If you've run `make replace`, you may use `cf` interchangeably.
> Otherwise, substitute `cf-go` for `cf`.

This project integrates with Cloudflare using the `cf-go` CLI and gopass.

## .cloudflare

The `.cloudflare` file at the repo root declares the project name and primary zone:

```
PROJECT_NAME=kbe-website
ZONE=homerenrichment.com
```

`cf-go` reads `ZONE` to resolve the zone ID from gopass automatically.

## gopass Layout

Global account (shared across projects):

- `cloudflare/account/id` → 13eb584192d9cefb730fde0cfd271328
- `cloudflare/account/name` → Account display name
- `cloudflare/account/email` → Account email
- `cloudflare/accounts/<account-id>/global-api-key` → Global API Key

Per-zone entries (for `homerenrichment.com` → `homerenrichment-com`):

- `cloudflare/zones/homerenrichment-com/zone-id`
- `cloudflare/zones/homerenrichment-com/account-id`

Optional per-project token (if needed):

- `cloudflare/tokens/projects/kbe-website/terraform`

## Commands

Helper Makefile targets:

```bash
make preflight   # Verify account/token and sync zone IDs
make zone        # Show zone info
make ns          # Show nameservers
make dns         # List DNS records
```

Underlying `cf-go` commands:

```bash
cf-go diag account -v
cf-go sync gopass --zone homerenrichment.com --verify
cf-go dns list
```

## Token Management (optional)

If this project needs its own Terraform token:

```bash
cf-go tokens bootstrap terraform kbe-website
gopass show -o cloudflare/tokens/projects/kbe-website/terraform
```

For local Terraform runs:

```bash
eval "$(cf-go tokens select terraform kbe-website)"
```
