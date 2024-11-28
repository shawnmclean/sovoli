import { validateToken } from "@sovoli/auth";
import { tsr } from "@ts-rest/serverless/fetch";

import type { PlatformContext, TSRGlobalContext } from "./types";
import { contract } from "./contract";
import { knowledgeRouter } from "./router/knowledge/knowledgeRouter";

export const router = tsr
  .platformContext<PlatformContext>()
  .routerBuilder<typeof contract>(contract)
  .requestMiddleware<TSRGlobalContext>(async (req, { auth }) => {
    // auth object may come from the platform context via authjs resolving the cookies
    if (auth) {
      req.session = auth;
    } else {
      // pull the sessionid from the bearer token and validate it
      const authToken = req.headers.get("Authorization");
      if (authToken) {
        const sessionToken = authToken.slice("Bearer ".length);
        req.session = await validateToken(sessionToken);
      }
    }
  })
  .subRouter("knowledge", knowledgeRouter);
