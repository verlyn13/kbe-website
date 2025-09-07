'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { AlertCircle, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { formatPhoneNumber } from '@/lib/utils';

interface StudentData {
  id: string;
  name: string;
  dateOfBirth: string;
  grade: string;
  school: string | null;
  medicalNotes: string | null;
  userId: string;
}

export default function EditStudentPage() {
  const params = useParams();
  const studentId = params.id as string;
  const nameId = useId();
  const gradeId = useId();
  const schoolId = useId();
  const dateOfBirthId = useId();
  const medicalNotesId = useId();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    grade: '',
    school: '',
    dateOfBirth: '',
    medicalNotes: '',
  });

  const schools = [
    'Homer Middle School',
    'Paul Banks Elementary',
    'West Homer Elementary',
    'McNeil Canyon Elementary',
    'Chapman School',
    'Fireweed Academy',
    'Homeschool',
    'Other',
  ];

  useEffect(() => {
    async function fetchStudent() {
      if (!user || !studentId) {
        setFetching(false);
        return;
      }

      try {
        const response = await fetch(`/api/students/${studentId}`);
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: 'Student not found',
              description: 'This student does not exist or you do not have access.',
              variant: 'destructive',
            });
            router.push('/dashboard');
            return;
          }
          throw new Error('Failed to fetch student');
        }

        const data = await response.json();
        setStudent(data);
        
        // Parse the date for the input
        const date = new Date(data.dateOfBirth);
        const formattedDate = date.toISOString().split('T')[0];
        
        setFormData({
          name: data.name || '',
          grade: data.grade || '',
          school: data.school || '',
          dateOfBirth: formattedDate,
          medicalNotes: data.medicalNotes || '',
        });
      } catch (error) {
        console.error('Error fetching student:', error);
        toast({
          title: 'Error loading student',
          description: 'Please try again or contact support.',
          variant: 'destructive',
        });
      } finally {
        setFetching(false);
      }
    }

    fetchStudent();
  }, [user, studentId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !student) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to update student information.',
        variant: 'destructive',
      });
      return;
    }

    // Validate required fields
    if (!formData.name || !formData.grade || !formData.school || !formData.dateOfBirth) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Update student via API
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          grade: formData.grade,
          school: formData.school,
          dateOfBirth: formData.dateOfBirth,
          medicalNotes: formData.medicalNotes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      // Notify admin of the change
      await fetch('/api/admin/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'student_updated',
          studentId: studentId,
          studentName: formData.name,
          changes: {
            name: student.name !== formData.name ? { from: student.name, to: formData.name } : null,
            grade: student.grade !== formData.grade ? { from: student.grade, to: formData.grade } : null,
            school: student.school !== formData.school ? { from: student.school, to: formData.school } : null,
            dateOfBirth: student.dateOfBirth !== formData.dateOfBirth ? { from: student.dateOfBirth, to: formData.dateOfBirth } : null,
            medicalNotes: student.medicalNotes !== formData.medicalNotes ? { from: student.medicalNotes, to: formData.medicalNotes } : null,
          },
          updatedBy: user.email,
        }),
      }).catch(console.error); // Don't fail if notification fails

      toast({
        title: 'Student updated successfully!',
        description: `${formData.name}'s information has been updated.`,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'Error updating student',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading student information...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!student) {
    return null; // Will have redirected already
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Student Information
          </CardTitle>
          <CardDescription>
            Update your child's information. Any changes will be sent to the program administrator.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Student Information</h3>

              <div className="space-y-2">
                <Label htmlFor={nameId}>
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={nameId}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={gradeId}>
                    Grade Level <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) => setFormData({ ...formData, grade: value })}
                    disabled={loading}
                  >
                    <SelectTrigger id={gradeId}>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5th Grade</SelectItem>
                      <SelectItem value="6">6th Grade</SelectItem>
                      <SelectItem value="7">7th Grade</SelectItem>
                      <SelectItem value="8">8th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={schoolId}>
                    School <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.school}
                    onValueChange={(value) => setFormData({ ...formData, school: value })}
                    disabled={loading}
                  >
                    <SelectTrigger id={schoolId}>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={dateOfBirthId}>
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={dateOfBirthId}
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={medicalNotesId}>Medical Notes / Allergies (Optional)</Label>
                <Input
                  id={medicalNotesId}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  placeholder="Any allergies, medications, or medical conditions we should know about"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Admin Notification Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Any changes you make will be automatically sent to the program
                administrator for review.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Updating Student...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" asChild disabled={loading}>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}