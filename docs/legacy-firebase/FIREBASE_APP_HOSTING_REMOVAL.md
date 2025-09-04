# Firebase App Hosting Removal Guide

## Status
As of August 27, 2024, this project has been migrated from Firebase App Hosting to Vercel.

## What Was Removed
- `apphosting.yaml` - Firebase App Hosting configuration file
- Firebase deployment triggers on push to main branch
- Firebase App Hosting DNS records (216.239.x.x IPs)

## Current Deployment
- **Platform**: Vercel
- **Domains**: 
  - https://homerenrichment.com
  - https://www.homerenrichment.com
  - https://kbe-website.vercel.app
- **Auto-deploy**: Push to main branch triggers Vercel deployment

## GitHub Check Still Failing?
The Firebase App Hosting GitHub check "App Hosting - Rollout" may still appear as failing. To remove this:

1. **Option 1: Disable in Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select the `kbe-website` project
   - Navigate to App Hosting
   - Disconnect GitHub integration or delete the App Hosting backend

2. **Option 2: Remove GitHub App**
   - Go to GitHub Settings > Integrations > Applications
   - Find "Firebase App Hosting" 
   - Remove access to the `kbe-website` repository

3. **Option 3: Keep as Historical Record**
   - The failing check doesn't prevent merging
   - It serves as a reminder that Firebase App Hosting was removed
   - Can be safely ignored

## Vercel Integration
Vercel automatically deploys without needing a GitHub workflow. The deployment is triggered by:
- Push to main branch
- Pull request creation/update (preview deployments)

## Environment Variables
All Firebase configuration is now managed through Vercel's environment variables dashboard:
- https://vercel.com/jeffrey-johnsons-projects-4efd9acb/kbe-website/settings/environment-variables