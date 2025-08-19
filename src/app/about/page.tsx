export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">About Homer Enrichment Hub</h1>
      
      <div className="space-y-6">
        <section>
          <p className="text-lg text-gray-700 leading-relaxed">
            Homer Enrichment Hub serves as a central gateway for enrichment programs in Homer, Alaska. 
            We connect families with educational opportunities that inspire and challenge students.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p className="text-gray-700">
            To simplify access to enrichment programs and foster educational growth in our community by providing a unified platform for program discovery and registration.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What We Offer</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Centralized program information and schedules</li>
            <li>Simple online registration</li>
            <li>Calendar of upcoming events and activities</li>
            <li>Resources for students and parents</li>
            <li>Communication tools for program updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Featured Programs</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>MathCounts:</strong> Competitive mathematics program for middle school students</li>
            <li><strong>Academic Programs:</strong> Various enrichment opportunities across subjects</li>
            <li><strong>STEM Activities:</strong> Science, technology, engineering, and math exploration</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Community Impact</h2>
          <p className="text-gray-700">
            Homer Enrichment Hub strengthens our community by making quality educational programs more accessible to all families, regardless of their technical expertise or available time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Get Involved</h2>
          <p className="text-gray-700">
            Whether you're a parent looking for programs, an educator wanting to offer a program, or a community member interested in supporting education, we welcome your participation.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Homer Enrichment Hub - Empowering education in Homer, Alaska
        </p>
      </div>
    </div>
  );
}