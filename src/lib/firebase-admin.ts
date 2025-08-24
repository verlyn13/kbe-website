import type { DocumentData, UpdateData } from 'firebase/firestore';
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  type QueryConstraint,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Types
export interface Registration {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  students: Student[];
  programId: string;
  status: 'pending' | 'active' | 'withdrawn' | 'waitlist';
  paymentStatus: 'pending' | 'completed' | 'waived';
  registrationDate: Date;
  approvedDate?: Date;
  approvedBy?: string;
  notes?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string; // What the child wants to be called
  grade: number;
  school: string;
  allergies?: string;
  medicalInfo?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UserProfile {
  id: string; // User's Firebase Auth UID
  guardianName: string;
  displayName?: string; // Optional display name, defaults to guardianName
  email: string;
  phone: string;
  avatarUrl?: string;
  bio?: string; // Description they'd like others to see
  mathPersonality?: {
    type:
      | 'Visual Learner'
      | 'Problem Solver'
      | 'Pattern Seeker'
      | 'Creative Thinker'
      | 'Logical Analyst';
    description?: string;
  };
  children: {
    name: string;
    preferredName?: string;
    grade: string; // Required: K, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Simplified profile used in admin views
export interface Profile {
  userId: string;
  displayName?: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  // Optional fields used by onboarding flows
  role?: 'guardian' | 'admin';
  emailPreferences?: {
    announcements: boolean;
    programUpdates: boolean;
    newsletters: boolean;
  };
  eulaAccepted?: boolean;
  eulaAcceptedDate?: Date;
  profileCompleted?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  location?: string;
  type: 'class' | 'competition' | 'meeting' | 'holiday' | 'other';
  color?: string; // Hex color for custom event colors
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
    daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
  };
  programId?: string; // Link to specific program
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high';
  recipients: 'all' | 'mathcounts' | 'enrichment';
  programId?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  publishedAt: Date;
  expiresAt?: Date;
  status: 'draft' | 'published' | 'archived';
  pinned: boolean;
  viewCount: number;
  acknowledgedBy: string[];
  hiddenBy?: string[]; // Users who have hidden this announcement
}

export interface Program {
  id: string;
  name: string;
  description: string;
  schedule: {
    regularMeeting: {
      day: string;
      time: string;
      location: string;
    };
    startDate: Date;
    endDate: Date;
    exceptions: Date[]; // Holidays, cancellations
  };
  capacity: {
    max: number;
    current: number;
    waitlistEnabled: boolean;
  };
  status: 'registration-open' | 'registration-closed' | 'active' | 'completed';
  grades: string; // e.g., "4-8"
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superAdmin' | 'programAdmin' | 'volunteer';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

// Registration Management
export const registrationService = {
  async getAll(filters?: {
    status?: Registration['status'];
    programId?: string;
  }): Promise<Registration[]> {
    const constraints: QueryConstraint[] = [orderBy('registrationDate', 'desc')];

    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.programId) {
      constraints.push(where('programId', '==', filters.programId));
    }

    const q = query(collection(db, 'registrations'), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
          registrationDate: doc.data().registrationDate?.toDate(),
          approvedDate: doc.data().approvedDate?.toDate(),
        }) as Registration
    );
  },

  async getById(id: string): Promise<Registration | null> {
    const docRef = doc(db, 'registrations', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      registrationDate: docSnap.data().registrationDate?.toDate(),
      approvedDate: docSnap.data().approvedDate?.toDate(),
    } as Registration;
  },

  async updateStatus(id: string, status: Registration['status'], adminId: string): Promise<void> {
    const updateData: UpdateData<DocumentData> = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === 'active') {
      updateData.approvedDate = serverTimestamp();
      updateData.approvedBy = adminId;
    }

    await updateDoc(doc(db, 'registrations', id), updateData);
  },

  async getStats(programId?: string) {
    const registrations = await this.getAll({ programId });

    return {
      pending: registrations.filter((r) => r.status === 'pending').length,
      active: registrations.filter((r) => r.status === 'active').length,
      waitlist: registrations.filter((r) => r.status === 'waitlist').length,
      withdrawn: registrations.filter((r) => r.status === 'withdrawn').length,
      totalStudents: registrations.reduce((sum, r) => sum + r.students.length, 0),
    };
  },
};

