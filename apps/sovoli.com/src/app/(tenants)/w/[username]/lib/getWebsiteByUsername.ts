import { cache } from "react";
import { unstable_cache } from "next/cache";

// preload pattern: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#using-react-cache-and-server-only-with-the-preload-pattern
import "server-only";

import { GetWebsiteByUsernameQuery } from "~/modules/websites/services/queries/GetWebsiteByUsername";
import { bus } from "~/services/core/bus";

export const preload = (username: string) => {
  void getWebsiteByUsername(username);
};

const getCachedWebsiteByUsername = unstable_cache(
  async (username: string) => {
    const { org, website } = await bus.queryProcessor.execute(
      new GetWebsiteByUsernameQuery(username),
    );

    if (!website || !org) return null;

    return {
      org,
      website,
    };
  },
  ["website-by-username"],
);

export const getWebsiteByUsername = cache(getCachedWebsiteByUsername);
