import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRAuthContext } from "../../types";
import { authMiddleware } from "../authMiddleware";
import { chatGPTContract } from "./chatGPTContract";

export const chatGPTRouter = tsr
  .platformContext<PlatformContext>()
  .routerBuilder(chatGPTContract)
  .routeWithMiddleware("createResearchCollection", (routerBuilder) =>
    routerBuilder
      .middleware<TSRAuthContext>(authMiddleware)
      .handler(async ({ body }) => {
        return Promise.resolve({
          status: 200,
          body: {
            items: body.openaiFileIdRefs,
            books: body.books,
          },
        });
      }),
  );