// Program Management
export const programService = {
  async get(id: string): Promise<Program | null> {
    const docRef = doc(db, 'programs', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Program;
  },

  async update(id: string, updates: Partial<Program>): Promise<void> {
    await updateDoc(doc(db, 'programs', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  },

  async getAll(): Promise<Program[]> {
    const snapshot = await getDocs(collection(db, 'programs'));
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as Program
    );
  },
};

// Admin User Management
export const adminService = {
  async checkAdminRole(userId: string): Promise<AdminUser | null> {
    const docRef = doc(db, 'admins', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate(),
      lastLogin: docSnap.data().lastLogin?.toDate(),
    } as AdminUser;
  },

  async updateLastLogin(userId: string): Promise<void> {
    await updateDoc(doc(db, 'admins', userId), {
      lastLogin: serverTimestamp(),
    });
  },

  async create(userId: string, data: Omit<AdminUser, 'id' | 'createdAt'>): Promise<void> {
    await setDoc(doc(db, 'admins', userId), {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  async update(userId: string, data: Partial<Omit<AdminUser, 'id' | 'createdAt'>>): Promise<void> {
    await updateDoc(doc(db, 'admins', userId), data);
  },

  async delete(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'admins', userId));
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  },

  async getAll(): Promise<AdminUser[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'admins'));
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
          }) as AdminUser
      );
    } catch (error) {
      console.error('Error getting all admins:', error);
      return [];
    }
  },
};

// Attendance Service
export const attendanceService = {
  async record(data: {
    programId: string;
    date: Date;
    present: string[];
    absent: string[];
    notes?: string;
    recordedBy: string;
  }): Promise<void> {
    const dateKey = data.date.toISOString().split('T')[0];
    const docRef = doc(db, 'attendance', `${data.programId}_${dateKey}`);

    await setDoc(docRef, {
      ...data,
      date: Timestamp.fromDate(data.date),
      recordedAt: serverTimestamp(),
    });
  },

  async getByDate(programId: string, date: Date): Promise<AttendanceRecord | null> {
    const dateKey = date.toISOString().split('T')[0];
    const docRef = doc(db, 'attendance', `${programId}_${dateKey}`);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      programId,
      date: data.date?.toDate() ?? date,
      present: Array.isArray(data.present) ? (data.present as string[]) : [],
      absent: Array.isArray(data.absent) ? (data.absent as string[]) : [],
      notes: typeof data.notes === 'string' ? data.notes : undefined,
      recordedBy: typeof data.recordedBy === 'string' ? data.recordedBy : '',
      recordedAt: data.recordedAt?.toDate(),
    };
  },
};

// Types for Attendance service
export interface AttendanceRecord {
  programId: string;
  date: Date;
  present: string[];
  absent: string[];
  notes?: string;
  recordedBy: string;
  recordedAt?: Date;
}

// Announcement Service
export const announcementService = {
  async getAll(filters?: {
    status?: Announcement['status'];
    recipients?: string;
    limitCount?: number;
    userId?: string;
    showHidden?: boolean;
  }): Promise<Announcement[]> {
    // Get all announcements first, then filter/sort in memory
    // This avoids complex index requirements
    const snapshot = await getDocs(collection(db, 'announcements'));

    let announcements = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        publishedAt: data.publishedAt?.toDate() || data.createdAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate(),
      } as Announcement;
    });

    // Apply filters in memory
    if (filters?.status) {
      announcements = announcements.filter((a) => a.status === filters.status);
    }
    if (filters?.recipients) {
      announcements = announcements.filter((a) => a.recipients === filters.recipients);
    }

    // Filter out hidden announcements unless showing hidden
    if (!filters?.showHidden && typeof filters?.userId === 'string') {
      const userId = filters.userId;
      announcements = announcements.filter((a) => !(a.hiddenBy?.includes(userId) ?? false));
    }

    // Sort by publishedAt descending
    announcements.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });

    // Apply limit if specified
    if (filters?.limitCount) {
      announcements = announcements.slice(0, filters.limitCount);
    }

    return announcements;
  },

  async create(data: Omit<Announcement, 'id' | 'createdAt' | 'publishedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'announcements'), {
      ...data,
      createdAt: serverTimestamp(),
      publishedAt: data.status === 'published' ? serverTimestamp() : null,
    });
    return docRef.id;
  },

  async markAsRead(announcementId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'announcements', announcementId);
    await updateDoc(docRef, {
      acknowledgedBy: arrayUnion(userId),
      viewCount: increment(1),
    });
  },

  async update(id: string, data: Partial<Announcement>): Promise<void> {
    const docRef = doc(db, 'announcements', id);
    const updateData: UpdateData<DocumentData> = { ...data };

    if (data.status === 'published' && !data.publishedAt) {
      updateData.publishedAt = serverTimestamp();
    }

    await updateDoc(docRef, updateData);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'announcements', id));
  },

  async hide(announcementId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'announcements', announcementId);
    await updateDoc(docRef, {
      hiddenBy: arrayUnion(userId),
    });
  },

  async unhide(announcementId: string, userId: string): Promise<void> {
    const docRef = doc(db, 'announcements', announcementId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const hiddenBy = docSnap.data().hiddenBy || [];
      await updateDoc(docRef, {
        hiddenBy: hiddenBy.filter((id: string) => id !== userId),
      });
    }
  },
};

