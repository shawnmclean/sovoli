import { getProgramSuggestions } from "~/modules/chat/lib/getProgramSuggestions";
import { withOrgInstance } from "~/app/api/lib/withOrgInstance";

export const maxDuration = 30;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes?: string;
}

export const POST = withOrgInstance(
  async (request, { orgInstance, tenant }) => {
    const body = (await request.json()) as {
      familyMembers: FamilyMember[];
    };

    const { familyMembers } = body;

    const programs = orgInstance.academicModule?.programs ?? [];
    const suggestions = getProgramSuggestions(programs, familyMembers);

    return Response.json({ suggestions, tenant });
  },
);
