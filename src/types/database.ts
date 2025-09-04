/**
 * Database types for Supabase integration
 * Generated from Prisma schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      User: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          role: 'ADMIN' | 'GUARDIAN' | 'INSTRUCTOR';
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          role?: 'ADMIN' | 'GUARDIAN' | 'INSTRUCTOR';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          role?: 'ADMIN' | 'GUARDIAN' | 'INSTRUCTOR';
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Student: {
        Row: {
          id: string;
          userId: string;
          name: string;
          dateOfBirth: string;
          grade: string;
          school: string | null;
          medicalNotes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          name: string;
          dateOfBirth: string;
          grade: string;
          school?: string | null;
          medicalNotes?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          name?: string;
          dateOfBirth?: string;
          grade?: string;
          school?: string | null;
          medicalNotes?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Program: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          startDate: string;
          endDate: string;
          schedule: Json;
          capacity: number;
          price: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: string;
          startDate: string;
          endDate: string;
          schedule: Json;
          capacity: number;
          price: number;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          category?: string;
          startDate?: string;
          endDate?: string;
          schedule?: Json;
          capacity?: number;
          price?: number;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Registration: {
        Row: {
          id: string;
          userId: string;
          studentId: string;
          programId: string;
          status: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
          paymentStatus: string;
          notes: string | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          studentId: string;
          programId: string;
          status?: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
          paymentStatus?: string;
          notes?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          studentId?: string;
          programId?: string;
          status?: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
          paymentStatus?: string;
          notes?: string | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      Waiver: {
        Row: {
          id: string;
          userId: string;
          studentId: string;
          documentUrl: string | null;
          signedAt: string | null;
          expiresAt: string;
          createdAt: string;
        };
        Insert: {
          id?: string;
          userId: string;
          studentId: string;
          documentUrl?: string | null;
          signedAt?: string | null;
          expiresAt: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          studentId?: string;
          documentUrl?: string | null;
          signedAt?: string | null;
          expiresAt?: string;
          createdAt?: string;
        };
      };
      Announcement: {
        Row: {
          id: string;
          title: string;
          content: string;
          priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
          status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          publishedAt: string;
          expiresAt: string | null;
          createdAt: string;
          updatedAt: string;
          pinned: boolean;
          recipients: string | null;
          createdByName: string | null;
          viewCount: number;
          acknowledgedBy: string[];
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          publishedAt?: string;
          expiresAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
          pinned?: boolean;
          recipients?: string | null;
          createdByName?: string | null;
          viewCount?: number;
          acknowledgedBy?: string[];
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
          status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
          publishedAt?: string;
          expiresAt?: string | null;
          createdAt?: string;
          updatedAt?: string;
          pinned?: boolean;
          recipients?: string | null;
          createdByName?: string | null;
          viewCount?: number;
          acknowledgedBy?: string[];
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      Role: 'ADMIN' | 'GUARDIAN' | 'INSTRUCTOR';
      RegistrationStatus: 'PENDING' | 'CONFIRMED' | 'WAITLIST' | 'CANCELLED';
      Priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
      AnnouncementStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    };
  };
}
