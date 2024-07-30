"use client";

import { trpc } from "~/api/react";
import { UserScreen } from "@sovoli/ui/screens/user";

export function User({ username }: { username: string }) {
  const [user] = trpc.user.byUsername.useSuspenseQuery({ username });

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
