import { NextResponse } from "next/server";
import { client } from "@/lib/mongodb";

export async function GET() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    return NextResponse.json(
      { ok: true, message: "MongoDB connected successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed.", error: String(error) },
      { status: 500 }
    );
  }
}
