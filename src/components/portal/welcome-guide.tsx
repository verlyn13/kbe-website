'use client';

import { BookOpen, Calendar, Mail, UserPlus, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth as useAuth } from '@/hooks/use-supabase-auth';

export function WelcomeGuide() {
  const { user } = useAuth();
  const [showGuide, setShowGuide] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkFirstVisit() {
      if (!user) return;

      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const profileData = await response.json();
          // Show guide if user hasn't dismissed it and has no students registered
          if (!profileData?.hasSeenWelcomeGuide) {
            setShowGuide(true);
          }
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
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hasSeenWelcomeGuide: true }),
      });

      if (response.ok) {
        setShowGuide(false);
      }
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
              Your profile is complete! Here's what to do next to get your children enrolled in
              programs.
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
            <strong>MathCounts 2025 registration is now open!</strong> Complete steps 1 and 2 above
            to secure your child's spot for this year's competition season.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between pt-2">
          <p className="text-muted-foreground text-sm">
            Need help? Contact Jeffrey at{' '}
            <a
              href="mailto:jeffreyverlynjohnson@gmail.com"
              className="text-primary hover:underline"
            >
              jeffreyverlynjohnson@gmail.com
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
