import { Suspense } from "react";
import { auth, signIn } from "@sovoli/auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClientRsc } from "~/api/query-client";
import { tsrReactQuery } from "~/api/tsr";
import { Me } from "./_components/Me";

export default async function SettingsPage() {
  const client = tsrReactQuery.initQueryClient(getQueryClientRsc());
  await client.prefetchQuery({
    queryKey: ["me"],
  });

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Settings</h1>

      <HydrationBoundary state={dehydrate(client)}>
        <Suspense fallback={<div>Loading...</div>}>
          <Me />
        </Suspense>
      </HydrationBoundary>

      <SignIn />
    </div>
  );
}

async function SignIn() {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn();
        }}
      >
        <button type="submit">Sign in</button>
      </form>
    );
  }

  return (
    <div>
      <h1>Server Rendered</h1>
      <p>Name from Server: {session.user.name}</p>

      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
