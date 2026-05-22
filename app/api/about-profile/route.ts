import { NextResponse } from "next/server";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { getDb } from "@/lib/mongodb";
import { defaultAboutProfile, type AboutProfile } from "@/lib/about-profile";

export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("site_settings").findOne({ key: "about_profile" });
    return NextResponse.json(
      { ok: true, data: { ...defaultAboutProfile, ...(data?.value as Partial<AboutProfile> | undefined) } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to load about profile.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const authError = await requireDashboardSession();
  if (authError) return authError;

  try {
    const body = (await req.json()) as Partial<AboutProfile>;
    const value: AboutProfile = {
      coverImage: body.coverImage?.trim() || defaultAboutProfile.coverImage,
      profileImage: body.profileImage?.trim() || defaultAboutProfile.profileImage,
    };

    const db = await getDb();
    await db.collection("site_settings").updateOne(
      { key: "about_profile" },
      { $set: { key: "about_profile", value, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, message: "About profile updated.", data: value }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to update about profile.", error: String(error) },
      { status: 500 }
    );
  }
}
