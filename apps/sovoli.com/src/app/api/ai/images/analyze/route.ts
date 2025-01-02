import type { NextRequest } from "next/server";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const model = google("gemini-1.5-flash");

const formRequestBodySchema = z.object({
  url: z.string().url(),
});

export async function POST(req: NextRequest): Promise<Response> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const bodyRaw = await req.json();
  const body = formRequestBodySchema.parse(bodyRaw);

  const imageUrl = body.url;

  const { object } = await generateObject({
    model: model,
    schema: z.object({
      page: z.number().optional(),
      chapter: z.string().optional(),
      highlights: z.string().array(),
    }),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
            This is an image of a page from a book.
            The chapter is displayed at the top of the page. If you cannot determine page or chapter, leave it.
            It should contain highlighted text, which may include a word, a phrase, a sentence, multiple sentences, or a paragraph.
            Separate each highlight into distinct entries if there is a natural or logical boundary, such as the end of a sentence or a clear change in context.
            If a highlight spans multiple sentences, group them together into one entry only if they are part of the same continuous thought or context, and there is no visible separation.
            `,
          },
          {
            type: "image",
            image: imageUrl,
          },
        ],
      },
    ],
  });
  console.log(object);

  return new Response(JSON.stringify(object), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
