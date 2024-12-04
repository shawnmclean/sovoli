"use server";

import { revalidatePath } from "next/cache";
import { createId } from "@paralleldrive/cuid2";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";
import { db, eq, schema } from "@sovoli/db";
import { MediaAssetHost } from "@sovoli/db/schema";
import { createClient } from "@supabase/supabase-js";

import { Logger } from "~/core/logger/Logger";
import { env } from "~/env";
import { formUpdateMediaAssetSchema } from "./schemas";

export type State = {
  status: "error" | "success";
  message: string;
  errors?: Record<string, string>;
} | null;

const logger = new Logger();
const validator = withZod(formUpdateMediaAssetSchema);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export async function updateMediaAssetAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  logger.debug("running updateMediaAssetAction");
  console.log("running updateMediaAssetAction");
  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "You must be logged in to update the knowledge's media assets",
    };
  }

  const result = await validator.validate(formData);
  console.log(result);
  if (result.error) {
    console.error(result.error.fieldErrors);
    return {
      status: "error",
      message: "Failed to update media assets",
      errors: result.error.fieldErrors,
    };
  }

  const knowledge = await db.query.Knowledge.findFirst({
    where: eq(schema.Knowledge.id, result.data.knowledgeId),
  });
  if (!knowledge) {
    return {
      status: "error",
      message: "Failed to update media assets",
      errors: { knowledgeId: "Knowledge not found" },
    };
  }

  if (knowledge.userId !== session.userId) {
    return {
      status: "error",
      message: "Failed to update media assets",
      errors: { knowledgeId: "You are not the owner of this knowledge" },
    };
  }

  const file = result.data.image;
  const fileBuffer = await file.arrayBuffer();
  const newFilename = `${createId()}.${file.name.split(".").pop()}`;
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_MEDIA_BUCKET)
    .upload(newFilename, fileBuffer, {
      contentType: file.type,
    });

  if (error) {
    return {
      status: "error",
      message: "Failed to upload file, try again",
    };
  }

  await db.insert(schema.MediaAsset).values({
    knowledgeId: result.data.knowledgeId,
    bucket: env.SUPABASE_MEDIA_BUCKET,
    path: data.path,
    mimeType: file.type,
    host: MediaAssetHost.Supabase,
  });

  revalidatePath("/[username]/shelves", "page");

  return {
    status: "success",
    message: "Media asset updated",
  };
}
