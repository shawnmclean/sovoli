import { ApiReference } from "@scalar/nextjs-api-reference";

import { specification } from "../openapi/openApiDocument";

const config = {
  spec: {
    content: specification,
  },
};

export const GET = ApiReference(config);
