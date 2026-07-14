"use client";

import { Loader2, Star, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 5 * 1024 * 1024;

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read selected file."));
    reader.readAsDataURL(file);
  });
}

function uploadFileWithProgress(file: File, onProgress: (value: number) => void) {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error("Upload failed."));
        return;
      }
      try {
        const data = JSON.parse(xhr.responseText) as { url?: string };
        if (!data.url) {
          reject(new Error("Upload URL missing."));
          return;
        }
        resolve(data.url);
      } catch (error) {
        reject(error);
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed."));
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

export function ImageUploader({
  value,
  onChange,
  maxImages = 5
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
  const [useUrlFallback, setUseUrlFallback] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function uploadFiles(files: File[]) {
    setUploadError(null);
    let nextUrls = [...value];

    for (const file of files) {
      if (nextUrls.length >= maxImages) {
        setUploadError(`Maximum of ${maxImages} images allowed.`);
        break;
      }

      if (!allowedTypes.includes(file.type)) {
        setUploadError("Only jpg, png, and webp files are supported.");
        continue;
      }

      if (file.size > maxFileSize) {
        setUploadError("File size must be 5MB or smaller.");
        continue;
      }

      try {
        const base64Preview = await fileToBase64(file);
        setUploadProgress(0);
        const uploadedUrl = await uploadFileWithProgress(file, setUploadProgress);
        setLocalPreviews((prev) => ({
          ...prev,
          [uploadedUrl]: base64Preview
        }));
        nextUrls = [...nextUrls, uploadedUrl];
        onChange(nextUrls);
        setUploadProgress(null);
      } catch (error) {
        console.error(error);
        setUploadProgress(null);
        setUploadError("Upload failed. Please try again.");
      }
    }
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    void uploadFiles(files);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files ?? []);
    void uploadFiles(files);
  }

  function removeImage(index: number) {
    onChange(value.filter((_, idx) => idx !== index));
  }

  function addExternalUrl() {
    if (!urlInput.trim()) {
      return;
    }
    if (value.length >= maxImages) {
      setUploadError(`Maximum of ${maxImages} images allowed.`);
      return;
    }
    onChange([...value, urlInput.trim()]);
    setUrlInput("");
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed px-4 py-6 text-sm transition ${
          dragActive
            ? "border-[#6366f1] bg-[#6366f1]/10 text-[#c7d2fe]"
            : "border-[#2a2d3a] bg-[#0f1117] text-[#9ca3af]"
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
      >
        <UploadCloud size={20} />
        <p className="text-xs uppercase tracking-[0.18em]">
          Drag & drop or click to upload
        </p>
        <p className="text-[11px] text-[#6b7280]">jpg, png, webp · max 5MB</p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={maxImages > 1}
        className="hidden"
        onChange={onInputChange}
      />

      <button
        type="button"
        className="text-xs uppercase tracking-[0.18em] text-[#a5b4fc] hover:text-[#c7d2fe]"
        onClick={() => setUseUrlFallback((prev) => !prev)}
      >
        {useUrlFallback ? "Hide URL input" : "Use URL instead"}
      </button>

      {useUrlFallback ? (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="https://example.com/image.jpg"
            className="h-10 flex-1 rounded-md border border-[#2a2d3a] bg-[#0f1117] px-3 text-sm text-[#e2e4ed] focus:border-[#6366f1] focus:outline-none"
          />
          <button
            type="button"
            onClick={addExternalUrl}
            className="rounded-md border border-[#2a2d3a] px-3 text-xs text-[#9ca3af] hover:border-[#6366f1] hover:text-[#e2e4ed]"
          >
            Add
          </button>
        </div>
      ) : null}

      {uploadProgress !== null ? (
        <div className="flex items-center gap-2 text-xs text-[#9ca3af]">
          <Loader2 size={14} className="animate-spin" />
          Uploading... {uploadProgress}%
        </div>
      ) : null}

      {uploadError ? <p className="text-xs text-[#fca5a5]">{uploadError}</p> : null}

      {value.length ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative overflow-hidden rounded-md border border-[#2a2d3a] bg-[#0f1117]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={localPreviews[url] ?? url}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  unoptimized
                  sizes="300px"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between border-t border-[#2a2d3a] px-2 py-1">
                <p className="truncate text-[11px] text-[#9ca3af]">
                  {url.replace(/^https?:\/\//, "")}
                </p>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-[#fca5a5] hover:text-[#ef4444]"
                  aria-label="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
              {index === 0 ? (
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#facc15]">
                  <Star size={10} className="fill-[#facc15]" />
                  Primary
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
