import { promises as fs } from "node:fs";
import path from "node:path";

import { MediaPanel } from "@/components/admin/media-panel";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMediaPage() {
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDirectory, { recursive: true });
  const names = await fs.readdir(uploadDirectory);
  const files = await Promise.all(
    names.map(async (name) => {
      const fullPath = path.join(uploadDirectory, name);
      const stats = await fs.stat(fullPath);
      return {
        filename: name,
        url: `/uploads/${name}`,
        size: stats.size,
        modifiedAt: stats.mtime.toISOString()
      };
    })
  );
  files.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));

  return <MediaPanel files={files} />;
}
