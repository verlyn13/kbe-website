'use client';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { CheckCircle } from 'lucide-react';
import { Suspense, useState } from 'react';
import {
  LazyAddStudentsForm,
  LazyParentAccountForm,
  LazySelectProgramForm,
} from '@/components/lazy';
import { FormSkeleton } from '@/components/loading/form-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';

type RegistrationStep = 'parent' | 'students' | 'program' | 'complete';

interface RegistrationData {
  parent?: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    zipCode: string;
  };
  students?: Array<{
    firstName: string;
    lastName: string;
    grade: string;
    school: string;
    allergies?: string;
  }>;
  program?: {
    programId: string;
  };
}

export function RegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('parent');
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const { toast } = useToast();

  const getProgress = () => {
    switch (currentStep) {
      case 'parent':
        return 33;
      case 'students':
        return 66;
      case 'program':
        return 100;
      case 'complete':
        return 100;
      default:
        return 0;
    }
  };

  const handleParentSubmit = (data: NonNullable<RegistrationData['parent']>) => {
    setRegistrationData({ ...registrationData, parent: data });
    setCurrentStep('students');
  };

  const handleStudentsSubmit = (data: { students: NonNullable<RegistrationData['students']> }) => {
    setRegistrationData({ ...registrationData, students: data.students });
    setCurrentStep('program');
  };

  const handleProgramSubmit = async (data: { programId: string }) => {
    try {
      const completeData = { ...registrationData, program: data };
      setRegistrationData(completeData);

      // Create parent account
      const { parent, students } = completeData;
      if (!parent || !students) {
        throw new Error('Missing registration data');
      }

      // Create auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        parent.email,
        parent.password
      );

      // Save parent profile
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: parent.fullName,
        email: parent.email,
        phone: parent.phone,
        zipCode: parent.zipCode,
        role: 'parent',
        createdAt: new Date(),
      });

      // Create registration record
      const registrationRecord = {
        parentId: userCredential.user.uid,
        parentName: parent.fullName,
        parentEmail: parent.email,
        parentPhone: parent.phone,
        students: students,
        programId: data.programId,
        status: 'pending',
        paymentStatus: 'pending',
        registrationDate: new Date(),
      };

      await setDoc(doc(db, 'registrations', userCredential.user.uid), registrationRecord);

      setCurrentStep('complete');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to complete registration';
      toast({
        title: 'Registration Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const getStudentNames = () => {
    if (!registrationData.students) return [];
    return registrationData.students.map((s) => `${s.firstName} ${s.lastName}`);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">MathCounts Registration</h1>
        <p className="text-muted-foreground">
          Complete the steps below to register for the 2025 MathCounts season
        </p>
      </div>

      {currentStep !== 'complete' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Step {currentStep === 'parent' ? 1 : currentStep === 'students' ? 2 : 3} of 3
            </span>
            <span>{getProgress()}% Complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      )}

      {currentStep === 'parent' && (
        <Suspense fallback={<FormSkeleton fields={5} />}>
          <LazyParentAccountForm onSubmit={handleParentSubmit} />
        </Suspense>
      )}

      {currentStep === 'students' && (
        <Suspense fallback={<FormSkeleton fields={4} />}>
          <LazyAddStudentsForm
            onSubmit={handleStudentsSubmit}
            onBack={() => setCurrentStep('parent')}
          />
        </Suspense>
      )}

      {currentStep === 'program' && (
        <Suspense fallback={<FormSkeleton fields={3} />}>
          <LazySelectProgramForm
            onSubmit={handleProgramSubmit}
            onBack={() => setCurrentStep('students')}
            studentNames={getStudentNames()}
          />
        </Suspense>
      )}

      {currentStep === 'complete' && (
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h2 className="mb-2 text-2xl font-bold">Registration Complete!</h2>
            <p className="text-muted-foreground mx-auto mb-6 max-w-md">
              Thank you for registering for MathCounts 2025. You'll receive a confirmation email
              shortly with next steps.
            </p>
            <div className="bg-muted mx-auto mb-6 max-w-sm rounded-lg p-4">
              <p className="mb-1 font-medium">First Meeting</p>
              <p className="text-muted-foreground text-sm">
                Tuesday, September 9, 2025
                <br />
                4:00-5:30pm at Homer Middle School
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="/parent-portal">Go to Parent Portal</a>
              </Button>
              <Button asChild>
                <a href="/programs/mathcounts">View Program Details</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
