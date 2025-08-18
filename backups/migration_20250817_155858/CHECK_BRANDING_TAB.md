# Critical: Check the Branding Tab

The "no reachable owners/editors" error is almost always caused by missing contact information in the Branding tab.

## Go to the Branding Tab
From your current Audience page, click the **"Branding"** tab.

## What You MUST Configure:

### 1. Application Information
- **Application name**: Should be set (e.g., "Homer Enrichment Hub" or "KBE Website")
- **Application logo**: Optional

### 2. Support Email (CRITICAL)
- **User support email**: This MUST be set to `jeffreyverlynjohnson@gmail.com`
- This should be a dropdown menu - select your email from it
- If the dropdown is empty or shows no options, that's the problem

### 3. Application Homepage Links
- These can be your domain URLs

### 4. Developer Contact Information (CRITICAL)
- **Email addresses**: Must include `jeffreyverlynjohnson@gmail.com`
- You can add multiple emails if needed

## If These Fields Are Empty:
That's why you're getting the "no reachable owners" error. Fill them in and save.

## Quick Test After Saving:
1. Save the Branding configuration
2. Wait 2-5 minutes
3. Try logging in with Google again

## Alternative Solution - Use Magic Links
Since we confirmed email/password auth works, you can:

1. Keep Google sign-in disabled for now
2. Use magic link sign-in (already implemented)
3. This works immediately without OAuth issues

The magic link flow:
- User enters email
- Receives sign-in link
- Clicks link to authenticate
- No OAuth consent needed

Would you like me to improve the magic link UI/UX while we sort out the Google OAuth issue?