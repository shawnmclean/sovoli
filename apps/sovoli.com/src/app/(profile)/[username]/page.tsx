import { notFound } from "next/navigation";
import { UserScreen } from "@sovoli/ui/screens/user";

import { getQueryClientRsc } from "~/api/query-client";
import { tsr } from "~/api/tsr";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
}

async function getUserProfile({ params }: Props) {
  const client = tsr.initQueryClient(getQueryClientRsc());
  try {
    console.log("getUserProfile");
    return await client.getUserMyBooksProfile.fetchQuery({
      queryKey: ["username"],
      queryData: {
        params: {
          username: params.username,
        },
      },
    });
  } catch (error) {
    console.log(error);
    // Type guard to check if error is an object with a 'status' property
    if (typeof error === "object" && error !== null && "status" in error) {
      const status = (error as { status?: number }).status; // Safe type assertion

      if (status === 404) return null;
    }
  }
}

export default async function UserPage({ params }: Props) {
  const response = await getUserProfile({ params });
  if (!response) return notFound();

  console.log(response.body);
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <UserScreen profile={response.body} />
    </div>
  );
}
