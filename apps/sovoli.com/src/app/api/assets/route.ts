import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createId } from "@paralleldrive/cuid2";
import { db, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";

import { auth } from "~/core/auth";
import { env } from "~/env";
import { createSignedUrlRequestBodySchema } from "./schema";

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

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
      const newFilename = `${id}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(env.SUPABASE_MEDIA_BUCKET)
        .createSignedUploadUrl(newFilename);

      if (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
      }

      const [createdMedia] = await db
        .insert(schema.MediaAsset)
        .values({
          id,
          uploadedUserId: user.id,
          host: MediaAssetHost.Supabase,
          bucket: env.SUPABASE_MEDIA_BUCKET,
          path: data.path,
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
        signedUrl: data.signedUrl,
        id: createdMedia.id,
        url: `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_MEDIA_BUCKET}/${createdMedia.path}`,
        path: createdMedia.path,
      });
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  })(req, { params: ctxParams });
};
