import { Card, CardBody, CardFooter } from "@sovoli/ui/components/card";
import { TimeAgo } from "@sovoli/ui/components/time-ago";
import { LibraryBigIcon } from "lucide-react";

import type { Knowledge } from "~/services/knowledge/getKnowledges";
import { MediaAssetViewer } from "~/modules/mediaAssets/components/MediaAssetViewer";

export function KnowledgeCard({ knowledge }: { knowledge: Knowledge }) {
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
          <h4 className="text-xl font-medium text-white/90">
            {knowledge.title}
          </h4>
          <p className="line-clamp-2 text-tiny text-white/70">
            {knowledge.description}
          </p>
          <p className="mt-2 text-tiny text-white/70">
            <TimeAgo datetime={knowledge.createdAt} />
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
