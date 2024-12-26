"use server";

import { unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";

import { formNewNoteSchema } from "./schemas";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formNewNoteSchema);

export async function newNoteAction(
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

  console.log(result.data);

  throw new Error("Not implemented");
}
