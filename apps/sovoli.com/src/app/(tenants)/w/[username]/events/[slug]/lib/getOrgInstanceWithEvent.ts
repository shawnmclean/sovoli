import { cache } from "react";
import { getOrgInstanceByUsername } from "../../../lib/getOrgInstanceByUsername";
import "server-only";
import type { Event } from "~/modules/events/types";
import type { OrgInstanceWithWebsite } from "~/modules/organisations/types";

const getCachedOrgInstanceWithEvent = async (
  username: string,
  slug: string,
): Promise<{
  orgInstance: OrgInstanceWithWebsite;
  event?: Event;
} | null> => {
  const orgInstance = await getOrgInstanceByUsername(username);

  if (!orgInstance) return null;

  const event = orgInstance.eventModule?.events.find((e) => e.slug === slug);

  if (!event) return null;

  return { orgInstance, event };
};

/**
 * @description Get the org instance with the event
 */
export const getOrgInstanceWithEvent = cache(getCachedOrgInstanceWithEvent);
