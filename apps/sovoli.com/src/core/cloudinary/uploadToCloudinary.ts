import type { UploadSignature } from "./generateUploadSignatures";

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url?: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  version: number;
  created_at: string;
}

export interface UploadedAsset {
  url: string;
  publicId: string;
  assetId: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  version: number;
  createdAt: string;
}

export const uploadToCloudinary = async (
  file: File,
  signature: UploadSignature,
): Promise<UploadedAsset> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp.toString());
  formData.append("signature", signature.signature);
  formData.append("public_id", signature.id);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to upload file: ${response.status} ${response.statusText} - ${errorBody}`,
    );
  }

  const uploadResponse = (await response.json()) as CloudinaryUploadResponse;

  return {
    url: uploadResponse.secure_url ?? uploadResponse.url,
    publicId: uploadResponse.public_id,
    assetId: uploadResponse.asset_id,
    width: uploadResponse.width,
    height: uploadResponse.height,
    bytes: uploadResponse.bytes,
    format: uploadResponse.format,
    version: uploadResponse.version,
    createdAt: uploadResponse.created_at,
  };
};
