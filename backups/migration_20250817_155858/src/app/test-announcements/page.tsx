'use client';

import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { announcementService } from '@/lib/firebase-admin';

export default function TestAnnouncementsPage() {
  const [results, setResults] = useState<any>({});

  useEffect(() => {
    runTests();
  }, []);

  async function runTests() {
    const testResults: any = {};

    // Test 1: Get all documents (no filters)
    try {
      const snapshot = await getDocs(collection(db, 'announcements'));
      testResults.allDocs = {
        success: true,
        count: snapshot.size,
        docs: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    } catch (error: any) {
      testResults.allDocs = { success: false, error: error.message };
    }

    // Test 2: Simple status filter
    try {
      const q = query(collection(db, 'announcements'), where('status', '==', 'published'));
      const snapshot = await getDocs(q);
      testResults.statusFilter = {
        success: true,
        count: snapshot.size,
        docs: snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
      };
    } catch (error: any) {
      testResults.statusFilter = { success: false, error: error.message };
    }

    // Test 3: Status filter with orderBy createdAt
    try {
      const q = query(
        collection(db, 'announcements'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      testResults.statusWithCreatedAt = {
        success: true,
        count: snapshot.size,
      };
    } catch (error: any) {
      testResults.statusWithCreatedAt = { success: false, error: error.message };
    }

    // Test 4: Status filter with orderBy publishedAt
    try {
      const q = query(
        collection(db, 'announcements'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      testResults.statusWithPublishedAt = {
        success: true,
        count: snapshot.size,
      };
    } catch (error: any) {
      testResults.statusWithPublishedAt = { success: false, error: error.message };
    }

    // Test 5: Using announcementService
    try {
      const announcements = await announcementService.getAll({
        status: 'published',
      });
      testResults.viaService = {
        success: true,
        count: announcements.length,
        data: announcements,
      };
    } catch (error: any) {
      testResults.viaService = { success: false, error: error.message };
    }

    // Test 6: Using announcementService without filters
    try {
      const announcements = await announcementService.getAll();
      testResults.viaServiceNoFilter = {
        success: true,
        count: announcements.length,
      };
    } catch (error: any) {
      testResults.viaServiceNoFilter = { success: false, error: error.message };
    }

    setResults(testResults);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Announcement Query Tests</h1>
      <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs">
        {JSON.stringify(results, null, 2)}
      </pre>
    </div>
  );
}
