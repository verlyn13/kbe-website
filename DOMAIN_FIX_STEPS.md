# Domain Fix: homerenrichment.com → App Hosting

This guide resolves 403 Forbidden on `homerenrichment.com` when the App Hosting origin works.

## Current Findings (verified via CLI)

- App Hosting origin responds 200: https://kbe-website--kbe-website.us-central1.hosted.app
- Custom domain responds 403 from Google Frontend (GFE), not Cloudflare.
- DNS A records for apex point to Google anycast: 216.239.32.21 / 34.21 / 36.21 / 38.21.

Conclusion: The custom domain is mapped at Google’s edge but not correctly connected to the App Hosting backend, or it is gated by an auth requirement at the edge. This is not caused by Firebase App Check or Firestore/Auth enforcement.

## Fastest Fix Path (Console)

1. Open Firebase Console → App Hosting → Backends → `kbe-website`.
2. Open Domains tab.
3. Ensure `homerenrichment.com` (and `www.homerenrichment.com` if used) are connected to the `kbe-website` backend.
4. Access settings: set access to Public (unauthenticated). If it’s set to “Require authentication,” switch it to Public.
5. If the domain is attached to a different backend (e.g., `studio`) or Hosting-only, detach there and attach to `kbe-website`.

## Verification (CLI and curl)

Run these from a terminal with access to project `kbe-website`:

```
# Confirm App Hosting backend(s)
firebase --project kbe-website apphosting:backends:list --json | jq .

# Hosted origin should be 200
curl -I https://kbe-website--kbe-website.us-central1.hosted.app

# Custom domain currently 403 (before fix)
curl -I https://homerenrichment.com

# DNS sanity
dig +short homerenrichment.com A
```

If the domain is connected via Cloud Run domain mapping (advanced), also verify unauthenticated access is allowed:

```
# List services and domain mappings (requires gcloud)
gcloud run services list --project kbe-website --region us-central1

gcloud run services describe kbe-website \
  --project kbe-website --region us-central1 --format=json \
  | jq '{ingress:.spec.ingress, invokerPolicy: .status.conditions[]? | select(.type=="Ready").message}'

# Ensure allUsers can invoke if using Cloud Run directly
gcloud run services get-iam-policy kbe-website \
  --project kbe-website --region us-central1

# If missing, allow unauthenticated invocations
gcloud run services add-iam-policy-binding kbe-website \
  --member=allUsers --role=roles/run.invoker \
  --project kbe-website --region=us-central1
```

## After Fix

- `curl -I https://homerenrichment.com` should return 200 and `server: envoy` (or similar) via App Hosting.
- App still uses App Check and Firestore/Auth enforcement as configured; those do not block GET `/`.

## Notes and Corrections

- Previous guidance mentioned removing A records like `151.101.x.x`. For Firebase/Google-managed apex domains you should use Google anycast A records like `216.239.32.21/34.21/36.21/38.21` (already in place).
- The repo’s `firebase.json` does not currently configure classic Firebase Hosting; the custom domain must be linked in App Hosting to route traffic to the `kbe-website` backend.

## Helpful Links

- App Hosting: https://console.firebase.google.com/project/kbe-website/apphosting
- Project Console: https://console.firebase.google.com/project/kbe-website
- App Hosting docs: https://firebase.google.com/docs/app-hosting
