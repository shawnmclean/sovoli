import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { createKnowledge } from "../../../services/knowledge";
import { updateKnowledge } from "../../../services/knowledge/updateKnowledge";
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
      .handler(async ({ body, params: { id } }, { request: { user } }) => {
        const knowledge = await updateKnowledge({
          knowledgeId: id,
          knowledge: body,
          authUserId: user.id,
        });

        const response = {
          ...knowledge,
          url: `${getBaseUrl()}/${user.username}/${knowledge.slug}`,
        };

        console.log(response);
        return {
          status: 200,
          body: response,
        };
      }),
  );
