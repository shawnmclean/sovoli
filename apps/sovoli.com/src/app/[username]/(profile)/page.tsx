import { cache } from "react";
import Link from "next/link";
import { Button } from "@sovoli/ui/components/button";

import { auth } from "~/core/auth";
import { GetKnowledges } from "~/services/knowledge/getKnowledges";
import { KnowledgeCard } from "./components/KnowledgeCard";

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
    page: string | undefined;
    pageSize: string | undefined;
  }>;
}
export default async function KnowledgesPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const page = parseInt(searchParams.page ?? "1");
  const pageSize = parseInt(searchParams.pageSize ?? "10");

  const knowledges = await retrieveKnowledges(params.username, page, pageSize);
  const totalPages = Math.ceil(knowledges.meta.total / pageSize);

  return (
    <div className="min-h-screen dark:bg-black">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {knowledges.data.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-center text-2xl font-medium text-white/90">
              No knowledges found
            </p>
          </div>
        )}
        {knowledges.data.map((knowledge) => (
          <KnowledgeCard key={knowledge.id} knowledge={knowledge} />
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <ul className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <li key={p}>
              <Button
                as={Link}
                href={`?page=${p}&pageSize=${pageSize}`}
                variant={p === page ? "solid" : "light"}
                size="sm"
                radius="md"
                isIconOnly
              >
                {p}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
