import type { UploadSignature } from "./generateUploadSignatures";

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  secure_url?: string;
  url: string;
}

export interface UploadedAsset {
  id: string;
  url: string;
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
  const url = uploadResponse.secure_url ?? uploadResponse.url;

  return {
    id: uploadResponse.public_id,
    url,
  };
};
