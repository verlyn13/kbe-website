# Firebase Magic Link Authentication Setup

This guide covers how to enable and configure email link (magic link) authentication in Firebase.

## Prerequisites

1. Access to Firebase Console
2. Firebase project with Authentication enabled

## Setup Steps

### 1. Enable Email Link Sign-In Method

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`kbe-website`)
3. Navigate to **Authentication** → **Sign-in method**
4. Find **Email/Password** provider
5. Click to edit
6. Enable **Email/Password** sign-in
7. Enable **Email link (passwordless sign-in)**
8. Click **Save**

### 2. Authorize Domains

1. Stay in **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for local development)
   - `kbe-website.firebaseapp.com`
   - `kbe-website.web.app`
   - Your custom domain (if applicable)
3. Click **Add domain** for each one

### 3. Configure Email Templates (Optional)

1. Go to **Authentication** → **Templates**
2. Select **Email address verification**
3. Customize the email template if desired
4. Ensure the action URL is correct

## Local Development

For local development, the magic link will redirect to `http://localhost:9002/`

## Production

For production, ensure your Firebase Hosting domain is in the authorized domains list.

## Common Issues

### Error: auth/operation-not-allowed
- **Cause**: Email link sign-in is not enabled
- **Fix**: Follow step 1 above to enable it

### Error: auth/invalid-continue-uri
- **Cause**: The redirect URL is not authorized
- **Fix**: Add your domain to authorized domains (step 2)

### Error: auth/unauthorized-continue-uri
- **Cause**: Domain not whitelisted for OAuth operations
- **Fix**: Add domain in Firebase Console under authorized domains

## Testing

1. Enter an email address in the login form
2. Click "Send magic link"
3. Check your email
4. Click the link in the email
5. You should be redirected back and logged in

## Security Notes

- Magic links expire after a certain time
- Each link can only be used once
- Always use HTTPS in production
- The email address is stored in localStorage temporarily