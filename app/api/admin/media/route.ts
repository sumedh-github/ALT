import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminRoute } from "@/lib/admin-auth";

const deleteMediaSchema = z.object({
  filename: z.string().min(1)
});

function uploadDir() {
  return path.join(process.cwd(), "public", "uploads");
}

export async function GET() {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const directory = uploadDir();
    await fs.mkdir(directory, { recursive: true });
    const files = await fs.readdir(directory);
    const fileEntries = await Promise.all(
      files.map(async (fileName) => {
        const fullPath = path.join(directory, fileName);
        const stats = await fs.stat(fullPath);
        return {
          filename: fileName,
          url: `/uploads/${fileName}`,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString()
        };
      })
    );

    fileEntries.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));

    return NextResponse.json({ files: fileEntries });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load uploaded media." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const adminCheck = await requireAdminRoute();
  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  try {
    const body = await request.json();
    const payload = deleteMediaSchema.parse(body);
    const safeFileName = path.basename(payload.filename);
    const fullPath = path.join(uploadDir(), safeFileName);
    await fs.unlink(fullPath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid media delete payload." }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to delete media file." },
      { status: 500 }
    );
  }
}
