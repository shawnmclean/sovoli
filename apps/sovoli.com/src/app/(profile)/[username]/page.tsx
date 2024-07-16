/** @jsxImportSource react */

import { api, HydrateClient } from "~/trpc/server";
import { User } from "./_components/User";
import { Suspense } from "react";

export default function UserPage({ params }: { params: { username: string } }) {
  void api.user.byUsername.prefetch({ username: params.username });

  return (
    <HydrateClient>
      <div className="min-h-screen sm:pl-60 dark:bg-black">
        <Suspense fallback={<div>Loading...</div>}>
          <User username={params.username} />
        </Suspense>
      </div>
    </HydrateClient>
  );
}
