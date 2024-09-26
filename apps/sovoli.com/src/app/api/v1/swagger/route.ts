import { ApiReference } from "@scalar/nextjs-api-reference";

import { specification } from "../openapi/openApiDocument";

const config = {
  spec: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    content: specification,
  },
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const GET = ApiReference(config);
