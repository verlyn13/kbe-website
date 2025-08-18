# Firebase Magic Link Authentication Setup

This is a comprehensive checklist for configuring Email-link ("magic-link") Authentication end-to-end.

## 1. Firebase Console Configuration (One-time per project)

| Setting                                                | Where                                         | Required Value                                                                                                                                                    |
| ------------------------------------------------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email/Password → Enable                                | Auth → Sign-in method                         | **On**                                                                                                                                                            |
| Email link (passwordless) → Enable                     | Auth → Sign-in method → Email/Password dialog | **On**                                                                                                                                                            |
| Authorized domains                                     | Auth → Settings → Authorized Domains          | • Add production domain from your `url`/`linkDomain`<br>• Add dev domains (e.g., `localhost`)<br>• Note: localhost not auto-added for projects after Apr 28, 2025 |
| iOS bundle ID / Android package name / SHA-1 & SHA-256 | Settings → General                            | Needed so Firebase can decide whether to build a mobile-optimized link                                                                                            |

**Tip**: Update the default email template (Auth → Templates → Email link) with your brand & support contact.

## 2. Hosting / Link-Generation Domain

- **Default**: `PROJECT_ID.firebaseapp.com` is ready immediately; nothing else required
- **Custom domain**: Add it under Hosting → Add custom domain, verify ownership, wait for SSL cert
- **Multiple Hosting sites**: Set `linkDomain` in ActionCodeSettings to the site you want in the email

## 3. Web (JavaScript) Project Setup

### SDK Requirements

- Use `firebase@^11.x` (JS SDK ≥ 11.23.0 contains the Hosting-based link flow)
- Current version: `firebase@12.0.0` ✅

### Implementation Checklist

| Step                   | Code/Configuration                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Init**               | `javascript<br>import { initializeApp } from 'firebase/app';<br>import { getAuth } from 'firebase/auth';<br>const app = initializeApp(firebaseConfig);<br>const auth = getAuth(app);`                                                                                                                                                                                                       |
| **ActionCodeSettings** | `javascript<br>const actionCodeSettings = {<br>  url: 'https://www.example.com/finishSignIn',<br>  handleCodeInApp: true, // mandatory<br>  iOS: { bundleId: 'com.example.ios' },<br>  android: {<br>    packageName: 'com.example.android',<br>    installApp: true,<br>    minimumVersion: '12'<br>  },<br>  linkDomain: 'custom-domain.com' // only if more than one Hosting site<br>};` |
| **Send link**          | `javascript<br>await sendSignInLinkToEmail(auth, email, actionCodeSettings);<br>localStorage.setItem('emailForSignIn', email);`                                                                                                                                                                                                                                                             |
| **Complete link**      | `javascript<br>if (isSignInWithEmailLink(auth, window.location.href)) {<br>  const email = localStorage.getItem('emailForSignIn') ?? prompt('Email?');<br>  await signInWithEmailLink(auth, email, window.location.href);<br>  localStorage.removeItem('emailForSignIn');<br>}`                                                                                                             |
| **Security**           | Always serve the page over HTTPS; don't pass email in query-string                                                                                                                                                                                                                                                                                                                          |

## 4. Android Configuration

| Area                   | What to do                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dependencies           | `gradle<br>implementation(platform("com.google.firebase:firebase-bom:34.0.0"))<br>implementation("com.google.firebase:firebase-auth")<br>implementation("com.google.android.gms:play-services-auth:21.4.0")`<br>(Firebase Auth SDK ≥ 23.2.0 required for Hosting-based links)                                                                                                                                                                                                                   |
| Package & certificates | Add package name + SHA-1 and SHA-256 fingerprints in Firebase → Settings → General                                                                                                                                                                                                                                                                                                                                                                                                              |
| Intent filter          | In `AndroidManifest.xml`:<br>`xml<br><intent-filter android:autoVerify="true"><br>  <action android:name="android.intent.action.VIEW"/><br>  <category android:name="android.intent.category.DEFAULT"/><br>  <category android:name="android.intent.category.BROWSABLE"/><br>  <data android:scheme="https"<br>        android:host="PROJECT_ID.firebaseapp.com"<br>        android:pathPrefix="/__/auth/links"/><br></intent-filter>`<br>Replace host with custom domain if using `linkDomain` |

## 5. Apple Platforms Configuration (iOS/macOS)

| Area         | What to do                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Dependencies | Add Firebase via Swift Package Manager: `https://github.com/firebase/firebase-ios-sdk.git`, product `FirebaseAuth` (SDK ≥ 11.8.0) |
| Entitlements | In Xcode → Target → Signing & Capabilities → Associated Domains:<br>`applinks:PROJECT_ID.firebaseapp.com` (or custom domain)      |
| Bundle ID    | Register exact bundle ID in Firebase → Settings → General                                                                         |
| Send/verify  | Use `Auth.auth().sendSignInLink(...)`, then `isSignIn(withEmailLink:)` and `signIn(withEmail:link:)`                              |

## 6. Migration & Maintenance Notes

- **Firebase Dynamic Links shutdown → August 25, 2025**
- Ensure all clients use Hosting-based flow (SDK versions above)
- Remove any `page.link` URLs

## Current Implementation Status

✅ **Completed:**

1. Firebase Console configuration
2. Hosting setup (using default `kbe-website.firebaseapp.com`)
3. Web project setup with Firebase v12.0.0
4. Complete sign-in flow implementation

## Common Issues & Solutions

| Error Code                       | Cause                            | Solution                                           |
| -------------------------------- | -------------------------------- | -------------------------------------------------- |
| `auth/operation-not-allowed`     | Email link sign-in not enabled   | Enable in Firebase Console → Auth → Sign-in method |
| `auth/invalid-continue-uri`      | Redirect URL not authorized      | Add domain to authorized domains                   |
| `auth/unauthorized-continue-uri` | Domain not whitelisted for OAuth | Add domain in Firebase Console                     |
| `auth/invalid-action-code`       | Link expired or already used     | Request a new magic link                           |

## Security Best Practices

1. Always serve pages over HTTPS
2. Don't pass email in query strings
3. Store email temporarily in localStorage
4. Clear localStorage after successful sign-in
5. Magic links expire and are single-use

## Testing Checklist

- [ ] Email/Password + Email link enabled in Firebase Console
- [ ] Domain added to authorized domains
- [ ] Enter email and click "Send magic link"
- [ ] Check email for link
- [ ] Click link to return to app
- [ ] Verify automatic sign-in completes
- [ ] Check localStorage is cleared
