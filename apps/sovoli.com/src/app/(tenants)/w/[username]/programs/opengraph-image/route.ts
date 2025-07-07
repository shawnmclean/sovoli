import type { NextRequest } from "next/server";
import OpenGraphImage from "../opengraph-image";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  // Call the existing OpenGraph image generator
  return OpenGraphImage({ params: Promise.resolve({ username }) });
}
