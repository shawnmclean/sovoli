import { NextResponse } from "next/server";
import { z } from "zod";

import { generateUploadSignatures } from "~/core/cloudinary/generateUploadSignatures";

const requestSchema = z
  .object({
    count: z.number().int().min(1).max(20).optional(),
  })
  .optional();

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsedBody = requestSchema.parse(body);
    const count = parsedBody?.count ?? 1;

    const signatures = generateUploadSignatures({ count });

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
