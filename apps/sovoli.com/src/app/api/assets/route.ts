import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { db, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { v2 as cloudinary } from "cloudinary";

import { auth } from "~/core/auth";
import { env } from "~/env";
import { createSignedUrlRequestBodySchema } from "./schema";

cloudinary.config({
  cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const ctxParams = await params;
  return auth(async (authreq) => {
    const user = authreq.auth?.user;
    if (!user)
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const bodyRaw = await authreq.json();
      const body = createSignedUrlRequestBodySchema.parse(bodyRaw);

      const id = createId();
      const fileExt = body.fileName.split(".").pop();
      if (!fileExt) {
        return NextResponse.json(
          { message: "File extension is required" },
          { status: 400 },
        );
      }

      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = cloudinary.utils.api_sign_request(
        {
          timestamp: timestamp,
          public_id: id,
          folder: env.SUPABASE_MEDIA_BUCKET,
        },
        env.CLOUDINARY_API_SECRET,
      );

      const [createdMedia] = await db
        .insert(schema.MediaAsset)
        .values({
          id,
          uploadedUserId: user.id,
          host: MediaAssetHost.Cloudinary,
          bucket: env.SUPABASE_MEDIA_BUCKET,
          mimeType: body.type,
        })
        .returning();

      if (!createdMedia) {
        return NextResponse.json(
          { message: "Failed to create media asset" },
          { status: 500 },
        );
      }

      return NextResponse.json({
        signature,
        timestamp,
        id: createdMedia.id,
        cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        folder: env.SUPABASE_MEDIA_BUCKET,
      });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  })(req, { params: ctxParams });
};
