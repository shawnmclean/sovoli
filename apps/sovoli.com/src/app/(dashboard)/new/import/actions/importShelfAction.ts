"use server";

import { redirect } from "next/navigation";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";

import { CreateShelfImport } from "~/services/import/createShelfImport";
import { formImportShelfSchema } from "./schemas";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formImportShelfSchema);

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

  const result = await validator.validate(formData);

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
