import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const formNewNoteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  assets: z.array(z.object({ id: z.string() })),
});
export type FormNewNoteSchema = z.infer<typeof formNewNoteSchema>;
