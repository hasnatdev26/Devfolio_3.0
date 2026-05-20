import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { defaultSiteLinks, type SiteLinks } from "@/lib/site-links";

export async function GET() {
  try {
    const db = await getDb();
    const data = await db.collection("site_settings").findOne({ key: "links" });
    return NextResponse.json(
      { ok: true, data: { ...defaultSiteLinks, ...(data?.value as Partial<SiteLinks> | undefined) } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to load links.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as Partial<SiteLinks>;
    const value: SiteLinks = {
      facebook: body.facebook?.trim() || "",
      linkedin: body.linkedin?.trim() || "",
      github: body.github?.trim() || "",
      resume: body.resume?.trim() || "",
    };

    const db = await getDb();
    await db.collection("site_settings").updateOne(
      { key: "links" },
      { $set: { key: "links", value, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true, message: "Links updated.", data: value }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to update links.", error: String(error) },
      { status: 500 }
    );
  }
}
