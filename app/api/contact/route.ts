import { NextResponse } from "next/server";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "support@f2yapps.com";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        const subjectLabel =
          { general: "General inquiry", support: "Account / technical support", partnership: "Partnership", feedback: "Feedback" }[
            subject as string
          ] ?? subject;
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: CONTACT_EMAIL,
          replyTo: email,
          subject: `[Mentorship] ${subjectLabel} from ${name}`,
          text: `From: ${name} <${email}>\nSubject: ${subjectLabel}\n\n${message}`,
          html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p><strong>Subject:</strong> ${subjectLabel}</p><hr><p>${message.replace(/\n/g, "<br>")}</p>`,
        });
        if (error) {
          console.error("Contact form Resend error:", error);
          return NextResponse.json(
            { error: "Failed to send message. Please try again or email us directly." },
            { status: 500 }
          );
        }
      } catch (e) {
        console.error("Contact form email send error:", e);
        return NextResponse.json(
          { error: "Failed to send message. Please try again or email us directly." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