// User Profile Service
export const profileService = {
  async get(userId: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as UserProfile;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async create(
    userId: string,
    data: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    await setDoc(doc(db, 'profiles', userId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async update(
    userId: string,
    data: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    await updateDoc(doc(db, 'profiles', userId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    // This is a placeholder - in production, you'd upload to Firebase Storage
    // For now, we'll return a placeholder URL
    console.log('Avatar upload for user:', userId, 'file:', file.name);
    // In production:
    // 1. Upload to Firebase Storage
    // 2. Get download URL
    // 3. Update profile with avatarUrl
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;
  },

  async getAll(): Promise<Profile[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          userId: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Profile;
      });
    } catch (error) {
      console.error('Error getting all profiles:', error);
      return [];
    }
  },

  async delete(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'profiles', userId));
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  async createOrUpdate(
    userId: string,
    data: Partial<Omit<Profile, 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    const docRef = doc(db, 'profiles', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create new profile
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  },
};

// Calendar Event Service
export const calendarService = {
  async getEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const q = collection(db, 'events');

    // Note: For simplicity, we'll fetch all events and filter in memory
    // In production, you'd want to use proper date range queries
    const snapshot = await getDocs(q);

    let events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate() || new Date(),
        endDate: data.endDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as CalendarEvent;
    });

    // Filter by date range if provided
    if (startDate && endDate) {
      events = events.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);
        return eventEnd >= startDate && eventStart <= endDate;
      });
    }

    // Sort by start date
    return events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  },

  async getEvent(id: string): Promise<CalendarEvent | null> {
    const docRef = doc(db, 'events', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as CalendarEvent;
  },

  async create(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      startDate: Timestamp.fromDate(new Date(event.startDate)),
      endDate: Timestamp.fromDate(new Date(event.endDate)),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await activityService.log({
      action: 'event.created',
      resourceType: 'event',
      resourceId: docRef.id,
      details: { title: event.title },
      userId: event.createdBy,
      userName: event.createdByName,
    });

    return docRef.id;
  },

  async update(
    id: string,
    updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt'>>
  ): Promise<void> {
    const updateData: UpdateData<DocumentData> = {
      ...updates,
      updatedAt: serverTimestamp(),
    };

    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(updates.startDate));
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(new Date(updates.endDate));
    }

    await updateDoc(doc(db, 'events', id), updateData);
  },

  async delete(id: string, userId: string, userName: string): Promise<void> {
    const event = await this.getEvent(id);
    if (!event) return;

    await deleteDoc(doc(db, 'events', id));

    await activityService.log({
      action: 'event.deleted',
      resourceType: 'event',
      resourceId: id,
      details: { title: event.title },
      userId,
      userName,
    });
  },
};

// Minimal activity logger to avoid runtime/type errors when logging events
export const activityService = {
  async log(entry: {
    action: string;
    resourceType: string;
    resourceId: string;
    details?: Record<string, unknown>;
    userId?: string;
    userName?: string;
  }): Promise<void> {
    // No-op or replace with real logging integration
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(
        '[activity]',
        entry.action,
        entry.resourceType,
        entry.resourceId,
        entry.details
      );
    }
  },
};
