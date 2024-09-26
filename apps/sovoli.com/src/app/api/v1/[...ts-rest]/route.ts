import type { PlatformContext, TSRGlobalContext } from "@sovoli/api/tsr";
import type { FetchHandlerOptions } from "@ts-rest/serverless/fetch";
import { contract, router } from "@sovoli/api/tsr";
import { auth, validateToken } from "@sovoli/auth";
import { fetchRequestHandler } from "@ts-rest/serverless/fetch";

export const dynamic = "force-dynamic";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Credentials", "true");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const options = {
  jsonQuery: true,
  responseValidation: true,
  basePath: "/api/v1",
} as FetchHandlerOptions<PlatformContext, TSRGlobalContext>;

const handler = auth(async (request) => {
  // if req.auth is null, authjs only checks the cookies, we need to check the auth header
  if (!request.auth) {
    const authToken = request.headers.get("Authorization");
    if (authToken) {
      const sessionToken = authToken.slice("Bearer ".length);
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
