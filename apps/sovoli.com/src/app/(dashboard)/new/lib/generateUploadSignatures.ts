import "server-only";

import { createId } from "@paralleldrive/cuid2";
import { v2 as cloudinary } from "cloudinary";

import { env } from "~/env";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadSignature {
  id: string;
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export const generateUploadSignatures = (count = 1): UploadSignature[] => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signatures: UploadSignature[] = [];

  for (let index = 0; index < count; index++) {
    const id = createId();
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        public_id: id,
        folder: env.SUPABASE_MEDIA_BUCKET,
      },
      env.CLOUDINARY_API_SECRET,
    );
    signatures.push({
      id,
      signature,
      timestamp,
      folder: env.SUPABASE_MEDIA_BUCKET,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
  }

  return signatures;
};
