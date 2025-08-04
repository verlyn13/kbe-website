# Firestore Database Setup for Homer Enrichment Hub

## Create Firestore Database

1. **Go to Firebase Console > Firestore Database**
2. **Click "Create database"**
3. **Choose options:**

### Security Rules
Select: **Start in production mode**
- We'll add proper rules after setup

### Location
Choose: **us-central1 (or your nearest region)**
- Important: This cannot be changed later
- us-central1 is a good default for US-based projects

## Why Firestore?

### Perfect for this project because:
- **Free tier generous**: 50K reads, 20K writes, 20K deletes per day
- **Real-time updates**: Perfect for registration status changes
- **No server management**: Fully managed by Google
- **Scales automatically**: From 10 to 10,000 users without changes
- **Built for web/mobile**: Native SDKs for React

### Cost Breakdown (estimated for small enrichment program):
- **Free tier covers**: ~500-1000 active families
- **If you exceed**: ~$0.02-0.10 per month per active family
- **Storage**: 1GB free (enough for years of registrations)

## Initial Collections Structure

After creating the database, create these collections:

### 1. admins
```
/admins/{userId}
  - email: string
  - role: "superAdmin" | "admin" 
  - permissions: string[]
  - createdAt: timestamp
```

### 2. registrations
```
/registrations/{registrationId}
  - parentName: string
  - parentEmail: string
  - parentPhone: string
  - students: array
    - name: string
    - grade: string
    - programs: string[]
  - status: "pending" | "approved" | "waitlisted"
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 3. programs
```
/programs/{programId}
  - name: string
  - description: string
  - ageRange: string
  - schedule: string
  - capacity: number
  - enrolled: number
  - active: boolean
```

### 4. announcements
```
/announcements/{announcementId}
  - title: string
  - content: string
  - priority: "low" | "normal" | "high"
  - recipients: "all" | "mathcounts" | "enrichment"
  - createdBy: string
  - createdAt: timestamp
  - publishedAt: timestamp
```

## Security Rules

After creating the database, go to Rules tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Admin collection - admins can read their own record
    match /admins/{userId} {
      allow read: if isOwner(userId);
      allow write: if false; // Only through Admin SDK
    }
    
    // Registrations - parents read own, admins read/write all
    match /registrations/{registrationId} {
      allow read: if isAdmin() || 
        (isSignedIn() && resource.data.parentEmail == request.auth.token.email);
      allow create: if isSignedIn() && 
        request.resource.data.parentEmail == request.auth.token.email;
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Programs - all authenticated users can read
    match /programs/{programId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
    
    // Announcements - all authenticated users can read
    match /announcements/{announcementId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

## Create Initial Admin

1. **Find your User UID:**
   - Firebase Console > Authentication
   - Search: jeffreyverlynjohnson@gmail.com
   - Copy the User UID

2. **Create admin document:**
   - Firestore > admins collection
   - Document ID: [paste your UID]
   - Fields:
     ```json
     {
       "email": "jeffreyverlynjohnson@gmail.com",
       "role": "superAdmin",
       "permissions": ["all"],
       "createdAt": [Server timestamp]
     }
     ```

## Indexes (Create as needed)

Firestore will prompt you to create indexes when needed. Common ones:

1. **Registrations by status and date:**
   - Collection: registrations
   - Fields: status (Ascending), createdAt (Descending)

2. **Announcements by priority and date:**
   - Collection: announcements
   - Fields: priority (Descending), publishedAt (Descending)

## Monitoring Usage

- Firebase Console > Firestore > Usage tab
- Watch daily reads/writes
- Set up budget alerts at $1, $5, $10

## Cost Optimization Tips

1. **Use compound queries** instead of multiple reads
2. **Cache data locally** when possible
3. **Batch writes** for bulk operations
4. **Avoid unnecessary real-time listeners**
5. **Use Firestore bundles** for static data

## Alternative Considered

- **Realtime Database**: Cheaper but less querying power
- **Cloud SQL**: Overkill for this scale, requires maintenance
- **MongoDB Atlas**: More complex setup, similar costs