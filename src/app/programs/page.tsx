'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProgramsPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Enrichment Programs</h1>
        <p className="text-muted-foreground">
          Explore our current and upcoming programs for students
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">MathCounts 2025</CardTitle>
                <CardDescription>
                  Competitive mathematics program for middle school students
                </CardDescription>
              </div>
              <Badge className="bg-green-500">Registration Open</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              MathCounts is a national middle school mathematics competition that builds problem-solving skills 
              and fosters achievement through four levels of fun, in-person "bee" style contests.
            </p>
            
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Grades 6-8</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Starts January 2025</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Tuesdays & Thursdays</span>
              </div>
            </div>

            <Button className="w-full sm:w-auto" asChild>
              <Link href="/students/add">
                Register Your Student
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">Science Exploration Lab</CardTitle>
                <CardDescription>
                  Hands-on science experiments and discovery
                </CardDescription>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Interactive science program focusing on experiments, critical thinking, and scientific method.
              Registration opening Spring 2025.
            </p>
          </CardContent>
        </Card>

        <Card className="opacity-75">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">Creative Writing Workshop</CardTitle>
                <CardDescription>
                  Develop storytelling and writing skills
                </CardDescription>
              </div>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Weekly workshops to inspire young writers through creative exercises and peer collaboration.
              Registration opening Spring 2025.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}