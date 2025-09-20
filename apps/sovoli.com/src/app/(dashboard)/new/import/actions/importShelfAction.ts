"use server";

import { redirect } from "next/navigation";
import type { FieldErrors } from "@rvf/core";
import { parseFormData } from "@rvf/core";

import { auth } from "~/core/auth";
import { CreateShelfImport } from "~/services/import/createShelfImport";
import { formImportShelfSchema } from "./schemas";

export type State = {
  status: "error";
  message: string;
  errors?: FieldErrors;
} | null;

export async function importShelfAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "You must be logged in to import shelves",
    };
  }

  const result = await parseFormData(formData, formImportShelfSchema);

  if (result.error) {
    console.error(result.error.fieldErrors);
    return {
      status: "error",
      message: "Failed to import shelves",
      errors: result.error.fieldErrors,
    };
  }

  const file = result.data.csvFile;
  const csvContent = await file.text();

  const createShelfImport = new CreateShelfImport();
  await createShelfImport.call({
    authUserId: session.userId,
    mapping: result.data.mapping,
    csvContent: csvContent,
  });
  redirect("/settings/imports");
}
