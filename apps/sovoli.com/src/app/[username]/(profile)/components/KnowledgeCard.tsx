import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@sovoli/ui/components/card";
import { Chip } from "@sovoli/ui/components/chip";
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
      <CardHeader className="absolute top-1 z-10 flex-col items-start">
        <Chip className="text-tiny font-bold uppercase text-white/60" size="sm">
          {knowledge.type}
        </Chip>
      </CardHeader>

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
