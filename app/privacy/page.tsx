import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="section-heading">Privacy Policy</h1>
      <p className="mt-2 text-sm text-earth-500">Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-earth-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly when registering, including your name, email address, country, professional background, and mentorship preferences. We also collect usage data such as pages visited and actions taken on the platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To match mentees with suitable volunteer mentors</li>
            <li>To send notifications about mentorship requests and activity</li>
            <li>To improve platform features and user experience</li>
            <li>To communicate important platform updates</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">3. Data Sharing</h2>
          <p>We do not sell or share your personal information with third parties for commercial purposes. Your profile information (name, expertise, bio) is visible to other registered users to facilitate mentorship connections. We may share data with service providers who assist in platform operations under strict confidentiality agreements.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">4. Data Security</h2>
          <p>We use industry-standard security measures including encrypted connections (HTTPS) and secure authentication. Your password is never stored in plain text. However, no system is completely secure and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">5. Your Rights</h2>
          <p>You may request to access, correct, or delete your personal data at any time by contacting us. You can update your profile information directly through your account settings.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">6. Contact</h2>
          <p>For privacy-related questions, contact us at <a href="mailto:f2yapps@support.com" className="text-primary-600 hover:underline">f2yapps@support.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
