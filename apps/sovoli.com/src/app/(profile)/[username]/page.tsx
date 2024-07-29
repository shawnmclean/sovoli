/** @jsxImportSource react */

import { api, HydrateClient } from "~/api/trpc/server";
import { User } from "./_components/User";
import { Suspense } from "react";

export default function UserPage({ params }: { params: { username: string } }) {
  void api.user.byUsername.prefetch({ username: params.username });

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <User username={params.username} />
      </Suspense>
    </HydrateClient>
  );
}
