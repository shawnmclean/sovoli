export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface DamagePhoto {
  id: string;
  fileName: string;
  previewUrl: string;
  status: UploadStatus;
  url?: string;
  publicId?: string;
  errorMessage?: string;
  file?: File;
}

export const createDamagePhoto = (file: File): DamagePhoto => ({
  id: crypto.randomUUID(),
  fileName: file.name,
  previewUrl: URL.createObjectURL(file),
  status: "uploading",
  file,
});
