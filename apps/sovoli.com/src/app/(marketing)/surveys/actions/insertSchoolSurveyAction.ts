"use server";

import { redirect } from "next/navigation";
import { withZod } from "@rvf/zod";
import { db, schema } from "@sovoli/db";

import { formInsertSchoolSurveySchema } from "./schemas";

const validator = withZod(formInsertSchoolSurveySchema);

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

export async function insertSchoolSurveyAction(
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

  const data = result.data;

  const [survey] = await db
    .insert(schema.SchoolSurvey)
    .values(data)
    .returning();

  if (!survey) {
    return {
      status: "error",
      message: "Failed to create school survey entry",
    };
  }

  // ✅ Redirect to confirmation page
  redirect(`/thank-you?school=${encodeURIComponent(data.schoolName)}`);
}
