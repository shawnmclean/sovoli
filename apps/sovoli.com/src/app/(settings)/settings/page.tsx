import Link from "next/link";
import { auth, signIn } from "@sovoli/auth";

import { getQueryClientRsc } from "~/api/query-client";
import { tsrReactQuery } from "~/api/tsr";

export default async function SettingsPage() {
  const client = tsrReactQuery.initQueryClient(getQueryClientRsc());
  await client.prefetchQuery({
    queryKey: ["me"],
  });

  return (
    <div className="min-h-screen dark:bg-black">
      <h1>Settings</h1>

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
      <p>Name from Server: {session.user?.name}</p>

      <ul>
        <li className="flex min-w-0 items-center text-foreground/50 last:font-bold last:text-foreground">
          <Link href="/test">
            <span className="overflow-hidden text-ellipsis">first</span>
          </Link>
        </li>
        <li className="flex min-w-0 items-center text-foreground/50 last:font-bold last:text-foreground">
          <Link href="/asd">
            <span className="overflow-hidden text-ellipsis">second</span>
          </Link>
        </li>
      </ul>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
