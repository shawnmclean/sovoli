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
            Extract the page and the chaper name from the image.
            It should contain user highlighted text, which may include a word, a phrase, a sentence, multiple sentences, or a paragraph.
            Separate each highlight into distinct entries if there is a natural or logical boundary, such as the end of a sentence or a clear change in context.
            Only extract the text if they are highlighted in the image or underlined. 
            If the text is not highlighted or underlined, do not extract it. Do not extract text that are in quotes by the default print.
            Compared the extracted text to the image to ensure that the text was acrruely highlighted.
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
