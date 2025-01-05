import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "~/core/auth";
import { updateKnowledge } from "~/services/knowledge/updateKnowledge";
import { PutKnowledgeSchemaRequest } from "~/tsr/router/knowledge/knowledgeContract";
import { getBaseUrl } from "~/utils/getBaseUrl";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const ctxParams = await params;

  return auth(async (authreq) => {
    const id = (await params).id;
    const user = authreq.auth?.user;

    if (!user?.id) {
      throw new Error("Unauthorized");
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const bodyRaw = await req.json();
      const body = PutKnowledgeSchemaRequest.parse(bodyRaw);

      const knowledge = await updateKnowledge({
        knowledgeId: id,
        knowledge: body,
        authUserId: user.id,
      });

      const response = {
        ...knowledge,
        url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
      };

      return NextResponse.json(response, { status: 200 });
    } catch {
      return NextResponse.json(
        { error: "Failed to create knowledge" },
        { status: 500 },
      );
    }
  })(req, { params: ctxParams }) as Promise<Response>;
}
