import { cache } from "react";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

import { auth } from "~/core/auth";
import { GetUserProfileByUsername } from "~/services/users/getUserProfileByUsername";
import { invalidateCacheAction } from "./actions";
import { InvalidateButton } from "./InvalidateButton";

const getUserProfileByUsername = unstable_cache(
  async (username: string, authUserId?: string) => {
    console.log("getUserProfileByUsername", username, authUserId);
    const getUserProfileByUsername = new GetUserProfileByUsername();
    const user = await getUserProfileByUsername.call({ username });

    return { user, authUserId };
  },
  ["posts"],
  { revalidate: 3600, tags: ["posts"] },
);

const retrieveUser = cache(async (username: string) => {
  const session = await auth();

  return await getUserProfileByUsername(username, session?.user?.id);
});

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserPage(props: Props) {
  const params = await props.params;
  const { user, authUserId } = await retrieveUser(params.username);

  if (!user.user) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 dark:bg-black">
      <h1 className="text-xl font-bold">{user.user.name}</h1>
      <h2>Session: {authUserId}</h2>

      {/* Cache invalidation form */}
      <form action={invalidateCacheAction} className="mt-4">
        <input type="hidden" name="username" value={params.username} />
        <InvalidateButton />
      </form>
    </div>
  );
}
