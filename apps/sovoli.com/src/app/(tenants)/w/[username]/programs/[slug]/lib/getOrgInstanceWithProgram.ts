import { cache } from "react";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import "server-only";

const getCachedOrgInstanceWithProgram = async (
  username: string,
  slug: string,
) => {
  const orgInstance = await getOrgInstanceByUsername(username);

  const program = orgInstance?.academicModule?.programs.find(
    (p) => p.slug === slug,
  );

  if (!orgInstance || !program) return null;

  return { orgInstance, program };
};

export const getOrgInstanceWithProgram = cache(getCachedOrgInstanceWithProgram);
