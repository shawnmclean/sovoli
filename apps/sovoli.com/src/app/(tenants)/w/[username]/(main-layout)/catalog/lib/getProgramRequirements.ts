import type { Program, RequirementList } from "~/modules/academics/types";
import { ORGS } from "~/modules/data/organisations";
import type { OrgInstance } from "~/modules/organisations/types";

export interface ProgramRequirementsResult {
  school: OrgInstance | null;
  program: Program | null;
  requirements: RequirementList[];
  matchedItems: CatalogMatch[];
}

export interface CatalogMatch {
  requirementItem: {
    item: {
      id: string;
      name: string;
      description?: string;
      category: string;
    };
    quantity?: number;
  };
  catalogItem: {
    id: string;
    item: {
      id: string;
      name: string;
      description?: string;
      category: string;
    };
    price: {
      GYD?: number;
      JMD?: number;
      USD?: number;
    };
  };
}

export function getProgramRequirements(
  schoolUsername: string,
  programId: string,
): ProgramRequirementsResult {
  // Find the school
  const school = ORGS.find((org) => org.org.username === schoolUsername);

  if (!school?.academicModule?.programs) {
    return {
      school: null,
      program: null,
      requirements: [],
      matchedItems: [],
    };
  }

  // Find the program
  const program = school.academicModule.programs.find(
    (p) => p.id === programId,
  );

  if (!program) {
    return {
      school,
      program: null,
      requirements: [],
      matchedItems: [],
    };
  }

  // Get requirements
  const rawRequirements =
    program.requirements ?? program.standardProgramVersion?.requirements ?? [];

  // Filter out items that don't exist in the items database
  const requirements = rawRequirements
    .map((requirement) => ({
      ...requirement,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/prefer-optional-chain
      items: requirement.items.filter((item) => item.item && item.item.id),
    }))
    .filter((requirement) => requirement.items.length > 0);

  return {
    school,
    program,
    requirements,
    matchedItems: [],
  };
}
