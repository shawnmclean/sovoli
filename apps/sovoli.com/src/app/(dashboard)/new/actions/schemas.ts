import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const formNewNoteSchema = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
});
export type FormNewNoteSchema = z.infer<typeof formNewNoteSchema>;
