'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, FileX, AlertCircle, Download } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

interface StudentWaiver {
  id: string;
  studentName: string;
  waiverStatus: 'pending' | 'received' | 'expired';
  waiverDate?: Date;
  expiresDate?: Date;
}

export function WaiverStatusWidget() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentWaiver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const studentsRef = collection(db, 'students');
    const q = query(studentsRef, where('guardianId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData: StudentWaiver[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        studentData.push({
          id: doc.id,
          studentName: data.displayName || 'Unnamed Student',
          waiverStatus: data.waiverStatus || 'pending',
          waiverDate: data.waiverDate?.toDate(),
          expiresDate: data.waiverExpiresDate?.toDate(),
        });
      });
      setStudents(studentData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const pendingWaivers = students.filter((s) => s.waiverStatus === 'pending');
  const hasExpiredWaivers = students.some((s) => s.waiverStatus === 'expired');
  const allWaiversReceived =
    students.length > 0 && students.every((s) => s.waiverStatus === 'received');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waiver Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="bg-muted h-4 w-3/4 rounded"></div>
            <div className="bg-muted h-4 w-1/2 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allWaiversReceived ? (
            <FileCheck className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          )}
          Waiver Status
        </CardTitle>
        <CardDescription>Required liability waivers for your registered children</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.length === 0 ? (
          <Alert>
            <AlertDescription>
              No students registered yet. Add students to see waiver requirements.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {pendingWaivers.length > 0 && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <strong>Action Required:</strong> {pendingWaivers.length} waiver
                  {pendingWaivers.length > 1 ? 's' : ''} needed
                </AlertDescription>
              </Alert>
            )}

            {hasExpiredWaivers && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Expired Waivers:</strong> Some waivers have expired and need renewal
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{student.studentName}</p>
                    {student.waiverStatus === 'received' && student.expiresDate && (
                      <p className="text-muted-foreground text-xs">
                        Expires: {student.expiresDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {student.waiverStatus === 'pending' && (
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-amber-700"
                      >
                        <FileX className="mr-1 h-3 w-3" />
                        Waiver Needed
                      </Badge>
                    )}
                    {student.waiverStatus === 'received' && (
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        <FileCheck className="mr-1 h-3 w-3" />
                        Waiver Received
                      </Badge>
                    )}
                    {student.waiverStatus === 'expired' && (
                      <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                        <FileX className="mr-1 h-3 w-3" />
                        Expired
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {(pendingWaivers.length > 0 || hasExpiredWaivers) && (
              <div className="space-y-2 pt-2">
                <Button asChild className="w-full">
                  <Link href="/waiver" target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download Waiver Form
                  </Link>
                </Button>
                <p className="text-muted-foreground text-center text-xs">
                  Print, sign, and return to program coordinators
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
