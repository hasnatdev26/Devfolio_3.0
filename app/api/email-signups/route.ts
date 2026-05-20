import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    const db = await getDb();
    const signups = await db
      .collection("email_signups")
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    return NextResponse.json({ ok: true, data: signups }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to fetch email signups.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: string };
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, message: "Valid email is required." }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("email_signups").findOne({ email });
    if (existing) {
      return NextResponse.json({ ok: true, message: "Email already subscribed." }, { status: 200 });
    }

    await db.collection("email_signups").insertOne({
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ ok: true, message: "Email subscribed." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to subscribe email.", error: String(error) },
      { status: 500 }
    );
  }
}
