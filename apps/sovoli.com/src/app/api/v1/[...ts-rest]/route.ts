import type { TSRContext, TSRGlobalContext } from "@sovoli/api/tsr";
import { contract, router } from "@sovoli/api/tsr";
import { auth } from "@sovoli/auth";
import {
  FetchHandlerOptions,
  fetchRequestHandler,
  tsr,
} from "@ts-rest/serverless/fetch";

const options = {
  jsonQuery: true,
  responseValidation: true,
  cors: {
    origin: ["http://localhost"],
    credentials: true,
  },
} as FetchHandlerOptions<TSRGlobalContext, TSRContext>;

const handler = auth(async (request) => {
  console.log("route handle session", request.auth);
  return fetchRequestHandler({
    request,
    contract,
    router,
    options,
    platformContext: {
      session: request.auth,
    },
  });
});

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
