import type { UIMessage } from "ai";
import { convertToModelMessages, streamText } from "ai";
import { getOrgInstanceByUsername } from "~/app/(tenants)/w/[username]/lib/getOrgInstanceByUsername";
import { tools } from "~/modules/chat/types";

export const maxDuration = 30;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes?: string;
}

export async function POST(request: Request) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    messages,
    familyMembers = [],
  }: {
    messages: UIMessage[];
    familyMembers: FamilyMember[];
  } = await request.json();

  const orgInstance = await getOrgInstanceByUsername("magy");

  if (!orgInstance) {
    return new Response("OrgInstance not found", { status: 404 });
  }

  const familyContext =
    familyMembers.length > 0
      ? `\n\nFAMILY INFORMATION:\n${familyMembers.map((member) => `- ${member.name} (${member.relationship}, Age: ${member.age}${member.notes ? `, ${member.notes}` : ""})`).join("\n")}`
      : "";

  const systemPrompt = `You are a lead generation assistant that ALWAYS answers as if you have full knowledge about this school. The data below is authoritative and must be used to answer questions.

  FAMILY CONTEXT (latest snapshot):
  ${familyContext}

  SCHOOL DATA (JSON):
  ${JSON.stringify(orgInstance, null, 2)}


  RULES:
    - Registration is paid only once. Do not factor it termly.
    - Very concise responses.
    - Never mention children not present in the FAMILY CONTEXT.
    - If a previously seen child is missing, treat them as removed.
    - Base all reasoning only on this snapshot.

  `;

  const result = streamText({
    model: "openai/gpt-5-nano",
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools,
  });

  return result.toUIMessageStreamResponse();
}
