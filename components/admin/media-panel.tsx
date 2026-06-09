"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ImageUploader } from "@/components/admin/image-uploader";

interface MediaFile {
  filename: string;
  url: string;
  size: number;
  modifiedAt: string;
}

interface MediaPanelProps {
  files: MediaFile[];
}

export function MediaPanel({ files }: MediaPanelProps) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [pendingDeleteFile, setPendingDeleteFile] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function refreshData() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function deleteFile(filename: string) {
    const confirmed = window.confirm("Delete this media file?");
    if (!confirmed) return;
    setPendingDeleteFile(filename);
    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename })
      });
      if (!response.ok) {
        throw new Error("Unable to delete media");
      }
      toast.success("Media file deleted.");
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete media file.");
    } finally {
      setPendingDeleteFile(null);
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[#e2e4ed]">Media</h1>
        <p className="text-sm text-[#6b7280]">
          {files.length} uploaded assets
        </p>
      </header>

      <section className="rounded-lg border border-[#2a2d3a] bg-[#1a1d27] p-5">
        <p className="mb-3 text-sm text-[#9ca3af]">Upload new image</p>
        <ImageUploader
          value={uploadedUrls}
          onChange={(urls) => {
            setUploadedUrls(urls);
            toast.success("Media uploaded.");
            refreshData();
          }}
          maxImages={5}
        />
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => (
          <article
            key={file.filename}
            className="overflow-hidden rounded-lg border border-[#2a2d3a] bg-[#1a1d27]"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={file.url}
                alt={file.filename}
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
            <div className="space-y-2 px-3 py-3">
              <p className="truncate text-xs text-[#e2e4ed]">{file.filename}</p>
              <p className="text-[11px] text-[#6b7280]">
                {(file.size / 1024).toFixed(1)} KB
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void copyUrl(file.url)}
                  className="inline-flex items-center gap-1 rounded-md border border-[#2a2d3a] px-2 py-1 text-[11px] text-[#9ca3af] transition hover:border-[#6366f1] hover:text-[#e2e4ed]"
                >
                  <Copy size={12} />
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => void deleteFile(file.filename)}
                  disabled={isPending || pendingDeleteFile === file.filename}
                  className="inline-flex items-center gap-1 rounded-md border border-[#2a2d3a] px-2 py-1 text-[11px] text-[#fca5a5] transition hover:border-[#ef4444] hover:text-[#ef4444]"
                >
                  <Trash2 size={12} />
                  {pendingDeleteFile === file.filename ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {!files.length ? (
        <p className="text-sm text-[#6b7280]">No uploaded media files yet.</p>
      ) : null}
    </div>
  );
}
