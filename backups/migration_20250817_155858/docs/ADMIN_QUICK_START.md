# Admin Quick Start Guide

## Setting Up Admin Access

### Option 1: Quick Setup (For Testing)

1. **Update Admin Emails**
   Edit `/src/hooks/use-admin.tsx` and update the `TEMP_ADMIN_EMAILS` array (around line 41):
   ```typescript
   const TEMP_ADMIN_EMAILS = [
     'your-email@example.com',  // Replace with your email
     'colleague@example.com',   // Replace with colleague's email
   ];
   ```

2. **Register/Login**
   - Go to the main site
   - Register with one of the emails above
   - You'll automatically have admin access

3. **Access Admin Panel**
   - After login, go to `/admin` or click "Admin" in the sidebar

### Option 2: Proper Firebase Setup

1. **Register Admin Users First**
   - Go to the main site
   - Each admin should register with their email/password
   - Note their email addresses

2. **Add to Firebase Console**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Firestore Database
   - Create/open `admins` collection
   - Add document for each admin:
   
   ```json
   Document ID: [User's UID from Authentication tab]
   {
     "email": "admin@example.com",
     "name": "Admin Name",
     "role": "superAdmin",
     "permissions": ["all"],
     "createdAt": [timestamp]
   }
   ```

## Admin Features

### Dashboard (`/admin/dashboard`)
- Overview of registrations
- Quick action buttons
- Pending tasks alerts

### Registrations (`/admin/registrations`)
- View all registrations
- Approve/Waitlist/Withdraw students
- Filter by status
- Bulk email capabilities

### Communications (`/admin/communications`)
- Send announcements to families
- Target by grade or all families
- View announcement history

### Other Sections (Coming Soon)
- Programs: Manage schedules and capacity
- Reports: Export data and analytics
- Settings: Manage admin users

## Important Notes

1. **Two Admin Accounts**: The system is designed for two primary administrators
2. **Parent Portal**: Regular users go to `/dashboard` after login
3. **Admin Panel**: Admin users can access both `/dashboard` and `/admin`
4. **Security**: Admin status is checked on every page load

## Troubleshooting

### Can't Access Admin Panel?
1. Make sure you're logged in with an admin email
2. Check browser console for errors
3. Verify email is in `TEMP_ADMIN_EMAILS` or Firebase `admins` collection

### Registration Management Not Working?
1. Make sure Firestore is properly initialized
2. Check Firebase Console for any security rule errors
3. Ensure you have proper permissions set

### Need Help?
- Check `/docs/FIREBASE_SETUP.md` for detailed Firebase configuration
- Review browser console for specific error messages
- Verify all Firebase services are enabled in console