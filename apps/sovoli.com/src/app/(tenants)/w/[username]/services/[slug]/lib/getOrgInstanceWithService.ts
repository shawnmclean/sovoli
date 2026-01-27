import { cache } from "react";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import "server-only";
import type { Service } from "~/modules/services/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

const getCachedOrgInstanceWithService = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstanceWithWebsite;
  service?: Service;
} | null> => {
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) return null;

  const services = orgInstance.serviceModule?.services ?? [];

  const service = services.find((s) => s.slug === slug);

  if (!service) return null;

  return { orgInstance, service };
};

/**
 * @description Get the org instance with the service by slug
 */
export const getOrgInstanceWithService = cache(getCachedOrgInstanceWithService);
