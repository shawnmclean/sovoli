"use server";

import { redirect, unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";
import { db, schema } from "@sovoli/db";
import {
  KnowledgeMediaAssetPlacement,
  MediaAssetHost,
} from "@sovoli/db/schema";

import { auth } from "~/core/auth";
import { env } from "~/env";
import { slugify } from "~/utils/slugify";
import { formUpsertNoteSchema } from "./schemas";

export type State =
  | {
      status: "error";
      message: string;
      errors?: Record<string, string>;
    }
  | {
      status: "success";
      id: string;
      slug: string;
    }
  | null;

const validator = withZod(formUpsertNoteSchema);

export async function upsertNoteAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    unauthorized();
  }

  const result = await validator.validate(formData);
  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const [createdKnowledge] = await db
    .insert(schema.Knowledge)
    .values({
      userId: session.userId,
      title: result.data.title,
      description: result.data.description,
      slug: result.data.title ? slugify(result.data.title) : "",
      content: result.data.content,
      isOrigin: true,
    })
    .returning();

  if (!createdKnowledge) {
    return {
      status: "error",
      message: "Failed to create knowledge",
    };
  }

  if (result.data.assets) {
    const assets = result.data.assets.map((asset) => {
      return {
        id: asset.id,
        uploaderUserId: session.userId,
        host: MediaAssetHost.Cloudinary,
        bucket: env.SUPABASE_MEDIA_BUCKET,
      };
    });

    await db.insert(schema.MediaAsset).values(assets);

    const knowledgeAssets = result.data.assets.map((asset) => {
      return {
        knowledgeId: createdKnowledge.id,
        mediaAssetId: asset.id,
        placement: KnowledgeMediaAssetPlacement.cover,
      };
    });
    await db.insert(schema.KnowledgeMediaAsset).values(knowledgeAssets);
  }

  redirect(`/${session.user?.username}/${createdKnowledge.slug}`);
}
