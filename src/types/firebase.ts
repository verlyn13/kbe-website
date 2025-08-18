// Firebase Data Types - Replace 'any' types throughout codebase

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt?: Date;
  lastLoginAt?: Date;
}

export interface FirestoreDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends FirestoreDocument {
  userId: string;
  email: string;
  role: 'admin' | 'parent' | 'student' | 'teacher';
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
}

export interface Program extends FirestoreDocument {
  name: string;
  description: string;
  ageRange: string;
  duration: string;
  price: number;
  capacity: number;
  enrolled: number;
  status: 'active' | 'inactive' | 'full';
}

export interface Student extends FirestoreDocument {
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  grade?: string;
  allergies?: string;
  medicalNotes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Registration extends FirestoreDocument {
  studentId: string;
  programId: string;
  parentId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'card' | 'check' | 'cash';
  paymentDate?: Date;
  notes?: string;
}

// Error types
export type FirebaseErrorCode =
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/invalid-email'
  | 'permission-denied'
  | 'not-found'
  | 'already-exists';

export interface FirebaseError extends Error {
  code: FirebaseErrorCode;
  message: string;
}
