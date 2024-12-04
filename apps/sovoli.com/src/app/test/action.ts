"use server";

import { withZod } from "@rvf/zod";
import { z } from "zod";

import { Logger } from "~/core/logger/Logger";

export type State = {
  message: string;
} | null;

const validator = withZod(z.object({ id: z.string() }));
const logger = new Logger();

export async function testAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  logger.info("running testAction");
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
