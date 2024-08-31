import type { TSRContext } from "@sovoli/api/tsr";
import { contract, router } from "@sovoli/api/tsr";
import { auth } from "@sovoli/auth";
import { fetchRequestHandler, tsr } from "@ts-rest/serverless/fetch";

const handler = auth((request: Request) => {
  return fetchRequestHandler({
    request,
    contract,
    router,
    options: {
      basePath: "/api/v1",
      jsonQuery: true,
      responseValidation: true,
      requestMiddleware: [
        // see: https://ts-rest.com/docs/serverless/options#middleware
        tsr.middleware<TSRContext>(async (req) => {
          // TODO: We know this works if the browser is authenticated via cookies,
          // TODO: so we need to check to ensure that if the request is coming from Expo or 3rd party, that we are evaluating the bearer token
          req.session = await auth();
        }),
      ],
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
