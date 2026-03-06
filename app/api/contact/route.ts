import { NextResponse } from "next/server";

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
    // In production: send email (e.g. Resend, SendGrid) or store in DB
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
