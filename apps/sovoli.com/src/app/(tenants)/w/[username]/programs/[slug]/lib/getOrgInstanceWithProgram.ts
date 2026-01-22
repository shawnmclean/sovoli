import { cache } from "react";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import "server-only";
import type { Program, ProgramGroup } from "~/modules/academics/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

const getCachedOrgInstanceWithProgram = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstanceWithWebsite;
  program?: Program;
  group?: ProgramGroup;
} | null> => {
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) return null;

  const program = orgInstance.academicModule?.programs.find(
    (p) => p.slug === slug,
  );

  if (!program) {
    // Check if slug matches a group
    const program = orgInstance.academicModule?.programs.find(
      (p) =>
        p.group?.slug === slug ||
        p.standardProgramVersion?.program.group?.slug === slug,
    );

    const group =
      program?.group ?? program?.standardProgramVersion?.program.group;

    if (!group) return null;

    // Find all programs that belong to this group
    const groupPrograms =
      orgInstance.academicModule?.programs.filter(
        (p) =>
          p.group?.id === group.id ||
          p.standardProgramVersion?.program.group?.id === group.id,
      ) ?? [];

    // Return the group with its programs populated
    return {
      orgInstance,
      group: {
        ...group,
        programs: groupPrograms,
      },
    };
  }

  return { orgInstance, program };
};
/**
 * @description Get the org instance with the program, if the slug matches a group, then we return the group and the programs
 */
export const getOrgInstanceWithProgram = cache(getCachedOrgInstanceWithProgram);
