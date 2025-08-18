# Firebase Import Scripts

This directory contains scripts to import initial data into your Firestore database.

## Setup Instructions

1. **Get your Service Account Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Navigate to your project
   - Click ⚙️ → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save the downloaded file as `serviceAccountKey.json` in this directory
   - ⚠️ **NEVER commit this file to git!** (it's already in .gitignore)

2. **Run the import:**
   ```bash
   node import-all.js
   ```

## What Gets Imported

### 1. Admin User

- Creates admin record for jeffreyverlynjohnson@gmail.com
- Uses your Firebase Auth UID as document ID
- Grants superAdmin role with all permissions

### 2. Programs

- Creates MathCounts 2024-2025 program
- Sets up registration dates and capacity
- Ready for parent registrations

### 3. Announcements

- Creates welcome announcement
- Pinned and marked as high priority
- Links to your admin account

## After Import

1. Sign in to the app with jeffreyverlynjohnson@gmail.com
2. Access Admin Panel from user dropdown menu
3. Test parent registration flow

## Troubleshooting

- **"serviceAccountKey.json not found"**: Download from Firebase Console
- **"Permission denied"**: Check that your service account has proper permissions
- **"User not found"**: Make sure you've signed in at least once with jeffreyverlynjohnson@gmail.com

## Data Files

- `admins-data.json` - Admin user configuration
- `programs-data.json` - Available programs
- `announcements-data.json` - Initial announcements
