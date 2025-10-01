// TODO: move to core or photos module
export interface Photo {
  category:
    | "environment"
    | "classroom"
    | "activities"
    | "events"
    | "awards"
    | "default";
  url: string;
  caption?: string;
  alt?: string;

  // Cloudinary fields (auto-populated on upload)
  assetId?: string; // Cloudinary asset ID
  publicId: string; // Cloudinary public ID

  // Database fields for media assets
  bucket?: string; // Cloudinary bucket/folder
  id?: string; // Media asset ID
  path?: string | null; // Optional path

  width?: number;
  height?: number;
  format?: string; // webp, jpg, etc.
  bytes?: number; // File size
  version?: number; // Cloudinary version

  uploadedAt?: string;
}
