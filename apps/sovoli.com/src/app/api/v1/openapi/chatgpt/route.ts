import { upgrade } from "@scalar/openapi-parser";

import { openApiDocument } from "./openApiDocument";

const openApiDoc = upgrade(openApiDocument);

export function GET() {
  return Response.json(openApiDoc.specification);
}
