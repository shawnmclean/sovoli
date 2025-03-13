import { notFound } from "next/navigation";

import { getUserProfile } from "~/app/[username]/lib/getUserProfile";
import { invalidateCacheAction } from "./actions";
import { InvalidateButton } from "./InvalidateButton";

const retreiveUserProfile = async (username: string) => {
  const user = await getUserProfile(username);
  if (!user) return notFound();
  return user;
};

interface Props {
  params: Promise<{ username: string }>;
}

export default async function UserPage(props: Props) {
  const params = await props.params;
  const user = await retreiveUserProfile(params.username);

  return (
    <div className="min-h-screen p-4 dark:bg-black">
      <h1 className="text-xl font-bold">{user.name}</h1>
      {/* Cache invalidation form */}
      <form action={invalidateCacheAction} className="mt-4">
        <input type="hidden" name="username" value={params.username} />
        <InvalidateButton />
      </form>
    </div>
  );
}
