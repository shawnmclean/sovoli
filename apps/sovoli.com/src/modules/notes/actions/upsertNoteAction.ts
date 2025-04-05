"use server";

import { unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";

import { auth } from "~/core/auth";
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

  return {
    status: "error",
    message: "Failed to create note",
  };
}
