import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async (_, { request: { user } }) => {
        return Promise.resolve({
          status: 200,
          body: {
            name: user.name,
            username: user.username,
          },
        });
      }),
  );
