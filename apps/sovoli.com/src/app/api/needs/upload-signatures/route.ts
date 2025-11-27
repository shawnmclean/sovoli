import { NextResponse } from "next/server";
import { z } from "zod";

import { generateUploadSignatures } from "~/core/cloudinary/generateUploadSignatures";

const requestSchema = z
  .object({
    count: z.number().int().min(1).max(20).optional(),
    username: z.string().optional(),
    resourceType: z.enum(["image", "video", "auto"]).optional(),
    mediaMetadata: z.boolean().optional(),
  })
  .optional();

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as z.infer<typeof requestSchema>;
    const parsedBody = requestSchema.parse(body);
    const count = parsedBody?.count ?? 1;
    const username = parsedBody?.username;
    const signatures = generateUploadSignatures({
      count,
      folder: `o/${username}/projects`,
      resourceType: parsedBody?.resourceType,
      mediaMetadata: parsedBody?.mediaMetadata,
    });

    return NextResponse.json(signatures);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request payload", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to generate upload signatures" },
      { status: 500 },
    );
  }
}
