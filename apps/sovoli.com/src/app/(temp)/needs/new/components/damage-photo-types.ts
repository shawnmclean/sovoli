import type { Photo } from "~/modules/core/photos/types";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface DamagePhoto extends Photo {
  id: string;
  fileName: string;
  previewUrl: string;
  status: UploadStatus;
  errorMessage?: string;
  file?: File;
}

export const createDamagePhoto = (file: File): DamagePhoto => ({
  id: crypto.randomUUID(),
  fileName: file.name,
  previewUrl: URL.createObjectURL(file),
  status: "uploading",
  category: "default",
  url: "",
  publicId: "",
  alt: file.name,
  file,
});
