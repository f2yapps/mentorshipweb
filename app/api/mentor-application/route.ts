import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, expertise, experience, why_mentor } = body as {
      name?: string;
      email?: string;
      expertise?: string[];
      why_mentor?: string;
      experience?: string;
    };
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }
    // In production: store in DB (e.g. mentor_applications table) or send to email/CRM
    // For now we accept and return success
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
