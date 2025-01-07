"use server";

import { unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";
import { db, eq, schema } from "@sovoli/db";

import { auth } from "~/core/auth";
import { updateTitleFormSchema } from "./schemas";

export type State = {
  status: "error" | "success";
  message?: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(updateTitleFormSchema);

export async function updateTitleAction(
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
      title: result.data.title,
    })
    .where(eq(schema.Knowledge.id, result.data.id));

  return {
    status: "success",
  };
}
