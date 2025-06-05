import { cache } from "react";

// import { unstable_cache } from "next/cache";

// preload pattern: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#using-react-cache-and-server-only-with-the-preload-pattern
import "server-only";

import type { OrgInstanceWithWebsite } from "./types";
import { GetOrgInstanceByUsernameQuery } from "~/modules/organisations/services/queries/GetOrgInstanceByUsername";
import { bus } from "~/services/core/bus";

export const preload = (username: string) => {
  void getOrgInstanceByUsername(username);
};

const getCachedOrgInstanceByUsername = //unstable_cache(
  async (username: string): Promise<OrgInstanceWithWebsite | null> => {
    const { orgInstance } = await bus.queryProcessor.execute(
      new GetOrgInstanceByUsernameQuery(username),
    );

    if (!orgInstance) return null;
    if (!orgInstance.websiteModule) {
      throw new Error(
        "OrgInstance is missing a website module, which is required.",
      );
    }
    return orgInstance as OrgInstanceWithWebsite;
  };
//   ["org-instance-by-username1"],
// );

export const getOrgInstanceByUsername = cache(getCachedOrgInstanceByUsername);
