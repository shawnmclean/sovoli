import { cache } from "react";
import { unstable_cacheTag as cacheTag } from "next/cache";

// preload pattern: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#using-react-cache-and-server-only-with-the-preload-pattern
import "server-only";

import { bus } from "~/services/core/bus";
import { GetUserProfileByUsernameQuery } from "~/services/users/queries/GetUserProfileByUsernameQuery";

export const preload = (username: string) => {
  void getUserProfile(username);
};

export const getUserProfile = cache(async (username: string) => {
  "use cache";
  const { user } = await bus.queryProcessor.execute(
    new GetUserProfileByUsernameQuery(username),
  );

  if (!user) return null;

  cacheTag("user-profile", user.username);

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };
});
