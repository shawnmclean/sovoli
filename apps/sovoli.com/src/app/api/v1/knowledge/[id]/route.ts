import type { User } from "@sovoli/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@sovoli/auth";

import { updateKnowledge } from "~/services/knowledge/updateKnowledge";
import { PutKnowledgeSchemaRequest } from "~/tsr/router/knowledge/knowledgeContract";
import { getBaseUrl } from "~/utils/getBaseUrl";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  return auth(async (authreq: unknown & { auth?: { user?: User } }) => {
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
      return {
        status: 200,
        body: response,
      };
    } catch {
      return NextResponse.json(
        { error: "Failed to create knowledge" },
        { status: 500 },
      );
    }
  })(req, { params }) as Promise<Response>;
}
