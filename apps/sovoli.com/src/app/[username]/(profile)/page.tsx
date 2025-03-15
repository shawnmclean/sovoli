import { cache } from "react";

import { auth } from "~/core/auth";
import { GetKnowledges } from "~/services/knowledge/getKnowledges";

export const dynamic = "force-dynamic";

const retrieveKnowledges = cache(
  async (
    username: string,
    page: number | undefined,
    pageSize: number | undefined,
  ) => {
    const session = await auth();

    const getKnowledges = new GetKnowledges();
    return await getKnowledges.call({
      authUserId: session?.user?.id,
      username: username,
      page: page,
      pageSize: pageSize,
    });
  },
);
interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    page: number | undefined;
    pageSize: number | undefined;
  }>;
}
export default async function KnowledgesPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const knowledges = await retrieveKnowledges(
    params.username,
    searchParams.page,
    searchParams.pageSize,
  );
  return (
    <div className="min-h-screen dark:bg-black">
      <h1> Collections</h1>
      <div>
        {knowledges.data.map((collection) => (
          <a
            key={collection.id}
            href={`/${params.username}/${collection.slug ?? collection.id}`}
          >
            <h2>{collection.title}</h2>
          </a>
        ))}
      </div>
    </div>
  );
}
