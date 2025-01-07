import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const updateTitleFormSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
});
export type UpdateTitleFormSchema = z.infer<typeof updateTitleFormSchema>;
