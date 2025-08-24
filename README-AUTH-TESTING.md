# Authentication Testing Suite for Homer Enrichment Hub

This comprehensive testing suite validates all authentication flows for the Homer Enrichment Hub application.

## Overview

The Homer Enrichment Hub supports multiple authentication methods:
- **Google OAuth** - Primary authentication method
- **Email/Password** - Traditional username/password login
- **Magic Link** - Passwordless email authentication
- **reCAPTCHA Enterprise** - Bot protection via Firebase App Check

## Test Scripts

### 1. Configuration Validator (`test-auth-config.js`)
Validates Firebase configuration, environment variables, and security settings.

```bash
node test-auth-config.js
```

**Checks:**
- Environment variables (.env.local)
- Firebase SDK initialization
- Authentication providers setup
- Security rules and headers
- Package dependencies
- Git ignore configuration

### 2. End-to-End HTTP Tests (`test-auth-e2e.js`)
Tests authentication flows via HTTP requests without browser interaction.

```bash
node test-auth-e2e.js
```

**Tests:**
- Server health checks
- Firebase configuration validation
- Authentication provider availability
- App Check and reCAPTCHA setup
- Security headers
- Both local (localhost:9002) and production environments

### 3. Browser Tests (`test-auth-playwright.js`)
Automated browser testing using Playwright for realistic user interactions.

```bash
# Install Playwright browsers first
npx playwright install

node test-auth-playwright.js
```

**Tests:**
- Page loading and rendering
- Auth diagnostics page functionality
- Login form presence and validation
- Tab switching (Password/Magic Link)
- Form validation behavior
- Google authentication attempts
- Magic link submission
- Protected route access control

### 4. Manual Testing Guide (`test-auth-manual.js`)
Interactive testing script that guides you through manual verification.

```bash
node test-auth-manual.js
```

**Features:**
- Step-by-step testing instructions
- Interactive pass/fail reporting
- Screenshot capture guidance
- Browser automation helpers
- Comprehensive test coverage

### 5. Test Suite Runner (`run-auth-tests.js`)
Orchestrates all test suites and generates comprehensive reports.

```bash
node run-auth-tests.js

# Show help
node run-auth-tests.js --help
```

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Run all tests:**
   ```bash
   node run-auth-tests.js
   ```

3. **Review reports:**
   - `auth-test-master-report.json` - Overall test results
   - `auth-config-report.json` - Configuration validation
   - `auth-test-report.json` - E2E test results
   - `playwright-test-report.json` - Browser test results

## Prerequisites

### Required
- Node.js 18+ and npm
- Development server running on port 9002
- Firebase project with authentication enabled

### Optional
- Playwright (auto-installed when needed)
- curl (for HTTP testing)
- Real email account for magic link testing

## Environment Setup

### Local Development (.env.local)
```env
# Firebase Configuration (required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kbe-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kbe-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kbe-website.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# reCAPTCHA Enterprise (recommended)
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=your_recaptcha_site_key
```

### Firebase Console Configuration

1. **Authentication Providers** (Enable in Firebase Console):
   - Google OAuth
   - Email/Password
   - Email Link (for Magic Links)

2. **Authorized Domains** (Add to Firebase Console):
   - localhost
   - homerenrichment.com
   - kbe-website--kbe-website.us-central1.hosted.app

3. **App Check** (Configure reCAPTCHA Enterprise):
   - Enable App Check
   - Add reCAPTCHA Enterprise provider
   - Configure domains

## Current Test Status

Based on the latest test runs:

### ✅ Working
- Firebase SDK configuration
- Authentication method setup (code level)
- Form validation and UI components
- Security rules configuration
- Package dependencies

### ❌ Issues Found
- Missing Firebase environment variables
- Invalid API key in local environment
- App Check and reCAPTCHA not fully configured
- Missing security headers

### ⚠️ Needs Attention
- Local development server (500 errors due to config)
- Production environment authentication flow
- Manual testing with real credentials

## Fixing Common Issues

### 1. Invalid API Key Error
```bash
# Add proper Firebase config to .env.local
cp .env.example .env.local
# Edit .env.local with real Firebase values
```

### 2. Google OAuth Not Working
- Verify OAuth consent screen is configured
- Check authorized domains in Firebase Console
- Ensure Google provider is enabled

### 3. Magic Links Not Working
- Verify email provider is enabled in Firebase
- Check authorized domains for email links
- Test with real email address

### 4. App Check Issues
- Enable App Check in Firebase Console
- Configure reCAPTCHA Enterprise
- Add all domains to reCAPTCHA configuration

## Production Testing

Test the production environment:
```bash
# Production URL
https://kbe-website--kbe-website.us-central1.hosted.app

# Auth diagnostics
https://kbe-website--kbe-website.us-central1.hosted.app/auth-diagnostics
```

## Security Considerations

- Never commit `.env.local` to version control
- Use Firebase App Check for bot protection
- Enable proper Firestore security rules
- Configure CSP and security headers
- Regular security audits

## Monitoring and Alerts

Set up monitoring for:
- Authentication success/failure rates
- App Check token validation
- Performance metrics
- Error logging
- User registration flows

## Firebase Console Links

- [Authentication](https://console.firebase.google.com/project/kbe-website/authentication)
- [App Check](https://console.firebase.google.com/project/kbe-website/appcheck)
- [Project Settings](https://console.firebase.google.com/project/kbe-website/settings/general)
- [OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent?project=kbe-website)

## Support Commands

```bash
# Check Firebase configuration
npm run debug:magic-link

# Run manual tests
node test-auth-manual.js

# Test specific functionality
node test-auth-config.js     # Configuration only
node test-auth-e2e.js        # HTTP tests only
node test-auth-playwright.js # Browser tests only

# Clean up test artifacts
rm -rf test-screenshots/ *.json
```

## Next Steps

1. **Fix Configuration Issues**
   - Add proper Firebase environment variables
   - Configure App Check and reCAPTCHA
   - Enable all authentication providers

2. **Complete Testing**
   - Run manual testing with real accounts
   - Test production environment thoroughly
   - Verify cross-browser compatibility

3. **Security Hardening**
   - Add security headers
   - Review Firestore rules
   - Enable monitoring and alerts

4. **Documentation**
   - Update user guides
   - Create admin documentation
   - Maintain testing procedures

## Contributing

When adding new authentication features:
1. Update the relevant test scripts
2. Add new test cases for edge cases
3. Update this documentation
4. Test both local and production environments
5. Verify security implications