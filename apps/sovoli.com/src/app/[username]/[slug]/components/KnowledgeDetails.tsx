import type { SelectKnowledgeSchema } from "@sovoli/db/schema";
import { MediaAssetHost } from "@sovoli/db/schema";
import { Avatar } from "@sovoli/ui/components/avatar";
import { Badge } from "@sovoli/ui/components/badge";
import { Chip } from "@sovoli/ui/components/chip";
// import { Button } from "../ui/button";
import { Link } from "@sovoli/ui/components/link";
import { TimeAgo } from "@sovoli/ui/components/time-ago";
import { ChevronLeftIcon } from "lucide-react";

import { auth } from "~/core/auth";
import { Connections } from "./Connections";
import { Gallery } from "./Gallery";
import { HeaderActions } from "./HeaderActions";
import { KnowledgeContent } from "./KnowledgeContent";
import { MainReference } from "./MainReference";

interface Props {
  knowledge: SelectKnowledgeSchema;
}

export async function KnowledgeDetails({ knowledge }: Props) {
  const session = await auth();
  const images = knowledge.MediaAssets?.map((mediaAsset) => {
    if (mediaAsset.host === MediaAssetHost.Supabase && mediaAsset.path) {
      return {
        src: `${mediaAsset.bucket}/${mediaAsset.path}`,
        alt: mediaAsset.name ?? `${knowledge.title} image`,
      };
    }
    return null;
  }).filter((image) => image !== null);

  const mainReference = knowledge.SourceConnections?.find(
    (r) => r.type === "main_reference",
  );

  return (
    <div className="flex w-full flex-col">
      {images && images.length > 0 && (
        <div className="my-4">
          <Gallery images={images} />
        </div>
      )}
      <div className="flex justify-center border-b border-divider">
        <div className="flex w-full max-w-7xl items-center justify-between pb-6">
          <div className="flex items-center gap-2">
            {knowledge.type === "shelf" && (
              <Link
                href={`/${knowledge.User?.username}/shelves`}
                title="Back to shelves"
                className="hover:text-primary-dark flex items-center text-primary"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Link>
            )}
            <h1 className="text-2xl font-bold">{knowledge.title}</h1>
          </div>
          <div className="flex gap-4">
            {session?.userId === knowledge.User?.id && (
              <HeaderActions knowledge={knowledge} session={session} />
            )}
          </div>
        </div>
      </div>

      {/* Main Content with 2-Column Layout */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-6 py-6 lg:grid-cols-3">
          {/* Left Column: Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description Section */}
            <section className="w-full">
              <p className="text-gray-400">{knowledge.description}</p>
            </section>

            {/* Content Section */}
            <section className="w-full">
              {mainReference && (
                <div className="my-4">
                  <MainReference knowledgeConnection={mainReference} />
                </div>
              )}
              <KnowledgeContent knowledge={knowledge} />
            </section>
            <Connections knowledge={knowledge} />
          </div>

          {/* Right Column: User Information and Meta */}
          <div className="space-y-4">
            {/* User Information */}
            <section className="flex items-center gap-4">
              <div className="flex flex-col">
                <TimeAgo
                  datetime={knowledge.createdAt}
                  className="text-sm text-default-500"
                />
                <div className="inline-flex items-center gap-3">
                  <Link href={`/${knowledge.User?.username}`}>
                    <Badge
                      color="secondary"
                      content="1"
                      shape="circle"
                      placement="bottom-right"
                      title="Level 1 Researcher"
                    >
                      <Avatar
                        radius="sm"
                        src="https://qxvzrmayigmtjhfucogx.supabase.co/storage/v1/object/public/media/profile/mix.webp?t=2024-10-26T02%3A43%3A35.093Z"
                      />
                    </Badge>
                  </Link>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/${knowledge.User?.username}`}
                      color="foreground"
                    >
                      <span className="text-sm">{knowledge.User?.name}</span>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Chip
                        size="sm"
                        variant="dot"
                        title="2 biology, 8 psychology"
                      >
                        Mindweaver
                      </Chip>
                    </div>
                  </div>
                </div>
                <span className="text-sm">
                  Researching: Ego, Belief Systems
                </span>
              </div>
            </section>

            {/* Additional space for more information */}
            <div className="space-y-4 border-t border-divider pt-4">
              {/* Placeholder for future info */}
              <p className="text-gray-400">Type: {knowledge.type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
