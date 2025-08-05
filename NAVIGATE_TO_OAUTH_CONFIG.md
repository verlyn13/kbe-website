# Navigate to OAuth Consent Screen Configuration

## You're Currently On: OAuth Overview Page
This is the metrics/monitoring page, not the configuration page.

## To Get to the Configuration Page:

### Method 1: Direct Link
Try this direct link:
https://console.cloud.google.com/apis/credentials/consent/edit?project=kbe-website

### Method 2: Navigate Through Console
1. Go to: https://console.cloud.google.com/apis/credentials?project=kbe-website
2. Look at the LEFT SIDEBAR menu
3. Under "APIs & Services", click **"OAuth consent screen"**
4. You should see configuration options and an "EDIT APP" button

### Method 3: Through the Tabs
On your current page, look for these tabs at the top:
- **Overview** (you're here)
- **Branding**
- **Audience**
- **Clients**
- **Data Access**
- **Verification Center**

Click on **"Branding"** tab - this is where you configure:
- App name
- User support email
- App logo
- Developer contact information

## Critical Configuration Needed

In the **Branding** tab, you MUST set:
1. **User support email**: Select jeffreyverlynjohnson@gmail.com
2. **Developer contact information**: Enter jeffreyverlynjohnson@gmail.com

## Alternative Quick Fix

Since you can see "Your app does not have the right number of project owners/editors":

1. Go to: https://console.cloud.google.com/iam-admin/iam?project=kbe-website
2. Remove jeffreyverlynjohnson@gmail.com
3. Re-add it as Owner
4. Sometimes this "refreshes" the ownership status

## If Nothing Works - Emergency Workaround

1. In Firebase Console, disable Google Sign-in
2. Enable Email/Password sign-in
3. Use magic links (which are working based on our earlier test)
4. This bypasses OAuth completely

The key is finding the configuration page where you can set the support email and developer contact - that's what's causing the "no reachable owners" error.