import { specification } from "./openApiDocument";

export function GET() {
  return Response.json(specification);
}
