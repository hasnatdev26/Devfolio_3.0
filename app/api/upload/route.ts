import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function isLikelyImageFile(file: File) {
  if (file.type && file.type.startsWith("image/")) return true;
  const lowerName = file.name.toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|avif|bmp|svg|heic|heif)$/i.test(lowerName);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const typeValue = formData.get("type");
    const uploadType = typeValue === "about" ? "about" : "projects";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "Image file is required." }, { status: 400 });
    }

    if (!isLikelyImageFile(file)) {
      return NextResponse.json({ ok: false, message: "Only image files are allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imgbbApiKey = process.env.IMGBB_API_KEY?.trim();
    const isVercel = process.env.VERCEL === "1";

    if (imgbbApiKey) {
      const base64Image = buffer.toString("base64");
      const formBody = new URLSearchParams();
      formBody.set("image", base64Image);
      formBody.set("name", file.name.replace(/\.[^.]+$/, ""));

      const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(imgbbApiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
      });
      const imgbbData = (await imgbbRes.json()) as {
        success?: boolean;
        data?: { url?: string; display_url?: string };
        error?: { message?: string };
      };

      if (imgbbRes.ok && imgbbData?.success && imgbbData?.data?.url) {
        return NextResponse.json(
          {
            ok: true,
            message: "Image uploaded successfully.",
            imageUrl: imgbbData.data.display_url || imgbbData.data.url,
          },
          { status: 201 }
        );
      }

      if (isVercel) {
        return NextResponse.json(
          {
            ok: false,
            message: imgbbData?.error?.message || "Image hosting failed on imgbb.",
          },
          { status: 502 }
        );
      }
    }

    if (isVercel && !imgbbApiKey) {
      return NextResponse.json(
        {
          ok: false,
          message: "IMGBB_API_KEY is missing. Set it in Vercel environment variables.",
        },
        { status: 500 }
      );
    }

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
