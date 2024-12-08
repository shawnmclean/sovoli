import { cache } from "react";

import "server-only";

import { GetUserProfileByUsername } from "~/services/users/getUserProfileByUsername";

export const preload = (username: string) => {
  void getUserProfile(username);
};

export const getUserProfile = cache(async (username: string) => {
  const getUserProfileByUsername = new GetUserProfileByUsername();

  const user = await getUserProfileByUsername.call({
    username,
  });

  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image,
  };
});
