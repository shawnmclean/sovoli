"use server";

import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";
import { db, eq, schema } from "@sovoli/db";

import { auth } from "~/core/auth";
import { updateContentSchema } from "./schemas";

export type State = {
  status: "error" | "success";
  message?: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(updateContentSchema);

export async function updateContentAction(
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
      message: "Failed to create note",
      errors: result.error.fieldErrors,
    };
  }

  await db
    .update(schema.Knowledge)
    .set({
      description: result.data.description,
      content: result.data.content
    })
    .where(eq(schema.Knowledge.id, result.data.id));

  revalidatePath("[username]/[slug]", "page");

  return { status: "success" };
}
