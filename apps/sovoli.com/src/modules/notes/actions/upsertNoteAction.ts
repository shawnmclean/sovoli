"use server";

import { unauthorized } from "next/navigation";

import { auth } from "~/core/auth";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

export async function upsertNoteAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    unauthorized();
  }

  console.log(formData);

  return {
    status: "error",
    message: "Failed to create note",
  };
}
