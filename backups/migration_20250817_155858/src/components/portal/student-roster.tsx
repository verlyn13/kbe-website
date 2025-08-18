'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, User } from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

interface Student {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  grade: number;
  school: string;
  waiverStatus: string;
  enrolledPrograms: { id: string; name: string }[];
}

export function StudentRoster() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch students for this guardian
        const studentsQuery = query(
          collection(db, 'students'),
          where('guardianId', '==', user.uid)
        );
        const studentsSnapshot = await getDocs(studentsQuery);
        
        console.log('Found students:', studentsSnapshot.size);
        
        const studentsData: Student[] = [];
        
        for (const doc of studentsSnapshot.docs) {
          const studentData = doc.data();
          
          // Fetch registrations for this student
          const registrationsQuery = query(
            collection(db, 'registrations'),
            where('studentId', '==', doc.id),
            where('status', '==', 'registered')
          );
          const registrationsSnapshot = await getDocs(registrationsQuery);
          
          const enrolledPrograms = registrationsSnapshot.docs.map(regDoc => ({
            id: regDoc.data().programId,
            name: regDoc.data().programName
          }));
          
          studentsData.push({
            id: doc.id,
            displayName: studentData.displayName,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            grade: studentData.grade,
            school: studentData.school,
            waiverStatus: studentData.waiverStatus || 'pending',
            enrolledPrograms
          });
        }
        
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [user]);

  const hasStudents = students.length > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Your Students</CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link href="/students/add">
            <Plus className="mr-1 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Loading students...</p>
          </div>
        ) : !hasStudents ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg mb-1">No students registered yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add your children to get started with program registration
            </p>
            <Button size="sm" asChild>
              <Link href="/students/add">
                <Plus className="mr-1 h-4 w-4" />
                Add Your First Student
              </Link>
            </Button>
          </div>
        ) : (
          students.map((student) => (
          <div key={student.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 sm:p-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{student.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  Grade {student.grade} • {student.school}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-col sm:items-end gap-1 ml-13 sm:ml-0">
              {student.enrolledPrograms.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                  {student.enrolledPrograms.map((program) => (
                    <Badge key={program.id} variant="secondary" className="text-xs sm:text-sm">
                      {program.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-xs sm:text-sm text-muted-foreground">No programs</span>
              )}
              {student.waiverStatus === 'pending' && (
                <Badge variant="outline" className="text-xs">
                  Waiver Pending
                </Badge>
              )}
            </div>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}