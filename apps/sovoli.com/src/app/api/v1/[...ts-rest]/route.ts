import { router, contract } from "@sovoli/api/rest";
import { createNextHandler } from "@ts-rest/serverless/next";

const handler = createNextHandler(contract, router, {
  handlerType: "app-router",
  basePath: "/api/v1",
  jsonQuery: true,
  responseValidation: true,
});

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
