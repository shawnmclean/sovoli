import { generateText } from "ai";

export async function GET() {
  const result = await generateText({
    model: "xai/grok-3",
    prompt: "Tell me the history of the San Francisco Mission-style burrito.",
  });
  return Response.json(result);
}
