'use client';

import { useState } from 'react';
import { ParentAccountForm } from './parent-account';
import { AddStudentsForm } from './add-students';
import { SelectProgramForm } from './select-program';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

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

  const handleParentSubmit = (data: any) => {
    setRegistrationData({ ...registrationData, parent: data });
    setCurrentStep('students');
  };

  const handleStudentsSubmit = (data: any) => {
    setRegistrationData({ ...registrationData, students: data.students });
    setCurrentStep('program');
  };

  const handleProgramSubmit = async (data: any) => {
    
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
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Error',
        description: error.message || 'Failed to complete registration',
        variant: 'destructive',
      });
    }
  };

  const getStudentNames = () => {
    if (!registrationData.students) return [];
    return registrationData.students.map(s => `${s.firstName} ${s.lastName}`);
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
            <span>Step {currentStep === 'parent' ? 1 : currentStep === 'students' ? 2 : 3} of 3</span>
            <span>{getProgress()}% Complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>
      )}

      {currentStep === 'parent' && (
        <ParentAccountForm onSubmit={handleParentSubmit} />
      )}

      {currentStep === 'students' && (
        <AddStudentsForm
          onSubmit={handleStudentsSubmit}
          onBack={() => setCurrentStep('parent')}
        />
      )}

      {currentStep === 'program' && (
        <SelectProgramForm
          onSubmit={handleProgramSubmit}
          onBack={() => setCurrentStep('students')}
          studentNames={getStudentNames()}
        />
      )}

      {currentStep === 'complete' && (
        <Card className="text-center">
          <CardContent className="pt-12 pb-12">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h2 className="mb-2 text-2xl font-bold">Registration Complete!</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Thank you for registering for MathCounts 2025. You'll receive a confirmation
              email shortly with next steps.
            </p>
            <div className="rounded-lg bg-muted p-4 mb-6 max-w-sm mx-auto">
              <p className="font-medium mb-1">First Meeting</p>
              <p className="text-sm text-muted-foreground">
                Tuesday, September 9, 2025<br />
                4:00-5:30pm at Homer Middle School
              </p>
            </div>
            <div className="flex gap-4 justify-center">
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