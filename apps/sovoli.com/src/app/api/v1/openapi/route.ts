import { generateOpenApi } from "@ts-rest/open-api";
import { contract } from "@sovoli/api/rest";
import { getBaseUrl } from "~/utils/getBaseUrl";

const openApiDocument = generateOpenApi(contract, {
  info: {
    title: "Sovoli API",
    version: "1.0.0",
  },
});

openApiDocument.servers = [
  {
    url: `${getBaseUrl()}/api/v1`,
    description: "Sovoli API",
  },
];

export async function GET() {
  return Response.json(openApiDocument);
}
