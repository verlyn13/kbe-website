# Calendar, Announcement & Email Systems Audit

**Audit Date**: October 25, 2025
**Systems Reviewed**: Calendar, Announcements, Automated Emails
**Status**: Critical functionality gaps identified

---

## Executive Summary

**Overall Assessment**: 🟡 PARTIALLY IMPLEMENTED

All three systems have infrastructure in place but critical automation and integration gaps prevent full operational capability.

| System | Infrastructure | Functionality | Automation | Status |
|--------|---------------|---------------|------------|--------|
| Calendar | ✅ Complete | 🟡 70% | ❌ None | GAPS |
| Announcements | ✅ Complete | 🟡 60% | ❌ None | GAPS |
| Email | ✅ Complete | 🟡 40% | ❌ None | CRITICAL |

---

## 1. CALENDAR SYSTEM

### ✅ What Works

**Database**:
- Prisma `Program` model serves as event source
- Fields: id, name, description, startDate, endDate, schedule (JSON), capacity, price
- Full CRUD via `calendar-service.ts`

**UI Components**:
- `/calendar` - Month grid view with event management
- Admin controls: Create, edit, delete events
- Color-coded by type (class, competition, meeting, holiday)
- Mobile-responsive design
- Event filtering by category

**Service Layer** (`calendar-service.ts`):
- `getAll()`, `getByDateRange()`, `getByMonth()`, `getUpcoming()`
- `create()`, `update()`, `delete()`
- `getByCategory()`, `getStats()`

### ❌ Critical Gaps

**1. Recurring Events Not Implemented** (HIGH PRIORITY)
- **Location**: `calendar-service.ts:192`
- **Status**: Infrastructure ready, logic missing
- **Impact**: Weekly classes must be manually created
- **Schema**: `schedule` JSON field designed for patterns but unused
- **Example Pattern**:
  ```json
  {
    "recurring": true,
    "pattern": {
      "type": "weekly",
      "weekdays": [2],
      "startTime": "16:00",
      "endTime": "17:30",
      "until": "2025-03-11"
    }
  }
  ```

**2. Calendar Export Missing** (MEDIUM PRIORITY)
- No iCal (.ics) generation
- "Add to Calendar" buttons non-functional
- No calendar feed endpoint
- **Locations**: `mathcounts-schedule.tsx`, `schedule/page.tsx`

**3. External Integrations Absent** (MEDIUM PRIORITY)
- No Google Calendar sync
- No Outlook/Exchange integration
- No iCal/CalDAV support
- No calendar subscription feeds

**4. PDF Export Missing** (LOW PRIORITY)
- "Download Schedule (PDF)" button non-functional
- **Location**: `schedule/page.tsx`

**5. No Email Reminders** (HIGH PRIORITY)
- No event reminder emails
- No schedule change notifications
- No integration with email system

### 📁 Key Files

```
src/lib/services/calendar-service.ts          # Core service
src/app/calendar/page.tsx                     # Main UI
src/components/calendar/event-dialog.tsx      # Create/edit form
src/components/calendar/time-utils.ts         # Time utilities
prisma/schema.prisma                          # Program model (lines 53-62)
```

---

## 2. ANNOUNCEMENT SYSTEM

### ✅ What Works

**Database** (Prisma schema lines 83-107):
```prisma
model Announcement {
  id             String             @id @default(uuid())
  title          String
  content        String
  priority       Priority           @default(NORMAL)
  publishedAt    DateTime           @default(now())
  expiresAt      DateTime?
  acknowledgedBy String[]           @default([])
  createdByName  String?
  pinned         Boolean            @default(false)
  recipients     String?
  status         AnnouncementStatus @default(PUBLISHED)
  viewCount      Int                @default(0)
}

enum Priority { LOW, NORMAL, HIGH, URGENT }
enum AnnouncementStatus { DRAFT, PUBLISHED, ARCHIVED }
```

**API Endpoints**:
- `GET /api/announcements` - Fetch published announcements (public)
- `DELETE /api/announcements/[id]` - Delete (admin/instructor only)

**UI Components**:
- Dashboard widget showing recent announcements
- Full announcements page with tabs (visible/hidden)
- Admin communications dashboard
- Announcement composer with rich form

