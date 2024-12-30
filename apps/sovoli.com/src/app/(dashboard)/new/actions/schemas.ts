import { z } from "zod";

/**
 * For usage with the form action and form
 */
export const formNewNoteSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
});
export type FormNewNoteSchema = z.infer<typeof formNewNoteSchema>;

const imageFileSchema = z.instanceof(File).refine(
  (file) => {
    return file.type === "image/png" || file.type === "image/jpeg";
  },
  {
    message: "File must be an image",
  },
);

export const formNewHighlightSchema = z.object({
  image: imageFileSchema,
});
export type FormNewHighlightSchema = z.infer<typeof formNewHighlightSchema>;
