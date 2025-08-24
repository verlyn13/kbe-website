# API Key Restrictions Policy

This project follows a strict, environment-isolated API key policy.

## Organizational Stance

- Principle: least privilege, environment isolation
- Application restriction is mandatory (no "None")
- API restrictions are allow-list only (minimum set)
- Rotation & telemetry required; break-glass path ≤24h with approval

## Keys in Scope

### 1) Firebase API Key (`NEXT_PUBLIC_FIREBASE_API_KEY`)

- Purpose: Browser key used by Firebase JS SDK for Auth and Firestore
- Application restriction: Websites (HTTP referrers)
- Allowed referrers:
  - `http://localhost:9002/*`
  - `https://homerenrichment.com/*`
  - `https://www.homerenrichment.com/*`
  - `https://kbe-website--kbe-website.us-central1.hosted.app/*`
  - `https://kbe-website.firebaseapp.com/*`
  - `https://kbe-website.web.app/*`
- API restrictions (allow-list):
  - identitytoolkit.googleapis.com (Identity Toolkit)
  - firestore.googleapis.com (Cloud Firestore)
  - firebaseinstallations.googleapis.com (Firebase Installations)
  - Strongly recommended: firebaseappcheck.googleapis.com (App Check)
  - Optional (if used): recaptchaenterprise.googleapis.com, firebasedynamiclinks.googleapis.com

### 2) Generative Language API Key

- Purpose: Generative Language API (backend only)
- Prefer service account credentials; if key must remain:
  - Application restriction: IP addresses (egress of backend)
  - API restrictions: generativelanguage.googleapis.com only

### 3) Auto-created "Browser key"

- Recommendation: Delete if unused, or restrict to preview env only with same rules as above.

## Implementation Checklist (All Keys)

1. Cloud Console → Credentials → API key → Application restrictions: set appropriately per key
2. API restrictions: choose "Restrict key" and allow only required APIs
3. Firebase Console → Auth → Authorized domains: add hostnames matching referrers
4. Redeploy with updated secrets (App Hosting reads Secret Manager)
5. Smoke test: Google sign-in, email link, Firestore
6. Monitor: quotas, invalid referrers/IPs, 403 errors

## Tooling

- `scripts/keys/enforce-firebase-web-key.sh` – Apply referrer/API restrictions for a given key ID
- `scripts/keys/verify-api-key.sh` – Print current restrictions for a given key ID
- `sync-gopass-secrets.sh` – Sync Secret Manager → gopass
- `generate-env-local-v2.sh` – Generate `.env.local` from gopass/Secret Manager
