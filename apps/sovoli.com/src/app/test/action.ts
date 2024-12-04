"use server";

import { withZod } from "@rvf/zod";
import { z } from "zod";

export type State = {
  message: string;
} | null;

const validator = withZod(z.object({ id: z.string() }));

export async function testAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const result = await validator.validate(formData);
  console.log(result);

  if (result.error) {
    return {
      message: "Failed to validate",
    };
  }
  return {
    message: "Hello " + result.data.id,
  };
}
