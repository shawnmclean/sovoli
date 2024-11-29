import { cache } from "react";
import { auth } from "@sovoli/auth";
import { KnowledgeType } from "@sovoli/db/schema";

import { GetKnowledges } from "~/services/knowledge/getKnowledges";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

const retrieveKnowledges = cache(async ({ params, searchParams }: Props) => {
  const session = await auth();

  const getKnowledges = new GetKnowledges();
  return await getKnowledges.call({
    authUserId: session?.user?.id,
    username: params.username,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    type: KnowledgeType.collection,
  });
});

export default async function CollectionsPage({ params, searchParams }: Props) {
  const knowledges = await retrieveKnowledges({
    params,
    searchParams,
  });
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
