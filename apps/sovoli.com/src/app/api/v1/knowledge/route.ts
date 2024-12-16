import { NextResponse } from "next/server";
import { auth } from "@sovoli/auth";

import { createKnowledge } from "~/services/knowledge/createKnowledge";
import { PostKnowledgeSchemaRequest } from "~/tsr/router/knowledge/knowledgeContract";
import { getBaseUrl } from "~/utils/getBaseUrl";

export const POST = auth(async (request) => {
  const user = request.auth?.user;

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const bodyRaw = await request.json();
    const body = PostKnowledgeSchemaRequest.parse(bodyRaw);

    const { knowledge, authToken } = await createKnowledge({
      knowledge: body,
      authUserId: user.id,
    });

    const response = {
      ...knowledge,
      url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
      authToken,
    };
    return NextResponse.json(response, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create knowledge" },
      { status: 500 },
    );
  }
});
