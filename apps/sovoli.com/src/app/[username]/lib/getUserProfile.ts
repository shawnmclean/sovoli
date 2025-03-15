import { cache } from "react";
import { unstable_cacheTag as cacheTag, unstable_cache } from "next/cache";

// preload pattern: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#using-react-cache-and-server-only-with-the-preload-pattern
import "server-only";

import { bus } from "~/services/core/bus";
import { GetUserProfileByUsernameQuery } from "~/services/users/queries/GetUserProfileByUsernameQuery";

export const preload = (username: string) => {
  void getUserProfile(username);
};

const getCachedUserProfile = unstable_cache(
  async (username: string) => {
    const { user } = await bus.queryProcessor.execute(
      new GetUserProfileByUsernameQuery(username),
    );

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      image: user.image,
    };
  },
  ["user-profile"],
);

export const getUserProfile = cache(getCachedUserProfile);