**Service Layer** (`announcement-service.ts`):
- `getAll()`, `getById()`, `create()`, `update()`, `delete()`
- `getRecent()`, `getByPriority()`, `archiveExpired()`

### ❌ Critical Gaps

**1. No Email Distribution** (CRITICAL)
- **Impact**: Announcements never reach users via email
- **Gap**: Creating announcement doesn't trigger emails
- SendGrid template exists but unused: `SENDGRID_TEMPLATE_ANNOUNCEMENT`
- **Location**: `announcement-service.ts` - no email trigger in `create()`

**2. Incomplete CRUD Operations** (HIGH PRIORITY)
- **Missing**: `POST /api/announcements` (create endpoint)
- **Missing**: `PUT /api/announcements/[id]` (update endpoint)
- **Impact**: Admin UI directly calls service (bypasses error handling)
- **Location**: Admin composer calls service directly, no API route

**3. Recipient Filtering Not Working** (HIGH PRIORITY)
- **Field**: `recipients` exists in schema
- **UI**: Composer accepts "All Families", "MathCounts Only", "Enrichment Only"
- **Gap**: `announcementService.getAll()` ignores recipient field
- **Impact**: All announcements shown to all users
- **Location**: `announcement-service.ts:33` - no WHERE clause for recipients

**4. Status Workflow Incomplete** (MEDIUM PRIORITY)
- **Enum**: DRAFT, PUBLISHED, ARCHIVED
- **Gap**: No status transition API
- **Gap**: No endpoint to fetch DRAFT announcements
- **Impact**: Admin sees status but can't manage drafts
- **Location**: `api/announcements/route.ts:14` hardcodes `status: 'PUBLISHED'`

**5. Expiration Not Automated** (MEDIUM PRIORITY)
- **Field**: `expiresAt` exists
- **Service**: `archiveExpired()` method exists
- **Gap**: Never called - no cron job or scheduled task
- **Impact**: Expired announcements remain visible
- **Location**: `announcement-service.ts:111-121`

**6. Hide/Unhide Broken** (MEDIUM PRIORITY)
- **Status**: Post-migration feature loss
- **UI**: Buttons present but functions are no-ops
- **Gap**: No per-user hidden announcements tracking
- **Location**: `announcements/page.tsx:71-73`

**7. User Tracking Fields Unused** (LOW PRIORITY)
- `acknowledgedBy` - never populated
- `viewCount` - never incremented
- `createdBy` userId - doesn't exist (only `createdByName` string)

### 📁 Key Files

```
prisma/schema.prisma                          # Announcement model (lines 83-107)
src/lib/services/announcement-service.ts      # Business logic
src/app/api/announcements/route.ts            # GET endpoint
src/app/api/announcements/[id]/route.ts       # DELETE endpoint
src/app/admin/communications/compose/page.tsx # Create UI
src/app/admin/communications/page.tsx         # Admin dashboard
src/components/announcements.tsx              # Public widget
```

---

## 3. AUTOMATED EMAIL SYSTEM

### ✅ What Works

**SendGrid Integration** (`sendgrid-email-service.ts`):
- Full SendGrid SDK implementation
- Production API key configured
- 5 professional email templates live

**Email Templates** (SendGrid Dynamic Templates):
| Template | ID | Status |
|----------|-----|--------|
| Magic Link | `d-253a56e3a...` | ✅ LIVE |
| Welcome | `d-042422ef9...` | ✅ LIVE |
| Password Reset | `d-cc635b94e...` | ✅ LIVE |
| Announcement | `d-8099c86a2...` | ✅ LIVE |
| Registration Confirmation | `d-d9b6ac26e...` | ✅ LIVE |

**Email Functions Available**:
- `sendTemplatedEmail()` - Core function
- `sendMagicLinkEmail()` - Auth links
- `sendWelcomeEmail()` - New users
- `sendPasswordResetEmail()` - Password resets
- `sendAnnouncementEmail()` - Broadcast
- `sendRegistrationConfirmationEmail()` - Confirmations

**Webhook Tracking** (`/api/webhooks/sendgrid`):
- Receives SendGrid events: delivered, bounce, open, click, spam, unsubscribe
- Event validation with Zod schemas
- Event handlers implemented

