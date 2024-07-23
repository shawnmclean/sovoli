import { z } from "zod";

export const ZUnsuccessfulResponseSchema = z.object({
  message: z.string(),
});
