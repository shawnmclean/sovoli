import { cache } from "react";
import { auth } from "@sovoli/auth";
import { KnowledgeType } from "@sovoli/db/schema";

import { GetKnowledges } from "~/services/knowledge/getKnowledges";
import { ShelfList } from "./components/ShelfList";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    page: number | undefined;
    pageSize: number | undefined;
  }>;
}

export function generateMetadata() {
  return {
    title: "Shelves",
  };
}

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
      type: KnowledgeType.shelf,
    });
  },
);

export default async function ShelvesPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const knowledges = await retrieveKnowledges(
    params.username,
    searchParams.page,
    searchParams.pageSize,
  );
  return <ShelfList shelves={knowledges.data} />;
}
