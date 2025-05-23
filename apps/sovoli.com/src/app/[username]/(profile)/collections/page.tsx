import { cache } from "react";
import Link from "next/link";
import { KnowledgeType } from "@sovoli/db/schema";
import { Button } from "@sovoli/ui/components/button";
import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { LibraryBigIcon } from "lucide-react";

import type { Knowledge } from "~/services/knowledge/getKnowledges";
import { auth } from "~/core/auth";
import { MediaAssetViewer } from "~/modules/mediaAssets/components/MediaAssetViewer";
import { GetKnowledges } from "~/services/knowledge/getKnowledges";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
  searchParams: Promise<{
    page: string | undefined;
    pageSize: string | undefined;
  }>;
}

export function generateMetadata() {
  return {
    title: "Collections",
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
      type: KnowledgeType.collection,
    });
  },
);

export default async function CollectionsPage(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const page = parseInt(searchParams.page ?? "1");
  const pageSize = parseInt(searchParams.pageSize ?? "10");

  const knowledges = await retrieveKnowledges(params.username, page, pageSize);
  const totalPages = Math.ceil(knowledges.meta.total / pageSize);
  return (
    <div className="min-h-screen dark:bg-black">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {knowledges.data.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <p className="text-center text-2xl font-medium text-white/90">
              No Collections found
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

function KnowledgeCard({ knowledge }: { knowledge: Knowledge }) {
  return (
    <Card
      isFooterBlurred
      className="h-[300px] w-full"
      isPressable
      as="a"
      href={knowledge.url}
    >
      <CardBody className="overflow-hidden p-0">
        {knowledge.MediaAssets[0] ? (
          <MediaAssetViewer
            mediaAsset={knowledge.MediaAssets[0]}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-content2">
            <LibraryBigIcon className="h-20 w-20 text-default-400" />
          </div>
        )}
      </CardBody>

      <CardFooter className="absolute bottom-0 z-10 border-t-1 border-default-600 bg-black/60 backdrop-blur-md dark:border-default-100">
        <div className="flex flex-col">
          <h4 className="line-clamp-1 text-xl font-medium text-white/90">
            {knowledge.title}
          </h4>
          <p className="line-clamp-2 text-tiny text-white/70">
            {knowledge.description}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
