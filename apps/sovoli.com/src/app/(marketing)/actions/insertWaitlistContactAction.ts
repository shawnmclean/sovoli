"use server";

import { redirect } from "next/navigation"; // <-- import redirect
import { withZod } from "@rvf/zod";
import { db, schema } from "@sovoli/db";

import { formInsertWaitlistContactSchema } from "./schemas";

const validator = withZod(formInsertWaitlistContactSchema);
export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;
export async function insertWaitlistContactAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const result = await validator.validate(formData);

  if (result.error) {
    return {
      status: "error",
      message: "Validation failed",
      errors: result.error.fieldErrors,
    };
  }

  const { mode, contactValue } = result.data;

  const [contact] = await db
    .insert(schema.WaitlistContacts)
    .values({
      mode,
      contactValue,
    })
    .returning();

  if (!contact) {
    return {
      status: "error",
      message: "Failed to create waitlist contact",
    };
  }

  // 🚀 Perform server-side redirect
  redirect(`/surveys?mode=${mode}&contactValue=${contactValue}`);
}
