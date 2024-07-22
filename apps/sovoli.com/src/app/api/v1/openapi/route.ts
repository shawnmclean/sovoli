import { openApiDocument } from "./openApiDocument";

export async function GET() {
  return Response.json(openApiDocument);
}
