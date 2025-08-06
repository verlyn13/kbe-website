'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeBackgroundImage } from '@/components/theme-image';
import { ArrowRight, GraduationCap, Users, Heart, Calendar, Menu } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <ThemeBackgroundImage />
      
      {/* Navigation Header */}
      <nav className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Homer Enrichment Hub
              </h1>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
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
            <div className="sm:hidden pt-4 pb-2 space-y-2 border-t mt-4">
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Homer Enrichment Hub
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Sign up here for MathCounts registration and other enrichment activities
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <GraduationCap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>MathCounts 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join Alaska's premier mathematics competition for middle school students. 
                  Build problem-solving skills through fun, challenging math problems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Weekly Meetings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every Tuesday at 4:00 PM during the school year. 
                  Practice sessions, team building, and preparation for competitions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Run by dedicated volunteers and educators passionate about 
                  enriching our students' educational experiences.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Why Another Site Section */}
          <Card className="max-w-4xl mx-auto mb-16 border-accent/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <Heart className="h-8 w-8 text-accent mb-2" />
              <CardTitle className="text-2xl">Why yet another site to sign into?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Recent funding cuts have left our school district without adequate resources 
                for enrichment programs like MathCounts. This has created a need for managing 
                these opportunities outside the traditional school system.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Homer Enrichment Hub was created to fill this gap, providing a centralized 
                place for families to discover and register for educational opportunities that 
                our community values but can no longer be fully supported through school funding.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By creating this independent platform, we can continue offering these vital 
                programs while reducing the administrative burden on our already stretched 
                school resources.
              </p>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="max-w-4xl mx-auto border-primary/20 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">About Homer Enrichment Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                This site is managed by Professor Jeffrey Johnson and Lia Calhoun. 
                Jeffrey is a Professor of Mathematics at Kenai Peninsula College (KPC), 
                and Lia is a Professor of English and Literature at the same institution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Together, we're committed to ensuring Homer's students continue to have 
                access to enriching educational experiences despite budget constraints.
              </p>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Contact us:</strong><br />
                  Jeffrey Johnson: <a href="mailto:jjohnson47@alaska.edu" className="text-primary hover:underline">jjohnson47@alaska.edu</a><br />
                  Lia Calhoun: <a href="mailto:eicalhoun@alaska.edu" className="text-primary hover:underline">eicalhoun@alaska.edu</a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-semibold mb-4">Ready to get started?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your guardian account to register your children for MathCounts 
              and stay informed about future enrichment opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}