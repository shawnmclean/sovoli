import { cache } from "react";
import { auth } from "@sovoli/auth";
import { KnowledgeType } from "@sovoli/db/schema";

import { GetKnowledges } from "~/services/knowledge/getKnowledges";
import { ShelfList } from "./components/ShelfList";

export const dynamic = "force-dynamic";

interface Props {
  params: { username: string };
  searchParams: { page: number | undefined; pageSize: number | undefined };
}

export function generateMetadata() {
  return {
    title: "Shelves",
  };
}

const retrieveKnowledges = cache(async ({ params, searchParams }: Props) => {
  const session = await auth();

  const getKnowledges = new GetKnowledges();
  return await getKnowledges.call({
    authUserId: session?.user?.id,
    username: params.username,
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    type: KnowledgeType.shelf,
  });
});

export default async function ShelvesPage({ params, searchParams }: Props) {
  const knowledges = await retrieveKnowledges({
    params,
    searchParams,
  });
  return <ShelfList shelves={knowledges.data} />;
}
