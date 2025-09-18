import { streamText } from "ai";

export const maxDuration = 30;

export function GET() {
  const result = streamText({
    model: "gpt-4o",
    prompt: "Hello, how are you?",
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
  return result.toUIMessageStreamResponse();
}
