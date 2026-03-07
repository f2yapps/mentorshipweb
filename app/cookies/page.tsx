import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How we use cookies on the Mentorship Platform.",
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="section-heading">Cookie Policy</h1>
      <p className="mt-2 text-sm text-earth-500">Last updated: March 2026</p>

      <div className="mt-10 space-y-8 text-earth-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">What Are Cookies?</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and keep you signed in across sessions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Cookies We Use</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-earth-200 p-4">
              <p className="font-semibold text-earth-900">Essential Cookies</p>
              <p className="mt-1 text-sm">Required for authentication and session management. Without these, you cannot log in or use the platform.</p>
            </div>
            <div className="rounded-xl border border-earth-200 p-4">
              <p className="font-semibold text-earth-900">Preference Cookies</p>
              <p className="mt-1 text-sm">Remember your settings and preferences to personalize your experience.</p>
            </div>
            <div className="rounded-xl border border-earth-200 p-4">
              <p className="font-semibold text-earth-900">Analytics Cookies</p>
              <p className="mt-1 text-sm">Help us understand how users interact with the platform so we can improve it. Data is anonymized.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Managing Cookies</h2>
          <p>You can control cookies through your browser settings. Disabling essential cookies will prevent you from using core platform features like signing in.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Contact</h2>
          <p>Questions about cookies? Contact us at <a href="mailto:f2yapps@support.com" className="text-primary-600 hover:underline">f2yapps@support.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
