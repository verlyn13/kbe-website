'use client';

import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';

export default function DebugAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllAnnouncements();
  }, [loadAllAnnouncements]);

  async function loadAllAnnouncements() {
    try {
      // Get ALL announcements without any filters
      const snapshot = await getDocs(collection(db, 'announcements'));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        _raw: JSON.stringify(doc.data(), null, 2),
      }));
      setAnnouncements(data);
      console.log('All announcements:', data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-4 text-2xl font-bold">Debug: All Announcements ({announcements.length})</h1>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader>
              <CardTitle>ID: {announcement.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded bg-gray-100 p-4 text-xs">
                {announcement._raw}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
