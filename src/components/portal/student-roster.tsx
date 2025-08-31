'use client';

import { Plus, Trash2, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch students via API
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('Failed to fetch students');

        const studentsData = await response.json();
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

  async function handleDeleteStudent() {
    if (!studentToDelete || !user) return;

    try {
      // Delete the student via API
      const response = await fetch(`/api/students/${studentToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete student');

      // Update local state
      setStudents(students.filter((s) => s.id !== studentToDelete.id));

      toast({
        title: 'Student removed',
        description: `${studentToDelete.displayName} has been removed from your account.`,
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error removing student',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  }

  return (
    <>
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
            <div className="py-8 text-center">
              <p className="text-muted-foreground text-sm">Loading students...</p>
            </div>
          ) : !hasStudents ? (
            <div className="py-8 text-center">
              <div className="bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                <User className="text-muted-foreground h-6 w-6" />
              </div>
              <h3 className="mb-1 text-lg font-medium">No students registered yet</h3>
              <p className="text-muted-foreground mb-4 text-sm">
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
              <div
                key={student.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                    <User className="text-primary h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{student.displayName}</p>
                    <p className="text-muted-foreground truncate text-sm">
                      Grade {student.grade} • {student.school}
                    </p>
                  </div>
                </div>
                <div className="ml-13 flex items-center gap-2 sm:ml-0">
                  <div className="flex flex-col gap-1 sm:items-end">
                    {student.enrolledPrograms.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        {student.enrolledPrograms.map((program) => (
                          <Badge
                            key={program.id}
                            variant="secondary"
                            className="text-xs sm:text-sm"
                          >
                            {program.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs sm:text-sm">No programs</span>
                    )}
                    {student.waiverStatus === 'pending' && (
                      <Badge variant="outline" className="text-xs">
                        Waiver Pending
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setStudentToDelete(student);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{studentToDelete?.displayName}</strong> from
              your account? This will also remove them from all enrolled programs. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
