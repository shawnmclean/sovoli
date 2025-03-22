import type { UploadSignature } from "./generateUploadSignatures";

interface CloudinaryUploadResponse {
  asset_id: string;
  public_id: string;
  url: string;
  secure_url: string; // Added this field as Cloudinary returns it
}

export interface UploadedAsset {
  id: string;
  url: string;
}

/**
 * Uploads a file to Cloudinary with the given signature.
 * @param file - The file to upload
 * @param signature - The Cloudinary upload signature
 * @returns Promise resolving to the uploaded asset details
 * @throws Error if the upload fails
 */
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

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Failed to upload file: ${response.status} ${response.statusText} - ${errorData}`,
      );
    }

    const uploadResponse = (await response.json()) as CloudinaryUploadResponse;

    // Use secure_url if available, otherwise fall back to url
    const assetUrl = uploadResponse.secure_url || uploadResponse.url;

    return {
      id: signature.id,
      url: assetUrl,
    };
  } catch (error) {
    // Re-throw with more context if it's not already an Error
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Upload failed: ${String(error)}`);
  }
};
