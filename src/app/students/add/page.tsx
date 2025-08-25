'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { AlertCircle, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { formatPhoneNumber } from '@/lib/utils';

interface StudentFormData {
  firstName: string;
  lastName: string;
  grade: string;
  school: string;
  dateOfBirth: string;
  medicalNotes: string;
  emergencyContact: string;
  emergencyPhone: string;
  registerForMathCounts: boolean;
}

export default function AddStudentPage() {
  const firstNameId = useId();
  const lastNameId = useId();
  const gradeId = useId();
  const schoolId = useId();
  const dateOfBirthId = useId();
  const emergencyContactId = useId();
  const emergencyPhoneId = useId();
  const medicalNotesId = useId();
  const mathcountsId = useId();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    grade: '',
    school: '',
    dateOfBirth: '',
    medicalNotes: '',
    emergencyContact: '',
    emergencyPhone: '',
    registerForMathCounts: true, // Default to true since this is why they're here
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to add a student.',
        variant: 'destructive',
      });
      return;
    }

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.grade ||
      !formData.school ||
      !formData.dateOfBirth
    ) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Add student to Firestore
      const studentData = {
        guardianId: user.uid,
        displayName: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        grade: parseInt(formData.grade, 10),
        school: formData.school,
        dateOfBirth: formData.dateOfBirth,
        medicalNotes: formData.medicalNotes,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone.replace(/\D/g, ''), // Store as numbers only
        waiverStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'students'), studentData);

      // If registering for MathCounts, add program registration
      if (formData.registerForMathCounts) {
        await addDoc(collection(db, 'registrations'), {
          studentId: docRef.id,
          guardianId: user.uid,
          programId: 'mathcounts-2025',
          programName: 'MathCounts 2025',
          status: 'registered',
          registeredAt: serverTimestamp(),
          notes: 'Initial registration',
        });
      }

      toast({
        title: 'Student added successfully!',
        description: formData.registerForMathCounts
          ? `${formData.firstName} has been registered for MathCounts 2025.`
          : `${formData.firstName} has been added to your account.`,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: 'Error adding student',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
            Add Your Child
          </CardTitle>
          <CardDescription>
            Register your child for MathCounts 2025 and other enrichment programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* MathCounts Registration Alert */}
            <Alert className="border-primary bg-primary/10">
              <AlertCircle className="text-primary h-4 w-4" />
              <AlertDescription>
                <strong>MathCounts 2025 Registration is Open!</strong>
                <br />
                By adding your child, you can immediately register them for MathCounts 2025. The
                program runs Tuesdays at 4:00 PM starting in January.
              </AlertDescription>
            </Alert>

            {/* Student Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Student Information</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={firstNameId}>
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={firstNameId}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={lastNameId}>
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={lastNameId}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                    disabled={loading}
                  />
                </div>
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
            </div>

            {/* Emergency Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Information</h3>
              <p className="text-muted-foreground text-sm">
                This can be the same as your contact information or someone else we should contact
                in an emergency.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={emergencyContactId}>Emergency Contact Name</Label>
                  <Input
                    id={emergencyContactId}
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    placeholder="Jane Doe"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={emergencyPhoneId}>Emergency Phone</Label>
                  <Input
                    id={emergencyPhoneId}
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setFormData({ ...formData, emergencyPhone: formatted });
                    }}
                    placeholder="(907) 555-1234"
                    disabled={loading}
                  />
                </div>
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

            {/* Program Registration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Program Registration</h3>

              <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={mathcountsId}
                    checked={formData.registerForMathCounts}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, registerForMathCounts: checked as boolean })
                    }
                    disabled={loading}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={mathcountsId}
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Register for MathCounts 2025
                    </label>
                    <p className="text-muted-foreground text-sm">
                      Tuesdays at 4:00 PM • Grades 5-8 • Starts January 2025
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                More programs coming soon! You can add additional programs later from your
                dashboard.
              </p>
            </div>

            {/* Waiver Reminder */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> A signed liability waiver is required before your child
                can participate in any programs. You'll be able to download and print the waiver
                form after adding your child.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Adding Student...' : 'Add Student & Continue'}
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
