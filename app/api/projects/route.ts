import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { getDb } from "@/lib/mongodb";

type ProjectPayload = {
  imageUrl: string;
  liveUrl: string;
};

type ReorderPayload = {
  orderedIds: string[];
};

function isAllowedProjectImageUrl(imageUrl: string) {
  if (imageUrl.startsWith("/uploads/projects/")) return true;

  try {
    const parsed = new URL(imageUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return false;
    return ["i.ibb.co", "ibb.co"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const projects = await db
      .collection("projects")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    const serializedProjects = projects.map((project) => ({
      _id: String(project._id),
      imageUrl: String(project.imageUrl ?? ""),
      liveUrl: String(project.liveUrl ?? ""),
      order: Number(project.order ?? 0),
    }));

    return NextResponse.json({ ok: true, data: serializedProjects }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to fetch projects.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const authError = await requireDashboardSession();
  if (authError) return authError;

  try {
    const body = (await req.json()) as Partial<ProjectPayload>;
    const imageUrl = body.imageUrl?.trim();
    const liveUrl = body.liveUrl?.trim();

    if (!imageUrl || !liveUrl) {
      return NextResponse.json(
        { ok: false, message: "imageUrl and liveUrl are required." },
        { status: 400 }
      );
    }
    if (!isAllowedProjectImageUrl(imageUrl)) {
      return NextResponse.json(
        { ok: false, message: "Please upload project image from dashboard uploader (local or imgbb)." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const topProject = await db.collection("projects").find({}).sort({ order: -1 }).limit(1).toArray();
    const nextOrder = topProject.length ? Number(topProject[0].order ?? 0) + 1 : 1;
    const result = await db.collection("projects").insertOne({
      imageUrl,
      liveUrl,
      order: nextOrder,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { ok: true, message: "Project added successfully.", insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to add project.", error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const authError = await requireDashboardSession();
  if (authError) return authError;

  try {
    const body = (await req.json()) as Partial<ReorderPayload>;
    const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds : [];

    if (!orderedIds.length) {
      return NextResponse.json(
        { ok: false, message: "orderedIds is required." },
        { status: 400 }
      );
    }

    if (orderedIds.some((id) => !ObjectId.isValid(id))) {
      return NextResponse.json(
        { ok: false, message: "Invalid project id in orderedIds." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));

    if (bulkOps.length) {
      await db.collection("projects").bulkWrite(bulkOps);
    }

    return NextResponse.json({ ok: true, message: "Project order updated." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to update project order.", error: String(error) },
      { status: 500 }
    );
  }
}
