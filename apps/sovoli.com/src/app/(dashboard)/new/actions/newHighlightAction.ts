"use server";

import { unauthorized } from "next/navigation";
import { google } from "@ai-sdk/google";
import { withZod } from "@rvf/zod";
import { auth } from "@sovoli/auth";
import { generateObject, generateText } from "ai";
import { z } from "zod";

import { formNewHighlightSchema } from "./schemas";

const model = google("gemini-1.5-flash");

export type State = {
  status: "error";
  message: string;
  errors?: Record<string, string>;
} | null;

const validator = withZod(formNewHighlightSchema);

export async function newHighlightAction(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const session = await auth();
  if (!session) {
    unauthorized();
  }

  const result = await validator.validate(formData);

  if (result.error) {
    return {
      status: "error",
      message: "Failed to create note",
      errors: result.error.fieldErrors,
    };
  }

  const image = result.data.image;

  const fileBuffer = await image.arrayBuffer();
  // const aiResponse = await generateText({
  //   model: model,
  //   messages: [
  //     {
  //       role: "user",
  //       content: [
  //         {
  //           type: "text",
  //           text: "What are the highlighted words from this image?",
  //         },
  //         {
  //           type: "image",
  //           image: fileBuffer,
  //         },
  //       ],
  //     },
  //   ],
  // });

  const { object } = await generateObject({
    model: model,
    schema: z.object({
      page: z.number(),
      chapter: z.string(),
      highlights: z.string().array(),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Look at this image of a page from a book and tell me what the highlighted words are. 
            They will be highlighted with a marker or a pen. The sentences should make sense and follow line breaks properly.`,
          },
          {
            type: "image",
            image: fileBuffer,
          },
        ],
      },
    ],
  });
  console.log(object);

  return {
    status: "error",
    message: object.highlights.join(", "),
  };
}
