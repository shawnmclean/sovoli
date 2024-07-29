import { z } from "zod";

export const ImageSchema = z.object({
  url: z.string(),
});

export type Image = z.infer<typeof ImageSchema>;
