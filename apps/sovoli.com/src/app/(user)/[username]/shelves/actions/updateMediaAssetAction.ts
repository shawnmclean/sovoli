"use server";

import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";

import { formUpdateMediaAssetSchema } from "./schemas";

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formUpdateMediaAssetSchema);

export async function updateMediaAssetAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    return {
      status: "error",
      message: "You must be logged in to update the knowledge's media assets",
    };
  }

  const result = await validator.validate(formData);

  if (result.error) {
    console.error(result.error.fieldErrors);
    return {
      status: "error",
      message: "Failed to update media assets",
      errors: result.error.fieldErrors,
    };
  }

  // TODO: can user update media assets for the knowledge?
  console.log("result", result);

  throw new Error("Not implemented");
}
