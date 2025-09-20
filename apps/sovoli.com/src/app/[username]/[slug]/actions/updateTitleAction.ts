"use server";

import { revalidatePath } from "next/cache";
import { unauthorized } from "next/navigation";
import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";
import { db, eq, schema } from "@sovoli/db";

import { auth } from "~/core/auth";
import { updateTitleFormSchema } from "./schemas";

export type State = {
  status: "error" | "success";
  message?: string;
  errors?: FieldErrors;
} | null;

export async function updateTitleAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    unauthorized();
  }

  const result = await parseFormData(formData, updateTitleFormSchema);

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
      title: result.data.title,
    })
    .where(eq(schema.Knowledge.id, result.data.id));

  revalidatePath("[username]/[slug]", "page");

  return { status: "success" };
}
