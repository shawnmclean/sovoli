import type { UIMessage } from "ai";
import { convertToModelMessages, streamText } from "ai";
import { withOrgInstance } from "~/app/api/lib/withOrgInstance";
import { tools } from "~/modules/chat/types";
import { getProgramSuggestions } from "~/modules/chat/lib/getProgramSuggestions";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";
import type { Program } from "~/modules/academics/types";
import type { WorkforceMember } from "~/modules/workforce/types";

export const maxDuration = 30;

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  notes?: string;
}

// Helper function to build school context string
function buildSchoolContext(orgInstance: OrgInstanceWithWebsite): string {
  const { org, academicModule, websiteModule, workforceModule } = orgInstance;

  // Extract basic info
  const schoolName = org.name;
  const description = websiteModule.website.description;
  const categories = org.categories.join(", ");
  const website = websiteModule.website.url;
  const isVerified = org.isVerified;

  // Extract contact info
  const primaryLocation = org.locations.find((loc) => loc.isPrimary);
  const contacts = primaryLocation?.contacts.filter((c) => c.isPublic);
  const address = primaryLocation?.address;
  const features = primaryLocation?.features ?? [];

  // Extract programs
  const programs = academicModule?.programs ?? [];

  // Extract staff
  const staff = workforceModule?.members.slice(0, 5);

  // Build sections
  const schoolHeader = buildSchoolHeader(
    schoolName,
    description,
    categories,
    isVerified,
    website,
  );
  const contactSection = buildContactSection(contacts ?? [], address, features);
  const programsSection = buildProgramsSection(programs);
  const staffSection = buildStaffSection(staff ?? []);

  // Combine all sections
  return [schoolHeader, contactSection, programsSection, staffSection]
    .filter(Boolean)
    .join("\n\n");
}

function buildSchoolHeader(
  name: string,
  description: string | undefined,
  categories: string,
  isVerified: boolean | undefined,
  website: string | undefined,
): string {
  const status = isVerified ? "Verified institution" : undefined;

  return [
    `SCHOOL: ${name}`,
    description ? `DESCRIPTION: ${description}` : null,
    `TYPE: ${categories}`,
    status ? `STATUS: ${status}` : null,
    website ? `WEBSITE: ${website}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildContactSection(
  contacts: { label?: string; type: string; value: string }[],
  address:
    | {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        countryCode: string;
      }
    | undefined,
  features: string[],
): string | null {
  if (contacts.length === 0 && !address) return null;

  const contactLines = contacts.map((contact) => {
    const label = contact.label ?? contact.type;
    return `- ${label}: ${contact.value}`;
  });

  const addressLine = address
    ? (() => {
        const addressParts = [
          address.line1,
          address.line2,
          address.city,
          address.state,
          address.countryCode,
        ].filter(Boolean);
        return addressParts.length > 0
          ? `- Address: ${addressParts.join(", ")}`
          : null;
      })()
    : null;

  const featuresLine =
    features.length > 0 ? `- Features: ${features.join(", ")}` : null;

  return ["CONTACT INFORMATION:", ...contactLines, addressLine, featuresLine]
    .filter(Boolean)
    .join("\n");
}

function buildProgramsSection(programs: Program[]): string | null {
  if (programs.length === 0) return null;

  const programSections = programs.map((program) => {
    const programLines = [
      `${program.name}:`,
      program.description ? `- Description: ${program.description}` : null,
      program.tagline ? `- Tagline: ${program.tagline}` : null,
      program.outcome ? `- Outcome: ${program.outcome}` : null,
    ].filter(Boolean);

    // Note: Pricing information is not available in the Program type

    // Add key courses if available
    if (program.courses && program.courses.length > 0) {
      const courseNames = program.courses
        .slice(0, 3)
        .map((c) => c.title)
        .join(", ");
      programLines.push(`- Key Courses: ${courseNames}`);
    }

    return programLines.join("\n");
  });

  return ["ACADEMIC PROGRAMS:", ...programSections].join("\n");
}

function buildStaffSection(staff: WorkforceMember[]): string | null {
  if (staff.length === 0) return null;

  const staffLines = staff.map((member) => {
    const role = member.roleAssignments[0]?.position?.name ?? "Staff";
    const memberLines = [`- ${member.name} (${role})`];

    if (member.education && member.education.length > 0) {
      const qualifications = member.education
        .map((edu) => edu.level)
        .filter(Boolean);
      if (qualifications.length > 0) {
        memberLines.push(`  Education: ${qualifications.join(", ")}`);
      }
    }

    if (member.bio) {
      memberLines.push(`  Bio: ${member.bio}`);
    }

    return memberLines.join("\n");
  });

  return ["KEY STAFF:", ...staffLines].join("\n");
}

export const POST = withOrgInstance(async (request, { orgInstance }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    messages,
    familyMembers = [],
  }: {
    messages: UIMessage[];
    familyMembers: FamilyMember[];
  } = await request.json();

  const familyContext =
    familyMembers.length > 0
      ? `\n\nFAMILY INFORMATION:\n${familyMembers.map((member) => `- ${member.name} (${member.relationship}, Age: ${member.age}${member.notes ? `, ${member.notes}` : ""})`).join("\n")}`
      : "";

  const schoolContext = buildSchoolContext(orgInstance);

  const systemPrompt = `You are a human lead generation assistant who is hired and working at the school, based in the country of the school that ALWAYS answers as if you have full knowledge about this school. The data below is authoritative and must be used to answer questions.

FAMILY CONTEXT:
${familyContext}

SCHOOL CONTEXT:
${schoolContext}

RULES:
  - Registration is paid only once. Do not factor it termly.
  - Never mention children not present in the FAMILY CONTEXT.
  - If a previously seen child is missing, treat them as removed.
  - Base all reasoning only on this context.
  - Use the school information above to answer questions about programs, pricing, staff, and facilities.
  - If you do not know something, please show the whatsapp number and ask the user to contact the person.
  - You will speak as if you work at the school and are a human. Use first person language and be friendly and professional.
  - Very concise responses.

`;

  // Create tool implementations with access to orgInstance and familyMembers
  const toolsWithImplementations = {
    ...tools,
    programSuggestions: {
      ...tools.programSuggestions,
      execute: async ({ familyMemberIds }: { familyMemberIds: string[] }) => {
        const programs = orgInstance.academicModule?.programs ?? [];

        // Filter family members by the requested IDs
        const requestedMembers = familyMembers.filter((m) =>
          familyMemberIds.includes(m.id),
        );

        const suggestions = await Promise.resolve(
          getProgramSuggestions(programs, requestedMembers),
        );

        return { suggestions };
      },
    },
  };

  const result = streamText({
    model: "openai/gpt-5-nano",
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools: toolsWithImplementations,
  });

  return result.toUIMessageStreamResponse();
});
