'use client';

import { ArrowRight, Calendar, GraduationCap, Heart, Menu, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Don't redirect if user is loading or not authenticated
    if (!user || loading) return;

    // Check if user has completed their profile
    const checkProfileAndRedirect = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists() || !userDoc.data()?.profileCompleted) {
          // Profile not complete, redirect to welcome
          router.push('/welcome');
        } else {
          // Profile complete, redirect to dashboard
          router.push('/dashboard');
        }
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
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
              <Button asChild className="w-full">
                <Link href="/signup">Get Started</Link>
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
              Welcome to Homer Enrichment Hub
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl md:text-2xl">
              Sign up here for MathCounts registration and other enrichment activities
            </p>
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

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h3 className="mb-4 text-2xl font-semibold">Ready to get started?</h3>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
              Create your guardian account to register your children for MathCounts and stay
              informed about future enrichment opportunities.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
