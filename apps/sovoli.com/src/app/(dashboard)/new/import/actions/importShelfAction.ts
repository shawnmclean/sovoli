"use server";

import { z } from "zod";

const importShelfSchema = z.object({
  shelves: z
    .array(
      z.object({
        name: z.string().min(10),
      }),
    )
    .min(1),
});

// eslint-disable-next-line @typescript-eslint/require-await
export async function importShelfAction(formData: FormData) {
  const validatedFields = importShelfSchema.safeParse({
    shelves: formData.getAll("shelves"),
  });

  console.log(validatedFields);
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  console.log(formData);
}
