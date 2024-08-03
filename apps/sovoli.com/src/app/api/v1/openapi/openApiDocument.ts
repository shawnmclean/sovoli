import { contract } from "@sovoli/api/tsr";
import { generateOpenApi } from "@ts-rest/open-api";

import { getBaseUrl } from "~/utils/getBaseUrl";

const openApiDocument = generateOpenApi(
  contract,
  {
    info: {
      title: "Sovoli API",
      version: "1.0.0",
    },
  },
  {
    setOperationId: true,
  },
);
openApiDocument.servers = [
  {
    url: `${getBaseUrl()}/api/v1`,
    description: "Sovoli API",
  },
];

export { openApiDocument };
