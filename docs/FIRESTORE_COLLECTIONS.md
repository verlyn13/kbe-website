# Firestore Collections Structure

## Collections Overview

### 1. `admins` Collection

**Purpose**: Store admin user records and permissions

```javascript
/admins/{userId}
{
  email: "jeffreyverlynjohnson@gmail.com",
  name: "Jeffrey Johnson",
  role: "superAdmin", // or "admin"
  permissions: ["all"], // or specific permissions
  createdAt: Timestamp,
  lastLogin: Timestamp,
  active: true
}
```

**Create in Console**:

1. Collection ID: `admins`
2. Document ID: Use the user's UID from Firebase Auth
3. Required for admin panel access

### 2. `registrations` Collection

**Purpose**: Store all program registrations from parents

```javascript
/registrations/{autoId}
{
  // Parent Information
  parentEmail: "parent@example.com",
  parentName: "Jane Doe",
  parentPhone: "(907) 555-1234",
  parentId: "userId123", // Firebase Auth UID

  // Student Information
  students: [
    {
      id: "student1",
      firstName: "Alex",
      lastName: "Doe",
      grade: "7",
      school: "Homer Middle School",
      programs: ["mathcounts-2025"],
      allergies: "None",
      medications: "None",
      specialNeeds: "",
      emergencyContact: {
        name: "John Doe",
        phone: "(907) 555-5678",
        relationship: "Father"
      }
    }
  ],

  // Registration Metadata
  status: "pending", // pending, approved, waitlisted, withdrawn
  submittedAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt: Timestamp,
  approvedBy: "adminUserId",
  notes: "Admin notes here",

  // Program selections
  programs: ["mathcounts-2025"],
  totalAmount: 0, // Future use
  paymentStatus: "not_required" // Future use
}
```

### 3. `programs` Collection

**Purpose**: Define available programs

```javascript
/programs/{programId}
{
  id: "mathcounts-2025",
  name: "MathCounts 2024-2025",
  description: "Competition mathematics for middle school students",
  type: "mathcounts", // or "enrichment"

  // Schedule
  startDate: "2025-01-15",
  endDate: "2025-05-01",
  schedule: "Wednesdays 3:30-5:00 PM",
  location: "Homer Middle School Room 204",

  // Enrollment
  capacity: 24,
  enrolled: 18,
  waitlist: 3,

  // Requirements
  grades: ["6", "7", "8"],
  prerequisites: "Basic algebra knowledge",

  // Status
  active: true,
  registrationOpen: true,
  registrationDeadline: "2025-01-10",

  // Additional Info
  instructor: "Ms. Smith",
  fee: 0,
  materials: "Textbook provided",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 4. `announcements` Collection

**Purpose**: System-wide announcements and communications

```javascript
/announcements/{autoId}
{
  title: "MathCounts Practice Schedule Change",
  content: "Next week's practice moved to Thursday...",
  priority: "high", // low, normal, high

  // Targeting
  recipients: "all", // all, mathcounts, enrichment, specific program
  programId: "mathcounts-2025", // if recipients is specific

  // Metadata
  createdBy: "adminUserId",
  createdByName: "Jeffrey Johnson",
  createdAt: Timestamp,
  publishedAt: Timestamp,
  expiresAt: Timestamp, // optional

  // Status
  status: "published", // draft, published, archived
  pinned: false,

  // Tracking
  viewCount: 0,
  acknowledgedBy: [] // array of userIds who marked as read
}
```

### 5. `users` Collection (Future)

**Purpose**: Extended user profiles for parents

```javascript
/users/{userId}
{
  email: "parent@example.com",
  displayName: "Jane Doe",
  phone: "(907) 555-1234",

  // Preferences
  notifications: {
    email: true,
    sms: false,
    announcements: true
  },

  // Related data
  studentIds: ["student1", "student2"],
  registrationIds: ["reg1", "reg2"],

  // Metadata
  createdAt: Timestamp,
  lastLogin: Timestamp,
  profileComplete: true
}
```

## Creating Collections in Firebase Console

### Quick Setup Order:

1. **admins** (Create this first!)
   - Add your admin record using your Auth UID
   - This enables admin panel access

2. **programs**
   - Add at least one program (e.g., mathcounts-2025)
   - Parents need programs to register for

3. **registrations**
   - Will be created automatically when parents register
   - Can add test data for development

4. **announcements**
   - Will be created through admin panel
   - Can add welcome announcement

## Security Rules Applied

The firestore.rules file already includes:

- Admins can read/write all collections
- Parents can read their own registrations
- All authenticated users can read programs and announcements
- Parents can create new registrations

## Index Requirements

Firestore will prompt you to create indexes when needed. Common ones:

1. **Registrations Query**
   - Collection: `registrations`
   - Fields: `status` (Ascending), `submittedAt` (Descending)

2. **Active Programs**
   - Collection: `programs`
   - Fields: `active` (Ascending), `type` (Ascending)

3. **Recent Announcements**
   - Collection: `announcements`
   - Fields: `status` (Ascending), `publishedAt` (Descending)

## Sample Data for Testing

### Sample Program (mathcounts-2025):

```json
{
  "id": "mathcounts-2025",
  "name": "MathCounts 2024-2025",
  "description": "Competition mathematics program for middle school students. Prepare for chapter, state, and national competitions.",
  "type": "mathcounts",
  "startDate": "2025-01-15",
  "endDate": "2025-05-01",
  "schedule": "Wednesdays 3:30-5:00 PM",
  "location": "Homer Middle School Room 204",
  "capacity": 24,
  "enrolled": 0,
  "waitlist": 0,
  "grades": ["6", "7", "8"],
  "prerequisites": "Basic algebra knowledge helpful",
  "active": true,
  "registrationOpen": true,
  "registrationDeadline": "2025-01-10",
  "instructor": "Staff",
  "fee": 0,
  "materials": "All materials provided"
}
```

### Sample Announcement:

```json
{
  "title": "Welcome to Homer Enrichment Hub!",
  "content": "We're excited to launch our new registration system. MathCounts registration is now open for the 2024-2025 season.",
  "priority": "normal",
  "recipients": "all",
  "status": "published",
  "pinned": true,
  "createdBy": "[your-admin-uid]",
  "createdByName": "Jeffrey Johnson"
}
```
