import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our vision, values, and impact. Connecting mentors and mentees across Ethiopia, Africa, and the world.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">About Us</h1>

      <section className="mt-8 space-y-6 text-earth-700">
        <h2 className="text-xl font-semibold text-earth-900">Our Vision</h2>
        <p>
          We envision a world where everyone—regardless of location or background—has
          access to guidance and support. By connecting volunteer mentors with mentees
          across Ethiopia, Africa, and the globe, we help people grow in their
          academics, careers, and lives.
        </p>

        <h2 className="text-xl font-semibold text-earth-900">Our Values</h2>
        <ul className="list-inside list-disc space-y-2">
          <li><strong>Access:</strong> Free mentorship for everyone.</li>
          <li><strong>Inclusion:</strong> Welcoming mentees and mentors from all cultures and countries.</li>
          <li><strong>Impact:</strong> Focus on real growth in academics, career, life, and purpose.</li>
          <li><strong>Community:</strong> Building a supportive network across Ethiopia, Africa, and the world.</li>
        </ul>

        <h2 className="text-xl font-semibold text-earth-900">Impact in Ethiopia & Africa</h2>
        <p>
          Our platform is built with Ethiopia and Africa in mind. We support categories
          from Academics and Career to Agriculture, Leadership, Immigration, and Faith &
          Purpose. Mentors volunteer their time to offer advice in local languages and
          contexts, helping mentees navigate study, work, and life challenges.
        </p>
        <p>
          Whether you are a student in Addis Ababa, a professional in Nairobi, or
          someone seeking guidance anywhere in the world, you can find a mentor and
          request free, voluntary mentorship through this platform.
        </p>
      </section>
    </div>
  );
}
