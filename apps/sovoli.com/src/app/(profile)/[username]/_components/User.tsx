"use client";

import { api } from "~/api/react";
import { UserScreen } from "@sovoli/ui/screens/user";

export function User({ username }: { username: string }) {
  const [user] = api.user.byUsername.useSuspenseQuery({ username });

  if (!user) {
    return null;
  }

  return (
    <>
      <h1>
        {user.username} - {user.id} - {user.name}
      </h1>
      <UserScreen username={user.username} />
    </>
  );
}
