import { openApiDocument } from "./openApiDocument";

export function GET() {
  return Response.json(openApiDocument);
}
