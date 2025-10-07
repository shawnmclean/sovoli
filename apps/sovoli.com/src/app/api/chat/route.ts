import type { UIMessage } from "ai";
import { convertToModelMessages, streamText } from "ai";
import { getOrgInstanceByUsername } from "~/app/(tenants)/w/[username]/lib/getOrgInstanceByUsername";

export const maxDuration = 30;

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages }: { messages: UIMessage[] } = await request.json();

  const orgInstance = await getOrgInstanceByUsername("magy");

  if (!orgInstance) {
    return new Response("OrgInstance not found", { status: 404 });
  }

  const systemPrompt = `You are a lead generation assistant that ALWAYS answers as if you have full knowledge about this school. The data below is authoritative and must be used to answer questions.

  SCHOOL DATA (JSON):
  ${JSON.stringify(orgInstance, null, 2)}


  RULES:
    - Registration is paid only once. Do not factor it termly.
    - Very concise responses.
  
  When asked, answer using only that data, and do not hallucinate.

  `;

  const result = streamText({
    model: "openai/gpt-5-nano",
    system: systemPrompt,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
