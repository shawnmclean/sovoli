import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "~/core/auth";
import { generateUploadSignatures } from "~/modules/mediaAssets/lib/generateUploadSignatures";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const ctxParams = await params;
  return auth((authreq) => {
    const user = authreq.auth?.user;
    if (!user)
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );

    try {
      const signatures = generateUploadSignatures();

      return NextResponse.json(signatures);
    } catch (error) {
      return NextResponse.json({ message: error }, { status: 500 });
    }
  })(req, { params: ctxParams });
};
