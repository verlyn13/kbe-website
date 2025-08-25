# reCAPTCHA Enterprise Site Key Correction

## Issue Identified
The reCAPTCHA Enterprise site key was incorrect in the environment configuration.

## Incorrect Key (OLD)
```
6LdGsaorAAAAAEeIyXtRrHG-9nxqBpZvDqSPFpuA
```

## Correct Key (NEW)
```
6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP
```

## Locations to Update

### 1. Google Cloud Secret Manager
- Secret Name: `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`
- Project: `kbe-website`
- Update via Console or CLI:
  ```bash
  echo -n "6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP" | \
    gcloud secrets versions add NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY \
    --data-file=- \
    --project=kbe-website
  ```

### 2. Gopass (Local Secret Management)
Update all three environment-specific keys:
```bash
# Production
gopass insert kbe-website/appcheck/site-key
# Enter: 6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP

# Development
gopass insert kbe-website/appcheck/site-key-dev
# Enter: 6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP

# Preview
gopass insert kbe-website/appcheck/site-key-preview
# Enter: 6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP
```

### 3. Local Development (.env.local)
```env
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP
```

## Automated Fix Script
Run the provided script to update all locations:
```bash
./fix-recaptcha-key.sh
```

## Verification

### 1. Verify in Firebase Console
Go to: https://console.firebase.google.com/project/kbe-website/appcheck

Check that the site key matches: `6LeRvaorAAAAAKFB3hEtz28ofFmKTkbwu5-OE8XP`

### 2. Verify in Google Cloud Console
Go to: https://console.cloud.google.com/security/secret-manager/secret/NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY/versions?project=kbe-website

The latest version should contain the correct key.

### 3. Verify reCAPTCHA Enterprise Console
Go to: https://console.cloud.google.com/security/recaptcha?project=kbe-website

The key should be listed and configured with the correct domains.

## Important Notes

1. **App Check Status**: Remember that App Check must remain in "Unenforced" mode due to OAuth compatibility issues.

2. **Domain Configuration**: The reCAPTCHA key should be configured for:
   - `localhost` (development)
   - `kbe-website.firebaseapp.com` (Firebase default)
   - `kbe-website--kbe-website.us-central1.hosted.app` (Firebase App Hosting)
   - `homerenrichment.com` (production domain)
   - `www.homerenrichment.com` (production www)
   - `kbe.homerenrichment.com` (production subdomain)

3. **Deployment**: After updating the secret in Google Cloud Secret Manager, the next deployment will automatically use the new key.

## Timeline
- **Identified**: December 2024
- **Corrected**: December 2024
- **Old Key Source**: Unknown (possibly from a different project or test key)