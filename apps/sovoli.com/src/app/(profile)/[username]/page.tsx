// import { api, HydrateClient } from "~/api/trpc";
import { Suspense } from "react";

import { User } from "./_components/User";

export default function UserPage({ params }: { params: { username: string } }) {
  // void api.user.byUsername.prefetch({ username: params.username });

  return (
    // <HydrateClient>
    <Suspense fallback={<div>Loading...</div>}>
      <User username={params.username} />
    </Suspense>
    // </HydrateClient>
  );
}
