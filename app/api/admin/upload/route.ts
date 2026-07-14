import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import { requireAdminRoute } from "@/lib/admin-auth";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSizeBytes = 5 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  const normalized = fileName.toLowerCase().replace(/[^a-z0-9.-]/g, "-");
  return normalized.replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required." }, { status: 400 });
    }

    if (!allowedMimeTypes.has(file.type)) {
      return NextResponse.json(
        { error: "Only jpg, png, and webp files are supported." },
        { status: 400 }
      );
    }

    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "Image exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDirectory, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const finalName = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const finalPath = path.join(uploadDirectory, finalName);
    await fs.writeFile(finalPath, buffer);

    return NextResponse.json({ url: `/uploads/${finalName}` }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to upload image right now." },
      { status: 500 }
    );
  }
}
