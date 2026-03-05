import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Practices for Mentorship",
  description: "Guidelines for effective mentorship on the platform.",
};

export default function BestPracticesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="section-heading">Best Practices for Mentorship</h1>
      <p className="mt-4 text-earth-600">Guidelines to help mentors and mentees build meaningful, productive relationships.</p>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-4">For Mentors</h2>
          <div className="space-y-4">
            {[
              { icon: "🎯", title: "Set clear expectations early", body: "In your first session, agree on goals, frequency of meetings, and communication channels. This prevents confusion later." },
              { icon: "🕐", title: "Respect time commitments", body: "Be punctual and consistent. If you need to reschedule, give as much notice as possible. Your time is valued, and so is theirs." },
              { icon: "👂", title: "Listen actively", body: "Ask open-ended questions. Let the mentee lead the conversation. Your role is to guide, not to lecture." },
              { icon: "💬", title: "Give constructive feedback", body: "Be honest but kind. Focus on growth opportunities rather than only pointing out shortcomings." },
              { icon: "🌍", title: "Be culturally sensitive", body: "Our mentees come from diverse backgrounds. Be mindful of cultural differences in communication styles and professional norms." },
              { icon: "📈", title: "Track progress", body: "Check in on goals set in previous sessions. Celebrating small wins motivates continued growth." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-earth-100 bg-earth-50 p-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-earth-900">{title}</p>
                  <p className="mt-1 text-sm text-earth-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-earth-900 mb-4">For Mentees</h2>
          <div className="space-y-4">
            {[
              { icon: "📝", title: "Come prepared", body: "Before each session, prepare specific questions or topics you want to discuss. Don't expect your mentor to set the agenda every time." },
              { icon: "🎯", title: "Define your goals", body: "Be clear about what you want to achieve through mentorship. Vague goals lead to unfocused sessions." },
              { icon: "🙏", title: "Value your mentor's time", body: "Mentors volunteer their time. Be punctual, responsive, and appreciative." },
              { icon: "🚀", title: "Take action", body: "Apply the advice you receive between sessions. Mentorship is most effective when it leads to real action." },
              { icon: "🔄", title: "Give feedback", body: "Let your mentor know what is and isn't working. Good mentorship is a two-way relationship." },
            ].map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-xl border border-earth-100 bg-earth-50 p-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold text-earth-900">{title}</p>
                  <p className="mt-1 text-sm text-earth-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-primary-100 bg-primary-50 p-6">
          <h2 className="text-lg font-semibold text-primary-900 mb-2">Remember</h2>
          <p className="text-primary-800">The best mentorships are built on mutual respect, clear communication, and a shared commitment to growth. Take it one session at a time.</p>
        </section>
      </div>
    </div>
  );
}
