import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import type { PostKnowledgeSchemaRequest } from "./knowledgeContract";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

function createKnowledge(knowledge: PostKnowledgeSchemaRequest) {
  console.log(JSON.stringify(knowledge, null, 2));
}

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        createKnowledge(body);
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name,
            username: user.username,
          },
        });
      }),
  );
