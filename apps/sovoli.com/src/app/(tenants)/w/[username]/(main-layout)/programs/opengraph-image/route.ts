import type { NextRequest } from "next/server";
import OpenGraphImage from "../opengraph-image";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  // Call the existing OpenGraph image component
  return OpenGraphImage({ params });
}