**Testing Infrastructure**:
- `scripts/test-email.ts` - Send test emails
- `scripts/sync-sendgrid-templates.ts` - Sync templates
- Contract tests for email functions

### ❌ Critical Gaps

**1. No Automated Email Triggers** (CRITICAL)
- **Registration**: No confirmation email sent after registration
  - Template exists: `SENDGRID_TEMPLATE_REGISTRATION_CONFIRMATION`
  - Location: `api/register/route.ts` - no email call

- **Announcements**: No email when announcement published
  - Template exists: `SENDGRID_TEMPLATE_ANNOUNCEMENT`
  - Location: `announcement-service.ts:create()` - no email trigger

- **Status Changes**: No emails for registration approval/rejection
  - Location: `admin/registrations` - status updates silent

**2. No Scheduled/Cron Emails** (CRITICAL)
- **Gap**: No Vercel Cron jobs configured
- **Impact**: No reminder emails possible
- **Use Cases**: Event reminders, payment reminders, weekly digests
- **Location**: `vercel.json` - no cron configuration

**3. No Email Queue System** (HIGH PRIORITY)
- **Gap**: Direct SendGrid calls with no retry
- **Impact**: Failed emails not retried
- **Risk**: Silent failures, no delivery guarantees
- **Recommendation**: Add Bull, Inngest, or similar

**4. Webhook Events Not Persisted** (HIGH PRIORITY)
- **Status**: Events logged but not stored
- **Impact**: No email analytics, no bounce tracking
- **TODOs**: 6 database persistence TODOs in webhook handler
- **Location**: `api/webhooks/sendgrid/route.ts:111, 139`

**5. No Admin Email Notifications** (MEDIUM PRIORITY)
- **Route**: `/api/admin/notify` exists as skeleton
- **TODO**: "Implement actual notification system"
- **Options Listed**: Email to admin, DB record, webhook, dashboard
- **Location**: `api/admin/notify/route.ts:79-84`

**6. No Webhook Security** (MEDIUM PRIORITY)
- **Gap**: Webhook signature verification returns `true` for all
- **Risk**: Anyone can POST fake events
- **Location**: `api/webhooks/sendgrid/route.ts:169`
- **TODO**: Implement SendGrid signature verification

**7. No Email Preferences** (LOW PRIORITY)
- **Gap**: No user opt-in/opt-out system
- **Impact**: Can't customize email frequency
- **Schema**: No EmailPreferences model

### 📁 Key Files

```
src/lib/sendgrid-email-service.ts             # Core email service
src/lib/sendgrid-templates.ts                 # Template definitions
src/app/api/webhooks/sendgrid/route.ts        # Webhook handler
src/app/actions/send-welcome-email.ts         # Server action
scripts/sync-sendgrid-templates.ts            # Template sync
scripts/test-email.ts                         # Testing utility
vercel.json                                   # No cron configured
```

---

## Cross-System Integration Gaps

### Calendar → Email
- ❌ No event reminder emails
- ❌ No schedule change notifications
- ❌ No new event announcements

### Announcements → Email
- ❌ No announcement email distribution
- ❌ No digest emails
- ❌ No urgent announcement push

### Registration → Email
- ❌ No confirmation emails
- ❌ No status change notifications
- ❌ No payment reminders

### Admin → Email
- ❌ No admin alert emails
- ❌ No daily/weekly reports
- ❌ No system notifications

---

## Priority Action Items

### CRITICAL (Must Fix Immediately)

**1. Registration Confirmation Emails**
```typescript
// Location: src/app/api/register/route.ts
// After successful registration:
await sendRegistrationConfirmationEmail(parent.email, {
  parentName: parent.firstName,
  students: createdStudents.map(s => s.firstName),
  programName: "MathCounts 2025"
});
```

**2. Announcement Email Distribution**
```typescript
// Location: src/lib/services/announcement-service.ts
// In create() method, add:
if (data.recipients) {
  await sendAnnouncementEmail(data.recipients, {
    title: data.title,
    content: data.content,
    priority: data.priority
  });
}
```

**3. Add Cron Job for Reminders**
```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/send-reminders",
    "schedule": "0 9 * * *"  // Daily at 9 AM
  }]
}
```

### HIGH PRIORITY

