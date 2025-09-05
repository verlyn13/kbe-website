'use client';

import { Calendar, GraduationCap, Heart, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';


export default function LandingPage() {
  const { user, loading } = useSupabaseAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Don't redirect if user is loading or not authenticated
    if (!user || loading) return;

    // Check if user has completed their profile
    const checkProfileAndRedirect = async () => {
      try {
        const res = await fetch('/api/profile-status', { cache: 'no-store' });
        if (!res.ok) throw new Error('Profile status fetch failed');
        const data = (await res.json()) as { complete: boolean };
        router.push(data.complete ? '/dashboard' : '/welcome');
      } catch (error) {
        console.error('Error checking profile:', error);
        // On error, default to dashboard
        router.push('/dashboard');
      }
    };

    checkProfileAndRedirect();
  }, [user, loading, router]);

  return (
    <main className="bg-background relative min-h-screen overflow-hidden">
      <ThemeBackgroundImage />

      {/* Navigation Header */}
      <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 relative z-10 border-b backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="from-primary to-accent h-1 w-8 rounded-full bg-gradient-to-r sm:w-12" />
              <h1 className="from-primary to-accent bg-gradient-to-r bg-clip-text text-lg font-bold text-transparent sm:text-xl">
                Homer Enrichment Hub
              </h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden items-center gap-4 sm:flex">
              <Button variant="ghost" asChild className="text-sm">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="mt-4 space-y-2 border-t pt-4 pb-2 sm:hidden">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="from-primary to-accent mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Enrichment Programs for Your Child, Made Easy
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl mb-8">
              Discover, book, and manage after-school activities, sports, and camps in one simple place.
            </p>
            
            {/* Single Primary CTA */}
            <div className="flex justify-center">
              <Button asChild size="lg" className="h-16 px-12 text-lg font-semibold">
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mb-16 grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <GraduationCap className="text-primary mb-2 h-8 w-8" />
                <CardTitle>MathCounts 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join Alaska's premier mathematics competition for middle school students. Build
                  problem-solving skills through fun, challenging math problems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Calendar className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Weekly Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every Tuesday at 4:00 PM during the school year. Practice sessions, team building,
                  and preparation for competitions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Users className="text-primary mb-2 h-8 w-8" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Run by dedicated volunteers and educators passionate about enriching our students'
                  educational experiences.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Another Site Section */}
          <Card className="border-accent/20 bg-card/50 mx-auto mb-16 max-w-4xl backdrop-blur">
            <CardHeader>
              <Heart className="text-accent mb-2 h-8 w-8" />
              <CardTitle className="text-2xl">Why yet another site to sign into?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Recent funding cuts have left our school district without adequate resources for
                enrichment programs like MathCounts. This has created a need for managing these
                opportunities outside the traditional school system.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Homer Enrichment Hub was created to fill this gap, providing a centralized place
                for families to discover and register for educational opportunities that our
                community values but can no longer be fully supported through school funding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By creating this independent platform, we can continue offering these vital programs
                while reducing the administrative burden on our already stretched school resources.
              </p>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="border-primary/20 bg-card/50 mx-auto max-w-4xl backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">About Homer Enrichment Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This site is managed by Professor Jeffrey Johnson and Lia Calhoun. Jeffrey is a
                Professor of Mathematics at Kenai Peninsula College (KPC), and Lia is a Professor of
                English and Literature at the same institution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Together, we're committed to ensuring Homer's students continue to have access to
                enriching educational experiences despite budget constraints.
              </p>
              <div className="border-t pt-4">
                <p className="text-muted-foreground text-sm">
                  <strong>Contact us:</strong>
                  <br />
                  Jeffrey Johnson:{' '}
                  <a href="mailto:jjohnson47@alaska.edu" className="text-primary hover:underline">
                    jjohnson47@alaska.edu
                  </a>
                  <br />
                  Lia Calhoun:{' '}
                  <a href="mailto:eicalhoun@alaska.edu" className="text-primary hover:underline">
                    eicalhoun@alaska.edu
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </section>
    </main>
  );
}
