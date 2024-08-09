import { contract, router } from "@sovoli/api/tsr";
import { createNextHandler } from "@ts-rest/serverless/next";

const handler = createNextHandler(contract, router, {
  handlerType: "app-router",
  basePath: "/api/v1",
  jsonQuery: true,
  responseValidation: true,
});

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
