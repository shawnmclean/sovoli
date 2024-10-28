import { cache } from "react";
import { db, eq, schema } from "@sovoli/db";

import "server-only";

export const preload = (username: string) => {
  void getUserProfile(username);
};

export const getUserProfile = cache(async (username: string) => {
  return db.query.User.findFirst({
    where: eq(schema.User.username, username),
  });
});
