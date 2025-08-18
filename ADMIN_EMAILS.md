# Admin Email Configuration

To set up admin access, edit the file:
`/src/hooks/use-admin.tsx`

Look for line ~42 and update the `TEMP_ADMIN_EMAILS` array:

```typescript
const TEMP_ADMIN_EMAILS = [
  'your-email@example.com', // Replace with your actual email
  'colleague@example.com', // Replace with colleague's email
];
```

After updating, any user who registers/logs in with these emails will have admin access.

This is a temporary solution for testing. For production, set up proper Firebase admin records as described in `/docs/FIREBASE_SETUP.md`.
