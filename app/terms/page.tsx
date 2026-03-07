import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms of use for the Mentorship Platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="section-heading">Terms and Conditions</h1>
      <p className="mt-2 text-sm text-earth-500">Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-earth-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">1. Acceptance of Terms</h2>
          <p>By creating an account and using this platform, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">2. Platform Purpose</h2>
          <p>This platform facilitates free mentorship connections between volunteer mentors and mentees globally. The platform does not provide mentorship itself - it connects people who do.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">3. User Responsibilities</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate and truthful profile information</li>
            <li>Treat all users with respect and professionalism</li>
            <li>Honor mentorship commitments you make</li>
            <li>Not use the platform for spam, harassment, or solicitation</li>
            <li>Not share another user's personal information without consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">4. Mentor Volunteer Status</h2>
          <p>All mentors are volunteers. The platform does not compensate mentors and mentors are not employees or contractors of the platform. Mentors offer guidance in good faith based on their experience.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">5. Limitation of Liability</h2>
          <p>The platform is not responsible for the quality, accuracy, or outcome of mentorship interactions. We do not guarantee mentorship results. Use of advice given during mentorship sessions is at your own discretion and risk.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">6. Account Termination</h2>
          <p>We reserve the right to suspend or terminate accounts that violate these terms, engage in harmful behavior, or misuse the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">7. Changes to Terms</h2>
          <p>We may update these terms periodically. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
        </section>
      </div>
    </div>
  );
}
