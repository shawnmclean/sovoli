import { cache } from "react";
import { notFound } from "next/navigation";
import { UserScreen } from "@sovoli/ui/screens/user";

import { api } from "~/api/tsr";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
}

const getUserProfile = cache(async ({ params }: Props) => {
  const response = await api.users.getUserMyBooksProfile({
    params: {
      username: params.username,
    },
    fetchOptions: {
      cache: "no-store",
    },
  });

  return response;
});

export default async function UserPage({ params }: Props) {
  const response = await getUserProfile({ params });
  if (response.status !== 200) return notFound();

  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <UserScreen profile={response.body} />
    </div>
  );
}
