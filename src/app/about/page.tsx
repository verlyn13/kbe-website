'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </Button>
      </div>
      <h1 className="mb-6 text-3xl font-bold">About Homer Enrichment Hub</h1>

      <div className="space-y-6">
        <section>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Homer Enrichment Hub serves as a central gateway for enrichment programs in Homer,
            Alaska. We connect families with educational opportunities that inspire and challenge
            students.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground">
            To simplify access to enrichment programs and foster educational growth in our community
            by providing a unified platform for program discovery and registration.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">What We Offer</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Centralized program information and schedules</li>
            <li>Simple online registration</li>
            <li>Calendar of upcoming events and activities</li>
            <li>Resources for students and parents</li>
            <li>Communication tools for program updates</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Featured Programs</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <strong>MathCounts:</strong> Competitive mathematics program for middle school
              students
            </li>
            <li>
              <strong>Academic Programs:</strong> Various enrichment opportunities across subjects
            </li>
            <li>
              <strong>STEM Activities:</strong> Science, technology, engineering, and math
              exploration
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Community Impact</h2>
          <p className="text-muted-foreground">
            Homer Enrichment Hub strengthens our community by making quality educational programs
            more accessible to all families, regardless of their technical expertise or available
            time.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-semibold">Get Involved</h2>
          <p className="text-muted-foreground">
            Whether you're a parent looking for programs, an educator wanting to offer a program, or
            a community member interested in supporting education, we welcome your participation.
          </p>
        </section>
      </div>

      <div className="border-border mt-8 border-t pt-6">
        <p className="text-muted-foreground text-sm">
          Homer Enrichment Hub - Empowering education in Homer, Alaska
        </p>
      </div>
    </div>
  );
}
