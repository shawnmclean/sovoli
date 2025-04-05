"use server";

import { withZod } from "@rvf/zod";
import { db, schema } from "@sovoli/db";
import {
  KnowledgeMediaAssetPlacement,
  MediaAssetHost,
} from "@sovoli/db/schema";

import { auth } from "~/core/auth";
import { env } from "~/env";
import { slugify } from "~/utils/slugify";
import { formCreateDraftKnowledgeSchema } from "./schemas";

export type State =
  | {
      status: "error";
      message: string;
      errors?: Record<string, string>;
    }
  | {
      status: "success";
      id: string;
      slug?: string | null;
    }
  | null;

const validator = withZod(formCreateDraftKnowledgeSchema);

export async function createDraftKnowledgeAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const result = await validator.validate(formData);
  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const { title, description, content, assets } = result.data;
  const slug = title ? slugify(title) : "";

  const [knowledge] = await db
    .insert(schema.Knowledge)
    .values({
      userId: session.userId,
      title,
      description,
      content,
      slug,
      isOrigin: true,
    })
    .returning();

  if (!knowledge) {
    return {
      status: "error",
      message: "Failed to create draft",
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
      knowledgeId: knowledge.id,
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
    id: knowledge.id,
    slug: knowledge.slug,
  };
}
