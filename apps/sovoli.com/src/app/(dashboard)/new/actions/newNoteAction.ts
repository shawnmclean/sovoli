"use server";

import { redirect, unauthorized } from "next/navigation";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";
import { db, schema } from "@sovoli/db";

import { slugify } from "~/utils/slugify";
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

  const [createdKnowledge] = await db
    .insert(schema.Knowledge)
    .values({
      userId: session.userId,
      title: result.data.title,
      description: result.data.description,
      slug: result.data.title ? slugify(result.data.title) : "",
      content: result.data.content,
      isOrigin: true,
    })
    .returning();

  if (!createdKnowledge) {
    return {
      status: "error",
      message: "Failed to create knowledge",
    };
  }

  redirect(`/${session.user?.username}/${createdKnowledge.slug}`);
}
