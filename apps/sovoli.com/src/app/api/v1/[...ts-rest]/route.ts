import type { PlatformContext, TSRGlobalContext } from "@sovoli/api/tsr";
import type { FetchHandlerOptions } from "@ts-rest/serverless/fetch";
import { contract, router } from "@sovoli/api/tsr";
import { auth } from "@sovoli/auth";
import { fetchRequestHandler } from "@ts-rest/serverless/fetch";

const options = {
  jsonQuery: true,
  responseValidation: true,
  basePath: "/api/v1",
} as FetchHandlerOptions<PlatformContext, TSRGlobalContext>;

const handler = auth((request) => {
  return fetchRequestHandler({
    request,
    contract,
    router,
    options,
    platformContext: {
      auth: request.auth,
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
