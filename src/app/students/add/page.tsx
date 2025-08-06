'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddStudentPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a Student</CardTitle>
          <CardDescription>
            Register your children for enrichment programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Student registration will be available soon!
            </p>
            <p className="text-sm text-muted-foreground">
              We're working on setting up the registration system for MathCounts and other programs.
              Check back soon or contact us for more information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}