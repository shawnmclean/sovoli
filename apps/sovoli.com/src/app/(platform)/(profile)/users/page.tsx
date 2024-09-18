import { cache } from "react";
import { db } from "@sovoli/db";

export const dynamic = "force-dynamic";

interface GetUserUsersOptions {
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

async function getUserCollections({
  searchParams: { page = 1, pageSize = 30 },
}: GetUserUsersOptions) {
  const users = await db.query.User.findMany({
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return {
    data: users,
    meta: { page, pageSize, total: users.length },
  };
}

interface Props {
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

const getUsers = cache(async (props: Props) => {
  const response = await getUserCollections(props);
  return response;
});

export default async function UserPage({ searchParams }: Props) {
  const response = await getUsers({ searchParams });
  return (
    <div className="min-h-screen dark:bg-black sm:pl-60">
      <h1>Users</h1>

      <ul>
        {response.data.map((user) => (
          <li key={user.id}>
            <a href={`/${user.username}/collections`}>{user.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
