import { cache } from "react";
import { notFound } from "next/navigation";

import { GetUserProfileByUsername } from "~/services/users/getUserProfileByUsername";
import { invalidateCacheAction } from "./actions";
import { InvalidateButton } from "./InvalidateButton";

// Next.js ISR settings
export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

const retrieveUser = cache(async (username: string) => {
  const getUserProfileByUsername = new GetUserProfileByUsername();
  return await getUserProfileByUsername.call({ username });
});

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserPage(props: Props) {
  const params = await props.params;
  const user = await retrieveUser(params.username);

  if (!user.user) {
    notFound();
  }

  return (
    <div className="min-h-screen p-4 dark:bg-black">
      <h1 className="text-xl font-bold">{user.user.name}</h1>

      {/* Cache invalidation form */}
      <form action={invalidateCacheAction} className="mt-4">
        <input type="hidden" name="username" value={params.username} />
        <InvalidateButton />
      </form>
    </div>
  );
}
