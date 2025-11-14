import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { v2 as cloudinary } from "cloudinary";

import { env } from "~/env";

const DEFAULT_UPLOAD_FOLDER = "tmp";

let isConfigured = false;

const configureCloudinary = () => {
  if (isConfigured) return;

  cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  isConfigured = true;
};

export interface UploadSignature {
  id: string;
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export interface GenerateUploadSignaturesOptions {
  count?: number;
  folder?: string;
}

export const generateUploadSignatures = ({
  count = 1,
  folder = DEFAULT_UPLOAD_FOLDER,
}: GenerateUploadSignaturesOptions = {}): UploadSignature[] => {
  configureCloudinary();

  const timestamp = Math.round(Date.now() / 1000);
  const signatures: UploadSignature[] = [];

  for (let index = 0; index < count; index += 1) {
    const id = createId();
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        public_id: id,
        folder,
      },
      env.CLOUDINARY_API_SECRET,
    );

    signatures.push({
      id,
      signature,
      timestamp,
      folder,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  }

  return signatures;
};
