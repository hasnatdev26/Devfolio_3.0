import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const typeValue = formData.get("type");
    const uploadType = typeValue === "about" ? "about" : "projects";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "Image file is required." }, { status: 400 });
    }

    const allowedMimeTypes = new Set(["image/jpeg", "image/jpg", "image/png"]);
    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json({ ok: false, message: "Only JPG and PNG images are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", uploadType);
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      {
        ok: true,
        message: "Image uploaded successfully.",
        imageUrl: `/uploads/${uploadType}/${fileName}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to upload image.", error: String(error) },
      { status: 500 }
    );
  }
}
