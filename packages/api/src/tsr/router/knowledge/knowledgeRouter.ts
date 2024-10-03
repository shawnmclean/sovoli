import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { createKnowledge } from "../../../services/knowledge";
import { getBaseUrl } from "../../../utils/getBaseUrl";
import { authMiddleware } from "../authMiddleware";
import { knowledgeContract } from "./knowledgeContract";

export const knowledgeRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(knowledgeContract)
  .routeWithMiddleware("postKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }, { request: { user } }) => {
        if (!user.id) {
          throw new Error("user must be authenticated");
        }

        const { knowledge, authToken } = await createKnowledge({
          knowledge: body,
          authUserId: user.id,
        });

        const response = {
          ...knowledge,
          url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
          authToken,
        };
        return {
          status: 200,
          body: response,
        };
      }),
  )
  .routeWithMiddleware("putKnowledge", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(({ body }, { request: { user } }) => {
        console.log(body, user);
        throw new Error("Not implemented");
      }),
  );
