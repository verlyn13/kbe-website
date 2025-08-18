'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, UserPlus, Calendar, Mail, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function WelcomeGuide() {
  const { user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFirstVisit() {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        // Show guide if user hasn't dismissed it and has no students registered
        if (!userData?.hasSeenWelcomeGuide) {
          setShowGuide(true);
        }
      } catch (error) {
        console.error('Error checking welcome guide status:', error);
      } finally {
        setLoading(false);
      }
    }

    checkFirstVisit();
  }, [user]);

  async function dismissGuide() {
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        hasSeenWelcomeGuide: true,
      });
      setShowGuide(false);
    } catch (error) {
      console.error('Error dismissing guide:', error);
    }
  }

  if (loading || !showGuide) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">Welcome to Homer Enrichment Hub! 🎉</CardTitle>
            <CardDescription className="mt-1">
              Let's get you started with registering your children for programs
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={dismissGuide}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/students/add">
            <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <UserPlus className="text-primary h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">1. Add Your Children</h3>
                  <p className="text-muted-foreground text-sm">
                    Start by adding your children to your account
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/programs">
            <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <BookOpen className="text-primary h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">2. Browse Programs</h3>
                  <p className="text-muted-foreground text-sm">
                    Explore MathCounts and upcoming programs
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/calendar">
            <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Calendar className="text-primary h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">3. Check Schedule</h3>
                  <p className="text-muted-foreground text-sm">
                    View program schedules and important dates
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/profile">
            <div className="group bg-card hover:bg-accent cursor-pointer rounded-lg border p-4 transition-colors">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Mail className="text-primary h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium">4. Email Settings</h3>
                  <p className="text-muted-foreground text-sm">
                    Manage your notification preferences
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <Alert>
          <AlertDescription>
            <strong>MathCounts registration is now open!</strong> Add your children and enroll them
            in the program to secure their spot.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between pt-2">
          <p className="text-muted-foreground text-sm">
            Need help? Contact us at{' '}
            <a href="mailto:info@homerenrichment.com" className="text-primary hover:underline">
              info@homerenrichment.com
            </a>
          </p>
          <Button variant="outline" size="sm" onClick={dismissGuide}>
            Got it!
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
