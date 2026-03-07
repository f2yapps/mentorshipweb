import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about using the Mentorship Platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="section-heading">Disclaimer</h1>
      <p className="mt-4 text-earth-600">Last updated: March 2025</p>

      <div className="mt-10 space-y-8 text-earth-700">
        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">General Information Only</h2>
          <p className="text-sm leading-relaxed">
            The information provided on this platform is for general informational and educational purposes only. Nothing on this platform constitutes professional advice - including but not limited to legal, financial, medical, psychological, or career advice. Always seek the guidance of a qualified professional for your specific circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Volunteer Mentors</h2>
          <p className="text-sm leading-relaxed">
            Mentors on this platform are volunteers who generously share their time and experience. They are not employees or agents of the Mentorship Platform. The platform does not verify, endorse, or guarantee the accuracy of any advice, information, or guidance provided by mentors. All mentor-mentee interactions are the sole responsibility of the individuals involved.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">No Guarantee of Outcomes</h2>
          <p className="text-sm leading-relaxed">
            Participation in mentorship sessions does not guarantee any specific career outcome, academic result, job placement, or personal development outcome. Results vary based on individual effort, circumstances, and external factors beyond the platform's control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Third-Party Links and Tools</h2>
          <p className="text-sm leading-relaxed">
            This platform may reference or link to third-party tools such as Zoom, Google Meet, and others. We are not affiliated with, sponsored by, or responsible for the content, privacy practices, or availability of any third-party services. Use of these tools is at your own discretion and subject to the respective platform's terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Limitation of Liability</h2>
          <p className="text-sm leading-relaxed">
            To the fullest extent permitted by law, the Mentorship Platform, its founders, volunteers, and contributors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of this platform or its services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-3">Changes to This Disclaimer</h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to update this disclaimer at any time. Continued use of the platform after changes are posted constitutes acceptance of the revised disclaimer.
          </p>
        </section>

        <section className="rounded-xl border border-earth-200 bg-earth-50 p-6">
          <h2 className="text-lg font-semibold text-earth-900 mb-2">Questions?</h2>
          <p className="text-sm text-earth-700">
            If you have questions about this disclaimer, contact us at{" "}
            <a href="mailto:f2yapps@support.com" className="text-primary-600 underline hover:text-primary-700">
              f2yapps@support.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
