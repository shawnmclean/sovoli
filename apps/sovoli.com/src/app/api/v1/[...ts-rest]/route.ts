import type { PlatformContext, TSRGlobalContext } from "@sovoli/api/tsr";
import type { FetchHandlerOptions } from "@ts-rest/serverless/fetch";
import { contract, router } from "@sovoli/api/tsr";
import { auth, validateToken } from "@sovoli/auth";
import { fetchRequestHandler } from "@ts-rest/serverless/fetch";

const options = {
  jsonQuery: true,
  responseValidation: true,
  basePath: "/api/v1",
} as FetchHandlerOptions<PlatformContext, TSRGlobalContext>;

const handler = auth(async (request) => {
  // if req.auth is null, authjs only checks the cookies, we need to check the auth header
  if (!request.auth) {
    const authToken = request.headers.get("Authorization");
    console.log("request.headers", request.headers);
    console.log("authToken", authToken);
    if (authToken) {
      const sessionToken = authToken.slice("Bearer ".length);
      console.log("sessionToken", sessionToken);
      request.auth = await validateToken(sessionToken);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
