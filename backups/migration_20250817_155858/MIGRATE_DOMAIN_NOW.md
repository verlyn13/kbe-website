# Migrate homerconnect.com to App Hosting (Your Actual App)

## Current Situation

- ✅ Your app works at: https://kbe-website--kbe-website.us-central1.hosted.app
- ❌ homerconnect.com shows empty Firebase Hosting page
- ❌ Domain is connected to wrong service

## Step-by-Step Fix

### Option A: Via Firebase Console (Easiest)

1. **Remove domain from Hosting**
   - Go to: https://console.firebase.google.com/project/kbe-website/hosting/sites
   - Click on "homerconnect" site
   - Find "Custom domains" section
   - Click the 3 dots next to homerconnect.com
   - Select "Remove domain"
   - Confirm removal

2. **Add domain to App Hosting**
   - Go to: https://console.firebase.google.com/project/kbe-website/apphosting
   - Click on "kbe-website" backend
   - Look for "Settings" tab or "Domains" section
   - Click "Add custom domain"
   - Enter: homerconnect.com
   - Follow the DNS instructions

### Option B: Via CLI (If Console doesn't work)

1. **First, let's try to remove the domain from Hosting**

   ```bash
   # This might not work for domains, but worth trying
   firebase hosting:disable --site homerconnect
   ```

2. **Delete the empty hosting site entirely**

   ```bash
   firebase hosting:sites:delete homerconnect
   ```

   Note: This will ask for confirmation

3. **Add domain to App Hosting**
   Unfortunately, there's no CLI command for App Hosting domains yet.
   You must use the Firebase Console.

## DNS Records

When you add the domain to App Hosting, Firebase will give you new DNS records.
These will be different from your current ones:

Current (wrong - pointing to Hosting):

- A @ 151.101.1.195
- A @ 151.101.65.195

New (correct - will point to App Hosting):

- Will be provided by Firebase when you add the domain
- Likely something like: A @ 35.219.200.11

## Timeline

1. Remove domain from Hosting: 5 minutes
2. Add domain to App Hosting: 5 minutes
3. Update DNS records: 5 minutes
4. DNS propagation: 1-48 hours (usually faster)
5. SSL certificate: Automatic after DNS propagates

## Test Your App Works

While waiting, confirm your app works perfectly at:
https://kbe-website--kbe-website.us-central1.hosted.app

## Need the direct link?

Firebase Console for your project:
https://console.firebase.google.com/project/kbe-website
