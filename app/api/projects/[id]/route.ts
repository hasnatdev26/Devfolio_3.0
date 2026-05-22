import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { getDb } from "@/lib/mongodb";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const authError = await requireDashboardSession();
  if (authError) return authError;

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ ok: false, message: "Invalid project id." }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      return NextResponse.json({ ok: false, message: "Project not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Project deleted." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to delete project.", error: String(error) },
      { status: 500 }
    );
  }
}
