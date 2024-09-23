import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import type { PostKnowledgeSchemaRequest } from "./knowledgeContract";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

interface BaseOptions {
  authUserId?: string;
}

interface CreateKnowledgeOptions extends BaseOptions {
  knowledge: PostKnowledgeSchemaRequest;
}

function createKnowledge(knowledge: CreateKnowledgeOptions) {
  console.log(JSON.stringify(knowledge, null, 2));
}

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        createKnowledge({ knowledge: body, authUserId: user.id });
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name,
            username: user.username,
          },
        });
      }),
  );
