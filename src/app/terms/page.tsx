export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using the Homer Enrichment Hub website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Use of Service</h2>
          <p className="text-gray-700">
            The Homer Enrichment Hub provides information about enrichment programs and facilitates registration. Users must provide accurate information during registration.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Privacy</h2>
          <p className="text-gray-700">
            Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Program Registration</h2>
          <p className="text-gray-700">
            Registration for programs is subject to availability and program-specific requirements. The Homer Enrichment Hub acts as a facilitator and is not responsible for individual program operations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-700">
            Homer Enrichment Hub shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Changes to Terms</h2>
          <p className="text-gray-700">
            We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Contact Information</h2>
          <p className="text-gray-700">
            For questions about these Terms, please contact us through the website.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}