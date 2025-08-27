# Firebase Auth Configuration for Vercel Deployment

## Overview

This document describes the Firebase Authentication configuration for the KBE Website deployed on Vercel. We use **Auth Domain Pattern A** which leverages Firebase's auth domain for OAuth handling while the app runs on Vercel.

## Current Configuration

### Firebase Project
- **Project ID**: `kbe-website`
- **Auth Domain**: `kbe-website.firebaseapp.com`
- **Deployment Platform**: Vercel (https://kbe-website.vercel.app)

### Auth Domain Pattern A (Active)

We're using Pattern A where Firebase hosts the OAuth handler:

```
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
```

This configuration:
- Allows Firebase to handle OAuth redirects on its domain
- The Vercel app (kbe-website.vercel.app) acts as the parent frame
- Requires proper domain authorization in Firebase Console

### Vercel Configuration

#### vercel.json
The project includes a rewrite rule to proxy auth requests to Firebase:

```json
{
  "rewrites": [
    {
      "source": "/__/auth/:path*",
      "destination": "https://kbe-website.firebaseapp.com/__/auth/:path*"
    }
  ]
}
```

#### Environment Variables
The following Firebase environment variables are configured in Vercel:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | (encrypted) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | `kbe-website.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `kbe-website` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `kbe-website.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | (encrypted) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | (encrypted) |

## Firebase Console Configuration

### Required Authorized Domains

In the Firebase Console under **Authentication > Settings > Authorized domains**, ensure these domains are added:

1. `kbe-website.firebaseapp.com` (default, should be present)
2. `kbe-website.vercel.app` (production deployment)
3. `localhost` (for local development)

### API Key Restrictions

For production security, configure API key restrictions in Google Cloud Console:

1. Navigate to **APIs & Services > Credentials**
2. Find your Firebase API key
3. Under **Application restrictions**, select "HTTP referrers"
4. Add these referrers:
   - `https://kbe-website.vercel.app/*`
   - `https://kbe-website.firebaseapp.com/*`
   - `http://localhost:9002/*` (for development)

## Deployment Process

### Updating Environment Variables

To update Firebase configuration on Vercel:

```bash
# List current environment variables
vercel env ls production

# Remove an existing variable
vercel env rm VARIABLE_NAME production

# Add a new variable
vercel env add VARIABLE_NAME production
# Then enter the value when prompted

# Pull environment variables locally (creates .env.production)
vercel env pull .env.production
```

### Triggering Deployment

After updating environment variables:

1. Push changes to the main branch:
   ```bash
   git push origin main
   ```

2. Vercel will automatically redeploy with the new configuration

3. Monitor the deployment at: https://vercel.com/jeffrey-johnsons-projects-4efd9acb/kbe-website

## Troubleshooting

### Common Issues

#### 1. "Unauthorized domain" Error
- **Cause**: Domain not added to Firebase authorized domains
- **Solution**: Add the domain in Firebase Console under Authentication > Settings

#### 2. "Invalid API key" Error
- **Cause**: API key restrictions blocking the request
- **Solution**: Update HTTP referrer restrictions in Google Cloud Console

#### 3. OAuth Redirect Issues
- **Cause**: Incorrect auth domain configuration
- **Solution**: Ensure `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is set to `kbe-website.firebaseapp.com`

#### 4. CORS Errors
- **Cause**: Missing rewrite rules or domain authorization
- **Solution**: Verify vercel.json rewrites and Firebase domain settings

### Debug Checklist

- [ ] Verify environment variables are set in Vercel dashboard
- [ ] Check Firebase Console authorized domains include Vercel URL
- [ ] Confirm API key restrictions allow Vercel domain
- [ ] Test OAuth flow in incognito/private browser window
- [ ] Check browser console for specific error messages
- [ ] Verify vercel.json includes auth rewrites

## Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive configuration
3. **Restrict API keys** to specific domains in production
4. **Enable App Check** for additional security (optional)
5. **Monitor Firebase Auth logs** for suspicious activity

## Local Development

For local development, create a `.env.local` file with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kbe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kbe-website.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

Run the development server:
```bash
bun dev
```

The app will be available at http://localhost:9002

## References

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth/web/start)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

*Last Updated: December 26, 2024*
*Configuration Status: Active - Pattern A*
