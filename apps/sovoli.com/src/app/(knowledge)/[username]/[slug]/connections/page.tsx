// import { getBookFromISBNdb } from "@sovoli/api/services";
import { auth } from "@sovoli/auth";

// import { and, db, eq, inArray, schema } from "@sovoli/db";

import { getKnowledgeBySlug } from "../page";
import { ConnectionsList } from "./_components/ConnectionsList";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string; slug: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

// function getByUsernameFilter(username: string) {
//   return inArray(
//     schema.Knowledge.userId,
//     db
//       .select({ id: schema.User.id })
//       .from(schema.User)
//       .where(eq(schema.User.username, username)),
//   );
// }

// function getConnectionFilter(username: string, slug: string) {
//   return inArray(
//     schema.KnowledgeConnection.sourceKnowledgeId,
//     db
//       .select({ id: schema.Knowledge.id })
//       .from(schema.Knowledge)
//       .where(
//         and(eq(schema.Knowledge.slug, slug), getByUsernameFilter(username)),
//       ),
//   );
// }

export default async function ConnectionsEditPage({
  params: { username, slug },
}: Props) {
  const session = await auth();
  const knowledgeResponse = await getKnowledgeBySlug({
    username: username,
    authUserId: session?.user?.id,
    slugOrId: slug,
  });

  return (
    <div className="min-h-screen sm:pl-60 dark:bg-black">
      <h1>
        Scan Book By ISBN - {username}/{slug}
      </h1>

      <ConnectionsList knowledge={knowledgeResponse.knowledge} />
    </div>
  );
}