**4. Implement Recurring Events**
- Complete `generateRecurringEvents()` in calendar-service
- Support weekly patterns from JSON schedule field

**5. Fix Recipient Filtering**
- Update `announcementService.getAll()` to filter by recipients
- Add user profile check for matching

**6. Persist Webhook Events**
- Create EmailEvent model in Prisma
- Store all SendGrid webhook events
- Build admin analytics dashboard

**7. Add Missing CRUD Endpoints**
- `POST /api/announcements` (create)
- `PUT /api/announcements/[id]` (update)
- `GET /api/announcements/drafts` (list drafts)

### MEDIUM PRIORITY

**8. Implement Status Workflow**
- Draft → Published → Archived transitions
- API endpoints for status changes
- Admin UI status management

**9. Automate Expiration**
- Add cron job calling `archiveExpired()`
- Schedule: daily or hourly

**10. Add Email Queue**
- Implement queue (Bull/Inngest)
- Retry failed emails
- Track delivery status

**11. Calendar iCal Export**
- Generate .ics files
- Create feed endpoint
- Enable "Add to Calendar"

**12. Webhook Security**
- Implement SendGrid signature verification
- Validate webhook authenticity

### LOW PRIORITY

**13. Email Preferences**
- Add EmailPreferences model
- User opt-in/opt-out UI
- Respect preferences in sends

**14. Calendar PDF Export**
- Add PDF generation library
- Implement download handler

**15. View Count Tracking**
- Increment on announcement view
- Display in admin dashboard

---

## Implementation Estimates

| Task | Priority | Effort | Files |
|------|----------|--------|-------|
| Registration emails | CRITICAL | 1 hour | 1 file |
| Announcement emails | CRITICAL | 2 hours | 2 files |
| Cron setup | CRITICAL | 2 hours | 2 files |
| Recurring events | HIGH | 4 hours | 2 files |
| Recipient filtering | HIGH | 2 hours | 2 files |
| Webhook persistence | HIGH | 3 hours | 3 files |
| CRUD endpoints | HIGH | 3 hours | 3 files |
| Status workflow | MEDIUM | 4 hours | 4 files |
| Email queue | MEDIUM | 6 hours | 4 files |
| iCal export | MEDIUM | 3 hours | 2 files |
| **Total** | - | **32 hours** | - |

---

## Recommended Rollout Phases

### Phase 1: Critical Email Automation (4 hours)
1. Add registration confirmation emails
2. Add announcement distribution emails
3. Test with real data

### Phase 2: Calendar & Announcements (8 hours)
4. Implement recurring event generation
5. Fix recipient filtering
6. Add missing CRUD endpoints
7. Implement status workflow

### Phase 3: Scheduled Tasks (6 hours)
8. Set up Vercel Cron jobs
9. Create reminder email cron
10. Add expiration archival cron
11. Test scheduling

### Phase 4: Infrastructure (8 hours)
12. Implement email queue
13. Persist webhook events
14. Add webhook security
15. Build analytics dashboard

### Phase 5: User Features (6 hours)
16. Add iCal export
17. Email preferences
18. PDF export
19. View tracking

**Total Estimated**: 32 hours (4 weeks @ 8 hrs/week)

---

## Testing Checklist

### Email System
- [ ] Registration triggers confirmation email
- [ ] Announcement creation sends emails to recipients
- [ ] Webhook events persist to database
- [ ] Failed emails retry automatically
- [ ] Bounces update user status

### Calendar System
- [ ] Recurring events generate correctly
- [ ] iCal export downloads valid .ics
- [ ] Add to calendar buttons work
- [ ] Event reminders send on schedule

### Announcement System
- [ ] Recipient filtering shows correct announcements
- [ ] Draft → Published workflow functions
- [ ] Expired announcements archive automatically
- [ ] Email distribution reaches targeted users

---

## Documentation References

- **Email Templates**: `src/lib/sendgrid-templates.ts`
- **API Error Handling**: `docs/ROLLOUT-COMPLETE.md`
- **Prisma Schema**: `prisma/schema.prisma`
- **Vercel Config**: `vercel.json`
- **Environment Variables**: `.env.example`

---

**Next Steps**: Review priorities with stakeholders, then implement Phase 1 (Critical Email Automation).
