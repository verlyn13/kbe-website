# KBE Website Deployment Method

## 🚀 IMPORTANT: How This Project Deploys

**This project uses Firebase App Hosting with automatic GitHub deployment.**

### Deployment Method
- **Automatic**: Pushing to `main` branch triggers deployment
- **Provider**: Firebase App Hosting (NOT traditional Firebase Hosting)
- **Project**: `kbe-website` (in jeffreyverlynjohnson@gmail.com Google Cloud account)
- **No Manual Commands**: Do NOT use `firebase deploy` or `gcloud app deploy`

### How to Deploy

1. **Make changes locally**
2. **Commit and push to main**:
   ```bash
   git add .
   git commit -m "your changes"
   git push origin main
   ```
3. **Deployment happens automatically via GitHub integration**

### Project Configuration
- **Google Cloud Project**: `kbe-website`
- **Firebase Project**: `kbe-website`
- **Domain**: `homerenrichment.com` (migrating from homerconnect.com)
- **Account**: `jeffreyverlynjohnson@gmail.com`

### What NOT to Do
- ❌ Do NOT run `firebase deploy`
- ❌ Do NOT run `gcloud app deploy`
- ❌ Do NOT run `firebase apphosting:rollouts:create`
- ❌ Do NOT try to set up GitHub Actions workflows

### Checking Deployment Status

Since deployment is automatic via GitHub:
1. Check GitHub repository for integration status
2. Check Firebase Console: https://console.firebase.google.com/project/kbe-website/apphosting
3. Check deployed site: https://homerenrichment.com (once DNS propagates)

### Key Files
- `apphosting.yaml` - Firebase App Hosting configuration
- `.firebaserc` - Firebase project configuration (set to `kbe-website`)
- `firebase.json` - Firebase services configuration

### Important Notes
- The project name remains `kbe-website` in Google Cloud/Firebase
- Only the domain is changing to `homerenrichment.com`
- Site branding is "Homer Enrichment Hub"
- Deployment is triggered by GitHub push to main branch