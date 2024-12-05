import { z } from "zod";

const imageFileSchema = z.instanceof(File).refine(
  (file) => {
    return file.type === "image/png" || file.type === "image/jpeg";
  },
  {
    message: "File must be an image",
  },
);

/**
 * For usage with the form action and form
 */
export const formUpdateMediaAssetSchema = z.object({
  knowledgeId: z.string(),
  image: imageFileSchema,
});
