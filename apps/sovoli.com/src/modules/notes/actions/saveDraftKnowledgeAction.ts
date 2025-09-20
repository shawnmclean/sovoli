"use server";

import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";
import { db, eq, schema } from "@sovoli/db";
import {
  KnowledgeMediaAssetPlacement,
  MediaAssetHost,
} from "@sovoli/db/schema";

import { auth } from "~/core/auth";
import { env } from "~/env";
import { formSaveDraftKnowledgeSchema } from "./schemas";

export type State =
  | {
      status: "error";
      message: string;
      errors?: FieldErrors;
    }
  | {
      status: "success";
      id: string;
      slug?: string | null;
    }
  | null;

export async function saveDraftKnowledgeAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await parseFormData(formData, formSaveDraftKnowledgeSchema);
  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const { id, title, description, content, assets } = result.data;

  const [updated] = await db
    .update(schema.Knowledge)
    .set({
      title,
      description,
      content,
      updatedAt: new Date(),
    })
    .where(eq(schema.Knowledge.id, id))
    .returning();

  if (!updated) {
    return {
      status: "error",
      message: "Knowledge not found or update failed",
    };
  }

  if (assets?.length) {
    const mediaAssets = assets.map((asset) => ({
      id: asset.id,
      uploaderUserId: session.userId,
      host: MediaAssetHost.Cloudinary,
      bucket: env.SUPABASE_MEDIA_BUCKET,
    }));

    const links = assets.map((asset) => ({
      knowledgeId: updated.id,
      mediaAssetId: asset.id,
      placement: KnowledgeMediaAssetPlacement.cover,
    }));

    await db
      .insert(schema.MediaAsset)
      .values(mediaAssets)
      .onConflictDoNothing();
    await db
      .insert(schema.KnowledgeMediaAsset)
      .values(links)
      .onConflictDoNothing();
  }

  return {
    status: "success",
    id: updated.id,
    slug: updated.slug,
  };
}
