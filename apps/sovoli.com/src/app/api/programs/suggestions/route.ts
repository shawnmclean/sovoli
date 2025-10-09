import { getOrgInstanceByUsername } from "~/app/(tenants)/w/[username]/lib/getOrgInstanceByUsername";
import { getProgramSuggestions } from "~/modules/chat/lib/getProgramSuggestions";

export const maxDuration = 30;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    familyMembers: FamilyMember[];
    username?: string;
  };

  const { familyMembers, username = "magy" } = body;

  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) {
    return new Response("OrgInstance not found", { status: 404 });
  }

  const programs = orgInstance.academicModule?.programs ?? [];
  const suggestions = getProgramSuggestions(programs, familyMembers);

  return Response.json({ suggestions });
}
