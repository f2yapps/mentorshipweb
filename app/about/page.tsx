import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Empowering youth worldwide through AI and technology mentorship. Our vision, values, and impact in developing countries.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
      <h1 className="section-heading">About Us</h1>

      <section className="mt-8 space-y-6 text-earth-700">
        <h2 className="text-xl font-semibold text-earth-900">Our Vision</h2>
        <p>
          We envision a world where every young person, regardless of location or background, 
          has access to mentorship in AI, technology, and career development. By connecting 
          volunteer mentors with youth worldwide—especially in developing countries—we&apos;re 
          building the next generation of innovators, technologists, and leaders.
        </p>

        <h2 className="text-xl font-semibold text-earth-900">Our Values</h2>
        <ul className="list-inside list-disc space-y-2">
          <li><strong>Youth Empowerment:</strong> Investing in young people as agents of change.</li>
          <li><strong>Technology Access:</strong> Democratizing AI and tech education globally.</li>
          <li><strong>Global Community:</strong> Connecting mentors and mentees across borders.</li>
          <li><strong>Free Access:</strong> No-cost mentorship for all young people.</li>
          <li><strong>Impact Focus:</strong> Real skills, real growth, real opportunities.</li>
        </ul>

        <h2 className="text-xl font-semibold text-earth-900">Focus on Developing Countries</h2>
        <p>
          Our platform prioritizes youth in developing countries who face barriers to accessing 
          quality education and mentorship in emerging technologies. We connect young people with 
          mentors who understand the unique challenges and opportunities in these regions, offering 
          guidance in AI, machine learning, software development, data science, and digital entrepreneurship.
        </p>

        <h2 className="text-xl font-semibold text-earth-900">AI & Technology for Youth</h2>
        <p>
          Artificial Intelligence is transforming the world, and we believe every young person 
          should have the opportunity to learn, contribute, and benefit from this revolution. 
          Our mentors provide guidance in AI fundamentals, machine learning, data science, 
          software engineering, and how to apply these skills to solve local and global challenges.
        </p>

        <p>
          Whether you&apos;re a student learning to code, a young professional entering tech, or an 
          aspiring AI researcher, you can find experienced mentors ready to guide your journey—
          completely free of charge.
        </p>
      </section>
    </div>
  );
}
